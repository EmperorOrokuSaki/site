"use client"

import { useEffect, useRef, useState } from "react"

export function AsciiArt({ art }: { art: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isRendered, setIsRendered] = useState(false)

  // Use a more efficient rendering approach
  useEffect(() => {
    if (!art || isRendered) return

    // Delay rendering slightly to avoid blocking the main thread during initial load
    const timer = setTimeout(() => {
      setIsRendered(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [art, isRendered])

  return (
    <div className="flex justify-center" ref={containerRef}>
      <pre
        className="text-green-500 whitespace-pre overflow-x-auto max-h-[400px]"
        style={{
          fontSize: "4px",
          lineHeight: "1",
          // Use CSS containment to improve rendering performance
          contain: "content",
          // Use hardware acceleration when possible
          transform: "translateZ(0)",
        }}
      >
        {isRendered ? art : "Loading ASCII art..."}
      </pre>
    </div>
  )
}
