import React, { useEffect, Suspense, lazy, useState, useCallback } from 'react';
import './App.css';
import { HashRouter as Router, useLocation } from 'react-router-dom';

import { ThemeProvider } from './contexts/ThemeContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { SoundProvider } from './contexts/SoundContext';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { DataProvider } from './contexts/DataContext';
import { Footer } from './components/layout';
import EnhancedParticleBackground from './components/ui/EnhancedParticleBackground';
import { Navigation } from './components/navigation';
import { ScrollProgress, ThemeToggle } from './components/ui';
import { SectionTransition } from './components/ui';

import { useThemeKeyboard } from './components/ui/ThemeToggle';

import { initPerformanceMonitoring } from './utils/performanceMonitoring';
import {
  initStyleMonitoring,
  forceStyleRecalculation,
} from './utils/styleUtils';

import SectionHeader from './components/ui/SectionHeader';

// Lazy load section components for code splitting with retry mechanism
const HeroSection = lazy(() =>
  import('./components/sections/HeroSection').catch(() =>
    import('./components/sections/HeroSection')
  )
);
const AboutSection = lazy(() =>
  import('./components/sections/AboutSection').catch(() =>
    import('./components/sections/AboutSection')
  )
);
const SkillsSection = lazy(() =>
  import('./components/sections/SkillsSection').catch(() =>
    import('./components/sections/SkillsSection')
  )
);
const ProjectsSection = lazy(() =>
  import('./components/sections/ProjectsSection').catch(() =>
    import('./components/sections/ProjectsSection')
  )
);
const GamingSection = lazy(() =>
  import('./components/sections/GamingSection').catch(() =>
    import('./components/sections/GamingSection')
  )
);
const ContactSection = lazy(() =>
  import('./components/sections/ContactSection').catch(() =>
    import('./components/sections/ContactSection')
  )
);

// Component to handle hash-based navigation with retry mechanism
function ScrollToSection() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const scrollToElement = (retries = 3) => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        } else if (retries > 0) {
          // Retry after a short delay if element not found (lazy loading)
          setTimeout(() => scrollToElement(retries - 1), 100);
        }
      };

      scrollToElement();
    }
  }, [location.hash]);

  return null;
}

// Enhanced loading component with gaming theme
function LoadingSection({ sectionName }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
          <div
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin mx-auto"
            style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
          ></div>
        </div>
        <div className="text-cyan-400 text-xl font-gaming animate-pulse">
          Loading {sectionName}...
        </div>
        <div className="text-gray-400 text-sm font-mono">
          Initializing gaming interface
        </div>
      </div>
    </div>
  );
}

