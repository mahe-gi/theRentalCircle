import { NextRequest, NextResponse } from 'next/server';
import { rejectAdminListing, getAdminListingById } from '@/lib/mock-listings';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const reason = body.reason || 'Verification requirements not met';
    const notes = body.notes;
    const moderatorName = body.moderatorName || 'Admin Moderator';

    const listing = getAdminListingById(id);
    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found', id },
        { status: 404 }
      );
    }

    const updated = rejectAdminListing(id, reason, notes, moderatorName);

    return NextResponse.json(
      {
        success: true,
        message: 'Listing successfully rejected',
        listing: updated,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to reject listing', message: error.message },
      { status: 500 }
    );
  }
}
