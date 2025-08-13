/**
 * Performance monitoring utilities
 * Tracks Core Web Vitals and provides performance insights
 */

// Core Web Vitals tracking
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Track Largest Contentful Paint (LCP)
  const trackLCP = () => {
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];

      console.log('LCP:', lastEntry.startTime);

      // Send to analytics if needed
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          name: 'LCP',
          value: Math.round(lastEntry.startTime),
          event_category: 'Performance',
        });
      }
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  };

  // Track First Input Delay (FID)
  const trackFID = () => {
    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        const fid = entry.processingStart - entry.startTime;

        console.log('FID:', fid);

        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            name: 'FID',
            value: Math.round(fid),
            event_category: 'Performance',
          });
        }
      });
    }).observe({ entryTypes: ['first-input'] });
  };

  // Track Cumulative Layout Shift (CLS)
  const trackCLS = () => {
    let clsValue = 0;
    let clsEntries = [];

    new PerformanceObserver(entryList => {
      const entries = entryList.getEntries();

      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsEntries.push(entry);
          clsValue += entry.value;
        }
      });

      console.log('CLS:', clsValue);

      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          name: 'CLS',
          value: Math.round(clsValue * 1000),
          event_category: 'Performance',
        });
      }
    }).observe({ entryTypes: ['layout-shift'] });
  };

  // Initialize tracking
  try {
    trackLCP();
    trackFID();
    trackCLS();
  } catch (error) {
    console.warn('Performance tracking not supported:', error);
  }
};

// Performance budget monitoring
export const checkPerformanceBudget = () => {
  if (typeof window === 'undefined') return;

  const budget = {
    // Time budgets (in milliseconds)
    firstContentfulPaint: 1500,
    largestContentfulPaint: 2500,
    firstInputDelay: 100,
    cumulativeLayoutShift: 0.1,

    // Size budgets (in KB)
    totalJavaScript: 200,
    totalCSS: 50,
    totalImages: 500,
  };

  // Check timing budgets
  const checkTimingBudgets = () => {
    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find(entry => entry.name === 'first-contentful-paint');

    const results = {
      firstContentfulPaint: {
        value: fcp ? fcp.startTime : 0,
        budget: budget.firstContentfulPaint,
        passed: fcp ? fcp.startTime <= budget.firstContentfulPaint : false,
      },
    };

    console.log('Performance Budget Results:', results);
    return results;
  };

  // Check resource budgets
  const checkResourceBudgets = () => {
    const resources = performance.getEntriesByType('resource');

    let totalJS = 0;
    let totalCSS = 0;
    let totalImages = 0;

    resources.forEach(resource => {
      const size = resource.transferSize || 0;

      if (resource.name.includes('.js')) {
        totalJS += size;
      } else if (resource.name.includes('.css')) {
        totalCSS += size;
      } else if (/\.(png|jpg|jpeg|gif|svg|webp)/.test(resource.name)) {
        totalImages += size;
      }
    });

    // Convert to KB
    totalJS = Math.round(totalJS / 1024);
    totalCSS = Math.round(totalCSS / 1024);
    totalImages = Math.round(totalImages / 1024);

    const results = {
      javascript: {
        value: totalJS,
        budget: budget.totalJavaScript,
        passed: totalJS <= budget.totalJavaScript,
      },
      css: {
        value: totalCSS,
        budget: budget.totalCSS,
        passed: totalCSS <= budget.totalCSS,
      },
      images: {
        value: totalImages,
        budget: budget.totalImages,
        passed: totalImages <= budget.totalImages,
      },
    };

    console.log('Resource Budget Results:', results);
    return results;
  };

  // Run checks after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      checkTimingBudgets();
      checkResourceBudgets();
    }, 1000);
  });
};

// Memory usage monitoring
export const monitorMemoryUsage = () => {
  if (typeof window === 'undefined' || !performance.memory) return;

  const logMemoryUsage = () => {
    const memory = performance.memory;

    console.log('Memory Usage:', {
      used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB',
    });
  };

  // Log memory usage every 30 seconds
  setInterval(logMemoryUsage, 30000);

  // Log initial memory usage
  logMemoryUsage();
};

// Network information monitoring
export const monitorNetworkInfo = () => {
  if (typeof window === 'undefined' || !navigator.connection) return;

  const connection = navigator.connection;

  const logNetworkInfo = () => {
    console.log('Network Info:', {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
    });
  };

  // Log network changes
  connection.addEventListener('change', logNetworkInfo);

  // Log initial network info
  logNetworkInfo();
};

// Initialize all performance monitoring
export const initPerformanceMonitoring = () => {
  trackWebVitals();
  checkPerformanceBudget();
  monitorMemoryUsage();
  monitorNetworkInfo();
};
