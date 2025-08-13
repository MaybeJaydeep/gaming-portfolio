import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigation } from '../../contexts/NavigationContext';

const Navigation = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { activeSection, navItems, navigateToSection } = useNavigation();

  // Handle scroll events for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = e => {
      if (e.altKey) {
        const item = navItems.find(
          item => item.shortcut.toLowerCase() === e.key.toLowerCase()
        );
        if (item) {
          e.preventDefault();
          handleNavigateToSection(item.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navItems]);

  // Handle navigation with mobile menu close
  const handleNavigateToSection = sectionId => {
    navigateToSection(sectionId);
    setIsOpen(false); // Close mobile menu
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = e => {
      if (
        isOpen &&
        !e.target.closest('.mobile-menu') &&
        !e.target.closest('.menu-toggle')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Main Navigation */}
      <motion.nav
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? 'bg-gray-900/95 backdrop-blur-md border-b border-green-500/20 shadow-lg'
              : 'bg-transparent'
          }
          ${className}
        `}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Brand */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigateToSection('hero')}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-green-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">✨</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-cyan-400 font-bold text-lg">MrSpark</div>
                <div className="text-green-400 text-xs">Level 99 Developer</div>
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isActive={activeSection === item.id}
                  onClick={() => handleNavigateToSection(item.id)}
                  index={index}
                />
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <motion.button
              className="md:hidden menu-toggle p-2 rounded-lg border-2 border-green-500/30 bg-gray-800/50 text-green-400"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              <motion.div
                className="w-6 h-6 flex flex-col justify-center items-center"
                animate={isOpen ? 'open' : 'closed'}
              >
                <motion.span
                  className="w-5 h-0.5 bg-current block mb-1"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 },
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-current block mb-1"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 },
                  }}
                  transition={{ duration: 0.3 }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-current block"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 },
                  }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Menu Panel */}
            <motion.div
              className="mobile-menu absolute top-16 left-4 right-4 bg-gray-900 border-2 border-green-500/30 rounded-lg shadow-xl"
              initial={{ y: -20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="p-4">
                <div className="text-center mb-4">
                  <div className="text-cyan-400 font-bold text-lg">
                    Navigation Menu
                  </div>
                  <div className="text-green-400 text-xs">
                    Choose your destination
                  </div>
                </div>

                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <MobileNavItem
                      key={item.id}
                      item={item}
                      isActive={activeSection === item.id}
                      onClick={() => handleNavigateToSection(item.id)}
                      index={index}
                    />
                  ))}
                </div>

                {/* Keyboard shortcuts info */}
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="text-xs text-gray-400 text-center">
                    💡 Tip: Use Alt + {navItems[0].shortcut} for quick
                    navigation
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Desktop Navigation Item Component
const NavItem = ({ item, isActive, onClick, index }) => {
  return (
    <motion.button
      className={`
        relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
        flex items-center gap-2 group
        ${
          isActive
            ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <span className="text-base">{item.icon}</span>
      <span>{item.label}</span>

      {/* Keyboard shortcut indicator */}
      <span
        className={`
        text-xs px-1.5 py-0.5 rounded border transition-opacity
        ${
          isActive
            ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
            : 'border-gray-600 text-gray-500 group-hover:border-green-500/50 group-hover:text-green-400'
        }
      `}
      >
        {item.shortcut}
      </span>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 w-1 h-1 bg-cyan-400 rounded-full"
          layoutId="activeIndicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          style={{ x: '-50%' }}
        />
      )}
    </motion.button>
  );
};

// Mobile Navigation Item Component
const MobileNavItem = ({ item, isActive, onClick, index }) => {
  return (
    <motion.button
      className={`
        w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-300
        ${
          isActive
            ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30'
            : 'text-gray-400 hover:text-green-400 hover:bg-green-500/10 border border-transparent'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <span className="text-xl">{item.icon}</span>
      <div className="flex-1">
        <div className="font-medium">{item.label}</div>
        <div className="text-xs opacity-70">Alt + {item.shortcut}</div>
      </div>
      {isActive && <div className="w-2 h-2 bg-cyan-400 rounded-full" />}
    </motion.button>
  );
};

export default Navigation;
