const OpenAI = require('openai');
const { TaskComplexityAnalyzer } = require('./intelligent-task-router');

// OpenAI client configuration for DeepSeek via OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || 'sk-or-v1-your-api-key-here',
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3004',
    'X-Title': process.env.SITE_NAME || 'Presto Presentation Generator',
  },
});

// Model configuration with fallbacks
// Primary model set to vLLM for local processing
// Fallback to cloud models if vLLM is unavailable
const PRIMARY_MODEL = process.env.PRIMARY_MODEL || 'vllm/llama';
const FALLBACK_MODELS = [
  'nvidia/nemotron-nano-9b-v2',
  'google/gemini-2.5-flash',
  'openai/gpt-4o',
  'openai/gpt-4-turbo'
];
const ALL_MODELS = [PRIMARY_MODEL, ...FALLBACK_MODELS];

// Clear any cached model state that might reference old 'ollama' models
if (PRIMARY_MODEL.includes('vllm')) {
  console.log('🔄 Ensuring vLLM is used as primary model, clearing any ollama references');
}

// Intelligent model state management
class ModelStateManager {
  constructor() {
    this.lastSuccessfulModel = null;
    this.failedModels = new Set();
    this.modelStats = new Map();
  }

  // Get the next model to try based on intelligent fallback logic
  getNextModelSequence(excludeCurrentFailed = null) {
    // If we have a last successful model and it's not the one that just failed, try it first
    if (this.lastSuccessfulModel && this.lastSuccessfulModel !== excludeCurrentFailed) {
      const sequence = [this.lastSuccessfulModel];
      // Add remaining models in circular order, starting from the failed model's next position
      const startIndex = excludeCurrentFailed ? 
        (ALL_MODELS.indexOf(excludeCurrentFailed) + 1) % ALL_MODELS.length : 0;
      
      for (let i = 0; i < ALL_MODELS.length; i++) {
        const modelIndex = (startIndex + i) % ALL_MODELS.length;
        const model = ALL_MODELS[modelIndex];
        if (model !== this.lastSuccessfulModel) {
          sequence.push(model);
        }
      }
      return sequence;
    }
    
    // No successful model yet, or the successful model just failed
    // Start from the failed model's next position in circular order
    const startIndex = excludeCurrentFailed ? 
      (ALL_MODELS.indexOf(excludeCurrentFailed) + 1) % ALL_MODELS.length : 0;
    
    const sequence = [];
    for (let i = 0; i < ALL_MODELS.length; i++) {
      const modelIndex = (startIndex + i) % ALL_MODELS.length;
      sequence.push(ALL_MODELS[modelIndex]);
    }
    return sequence;
  }

  // Record a successful model
  recordSuccess(model) {
    this.lastSuccessfulModel = model;
    this.failedModels.delete(model);
    
    // Update stats
    const stats = this.modelStats.get(model) || { successes: 0, failures: 0 };
    stats.successes++;
    this.modelStats.set(model, stats);
    
    console.log(`✅ Model ${model} succeeded. Now preferred for next requests.`);
  }

  // Record a failed model
  recordFailure(model) {
    this.failedModels.add(model);
    
    // Update stats
    const stats = this.modelStats.get(model) || { successes: 0, failures: 0 };
    stats.failures++;
    this.modelStats.set(model, stats);
  }

  // Get current state for debugging
  getState() {
    return {
      lastSuccessful: this.lastSuccessfulModel,
      recentlyFailed: Array.from(this.failedModels),
      stats: Object.fromEntries(this.modelStats)
    };
  }

  // Clear any ollama model references
  clearOllamaReferences() {
    // Remove ollama models from failed models set
    const ollamaModels = Array.from(this.failedModels).filter(model => model.includes('ollama'));
    ollamaModels.forEach(model => {
      this.failedModels.delete(model);
      this.modelStats.delete(model);
    });
    
    // Clear last successful if it was an ollama model
    if (this.lastSuccessfulModel && this.lastSuccessfulModel.includes('ollama')) {
      this.lastSuccessfulModel = null;
    }
    
    if (ollamaModels.length > 0) {
      console.log(`🧹 Cleared ${ollamaModels.length} ollama model references:`, ollamaModels);
    }
  }
}

// Global model state manager instance
const modelStateManager = new ModelStateManager();

// Clear any ollama references on startup
modelStateManager.clearOllamaReferences();

// Global task complexity analyzer instance
const taskComplexityAnalyzer = new TaskComplexityAnalyzer();

