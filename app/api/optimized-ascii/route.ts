import { NextResponse } from "next/server"

// Cache the ASCII art to prevent multiple fetches
let cachedAscii: string | null = null
let lastFetchTime = 0
const CACHE_DURATION = 3600000 // 1 hour

// The Blob URL provided by the user
const ASCII_URL = "https://fmja5vvgx5vfveeb.public.blob.vercel-storage.com/ascii.txt"

export async function GET() {
  const now = Date.now()

  // Return cached ASCII art if it's still valid
  if (cachedAscii && now - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json({ ascii: cachedAscii })
  }

  try {
    console.log(`Fetching ASCII art from: ${ASCII_URL}`)
    const response = await fetch(ASCII_URL, {
      cache: "no-store", // Don't use browser cache
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ASCII art: ${response.status}`)
    }

    const text = await response.text()

    // Update cache
    cachedAscii = text
    lastFetchTime = now

    return NextResponse.json({ ascii: text })
  } catch (error) {
    console.error("Error fetching ASCII art:", error)
    return NextResponse.json({ error: "Failed to load ASCII art" }, { status: 500 })
  }
}
