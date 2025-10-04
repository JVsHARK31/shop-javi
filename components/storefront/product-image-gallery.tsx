'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <Card className="aspect-square overflow-hidden bg-muted">
        <div className="flex h-full items-center justify-center text-muted-foreground">
          Tidak ada gambar
        </div>
      </Card>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <Card className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={images[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          loading="eager"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />

        {images.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 shadow-lg"
              onClick={goToPrevious}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 sm:h-10 sm:w-10 shadow-lg"
              onClick={goToNext}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>

            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2">
              <div className="rounded-full bg-black/60 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm text-white font-medium shadow-lg">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          </>
        )}
      </Card>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-4 gap-2 sm:gap-3">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all active:scale-95 ${
                index === currentIndex
                  ? 'border-primary ring-1 sm:ring-2 ring-primary ring-offset-1 sm:ring-offset-2'
                  : 'border-transparent hover:border-muted-foreground/50'
              }`}
            >
              <img
                src={image}
                alt={`${alt} - Thumbnail ${index + 1}`}
                loading="lazy"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg?auto=compress&cs=tinysrgb&w=200';
                }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
