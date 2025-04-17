import { NextResponse } from "next/server"

export async function GET() {
  const SITE_DATA_URL =
    "https://raw.githubusercontent.com/EmperorOrokuSaki/EmperorOrokuSaki.github.io/refs/heads/main/site.json"

  try {
    console.log(`Debugging site data URL: ${SITE_DATA_URL}`)

    const response = await fetch(SITE_DATA_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
    })

    // Return detailed information about the response
    const responseInfo = {
      url: SITE_DATA_URL,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok,
    }

    // Try to get the response body
    let body = null
    let bodyError = null

    try {
      // Try to get the first 500 characters of the response
      const text = await response.text()
      body = text.substring(0, 500) + (text.length > 500 ? "..." : "")
    } catch (error) {
      bodyError = error instanceof Error ? error.message : String(error)
    }

    return NextResponse.json({
      success: response.ok,
      response: responseInfo,
      body,
      bodyError,
      message: response.ok
        ? "Successfully fetched data from URL"
        : `Failed to fetch data: ${response.status} ${response.statusText}`,
    })
  } catch (error) {
    console.error("Error debugging site data:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
