import { NextRequest, NextResponse } from 'next/server';
import { getAdminListingById, requestChangesAdminListing } from '@/lib/mock-listings';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const listing = getAdminListingById(id);

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    return NextResponse.json({ listing });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch listing', message: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (body.action === 'request_changes') {
      const updated = requestChangesAdminListing(
        id,
        body.notes || 'Additional details required',
        body.moderatorName || 'Admin Moderator'
      );
      return NextResponse.json({ success: true, listing: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update listing', message: error.message },
      { status: 500 }
    );
  }
}
