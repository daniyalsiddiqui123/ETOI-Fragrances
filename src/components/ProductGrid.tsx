'use client'

import { ProductCard } from '@/components/ProductCard'
import type { Product } from '@/lib/types'

interface ProductGridProps {
  products: Product[]
  categoryPath: string
}

export function ProductGrid({ products, categoryPath }: ProductGridProps) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-10">
        {products.length} {products.length === 1 ? 'product' : 'products'}
      </p>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-sm tracking-[0.15em] uppercase">
            No products available
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryPath={categoryPath}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  )
}
