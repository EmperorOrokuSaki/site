"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { fetchSiteData } from "@/lib/site-data"

export default function WritingsPage() {
  const [blogPosts, setBlogPosts] = useState([])
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const siteData = await fetchSiteData()
        setBlogPosts(siteData.blogPosts || [])
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error fetching site data"))
        console.error("Error fetching site data:", err)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-green-400 font-mono p-4">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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
              <h1 className="text-xl text-red-400 mb-4">Error Loading Blog Posts</h1>
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

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="container mx-auto">
        <header className="flex items-center border-b border-green-700 pb-4">
          <Link href="/#writings" className="text-green-300 hover:text-green-100 flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>cd ~/nima</span>
          </Link>
        </header>
        <main className="py-8">
          <div className="border-b border-green-700 mb-6 pb-2">
            <h1 className="text-xl">
              <span className="text-green-300">~/nima/writings</span> <span>$ ls -la</span>
            </h1>
          </div>

          {blogPosts.length === 0 ? (
            <div className="border border-yellow-600 bg-yellow-900/20 p-4 text-yellow-400">No blog posts found.</div>
          ) : (
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <div key={post.slug} className="border border-green-700 p-4">
                  <div className="text-xs mb-2">{post.date}</div>
                  <h2 className="text-green-300 mb-2">
                    <Link href={`/writings/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-xs mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {(post.tags || []).map((tag) => (
                      <span key={tag} className="border border-green-700 px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/"
              className="inline-block border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
            >
              cd ~/nima
            </Link>
          </div>
        </main>
      </div>
    </div>
  )
}
