const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const path = require('path');

async function runLighthouseAudit() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    port: chrome.port,
    settings: {
      // Simulate mobile device
      emulatedFormFactor: 'mobile',
      throttling: {
        rttMs: 150,
        throughputKbps: 1638.4,
        cpuSlowdownMultiplier: 4,
      },
    },
  };

  const desktopOptions = {
    ...options,
    settings: {
      // Desktop settings
      emulatedFormFactor: 'desktop',
      throttling: {
        rttMs: 40,
        throughputKbps: 10240,
        cpuSlowdownMultiplier: 1,
      },
    },
  };

  try {
    console.log('Running Lighthouse audit for mobile...');
    const mobileResult = await lighthouse('http://localhost:3000', options);

    console.log('Running Lighthouse audit for desktop...');
    const desktopResult = await lighthouse(
      'http://localhost:3000',
      desktopOptions
    );

    // Save reports
    const reportsDir = path.join(__dirname, '../lighthouse-reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    fs.writeFileSync(
      path.join(reportsDir, `mobile-report-${timestamp}.html`),
      mobileResult.report
    );

    fs.writeFileSync(
      path.join(reportsDir, `desktop-report-${timestamp}.html`),
      desktopResult.report
    );

    // Log scores
    console.log('\n=== MOBILE AUDIT RESULTS ===');
    logScores(mobileResult.lhr.categories);

    console.log('\n=== DESKTOP AUDIT RESULTS ===');
    logScores(desktopResult.lhr.categories);

    // Log Core Web Vitals
    console.log('\n=== CORE WEB VITALS (Mobile) ===');
    logWebVitals(mobileResult.lhr.audits);

    console.log('\n=== PERFORMANCE OPPORTUNITIES ===');
    logOpportunities(mobileResult.lhr.audits);

    await chrome.kill();

    // Return results for further processing
    return {
      mobile: mobileResult.lhr,
      desktop: desktopResult.lhr,
    };
  } catch (error) {
    console.error('Lighthouse audit failed:', error);
    await chrome.kill();
    process.exit(1);
  }
}

function logScores(categories) {
  Object.keys(categories).forEach(key => {
    const category = categories[key];
    const score = Math.round(category.score * 100);
    const emoji = score >= 90 ? '🟢' : score >= 50 ? '🟡' : '🔴';
    console.log(`${emoji} ${category.title}: ${score}/100`);
  });
}

function logWebVitals(audits) {
  const vitals = {
    'first-contentful-paint': 'First Contentful Paint',
    'largest-contentful-paint': 'Largest Contentful Paint',
    'cumulative-layout-shift': 'Cumulative Layout Shift',
    'total-blocking-time': 'Total Blocking Time',
    'speed-index': 'Speed Index',
  };

  Object.keys(vitals).forEach(key => {
    if (audits[key]) {
      const audit = audits[key];
      const value = audit.displayValue || audit.numericValue;
      const score = audit.score ? Math.round(audit.score * 100) : 'N/A';
      console.log(`${vitals[key]}: ${value} (Score: ${score})`);
    }
  });
}

function logOpportunities(audits) {
  const opportunities = [
    'unused-javascript',
    'unused-css-rules',
    'render-blocking-resources',
    'uses-optimized-images',
    'uses-webp-images',
    'uses-responsive-images',
    'efficient-animated-content',
  ];

  opportunities.forEach(key => {
    if (
      audits[key] &&
      audits[key].details &&
      audits[key].details.overallSavingsMs > 0
    ) {
      const audit = audits[key];
      const savings = Math.round(audit.details.overallSavingsMs);
      console.log(`⚡ ${audit.title}: ${savings}ms potential savings`);
    }
  });
}

// Run if called directly
if (require.main === module) {
  runLighthouseAudit().catch(console.error);
}

module.exports = { runLighthouseAudit };
