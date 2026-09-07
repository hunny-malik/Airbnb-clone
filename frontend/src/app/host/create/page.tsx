'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import { createListing } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';
import { ChevronLeft, Plus, Trash2, Sparkles, Check } from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: 'beachfront', label: 'Beachfront' },
  { id: 'cabins', label: 'Cabins' },
  { id: 'mansions', label: 'Mansions' },
  { id: 'iconic_cities', label: 'Iconic Cities' },
  { id: 'countryside', label: 'Countryside' },
  { id: 'lakefront', label: 'Lakefront' },
  { id: 'pools', label: 'Amazing Pools' },
  { id: 'tiny_homes', label: 'Tiny Homes' },
  { id: 'treehouses', label: 'Treehouses' },
  { id: 'tropical', label: 'Tropical' },
];

const AMENITY_LIST = ['wifi', 'pool', 'kitchen', 'air_conditioning', 'free_parking', 'hot_tub', 'fireplace', 'gym', 'tv'];

export default function CreateListingPage() {
  const router = useRouter();
  const { hostUser, currentUser, isHostMode, toggleHostMode } = useUser();
  const { showToast } = useToast();
  const activeHost = hostUser || currentUser;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('beachfront');
  const [propertyType, setPropertyType] = useState('Entire villa');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [lat, setLat] = useState<number>(28.6139);
  const [lng, setLng] = useState<number>(77.2090);
  const [pricePerNight, setPricePerNight] = useState<number>(5000);
  const [cleaningFee, setCleaningFee] = useState<number>(800);
  const [maxGuests, setMaxGuests] = useState<number>(4);
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [beds, setBeds] = useState<number>(2);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(['wifi', 'kitchen']);
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleAmenity = (item: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((a) => a !== item) : [...prev, item]
    );
  };

  const handleAddPhoto = () => {
    if (newPhotoUrl.trim()) {
      setPhotos((prev) => [...prev, newPhotoUrl.trim()]);
      setNewPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHost) {
      showToast("Please select a host account.", "error");
      return;
    }
    if (!title || !description || !address || !city) {
      showToast("Please fill in all required fields.", "error");
      return;
    }
    if (photos.length === 0) {
      showToast("Please add at least one photo URL.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing({
        host_id: activeHost.id,
        title,
        description,
        category_id: categoryId,
        property_type: propertyType,
        room_type: 'Entire place',
        address,
        city,
        state,
        country,
        lat,
        lng,
        price_per_night: pricePerNight,
        cleaning_fee: cleaningFee,
        service_fee: 30,
        max_guests: maxGuests,
        bedrooms,
        beds,
        bathrooms,
        amenities: selectedAmenities,
        photos,
      });

      showToast("New listing published successfully!", "success");
      router.push('/host');
    } catch (err: any) {
      showToast(err.message || "Failed to publish listing", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              You are currently in Guest Mode. Switch to Host Mode to create and manage property listings on Airbnb.
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

      <main className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Host Dashboard</span>
        </button>

        <h1 className="text-3xl font-black text-neutral-900 mb-2">Publish a New Listing</h1>
        <p className="text-sm text-neutral-500 mb-8">Fill in details to showcase your home to guests worldwide.</p>

        <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-50 p-8 rounded-3xl border border-neutral-200 shadow-sm">
          
          {/* 1. Basic Title & Description */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">1. Listing Info</h3>
            
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Modern Cliffside Villa with Infinity Pool"
                className="w-full p-3.5 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm font-medium bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">Description *</label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what makes your home unique, views, amenities..."
                className="w-full p-3.5 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm font-medium bg-white"
              />
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 2. Category & Property Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">2. Category & Type</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategoryId(cat.id)}
                  className={`p-3 rounded-2xl text-xs font-bold border transition-all ${
                    categoryId === cat.id
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-900'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 3. Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">3. Location</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Address *</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 100 Coastal Way"
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Malibu"
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">State / Province</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="e.g. California"
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. United States"
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 4. Capacity & Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">4. Capacity & Pricing</h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Price / Night (₹)</label>
                <input
                  type="number"
                  required
                  value={pricePerNight}
                  onChange={(e) => setPricePerNight(Number(e.target.value))}
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Max Guests</label>
                <input
                  type="number"
                  value={maxGuests}
                  onChange={(e) => setMaxGuests(Number(e.target.value))}
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Bedrooms</label>
                <input
                  type="number"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(Number(e.target.value))}
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">Bathrooms</label>
                <input
                  type="number"
                  step="0.5"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 5. Amenities */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">5. Amenities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITY_LIST.map((item) => {
                const checked = selectedAmenities.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleAmenity(item)}
                    className={`p-3 rounded-2xl text-xs font-bold capitalize border flex items-center justify-between ${
                      checked
                        ? 'bg-rose-50 border-rose-500 text-rose-700'
                        : 'bg-white border-neutral-300 text-neutral-700'
                    }`}
                  >
                    <span>{item.replace('_', ' ')}</span>
                    {checked && <Check className="w-4 h-4 text-rose-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border-t border-neutral-200"></div>

          {/* 6. Photos URLs */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-neutral-900">6. Photos (URLs)</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste Image URL (Unsplash or direct image link)"
                className="flex-1 p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="bg-neutral-900 hover:bg-black text-white px-5 rounded-2xl text-xs font-bold"
              >
                Add Photo
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-200 border border-neutral-300 group">
                  <img src={url} alt={`photo-${idx}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-extrabold py-4 rounded-2xl text-base shadow-lg transition-transform active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Listing'}
          </button>

        </form>

      </main>
    </div>
  );
}
