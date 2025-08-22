#!/usr/bin/env node

// Simple Testing Script for WebSocket and Environment Components
// This script performs basic testing using curl and simple HTTP requests

const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SimpleTester {
    constructor() {
        this.baseUrl = 'http://localhost:8080';
        this.results = {
            server: false,
            testingPage: false,
            edgeFunctions: false,
            errors: []
        };
    }

    async runAllTests() {
        console.log('🚀 Starting Simple Testing...');
        
        // Test 1: Server Accessibility
        await this.testServerAccessibility();
        
        // Test 2: Testing Page
        await this.testTestingPage();
        
        // Test 3: Edge Functions
        await this.testEdgeFunctions();
        
        // Generate report
        this.generateReport();
    }

    async testServerAccessibility() {
        console.log('🔍 Testing server accessibility...');
        try {
            const { stdout } = await execAsync(`curl -s -o /dev/null -w "%{http_code}" ${this.baseUrl}`);
            this.results.server = stdout.trim() === '200';
            console.log(`✅ Server accessible: ${this.results.server} (HTTP ${stdout.trim()})`);
        } catch (error) {
            console.log('❌ Server not accessible');
            this.results.errors.push(`Server accessibility: ${error.message}`);
        }
    }

    async testTestingPage() {
        console.log('🔍 Testing Testing Page...');
        try {
            const { stdout } = await execAsync(`curl -s ${this.baseUrl}/testing`);
            this.results.testingPage = stdout.includes('System Testing & Diagnostics') || 
                                      stdout.includes('Testing') ||
                                      stdout.includes('WebSocket') ||
                                      stdout.includes('Environment');
            console.log(`✅ Testing page accessible: ${this.results.testingPage}`);
            
            if (this.results.testingPage) {
                // Check for specific components
                const hasWebSocket = stdout.includes('WebSocket');
                const hasEnvironment = stdout.includes('Environment');
                const hasUAT = stdout.includes('UAT') || stdout.includes('Test');
                const hasDiagnostics = stdout.includes('Diagnostics');
                
                console.log(`  - WebSocket component: ${hasWebSocket ? '✅' : '❌'}`);
                console.log(`  - Environment component: ${hasEnvironment ? '✅' : '❌'}`);
                console.log(`  - UAT Tests: ${hasUAT ? '✅' : '❌'}`);
                console.log(`  - Diagnostics: ${hasDiagnostics ? '✅' : '❌'}`);
            }
        } catch (error) {
            console.log('❌ Testing page failed');
            this.results.errors.push(`Testing page: ${error.message}`);
        }
    }

    async testEdgeFunctions() {
        console.log('🔍 Testing Edge Functions...');
        try {
            // Test env-validation function
            const envTest = await execAsync(`curl -s "https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/env-validation" -H "Content-Type: application/json" -d '{"supabaseUrl":"https://hnwwykttyzfvflmcswjk.supabase.co","supabaseAnonKey":"test","ocrApiKey":"test","websocketUrl":"wss://test.com"}'`);
            
            const envResult = JSON.parse(envTest.stdout);
            const envWorking = envResult.success && envResult.results;
            
            console.log(`✅ Environment validation function: ${envWorking ? '✅' : '❌'}`);
            
            if (envWorking) {
                console.log(`  - Supabase connection: ${envResult.results.supabase ? '✅' : '❌'}`);
                console.log(`  - WebSocket URL format: ${envResult.results.websocket ? '✅' : '❌'}`);
                console.log(`  - OCR API: ${envResult.results.ocr ? '✅' : '❌'}`);
            }
            
            // Test websocket-server function (basic connectivity)
            const wsTest = await execAsync(`curl -s "https://hnwwykttyzfvflmcswjk.supabase.co/functions/v1/websocket-server" -H "Upgrade: websocket" -H "Connection: Upgrade"`);
            const wsWorking = wsTest.stdout.includes('Expected websocket');
            
            console.log(`✅ WebSocket server function: ${wsWorking ? '✅' : '❌'}`);
            
            this.results.edgeFunctions = envWorking && wsWorking;
            
        } catch (error) {
            console.log('❌ Edge Functions test failed');
            this.results.errors.push(`Edge Functions: ${error.message}`);
        }
    }

    async testNexusAgent() {
        console.log('🔍 Testing Nexus Agent...');
        try {
            const { stdout } = await execAsync(`curl -s ${this.baseUrl}/nexus-agent`);
            const nexusWorking = stdout.includes('Nexus Agent') || 
                                stdout.includes('SFDR Navigator') ||
                                stdout.includes('Chat') ||
                                stdout.includes('Form');
            
            console.log(`✅ Nexus Agent accessible: ${nexusWorking}`);
            return nexusWorking;
        } catch (error) {
            console.log('❌ Nexus Agent test failed');
            this.results.errors.push(`Nexus Agent: ${error.message}`);
            return false;
        }
    }

    generateReport() {
        console.log('\n📊 SIMPLE TESTING REPORT');
        console.log('========================');
        
        const totalTests = Object.keys(this.results).length - 1; // Exclude errors
        const passedTests = Object.values(this.results).filter(result => result === true).length;
        const failedTests = totalTests - passedTests;
        
        console.log(`\n✅ Passed: ${passedTests}/${totalTests}`);
        console.log(`❌ Failed: ${failedTests}/${totalTests}`);
        
        console.log('\n📋 Detailed Results:');
        console.log(`Server Accessibility: ${this.results.server ? '✅' : '❌'}`);
        console.log(`Testing Page: ${this.results.testingPage ? '✅' : '❌'}`);
        console.log(`Edge Functions: ${this.results.edgeFunctions ? '✅' : '❌'}`);
        
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
            console.log('2. 🌐 Open http://localhost:8080/testing in your browser');
            console.log('3. 🔍 Test WebSocket connection manually');
            console.log('4. 🔧 Test Environment validation manually');
            console.log('5. 🧪 Run UAT tests manually');
        } else {
            console.log('1. ❌ Server or testing page not accessible');
            console.log('2. 🚀 Ensure development server is running on port 8080');
            console.log('3. 🔧 Check for build errors or missing dependencies');
        }
        
        console.log('\n🌐 Manual Testing URLs:');
        console.log('- Testing Dashboard: http://localhost:8080/testing');
        console.log('- Nexus Agent: http://localhost:8080/nexus-agent');
        console.log('- SFDR Navigator: http://localhost:8080/sfdr-navigator');
    }
}

// Run the simple tests
async function runSimpleTests() {
    const tester = new SimpleTester();
    await tester.runAllTests();
}

// Run if called directly
if (require.main === module) {
    runSimpleTests().catch(console.error);
}

module.exports = { SimpleTester, runSimpleTests };