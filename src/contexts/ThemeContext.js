import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme configurations with gaming aesthetics
const themes = {
  dark: {
    name: 'Cyberpunk Dark',
    icon: '🌙',
    colors: {
      primary: 'cyan',
      secondary: 'green',
      accent: 'purple',
      background: 'gray-900',
      surface: 'gray-800',
      text: 'gray-100',
    },
    css: {
      '--bg-primary': '#111827',
      '--bg-secondary': '#1f2937',
      '--bg-surface': '#374151',
      '--text-primary': '#f9fafb',
      '--text-secondary': '#d1d5db',
      '--text-muted': '#9ca3af',
      '--accent-primary': '#06b6d4',
      '--accent-secondary': '#10b981',
      '--accent-tertiary': '#8b5cf6',
      '--border-color': '#4b5563',
      '--shadow-color': 'rgba(0, 0, 0, 0.5)',
    },
  },
  light: {
    name: 'Neon Light',
    icon: '☀️',
    colors: {
      primary: 'blue',
      secondary: 'emerald',
      accent: 'violet',
      background: 'gray-50',
      surface: 'white',
      text: 'gray-900',
    },
    css: {
      '--bg-primary': '#f9fafb',
      '--bg-secondary': '#ffffff',
      '--bg-surface': '#f3f4f6',
      '--text-primary': '#111827',
      '--text': '#374151',
      '--text-muted': '#6b7280',
      '--accent-primary': '#3b82f6',
      '--accent-secondary': '#10b981',
      '--accent-tertiary': '#8b5cf6',
      '--border-color': '#d1d5db',
      '--shadow-color': 'rgba(0, 0, 0, 0.1)',
    },
  },
  matrix: {
    name: 'Matrix Green',
    icon: '💚',
    colors: {
      primary: 'green',
      secondary: 'lime',
      accent: 'emerald',
      background: 'black',
      surface: 'gray-900',
      text: 'green-400',
    },
    css: {
      '--bg-primary': '#000000',
      '--bg-secondary': '#111827',
      '--bg-surface': '#1f2937',
      '--text-primary': '#4ade80',
      '--text-secondary': '#22c55e',
      '--text-muted': '#16a34a',
      '--accent-primary': '#00ff00',
      '--accent-secondary': '#32cd32',
      '--accent-tertiary': '#00ff7f',
      '--border-color': '#166534',
      '--shadow-color': 'rgba(0, 255, 0, 0.2)',
    },
  },
  synthwave: {
    name: 'Synthwave',
    icon: '🌆',
    colors: {
      primary: 'pink',
      secondary: 'purple',
      accent: 'cyan',
      background: 'purple-900',
      surface: 'purple-800',
      text: 'pink-200',
    },
    css: {
      '--bg-primary': '#581c87',
      '--bg-secondary': '#7c3aed',
      '--bg-surface': '#8b5cf6',
      '--text-primary': '#fce7f3',
      '--text-secondary': '#f9a8d4',
      '--text-muted': '#ec4899',
      '--accent-primary': '#ff00ff',
      '--accent-secondary': '#00ffff',
      '--accent-tertiary': '#ff1493',
      '--border-color': '#a855f7',
      '--shadow-color': 'rgba(255, 0, 255, 0.3)',
    },
  },
};

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [systemPreference, setSystemPreference] = useState('dark');

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');

    const handleChange = e => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('jaydeep-portfolio-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Use system preference as fallback
      setCurrentTheme(systemPreference);
    }
  }, [systemPreference]);

  // Apply theme CSS variables
  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      const root = document.documentElement;

      // Apply CSS custom properties
      Object.entries(theme.css).forEach(([property, value]) => {
        root.style.setProperty(property, value);
      });

      // Update document class for Tailwind
      document.documentElement.className =
        currentTheme === 'light' ? 'light' : 'dark';

      // Update meta theme-color
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', theme.css['--bg-primary']);
      }
    }
  }, [currentTheme]);

  // Change theme with transition effect
  const changeTheme = newTheme => {
    if (newTheme === currentTheme || !themes[newTheme]) return;

    setIsTransitioning(true);

    // Add transition class to body
    document.body.classList.add('theme-transitioning');

    setTimeout(() => {
      setCurrentTheme(newTheme);
      localStorage.setItem('jaydeep-portfolio-theme', newTheme);

      setTimeout(() => {
        setIsTransitioning(false);
        document.body.classList.remove('theme-transitioning');
      }, 300);
    }, 150);
  };

  // Cycle through themes
  const cycleTheme = () => {
    const themeKeys = Object.keys(themes);
    const currentIndex = themeKeys.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeKeys.length;
    changeTheme(themeKeys[nextIndex]);
  };

  // Reset to system preference
  const resetToSystem = () => {
    changeTheme(systemPreference);
    localStorage.removeItem('jaydeep-portfolio-theme');
  };

  // Get theme-aware colors for components
  const getThemeColors = () => {
    const theme = themes[currentTheme];
    return {
      primary: `text-${theme.colors.primary}-400`,
      secondary: `text-${theme.colors.secondary}-400`,
      accent: `text-${theme.colors.accent}-400`,
      background: `bg-${theme.colors.background}`,
      surface: `bg-${theme.colors.surface}`,
      text: `text-${theme.colors.text}`,
      border: `border-${theme.colors.primary}-500/30`,
      hover: `hover:bg-${theme.colors.primary}-500/10`,
    };
  };

  const value = {
    currentTheme,
    themes,
    changeTheme,
    cycleTheme,
    resetToSystem,
    isTransitioning,
    systemPreference,
    getThemeColors,
    isDark: currentTheme !== 'light',
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Theme transition CSS (to be added to global styles)
export const themeTransitionCSS = `
  .theme-transitioning * {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
  }

  .theme-transitioning *:before,
  .theme-transitioning *:after {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease !important;
  }
`;
