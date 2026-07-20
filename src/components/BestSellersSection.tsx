'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/types'

interface BestSellersSectionProps {
  products: Product[]
}

export function BestSellersSection({ products }: BestSellersSectionProps) {
  const bestSellers = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating).slice(0, 4),
    [products]
  )

  return (
    <section className="py-24 bg-white/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="section-title">Best Sellers</h2>
          <p className="section-subtitle">
            Our most cherished fragrances, chosen by you
          </p>
        </motion.div>

        <div className="product-grid">
          {bestSellers.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryPath={product.category}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
