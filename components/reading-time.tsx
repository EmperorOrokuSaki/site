export function calculateReadingTime(content: string): number {
  // Average reading speed: 200 words per minute
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  // Return at least 1 minute
  return Math.max(1, readingTime)
}

interface ReadingTimeProps {
  content: string
  className?: string
}

export function ReadingTime({ content, className = "" }: ReadingTimeProps) {
  const minutes = calculateReadingTime(content)

  return <span className={`text-xs text-theme-muted ${className}`}>{minutes} min read</span>
}
