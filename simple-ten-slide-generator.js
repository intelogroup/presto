#!/usr/bin/env node

/**
 * Simple Ten Slide Layout Showcase Generator
 * A basic version without complex dependencies
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

class SimpleTenSlideGenerator {
    constructor() {
        this.pres = new PptxGenJS();
        this.slideCount = 0;
        
        // Setup presentation
        this.pres.layout = 'LAYOUT_WIDE';
        this.pres.author = 'Ten Slide Layout Showcase';
        this.pres.company = 'Layout Design Systems';
        this.pres.subject = 'Professional Presentation Layouts';
        this.pres.title = 'Ten Essential Slide Layouts';
        
        // Color palette
        this.colors = {
            primary: '#1e40af',
            secondary: '#dc2626',
            accent: '#059669',
            background: '#ffffff',
            text: '#111827',
            textLight: '#ffffff',
            gray: '#6b7280'
        };
    }
    
    createSlide1_TitleSlide() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.primary };
        
        slide.addText('Ten Essential Slide Layouts', {
            x: 0.5, y: 2, w: 9, h: 1.5,
            fontSize: 40,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            bold: true,
            align: 'center'
        });
        
        slide.addText('Professional Presentation Design Showcase', {
            x: 1, y: 3.8, w: 8, h: 0.8,
            fontSize: 20,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            align: 'center'
        });
        
        console.log('✓ Slide 1: Title Slide');
    }
    
    createSlide2_BulletPoints() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.background };
        
        slide.addText('Key Benefits of Professional Layouts', {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        const bulletText = '• Enhanced visual hierarchy and information flow\n• Improved audience engagement and retention\n• Professional appearance that builds credibility\n• Consistent branding and design language\n• Optimized content organization and readability';
        
        slide.addText(bulletText, {
            x: 0.5, y: 1.8, w: 9, h: 3,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.text
        });
        
        console.log('✓ Slide 2: Bullet Points Layout');
    }
    
    createSlide3_TwoColumn() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.background };
        
        slide.addText('Two-Column Comparison Layout', {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        // Left column
        slide.addText('Traditional Approach', {
            x: 0.5, y: 1.5, w: 4, h: 0.6,
            fontSize: 20,
            fontFace: 'Segoe UI',
            color: this.colors.secondary,
            bold: true
        });
        
        slide.addText('• Manual design processes\n• Limited template options\n• Time-intensive creation\n• Inconsistent results', {
            x: 0.5, y: 2.2, w: 4, h: 2,
            fontSize: 16,
            fontFace: 'Segoe UI',
            color: this.colors.text
        });
        
        // Right column
        slide.addText('Modern Solution', {
            x: 5.5, y: 1.5, w: 4, h: 0.6,
            fontSize: 20,
            fontFace: 'Segoe UI',
            color: this.colors.accent,
            bold: true
        });
        
        slide.addText('• Automated layout generation\n• Extensive template library\n• Rapid content creation\n• Professional consistency', {
            x: 5.5, y: 2.2, w: 4, h: 2,
            fontSize: 16,
            fontFace: 'Segoe UI',
            color: this.colors.text
        });
        
        console.log('✓ Slide 3: Two-Column Layout');
    }
    
    createSlide4_ImageWithText() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.background };
        
        slide.addText('Image and Text Integration', {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        // Placeholder for image area
        slide.addShape(this.pres.ShapeType.rect, {
            x: 0.5, y: 1.5, w: 4, h: 3,
            fill: { color: this.colors.gray, transparency: 80 },
            line: { color: this.colors.primary, width: 2 }
        });
        
        slide.addText('IMAGE\nPLACEHOLDER', {
            x: 0.5, y: 2.5, w: 4, h: 1,
            fontSize: 16,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            align: 'center',
            valign: 'middle'
        });
        
        // Text content
        slide.addText('Visual storytelling combines compelling imagery with strategic text placement to create memorable presentations that resonate with audiences and drive key messages home effectively.', {
            x: 5.5, y: 1.8, w: 4, h: 2.5,
            fontSize: 16,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            valign: 'top'
        });
        
        console.log('✓ Slide 4: Image with Text Layout');
    }
    
    createSlide5_ThreeColumn() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.background };
        
        slide.addText('Three-Column Feature Showcase', {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        const columns = [
            { title: 'Design', content: 'Professional templates with modern aesthetics and flexible customization options.' },
            { title: 'Performance', content: 'Fast generation with optimized rendering and efficient resource management.' },
            { title: 'Integration', content: 'Seamless workflow integration with popular tools and platforms.' }
        ];
        
        columns.forEach((col, index) => {
            const x = 0.5 + (index * 3.2);
            
            slide.addText(col.title, {
                x: x, y: 1.8, w: 2.8, h: 0.6,
                fontSize: 20,
                fontFace: 'Segoe UI',
                color: this.colors.primary,
                bold: true,
                align: 'center'
            });
            
            slide.addText(col.content, {
                x: x, y: 2.5, w: 2.8, h: 1.5,
                fontSize: 14,
                fontFace: 'Segoe UI',
                color: this.colors.text,
                align: 'center'
            });
        });
        
        console.log('✓ Slide 5: Three-Column Layout');
    }
    
    createSlide6_Quote() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.accent };
        
        slide.addText('"Great design is not just what it looks like and feels like. Great design is how it works."', {
            x: 1, y: 2, w: 8, h: 2,
            fontSize: 32,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            bold: true,
            align: 'center',
            valign: 'middle'
        });
        
        slide.addText('— Steve Jobs', {
            x: 1, y: 4.2, w: 8, h: 0.8,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            align: 'center',
            italic: true
        });
        
        console.log('✓ Slide 6: Quote Layout');
    }
    
    createSlide7_Process() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.background };
        
        slide.addText('Design Process Flow', {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        const steps = ['Research', 'Design', 'Develop', 'Test', 'Deploy'];
        
        steps.forEach((step, index) => {
            const x = 0.5 + (index * 1.8);
            
            // Step circle
            slide.addShape(this.pres.ShapeType.ellipse, {
                x: x + 0.4, y: 2, w: 1, h: 1,
                fill: { color: this.colors.primary },
                line: { color: this.colors.primary, width: 2 }
            });
            
            // Step number
            slide.addText((index + 1).toString(), {
                x: x + 0.4, y: 2, w: 1, h: 1,
                fontSize: 24,
                fontFace: 'Segoe UI',
                color: this.colors.textLight,
                bold: true,
                align: 'center',
                valign: 'middle'
            });
            
            // Step label
            slide.addText(step, {
                x: x, y: 3.2, w: 1.8, h: 0.6,
                fontSize: 14,
                fontFace: 'Segoe UI',
                color: this.colors.text,
                align: 'center'
            });
            
            // Arrow (except for last step)
            if (index < steps.length - 1) {
                slide.addShape(this.pres.ShapeType.rightArrow, {
                    x: x + 1.5, y: 2.3, w: 0.6, h: 0.4,
                    fill: { color: this.colors.gray }
                });
            }
        });
        
        console.log('✓ Slide 7: Process Flow Layout');
    }
    
    createSlide8_Statistics() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.background };
        
        slide.addText('Key Performance Metrics', {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        const stats = [
            { number: '95%', label: 'User Satisfaction' },
            { number: '3x', label: 'Faster Creation' },
            { number: '50+', label: 'Template Options' },
            { number: '24/7', label: 'Support Available' }
        ];
        
        stats.forEach((stat, index) => {
            const x = 0.5 + (index % 2) * 4.5;
            const y = 1.8 + Math.floor(index / 2) * 2;
            
            slide.addText(stat.number, {
                x: x, y: y, w: 4, h: 1,
                fontSize: 48,
                fontFace: 'Segoe UI',
                color: this.colors.primary,
                bold: true,
                align: 'center'
            });
            
            slide.addText(stat.label, {
                x: x, y: y + 1, w: 4, h: 0.6,
                fontSize: 16,
                fontFace: 'Segoe UI',
                color: this.colors.text,
                align: 'center'
            });
        });
        
        console.log('✓ Slide 8: Statistics Layout');
    }
    
    createSlide9_CallToAction() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.secondary };
        
        slide.addText('Ready to Transform Your Presentations?', {
            x: 0.5, y: 1.5, w: 9, h: 1,
            fontSize: 32,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            bold: true,
            align: 'center'
        });
        
        slide.addText('Start creating professional presentations today with our advanced layout system', {
            x: 1, y: 2.8, w: 8, h: 0.8,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            align: 'center'
        });
        
        // CTA Button simulation
        slide.addShape(this.pres.ShapeType.roundRect, {
            x: 3.5, y: 3.8, w: 3, h: 0.8,
            fill: { color: this.colors.textLight },
            line: { color: this.colors.textLight, width: 2 }
        });
        
        slide.addText('Get Started Now', {
            x: 3.5, y: 3.8, w: 3, h: 0.8,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.secondary,
            bold: true,
            align: 'center',
            valign: 'middle'
        });
        
        console.log('✓ Slide 9: Call to Action Layout');
    }
    
    createSlide10_ThankYou() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        slide.background = { fill: this.colors.primary };
        
        slide.addText('Thank You', {
            x: 0.5, y: 2, w: 9, h: 1.5,
            fontSize: 48,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            bold: true,
            align: 'center'
        });
        
        slide.addText('Questions & Discussion', {
            x: 1, y: 3.8, w: 8, h: 0.8,
            fontSize: 24,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            align: 'center'
        });
        
        console.log('✓ Slide 10: Thank You Layout');
    }
    
    async generatePresentation() {
        try {
            console.log('Starting Ten Slide Layout Showcase generation...');
            
            this.createSlide1_TitleSlide();
            this.createSlide2_BulletPoints();
            this.createSlide3_TwoColumn();
            this.createSlide4_ImageWithText();
            this.createSlide5_ThreeColumn();
            this.createSlide6_Quote();
            this.createSlide7_Process();
            this.createSlide8_Statistics();
            this.createSlide9_CallToAction();
            this.createSlide10_ThankYou();
            
            // Save presentation
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `ten_slide_showcase_simple_${timestamp}.pptx`;
            const outputPath = path.join('./output', filename);
            
            // Ensure output directory exists
            const outputDir = path.dirname(outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            await this.pres.writeFile({ fileName: outputPath });
            
            console.log(`\n✅ Presentation generated successfully!`);
            console.log(`📁 File: ${outputPath}`);
            console.log(`📊 Slides: ${this.slideCount}`);
            
            return outputPath;
            
        } catch (error) {
            console.error('❌ Error generating presentation:', error.message);
            throw error;
        }
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new SimpleTenSlideGenerator();
    generator.generatePresentation()
        .then(outputPath => {
            console.log('\n🎉 Generation completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n💥 Generation failed:', error);
            process.exit(1);
        });
}

module.exports = { SimpleTenSlideGenerator };