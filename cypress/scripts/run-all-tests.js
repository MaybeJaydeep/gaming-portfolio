const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const testConfig = {
  browsers: ['chrome', 'firefox', 'edge'],
  viewports: [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
  ],
  testSuites: [
    'user-journey.cy.js',
    'responsive-design.cy.js',
    'accessibility.cy.js',
    'performance.cy.js',
    'cross-browser.cy.js',
  ],
};

// Results tracking
const testResults = {
  passed: 0,
  failed: 0,
  skipped: 0,
  browsers: {},
  suites: {},
};

function runCommand(command, description) {
  console.log(`\n🚀 ${description}`);
  console.log(`Running: ${command}\n`);

  try {
    const output = execSync(command, {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    return { success: true, output };
  } catch (error) {
    console.error(`❌ Failed: ${description}`);
    console.error(error.message);
    return { success: false, error };
  }
}

function generateTestReport() {
  const reportPath = path.join(__dirname, '../reports/test-summary.json');
  const reportDir = path.dirname(reportPath);

  if (!fs.existsSync(reportDir)) {
    fs.mkdirSync(reportDir, { recursive: true });
  }

  const report = {
    timestamp: new Date().toISOString(),
    summary: testResults,
    config: testConfig,
  };

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📊 Test report generated: ${reportPath}`);
}

async function runCrossBrowserTests() {
  console.log('🎮 Starting Gaming Portfolio E2E Test Suite');
  console.log('='.repeat(50));

  // Start the development server
  console.log('\n🔧 Starting development server...');
  const serverProcess = require('child_process').spawn('npm', ['start'], {
    stdio: 'pipe',
    shell: true,
  });

  // Wait for server to be ready
  await new Promise(resolve => {
    setTimeout(resolve, 10000); // Wait 10 seconds for server to start
  });

  try {
    // Run tests for each browser
    for (const browser of testConfig.browsers) {
      console.log(`\n🌐 Testing in ${browser.toUpperCase()}`);
      console.log('-'.repeat(30));

      testResults.browsers[browser] = { passed: 0, failed: 0 };

      const result = runCommand(
        `npx cypress run --browser ${browser} --reporter json`,
        `E2E tests in ${browser}`
      );

      if (result.success) {
        testResults.browsers[browser].passed++;
        testResults.passed++;
      } else {
        testResults.browsers[browser].failed++;
        testResults.failed++;
      }
    }

    // Run specific test suites
    for (const suite of testConfig.testSuites) {
      console.log(`\n📋 Running test suite: ${suite}`);
      console.log('-'.repeat(30));

      testResults.suites[suite] = { passed: 0, failed: 0 };

      const result = runCommand(
        `npx cypress run --spec "cypress/e2e/${suite}" --reporter json`,
        `Test suite: ${suite}`
      );

      if (result.success) {
        testResults.suites[suite].passed++;
      } else {
        testResults.suites[suite].failed++;
      }
    }

    // Run performance tests with different network conditions
    console.log('\n⚡ Running performance tests with network throttling');
    console.log('-'.repeat(50));

    const performanceResult = runCommand(
      'npx cypress run --spec "cypress/e2e/performance.cy.js" --config video=true',
      'Performance tests with network simulation'
    );

    // Generate final report
    generateTestReport();

    // Print summary
    console.log('\n🎯 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${testResults.passed}`);
    console.log(`❌ Failed: ${testResults.failed}`);
    console.log(`⏭️  Skipped: ${testResults.skipped}`);

    console.log('\n🌐 Browser Results:');
    Object.entries(testResults.browsers).forEach(([browser, results]) => {
      console.log(`  ${browser}: ✅ ${results.passed} | ❌ ${results.failed}`);
    });

    console.log('\n📋 Suite Results:');
    Object.entries(testResults.suites).forEach(([suite, results]) => {
      console.log(`  ${suite}: ✅ ${results.passed} | ❌ ${results.failed}`);
    });
  } finally {
    // Clean up: kill the server process
    console.log('\n🧹 Cleaning up...');
    serverProcess.kill();
  }

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Run the tests if this script is executed directly
if (require.main === module) {
  runCrossBrowserTests().catch(console.error);
}

module.exports = { runCrossBrowserTests, testConfig };
