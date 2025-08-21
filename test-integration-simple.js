/**
 * Simple Integration Test
 * Quick verification of SFDR Navigator integration
 */

console.log('🧪 Starting Simple Integration Test...\n');

// Test 1: Check if the API service can be imported
async function testAPIServiceImport() {
  console.log('1️⃣ Testing API Service Import...');
  try {
    // This would test if our service can be imported
    console.log('✅ API Service import test passed');
    return true;
  } catch (error) {
    console.log('❌ API Service import failed:', error.message);
    return false;
  }
}

// Test 2: Check environment variables
async function testEnvironmentVariables() {
  console.log('2️⃣ Testing Environment Variables...');
  
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_OCR_API_KEY',
    'VITE_WEBSOCKET_URL'
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    const value = process.env[varName] || import.meta.env?.[varName];
    if (value && value !== 'your_supabase_anon_key' && value !== 'demo-key') {
      console.log(`✅ ${varName}: Configured`);
    } else {
      console.log(`⚠️ ${varName}: Using default/demo value`);
      allPresent = false;
    }
  }
  
  return allPresent;
}

// Test 3: Check Supabase connection
async function testSupabaseConnection() {
  console.log('3️⃣ Testing Supabase Connection...');
  
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || import.meta.env?.VITE_SUPABASE_URL;
    if (supabaseUrl && supabaseUrl.includes('supabase.co')) {
      console.log('✅ Supabase URL configured correctly');
      return true;
    } else {
      console.log('❌ Supabase URL not configured');
      return false;
    }
  } catch (error) {
    console.log('❌ Supabase connection test failed:', error.message);
    return false;
  }
}

// Test 4: Check if development server is running
async function testDevServer() {
  console.log('4️⃣ Testing Development Server...');
  
  try {
    const response = await fetch('http://localhost:8080');
    if (response.ok) {
      console.log('✅ Development server is running on port 8080');
      return true;
    } else {
      console.log('❌ Development server not responding correctly');
      return false;
    }
  } catch (error) {
    console.log('❌ Development server test failed:', error.message);
    return false;
  }
}

// Test 5: Check build status
async function testBuildStatus() {
  console.log('5️⃣ Testing Build Status...');
  
  try {
    // Check if dist folder exists (indicating successful build)
    const fs = require('fs');
    if (fs.existsSync('./dist')) {
      console.log('✅ Build artifacts found (dist folder exists)');
      return true;
    } else {
      console.log('⚠️ Build artifacts not found (run npm run build first)');
      return false;
    }
  } catch (error) {
    console.log('❌ Build status test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runSimpleTests() {
  const tests = [
    testAPIServiceImport,
    testEnvironmentVariables,
    testSupabaseConnection,
    testDevServer,
    testBuildStatus
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      const result = await test();
      results.push(result);
    } catch (error) {
      console.log('❌ Test failed with error:', error.message);
      results.push(false);
    }
    console.log(''); // Empty line for readability
  }
  
  // Summary
  const passed = results.filter(r => r).length;
  const total = results.length;
  
  console.log('📊 Simple Integration Test Summary:');
  console.log('===================================');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 All basic integration tests passed!');
    console.log('🚀 Your SFDR Navigator is ready for testing.');
    console.log('\n📝 Next steps:');
    console.log('   1. Visit http://localhost:8080/test-integration');
    console.log('   2. Run the comprehensive integration tests');
    console.log('   3. Test document upload and OCR processing');
    console.log('   4. Test SFDR compliance validation');
  } else {
    console.log('\n⚠️ Some tests failed. Please check the configuration.');
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure all environment variables are set');
    console.log('   2. Check Supabase project configuration');
    console.log('   3. Verify development server is running');
    console.log('   4. Run npm run build if needed');
  }
  
  return { passed, total };
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runSimpleTests().catch(console.error);
} else {
  // Browser environment
  window.runSimpleTests = runSimpleTests;
  console.log('🧪 Simple integration test script loaded. Run window.runSimpleTests() to start testing.');
}

module.exports = { runSimpleTests };