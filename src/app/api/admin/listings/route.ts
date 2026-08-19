import { NextRequest, NextResponse } from 'next/server';
import { getAllAdminListings } from '@/lib/mock-listings';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const cluster = searchParams.get('cluster');

    let listings = getAllAdminListings();

    if (status && status !== 'all') {
      listings = listings.filter(l => l.status === status);
    }

    if (cluster && cluster !== 'all') {
      listings = listings.filter(l => l.cluster === cluster);
    }

    return NextResponse.json({
      listings,
      counts: {
        all: getAllAdminListings().length,
        pending_review: getAllAdminListings().filter(l => l.status === 'pending_review').length,
        published: getAllAdminListings().filter(l => l.status === 'published').length,
        rejected: getAllAdminListings().filter(l => l.status === 'rejected').length,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch admin listings', message: error.message },
      { status: 500 }
    );
  }
}
