import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

async function fetchAvailableModels() {
  console.log('🔍 Fetching available models from OpenRouter...');
  
  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
    defaultHeaders: {
      'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3004',
      'X-Title': process.env.SITE_NAME || 'Presto AI Presentation Generator',
    },
  });

  try {
    // Fetch models using OpenRouter's models endpoint
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3004',
        'X-Title': process.env.SITE_NAME || 'Presto AI Presentation Generator',
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    console.log(`📊 Total models available: ${data.data.length}`);
    
    // Filter for free models
    const freeModels = data.data.filter(model => {
      const pricing = model.pricing;
      return pricing && (
        (pricing.prompt === '0' || pricing.prompt === 0) &&
        (pricing.completion === '0' || pricing.completion === 0)
      );
    });
    
    console.log(`💰 Free models found: ${freeModels.length}`);
    
    // Sort by context length (descending) and filter for reasonable models
    const goodFreeModels = freeModels
      .filter(model => {
        // Filter out models that are likely broken or have very low context
        const contextLength = model.context_length || 0;
        const name = model.id.toLowerCase();
        
        return contextLength >= 4000 && 
               !name.includes('test') && 
               !name.includes('debug') &&
               !name.includes('experimental');
      })
      .sort((a, b) => (b.context_length || 0) - (a.context_length || 0))
      .slice(0, 15); // Top 15 free models
    
    console.log('\n🎯 Top Free Models (by context length):');
    console.log('=' .repeat(80));
    
    goodFreeModels.forEach((model, index) => {
      console.log(`${index + 1}. ${model.id}`);
      console.log(`   Context: ${model.context_length?.toLocaleString() || 'Unknown'}`);
      console.log(`   Description: ${model.description?.substring(0, 100) || 'No description'}...`);
      console.log('');
    });
    
    // Test a few promising models
    console.log('\n🧪 Testing top 5 models...');
    const testModels = goodFreeModels.slice(0, 5);
    
    for (const model of testModels) {
      await testModel(model.id, openai);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
  } catch (error) {
    console.error('❌ Error fetching models:', error.message);
  }
}

async function testModel(modelId, openai) {
  console.log(`\n🧪 Testing ${modelId}...`);
  
  try {
    const startTime = Date.now();
    
    const completion = await openai.chat.completions.create({
      model: modelId,
      messages: [
        {
          role: 'user',
          content: 'Hello! Please respond with a brief greeting.'
        }
      ],
      max_tokens: 50
    });

    const endTime = Date.now();
    const latency = endTime - startTime;

    console.log(`✅ ${modelId} - SUCCESS (${latency}ms)`);
    console.log(`   Response: ${completion.choices[0].message.content.trim()}`);
    
    return { success: true, latency };
  } catch (error) {
    console.log(`❌ ${modelId} - FAILED: ${error.message}`);
    return { success: false, error: error.message };
  }
}

fetchAvailableModels().catch(console.error);