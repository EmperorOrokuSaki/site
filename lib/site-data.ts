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
  location?: string
  socialLinks: {
    github?: string
    twitter?: string
    linkedin?: string
    email?: string
    letterboxd?: string
    telegram?: string
  }
}

// Client-side cache
let cachedData: SiteData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60000 // 1 minute

export async function fetchSiteData(): Promise<SiteData> {
  const now = Date.now()

  // Return cached data if it's still valid
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using client-side cached site data")
    return cachedData
  }

  try {
    console.log("Fetching site data from API route")

    // Use our server-side API route to avoid CORS issues
    const response = await fetch("/api/site-data", {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as SiteData

    // Check if we got an error response
    if ("error" in data) {
      throw new Error(data.error as string)
    }

    console.log("Site data fetched successfully from API route")

    // Ensure blog posts have content
    if (data.blogPosts) {
      data.blogPosts = data.blogPosts.map((post) => {
        if (!post.content) {
          // Provide minimal default content if missing
          post.content = `# ${post.title}\n\n${post.excerpt}`
        }
        return post
      })
    }

    // Update cache
    cachedData = data
    lastFetchTime = now

    return data
  } catch (error) {
    console.error("Error fetching site data from API route:", error)
    throw error
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
