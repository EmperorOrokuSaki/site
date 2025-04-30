import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Nima's Terminal",
  description: "Personal terminal of Nima showcasing projects, work experience, and writings.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "black", color: "#4ade80", fontFamily: '"Courier New", Courier, monospace' }}>
        {children}
      </body>
    </html>
  )
}
