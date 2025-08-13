import React from 'react';
import { motion } from 'framer-motion';

const SkipLink = ({
  href = '#main-content',
  children = 'Skip to main content',
}) => {
  return (
    <motion.a
      href={href}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
        bg-neon-cyan text-black px-4 py-2 rounded-lg font-medium z-50
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan
        transition-all duration-200
      "
      initial={{ opacity: 0, y: -20 }}
      whileFocus={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onClick={e => {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      {children}
    </motion.a>
  );
};

export default SkipLink;
