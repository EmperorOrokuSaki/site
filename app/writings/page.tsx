import Link from "next/link"
import { ArrowLeft } from "lucide-react"

// Mock data for blog posts - same as in the [slug]/page.tsx file
const blogPosts = {
  "understanding-modern-memory-management": {
    title: "Understanding Modern Memory Management: A Deep Dive",
    date: "2023-05-15",
    excerpt:
      "An in-depth exploration of memory management systems, borrowing rules, and how they prevent memory safety issues without garbage collection.",
    tags: ["systems", "memory-safety"],
  },
  "building-high-performance-web-servers": {
    title: "Building High-Performance Web Servers with Modern Tools",
    date: "2023-03-22",
    excerpt:
      "A practical guide to creating blazing-fast web servers using async capabilities and modern runtime environments.",
    tags: ["performance", "async", "web"],
  },
  "language-migration-guide": {
    title: "Language Migration Guide for Systems Programmers",
    date: "2023-01-10",
    excerpt:
      "Strategies and patterns for transitioning codebases between programming languages, with real-world examples and performance comparisons.",
    tags: ["languages", "migration", "systems"],
  },
}

export default function WritingsPage() {
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

          <div className="space-y-6">
            {Object.entries(blogPosts).map(([slug, post]) => (
              <div key={slug} className="border border-green-700 p-4">
                <div className="text-xs mb-2">{post.date}</div>
                <h2 className="text-green-300 mb-2">
                  <Link href={`/writings/${slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-xs mb-4">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="border border-green-700 px-2 py-1 text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

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
