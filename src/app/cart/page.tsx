'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, calculateDelivery, calculateTotal, FREE_DELIVERY_THRESHOLD } from '@/lib/utils'
import { QuantitySelector } from '@/components/QuantitySelector'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore()

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const subtotal = getSubtotal()
  const delivery = calculateDelivery(subtotal)
  const total = calculateTotal(subtotal)

  if (items.length === 0) {
    return (
      <section className="pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-8">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h1 className="font-serif text-3xl text-etoi-primary font-light mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
              It looks like you haven&apos;t added anything to your cart yet.
              Explore our collections and find your perfect fragrance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/men" className="btn-primary">
                Shop Men
              </Link>
              <Link href="/women" className="btn-secondary">
                Shop Women
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-3xl text-etoi-primary font-light mb-2">
            Shopping Cart
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item, i) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 bg-white/50 border border-gray-100"
              >
                {/* Mobile: two-row layout */}
                <div className="sm:hidden">
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-20 bg-gray-50 flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.productImage || '/images/product-placeholder.svg'}
                        alt={item.productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/men/${item.productId}`}
                        className="font-serif text-sm text-etoi-primary hover:text-etoi-secondary transition-colors line-clamp-1"
                      >
                        {item.productName}
                      </Link>
                      <p className="text-sm text-etoi-primary font-medium mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-gray-300 hover:text-red-500 transition-colors shrink-0"
                      aria-label={`Remove ${item.productName}`}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <QuantitySelector
                      quantity={item.quantity}
                      onIncrease={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      onDecrease={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    />

                    <p className="text-sm text-etoi-primary font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                {/* Tablet & Desktop: single-row layout */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="relative w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.productImage || '/images/product-placeholder.svg'}
                      alt={item.productName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/men/${item.productId}`}
                      className="font-serif text-sm text-etoi-primary hover:text-etoi-secondary transition-colors line-clamp-1"
                    >
                      {item.productName}
                    </Link>
                    <p className="text-sm text-etoi-primary font-medium mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <QuantitySelector
                    quantity={item.quantity}
                    onIncrease={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    onDecrease={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  />

                  <p className="text-sm text-etoi-primary font-medium w-24 text-right">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/50 border border-gray-100 p-6 space-y-4 sticky top-28">
              <h3 className="font-serif text-lg text-etoi-primary border-b border-gray-200 pb-3">
                Order Summary
              </h3>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Delivery</span>
                  <span className={delivery === 0 ? 'text-green-600' : 'text-gray-500'}>
                    {delivery === 0 ? 'Free' : formatPrice(delivery)}
                  </span>
                </div>
                {subtotal < FREE_DELIVERY_THRESHOLD && (
                  <p className="text-[11px] text-gray-400 -mt-1">
                    Free delivery on orders over {formatPrice(FREE_DELIVERY_THRESHOLD)}
                  </p>
                )}
                <div className="flex justify-between text-base text-etoi-primary font-medium border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full bg-etoi-primary text-white text-xs tracking-[0.15em] uppercase py-4 text-center hover:bg-etoi-secondary transition-colors duration-300"
              >
                Proceed to Checkout
              </Link>

              <Link
                href="/"
                className="block w-full text-center text-xs tracking-[0.15em] uppercase text-gray-400 hover:text-etoi-primary py-3 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
