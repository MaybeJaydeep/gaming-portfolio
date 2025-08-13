import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';

const TerminalWindow = ({
  title = 'Terminal',
  children,
  className = '',
  enableTyping = false,
}) => {
  const { isMobile, isTablet, isTouchDevice, prefersReducedMotion } =
    useResponsive();
  const [isTyping, setIsTyping] = useState(enableTyping);
  const [displayedContent, setDisplayedContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Extract text content from children for typing effect
  const getTextContent = element => {
    if (typeof element === 'string') return element;
    if (React.isValidElement(element) && element.props.children) {
      return React.Children.map(element.props.children, getTextContent).join(
        ''
      );
    }
    return '';
  };

  const textContent = enableTyping ? getTextContent(children) : '';

  useEffect(() => {
    if (enableTyping && isTyping && currentIndex < textContent.length) {
      const timer = setTimeout(() => {
        setDisplayedContent(prev => prev + textContent[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Typing speed

      return () => clearTimeout(timer);
    } else if (enableTyping && currentIndex >= textContent.length) {
      setIsTyping(false);
    }
  }, [currentIndex, textContent, isTyping, enableTyping]);

  const resetTyping = () => {
    if (enableTyping) {
      setDisplayedContent('');
      setCurrentIndex(0);
      setIsTyping(true);
    }
  };

  return (
    <motion.div
      className={`bg-black/90 border border-green-500/50 rounded-lg overflow-hidden shadow-2xl ${className}`}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.5 }}
    >
      {/* Terminal Title Bar */}
      <div
        className={`bg-gray-800/90 border-b border-green-500/30 ${
          isMobile ? 'px-3 py-2' : 'px-4 py-2'
        } flex items-center justify-between`}
      >
        <div className="flex items-center space-x-2">
          {/* Terminal Control Buttons */}
          <div className="flex space-x-2">
            <div
              className={`${
                isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } bg-red-500 rounded-full`}
            ></div>
            <div
              className={`${
                isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } bg-yellow-500 rounded-full`}
            ></div>
            <div
              className={`${
                isMobile ? 'w-2.5 h-2.5' : 'w-3 h-3'
              } bg-green-500 rounded-full`}
            ></div>
          </div>

          {/* Terminal Title */}
          <span
            className={`text-green-400 font-mono ${
              isMobile ? 'text-xs' : 'text-sm'
            } font-medium ${isMobile ? 'ml-2' : 'ml-4'}`}
          >
            {isMobile && title.length > 20
              ? title.substring(0, 17) + '...'
              : title}
          </span>
        </div>

        {/* Optional typing reset button */}
        {enableTyping && (
          <motion.button
            onClick={resetTyping}
            className={`text-green-400 hover:text-green-300 ${
              isMobile ? 'text-xs px-2 py-1' : 'text-xs px-2 py-1'
            } font-mono rounded border border-green-500/30 hover:border-green-400/50 transition-colors touch-manipulation min-h-[32px]`}
            whileHover={
              !isTouchDevice && !prefersReducedMotion ? { scale: 1.05 } : {}
            }
            whileTap={{ scale: 0.95 }}
            title="Replay typing animation"
          >
            ↻
          </motion.button>
        )}
      </div>

      {/* Terminal Content Area */}
      <div
        className={`${isMobile ? 'p-3' : 'p-4'} ${
          isMobile ? 'min-h-[150px]' : 'min-h-[200px]'
        } bg-black/95`}
      >
        <div
          className={`font-mono text-green-400 ${
            isMobile ? 'text-xs' : 'text-sm'
          } leading-relaxed`}
        >
          {/* Terminal Prompt */}
          <div className="flex items-center mb-2">
            <span className="text-cyan-400">user@jaydeep-portfolio</span>
            <span className="text-white">:</span>
            <span className="text-blue-400">~</span>
            <span className="text-white">$</span>
            <motion.span
              className={`ml-2 inline-block ${
                isMobile ? 'w-1.5 h-3' : 'w-2 h-4'
              } bg-green-400`}
              animate={prefersReducedMotion ? {} : { opacity: [1, 0, 1] }}
              transition={
                prefersReducedMotion ? {} : { duration: 1, repeat: Infinity }
              }
            />
          </div>

          {/* Content */}
          <div className="mt-4">
            {enableTyping && isTyping ? (
              <div>
                {displayedContent}
                <motion.span
                  className={`inline-block ${
                    isMobile ? 'w-1.5 h-3' : 'w-2 h-4'
                  } bg-green-400 ml-1`}
                  animate={prefersReducedMotion ? {} : { opacity: [1, 0, 1] }}
                  transition={
                    prefersReducedMotion
                      ? {}
                      : { duration: 0.5, repeat: Infinity }
                  }
                />
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>

      {/* Terminal Footer with Scan Lines Effect */}
      {!prefersReducedMotion && (
        <div className="h-1 bg-gradient-to-r from-transparent via-green-500/20 to-transparent relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
    </motion.div>
  );
};

export default TerminalWindow;
