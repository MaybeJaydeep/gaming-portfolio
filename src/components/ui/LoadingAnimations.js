import React from 'react';
import { motion } from 'framer-motion';

// Gaming-themed loading spinner
const spinnerVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Pulse animation for loading states
const pulseVariants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Skeleton shimmer effect
const shimmerVariants = {
  animate: {
    x: ['-100%', '100%'],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Gaming HUD loading animation
const hudLoadingVariants = {
  animate: {
    opacity: [0.3, 1, 0.3],
    boxShadow: [
      '0 0 5px #00ffff',
      '0 0 20px #00ffff, 0 0 30px #00ffff',
      '0 0 5px #00ffff',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

/**
 * Gaming-themed loading spinner
 */
export const GamingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        variants={spinnerVariants}
        animate="animate"
        className={`${sizeClasses[size]} border-2 border-cyan-500 border-t-transparent rounded-full`}
      />
    </div>
  );
};

/**
 * Pulsing loading indicator
 */
export const PulseLoader = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={pulseVariants}
      animate="animate"
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Skeleton loading component with shimmer effect
 */
export const SkeletonLoader = ({
  width = '100%',
  height = '20px',
  className = '',
  rounded = 'md',
}) => {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`bg-gray-700 relative overflow-hidden ${roundedClasses[rounded]} ${className}`}
      style={{ width, height }}
    >
      <motion.div
        variants={shimmerVariants}
        animate="animate"
        className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
      />
    </div>
  );
};

/**
 * Gaming HUD loading frame
 */
export const HUDLoader = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={hudLoadingVariants}
      animate="animate"
      className={`border border-cyan-500 bg-gray-900/50 backdrop-blur-sm ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Text loading animation with typewriter effect
 */
export const TypewriterLoader = ({ text, speed = 100, className = '' }) => {
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-cyan-400"
      >
        |
      </motion.span>
    </div>
  );
};

/**
 * Progress bar loading animation
 */
export const ProgressLoader = ({
  progress = 0,
  showPercentage = true,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-300">Loading...</span>
        {showPercentage && (
          <span className="text-sm text-cyan-400">{Math.round(progress)}%</span>
        )}
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

/**
 * Skeleton card for project/skill cards
 */
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div
      className={`p-6 bg-gray-800 rounded-lg border border-gray-700 ${className}`}
    >
      <SkeletonLoader height="24px" className="mb-4" rounded="md" />
      <SkeletonLoader height="16px" className="mb-2" width="80%" />
      <SkeletonLoader height="16px" className="mb-4" width="60%" />
      <div className="flex gap-2">
        <SkeletonLoader height="20px" width="60px" rounded="full" />
        <SkeletonLoader height="20px" width="80px" rounded="full" />
        <SkeletonLoader height="20px" width="70px" rounded="full" />
      </div>
    </div>
  );
};

/**
 * Skeleton list for navigation or menu items
 */
export const SkeletonList = ({ items = 5, className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <SkeletonLoader
          key={index}
          height="40px"
          width={`${Math.random() * 30 + 60}%`}
          className="mb-2"
        />
      ))}
    </div>
  );
};

/**
 * Gaming-themed loading screen overlay
 */
export const LoadingOverlay = ({
  isLoading,
  message = 'Loading...',
  progress,
  children,
}) => {
  if (!isLoading) return children;

  return (
    <div className="relative">
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <HUDLoader className="p-8 rounded-lg">
          <div className="text-center">
            <GamingSpinner size="large" className="mb-4" />
            <TypewriterLoader
              text={message}
              className="text-lg text-cyan-400 mb-4"
            />
            {progress !== undefined && (
              <ProgressLoader progress={progress} className="w-64" />
            )}
          </div>
        </HUDLoader>
      </motion.div>
    </div>
  );
};
