const axios = require('axios');
require('dotenv').config();

async function testEndpoint(model) {
    console.log(`\n🔍 Testing ${model.toUpperCase()} model...`);
    
    try {
        const startTime = Date.now();
        
        const response = await axios.post('http://localhost:3004/api/chat', {
            message: 'Hello, test message',
            model: model
        }, {
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        console.log(`✅ ${model.toUpperCase()} Success:`);
        console.log(`   Latency: ${latency}ms`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response Length: ${JSON.stringify(response.data).length} chars`);
        console.log(`   Success: ${response.data.success}`);
        
        return { success: true, latency, model };
        
    } catch (error) {
        console.log(`❌ ${model.toUpperCase()} Failed:`);
        console.log(`   Error: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Data: ${JSON.stringify(error.response.data)}`);
        }
        if (error.code) {
            console.log(`   Code: ${error.code}`);
        }
        
        return { success: false, error: error.message, model };
    }
}

async function quickLatencyTest() {
    console.log('🚀 Quick Latency Test');
    console.log('=' .repeat(40));
    
    // Test server health first
    try {
        console.log('🏥 Testing server health...');
        const healthResponse = await axios.get('http://localhost:3004/api/health', { timeout: 5000 });
        console.log(`✅ Server Health: ${healthResponse.status} - ${JSON.stringify(healthResponse.data)}`);
    } catch (error) {
        console.log(`❌ Server Health Failed: ${error.message}`);
        return;
    }
    
    // Test both models
    const openrouterResult = await testEndpoint('openrouter');
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    const ollamaResult = await testEndpoint('ollama');
    
    console.log('\n📊 SUMMARY:');
    console.log('=' .repeat(40));
    
    if (openrouterResult.success && ollamaResult.success) {
        if (openrouterResult.latency < ollamaResult.latency) {
            console.log(`🏆 Winner: OpenRouter (${openrouterResult.latency}ms vs ${ollamaResult.latency}ms)`);
            console.log('💡 Recommendation: Use OpenRouter as primary');
        } else {
            console.log(`🏆 Winner: Ollama (${ollamaResult.latency}ms vs ${openrouterResult.latency}ms)`);
            console.log('💡 Recommendation: Use Ollama as primary');
        }
    } else if (openrouterResult.success) {
        console.log('🏆 Winner: OpenRouter (only working model)');
        console.log('💡 Recommendation: Use OpenRouter as primary');
    } else if (ollamaResult.success) {
        console.log('🏆 Winner: Ollama (only working model)');
        console.log('💡 Recommendation: Use Ollama as primary');
    } else {
        console.log('❌ Both models failed - check server configuration');
    }
}

quickLatencyTest().catch(console.error);