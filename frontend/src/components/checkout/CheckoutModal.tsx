'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { X, CreditCard, ShieldCheck, CheckCircle2, Calendar, Users, Lock } from 'lucide-react';
import { Listing } from '@/types';
import { useUser } from '@/context/UserContext';
import { createBooking } from '@/services/api';
import { useToast } from '@/context/ToastContext';

interface CheckoutModalProps {
  listing: Listing;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  totalNights: number;
  nightlyRate: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
  onClose: () => void;
}

export default function CheckoutModal({
  listing,
  checkIn,
  checkOut,
  guestsCount,
  totalNights,
  nightlyRate,
  cleaningFee,
  serviceFee,
  totalPrice,
  onClose,
}: CheckoutModalProps) {
  const router = useRouter();
  const { currentUser } = useUser();
  const { showToast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');

  const handleConfirmAndPay = async () => {
    if (!currentUser) {
      showToast('Please log in to complete your booking.', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      await createBooking({
        listing_id: listing.id,
        guest_id: currentUser.id,
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guestsCount,
        adults: guestsCount,
        children: 0,
        infants: 0,
        pets: 0,
        listing,
      });

      // Fire festive celebration confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setIsConfirmed(true);
      showToast('Booking Confirmed! Your stay is reserved.', 'success');

    } catch (err: any) {
      console.error("Booking error:", err);
      showToast(err.message || 'Failed to place booking', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-neutral-200 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-neutral-100 text-neutral-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isConfirmed ? (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-neutral-200">
              <h2 className="text-xl font-extrabold text-neutral-900">Request to book</h2>
              <p className="text-xs text-neutral-500 mt-0.5">Mock Checkout • No real payment required</p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Listing Card Summary */}
              <div className="flex gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <img
                  src={listing.photos[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'}
                  alt={listing.title}
                  className="w-24 h-24 rounded-xl object-cover shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">{listing.property_type}</span>
                  <h3 className="font-bold text-sm text-neutral-900 truncate">{listing.title}</h3>
                  <p className="text-xs text-neutral-500 truncate">{listing.city}, {listing.country}</p>
                  <div className="mt-2 text-xs font-bold text-neutral-900">
                    ★ {listing.rating.toFixed(2)} ({listing.reviews_count} reviews)
                  </div>
                </div>
              </div>

              {/* Your Trip Details */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-3">Your trip</h4>
                
                <div className="space-y-3 text-xs text-neutral-700">
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="font-semibold">Dates</span>
                    <span className="font-bold text-neutral-900">{checkIn} to {checkOut} ({totalNights} nights)</span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b border-neutral-100">
                    <span className="font-semibold">Guests</span>
                    <span className="font-bold text-neutral-900">{guestsCount} guest{guestsCount > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              {/* Price Details */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-3">Price details</h4>
                <div className="space-y-2 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>₹{Math.round(nightlyRate).toLocaleString('en-IN')} x {totalNights} nights</span>
                    <span>₹{Math.round(nightlyRate * totalNights).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cleaning fee</span>
                    <span>₹{Math.round(cleaningFee).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Airbnb service fee</span>
                    <span>₹{Math.round(serviceFee).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Total (INR)</span>
                    <span>₹{Math.round(totalPrice).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Mock Payment Selector */}
              <div>
                <h4 className="font-bold text-sm text-neutral-900 mb-3">Pay with (Mock Payment)</h4>
                <div className="border border-neutral-300 rounded-2xl p-4 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-neutral-100 text-neutral-800">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-900">Credit / Debit / UPI / NetBanking</p>
                      <p className="text-[11px] text-neutral-500">{cardNumber}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">Test Card Active</span>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
                <p className="font-bold text-neutral-900">Free cancellation for 48 hours</p>
                <p>Cancel before check-in for a full refund. All bookings persist in SQLite backend.</p>
              </div>

            </div>

            {/* Footer Confirm & Pay Button */}
            <div className="p-6 border-t border-neutral-200 bg-white flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-500">Total</span>
                <p className="text-lg font-black text-neutral-900">₹{Math.round(totalPrice).toLocaleString('en-IN')}</p>
              </div>
              <button
                disabled={isSubmitting}
                onClick={handleConfirmAndPay}
                className="bg-[#FF385C] hover:bg-[#E00B41] text-white font-extrabold px-8 py-3.5 rounded-2xl text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50 flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? 'Confirming...' : 'Confirm and Pay'}</span>
              </button>
            </div>
          </>
        ) : (
          /* Confirmation Celebratory Screen */
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-neutral-900">Reservation Confirmed!</h2>
              <p className="text-sm text-neutral-500 mt-1">You're going to {listing.city}!</p>
            </div>

            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <p className="font-bold text-neutral-900 text-sm">{listing.title}</p>
              <p className="text-neutral-600"><strong>Check-in:</strong> {checkIn}</p>
              <p className="text-neutral-600"><strong>Checkout:</strong> {checkOut}</p>
              <p className="text-neutral-600"><strong>Total Paid:</strong> ₹{Math.round(totalPrice).toLocaleString('en-IN')}</p>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push('/trips');
              }}
              className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-transform active:scale-95"
            >
              View My Trips →
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
