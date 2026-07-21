'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { useCartStore } from '@/store/cartStore'
import { CartNotification } from '@/components/CartNotification'

interface ProductCardProps {
  product: Product
  categoryPath: string
  index?: number
}

export function ProductCard({ product, categoryPath, index = 0 }: ProductCardProps) {
  const [showToast, setShowToast] = useState(false)
  const [imgError, setImgError] = useState(false)
  const addItem = useCartStore((s) => s.addItem)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] || '/images/product-placeholder.svg',
      price: product.price,
      quantity: 1,
    })
    setShowToast(true)
  }

  const imageSrc =
    !imgError && product.images[0]
      ? product.images[0]
      : '/images/product-placeholder.svg'

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="group">
          <Link
            href={`/${categoryPath}/${product.id}`}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-white/50 mb-4">
              <Image
                src={imageSrc}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              <div className="absolute top-3 left-3">
                {product.rating >= 4.8 && (
                  <span className="bg-etoi-secondary text-white text-[10px] px-2 py-1 tracking-[0.1em] uppercase font-medium">
                    Best Seller
                  </span>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <span className="bg-white/90 backdrop-blur-sm text-etoi-primary text-xs tracking-[0.15em] uppercase px-6 py-3">
                  Quick View
                </span>
              </div>
            </div>
          </Link>
          <div className="space-y-2">
            <Link
              href={`/${categoryPath}/${product.id}`}
            >
              <h3 className="font-serif text-lg text-etoi-primary group-hover:text-etoi-secondary transition-colors duration-300">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={i < Math.round(product.rating) ? '#c9a96e' : '#d4d4cc'}
                    stroke={i < Math.round(product.rating) ? '#c9a96e' : '#d4d4cc'}
                    strokeWidth="1"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.reviewCount})</span>
            </div>
            <p className="text-sm text-etoi-primary font-medium tracking-wide">
              {formatPrice(product.price)}
            </p>
            <button
              onClick={handleAddToCart}
              className="w-full bg-etoi-primary text-white text-xs tracking-[0.15em] uppercase py-3 hover:bg-etoi-secondary transition-colors duration-300"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
      <CartNotification
        show={showToast}
        productName={product.name}
        productImage={imageSrc}
        onClose={() => setShowToast(false)}
      />
    </>
  )
}
