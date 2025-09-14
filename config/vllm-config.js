/**
 * vLLM Integration Configuration
 * Provides OpenAI-compatible API interface for vLLM deployed models
 * Supports Llama 3.1 and other models via vLLM service
 */

const axios = require('axios');

// vLLM Configuration
const VLLM_CONFIG = {
    // Railway will expose this on the internal network
    baseURL: process.env.VLLM_BASE_URL || 'http://localhost:8000',
    models: {
        llama: process.env.VLLM_LLAMA_MODEL || 'llama3.1',
        default: process.env.VLLM_DEFAULT_MODEL || 'llama3.1'
    },
    timeout: parseInt(process.env.VLLM_TIMEOUT) || 120000, // 2 minutes
    enabled: process.env.VLLM_ENABLED === 'true' || true,
    maxRetries: 3,
    retryDelay: 1000
};

// vLLM client instance
let vllmClient = null;

/**
 * Initialize vLLM client
 */
function initializeVLLMClient() {
    if (!VLLM_CONFIG.enabled) {
        console.log('🔧 vLLM client not initialized - disabled');
        return null;
    }

    try {
        vllmClient = {
            baseURL: VLLM_CONFIG.baseURL,
            timeout: VLLM_CONFIG.timeout
        };
        console.log('✅ vLLM client initialized successfully');
        console.log(`🔗 vLLM Base URL: ${VLLM_CONFIG.baseURL}`);
        return vllmClient;
    } catch (error) {
        console.error('❌ Failed to initialize vLLM client:', error.message);
        return null;
    }
}

// Initialize client on module load
initializeVLLMClient();

/**
 * Test vLLM connectivity and available models
 */
async function testVLLMConnection() {
    if (!vllmClient) {
        throw new Error('vLLM client not initialized');
    }

    try {
        // Test connection by listing available models
        const response = await axios.get(`${VLLM_CONFIG.baseURL}/v1/models`, {
            timeout: VLLM_CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const availableModels = response.data.data || [];
        console.log('✅ vLLM connection test successful');
        console.log('📋 Available models:', availableModels.map(m => m.id).join(', '));
        
        return {
            success: true,
            models: availableModels,
            baseURL: VLLM_CONFIG.baseURL
        };
    } catch (error) {
        console.error('❌ vLLM connection test failed:', error.message);
        throw error;
    }
}

/**
 * Create chat completion using vLLM
 * Uses OpenAI-compatible API format
 */
async function createChatCompletionWithVLLM(messages, options = {}) {
    if (!vllmClient) {
        throw new Error('vLLM client not initialized');
    }

    const modelName = options.model || VLLM_CONFIG.models.default;
    console.log(`🚀 Creating vLLM chat completion with model: ${modelName}`);

    try {
        const requestBody = {
            model: modelName,
            messages: messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 4000,
            stream: false,
            ...options
        };

        console.log(`📤 vLLM Request: ${JSON.stringify({
            model: requestBody.model,
            messageCount: messages.length,
            temperature: requestBody.temperature,
            max_tokens: requestBody.max_tokens
        })}`);

        const response = await axios.post(
            `${VLLM_CONFIG.baseURL}/v1/chat/completions`,
            requestBody,
            {
                timeout: VLLM_CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        if (!response.data || !response.data.choices || !response.data.choices[0]) {
            throw new Error('Invalid response format from vLLM');
        }

        const message = response.data.choices[0].message;
        console.log(`✅ vLLM response received (${response.data.usage?.total_tokens || 'unknown'} tokens)`);
        
        return message;
    } catch (error) {
        console.error(`❌ vLLM chat completion failed:`, error.message);
        
        // Enhanced error handling
        if (error.response) {
            const status = error.response.status;
            const errorData = error.response.data;
            
            if (status === 404) {
                throw new Error(`vLLM model '${modelName}' not found. Available models may be different.`);
            } else if (status === 422) {
                throw new Error(`vLLM request validation failed: ${errorData.detail || 'Invalid request format'}`);
            } else if (status >= 500) {
                throw new Error(`vLLM server error (${status}): ${errorData.detail || 'Internal server error'}`);
            }
        }
        
        if (error.code === 'ECONNREFUSED') {
            throw new Error('Cannot connect to vLLM service. Is the vLLM server running?');
        }
        
        throw error;
    }
}

/**
 * Get vLLM model information
 */
async function getVLLMModelInfo() {
    if (!vllmClient) {
        return {
            available: false,
            error: 'vLLM client not initialized'
        };
    }

    try {
        const response = await axios.get(`${VLLM_CONFIG.baseURL}/v1/models`, {
            timeout: VLLM_CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return {
            available: true,
            models: response.data.data || [],
            configuredModels: VLLM_CONFIG.models,
            baseURL: VLLM_CONFIG.baseURL
        };
    } catch (error) {
        return {
            available: false,
            error: error.message,
            configuredModels: VLLM_CONFIG.models,
            baseURL: VLLM_CONFIG.baseURL
        };
    }
}

/**
 * Health check for vLLM service
 */
async function checkVLLMHealth() {
    if (!vllmClient) {
        return { healthy: false, error: 'vLLM client not initialized' };
    }

    try {
        const response = await axios.get(`${VLLM_CONFIG.baseURL}/health`, {
            timeout: 10000 // Shorter timeout for health checks
        });
        
        return {
            healthy: true,
            status: response.data.status || 'ok',
            baseURL: VLLM_CONFIG.baseURL
        };
    } catch (error) {
        return {
            healthy: false,
            error: error.message,
            baseURL: VLLM_CONFIG.baseURL
        };
    }
}

module.exports = {
    VLLM_CONFIG,
    vllmClient,
    initializeVLLMClient,
    testVLLMConnection,
    createChatCompletionWithVLLM,
    getVLLMModelInfo,
    checkVLLMHealth
};