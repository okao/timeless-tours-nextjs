// components/base/ImageGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  title?: string;
  alt?: string;
}

export default function ImageGallery({ images, alt = 'Gallery image' }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1);
    }
  };

  const goToNext = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1);
    }
  };

  const handleImageError = (index: number) => {
    setImageErrors(prev => new Set(prev).add(index));
  };

  const getFallbackImage = (index: number) => {
    const fallbackImages = [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=400&fit=crop&crop=center'
    ];
    return fallbackImages[index % fallbackImages.length];
  };

  // Filter out empty or invalid image URLs and replace with fallbacks
  const validImages = images.map((image, index) => {
    if (!image || image.trim() === '' || image.includes('readdy.ai')) {
      return getFallbackImage(index);
    }
    return image;
  });

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {validImages.map((image, index) => (
          <div 
            key={index} 
            className="relative aspect-square overflow-hidden rounded-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={imageErrors.has(index) ? getFallbackImage(index) : image}
              alt={`${alt} ${index + 1}`}
              fill
              className="object-cover hover:scale-110 transition-transform duration-300"
              onError={() => handleImageError(index)}
            />
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
              <i className="ri-zoom-in-line text-white text-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></i>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <div className="relative w-full h-[80vh]">
              <Image
                src={imageErrors.has(selectedImage) ? getFallbackImage(selectedImage) : validImages[selectedImage]}
                alt={`${alt} ${selectedImage + 1}`}
                fill
                className="object-contain"
                onError={() => handleImageError(selectedImage)}
              />
            </div>
            
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110 z-10"
              aria-label="Close lightbox"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Previous image"
                >
                  <i className="ri-arrow-left-line text-xl"></i>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
                  aria-label="Next image"
                >
                  <i className="ri-arrow-right-line text-xl"></i>
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full">
              {selectedImage + 1} / {validImages.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}