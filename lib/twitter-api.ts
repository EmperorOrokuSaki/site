// Twitter API client for fetching tweets
// Uses Twitter API v2

type Tweet = {
  id: string
  text: string
  created_at: string
}

type TwitterResponse = {
  data?: Tweet[]
  meta?: {
    result_count: number
    newest_id: string
    oldest_id: string
    next_token?: string
  }
  errors?: Array<{
    title: string
    detail: string
    type: string
  }>
}

export async function fetchRecentTweets(username: string, count = 10): Promise<Tweet[]> {
  // Twitter API requires a bearer token for authentication
  const bearerToken = process.env.TWITTER_BEARER_TOKEN

  if (!bearerToken) {
    console.error("Twitter API bearer token is not configured")
    throw new Error("Twitter API configuration is missing")
  }

  try {
    // Log token format (first few characters) for debugging
    console.log(`Using bearer token: ${bearerToken.substring(0, 5)}...`)

    // Get user ID first (required for v2 API)
    console.log(`Fetching Twitter user data for @${username}...`)
    const userResponse = await fetch(`https://api.twitter.com/2/users/by/username/${username}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
      cache: "no-store", // Ensure we're not using cached responses during debugging
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { raw: errorText }
      }

      console.error("Twitter API user lookup error:", errorData)
      throw new Error(`Twitter API authentication error (${userResponse.status}): Please check your bearer token`)
    }

    const userData = await userResponse.json()

    if (!userData.data || !userData.data.id) {
      console.error("Invalid user data response:", userData)
      throw new Error("Failed to retrieve user ID")
    }

    const userId = userData.data.id
    console.log(`Found user ID: ${userId}`)

    // Fetch recent tweets
    console.log(`Fetching ${count} recent tweets...`)
    const tweetsResponse = await fetch(
      `https://api.twitter.com/2/users/${userId}/tweets?max_results=${count}&tweet.fields=created_at&exclude=retweets,replies`,
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
        },
        cache: "no-store", // Ensure we're not using cached responses during debugging
      },
    )

    if (!tweetsResponse.ok) {
      const errorText = await tweetsResponse.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { raw: errorText }
      }

      console.error("Twitter API tweets lookup error:", errorData)
      throw new Error(`Twitter API error: ${tweetsResponse.status}`)
    }

    const tweetsData: TwitterResponse = await tweetsResponse.json()

    if (!tweetsData.data) {
      console.log("No tweets found or empty response")
      return []
    }

    console.log(`Successfully fetched ${tweetsData.data.length} tweets`)
    return tweetsData.data
  } catch (error) {
    console.error("Error in fetchRecentTweets:", error)
    throw error
  }
}
