"use client"

import { useState, useEffect } from "react"

interface TypingAnimationProps {
  text: string
  speed?: number
  className?: string
}

export function TypingAnimation({ text, speed = 100, className = "" }: TypingAnimationProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return <div className={className}>{displayedText}</div>
}
