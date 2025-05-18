import { NextResponse } from "next/server"

// The Blob URL provided by the user
const ASCII_URL = "https://fmja5vvgx5vfveeb.public.blob.vercel-storage.com/ascii.txt"

export async function GET() {
  try {
    const response = await fetch(ASCII_URL, {
      cache: "no-store", // Don't use browser cache
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch ASCII art: ${response.status}`)
    }

    const text = await response.text()
    return NextResponse.json({ ascii: text })
  } catch (error) {
    console.error("Error fetching ASCII art:", error)
    return NextResponse.json({ error: "Failed to load ASCII art" }, { status: 500 })
  }
}
