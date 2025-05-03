import Link from "next/link"
import { ArrowLeft, Clock } from "lucide-react"
import { fetchSiteData } from "@/lib/site-data"
import { calculateReadingTime } from "@/components/reading-time"
import { ThemeToggle } from "@/components/theme-toggle"

// Completely rewrite the dynamic directive to ensure no hidden characters
export const dynamic = "force-dynamic"

export default async function WritingsPage() {
  // Fetch site data - will throw an error if it fails
  let blogPosts = []
  let error: Error | null = null
  let authorName = "nima" // Default author name

  try {
    const siteData = await fetchSiteData()
    blogPosts = siteData.blogPosts || []
    authorName = siteData.name?.toLowerCase() || "nima"
  } catch (err) {
    error = err instanceof Error ? err : new Error("Unknown error fetching site data")
    console.error("Error fetching site data:", error)

    // Return error page
    return (
      <div className="min-h-screen p-2 sm:p-4">
        <div className="container mx-auto max-w-4xl">
          <header className="flex items-center border-b border-theme pb-4">
            <Link href="/" className="text-theme-secondary hover:text-theme-primary flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>cd ..</span>
            </Link>
          </header>
          <main className="py-4 sm:py-8">
            <div className="border border-red-700 p-3 sm:p-4 bg-red-900/20">
              <h1 className="text-lg sm:text-xl text-red-400 mb-2 sm:mb-4">Error Loading Blog Posts</h1>
              <p className="mb-2 sm:mb-4 text-sm sm:text-base">{error.message}</p>
              <p className="text-sm sm:text-base">Please check the site data URL and try again.</p>
              <div className="mt-4">
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

  return (
    <div className="min-h-screen p-2 sm:p-4">
      <div className="container mx-auto max-w-4xl">
        <header className="flex items-center justify-between border-b border-theme pb-3 sm:pb-4">
          <Link href="/#writings" className="text-theme-secondary hover:text-theme-primary flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm sm:text-base">cd ~/{authorName}</span>
          </Link>
          <ThemeToggle />
        </header>
        <main className="py-4 sm:py-8">
          <div className="border-b border-theme mb-4 sm:mb-6 pb-2">
            <h1 className="text-lg sm:text-xl">
              <span className="text-theme-secondary">~/{authorName}/writings</span> <span>$ ls -la</span>
            </h1>
          </div>

          {blogPosts.length === 0 ? (
            <div className="border border-yellow-600 bg-yellow-900/20 p-3 sm:p-4 text-yellow-400 text-sm sm:text-base">
              No blog posts found.
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {blogPosts.map((post) => (
                <div
                  key={post.slug}
                  className="border border-theme p-3 sm:p-4 hover:border-gray-500 dark:hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <div className="text-xs">{post.date}</div>
                    {post.content && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-theme-muted" />
                        <span className="text-xs text-theme-muted">{calculateReadingTime(post.content)} min read</span>
                      </div>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg text-theme-secondary mb-1 sm:mb-2">
                    <Link href={`/writings/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-xs sm:text-sm mb-3 sm:mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1 sm:gap-2">
                    {(post.tags || []).map((tag) => (
                      <span key={tag} className="border border-theme px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 text-right">
                    <Link
                      href={`/writings/${post.slug}`}
                      className="text-theme-secondary hover:text-theme-primary text-xs sm:text-sm"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 sm:mt-8 text-center">
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
