'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  fallbackSrc?: string;
  className?: string;
}

export function OptimizedImage({ 
  src, 
  alt, 
  fallbackSrc = '/placeholder-image.jpg',
  className = '',
  ...props 
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <div className={`position-relative overflow-hidden ${className}`}>
      {isLoading && (
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-light"
          style={{ zIndex: 1 }}
        >
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      
      <Image
        src={imgSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`${hasError ? 'opacity-50' : ''} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          transition: 'opacity 0.3s ease-in-out',
          objectFit: 'cover'
        }}
        {...props}
      />
      
      {hasError && (
        <div className="position-absolute top-50 start-50 translate-middle text-muted">
          <i className="bi bi-image display-4"></i>
          <div className="small text-center mt-2">Image unavailable</div>
        </div>
      )}
    </div>
  );
}