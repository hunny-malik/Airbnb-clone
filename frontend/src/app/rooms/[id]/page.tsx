'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import PhotoGallery from '@/components/detail/PhotoGallery';
import ReserveCard from '@/components/detail/ReserveCard';
import HostCard from '@/components/detail/HostCard';
import ReviewsSection from '@/components/detail/ReviewsSection';
import MapView from '@/components/map/MapView';
import { Listing } from '@/types';
import { getListingById } from '@/services/api';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/context/ToastContext';
import { 
  Star, 
  Share, 
  Heart, 
  ChevronLeft, 
  Award, 
  ShieldCheck, 
  Wifi, 
  Utensils, 
  Snowflake, 
  Car, 
  Sparkles, 
  Flame, 
  Dumbbell, 
  Tv, 
  Waves, 
  Check,
  X
} from 'lucide-react';

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  wifi: <Wifi className="w-5 h-5 text-neutral-700" />,
  pool: <Waves className="w-5 h-5 text-neutral-700" />,
  kitchen: <Utensils className="w-5 h-5 text-neutral-700" />,
  air_conditioning: <Snowflake className="w-5 h-5 text-neutral-700" />,
  free_parking: <Car className="w-5 h-5 text-neutral-700" />,
  hot_tub: <Sparkles className="w-5 h-5 text-neutral-700" />,
  fireplace: <Flame className="w-5 h-5 text-neutral-700" />,
  gym: <Dumbbell className="w-5 h-5 text-neutral-700" />,
  tv: <Tv className="w-5 h-5 text-neutral-700" />,
};

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllAmenitiesModal, setShowAllAmenitiesModal] = useState(false);

  const { isWishlisted, toggleFavorite } = useWishlist();
  const { showToast } = useToast();

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (err) {
        console.error("Error loading listing:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-10 w-full animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-2/3" />
          <div className="aspect-[2/1] bg-neutral-200 rounded-3xl w-full" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 h-64 bg-neutral-200 rounded-2xl" />
            <div className="h-64 bg-neutral-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <Header />
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Listing not found</h2>
        <p className="text-sm text-neutral-500 mb-6">The property you are looking for might have been moved or removed.</p>
        <button
          onClick={() => router.push('/')}
          className="bg-neutral-900 text-white px-6 py-3 rounded-xl text-sm font-bold"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  const isSaved = isWishlisted(listing.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Listing URL copied to clipboard!', 'info');
  };

  const handleToggleHeart = async () => {
    const saved = await toggleFavorite(listing.id);
    showToast(
      saved ? `Saved "${listing.title}" to Wishlist` : `Removed from Wishlist`,
      saved ? 'success' : 'info'
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        
        {/* Navigation Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Explore</span>
        </button>

        {/* Title Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight">{listing.title}</h1>
            <div className="flex items-center gap-3 text-xs font-semibold text-neutral-800 mt-1">
              <span className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-neutral-900" />
                <span>{listing.rating.toFixed(2)}</span>
                <span className="text-neutral-400">({listing.reviews_count} reviews)</span>
              </span>
              <span>·</span>
              {listing.host?.is_superhost && (
                <>
                  <span className="flex items-center gap-1 text-rose-600">
                    <Award className="w-3.5 h-3.5" />
                    <span>Superhost</span>
                  </span>
                  <span>·</span>
                </>
              )}
              <span className="underline">{listing.address}, {listing.city}, {listing.country}</span>
            </div>
          </div>

          {/* Share & Wishlist Save Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 border border-neutral-300 rounded-full px-4 py-2 text-xs font-bold hover:bg-neutral-50 transition-colors"
            >
              <Share className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handleToggleHeart}
              className="flex items-center gap-2 border border-neutral-300 rounded-full px-4 py-2 text-xs font-bold hover:bg-neutral-50 transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>

        {/* Photo Gallery Grid */}
        <PhotoGallery photos={listing.photos} title={listing.title} />

        {/* Main Content Layout: Left Details + Right Sticky Reserve Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 py-4">
          
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Host Brief Bar */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">
                  {listing.property_type} hosted by {listing.host?.name || 'Superhost'}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  {listing.max_guests} guests · {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} · {listing.beds} bed{listing.beds > 1 ? 's' : ''} · {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
                </p>
              </div>
              <img
                src={listing.host?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'}
                alt={listing.host?.name || 'Host'}
                className="w-14 h-14 rounded-full object-cover border border-neutral-200 shrink-0"
              />
            </div>

            {/* Property Highlights */}
            <div className="space-y-4 pb-6 border-b border-neutral-200 text-sm">
              <div className="flex gap-4">
                <ShieldCheck className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">Self check-in</h3>
                  <p className="text-xs text-neutral-500">Check yourself in with the keypad.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Award className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-neutral-900 text-sm">{listing.host?.name} is a Superhost</h3>
                  <p className="text-xs text-neutral-500">Superhosts are experienced, highly rated hosts who are committed to providing great stays.</p>
                </div>
              </div>
            </div>

            {/* Description Paragraph */}
            <div className="pb-6 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-3">About this space</h3>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>

            {/* What this place offers (Amenities) */}
            <div className="pb-6 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900 mb-4">What this place offers</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {listing.amenities.slice(0, 8).map((amenityKey) => (
                  <div key={amenityKey} className="flex items-center gap-3 text-sm font-medium text-neutral-800 capitalize">
                    {AMENITY_ICONS[amenityKey] || <Check className="w-5 h-5 text-neutral-700" />}
                    <span>{amenityKey.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>

              {listing.amenities.length > 8 && (
                <button
                  onClick={() => setShowAllAmenitiesModal(true)}
                  className="border border-neutral-900 hover:bg-neutral-50 px-5 py-2.5 rounded-2xl text-xs font-bold text-neutral-900 transition-colors"
                >
                  Show all {listing.amenities.length} amenities
                </button>
              )}
            </div>

            {/* Location Map Preview */}
            <div>
              <h3 className="text-lg font-bold text-neutral-900 mb-2">Where you'll be</h3>
              <p className="text-xs text-neutral-500 mb-4">{listing.city}, {listing.state ? `${listing.state}, ` : ''}{listing.country}</p>
              
              <div className="h-80 w-full rounded-3xl overflow-hidden border border-neutral-200 shadow-xs">
                <MapView listings={[listing]} />
              </div>
            </div>

            {/* Host Card */}
            {listing.host && <HostCard host={listing.host} />}

            {/* Reviews Section */}
            <ReviewsSection
              listingId={listing.id}
              rating={listing.rating}
              reviewsCount={listing.reviews_count}
            />

          </div>

          {/* Right Column Sticky Reserve Card (1/3 width) */}
          <div className="lg:col-span-1">
            <ReserveCard listing={listing} />
          </div>

        </div>

      </main>

      {/* Show All Amenities Modal */}
      {showAllAmenitiesModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-neutral-200 relative max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
              <h3 className="text-lg font-bold text-neutral-900">What this place offers</h3>
              <button
                onClick={() => setShowAllAmenitiesModal(false)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {listing.amenities.map((amenityKey) => (
                <div key={amenityKey} className="flex items-center gap-3 text-sm font-medium text-neutral-800 capitalize py-2 border-b border-neutral-100">
                  {AMENITY_ICONS[amenityKey] || <Check className="w-5 h-5 text-neutral-700" />}
                  <span>{amenityKey.replace('_', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
