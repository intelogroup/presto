const axios = require('axios');
require('dotenv').config();

// Test LLM response functionality
async function testLLMResponse() {
    console.log('🚀 Testing LLM Response Functionality...');
    console.log('Backend URL: http://localhost:3004');
    
    try {
        // Test chat endpoint
        const testMessage = {
            message: 'Hello, can you create a simple presentation about artificial intelligence?',
            model: 'openrouter' // or 'ollama'
        };
        
        console.log('📤 Sending test message:', testMessage.message);
        console.log('🤖 Using model:', testMessage.model);
        
        const response = await axios.post('http://localhost:3004/api/chat', testMessage, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Response Status:', response.status);
        console.log('📥 Response Data:', JSON.stringify(response.data, null, 2));
        
        if (response.data.success) {
            console.log('🎉 LLM Response Test PASSED!');
            if (response.data.presentationPath) {
                console.log('📄 Presentation generated at:', response.data.presentationPath);
            }
        } else {
            console.log('❌ LLM Response Test FAILED:', response.data.error);
        }
        
    } catch (error) {
        console.error('❌ Test Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
}

// Test with different models
async function testMultipleModels() {
    const models = ['openrouter', 'ollama'];
    
    for (const model of models) {
        console.log(`\n🔄 Testing with ${model.toUpperCase()} model...`);
        
        try {
            const testMessage = {
                message: `Test message for ${model}: Create a 3-slide presentation about renewable energy.`,
                model: model
            };
            
            const response = await axios.post('http://localhost:3004/api/chat', testMessage, {
                timeout: 30000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log(`✅ ${model.toUpperCase()} Test Status:`, response.status);
            console.log(`📊 ${model.toUpperCase()} Response:`, response.data.success ? 'SUCCESS' : 'FAILED');
            
        } catch (error) {
            console.error(`❌ ${model.toUpperCase()} Test Failed:`, error.message);
        }
        
        // Wait between tests
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

// Run tests
async function runAllTests() {
    console.log('🧪 Starting LLM CLI Tests...');
    console.log('=' .repeat(50));
    
    // Basic test
    await testLLMResponse();
    
    console.log('\n' + '=' .repeat(50));
    
    // Multiple model tests
    await testMultipleModels();
    
    console.log('\n🏁 All tests completed!');
}

runAllTests().catch(console.error);