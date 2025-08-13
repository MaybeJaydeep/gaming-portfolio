/**
 * Image optimization utilities for performance
 * Handles WebP format conversion, lazy loading, and responsive images
 */

// Check if browser supports WebP format
export const supportsWebP = () => {
  if (typeof window === 'undefined') return false;

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Generate responsive image sources with WebP fallback
export const generateImageSources = (basePath, sizes = [400, 800, 1200]) => {
  const webpSupported = supportsWebP();
  const extension = webpSupported ? 'webp' : 'jpg';

  return {
    srcSet: sizes
      .map(size => `${basePath}-${size}w.${extension} ${size}w`)
      .join(', '),
    src: `${basePath}-800w.${extension}`, // Default fallback
    sizes: '(max-width: 640px) 400px, (max-width: 1024px) 800px, 1200px',
  };
};

// Lazy loading intersection observer
let imageObserver;

export const initImageObserver = () => {
  if (typeof window === 'undefined' || imageObserver) return imageObserver;

  imageObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          const srcSet = img.dataset.srcset;

          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }

          if (srcSet) {
            img.srcSet = srcSet;
            img.removeAttribute('data-srcset');
          }

          img.classList.remove('lazy-loading');
          img.classList.add('lazy-loaded');

          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.01,
    }
  );

  return imageObserver;
};

// Preload critical images
export const preloadImage = src => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// Optimize image loading with blur placeholder
export const createBlurPlaceholder = (width = 40, height = 40) => {
  if (typeof window === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  // Create a simple gradient placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#1a1a1a');
  gradient.addColorStop(1, '#2a2a2a');

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  return canvas.toDataURL('image/jpeg', 0.1);
};
