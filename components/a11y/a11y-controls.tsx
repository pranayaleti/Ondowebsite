"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useA11y } from "./a11y-provider"
import { Accessibility, ZoomIn, ZoomOut, RotateCcw, Sun, Moon, PauseCircle } from "lucide-react"

export function A11yControls() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    fontSize,
    increaseFontSize,
    decreaseFontSize,
    resetFontSize,
    contrast,
    toggleContrast,
    isReducedMotion,
    toggleReducedMotion,
  } = useA11y()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        variant="default"
        size="icon"
        className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close accessibility menu" : "Open accessibility menu"}
        aria-expanded={isOpen}
        aria-controls="a11y-controls"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="h-5 w-5" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="2" fill="white" />
          <path d="M12 2 a10 10 0 0 0 0 20 z" fill="black" />
        </svg>
      </Button>

      {isOpen && (
        <div
          id="a11y-controls"
          className="absolute bottom-full right-0 mb-2 p-4 bg-white rounded-lg shadow-lg border border-gray-200 w-64"
          role="menu"
        >
          <h3 className="text-sm font-medium mb-2">Accessibility Options</h3>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Text Size</span>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={decreaseFontSize}
                  disabled={fontSize === "normal"}
                  aria-label="Decrease text size"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={increaseFontSize}
                  disabled={fontSize === "x-large"}
                  aria-label="Increase text size"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={resetFontSize}
                  disabled={fontSize === "normal"}
                  aria-label="Reset text size"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Contrast</span>
              <Button
                variant={contrast === "high" ? "default" : "outline"}
                size="sm"
                onClick={toggleContrast}
                aria-pressed={contrast === "high"}
                className="h-8"
              >
                {contrast === "high" ? (
                  <>
                    <Moon className="h-4 w-4 mr-1" /> High
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 mr-1" /> Normal
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">Reduce Motion</span>
              <Button
                variant={isReducedMotion ? "default" : "outline"}
                size="sm"
                onClick={toggleReducedMotion}
                aria-pressed={isReducedMotion}
                className="h-8"
              >
                <PauseCircle className="h-4 w-4 mr-1" />
                {isReducedMotion ? "On" : "Off"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
