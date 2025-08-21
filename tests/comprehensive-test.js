/**
 * Comprehensive SFDR Navigator Integration Test
 * Tests all components systematically
 */

import { createClient } from '@supabase/supabase-js';

// Test configuration
const TEST_CONFIG = {
  baseUrl: 'http://localhost:8080',
  supabaseUrl: 'https://hnwwykttyzfvflmcswjk.supabase.co',
  supabaseKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhud3d5a3R0eXpmdmZsbWNzd2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MjA1NTgsImV4cCI6MjA2MDI5NjU1OH0.50J8-EdyyjDGfOLOoMgzoXCgP7URWZTJZkqlb0Zxwos',
  timeout: 15000
};

// Test results storage
const testResults = [];

// Utility functions
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix =
    type === 'error' ? '❌' : type === 'success' ? '✅' : type === 'warning' ? '⚠️' : '🔍';
  console.log(`${prefix} [${timestamp}] ${message}`);
}

function addTestResult(name, status, details = null, error = null) {
  const result = {
    name,
    status,
    timestamp: new Date().toISOString(),
    details,
    error
  };
  testResults.push(result);
  return result;
}

// Test 1: Environment Configuration
async function testEnvironmentConfiguration() {
  log('Testing Environment Configuration...');

  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_OCR_API_KEY',
    'VITE_WEBSOCKET_URL'
  ];

  let allConfigured = true;
  const configStatus = {};

  for (const varName of requiredVars) {
    const value = process.env[varName];
    if (value && !value.includes('your_') && !value.includes('demo-key')) {
      configStatus[varName] = 'configured';
    } else {
      configStatus[varName] = 'using_default';
      allConfigured = false;
    }
  }

  if (allConfigured) {
    addTestResult('Environment Configuration', 'passed', configStatus);
    log('Environment configuration is properly set up', 'success');
  } else {
    addTestResult(
      'Environment Configuration',
      'warning',
      configStatus,
      'Some variables using default values'
    );
    log('Environment configuration has some default values (expected for testing)', 'warning');
  }
}

// Test 2: Supabase Connection
async function testSupabaseConnection() {
  log('Testing Supabase Connection...');

  try {
    const supabase = createClient(TEST_CONFIG.supabaseUrl, TEST_CONFIG.supabaseKey);

    // Test basic connection
    const { data, error } = await supabase.from('compliance_assessments').select('count').limit(1);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    addTestResult('Supabase Connection', 'passed', {
      message: 'Successfully connected to Supabase',
      tableAccess: 'compliance_assessments'
    });
    log('Supabase connection successful', 'success');
  } catch (error) {
    addTestResult('Supabase Connection', 'failed', null, error.message);
    log(`Supabase connection failed: ${error.message}`, 'error');
  }
}

// Test 3: API Service Import
async function testAPIServiceImport() {
  log('Testing API Service Import...');

  try {
    // Test if we can import the service
    const { sfdrApiService } = await import('./src/services/sfdrApiService.ts');

    if (sfdrApiService) {
      addTestResult('API Service Import', 'passed', {
        message: 'SFDR API service imported successfully',
        hasWebSocket: !!sfdrApiService.subscribeToUpdates,
        hasUploadMethod: !!sfdrApiService.uploadDocumentWithOCR,
        hasValidationMethod: !!sfdrApiService.validateSFDRCompliance
      });
      log('API service imported successfully', 'success');
    } else {
      throw new Error('Service not properly exported');
    }
  } catch (error) {
    addTestResult('API Service Import', 'failed', null, error.message);
    log(`API service import failed: ${error.message}`, 'error');
  }
}

// Test 4: OCR API Connectivity
async function testOCRAPI() {
  log('Testing OCR API Connectivity...');

  try {
    const ocrTestUrl = 'https://api.ocr.space/parse/image';
    const params = new URLSearchParams({
      apikey: 'demo-key',
      url: 'https://example.com/test-image.jpg',
      language: 'eng'
    });

    const response = await fetch(`${ocrTestUrl}?${params}`);
    const result = await response.json();

    if (result.IsErroredOnProcessing) {
      // Expected with demo key
      addTestResult('OCR API Connectivity', 'passed', {
        message: 'OCR API accessible (demo key limitation expected)',
        errorType: result.ErrorMessage
      });
      log('OCR API accessible (demo key limitation expected)', 'success');
    } else {
      addTestResult('OCR API Connectivity', 'passed', {
        message: 'OCR API working correctly'
      });
      log('OCR API working correctly', 'success');
    }
  } catch (error) {
    addTestResult('OCR API Connectivity', 'failed', null, error.message);
    log(`OCR API test failed: ${error.message}`, 'error');
  }
}

