"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LazyImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
  sizes?: string
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes = "100vw",
  ...props
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(!priority)

  // For SSR compatibility
  useEffect(() => {
    if (priority) {
      setIsLoading(false)
    }
  }, [priority])

  return (
    <div className="relative overflow-hidden" style={{ aspectRatio: width / height }}>
      {isLoading && <div className="absolute inset-0 skeleton-loader" aria-hidden="true" />}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn("transition-opacity duration-500", isLoading ? "opacity-0" : "opacity-100", className)}
        onLoad={() => setIsLoading(false)}
        priority={priority}
        sizes={sizes}
        {...props}
      />
    </div>
  )
}