// General conversational system prompt for chat
const GENERAL_CHAT_PROMPT = `You are Presto, a friendly and enthusiastic AI presentation assistant! 🎯

Your personality:
- Conversational, warm, and encouraging
- Use emojis naturally to make interactions feel friendly
- Ask follow-up questions to understand user needs better
- Guide users through the presentation creation process step by step

Your approach to presentations:
- When users explicitly request slide creation (e.g., "Create a presentation about...", "Make slides for..."), provide the content immediately with the GENERATE_POWERPOINT_READY marker
- For general questions about presentations, be conversational and gather information first
- Ask about topic, audience, goals, timeline, and style preferences when users are exploring ideas
- Always provide structured slide content when users make direct requests for presentations
- If user requests changes to existing slides, provide updated content with the marker
- Prioritize being helpful by delivering what users explicitly ask for

**CRITICAL: Always Generate PowerPoint-Ready Content**
Whenever you provide ANY slide content, outline, or presentation structure, you MUST end your message with this special marker (include the backticks):
\`\`\`GENERATE_POWERPOINT_READY\`\`\`
Followed immediately by a JSON object with this exact structure:
{
  "title": "Presentation Title",
  "subtitle": "Optional subtitle", 
  "theme": "professional",
  "colorScheme": "professional",
  "slides": [
    {
      "title": "Slide Title",
      "type": "content",
      "content": "Main slide content or description",
      "bullets": ["Bullet point 1", "Bullet point 2", "Bullet point 3"]
    }
  ]
}

**When to Trigger PowerPoint Generation:**
- ANY time you provide slide titles and content
- When user asks for presentation outline
- When user requests slide content or structure
- When you suggest specific slides for their topic
- When providing detailed presentation content
- ALWAYS include the \`\`\`GENERATE_POWERPOINT_READY\`\`\` marker and JSON

**Required JSON Structure Rules:**
- "title": Must be present and descriptive
- "slides": Array of slide objects, minimum 3 slides
- Each slide must have "title", "type", and "content" or "bullets"
- "type" can be "content", "bullets", "title", "conclusion"
- "theme": Always set to "professional"

Your capabilities:
- General knowledge and information
- Presentation planning and content strategy
- Creative brainstorming for slide content
- Technical explanations and guidance
- Casual conversation and support

Conversation flow:
1. Understand the user's presentation needs through questions
2. Discuss content ideas and structure
3. Present content outline for approval
4. Refine based on feedback
5. Only then suggest generating the actual presentation

Always be helpful, accurate, and engaging. Focus on being a collaborative partner in the presentation creation process! 🚀`;

