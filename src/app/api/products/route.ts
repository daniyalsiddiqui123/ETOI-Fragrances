import { NextRequest } from 'next/server'
import { getProducts, getProductBySlug, client } from '@/lib/sanity'
import type { Product } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    const category = request.nextUrl.searchParams.get('category')
    const id = request.nextUrl.searchParams.get('id')

    if (id) {
      const query = `*[_type == "product" && _id == $id][0] {
        _id,
        name,
        description,
        price,
        category,
        "images": images[].asset->url,
        sku,
        "rating": coalesce(rating, 0),
        "reviewCount": coalesce(reviewCount, 0),
        inStock
      }`
      const product = await client.fetch(query, { id })
      if (!product) {
        return Response.json({ error: 'Product not found' }, { status: 404 })
      }
      return Response.json({ product })
    }

    const cat = category === 'men' || category === 'women' ? category : undefined
    const products = await getProducts(cat)

    return Response.json({ products })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
