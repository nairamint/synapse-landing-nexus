// Quick Component Testing Script
// Run this in the browser console at http://localhost:5173/testing

console.log('🧪 Starting Component Tests...');

// Test 1: Check if TestingPage component is loaded
function testTestingPage() {
  console.log('✅ Testing TestingPage component...');

  // Check if the main elements are present
  const header = document.querySelector('h1');
  const tabs = document.querySelectorAll('[role="tab"]');
  const statusCards = document.querySelectorAll('.grid.grid-cols-1.md\\:grid-cols-4 > div');

  console.log('Header:', header?.textContent);
  console.log('Number of tabs:', tabs.length);
  console.log('Number of status cards:', statusCards.length);

  return {
    header: !!header,
    tabs: tabs.length === 4,
    statusCards: statusCards.length === 4
  };
}

// Test 2: Check WebSocket component
function testWebSocketComponent() {
  console.log('✅ Testing WebSocket component...');

  // Switch to WebSocket tab
  const websocketTab = document.querySelector('[data-state="inactive"][value="websocket"]');
  if (websocketTab) {
    websocketTab.click();
    setTimeout(() => {
      const connectButton = document.querySelector('button:contains("Connect")');
      const statusText = document.querySelector('p:contains("Disconnected")');

      console.log('Connect button found:', !!connectButton);
      console.log('Status text found:', !!statusText);
    }, 100);
  }
}

// Test 3: Check Environment component
function testEnvironmentComponent() {
  console.log('✅ Testing Environment component...');

  // Switch to Environment tab
  const envTab = document.querySelector('[data-state="inactive"][value="environment"]');
  if (envTab) {
    envTab.click();
    setTimeout(() => {
      const validateButton = document.querySelector('button:contains("Validate Environment")');
      console.log('Validate button found:', !!validateButton);
    }, 100);
  }
}

// Test 4: Check UAT Tests component
function testUATComponent() {
  console.log('✅ Testing UAT Tests component...');

  // Switch to UAT Tests tab
  const uatTab = document.querySelector('[data-state="inactive"][value="uat"]');
  if (uatTab) {
    uatTab.click();
    setTimeout(() => {
      const testButtons = document.querySelectorAll('button:contains("Test")');
      console.log('Test buttons found:', testButtons.length);
    }, 100);
  }
}

// Test 5: Check Diagnostics component
function testDiagnosticsComponent() {
  console.log('✅ Testing Diagnostics component...');

  // Switch to Diagnostics tab
  const diagTab = document.querySelector('[data-state="inactive"][value="diagnostics"]');
  if (diagTab) {
    diagTab.click();
    setTimeout(() => {
      const browserInfo = document.querySelector('h3:contains("Browser Information")');
      const envVars = document.querySelector('h3:contains("Environment Variables Status")');
      const perfMetrics = document.querySelector('h3:contains("Performance Metrics")');

      console.log('Browser info section found:', !!browserInfo);
      console.log('Environment vars section found:', !!envVars);
      console.log('Performance metrics section found:', !!perfMetrics);
    }, 100);
  }
}

// Run all tests
function runAllTests() {
  console.log('🚀 Running all component tests...');

  const results = {
    testingPage: testTestingPage()
    // Note: Tab-specific tests need to be run manually after switching tabs
  };

  console.log('📊 Test Results:', results);

  // Check for any console errors
  const originalError = console.error;
  const errors = [];
  console.error = (...args) => {
    errors.push(args.join(' '));
    originalError.apply(console, args);
  };

  setTimeout(() => {
    console.log('🔍 Errors found:', errors.length);
    if (errors.length > 0) {
      console.log('Error details:', errors);
    }

    console.log('✅ Component testing complete!');
    console.log('💡 Manual testing steps:');
    console.log('1. Click on WebSocket tab and test connection');
    console.log('2. Click on Environment tab and run validation');
    console.log('3. Click on UAT Tests tab and run automated tests');
    console.log('4. Click on Diagnostics tab and check system info');
  }, 2000);
}

// Auto-run tests when script is loaded
runAllTests();

// Export functions for manual testing
window.testComponents = {
  testTestingPage,
  testWebSocketComponent,
  testEnvironmentComponent,
  testUATComponent,
  testDiagnosticsComponent,
  runAllTests
};