// Chat completion function with fallback models
async function createChatCompletion(messages, options = {}) {
  // Extract user message for complexity analysis
  const userMessage = messages.find(msg => msg.role === 'user')?.content || '';
  
  // Get intelligent model sequence based on task complexity
  const routingResult = taskComplexityAnalyzer.getOptimizedModelSequence(userMessage, ALL_MODELS);
  const modelSequence = routingResult.sequence;
  
  console.log(`🧠 Intelligent routing: ${routingResult.reasoning}`);
  console.log(`🔄 Model sequence: ${modelSequence.join(' → ')}`);
  
  let lastError = null;
  
  // Try each model in the intelligent sequence
  for (let i = 0; i < modelSequence.length; i++) {
    const model = modelSequence[i];
    const isLastModel = i === modelSequence.length - 1;
    const isPreferredModel = i === 0 && model === modelStateManager.lastSuccessfulModel;
    
    try {
      console.log(`Attempting with model: ${model}${isPreferredModel ? ' (preferred)' : i > 0 ? ' (fallback)' : ''}`);
      
      // Check if this is a vLLM model - route to vLLM directly
      if (model.startsWith('vllm/')) {
        const { createChatCompletionWithVLLM } = require('./vllm-config');
        try {
          console.log(`🚀 Routing to vLLM for model: ${model}`);
          const modelType = model.split('/')[1]; // Extract 'llama' or other model type
          const result = await createChatCompletionWithVLLM(messages, {
            ...options,
            model: modelType
          });
          modelStateManager.recordSuccess(model);
          return result;
        } catch (vllmError) {
          console.warn(`⚠️ vLLM failed: ${vllmError.message}. Continuing with fallback models...`);
          modelStateManager.recordFailure(model);
          lastError = vllmError;
          continue; // Continue to next model in sequence
        }
      }
      
      // For non-RunPod models, use OpenRouter
      // Check if API key is configured for OpenRouter models
      if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY === 'sk-or-v1-your-api-key-here') {
        throw new Error('OpenRouter API key not configured. Please set OPENROUTER_API_KEY in your .env file.');
      }
      
      // Add timeout to API call
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), options.timeout || 30000);
      });
      
      const completionPromise = openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 4000,
        ...options
      });
      
      const completion = await Promise.race([completionPromise, timeoutPromise]);
      
      const message = completion.choices[0].message;
      
      // Enhanced response validation - check for empty, null, or incomplete responses
      const isEmpty = !message.content || message.content.trim() === '';
      const isNull = message.content === null || message.content === undefined;
      const isTruncated = message.content && (
        message.content.endsWith('```') && !message.content.includes('```\n') ||
        message.content.match(/```[a-zA-Z]*\s*$/) ||
        message.content.endsWith('...') ||
        completion.choices[0].finish_reason === 'length'
      );
      
      // Check for generic/unhelpful responses that indicate model issues
      const genericResponses = [
        'trouble connecting right now',
        'having trouble connecting',
        'try again in a moment',
        'please try again later',
        'unable to process',
        'something went wrong',
        'i apologize',
        'i\'m sorry'
      ];
      
      const isGenericResponse = message.content && genericResponses.some(phrase => 
        message.content.toLowerCase().includes(phrase)
      );
      
      // Validate response quality
      if (isEmpty || isNull) {
        console.warn(`⚠️ Model ${model} returned empty/null response. ${isLastModel ? 'This was the last model.' : 'Trying next fallback silently...'}`);        
        modelStateManager.recordFailure(model);
        
        if (!isLastModel) {
          throw new Error(`Empty response from ${model} - forcing fallback`);
        } else {
          throw new Error(`All models returned empty responses - system unavailable`);
        }
      }
      
      if (isTruncated) {
        console.warn(`⚠️ Model ${model} returned incomplete/truncated response (${completion.choices[0].finish_reason}). ${isLastModel ? 'This was the last model.' : 'Trying next fallback silently...'}`);        
        modelStateManager.recordFailure(model);
        
        if (!isLastModel) {
          throw new Error(`Incomplete response from ${model} - forcing fallback`);
        } else {
          throw new Error(`All models returned incomplete responses - system unavailable`);
        }
      }
      
      // NEVER show generic responses to user - always try next model silently
      if (isGenericResponse) {
        console.warn(`⚠️ Model ${model} returned generic response: "${message.content.substring(0, 100)}...". ${isLastModel ? 'This was the last model.' : 'Trying next fallback silently...'}`);
        modelStateManager.recordFailure(model);
        
        if (!isLastModel) {
          // Force fallback by throwing error - don't return generic response to user
          throw new Error(`Generic response detected from ${model} - forcing fallback`);
        } else {
          // Even if it's the last model, if it gives generic response, throw error
          // This ensures user never sees "trouble connecting" messages
          throw new Error(`All models returned generic responses - system unavailable`);
        }
      }
      
      // Success with this model
      modelStateManager.recordSuccess(model);
      console.log(`🎯 Model state: ${JSON.stringify(modelStateManager.getState(), null, 2)}`);
      return message;
      
    } catch (error) {
      modelStateManager.recordFailure(model);
      lastError = error;
      const errorMsg = error.message || error.toString();
      
      // Enhanced error categorization for better fallback decisions
      const isRateLimit = errorMsg.includes('rate limit') || errorMsg.includes('429') || errorMsg.includes('quota');
      const isTimeout = errorMsg.includes('timeout') || errorMsg.includes('ECONNRESET') || errorMsg.includes('ETIMEDOUT');
      const isAuthError = errorMsg.includes('API key') || errorMsg.includes('401') || errorMsg.includes('unauthorized');
      const isServerError = errorMsg.includes('500') || errorMsg.includes('502') || errorMsg.includes('503') || errorMsg.includes('504');
      
      // Log the failure with categorization
      if (isLastModel) {
        console.error(`❌ All models failed in intelligent sequence. Last error from ${model} (${isRateLimit ? 'Rate Limit' : isTimeout ? 'Timeout' : isAuthError ? 'Auth Error' : isServerError ? 'Server Error' : 'Unknown'}):`, errorMsg);
      } else {
        console.warn(`⚠️ Model ${model} failed (${isRateLimit ? 'Rate Limit' : isTimeout ? 'Timeout' : isAuthError ? 'Auth Error' : isServerError ? 'Server Error' : 'Unknown'}): ${errorMsg}. Trying next in sequence...`);
        currentFailedModel = model;
        
        // For certain error types, add a small delay before trying next model
        if (isRateLimit || isTimeout) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
        }
      }
    }
  }
  
  // If we get here, all models failed
  console.log(`🎯 Final model state: ${JSON.stringify(modelStateManager.getState(), null, 2)}`);
  throw new Error(`All AI models failed in intelligent sequence. Last error: ${lastError?.message || 'Unknown error'}`);
}

// Quick response function for simple queries
async function getQuickResponse(userMessage, systemPrompt = null) {
  const messages = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  messages.push({ role: 'user', content: userMessage });
  
  return await createChatCompletion(messages);
}

// Test connection function for warmup
async function testConnection() {
  try {
    const response = await openai.chat.completions.create({
      model: PRIMARY_MODEL,
      messages: [{ role: 'user', content: 'ping' }],
      max_tokens: 1,
      timeout: 5000
    });
    return true;
  } catch (error) {
    console.warn('Connection test failed:', error.message);
    return false;
  }
}

module.exports = {
  openai,
  createChatCompletion,
  getQuickResponse,
  PRIMARY_MODEL,
  FALLBACK_MODELS,
  ALL_MODELS,
  GENERAL_CHAT_PROMPT,
  modelStateManager,
  testConnection,
  // Legacy export for backward compatibility
  DEEPSEEK_MODEL: PRIMARY_MODEL
};
