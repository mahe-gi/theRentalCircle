import { z } from 'zod';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// Policy 1: Listing Photos (Strictly Images, Max 10MB, Rejects PDF)
export const ALLOWED_PHOTO_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// Policy 2: Property Evidence (Images + PDF, Max 15MB)
export const ALLOWED_EVIDENCE_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export const MAX_EVIDENCE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export const UploadTypeSchema = z.enum(['photo', 'evidence']);
export type UploadType = z.infer<typeof UploadTypeSchema>;

export const PresignRequestSchema = z.object({
  listingId: z.string().uuid(),
  uploadType: UploadTypeSchema,
  fileName: z.string().min(1).max(255),
  mimeType: z.string(),
  sizeBytes: z.number().int().positive(),
}).superRefine((data, ctx) => {
  if (data.uploadType === 'photo') {
    if (!ALLOWED_PHOTO_MIME_TYPES.includes(data.mimeType as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Photos must be JPEG, PNG, or WebP format. PDF is not permitted for listing photos.',
        path: ['mimeType'],
      });
    }
    if (data.sizeBytes > MAX_PHOTO_SIZE_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Photo file size exceeds maximum limit of 10 MB.',
        path: ['sizeBytes'],
      });
    }
  } else if (data.uploadType === 'evidence') {
    if (!ALLOWED_EVIDENCE_MIME_TYPES.includes(data.mimeType as any)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Evidence documents must be PDF, JPEG, PNG, or WebP format.',
        path: ['mimeType'],
      });
    }
    if (data.sizeBytes > MAX_EVIDENCE_SIZE_BYTES) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Evidence file size exceeds maximum limit of 15 MB.',
        path: ['sizeBytes'],
      });
    }
  }
});

export type PresignRequest = z.infer<typeof PresignRequestSchema>;

export interface PresignResponse {
  uploadUrl: string;
  key: string;
  bucket: 'trc-private';
  uploadType: UploadType;
  expiresInSeconds: number;
  expiresAt: string;
  maxSizeBytes: number;
  expectedContentType: string;
  requiredHeaders: Record<string, string>;
}

export function sanitizeFileName(fileName: string): string {
  const baseName = fileName.split(/[\/]/).pop() || 'upload';
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .slice(0, 100);
}

export function generateQuarantineKey(listingId: string, uploadType: UploadType, fileName: string): string {
  const sanitized = sanitizeFileName(fileName);
  const uniqueId = crypto.randomUUID();
  const folder = uploadType === 'photo' ? 'quarantine/photos' : 'quarantine/evidence';
  return `${folder}/${listingId}/${uniqueId}-${sanitized}`;
}

export function getR2S3Client(config?: {
  accountId?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
}): S3Client {
  const accountId = config?.accountId || process.env.CLOUDFLARE_ACCOUNT_ID || 'mock-account-id';
  const accessKeyId = config?.accessKeyId || process.env.R2_ACCESS_KEY_ID || 'mock-access-key';
  const secretAccessKey = config?.secretAccessKey || process.env.R2_SECRET_ACCESS_KEY || 'mock-secret-key';

  return new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

export async function createR2PresignedPutUrl(
  params: {
    listingId: string;
    uploadType: UploadType;
    fileName: string;
    mimeType: string;
    sizeBytes: number;
  },
  s3Client?: S3Client
): Promise<PresignResponse> {
  const validated = PresignRequestSchema.parse(params);
  const key = generateQuarantineKey(validated.listingId, validated.uploadType, validated.fileName);
  const client = s3Client || getR2S3Client();

  const command = new PutObjectCommand({
    Bucket: 'trc-private',
    Key: key,
    ContentType: validated.mimeType,
    ContentLength: validated.sizeBytes,
  });

  const expiresInSeconds = 300; // 5 minutes
  const uploadUrl = await getSignedUrl(client, command, { expiresIn: expiresInSeconds });
  const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

  return {
    uploadUrl,
    key,
    bucket: 'trc-private',
    uploadType: validated.uploadType,
    expiresInSeconds,
    expiresAt,
    maxSizeBytes: validated.uploadType === 'photo' ? MAX_PHOTO_SIZE_BYTES : MAX_EVIDENCE_SIZE_BYTES,
    expectedContentType: validated.mimeType,
    requiredHeaders: {
      'Content-Type': validated.mimeType,
      'Content-Length': validated.sizeBytes.toString(),
    },
  };
}
