/**
 * Debug presentation generator
 * Tests each element separately to catch issues
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');

async function createDebugPresentation() {
    console.log('🔧 Creating debug presentation...\n');

    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9';
    pres.title = 'Debug Presentation';
    pres.author = 'AI Assistant';

    const slide = pres.addSlide();

    // Create a single test text element with known good positioning
    console.log('Adding test title...');
    slide.addText('Title Test', {
        x: 1,
        y: 0.5,
        w: 8,
        h: 1,
        fontSize: 44,
        bold: true,
        color: '2E86AB',
        align: 'center',
        fontFace: 'Arial',
        wrap: true
    });

    console.log('Adding test body text...');
    slide.addText('This is a simple body text\nto test basic functionality.', {
        x: 2,
        y: 2,
        w: 6,
        h: 1,
        fontSize: 24,
        color: '666666',
        align: 'left',
        wrap: true
    });

    console.log('Adding test caption...');
    slide.addText('Caption test', {
        x: 2,
        y: 3.5,
        w: 4,
        h: 0.5,
        fontSize: 18,
        color: '9D4EDD',
        align: 'left'
    });

    // Try to create multiple slides to test stability
    console.log('Creating second slide...');
    const slide2 = pres.addSlide();
    slide2.background = { color: 'F0F8FF' };

    slide2.addText('Second Slide Title', {
        x: 1,
        y: 1,
        w: 8,
        h: 1,
        fontSize: 40,
        color: 'FF6B35',
        align: 'center',
        bold: true
    });

    slide2.addText('This is test content for the second slide.\nIt tests basic text wrapping and positioning.', {
        x: 2,
        y: 2.5,
        w: 6,
        h: 2,
        fontSize: 20,
        align: 'left',
        wrap: true
    });

    const outputPath = 'debug-presentation.pptx';
    console.log(`\n📁 Generating file: ${outputPath}`);

    try {
        await pres.writeFile({ fileName: outputPath });
        console.log('✅ Debug presentation created successfully!');

        // Check file size
        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            console.log(`📊 File size: ${stats.size} bytes`);
        }

    } catch (error) {
        console.error('❌ Failed to create presentation:', error);
    }
}

// Test basic PptxGenJS functionality
async function testBasicFunctionality() {
    console.log('🧪 Testing basic PptxGenJS functionality...\n');

    const pres = new PptxGenJS();

    // Test different layouts
    const layouts = ['LAYOUT_16x9', 'LAYOUT_4x3'];
    for (const layout of layouts) {
        try {
            console.log(`Testing ${layout}...`);
            const testPres = new PptxGenJS();
            testPres.layout = layout;

            const testSlide = testPres.addSlide();
            testSlide.addText(`Test for ${layout}`, {
                x: 1,
                y: 1,
                w: 5,
                h: 1,
                fontSize: 24
            });

            await testPres.writeFile({ fileName: `test-${layout.toLowerCase()}.pptx` });
            console.log(`✅ ${layout} works`);
        } catch (error) {
            console.log(`❌ ${layout} failed: ${error.message}`);
        }
    }

    console.log('');
}

// Run debug tests
async function runDebugTests() {
    console.log('🐛 Starting debug tests...\n');
    await testBasicFunctionality();
    await createDebugPresentation();
    console.log('\n🎯 Debug tests completed.');
}

// Execute if run directly
if (require.main === module) {
    runDebugTests().catch(console.error);
}

module.exports = { createDebugPresentation, testBasicFunctionality };