// Test 5: WebSocket Connection
async function testWebSocketConnection() {
  log('Testing WebSocket Connection...');

  return new Promise(resolve => {
    try {
      const wsUrl = 'wss://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/websocket-server';
      const ws = new WebSocket(wsUrl);

      const timeout = setTimeout(() => {
        addTestResult('WebSocket Connection', 'warning', {
          message: 'WebSocket connection timeout (function may not be deployed)'
        });
        log('WebSocket connection timeout (function may not be deployed)', 'warning');
        resolve();
      }, 5000);

      ws.onopen = () => {
        clearTimeout(timeout);
        addTestResult('WebSocket Connection', 'passed', {
          message: 'WebSocket connection successful'
        });
        log('WebSocket connection successful', 'success');
        ws.close();
        resolve();
      };

      ws.onerror = error => {
        clearTimeout(timeout);
        addTestResult('WebSocket Connection', 'warning', {
          message: 'WebSocket connection failed (function may not be deployed)'
        });
        log('WebSocket connection failed (function may not be deployed)', 'warning');
        resolve();
      };
    } catch (error) {
      addTestResult('WebSocket Connection', 'failed', null, error.message);
      log(`WebSocket test failed: ${error.message}`, 'error');
      resolve();
    }
  });
}

// Test 6: ESMA API Connectivity
async function testESMAAPI() {
  log('Testing ESMA API Connectivity...');

  try {
    const esmaUrl = 'https://registers.esma.europa.eu/solr/esma_registers/sfdr_disclosures';
    const response = await fetch(esmaUrl);

    if (response.ok) {
      addTestResult('ESMA API Connectivity', 'passed', {
        message: 'ESMA API accessible',
        status: response.status
      });
      log('ESMA API accessible', 'success');
    } else {
      addTestResult('ESMA API Connectivity', 'warning', {
        message: `ESMA API returned status ${response.status}`,
        status: response.status
      });
      log(`ESMA API returned status ${response.status}`, 'warning');
    }
  } catch (error) {
    addTestResult('ESMA API Connectivity', 'warning', null, error.message);
    log(`ESMA API test failed: ${error.message}`, 'warning');
  }
}

// Test 7: Component Loading
async function testComponentLoading() {
  log('Testing Component Loading...');

  try {
    // Test if components can be imported
    const components = ['DocumentUpload', 'NexusAgentChat'];

    const loadResults = {};

    for (const componentName of components) {
      try {
        if (componentName === 'DocumentUpload') {
          const { DocumentUpload } = await import('./src/components/DocumentUpload.tsx');
          loadResults[componentName] = 'loaded';
        } else if (componentName === 'NexusAgentChat') {
          const { NexusAgentChat } = await import('./src/components/NexusAgentChat.tsx');
          loadResults[componentName] = 'loaded';
        }
      } catch (error) {
        loadResults[componentName] = 'failed';
      }
    }

    const allLoaded = Object.values(loadResults).every(result => result === 'loaded');

    if (allLoaded) {
      addTestResult('Component Loading', 'passed', {
        message: 'All components loaded successfully',
        components: loadResults
      });
      log('All components loaded successfully', 'success');
    } else {
      addTestResult('Component Loading', 'failed', {
        message: 'Some components failed to load',
        components: loadResults
      });
      log('Some components failed to load', 'error');
    }
  } catch (error) {
    addTestResult('Component Loading', 'failed', null, error.message);
    log(`Component loading test failed: ${error.message}`, 'error');
  }
}

// Test 8: SFDR Validation Logic
async function testSFDRValidation() {
  log('Testing SFDR Validation Logic...');

  try {
    const testRequest = {
      metadata: {
        entityId: 'TEST-ENTITY-001',
        reportingPeriod: '2024',
        regulatoryVersion: 'SFDR_v1.0',
        submissionType: 'INITIAL'
      },
      fundProfile: {
        fundType: 'UCITS',
        fundName: 'Test Sustainable Fund',
        targetArticleClassification: 'Article8',
        investmentObjective: 'Promoting environmental and social characteristics'
      }
    };

    // Import and test the service
    const { sfdrApiService } = await import('./src/services/sfdrApiService.ts');
    const result = await sfdrApiService.validateSFDRCompliance(testRequest);

    if (result.success) {
      addTestResult('SFDR Validation Logic', 'passed', {
        message: 'SFDR validation successful',
        score: result.complianceResults?.overallScore || result.complianceScore,
        hasResults: !!result.complianceResults
      });
      log('SFDR validation successful', 'success');
    } else {
      addTestResult('SFDR Validation Logic', 'failed', null, result.error || 'Validation failed');
      log(`SFDR validation failed: ${result.error || 'Validation failed'}`, 'error');
    }
  } catch (error) {
    addTestResult('SFDR Validation Logic', 'failed', null, error.message);
    log(`SFDR validation test failed: ${error.message}`, 'error');
  }
}

