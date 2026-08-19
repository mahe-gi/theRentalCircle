import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PiiProtector, type EncryptedPayload } from './crypto.ts';

describe('PiiProtector - Cryptographic Security Controls', () => {
  const testKey256 = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const alternateKey256 = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
  const testHmacKey = 'a1b2c3d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8f90';
  const alternateHmacKey = '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';

  describe('1. AES-256-GCM Encryption / Decryption Roundtrip', () => {
    it('should encrypt and decrypt standard ASCII text correctly', async () => {
      const plaintext = 'Flat 402, Oakwood Apartments, Hyderabad - 500032';
      const encryptedJson = await PiiProtector.encrypt(plaintext, testKey256);

      assert.ok(typeof encryptedJson === 'string');
      assert.ok(PiiProtector.isEncryptedPayload(encryptedJson));

      const decrypted = await PiiProtector.decrypt(encryptedJson, testKey256);
      assert.strictEqual(decrypted, plaintext);
    });

    it('should encrypt and decrypt empty string', async () => {
      const plaintext = '';
      const encryptedJson = await PiiProtector.encrypt(plaintext, testKey256);
      const decrypted = await PiiProtector.decrypt(encryptedJson, testKey256);
      assert.strictEqual(decrypted, plaintext);
    });

    it('should encrypt and decrypt Unicode and multi-byte characters (Telugu, Hindi, Emojis)', async () => {
      const plaintext = 'ఫ్లాట్ నెం. 301, శాంతి నిలయం 🏠 🔑 Hyderabad 500081';
      const encryptedJson = await PiiProtector.encrypt(plaintext, testKey256);
      const decrypted = await PiiProtector.decrypt(encryptedJson, testKey256);
      assert.strictEqual(decrypted, plaintext);
    });

    it('should encrypt and decrypt structured JSON data', async () => {
      const addressObj = {
        doorNumber: 'Plot 42, Villa A',
        society: 'My Home Bhooja',
        landmark: 'Near Biodiversity Park',
        pincode: '500081'
      };
      const jsonStr = JSON.stringify(addressObj);
      const encrypted = await PiiProtector.encrypt(jsonStr, testKey256);
      const decrypted = await PiiProtector.decrypt(encrypted, testKey256);
      assert.deepStrictEqual(JSON.parse(decrypted), addressObj);
    });

    it('should produce distinct ciphertexts and IVs for the same plaintext (nonce uniqueness)', async () => {
      const plaintext = 'Sensitive Owner Phone: +919876543210';
      const enc1 = await PiiProtector.encrypt(plaintext, testKey256);
      const enc2 = await PiiProtector.encrypt(plaintext, testKey256);

      assert.notStrictEqual(enc1, enc2);

      const payload1: EncryptedPayload = JSON.parse(enc1);
      const payload2: EncryptedPayload = JSON.parse(enc2);

      assert.notStrictEqual(payload1.iv, payload2.iv);
      assert.notStrictEqual(payload1.ct, payload2.ct);

      // Both must decrypt to the exact same original plaintext
      const dec1 = await PiiProtector.decrypt(enc1, testKey256);
      const dec2 = await PiiProtector.decrypt(enc2, testKey256);
      assert.strictEqual(dec1, plaintext);
      assert.strictEqual(dec2, plaintext);
    });

    it('should accept EncryptedPayload object directly in decrypt', async () => {
      const plaintext = 'Confidential Address';
      const encryptedJson = await PiiProtector.encrypt(plaintext, testKey256);
      const payload: EncryptedPayload = JSON.parse(encryptedJson);
      const decrypted = await PiiProtector.decrypt(payload, testKey256);
      assert.strictEqual(decrypted, plaintext);
    });
  });

  describe('2. Deterministic HMAC-SHA256 Phone Index Generation', () => {
    it('should produce the exact same deterministic hash for the same phone and key (strictly NO per-record salt)', async () => {
      const phone = '+919876543210';
      const hash1 = await PiiProtector.generatePhoneIndex(phone, testHmacKey);
      const hash2 = await PiiProtector.generatePhoneIndex(phone, testHmacKey);
      const hash3 = await PiiProtector.generatePhoneIndex(phone, testHmacKey);

      assert.strictEqual(hash1, hash2);
      assert.strictEqual(hash2, hash3);
      assert.strictEqual(hash1.length, 64); // 256-bit hex digest
      assert.match(hash1, /^[0-9a-f]{64}$/);
    });

    it('should produce different hashes for different phone numbers', async () => {
      const hash1 = await PiiProtector.generatePhoneIndex('+919876543210', testHmacKey);
      const hash2 = await PiiProtector.generatePhoneIndex('+919876543211', testHmacKey);
      const hash3 = await PiiProtector.generatePhoneIndex('+919123456789', testHmacKey);

      assert.notStrictEqual(hash1, hash2);
      assert.notStrictEqual(hash2, hash3);
      assert.notStrictEqual(hash1, hash3);
    });

    it('should produce different hashes for different HMAC keys (key separation)', async () => {
      const phone = '+919876543210';
      const hashWithKey1 = await PiiProtector.generatePhoneIndex(phone, testHmacKey);
      const hashWithKey2 = await PiiProtector.generatePhoneIndex(phone, alternateHmacKey);

      assert.notStrictEqual(hashWithKey1, hashWithKey2);
    });

    it('should normalize varied input formats to the exact same deterministic index', async () => {
      const variations = [
        '+91 98765 43210',
        '+919876543210',
        '+91-98765-43210',
        '9876543210',
        '09876543210',
        '+91 (98765) 43210',
      ];

      const expectedHash = await PiiProtector.generatePhoneIndex('+919876543210', testHmacKey);

      for (const variant of variations) {
        const variantHash = await PiiProtector.generatePhoneIndex(variant, testHmacKey);
        assert.strictEqual(variantHash, expectedHash, `Failed for variant format: ${variant}`);
      }
    });
  });

  describe('3. Tamper-Proofing & Integrity Validation', () => {
    it('should reject decryption when ciphertext (ct) is tampered with', async () => {
      const encryptedJson = await PiiProtector.encrypt('Secret Door 102', testKey256);
      const payload: EncryptedPayload = JSON.parse(encryptedJson);

      // Tamper with ciphertext by altering characters
      const originalCtBuffer = Buffer.from(payload.ct, 'base64');
      originalCtBuffer[0] ^= 0xff; // Flip bits
      payload.ct = originalCtBuffer.toString('base64');

      await assert.rejects(
        async () => {
          await PiiProtector.decrypt(payload, testKey256);
        },
        /Decryption failed|integrity check failed/i
      );
    });

    it('should reject decryption when authentication tag is tampered with', async () => {
      const encryptedJson = await PiiProtector.encrypt('Secret Door 102', testKey256);
      const payload: EncryptedPayload = JSON.parse(encryptedJson);

      // Tamper with authentication tag
      const originalTagBuffer = Buffer.from(payload.tag, 'base64');
      originalTagBuffer[originalTagBuffer.length - 1] ^= 0x01; // Flip 1 bit
      payload.tag = originalTagBuffer.toString('base64');

      await assert.rejects(
        async () => {
          await PiiProtector.decrypt(payload, testKey256);
        },
        /Decryption failed|integrity check failed/i
      );
    });

    it('should reject decryption when IV is tampered with', async () => {
      const encryptedJson = await PiiProtector.encrypt('Secret Door 102', testKey256);
      const payload: EncryptedPayload = JSON.parse(encryptedJson);

      const originalIvBuffer = Buffer.from(payload.iv, 'base64');
      originalIvBuffer[0] ^= 0x55;
      payload.iv = originalIvBuffer.toString('base64');

      await assert.rejects(
        async () => {
          await PiiProtector.decrypt(payload, testKey256);
        },
        /Decryption failed|integrity check failed/i
      );
    });

    it('should reject decryption when an incorrect key is supplied', async () => {
      const encryptedJson = await PiiProtector.encrypt('Secret Door 102', testKey256);

      await assert.rejects(
        async () => {
          await PiiProtector.decrypt(encryptedJson, alternateKey256);
        },
        /Decryption failed|integrity check failed/i
      );
    });

    it('should reject decryption of invalid JSON or corrupted structure', async () => {
      await assert.rejects(
        async () => {
          await PiiProtector.decrypt('{ invalid json }', testKey256);
        },
        /JSON parsing failed/i
      );

      await assert.rejects(
        async () => {
          await PiiProtector.decrypt(JSON.stringify({ v: 2, alg: 'AES-256-GCM', iv: 'a', tag: 'b', ct: 'c' }), testKey256);
        },
        /Unsupported encryption payload version/i
      );

      await assert.rejects(
        async () => {
          await PiiProtector.decrypt(JSON.stringify({ v: 1, alg: 'AES-128-CBC', iv: 'a', tag: 'b', ct: 'c' }), testKey256);
        },
        /Unsupported encryption payload version/i
      );
    });

    it('should reject keys with invalid lengths or non-hex characters', async () => {
      // 16-byte key instead of 32 bytes (AES-128 length passed to AES-256)
      const shortKey = '0123456789abcdef0123456789abcdef';
      await assert.rejects(
        async () => {
          await PiiProtector.encrypt('test', shortKey);
        },
        /must be exactly 32 bytes/i
      );

      // Non-hex string
      const nonHexKey = 'zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz';
      await assert.rejects(
        async () => {
          await PiiProtector.encrypt('test', nonHexKey);
        },
        /must contain only valid hexadecimal/i
      );
    });
  });

  describe('4. Security Utilities & Helpers', () => {
    it('should generate valid 256-bit hex keys via generateKey()', () => {
      const key1 = PiiProtector.generateKey();
      const key2 = PiiProtector.generateKey();

      assert.strictEqual(key1.length, 64);
      assert.strictEqual(key2.length, 64);
      assert.match(key1, /^[0-9a-f]{64}$/);
      assert.notStrictEqual(key1, key2);
    });

    it('should mask phone numbers safely for display', () => {
      const masked = PiiProtector.maskPhone('+919876543210');
      assert.strictEqual(masked, '+91 ••••• ••210');
      assert.ok(!masked.includes('9876543'));
    });

    it('should validate encrypted payload format correctly with isEncryptedPayload', async () => {
      const validEncrypted = await PiiProtector.encrypt('Hello World', testKey256);
      assert.strictEqual(PiiProtector.isEncryptedPayload(validEncrypted), true);
      assert.strictEqual(PiiProtector.isEncryptedPayload('plain text string'), false);
      assert.strictEqual(PiiProtector.isEncryptedPayload('{"unrelated": true}'), false);
    });
  });
});
