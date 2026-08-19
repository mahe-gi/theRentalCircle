import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/data-store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getDataStore();

    const result = store.acceptRequest(id);
    if (!result) {
      return NextResponse.json(
        { error: 'Rental request not found' },
        { status: 404 }
      );
    }

    const { request, unlock } = result;
    const listing = store.getListingById(request.listingId);

    return NextResponse.json(
      {
        success: true,
        message: 'Rental request accepted and contact details unlocked',
        request,
        unlock,
        unlockedContact: {
          renterName: request.renterName,
          renterPhone: request.renterPhone,
          renterEmail: request.renterEmail,
          ownerName: listing?.ownerName,
          ownerPhone: listing?.ownerPhone,
          ownerEmail: listing?.ownerEmail,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to accept rental request', message: err.message },
      { status: 500 }
    );
  }
}
