/**
 * PptxGenJS Reliability Tools Demo
 * Shows how all three tools work together for reliable presentation generation
 */

const PptxGenJS = require('pptxgenjs');
const PptxValidationHelper = require('./pptx-validation-helper');
const LayoutCalculator = require('./layout-calculator');
const SmartContentFitter = require('./content-fitter');

class ReliablePptxGenerator {
    constructor() {
        this.validator = new PptxValidationHelper();
        this.layoutCalc = new LayoutCalculator();
        this.contentFitter = new SmartContentFitter();

        console.log('🚀 Initialized Reliable PptxGenJS Generator');
        console.log('🔧 Tools loaded: Validation Helper, Layout Calculator, Content Fitter');
        console.log('');
    }

    /**
     * Generate a presentation using all reliability tools
     */
    async generateReliablePresentation(contentConfig, outputPath = 'reliable_presentation.pptx') {
        console.log('📊 Starting reliable presentation generation...');
        console.log(`Output: ${outputPath}`);
        console.log('');

        // Step 1: Validate input configuration
        console.log('Step 1: Validating configuration...');
        const validationResult = this.validator.validateConfig(contentConfig, 'presentation');
        this.validator.reportValidation(validationResult);

        if (!validationResult.valid) {
            throw new Error('Configuration validation failed. Please fix the errors above.');
        }

        // Step 2: Set up presentation with proper layout
        console.log('\nStep 2: Setting up presentation layout...');
        const pres = new PptxGenJS();
        const layout = 'LAYOUT_16x9';
        pres.layout = layout;

        // Step 3: Create elements with content fitting
        console.log('Step 3: Fitting content elements...');
        const fittedElements = this.contentFitter.fitMultipleTexts(contentConfig.elements);

        if (fittedElements.length > 0) {
            this.contentFitter.printFitReport(
                this.contentFitter.generateFitReport(fittedElements, layout)
            );
        }

        // Step 4: Create slide with layout assistance
        console.log('\nStep 4: Creating slide with layout assistance...');
        const slide = pres.addSlide();
        slide.background = { color: contentConfig.background || 'FFFFFF' };

        // Get safe area for proper positioning
        const safeArea = this.layoutCalc.getLayout(layout).safeArea;

        // Step 5: Add fitted elements to slide
        console.log('Step 5: Adding elements to slide...');
        fittedElements.forEach((element, index) => {
            // Validate final element position
            const boundsCheck = this.layoutCalc.validateBounds(
                element.options,
                layout
            );

            if (!boundsCheck.valid) {
                element.options = boundsCheck.suggestion;
                console.log(`⚠️  Element ${index + 1} adjusted to fit bounds`);
            }

            // Add to slide
            slide.addText(element.text, element.options);

            console.log(`✅ Added element ${index + 1}: ${element.fitInfo.fontSize}pt, ${element.fitInfo.lineCount} lines`);
        });

        // Step 6: Set presentation metadata
        if (contentConfig.title) pres.title = contentConfig.title;
        if (contentConfig.author) pres.author = contentConfig.author;
        if (contentConfig.subject) pres.subject = contentConfig.subject;

        // Step 7: Generate final presentation
        console.log('\nStep 7: Generating final presentation...');
        await pres.writeFile({ fileName: outputPath });

        console.log('');
        console.log('🎉 SUCCESS: Reliable presentation generated!');
        console.log(`📁 File: ${outputPath}`);
        console.log(`📊 Slides: 1`);
        console.log(`🔲 Elements: ${fittedElements.length}`);
        console.log(`📏 All elements fitted successfully`);

        return {
            filePath: outputPath,
            slideCount: 1,
            elementCount: fittedElements.length,
            fittingReport: this.contentFitter.generateFitReport(fittedElements),
            validation: validationResult
        };
    }

    /**
     * Quick demo with example content
     */
    async runDemo() {
        const demoContent = {
            title: 'Reliable Presentation Generation Demo',
            author: 'AI Assistant',
            subject: 'PptxGenJS Reliability Tools',
            background: 'F0F8FF',

            elements: [
                {
                    text: 'PptxGenJS Reliability Tools Demo',
                    container: { x: 1, y: 0.8, width: 8, height: 1 },
                    type: 'title',
                    options: { align: 'center', bold: true, color: '2E86AB', fontSize: 36 }
                },
                {
                    text: 'Automatically optimized text fitting, layout validation, and content adjustment',
                    container: { x: 1, y: 2.0, width: 8, height: 0.6 },
                    type: 'subtitle',
                    options: { align: 'center', color: 'FF6B35', fontSize: 18 }
                },
                {
                    text: 'Neural Networks: These computational models process complex patterns without explicit programming. Training involves learning from examples through interconnected layers of nodes.',
                    container: { x: 1, y: 3.0, width: 3.8, height: 1.8 },
                    type: 'body',
                    options: { align: 'left', fontSize: 12 }
                },
                {
                    text: 'Computer Vision: Advanced systems identify objects, faces, and text in real-time. Modern architectures understand complex visual scenes autonomously.',
                    container: { x: 5.2, y: 3.0, width: 3.8, height: 1.8 },
                    type: 'body',
                    options: { align: 'left', fontSize: 12 }
                },
                {
                    text: 'High Accuracy • Optimized Training • AI Research 2025',
                    container: { x: 1, y: 5.1, width: 3, height: 0.4 },
                    type: 'caption',
                    options: { align: 'left', color: 'FF6B35', fontSize: 10 }
                },
                {
                    text: 'Real-time Processing • Edge Deployment • 4K Resolution',
                    container: { x: 4.5, y: 5.1, width: 3, height: 0.4 },
                    type: 'caption',
                    options: { align: 'left', color: '9D4EDD', fontSize: 10 }
                },
                {
                    text: 'AI Research Labs 2025',
                    container: { x: 7.5, y: 5.1, width: 2, height: 0.4 },
                    type: 'caption',
                    options: { align: 'right', color: '666666', fontSize: 10 }
                }
            ]
        };

        console.log('🎯 RELIABLE PPTX GENERATOR DEMO');
        console.log('═'.repeat(60));
        console.log('Demo will create a presentation showcasing the reliability tools');
        console.log('');

        try {
            const result = await this.generateReliablePresentation(
                demoContent,
                'reliability-tools-demo.pptx'
            );

            console.log('');
            console.log('📈 SUMMARY:');
            console.log(`   • Presentation: ${result.filePath}`);
            console.log(`   • Slides: ${result.slideCount}`);
            console.log(`   • Elements fitted: ${result.elementCount}`);
            console.log(`   • Average utilization: ${result.fittingReport.summary.containerUtilization.toFixed(1)}%`);
            console.log('');
            console.log('✅ Demo completed successfully!');
            console.log('📁 Open the generated file to see the results');

        } catch (error) {
            console.error('❌ Demo failed:', error.message);
            console.log('');
            console.log('💡 Tip: Run "node pptx-validation-helper.js" to test individual tools');
        }
    }
}

module.exports = ReliablePptxGenerator;

// Main execution
if (require.main === module) {
    const generator = new ReliablePptxGenerator();

    if (process.argv.includes('--demo') || process.argv.length === 2) {
        generator.runDemo().catch(console.error);
    } else {
        console.log('🛠️  PptxGenJS Reliability Tools');
        console.log('');
        console.log('Options:');
        console.log('  --demo     Run full demo (default)');
        console.log('  --validate Run validation helper');
        console.log('  --layout   Run layout calculator');
        console.log('  --fit      Run content fitter');
        console.log('');
        console.log('Example: node pptx-reliability-demo.js --demo');
    }
}
