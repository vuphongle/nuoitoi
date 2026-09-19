'use client';

import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { useState } from 'react';
import { images } from '@/shared/assets';
import { cn } from '@/lib/utils';
import { getCustomImageSourceMode } from './custom-image-source';

interface CustomImageProps {
  src?: string | StaticImageData | null;
  alt: string;
  fallbackSrc?: string | StaticImageData;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  className?: string;
}

export function CustomImage({
  src,
  alt,
  fallbackSrc = images.imageDefault,
  priority = false,
  fill = true,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  className,
}: CustomImageProps) {
  const [error, setError] = useState(false);
  const requestedSrc = error || !src ? fallbackSrc : src;
  const requestedMode = getCustomImageSourceMode(requestedSrc);
  const effectiveSrc = requestedMode === 'fallback' ? images.imageDefault : requestedSrc;
  const sourceMode = getCustomImageSourceMode(effectiveSrc);

  if (sourceMode === 'native' && typeof effectiveSrc === 'string') {
    return (
      // Dynamic API hosts cannot be preconfigured safely for Next's image optimizer.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={effectiveSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={() => setError(true)}
        className={cn(fill && 'absolute inset-0 h-full w-full', className)}
      />
    );
  }

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      fill={fill}
      preload={priority}
      sizes={sizes}
      onError={() => setError(true)}
      className={className}
    />
  );
}
