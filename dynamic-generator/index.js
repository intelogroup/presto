#!/usr/bin/env node
/**
 * Dynamic Presentation Generator - Main Entry Point
 * 
 * Battle-tested, production-ready PowerPoint generator that adapts to any user request.
 * 
 * Features:
 * - Intelligent content analysis and template selection
 * - Default layout: text left, images right
 * - Icon grids, charts, and visual elements
 * - Multiple color schemes and themes
 * - Comprehensive error handling and validation
 * - Integration with existing pptx-toolkit components
 * 
 * Usage:
 * const DynamicPresentationGenerator = require('./dynamic-generator');
 * 
 * Author: AI Assistant
 * Version: 3.0 (Battle-tested)
 */

// Export the main generator class
const DynamicPresentationGenerator = require('./core/dynamic_presentation_generator');

// Export supporting components
const BattleTestSuite = require('./tests/battle_test_dynamic_generator');
const SpecializedDesignTests = require('./tests/specialized_design_tests');
const Examples = require('./examples/dynamic_generator_examples');

// Export toolkit components
const LayoutCalculator = require('./toolkit/layout-calculator');
const SmartContentFitter = require('./toolkit/content-fitter');
const PptxValidationHelper = require('./toolkit/pptx-validation-helper');

module.exports = {
    // Main generator
    DynamicPresentationGenerator,
    
    // Testing suites
    BattleTestSuite,
    SpecializedDesignTests,
    
    // Examples and demonstrations
    Examples,
    
    // Toolkit components
    LayoutCalculator,
    SmartContentFitter,
    PptxValidationHelper,
    
    // Quick access to main generator
    Generator: DynamicPresentationGenerator,
    
    // Convenience function for quick generation
    async generate(data, outputPath, options = {}) {
        const generator = new DynamicPresentationGenerator(options);
        return await generator.generatePresentation(data, outputPath);
    },
    
    // Run battle tests
    async runBattleTests() {
        const battleTest = new BattleTestSuite();
        return await battleTest.runBattleTests();
    },
    
    // Run specialized design tests
    async runSpecializedTests() {
        const specializedTests = new SpecializedDesignTests();
        return await specializedTests.runAllTests();
    },
    
    // Run all examples
    async runExamples() {
        return await Examples.runAllExamples();
    }
};

// CLI usage
if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
        case 'test':
            console.log('🧪 Running battle tests...');
            module.exports.runBattleTests().catch(console.error);
            break;
            
        case 'specialized':
            console.log('🎨 Running specialized design tests...');
            module.exports.runSpecializedTests().catch(console.error);
            break;
            
        case 'examples':
            console.log('📚 Running all examples...');
            module.exports.runExamples().catch(console.error);
            break;
            
        case 'demo':
            console.log('🚀 Running quick demo...');
            const generator = new DynamicPresentationGenerator();
            const demoData = {
                title: 'Dynamic Generator Demo',
                slides: {
                    title: { title: 'Welcome to Dynamic Generator', subtitle: 'Battle-tested and Production Ready' },
                    features: { 
                        title: 'Key Features',
                        icons: [
                            { symbol: '🎯', label: 'Adaptive Layouts' },
                            { symbol: '🛡️', label: 'Battle Tested' },
                            { symbol: '⚡', label: 'High Performance' }
                        ]
                    }
                }
            };
            generator.generatePresentation(demoData, 'dynamic-generator-demo.pptx')
                .then(stats => console.log('✅ Demo complete!', stats))
                .catch(console.error);
            break;
            
        default:
            console.log('📖 Dynamic Presentation Generator - Battle-tested v3.0');
            console.log('');
            console.log('Usage:');
            console.log('  node index.js demo       - Run quick demo');
            console.log('  node index.js test       - Run battle tests');
            console.log('  node index.js specialized - Run specialized design tests');
            console.log('  node index.js examples   - Run all examples');
            console.log('');
            console.log('Or require in your code:');
            console.log('  const { DynamicPresentationGenerator } = require("./dynamic-generator");');
            break;
    }
}
