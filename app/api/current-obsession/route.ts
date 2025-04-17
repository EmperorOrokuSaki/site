import { xai } from "@ai-sdk/xai"
import { generateText } from "ai"

// Fallback tweets in case the API fails
const FALLBACK_TWEETS = [
  "Just finished watching Dogville. Lars von Trier's masterpiece is haunting and thought-provoking. The minimalist set design creates a powerful theatrical experience.",
  "Reading 'Designing Data-Intensive Applications' again. This book is essential for anyone working on distributed systems.",
  "Experimenting with Rust's async runtime performance. The results are impressive compared to traditional threading models.",
  "Blade Runner 2049 is a visual masterpiece. Denis Villeneuve's attention to detail and Roger Deakins' cinematography create a stunning world.",
  "Working on a new distributed database project. Excited about the challenges of building a consensus algorithm from scratch.",
]

export async function GET() {
  // Always use fallback data for now until we resolve the Twitter API authentication issue
  const tweetText = FALLBACK_TWEETS.join("\n\n")
  const usingFallback = true
  const authError = false

  try {
    console.log("Analyzing tweets with Grok...")
    const result = await generateText({
      model: xai("grok-2"),
      prompt: `Based on these recent tweets, provide a very brief (15-25 words) summary of what this person seems to be currently obsessed with or interested in. Focus on the main themes or patterns. Don't use phrases like "Based on these tweets" or "This person is". Just provide the direct observation in a concise, interesting way.

Tweets:
${tweetText}`,
      maxTokens: 100,
    })

    return Response.json({
      obsession: result.text,
      usingFallback,
      authError,
    })
  } catch (error) {
    console.error("Error analyzing tweets:", error)
    return Response.json(
      {
        error: "Failed to analyze tweets",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
