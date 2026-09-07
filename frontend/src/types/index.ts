export interface User {
  id: number;
  name: str;
  email: str;
  avatar_url?: string;
  bio?: string;
  is_host: boolean;
  is_superhost: boolean;
  joined_date: string;
}

export type str = string;

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ListingPhoto {
  id: number;
  listing_id?: number;
  url: string;
  is_primary: boolean;
  display_order: number;
}

export interface Listing {
  id: number;
  host_id: number;
  title: string;
  description: string;
  category_id: string;
  property_type: string;
  room_type: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  rating: number;
  reviews_count: number;
  created_at?: string;
  host?: User;
  photos: ListingPhoto[];
  category?: Category;
  amenities: string[];
}

export interface Booking {
  id: number;
  listing_id: number;
  guest_id: number;
  check_in: string;
  check_out: string;
  guests_count: number;
  adults: number;
  children: number;
  infants: number;
  pets: number;
  total_nights: number;
  nightly_rate: number;
  cleaning_fee: number;
  service_fee: number;
  total_price: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  created_at: string;
  listing: Listing;
  guest: User;
}

export interface Review {
  id: number;
  listing_id: number;
  user_id: number;
  rating: number;
  cleanliness_rating: number;
  accuracy_rating: number;
  check_in_rating: number;
  communication_rating: number;
  location_rating: number;
  value_rating: number;
  comment: string;
  created_at: string;
  user: User;
}

export interface WishlistItem {
  id: number;
  user_id: number;
  listing_id: number;
  listing: Listing;
}

export interface FilterState {
  category_id?: string;
  city?: string;
  check_in?: string;
  check_out?: string;
  guests?: number;
  min_price?: number;
  max_price?: number;
  property_type?: string;
  bedrooms?: number;
  beds?: number;
  bathrooms?: number;
  amenities?: string[];
}

export interface CreateListingForm {
  host_id: number;
  title: string;
  description: string;
  category_id: string;
  property_type: string;
  room_type: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  price_per_night: number;
  cleaning_fee: number;
  service_fee: number;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  photos: string[];
}
