#!/usr/bin/env node
/**
 * Custom PptxGenJS Presentation Generator
 * Uses the pptxgenjs_data.json file to create a customized presentation
 */

const PptxGenJSPresentationGenerator = require('./pptxgenjs_presentation_generator');
const fs = require('fs');
const path = require('path');

async function generateCustomPresentation() {
    try {
        // Load custom data
        const dataPath = path.join(__dirname, 'pptxgenjs_data.json');
        const customData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        
        console.log('📊 Loading custom presentation data...');
        console.log(`📋 Title: ${customData.slides.title.title}`);
        console.log(`👤 Author: ${customData.slides.title.author}`);
        
        // Create generator instance
        const generator = new PptxGenJSPresentationGenerator();
        
        // Generate presentation with custom data
        const outputPath = 'custom_pptxgenjs_presentation.pptx';
        await generator.generatePresentation(customData, outputPath);
        
        console.log('🎉 Custom presentation created successfully!');
        console.log(`📁 Output: ${outputPath}`);
        console.log('');
        console.log('✨ PptxGenJS Features Demonstrated:');
        console.log('   • Pure JavaScript implementation');
        console.log('   • No Python or template dependencies');
        console.log('   • SmartArt-style diagrams using shapes');
        console.log('   • Professional styling and layouts');
        console.log('   • Dynamic content from JSON data');
        console.log('   • Custom charts using geometric shapes');
        console.log('   • Precise positioning and formatting');
        
    } catch (error) {
        console.error('❌ Error generating custom presentation:', error.message);
        process.exit(1);
    }
}

// Run the generator
if (require.main === module) {
    generateCustomPresentation();
}

module.exports = generateCustomPresentation;