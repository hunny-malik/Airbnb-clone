'use client';

import React, { useState } from 'react';
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ListingPhoto } from '@/types';

interface PhotoGalleryProps {
  photos: ListingPhoto[];
  title: string;
}

export default function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const displayPhotos = photos.length > 0
    ? photos.map((p) => p.url)
    : [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      ];

  const mainPhoto = displayPhotos[0];
  const sidePhotos = displayPhotos.slice(1, 5);

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* 5-Photo Grid Layout */}
      <div className="relative rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-4 gap-2 aspect-[4/3] md:aspect-[2/1] max-h-[500px] mb-8 bg-neutral-100 shadow-md">
        
        {/* Large Main Photo */}
        <div
          onClick={() => openLightbox(0)}
          className="md:col-span-2 relative h-full cursor-pointer overflow-hidden group"
        >
          <img
            src={mainPhoto}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
        </div>

        {/* 4 Grid Photos on Right */}
        <div className="hidden md:grid col-span-2 grid-cols-2 gap-2 h-full">
          {sidePhotos.map((photoUrl, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx + 1)}
              className="relative h-full cursor-pointer overflow-hidden group"
            >
              <img
                src={photoUrl}
                alt={`${title} photo ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
            </div>
          ))}
        </div>

        {/* "Show all photos" floating button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 bg-white/90 hover:bg-white backdrop-blur-md text-neutral-900 border border-neutral-300 font-semibold text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95 z-10"
        >
          <Grid className="w-4 h-4" />
          <span>Show all {displayPhotos.length} photos</span>
        </button>

      </div>

      {/* Lightbox Fullscreen Photo Gallery Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col items-center justify-between p-4 animate-in fade-in duration-200">
          
          {/* Top Bar */}
          <div className="w-full max-w-6xl flex justify-between items-center py-4 text-white">
            <span className="text-sm font-semibold">
              {activePhotoIndex + 1} / {displayPhotos.length}
            </span>
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Main Photo View */}
          <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center">
            <img
              src={displayPhotos[activePhotoIndex]}
              alt={`${title} - ${activePhotoIndex + 1}`}
              className="max-h-[75vh] max-w-full object-contain rounded-2xl shadow-2xl"
            />

            {/* Prev Arrow */}
            {activePhotoIndex > 0 && (
              <button
                onClick={() => setActivePhotoIndex((prev) => prev - 1)}
                className="absolute left-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              >
                <ChevronLeft className="w-6 h-6 stroke-[3]" />
              </button>
            )}

            {/* Next Arrow */}
            {activePhotoIndex < displayPhotos.length - 1 && (
              <button
                onClick={() => setActivePhotoIndex((prev) => prev + 1)}
                className="absolute right-4 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white transition-colors"
              >
                <ChevronRight className="w-6 h-6 stroke-[3]" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="w-full max-w-4xl overflow-x-auto no-scrollbar flex items-center justify-center gap-3 py-4">
            {displayPhotos.map((url, idx) => (
              <button
                key={idx}
                onClick={() => setActivePhotoIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                  idx === activePhotoIndex ? 'border-rose-500 scale-105' : 'border-transparent opacity-50 hover:opacity-100'
                }`}
              >
                <img src={url} alt="thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
