'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar as CalendarIcon, Users, X, Plus, Minus } from 'lucide-react';

interface SearchOverlayProps {
  initialTab?: 'anywhere' | 'anyweek' | 'addguests';
  onClose: () => void;
  onSearch: (data: { city?: string; check_in?: string; check_out?: string; guests?: number }) => void;
}

const DESTINATION_SUGGESTIONS = [
  { city: 'New Delhi', country: 'India', region: 'South Delhi / Hauz Khas' },
  { city: 'Noida', country: 'India', region: 'Sector 62 / NCR' },
  { city: 'Gurugram', country: 'India', region: 'Golf Course Road' },
  { city: 'Goa', country: 'India', region: 'Vagator Beach' },
  { city: 'Mumbai', country: 'India', region: 'Bandra Sea Face' },
  { city: 'Manali', country: 'India', region: 'Himachal Pine Chalet' },
  { city: 'Jaipur', country: 'India', region: 'Pink City Heritage' },
  { city: 'Udaipur', country: 'India', region: 'Lake Pichola' },
  { city: 'Rishikesh', country: 'India', region: 'Ganges Riverside' },
];

export default function SearchOverlay({ initialTab = 'anywhere', onClose, onSearch }: SearchOverlayProps) {
  const [activeStep, setActiveStep] = useState<'where' | 'dates' | 'who'>(
    initialTab === 'addguests' ? 'who' : initialTab === 'anyweek' ? 'dates' : 'where'
  );
  
  const [city, setCity] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('2026-10-15');
  const [checkOut, setCheckOut] = useState<string>('2026-10-20');
  
  // Guest Steppers
  const [adults, setAdults] = useState<number>(2);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [infants, setInfants] = useState<number>(0);
  const [pets, setPets] = useState<number>(0);

  const totalGuests = adults + childrenCount;

  const handleSearchSubmit = () => {
    onSearch({
      city: city.trim() || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: totalGuests > 0 ? totalGuests : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-start pt-4 sm:pt-10 px-4 animate-in fade-in duration-200">
      
      {/* Outer Card Container */}
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-500 hover:text-neutral-900"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Header Bar */}
        <div className="flex items-center justify-center gap-8 py-5 border-b border-neutral-100 bg-neutral-50">
          <button
            onClick={() => setActiveStep('where')}
            className={`text-sm font-semibold transition-colors pb-1 relative ${
              activeStep === 'where' ? 'text-rose-500 border-b-2 border-rose-500' : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Stays
          </button>
        </div>

        {/* Search Pill Component Bar */}
        <div className="p-4 sm:p-6">
          <div className="bg-neutral-100 border border-neutral-200 rounded-full flex flex-col sm:flex-row items-center p-2 gap-2 shadow-inner">
            
            {/* Where Field */}
            <div
              onClick={() => setActiveStep('where')}
              className={`flex-1 w-full px-5 py-3 rounded-full cursor-pointer transition-all ${
                activeStep === 'where' ? 'bg-white shadow-md' : 'hover:bg-neutral-200/60'
              }`}
            >
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-800">Where</label>
              <input
                type="text"
                placeholder="Search destinations"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-neutral-900 focus:outline-none placeholder-neutral-400 truncate"
              />
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-neutral-300"></div>

            {/* Dates Field */}
            <div
              onClick={() => setActiveStep('dates')}
              className={`flex-1 w-full px-5 py-3 rounded-full cursor-pointer transition-all ${
                activeStep === 'dates' ? 'bg-white shadow-md' : 'hover:bg-neutral-200/60'
              }`}
            >
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-800">Dates</label>
              <div className="text-sm font-medium text-neutral-900 truncate">
                {checkIn && checkOut ? `${checkIn} to ${checkOut}` : 'Add dates'}
              </div>
            </div>

            <div className="hidden sm:block w-[1px] h-8 bg-neutral-300"></div>

            {/* Who Field */}
            <div
              onClick={() => setActiveStep('who')}
              className={`flex-1 w-full px-5 py-3 rounded-full cursor-pointer transition-all ${
                activeStep === 'who' ? 'bg-white shadow-md' : 'hover:bg-neutral-200/60'
              }`}
            >
              <label className="block text-[11px] font-extrabold uppercase tracking-wider text-neutral-800">Who</label>
              <div className="text-sm font-medium text-neutral-900 truncate">
                {totalGuests > 0 ? `${totalGuests} guest${totalGuests > 1 ? 's' : ''}` : 'Add guests'}
              </div>
            </div>

            {/* Search Submit Button */}
            <button
              onClick={handleSearchSubmit}
              className="w-full sm:w-auto bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold px-6 py-3.5 rounded-full flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shrink-0"
            >
              <Search className="w-4 h-4 stroke-[3]" />
              <span>Search</span>
            </button>

          </div>
        </div>

        {/* Step Dynamic Content Area */}
        <div className="p-6 border-t border-neutral-100 max-h-[50vh] overflow-y-auto">
          
          {/* Step 1: Destination Suggestions */}
          {activeStep === 'where' && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">Popular Destinations</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  onClick={() => { setCity(''); setActiveStep('dates'); }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-200 hover:border-rose-500 hover:bg-rose-50/40 text-left transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-500 flex items-center justify-center font-bold">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 group-hover:text-rose-600">I'm flexible</p>
                    <p className="text-xs text-neutral-500">Search anywhere worldwide</p>
                  </div>
                </button>

                {DESTINATION_SUGGESTIONS.map((dest) => (
                  <button
                    key={dest.city}
                    onClick={() => {
                      setCity(dest.city);
                      setActiveStep('dates');
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-neutral-200 hover:border-neutral-900 text-left transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-600 flex items-center justify-center">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{dest.city}</p>
                      <p className="text-xs text-neutral-500">{dest.country} • {dest.region}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Date Selector */}
          {activeStep === 'dates' && (
            <div className="flex flex-col items-center gap-4">
              <h3 className="text-sm font-bold text-neutral-900">Select Travel Dates</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full p-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm font-medium"
                  />
                </div>
              </div>
              <button
                onClick={() => setActiveStep('who')}
                className="mt-2 text-sm font-semibold text-rose-600 hover:underline"
              >
                Next: Add guests →
              </button>
            </div>
          )}

          {/* Step 3: Guest Steppers */}
          {activeStep === 'who' && (
            <div className="max-w-lg mx-auto space-y-5">
              
              {/* Adults */}
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Adults</p>
                  <p className="text-xs text-neutral-500">Ages 13 or above</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={adults <= 1}
                    onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:border-neutral-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{adults}</span>
                  <button
                    onClick={() => setAdults((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Children</p>
                  <p className="text-xs text-neutral-500">Ages 2–12</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={childrenCount <= 0}
                    onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:border-neutral-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{childrenCount}</span>
                  <button
                    onClick={() => setChildrenCount((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Infants */}
              <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Infants</p>
                  <p className="text-xs text-neutral-500">Under 2</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={infants <= 0}
                    onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:border-neutral-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{infants}</span>
                  <button
                    onClick={() => setInfants((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Pets */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-bold text-neutral-900">Pets</p>
                  <p className="text-xs text-neutral-500">Bringing a service animal?</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    disabled={pets <= 0}
                    onClick={() => setPets((prev) => Math.max(0, prev - 1))}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 disabled:opacity-30 hover:border-neutral-900"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center text-sm font-bold">{pets}</span>
                  <button
                    onClick={() => setPets((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-600 hover:border-neutral-900"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
