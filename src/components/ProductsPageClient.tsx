'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ProductGrid } from '@/components/ProductGrid'
import type { Product } from '@/lib/types'

interface ProductsPageClientProps {
  products: Product[]
  category: string
  title: string
  subtitle: string
}

export function ProductsPageClient({
  products,
  category,
  title,
  subtitle,
}: ProductsPageClientProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <>
      <section className="relative pt-32 pb-20 bg-white">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 50% 50%, #c9a96e 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={mounted ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-etoi-secondary text-xs tracking-[0.3em] uppercase mb-4 text-center sm:text-left">
              {category === 'men' ? 'For Him' : 'For Her'}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-etoi-primary font-light mb-4">
              {title}
            </h1>
            <p className="text-etoi-gray text-sm max-w-lg">
              {subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ProductGrid products={products} categoryPath={category} />
        </div>
      </section>
    </>
  )
}
