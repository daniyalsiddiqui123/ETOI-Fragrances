import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    if (!name || !email || !subject || !message) {
      return Response.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    if (message.length < 10) {
      return Response.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    try {
      const db = await import('@/lib/db')
      await db.saveContactMessage(name, email, subject, message, phone)
    } catch {
      // DB save failure is non-critical
    }

    try {
      const emailModule = await import('@/lib/email')
      await emailModule.sendContactNotification(name, email, subject, message)
    } catch {
      // Email failure is non-critical
    }

    return Response.json(
      { message: 'Message sent successfully' },
      { status: 201 }
    )
  } catch (error) {
    return Response.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
