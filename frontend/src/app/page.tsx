'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/header/Header';
import CategoriesBar from '@/components/categories/CategoriesBar';
import ListingGrid from '@/components/listings/ListingGrid';
import MapView from '@/components/map/MapView';
import { Listing, FilterState } from '@/types';
import { getListings } from '@/services/api';
import { Map, List } from 'lucide-react';

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filters, setFilters] = useState<FilterState>({});
  const [isMapViewOpen, setIsMapViewOpen] = useState<boolean>(false);

  const fetchListingsData = async (catId: string, currentFilters: FilterState) => {
    setIsLoading(true);
    try {
      const data = await getListings({
        category_id: catId,
        ...currentFilters,
      });
      setListings(data);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListingsData(selectedCategory, filters);
  }, [selectedCategory, filters]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleSearchChange = (searchData: any) => {
    setFilters((prev) => ({
      ...prev,
      city: searchData.city,
      check_in: searchData.check_in,
      check_out: searchData.check_out,
      guests: searchData.guests,
    }));
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setFilters({});
  };

  const activeFilterCount = Object.keys(filters).filter(
    (k) => filters[k as keyof FilterState] !== undefined
  ).length;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header onSearchChange={handleSearchChange} />

      {/* Categories Bar */}
      <CategoriesBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
        onApplyFilters={handleApplyFilters}
        activeFilterCount={activeFilterCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {isMapViewOpen ? (
          <div className="py-6 h-[75vh]">
            <MapView listings={listings} onClose={() => setIsMapViewOpen(false)} />
          </div>
        ) : (
          <ListingGrid
            listings={listings}
            isLoading={isLoading}
            onResetFilters={handleResetFilters}
          />
        )}

      </main>

      {/* Floating Map Toggle Button (Bottom Center) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setIsMapViewOpen((prev) => !prev)}
          className="bg-neutral-900 hover:bg-black text-white px-5 py-3.5 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 border border-neutral-700 transition-all hover:scale-105 active:scale-95"
        >
          {isMapViewOpen ? (
            <>
              <span>Show list</span>
              <List className="w-4 h-4 text-rose-500" />
            </>
          ) : (
            <>
              <span>Show map</span>
              <Map className="w-4 h-4 text-rose-500" />
            </>
          )}
        </button>
      </div>

      {/* Clean Airbnb Footer */}
      <footer className="border-t border-neutral-200 bg-neutral-50 py-6 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Airbnb, Inc. · Privacy · Terms · Sitemap · Company details</p>
          <div className="flex items-center gap-4 font-bold text-neutral-700">
            <span>English (IN)</span>
            <span>₹ INR</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