// Main App Component with Theme Integration
function AppContent() {
  // Enable keyboard shortcuts for theme switching
  useThemeKeyboard();

  // State to track which sections have been loaded
  const [loadedSections, setLoadedSections] = useState(new Set(['hero']));

  // Intersection Observer to load sections as they come into view - Mobile optimized
  const observeSection = useCallback(sectionId => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setLoadedSections(prev => new Set([...prev, sectionId]));
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '200px 0px', // Increased for better mobile loading
        threshold: 0.01, // Lower threshold for mobile
      }
    );

    // Retry mechanism for mobile
    const observeWithRetry = (retries = 3) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      } else if (retries > 0) {
        setTimeout(() => observeWithRetry(retries - 1), 100);
      }
    };

    observeWithRetry();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Set up observers for all sections
    const sections = ['about', 'skills', 'projects', 'gaming', 'contact'];
    const cleanupFunctions = sections.map(section => observeSection(section));

    // Fallback: Load all sections after 5 seconds if not loaded (mobile safety)
    const fallbackTimer = setTimeout(() => {
      setLoadedSections(prev => new Set([...prev, ...sections]));
    }, 5000);

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup && cleanup());
      clearTimeout(fallbackTimer);
    };
  }, [observeSection]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-x-hidden">
      {/* Hash-based navigation handler */}
      <ScrollToSection />

      {/* Enhanced Background Effects */}
      <EnhancedParticleBackground
        particleCount={60}
        interactive={true}
        gridEffect={true}
        scanLines={true}
      />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Navigation */}
      <Navigation />

      {/* Control Panel - Fixed Position */}
      <div className="fixed top-20 right-4 z-40 space-y-2">
        <ThemeToggle size="medium" showLabel={false} />
      </div>

      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section - Always loaded */}
        <section
          id="hero"
          className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4"
        >
          <Suspense fallback={<LoadingSection sectionName="Hero" />}>
            <HeroSection />
          </Suspense>
        </section>

        {/* About Section - Lazy loaded */}
        <SectionTransition delay={0.1}>
          <section
            id="about"
            className="min-h-screen bg-gray-900 py-12 sm:py-20 px-4"
          >
            <div className="container mx-auto max-w-6xl">
              {loadedSections.has('about') ? (
                <Suspense fallback={<LoadingSection sectionName="About" />}>
                  <SectionHeader
                    title="About Me"
                    subtitle="Character Profile & Background"
                    icon="👤"
                  />
                  <AboutSection />
                </Suspense>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-gray-500 text-lg">
                    Scroll down to load About section...
                  </div>
                </div>
              )}
            </div>
          </section>
        </SectionTransition>

        {/* Skills Section - Lazy loaded */}
        <SectionTransition delay={0.2}>
          <section
            id="skills"
            className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 py-12 sm:py-20 px-4"
          >
            <div className="container mx-auto max-w-6xl">
              {loadedSections.has('skills') ? (
                <Suspense fallback={<LoadingSection sectionName="Skills" />}>
                  <SectionHeader
                    title="Skills & Tech Stack"
                    subtitle="My Development Arsenal"
                    icon="🛠️"
                  />
                  <SkillsSection />
                </Suspense>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-gray-500 text-lg">
                    Scroll down to load Skills section...
                  </div>
                </div>
              )}
            </div>
          </section>
        </SectionTransition>

        {/* Projects Section - Lazy loaded */}
        <SectionTransition delay={0.3}>
          <section
            id="projects"
            className="min-h-screen bg-gray-900 py-12 sm:py-20 px-4"
          >
            <div className="container mx-auto max-w-6xl">
              {loadedSections.has('projects') ? (
                <Suspense fallback={<LoadingSection sectionName="Projects" />}>
                  <SectionHeader
                    title="Projects & Missions"
                    subtitle="Completed Quests & Achievements"
                    icon="🚀"
                  />
                  <ProjectsSection />
                </Suspense>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-gray-500 text-lg">
                    Scroll down to load Projects section...
                  </div>
                </div>
              )}
            </div>
          </section>
        </SectionTransition>

        {/* Gaming Section - Lazy loaded */}
        <SectionTransition delay={0.4}>
          <section
            id="gaming"
            className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 py-12 sm:py-20 px-4"
          >
            <div className="container mx-auto max-w-6xl">
              {loadedSections.has('gaming') ? (
                <Suspense fallback={<LoadingSection sectionName="Gaming" />}>
                  <SectionHeader
                    title="Gaming Achievements"
                    subtitle="Tournament History & Gaming Stats"
                    icon="🎮"
                  />
                  <GamingSection />
                </Suspense>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-gray-500 text-lg">
                    Scroll down to load Gaming section...
                  </div>
                </div>
              )}
            </div>
          </section>
        </SectionTransition>

        {/* Contact Section - Lazy loaded with improved loading */}
        <SectionTransition delay={0.5}>
          <section
            id="contact"
            className="min-h-screen bg-gray-900 py-12 sm:py-20 px-4"
          >
            <div className="container mx-auto max-w-6xl">
              {loadedSections.has('contact') || true ? ( // Force load contact to prevent issues
                <Suspense fallback={<LoadingSection sectionName="Contact" />}>
                  <SectionHeader
                    title="Contact & Connect"
                    subtitle="Let's Start a New Quest Together"
                    icon="📧"
                  />
                  <ContactSection />
                </Suspense>
              ) : (
                <div className="min-h-[400px] flex items-center justify-center">
                  <div className="text-gray-500 text-lg">
                    Scroll down to load Contact section...
                  </div>
                </div>
              )}
            </div>
          </section>
        </SectionTransition>
      </main>

      {/* Footer - Always visible */}
      <div className="relative z-20">
        <Footer />
      </div>

      {/* Skip to Content Link for Accessibility */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-cyan-500 text-black px-4 py-2 rounded-lg z-50"
      >
        Skip to main content
      </a>
    </div>
  );
}

// App wrapper with all providers
function App() {
  useEffect(() => {
    // Initialize performance monitoring in production
    if (process.env.NODE_ENV === 'production') {
      initPerformanceMonitoring();
    }

    // Initialize style monitoring to fix CSS loading issues
    initStyleMonitoring();

    // Force CSS recomputation to fix styling issues
    const timer = setTimeout(() => {
      forceStyleRecalculation();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DataProvider>
      <ThemeProvider>
        <AccessibilityProvider>
          <SoundProvider>
            <Router>
              <NavigationProvider>
                <AppContent />
              </NavigationProvider>
            </Router>
          </SoundProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </DataProvider>
  );
}

export default App;
