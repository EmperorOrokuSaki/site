"use client"

import { useEffect, useRef, useState } from "react"

interface ScratchRevealProps {
  text: string
  className?: string
}

interface RevealedWord {
  text: string
  x: number
  y: number
  opacity: number
  life: number
  maxLife: number
  glitchIntensity: number
  offsetX: number
  offsetY: number
  rgbShift: number
  isGlitching: boolean
}

export function ScratchReveal({ text, className = "" }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const revealedWords = useRef<RevealedWord[]>([])
  const canvasSizeRef = useRef({ width: 0, height: 0 })
  const scratchedAreas = useRef<Set<string>>(new Set())
  const frameCountRef = useRef(0)

  // Split text into words for better readability when revealed
  const words = text.split(" ")

  // Initialize the canvas and scratch-off effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size to match parent container
    const updateCanvasSize = () => {
      const parent = canvas.parentElement
      if (!parent) return

      const { width, height } = parent.getBoundingClientRect()
      canvas.width = width
      canvas.height = height
      canvasSizeRef.current = { width, height }

      // Redraw any existing words
      const ctx = canvas.getContext("2d")
      if (ctx) {
        drawRevealedWords(ctx)
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Handle mouse events
    const handleMouseDown = (e: MouseEvent) => {
      setIsScratching(true)
      const rect = canvas.getBoundingClientRect()
      lastPos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      // Reveal word at the initial click position
      const ctx = canvas.getContext("2d")
      if (ctx) {
        revealWordAtPosition(ctx, lastPos.current.x, lastPos.current.y)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isScratching) return

      const rect = canvas.getBoundingClientRect()
      const currentPos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }

      // Calculate distance moved
      const dx = currentPos.x - lastPos.current.x
      const dy = currentPos.y - lastPos.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Only reveal new words if moved enough distance
      if (distance > 30) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          revealWordAtPosition(ctx, currentPos.x, currentPos.y)
        }

        // Update last position
        lastPos.current = currentPos
      }
    }

    const handleMouseUp = () => {
      setIsScratching(false)
    }

    const handleMouseLeave = () => {
      setIsScratching(false)
    }

    // Touch events for mobile
    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      setIsScratching(true)
      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      lastPos.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }

      // Reveal word at the initial touch position
      const ctx = canvas.getContext("2d")
      if (ctx) {
        revealWordAtPosition(ctx, lastPos.current.x, lastPos.current.y)
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (!isScratching) return

      const rect = canvas.getBoundingClientRect()
      const touch = e.touches[0]
      const currentPos = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }

      // Calculate distance moved
      const dx = currentPos.x - lastPos.current.x
      const dy = currentPos.y - lastPos.current.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Only reveal new words if moved enough distance
      if (distance > 30) {
        const ctx = canvas.getContext("2d")
        if (ctx) {
          revealWordAtPosition(ctx, currentPos.x, currentPos.y)
        }

        // Update last position
        lastPos.current = currentPos
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault()
      setIsScratching(false)
    }

    // Add event listeners
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchstart", handleTouchStart)
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("touchend", handleTouchEnd)

    // Animation loop to fade in/out words with glitch effect
    let animationId: number
    const animate = () => {
      const ctx = canvas.getContext("2d")
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Update frame counter
        frameCountRef.current++

        // Update and draw words
        drawRevealedWords(ctx)
      }
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
      cancelAnimationFrame(animationId)
    }
  }, [isScratching])

  // Function to reveal a word at the specified position
  const revealWordAtPosition = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    // Create a grid cell identifier to prevent multiple words in the same area
    const cellSize = 50 // Size of grid cells in pixels
    const cellX = Math.floor(x / cellSize)
    const cellY = Math.floor(y / cellSize)
    const cellId = `${cellX},${cellY}`

    // Check if this area has already been scratched
    if (scratchedAreas.current.has(cellId)) {
      return
    }

    // Mark this area as scratched
    scratchedAreas.current.add(cellId)

    // Find the next word to reveal
    const wordIndex = revealedWords.current.length % words.length
    const wordToReveal = words[wordIndex]

    // Add the word to the revealed list with glitch properties
    revealedWords.current.push({
      text: wordToReveal,
      x,
      y,
      opacity: 0, // Start with 0 opacity and fade in
      life: 0,
      maxLife: 90, // About 1.5 seconds at 60fps
      glitchIntensity: 0,
      offsetX: 0,
      offsetY: 0,
      rgbShift: 0,
      isGlitching: false,
    })
  }

  // Function to draw all revealed words with glitch effect
  const drawRevealedWords = (ctx: CanvasRenderingContext2D) => {
    // Get the current ASCII color from CSS variable
    const computedStyle = getComputedStyle(document.documentElement)
    const asciiColor = computedStyle.getPropertyValue("--ascii-color").trim() || "#4ade80"

    // Parse the color to get RGB components
    let r = 0,
      g = 0,
      b = 0
    if (asciiColor.startsWith("#")) {
      const hex = asciiColor.substring(1)
      r = Number.parseInt(hex.substring(0, 2), 16)
      g = Number.parseInt(hex.substring(2, 4), 16)
      b = Number.parseInt(hex.substring(4, 6), 16)
    }

    // Update and draw each word
    revealedWords.current = revealedWords.current.filter((wordObj) => {
      // Update life
      wordObj.life++

      // Calculate phase (0-1)
      const phase = wordObj.life / wordObj.maxLife

      // Fade in quickly, then start glitching before fading out
      let opacity
      if (phase < 0.2) {
        // Quick fade in
        opacity = phase * 5
      } else if (phase < 0.7) {
        // Stay visible with occasional glitches
        opacity = 1

        // Random glitches during stable phase
        if (Math.random() < 0.05) {
          wordObj.isGlitching = true
          wordObj.glitchIntensity = Math.random() * 0.5
          wordObj.offsetX = (Math.random() - 0.5) * 10
          wordObj.offsetY = (Math.random() - 0.5) * 5
          wordObj.rgbShift = Math.random() * 5
        } else if (wordObj.isGlitching && Math.random() < 0.3) {
          // Reset glitch
          wordObj.isGlitching = false
          wordObj.offsetX = 0
          wordObj.offsetY = 0
          wordObj.rgbShift = 0
        }
      } else {
        // Glitchy fade out
        opacity = 1 - (phase - 0.7) / 0.3

        // Increase glitch intensity during fade out
        if (frameCountRef.current % 3 === 0) {
          wordObj.isGlitching = true
          wordObj.glitchIntensity = Math.min(1, wordObj.glitchIntensity + 0.1)
          wordObj.offsetX = (Math.random() - 0.5) * 15 * wordObj.glitchIntensity
          wordObj.offsetY = (Math.random() - 0.5) * 8 * wordObj.glitchIntensity
          wordObj.rgbShift = Math.random() * 8 * wordObj.glitchIntensity
        }
      }

      // Apply glitch effect
      if (wordObj.isGlitching) {
        // Draw with RGB shift for glitch effect
        const baseX = wordObj.x + wordObj.offsetX
        const baseY = wordObj.y + wordObj.offsetY

        // Red channel
        ctx.font = "bold 16px monospace"
        ctx.fillStyle = `rgba(${r}, 0, 0, ${opacity * 0.8})`
        ctx.fillText(wordObj.text, baseX - wordObj.rgbShift, baseY)

        // Green channel
        ctx.fillStyle = `rgba(0, ${g}, 0, ${opacity * 0.8})`
        ctx.fillText(wordObj.text, baseX, baseY + wordObj.rgbShift * 0.5)

        // Blue channel
        ctx.fillStyle = `rgba(0, 0, ${b}, ${opacity * 0.8})`
        ctx.fillText(wordObj.text, baseX + wordObj.rgbShift, baseY)

        // Random noise/static effect
        if (Math.random() < 0.3 * wordObj.glitchIntensity) {
          for (let i = 0; i < 3; i++) {
            const noiseX = baseX + (Math.random() - 0.5) * 20
            const noiseY = baseY + (Math.random() - 0.5) * 10
            const noiseWidth = Math.random() * 5 + 2
            const noiseHeight = Math.random() * 3 + 1

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.5})`
            ctx.fillRect(noiseX, noiseY, noiseWidth, noiseHeight)
          }
        }
      } else {
        // Normal drawing
        ctx.font = "bold 16px monospace"
        ctx.fillStyle =
          asciiColor +
          Math.floor(opacity * 255)
            .toString(16)
            .padStart(2, "0")
        ctx.fillText(wordObj.text, wordObj.x, wordObj.y)
      }

      // Keep word if still alive
      return wordObj.life < wordObj.maxLife
    })
  }

  return (
    <div className={`absolute inset-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          touchAction: "none", // Prevent scrolling on touch devices
        }}
      />
    </div>
  )
}
