import { NextResponse } from "next/server"
import type { SiteData } from "@/lib/site-data"

// Cache the data to prevent multiple fetches
let cachedData: SiteData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 300000 // 5 minutes

// The specific URL provided by the user
const SITE_DATA_URL =
  "https://raw.githubusercontent.com/EmperorOrokuSaki/EmperorOrokuSaki.github.io/refs/heads/main/site.json"

// Fallback data in case the fetch fails
const FALLBACK_DATA: SiteData = {
  name: "Nima",
  tagline: "Developer. Systems enthusiast. Building reliable, efficient, and secure software.",
  about: [
    "I'm a systems programmer with a focus on building efficient software. My background spans low-level systems programming, distributed systems, and performance optimization.",
    "My journey began with traditional programming languages, but I enjoy exploring modern approaches to memory safety and performance.",
  ],
  languages: ["rust", "c", "cpp", "go"],
  technologies: ["wasm", "docker", "kubernetes", "linux"],
  interests: ["systems", "distributed", "performance", "open-source"],
  favoriteFilms: [
    { title: "Blade Runner", director: "Ridley Scott" },
    { title: "Akira", director: "Katsuhiro Otomo" },
  ],
  projects: [
    {
      id: "project-alpha",
      title: "project-alpha",
      description: "A high-performance, embedded database with ACID compliance.",
      tags: ["systems", "database", "acid"],
      githubUrl: "https://github.com/yourusername/project-alpha",
    },
  ],
  workExperience: [
    {
      title: "Senior Developer",
      company: "TechSystems Inc.",
      period: "2021 - Present",
      description: "Leading the development of high-performance distributed systems.",
      tags: ["systems", "distributed", "performance"],
    },
  ],
  blogPosts: [
    {
      slug: "understanding-modern-memory-management",
      title: "Understanding Modern Memory Management",
      date: "2023-05-15",
      excerpt: "An exploration of memory management systems.",
      tags: ["systems", "memory-safety"],
      content: "# Understanding Modern Memory Management\n\nMemory management is critical in systems programming.",
    },
  ],
  socialLinks: {
    github: "https://github.com/yourusername",
    email: "mailto:you@example.com",
  },
}

export async function GET() {
  const now = Date.now()

  // Return cached data if it's still valid
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using cached site data")
    return NextResponse.json(cachedData)
  }

  try {
    console.log(`Fetching site data from: ${SITE_DATA_URL}`)

    // Use a direct fetch with no caching to avoid any cache-related issues
    const response = await fetch(SITE_DATA_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 0 }, // Don't use Next.js cache
    })

    // Log detailed response information for debugging
    console.log(`Response status: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status} ${response.statusText}`)
    }

    // Try to parse the response as text first to see if it's valid JSON
    const text = await response.text()
    console.log(`Response body (first 100 chars): ${text.substring(0, 100)}...`)

    try {
      const data = JSON.parse(text) as SiteData
      console.log("Site data fetched and parsed successfully")

      // Ensure all required properties exist
      const completeData: SiteData = {
        name: data.name || FALLBACK_DATA.name,
        tagline: data.tagline || FALLBACK_DATA.tagline,
        about: data.about || FALLBACK_DATA.about,
        languages: data.languages || FALLBACK_DATA.languages,
        technologies: data.technologies || FALLBACK_DATA.technologies,
        interests: data.interests || FALLBACK_DATA.interests,
        favoriteFilms: data.favoriteFilms || FALLBACK_DATA.favoriteFilms,
        projects: data.projects || FALLBACK_DATA.projects,
        workExperience: data.workExperience || FALLBACK_DATA.workExperience,
        blogPosts: data.blogPosts || FALLBACK_DATA.blogPosts,
        socialLinks: data.socialLinks || FALLBACK_DATA.socialLinks,
      }

      // Update cache
      cachedData = completeData
      lastFetchTime = now

      return NextResponse.json(completeData)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }
  } catch (error) {
    console.error("Error fetching site data:", error)

    // If we have cached data, return it even if it's expired
    if (cachedData) {
      console.log("Using expired cached data as fallback")
      return NextResponse.json(cachedData)
    }

    // Return fallback data
    console.log("Using fallback data")
    return NextResponse.json(FALLBACK_DATA)
  }
}
