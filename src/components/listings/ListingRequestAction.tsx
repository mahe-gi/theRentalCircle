'use client';

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { RentalRequestModal } from './RentalRequestModal';

export interface ListingRequestActionProps {
  listingId: string;
  listingTitle: string;
  monthlyRent: number;
  cluster?: string;
}

export function ListingRequestAction({
  listingId,
  listingTitle,
  monthlyRent,
  cluster,
}: ListingRequestActionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-cobalt py-4 text-xs font-bold tracking-wider uppercase text-white hover:bg-cobalt-hover active:scale-[0.98] transition-all shadow-[0_2px_12px_rgba(37,71,245,0.25)]"
      >
        Send Rental Request <ArrowRight className="h-4 w-4" />
      </button>

      <RentalRequestModal
        listingId={listingId}
        listingTitle={listingTitle}
        monthlyRent={monthlyRent}
        cluster={cluster}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
