import React from 'react';
import { motion } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';
import { useScrollProgress } from '../../hooks/useScrollAnimations';
import { useResponsive } from '../../hooks/useResponsive';

const ScrollProgress = ({
  className = '',
  showLabels = true,
  position = 'right',
  showPercentage = true,
  ...props
}) => {
  const { navItems, activeSection, navigateToSection } = useNavigation();
  const { progress, scrollDirection } = useScrollProgress({ throttleMs: 16 });
  const { isMobile, isTablet } = useResponsive();

  // Hide on mobile to avoid interference
  if (isMobile) {
    return null;
  }

  const positionClasses = {
    left: 'left-4',
    right: 'right-4',
    center: 'left-1/2 transform -translate-x-1/2',
  };

  const positionClass = positionClasses[position] || positionClasses.right;

  const handleSectionClick = sectionId => {
    navigateToSection(sectionId, {
      duration: 800,
      easing: 'easeInOutCubic',
    });
  };

  return (
    <motion.div
      className={`fixed top-1/2 transform -translate-y-1/2 z-40 ${positionClass} ${className}`}
      initial={{ opacity: 0, x: position === 'left' ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      {...props}
    >
      {/* Main progress bar */}
      <div className="relative">
        {/* Background track */}
        <div className="w-1 h-64 bg-gray-800/50 backdrop-blur-sm rounded-full overflow-hidden border border-gray-700/30">
          {/* Progress fill */}
          <motion.div
            className="w-full bg-gradient-to-t from-cyan-400 via-green-400 to-purple-400 rounded-full origin-bottom"
            initial={{ height: '0%' }}
            animate={{ height: `${progress}%` }}
            transition={{ duration: 0.1, ease: 'easeOut' }}
          />

          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 w-full bg-gradient-to-t from-cyan-400/30 to-purple-400/30 rounded-full"
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        {/* Section indicators */}
        <div className="absolute inset-0">
          {navItems.map((item, index) => {
            const topPosition =
              (index / Math.max(navItems.length - 1, 1)) * 100;
            const isActive = item.id === activeSection;
            const isPassed =
              index < navItems.findIndex(nav => nav.id === activeSection);

            return (
              <div
                key={item.id}
                className="absolute flex items-center group"
                style={{
                  top: `${topPosition}%`,
                  transform: 'translateY(-50%)',
                  [position === 'left' ? 'right' : 'left']: '100%',
                }}
              >
                {/* Section dot */}
                <motion.button
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 ${
                    position === 'left' ? 'mr-3' : 'ml-3'
                  } ${
                    isActive
                      ? 'bg-cyan-400 border-cyan-400 shadow-lg shadow-cyan-400/50 scale-125'
                      : isPassed
                      ? 'bg-green-400 border-green-400 shadow-md shadow-green-400/30'
                      : 'bg-gray-800 border-gray-600 hover:border-cyan-400 hover:bg-cyan-400/20'
                  }`}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSectionClick(item.id)}
                  aria-label={`Navigate to ${item.label} section`}
                >
                  {/* Inner glow for active state */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-cyan-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    />
                  )}
                </motion.button>

                {/* Section label */}
                {showLabels && (
                  <motion.div
                    className={`text-xs font-medium whitespace-nowrap transition-all duration-300 pointer-events-none ${
                      position === 'left'
                        ? 'order-first text-right'
                        : 'text-left'
                    } ${
                      isActive
                        ? 'text-cyan-400 opacity-100'
                        : 'text-gray-400 opacity-0 group-hover:opacity-100'
                    }`}
                    initial={{ opacity: 0, x: position === 'left' ? 10 : -10 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      x: 0,
                    }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <span className="bg-gray-900/80 backdrop-blur-sm px-2 py-1 rounded border border-gray-700/30">
                      {item.label}
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Scroll direction indicator */}
        <motion.div
          className={`absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 ${
            scrollDirection === 'up' ? 'rotate-180' : ''
          }`}
          animate={{
            y: scrollDirection === 'down' ? [0, -2, 0] : [0, 2, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          ▲
        </motion.div>
      </div>

      {/* Progress percentage - Hidden on tablet and mobile */}
      {showPercentage && !isTablet && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className="text-xs font-mono text-gray-500 bg-gray-900/50 backdrop-blur-sm px-2 py-1 rounded border border-gray-700/30">
            {Math.round(progress)}%
          </span>
        </motion.div>
      )}

      {/* Keyboard navigation hint */}
      <motion.div
        className="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        <span className="text-xs text-gray-600">Click to navigate</span>
      </motion.div>
    </motion.div>
  );
};

export default ScrollProgress;
