const fetch = require('node-fetch');
require('dotenv').config();

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testApiKey() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  log(colors.bold + colors.blue, '🔑 TESTING OPENROUTER API KEY');
  log(colors.blue, '=' .repeat(35));
  
  if (!apiKey) {
    log(colors.red, '❌ No API key found in environment variables');
    return false;
  }
  
  log(colors.cyan, `🔍 API Key: ${apiKey.substring(0, 20)}...${apiKey.substring(apiKey.length - 10)}`);
  
  try {
    // Test with a simple model list request first
    log(colors.yellow, '\n📋 Testing API key with models endpoint...');
    
    const modelsResponse = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3004',
        'X-Title': process.env.SITE_NAME || 'Presto Presentation Generator'
      }
    });
    
    if (modelsResponse.ok) {
      const models = await modelsResponse.json();
      log(colors.green, `✅ API key valid - Found ${models.data?.length || 0} available models`);
      
      // Check if our specific models are available
      const ourModels = [
        'nvidia/llama-3.1-nemotron-ultra-253b-v1:free',
        'deepseek/deepseek-r1-distill-qwen-14b:free',
        'google/gemma-3-12b-it:free',
        'rekaai/reka-flash-3:free'
      ];
      
      log(colors.cyan, '\n🔍 Checking availability of our models:');
      
      const availableModels = models.data?.map(m => m.id) || [];
      
      ourModels.forEach(modelId => {
        const isAvailable = availableModels.includes(modelId);
        const status = isAvailable ? '✅ Available' : '❌ Not Found';
        const color = isAvailable ? colors.green : colors.red;
        log(color, `   ${status}: ${modelId}`);
      });
      
      return true;
    } else {
      const errorText = await modelsResponse.text();
      log(colors.red, `❌ API key test failed: ${modelsResponse.status} ${modelsResponse.statusText}`);
      log(colors.red, `   Error: ${errorText}`);
      return false;
    }
    
  } catch (error) {
    log(colors.red, `❌ API key test failed: ${error.message}`);
    return false;
  }
}

async function testSimpleChat() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  log(colors.bold + colors.yellow, '\n💬 TESTING SIMPLE CHAT REQUEST');
  log(colors.yellow, '=' .repeat(35));
  
  try {
    // Test with a very basic free model
    const testModel = 'microsoft/phi-3-mini-128k-instruct:free';
    log(colors.cyan, `🧪 Testing with: ${testModel}`);
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3004',
        'X-Title': process.env.SITE_NAME || 'Presto Presentation Generator',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: testModel,
        messages: [{
          role: 'user',
          content: 'Say hello in one word.'
        }],
        max_tokens: 10
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      log(colors.green, `✅ Chat test successful!`);
      log(colors.blue, `   Response: "${data.choices[0].message.content.trim()}"`);
      return true;
    } else {
      const errorText = await response.text();
      log(colors.red, `❌ Chat test failed: ${response.status} ${response.statusText}`);
      log(colors.red, `   Error: ${errorText}`);
      return false;
    }
    
  } catch (error) {
    log(colors.red, `❌ Chat test failed: ${error.message}`);
    return false;
  }
}

async function runDiagnostics() {
  log(colors.bold + colors.blue, '\n🔬 OPENROUTER API DIAGNOSTICS');
  log(colors.blue, '=' .repeat(40));
  
  const keyValid = await testApiKey();
  
  if (keyValid) {
    const chatWorking = await testSimpleChat();
    
    if (chatWorking) {
      log(colors.bold + colors.green, '\n🎉 DIAGNOSIS: API is working correctly!');
      log(colors.yellow, '   The issue might be with specific model availability or rate limits.');
    } else {
      log(colors.bold + colors.red, '\n🚨 DIAGNOSIS: API key valid but chat requests failing!');
    }
  } else {
    log(colors.bold + colors.red, '\n🚨 DIAGNOSIS: API key is invalid or expired!');
    log(colors.yellow, '   Please check your OpenRouter account and regenerate the API key.');
  }
  
  log(colors.cyan, '\n💡 Next steps:');
  log(colors.cyan, '   1. Verify your OpenRouter account has credits');
  log(colors.cyan, '   2. Check if the API key has the correct permissions');
  log(colors.cyan, '   3. Ensure the models you\'re trying to use are actually available');
  
  return keyValid;
}

if (require.main === module) {
  runDiagnostics()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      log(colors.red, `\n💥 Diagnostics failed: ${error.message}`);
      process.exit(1);
    });
}

module.exports = { testApiKey, testSimpleChat, runDiagnostics };