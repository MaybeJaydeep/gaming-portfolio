import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';
import { useAccessibilityContext } from '../../contexts/AccessibilityContext';

const GameHUD = ({ currentSection, onSectionChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, isTablet, isTouchDevice } = useResponsive();
  const { announce, getAriaProps, handleKeyboardNavigation } =
    useAccessibilityContext();

  const navigationItems = [
    { id: 'hero', label: 'HOME', icon: '🏠' },
    { id: 'about', label: 'STATS', icon: '📊' },
    { id: 'skills', label: 'SKILLS', icon: '⚡' },
    { id: 'gaming', label: 'GAMING', icon: '🎮' },
    { id: 'projects', label: 'MISSIONS', icon: '🎯' },
    { id: 'contact', label: 'CONTACT', icon: '📡' },
  ];

  const handleNavClick = sectionId => {
    onSectionChange(sectionId);
    setIsMenuOpen(false);

    // Announce navigation change
    const navItem = navigationItems.find(item => item.id === sectionId);
    if (navItem) {
      announce(`Navigated to ${navItem.label} section`);
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-cyan-500/30 safe-area-inset-top"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`flex items-center justify-between ${
            isMobile ? 'h-14' : 'h-16'
          }`}
        >
          {/* Logo/Brand */}
          <motion.div
            className="flex items-center space-x-2"
            whileHover={!isTouchDevice ? { scale: 1.05 } : {}}
            whileTap={isTouchDevice ? { scale: 0.95 } : {}}
          >
            <div
              className={`${
                isMobile ? 'w-6 h-6' : 'w-8 h-8'
              } bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center`}
            >
              <span
                className={`text-black font-bold ${
                  isMobile ? 'text-xs' : 'text-sm'
                }`}
              >
                ✨
              </span>
            </div>
            <span
              className={`text-cyan-400 font-bold tracking-wider ${
                isMobile ? 'text-sm' : isTablet ? 'text-base' : 'text-lg'
              }`}
            >
              {isMobile ? 'MRSPARK' : 'MRSPARK PORTFOLIO'}
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1" role="menubar">
            {navigationItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  relative px-3 lg:px-4 py-2 rounded-lg font-medium text-xs lg:text-sm tracking-wider
                  transition-all duration-300 group touch-manipulation
                  focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
                  ${
                    currentSection === item.id
                      ? 'text-black bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : 'text-gray-300 hover:text-cyan-400'
                  }
                `}
                whileHover={!isTouchDevice ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
                role="menuitem"
                aria-current={currentSection === item.id ? 'page' : undefined}
                {...getAriaProps({
                  label: `Navigate to ${item.label} section`,
                  selected: currentSection === item.id,
                })}
              >
                <span className="flex items-center space-x-2">
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>

                {/* Neon glow effect */}
                {currentSection !== item.id && (
                  <motion.div
                    className="absolute inset-0 rounded-lg bg-cyan-400/20 opacity-0 group-hover:opacity-100"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}

                {/* Active indicator */}
                {currentSection === item.id && (
                  <motion.div
                    className="absolute -bottom-1 left-1/2 w-2 h-2 bg-cyan-400 rounded-full"
                    layoutId="activeIndicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{ x: '-50%' }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Mobile menu button */}
          <motion.button
            className="md:hidden p-2 rounded-lg text-cyan-400 hover:bg-cyan-400/20 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
            onClick={() => {
              setIsMenuOpen(!isMenuOpen);
              announce(
                isMenuOpen ? 'Mobile menu closed' : 'Mobile menu opened'
              );
            }}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <motion.span
                className="w-5 h-0.5 bg-current mb-1"
                animate={
                  isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }
                }
              />
              <motion.span
                className="w-5 h-0.5 bg-current mb-1"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="w-5 h-0.5 bg-current"
                animate={
                  isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }
                }
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          id="mobile-navigation"
          className="md:hidden overflow-hidden"
          initial={{ height: 0 }}
          animate={{ height: isMenuOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="py-4 space-y-2 safe-area-inset-bottom">
            {navigationItems.map(item => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full text-left px-4 py-4 rounded-lg font-medium text-base tracking-wider
                  transition-all duration-300 flex items-center space-x-3 touch-manipulation
                  min-h-[48px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black
                  ${
                    currentSection === item.id
                      ? 'text-black bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : 'text-gray-300 hover:text-cyan-400 hover:bg-cyan-400/10 active:bg-cyan-400/20'
                  }
                `}
                whileHover={!isTouchDevice ? { x: 4 } : {}}
                whileTap={{ scale: 0.98 }}
                role="menuitem"
                aria-current={currentSection === item.id ? 'page' : undefined}
                {...getAriaProps({
                  label: `Navigate to ${item.label} section`,
                  selected: currentSection === item.id,
                })}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default GameHUD;
