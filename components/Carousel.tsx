'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';

interface Props {
  images: string[];
  title: string;
  compact?: boolean; // true = card thumbnail mode
}

function proxyImg(url: string): string {
  if (url.includes('fbcdn.net') || url.includes('facebook.com')) {
    return `/api/img?url=${encodeURIComponent(url)}`;
  }
  return url;
}

export default function Carousel({ images, title, compact = false }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (images.length === 0) {
    return (
      <div className={`w-full bg-gray-100 flex items-center justify-center text-gray-300 ${compact ? 'aspect-[4/3]' : 'aspect-video'}`}>
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative group/carousel overflow-hidden">
      {/* Embla viewport */}
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {images.map((img, i) => (
            <div key={i} className={`flex-none w-full ${compact ? 'aspect-[4/3]' : 'aspect-video'} bg-gray-100`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={proxyImg(img)}
                alt={`${title} — photo ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Prev / Next — only show if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous image"
            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover/carousel:opacity-100 ${compact ? 'w-6 h-6' : 'w-9 h-9'}`}
          >
            <svg className={compact ? 'w-3 h-3' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next image"
            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-opacity opacity-0 group-hover/carousel:opacity-100 ${compact ? 'w-6 h-6' : 'w-9 h-9'}`}
          >
            <svg className={compact ? 'w-3 h-3' : 'w-4 h-4'} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); emblaApi?.scrollTo(i); }}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all ${compact ? 'w-1 h-1' : 'w-2 h-2'} ${i === current ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
