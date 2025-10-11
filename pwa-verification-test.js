#!/usr/bin/env node

/**
 * PWA Verification Test Script
 * Validates PWA implementation for Docente++
 * 
 * Usage: node pwa-verification-test.js
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results tracking
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
let warnings = 0;

const results = [];

/**
 * Log functions
 */
function logHeader(message) {
  console.log(`\n${colors.cyan}${'='.repeat(60)}${colors.reset}`);
  console.log(`${colors.cyan}${message}${colors.reset}`);
  console.log(`${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
  passedTests++;
  totalTests++;
  results.push({ status: 'PASS', message });
}

function logError(message, details = '') {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
  if (details) {
    console.log(`   ${colors.red}${details}${colors.reset}`);
  }
  failedTests++;
  totalTests++;
  results.push({ status: 'FAIL', message, details });
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
  warnings++;
  results.push({ status: 'WARN', message });
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

/**
 * Test: Check file existence
 */
function testFileExists(filePath, description) {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      logSuccess(`${description} exists (${stats.size} bytes)`);
      return true;
    } else {
      logError(`${description} not found`, `Path: ${filePath}`);
      return false;
    }
  } catch (error) {
    logError(`Error checking ${description}`, error.message);
    return false;
  }
}

/**
 * Test: Validate JSON file
 */
function testJSONFile(filePath, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    logSuccess(`${description} is valid JSON`);
    return json;
  } catch (error) {
    logError(`${description} has invalid JSON`, error.message);
    return null;
  }
}

/**
 * Test: Validate manifest.json structure
 */
function testManifestStructure(manifest) {
  const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
  const recommendedFields = ['description', 'theme_color', 'background_color'];
  
  requiredFields.forEach(field => {
    if (manifest[field]) {
      logSuccess(`manifest.json has required field '${field}'`);
    } else {
      logError(`manifest.json missing required field '${field}'`);
    }
  });
  
  recommendedFields.forEach(field => {
    if (manifest[field]) {
      logSuccess(`manifest.json has recommended field '${field}'`);
    } else {
      logWarning(`manifest.json missing recommended field '${field}'`);
    }
  });
  
  // Check icons array
  if (Array.isArray(manifest.icons)) {
    logSuccess(`manifest.json has ${manifest.icons.length} icon(s) defined`);
    
    manifest.icons.forEach((icon, index) => {
      if (icon.src && icon.sizes && icon.type) {
        logSuccess(`Icon ${index + 1}: ${icon.sizes} (${icon.type})`);
      } else {
        logError(`Icon ${index + 1} is missing required fields (src, sizes, type)`);
      }
    });
    
    // Check for required sizes
    const sizes = manifest.icons.map(i => i.sizes);
    if (sizes.includes('192x192')) {
      logSuccess('manifest.json has 192x192 icon');
    } else {
      logError('manifest.json missing 192x192 icon');
    }
    
    if (sizes.includes('512x512')) {
      logSuccess('manifest.json has 512x512 icon');
    } else {
      logError('manifest.json missing 512x512 icon');
    }
  } else {
    logError('manifest.json icons field is not an array');
  }
}

/**
 * Test: Validate Service Worker JavaScript
 */
function testServiceWorkerSyntax(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for critical syntax errors
    const braceCount = (content.match(/\{/g) || []).length - (content.match(/\}/g) || []).length;
    if (braceCount === 0) {
      logSuccess('sw.js has balanced braces');
    } else {
      logError('sw.js has unbalanced braces', `Difference: ${braceCount}`);
    }
    
    const parenCount = (content.match(/\(/g) || []).length - (content.match(/\)/g) || []).length;
    if (parenCount === 0) {
      logSuccess('sw.js has balanced parentheses');
    } else {
      logError('sw.js has unbalanced parentheses', `Difference: ${parenCount}`);
    }
    
    // Check for required event listeners
    const requiredEvents = ['install', 'activate', 'fetch'];
    requiredEvents.forEach(event => {
      if (content.includes(`addEventListener('${event}'`) || content.includes(`addEventListener("${event}"`)) {
        logSuccess(`sw.js has '${event}' event listener`);
      } else {
        logError(`sw.js missing '${event}' event listener`);
      }
    });
    
    // Check for cache API usage
    if (content.includes('caches.open') || content.includes('caches.match')) {
      logSuccess('sw.js uses Cache API');
    } else {
      logError('sw.js does not use Cache API');
    }
    
    // Check for skipWaiting
    if (content.includes('skipWaiting()')) {
      logSuccess('sw.js calls skipWaiting()');
    } else {
      logWarning('sw.js does not call skipWaiting() - updates may be delayed');
    }
    
    // Check for clients.claim
    if (content.includes('clients.claim()')) {
      logSuccess('sw.js calls clients.claim()');
    } else {
      logWarning('sw.js does not call clients.claim() - may not control pages immediately');
    }
    
    return true;
  } catch (error) {
    logError('Error validating sw.js', error.message);
    return false;
  }
}

/**
 * Test: Validate index.html integration
 */
function testHTMLIntegration(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for manifest link
    if (content.includes('rel="manifest"') && content.includes('manifest.json')) {
      logSuccess('index.html has manifest link');
    } else {
      logError('index.html missing manifest link');
    }
    
    // Check for theme-color meta tag
    if (content.includes('name="theme-color"')) {
      logSuccess('index.html has theme-color meta tag');
    } else {
      logError('index.html missing theme-color meta tag');
    }
    
    // Check for apple-touch-icon
    if (content.includes('rel="apple-touch-icon"')) {
      logSuccess('index.html has apple-touch-icon');
    } else {
      logWarning('index.html missing apple-touch-icon (iOS compatibility)');
    }
    
    // Check for viewport meta tag
    if (content.includes('name="viewport"')) {
      logSuccess('index.html has viewport meta tag');
    } else {
      logError('index.html missing viewport meta tag');
    }
    
    // Check for Service Worker registration
    if (content.includes('serviceWorker.register')) {
      logSuccess('index.html has Service Worker registration code');
    } else {
      logError('index.html missing Service Worker registration code');
    }
    
    // Check for Service Worker registration path
    if (content.includes("register('/sw.js')") || content.includes('register("/sw.js")')) {
      logSuccess('index.html registers sw.js correctly');
    } else {
      logWarning('Service Worker registration path may be incorrect');
    }
    
    return true;
  } catch (error) {
    logError('Error validating index.html', error.message);
    return false;
  }
}

/**
 * Test: Validate icon files
 */
function testIconFiles() {
  const iconDir = path.join(__dirname, 'icons');
  
  if (!fs.existsSync(iconDir)) {
    logError('icons/ directory does not exist');
    return false;
  }
  
  logSuccess('icons/ directory exists');
  
  // Check for required icon files
  const requiredIcons = [
    { file: 'icon-192x192.png', minSize: 1000, maxSize: 10000 },
    { file: 'icon-512x512.png', minSize: 3000, maxSize: 20000 }
  ];
  
  requiredIcons.forEach(icon => {
    const iconPath = path.join(iconDir, icon.file);
    if (fs.existsSync(iconPath)) {
      const stats = fs.statSync(iconPath);
      logSuccess(`${icon.file} exists (${stats.size} bytes)`);
      
      if (stats.size < icon.minSize) {
        logWarning(`${icon.file} is smaller than expected (< ${icon.minSize} bytes)`);
      } else if (stats.size > icon.maxSize) {
        logWarning(`${icon.file} is larger than expected (> ${icon.maxSize} bytes)`);
      } else {
        logSuccess(`${icon.file} has reasonable file size`);
      }
    } else {
      logError(`${icon.file} not found`, `Path: ${iconPath}`);
    }
  });
  
  return true;
}

/**
 * Test: Check documentation
 */
function testDocumentation() {
  const docs = [
    'PWA_INSTALLATION.md',
    'PWA_IMPLEMENTATION_SUMMARY.md',
    'PWA_QUICK_START.md'
  ];
  
  docs.forEach(doc => {
    const docPath = path.join(__dirname, doc);
    if (fs.existsSync(docPath)) {
      const stats = fs.statSync(docPath);
      logSuccess(`${doc} exists (${stats.size} bytes)`);
      
      // Check if it contains PWA-related content
      const content = fs.readFileSync(docPath, 'utf8');
      if (content.toLowerCase().includes('pwa') || content.toLowerCase().includes('progressive web app')) {
        logSuccess(`${doc} contains PWA documentation`);
      } else {
        logWarning(`${doc} may not contain PWA-specific content`);
      }
    } else {
      logWarning(`${doc} not found (recommended)`);
    }
  });
}

/**
 * Generate summary report
 */
function generateSummary() {
  logHeader('TEST SUMMARY');
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${warnings}${colors.reset}`);
  
  const successRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;
  console.log(`\nSuccess Rate: ${successRate}%`);
  
  if (failedTests === 0) {
    console.log(`\n${colors.green}🎉 All critical tests passed!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  ${failedTests} test(s) failed - review required${colors.reset}`);
  }
  
  // Save results to file
  const reportPath = path.join(__dirname, 'pwa-test-results.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: totalTests,
      passed: passedTests,
      failed: failedTests,
      warnings: warnings,
      successRate: successRate
    },
    results: results
  }, null, 2));
  
  logInfo(`Detailed results saved to: ${reportPath}`);
}

