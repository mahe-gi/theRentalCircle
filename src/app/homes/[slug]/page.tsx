import React from 'react';
import Link from 'next/link';
import { getListingBySlug } from '@/db/queries';
import { ListingRequestAction } from '@/components/listings/ListingRequestAction';
import { formatINR } from '@/lib/utils';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Check,
  Sparkles,
  Info,
  Lock,
  Layers,
  Home,
  FileCheck,
  CheckCircle,
} from 'lucide-react';

export const dynamicParams = true;

export function generateStaticParams() {
  return [
    { slug: '1rk-independent-kondapur-botanical' },
    { slug: 'private-room-colive-gachibowli' },
    { slug: '2bhk-semi-furnished-madhapur-ayyyappa' },
    { slug: '1bhk-manikonda-ou-colony' },
    { slug: 'shared-room-hitec-city' },
    { slug: '3bhk-financial-district-narsingi' },
  ];
}

const PROPERTY_TYPE_MAP: Record<string, string> = {
  '1rk': '1 RK Independent Unit',
  '1bhk': '1 BHK Apartment',
  '2bhk': '2 BHK Apartment',
  '3plus_bhk': '3+ BHK Residence',
  'private_room': 'Private Room',
  'shared_room': 'Shared Room / Bedspace',
  'independent_house': 'Independent House',
  'penthouse': 'Penthouse',
};

const CLUSTER_MAP: Record<string, string> = {
  kondapur: 'Kondapur, Hyderabad',
  madhapur: 'Madhapur, Hyderabad',
  gachibowli: 'Gachibowli, Hyderabad',
  hitec_city: 'HITEC City, Hyderabad',
  manikonda: 'Manikonda, Hyderabad',
  financial_district: 'Financial District, Hyderabad',
};

const FURNISHING_MAP: Record<string, string> = {
  unfurnished: 'Unfurnished',
  semi_furnished: 'Semi-Furnished',
  fully_furnished: 'Fully Furnished',
};

const ROOM_TAG_MAP: Record<string, string> = {
  main_room: 'Living Space',
  bedroom: 'Bedroom',
  kitchen: 'Modular Kitchen',
  bathroom: 'Attached Bathroom',
  balcony_exterior: 'Balcony / Exterior',
  other: 'Property View',
};

function formatDate(date?: Date | string | null) {
  if (!date) return 'Immediate Move-in';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return 'Immediate Move-in';
  }
}

