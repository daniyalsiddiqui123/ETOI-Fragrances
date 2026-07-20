import { neon, NeonQueryFunction } from '@neondatabase/serverless'
import type { Review, Order, CartItem } from './types'

let _sql: NeonQueryFunction<boolean, boolean> | null = null
let _initialized = false

function getSql(): NeonQueryFunction<boolean, boolean> {
  if (!_sql) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    _sql = neon(connectionString)
  }
  return _sql
}

async function ensureDb(): Promise<void> {
  if (_initialized) return
  _initialized = true
  try {
    const s = getSql()
    await s`CREATE TABLE IF NOT EXISTS reviews (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      product_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      reviewer_name TEXT NOT NULL,
      reviewer_email TEXT NOT NULL,
      comment TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      verified BOOLEAN DEFAULT FALSE
    )`
    await s`CREATE TABLE IF NOT EXISTS orders (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_number TEXT UNIQUE NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      address TEXT NOT NULL,
      city TEXT NOT NULL,
      items JSONB NOT NULL,
      subtotal DECIMAL(10,2) NOT NULL,
      delivery DECIMAL(10,2) NOT NULL DEFAULT 0,
      total DECIMAL(10,2) NOT NULL,
      payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bank_transfer')),
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    try { await s`ALTER TABLE orders RENAME COLUMN tax TO delivery` } catch {}
    await s`CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
    await s`CREATE TABLE IF NOT EXISTS contacts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`
  } catch {
    _initialized = false
  }
}

function asRows(result: unknown): Record<string, unknown>[] {
  if (Array.isArray(result)) return result as Record<string, unknown>[]
  const r = result as { rows: Record<string, unknown>[] }
  if (r && Array.isArray(r.rows)) return r.rows
  return []
}

export async function initializeDatabase(): Promise<void> {
  await ensureDb()
}

export async function getReviewsForProduct(productId: string): Promise<Review[]> {
  await ensureDb()
  const s = getSql()
  const result = await s`
    SELECT * FROM reviews WHERE product_id = ${productId} ORDER BY created_at DESC
  `
  return asRows(result).map((row) => ({
    id: row.id as string,
    productId: row.product_id as string,
    rating: row.rating as number,
    reviewerName: row.reviewer_name as string,
    reviewerEmail: row.reviewer_email as string,
    comment: row.comment as string,
    createdAt: (row.created_at as string) || new Date().toISOString(),
    verified: (row.verified as boolean) || false,
  }))
}

export async function createReview(productId: string, rating: number, reviewerName: string, reviewerEmail: string, comment: string): Promise<Review> {
  await ensureDb()
  const s = getSql()
  const result = await s`
    INSERT INTO reviews (product_id, rating, reviewer_name, reviewer_email, comment)
    VALUES (${productId}, ${rating}, ${reviewerName}, ${reviewerEmail}, ${comment})
    RETURNING *
  `
  const row = asRows(result)[0]
  return {
    id: row.id as string,
    productId: row.product_id as string,
    rating: row.rating as number,
    reviewerName: row.reviewer_name as string,
    reviewerEmail: row.reviewer_email as string,
    comment: row.comment as string,
    createdAt: (row.created_at as string) || new Date().toISOString(),
    verified: (row.verified as boolean) || false,
  }
}

export async function createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Promise<Order> {
  await ensureDb()
  const s = getSql()
  const result = await s`
    INSERT INTO orders (
      order_number, customer_name, customer_email, customer_phone,
      address, city, items, subtotal, delivery, total, payment_method
    ) VALUES (
      ${order.orderNumber}, ${order.customerName}, ${order.customerEmail},
      ${order.customerPhone}, ${order.address}, ${order.city},
      ${JSON.stringify(order.items)}::jsonb, ${order.subtotal},
      ${order.delivery}, ${order.total}, ${order.paymentMethod}
    )
    RETURNING *
  `
  const row = asRows(result)[0]
  return {
    id: row.id as string,
    orderNumber: row.order_number as string,
    customerName: row.customer_name as string,
    customerEmail: row.customer_email as string,
    customerPhone: row.customer_phone as string,
    address: row.address as string,
    city: row.city as string,
    items: row.items as CartItem[],
    subtotal: Number(row.subtotal),
    delivery: Number(row.delivery),
    total: Number(row.total),
    paymentMethod: row.payment_method as 'cod' | 'bank_transfer',
    status: (row.status as Order['status']) || 'pending',
    createdAt: (row.created_at as string) || new Date().toISOString(),
  }
}

export async function saveNewsletterSubscriber(email: string): Promise<{ success: boolean; alreadyExists: boolean }> {
  await ensureDb()
  const s = getSql()
  try {
    await s`INSERT INTO newsletter_subscribers (email) VALUES (${email})`
    return { success: true, alreadyExists: false }
  } catch {
    return { success: true, alreadyExists: true }
  }
}

export async function saveContactMessage(name: string, email: string, subject: string, message: string, phone?: string): Promise<void> {
  await ensureDb()
  const s = getSql()
  await s`
    INSERT INTO contacts (name, email, phone, subject, message)
    VALUES (${name}, ${email}, ${phone || null}, ${subject}, ${message})
  `
}

export async function getProductReviewStats(productId: string): Promise<{ averageRating: number; reviewCount: number }> {
  await ensureDb()
  const s = getSql()
  const result = await s`
    SELECT COALESCE(AVG(rating), 0) as average_rating, COUNT(*) as review_count
    FROM reviews WHERE product_id = ${productId}
  `
  const row = asRows(result)[0]
  return {
    averageRating: Number(row?.average_rating) || 0,
    reviewCount: Number(row?.review_count) || 0,
  }
}

export function sql(): NeonQueryFunction<boolean, boolean> {
  return getSql()
}
