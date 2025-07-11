"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type FontSize = "normal" | "large" | "x-large"
type Contrast = "normal" | "high"

interface A11yContextType {
  fontSize: FontSize
  increaseFontSize: () => void
  decreaseFontSize: () => void
  resetFontSize: () => void
  contrast: Contrast
  toggleContrast: () => void
  isReducedMotion: boolean
  toggleReducedMotion: () => void
}

const A11yContext = createContext<A11yContextType | undefined>(undefined)

export function useA11y() {
  const context = useContext(A11yContext)
  if (context === undefined) {
    throw new Error("useA11y must be used within an A11yProvider")
  }
  return context
}

interface A11yProviderProps {
  children: ReactNode
}

export function A11yProvider({ children }: A11yProviderProps) {
  const [fontSize, setFontSize] = useState<FontSize>("normal")
  const [contrast, setContrast] = useState<Contrast>("normal")
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Check for user's motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Apply font size to document
  useEffect(() => {
    const htmlElement = document.documentElement

    if (fontSize === "normal") {
      htmlElement.style.fontSize = ""
    } else if (fontSize === "large") {
      htmlElement.style.fontSize = "112.5%" // 18px base
    } else if (fontSize === "x-large") {
      htmlElement.style.fontSize = "125%" // 20px base
    }
  }, [fontSize])

  // Apply contrast to document
  useEffect(() => {
    const htmlElement = document.documentElement

    if (contrast === "high") {
      htmlElement.classList.add("high-contrast")
    } else {
      htmlElement.classList.remove("high-contrast")
    }
  }, [contrast])

  // Apply reduced motion to document
  useEffect(() => {
    const htmlElement = document.documentElement

    if (isReducedMotion) {
      htmlElement.classList.add("reduce-motion")
    } else {
      htmlElement.classList.remove("reduce-motion")
    }
  }, [isReducedMotion])

  const increaseFontSize = () => {
    setFontSize((prev) => {
      if (prev === "normal") return "large"
      if (prev === "large") return "x-large"
      return prev
    })
  }

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      if (prev === "x-large") return "large"
      if (prev === "large") return "normal"
      return prev
    })
  }

  const resetFontSize = () => {
    setFontSize("normal")
  }

  const toggleContrast = () => {
    setContrast((prev) => (prev === "normal" ? "high" : "normal"))
  }

  const toggleReducedMotion = () => {
    setIsReducedMotion((prev) => !prev)
  }

  return (
    <A11yContext.Provider
      value={{
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        contrast,
        toggleContrast,
        isReducedMotion,
        toggleReducedMotion,
      }}
    >
      {children}
    </A11yContext.Provider>
  )
}
