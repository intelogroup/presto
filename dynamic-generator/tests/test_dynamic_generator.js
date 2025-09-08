#!/usr/bin/env node
/**
 * Simple test for Dynamic Presentation Generator
 */

const DynamicPresentationGenerator = require('./dynamic_presentation_generator');

async function testGenerator() {
    console.log('🧪 Testing Dynamic Presentation Generator...');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'professional',
        layout: 'LAYOUT_16x9'
    });

    const testData = {
        title: 'Test Presentation',
        subtitle: 'Dynamic Generator Demo',
        slides: {
            title: {
                title: 'Dynamic Generator Test',
                subtitle: 'Automated Presentation Creation'
            },
            
            textImage: {
                title: 'Text-Image Layout (Default)',
                content: 'This demonstrates the default layout with text on the left side and image area on the right side. The generator automatically positions content for optimal readability.',
                images: [{ description: 'Sample image placeholder' }]
            },
            
            icons: {
                title: 'Icon Grid Demo',
                icons: [
                    { symbol: '🎯', label: 'Precision' },
                    { symbol: '⚡', label: 'Speed' },
                    { symbol: '🛡️', label: 'Security' },
                    { symbol: '🎨', label: 'Design' }
                ]
            },
            
            chart: {
                title: 'Chart Visualization',
                content: 'Sample data visualization',
                chartData: {
                    values: [85, 92, 78, 96, 88, 94]
                }
            }
        }
    };

    try {
        const stats = await generator.generatePresentation(testData, 'test_dynamic_presentation.pptx');
        
        console.log('✅ Test successful!');
        console.log(`📁 Generated: ${stats.outputPath}`);
        console.log(`📊 Slides: ${stats.slideCount}`);
        console.log(`🎨 Template: ${stats.template}`);
        console.log(`📐 Layout: ${stats.layout}`);
        console.log(`⏱️  Duration: ${stats.duration}ms`);
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

if (require.main === module) {
    testGenerator();
}

module.exports = testGenerator;
