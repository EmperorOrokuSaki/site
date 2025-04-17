export async function GET() {
  try {
    // Check if the Twitter bearer token is set
    const bearerToken = process.env.TWITTER_BEARER_TOKEN

    if (!bearerToken) {
      return Response.json(
        {
          success: false,
          error: "Twitter bearer token is not configured",
        },
        { status: 500 },
      )
    }

    // Return token info (first few characters) for debugging
    return Response.json({
      success: true,
      tokenInfo: {
        length: bearerToken.length,
        prefix: bearerToken.substring(0, 5) + "...",
        isValid: bearerToken.length > 50, // Most bearer tokens are longer than 50 chars
      },
      message: "Bearer token is present. Check server logs for more details.",
    })
  } catch (error) {
    console.error("Twitter API test failed:", error)
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
