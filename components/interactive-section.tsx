"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { ScratchReveal } from "./scratch-reveal"

// Define a particle class for the letters
interface Particle {
  x: number
  y: number
  char: string
  size: number
  speedX: number
  speedY: number
  life: number
  maxLife: number
}

interface InteractiveSectionProps {
  children: ReactNode
  className?: string
  includeScratchReveal?: boolean
  scratchText?: string
}

export function InteractiveSection({
  children,
  className = "",
  includeScratchReveal = true,
  scratchText = "answer the call of uncertainty",
}: InteractiveSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorCanvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const animationRef = useRef<number | null>(null)
  const cursorAnimationRef = useRef<number | null>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const particles = useRef<Particle[]>([])
  const lastEmitTime = useRef(0)

  // Handle the mouse effect
  useEffect(() => {
    const canvas = canvasRef.current
    const cursorCanvas = cursorCanvasRef.current
    const container = containerRef.current
    if (!canvas || !container || !cursorCanvas) return

    // Set canvas size to match container
    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Also update cursor canvas
      cursorCanvas.width = rect.width
      cursorCanvas.height = rect.height
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)

    // Track mouse position relative to the container
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    // Handle mouse enter/leave
    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mouseleave", handleMouseLeave)

    // Characters to use (ASCII characters)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/"

    // Create new particles
    const emitParticles = (timestamp: number) => {
      // Only emit particles every 50ms to control density
      if (timestamp - lastEmitTime.current < 50) return
      lastEmitTime.current = timestamp

      // Add new particles when hovering
      if (isHovering) {
        const newParticlesCount = 3 // Number of particles to add each time
        for (let i = 0; i < newParticlesCount; i++) {
          // Random angle and distance for initial position
          const angle = Math.random() * Math.PI * 2
          const distance = Math.random() * 10 // Start close to the cursor

          // Random character
          const char = chars[Math.floor(Math.random() * chars.length)]

          // Create particle
          particles.current.push({
            x: mousePos.current.x + Math.cos(angle) * distance,
            y: mousePos.current.y + Math.sin(angle) * distance,
            char,
            size: 8 + Math.random() * 4, // Random size between 8-12px
            speedX: (Math.random() - 0.5) * 2, // Random horizontal speed
            speedY: (Math.random() - 0.5) * 2, // Random vertical speed
            life: 0,
            maxLife: 30 + Math.random() * 30, // Random lifespan
          })
        }
      }
    }

    // Animation function for the random letters effect
    const animate = (timestamp: number) => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Get the current ASCII color from CSS variable
      const computedStyle = getComputedStyle(document.documentElement)
      const asciiColor = computedStyle.getPropertyValue("--ascii-color").trim()

      // Emit new particles
      emitParticles(timestamp)

      // Update and draw particles
      particles.current = particles.current.filter((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Update life
        particle.life++

        // Calculate opacity based on life
        const opacity = 1 - particle.life / particle.maxLife

        // Draw the character
        ctx.font = `${particle.size}px monospace`
        ctx.fillStyle = asciiColor
          ? `${asciiColor}${Math.round(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`
          : `rgba(34, 197, 94, ${opacity})`
        ctx.fillText(particle.char, particle.x, particle.y)

        // Keep particle if still alive
        return particle.life < particle.maxLife
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Animation function for the custom cursor
    const animateCursor = () => {
      const ctx = cursorCanvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height)

      if (isHovering) {
        // Get the current ASCII color from CSS variable
        const computedStyle = getComputedStyle(document.documentElement)
        const asciiColor = computedStyle.getPropertyValue("--ascii-color").trim()

        // Draw custom cursor
        ctx.beginPath()

        // Outer ring
        ctx.arc(mousePos.current.x, mousePos.current.y, 12, 0, Math.PI * 2)
        ctx.strokeStyle = asciiColor || "#4ade80"
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Inner dot
        ctx.beginPath()
        ctx.arc(mousePos.current.x, mousePos.current.y, 3, 0, Math.PI * 2)
        ctx.fillStyle = asciiColor || "#4ade80"
        ctx.fill()

        // Crosshair lines
        ctx.beginPath()
        // Horizontal line
        ctx.moveTo(mousePos.current.x - 18, mousePos.current.y)
        ctx.lineTo(mousePos.current.x - 8, mousePos.current.y)
        ctx.moveTo(mousePos.current.x + 8, mousePos.current.y)
        ctx.lineTo(mousePos.current.x + 18, mousePos.current.y)
        // Vertical line
        ctx.moveTo(mousePos.current.x, mousePos.current.y - 18)
        ctx.lineTo(mousePos.current.x, mousePos.current.y - 8)
        ctx.moveTo(mousePos.current.x, mousePos.current.y + 8)
        ctx.lineTo(mousePos.current.x, mousePos.current.y + 18)

        ctx.strokeStyle = asciiColor || "#4ade80"
        ctx.lineWidth = 1
        ctx.stroke()
      }

      cursorAnimationRef.current = requestAnimationFrame(animateCursor)
    }

    // Start animations
    animationRef.current = requestAnimationFrame(animate)
    cursorAnimationRef.current = requestAnimationFrame(animateCursor)

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateCanvasSize)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mouseleave", handleMouseLeave)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      if (cursorAnimationRef.current) {
        cancelAnimationFrame(cursorAnimationRef.current)
      }
    }
  }, [isHovering])

  return (
    <div
      className={`relative ${className}`}
      ref={containerRef}
      style={{ cursor: "none" }} // Hide the default cursor
    >
      {children}

      {/* Add the scratch reveal component that covers the entire section */}
      {includeScratchReveal && <ScratchReveal text={scratchText} />}

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={cursorCanvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }} // Make sure cursor is above particles
      />
    </div>
  )
}
