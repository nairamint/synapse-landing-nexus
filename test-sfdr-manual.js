import puppeteer from 'puppeteer';

async function testSFDRNavigator() {
  console.log('🚀 Starting SFDR Navigator Core Functionality Test...');

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });

  let page;

  try {
    page = await browser.newPage();

    // Navigate to SFDR Navigator - Updated to correct port
    console.log('📱 Navigating to SFDR Navigator...');
    await page.goto('http://localhost:8085/sfdr-navigator', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });

    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Test 1: Check if page loads without component errors
    console.log('✅ Test 1: Checking for component errors...');
    const errorElements = await page.$$('text=Component Error');
    if (errorElements.length > 0) {
      console.log('❌ Component Error detected!');
      await page.screenshot({ path: 'error-screenshot.png' });
      return false;
    }
    console.log('✅ No component errors found');

    // Test 2: Check main header
    console.log('✅ Test 2: Checking main header...');
    const header = await page.$('h1');
    if (!header) {
      console.log('❌ Main header not found');
      return false;
    }
    const headerText = await header.evaluate(el => el.textContent);
    if (!headerText || !headerText.includes('SFDR Navigator')) {
      console.log('❌ Main header text not found');
      return false;
    }
    console.log('✅ Main header found');

    // Test 3: Check navigation tabs
    console.log('✅ Test 3: Checking navigation tabs...');
    const tabs = ['AI Chat', 'Classify', 'Documents', 'Analytics', 'Export'];
    for (const tab of tabs) {
      const tabElements = await page.$$('button, [role="tab"]');
      let found = false;
      for (const element of tabElements) {
        const text = await element.evaluate(el => el.textContent);
        if (text && text.includes(tab)) {
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`❌ Tab "${tab}" not found`);
        return false;
      }
    }
    console.log('✅ All navigation tabs found');

    // Test 4: Check statistics dashboard
    console.log('✅ Test 4: Checking statistics dashboard...');
    const stats = ['Funds Analyzed', 'Compliance Score', 'Documents Processed', 'AI Citations'];
    for (const stat of stats) {
      const statElement = await page.$(`text=${stat}`);
      if (!statElement) {
        console.log(`❌ Stat "${stat}" not found`);
        return false;
      }
    }
    console.log('✅ Statistics dashboard found');

    // Test 5: Test tab navigation
    console.log('✅ Test 5: Testing tab navigation...');

    // Click Classify tab
    await page.click('button:has-text("Classify")');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const classifyContent = await page.$('text=SFDR Fund Classification');
    if (!classifyContent) {
      console.log('❌ Classify tab content not found');
      return false;
    }
    console.log('✅ Classify tab working');

    // Click Documents tab
    await page.click('text=Documents');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const documentsContent = await page.$('text=Document Analysis');
    if (!documentsContent) {
      console.log('❌ Documents tab content not found');
      return false;
    }
    console.log('✅ Documents tab working');

    // Click Analytics tab
    await page.click('text=Analytics');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const analyticsContent = await page.$('text=Analytics Dashboard');
    if (!analyticsContent) {
      console.log('❌ Analytics tab content not found');
      return false;
    }
    console.log('✅ Analytics tab working');

    // Click Export tab
    await page.click('text=Export');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const exportContent = await page.$('text=Export Analysis & Reports');
    if (!exportContent) {
      console.log('❌ Export tab content not found');
      return false;
    }
    console.log('✅ Export tab working');

    // Return to Chat tab
    await page.click('text=AI Chat');
    await new Promise(resolve => setTimeout(resolve, 1000));
    const chatContent = await page.$('text=AI-Powered SFDR Chat');
    if (!chatContent) {
      console.log('❌ Chat tab content not found');
      return false;
    }
    console.log('✅ Chat tab working');

    // Test 6: Check loading states
    console.log('✅ Test 6: Checking loading states...');
    const loadingStates = [
      'Chat interface is being loaded',
      'Classification form is being loaded',
      'Document upload interface is being loaded',
      'Analytics dashboard is being loaded',
      'Export interface is being loaded'
    ];

    for (const loadingState of loadingStates) {
      const loadingElement = await page.$(`text=${loadingState}`);
      if (!loadingElement) {
        console.log(`❌ Loading state "${loadingState}" not found`);
        return false;
      }
    }
    console.log('✅ All loading states found');

    // Test 7: Check visual elements
    console.log('✅ Test 7: Checking visual elements...');
    const svgElements = await page.$$('svg');
    if (svgElements.length === 0) {
      console.log('❌ No SVG icons found');
      return false;
    }
    console.log(`✅ Found ${svgElements.length} SVG icons`);

    // Test 8: Check responsive design
    console.log('✅ Test 8: Checking responsive design...');
    const gridElement = await page.$('.grid.grid-cols-2.md\\:grid-cols-4');
    if (!gridElement) {
      console.log('❌ Responsive grid not found');
      return false;
    }
    console.log('✅ Responsive design elements found');

    // Test 9: Check accessibility
    console.log('✅ Test 9: Checking accessibility...');
    const headings = await page.$$('h1, h3');
    if (headings.length === 0) {
      console.log('❌ No headings found');
      return false;
    }
    console.log(`✅ Found ${headings.length} headings`);

    const buttons = await page.$$('button');
    if (buttons.length === 0) {
      console.log('❌ No buttons found');
      return false;
    }
    console.log(`✅ Found ${buttons.length} buttons`);

    // Test 10: Take final screenshot
    console.log('✅ Test 10: Taking final screenshot...');
    await page.screenshot({ path: 'sfdr-navigator-success.png', fullPage: true });

    console.log('🎉 All tests passed! SFDR Navigator is working correctly.');
    console.log('📊 Summary:');
    console.log('   ✅ No component errors');
    console.log('   ✅ All navigation tabs functional');
    console.log('   ✅ Statistics dashboard displayed');
    console.log('   ✅ Tab navigation working');
    console.log('   ✅ Loading states present');
    console.log('   ✅ Visual elements rendered');
    console.log('   ✅ Responsive design implemented');
    console.log('   ✅ Accessibility elements present');
    console.log('   ✅ Screenshot saved as sfdr-navigator-success.png');

    return true;
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    if (page) {
      await page.screenshot({ path: 'error-screenshot.png' });
    }
    return false;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Run the test
testSFDRNavigator()
  .then(success => {
    if (success) {
      console.log('🎯 SFDR Navigator Core Tool Test: PASSED');
      process.exit(0);
    } else {
      console.log('💥 SFDR Navigator Core Tool Test: FAILED');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('💥 Test execution failed:', error);
    process.exit(1);
  });
