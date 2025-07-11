"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  containerClassName?: string
  priority?: boolean
  sizes?: string
  quality?: number
  blurDataURL?: string
  placeholder?: "blur" | "empty"
  onLoad?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  containerClassName,
  priority = false,
  sizes = "100vw",
  quality = 85,
  blurDataURL,
  placeholder,
  onLoad,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority)

  // For SSR compatibility
  useEffect(() => {
    if (priority) {
      setIsLoading(false)
    }
  }, [priority])

  const handleImageLoad = () => {
    setIsLoading(false)
    if (onLoad) onLoad()
  }

  // Generate aspect ratio to prevent layout shift
  const aspectRatio = width / height

  return (
    <div className={cn("relative overflow-hidden", containerClassName)} style={{ aspectRatio }}>
      {isLoading && !placeholder && <div className="absolute inset-0 skeleton-loader" aria-hidden="true" />}
      <Image
        src={src || "/placeholder.svg"}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          "transition-opacity duration-500",
          isLoading && !placeholder ? "opacity-0" : "opacity-100",
          className,
        )}
        onLoad={handleImageLoad}
        priority={priority}
        sizes={sizes}
        quality={quality}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        blurDataURL={blurDataURL}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}
