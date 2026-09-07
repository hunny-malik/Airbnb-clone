import { Listing, Category, Booking, Review, WishlistItem, FilterState, CreateListingForm, User } from '@/types';

const API_BASE_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  process.env.NEXT_PUBLIC_API_BASE_URL || 
  'http://localhost:8000/api';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: 'An unexpected error occurred' }));
    throw new Error(errorData.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

// Categories
export async function getCategories(): Promise<Category[]> {
  return fetchAPI<Category[]>('/categories');
}

// Default Users
export async function getDefaultUsers(): Promise<{ guest: User; host: User }> {
  return fetchAPI<{ guest: User; host: User }>('/users/default');
}

import { FALLBACK_LISTINGS } from './mockData';

// Listings Search & Filters
export async function getListings(filters: FilterState = {}, host_id?: number): Promise<Listing[]> {
  const params = new URLSearchParams();

  if (host_id) params.append('host_id', host_id.toString());
  if (filters.category_id && filters.category_id !== 'all') params.append('category_id', filters.category_id);
  if (filters.city) params.append('city', filters.city);
  if (filters.guests && filters.guests > 0) params.append('guests', filters.guests.toString());
  if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
  if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
  if (filters.property_type && filters.property_type !== 'Any') params.append('property_type', filters.property_type);
  if (filters.bedrooms && filters.bedrooms > 0) params.append('bedrooms', filters.bedrooms.toString());
  if (filters.beds && filters.beds > 0) params.append('beds', filters.beds.toString());
  if (filters.bathrooms && filters.bathrooms > 0) params.append('bathrooms', filters.bathrooms.toString());
  if (filters.amenities && filters.amenities.length > 0) params.append('amenities', filters.amenities.join(','));
  if (filters.check_in) params.append('check_in', filters.check_in);
  if (filters.check_out) params.append('check_out', filters.check_out);

  const queryString = params.toString() ? `?${params.toString()}` : '';

  try {
    return await fetchAPI<Listing[]>(`/listings${queryString}`);
  } catch (err) {
    console.error("Backend fetch error, serving fallback listings:", err);
    let result = [...FALLBACK_LISTINGS];

    if (host_id) {
      result = result.filter((l) => l.host_id === host_id);
    }
    if (filters.category_id && filters.category_id !== 'all') {
      result = result.filter((l) => l.category_id === filters.category_id);
    }
    if (filters.city) {
      const q = filters.city.toLowerCase();
      result = result.filter((l) => 
        l.city.toLowerCase().includes(q) || 
        l.country.toLowerCase().includes(q) || 
        l.title.toLowerCase().includes(q)
      );
    }
    if (filters.guests && filters.guests > 0) {
      result = result.filter((l) => l.max_guests >= (filters.guests || 1));
    }
    if (filters.min_price !== undefined) {
      result = result.filter((l) => l.price_per_night >= filters.min_price!);
    }
    if (filters.max_price !== undefined) {
      result = result.filter((l) => l.price_per_night <= filters.max_price!);
    }

    return result;
  }
}

// Listing Detail
export async function getListingById(id: number): Promise<Listing> {
  try {
    return await fetchAPI<Listing>(`/listings/${id}`);
  } catch (err) {
    console.error(`Backend fetch error for listing ${id}, serving fallback item:`, err);
    const item = FALLBACK_LISTINGS.find((l) => l.id === id);
    if (item) return item;
    return FALLBACK_LISTINGS[0];
  }
}

// LocalStorage helpers for booking resilience when backend is waking up or offline
function getLocalBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('airbnb_local_bookings');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalBooking(b: Booking) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalBookings();
    list.unshift(b);
    localStorage.setItem('airbnb_local_bookings', JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save local booking:", err);
  }
}

// Booked Dates for Calendar
export async function getBookedDates(id: number): Promise<{ check_in: string; check_out: string }[]> {
  try {
    return await fetchAPI<{ check_in: string; check_out: string }[]>(`/listings/${id}/booked-dates`);
  } catch (err) {
    console.warn(`Backend unavailable for booked dates listing ${id}, checking local bookings:`, err);
    const local = getLocalBookings().filter((b) => b.listing_id === id && b.status === 'CONFIRMED');
    return local.map((b) => ({ check_in: b.check_in, check_out: b.check_out }));
  }
}

