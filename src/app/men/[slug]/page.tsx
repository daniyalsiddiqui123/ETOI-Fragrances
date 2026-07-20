import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/ProductDetailClient'
import { getProductBySlug, getRelatedProducts } from '@/lib/sanity'

export const dynamic = 'force-dynamic'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug, 'men')

  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | ÉTOI Men`,
      description: product.description,
      images: product.images,
    },
  }
}

export default async function MenProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug, 'men')

  if (!product) {
    notFound()
  }

  const related = await getRelatedProducts(product.sanityId, 'men')

  return (
    <ProductDetailClient
      product={product}
      category="men"
      relatedProducts={related}
    />
  )
}
