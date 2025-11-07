import React, { useState, useRef, useEffect } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  priority = false,
  placeholder = 'blur',
  quality = 75,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Check if this is a static file from public/ folder
  const isStaticFile = src.startsWith('/') && !src.startsWith('/assets/');
  
  // Convert image path to WebP (only for non-static files)
  const getWebPSrc = (originalSrc) => {
    if (isStaticFile) return originalSrc; // Don't convert static files
    if (originalSrc.includes('.webp')) return originalSrc;
    if (originalSrc.includes('.jpg') || originalSrc.includes('.jpeg')) {
      return originalSrc.replace(/\.(jpg|jpeg)$/i, '.webp');
    }
    if (originalSrc.includes('.png')) {
      return originalSrc.replace(/\.png$/i, '.webp');
    }
    return originalSrc;
  };

  const webpSrc = getWebPSrc(src);
  const fallbackSrc = src;

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // Generate responsive srcSet for WebP (skip for static files)
  const generateSrcSet = (baseSrc, widths = [320, 640, 768, 1024, 1280, 1536]) => {
    if (isStaticFile) return undefined; // No srcSet for static files
    return widths
      .map(w => `${baseSrc}?w=${w}&q=${quality} ${w}w`)
      .join(', ');
  };

  const webpSrcSet = generateSrcSet(webpSrc);
  const fallbackSrcSet = generateSrcSet(fallbackSrc);

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      {...props}
    >
      {/* Placeholder/Blur */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{ width: '100%', height: '100%' }}
        />
      )}

      {/* WebP Image */}
      {isInView && !hasError && (
        isStaticFile ? (
          <img
            src={fallbackSrc}
            alt={alt}
            width={width}
            height={height}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
        ) : (
          <picture>
            <source
              srcSet={webpSrcSet}
              sizes={sizes}
              type="image/webp"
            />
            <img
              src={fallbackSrc}
              srcSet={fallbackSrcSet}
              sizes={sizes}
              alt={alt}
              width={width}
              height={height}
              className={`transition-opacity duration-300 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleLoad}
              onError={handleError}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
        )
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Image failed to load</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
