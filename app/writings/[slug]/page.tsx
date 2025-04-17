import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { fetchSiteData, blogPostsToRecord, type BlogPost } from "@/lib/site-data"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Fetch site data - will throw an error if it fails
  let blogPosts: Record<string, BlogPost> = {}
  let error: Error | null = null

  try {
    const siteData = await fetchSiteData()
    blogPosts = blogPostsToRecord(siteData.blogPosts)
  } catch (err) {
    error = err instanceof Error ? err : new Error("Unknown error fetching site data")
    console.error("Error fetching site data:", error)

    // Return error page
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-4">
        <div className="container mx-auto">
          <header className="flex items-center border-b border-green-700 pb-4">
            <Link href="/" className="text-green-300 hover:text-green-100 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>cd ..</span>
            </Link>
          </header>
          <main className="py-8">
            <div className="border border-red-700 p-4 bg-red-900/20">
              <h1 className="text-xl text-red-400 mb-4">Error Loading Blog Post</h1>
              <p className="mb-4">{error.message}</p>
              <p>Please check the site data URL and try again.</p>
              <div className="mt-4">
                <Link
                  href="/"
                  className="border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
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
      <div className="min-h-screen bg-black text-green-400 font-mono p-4">
        <div className="container mx-auto">
          <header className="flex items-center border-b border-green-700 pb-4">
            <Link href="/" className="text-green-300 hover:text-green-100 flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>cd ..</span>
            </Link>
          </header>
          <main className="py-8">
            <div className="border border-green-700 p-4">
              <h1 className="text-xl text-green-300 mb-4">Error 404: File Not Found</h1>
              <p>The requested blog post does not exist.</p>
              <div className="mt-4">
                <Link
                  href="/#writings"
                  className="border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
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

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="container mx-auto">
        <header className="flex items-center border-b border-green-700 pb-4">
          <Link href="/#writings" className="text-green-300 hover:text-green-100 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>cd ~/nima/writings</span>
          </Link>
        </header>
        <main className="py-8">
          <article className="border border-green-700">
            <div className="border-b border-green-700 bg-green-900/20 p-4">
              <div className="text-xs mb-2">{post.date}</div>
              <h1 className="text-xl text-green-300">{post.title}</h1>
              <div className="flex flex-wrap gap-2 mt-4">
                {(post.tags || []).map((tag) => (
                  <span key={tag} className="border border-green-700 px-2 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="prose prose-invert prose-sm max-w-none prose-pre:bg-black prose-pre:border prose-pre:border-green-700">
                {post.content?.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return (
                      <h1 key={i} className="text-xl text-green-300 mt-6 mb-4">
                        {line.substring(2)}
                      </h1>
                    )
                  } else if (line.startsWith("## ")) {
                    return (
                      <h2 key={i} className="text-lg text-green-300 mt-5 mb-3">
                        {line.substring(3)}
                      </h2>
                    )
                  } else if (line.startsWith("### ")) {
                    return (
                      <h3 key={i} className="text-base text-green-300 mt-4 mb-2">
                        {line.substring(4)}
                      </h3>
                    )
                  } else if (line.startsWith("```")) {
                    return (
                      <pre key={i} className="bg-black border border-green-700 p-4 my-4 overflow-x-auto">
                        <code>{line.substring(3)}</code>
                      </pre>
                    )
                  } else if (line === "") {
                    return <br key={i} />
                  } else {
                    return (
                      <p key={i} className="my-2">
                        {line}
                      </p>
                    )
                  }
                })}
              </div>
            </div>
          </article>
          <div className="mt-8 text-center">
            <Link
              href="/#writings"
              className="inline-block border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
            >
              cd ~/nima/writings
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
