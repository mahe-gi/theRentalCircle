import { NextRequest, NextResponse } from 'next/server';
import { approveAdminListing, getAdminListingById } from '@/lib/mock-listings';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      // Empty body allowed
    }

    const moderatorName = body.moderatorName || 'Admin Moderator';
    const notes = body.notes;

    const listing = getAdminListingById(id);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found', id },
        { status: 404 }
      );
    }

    const updated = approveAdminListing(id, moderatorName, notes);

    return NextResponse.json(
      {
        success: true,
        message: 'Listing successfully approved & published',
        listing: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to approve listing', message: error.message },
      { status: 500 }
    );
  }
}
