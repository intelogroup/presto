const axios = require('axios');
require('dotenv').config();

class LatencyBenchmark {
    constructor() {
        this.baseURL = 'http://localhost:3004';
        this.testMessages = [
            'Create a simple 3-slide presentation about AI',
            'Generate a business presentation about renewable energy',
            'Make a presentation about machine learning basics',
            'Create slides about digital transformation',
            'Generate a presentation about data science'
        ];
        this.results = {
            openrouter: [],
            vllm: []
        };
    }

    async measureLatency(model, message, iteration) {
        const startTime = Date.now();
        
        try {
            const response = await axios.post(`${this.baseURL}/api/chat`, {
                message: message,
                model: model
            }, {
                timeout: 60000,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const endTime = Date.now();
            const latency = endTime - startTime;
            
            return {
                success: true,
                latency: latency,
                status: response.status,
                responseLength: JSON.stringify(response.data).length,
                iteration: iteration,
                message: message.substring(0, 50) + '...'
            };
            
        } catch (error) {
            const endTime = Date.now();
            const latency = endTime - startTime;
            
            return {
                success: false,
                latency: latency,
                error: error.message,
                iteration: iteration,
                message: message.substring(0, 50) + '...'
            };
        }
    }

    async testModel(modelName, iterations = 5) {
        console.log(`\n🚀 Testing ${modelName.toUpperCase()} Model Latency...`);
        console.log('=' .repeat(60));
        
        const results = [];
        
        for (let i = 0; i < iterations; i++) {
            const messageIndex = i % this.testMessages.length;
            const testMessage = this.testMessages[messageIndex];
            
            console.log(`📤 Test ${i + 1}/${iterations}: ${testMessage.substring(0, 40)}...`);
            
            const result = await this.measureLatency(modelName, testMessage, i + 1);
            results.push(result);
            
            if (result.success) {
                console.log(`✅ Response: ${result.latency}ms (${result.responseLength} chars)`);
            } else {
                console.log(`❌ Failed: ${result.latency}ms - ${result.error}`);
            }
            
            // Wait between requests to avoid overwhelming the server
            if (i < iterations - 1) {
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        return results;
    }

    calculateStats(results) {
        const successfulResults = results.filter(r => r.success);
        const failedResults = results.filter(r => !r.success);
        
        if (successfulResults.length === 0) {
            return {
                count: results.length,
                successRate: 0,
                avgLatency: 0,
                minLatency: 0,
                maxLatency: 0,
                medianLatency: 0,
                failureCount: failedResults.length
            };
        }
        
        const latencies = successfulResults.map(r => r.latency).sort((a, b) => a - b);
        const sum = latencies.reduce((a, b) => a + b, 0);
        
        return {
            count: results.length,
            successRate: (successfulResults.length / results.length) * 100,
            avgLatency: Math.round(sum / latencies.length),
            minLatency: Math.min(...latencies),
            maxLatency: Math.max(...latencies),
            medianLatency: latencies[Math.floor(latencies.length / 2)],
            failureCount: failedResults.length,
            successfulRequests: successfulResults.length
        };
    }

    displayResults(modelName, stats) {
        console.log(`\n📊 ${modelName.toUpperCase()} RESULTS:`);
        console.log('-' .repeat(40));
        console.log(`Total Requests: ${stats.count}`);
        console.log(`Success Rate: ${stats.successRate.toFixed(1)}%`);
        console.log(`Successful Requests: ${stats.successfulRequests}`);
        console.log(`Failed Requests: ${stats.failureCount}`);
        
        if (stats.successfulRequests > 0) {
            console.log(`Average Latency: ${stats.avgLatency}ms`);
            console.log(`Minimum Latency: ${stats.minLatency}ms`);
            console.log(`Maximum Latency: ${stats.maxLatency}ms`);
            console.log(`Median Latency: ${stats.medianLatency}ms`);
        }
    }

    compareModels(openrouterStats, vllmStats) {
        console.log('\n🏆 PERFORMANCE COMPARISON:');
        console.log('=' .repeat(60));
        
        // Determine winner based on multiple factors
        let openrouterScore = 0;
        let vllmScore = 0;
        
        // Success rate comparison (40% weight)
        if (openrouterStats.successRate > vllmStats.successRate) {
            openrouterScore += 40;
            console.log(`✅ Success Rate Winner: OpenRouter (${openrouterStats.successRate.toFixed(1)}% vs ${vllmStats.successRate.toFixed(1)}%)`);
        } else if (vllmStats.successRate > openrouterStats.successRate) {
            vllmScore += 40;
            console.log(`✅ Success Rate Winner: vLLM (${vllmStats.successRate.toFixed(1)}% vs ${openrouterStats.successRate.toFixed(1)}%)`);
        } else {
            console.log(`🤝 Success Rate Tie: Both at ${openrouterStats.successRate.toFixed(1)}%`);
        }
        
        // Average latency comparison (35% weight)
        if (openrouterStats.avgLatency < vllmStats.avgLatency && openrouterStats.successfulRequests > 0) {
            openrouterScore += 35;
            console.log(`⚡ Speed Winner: OpenRouter (${openrouterStats.avgLatency}ms vs ${vllmStats.avgLatency}ms)`);
        } else if (vllmStats.avgLatency < openrouterStats.avgLatency && vllmStats.successfulRequests > 0) {
            vllmScore += 35;
            console.log(`⚡ Speed Winner: vLLM (${vllmStats.avgLatency}ms vs ${openrouterStats.avgLatency}ms)`);
        }
        
        // Consistency (min latency difference) (25% weight)
        const openrouterRange = openrouterStats.maxLatency - openrouterStats.minLatency;
        const vllmRange = vllmStats.maxLatency - vllmStats.minLatency;
        
        if (openrouterRange < vllmRange && openrouterStats.successfulRequests > 0) {
            openrouterScore += 25;
            console.log(`📈 Consistency Winner: OpenRouter (${openrouterRange}ms range vs ${vllmRange}ms range)`);
        } else if (vllmRange < openrouterRange && vllmStats.successfulRequests > 0) {
            vllmScore += 25;
            console.log(`📈 Consistency Winner: vLLM (${vllmRange}ms range vs ${openrouterRange}ms range)`);
        }
        
        console.log('\n🎯 FINAL RECOMMENDATION:');
        console.log('-' .repeat(40));
        
        if (openrouterScore > vllmScore) {
            console.log(`🥇 PRIMARY MODEL: OpenRouter (Score: ${openrouterScore}/100)`);
            console.log(`🥈 FALLBACK MODEL: vLLM (Score: ${vllmScore}/100)`);
            return 'openrouter';
        } else if (vllmScore > openrouterScore) {
            console.log(`🥇 PRIMARY MODEL: vLLM (Score: ${vllmScore}/100)`);
            console.log(`🥈 FALLBACK MODEL: OpenRouter (Score: ${openrouterScore}/100)`);
            return 'vllm';
        } else {
            console.log(`🤝 TIE: Both models performed equally (${openrouterScore}/100)`);
            console.log(`💡 Recommendation: Use OpenRouter as primary (external reliability)`);
            return 'openrouter';
        }
    }

    async runBenchmark(iterations = 5) {
        console.log('🧪 LATENCY BENCHMARK TEST');
        console.log('=' .repeat(60));
        console.log(`Testing ${iterations} requests per model`);
        console.log(`Backend URL: ${this.baseURL}`);
        console.log(`Test Messages: ${this.testMessages.length} different prompts`);
        
        try {
            // Test OpenRouter
            const openrouterResults = await this.testModel('openrouter', iterations);
            const openrouterStats = this.calculateStats(openrouterResults);
            this.displayResults('openrouter', openrouterStats);
            
            // Wait between model tests
            console.log('\n⏳ Waiting 5 seconds before testing next model...');
            await new Promise(resolve => setTimeout(resolve, 5000));
            
            // Test vLLM
            const vllmResults = await this.testModel('vllm', iterations);
            const vllmStats = this.calculateStats(vllmResults);
            this.displayResults('vllm', vllmStats);
            
            // Compare and recommend
            const winner = this.compareModels(openrouterStats, vllmStats);
            
            // Store results
            this.results.openrouter = { results: openrouterResults, stats: openrouterStats };
            this.results.vllm = { results: vllmResults, stats: vllmStats };
            
            return {
                winner,
                openrouter: openrouterStats,
                vllm: vllmStats,
                recommendation: winner
            };
            
        } catch (error) {
            console.error('❌ Benchmark failed:', error.message);
            throw error;
        }
    }
}

// Run the benchmark
async function main() {
    const benchmark = new LatencyBenchmark();
    
    try {
        const results = await benchmark.runBenchmark(5); // Test 5 requests per model
        
        console.log('\n💾 Saving results to benchmark-results.json...');
        const fs = require('fs');
        fs.writeFileSync('benchmark-results.json', JSON.stringify({
            timestamp: new Date().toISOString(),
            results: benchmark.results,
            recommendation: results.recommendation
        }, null, 2));
        
        console.log('✅ Benchmark completed successfully!');
        console.log(`📄 Results saved to: benchmark-results.json`);
        
    } catch (error) {
        console.error('❌ Benchmark error:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = LatencyBenchmark;