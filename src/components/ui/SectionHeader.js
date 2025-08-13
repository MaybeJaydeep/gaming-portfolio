import React from 'react';
import { motion } from 'framer-motion';
import { GamingHeading, GamingText } from './Typography';

const SectionHeader = ({
  title,
  subtitle,
  icon,
  className = '',
  titleClassName = '',
  subtitleClassName = '',
}) => {
  return (
    <div className={`text-center space-gaming-3xl ${className}`}>
      {icon && (
        <motion.div
          className="text-gaming-4xl space-gaming-base"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {icon}
        </motion.div>
      )}

      <GamingHeading
        level={2}
        size="4xl"
        className={`space-gaming-base ${titleClassName}`}
        delay={0.3}
      >
        <span className="bg-gradient-to-r from-neon-cyan to-neon-green bg-clip-text text-transparent">
          {title}
        </span>
      </GamingHeading>

      {subtitle && (
        <GamingText
          size="lg"
          color="gray-light"
          className={`max-w-2xl mx-auto space-gaming-lg ${subtitleClassName}`}
          animate
          delay={0.4}
        >
          {subtitle}
        </GamingText>
      )}

      {/* Decorative line */}
      <motion.div
        className="w-24 h-1 bg-gradient-to-r from-neon-cyan to-neon-green mx-auto rounded-full"
        initial={{ width: 0 }}
        animate={{ width: 96 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
    </div>
  );
};

export default SectionHeader;
