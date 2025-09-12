/**
 * Ollama Local LLM Integration Configuration
 * Replaces RunPod with CPU-optimized local LLM hosting on Railway
 * Supports Llama 3.1 and Mistral models via Ollama
 */

const axios = require('axios');

// Ollama Configuration
const OLLAMA_CONFIG = {
    // Railway will expose this on the internal network
    baseURL: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
    models: {
        llama: process.env.OLLAMA_LLAMA_MODEL || 'llama3.1:8b',
        mistral: process.env.OLLAMA_MISTRAL_MODEL || 'mistral:7b'
    },
    timeout: parseInt(process.env.OLLAMA_TIMEOUT) || 120000, // 2 minutes
    enabled: process.env.OLLAMA_ENABLED === 'true' || true,
    maxRetries: 3,
    retryDelay: 1000
};

// Ollama client instance
let ollamaClient = null;

/**
 * Initialize Ollama client
 */
function initializeOllamaClient() {
    if (!OLLAMA_CONFIG.enabled) {
        console.log('🔧 Ollama client not initialized - disabled');
        return null;
    }

    try {
        ollamaClient = {
            baseURL: OLLAMA_CONFIG.baseURL,
            timeout: OLLAMA_CONFIG.timeout
        };
        console.log('✅ Ollama client initialized successfully');
        return ollamaClient;
    } catch (error) {
        console.error('❌ Failed to initialize Ollama client:', error.message);
        return null;
    }
}

// Initialize client on module load
initializeOllamaClient();

/**
 * Test Ollama connectivity and available models
 */
async function testOllamaConnection() {
    if (!ollamaClient) {
        throw new Error('Ollama client not initialized');
    }

    try {
        // Test connection by listing available models
        const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
            timeout: OLLAMA_CONFIG.timeout
        });

        const availableModels = response.data.models || [];
        console.log('✅ Ollama connection test successful');
        console.log('📋 Available models:', availableModels.map(m => m.name).join(', '));
        
        return {
            success: true,
            models: availableModels,
            baseURL: OLLAMA_CONFIG.baseURL
        };
    } catch (error) {
        console.error('❌ Ollama connection test failed:', error.message);
        throw error;
    }
}

/**
 * Create chat completion with Ollama
 */
async function createChatCompletionWithOllama(messages, options = {}) {
    const {
        model = 'llama', // 'llama' or 'mistral'
        temperature = 0.7,
        maxTokens = 2000,
        stream = false
    } = options;

    if (!ollamaClient || !OLLAMA_CONFIG.enabled) {
        throw new Error('Ollama not available');
    }

    const selectedModel = OLLAMA_CONFIG.models[model] || OLLAMA_CONFIG.models.llama;
    console.log('🚀 Attempting with Ollama model:', selectedModel);

    // Convert OpenAI format messages to Ollama format
    const prompt = messages.map(msg => {
        if (msg.role === 'system') {
            return `System: ${msg.content}`;
        } else if (msg.role === 'user') {
            return `Human: ${msg.content}`;
        } else if (msg.role === 'assistant') {
            return `Assistant: ${msg.content}`;
        }
        return msg.content;
    }).join('\n\n');

    const requestData = {
        model: selectedModel,
        prompt: prompt + '\n\nAssistant:',
        stream: stream,
        options: {
            temperature: temperature,
            num_predict: maxTokens
        }
    };

    let retries = 0;
    while (retries < OLLAMA_CONFIG.maxRetries) {
        try {
            const response = await axios.post(
                `${OLLAMA_CONFIG.baseURL}/api/generate`,
                requestData,
                {
                    timeout: OLLAMA_CONFIG.timeout,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.data || !response.data.response) {
                throw new Error('Empty response from Ollama');
            }

            console.log('✅ Ollama model succeeded');
            
            // Convert Ollama response to OpenAI format
            return {
                choices: [{
                    message: {
                        role: 'assistant',
                        content: response.data.response.trim()
                    },
                    finish_reason: response.data.done ? 'stop' : 'length'
                }],
                usage: {
                    prompt_tokens: response.data.prompt_eval_count || 0,
                    completion_tokens: response.data.eval_count || 0,
                    total_tokens: (response.data.prompt_eval_count || 0) + (response.data.eval_count || 0)
                },
                model: selectedModel
            };
        } catch (error) {
            retries++;
            console.warn(`⚠️ Ollama attempt ${retries} failed: ${error.message}`);
            
            if (retries >= OLLAMA_CONFIG.maxRetries) {
                throw error;
            }
            
            // Wait before retrying
            await new Promise(resolve => setTimeout(resolve, OLLAMA_CONFIG.retryDelay * retries));
        }
    }
}

/**
 * Get Ollama model information
 */
async function getOllamaModelInfo() {
    if (!ollamaClient) {
        return {
            available: false,
            error: 'Ollama client not initialized'
        };
    }

    try {
        const response = await axios.get(`${OLLAMA_CONFIG.baseURL}/api/tags`, {
            timeout: OLLAMA_CONFIG.timeout
        });

        return {
            available: true,
            models: response.data.models || [],
            configuredModels: OLLAMA_CONFIG.models,
            baseURL: OLLAMA_CONFIG.baseURL
        };
    } catch (error) {
        return {
            available: false,
            error: error.message,
            configuredModels: OLLAMA_CONFIG.models,
            baseURL: OLLAMA_CONFIG.baseURL
        };
    }
}

/**
 * Quick response function with Ollama support
 */
async function getQuickResponseWithOllama(userMessage, systemPrompt = null, options = {}) {
    const messages = [];
    
    if (systemPrompt) {
        messages.push({ role: 'system', content: systemPrompt });
    }
    
    messages.push({ role: 'user', content: userMessage });
    
    return await createChatCompletionWithOllama(messages, options);
}

/**
 * Pull/download a model if not available
 */
async function pullOllamaModel(modelName) {
    if (!ollamaClient) {
        throw new Error('Ollama client not initialized');
    }

    console.log(`📥 Pulling Ollama model: ${modelName}`);
    
    try {
        const response = await axios.post(
            `${OLLAMA_CONFIG.baseURL}/api/pull`,
            { name: modelName },
            {
                timeout: 600000, // 10 minutes for model download
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log(`✅ Successfully pulled model: ${modelName}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to pull model ${modelName}:`, error.message);
        throw error;
    }
}

module.exports = {
    OLLAMA_CONFIG,
    ollamaClient,
    initializeOllamaClient,
    testOllamaConnection,
    createChatCompletionWithOllama,
    getOllamaModelInfo,
    getQuickResponseWithOllama,
    pullOllamaModel
};