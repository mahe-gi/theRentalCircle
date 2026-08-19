import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export interface ListingCardProps {
  slug: string;
  title: string;
  cluster: string;
  propertyType: string;
  monthlyRent: number;
  maintenanceCharges?: number;
  carpetAreaSqFt?: number;
  coverImageUrl: string;
  hasConnectionEvidence?: boolean;
  isContactConfirmed?: boolean;
  confirmedDate?: string;
}

export function ListingCard({
  slug,
  title,
  cluster,
  propertyType,
  monthlyRent,
  maintenanceCharges,
  carpetAreaSqFt,
  coverImageUrl,
  hasConnectionEvidence = true,
  isContactConfirmed = true,
  confirmedDate = 'Aug 18, 2026',
}: ListingCardProps) {
  return (
    <Link
      href={`/homes/${slug}`}
      className="group block border border-border bg-white hover:border-midnight hover:shadow-[0_4px_20px_rgba(11,21,55,0.06)] transition-all duration-200 rounded-[2px] overflow-hidden"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
        <img
          src={coverImageUrl}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {hasConnectionEvidence && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-[2px] bg-white/95 backdrop-blur-md border border-border px-2 py-1 text-[11px] font-bold text-verified shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
            <span>Connection Reviewed</span>
          </div>
        )}
        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-midnight text-white p-1.5 rounded-[2px]">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-midnight tabular-nums tracking-tight">
              {formatINR(monthlyRent)}
            </span>
            <span className="text-xs font-medium text-text-muted">/mo</span>
          </div>
          <span className="text-xs font-medium text-text-muted tabular-nums">
            {maintenanceCharges ? `+ ${formatINR(maintenanceCharges)} maint.` : 'Maint. included'}
          </span>
        </div>

        <div>
          <h3 className="text-[15px] font-bold text-midnight line-clamp-1 group-hover:text-cobalt transition-colors">
            {title}
          </h3>
          <p className="text-xs text-text-muted mt-0.5 font-normal">
            {propertyType} • {cluster} {carpetAreaSqFt ? `• ${carpetAreaSqFt} sq.ft` : ''}
          </p>
        </div>

        <div className="border-t border-border-subtle pt-3 flex items-center justify-between text-xs">
          {isContactConfirmed ? (
            <span className="inline-flex items-center gap-1 text-verified font-semibold text-[11px]">
              <CheckCircle2 className="h-3 w-3 shrink-0" /> Contact Confirmed
            </span>
          ) : (
            <span className="text-text-muted text-[11px]">Listing Reviewed</span>
          )}
          <span className="text-[11px] text-text-faint font-mono">{confirmedDate}</span>
        </div>
      </div>
    </Link>
  );
}
