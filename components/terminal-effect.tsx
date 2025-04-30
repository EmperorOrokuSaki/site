"use client"

import { useEffect, useRef } from "react"

export function TerminalEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()
    window.addEventListener("resize", setCanvasSize)

    // Matrix rain effect
    const fontSize = 10
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = []

    // Initialize drops - reduce density for better performance
    for (let i = 0; i < columns; i += 2) {
      drops[i] = Math.floor(Math.random() * -100)
    }

    // Characters to display
    const chars = "01"

    // Animation loop with frame limiting
    let lastTime = 0
    const fps = 15 // Limit to 15 FPS for better performance
    const frameInterval = 1000 / fps

    function draw(timestamp: number) {
      const deltaTime = timestamp - lastTime

      if (deltaTime >= frameInterval) {
        lastTime = timestamp - (deltaTime % frameInterval)

        // Semi-transparent black background to create trail effect
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Green text
        ctx.fillStyle = "#00550022"
        ctx.font = `${fontSize}px monospace`

        // Loop through drops
        for (let i = 0; i < drops.length; i++) {
          if (drops[i] === undefined) continue

          // Random character
          const char = chars[Math.floor(Math.random() * chars.length)]

          // Draw character
          ctx.fillText(char, i * fontSize, drops[i] * fontSize)

          // Move drop down
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0
          }

          drops[i]++
        }
      }

      animationRef.current = requestAnimationFrame(draw)
    }

    animationRef.current = requestAnimationFrame(draw)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", setCanvasSize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />
}
