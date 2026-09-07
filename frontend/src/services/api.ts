import { Listing, Category, Booking, Review, WishlistItem, FilterState, CreateListingForm, User } from '@/types';

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  if (process.env.NEXT_PUBLIC_API_BASE_URL) return process.env.NEXT_PUBLIC_API_BASE_URL;
  if (process.env.API_URL) return process.env.API_URL;
  if (process.env.API_BASE_URL) return process.env.API_BASE_URL;
  
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    return 'https://airbnb-clone-backend.onrender.com/api';
  }
  return 'http://localhost:8000/api';
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
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

// LocalStorage helpers for listing resilience when backend is waking up or offline
function getLocalListings(): Listing[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('airbnb_local_listings');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveLocalListing(l: Listing) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalListings();
    const idx = list.findIndex((item) => item.id === l.id);
    if (idx >= 0) {
      list[idx] = l;
    } else {
      list.unshift(l);
    }
    localStorage.setItem('airbnb_local_listings', JSON.stringify(list));
  } catch (err) {
    console.error("Failed to save local listing:", err);
  }
}

function removeLocalListing(id: number) {
  if (typeof window === 'undefined') return;
  try {
    const list = getLocalListings().filter((l) => l.id !== id);
    localStorage.setItem('airbnb_local_listings', JSON.stringify(list));
  } catch (err) {
    console.error("Failed to delete local listing:", err);
  }
}

// Listings Search & Filters
export async function getListings(filters: FilterState = {}, host_id?: number): Promise<Listing[]> {
  const localListings = getLocalListings();
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
    const remote = await fetchAPI<Listing[]>(`/listings${queryString}`);
    const map = new Map<number, Listing>();
    localListings.forEach((l) => map.set(l.id, l));
    remote.forEach((l) => map.set(l.id, l));
    let result = Array.from(map.values());
    if (host_id) result = result.filter((l) => l.host_id === host_id);
    return result;
  } catch (err) {
    console.error("Backend fetch error, serving fallback listings:", err);
    let result = [...localListings, ...FALLBACK_LISTINGS];

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
    const remote = await fetchAPI<Listing>(`/listings/${id}`);
    saveLocalListing(remote);
    return remote;
  } catch (err) {
    console.error(`Backend fetch error for listing ${id}, serving fallback item:`, err);
    const local = getLocalListings().find((l) => l.id === id);
    if (local) return local;
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
  try {
    const remote = await fetchAPI<Listing>('/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    saveLocalListing(remote);
    return remote;
  } catch (err) {
    console.warn("Backend API unavailable during createListing, using local fallback:", err);
    const newId = Date.now();
    const photosList = data.photos.map((url, idx) => ({
      id: newId + idx,
      listing_id: newId,
      url: url,
      is_primary: idx === 0,
      display_order: idx,
    }));

    const fallbackListing: Listing = {
      id: newId,
      host_id: data.host_id,
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      property_type: data.property_type,
      room_type: data.room_type || 'Entire place',
      address: data.address,
      city: data.city,
      state: data.state || '',
      country: data.country || 'India',
      lat: data.lat || 28.6139,
      lng: data.lng || 77.2090,
      price_per_night: data.price_per_night,
      cleaning_fee: data.cleaning_fee || 500,
      service_fee: data.service_fee || 300,
      max_guests: data.max_guests,
      bedrooms: data.bedrooms,
      beds: data.beds,
      bathrooms: data.bathrooms,
      amenities: data.amenities || [],
      rating: 5.0,
      reviews_count: 0,
      photos: photosList,
      host: {
        id: data.host_id,
        name: "Rajesh Sharma",
        email: "rajesh.sharma@airbnb.com",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
        is_host: true,
        is_superhost: true,
        joined_date: "2018",
      },
    };

    saveLocalListing(fallbackListing);
    return fallbackListing;
  }
}

export async function updateListing(id: number, data: Partial<CreateListingForm>): Promise<Listing> {
  try {
    const updated = await fetchAPI<Listing>(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    saveLocalListing(updated);
    return updated;
  } catch (err) {
    console.warn("Backend API unavailable during updateListing, updating local fallback:", err);
    const existing = (await getListingById(id)) || FALLBACK_LISTINGS[0];
    const updatedListing: Listing = {
      ...existing,
      ...data,
      photos: data.photos
        ? data.photos.map((url, idx) => ({
            id: id * 10 + idx,
            listing_id: id,
            url,
            is_primary: idx === 0,
            display_order: idx,
          }))
        : existing.photos,
    };
    saveLocalListing(updatedListing);
    return updatedListing;
  }
}

export async function deleteListing(id: number): Promise<{ message: string }> {
  removeLocalListing(id);
  try {
    return await fetchAPI<{ message: string }>(`/listings/${id}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.warn("Backend API unavailable during deleteListing, deleted locally:", err);
    return { message: "Listing deleted successfully" };
  }
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
