import React, { useEffect, useRef, useState } from 'react';
import {
  generateImageSources,
  initImageObserver,
  createBlurPlaceholder,
} from '../../utils/imageOptimization';

const OptimizedImage = ({
  src,
  alt = '',
  className = '',
  sizes,
  lazy = true,
  placeholder = true,
  onLoad,
  onError,
  ...props
}) => {
  const imgRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [blurPlaceholder, setBlurPlaceholder] = useState('');

  useEffect(() => {
    if (placeholder) {
      setBlurPlaceholder(createBlurPlaceholder());
    }
  }, [placeholder]);

  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    const observer = initImageObserver();
    if (observer) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [lazy]);

  const handleLoad = e => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = e => {
    setHasError(true);
    if (onError) onError(e);
  };

  // Generate responsive sources if src is a base path
  const imageSources = src.includes('-')
    ? null
    : generateImageSources(src, sizes);

  const imageProps = {
    ref: imgRef,
    alt,
    className: `${className} ${
      isLoaded ? 'lazy-loaded' : 'lazy-loading'
    } transition-opacity duration-300 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`,
    onLoad: handleLoad,
    onError: handleError,
    ...props,
  };

  if (lazy) {
    // For lazy loading, use data attributes
    imageProps['data-src'] = imageSources ? imageSources.src : src;
    if (imageSources) {
      imageProps['data-srcset'] = imageSources.srcSet;
      imageProps.sizes = imageSources.sizes;
    }
    // Show placeholder while loading
    imageProps.src = placeholder
      ? blurPlaceholder
      : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxYTFhMWEiLz48L3N2Zz4=';
  } else {
    // For immediate loading
    imageProps.src = imageSources ? imageSources.src : src;
    if (imageSources) {
      imageProps.srcSet = imageSources.srcSet;
      imageProps.sizes = imageSources.sizes;
    }
  }

  if (hasError) {
    return (
      <div
        className={`${className} bg-gray-800 flex items-center justify-center text-gray-400`}
      >
        <span>Image failed to load</span>
      </div>
    );
  }

  return <img {...imageProps} />;
};

export default OptimizedImage;
