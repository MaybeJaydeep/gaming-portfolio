import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccessibilityContext } from '../../contexts/AccessibilityContext';

const GlitchText = ({
  children,
  intensity = 'medium',
  duration = 2000,
  className = '',
  disabled = false,
  ...props
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const { reducedMotion } = useAccessibilityContext();

  // Intensity configurations
  const intensityConfig = {
    low: {
      glitchFrequency: 0.1,
      maxOffset: 2,
      colorShift: 0.5,
      animationDuration: 0.1,
    },
    medium: {
      glitchFrequency: 0.2,
      maxOffset: 4,
      colorShift: 1,
      animationDuration: 0.15,
    },
    high: {
      glitchFrequency: 0.3,
      maxOffset: 8,
      colorShift: 2,
      animationDuration: 0.2,
    },
  };

  const config = intensityConfig[intensity] || intensityConfig.medium;

  // Auto-trigger glitch effect
  useEffect(() => {
    if (disabled || reducedMotion) return;

    const interval = setInterval(() => {
      if (Math.random() < config.glitchFrequency) {
        setIsGlitching(true);
        setTimeout(
          () => setIsGlitching(false),
          config.animationDuration * 1000
        );
      }
    }, duration / 10);

    return () => clearInterval(interval);
  }, [duration, config, disabled, reducedMotion]);

  // Generate random glitch offset
  const getGlitchOffset = () => ({
    x: (Math.random() - 0.5) * config.maxOffset,
    y: (Math.random() - 0.5) * config.maxOffset,
  });

  const glitchVariants = {
    normal: {
      x: 0,
      y: 0,
      textShadow: 'none',
      filter: 'none',
    },
    glitch: {
      x: [0, getGlitchOffset().x, -getGlitchOffset().x, 0],
      y: [0, getGlitchOffset().y, -getGlitchOffset().y, 0],
      textShadow: [
        'none',
        `${config.colorShift}px 0 #ff0000, -${config.colorShift}px 0 #00ffff`,
        `-${config.colorShift}px 0 #ff0000, ${config.colorShift}px 0 #00ffff`,
        'none',
      ],
      filter: [
        'none',
        'hue-rotate(90deg) saturate(1.5)',
        'hue-rotate(-90deg) saturate(1.5)',
        'none',
      ],
      transition: {
        duration: config.animationDuration,
        times: [0, 0.3, 0.7, 1],
        ease: 'easeInOut',
      },
    },
  };

  if (disabled || reducedMotion) {
    return (
      <span className={className} {...props}>
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={`relative inline-block ${className}`}
      variants={glitchVariants}
      animate={isGlitching ? 'glitch' : 'normal'}
      style={{
        // Ensure text remains readable during animations
        minHeight: '1em',
        display: 'inline-block',
      }}
      {...props}
    >
      {children}

      {/* Additional glitch layers for enhanced effect */}
      {isGlitching && (
        <>
          <motion.span
            className="absolute inset-0 text-red-500 opacity-70"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              transform: `translateX(${config.maxOffset * 0.5}px)`,
            }}
            aria-hidden="true"
          >
            {children}
          </motion.span>
          <motion.span
            className="absolute inset-0 text-cyan-400 opacity-70"
            style={{
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              transform: `translateX(-${config.maxOffset * 0.5}px)`,
            }}
            aria-hidden="true"
          >
            {children}
          </motion.span>
        </>
      )}
    </motion.span>
  );
};

export default GlitchText;
