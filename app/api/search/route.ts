import { NextResponse } from 'next/server'
import { getJson } from 'serpapi'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { query, location }: { query: string; location: string } = await request.json()

    if (!process.env.SERPAPI_KEY) {
      return NextResponse.json(
        { error: 'SERPAPI_KEY is not configured' },
        { status: 500 }
      )
    }

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const params = {
      api_key: process.env.SERPAPI_KEY,
      engine: 'google',
      q: query,
      location_requested: location,
      location_used: location,
      gl: 'us',
      hl: 'en',
    }

    try {
      const results = await getJson(params)
      return NextResponse.json(results)
    } catch (error: unknown) {
      // Check for rate limit error
      if (error instanceof Error && error.message?.toLowerCase().includes('rate limit exceeded')) {
        return NextResponse.json(
          { error: 'rate limit exceeded for model; try again in about an hour' },
          { status: 429 }
        )
      }

      // Handle other SerpAPI errors
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch search results'
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      )
    }
  } catch {
    return NextResponse.json(
      { error: 'Invalid request format' },
      { status: 400 }
    )
  }
}
