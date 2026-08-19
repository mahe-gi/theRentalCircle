import { webcrypto } from 'node:crypto';

export interface EncryptedPayload {
  v: number;
  alg: 'AES-256-GCM';
  iv: string;   // Base64
  tag: string;  // Base64
  ct: string;   // Base64
}

/**
 * Gets standard WebCrypto instance across Node.js, Cloudflare Workers, and Edge runtimes.
 */
function getCrypto(): Crypto {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto;
  }
  if (webcrypto?.subtle) {
    return webcrypto as unknown as Crypto;
  }
  throw new Error('WebCrypto API is not available in the current runtime');
}

/**
 * Validates that a string is a valid hexadecimal key of expected byte length.
 */
function validateHexKey(keyHex: string, expectedBytes?: number, keyName = 'Key'): Uint8Array {
  if (!keyHex || typeof keyHex !== 'string') {
    throw new Error(`${keyName} must be a non-empty hexadecimal string`);
  }
  const cleanHex = keyHex.trim();
  if (!/^[0-9a-fA-F]+$/.test(cleanHex)) {
    throw new Error(`${keyName} must contain only valid hexadecimal characters`);
  }
  if (cleanHex.length % 2 !== 0) {
    throw new Error(`${keyName} hexadecimal string must have an even number of characters`);
  }
  const byteLength = cleanHex.length / 2;
  if (expectedBytes !== undefined && byteLength !== expectedBytes) {
    throw new Error(`${keyName} must be exactly ${expectedBytes} bytes (${expectedBytes * 2} hex characters), got ${byteLength} bytes`);
  }
  const buffer = new ArrayBuffer(byteLength);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < byteLength; i++) {
    view[i] = parseInt(cleanHex.substring(i * 2, i * 2 + 2), 16);
  }
  return view;
}

