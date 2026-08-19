import { NextRequest, NextResponse } from 'next/server';
import { PresignRequestSchema, createR2PresignedPutUrl } from '@/lib/media';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = PresignRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Invalid upload request',
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const response = await createR2PresignedPutUrl(validated.data);
    return NextResponse.json(response, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to generate presigned upload URL', message: err.message },
      { status: 500 }
    );
  }
}
