import type { StaticImageData } from 'next/image';

export type CustomImageSourceMode = 'next' | 'native' | 'fallback';

const NEXT_IMAGE_HOSTS = new Set(['res.cloudinary.com']);

export function getCustomImageSourceMode(
  src?: string | StaticImageData | null
): CustomImageSourceMode {
  if (!src) return 'fallback';
  if (typeof src !== 'string') return 'next';
  if (src.startsWith('/')) return 'next';

  try {
    const url = new URL(src);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'fallback';
    return NEXT_IMAGE_HOSTS.has(url.hostname) ? 'next' : 'native';
  } catch {
    return 'fallback';
  }
}
