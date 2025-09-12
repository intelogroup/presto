/**
 * RunPod URL Helper Script
 * Helps users find and configure their RunPod external URL
 */

const https = require('https');
const http = require('http');

/**
 * Test if a URL is accessible and returns expected vLLM API response
 */
async function testRunPodURL(url) {
    return new Promise((resolve, reject) => {
        // Clean up URL
        const cleanUrl = url.replace(/\/$/, ''); // Remove trailing slash
        const testUrl = `${cleanUrl}/v1/models`;
        
        console.log(`🔍 Testing URL: ${testUrl}`);
        
        const protocol = testUrl.startsWith('https:') ? https : http;
        
        const req = protocol.get(testUrl, {
            timeout: 10000,
            headers: {
                'User-Agent': 'Presto-RunPod-Test/1.0'
            }
        }, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    
                    if (res.statusCode === 200 && parsed.data && Array.isArray(parsed.data)) {
                        resolve({
                            success: true,
                            url: cleanUrl,
                            models: parsed.data,
                            statusCode: res.statusCode
                        });
                    } else {
                        resolve({
                            success: false,
                            url: cleanUrl,
                            error: `Unexpected response format. Status: ${res.statusCode}`,
                            response: data,
                            statusCode: res.statusCode
                        });
                    }
                } catch (parseError) {
                    resolve({
                        success: false,
                        url: cleanUrl,
                        error: `Invalid JSON response: ${parseError.message}`,
                        response: data,
                        statusCode: res.statusCode
                    });
                }
            });
        });
        
        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                url: cleanUrl,
                error: 'Request timeout (10 seconds)'
            });
        });
        
        req.on('error', (error) => {
            resolve({
                success: false,
                url: cleanUrl,
                error: error.message
            });
        });
    });
}

/**
 * Generate common RunPod URL patterns based on pod ID
 */
function generateRunPodURLs(podId) {
    const patterns = [
        `https://${podId}-8000.proxy.runpod.net`,
        `https://${podId}-8000.proxy.runpod.net/v1`,
        `http://${podId}-8000.proxy.runpod.net`,
        `https://${podId}.proxy.runpod.net:8000`,
        `https://${podId}.runpod.io:8000`
    ];
    
    return patterns;
}

/**
 * Interactive URL finder
 */
async function findRunPodURL() {
    console.log('🔍 RunPod URL Finder');
    console.log('=' .repeat(40));
    
    // Check if user provided URL as command line argument
    const args = process.argv.slice(2);
    
    if (args.length > 0) {
        console.log('\n📝 Testing provided URL...');
        const result = await testRunPodURL(args[0]);
        
        if (result.success) {
            console.log('✅ URL is working!');
            console.log(`🎯 Use this URL: ${result.url}`);
            console.log(`🤖 Available models: ${result.models.map(m => m.id).join(', ')}`);
            
            console.log('\n📋 Next Steps:');
            console.log('1. Copy this URL to your .env file:');
            console.log(`   RUNPOD_API_URL=${result.url}`);
            console.log('2. Enable RunPod:');
            console.log('   RUNPOD_ENABLED=true');
            console.log('3. Test the integration:');
            console.log('   node test-runpod-connection.js');
            
            return result.url;
        } else {
            console.log('❌ URL test failed:');
            console.log(`   Error: ${result.error}`);
            if (result.response) {
                console.log(`   Response: ${result.response.substring(0, 200)}...`);
            }
        }
    }
    
    console.log('\n📖 How to find your RunPod URL:');
    console.log('\n1. 🌐 Go to your RunPod dashboard (runpod.io)');
    console.log('2. 📱 Find your running pod with vLLM');
    console.log('3. 🔗 Look for "Connect" or "HTTP Service" section');
    console.log('4. 📋 Copy the external URL (usually ends with .proxy.runpod.net)');
    console.log('5. ⚙️  Make sure port 8000 is exposed');
    
    console.log('\n🔍 Common RunPod URL patterns:');
    console.log('   https://[pod-id]-8000.proxy.runpod.net');
    console.log('   https://[pod-id].proxy.runpod.net:8000');
    console.log('   https://[pod-id].runpod.io:8000');
    
    console.log('\n💡 If you have your Pod ID, I can generate test URLs:');
    console.log('   node get-runpod-url.js --generate [your-pod-id]');
    
    console.log('\n🧪 To test a specific URL:');
    console.log('   node get-runpod-url.js [your-url]');
    
    // Check for generate flag
    const generateIndex = args.indexOf('--generate');
    if (generateIndex !== -1 && args[generateIndex + 1]) {
        const podId = args[generateIndex + 1];
        console.log(`\n🔄 Generating URLs for Pod ID: ${podId}`);
        console.log('=' .repeat(40));
        
        const urls = generateRunPodURLs(podId);
        
        for (const url of urls) {
            console.log(`\n🧪 Testing: ${url}`);
            const result = await testRunPodURL(url);
            
            if (result.success) {
                console.log('✅ SUCCESS! This URL works!');
                console.log(`🎯 Use: ${result.url}`);
                console.log(`🤖 Models: ${result.models.map(m => m.id).join(', ')}`);
                
                console.log('\n📋 Add to your .env file:');
                console.log(`RUNPOD_API_URL=${result.url}`);
                console.log('RUNPOD_ENABLED=true');
                
                return result.url;
            } else {
                console.log(`❌ Failed: ${result.error}`);
            }
        }
        
        console.log('\n😞 None of the generated URLs worked.');
        console.log('Please check your RunPod dashboard for the correct URL.');
    }
    
    return null;
}

/**
 * Validate RunPod configuration
 */
async function validateRunPodConfig() {
    console.log('\n🔧 Validating RunPod Configuration');
    console.log('=' .repeat(40));
    
    try {
        require('dotenv').config();
        
        const runpodUrl = process.env.RUNPOD_API_URL;
        const runpodEnabled = process.env.RUNPOD_ENABLED;
        
        console.log(`📝 RUNPOD_API_URL: ${runpodUrl || 'Not set'}`);
        console.log(`📝 RUNPOD_ENABLED: ${runpodEnabled || 'Not set'}`);
        
        if (!runpodUrl || runpodUrl === 'YOUR_RUNPOD_URL_HERE') {
            console.log('❌ RunPod URL not configured');
            return false;
        }
        
        if (runpodEnabled !== 'true') {
            console.log('⚠️  RunPod is configured but not enabled');
            console.log('   Set RUNPOD_ENABLED=true to enable');
        }
        
        console.log('\n🧪 Testing configured URL...');
        const result = await testRunPodURL(runpodUrl);
        
        if (result.success) {
            console.log('✅ Configuration is valid!');
            console.log(`🤖 Available models: ${result.models.map(m => m.id).join(', ')}`);
            return true;
        } else {
            console.log('❌ Configuration test failed:');
            console.log(`   ${result.error}`);
            return false;
        }
        
    } catch (error) {
        console.log(`❌ Configuration error: ${error.message}`);
        return false;
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.includes('--validate')) {
        validateRunPodConfig();
    } else {
        findRunPodURL();
    }
}

module.exports = {
    testRunPodURL,
    generateRunPodURLs,
    findRunPodURL,
    validateRunPodConfig
};