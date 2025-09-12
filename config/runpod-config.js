/**
 * RunPod vLLM Integration Configuration
 * Extends the existing OpenAI configuration to include RunPod as a local model option
 */

const OpenAI = require('openai');
// Note: modelStateManager will be passed as parameter to avoid circular dependency

// RunPod Configuration
const RUNPOD_CONFIG = {
    // Update this with your actual RunPod external URL
    // Format: https://[your-pod-id]-8000.proxy.runpod.net
    baseURL: process.env.RUNPOD_API_URL || 'YOUR_RUNPOD_URL_HERE',
    model: 'neuralmagic/Meta-Llama-3.1-8B-Instruct-FP8',
    timeout: 30000, // 30 seconds
    enabled: process.env.RUNPOD_ENABLED === 'true' || false
};

// Create RunPod OpenAI client (vLLM is OpenAI-compatible)
let runpodClient = null;

function initializeRunPodClient() {
    if (!RUNPOD_CONFIG.enabled || RUNPOD_CONFIG.baseURL === 'YOUR_RUNPOD_URL_HERE') {
        console.log('🔧 RunPod client not initialized - disabled or URL not configured');
        return null;
    }
    
    try {
        runpodClient = new OpenAI({
            baseURL: `${RUNPOD_CONFIG.baseURL}/v1`,
            apiKey: 'not-needed-for-local-vllm', // vLLM doesn't require API key by default
            timeout: RUNPOD_CONFIG.timeout
        });
        console.log('✅ RunPod client initialized successfully');
        return runpodClient;
    } catch (error) {
        console.error('❌ Failed to initialize RunPod client:', error.message);
        return null;
    }
}

// Initialize the client
initializeRunPodClient();

/**
 * Test RunPod connectivity
 */
async function testRunPodConnection() {
    if (!runpodClient) {
        throw new Error('RunPod client not initialized');
    }
    
    try {
        // Test with a simple completion
        const response = await runpodClient.chat.completions.create({
            model: RUNPOD_CONFIG.model,
            messages: [
                {
                    role: 'user',
                    content: 'Hello! Please respond with just "RunPod connection successful" to confirm you are working.'
                }
            ],
            max_tokens: 50,
            temperature: 0.1
        });
        
        const content = response.choices[0].message.content;
        console.log('✅ RunPod connection test successful:', content);
        return { success: true, response: content };
    } catch (error) {
        console.error('❌ RunPod connection test failed:', error.message);
        return { success: false, error: error.message };
    }
}

/**
 * Create chat completion with RunPod fallback support
 * This function can be used as a drop-in replacement for the main createChatCompletion
 */
async function createChatCompletionWithRunPod(messages, options = {}, modelStateManager = null) {
    const { 
        useRunPodFirst = false, 
        runPodOnly = false,
        includeRunPodInFallback = true,
        ...otherOptions 
    } = options;
    
    // If RunPod is not available, fall back to regular models
    if (!runpodClient || !RUNPOD_CONFIG.enabled) {
        if (runPodOnly) {
            throw new Error('RunPod requested but not available');
        }
        // Cannot fall back to regular models due to circular dependency
        throw new Error('RunPod not available and fallback not possible from this context');
    }
    
    let lastError = null;
    
    // Try RunPod first if requested
    if (useRunPodFirst || runPodOnly) {
        try {
            console.log('🚀 Attempting with RunPod model:', RUNPOD_CONFIG.model);
            
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('RunPod request timeout')), RUNPOD_CONFIG.timeout);
            });
            
            const completionPromise = runpodClient.chat.completions.create({
                model: RUNPOD_CONFIG.model,
                messages: messages,
                temperature: otherOptions.temperature || 0.7,
                max_tokens: otherOptions.max_tokens || 4000,
                ...otherOptions
            });
            
            const completion = await Promise.race([completionPromise, timeoutPromise]);
            const message = completion.choices[0].message;
            
            // Validate response
            if (!message.content || message.content.trim() === '') {
                throw new Error('Empty response from RunPod');
            }
            
            console.log('✅ RunPod model succeeded');
            if (modelStateManager) {
                modelStateManager.recordSuccess(`runpod:${RUNPOD_CONFIG.model}`);
            }
            return message;
            
        } catch (error) {
            lastError = error;
            console.warn(`⚠️ RunPod model failed: ${error.message}`);
            if (modelStateManager) {
                modelStateManager.recordFailure(`runpod:${RUNPOD_CONFIG.model}`);
            }
            
            if (runPodOnly) {
                throw error;
            }
        }
    }
    
    // If RunPod failed or wasn't tried first, fall back to regular models
    if (!runPodOnly) {
        try {
            const { createChatCompletion } = require('./openai-config');
            return await createChatCompletion(messages, otherOptions);
        } catch (error) {
            // If regular models also failed and we haven't tried RunPod yet, try it as last resort
            if (!useRunPodFirst && includeRunPodInFallback && runpodClient) {
                try {
                    console.log('🔄 Trying RunPod as final fallback...');
                    
                    const completion = await runpodClient.chat.completions.create({
                        model: RUNPOD_CONFIG.model,
                        messages: messages,
                        temperature: otherOptions.temperature || 0.7,
                        max_tokens: otherOptions.max_tokens || 4000,
                        ...otherOptions
                    });
                    
                    const message = completion.choices[0].message;
                    if (!message.content || message.content.trim() === '') {
                        throw new Error('Empty response from RunPod fallback');
                    }
                    
                    console.log('✅ RunPod fallback succeeded');
                    if (modelStateManager) {
                        modelStateManager.recordSuccess(`runpod:${RUNPOD_CONFIG.model}`);
                    }
                    return message;
                    
                } catch (runpodError) {
                    console.error('❌ RunPod fallback also failed:', runpodError.message);
                    if (modelStateManager) {
                        modelStateManager.recordFailure(`runpod:${RUNPOD_CONFIG.model}`);
                    }
                }
            }
            
            // All options exhausted
            throw error;
        }
    }
    
    // This should not be reached, but just in case
    throw lastError || new Error('All models failed including RunPod');
}

/**
 * Get RunPod model information
 */
async function getRunPodModelInfo() {
    if (!runpodClient) {
        return { available: false, reason: 'Client not initialized' };
    }
    
    try {
        // Try to get model list (if supported by vLLM)
        const models = await runpodClient.models.list();
        return {
            available: true,
            models: models.data,
            currentModel: RUNPOD_CONFIG.model,
            baseURL: RUNPOD_CONFIG.baseURL
        };
    } catch (error) {
        return {
            available: false,
            reason: error.message,
            currentModel: RUNPOD_CONFIG.model,
            baseURL: RUNPOD_CONFIG.baseURL
        };
    }
}

/**
 * Quick response function with RunPod support
 */
async function getQuickResponseWithRunPod(userMessage, systemPrompt = null, options = {}) {
    const messages = [];
    
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: userMessage });
    
    return await createChatCompletionWithRunPod(messages, options);
}

module.exports = {
    RUNPOD_CONFIG,
    runpodClient,
    initializeRunPodClient,
    testRunPodConnection,
    createChatCompletionWithRunPod,
    getRunPodModelInfo,
    getQuickResponseWithRunPod
};