'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/lib/types'
import { formatPrice, FREE_DELIVERY_THRESHOLD } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { ReviewSection } from '@/components/ReviewSection'
import { ProductCard } from '@/components/ProductCard'
import { CartNotification } from '@/components/CartNotification'
import { QuantitySelector } from '@/components/QuantitySelector'

interface ProductDetailClientProps {
  product: Product
  category: string
  relatedProducts: Product[]
}

export function ProductDetailClient({
  product,
  category,
  relatedProducts,
}: ProductDetailClientProps) {
  const [mounted, setMounted] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showToast, setShowToast] = useState(false)
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number
    reviewCount: number
  } | null>(null)
  const addItem = useCartStore((s) => s.addItem)

  useEffect(() => setMounted(true), [])

  const fetchReviewStats = useCallback(async () => {
    try {
      const res = await fetch(`/api/reviews/stats?productId=${product.id}`)
      const data = await res.json()
      if (data.averageRating !== undefined) {
        setReviewStats(data)
      }
    } catch {
      // ignore
    }
  }, [product.id])

  useEffect(() => {
    fetchReviewStats()
  }, [fetchReviewStats])

  const displayRating = reviewStats?.averageRating ?? product.rating
  const displayReviewCount = reviewStats?.reviewCount ?? product.reviewCount

  const images =
    product.images.length > 0
      ? product.images
      : ['/images/product-placeholder.svg']

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: images[0],
      price: product.price,
      quantity,
    })
    setShowToast(true)
    setQuantity(1)
  }

  if (!mounted) return null

  return (
    <>
      <section className="pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="mb-6 sm:mb-10">
            <ol className="flex items-center gap-2 text-[10px] sm:text-xs tracking-[0.15em] uppercase text-gray-400">
              <li>
                <Link href="/" className="hover:text-etoi-primary transition-colors">
                  Home
                </Link>
              </li>
              <span>/</span>
              <li>
                <Link
                  href={`/${category}`}
                  className="hover:text-etoi-primary transition-colors"
                >
                  {category === 'men' ? 'Men' : 'Women'}
                </Link>
              </li>
              <span>/</span>
              <li className="text-etoi-primary truncate max-w-[120px] sm:max-w-none">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="max-w-lg mx-auto md:mx-0 w-full"
            >
              <div className="relative aspect-[4/3] sm:aspect-[5/3] md:aspect-[4/3] bg-white/50 overflow-hidden mb-3 sm:mb-4 group">
                <Image
                  src={images[selectedImage] || '/images/product-placeholder.svg'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 35vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImage((p) => (p === 0 ? images.length - 1 : p - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors z-10"
                      aria-label="Previous image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                        <polyline points="15 18 9 12 15 6" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage((p) => (p === images.length - 1 ? 0 : p + 1))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-colors z-10"
                      aria-label="Next image"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="1.5">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                      {images.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(i)}
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all ${
                            i === selectedImage ? 'bg-white w-3 sm:w-4' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 sm:gap-3">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`w-12 h-12 sm:w-16 sm:h-16 overflow-hidden border-2 transition-colors ${
                        i === selectedImage
                          ? 'border-etoi-secondary'
                          : 'border-transparent hover:border-gray-200'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${i + 1}`}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={mounted ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              <div>
                <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-etoi-secondary mb-1 sm:mb-2">
                  {category === 'men' ? 'For Him' : 'For Her'}
                </p>
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-etoi-primary font-light leading-tight">
                  {product.name}
                </h1>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      className="sm:w-4 sm:h-4"
                      fill={i < Math.round(displayRating) ? '#c9a96e' : '#d4d4cc'}
                      stroke={i < Math.round(displayRating) ? '#c9a96e' : '#d4d4cc'}
                      strokeWidth="1"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-gray-400">
                  {displayRating.toFixed(1)} ({displayReviewCount} {displayReviewCount === 1 ? 'review' : 'reviews'})
                </span>
                {product.inStock ? (
                  <span className="text-[9px] sm:text-[10px] text-green-600 bg-green-50 px-2 py-0.5 tracking-[0.1em] uppercase">
                    In Stock
                  </span>
                ) : (
                  <span className="text-[9px] sm:text-[10px] text-red-600 bg-red-50 px-2 py-0.5 tracking-[0.1em] uppercase">
                    Out of Stock
                  </span>
                )}
              </div>

              <p className="text-xl sm:text-2xl text-etoi-primary font-medium">
                {formatPrice(product.price)}
              </p>

              <div className="border-t border-gray-200 pt-4 sm:pt-6">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {(product.topNotes?.length || product.heartNotes?.length || product.baseNotes?.length) && (
                <div className="border-t border-gray-200 pt-4 sm:pt-6">
                  <h3 className="font-serif text-lg text-black font-bold mb-3">Fragrance Notes</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {product.topNotes?.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-etoi-gray mb-1.5">Top</p>
                        <div className="space-y-0.5">
                          {product.topNotes.map((note, i) => (
                            <p key={i} className="text-sm text-etoi-primary">{note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.heartNotes?.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-etoi-gray mb-1.5">Heart</p>
                        <div className="space-y-0.5">
                          {product.heartNotes.map((note, i) => (
                            <p key={i} className="text-sm text-etoi-primary">{note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.baseNotes?.length > 0 && (
                      <div>
                        <p className="text-[10px] tracking-[0.15em] uppercase text-etoi-gray mb-1.5">Base</p>
                        <div className="space-y-0.5">
                          {product.baseNotes.map((note, i) => (
                            <p key={i} className="text-sm text-etoi-primary">{note}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2 sm:pt-4">
                <QuantitySelector
                  quantity={quantity}
                  onIncrease={() => setQuantity((q) => q + 1)}
                  onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                />
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="w-full sm:flex-1 bg-etoi-primary text-white text-xs tracking-[0.15em] uppercase py-3.5 hover:bg-etoi-secondary transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart — {formatPrice(product.price * quantity)}
                </button>
              </div>

              <div className="border-t border-gray-200 pt-4 sm:pt-6 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-4 sm:h-4 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Free shipping within Pakistan for orders above {formatPrice(FREE_DELIVERY_THRESHOLD)}
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-4 sm:h-4 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Cash on Delivery available
                </div>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-500">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="sm:w-4 sm:h-4 shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  100% authentic products
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ReviewSection productId={product.id} onReviewSubmitted={fetchReviewStats} />
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="font-serif text-2xl text-etoi-primary font-light mb-10 text-center">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((rp, i) => (
                <ProductCard
                  key={rp.id}
                  product={rp}
                  categoryPath={category}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <CartNotification
        show={showToast}
        productName={product.name}
        productImage={images[0]}
        onClose={() => setShowToast(false)}
      />
    </>
  )
}
