import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/data-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getDataStore();

    const updated = store.reconfirmListingAvailability(id);

    if (!updated) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Listing availability reconfirmed successfully',
        listing: updated,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to reconfirm listing availability', message: err.message },
      { status: 500 }
    );
  }
}
