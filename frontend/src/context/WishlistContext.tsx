'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import { toggleWishlist, getUserWishlists } from '@/services/api';
import { Listing } from '@/types';

interface WishlistContextType {
  wishlistIds: Set<number>;
  wishlistListings: Listing[];
  isWishlisted: (listingId: number) => boolean;
  toggleFavorite: (listingId: number) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useUser();
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [wishlistListings, setWishlistListings] = useState<Listing[]>([]);

  const refreshWishlist = async () => {
    if (!currentUser) return;
    try {
      const items = await getUserWishlists(currentUser.id);
      const ids = new Set(items.map((item) => item.listing_id));
      setWishlistIds(ids);
      setWishlistListings(items.map((item) => item.listing));
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [currentUser]);

  const isWishlisted = (listingId: number) => {
    return wishlistIds.has(listingId);
  };

  const toggleFavorite = async (listingId: number): Promise<boolean> => {
    if (!currentUser) return false;

    const isCurrentlyWishlisted = wishlistIds.has(listingId);
    const targetSavedState = !isCurrentlyWishlisted;

    // Optimistic UI update
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (targetSavedState) {
        next.add(listingId);
      } else {
        next.delete(listingId);
      }
      return next;
    });

    try {
      const res = await toggleWishlist(currentUser.id, listingId);
      await refreshWishlist();
      return res.saved;
    } catch (err) {
      console.error("Failed to toggle wishlist:", err);
      await refreshWishlist();
      return targetSavedState;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistListings,
        isWishlisted,
        toggleFavorite,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
