import React from 'react';
import { motion } from 'framer-motion';
import { useParallax } from '../../hooks/useScrollAnimations';

/**
 * ParallaxContainer component for creating parallax scrolling effects
 */
const ParallaxContainer = ({
  children,
  speed = 0.5,
  direction = 'vertical',
  className = '',
  offset = 0,
  ...props
}) => {
  const { elementRef, transform } = useParallax({ speed, direction });

  return (
    <motion.div
      ref={elementRef}
      className={`relative ${className}`}
      style={{
        transform: `${transform} translateY(${offset}px)`,
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * ParallaxLayer component for layered parallax effects
 */
export const ParallaxLayer = ({
  children,
  speed = 0.5,
  zIndex = 1,
  className = '',
  ...props
}) => {
  const { elementRef, transform } = useParallax({ speed });

  return (
    <div
      ref={elementRef}
      className={`absolute inset-0 ${className}`}
      style={{
        transform,
        zIndex,
        willChange: 'transform',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * ParallaxText component for text with parallax effect
 */
export const ParallaxText = ({
  children,
  speed = 0.3,
  className = '',
  ...props
}) => {
  const { elementRef, transform } = useParallax({ speed });

  return (
    <motion.div
      ref={elementRef}
      className={`relative ${className}`}
      style={{
        transform,
        willChange: 'transform',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxContainer;
