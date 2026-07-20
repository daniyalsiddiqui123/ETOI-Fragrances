'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Review } from '@/lib/types'
import { formatDate } from '@/lib/utils'

interface ReviewSectionProps {
  productId: string
  onReviewSubmitted?: () => void
}

export function ReviewSection({ productId, onReviewSubmitted }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest')
  const [formData, setFormData] = useState({
    rating: 5,
    reviewerName: '',
    reviewerEmail: '',
    comment: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}&sort=${sortBy}`)
      const data = await res.json()
      setReviews(data.reviews || [])
    } catch {
      setReviews([])
    } finally {
      setLoading(false)
    }
  }, [productId, sortBy])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!formData.reviewerName.trim()) errors.reviewerName = 'Name is required'
    if (!formData.reviewerEmail.trim()) errors.reviewerEmail = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.reviewerEmail)) errors.reviewerEmail = 'Invalid email address'
    if (!formData.comment.trim()) errors.comment = 'Review comment is required'
    else if (formData.comment.trim().length < 10) errors.comment = 'Review must be at least 10 characters'
    if (formData.rating < 1 || formData.rating > 5) errors.rating = 'Rating must be between 1 and 5'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit review')
      setSubmitSuccess(true)
      setShowForm(false)
      setFormData({ rating: 5, reviewerName: '', reviewerEmail: '', comment: '' })
      fetchReviews()
      onReviewSubmitted?.()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'highest') return b.rating - a.rating
    return a.rating - b.rating
  })

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-24 w-full" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-xl text-etoi-primary">
            Customer Reviews
          </h3>
          {reviews.length > 0 && (
            <div className="flex items-center gap-3 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill={i < Math.round(averageRating) ? '#c9a96e' : '#d4d4cc'}
                    stroke={i < Math.round(averageRating) ? '#c9a96e' : '#d4d4cc'}
                    strokeWidth="1"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'highest' | 'lowest')}
            className="text-xs tracking-[0.15em] uppercase bg-transparent border border-gray-200 px-3 py-2 text-gray-500 focus:outline-none focus:border-etoi-primary"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-xs tracking-[0.15em] uppercase bg-etoi-primary text-white px-4 py-2 hover:bg-etoi-secondary transition-colors duration-300"
          >
            Write a Review
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 space-y-4 overflow-hidden"
          >
            <div>
              <label className="block text-xs tracking-[0.15em] uppercase text-gray-500 mb-2">
                Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="transition-transform hover:scale-110"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={star <= formData.rating ? '#c9a96e' : '#d4d4cc'}
                      stroke={star <= formData.rating ? '#c9a96e' : '#d4d4cc'}
                      strokeWidth="1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
              {formErrors.rating && (
                <p className="text-red-500 text-xs mt-1">{formErrors.rating}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name *"
                  value={formData.reviewerName}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewerName: e.target.value })
                  }
                  className="w-full bg-transparent border border-gray-200 px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none focus:border-etoi-primary transition-colors"
                />
                {formErrors.reviewerName && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.reviewerName}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email *"
                  value={formData.reviewerEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, reviewerEmail: e.target.value })
                  }
                  className="w-full bg-transparent border border-gray-200 px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none focus:border-etoi-primary transition-colors"
                />
                {formErrors.reviewerEmail && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.reviewerEmail}</p>
                )}
              </div>
            </div>

            <div>
              <textarea
                placeholder="Write your review *"
                rows={4}
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full bg-transparent border border-gray-200 px-4 py-3 text-sm text-etoi-primary placeholder-gray-400 focus:outline-none focus:border-etoi-primary transition-colors resize-none"
              />
              {formErrors.comment && (
                <p className="text-red-500 text-xs mt-1">{formErrors.comment}</p>
              )}
            </div>

            {submitError && (
              <p className="text-red-500 text-sm">{submitError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-etoi-primary text-white text-xs tracking-[0.15em] uppercase px-6 py-3 hover:bg-etoi-secondary transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-etoi-primary px-6 py-3 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {submitSuccess && (
        <div className="bg-green-50 border border-green-200 p-4 text-sm text-green-700">
          Your review has been submitted successfully!
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="text-center py-12 bg-white/50">
          <p className="text-gray-400 text-sm">
            No reviews yet. Be the first to review this product.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 p-6 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-serif text-sm font-medium text-etoi-primary">
                      {review.reviewerName}
                    </span>
                    {review.verified && (
                      <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill={i < review.rating ? '#c9a96e' : '#d4d4cc'}
                        stroke={i < review.rating ? '#c9a96e' : '#d4d4cc'}
                        strokeWidth="1"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {review.comment}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
