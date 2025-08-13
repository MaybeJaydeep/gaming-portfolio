import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

const ThemeToggle = ({ className = '', showLabel = true, size = 'medium' }) => {
  const { currentTheme, themes, changeTheme, cycleTheme, isTransitioning } =
    useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const sizeConfig = {
    small: {
      button: 'w-8 h-8 text-sm',
      icon: 'text-base',
      dropdown: 'w-48',
    },
    medium: {
      button: 'w-10 h-10 text-base',
      icon: 'text-lg',
      dropdown: 'w-56',
    },
    large: {
      button: 'w-12 h-12 text-lg',
      icon: 'text-xl',
      dropdown: 'w-64',
    },
  };

  const config = sizeConfig[size];
  const currentThemeData = themes[currentTheme];

  const handleThemeSelect = themeKey => {
    changeTheme(themeKey);
    setIsOpen(false);
  };

  const handleQuickToggle = e => {
    e.stopPropagation();
    if (e.shiftKey) {
      // Shift+click opens dropdown
      setIsOpen(!isOpen);
    } else {
      // Regular click cycles themes
      cycleTheme();
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main Toggle Button */}
      <motion.button
        className={`
          ${config.button} rounded-lg border-2 border-cyan-500/30 bg-gray-800/50
          text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/10
          transition-all duration-300 flex items-center justify-center
          ${isTransitioning ? 'animate-pulse' : ''}
        `}
        onClick={handleQuickToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isTransitioning}
      >
        <motion.span
          className={config.icon}
          animate={{ rotate: isTransitioning ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {currentThemeData.icon}
        </motion.span>

        {/* Loading indicator */}
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-cyan-400"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
      </motion.button>

      {/* Theme Label */}
      {showLabel && (
        <motion.div
          className="mt-1 text-xs text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {currentThemeData.name.split(' ')[0]}
        </motion.div>
      )}

      {/* Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-gray-900 border-2 border-cyan-500/30 rounded-lg p-3 text-sm shadow-xl">
              <div className="text-cyan-400 font-medium mb-1">
                {currentThemeData.name}
              </div>
              <div className="text-gray-400 text-xs mb-2">
                Click to cycle • Shift+Click for menu
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span>⌨️</span>
                <span>Alt+T for quick toggle</span>
              </div>

              {/* Tooltip arrow */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-cyan-500" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className={`${config.dropdown} bg-gray-900 border-2 border-cyan-500/30 rounded-lg shadow-xl overflow-hidden`}
            >
              {/* Header */}
              <div className="p-3 border-b border-gray-700">
                <div className="text-cyan-400 font-medium text-sm flex items-center gap-2">
                  <span>🎨</span>
                  Choose Theme
                </div>
                <div className="text-gray-400 text-xs mt-1">
                  Select your preferred gaming aesthetic
                </div>
              </div>

              {/* Theme Options */}
              <div className="p-2 space-y-1">
                {Object.entries(themes).map(([themeKey, theme]) => (
                  <motion.button
                    key={themeKey}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all
                      ${
                        currentTheme === themeKey
                          ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                          : 'hover:bg-gray-800 text-gray-300 hover:text-cyan-400'
                      }
                    `}
                    onClick={() => handleThemeSelect(themeKey)}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-xl">{theme.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{theme.name}</div>
                      <div className="text-xs opacity-70">
                        {themeKey === 'dark' && 'Classic cyberpunk vibes'}
                        {themeKey === 'light' && 'Clean and bright'}
                        {themeKey === 'matrix' && 'Green code aesthetic'}
                        {themeKey === 'synthwave' && 'Retro 80s neon'}
                      </div>
                    </div>
                    {currentTheme === themeKey && (
                      <motion.div
                        className="w-2 h-2 bg-cyan-400 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-700 bg-gray-800/50">
                <div className="text-xs text-gray-400 text-center">
                  Theme preference is saved automatically
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

// Keyboard shortcut hook for theme toggle
export const useThemeKeyboard = () => {
  const { cycleTheme } = useTheme();

  React.useEffect(() => {
    const handleKeyPress = e => {
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        cycleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [cycleTheme]);
};

export default ThemeToggle;
