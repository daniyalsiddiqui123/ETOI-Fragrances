import { NextRequest } from 'next/server'

function asRows(result: unknown): Record<string, unknown>[] {
  if (Array.isArray(result)) return result as Record<string, unknown>[]
  const r = result as { rows: Record<string, unknown>[] }
  if (r && Array.isArray(r.rows)) return r.rows
  return []
}

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get('productId')
    const sort = request.nextUrl.searchParams.get('sort') || 'newest'

    if (!productId) {
      return Response.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const db = await import('@/lib/db')
    await db.initializeDatabase()
    const s = db.sql()

    let orderClause = 'created_at DESC'
    if (sort === 'highest') orderClause = 'rating DESC, created_at DESC'
    else if (sort === 'lowest') orderClause = 'rating ASC, created_at DESC'

    const result = await s.query(
      `SELECT * FROM reviews WHERE product_id = $1 ORDER BY ${orderClause}`,
      [productId]
    )

    const reviews = asRows(result).map((row) => ({
      id: row.id as string,
      productId: row.product_id as string,
      rating: row.rating as number,
      reviewerName: row.reviewer_name as string,
      reviewerEmail: row.reviewer_email as string,
      comment: row.comment as string,
      createdAt: (row.created_at as string) || new Date().toISOString(),
      verified: (row.verified as boolean) || false,
    }))

    return Response.json({ reviews })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, rating, reviewerName, reviewerEmail, comment } = body

    if (!productId || !rating || !reviewerName || !reviewerEmail || !comment) {
      return Response.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return Response.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reviewerEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (comment.length < 10) {
      return Response.json(
        { error: 'Review comment must be at least 10 characters' },
        { status: 400 }
      )
    }

    const db = await import('@/lib/db')
    await db.initializeDatabase()
    const s = db.sql()

    const result = await s.query(
      'INSERT INTO reviews (product_id, rating, reviewer_name, reviewer_email, comment) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [productId, rating, reviewerName, reviewerEmail, comment]
    )

    const row = asRows(result)[0]
    const review = {
      id: row.id as string,
      productId: row.product_id as string,
      rating: row.rating as number,
      reviewerName: row.reviewer_name as string,
      reviewerEmail: row.reviewer_email as string,
      comment: row.comment as string,
      createdAt: (row.created_at as string) || new Date().toISOString(),
      verified: (row.verified as boolean) || false,
    }

    return Response.json({ review }, { status: 201 })
  } catch (error) {
    return Response.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
