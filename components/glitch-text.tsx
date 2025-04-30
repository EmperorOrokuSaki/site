"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface GlitchTextProps {
  text: string
  typingSpeed?: number
  className?: string
  glitchIntensity?: "subtle" | "medium" | "high"
}

export function GlitchText({ text, typingSpeed = 80, className = "", glitchIntensity = "subtle" }: GlitchTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)

  // Use refs to manage timeouts and prevent memory leaks
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const glitchDurationRef = useRef<NodeJS.Timeout | null>(null)

  // Handle typing animation with better cleanup
  useEffect(() => {
    if (currentIndex < text.length) {
      typingTimeoutRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, typingSpeed)

      return () => {
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current)
        }
      }
    }
  }, [currentIndex, text, typingSpeed])

  // Handle random glitch effect with better memory management
  useEffect(() => {
    if (displayedText.length > 0) {
      const triggerGlitch = () => {
        // Limit glitch frequency to reduce CPU usage
        if (Math.random() < 0.2) {
          setIsGlitching(true)

          // Turn off glitch after a short duration
          glitchDurationRef.current = setTimeout(
            () => {
              setIsGlitching(false)
            },
            Math.random() * 150 + 50, // Shorter duration to reduce rendering load
          )
        }

        // Schedule next potential glitch with longer intervals
        const nextGlitch = Math.random() * 3000 + 2000 // Random time between 2-5 seconds
        glitchTimeoutRef.current = setTimeout(triggerGlitch, nextGlitch)
      }

      // Start the glitch cycle
      const initialDelay = Math.random() * 1000 + 1000
      glitchTimeoutRef.current = setTimeout(triggerGlitch, initialDelay)

      return () => {
        // Clean up all timeouts
        if (glitchTimeoutRef.current) {
          clearTimeout(glitchTimeoutRef.current)
        }
        if (glitchDurationRef.current) {
          clearTimeout(glitchDurationRef.current)
        }
      }
    }
  }, [displayedText])

  const intensityClasses = {
    subtle: "glitch-subtle",
    medium: "glitch-medium",
    high: "glitch-high",
  }

  return (
    <>
      <style jsx>{`
        @keyframes glitch-anim-1 {
          0% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 0); }
          20% { clip-path: inset(92% 0 1% 0); transform: translate(1px, 0); }
          40% { clip-path: inset(43% 0 1% 0); transform: translate(0, 1px); }
          60% { clip-path: inset(25% 0 58% 0); transform: translate(1px, -1px); }
          80% { clip-path: inset(54% 0 7% 0); transform: translate(-1px, 1px); }
          100% { clip-path: inset(58% 0 43% 0); transform: translate(2px, 0); }
        }
        
        @keyframes glitch-anim-2 {
          0% { clip-path: inset(25% 0 58% 0); transform: translate(1px, -1px); }
          20% { clip-path: inset(54% 0 7% 0); transform: translate(-1px, 1px); }
          40% { clip-path: inset(58% 0 43% 0); transform: translate(2px, 0); }
          60% { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 0); }
          80% { clip-path: inset(92% 0 1% 0); transform: translate(1px, 0); }
          100% { clip-path: inset(43% 0 1% 0); transform: translate(0, 1px); }
        }
        
        .glitch-container {
          position: relative;
          display: inline-block;
        }
        
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        
        .glitch-subtle.glitching::before,
        .glitch-subtle.glitching::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.8;
        }
        
        .glitch-subtle.glitching::before {
          color: #0ff;
          z-index: -1;
          animation: glitch-anim-1 0.2s linear infinite alternate-reverse;
        }
        
        .glitch-subtle.glitching::after {
          color: #f0f;
          z-index: -2;
          animation: glitch-anim-2 0.3s linear infinite alternate-reverse;
        }
      `}</style>
      <div className={cn("glitch-container", className)}>
        <span
          className={cn("glitch-text", intensityClasses[glitchIntensity], isGlitching && "glitching")}
          data-text={displayedText}
        >
          {displayedText}
        </span>
      </div>
    </>
  )
}
