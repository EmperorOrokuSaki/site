import { NextResponse } from "next/server"

export async function GET() {
  try {
    const dataSourceUrl = process.env.SITE_DATA_URL

    if (!dataSourceUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "SITE_DATA_URL environment variable is not set",
        },
        { status: 400 },
      )
    }

    // Try to fetch the data to check if it's accessible
    console.log(`Checking site data URL: ${dataSourceUrl}`)

    const response = await fetch(dataSourceUrl, {
      cache: "no-store", // Don't use cache for this check
    })

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch site data: HTTP ${response.status}`,
          url: dataSourceUrl,
        },
        { status: response.status },
      )
    }

    // Try to parse the JSON to make sure it's valid
    try {
      const data = await response.json()

      // Check if the data has the expected structure
      const hasRequiredFields =
        data.name &&
        data.tagline &&
        Array.isArray(data.about) &&
        Array.isArray(data.projects) &&
        Array.isArray(data.blogPosts)

      if (!hasRequiredFields) {
        return NextResponse.json(
          {
            success: false,
            error: "Site data is missing required fields",
            url: dataSourceUrl,
          },
          { status: 400 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Site data URL is valid and accessible",
        url: dataSourceUrl,
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to parse site data as JSON",
          url: dataSourceUrl,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Error checking site data:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
