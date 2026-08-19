import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDataStore } from '@/lib/data-store';

const DeclineBodySchema = z.object({
  reason: z.string().max(500).optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let reason: string | undefined;

    try {
      const body = await req.json();
      const parsed = DeclineBodySchema.safeParse(body);
      if (parsed.success) {
        reason = parsed.data.reason;
      }
    } catch {
      // Body is optional
    }

    const store = getDataStore();
    const updated = store.declineRequest(id, reason);

    if (!updated) {
      return NextResponse.json(
        { error: 'Rental request not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Rental request declined',
        request: updated,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to decline rental request', message: err.message },
      { status: 500 }
    );
  }
}
