const { routePresentationRequest, TemplateIntelligence, ContentValidator } = require('./intelligent-routing');

async function testIntelligentSystem() {
    console.log('🧪 Testing Intelligent Routing System...\n');

    // Test 1: Template matching
    console.log('📊 Test 1: Template Analysis');
    const testRequests = [
        'I need a presentation about sustainable technology and green innovation',
        'Create a business presentation for our quarterly review',
        'Make slides about flowers and gardening tips',
        'Generate a scientific research methodology presentation',
        'Back to school presentation for students'
    ];

    for (const request of testRequests) {
        console.log(`\n🔍 Analyzing: "${request}"`);
        try {
            const result = await routePresentationRequest(request);
            if (result.success) {
                const analysis = result.analysis;
                console.log(`   ✅ Template: ${analysis.recommendedTemplate || 'default'}`);
                console.log(`   🎯 Confidence: ${Math.round(analysis.confidence * 100)}%`);
                console.log(`   🔑 Topics: ${analysis.detectedTopics.join(', ')}`);
                console.log(`   💡 Reasoning: ${analysis.reasoning}`);
            } else {
                console.log(`   ❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.log(`   ❌ Exception: ${error.message}`);
        }
    }

    // Test 2: Content validation
    console.log('\n\n🛡️ Test 2: Content Validation');
    const testData = {
        title: 'Test Presentation',
        subtitle: 'A sample presentation for testing',
        slides: [
            { title: 'Introduction', content: 'Welcome to our presentation' },
            { title: 'Key Points', type: 'bullets', bullets: ['Point 1', 'Point 2', 'Point 3'] }
        ],
        colorScheme: 'professional'
    };

    const validationErrors = ContentValidator.validatePresentationData(testData);
    console.log(`Validation errors: ${validationErrors.length === 0 ? 'None ✅' : validationErrors.join(', ')}`);

    const sanitizedData = ContentValidator.sanitizePresentationData(testData);
    console.log(`Sanitized title: "${sanitizedData.title}"`);
    console.log(`Sanitized slides: ${sanitizedData.slides.length}`);

    // Test 3: Enhanced prompt generation
    console.log('\n\n💬 Test 3: Enhanced Prompt Generation');
    const analysis = await TemplateIntelligence.analyzeUserRequest('sustainable technology presentation');
    const enhancedPrompt = TemplateIntelligence.generateEnhancedPrompt('sustainable technology presentation', analysis);
    console.log('Enhanced prompt generated:', enhancedPrompt.length > 0 ? '✅' : '❌');
    console.log(`Prompt length: ${enhancedPrompt.length} characters`);

    console.log('\n🎉 Intelligent Routing System Test Complete!');
}

// Run the test
testIntelligentSystem().catch(console.error);
