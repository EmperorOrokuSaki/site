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

export async function fetchSiteData(): Promise<SiteData> {
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

      // Log the structure to help debug
      console.log("Data structure:", Object.keys(data))

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

      return defaultData as SiteData
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
