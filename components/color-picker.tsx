"use client"

import { useState, useEffect } from "react"
import { X, ChevronUp, ChevronDown, Palette } from "lucide-react"

interface ColorOption {
  name: string
  cssVar: string
  lightValue: string
  darkValue: string
}

export function ColorPicker() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Define the color options that can be customized
  const colorOptions: ColorOption[] = [
    {
      name: "Background Overlay",
      cssVar: "--bg-overlay",
      lightValue: "rgba(251, 251, 253, 0.95)", // #fbfbfd with 95% opacity
      darkValue: "transparent",
    },
    { name: "Text Primary", cssVar: "--text-primary", lightValue: "#1e1e20", darkValue: "#4ade80" },
    { name: "Text Secondary", cssVar: "--text-secondary", lightValue: "#324fcf", darkValue: "#86efac" },
    { name: "Text Muted", cssVar: "--text-muted", lightValue: "#9aa1ab", darkValue: "#22c55e" },
    { name: "Border", cssVar: "--border-color", lightValue: "#d0d6dd", darkValue: "#15803d" },
    { name: "Hover Background", cssVar: "--hover-bg", lightValue: "#324fcf", darkValue: "#15803d" },
    { name: "Hover Text", cssVar: "--hover-text", lightValue: "#ffffff", darkValue: "#000000" },
    { name: "ASCII Art", cssVar: "--ascii-color", lightValue: "#3e86ff", darkValue: "#22c55e" },
  ]

  // Initialize color states
  const [colors, setColors] = useState<Record<string, string>>({})

  // Detect theme changes
  useEffect(() => {
    const updateThemeState = () => {
      const isDark = document.documentElement.classList.contains("dark")
      setIsDarkMode(isDark)

      // Reset colors when theme changes
      const newColors: Record<string, string> = {}
      colorOptions.forEach((option) => {
        newColors[option.cssVar] = isDark ? option.darkValue : option.lightValue
      })
      setColors(newColors)

      // Apply initial colors
      applyColors(newColors)
    }

    // Set up a mutation observer to detect class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          updateThemeState()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    // Initial setup
    updateThemeState()

    return () => observer.disconnect()
  }, [])

  // Apply colors to CSS variables
  const applyColors = (colorValues: Record<string, string>) => {
    Object.entries(colorValues).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value)
    })
  }

  // Handle color change
  const handleColorChange = (cssVar: string, value: string) => {
    const newColors = { ...colors, [cssVar]: value }
    setColors(newColors)
    applyColors(newColors)
  }

  // Reset colors to defaults
  const resetColors = () => {
    const defaultColors: Record<string, string> = {}
    colorOptions.forEach((option) => {
      defaultColors[option.cssVar] = isDarkMode ? option.darkValue : option.lightValue
    })
    setColors(defaultColors)
    applyColors(defaultColors)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 bg-gray-800 dark:bg-green-700 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-green-600 transition-all"
        aria-label="Open color picker"
      >
        <Palette className="h-5 w-5" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-80 transition-all">
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-gray-700 dark:text-gray-300" />
          <h3 className="font-medium text-gray-800 dark:text-white">Color Picker</h3>
          <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded">
            {isDarkMode ? "Dark Mode" : "Light Mode"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label={isMinimized ? "Expand" : "Minimize"}
          >
            {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close color picker"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {colorOptions.map((option) => (
              <div key={option.cssVar} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={option.cssVar} className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.name}
                  </label>
                  <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                    {colors[option.cssVar] || (isDarkMode ? option.darkValue : option.lightValue)}
                  </span>
                </div>
                <input
                  type="color"
                  id={option.cssVar}
                  value={colors[option.cssVar] || (isDarkMode ? option.darkValue : option.lightValue)}
                  onChange={(e) => handleColorChange(option.cssVar, e.target.value)}
                  className="w-full h-8 rounded cursor-pointer"
                />
                {option.cssVar === "--bg-overlay" && (
                  <div className="flex items-center mt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={Number.parseInt((colors[option.cssVar] || "").split(",")[3] || "0.95") * 100}
                      onChange={(e) => {
                        const alpha = e.target.value / 100
                        const currentColor = colors[option.cssVar] || "rgba(251, 251, 253, 0.95)"
                        const rgbPart = currentColor.split(",").slice(0, 3).join(",")
                        handleColorChange(option.cssVar, `${rgbPart}, ${alpha})`)
                      }}
                      className="w-full"
                    />
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                      {Number.parseInt((colors[option.cssVar] || "").split(",")[3] || "0.95") * 100}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={resetColors}
              className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white text-sm rounded"
            >
              Reset to Defaults
            </button>
            <div className="text-xs text-gray-500 dark:text-gray-400 italic self-center">Changes are temporary</div>
          </div>
        </div>
      )}
    </div>
  )
}
