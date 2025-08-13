import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const ParticleBackground = ({
  particleCount = 50,
  className = '',
  respectReducedMotion = true,
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = e => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener('change', handleChange);

      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [respectReducedMotion]);

  // Particle class
  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
      this.opacity = Math.random() * 0.5 + 0.2;
      this.fadeDirection = Math.random() > 0.5 ? 1 : -1;
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Update opacity for twinkling effect
      this.opacity += this.fadeDirection * 0.005;
      if (this.opacity <= 0.1 || this.opacity >= 0.7) {
        this.fadeDirection *= -1;
      }

      // Wrap around edges
      if (this.x < 0) this.x = this.canvas.width;
      if (this.x > this.canvas.width) this.x = 0;
      if (this.y < 0) this.y = this.canvas.height;
      if (this.y > this.canvas.height) this.y = 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;

      // Create gradient for glow effect
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size * 2
      );
      gradient.addColorStop(0, '#00ffff');
      gradient.addColorStop(0.5, '#0088ff');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Initialize particles
  const initParticles = canvas => {
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle(canvas));
    }
  };

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    if (!prefersReducedMotion) {
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });

      // Draw connections between nearby particles
      drawConnections(ctx);
    } else {
      // Static particles for reduced motion
      particlesRef.current.forEach(particle => {
        particle.draw(ctx);
      });
    }

    animationRef.current = requestAnimationFrame(animate);
  };

  // Draw connections between nearby particles
  const drawConnections = ctx => {
    const maxDistance = 100;

    for (let i = 0; i < particlesRef.current.length; i++) {
      for (let j = i + 1; j < particlesRef.current.length; j++) {
        const particle1 = particlesRef.current[i];
        const particle2 = particlesRef.current[j];

        const dx = particle1.x - particle2.x;
        const dy = particle1.y - particle2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.2;

          ctx.save();
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = '#00ffff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle1.x, particle1.y);
          ctx.lineTo(particle2.x, particle2.y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  };

  // Handle canvas resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext('2d');
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Reinitialize particles with new canvas dimensions
    initParticles(canvas);
  };

  // Setup canvas and start animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    initParticles(canvas);
    animate();

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [
    particleCount,
    prefersReducedMotion,
    animate,
    handleResize,
    initParticles,
  ]);

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          background: 'transparent',
        }}
      />

      {/* Accessibility message for reduced motion users */}
      {prefersReducedMotion && (
        <div className="sr-only">
          Particle animation disabled due to reduced motion preference
        </div>
      )}
    </motion.div>
  );
};

export default ParticleBackground;
