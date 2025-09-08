/**
 * Fixed Positioning Generator for PptxGenJS
 * 
 * Stable generator with improved content positioning
 * Based on working simple generator with enhanced layout
 */

const PptxGenJS = require('pptxgenjs');

class FixedPositioningGenerator {
    constructor() {
        this.pptx = new PptxGenJS();
        
        // Set presentation properties
        this.pptx.author = 'Fixed Positioning Generator';
        this.pptx.company = 'Enhanced PPTX Solutions';
        this.pptx.subject = 'Fixed Positioning Demo';
        this.pptx.title = 'Enhanced Content Positioning';
        
        // Improved positioning constants
        this.layout = {
            margins: {
                top: 0.3,      // Reduced top margin
                bottom: 0.5,
                left: 0.5,
                right: 0.5
            },
            spacing: {
                titleHeight: 0.8,     // Reduced title height
                titleToContent: 0.2,  // Reduced spacing
                betweenItems: 0.3     // Spacing between content items
            }
        };
        
        // Color scheme
        this.colors = {
            primary: '2E4057',
            secondary: '048A81',
            accent: 'F39C12',
            text: '333333',
            light: '666666'
        };
    }

    // Create title slide with improved positioning
    createTitleSlide() {
        const slide = this.pptx.addSlide();
        
        // Main title - positioned higher
        slide.addText('Enhanced Content Positioning', {
            x: 1, y: 1.8, w: 8, h: 1.5,  // Moved up from y: 2
            fontSize: 40,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Subtitle - closer to title
        slide.addText('Optimized Layout with Better Content Visibility', {
            x: 1, y: 3.5, w: 8, h: 1,  // Moved up from y: 4
            fontSize: 22,
            color: this.colors.secondary,
            align: 'center'
        });

        // Date - positioned at bottom
        slide.addText(`Generated: ${new Date().toLocaleDateString()}`, {
            x: 1, y: 6.2, w: 8, h: 0.5,
            fontSize: 14,
            color: this.colors.light,
            align: 'center'
        });

        return slide;
    }

    // Create content slide with improved positioning
    createContentSlide(title, content) {
        const slide = this.pptx.addSlide();
        
        // Title - positioned at top with reduced height
        slide.addText(title, {
            x: this.layout.margins.left,
            y: this.layout.margins.top,  // Start at top margin (0.3)
            w: 9,
            h: this.layout.spacing.titleHeight,  // Reduced height (0.8)
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            align: 'left'
        });
        
        // Content - starts immediately after title with minimal spacing
        const contentY = this.layout.margins.top + this.layout.spacing.titleHeight + this.layout.spacing.titleToContent;
        
        slide.addText(content, {
            x: this.layout.margins.left + 0.2,  // Slight indent for readability
            y: contentY,  // Starts at 1.3 (0.3 + 0.8 + 0.2)
            w: 8.3,
            h: 5.5,  // Increased content area
            fontSize: 16,
            color: this.colors.text,
            align: 'left',
            valign: 'top'
        });

        return slide;
    }

    // Create bullet point slide with improved positioning
    createBulletSlide(title, bullets) {
        const slide = this.pptx.addSlide();
        
        // Title - positioned at top
        slide.addText(title, {
            x: this.layout.margins.left,
            y: this.layout.margins.top,
            w: 9,
            h: this.layout.spacing.titleHeight,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            align: 'left'
        });
        
        // Bullet points - positioned closer to title
        const contentY = this.layout.margins.top + this.layout.spacing.titleHeight + this.layout.spacing.titleToContent;
        
        // Format bullets with proper spacing
        const bulletText = bullets.map(bullet => `• ${bullet}`).join('\n\n');
        
        slide.addText(bulletText, {
            x: this.layout.margins.left + 0.2,
            y: contentY,
            w: 8.3,
            h: 5.5,
            fontSize: 16,
            color: this.colors.text,
            align: 'left',
            valign: 'top',
            lineSpacing: 24
        });

        return slide;
    }

    // Create two-column slide with improved positioning
    createTwoColumnSlide(title, leftContent, rightContent) {
        const slide = this.pptx.addSlide();
        
        // Title
        slide.addText(title, {
            x: this.layout.margins.left,
            y: this.layout.margins.top,
            w: 9,
            h: this.layout.spacing.titleHeight,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });
        
        const contentY = this.layout.margins.top + this.layout.spacing.titleHeight + this.layout.spacing.titleToContent;
        const columnWidth = 4;
        
        // Left column
        slide.addText(leftContent, {
            x: this.layout.margins.left,
            y: contentY,
            w: columnWidth,
            h: 5.5,
            fontSize: 15,
            color: this.colors.text,
            align: 'left',
            valign: 'top'
        });
        
        // Right column
        slide.addText(rightContent, {
            x: this.layout.margins.left + columnWidth + 0.5,
            y: contentY,
            w: columnWidth,
            h: 5.5,
            fontSize: 15,
            color: this.colors.text,
            align: 'left',
            valign: 'top'
        });

        return slide;
    }

    // Programmatic generation wrapper
    async generatePresentation(data = {}, outputPath) {
        // If slides provided, create slides accordingly, otherwise use demo
        try {
            if (data.slides && Array.isArray(data.slides) && data.slides.length > 0) {
                // create title if data.title
                if (data.title) this.createTitleSlide();
                data.slides.forEach(s => {
                    if (s.type === 'bullet' || s.type === 'bullets') this.createBulletSlide(s.title || '', s.bullets || s.content || []);
                    else if (s.type === 'two-column') this.createTwoColumnSlide(s.title || '', s.left || '', s.right || '');
                    else this.createContentSlide(s.title || '', s.content || '');
                });
                const outPath = outputPath || './fixed_positioning_output.pptx';
                await this.pptx.writeFile({ fileName: outPath });
                return { success: true, path: outPath };
            }

            // Fallback to demo generator
            const filename = await this.generateDemo();
            return { success: true, path: filename };
        } catch (err) {
            return { success: false, error: err.message };
        }
    }

    // Generate complete demo presentation
    async generateDemo() {
        console.log('🚀 Generating Fixed Positioning Demo...');
        
        try {
            // Title slide
            this.createTitleSlide();
            
            // Key improvements slide
            this.createBulletSlide('Key Positioning Improvements', [
                'Content moved up by 0.2-0.3 inches for better visibility',
                'Reduced title height from 1.0 to 0.8 inches to save space',
                'Minimized spacing between title and content (0.2 inches)',
                'Increased content area height to 5.5 inches',
                'Optimized margins for professional appearance',
                'Enhanced readability with proper text alignment'
            ]);
            
            // Before vs After comparison
            this.createTwoColumnSlide(
                'Before vs After Comparison',
                'Previous Layout:\n\n• Content started at y: 1.8\n• Title height: 1.0 inch\n• Large spacing gaps\n• Limited content area\n• Poor space utilization\n• Content appeared low on slide',
                'Enhanced Layout:\n\n• Content starts at y: 1.3\n• Title height: 0.8 inch\n• Optimized spacing\n• Expanded content area\n• Better space utilization\n• Content positioned higher'
            );
            
            // Technical specifications
            this.createContentSlide(
                'Technical Specifications',
                'Layout Measurements:\n\n' +
                '• Top margin: 0.3 inches (reduced from 0.5)\n' +
                '• Title height: 0.8 inches (reduced from 1.0)\n' +
                '• Title-to-content spacing: 0.2 inches (reduced from 0.4)\n' +
                '• Content area height: 5.5 inches (increased from 4.5)\n' +
                '• Content starts at y: 1.3 (improved from 1.8)\n' +
                '• Bottom margin: 0.5 inches (maintained for balance)\n\n' +
                'These optimizations provide 22% more visible content area while maintaining professional appearance and readability.'
            );
            
            // Results summary
            this.createBulletSlide('Results Summary', [
                'Content positioning improved by moving up 0.5 inches',
                'Available content area increased by 22%',
                'Professional spacing maintained throughout',
                'Better visual hierarchy with optimized title sizing',
                'Enhanced readability with proper text alignment',
                'Consistent layout across all slide types'
            ]);
            
            // Save presentation
            const filename = './fixed_positioning_demo.pptx';
            await this.pptx.writeFile({ fileName: filename });
            
            console.log('✅ Fixed positioning demo generated successfully!');
            console.log(`📁 Output: ${filename}`);
            console.log(`📊 Slides created: ${this.pptx.slides.length}`);
            console.log('🎨 Features:');
            console.log('   • Improved content positioning');
            console.log('   • Enhanced space utilization');
            console.log('   • Professional layout design');
            console.log('   • Consistent spacing ratios');
            
            return filename;
            
        } catch (error) {
            console.error('❌ Error generating presentation:', error.message);
            throw error;
        }
    }
}

// Run demo if called directly
if (require.main === module) {
    const generator = new FixedPositioningGenerator();
    generator.generateDemo()
        .then(filename => {
            console.log('\n🎉 Fixed positioning demo created successfully!');
            console.log('\n📋 This demo addresses:');
            console.log('   ✅ Content positioning issues');
            console.log('   ✅ Space utilization optimization');
            console.log('   ✅ Professional layout standards');
            console.log('   ✅ Consistent visual hierarchy');
        })
        .catch(error => {
            console.error('\n💥 Failed to create presentation:', error.message);
            process.exit(1);
        });
}

module.exports = FixedPositioningGenerator;
