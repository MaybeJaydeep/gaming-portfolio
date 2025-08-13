import React from 'react';
import { motion } from 'framer-motion';
import { useSoundEffects } from '../../contexts/SoundContext';

/**
 * Sound-enhanced button component with gaming audio feedback
 */
const SoundEnhancedButton = ({
  children,
  onClick,
  onHover,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  soundOnClick = 'click',
  soundOnHover = 'hover',
  enableSounds = true,
  ...props
}) => {
  const { playClick, playHover, playError, soundEnabled } = useSoundEffects();

  const variants = {
    primary: 'bg-cyan-500 hover:bg-cyan-400 text-black border-cyan-400',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-cyan-400 border-cyan-500',
    danger: 'bg-red-600 hover:bg-red-500 text-white border-red-500',
    success: 'bg-green-600 hover:bg-green-500 text-white border-green-500',
    ghost: 'bg-transparent hover:bg-cyan-500/10 text-cyan-400 border-cyan-500',
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  };

  const handleClick = e => {
    if (disabled) {
      if (enableSounds && soundEnabled) {
        playError();
      }
      return;
    }

    if (enableSounds && soundEnabled && soundOnClick) {
      if (soundOnClick === 'click') playClick();
      else if (soundOnClick === 'success') playClick(); // Could be different sound
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = e => {
    if (!disabled && enableSounds && soundEnabled && soundOnHover) {
      if (soundOnHover === 'hover') playHover();
    }

    if (onHover) {
      onHover(e);
    }
  };

  return (
    <motion.button
      className={`
        relative font-medium rounded-lg border-2 transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Glow effect */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

/**
 * Gaming-themed icon button with sound effects
 */
export const SoundIconButton = ({
  icon,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  title,
  soundOnClick = 'click',
  enableSounds = true,
  ...props
}) => {
  const { playClick, playHover, playError, soundEnabled } = useSoundEffects();

  const variants = {
    primary:
      'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border-cyan-500',
    secondary:
      'bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 border-gray-500',
    danger: 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border-red-500',
  };

  const sizes = {
    small: 'p-2 text-sm',
    medium: 'p-3 text-base',
    large: 'p-4 text-lg',
  };

  const handleClick = e => {
    if (disabled) {
      if (enableSounds && soundEnabled) {
        playError();
      }
      return;
    }

    if (enableSounds && soundEnabled && soundOnClick) {
      playClick();
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled && enableSounds && soundEnabled) {
      playHover();
    }
  };

  return (
    <motion.button
      className={`
        relative rounded-lg border transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      title={title}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {/* Pulse effect on hover */}
      {!disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg border border-current opacity-0"
          whileHover={{
            opacity: [0, 0.5, 0],
            scale: [1, 1.1, 1.2],
          }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}

      <span className="relative z-10">{icon}</span>
    </motion.button>
  );
};

/**
 * Gaming menu item with sound effects
 */
export const SoundMenuItem = ({
  children,
  onClick,
  active = false,
  disabled = false,
  className = '',
  soundOnClick = 'click',
  enableSounds = true,
  ...props
}) => {
  const { playClick, playHover, soundEnabled } = useSoundEffects();

  const handleClick = e => {
    if (disabled) return;

    if (enableSounds && soundEnabled && soundOnClick) {
      playClick();
    }

    if (onClick) {
      onClick(e);
    }
  };

  const handleMouseEnter = () => {
    if (!disabled && enableSounds && soundEnabled) {
      playHover();
    }
  };

  return (
    <motion.div
      className={`
        relative px-4 py-3 cursor-pointer transition-all duration-200
        ${
          active
            ? 'bg-cyan-500/20 text-cyan-400 border-l-2 border-cyan-500'
            : 'text-gray-300 hover:bg-gray-700/50 hover:text-cyan-400'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      whileHover={disabled ? {} : { x: 4 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Active indicator */}
      {active && (
        <motion.div
          className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500"
          layoutId="activeIndicator"
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      )}

      {children}
    </motion.div>
  );
};

export default SoundEnhancedButton;
