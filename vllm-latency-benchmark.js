/**
 * vLLM vs OpenRouter Latency Benchmark
 * Compares response times between local vLLM and cloud OpenRouter models
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Test configuration
const BENCHMARK_CONFIG = {
    baseURL: 'http://localhost:3004',
    testPrompts: [
        {
            name: 'simple_greeting',
            message: 'Hello, how are you?',
            expectedTokens: 50
        },
        {
            name: 'technical_explanation',
            message: 'Explain how machine learning works in simple terms.',
            expectedTokens: 200
        },
        {
            name: 'code_generation',
            message: 'Write a Python function to calculate fibonacci numbers.',
            expectedTokens: 150
        },
        {
            name: 'presentation_task',
            message: 'Create an outline for a presentation about renewable energy.',
            expectedTokens: 300
        },
        {
            name: 'complex_reasoning',
            message: 'Compare the advantages and disadvantages of microservices vs monolithic architecture.',
            expectedTokens: 400
        }
    ],
    iterations: 3, // Number of times to run each test
    timeout: 60000 // 60 seconds timeout
};

// Results storage
let benchmarkResults = {
    timestamp: new Date().toISOString(),
    config: BENCHMARK_CONFIG,
    results: {
        vllm: {},
        openrouter: {}
    },
    summary: {}
};

/**
 * Make a chat request and measure latency
 */
