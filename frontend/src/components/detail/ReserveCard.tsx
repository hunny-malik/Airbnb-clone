'use client';

import React, { useState, useEffect } from 'react';
import { Star, ChevronDown, Calendar, Users, AlertCircle, Plus, Minus, Check } from 'lucide-react';
import { Listing } from '@/types';
import { getBookedDates } from '@/services/api';
import CheckoutModal from '../checkout/CheckoutModal';

interface ReserveCardProps {
  listing: Listing;
}

export default function ReserveCard({ listing }: ReserveCardProps) {
  const [checkIn, setCheckIn] = useState<string>('2026-10-15');
  const [checkOut, setCheckOut] = useState<string>('2026-10-20');
  const [guestsCount, setGuestsCount] = useState<number>(2);
  const [isGuestOpen, setIsGuestOpen] = useState<boolean>(false);
  const [bookedRanges, setBookedRanges] = useState<{ check_in: string; check_out: string }[]>([]);
  const [isConflict, setIsConflict] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  useEffect(() => {
    async function loadBooked() {
      try {
        const ranges = await getBookedDates(listing.id);
        setBookedRanges(ranges);
      } catch (err) {
        console.error("Failed to load booked dates:", err);
      }
    }
    loadBooked();
  }, [listing.id]);

  // Check collision whenever checkIn or checkOut changes
  useEffect(() => {
    if (checkIn && checkOut) {
      const hasConflict = bookedRanges.some((range) => {
        return checkIn < range.check_out && checkOut > range.check_in;
      });
      setIsConflict(hasConflict);
    } else {
      setIsConflict(false);
    }
  }, [checkIn, checkOut, bookedRanges]);

  // Calculate total nights & price breakdown
  const d1 = checkIn ? new Date(checkIn) : null;
  const d2 = checkOut ? new Date(checkOut) : null;
  const totalNights = d1 && d2 && d2 > d1 ? Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)) : 0;

  const nightlyTotal = totalNights * listing.price_per_night;
  const cleaningFee = listing.cleaning_fee || 50;
  const serviceFee = listing.service_fee || 30;
  const totalPrice = nightlyTotal + cleaningFee + serviceFee;

  return (
    <>
      <div className="sticky top-28 bg-white rounded-3xl p-6 border border-neutral-200 shadow-xl space-y-6">
        
        {/* Price & Rating Header */}
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-black text-neutral-900">₹{Math.round(listing.price_per_night).toLocaleString('en-IN')}</span>
            <span className="text-sm text-neutral-500 font-normal"> / night</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-neutral-900">
            <Star className="w-4 h-4 fill-neutral-900" />
            <span>{listing.rating.toFixed(2)}</span>
            <span className="text-neutral-400">({listing.reviews_count} reviews)</span>
          </div>
        </div>

        {/* Date Collision Alert */}
        {isConflict && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 flex items-center gap-2 text-rose-700 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Selected dates overlap with an existing reservation. Please choose different dates.</span>
          </div>
        )}

        {/* Date Range & Guest Form Container */}
        <div className="border border-neutral-300 rounded-2xl overflow-hidden focus-within:ring-2 focus-within:ring-neutral-900 relative">
          
          {/* Dual Date Input */}
          <div className="grid grid-cols-2 border-b border-neutral-300">
            <div className="p-3 border-r border-neutral-300 bg-white">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-800">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none cursor-pointer"
              />
            </div>
            <div className="p-3 bg-white">
              <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-800">Checkout</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-neutral-900 focus:outline-none cursor-pointer"
              />
            </div>
          </div>

          {/* Guest Selector Control */}
          <div className="p-3 bg-white">
            <label className="block text-[10px] font-extrabold uppercase tracking-wider text-neutral-800">Guests</label>
            <div className="flex items-center justify-between mt-1">
              {/* Native Select + Stepper Trigger */}
              <select
                value={guestsCount}
                onChange={(e) => setGuestsCount(Number(e.target.value))}
                className="w-full bg-transparent text-xs font-bold text-neutral-900 focus:outline-none cursor-pointer py-1"
              >
                {Array.from({ length: listing.max_guests }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={num}>
                    {num} guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Reserve Button */}
        <button
          disabled={isConflict || totalNights <= 0}
          onClick={() => setIsCheckoutOpen(true)}
          className="w-full bg-[#FF385C] hover:bg-[#E00B41] disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl shadow-lg transition-transform active:scale-95 text-base flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Reserve</span>
        </button>

        <p className="text-center text-xs text-neutral-500 font-normal">You won't be charged yet</p>

        {/* Cost Breakdown */}
        {totalNights > 0 && (
          <div className="space-y-3 pt-4 border-t border-neutral-200 text-sm">
            <div className="flex justify-between text-neutral-700">
              <span className="underline">₹{Math.round(listing.price_per_night).toLocaleString('en-IN')} x {totalNights} nights</span>
              <span>₹{Math.round(nightlyTotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span className="underline">Cleaning fee</span>
              <span>₹{Math.round(cleaningFee).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-neutral-700">
              <span className="underline">Airbnb service fee</span>
              <span>₹{Math.round(serviceFee).toLocaleString('en-IN')}</span>
            </div>
            <div className="border-t border-neutral-200 pt-3 flex justify-between font-black text-neutral-900 text-base">
              <span>Total before taxes</span>
              <span>₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
            </div>
          </div>
        )}

      </div>

      {/* Mock Checkout Modal */}
      {isCheckoutOpen && (
        <CheckoutModal
          listing={listing}
          checkIn={checkIn}
          checkOut={checkOut}
          guestsCount={guestsCount}
          totalNights={totalNights}
          nightlyRate={listing.price_per_night}
          cleaningFee={cleaningFee}
          serviceFee={serviceFee}
          totalPrice={totalPrice}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </>
  );
}
