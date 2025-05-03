import { type NextRequest, NextResponse } from "next/server"
import { fetchSiteData, blogPostsToRecord } from "@/lib/site-data"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { slug } = params

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }

  try {
    // Fetch all site data
    const siteData = await fetchSiteData()

    // Convert blog posts to a record for easy lookup
    const blogPosts = blogPostsToRecord(siteData.blogPosts)

    // Find the requested blog post
    const post = blogPosts[slug]

    if (!post) {
      return NextResponse.json({ error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error)
    return NextResponse.json({ error: "Failed to fetch blog post" }, { status: 500 })
  }
}