async function makeTimedRequest(message, iteration = 1) {
    const startTime = Date.now();
    
    try {
        const response = await axios.post(`${BENCHMARK_CONFIG.baseURL}/api/chat`, {
            message: message
        }, {
            timeout: BENCHMARK_CONFIG.timeout,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        return {
            success: true,
            latency: latency,
            responseLength: response.data.response ? response.data.response.length : 0,
            model: extractModelFromResponse(response.data),
            timestamp: new Date().toISOString(),
            iteration: iteration
        };
    } catch (error) {
        const endTime = Date.now();
        const latency = endTime - startTime;
        
        return {
            success: false,
            latency: latency,
            error: error.message,
            timestamp: new Date().toISOString(),
            iteration: iteration
        };
    }
}

/**
 * Extract model information from response
 */
function extractModelFromResponse(responseData) {
    // Try to determine which model was used based on response metadata
    if (responseData.model) {
        return responseData.model;
    }
    
    // Check for vLLM indicators
    if (responseData.requestId && responseData.requestId.includes('vllm')) {
        return 'vllm/llama';
    }
    
    // Default to unknown
    return 'unknown';
}

/**
 * Run benchmark for a specific prompt
 */
async function benchmarkPrompt(prompt) {
    console.log(`\n🧪 Testing prompt: ${prompt.name}`);
    console.log(`📝 Message: "${prompt.message}"`);
    
    const results = [];
    
    for (let i = 1; i <= BENCHMARK_CONFIG.iterations; i++) {
        console.log(`   Iteration ${i}/${BENCHMARK_CONFIG.iterations}...`);
        
        const result = await makeTimedRequest(prompt.message, i);
        results.push(result);
        
        if (result.success) {
            console.log(`   ✅ ${result.latency}ms - Model: ${result.model}`);
        } else {
            console.log(`   ❌ ${result.latency}ms - Error: ${result.error}`);
        }
        
        // Wait between requests to avoid overwhelming the server
        if (i < BENCHMARK_CONFIG.iterations) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
    
    return {
        prompt: prompt,
        results: results,
        stats: calculateStats(results)
    };
}

/**
 * Calculate statistics for a set of results
 */
function calculateStats(results) {
    const successfulResults = results.filter(r => r.success);
    const failedResults = results.filter(r => !r.success);
    
    if (successfulResults.length === 0) {
        return {
            successRate: 0,
            avgLatency: null,
            minLatency: null,
            maxLatency: null,
            failures: failedResults.length,
            models: {}
        };
    }
    
    const latencies = successfulResults.map(r => r.latency);
    const models = {};
    
    successfulResults.forEach(r => {
        if (!models[r.model]) {
            models[r.model] = 0;
        }
        models[r.model]++;
    });
    
    return {
        successRate: (successfulResults.length / results.length) * 100,
        avgLatency: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
        minLatency: Math.min(...latencies),
        maxLatency: Math.max(...latencies),
        failures: failedResults.length,
        models: models,
        totalRequests: results.length
    };
}

/**
 * Generate summary report
 */
function generateSummary(allResults) {
    console.log('\n📊 BENCHMARK SUMMARY');
    console.log('=' .repeat(50));
    
    const modelStats = {};
    let totalRequests = 0;
    let totalSuccessful = 0;
    
    allResults.forEach(promptResult => {
        totalRequests += promptResult.results.length;
        totalSuccessful += promptResult.results.filter(r => r.success).length;
        
        // Aggregate by model
        promptResult.results.forEach(result => {
            if (result.success) {
                const model = result.model;
                if (!modelStats[model]) {
                    modelStats[model] = {
                        requests: 0,
                        totalLatency: 0,
                        minLatency: Infinity,
                        maxLatency: 0
                    };
                }
                
                modelStats[model].requests++;
                modelStats[model].totalLatency += result.latency;
                modelStats[model].minLatency = Math.min(modelStats[model].minLatency, result.latency);
                modelStats[model].maxLatency = Math.max(modelStats[model].maxLatency, result.latency);
            }
        });
    });
    
    // Calculate averages
    Object.keys(modelStats).forEach(model => {
        const stats = modelStats[model];
        stats.avgLatency = Math.round(stats.totalLatency / stats.requests);
    });
    
    console.log(`\n🎯 Overall Success Rate: ${((totalSuccessful / totalRequests) * 100).toFixed(1)}%`);
    console.log(`📈 Total Requests: ${totalRequests}`);
    console.log(`✅ Successful: ${totalSuccessful}`);
    console.log(`❌ Failed: ${totalRequests - totalSuccessful}`);
    
    console.log('\n🏆 MODEL PERFORMANCE COMPARISON:');
    console.log('-'.repeat(70));
    console.log('Model'.padEnd(25) + 'Requests'.padEnd(10) + 'Avg (ms)'.padEnd(10) + 'Min (ms)'.padEnd(10) + 'Max (ms)');
    console.log('-'.repeat(70));
    
    // Sort models by average latency
    const sortedModels = Object.entries(modelStats)
        .sort(([,a], [,b]) => a.avgLatency - b.avgLatency);
    
    sortedModels.forEach(([model, stats]) => {
        const modelName = model.length > 24 ? model.substring(0, 21) + '...' : model;
        console.log(
            modelName.padEnd(25) +
            stats.requests.toString().padEnd(10) +
            stats.avgLatency.toString().padEnd(10) +
            stats.minLatency.toString().padEnd(10) +
            stats.maxLatency.toString()
        );
    });
    
    // Identify vLLM vs OpenRouter performance
    const vllmModels = Object.keys(modelStats).filter(m => m.includes('vllm'));
    const openrouterModels = Object.keys(modelStats).filter(m => !m.includes('vllm') && m !== 'unknown');
    
    if (vllmModels.length > 0 && openrouterModels.length > 0) {
        const vllmAvg = vllmModels.reduce((sum, model) => sum + modelStats[model].avgLatency, 0) / vllmModels.length;
        const openrouterAvg = openrouterModels.reduce((sum, model) => sum + modelStats[model].avgLatency, 0) / openrouterModels.length;
        
        console.log('\n🔥 VLLM vs OPENROUTER COMPARISON:');
        console.log(`🏠 vLLM Average Latency: ${Math.round(vllmAvg)}ms`);
        console.log(`☁️  OpenRouter Average Latency: ${Math.round(openrouterAvg)}ms`);
        
        if (vllmAvg < openrouterAvg) {
            const improvement = ((openrouterAvg - vllmAvg) / openrouterAvg * 100).toFixed(1);
            console.log(`🚀 vLLM is ${improvement}% faster than OpenRouter!`);
        } else {
            const slower = ((vllmAvg - openrouterAvg) / openrouterAvg * 100).toFixed(1);
            console.log(`⚠️  vLLM is ${slower}% slower than OpenRouter`);
        }
    }
    
    return {
        totalRequests,
        totalSuccessful,
        successRate: (totalSuccessful / totalRequests) * 100,
        modelStats,
        vllmModels,
        openrouterModels
    };
}

/**
 * Save results to file
 */
function saveResults(results) {
    const filename = `benchmark-results-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filepath = path.join(__dirname, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to: ${filename}`);
    
    return filepath;
}

/**
 * Main benchmark function
 */
async function runBenchmark() {
    console.log('🚀 Starting vLLM vs OpenRouter Latency Benchmark');
    console.log('=' .repeat(60));
    console.log(`📊 Testing ${BENCHMARK_CONFIG.testPrompts.length} prompts with ${BENCHMARK_CONFIG.iterations} iterations each`);
    console.log(`🎯 Target server: ${BENCHMARK_CONFIG.baseURL}`);
    console.log(`⏱️  Timeout: ${BENCHMARK_CONFIG.timeout}ms`);
    
    const allResults = [];
    
    for (const prompt of BENCHMARK_CONFIG.testPrompts) {
        const result = await benchmarkPrompt(prompt);
        allResults.push(result);
        
        console.log(`\n📈 Stats for ${prompt.name}:`);
        console.log(`   Success Rate: ${result.stats.successRate.toFixed(1)}%`);
        if (result.stats.avgLatency) {
            console.log(`   Average Latency: ${result.stats.avgLatency}ms`);
            console.log(`   Range: ${result.stats.minLatency}ms - ${result.stats.maxLatency}ms`);
            console.log(`   Models Used: ${Object.keys(result.stats.models).join(', ')}`);
        }
    }
    
    // Generate final summary
    const summary = generateSummary(allResults);
    
    // Save results
    benchmarkResults.results = allResults;
    benchmarkResults.summary = summary;
    const savedFile = saveResults(benchmarkResults);
    
    console.log('\n✅ Benchmark completed successfully!');
    console.log(`📄 Detailed results: ${savedFile}`);
    
    return benchmarkResults;
}

// Run benchmark if called directly
if (require.main === module) {
    runBenchmark().catch(error => {
        console.error('❌ Benchmark failed:', error.message);
        process.exit(1);
    });
}

module.exports = {
    runBenchmark,
    BENCHMARK_CONFIG
};