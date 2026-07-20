import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Valid email is required' }, { status: 400 })
    }

    try {
      const db = await import('@/lib/db')
      await db.saveNewsletterSubscriber(email)
    } catch {
      // DB save failure is non-critical
    }

    try {
      const emailModule = await import('@/lib/email')
      await emailModule.sendNewsletterNotification(email)
    } catch {
      // Email failure is non-critical
    }

    return Response.json(
      { message: 'Subscribed successfully' },
      { status: 201 }
    )
  } catch {
    return Response.json(
      { error: 'Failed to subscribe' },
      { status: 500 }
    )
  }
}
