import { NextRequest } from 'next/server'
import { getProductReviewStats } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId')
    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const stats = await getProductReviewStats(productId)
    return Response.json(stats)
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch review stats' },
      { status: 500 }
    )
  }
}
