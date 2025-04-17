"use client"

import { useState, useEffect } from "react"
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

  // Handle typing animation
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, typingSpeed)

      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, typingSpeed])

  // Handle random glitch effect
  useEffect(() => {
    if (displayedText.length > 0) {
      const triggerGlitch = () => {
        // Random chance to trigger glitch
        if (Math.random() < 0.3) {
          setIsGlitching(true)

          // Turn off glitch after a short duration
          setTimeout(
            () => {
              setIsGlitching(false)
            },
            Math.random() * 200 + 50,
          )
        }

        // Schedule next potential glitch
        const nextGlitch = Math.random() * 2000 + 1000 // Random time between 1-3 seconds
        setTimeout(triggerGlitch, nextGlitch)
      }

      // Start the glitch cycle
      const initialDelay = Math.random() * 1000 + 500
      const timeout = setTimeout(triggerGlitch, initialDelay)

      return () => clearTimeout(timeout)
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
