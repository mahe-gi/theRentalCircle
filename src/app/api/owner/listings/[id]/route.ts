import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/data-store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const store = getDataStore();

    const listing = store.getListingById(id) || store.getListingBySlug(id);

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    const requests = store.getListingRequests(listing.id);

    const enrichedListing = {
      ...listing,
      requests,
      requestsCount: requests.length,
      pendingRequestsCount: requests.filter(r => r.status === 'submitted' || r.status === 'viewed').length,
      acceptedRequestsCount: requests.filter(r => r.status === 'accepted').length,
    };

    return NextResponse.json(
      {
        success: true,
        listing: enrichedListing,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch listing', message: err.message },
      { status: 500 }
    );
  }
}
