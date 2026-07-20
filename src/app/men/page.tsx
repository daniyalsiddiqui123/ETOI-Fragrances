import type { Metadata } from 'next'
import { ProductsPageClient } from '@/components/ProductsPageClient'
import { getProducts } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Men\'s Fragrances',
  description:
    'Explore our collection of premium men\'s fragrances. From woody ouds to fresh aquatics, find your signature scent.',
  openGraph: {
    title: 'Men\'s Fragrances | ÉTOI',
    description: 'Explore our collection of premium men\'s fragrances.',
  },
}

export default async function MenPage() {
  const menProducts = await getProducts('men')

  return (
    <ProductsPageClient
      products={menProducts}
      category="men"
      title="Men's Collection"
      subtitle="Fragrances that define character and confidence"
    />
  )
}
