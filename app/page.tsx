"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Mail, Film, X } from "lucide-react"
import { AsciiArt } from "@/components/ascii-art"
import { GlitchText } from "@/components/glitch-text"
import { fetchSiteData, type SiteData } from "@/lib/site-data"
import { TelegramIcon } from "@/components/telegram-icon"

export default function Home() {
  const [asciiArt, setAsciiArt] = useState<string>("")
  const [siteData, setSiteData] = useState<SiteData | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch ASCII art from our optimized endpoint
  useEffect(() => {
    async function fetchAsciiArt() {
      try {
        const response = await fetch("/api/optimized-ascii")
        if (!response.ok) {
          throw new Error(`Failed to fetch ASCII art: ${response.status}`)
        }
        const data = await response.json()
        setAsciiArt(data.ascii || "")
      } catch (err) {
        console.error("Error fetching ASCII art:", err)
        // Fallback to a simpler ASCII art if there's an error
        setAsciiArt("ASCII Art Loading Error")
      }
    }

    fetchAsciiArt()
  }, [])

  // Fetch site data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        const data = await fetchSiteData()

        // Ensure all required arrays exist
        data.about = data.about || []
        data.languages = data.languages || []
        data.technologies = data.technologies || []
        data.interests = data.interests || []
        data.favoriteFilms = data.favoriteFilms || []
        data.projects = data.projects || []
        data.workExperience = data.workExperience || []
        data.blogPosts = data.blogPosts || []

        setSiteData(data)
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
          <header className="flex justify-between items-center border-b border-green-700 pb-4">
            <div className="text-lg">
              <span>~/error</span> <span className="text-green-300">$</span>
            </div>
          </header>

          <main className="py-8">
            <section className="mb-16 border border-red-700 p-4 bg-red-900/20">
              <h1 className="text-xl text-red-400 mb-4">Error Loading Site Data</h1>
              <p className="mb-4">{error.message}</p>
              <p>Please check the site data URL and try again.</p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
                >
                  Retry
                </button>
              </div>
            </section>

            <section className="mb-16 border border-green-700 p-4">
              <div className="text-center mb-4">
                <GlitchText
                  text="Explo(it/r)ing the world!"
                  className="text-green-300 text-lg"
                  typingSpeed={80}
                  glitchIntensity="subtle"
                />
              </div>
              <div className="flex justify-center">
                <AsciiArt art={asciiArt} />
              </div>
            </section>
          </main>
        </div>
      </div>
    )
  }

  // If we got here, we have site data
  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center border-b border-green-700 pb-4">
          <div className="text-lg">
            <span>~/{siteData?.name?.toLowerCase() || "user"}</span> <span className="text-green-300">$</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="#about" className="hover:text-green-300 transition-colors">
              ./about
            </Link>
            <Link href="#projects" className="hover:text-green-300 transition-colors">
              ./projects
            </Link>
            <Link href="#work" className="hover:text-green-300 transition-colors">
              ./work
            </Link>
            <Link href="#writings" className="hover:text-green-300 transition-colors">
              ./writings
            </Link>
          </nav>
        </header>

        <main className="py-8">
          <section className="mb-16 border border-green-700 p-4">
            <div className="text-center mb-4">
              <GlitchText
                text="Explo(it/r)ing the world!"
                className="text-green-300 text-lg"
                typingSpeed={80}
                glitchIntensity="subtle"
              />
            </div>
            <div className="flex justify-center">
              <AsciiArt art={asciiArt} />
            </div>
            <div className="mt-4 border-t border-green-700 pt-4">
              <p className="text-green-300 mb-2">$ whoami</p>
              <p className="text-sm">{siteData?.tagline || ""}</p>
            </div>
          </section>

          {/* Rest of the component remains the same */}
          <section id="about" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/{siteData?.name?.toLowerCase() || "user"}</span> <span>$ cat</span>{" "}
                <span className="text-green-300">about.txt</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {(siteData?.about || []).map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-green-700 p-4">
                  <h3 className="text-green-300 mb-2 text-sm">$ ls favorite_films/</h3>
                  <ul className="space-y-1 text-xs">
                    {(siteData?.favoriteFilms || []).map((film, index) => (
                      <li key={index}>
                        {film.title}
                        {film.director && <span className="text-green-600"> // {film.director}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-green-700 p-4">
                  <h3 className="text-green-300 mb-2 text-sm">$ ls interests/</h3>
                  <ul className="space-y-1 text-xs">
                    {(siteData?.interests || []).map((interest, index) => (
                      <li key={index}>{interest}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/{siteData?.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ ls -la</span> <span className="text-green-300">projects/</span>
              </h2>
            </div>
            <div className="space-y-4">
              {(siteData?.projects || []).map((project) => (
                <div key={project.id} className="border border-green-700">
                  <div className="border-b border-green-700 bg-green-900/20 p-2 flex justify-between items-center">
                    <h3 className="text-green-300">
                      {project.githubUrl ? (
                        <Link href={project.githubUrl} className="hover:underline">
                          {project.title}
                        </Link>
                      ) : (
                        project.title
                      )}
                    </h3>
                    {project.githubUrl && (
                      <div className="flex gap-2">
                        <Link href={project.githubUrl} className="text-green-400 hover:text-green-300">
                          <Github className="h-4 w-4" />
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.tags || []).map((tag) => (
                        <span key={tag} className="border border-green-700 px-2 py-1 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="work" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/{siteData?.name?.toLowerCase() || "user"}</span> <span>$ cat</span>{" "}
                <span className="text-green-300">work_history.log</span>
              </h2>
            </div>
            <div className="space-y-4">
              {(siteData?.workExperience || []).map((work, index) => (
                <div key={index} className="border-l-2 border-green-700 pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-green-300">{work.title}</h3>
                    <div className="text-xs">
                      <span>{work.company}</span>
                      <span className="mx-2">|</span>
                      <span>{work.period}</span>
                    </div>
                  </div>
                  <p className="text-xs mb-4">{work.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(work.tags || []).map((tag) => (
                      <span key={tag} className="border border-green-700 px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="writings" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/{siteData?.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ ls -la</span> <span className="text-green-300">writings/</span>
              </h2>
            </div>
            <div className="space-y-4">
              {(siteData?.blogPosts || []).map((post) => (
                <div key={post.slug} className="border border-green-700 p-4">
                  <div className="text-xs mb-2">{post.date}</div>
                  <h3 className="text-green-300 mb-2">
                    <Link href={`/writings/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
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
            <div className="mt-4 text-center">
              <Link
                href="/writings"
                className="inline-block border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
              >
                cat --all
              </Link>
            </div>
          </section>

          <section id="contact" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/{siteData?.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ ./contact</span>
              </h2>
            </div>
            <div>
              <p className="text-sm mb-6">
                I'm always up for conversations about new opportunities, peculiarities, or questioning if androids dream
                of electric sheep.
              </p>
              <div className="text-sm">
                <p>
                  Find me on social media or send me an email at{" "}
                  <a
                    href={siteData?.socialLinks?.email || "mailto:me@nimara.xyz"}
                    className="text-green-300 hover:underline"
                  >
                    me@nimara.xyz
                  </a>
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-green-700 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-xs">
              <span className="text-green-300">~/{siteData?.name?.toLowerCase() || "user"}</span> <span>$ echo</span>{" "}
              <span className="text-green-300">"© {new Date().getFullYear()}"</span>
            </div>
            <div className="flex gap-6">
              {siteData?.socialLinks?.github && (
                <Link
                  href={siteData.socialLinks.github}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Github className="h-4 w-4" />
                </Link>
              )}
              {siteData?.socialLinks?.twitter && (
                <Link
                  href={siteData.socialLinks.twitter}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <X className="h-4 w-4" />
                </Link>
              )}
              {siteData?.socialLinks?.linkedin && (
                <Link
                  href={siteData.socialLinks.linkedin}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              )}
              {siteData?.socialLinks?.email && (
                <Link
                  href={siteData.socialLinks.email}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                </Link>
              )}
              {siteData?.socialLinks?.letterboxd && (
                <Link
                  href={siteData.socialLinks.letterboxd}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <Film className="h-4 w-4" />
                </Link>
              )}
              {siteData?.socialLinks?.telegram && (
                <Link
                  href={siteData.socialLinks.telegram}
                  className="text-green-400 hover:text-green-300 transition-colors"
                >
                  <TelegramIcon className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
