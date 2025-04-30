import { NextResponse } from "next/server"

// Cache the ASCII art in memory to avoid repeated fetches
let cachedAsciiArt: string | null = null
let lastFetchTime = 0
const CACHE_DURATION = 3600000 // 1 hour in milliseconds

export async function GET() {
  const now = Date.now()

  // Return cached ASCII art if available and not expired
  if (cachedAsciiArt && now - lastFetchTime < CACHE_DURATION) {
    return NextResponse.json({ ascii: cachedAsciiArt })
  }

  try {
    const response = await fetch(
      "https://gist.github.com/EmperorOrokuSaki/7afe407cd702a0134dc03366e99f2d3f/raw/2499580714926d39f33266488685ad6b64208653/ascii.txt",
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const text = await response.text()

    // Optimize the ASCII art by removing excessive whitespace
    // This preserves the visual appearance while reducing the size
    const optimizedText = text
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .trim()

    // Update cache
    cachedAsciiArt = optimizedText
    lastFetchTime = now

    return NextResponse.json({ ascii: optimizedText })
  } catch (error) {
    console.error("Error fetching ASCII art:", error)
    return NextResponse.json({ error: "Failed to fetch ASCII art" }, { status: 500 })
  }
}
