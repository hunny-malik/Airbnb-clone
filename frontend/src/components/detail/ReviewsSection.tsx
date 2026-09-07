'use client';

import React, { useState, useEffect } from 'react';
import { Star, MessageSquarePlus, Sparkles, X } from 'lucide-react';
import { Review } from '@/types';
import { getListingReviews, addReview } from '@/services/api';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/context/ToastContext';

interface ReviewsSectionProps {
  listingId: number;
  rating: number;
  reviewsCount: number;
}

export default function ReviewsSection({ listingId, rating, reviewsCount }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const { currentUser } = useUser();
  const { showToast } = useToast();

  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadReviews() {
      try {
        const data = await getListingReviews(listingId);
        setReviews(data);
      } catch (err) {
        console.error("Failed to load reviews:", err);
      }
    }
    loadReviews();
  }, [listingId]);

  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      showToast("Please log in to leave a review.", "error");
      return;
    }
    if (!newComment.trim()) {
      showToast("Please enter a review comment.", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await addReview({
        listing_id: listingId,
        user_id: currentUser.id,
        rating: newRating,
        comment: newComment,
      });

      setReviews((prev) => [created, ...prev]);
      setNewComment('');
      setIsAddReviewOpen(false);
      showToast("Review submitted successfully!", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoriesScores = [
    { label: 'Cleanliness', score: '5.0' },
    { label: 'Accuracy', score: '4.9' },
    { label: 'Check-in', score: '5.0' },
    { label: 'Communication', score: '5.0' },
    { label: 'Location', score: '4.9' },
    { label: 'Value', score: '4.8' },
  ];

  return (
    <div className="py-8 border-t border-neutral-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2">
          <Star className="w-6 h-6 fill-neutral-900 text-neutral-900" />
          <h2 className="text-2xl font-black text-neutral-900">
            {rating.toFixed(2)} · {reviews.length || reviewsCount} reviews
          </h2>
        </div>

        <button
          onClick={() => setIsAddReviewOpen(true)}
          className="inline-flex items-center gap-2 border border-neutral-900 hover:bg-neutral-50 px-4 py-2.5 rounded-2xl text-xs font-bold text-neutral-900 transition-all self-start sm:self-auto"
        >
          <MessageSquarePlus className="w-4 h-4 text-rose-500" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Ratings Subcategory Bars */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10 pb-8 border-b border-neutral-100">
        {categoriesScores.map((cat) => (
          <div key={cat.label} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100">
            <p className="text-xs font-bold text-neutral-900 mb-1">{cat.label}</p>
            <p className="text-base font-black text-neutral-900">{cat.score}</p>
          </div>
        ))}
      </div>

      {/* Reviews Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reviews.map((r) => (
          <div key={r.id} className="space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={r.user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb'}
                alt={r.user?.name || 'Reviewer'}
                className="w-11 h-11 rounded-full object-cover border border-neutral-200"
              />
              <div>
                <p className="text-sm font-bold text-neutral-900">{r.user?.name || 'Airbnb Guest'}</p>
                <p className="text-xs text-neutral-400">★ {r.rating.toFixed(1)} rating • Recent stay</p>
              </div>
            </div>
            <p className="text-sm text-neutral-700 leading-relaxed">{r.comment}</p>
          </div>
        ))}
      </div>

      {/* Leave Review Modal */}
      {isAddReviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl border border-neutral-200 relative">
            <button
              onClick={() => setIsAddReviewOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-neutral-900 mb-1">Leave a Review</h3>
            <p className="text-xs text-neutral-500 mb-6">Share your stay experience with future guests</p>

            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className={`p-2 text-2xl transition-transform hover:scale-125 ${
                        star <= newRating ? 'text-amber-400' : 'text-neutral-300'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-1">Your Review</label>
                <textarea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Describe cleanliness, accuracy of photos, communication with host..."
                  className="w-full p-3 rounded-2xl border border-neutral-300 focus:ring-2 focus:ring-rose-500 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold py-3.5 rounded-2xl text-sm shadow-md transition-transform active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? 'Posting Review...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
