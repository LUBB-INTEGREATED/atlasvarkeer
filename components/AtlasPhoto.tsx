'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HardHat, ShieldCheck } from 'lucide-react';

interface AtlasPhotoProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  overlayGradient?: boolean;
  badgeText?: string;
}

/**
 * Photo component for Atlas Holland B.V.
 * Supports built-in assets, Supabase Storage URLs, and IndexedDB data URLs uploaded via the CMS.
 */
export function AtlasPhoto({
  src,
  alt,
  className = '',
  imgClassName = '',
  priority = false,
  overlayGradient = false,
  badgeText,
}: AtlasPhotoProps) {
  const [hasError, setHasError] = useState(false);

  const normalizedSrc = (src || '').startsWith('/src/assets/images/')
    ? src.replace('/src/assets/images/', '/assets/images/')
    : src || '';

  const isNextImageSafe =
    normalizedSrc.startsWith('/') ||
    normalizedSrc.includes('images.unsplash.com') ||
    normalizedSrc.includes('picsum.photos');

  return (
    <div className={`relative overflow-hidden bg-atlas-black ${className}`}>
      {normalizedSrc && !hasError ? (
        isNextImageSafe ? (
          <Image
            src={normalizedSrc}
            alt={alt || 'Atlas Holland B.V.'}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`object-cover ${imgClassName}`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={normalizedSrc}
            alt={alt || 'Atlas Holland B.V.'}
            loading={priority ? 'eager' : 'lazy'}
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover ${imgClassName}`}
          />
        )
      ) : (
        <div
          role="img"
          aria-label={alt || 'Atlas Holland B.V.'}
          className="w-full h-full min-h-[220px] flex flex-col items-center justify-center p-6 bg-gradient-to-br from-atlas-black via-neutral-900 to-atlas-orange/30 text-white text-center"
        >
          <div className="w-12 h-12 rounded-full bg-atlas-orange/20 border border-atlas-orange/40 flex items-center justify-center mb-3 text-atlas-orange">
            <HardHat className="w-6 h-6" strokeWidth={1.75} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-atlas-orange mb-1">
            Atlas Holland B.V.
          </p>
          <p className="text-sm text-neutral-300 max-w-xs line-clamp-2">{alt}</p>
        </div>
      )}

      {overlayGradient && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-atlas-black/80 via-atlas-black/25 to-transparent pointer-events-none"
        />
      )}

      {badgeText && (
        <div className="absolute bottom-3 left-3 z-10 inline-flex items-center gap-1.5 bg-atlas-black/85 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-lg border border-white/10">
          <ShieldCheck className="w-3.5 h-3.5 text-atlas-orange shrink-0" strokeWidth={1.75} />
          <span>{badgeText}</span>
        </div>
      )}
    </div>
  );
}
