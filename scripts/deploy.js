const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ENVIRONMENTS = {
  development: '.env.development',
  staging: '.env.staging',
  production: '.env.production',
};

function deploy(environment = 'production', platform = 'vercel') {
  console.log(
    `🚀 Starting deployment for ${environment} environment on ${platform}...`
  );

  try {
    // 1. Clean previous builds
    console.log('🧹 Cleaning previous builds...');
    if (fs.existsSync('build')) {
      execSync('rm -rf build', { stdio: 'inherit' });
    }

    // 2. Copy environment file
    const envFile = ENVIRONMENTS[environment];
    if (fs.existsSync(envFile)) {
      console.log(`📋 Using environment config: ${envFile}`);
      fs.copyFileSync(envFile, '.env');
    } else {
      console.warn(`⚠️  Environment file ${envFile} not found, using defaults`);
    }

    // 3. Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm ci', { stdio: 'inherit' });

    // 4. Run tests
    console.log('🧪 Running tests...');
    execSync('npm test -- --coverage --watchAll=false', { stdio: 'inherit' });

    // 5. Run Lighthouse audit on staging/production
    if (environment !== 'development') {
      console.log('🔍 Running performance audit...');
      try {
        execSync('npm run lighthouse', { stdio: 'inherit' });
      } catch (error) {
        console.warn('⚠️  Lighthouse audit failed, continuing deployment...');
      }
    }

    // 6. Build the project
    console.log('🏗️  Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    // 7. Verify build
    console.log('✅ Verifying build...');
    const buildStats = getBuildStats();
    console.log('📊 Build Statistics:');
    console.log(`   Total size: ${buildStats.totalSize}`);
    console.log(`   JS size: ${buildStats.jsSize}`);
    console.log(`   CSS size: ${buildStats.cssSize}`);
    console.log(`   Files: ${buildStats.fileCount}`);

    // 8. Deploy based on platform
    console.log(`🚀 Deploying to ${platform}...`);
    switch (platform.toLowerCase()) {
      case 'vercel':
        deployToVercel(environment);
        break;
      case 'netlify':
        deployToNetlify(environment);
        break;
      default:
        console.log('📁 Build completed. Manual deployment required.');
    }

    console.log('✅ Deployment completed successfully!');
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

function getBuildStats() {
  const buildDir = path.join(__dirname, '../build');
  const staticDir = path.join(buildDir, 'static');

  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let fileCount = 0;

  function calculateSize(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stats.size;
        fileCount++;

        if (file.endsWith('.js')) {
          jsSize += stats.size;
        } else if (file.endsWith('.css')) {
          cssSize += stats.size;
        }
      }
    });
  }

  calculateSize(buildDir);

  return {
    totalSize: formatBytes(totalSize),
    jsSize: formatBytes(jsSize),
    cssSize: formatBytes(cssSize),
    fileCount,
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function deployToVercel(environment) {
  try {
    const vercelArgs = environment === 'production' ? '--prod' : '';
    execSync(`vercel ${vercelArgs}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(
      'Vercel deployment failed. Make sure Vercel CLI is installed and configured.'
    );
    throw error;
  }
}

function deployToNetlify(environment) {
  try {
    const netlifyArgs = environment === 'production' ? '--prod' : '';
    execSync(`netlify deploy --dir=build ${netlifyArgs}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(
      'Netlify deployment failed. Make sure Netlify CLI is installed and configured.'
    );
    throw error;
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const environment = args[0] || 'production';
  const platform = args[1] || 'vercel';

  if (!ENVIRONMENTS[environment]) {
    console.error(`❌ Invalid environment: ${environment}`);
    console.log(
      'Available environments:',
      Object.keys(ENVIRONMENTS).join(', ')
    );
    process.exit(1);
  }

  deploy(environment, platform);
}

module.exports = { deploy };
