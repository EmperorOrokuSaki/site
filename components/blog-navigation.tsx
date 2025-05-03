"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/site-data"

interface BlogNavigationProps {
  currentSlug: string
}

export function BlogNavigation({ currentSlug }: BlogNavigationProps) {
  const [prevPost, setPrevPost] = useState<BlogPost | null>(null)
  const [nextPost, setNextPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const response = await fetch("/api/site-data")
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts")
        }

        const data = await response.json()
        const blogPosts = data.blogPosts || []

        // Sort blog posts by date (newest first)
        const sortedPosts = [...blogPosts].sort((a, b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        })

        // Find the index of the current post
        const currentIndex = sortedPosts.findIndex((post) => post.slug === currentSlug)

        if (currentIndex > 0) {
          setNextPost(sortedPosts[currentIndex - 1]) // Newer post
        }

        if (currentIndex < sortedPosts.length - 1 && currentIndex !== -1) {
          setPrevPost(sortedPosts[currentIndex + 1]) // Older post
        }
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [currentSlug])

  if (loading || (!prevPost && !nextPost)) {
    return null
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between mt-6 sm:mt-8 border-t border-theme pt-4 gap-4 sm:gap-0">
      {prevPost ? (
        <Link
          href={`/writings/${prevPost.slug}`}
          className="flex items-center gap-2 text-theme-secondary hover:text-theme-primary"
        >
          <ArrowLeft className="h-4 w-4 flex-shrink-0" />
          <div className="overflow-hidden">
            <div className="text-xs text-theme-muted">Older</div>
            <div className="text-sm truncate">{prevPost.title}</div>
          </div>
        </Link>
      ) : (
        <div></div>
      )}

      {nextPost ? (
        <Link
          href={`/writings/${nextPost.slug}`}
          className="flex items-center gap-2 text-theme-secondary hover:text-theme-primary self-end sm:self-auto"
        >
          <div className="text-right overflow-hidden">
            <div className="text-xs text-theme-muted">Newer</div>
            <div className="text-sm truncate">{nextPost.title}</div>
          </div>
          <ArrowRight className="h-4 w-4 flex-shrink-0" />
        </Link>
      ) : (
        <div></div>
      )}
    </div>
  )
}