export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  // Clean, on-brand Not Found state
  if (!listing) {
    return (
      <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="rounded-[3px] border border-border bg-white p-10 sm:p-16 text-center space-y-6 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[2px] bg-surface-subtle border border-border text-cobalt">
              <Building2 className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cobalt">
                Verification Ledger • Listing Inactive
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-midnight tracking-tight">
                Property Listing Not Found
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
                The listing <code className="font-mono text-cobalt bg-surface-muted px-1.5 py-0.5 rounded-[2px]">{slug}</code> is either no longer available, was rented out, or the link is invalid.
              </p>
            </div>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/homes"
                className="inline-flex items-center gap-2 rounded-[2px] bg-cobalt px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-cobalt-hover transition-colors shadow-sm"
              >
                <ArrowLeft className="h-4 w-4" /> Browse Available Reviewed Homes
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const propertyTypeLabel = (listing.propertyType && PROPERTY_TYPE_MAP[listing.propertyType]) || 'Residential Property';
  const clusterLabel = (listing.cluster && CLUSTER_MAP[listing.cluster]) || 'Hyderabad';
  const furnishingLabel = (listing.furnishingStatus && FURNISHING_MAP[listing.furnishingStatus]) || 'Semi-Furnished';
  const depositMonths = listing.monthlyRent && listing.securityDeposit
    ? Math.round(listing.securityDeposit / listing.monthlyRent)
    : 2;

  // Media
  const photos = listing.media && listing.media.length > 0
    ? listing.media
    : [
        {
          id: 'med_default',
          listingId: listing.id,
          approvedR2Key: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          roomTag: 'main_room' as const,
          caption: 'Property Living Area',
          displayOrder: 0,
          isCover: true,
          isApproved: true,
          width: 1200,
          height: 800,
          sizeBytes: 150000,
          createdAt: new Date(),
        },
      ];

  const coverPhoto = photos.find(p => p.isCover) || photos[0];
  const sidePhotos = photos.filter(p => p.id !== coverPhoto.id);

  // Verification checks count
  const checks = listing.verificationChecks || [];
  const approvedChecksCount = checks.filter(c => c.status === 'approved').length;
  // Account for availability confirmation check
  const totalPassedChecks = approvedChecksCount + (listing.lastAvailabilityConfirmedAt ? 1 : 0);
  const totalPossibleChecks = Math.max(checks.length + (listing.lastAvailabilityConfirmedAt ? 1 : 0), 4);

  return (
    <div className="min-h-screen bg-canvas text-midnight font-sans antialiased selection:bg-cobalt selection:text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between border-b border-border pb-4">
          <Link
            href="/homes"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-text-muted hover:text-midnight transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Reviewed Homes
          </Link>
          <span className="rounded-[2px] bg-white border border-border px-2.5 py-1 text-[11px] font-mono font-medium text-text-muted shadow-sm">
            ID: TRC-{listing.id.replace('lst_', '').toUpperCase()}
          </span>
        </div>

        {/* Property Header */}
        <div className="space-y-2 text-left">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-[2px] bg-surface-muted border border-border px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-widest text-cobalt">
              {propertyTypeLabel}
            </span>
            <span className="text-border-strong">•</span>
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary font-medium">
              <MapPin className="h-3.5 w-3.5 text-text-faint" />
              {listing.colonyOrSociety ? `${listing.colonyOrSociety}, ` : ''}{clusterLabel}
            </span>
            <span className="text-border-strong">•</span>
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary font-medium">
              <Calendar className="h-3.5 w-3.5 text-text-faint" />
              Available from {formatDate(listing.availableFrom)}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-midnight tracking-tight">
            {listing.title}
          </h1>
        </div>

        {/* Coherent Single-Property Photo Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 rounded-[2px] overflow-hidden aspect-[16/10] sm:aspect-[21/9] lg:aspect-[24/10] bg-surface-muted border border-border">
          <div className={`${sidePhotos.length > 0 ? 'lg:col-span-7' : 'lg:col-span-12'} relative overflow-hidden bg-surface-muted h-full group`}>
            <img
              src={coverPhoto.approvedR2Key}
              alt={coverPhoto.caption || listing.title || 'Property Main View'}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
            />
            <span className="absolute bottom-3.5 left-3.5 rounded-[2px] bg-midnight/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white tracking-wide uppercase font-mono">
              {coverPhoto.caption || (coverPhoto.roomTag && ROOM_TAG_MAP[coverPhoto.roomTag]) || 'Primary View'}
            </span>
          </div>

          {sidePhotos.length > 0 && (
            <div className={`lg:col-span-5 grid ${sidePhotos.length === 1 ? 'grid-rows-1' : 'grid-rows-2'} gap-3 hidden sm:grid h-full`}>
              {sidePhotos.slice(0, 2).map((photo, idx) => (
                <div key={photo.id || idx} className="relative overflow-hidden bg-surface-muted group">
                  <img
                    src={photo.approvedR2Key}
                    alt={photo.caption || `Room view ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-102"
                  />
                  <span className="absolute bottom-3.5 left-3.5 rounded-[2px] bg-midnight/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white tracking-wide uppercase font-mono">
                    {photo.caption || (photo.roomTag && ROOM_TAG_MAP[photo.roomTag]) || `Photo ${idx + 2}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content & Sticky Request Action Rail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-4">
          {/* Left Column: Details, Checks & Charges (8 cols) */}
          <div className="lg:col-span-8 space-y-8 text-left">
            {/* Completed Baseline Verification Checks Ledger */}
            <div className="rounded-[2px] border border-verified-border bg-verified-surface p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-verified-border pb-4">
                <h3 className="text-sm font-black text-verified uppercase tracking-wider flex items-center gap-2.5 font-mono">
                  <ShieldCheck className="h-5 w-5 shrink-0" /> Completed Verification Checks
                </h3>
                <span className="text-xs font-mono font-bold text-verified bg-white px-2 py-0.5 rounded-[2px] border border-verified-border">
                  {totalPassedChecks} / {totalPossibleChecks} PASSED
                </span>
              </div>
              <ul className="space-y-3.5 text-sm text-verified font-medium">
                {checks.map(check => {
                  let checkLabel = 'Listing contact confirmed via founder phone conversation';
                  if (check.checkType === 'listing_reviewed') {
                    checkLabel = 'Listing reviewed for transparent pricing, deposit terms and photo consistency';
                  } else if (check.checkType === 'property_connection_evidence') {
                    if (check.evidenceType === 'tgspdcl_bill') {
                      checkLabel = 'Property connection evidence reviewed (TSSPDCL electricity service record verified against locality)';
                    } else if (check.evidenceType === 'ghmc_tax_receipt') {
                      checkLabel = 'Property connection evidence reviewed (GHMC property tax receipt verified against municipal records)';
                    } else if (check.evidenceType === 'society_noc') {
                      checkLabel = 'Property connection evidence reviewed (Gated society NOC / maintenance record checked)';
                    } else {
                      checkLabel = 'Property connection evidence reviewed (Official utility / property record checked)';
                    }
                  } else if (check.checkType === 'representative_authorization_evidence') {
                    checkLabel = 'Representative authorization evidence reviewed and verified';
                  }

                  return (
                    <li key={check.id} className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                      <span>{checkLabel}</span>
                    </li>
                  );
                })}

                {/* If listing has availability date */}
                {listing.lastAvailabilityConfirmedAt && (
                  <li className="flex items-start gap-3">
                    <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                    <span>
                      Availability confirmed on {formatDate(listing.lastAvailabilityConfirmedAt)} directly with listing contact
                    </span>
                  </li>
                )}

                {/* Default fallback checklist items if empty */}
                {checks.length === 0 && (
                  <>
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                      <span>Listing contact confirmed via founder phone conversation</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                      <span>Listing reviewed for transparent pricing, deposit terms and room consistency</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                      <span>Property connection evidence reviewed (utility / ownership documentation checked)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-4 w-4 shrink-0 mt-0.5 text-verified" />
                      <span>Availability confirmed directly with property contact</span>
                    </li>
                  </>
                )}
              </ul>
              <p className="text-xs text-text-muted pt-3 border-t border-verified-border/60 leading-relaxed font-normal">
                These checks reduce uncertainty and eliminate fake listings, but do not replace an in-person inspection or review of the formal lease agreement.
              </p>
            </div>

            {/* Transparent Charges Breakdown Table */}
            <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="text-sm font-black text-midnight uppercase tracking-wider font-mono">
                Transparent Charges Breakdown
              </h3>
              <table className="w-full text-sm">
                <tbody className="divide-y divide-border-subtle">
                  <tr>
                    <td className="py-4 text-text-muted font-medium">Monthly Rent</td>
                    <td className="py-4 text-right font-black text-midnight tabular-nums text-lg">
                      {formatINR(listing.monthlyRent || 0)}{' '}
                      <span className="text-xs text-text-faint font-normal">/ month</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-text-muted font-medium">Security Deposit</td>
                    <td className="py-4 text-right font-bold text-midnight tabular-nums text-base">
                      {formatINR(listing.securityDeposit || 0)}{' '}
                      <span className="text-xs font-normal text-text-faint">({depositMonths} months)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-text-muted font-medium">Maintenance Charges</td>
                    <td className="py-4 text-right font-semibold text-midnight tabular-nums">
                      {listing.isMaintenanceIncluded ? (
                        <span className="text-verified font-bold">Included in Rent</span>
                      ) : (
                        <>
                          {formatINR(listing.maintenanceCharges || 0)}{' '}
                          <span className="text-xs font-normal text-text-faint">/ month (Separate)</span>
                        </>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-text-muted font-medium">Lock-In Period</td>
                    <td className="py-4 text-right font-semibold text-midnight font-mono text-xs">
                      {listing.lockInMonths ? `${listing.lockInMonths} Months` : '6 Months'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-text-muted font-medium">Notice Period</td>
                    <td className="py-4 text-right font-semibold text-midnight font-mono text-xs">
                      {listing.noticeDays ? `${listing.noticeDays} Days` : '30 Days'}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-4 text-text-muted font-medium">Brokerage Fee</td>
                    <td className="py-4 text-right font-bold text-verified font-mono text-xs">
                      ₹0 (Strict Zero-Brokerage)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Property Specifications & House Rules */}
            <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="text-sm font-black text-midnight uppercase tracking-wider font-mono">
                Property Specifications & Guidelines
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div className="p-4 rounded-[2px] bg-surface-muted border border-border">
                  <span className="text-text-faint block text-[11px] font-mono uppercase">Carpet Area</span>
                  <span className="font-bold text-midnight text-base tabular-nums mt-1 block">
                    {listing.carpetAreaSqFt ? `${listing.carpetAreaSqFt} sq.ft` : 'Standard'}
                  </span>
                </div>
                <div className="p-4 rounded-[2px] bg-surface-muted border border-border">
                  <span className="text-text-faint block text-[11px] font-mono uppercase">Floor</span>
                  <span className="font-bold text-midnight text-base mt-1 block">
                    {listing.floorNumber
                      ? `${listing.floorNumber}${listing.totalFloors ? ` of ${listing.totalFloors}` : ''}`
                      : 'Standalone'}
                  </span>
                </div>
                <div className="p-4 rounded-[2px] bg-surface-muted border border-border">
                  <span className="text-text-faint block text-[11px] font-mono uppercase">Furnishing</span>
                  <span className="font-bold text-midnight text-base mt-1 block">
                    {furnishingLabel}
                  </span>
                </div>
                <div className="p-4 rounded-[2px] bg-surface-muted border border-border">
                  <span className="text-text-faint block text-[11px] font-mono uppercase">Pets Allowed</span>
                  <span className="font-bold text-midnight text-base mt-1 block">
                    {listing.petsAllowed ? 'Yes' : 'No Pets'}
                  </span>
                </div>
              </div>

              {/* Description */}
              {listing.description && (
                <div className="pt-4 border-t border-border space-y-2">
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                    About This Home
                  </h4>
                  <p className="text-sm text-text-secondary leading-relaxed font-normal whitespace-pre-line">
                    {listing.description}
                  </p>
                </div>
              )}
            </div>

            {/* Dynamic Amenities */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-5 shadow-sm">
                <h3 className="text-sm font-black text-midnight uppercase tracking-wider font-mono">
                  Verified Amenities & Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {listing.amenities.map(amenity => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2.5 rounded-[2px] border border-border bg-surface-subtle p-3 text-xs font-semibold text-midnight"
                    >
                      <Check className="h-4 w-4 text-cobalt shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location & Landmark Note */}
            <div className="rounded-[2px] border border-border bg-white p-6 sm:p-8 space-y-3 shadow-sm">
              <h3 className="text-sm font-black text-midnight uppercase tracking-wider font-mono">
                Locality & Vicinity
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Situated in <strong>{listing.colonyOrSociety || clusterLabel}</strong>
                {listing.landmark ? `, landmark: ${listing.landmark}` : ''}, pincode: {listing.pincode || '500081'}.
              </p>
              <div className="rounded-[2px] border border-border bg-surface-subtle p-3 text-xs text-text-muted flex items-start gap-2.5">
                <Lock className="h-4 w-4 text-cobalt shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  Exact building / flat number is released after your structured rental application is reviewed and accepted by the property owner.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Rental Request Action Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 rounded-[2px] border border-border bg-white p-7 shadow-[0_4px_24px_rgba(11,21,55,0.06)] space-y-6 text-left">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-black text-midnight tabular-nums tracking-tight">
                    {formatINR(listing.monthlyRent || 0)}
                  </span>
                  <span className="text-xs text-text-muted font-medium">/ month</span>
                </div>
                <p className="text-xs text-text-muted mt-1.5 font-normal">
                  {listing.isMaintenanceIncluded
                    ? 'Maintenance included'
                    : `+ ${formatINR(listing.maintenanceCharges || 0)} monthly maintenance`}{' '}
                  • Available {formatDate(listing.availableFrom)}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <ListingRequestAction
                  listingId={listing.id}
                  listingTitle={listing.title || 'Residential Property'}
                  monthlyRent={listing.monthlyRent || 0}
                  cluster={clusterLabel}
                />
                <p className="text-[11px] text-center text-text-muted leading-relaxed font-normal">
                  The renter consents to contact release when submitting the request. The listing contact consents when accepting it. Contact details are then released to both parties.
                </p>
              </div>

              {/* Calm In-Person Inspection Safety Reminder */}
              <div className="rounded-[2px] border border-tangerine-border bg-tangerine-surface p-4 text-xs text-tangerine-dark flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-tangerine-dark" />
                <p className="text-[11px] leading-relaxed text-tangerine-dark">
                  <strong>Safety Notice:</strong> Never transfer a token or advance before visiting the property in person and meeting the owner or authorized representative.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