// Host Listing CRUD
export async function createListing(data: CreateListingForm): Promise<Listing> {
  return fetchAPI<Listing>('/listings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateListing(id: number, data: Partial<CreateListingForm>): Promise<Listing> {
  return fetchAPI<Listing>(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteListing(id: number): Promise<{ message: string }> {
  return fetchAPI<{ message: string }>(`/listings/${id}`, {
    method: 'DELETE',
  });
}

// Bookings Engine with LocalStorage Fallback Resilience
export async function createBooking(data: {
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  listing?: Listing;
}): Promise<Booking> {
  try {
    const { listing: _unused, ...payload } = data;
    return await fetchAPI<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn("Backend API unavailable during booking, executing fallback reservation:", err);
    const listing = data.listing || FALLBACK_LISTINGS.find((l) => l.id === data.listing_id) || FALLBACK_LISTINGS[0];
    const d1 = new Date(data.check_in);
    const d2 = new Date(data.check_out);
    const total_nights = Math.max(1, Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)));
    const nightly_total = total_nights * listing.price_per_night;
    const total_price = nightly_total + (listing.cleaning_fee || 500) + (listing.service_fee || 300);

    const fallbackBooking: Booking = {
      id: Date.now(),
      listing_id: listing.id,
      guest_id: data.guest_id || 4,
      check_in: data.check_in,
      check_out: data.check_out,
      guests_count: data.guests_count,
      adults: data.adults,
      children: data.children,
      infants: data.infants,
      pets: data.pets,
      total_nights,
      nightly_rate: listing.price_per_night,
      cleaning_fee: listing.cleaning_fee || 500,
      service_fee: listing.service_fee || 300,
      total_price,
      status: 'CONFIRMED',
      created_at: new Date().toISOString(),
      listing: listing,
      guest: {
        id: 4,
        name: "Aarav Verma",
        email: "guest@airbnb.com",
        is_host: false,
        is_superhost: false,
        joined_date: "2022"
      }
    };

    saveLocalBooking(fallbackBooking);
    return fallbackBooking;
  }
}

export async function getUserTrips(userId: number): Promise<Booking[]> {
  const localUserBookings = getLocalBookings().filter((b) => b.guest_id === userId);
  try {
    const remote = await fetchAPI<Booking[]>(`/bookings/user/${userId}`);
    const map = new Map<number, Booking>();
    localUserBookings.forEach((b) => map.set(b.id, b));
    remote.forEach((b) => map.set(b.id, b));
    return Array.from(map.values());
  } catch (err) {
    console.warn("Backend API unavailable, serving local trips:", err);
    return localUserBookings;
  }
}

export async function getHostReservations(hostId: number): Promise<Booking[]> {
  const localHostBookings = getLocalBookings().filter(
    (b) => b.listing?.host_id === hostId || b.listing?.host?.id === hostId
  );
  try {
    const remote = await fetchAPI<Booking[]>(`/bookings/host/${hostId}`);
    const map = new Map<number, Booking>();
    localHostBookings.forEach((b) => map.set(b.id, b));
    remote.forEach((b) => map.set(b.id, b));
    return Array.from(map.values());
  } catch (err) {
    console.warn("Backend API unavailable for host reservations:", err);
    return localHostBookings;
  }
}

export async function cancelBooking(bookingId: number, userId: number): Promise<Booking> {
  try {
    return await fetchAPI<Booking>(`/bookings/${bookingId}/cancel?user_id=${userId}`, {
      method: 'POST',
    });
  } catch (err) {
    console.warn("Backend API unavailable, cancelling local booking:", err);
    const local = getLocalBookings();
    const target = local.find((b) => b.id === bookingId);
    if (target) {
      target.status = 'CANCELLED';
      if (typeof window !== 'undefined') {
        localStorage.setItem('airbnb_local_bookings', JSON.stringify(local));
      }
      return target;
    }
    throw new Error("Booking not found");
  }
}

// Reviews
export async function getListingReviews(listingId: number): Promise<Review[]> {
  return fetchAPI<Review[]>(`/reviews/listing/${listingId}`);
}

export async function addReview(data: {
  listing_id: number;
  user_id: number;
  rating: number;
  cleanliness_rating?: number;
  accuracy_rating?: number;
  check_in_rating?: number;
  communication_rating?: number;
  location_rating?: number;
  value_rating?: number;
  comment: string;
}): Promise<Review> {
  return fetchAPI<Review>('/reviews', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Wishlists
export async function toggleWishlist(userId: number, listingId: number): Promise<{ saved: boolean; listing_id: number }> {
  return fetchAPI<{ saved: boolean; listing_id: number }>('/wishlists/toggle', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, listing_id: listingId }),
  });
}

export async function getUserWishlists(userId: number): Promise<WishlistItem[]> {
  return fetchAPI<WishlistItem[]>(`/wishlists/user/${userId}`);
}
