const https = require('https');
require('dotenv').config();

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

async function verifyOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  console.log('🔍 OPENROUTER API VERIFICATION');
  console.log('=' .repeat(35));
  console.log(`API Key: ${apiKey ? apiKey.substring(0, 20) + '...' + apiKey.substring(apiKey.length - 10) : 'NOT FOUND'}`);
  console.log('');
  
  if (!apiKey) {
    console.log('❌ No API key found in environment');
    return false;
  }
  
  try {
    // Test 1: Check API key with models endpoint
    console.log('📋 Test 1: Checking models endpoint...');
    
    const modelsOptions = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/models',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3004',
        'X-Title': process.env.SITE_NAME || 'Presto Presentation Generator'
      }
    };
    
    const modelsResponse = await makeRequest(modelsOptions);
    
    if (modelsResponse.statusCode === 200) {
      const models = JSON.parse(modelsResponse.body);
      console.log(`✅ Models endpoint success - Found ${models.data?.length || 0} models`);
      
      // Check our specific models
      const ourModels = [
        'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
        'deepseek/deepseek-r1-distill-qwen-14b:free',
        'google/gemma-3-12b-it:free',
        'rekaai/reka-flash-3:free'
      ];
      
      console.log('\n🎯 Checking our models:');
      const availableModels = models.data?.map(m => m.id) || [];
      
      ourModels.forEach(modelId => {
        const isAvailable = availableModels.includes(modelId);
        console.log(`   ${isAvailable ? '✅' : '❌'} ${modelId}`);
      });
      
    } else {
      console.log(`❌ Models endpoint failed: ${modelsResponse.statusCode}`);
      console.log(`   Response: ${modelsResponse.body}`);
      return false;
    }
    
    // Test 2: Try a simple chat completion
    console.log('\n💬 Test 2: Testing chat completion...');
    
    const chatOptions = {
      hostname: 'openrouter.ai',
      port: 443,
      path: '/api/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3004',
        'X-Title': process.env.SITE_NAME || 'Presto Presentation Generator',
        'Content-Type': 'application/json'
      }
    };
    
    const chatData = JSON.stringify({
      model: 'microsoft/phi-3-mini-128k-instruct:free',
      messages: [{
        role: 'user',
        content: 'Say "Hello" in one word.'
      }],
      max_tokens: 5
    });
    
    const chatResponse = await makeRequest(chatOptions, chatData);
    
    if (chatResponse.statusCode === 200) {
      const result = JSON.parse(chatResponse.body);
      console.log(`✅ Chat completion success`);
      console.log(`   Response: "${result.choices[0].message.content.trim()}"`);
      
      // Test 3: Try one of our specific models
      console.log('\n🎯 Test 3: Testing our primary model...');
      
      const ourModelData = JSON.stringify({
        model: 'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
        messages: [{
          role: 'user',
          content: 'Hello'
        }],
        max_tokens: 5
      });
      
      const ourModelResponse = await makeRequest(chatOptions, ourModelData);
      
      if (ourModelResponse.statusCode === 200) {
        const result = JSON.parse(ourModelResponse.body);
        console.log(`✅ Our model works!`);
        console.log(`   Response: "${result.choices[0].message.content.trim()}"`);
        return true;
      } else {
        console.log(`❌ Our model failed: ${ourModelResponse.statusCode}`);
        console.log(`   Response: ${ourModelResponse.body}`);
        
        // Parse error for more details
        try {
          const errorData = JSON.parse(ourModelResponse.body);
          console.log(`   Error details: ${errorData.error?.message || 'Unknown error'}`);
        } catch (e) {
          // Ignore JSON parse errors
        }
        
        return false;
      }
      
    } else {
      console.log(`❌ Chat completion failed: ${chatResponse.statusCode}`);
      console.log(`   Response: ${chatResponse.body}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Verification failed: ${error.message}`);
    return false;
  }
}

if (require.main === module) {
  verifyOpenRouter()
    .then(success => {
      console.log(`\n${success ? '🎉 VERIFICATION PASSED' : '🚨 VERIFICATION FAILED'}`);
      
      if (!success) {
        console.log('\n💡 Troubleshooting steps:');
        console.log('1. Check your OpenRouter account at https://openrouter.ai/');
        console.log('2. Verify your API key is active and has credits');
        console.log('3. Make sure your account can access free models');
        console.log('4. Try regenerating your API key');
      }
      
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error(`Verification error: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { verifyOpenRouter };