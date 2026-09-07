'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import { Booking } from '@/types';
import { getUserTrips, cancelBooking } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { Compass, Calendar, MapPin, AlertTriangle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

export default function MyTripsPage() {
  const { currentUser } = useUser();
  const { showToast } = useToast();

  const [trips, setTrips] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'cancelled'>('upcoming');
  const [cancellingBookingId, setCancellingBookingId] = useState<number | null>(null);

  const fetchTrips = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const data = await getUserTrips(currentUser.id);
      setTrips(data);
    } catch (err) {
      console.error("Error loading trips:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [currentUser]);

  const handleCancelClick = async (bookingId: number) => {
    if (!currentUser) return;
    try {
      await cancelBooking(bookingId, currentUser.id);
      showToast("Reservation cancelled successfully.", "info");
      setCancellingBookingId(null);
      fetchTrips();
    } catch (err: any) {
      showToast(err.message || "Failed to cancel booking", "error");
    }
  };

  const upcomingTrips = trips.filter((t) => t.status === 'CONFIRMED');
  const cancelledTrips = trips.filter((t) => t.status === 'CANCELLED');

  const displayedTrips = activeTab === 'upcoming' ? upcomingTrips : cancelledTrips;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Page Title */}
        <h1 className="text-3xl font-black text-neutral-900 mb-2">Trips</h1>
        <p className="text-sm text-neutral-500 mb-8">Manage your active reservations, past stays, and travel plans.</p>

        {/* Tab Selector */}
        <div className="flex items-center gap-6 border-b border-neutral-200 mb-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'upcoming'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Upcoming Stays ({upcomingTrips.length})
          </button>
          <button
            onClick={() => setActiveTab('cancelled')}
            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
              activeTab === 'cancelled'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Cancelled ({cancelledTrips.length})
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-44 bg-neutral-100 rounded-3xl w-full" />
            ))}
          </div>
        ) : displayedTrips.length === 0 ? (
          /* Empty Trips Placeholder */
          <div className="text-center py-16 bg-neutral-50 rounded-3xl border border-neutral-200">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">No {activeTab} trips yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
              Time to dust off your bags and start planning your next adventure.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold px-6 py-3 rounded-full text-xs transition-transform active:scale-95 shadow-md"
            >
              <span>Start searching</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* Trips List Grid */
          <div className="space-y-6">
            {displayedTrips.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row items-stretch bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Photo Thumbnail */}
                <div className="md:w-72 h-48 md:h-auto relative bg-neutral-100 shrink-0">
                  <img
                    src={booking.listing?.photos[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'}
                    alt={booking.listing?.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    {booking.status === 'CONFIRMED' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-neutral-700 text-white shadow-md">
                        <XCircle className="w-3.5 h-3.5" />
                        Cancelled
                      </span>
                    )}
                  </div>
                </div>

                {/* Trip Info Details */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{booking.listing?.city}, {booking.listing?.country}</span>
                    </div>

                    <h3 className="text-xl font-bold text-neutral-900 mb-1">{booking.listing?.title}</h3>
                    <p className="text-xs text-neutral-500">{booking.listing?.property_type} hosted by {booking.listing?.host?.name}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-3 border-y border-neutral-100 text-xs">
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase">Check-in</span>
                      <span className="font-extrabold text-neutral-900">{booking.check_in}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase">Checkout</span>
                      <span className="font-extrabold text-neutral-900">{booking.check_out}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase">Total Paid</span>
                      <span className="font-black text-rose-600">₹{Math.round(booking.total_price).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <Link
                      href={`/rooms/${booking.listing_id}`}
                      className="text-xs font-bold text-neutral-900 underline hover:text-rose-600 transition-colors"
                    >
                      View Property Details →
                    </Link>

                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => setCancellingBookingId(booking.id)}
                        className="text-xs font-bold text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-colors border border-rose-200"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </main>

      {/* Cancel Confirmation Dialog Modal */}
      {cancellingBookingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-neutral-900">Cancel Reservation?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Are you sure you want to cancel this booking? The dates will be unblocked and made available to other guests.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setCancellingBookingId(null)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold py-3 rounded-2xl text-xs transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelClick(cancellingBookingId)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors shadow-md"
              >
                Yes, Cancel Trip
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
