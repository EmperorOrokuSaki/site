import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch(
      "https://gist.github.com/EmperorOrokuSaki/7afe407cd702a0134dc03366e99f2d3f/raw/2499580714926d39f33266488685ad6b64208653/ascii.txt",
      { next: { revalidate: 3600 } }, // Cache for 1 hour
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const text = await response.text()
    return NextResponse.json({ ascii: text })
  } catch (error) {
    console.error("Error fetching ASCII art:", error)
    return NextResponse.json({ error: "Failed to fetch ASCII art" }, { status: 500 })
  }
}
