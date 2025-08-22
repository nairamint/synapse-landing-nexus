// Automated Testing Script for WebSocket and Environment Components
// This script performs comprehensive testing of all components

const puppeteer = require('puppeteer');

class AutomatedTester {
    constructor() {
        this.baseUrl = 'http://localhost:8080';
        this.results = {
            server: false,
            testingPage: false,
            websocket: false,
            environment: false,
            uat: false,
            diagnostics: false,
            nexusAgent: false,
            errors: []
        };
    }

    async runAllTests() {
        console.log('🚀 Starting Automated Testing...');
        
        let browser;
        try {
            // Launch browser
            browser = await puppeteer.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            
            // Test 1: Server Accessibility
            await this.testServerAccessibility(page);
            
            // Test 2: Testing Page
            await this.testTestingPage(page);
            
            // Test 3: WebSocket Component
            await this.testWebSocketComponent(page);
            
            // Test 4: Environment Component
            await this.testEnvironmentComponent(page);
            
            // Test 5: UAT Tests Component
            await this.testUATComponent(page);
            
            // Test 6: Diagnostics Component
            await this.testDiagnosticsComponent(page);
            
            // Test 7: Nexus Agent
            await this.testNexusAgent(page);
            
            // Generate report
            this.generateReport();
            
        } catch (error) {
            console.error('❌ Testing failed:', error.message);
            this.results.errors.push(error.message);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    async testServerAccessibility(page) {
        console.log('🔍 Testing server accessibility...');
        try {
            const response = await page.goto(this.baseUrl, { waitUntil: 'networkidle0' });
            this.results.server = response.status() === 200;
            console.log(`✅ Server accessible: ${this.results.server}`);
        } catch (error) {
            console.log('❌ Server not accessible');
            this.results.errors.push(`Server accessibility: ${error.message}`);
        }
    }

    async testTestingPage(page) {
        console.log('🔍 Testing Testing Page...');
        try {
            await page.goto(`${this.baseUrl}/testing`, { waitUntil: 'networkidle0' });
            
            // Check if page loads
            const title = await page.$eval('h1', el => el.textContent);
            this.results.testingPage = title.includes('System Testing & Diagnostics');
            
            // Check for tabs
            const tabs = await page.$$('[role="tab"]');
            const hasFourTabs = tabs.length === 4;
            
            console.log(`✅ Testing page loaded: ${this.results.testingPage}`);
            console.log(`✅ Four tabs found: ${hasFourTabs}`);
            
        } catch (error) {
            console.log('❌ Testing page failed');
            this.results.errors.push(`Testing page: ${error.message}`);
        }
    }

    async testWebSocketComponent(page) {
        console.log('🔍 Testing WebSocket Component...');
        try {
            // Navigate to testing page
            await page.goto(`${this.baseUrl}/testing`, { waitUntil: 'networkidle0' });
            
            // Click on WebSocket tab
            await page.click('[value="websocket"]');
            await page.waitForTimeout(1000);
            
            // Check initial state
            const statusText = await page.$eval('p', el => el.textContent);
            const isDisconnected = statusText.includes('Disconnected');
            
            // Try to connect
            const connectButton = await page.$('button:has-text("Connect")');
            if (connectButton) {
                await connectButton.click();
                await page.waitForTimeout(2000);
                
                // Check if connected
                const newStatusText = await page.$eval('p', el => el.textContent);
                const isConnected = newStatusText.includes('Connected');
                
                this.results.websocket = isConnected;
                console.log(`✅ WebSocket connection: ${isConnected}`);
            }
            
        } catch (error) {
            console.log('❌ WebSocket test failed');
            this.results.errors.push(`WebSocket: ${error.message}`);
        }
    }

    async testEnvironmentComponent(page) {
        console.log('🔍 Testing Environment Component...');
        try {
            // Navigate to testing page
            await page.goto(`${this.baseUrl}/testing`, { waitUntil: 'networkidle0' });
            
            // Click on Environment tab
            await page.click('[value="environment"]');
            await page.waitForTimeout(1000);
            
            // Click validate button
            const validateButton = await page.$('button:has-text("Validate Environment")');
            if (validateButton) {
                await validateButton.click();
                await page.waitForTimeout(3000);
                
                // Check for results
                const results = await page.$('.space-y-3');
                this.results.environment = !!results;
                
                console.log(`✅ Environment validation: ${this.results.environment}`);
            }
            
        } catch (error) {
            console.log('❌ Environment test failed');
            this.results.errors.push(`Environment: ${error.message}`);
        }
    }

    async testUATComponent(page) {
        console.log('🔍 Testing UAT Component...');
        try {
            // Navigate to testing page
            await page.goto(`${this.baseUrl}/testing`, { waitUntil: 'networkidle0' });
            
            // Click on UAT Tests tab
            await page.click('[value="uat"]');
            await page.waitForTimeout(1000);
            
            // Check for test buttons
            const testButtons = await page.$$('button:has-text("Test")');
            this.results.uat = testButtons.length > 0;
            
            console.log(`✅ UAT tests available: ${this.results.uat}`);
            
        } catch (error) {
            console.log('❌ UAT test failed');
            this.results.errors.push(`UAT: ${error.message}`);
        }
    }

    async testDiagnosticsComponent(page) {
        console.log('🔍 Testing Diagnostics Component...');
        try {
            // Navigate to testing page
            await page.goto(`${this.baseUrl}/testing`, { waitUntil: 'networkidle0' });
            
            // Click on Diagnostics tab
            await page.click('[value="diagnostics"]');
            await page.waitForTimeout(1000);
            
            // Check for diagnostic sections
            const sections = await page.$$('h3');
            const hasDiagnostics = sections.length > 0;
            
            this.results.diagnostics = hasDiagnostics;
            console.log(`✅ Diagnostics available: ${this.results.diagnostics}`);
            
        } catch (error) {
            console.log('❌ Diagnostics test failed');
            this.results.errors.push(`Diagnostics: ${error.message}`);
        }
    }

    async testNexusAgent(page) {
        console.log('🔍 Testing Nexus Agent...');
        try {
            // Navigate to Nexus Agent
            await page.goto(`${this.baseUrl}/nexus-agent`, { waitUntil: 'networkidle0' });
            
            // Check if page loads
            const title = await page.$eval('h1', el => el.textContent);
            this.results.nexusAgent = title.includes('Nexus Agent') || title.includes('SFDR Navigator');
            
            console.log(`✅ Nexus Agent loaded: ${this.results.nexusAgent}`);
            
        } catch (error) {
            console.log('❌ Nexus Agent test failed');
            this.results.errors.push(`Nexus Agent: ${error.message}`);
        }
    }

    generateReport() {
        console.log('\n📊 AUTOMATED TESTING REPORT');
        console.log('============================');
        
        const totalTests = Object.keys(this.results).length - 1; // Exclude errors
        const passedTests = Object.values(this.results).filter(result => result === true).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`\n✅ Passed: ${passedTests}/${totalTests}`);
        console.log(`❌ Failed: ${failedTests}/${totalTests}`);
        
        console.log('\n📋 Detailed Results:');
        console.log(`Server Accessibility: ${this.results.server ? '✅' : '❌'}`);
        console.log(`Testing Page: ${this.results.testingPage ? '✅' : '❌'}`);
        console.log(`WebSocket Component: ${this.results.websocket ? '✅' : '❌'}`);
        console.log(`Environment Component: ${this.results.environment ? '✅' : '❌'}`);
        console.log(`UAT Tests: ${this.results.uat ? '✅' : '❌'}`);
        console.log(`Diagnostics: ${this.results.diagnostics ? '✅' : '❌'}`);
        console.log(`Nexus Agent: ${this.results.nexusAgent ? '✅' : '❌'}`);
        
        if (this.results.errors.length > 0) {
            console.log('\n🚨 Errors:');
            this.results.errors.forEach((error, index) => {
                console.log(`${index + 1}. ${error}`);
            });
        }
        
        console.log('\n🎯 Overall Status:');
        if (passedTests === totalTests) {
            console.log('🎉 ALL TESTS PASSED! The system is working perfectly.');
        } else if (passedTests >= totalTests * 0.8) {
            console.log('⚠️ MOST TESTS PASSED. Some minor issues to address.');
        } else {
            console.log('❌ MANY TESTS FAILED. Significant issues need attention.');
        }
        
        console.log('\n📝 Next Steps:');
        if (this.results.server && this.results.testingPage) {
            console.log('1. ✅ Server and testing page are accessible');
            console.log('2. 🔍 Review failed component tests');
            console.log('3. 🛠️ Check browser console for detailed errors');
            console.log('4. 🔧 Verify Edge Functions are deployed correctly');
        } else {
            console.log('1. ❌ Server or testing page not accessible');
            console.log('2. 🚀 Ensure development server is running on port 8080');
            console.log('3. 🔧 Check for build errors or missing dependencies');
        }
    }
}

// Run the automated tests
async function runAutomatedTests() {
    const tester = new AutomatedTester();
    await tester.runAllTests();
}

// Export for use
module.exports = { AutomatedTester, runAutomatedTests };

// Run if called directly
if (require.main === module) {
    runAutomatedTests().catch(console.error);
}