'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu, User as UserIcon, Heart, Compass, Home as HomeIcon, PlusCircle, Sparkles } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import SearchOverlay from '../search/SearchOverlay';

interface HeaderProps {
  onSearchChange?: (searchData: any) => void;
}

export default function Header({ onSearchChange }: HeaderProps) {
  const { currentUser, isHostMode, toggleHostMode } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'anywhere' | 'anyweek' | 'addguests'>('anywhere');

  const handleOpenSearch = (tab: 'anywhere' | 'anyweek' | 'addguests') => {
    setActiveTab(tab);
    setIsSearchOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Airbnb Logo */}
          <Link href="/" className="flex items-center gap-2 text-[#FF385C] font-bold text-2xl tracking-tight shrink-0">
            <svg className="w-9 h-9 fill-current" viewBox="0 0 32 32">
              <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025 1.954 3.83 3.161 6.202c.985 1.932 1.488 3.864 1.488 5.753 0 5.485-4.405 9.921-9.887 9.921-5.482 0-9.887-4.436-9.887-9.921 0-1.889.503-3.821 1.488-5.753l3.161-6.202 1.954-3.83.533-1.025C12.537 1.963 13.992 1 16 1zm0 2c-1.239 0-2.222.613-3.149 2.261l-.478.919-1.921 3.766-3.13 6.141c-.815 1.599-1.209 3.139-1.209 4.592 0 4.398 3.526 7.921 7.887 7.921s7.887-3.523 7.887-7.921c0-1.453-.394-2.993-1.209-4.592l-3.13-6.141-1.921-3.766-.478-.919C18.222 3.613 17.239 3 16 3zm0 12c1.657 0 3 1.343 3 3s-1.343 3-3 3-3-1.343-3-3 1.343-3 3-3z"/>
            </svg>
            <span className="hidden md:inline font-black text-xl">airbnb</span>
          </Link>

          {/* Center Search Pill Bar & Top Navigation Tabs */}
          <div className="flex-1 max-w-xl flex flex-col items-center gap-3">
            
            {/* Top Navigation Mode Tabs matching airbnb.co.in */}
            <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
              <button className="flex items-center gap-2 pb-1 border-b-2 border-neutral-900 text-neutral-900 font-bold transition-all cursor-pointer">
                <span>Homes</span>
              </button>
              <button className="flex items-center gap-2 pb-1 border-b-2 border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all cursor-pointer">
                <span>Experiences</span>
              </button>
              <button className="flex items-center gap-2 pb-1 border-b-2 border-transparent text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all cursor-pointer">
                <span>Services</span>
              </button>
            </div>

            {/* Floating Search Pill Widget */}
            <div className="w-full border border-neutral-300 hover:shadow-md rounded-full px-4 py-2 text-sm font-semibold text-neutral-800 transition-all cursor-pointer shadow-sm flex items-center justify-between bg-white">
              <button
                onClick={() => handleOpenSearch('anywhere')}
                className="px-3 border-r border-neutral-200 hover:text-rose-500 transition-colors truncate text-left flex-1"
              >
                <span className="block text-[11px] font-bold text-neutral-900">Where</span>
                <span className="text-xs text-neutral-500 font-normal">Search destinations</span>
              </button>
              <button
                onClick={() => handleOpenSearch('anyweek')}
                className="px-3 border-r border-neutral-200 hover:text-rose-500 transition-colors truncate text-left flex-1 hidden sm:block"
              >
                <span className="block text-[11px] font-bold text-neutral-900">When</span>
                <span className="text-xs text-neutral-500 font-normal">Add dates</span>
              </button>
              <button
                onClick={() => handleOpenSearch('addguests')}
                className="px-3 hover:text-rose-500 transition-colors truncate text-left flex-1"
              >
                <span className="block text-[11px] font-bold text-neutral-900">Who</span>
                <span className="text-xs text-neutral-500 font-normal">Add guests</span>
              </button>
              <button
                onClick={() => handleOpenSearch('anywhere')}
                className="bg-[#FF385C] hover:bg-[#E00B41] text-white p-2.5 rounded-full transition-transform active:scale-95 shrink-0 shadow-md flex items-center justify-center"
              >
                <Search className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Right Profile & Mode Menu */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Host Switch Toggle Button */}
            <button
              onClick={toggleHostMode}
              className="hidden lg:flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              <span>{isHostMode ? 'Switch to Guest' : 'Switch to Host'}</span>
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="flex items-center gap-3 border border-neutral-300 rounded-full py-1.5 px-3 hover:shadow-md transition-all bg-white cursor-pointer"
              >
                <Menu className="w-4 h-4 text-neutral-600" />
                {currentUser?.avatar_url ? (
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-neutral-200"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-neutral-600 text-white flex items-center justify-center text-xs font-bold">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </button>

              {/* Dropdown Menu Popup */}
              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="px-4 py-3 border-b border-neutral-100">
                    <p className="text-sm font-bold text-neutral-900">{currentUser?.name}</p>
                    <p className="text-xs text-neutral-500 truncate">{currentUser?.email}</p>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600">
                      {isHostMode ? 'Host Mode Active' : 'Guest Mode Active'}
                    </div>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/trips"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Compass className="w-4 h-4 text-neutral-500" />
                      <span>My Trips</span>
                    </Link>

                    <Link
                      href="/wishlists"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-500" />
                      <span>Wishlists</span>
                    </Link>

                    <div className="border-t border-neutral-100 my-1"></div>

                    {isHostMode ? (
                      <>
                        <Link
                          href="/host"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
                        >
                          <HomeIcon className="w-4 h-4 text-neutral-500" />
                          <span>Host Dashboard</span>
                        </Link>

                        <Link
                          href="/host/create"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors text-rose-600 font-semibold"
                        >
                          <PlusCircle className="w-4 h-4 text-rose-600" />
                          <span>Create New Listing</span>
                        </Link>
                      </>
                    ) : (
                      <div className="px-4 py-2 bg-rose-50/60 rounded-xl mx-2 my-1 text-xs text-neutral-600">
                        <p className="font-semibold text-rose-700 mb-1">Want to host your home?</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleHostMode();
                          }}
                          className="font-bold text-rose-600 underline hover:text-rose-800 cursor-pointer"
                        >
                          Switch to Host Mode to create listings
                        </button>
                      </div>
                    )}

                    <div className="border-t border-neutral-100 my-1"></div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleHostMode();
                      }}
                      className="w-full text-left flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <span>{isHostMode ? 'Switch to Guest Mode' : 'Switch to Host Mode'}</span>
                      <span className="text-xs bg-neutral-200 px-2 py-0.5 rounded font-bold">Toggle</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </header>

      {/* Expanded Interactive Search Overlay */}
      {isSearchOpen && (
        <SearchOverlay
          initialTab={activeTab}
          onClose={() => setIsSearchOpen(false)}
          onSearch={(searchData) => {
            setIsSearchOpen(false);
            if (onSearchChange) onSearchChange(searchData);
          }}
        />
      )}
    </>
  );
}
