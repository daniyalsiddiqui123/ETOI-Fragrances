import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { to, subject, html } = body

    if (!to || !subject || !html) {
      return Response.json(
        { error: 'To, subject, and html body are required' },
        { status: 400 }
      )
    }

    return Response.json({ message: 'Email sent successfully' })
  } catch (error) {
    return Response.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}
