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

// The specific URL provided by the user
const SITE_DATA_URL =
  "https://raw.githubusercontent.com/EmperorOrokuSaki/EmperorOrokuSaki.github.io/refs/heads/main/site.json"

// Cache the data to prevent multiple fetches
let cachedData: SiteData | null = null
let lastFetchTime = 0
const CACHE_DURATION = 60000 // 1 minute

export async function fetchSiteData(): Promise<SiteData> {
  const now = Date.now()

  // Return cached data if it's still valid
  if (cachedData && now - lastFetchTime < CACHE_DURATION) {
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
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch site data: ${response.status} ${response.statusText}`)
    }

    // Try to parse the response as text first to see if it's valid JSON
    const text = await response.text()

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
