import { NextResponse } from "next/server"
import type { SiteData } from "@/lib/site-data"

// Cache the data to prevent multiple fetches
let cachedData: SiteData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 300000 // 5 minutes

// The Blob URL provided by the user
const SITE_DATA_URL = "https://fmja5vvgx5vfveeb.public.blob.vercel-storage.com/site.json"

export async function GET() {
  const now = Date.now()

  // Return cached data if it's still valid
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using cached site data")
    return NextResponse.json(cachedData)
  }

  try {
    console.log(`Fetching site data from Blob: ${SITE_DATA_URL}`)

    // Use a direct fetch with no caching to avoid any cache-related issues
    const response = await fetch(SITE_DATA_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Don't use Next.js cache
    })

    // Log detailed response information for debugging
    console.log(`Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status} ${response.statusText}`)
    }

    // Try to parse the response as text first to see if it's valid JSON
    const text = await response.text()
    console.log(`Response body (first 100 chars): ${text.substring(0, 100)}...`)

    try {
      const data = JSON.parse(text) as SiteData
      console.log("Site data fetched and parsed successfully from Blob")

      // Update cache
      cachedData = data
      lastFetchTime = now

      return NextResponse.json(data)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }
  } catch (error) {
    console.error("Error fetching site data from Blob:", error)

    // If we have cached data, return it even if it's expired
    if (cachedData) {
      console.log("Using expired cached data as fallback")
      return NextResponse.json(cachedData)
    }

    // Return an error response with no fallback data
    return NextResponse.json({ error: "Technical difficulty: Unable to fetch site data" }, { status: 500 })
  }
}
