import React from 'react';
import { motion } from 'framer-motion';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Gaming-themed card component with neon effects and animations
 */
const GamingCard = ({
  children,
  className = '',
  variant = 'default',
  glow = false,
  animated = true,
  hover = true,
  onClick,
  delay = 0,
  ...props
}) => {
  const { isTouchDevice, prefersReducedMotion } = useResponsive();

  // Variant styles
  const variants = {
    default: 'gaming-card',
    terminal: 'terminal-window',
    holographic: 'gaming-card holographic',
    neon: 'gaming-card neon-glow-cyan',
  };

  // Build className
  const baseClasses = [
    variants[variant] || variants.default,
    glow && 'neon-glow',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Animation variants
  const animationVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: 'easeOut',
      },
    },
  };

  const hoverVariants = {
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    },
  };

  if (!animated || prefersReducedMotion) {
    return (
      <div className={baseClasses} onClick={onClick} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={baseClasses}
      variants={animationVariants}
      initial="hidden"
      animate="visible"
      whileHover={
        hover && !isTouchDevice && !prefersReducedMotion ? 'hover' : {}
      }
      whileTap={isTouchDevice ? { scale: 0.98 } : {}}
      onClick={onClick}
      {...hoverVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * Terminal-style card with header
 */
export const TerminalCard = ({ title, children, className = '', ...props }) => (
  <GamingCard variant="terminal" className={className} {...props}>
    {title && (
      <div className="terminal-header">
        <span className="text-black font-mono font-bold text-sm ml-16">
          {title}
        </span>
      </div>
    )}
    <div className="terminal-content">{children}</div>
  </GamingCard>
);

/**
 * Stat card with gaming styling
 */
export const StatCard = ({
  title,
  value,
  icon,
  color = 'cyan',
  progress,
  className = '',
  ...props
}) => {
  const colorClasses = {
    cyan: 'text-neon-cyan border-cyan-500/30',
    green: 'text-neon-green border-green-500/30',
    purple: 'text-electric-purple border-purple-500/30',
    orange: 'text-warning-orange border-orange-500/30',
  };

  return (
    <GamingCard
      className={`text-center p-6 ${colorClasses[color]} ${className}`}
      glow
      {...props}
    >
      {icon && <div className="text-3xl mb-3 gaming-float">{icon}</div>}
      <div className={`text-2xl font-gaming-bold ${colorClasses[color]} mb-2`}>
        {value}
      </div>
      <div className="text-gray-400 text-sm font-mono uppercase tracking-wider">
        {title}
      </div>
      {progress !== undefined && (
        <div className="mt-4">
          <div className="gaming-progress h-2">
            <motion.div
              className="gaming-progress-bar"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">{progress}%</div>
        </div>
      )}
    </GamingCard>
  );
};

/**
 * Achievement card with unlock animation
 */
export const AchievementCard = ({
  title,
  description,
  icon,
  rarity = 'common',
  unlocked = false,
  unlockedDate,
  className = '',
  ...props
}) => {
  const rarityColors = {
    common: 'border-gray-500 text-gray-400',
    rare: 'border-blue-500 text-blue-400 neon-glow-blue',
    epic: 'border-purple-500 text-electric-purple neon-glow-purple',
    legendary: 'border-yellow-500 text-yellow-400 neon-glow-yellow',
  };

  return (
    <GamingCard
      className={`
        relative p-4 text-center transition-all duration-500
        ${
          unlocked
            ? `${rarityColors[rarity]} gaming-card`
            : 'border-gray-700 text-gray-600 bg-gray-900/30'
        }
        ${className}
      `}
      animated={unlocked}
      glow={unlocked && rarity !== 'common'}
      {...props}
    >
      {/* Unlock animation effect */}
      {unlocked && (
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      )}

      <div className="relative z-10">
        <div className="text-3xl mb-3 gaming-float">{icon}</div>
        <div className="font-gaming font-bold text-sm mb-2">{title}</div>
        <div className="text-xs opacity-80 mb-3">{description}</div>

        {unlocked && unlockedDate && (
          <div className="text-xs opacity-60">
            Unlocked: {new Date(unlockedDate).toLocaleDateString()}
          </div>
        )}
      </div>

      {/* Rarity indicator */}
      <div
        className={`
        absolute top-2 right-2 text-xs px-2 py-1 rounded
        ${unlocked ? rarityColors[rarity] : 'text-gray-600'}
      `}
      >
        {rarity.toUpperCase()}
      </div>
    </GamingCard>
  );
};

/**
 * Progress card with animated progress bar
 */
export const ProgressCard = ({
  title,
  current,
  max,
  label,
  color = 'cyan',
  className = '',
  ...props
}) => {
  const percentage = Math.round((current / max) * 100);

  const colorClasses = {
    cyan: 'from-cyan-500 to-cyan-300',
    green: 'from-green-500 to-green-300',
    purple: 'from-purple-500 to-purple-300',
    orange: 'from-orange-500 to-orange-300',
  };

  return (
    <GamingCard className={`p-4 ${className}`} {...props}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-gaming text-gray-300">{title}</span>
        <span className="text-xs text-gray-400">
          {current}/{max}
        </span>
      </div>

      <div className="gaming-progress h-3 mb-2">
        <motion.div
          className={`gaming-progress-bar bg-gradient-to-r ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.3 }}
        />
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-sm font-mono text-gray-300">{percentage}%</span>
      </div>
    </GamingCard>
  );
};

export default GamingCard;
