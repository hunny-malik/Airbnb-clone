'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/header/Header';
import { Listing, Booking } from '@/types';
import { getListings, getHostReservations, deleteListing } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { PlusCircle, Home, DollarSign, Calendar, Trash2, Edit3, Eye, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HostDashboardPage() {
  const { hostUser, currentUser, isHostMode, toggleHostMode } = useUser();
  const { showToast } = useToast();

  const [hostListings, setHostListings] = useState<Listing[]>([]);
  const [hostBookings, setHostBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const activeHost = hostUser || currentUser;

  const loadHostData = async () => {
    if (!activeHost) return;
    setIsLoading(true);
    try {
      const [listingsData, bookingsData] = await Promise.all([
        getListings({}, activeHost.id),
        getHostReservations(activeHost.id),
      ]);
      setHostListings(listingsData);
      setHostBookings(bookingsData);
    } catch (err) {
      console.error("Error loading host dashboard:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHostData();
  }, [activeHost]);

  const handleDeleteListing = async (id: number) => {
    try {
      await deleteListing(id);
      showToast("Listing deleted successfully.", "info");
      setDeletingId(null);
      loadHostData();
    } catch (err: any) {
      showToast(err.message || "Failed to delete listing", "error");
    }
  };

  // Metrics calculation
  const totalEarnings = hostBookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.total_price, 0);

  if (!isHostMode) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="max-w-xl w-full mx-auto px-4 py-20 text-center flex-1">
          <div className="bg-neutral-50 p-8 rounded-3xl border border-neutral-200 shadow-md space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900">Host Mode Required</h2>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              You are currently in Guest Mode. Switch to Host Mode to access your Host Dashboard and manage properties.
            </p>
            <button
              onClick={toggleHostMode}
              className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold py-3.5 rounded-2xl text-xs transition-transform active:scale-95 shadow-md cursor-pointer"
            >
              Switch to Host Mode Now
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 space-y-10">
        
        {/* Header Title + Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-neutral-900">Host Dashboard</h1>
              <span className="bg-rose-100 text-rose-700 text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Superhost
              </span>
            </div>
            <p className="text-sm text-neutral-500 mt-1">Manage your properties, pricing, and incoming guest reservations.</p>
          </div>

          <Link
            href="/host/create"
            className="inline-flex items-center gap-2 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold px-6 py-3.5 rounded-2xl text-sm transition-transform active:scale-95 shadow-md self-start sm:self-auto"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Create New Listing</span>
          </Link>
        </div>

        {/* Metrics Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-3xl space-y-1">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Listings</span>
              <Home className="w-5 h-5 text-rose-500" />
            </div>
            <p className="text-3xl font-black text-neutral-900">{hostListings.length}</p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-3xl space-y-1">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-bold uppercase tracking-wider">Active Bookings</span>
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-black text-neutral-900">
              {hostBookings.filter((b) => b.status === 'CONFIRMED').length}
            </p>
          </div>

          <div className="bg-neutral-50 border border-neutral-200 p-6 rounded-3xl space-y-1">
            <div className="flex items-center justify-between text-neutral-500">
              <span className="text-xs font-bold uppercase tracking-wider">Total Earnings</span>
              <DollarSign className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl font-black text-neutral-900">₹{Math.round(totalEarnings).toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Section 1: Owned Properties Management Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-neutral-900">Your Properties</h2>

          {isLoading ? (
            <div className="h-32 bg-neutral-100 rounded-3xl animate-pulse" />
          ) : hostListings.length === 0 ? (
            <div className="p-10 text-center bg-neutral-50 border border-neutral-200 rounded-3xl space-y-3">
              <p className="text-sm font-bold text-neutral-800">You haven't published any properties yet.</p>
              <Link
                href="/host/create"
                className="inline-block bg-neutral-900 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                Add Your First Property
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostListings.map((listing) => (
                <div key={listing.id} className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col">
                  <div className="relative aspect-video bg-neutral-100">
                    <img
                      src={listing.photos[0]?.url || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750'}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-neutral-900 shadow-md">
                      ₹{Math.round(listing.price_per_night).toLocaleString('en-IN')} / night
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900 truncate">{listing.title}</h3>
                      <p className="text-xs text-neutral-500">{listing.city}, {listing.country}</p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                      <Link
                        href={`/rooms/${listing.id}`}
                        className="flex-1 border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>

                      <Link
                        href={`/host/edit/${listing.id}`}
                        className="flex-1 border border-neutral-200 hover:bg-neutral-50 text-neutral-800 text-xs font-bold py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => setDeletingId(listing.id)}
                        className="p-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Incoming Guest Reservations Table */}
        <div className="space-y-4 pt-6 border-t border-neutral-200">
          <h2 className="text-xl font-bold text-neutral-900">Incoming Guest Bookings</h2>

          {hostBookings.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 border border-neutral-200 rounded-3xl text-xs text-neutral-500">
              No reservations recorded yet.
            </div>
          ) : (
            <div className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Guest</th>
                      <th className="p-4">Property</th>
                      <th className="p-4">Dates</th>
                      <th className="p-4">Guests</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {hostBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-neutral-50/50">
                        <td className="p-4 font-bold text-neutral-900">{b.guest?.name || 'Guest User'}</td>
                        <td className="p-4 font-semibold text-neutral-800 max-w-xs truncate">{b.listing?.title}</td>
                        <td className="p-4 text-neutral-600">{b.check_in} → {b.check_out}</td>
                        <td className="p-4 text-neutral-600">{b.guests_count}</td>
                        <td className="p-4 font-black text-neutral-900">₹{Math.round(b.total_price).toLocaleString('en-IN')}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </main>

      {/* Delete Listing Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
            <h3 className="text-lg font-black text-neutral-900">Delete Property?</h3>
            <p className="text-xs text-neutral-500">This action cannot be undone. All photos and associated data will be removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 bg-neutral-100 hover:bg-neutral-200 py-3 rounded-2xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteListing(deletingId)}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-2xl text-xs font-bold shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