export class PiiProtector {
  /**
   * Normalizes phone numbers to standard E.164-like canonical format (+91XXXXXXXXXX for Indian numbers).
   * Ensures deterministic matching regardless of user input spacing or punctuation.
   */
  public static canonicalizePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') {
      throw new Error('Phone number must be a non-empty string');
    }
    // Remove whitespace, dashes, parentheses, dots
    let cleaned = phone.trim().replace(/[\s\-\(\)\.]/g, '');

    // Handle Indian number formats
    if (cleaned.startsWith('+91')) {
      cleaned = '+91' + cleaned.slice(3).replace(/^0+/, '');
    } else if (cleaned.startsWith('0091')) {
      cleaned = '+91' + cleaned.slice(4).replace(/^0+/, '');
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = '+91' + cleaned.slice(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = '+91' + cleaned.slice(1);
    } else if (/^[6-9]\d{9}$/.test(cleaned)) {
      // 10-digit Indian mobile number
      cleaned = '+91' + cleaned;
    } else if (!cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }

    return cleaned;
  }

  /**
   * Deterministic versioned keyed HMAC-SHA256 equality index for phone duplicate detection.
   * Strictly NO per-record salt to enable O(1) duplicate lookup and risk review.
   *
   * @param phone Raw or canonical phone number.
   * @param hmacKeyHex Server-side secret HMAC key in hex (at least 32 bytes / 64 hex characters).
   * @returns 64-character lowercase hex digest of the HMAC-SHA256 signature.
   */
  public static async generatePhoneIndex(phone: string, hmacKeyHex: string): Promise<string> {
    const keyBytes = validateHexKey(hmacKeyHex, undefined, 'HMAC key');
    if (keyBytes.length < 16) {
      throw new Error('HMAC key must be at least 16 bytes for security');
    }

    const canonicalPhone = this.canonicalizePhone(phone);
    const cryptoInstance = getCrypto();
    const encoder = new TextEncoder();

    const cryptoKey = await cryptoInstance.subtle.importKey(
      'raw',
      keyBytes as unknown as BufferSource,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await cryptoInstance.subtle.sign(
      'HMAC',
      cryptoKey,
      encoder.encode(canonicalPhone)
    );

    return Buffer.from(signature).toString('hex');
  }

  /**
   * Application-level AES-256-GCM encryption for sensitive fields (exact door numbers, plain phone).
   * Generates a fresh cryptographically random 12-byte IV for every encryption call.
   *
   * @param plaintext Sensitive data string to encrypt.
   * @param encKeyHex 256-bit encryption key in hex (64 hex characters).
   * @returns JSON string representing the versioned EncryptedPayload.
   */
  public static async encrypt(plaintext: string, encKeyHex: string): Promise<string> {
    if (typeof plaintext !== 'string') {
      throw new Error('Plaintext must be a string');
    }

    const keyBytes = validateHexKey(encKeyHex, 32, 'AES-256 encryption key');
    const cryptoInstance = getCrypto();

    // 12-byte (96-bit) standard GCM nonce/IV
    const iv = cryptoInstance.getRandomValues(new Uint8Array(12));

    const cryptoKey = await cryptoInstance.subtle.importKey(
      'raw',
      keyBytes as unknown as BufferSource,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );

    const encodedPlaintext = new TextEncoder().encode(plaintext);

    const ciphertextWithTag = await cryptoInstance.subtle.encrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      cryptoKey,
      encodedPlaintext
    );

    const totalBytes = new Uint8Array(ciphertextWithTag);
    // WebCrypto appends 16-byte authentication tag at the end of ciphertext
    const tag = totalBytes.slice(totalBytes.length - 16);
    const ct = totalBytes.slice(0, totalBytes.length - 16);

    const payload: EncryptedPayload = {
      v: 1,
      alg: 'AES-256-GCM',
      iv: Buffer.from(iv).toString('base64'),
      tag: Buffer.from(tag).toString('base64'),
      ct: Buffer.from(ct).toString('base64'),
    };

    return JSON.stringify(payload);
  }

  /**
   * Application-level AES-256-GCM decryption.
   * Validates version, algorithm, ciphertext integrity, and authentication tag.
   *
   * @param payloadJson JSON string or EncryptedPayload object.
   * @param encKeyHex 256-bit encryption key in hex (64 hex characters).
   * @returns Decrypted plaintext string.
   * @throws Error if payload is malformed, version/alg unsupported, key invalid, or tag mismatch (tampering).
   */
  public static async decrypt(payloadJson: string | EncryptedPayload, encKeyHex: string): Promise<string> {
    const keyBytes = validateHexKey(encKeyHex, 32, 'AES-256 decryption key');
    const cryptoInstance = getCrypto();

    let payload: EncryptedPayload;
    if (typeof payloadJson === 'string') {
      try {
        payload = JSON.parse(payloadJson);
      } catch {
        throw new Error('Invalid encryption payload: JSON parsing failed');
      }
    } else if (typeof payloadJson === 'object' && payloadJson !== null) {
      payload = payloadJson;
    } else {
      throw new Error('Encryption payload must be a JSON string or EncryptedPayload object');
    }

    if (payload.v !== 1 || payload.alg !== 'AES-256-GCM') {
      throw new Error(`Unsupported encryption payload version (${payload.v}) or algorithm (${payload.alg})`);
    }

    if (!payload.iv || !payload.tag || payload.ct === undefined) {
      throw new Error('Malformed encryption payload: missing iv, tag, or ct');
    }

    const ivBuf = Buffer.from(payload.iv, 'base64');
    if (ivBuf.length !== 12) {
      throw new Error(`Invalid IV length: expected 12 bytes, got ${ivBuf.length}`);
    }
    const iv = new Uint8Array(new ArrayBuffer(12));
    iv.set(ivBuf);

    const tagBuf = Buffer.from(payload.tag, 'base64');
    if (tagBuf.length !== 16) {
      throw new Error(`Invalid authentication tag length: expected 16 bytes, got ${tagBuf.length}`);
    }

    const ctBuf = Buffer.from(payload.ct, 'base64');

    // Combine ciphertext and tag for WebCrypto AES-GCM decryption
    const combinedBuffer = new ArrayBuffer(ctBuf.length + tagBuf.length);
    const combined = new Uint8Array(combinedBuffer);
    combined.set(ctBuf, 0);
    combined.set(tagBuf, ctBuf.length);

    const cryptoKey = await cryptoInstance.subtle.importKey(
      'raw',
      keyBytes as unknown as BufferSource,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    try {
      const decrypted = await cryptoInstance.subtle.decrypt(
        { name: 'AES-GCM', iv, tagLength: 128 },
        cryptoKey,
        combined
      );

      return new TextDecoder().decode(decrypted);
    } catch (err: any) {
      throw new Error(`Decryption failed: integrity check failed or key is incorrect (${err?.message || 'OperationError'})`);
    }
  }

  /**
   * Generates a cryptographically secure random 256-bit (32-byte) hex key.
   */
  public static generateKey(): string {
    const cryptoInstance = getCrypto();
    const bytes = cryptoInstance.getRandomValues(new Uint8Array(32));
    return Buffer.from(bytes).toString('hex');
  }

  /**
   * Helper to mask phone numbers for non-privileged UI displays.
   * e.g., "+919876543210" -> "+91 ••••• ••210"
   */
  public static maskPhone(phone: string): string {
    try {
      const canonical = this.canonicalizePhone(phone);
      if (canonical.length >= 13) {
        const prefix = canonical.slice(0, 3); // +91
        const last3 = canonical.slice(-3);
        return `${prefix} ••••• ••${last3}`;
      }
      return '••••••••••';
    } catch {
      return '••••••••••';
    }
  }

  /**
   * Helper to safely test if a string looks like an EncryptedPayload JSON.
   */
  public static isEncryptedPayload(value: string): boolean {
    if (!value || typeof value !== 'string' || !value.startsWith('{')) {
      return false;
    }
    try {
      const parsed = JSON.parse(value);
      return parsed.v === 1 && parsed.alg === 'AES-256-GCM' && typeof parsed.iv === 'string' && typeof parsed.tag === 'string' && typeof parsed.ct === 'string';
    } catch {
      return false;
    }
  }
}