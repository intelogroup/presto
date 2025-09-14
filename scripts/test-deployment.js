#!/usr/bin/env node
/**
 * Railway Deployment Validation Script
 * Tests all critical endpoints and services post-deployment
 */

const axios = require('axios');
const https = require('https');

// Disable SSL verification for testing (Railway uses valid certs)
const axiosConfig = {
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    }),
    timeout: 10000
};

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(url, description) {
    try {
        const response = await axios.get(url, axiosConfig);
        if (response.status === 200) {
            log(`✅ ${description}: OK`, 'green');
            return { success: true, data: response.data };
        } else {
            log(`❌ ${description}: HTTP ${response.status}`, 'red');
            return { success: false, status: response.status };
        }
    } catch (error) {
        log(`❌ ${description}: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function testPostEndpoint(url, data, description) {
    try {
        const response = await axios.post(url, data, {
            ...axiosConfig,
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.status === 200) {
            log(`✅ ${description}: OK`, 'green');
            return { success: true, data: response.data, headers: response.headers };
        } else {
            log(`❌ ${description}: HTTP ${response.status}`, 'red');
            return { success: false, status: response.status };
        }
    } catch (error) {
        log(`❌ ${description}: ${error.message}`, 'red');
        return { success: false, error: error.message };
    }
}

async function runTests() {
    log('🚀 Railway Deployment Validation', 'blue');
    log('=' .repeat(50), 'blue');

    const vllmUrl = process.env.VLLM_BASE_URL || 'http://localhost:8000';
    const prestoUrl = process.env.PRESTO_SERVICE_URL || 'http://localhost:3004';

    log(`Target vLLM Service: ${vllmUrl}`, 'yellow');
    log(`Target Presto Service: ${prestoUrl}`, 'yellow');
    log('');

    // Test vLLM service
    log('🔍 Testing vLLM Service...', 'blue');
    const vllmHealth = await testEndpoint(`${vllmUrl}/v1/models`, 'vLLM API Models');

    if (vllmHealth.success) {
        const models = vllmHealth.data.data || [];
        log(`   📋 Available models: ${models.length}`, 'yellow');
        models.forEach(model => log(`     - ${model.name}`, 'yellow'));
    }
    log('');

    // Test Presto service
    log('🔍 Testing Presto Backend...', 'blue');
    const prestoHealth = await testEndpoint(`${prestoUrl}/api/health`, 'Presto Health Check');
    const prestoStatus = await testEndpoint(`${prestoUrl}/api/status`, 'Presto Status');
    const prestoTemplates = await testEndpoint(`${prestoUrl}/api/templates`, 'Presto Templates');

    log('');

    // Test PPTX generation
    log('🔍 Testing PPTX Generation...', 'blue');
    const testData = {
        title: "Deployment Test Presentation",
        slides: [
            {
                title: "Test Slide 1",
                content: "This is a deployment validation test.",
                type: "content"
            }
        ]
    };

    const pptxTest = await testPostEndpoint(`${prestoUrl}/api/generate-pptx`, testData, 'PPTX Generation');

    if (pptxTest.success) {
        log(`   📄 Template used: ${pptxTest.headers['x-presto-template'] || 'unknown'}`, 'yellow');
        log(`   ⏱️ Generation time: ${pptxTest.headers['x-presto-generation-time'] || 'unknown'}ms`, 'yellow');
        log(`   🤖 Generator: ${pptxTest.headers['x-presto-generator'] || 'unknown'}`, 'yellow');
    }

    log('');
    log('📊 Test Summary', 'blue');

    const tests = [
        { name: 'vLLM Health', result: vllmHealth.success },
        { name: 'Presto Health', result: prestoHealth.success },
        { name: 'Presto Status', result: prestoStatus.success },
        { name: 'Presto Templates', result: prestoTemplates.success },
        { name: 'PPTX Generation', result: pptxTest.success }
    ];

    const passed = tests.filter(t => t.result).length;
    const total = tests.length;

    tests.forEach(test => {
        log(`   ${test.result ? '✅' : '❌'} ${test.name}`, test.result ? 'green' : 'red');
    });

    log('');
    if (passed === total) {
        log(`🎉 All ${total} tests passed! Deployment looks good.`, 'green');
    } else {
        log(`⚠️ ${passed}/${total} tests passed. Check failed tests above.`, 'yellow');
    }

    log('');
    log('💡 Next Steps:', 'blue');
    log('   1. Update your frontend to use the deployed Presto URL', 'yellow');
    log('   2. Monitor performance and scale resources if needed', 'yellow');
    log('   3. Set up monitoring and alerts in Railway dashboard', 'yellow');

    // Exit with appropriate code
    process.exit(passed === total ? 0 : 1);
}

// Run tests if this script is called directly
if (require.main === module) {
    runTests().catch(error => {
        log(`💥 Script error: ${error.message}`, 'red');
        process.exit(1);
    });
}

module.exports = { runTests };
