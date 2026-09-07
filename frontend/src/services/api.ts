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

// Booked Dates for Calendar
export async function getBookedDates(id: number): Promise<{ check_in: string; check_out: string }[]> {
  return fetchAPI<{ check_in: string; check_out: string }[]>(`/listings/${id}/booked-dates`);
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

// Bookings
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
}): Promise<Booking> {
  return fetchAPI<Booking>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getUserTrips(userId: number): Promise<Booking[]> {
  return fetchAPI<Booking[]>(`/bookings/user/${userId}`);
}

export async function getHostReservations(hostId: number): Promise<Booking[]> {
  return fetchAPI<Booking[]>(`/bookings/host/${hostId}`);
}

export async function cancelBooking(bookingId: number, userId: number): Promise<Booking> {
  return fetchAPI<Booking>(`/bookings/${bookingId}/cancel?user_id=${userId}`, {
    method: 'POST',
  });
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
