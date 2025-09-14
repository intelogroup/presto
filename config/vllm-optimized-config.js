/**
 * Optimized vLLM Configuration for Railway Deployment
 * Based on vLLM performance tuning best practices for Llama 3.1
 */

const axios = require('axios');

// Optimized vLLM configuration for Railway
const OPTIMIZED_VLLM_CONFIG = {
    baseURL: process.env.VLLM_BASE_URL || 'https://your-railway-vllm-service.railway.app',
    
    // Model configuration
    models: {
        'llama3.1': {
            name: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
            contextLength: 8192,
            maxTokens: 4096
        }
    },
    
    // Performance optimization settings
    performance: {
        // Chunked prefill optimization - disabled for better performance on most cases
        enableChunkedPrefill: false,
        
        // Batch processing optimization
        maxNumBatchedTokens: 16384, // Higher value for better throughput
        maxNumSeqs: 512, // Increased for better resource utilization
        
        // Memory optimization
        gpuMemoryUtilization: 0.95, // Maximize GPU memory usage
        
        // KV Cache optimization
        kvCacheDataType: 'auto', // Let vLLM choose optimal data type
        
        // Multi-step scheduling for better GPU utilization
        numSchedulerSteps: 12, // Optimal range 10-15
        
        // Graph capture optimization
        maxSeqLenToCapture: 16384,
        
        // Disable prefix caching if low hit rate expected
        enablePrefixCaching: false
    },
    
    // Railway-specific optimizations
    railway: {
        // Resource allocation
        memory: '8Gi',
        cpu: '4000m',
        
        // Environment variables for optimization
        envVars: {
            // Disable Ray for single-node deployment
            VLLM_WORKER_USE_RAY: 'false',
            
            // Use FlashAttention backend
            VLLM_ATTENTION_BACKEND: 'FLASHINFER',
            
            // Tensor parallelism (1 for single GPU on Railway)
            VLLM_TENSOR_PARALLEL_SIZE: '1',
            
            // Disable NUMA balancing for better performance
            VLLM_DISABLE_NUMA_BALANCING: 'true',
            
            // NCCL optimization
            NCCL_MIN_NCHANNELS: '4'
        }
    },
    
    // Connection settings
    timeout: 120000, // 2 minutes for model loading
    retries: 3,
    enabled: true
};

/**
 * Generate optimized vLLM startup command for Railway
 */
function generateOptimizedStartupCommand() {
    const config = OPTIMIZED_VLLM_CONFIG;
    
    return [
        'python -m vllm.entrypoints.openai.api_server',
        `--model ${config.models['llama3.1'].name}`,
        `--host ${config.railway.envVars.HOST || '0.0.0.0'}`,
        `--port ${config.railway.envVars.PORT || '8000'}`,
        `--max-num-batched-tokens ${config.performance.maxNumBatchedTokens}`,
        `--max-num-seqs ${config.performance.maxNumSeqs}`,
        `--gpu-memory-utilization ${config.performance.gpuMemoryUtilization}`,
        `--kv-cache-dtype ${config.performance.kvCacheDataType}`,
        `--num-scheduler-steps ${config.performance.numSchedulerSteps}`,
        `--max-seq-len-to-capture ${config.performance.maxSeqLenToCapture}`,
        `--tensor-parallel-size ${config.railway.envVars.VLLM_TENSOR_PARALLEL_SIZE}`,
        config.performance.enableChunkedPrefill ? '--enable-chunked-prefill' : '',
        config.performance.enablePrefixCaching ? '--enable-prefix-caching' : '',
        '--disable-log-requests', // Reduce logging overhead
        '--served-model-name llama3.1'
    ].filter(Boolean).join(' ');
}

/**
 * Create optimized chat completion with performance monitoring
 */
async function createOptimizedChatCompletion(messages, options = {}) {
    const startTime = Date.now();
    
    try {
        const requestBody = {
            model: 'llama3.1',
            messages: messages,
            max_tokens: options.maxTokens || OPTIMIZED_VLLM_CONFIG.models['llama3.1'].maxTokens,
            temperature: options.temperature || 0.7,
            top_p: options.topP || 0.9,
            stream: options.stream || false,
            // Performance optimizations
            ignore_eos: false,
            skip_special_tokens: true
        };

        const response = await axios.post(
            `${OPTIMIZED_VLLM_CONFIG.baseURL}/v1/chat/completions`,
            requestBody,
            {
                timeout: OPTIMIZED_VLLM_CONFIG.timeout,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        const endTime = Date.now();
        const latency = endTime - startTime;
        
        // Add performance metrics to response
        if (response.data) {
            response.data.performance = {
                latency: latency,
                tokensPerSecond: response.data.usage ? 
                    (response.data.usage.completion_tokens / (latency / 1000)) : null,
                timestamp: new Date().toISOString()
            };
        }

        return response.data;
    } catch (error) {
        console.error('Optimized vLLM request failed:', error.message);
        throw error;
    }
}

/**
 * Performance monitoring and health check
 */
async function checkOptimizedVLLMHealth() {
    try {
        const startTime = Date.now();
        
        const response = await axios.get(`${OPTIMIZED_VLLM_CONFIG.baseURL}/health`, {
            timeout: 10000
        });
        
        const latency = Date.now() - startTime;
        
        return {
            healthy: true,
            latency: latency,
            status: response.data.status || 'ok',
            optimizations: {
                chunkedPrefill: OPTIMIZED_VLLM_CONFIG.performance.enableChunkedPrefill,
                maxBatchedTokens: OPTIMIZED_VLLM_CONFIG.performance.maxNumBatchedTokens,
                schedulerSteps: OPTIMIZED_VLLM_CONFIG.performance.numSchedulerSteps,
                memoryUtilization: OPTIMIZED_VLLM_CONFIG.performance.gpuMemoryUtilization
            }
        };
    } catch (error) {
        return {
            healthy: false,
            error: error.message,
            latency: null
        };
    }
}

module.exports = {
    OPTIMIZED_VLLM_CONFIG,
    generateOptimizedStartupCommand,
    createOptimizedChatCompletion,
    checkOptimizedVLLMHealth
};