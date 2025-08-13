import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import GlitchText from '../ui/GlitchText';
import NeonButton from '../ui/NeonButton';
import { GamingText, GamingLabel } from '../ui/Typography';
import { useResponsive } from '../../hooks/useResponsive';
import { useAccessibilityContext } from '../../contexts/AccessibilityContext';
import {
  useGamingTheme,
  useStyleMonitor,
  useTailwindFix,
} from '../../hooks/useStyleFix';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isMobile, isTablet, isTouchDevice, prefersReducedMotion } =
    useResponsive();
  const { announce, getAriaProps } = useAccessibilityContext();

  // Apply style fixes
  const heroRef = useGamingTheme();
  useStyleMonitor('HeroSection');
  useTailwindFix();

  const texts = useMemo(
    () => [
      'Full Stack Developer',
      'MERN Stack Expert',
      'ML & Data Science Enthusiast',
      'Competitive Gamer',
    ],
    []
  );

  // Typewriter effect for title
  useEffect(() => {
    const currentFullText = texts[currentIndex];

    if (currentText.length < currentFullText.length) {
      const timer = setTimeout(() => {
        setCurrentText(currentFullText.slice(0, currentText.length + 1));
      }, 100);
      return () => clearTimeout(timer);
    } else {
      // Wait before starting next text
      const timer = setTimeout(() => {
        setCurrentText('');
        setCurrentIndex(prev => (prev + 1) % texts.length);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentText, currentIndex, texts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const avatarVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        duration: 1,
      },
    },
    hover: {
      scale: 1.05,
      rotate: 5,
      transition: {
        duration: 0.3,
      },
    },
  };

  const scrollToSection = sectionId => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={heroRef}
      id="main-content"
      className="min-h-screen-small flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-deep-dark via-dark-surface to-deep-dark safe-area-inset-top safe-area-inset-bottom"
      aria-label="Hero section - Introduction and overview"
      tabIndex="-1"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90degrgba(0, 255, 255, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-neon-cyan rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Gaming Avatar */}
        <motion.div
          className={`${
            isMobile ? 'space-gaming-lg' : 'space-gaming-2xl'
          } flex justify-center`}
          variants={avatarVariants}
          whileHover={!isTouchDevice && !prefersReducedMotion ? 'hover' : {}}
        >
          <div className="relative">
            {/* Avatar container with neon border */}
            <div
              className={`${
                isMobile ? 'w-24 h-24' : isTablet ? 'w-32 h-32' : 'w-40 h-40'
              } rounded-full border-4 border-neon-cyan bg-gradient-to-br from-electric-purple to-neon-cyan p-1 shadow-lg shadow-neon-cyan/50`}
            >
              <div className="w-full h-full rounded-full bg-dark-surface flex items-center justify-center overflow-hidden">
                {/* Gaming character representation */}
                <div
                  className={`${
                    isMobile ? 'text-4xl' : isTablet ? 'text-5xl' : 'text-6xl'
                  }`}
                >
                  🎮
                </div>
              </div>
            </div>

            {/* Level indicator */}
            <motion.div
              className="absolute -top-2 -right-2 bg-neon-green text-deep-dark px-3 py-1 rounded-full text-sm font-bold font-gaming"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
            >
              LVL 5+
            </motion.div>

            {/* Status indicator */}
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-electric-purple text-white px-2 py-1 rounded text-xs font-mono"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              ONLINE
            </motion.div>
          </div>
        </motion.div>

        {/* Name with glitch effect */}
        <motion.div variants={itemVariants} className="space-gaming-sm">
          <GlitchText
            className={`${
              isMobile
                ? 'text-gaming-3xl'
                : isTablet
                ? 'text-gaming-5xl'
                : 'text-gaming-6xl'
            } font-gaming-bold text-white`}
            intensity={prefersReducedMotion ? 'none' : 'medium'}
            duration={prefersReducedMotion ? 0 : 3000}
          >
            Jaydeep Badal
          </GlitchText>
        </motion.div>

        {/* Typewriter title */}
        <motion.div variants={itemVariants} className="space-gaming-2xl">
          <div
            className={`${
              isMobile
                ? 'min-h-[3rem]'
                : isTablet
                ? 'min-h-[4rem]'
                : 'min-h-[5rem]'
            } flex items-center justify-center px-4`}
          >
            <GamingText
              variant="span"
              size={isMobile ? 'base' : isTablet ? 'xl' : '2xl'}
              color="cyan"
              weight="mono"
              className="text-center"
            >
              {currentText}
              <motion.span
                className={`inline-block w-0.5 ${
                  isMobile ? 'h-4' : isTablet ? 'h-6' : 'h-8'
                } bg-neon-cyan ml-1`}
                animate={prefersReducedMotion ? {} : { opacity: [1, 0, 1] }}
                transition={
                  prefersReducedMotion ? {} : { duration: 1, repeat: Infinity }
                }
              />
            </GamingText>
          </div>
        </motion.div>

        {/* Stats display */}
        <motion.div
          variants={itemVariants}
          className={`space-gaming-2xl grid grid-cols-2 ${
            isMobile ? 'gap-3' : 'gap-4'
          } ${isMobile ? 'max-w-sm' : 'max-w-2xl'} mx-auto px-4`}
        >
          {[
            { label: 'Years Experience', value: '5+', color: 'text-neon-cyan' },
            {
              label: 'Projects Completed',
              value: '50+',
              color: 'text-neon-green',
            },
            {
              label: 'Technologies',
              value: '15+',
              color: 'text-electric-purple',
            },
            {
              label: 'Tournaments',
              value: '10+',
              color: 'text-warning-orange',
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`bg-dark-surface/50 border border-neon-cyan/30 rounded-lg ${
                isMobile ? 'card-padding-sm' : 'card-padding-base'
              } backdrop-blur-sm touch-manipulation`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              whileHover={
                !isTouchDevice && !prefersReducedMotion
                  ? {
                      scale: 1.05,
                      borderColor: 'rgba(0, 255, 255, 0.8)',
                      boxShadow: '0 0 20px rgba(0, 255, 255, 0.3)',
                    }
                  : {}
              }
              whileTap={isTouchDevice ? { scale: 0.95 } : {}}
            >
              <GamingText
                variant="div"
                size={isMobile ? 'lg' : isTablet ? 'xl' : '2xl'}
                weight="bold"
                className={`${stat.color} space-gaming-xs`}
              >
                {stat.value}
              </GamingText>
              <GamingLabel className="text-light-text">
                {stat.label}
              </GamingLabel>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action buttons */}
        <motion.div
          variants={itemVariants}
          className={`flex flex-col sm:flex-row ${
            isMobile ? 'gap-3' : 'gap-4'
          } justify-center items-center px-4`}
        >
          <NeonButton
            variant="primary"
            size={isMobile ? 'medium' : 'large'}
            onClick={() => scrollToSection('about')}
            className="w-full sm:w-auto min-h-[48px]"
          >
            <span>🎯</span>
            <span>Explore Profile</span>
          </NeonButton>

          <NeonButton
            variant="secondary"
            size={isMobile ? 'medium' : 'large'}
            onClick={() => scrollToSection('projects')}
            className="w-full sm:w-auto min-h-[48px]"
          >
            <span>🚀</span>
            <span>View Missions</span>
          </NeonButton>
        </motion.div>

        {/* Scroll indicator */}
        {!isMobile && (
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 safe-area-inset-bottom"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 1 }}
          >
            <motion.div
              className="flex flex-col items-center text-neon-cyan cursor-pointer touch-manipulation"
              onClick={() => scrollToSection('about')}
              whileHover={!isTouchDevice ? { scale: 1.1 } : {}}
              whileTap={{ scale: 0.95 }}
              animate={prefersReducedMotion ? {} : { y: [0, 10, 0] }}
              transition={
                prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }
              }
            >
              <span className="text-sm font-mono mb-2">SCROLL DOWN</span>
              <div className="w-6 h-10 border-2 border-neon-cyan rounded-full flex justify-center">
                <motion.div
                  className="w-1 h-3 bg-neon-cyan rounded-full mt-2"
                  animate={prefersReducedMotion ? {} : { y: [0, 12, 0] }}
                  transition={
                    prefersReducedMotion
                      ? {}
                      : { duration: 1.5, repeat: Infinity }
                  }
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default HeroSection;
