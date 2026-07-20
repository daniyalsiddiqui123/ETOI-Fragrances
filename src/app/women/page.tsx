import type { Metadata } from 'next'
import { ProductsPageClient } from '@/components/ProductsPageClient'
import { getProducts } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Women\'s Fragrances',
  description:
    'Discover our collection of premium women\'s fragrances. From delicate florals to warm orientals, find your perfect scent.',
  openGraph: {
    title: 'Women\'s Fragrances | ÉTOI',
    description: 'Discover our collection of premium women\'s fragrances.',
  },
}

export default async function WomenPage() {
  const womenProducts = await getProducts('women')

  return (
    <ProductsPageClient
      products={womenProducts}
      category="women"
      title="Women's Collection"
      subtitle="Elegance captured in every note"
    />
  )
}
