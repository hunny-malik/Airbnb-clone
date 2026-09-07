'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/header/Header';
import { getListingById, updateListing } from '@/services/api';
import { useToast } from '@/context/ToastContext';
import { ChevronLeft, Trash2, Check } from 'lucide-react';

export default function EditListingPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerNight, setPricePerNight] = useState<number>(200);
  const [cleaningFee, setCleaningFee] = useState<number>(50);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [beds, setBeds] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [photos, setPhotos] = useState<string[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await getListingById(id);
        setTitle(data.title);
        setDescription(data.description);
        setPricePerNight(data.price_per_night);
        setCleaningFee(data.cleaning_fee);
        setMaxGuests(data.max_guests);
        setBedrooms(data.bedrooms);
        setBeds(data.beds);
        setBathrooms(data.bathrooms);
        setPhotos(data.photos?.map((p) => p.url) || []);
      } catch (err) {
        console.error("Error loading listing for edit:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [id]);

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
    setIsSubmitting(true);
    try {
      await updateListing(id, {
        title,
        description,
        price_per_night: pricePerNight,
        cleaning_fee: cleaningFee,
        max_guests: maxGuests,
        bedrooms,
        beds,
        bathrooms,
        photos,
      });

      showToast("Listing updated successfully!", "success");
      router.push('/host');
    } catch (err: any) {
      showToast(err.message || "Failed to update listing", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="max-w-3xl mx-auto px-4 py-10 w-full animate-pulse space-y-6">
          <div className="h-8 bg-neutral-200 rounded w-1/2" />
          <div className="h-64 bg-neutral-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-xs font-bold text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Host Dashboard</span>
        </button>

        <h1 className="text-3xl font-black text-neutral-900 mb-2">Edit Listing</h1>
        <p className="text-sm text-neutral-500 mb-8">Update pricing, description, photos, or details.</p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-neutral-50 p-8 rounded-3xl border border-neutral-200">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <label className="block text-xs font-bold text-neutral-700 mb-1">Cleaning Fee (₹)</label>
              <input
                type="number"
                value={cleaningFee}
                onChange={(e) => setCleaningFee(Number(e.target.value))}
                className="w-full p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
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

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Photos (URLs)</label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                placeholder="Paste new photo URL"
                className="flex-1 p-3.5 rounded-2xl border border-neutral-300 bg-white text-sm"
              />
              <button
                type="button"
                onClick={handleAddPhoto}
                className="bg-neutral-900 text-white px-5 rounded-2xl text-xs font-bold"
              >
                Add
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {photos.map((url, idx) => (
                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-300 group">
                  <img src={url} alt="photo" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full text-xs"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-extrabold py-4 rounded-2xl text-base shadow-md"
          >
            {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
}
