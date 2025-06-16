"use client";

import Image from "next/image";
import { useMobileDetection } from "@/hooks/use-mobile-detection";

interface MobileOptimizedImageProps {
  src: string;
  mobileSrc?: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
  quality?: number;
}

export function MobileOptimizedImage({
  src,
  mobileSrc,
  alt,
  width,
  height,
  className = "",
  priority = false,
  loading = "lazy",
  quality = 75,
}: MobileOptimizedImageProps) {
  const { isMobile, isLoaded } = useMobileDetection();

  // Don't render until we know if it's mobile
  if (!isLoaded) {
    return (
      <div
        className={`bg-muted animate-pulse ${className}`}
        style={{ width, height }}
      />
    );
  }

  const imageSrc = isMobile && mobileSrc ? mobileSrc : src;
  const imageQuality = isMobile ? Math.min(quality, 60) : quality; // Lower quality on mobile

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={loading}
      quality={imageQuality}
      sizes={
        isMobile ? "(max-width: 768px) 100vw" : "(max-width: 1200px) 50vw, 33vw"
      }
    />
  );
}
