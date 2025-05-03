import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { fetchSiteData, blogPostsToRecord, type BlogPost } from "@/lib/site-data"
import { BlogNavigation } from "@/components/blog-navigation"
import { ReadingTime } from "@/components/reading-time"
import { ThemeToggle } from "@/components/theme-toggle"

// Completely rewrite the dynamic directive to ensure no hidden characters
export const dynamic = "force-dynamic"

// Helper function to process links in markdown content
function processLinks(content: string): string {
  // Replace markdown links with special markers we can process later
  // Format: [link text](url) -> [link text](url|external)
  return content.replace(/\[([^\]]+)\]$$([^)]+)$$/g, (match, text, url) => {
    // Check if it's an external link
    if (url.startsWith("http") || url.startsWith("www")) {
      return `[${text}](${url}|external)`
    }
    return match
  })
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Fetch site data - will throw an error if it fails
  let blogPosts: Record<string, BlogPost> = {}
  let error: Error | null = null
  let authorName = "nima" // Default author name

  try {
    const siteData = await fetchSiteData()
    blogPosts = blogPostsToRecord(siteData.blogPosts)
    authorName = siteData.name?.toLowerCase() || "nima"
  } catch (err) {
    error = err instanceof Error ? err : new Error("Unknown error fetching site data")
    console.error("Error fetching site data:", error)

    // Return error page
    return (
      <div className="min-h-screen p-2 sm:p-4">
        <div className="container mx-auto max-w-4xl">
          <header className="flex items-center border-b border-theme pb-3 sm:pb-4">
            <Link href="/writings" className="text-theme-secondary hover:text-theme-primary flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm sm:text-base">cd ../</span>
            </Link>
          </header>
          <main className="py-4 sm:py-8">
            <div className="border border-red-700 p-3 sm:p-4 bg-red-900/20">
              <h1 className="text-lg sm:text-xl text-red-400 mb-2 sm:mb-4">Error Loading Blog Post</h1>
              <p className="mb-2 sm:mb-4 text-sm sm:text-base">{error.message}</p>
              <p className="text-sm sm:text-base">Please check the site data URL and try again.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/writings"
                  className="border border-theme px-3 py-1 sm:px-4 sm:py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
                >
                  Return to writings
                </Link>
                <Link
                  href="/"
                  className="border border-theme px-3 py-1 sm:px-4 sm:py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
                >
                  Return to home
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  const post = blogPosts[slug]

  if (!post) {
    return (
      <div className="min-h-screen p-2 sm:p-4">
        <div className="container mx-auto max-w-4xl">
          <header className="flex items-center border-b border-theme pb-3 sm:pb-4">
            <Link href="/writings" className="text-theme-secondary hover:text-theme-primary flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm sm:text-base">cd ../</span>
            </Link>
          </header>
          <main className="py-4 sm:py-8">
            <div className="border border-theme p-3 sm:p-4">
              <h1 className="text-lg sm:text-xl text-theme-secondary mb-2 sm:mb-4">Error 404: File Not Found</h1>
              <p className="text-sm sm:text-base mb-4">The requested blog post does not exist.</p>
              <div className="mt-4">
                <Link
                  href="/writings"
                  className="border border-theme px-3 py-1 sm:px-4 sm:py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
                >
                  Return to writings
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Process content to handle links
  const processedContent = post.content ? processLinks(post.content) : ""

  // Function to render markdown-like content
  const renderContent = (content: string) => {
    if (!content) return null

    // Split content by line
    const lines = content.split("\n")

    // Track if we're inside a code block
    let inCodeBlock = false
    let codeContent = ""

    // Process each line
    return lines.map((line, i) => {
      // Handle code blocks
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // End of code block
          const codeResult = (
            <pre
              key={`code-${i}`}
              className="bg-gray-200 dark:bg-black border border-theme p-2 sm:p-4 my-3 sm:my-4 overflow-x-auto text-xs sm:text-sm"
            >
              <code>{codeContent}</code>
            </pre>
          )
          inCodeBlock = false
          codeContent = ""
          return codeResult
        } else {
          // Start of code block
          inCodeBlock = true
          return null
        }
      }

      if (inCodeBlock) {
        codeContent += line + "\n"
        return null
      }

      // Handle links - look for our special marker format: [text](url|external)
      const linkRegex = /\[([^\]]+)\]$$([^|)]+)(?:\|external)?$$/g
      let match
      let lastIndex = 0
      const parts = []

      while ((match = linkRegex.exec(line)) !== null) {
        // Add text before the link
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index))
        }

        const [fullMatch, text, url] = match
        const isExternal = fullMatch.includes("|external")

        // Add the link with appropriate attributes
        if (isExternal) {
          parts.push(
            <a
              key={`link-${i}-${match.index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-theme-secondary hover:underline"
            >
              {text}
            </a>,
          )
        } else {
          parts.push(
            <Link key={`link-${i}-${match.index}`} href={url} className="text-theme-secondary hover:underline">
              {text}
            </Link>,
          )
        }

        lastIndex = match.index + fullMatch.length
      }

      // Add any remaining text
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex))
      }

      // Handle headings
      if (line.startsWith("# ")) {
        return (
          <h1 key={i} className="text-lg sm:text-xl text-theme-secondary mt-4 sm:mt-6 mb-2 sm:mb-4">
            {parts.length > 0 ? parts : line.substring(2)}
          </h1>
        )
      } else if (line.startsWith("## ")) {
        return (
          <h2 key={i} className="text-base sm:text-lg text-theme-secondary mt-3 sm:mt-5 mb-2 sm:mb-3">
            {parts.length > 0 ? parts : line.substring(3)}
          </h2>
        )
      } else if (line.startsWith("### ")) {
        return (
          <h3 key={i} className="text-sm sm:text-base text-theme-secondary mt-2 sm:mt-4 mb-1 sm:mb-2">
            {parts.length > 0 ? parts : line.substring(4)}
          </h3>
        )
      } else if (line === "") {
        return <br key={i} />
      } else {
        return (
          <p key={i} className="my-2 text-sm sm:text-base">
            {parts.length > 0 ? parts : line}
          </p>
        )
      }
    })
  }

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-theme pb-3 sm:pb-4">
          <Link href="/writings" className="text-theme-secondary hover:text-theme-primary flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm sm:text-base">cd ~/{authorName}/writings</span>
          </Link>
          <ThemeToggle />
        </header>
        <main className="py-4 sm:py-8">
          <article className="border border-theme">
            <div className="border-b border-theme bg-gray-300/20 dark:bg-green-900/20 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-1 sm:mb-2">
                <div className="text-xs">{post.date}</div>
                {post.content && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-theme-muted" />
                    <ReadingTime content={post.content} />
                  </div>
                )}
              </div>
              <h1 className="text-lg sm:text-xl text-theme-secondary">{post.title}</h1>
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 sm:mt-4">
                {(post.tags || []).map((tag) => (
                  <span key={tag} className="border border-theme px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 sm:p-4">
              <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black prose-pre:border prose-pre:border-green-700">
                {renderContent(processedContent)}
              </div>
            </div>
          </article>

          {/* Blog navigation */}
          <BlogNavigation currentSlug={slug} />

          <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-4">
            <Link
              href="/writings"
              className="inline-block border border-theme px-3 py-1 sm:px-4 sm:py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
            >
              cd ~/{authorName}/writings
            </Link>
            <Link
              href="/"
              className="inline-block border border-theme px-3 py-1 sm:px-4 sm:py-2 text-sm hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
            >
              cd ~/{authorName}
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
