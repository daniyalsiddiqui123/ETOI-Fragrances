import { createClient } from '@sanity/client'
import type { Product } from './types'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-11',
  useCdn: false,
})

function mapSanityProduct(p: Record<string, unknown>): Product {
  return {
    id: (p.slug as string) || (p._id as string),
    sanityId: p._id as string,
    name: p.name as string,
    description: p.description as string,
    price: p.price as number,
    category: p.category as 'men' | 'women',
    images: (p.images as string[]) || [],
    rating: (p.rating as number) || 0,
    reviewCount: (p.reviewCount as number) || 0,
    inStock: p.inStock !== false,
    createdAt: '',
  }
}

const SANITY_QUERY = `{
  _id, "slug": slug.current, name, description, price, category,
  "images": images[].asset->url, sku,
  "rating": coalesce(rating, 0),
  "reviewCount": coalesce(reviewCount, 0), inStock
}`

export async function getProducts(category?: string): Promise<Product[]> {
  const filters = ['_type == "product"']
  if (category) filters.push(`category == "${category}"`)
  const query = `*[${filters.join(' && ')}] | order(_createdAt desc) ${SANITY_QUERY}`
  const data = await client.fetch(query)
  if (!data || !Array.isArray(data)) return []
  return data.map(mapSanityProduct)
}

export async function getProductBySlug(slug: string, category?: string): Promise<Product | null> {
  const filters = [`_type == "product"`, `slug.current == "${slug}"`]
  if (category) filters.push(`category == "${category}"`)
  const query = `*[${filters.join(' && ')}][0] ${SANITY_QUERY}`
  const p = await client.fetch(query)
  if (!p) return null
  return mapSanityProduct(p)
}

export async function getRelatedProducts(
  productId: string,
  category: string,
  limit = 4
): Promise<Product[]> {
  const query = `*[_type == "product" && category == $category && _id != $productId][0...$limit] ${SANITY_QUERY}`
  const data = await client.fetch(query, { category, productId, limit })
  if (!data || !Array.isArray(data)) return []
  return data.map(mapSanityProduct)
}

export function urlForImage(source: string): string {
  return source
}

export { client }
