'use client';

import React, { useRef } from 'react';
import { Listing } from '@/types';
import ListingCard from './ListingCard';
import { SearchX, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

interface ListingGridProps {
  listings: Listing[];
  isLoading: boolean;
  onResetFilters?: () => void;
}

export default function ListingGrid({ listings, isLoading, onResetFilters }: ListingGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 animate-pulse">
            <div className="aspect-square w-full rounded-2xl bg-neutral-200" />
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-3 bg-neutral-200 rounded w-1/2" />
            <div className="h-4 bg-neutral-200 rounded w-1/3 mt-1" />
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">No exact matches found</h3>
        <p className="text-sm text-neutral-500 max-w-md mb-6">
          Try changing or clearing some of your filters or searching for another city or location.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            className="bg-neutral-900 hover:bg-black text-white font-bold px-6 py-3 rounded-xl text-sm transition-transform active:scale-95 cursor-pointer shadow-md"
          >
            Remove all filters
          </button>
        )}
      </div>
    );
  }

  // Categorized sections matching airbnb.co.in homepage groupings
  const ncrListings = listings.filter((l) => ['New Delhi', 'Noida', 'Gurugram'].includes(l.city));
  const villaListings = listings.filter((l) => ['Goa', 'Udaipur', 'Agra', 'Mumbai'].includes(l.city));
  const mountainListings = listings.filter((l) => ['Manali', 'Rishikesh', 'Munnar', 'Jaipur'].includes(l.city));

  const showSections = listings.length >= 8 && ncrListings.length > 0;

  return (
    <div className="space-y-12 py-6">
      {showSections ? (
        <>
          {/* Section 1: Delhi NCR */}
          {ncrListings.length > 0 && (
            <SectionCarousel
              title="Popular homes in Delhi NCR & Noida"
              listings={ncrListings}
            />
          )}

          {/* Section 2: Beachfront & Heritage Villas */}
          {villaListings.length > 0 && (
            <SectionCarousel
              title="Luxury Villas & Stays in Goa, Mumbai & Udaipur"
              listings={villaListings}
            />
          )}

          {/* Section 3: Mountain & Nature Retreats */}
          {mountainListings.length > 0 && (
            <SectionCarousel
              title="Nature Stays in Manali, Rishikesh & Munnar"
              listings={mountainListings}
            />
          )}

          {/* Section 4: All Stays Grid */}
          <div className="pt-6 border-t border-neutral-200">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 mb-6 flex items-center gap-2">
              <span>All Stays across India</span>
              <span className="text-xs bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full font-bold">
                {listings.length} places
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </>
      ) : (
        /* Regular grid when filtered */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}

interface SectionCarouselProps {
  title: string;
  listings: Listing[];
}

function SectionCarousel({ title, listings }: SectionCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4 relative group">
      {/* Section Title Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2 group-hover:text-rose-600 transition-colors cursor-pointer">
          <span>{title}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </h2>

        {/* Carousel Prev/Next Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-800 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full border border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-neutral-800 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex items-stretch gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2"
      >
        {listings.map((listing) => (
          <div key={listing.id} className="w-[270px] sm:w-[300px] shrink-0">
            <ListingCard listing={listing} />
          </div>
        ))}
      </div>
    </div>
  );
}
