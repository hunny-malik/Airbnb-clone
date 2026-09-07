'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Star, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { Listing } from '@/types';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isWishlisted, toggleFavorite } = useWishlist();
  const { showToast } = useToast();
  const isSaved = isWishlisted(listing.id);

  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos.map((p) => p.url)
    : ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saved = await toggleFavorite(listing.id);
    showToast(
      saved ? `Saved "${listing.title}" to Wishlist` : `Removed "${listing.title}" from Wishlist`,
      saved ? 'success' : 'info'
    );
  };

  return (
    <Link href={`/rooms/${listing.id}`} className="group block flex flex-col">
      
      {/* Photo Carousel Container */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-neutral-100 mb-3 shadow-xs">
        
        {/* Main Image */}
        <img
          src={photos[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Guest Favorite Badge */}
        {listing.rating >= 4.95 && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-neutral-900 shadow-md flex items-center gap-1 z-10">
            <SparklesIcon className="w-3 h-3 text-amber-500 fill-amber-500" />
            <span>Guest favorite</span>
          </div>
        )}

        {/* Heart Wishlist Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 z-10 p-2 text-white hover:scale-110 transition-transform active:scale-95 drop-shadow-md"
        >
          <Heart
            className={`w-6 h-6 transition-colors ${
              isSaved ? 'fill-rose-500 text-rose-500' : 'fill-black/30 text-white stroke-[2]'
            }`}
          />
        </button>

        {/* Carousel Navigation Prev/Next Arrows (visible on card hover) */}
        {photos.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
            {currentImageIndex < photos.length - 1 && (
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 p-1 rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}

            {/* Pagination Dots */}
            <div className="absolute bottom-3 left-0 right-0 z-10 flex items-center justify-center gap-1.5 pointer-events-none">
              {photos.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImageIndex ? 'bg-white w-2.5' : 'bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

      </div>

      {/* Info Block */}
      <div className="flex justify-between items-start pt-1">
        <div className="flex-1 pr-2 min-w-0">
          <h3 className="font-bold text-neutral-900 text-sm truncate">{listing.title}</h3>
          <p className="text-xs text-neutral-500 truncate">{listing.city}, {listing.state || listing.country}</p>
          <p className="text-xs text-neutral-400 font-normal">Available Oct 15 – 20</p>
          
          {/* Price */}
          <div className="mt-1.5 flex items-baseline gap-1 text-sm">
            <span className="font-black text-neutral-900">₹{Math.round(listing.price_per_night).toLocaleString('en-IN')}</span>
            <span className="text-xs text-neutral-500 font-normal">night</span>
          </div>
        </div>

        {/* Rating Score */}
        <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 shrink-0">
          <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
          <span>{listing.rating.toFixed(2)}</span>
        </div>
      </div>

    </Link>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}