/**
 * Main test execution
 */
function runTests() {
  console.log(`${colors.cyan}
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║     PWA Verification Test Suite - Docente++              ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
${colors.reset}`);

  // Test 1: File Existence
  logHeader('TEST 1: File Existence');
  testFileExists(path.join(__dirname, 'manifest.json'), 'manifest.json');
  testFileExists(path.join(__dirname, 'sw.js'), 'sw.js');
  testFileExists(path.join(__dirname, 'index.html'), 'index.html');
  
  // Test 2: manifest.json
  logHeader('TEST 2: manifest.json Validation');
  const manifest = testJSONFile(path.join(__dirname, 'manifest.json'), 'manifest.json');
  if (manifest) {
    testManifestStructure(manifest);
  }
  
  // Test 3: Service Worker
  logHeader('TEST 3: Service Worker Validation');
  testServiceWorkerSyntax(path.join(__dirname, 'sw.js'));
  
  // Test 4: HTML Integration
  logHeader('TEST 4: index.html Integration');
  testHTMLIntegration(path.join(__dirname, 'index.html'));
  
  // Test 5: Icon Files
  logHeader('TEST 5: Icon Files');
  testIconFiles();
  
  // Test 6: Documentation
  logHeader('TEST 6: Documentation');
  testDocumentation();
  
  // Generate summary
  generateSummary();
  
  // Exit with appropriate code
  process.exit(failedTests > 0 ? 1 : 0);
}

// Run tests
runTests();
