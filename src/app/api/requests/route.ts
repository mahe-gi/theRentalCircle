import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getDataStore } from '@/lib/data-store';
import { createRentalRequest } from '@/db/queries';
import { PiiProtector } from '@/lib/crypto';

const CreateRequestSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
  intendedMoveInDate: z.string().min(1, 'Intended move-in date is required'),
  rentalDurationMonths: z.coerce.number().int().min(1).max(60).default(11),
  occupantsCount: z.coerce.number().int().min(1).max(20).default(1),
  householdArrangement: z.enum(['individual', 'family', 'working_professionals', 'students']),
  employmentCategory: z.enum(['salaried', 'self_employed', 'student', 'other']),
  phone: z.string().min(10, 'Valid phone number is required'),
  optionalIntroduction: z.string().max(1000).optional(),
  renterName: z.string().optional().default('Prospective Renter'),
  renterEmail: z.string().email().optional().default('renter@example.com'),
  renterId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const store = getDataStore();
    const { searchParams } = new URL(req.url);
    const renterId = searchParams.get('renterId');
    const listingId = searchParams.get('listingId') || undefined;

    let requests;
    if (listingId) {
      requests = store.getListingRequests(listingId);
    } else if (renterId && renterId !== 'all') {
      requests = store.getRenterRequests(renterId);
    } else {
      requests = store.getRequests();
    }

    // Enrich with listing details and owner contact details if accepted
    const enriched = requests.map(r => {
      const listing = store.getListingById(r.listingId) || store.getListingBySlug(r.listingId);
      const isAccepted = r.status === 'accepted' || store.isContactUnlocked(r.id);

      return {
        ...r,
        listing: listing
          ? {
              id: listing.id,
              slug: listing.slug,
              title: listing.title,
              cluster: listing.cluster,
              colonyOrSociety: listing.colonyOrSociety,
              landmark: listing.landmark,
              propertyType: listing.propertyType,
              monthlyRent: listing.monthlyRent,
              securityDeposit: listing.securityDeposit,
              maintenanceCharges: listing.maintenanceCharges,
              isMaintenanceIncluded: listing.isMaintenanceIncluded,
              carpetAreaSqFt: listing.carpetAreaSqFt,
              furnishingStatus: listing.furnishingStatus,
              availableFrom: listing.availableFrom,
              coverImage: listing.photos.find(p => p.isCover)?.url || listing.photos[0]?.url || '',
            }
          : undefined,
        ownerContact: isAccepted && listing
          ? {
              name: listing.ownerName,
              phone: listing.ownerPhone,
              email: listing.ownerEmail,
            }
          : undefined,
      };
    });

    return NextResponse.json({ success: true, requests: enriched }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to fetch rental requests', message: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateRequestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      listingId,
      intendedMoveInDate,
      rentalDurationMonths,
      occupantsCount,
      householdArrangement,
      employmentCategory,
      phone,
      optionalIntroduction,
      renterName,
      renterEmail,
      renterId,
    } = validated.data;

    // Canonicalize phone number
    const canonicalPhone = PiiProtector.canonicalizePhone(phone);

    const store = getDataStore();
    const targetListing = store.getListingById(listingId) || store.getListingBySlug(listingId);

    if (!targetListing) {
      return NextResponse.json(
        { error: 'Target listing not found' },
        { status: 404 }
      );
    }

    const generatedRenterId = renterId || `usr_${Date.now()}`;
    const newRequest = store.createRequest({
      listingId: targetListing.id,
      renterId: generatedRenterId,
      renterName: renterName || 'Prospective Renter',
      renterPhone: canonicalPhone,
      renterEmail: renterEmail || 'renter@therentalcircle.in',
      intendedMoveInDate,
      rentalDurationMonths,
      occupantsCount,
      householdArrangement,
      employmentCategory,
      optionalIntroduction,
    });

    // Also synchronize with DB queries mock repository
    try {
      await createRentalRequest({
        id: newRequest.id,
        listingId: targetListing.id,
        renterId: generatedRenterId,
        intendedMoveInDate: new Date(intendedMoveInDate),
        rentalDurationMonths,
        occupantsCount,
        householdArrangement,
        employmentCategory,
        optionalIntroduction,
      });
    } catch {
      // Best-effort sync
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Rental application submitted successfully',
        request: newRequest,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to submit rental request', message: err.message },
      { status: 500 }
    );
  }
}
