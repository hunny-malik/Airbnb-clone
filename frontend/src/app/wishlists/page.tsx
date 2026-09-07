'use client';

import React from 'react';
import Header from '@/components/header/Header';
import ListingGrid from '@/components/listings/ListingGrid';
import { useWishlist } from '@/context/WishlistContext';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function WishlistsPage() {
  const { wishlistListings } = useWishlist();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <h1 className="text-3xl font-black text-neutral-900 mb-2">Wishlists</h1>
        <p className="text-sm text-neutral-500 mb-8">Saved properties and places you love.</p>

        {wishlistListings.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 fill-rose-500 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Your wishlist is empty</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              As you search, click the heart icon on any listing to save your favorite stays here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold px-6 py-3 rounded-full text-xs transition-transform active:scale-95 shadow-md"
            >
              <span>Explore listings</span>
            </Link>
          </div>
        ) : (
          <ListingGrid listings={wishlistListings} isLoading={false} />
        )}
      </main>
    </div>
  );
}
