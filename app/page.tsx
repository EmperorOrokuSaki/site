"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Github, Linkedin, Mail, Film, X } from "lucide-react"
import { AsciiArt } from "@/components/ascii-art"
import { GlitchText } from "@/components/glitch-text"
import { fetchSiteData, type SiteData } from "@/lib/site-data"
import { TelegramIcon } from "@/components/telegram-icon"
import { ThemeToggle } from "@/components/theme-toggle"
import { InteractiveSection } from "@/components/interactive-section"

export default function Home() {
  const [asciiArt, setAsciiArt] = useState<string>("")
  const [asciiError, setAsciiError] = useState<boolean>(false)
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

        if (data.error) {
          throw new Error(data.error)
        }

        setAsciiArt(data.ascii || "")
        setAsciiError(false)
      } catch (err) {
        console.error("Error fetching ASCII art:", err)
        setAsciiError(true)
        setAsciiArt("")
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
        setSiteData(data)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Technical difficulty: Unable to load site data"))
        console.error("Error fetching site data:", err)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="container mx-auto">
          <div className="flex justify-center items-center h-screen">
            <div className="animate-pulse text-theme-primary">Loading...</div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen p-4">
        <div className="container mx-auto">
          <header className="flex justify-between items-center border-b border-theme pb-4">
            <div className="text-lg">
              <span>~/error</span> <span className="text-theme-secondary">$</span>
            </div>
            <ThemeToggle />
          </header>

          <main className="py-8">
            <section className="mb-16 border border-red-700 p-4 bg-red-900/20">
              <h1 className="text-xl text-red-400 mb-4">Technical Difficulty</h1>
              <p className="mb-4">{error?.message || "Unable to load site data"}</p>
              <p>Please try again later.</p>
              <div className="mt-6">
                <button
                  onClick={() => window.location.reload()}
                  className="border border-theme px-4 py-2 hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
                >
                  Retry
                </button>
              </div>
            </section>

            <InteractiveSection className="mb-16 border border-theme p-4">
              <div className="text-center mb-4">
                <GlitchText
                  text="Explo(it/r)ing the world!"
                  className="text-theme-secondary text-lg"
                  typingSpeed={80}
                  glitchIntensity="subtle"
                />
              </div>
              {!asciiError && asciiArt && (
                <div className="flex justify-center">
                  <AsciiArt art={asciiArt} />
                </div>
              )}
              {asciiError && <div className="text-center text-red-400 p-4">Error loading ASCII art</div>}
            </InteractiveSection>
          </main>
        </div>
      </div>
    )
  }

  // If we got here, we have site data
  return (
    <div className="min-h-screen p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center border-b border-theme pb-4">
          <div className="text-lg">
            <span>~/{siteData.name?.toLowerCase() || "user"}</span> <span className="text-theme-secondary">$</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <nav className="hidden md:flex gap-6">
              <Link href="#about" className="text-theme-primary hover:text-theme-secondary transition-colors">
                ./about
              </Link>
              <Link href="#projects" className="text-theme-primary hover:text-theme-secondary transition-colors">
                ./projects
              </Link>
              <Link href="#work" className="text-theme-primary hover:text-theme-secondary transition-colors">
                ./work
              </Link>
              <Link href="#writings" className="text-theme-primary hover:text-theme-secondary transition-colors">
                ./writings
              </Link>
            </nav>
          </div>
        </header>

        <main className="py-8">
          <InteractiveSection className="mb-16 border border-theme p-4">
            <div className="text-center mb-4">
              <GlitchText
                text="Explo(it/r)ing the world!"
                className="text-theme-secondary text-lg"
                typingSpeed={80}
                glitchIntensity="subtle"
              />
            </div>
            {!asciiError && asciiArt && (
              <div className="flex justify-center">
                <AsciiArt art={asciiArt} />
              </div>
            )}
            {asciiError && <div className="text-center text-red-400 p-4">Error loading ASCII art</div>}
            <div className="mt-4 border-t border-theme pt-4">
              <p className="text-theme-secondary mb-2">$ whoami</p>
              <p className="text-sm">{siteData.tagline || ""}</p>
            </div>
          </InteractiveSection>

          <section id="about" className="mb-16">
            <div className="border-b border-theme mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-theme-secondary">~/{siteData.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ cat</span> <span className="text-theme-secondary">about.txt</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                {(siteData.about || []).map((paragraph, index) => (
                  <p key={index} className="mb-4 text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-theme p-4">
                  <h3 className="text-theme-secondary mb-2 text-sm">$ ls favorite_films/</h3>
                  <ul className="space-y-1 text-xs">
                    {(siteData.favoriteFilms || []).map((film, index) => (
                      <li key={index}>
                        {film.title}
                        {film.director && <span className="text-theme-muted"> // {film.director}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-theme p-4">
                  <h3 className="text-theme-secondary mb-2 text-sm">$ ls interests/</h3>
                  <ul className="space-y-1 text-xs">
                    {(siteData.interests || []).map((interest, index) => (
                      <li key={index}>{interest}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="mb-16">
            <div className="border-b border-theme mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-theme-secondary">~/{siteData.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ ls -la</span> <span className="text-theme-secondary">projects/</span>
              </h2>
            </div>
            <div className="space-y-4">
              {(siteData.projects || []).map((project) => (
                <div key={project.id} className="border border-theme">
                  <div className="border-b border-theme bg-gray-300/20 dark:bg-green-900/20 p-2 flex justify-between items-center">
                    <h3 className="text-theme-secondary">
                      {project.githubUrl ? (
                        <a
                          href={project.githubUrl}
                          className="hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.title}
                        </a>
                      ) : (
                        project.title
                      )}
                    </h3>
                    {project.githubUrl && (
                      <div className="flex gap-2">
                        <a
                          href={project.githubUrl}
                          className="text-theme-primary hover:text-theme-secondary"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {(project.tags || []).map((tag) => (
                        <span key={tag} className="border border-theme px-2 py-1 text-xs">
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
            <div className="border-b border-theme mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-theme-secondary">~/{siteData.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ cat</span> <span className="text-theme-secondary">work_history.log</span>
              </h2>
            </div>
            <div className="space-y-4">
              {(siteData.workExperience || []).map((work, index) => (
                <div key={index} className="border-l-2 border-theme pl-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-theme-secondary">{work.title}</h3>
                    <div className="text-xs">
                      <span>{work.company}</span>
                      <span className="mx-2">|</span>
                      <span>{work.period}</span>
                    </div>
                  </div>
                  <p className="text-xs mb-4">{work.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {(work.tags || []).map((tag) => (
                      <span key={tag} className="border border-theme px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section id="writings" className="mb-16">
            <div className="border-b border-theme mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-theme-secondary">~/{siteData.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ ls -la</span> <span className="text-theme-secondary">writings/</span>
              </h2>
            </div>
            <div className="space-y-4">
              {(siteData.blogPosts || []).map((post) => (
                <div key={post.slug} className="border border-theme p-4">
                  <div className="text-xs mb-2">{post.date}</div>
                  <h3 className="text-theme-secondary mb-2">
                    <Link href={`/writings/${post.slug}`} className="hover:underline">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-xs mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {(post.tags || []).map((tag) => (
                      <span key={tag} className="border border-theme px-2 py-1 text-xs">
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
                className="inline-block border border-theme px-4 py-2 hover:bg-gray-400 hover:text-gray-900 dark:hover:bg-green-700 dark:hover:text-black transition-colors"
              >
                ls --all
              </Link>
            </div>
          </section>

          <section id="contact" className="mb-16">
            <div className="border-b border-theme mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-theme-secondary">~/{siteData.name?.toLowerCase() || "user"}</span>{" "}
                <span>$ ./contact</span>
              </h2>
            </div>
            <div>
              <p className="text-sm mb-6">
                I'm always up for conversations about new opportunities, peculiarities, or questioning if androids dream
                of electric sheep.
              </p>
              <div className="text-sm">
                {siteData.location && (
                  <p className="mb-2">
                    <span className="text-theme-secondary">$ location</span> {siteData.location}
                  </p>
                )}
                <p>
                  Find me on social media or send me an email at{" "}
                  <a
                    href={siteData.socialLinks?.email || "mailto:me@nimara.xyz"}
                    className="text-theme-secondary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {siteData.socialLinks?.email?.replace("mailto:", "") || "me@nimara.xyz"}
                  </a>
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-theme py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-xs">
              <span className="text-theme-secondary">~/{siteData.name?.toLowerCase() || "user"}</span>{" "}
              <span>$ echo</span> <span className="text-theme-secondary">"© {new Date().getFullYear()}"</span>
            </div>
            <div className="flex gap-6">
              {siteData.socialLinks?.github && (
                <a
                  href={siteData.socialLinks.github}
                  className="text-theme-primary hover:text-theme-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                </a>
              )}
              {siteData.socialLinks?.twitter && (
                <a
                  href={siteData.socialLinks.twitter}
                  className="text-theme-primary hover:text-theme-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <X className="h-4 w-4" />
                </a>
              )}
              {siteData.socialLinks?.linkedin && (
                <a
                  href={siteData.socialLinks.linkedin}
                  className="text-theme-primary hover:text-theme-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {siteData.socialLinks?.email && (
                <a
                  href={siteData.socialLinks.email}
                  className="text-theme-primary hover:text-theme-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Mail className="h-4 w-4" />
                </a>
              )}
              {siteData.socialLinks?.letterboxd && (
                <a
                  href={siteData.socialLinks.letterboxd}
                  className="text-theme-primary hover:text-theme-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Film className="h-4 w-4" />
                </a>
              )}
              {siteData.socialLinks?.telegram && (
                <a
                  href={siteData.socialLinks.telegram}
                  className="text-theme-primary hover:text-theme-secondary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TelegramIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
