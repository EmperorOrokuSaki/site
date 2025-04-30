"use client"

import { useEffect, useState } from "react"

export function AsciiArt({ art }: { art: string }) {
  const [isClient, setIsClient] = useState(false)

  // Only render on client-side to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // If the ASCII art is too large, truncate it
  const safeArt = art.length > 100000 ? art.substring(0, 100000) + "..." : art

  // Don't render during SSR to prevent hydration mismatch
  if (!isClient) {
    return <div className="h-40 w-full bg-green-900/10 animate-pulse"></div>
  }

  return (
    <div className="flex justify-center">
      <pre
        className="text-green-500 whitespace-pre overflow-x-auto max-h-[300px]"
        style={{ fontSize: "4px", lineHeight: "1" }}
      >
        {safeArt}
      </pre>
    </div>
  )
}
