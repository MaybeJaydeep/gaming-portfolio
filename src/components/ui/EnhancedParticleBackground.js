import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useResponsive } from '../../hooks/useResponsive';
import { useAccessibilityContext } from '../../contexts/AccessibilityContext';

/**
 * Enhanced particle background with gaming effects
 */
const EnhancedParticleBackground = ({
  particleCount = 50,
  colors = ['#00FFFF', '#8A2BE2', '#00FF00', '#FF8C00'],
  speed = 1,
  size = 2,
  opacity = 0.6,
  interactive = true,
  gridEffect = true,
  scanLines = true,
  className = '',
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(true);

  const { isMobile, prefersReducedMotion } = useResponsive();
  const { reducedMotion } = useAccessibilityContext();

  // Adjust settings for mobile and reduced motion
  const adjustedParticleCount = isMobile
    ? Math.floor(particleCount / 2)
    : particleCount;
  const adjustedSpeed = prefersReducedMotion || reducedMotion ? 0 : speed;

  // Particle class
  class Particle {
    constructor(canvas) {
      this.canvas = canvas;
      this.reset();
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.baseSize = size + Math.random() * 2;
      this.size = this.baseSize;
      this.opacity = opacity * (0.5 + Math.random() * 0.5);
      this.pulse = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.02;
    }

    reset() {
      this.x = Math.random() * this.canvas.width;
      this.y = Math.random() * this.canvas.height;
      this.vx = (Math.random() - 0.5) * adjustedSpeed;
      this.vy = (Math.random() - 0.5) * adjustedSpeed;
    }

    update(mouseX, mouseY) {
      // Update position
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around edges
      if (this.x < 0) this.x = this.canvas.width;
      if (this.x > this.canvas.width) this.x = 0;
      if (this.y < 0) this.y = this.canvas.height;
      if (this.y > this.canvas.height) this.y = 0;

      // Interactive effect
      if (interactive && mouseX !== undefined && mouseY !== undefined) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          this.vx += (dx / distance) * force * 0.01;
          this.vy += (dy / distance) * force * 0.01;
        }
      }

      // Pulse effect
      this.pulse += this.pulseSpeed;
      this.size = this.baseSize + Math.sin(this.pulse) * 0.5;

      // Velocity damping
      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.opacity;

      // Create glow effect
      const gradient = ctx.createRadialGradient(
        this.x,
        this.y,
        0,
        this.x,
        this.y,
        this.size * 3
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(0.5, this.color + '80');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Draw core particle
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Initialize particles
  const initParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];
    for (let i = 0; i < adjustedParticleCount; i++) {
      particlesRef.current.push(new Particle(canvas));
    }
  }, [adjustedParticleCount]);

  // Animation loop
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;

    const ctx = canvas.getContext('2d');

    // Clear canvas with fade effect
    ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid effect
    if (gridEffect) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
      ctx.lineWidth = 1;

      const gridSize = 50;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update(mouseRef.current.x, mouseRef.current.y);
      particle.draw(ctx);
    });

    // Draw connections between nearby particles
    if (!isMobile) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i];
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const alpha = ((100 - distance) / 100) * 0.2;
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    // Draw scan lines effect
    if (scanLines && !prefersReducedMotion && !reducedMotion) {
      const time = Date.now() * 0.001;
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + Math.sin(time * 2) * 0.05})`;
      ctx.lineWidth = 1;

      for (let y = 0; y < canvas.height; y += 4) {
        ctx.globalAlpha = 0.1 + Math.sin(time + y * 0.01) * 0.05;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [
    isVisible,
    gridEffect,
    scanLines,
    isMobile,
    prefersReducedMotion,
    reducedMotion,
  ]);

  // Handle resize
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinitialize particles with new canvas size
    initParticles();
  }, [initParticles]);

  // Handle mouse movement
  const handleMouseMove = useCallback(
    event => {
      if (!interactive) return;

      mouseRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    },
    [interactive]
  );

  // Handle visibility change
  const handleVisibilityChange = useCallback(() => {
    setIsVisible(!document.hidden);
  }, []);

  // Setup and cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initial setup
    handleResize();
    initParticles();

    // Start animation if motion is allowed
    if (!prefersReducedMotion && !reducedMotion) {
      animate();
    }

    // Event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      // Cleanup
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [
    handleResize,
    initParticles,
    animate,
    handleMouseMove,
    handleVisibilityChange,
    prefersReducedMotion,
    reducedMotion,
  ]);

  // Don't render if reduced motion is preferred
  if (prefersReducedMotion || reducedMotion) {
    return (
      <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
        <div className="gaming-grid opacity-20" />
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

export default EnhancedParticleBackground;
