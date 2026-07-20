import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.nextUrl.searchParams.get('sessionId')
    if (!sessionId) {
      return Response.json({ items: [] })
    }
    return Response.json({ items: [] })
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, items } = body

    if (!sessionId || !items) {
      return Response.json(
        { error: 'Session ID and items are required' },
        { status: 400 }
      )
    }

    return Response.json({ items }, { status: 200 })
  } catch (error) {
    return Response.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}
