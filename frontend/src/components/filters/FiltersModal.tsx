'use client';

import React, { useState } from 'react';
import { X, Check, Wifi, Tv, Flame, Snowflake, Car, Sparkles, Utensils, Waves, Dumbbell, ShieldCheck } from 'lucide-react';

interface FiltersModalProps {
  onClose: () => void;
  onApplyFilters: (filters: {
    min_price?: number;
    max_price?: number;
    property_type?: string;
    bedrooms?: number;
    beds?: number;
    bathrooms?: number;
    amenities?: string[];
  }) => void;
}

const PROPERTY_TYPES = ['Any', 'Entire villa', 'Entire cabin', 'Entire apartment', 'Treehouse', 'Cottage'];

const AMENITY_OPTIONS = [
  { id: 'wifi', name: 'Wifi', icon: <Wifi className="w-4 h-4" /> },
  { id: 'pool', name: 'Pool', icon: <Waves className="w-4 h-4" /> },
  { id: 'kitchen', name: 'Kitchen', icon: <Utensils className="w-4 h-4" /> },
  { id: 'air_conditioning', name: 'Air conditioning', icon: <Snowflake className="w-4 h-4" /> },
  { id: 'free_parking', name: 'Free parking', icon: <Car className="w-4 h-4" /> },
  { id: 'hot_tub', name: 'Hot tub', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'fireplace', name: 'Fireplace', icon: <Flame className="w-4 h-4" /> },
  { id: 'gym', name: 'Gym', icon: <Dumbbell className="w-4 h-4" /> },
  { id: 'tv', name: 'TV', icon: <Tv className="w-4 h-4" /> },
];

export default function FiltersModal({ onClose, onApplyFilters }: FiltersModalProps) {
  const [minPrice, setMinPrice] = useState<number>(2000);
  const [maxPrice, setMaxPrice] = useState<number>(30000);
  const [propertyType, setPropertyType] = useState<string>('Any');
  const [bedrooms, setBedrooms] = useState<number>(0);
  const [beds, setBeds] = useState<number>(0);
  const [bathrooms, setBathrooms] = useState<number>(0);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleClearAll = () => {
    setMinPrice(2000);
    setMaxPrice(30000);
    setPropertyType('Any');
    setBedrooms(0);
    setBeds(0);
    setBathrooms(0);
    setSelectedAmenities([]);
  };

  const handleSubmit = () => {
    onApplyFilters({
      min_price: minPrice > 2000 ? minPrice : undefined,
      max_price: maxPrice < 30000 ? maxPrice : undefined,
      property_type: propertyType !== 'Any' ? propertyType : undefined,
      bedrooms: bedrooms > 0 ? bedrooms : undefined,
      beds: beds > 0 ? beds : undefined,
      bathrooms: bathrooms > 0 ? bathrooms : undefined,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-base font-bold text-neutral-900">Filters</h2>
          <div className="w-8"></div>
        </div>

        {/* Scrollable Filters Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* 1. Price Range */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Price range</h3>
            <p className="text-xs text-neutral-500 mb-4">Nightly prices before fees and taxes</p>

            <div className="flex items-center gap-4">
              <div className="flex-1 border border-neutral-300 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-neutral-900">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase">Minimum</label>
                <div className="flex items-center text-sm font-bold text-neutral-900">
                  <span>₹</span>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none pl-1"
                  />
                </div>
              </div>
              <span className="text-neutral-400 font-bold">-</span>
              <div className="flex-1 border border-neutral-300 rounded-2xl p-3 focus-within:ring-2 focus-within:ring-neutral-900">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase">Maximum</label>
                <div className="flex items-center text-sm font-bold text-neutral-900">
                  <span>₹</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full bg-transparent focus:outline-none pl-1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 2. Type of Place */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Property type</h3>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((type) => (
                <button
                  key={type}
                  onClick={() => setPropertyType(type)}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                    propertyType === type
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 3. Rooms and Beds */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Bedrooms & Beds</h3>
            
            {/* Bedrooms */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-800">Bedrooms</span>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBedrooms(num)}
                    className={`w-9 h-9 rounded-full text-xs font-bold border transition-all ${
                      bedrooms === num
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {num === 0 ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Beds */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-800">Beds</span>
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setBeds(num)}
                    className={`w-9 h-9 rounded-full text-xs font-bold border transition-all ${
                      beds === num
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'border-neutral-300 text-neutral-700 hover:border-neutral-900'
                    }`}
                  >
                    {num === 0 ? 'Any' : `${num}+`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 4. Amenities Checklist */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {AMENITY_OPTIONS.map((amenity) => {
                const isChecked = selectedAmenities.includes(amenity.id);
                return (
                  <button
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                      isChecked
                        ? 'border-rose-500 bg-rose-50/50 text-rose-700 font-bold'
                        : 'border-neutral-300 hover:border-neutral-800 text-neutral-700 font-medium'
                    }`}
                  >
                    <div className="text-rose-500">{amenity.icon}</div>
                    <span className="text-xs">{amenity.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-200 bg-white">
          <button
            onClick={handleClearAll}
            className="text-sm font-bold text-neutral-900 underline hover:text-rose-600 transition-colors"
          >
            Clear all
          </button>
          <button
            onClick={handleSubmit}
            className="bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
          >
            Show places
          </button>
        </div>

      </div>
    </div>
  );
}
