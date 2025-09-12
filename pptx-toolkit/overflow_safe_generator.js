const PptxGenJS = require('pptxgenjs');
const ContentConstraintSystem = require('./content_constraint_system');

class OverflowSafeGenerator {
    constructor() {
        this.constraintSystem = new ContentConstraintSystem();
        this.colorSchemes = {
            professional: {
                primary: '2E86AB',
                secondary: 'A23B72',
                accent: 'F18F01',
                text: '333333',
                background: 'FFFFFF'
            },
            modern: {
                primary: '264653',
                secondary: '2A9D8F',
                accent: 'E9C46A',
                text: '264653',
                background: 'F4F3EE'
            },
            vibrant: {
                primary: '6A4C93',
                secondary: '1982C4',
                accent: 'FF6B6B',
                text: '2D3436',
                background: 'FFFFFF'
            }
        };
    }

    createPresentation() {
        const pres = new PptxGenJS();
        pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
        pres.layout = 'LAYOUT_16x9';
        return pres;
    }

    addTitleSlide(pres, options = {}) {
        const slide = pres.addSlide();
        const scheme = this.colorSchemes[options.colorScheme || 'professional'];
        
        // Title with constraint handling
        const titleOptions = this.constraintSystem.createConstrainedTextOptions(
            options.title || 'Presentation Title',
            { x: 1, y: 1.5, w: 8, h: 1.5 },
            { fontSize: 44, bold: true, color: scheme.primary, align: 'center' }
        );
        slide.addText(titleOptions.text, titleOptions.options);
        
        // Subtitle with constraint handling
        if (options.subtitle) {
            const subtitleOptions = this.constraintSystem.createConstrainedTextOptions(
                options.subtitle,
                { x: 1, y: 3.2, w: 8, h: 1 },
                { fontSize: 24, color: scheme.secondary, align: 'center' }
            );
            slide.addText(subtitleOptions.text, subtitleOptions.options);
        }
        
        // Author
        if (options.author) {
            slide.addText(options.author, {
                x: 1, y: 4.5, w: 8, h: 0.5,
                fontSize: 16, color: scheme.text, align: 'center'
            });
        }
        
        return slide;
    }

    addContentSlide(pres, options = {}) {
        const slide = pres.addSlide();
        const scheme = this.colorSchemes[options.colorScheme || 'professional'];
        
        // Title
        const titleOptions = this.constraintSystem.createConstrainedTextOptions(
            options.title || 'Content Slide',
            { x: 0.5, y: 0.3, w: 9, h: 0.8 },
            { fontSize: 32, bold: true, color: scheme.primary }
        );
        slide.addText(titleOptions.text, titleOptions.options);
        
        // Content with overflow handling
        if (options.bullets && options.bullets.length > 0) {
            const textBoxes = this.constraintSystem.splitTextIntoBoxes(options.bullets, 8);
            
            textBoxes.forEach((box, index) => {
                const yPos = 1.3 + (index * 3.5);
                if (yPos < 5) { // Ensure within slide bounds
                    slide.addText(box, {
                        x: 0.5, y: yPos, w: 9, h: 3,
                        fontSize: 18, color: scheme.text,
                        bullet: true
                    });
                }
            });
        }
        
        return slide;
    }

    addTwoColumnSlide(pres, options = {}) {
        const slide = pres.addSlide();
        const scheme = this.colorSchemes[options.colorScheme || 'professional'];
        
        // Title
        const titleOptions = this.constraintSystem.createConstrainedTextOptions(
            options.title || 'Two Column Layout',
            { x: 0.5, y: 0.3, w: 9, h: 0.8 },
            { fontSize: 32, bold: true, color: scheme.primary }
        );
        slide.addText(titleOptions.text, titleOptions.options);
        
        // Left column
        if (options.leftTitle) {
            slide.addText(options.leftTitle, {
                x: 0.5, y: 1.3, w: 4, h: 0.6,
                fontSize: 24, bold: true, color: scheme.secondary
            });
        }
        
        if (options.leftContent) {
            const leftText = Array.isArray(options.leftContent) 
                ? options.leftContent.join('\n• ') 
                : options.leftContent;
            slide.addText('• ' + leftText, {
                x: 0.5, y: 2, w: 4, h: 3,
                fontSize: 16, color: scheme.text
            });
        }
        
        // Right column
        if (options.rightTitle) {
            slide.addText(options.rightTitle, {
                x: 5, y: 1.3, w: 4, h: 0.6,
                fontSize: 24, bold: true, color: scheme.secondary
            });
        }
        
        if (options.rightContent) {
            const rightText = Array.isArray(options.rightContent) 
                ? options.rightContent.join('\n• ') 
                : options.rightContent;
            slide.addText('• ' + rightText, {
                x: 5, y: 2, w: 4, h: 3,
                fontSize: 16, color: scheme.text
            });
        }
        
        return slide;
    }

    async generateDemo() {
        console.log('\n=== Generating Overflow-Safe Presentation ===\n');
        
        const pres = this.createPresentation();
        
        // Title slide
        this.addTitleSlide(pres, {
            title: 'Advanced Content Constraint System',
            subtitle: 'Preventing Overflow with Intelligent Layout Management',
            author: 'PowerPoint Generation System',
            colorScheme: 'professional'
        });
        
        // Feature overview
        this.addContentSlide(pres, {
            title: 'Key Features and Capabilities',
            bullets: [
                'Automatic font size calculation based on content length',
                'Intelligent text truncation with professional ellipsis',
                'Dynamic text box splitting for large content volumes',
                'Grid-based layout system for consistent positioning',
                'Safe area calculations preventing boundary overflow',
                'Responsive design principles for presentation layouts'
            ],
            colorScheme: 'modern'
        });
        
        // Comparison slide
        this.addTwoColumnSlide(pres, {
            title: 'Before vs After Implementation',
            leftTitle: 'Without Constraints',
            leftContent: [
                'Text overflow beyond slide boundaries',
                'Inconsistent font sizing across slides',
                'Poor readability with cramped content',
                'Manual adjustments required constantly'
            ],
            rightTitle: 'With Constraint System',
            rightContent: [
                'Automatic size optimization for perfect fit',
                'Consistent professional appearance',
                'Guaranteed readability and spacing',
                'Zero manual intervention required'
            ],
            colorScheme: 'vibrant'
        });
        
        // Save presentation
        const filename = 'overflow_safe_demo.pptx';
        await pres.writeFile({ fileName: filename });
        
        console.log(`✓ Generated: ${filename}`);
        console.log('  - Demonstrates content constraint system');
        console.log('  - Shows overflow prevention in action');
        console.log('  - Includes responsive layout examples');
        console.log('\n=== Generation Complete ===\n');
        
        return filename;
    }
}

// Run demo if called directly
if (require.main === module) {
    const generator = new OverflowSafeGenerator();
    generator.generateDemo().catch(console.error);
}

module.exports = OverflowSafeGenerator;