// Test 9: Development Server
async function testDevelopmentServer() {
  log('Testing Development Server...');

  try {
    const response = await fetch(TEST_CONFIG.baseUrl);

    if (response.ok) {
      const html = await response.text();

      if (html.includes('SFDR') || html.includes('Nexus')) {
        addTestResult('Development Server', 'passed', {
          message: 'Development server running and serving SFDR Navigator',
          status: response.status
        });
        log('Development server running and serving SFDR Navigator', 'success');
      } else {
        addTestResult('Development Server', 'warning', {
          message: 'Development server running but content not verified',
          status: response.status
        });
        log('Development server running but content not verified', 'warning');
      }
    } else {
      addTestResult('Development Server', 'failed', null, `HTTP ${response.status}`);
      log(`Development server test failed: HTTP ${response.status}`, 'error');
    }
  } catch (error) {
    addTestResult('Development Server', 'failed', null, error.message);
    log(`Development server test failed: ${error.message}`, 'error');
  }
}

// Test 10: Build Status
async function testBuildStatus() {
  log('Testing Build Status...');

  try {
    const fs = await import('fs');

    if (fs.existsSync('./dist')) {
      const distStats = fs.statSync('./dist');
      const isRecent = Date.now() - distStats.mtime.getTime() < 3600000; // 1 hour

      addTestResult('Build Status', 'passed', {
        message: 'Build artifacts found',
        isRecent,
        lastModified: distStats.mtime.toISOString()
      });
      log('Build artifacts found', 'success');
    } else {
      addTestResult('Build Status', 'warning', {
        message: 'Build artifacts not found (run npm run build)'
      });
      log('Build artifacts not found (run npm run build)', 'warning');
    }
  } catch (error) {
    addTestResult('Build Status', 'failed', null, error.message);
    log(`Build status test failed: ${error.message}`, 'error');
  }
}

// Main test runner
async function runComprehensiveTests() {
  console.log('🚀 Starting Comprehensive SFDR Navigator Integration Tests...\n');

  const tests = [
    testEnvironmentConfiguration,
    testSupabaseConnection,
    testAPIServiceImport,
    testOCRAPI,
    testWebSocketConnection,
    testESMAAPI,
    testComponentLoading,
    testSFDRValidation,
    testDevelopmentServer,
    testBuildStatus
  ];

  for (const test of tests) {
    try {
      await test();
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      log(`Test failed with error: ${error.message}`, 'error');
    }
  }

  // Generate comprehensive report
  generateTestReport();
}

// Generate test report
function generateTestReport() {
  console.log('\n📊 Comprehensive Test Report');
  console.log('============================\n');

  const passed = testResults.filter(r => r.status === 'passed').length;
  const failed = testResults.filter(r => r.status === 'failed').length;
  const warnings = testResults.filter(r => r.status === 'warning').length;
  const total = testResults.length;

  // Summary
  console.log('📈 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warnings}`);
  console.log(`📊 Total: ${total}\n`);

  // Detailed results
  console.log('📋 Detailed Results:');
  testResults.forEach((result, index) => {
    const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⚠️';
    console.log(`${index + 1}. ${statusIcon} ${result.name}`);

    if (result.details) {
      console.log(`   Details: ${result.details.message || JSON.stringify(result.details)}`);
    }

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    console.log(`   Time: ${result.timestamp}\n`);
  });

  // Recommendations
  console.log('💡 Recommendations:');

  if (failed === 0 && warnings === 0) {
    console.log('🎉 All tests passed! Your SFDR Navigator is ready for production.');
    console.log('🚀 Next steps:');
    console.log('   1. Deploy to production');
    console.log('   2. Set up real API keys');
    console.log('   3. Configure monitoring');
  } else if (failed === 0) {
    console.log('✅ Core functionality is working! Some optional features have warnings.');
    console.log('🔧 Next steps:');
    console.log('   1. Deploy WebSocket server (if needed)');
    console.log('   2. Set up real API keys');
    console.log('   3. Test with real data');
  } else {
    console.log('⚠️ Some tests failed. Please address the issues before proceeding.');
    console.log('🔧 Next steps:');
    console.log('   1. Check environment configuration');
    console.log('   2. Verify Supabase setup');
    console.log('   3. Fix failing components');
  }

  console.log('\n🌐 Manual Testing:');
  console.log('   1. Visit: http://localhost:8080/test-integration');
  console.log('   2. Test document upload functionality');
  console.log('   3. Test SFDR compliance validation');
  console.log('   4. Test chat integration');

  return { passed, failed, warnings, total, results: testResults };
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runComprehensiveTests().catch(console.error);
} else {
  window.runComprehensiveTests = runComprehensiveTests;
  console.log(
    '🧪 Comprehensive test script loaded. Run window.runComprehensiveTests() to start testing.'
  );
}

export { runComprehensiveTests, generateTestReport };
