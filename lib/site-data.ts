export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  githubUrl?: string
  demoUrl?: string
}

export interface WorkExperience {
  title: string
  company: string
  period: string
  description: string
  tags: string[]
}

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  content?: string
}

export interface SiteData {
  name: string
  tagline: string
  about: string[]
  languages: string[]
  technologies: string[]
  interests: string[]
  favoriteFilms: Array<{ title: string; director?: string }>
  projects: Project[]
  workExperience: WorkExperience[]
  blogPosts: BlogPost[]
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
    letterboxd?: string
    telegram?: string
  }
}

// Cache the data to prevent multiple fetches
let cachedData: SiteData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60000 // 1 minute

// The specific URL provided by the user
const SITE_DATA_URL =
  "https://raw.githubusercontent.com/EmperorOrokuSaki/EmperorOrokuSaki.github.io/refs/heads/main/site.json"

export async function fetchSiteData(): Promise<SiteData> {
  const now = Date.now()

  // Return cached data if it's still valid
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using cached site data")
    return cachedData
  }

  try {
    console.log(`Fetching site data from: ${SITE_DATA_URL}`)

    // Use a direct fetch with no caching to avoid any cache-related issues
    const response = await fetch(SITE_DATA_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      cache: "no-store",
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
      const defaultData: Partial<SiteData> = {
        name: data.name || "User",
        tagline: data.tagline || "",
        about: data.about || [],
        languages: data.languages || [],
        technologies: data.technologies || [],
        interests: data.interests || [],
        favoriteFilms: data.favoriteFilms || [],
        projects: data.projects || [],
        workExperience: data.workExperience || [],
        blogPosts: data.blogPosts || [],
        socialLinks: data.socialLinks || {},
      }

      // Update cache
      cachedData = defaultData as SiteData
      lastFetchTime = now

      return cachedData
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      throw new Error(`Invalid JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`)
    }
  } catch (error) {
    console.error("Error fetching site data:", error)

    // If we have cached data, return it even if it's expired
    if (cachedData) {
      console.log("Using expired cached data as fallback")
      return cachedData
    }

    // Create fallback data
    const fallbackData: SiteData = {
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

    // Update cache with fallback data
    cachedData = fallbackData
    lastFetchTime = now

    return fallbackData
  }
}

// Function to convert blog posts array to a record for easy lookup
export function blogPostsToRecord(posts: BlogPost[] = []): Record<string, BlogPost> {
  return posts.reduce(
    (acc, post) => {
      acc[post.slug] = post
      return acc
    },
    {} as Record<string, BlogPost>,
  )
}
