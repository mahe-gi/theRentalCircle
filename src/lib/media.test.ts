import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  ALLOWED_PHOTO_MIME_TYPES,
  ALLOWED_EVIDENCE_MIME_TYPES,
  MAX_PHOTO_SIZE_BYTES,
  MAX_EVIDENCE_SIZE_BYTES,
  PresignRequestSchema,
  generateQuarantineKey,
  sanitizeFileName,
  createR2PresignedPutUrl,
} from './media';

describe('Media Policies & Real R2 Presigned PUT URLs', () => {
  const sampleListingId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

  describe('1. Photo Upload Policy (Strictly Images, Max 10MB, Rejects PDF)', () => {
    it('should allow valid image formats (JPEG, PNG, WebP) under 10MB', () => {
      for (const mime of ALLOWED_PHOTO_MIME_TYPES) {
        const result = PresignRequestSchema.safeParse({
          listingId: sampleListingId,
          uploadType: 'photo',
          fileName: 'living_room.jpg',
          mimeType: mime,
          sizeBytes: 5 * 1024 * 1024,
        });
        assert.equal(result.success, true, `Should accept ${mime}`);
      }
    });

    it('should STRICTLY REJECT PDF files for photo uploads', () => {
      const result = PresignRequestSchema.safeParse({
        listingId: sampleListingId,
        uploadType: 'photo',
        fileName: 'photos.pdf',
        mimeType: 'application/pdf',
        sizeBytes: 1024 * 1024,
      });
      assert.equal(result.success, false, 'Photos must reject PDF');
      if (!result.success) {
        assert.ok(result.error.errors.some(e => e.message.includes('PDF is not permitted')));
      }
    });

    it('should reject photos exceeding 10 MB limit', () => {
      const result = PresignRequestSchema.safeParse({
        listingId: sampleListingId,
        uploadType: 'photo',
        fileName: 'huge_photo.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: MAX_PHOTO_SIZE_BYTES + 1,
      });
      assert.equal(result.success, false);
    });
  });

  describe('2. Evidence Upload Policy (PDF + Images, Max 15MB)', () => {
    it('should accept PDF and images for evidence uploads', () => {
      for (const mime of ALLOWED_EVIDENCE_MIME_TYPES) {
        const result = PresignRequestSchema.safeParse({
          listingId: sampleListingId,
          uploadType: 'evidence',
          fileName: 'electricity_bill.pdf',
          mimeType: mime,
          sizeBytes: 10 * 1024 * 1024,
        });
        assert.equal(result.success, true, `Should accept ${mime} for evidence`);
      }
    });

    it('should reject executable or arbitrary file types (exe, zip, svg)', () => {
      const invalidMimes = ['application/x-msdownload', 'application/zip', 'image/svg+xml'];
      for (const mime of invalidMimes) {
        const result = PresignRequestSchema.safeParse({
          listingId: sampleListingId,
          uploadType: 'evidence',
          fileName: 'malicious.file',
          mimeType: mime,
          sizeBytes: 1024,
        });
        assert.equal(result.success, false);
      }
    });

    it('should reject evidence exceeding 15 MB limit', () => {
      const result = PresignRequestSchema.safeParse({
        listingId: sampleListingId,
        uploadType: 'evidence',
        fileName: 'large_deed.pdf',
        mimeType: 'application/pdf',
        sizeBytes: MAX_EVIDENCE_SIZE_BYTES + 1,
      });
      assert.equal(result.success, false);
    });
  });

  describe('3. Quarantine Scoping & Path Sanitization', () => {
    it('should scope photos under quarantine/photos/ and evidence under quarantine/evidence/', () => {
      const photoKey = generateQuarantineKey(sampleListingId, 'photo', 'bed.jpg');
      assert.ok(photoKey.startsWith(`quarantine/photos/${sampleListingId}/`));

      const evidenceKey = generateQuarantineKey(sampleListingId, 'evidence', 'bill.pdf');
      assert.ok(evidenceKey.startsWith(`quarantine/evidence/${sampleListingId}/`));
    });

    it('should strip path traversal attempts in file names', () => {
      const clean = sanitizeFileName('../../../etc/passwd.jpg');
      assert.equal(clean, 'passwd.jpg');
      assert.ok(!clean.includes('..'));
    });
  });

  describe('4. Real R2 S3 Presigned PUT URL Generation', () => {
    it('should generate an actual presigned PUT URL with 300s expiry and exact key', async () => {
      const response = await createR2PresignedPutUrl({
        listingId: sampleListingId,
        uploadType: 'photo',
        fileName: 'hall.webp',
        mimeType: 'image/webp',
        sizeBytes: 2 * 1024 * 1024,
      });

      assert.ok(response.uploadUrl.startsWith('https://'));
      assert.ok(response.uploadUrl.includes('X-Amz-Signature'));
      assert.ok(response.uploadUrl.includes('X-Amz-Expires=300'));
      assert.equal(response.bucket, 'trc-private');
      assert.equal(response.uploadType, 'photo');
      assert.equal(response.expiresInSeconds, 300);
      assert.equal(response.expectedContentType, 'image/webp');
      assert.equal(response.requiredHeaders['Content-Type'], 'image/webp');
    });
  });
});
