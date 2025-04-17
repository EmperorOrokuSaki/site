import Link from "next/link"
import { Github, Twitter, Linkedin, Mail, Send } from "lucide-react"
import { AsciiArt } from "@/components/ascii-art"

async function getAsciiArt() {
  try {
    const response = await fetch(
      "https://gist.github.com/EmperorOrokuSaki/7afe407cd702a0134dc03366e99f2d3f/raw/2499580714926d39f33266488685ad6b64208653/ascii.txt",
      { cache: "force-cache" }, // Use Next.js cache
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error("Error fetching ASCII art:", error)
    return "Failed to load ASCII art. Please refresh the page."
  }
}

export default async function Home() {
  const asciiArt = await getAsciiArt()

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="container mx-auto">
        <header className="flex justify-between items-center border-b border-green-700 pb-4">
          <div className="text-lg">
            <span>~/nima</span> <span className="text-green-300">$</span>
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
            <div className="overflow-x-auto">
              <AsciiArt art={asciiArt} />
            </div>
            <div className="mt-4 border-t border-green-700 pt-4">
              <p className="text-green-300 mb-2">$ whoami</p>
              <p className="text-sm">
                Developer. Systems enthusiast. Building reliable, efficient, and secure software.
              </p>
              <div className="mt-4 flex gap-4">
                <Link
                  href="#contact"
                  className="border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
                >
                  ./contact
                </Link>
                <Link
                  href="#projects"
                  className="border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
                >
                  ./projects
                </Link>
              </div>
            </div>
          </section>

          <section id="about" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/nima</span> <span>$ cat</span>{" "}
                <span className="text-green-300">about.txt</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="mb-4 text-sm">
                  I'm a systems programmer with a focus on building efficient software. My background spans low-level
                  systems programming, distributed systems, and performance optimization.
                </p>
                <p className="mb-4 text-sm">
                  My journey began with traditional programming languages, but I enjoy exploring modern approaches to
                  memory safety and performance. I tackle complex problems and build robust, efficient solutions.
                </p>
                <p className="text-sm">
                  When not coding, I contribute to open-source projects, write technical articles, and explore the
                  latest developments in systems programming and language design.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-green-700 p-4">
                  <h3 className="text-green-300 mb-2 text-sm">$ ls languages/</h3>
                  <ul className="space-y-1 text-xs">
                    <li>rust</li>
                    <li>c</li>
                    <li>cpp</li>
                    <li>go</li>
                  </ul>
                </div>
                <div className="border border-green-700 p-4">
                  <h3 className="text-green-300 mb-2 text-sm">$ ls technologies/</h3>
                  <ul className="space-y-1 text-xs">
                    <li>wasm</li>
                    <li>docker</li>
                    <li>kubernetes</li>
                    <li>linux</li>
                  </ul>
                </div>
                <div className="border border-green-700 p-4">
                  <h3 className="text-green-300 mb-2 text-sm">$ ls interests/</h3>
                  <ul className="space-y-1 text-xs">
                    <li>systems</li>
                    <li>distributed</li>
                    <li>performance</li>
                    <li>open-source</li>
                  </ul>
                </div>
                <div className="border border-green-700 p-4">
                  <h3 className="text-green-300 mb-2 text-sm">$ ls education/</h3>
                  <ul className="space-y-1 text-xs">
                    <li>msc-cs</li>
                    <li>bsc-se</li>
                    <li>certifications</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="projects" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/nima</span> <span>$ ls -la</span>{" "}
                <span className="text-green-300">projects/</span>
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border border-green-700">
                <div className="border-b border-green-700 bg-green-900/20 p-2 flex justify-between items-center">
                  <h3 className="text-green-300">project-alpha</h3>
                  <div className="flex gap-2">
                    <Link href="#" className="text-green-400 hover:text-green-300">
                      <Github className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-4">
                    A high-performance, embedded database with ACID compliance and a focus on speed and reliability.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-green-700 px-2 py-1 text-xs">systems</span>
                    <span className="border border-green-700 px-2 py-1 text-xs">database</span>
                    <span className="border border-green-700 px-2 py-1 text-xs">acid</span>
                  </div>
                </div>
              </div>

              <div className="border border-green-700">
                <div className="border-b border-green-700 bg-green-900/20 p-2 flex justify-between items-center">
                  <h3 className="text-green-300">secure-net</h3>
                  <div className="flex gap-2">
                    <Link href="#" className="text-green-400 hover:text-green-300">
                      <Github className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-4">
                    A secure, peer-to-peer networking library focusing on encrypted communications and resilience.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-green-700 px-2 py-1 text-xs">networking</span>
                    <span className="border border-green-700 px-2 py-1 text-xs">security</span>
                    <span className="border border-green-700 px-2 py-1 text-xs">p2p</span>
                  </div>
                </div>
              </div>

              <div className="border border-green-700">
                <div className="border-b border-green-700 bg-green-900/20 p-2 flex justify-between items-center">
                  <h3 className="text-green-300">command-toolkit</h3>
                  <div className="flex gap-2">
                    <Link href="#" className="text-green-400 hover:text-green-300">
                      <Github className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs mb-4">
                    A modern, feature-rich command-line toolkit for system administrators and developers.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="border border-green-700 px-2 py-1 text-xs">cli</span>
                    <span className="border border-green-700 px-2 py-1 text-xs">tools</span>
                    <span className="border border-green-700 px-2 py-1 text-xs">devops</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="#"
                className="inline-block border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors"
              >
                ls -la --all
              </Link>
            </div>
          </section>

          <section id="work" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/nima</span> <span>$ cat</span>{" "}
                <span className="text-green-300">work_history.log</span>
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-2 border-green-700 pl-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-green-300">Senior Developer</h3>
                  <div className="text-xs">
                    <span>TechSystems Inc.</span>
                    <span className="mx-2">|</span>
                    <span>2021 - Present</span>
                  </div>
                </div>
                <p className="text-xs mb-4">
                  Leading the development of high-performance distributed systems. Architected and implemented a
                  fault-tolerant message broker that handles millions of transactions per second.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-green-700 px-2 py-1 text-xs">systems</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">distributed</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">performance</span>
                </div>
              </div>

              <div className="border-l-2 border-green-700 pl-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-green-300">Systems Engineer</h3>
                  <div className="text-xs">
                    <span>DataCraft Solutions</span>
                    <span className="mx-2">|</span>
                    <span>2018 - 2021</span>
                  </div>
                </div>
                <p className="text-xs mb-4">
                  Developed and maintained critical infrastructure components. Migrated legacy systems to modern
                  technologies, resulting in a 40% performance improvement and elimination of memory-related crashes.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-green-700 px-2 py-1 text-xs">infrastructure</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">migration</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">optimization</span>
                </div>
              </div>

              <div className="border-l-2 border-green-700 pl-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                  <h3 className="text-green-300">Software Developer</h3>
                  <div className="text-xs">
                    <span>InnovateTech</span>
                    <span className="mx-2">|</span>
                    <span>2016 - 2018</span>
                  </div>
                </div>
                <p className="text-xs mb-4">
                  Worked on backend services and APIs. Started exploring modern languages for performance-critical
                  components, which led to company-wide adoption for new projects.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-green-700 px-2 py-1 text-xs">backend</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">api</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">services</span>
                </div>
              </div>
            </div>
          </section>

          <section id="writings" className="mb-16">
            <div className="border-b border-green-700 mb-4 pb-2 flex items-center">
              <h2 className="text-xl">
                <span className="text-green-300">~/nima</span> <span>$ ls -la</span>{" "}
                <span className="text-green-300">writings/</span>
              </h2>
            </div>
            <div className="space-y-4">
              <div className="border border-green-700 p-4">
                <div className="text-xs mb-2">2023-05-15</div>
                <h3 className="text-green-300 mb-2">
                  <Link href="/writings/understanding-modern-memory-management" className="hover:underline">
                    Understanding Modern Memory Management: A Deep Dive
                  </Link>
                </h3>
                <p className="text-xs mb-4">
                  An in-depth exploration of memory management systems, borrowing rules, and how they prevent memory
                  safety issues without garbage collection.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-green-700 px-2 py-1 text-xs">systems</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">memory-safety</span>
                </div>
              </div>

              <div className="border border-green-700 p-4">
                <div className="text-xs mb-2">2023-03-22</div>
                <h3 className="text-green-300 mb-2">
                  <Link href="/writings/building-high-performance-web-servers" className="hover:underline">
                    Building High-Performance Web Servers with Modern Tools
                  </Link>
                </h3>
                <p className="text-xs mb-4">
                  A practical guide to creating blazing-fast web servers using async capabilities and modern runtime
                  environments.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-green-700 px-2 py-1 text-xs">performance</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">async</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">web</span>
                </div>
              </div>

              <div className="border border-green-700 p-4">
                <div className="text-xs mb-2">2023-01-10</div>
                <h3 className="text-green-300 mb-2">
                  <Link href="/writings/language-migration-guide" className="hover:underline">
                    Language Migration Guide for Systems Programmers
                  </Link>
                </h3>
                <p className="text-xs mb-4">
                  Strategies and patterns for transitioning codebases between programming languages, with real-world
                  examples and performance comparisons.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="border border-green-700 px-2 py-1 text-xs">languages</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">migration</span>
                  <span className="border border-green-700 px-2 py-1 text-xs">systems</span>
                </div>
              </div>
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
                <span className="text-green-300">~/nima</span> <span>$ ./contact</span>
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm mb-6">
                  I'm always open to discussing new projects, opportunities, or partnerships. Feel free to reach out if
                  you want to connect!
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="text-green-300 h-4 w-4" />
                    <Link href="mailto:me@nimara.xyz" className="text-xs hover:text-green-300 transition-colors">
                      me@nimara.xyz
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <Github className="text-green-300 h-4 w-4" />
                    <Link
                      href="https://github.com/EmperorOrokuSaki"
                      className="text-xs hover:text-green-300 transition-colors"
                    >
                      github.com/EmperorOrokuSaki
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <Twitter className="text-green-300 h-4 w-4" />
                    <Link
                      href="https://twitter.com/0xNimaRa"
                      className="text-xs hover:text-green-300 transition-colors"
                    >
                      twitter.com/0xNimaRa
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <Linkedin className="text-green-300 h-4 w-4" />
                    <Link
                      href="https://www.linkedin.com/in/nima-rasooli/"
                      className="text-xs hover:text-green-300 transition-colors"
                    >
                      linkedin.com/in/nima-rasooli
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <Send className="text-green-300 h-4 w-4" />
                    <Link
                      href="https://t.me/EmperorOrokuSaki"
                      className="text-xs hover:text-green-300 transition-colors"
                    >
                      t.me/EmperorOrokuSaki
                    </Link>
                  </div>
                </div>
              </div>
              <div className="border border-green-700 p-4">
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-xs mb-1">
                      $ name:
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-3 py-2 bg-black border border-green-700 text-green-400 text-xs focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs mb-1">
                      $ email:
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-3 py-2 bg-black border border-green-700 text-green-400 text-xs focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs mb-1">
                      $ message:
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 bg-black border border-green-700 text-green-400 text-xs focus:outline-none focus:border-green-500"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full border border-green-700 px-4 py-2 hover:bg-green-700 hover:text-black transition-colors text-xs"
                  >
                    $ ./send_message
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-green-700 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 text-xs">
              <span className="text-green-300">~/nima</span> <span>$ echo</span>{" "}
              <span className="text-green-300">"© {new Date().getFullYear()}"</span>
            </div>
            <div className="flex gap-6">
              <Link
                href="https://github.com/EmperorOrokuSaki"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <Github className="h-4 w-4" />
              </Link>
              <Link
                href="https://twitter.com/0xNimaRa"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/nima-rasooli/"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="mailto:me@nimara.xyz" className="text-green-400 hover:text-green-300 transition-colors">
                <Mail className="h-4 w-4" />
              </Link>
              <Link
                href="https://t.me/EmperorOrokuSaki"
                className="text-green-400 hover:text-green-300 transition-colors"
              >
                <Send className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
