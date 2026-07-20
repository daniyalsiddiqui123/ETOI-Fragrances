import { NextRequest } from 'next/server'
import { generateOrderNumber } from '@/lib/utils'
import type { CartItem } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      items,
      subtotal,
      delivery,
      total,
      paymentMethod,
    } = body

    if (!customerName || !customerEmail || !customerPhone || !address || !city || !items || !paymentMethod) {
      return Response.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    if (!Array.isArray(items) || items.length === 0) {
      return Response.json(
        { error: 'Order must contain at least one item' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (!['cod', 'bank_transfer'].includes(paymentMethod)) {
      return Response.json({ error: 'Invalid payment method' }, { status: 400 })
    }

    const orderNumber = generateOrderNumber()

    const db = await import('@/lib/db')
    const order = await db.createOrder({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      address,
      city,
      items: items as CartItem[],
      subtotal: Number(subtotal),
      delivery: Number(delivery),
      total: Number(total),
      paymentMethod: paymentMethod as 'cod' | 'bank_transfer',
    })

    try {
      const email = await import('@/lib/email')
      await email.sendOrderConfirmation(order)
      await email.sendOrderNotification(order)
    } catch {
      // Email failure is non-critical
    }

    return Response.json(
      { order, emailSent: true },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
