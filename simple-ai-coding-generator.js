#!/usr/bin/env node

/**
 * Simple AI Coding 2050 Generator
 * A basic version without complex dependencies
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

class SimpleAICoding2050Generator {
    constructor() {
        this.pres = new PptxGenJS();
        this.slideCount = 0;
        
        // Setup presentation
        this.pres.layout = 'LAYOUT_WIDE';
        this.pres.author = 'AI Coding 2050 Generator';
        this.pres.company = 'Future Development Systems';
        this.pres.subject = 'AI-Driven Software Development in 2050';
        this.pres.title = 'The Future of AI-Assisted Programming';
        
        // Simple color scheme
        this.colors = {
            primary: '#2563eb',
            secondary: '#7c3aed',
            accent: '#059669',
            background: '#ffffff',
            text: '#0f172a',
            textLight: '#ffffff'
        };
    }
    
    createTitleSlide() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        // Background
        slide.background = { fill: this.colors.primary };
        
        // Title
        slide.addText('AI Coding 2050: The Future of Software Development', {
            x: 0.5, y: 1.5, w: 9, h: 1.5,
            fontSize: 36,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            bold: true,
            align: 'center'
        });
        
        // Subtitle
        slide.addText('Exploring the revolutionary impact of artificial intelligence on programming', {
            x: 1, y: 3.2, w: 8, h: 1,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            align: 'center'
        });
        
        console.log('✓ Created title slide');
    }
    
    createOverviewSlide() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        // Background
        slide.background = { fill: this.colors.background };
        
        // Title
        slide.addText('The Evolution of AI-Assisted Development', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        // Content
        const bulletText = '• AI pair programming becomes the standard development practice\n• Intelligent code completion evolves into full feature generation\n• Automated refactoring and optimization streamline code maintenance\n• Natural language programming interfaces replace traditional coding';
        
        slide.addText(bulletText, {
            x: 0.5, y: 1.5, w: 9, h: 3,
            fontSize: 16,
            fontFace: 'Segoe UI',
            color: this.colors.text
        });
        
        console.log('✓ Created overview slide');
    }
    
    createFeaturesSlide() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        // Background
        slide.background = { fill: this.colors.background };
        
        // Title
        slide.addText('Key Features of AI Coding in 2050', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 28,
            fontFace: 'Segoe UI',
            color: this.colors.text,
            bold: true
        });
        
        // Left column
        slide.addText('Intelligent Code Generation', {
            x: 0.5, y: 1.5, w: 4, h: 0.5,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.primary,
            bold: true
        });
        
        slide.addText('AI systems generate complete applications from natural language descriptions, handling complex business logic and optimization automatically.', {
            x: 0.5, y: 2, w: 4, h: 1.5,
            fontSize: 14,
            fontFace: 'Segoe UI',
            color: this.colors.text
        });
        
        // Right column
        slide.addText('Predictive Debugging', {
            x: 5.5, y: 1.5, w: 4, h: 0.5,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.secondary,
            bold: true
        });
        
        slide.addText('Advanced AI models predict and prevent bugs before they occur, analyzing code patterns and suggesting improvements in real-time.', {
            x: 5.5, y: 2, w: 4, h: 1.5,
            fontSize: 14,
            fontFace: 'Segoe UI',
            color: this.colors.text
        });
        
        console.log('✓ Created features slide');
    }
    
    createConclusionSlide() {
        const slide = this.pres.addSlide();
        this.slideCount++;
        
        // Background
        slide.background = { fill: this.colors.accent };
        
        // Title
        slide.addText('The Future is Now', {
            x: 0.5, y: 1.5, w: 9, h: 1,
            fontSize: 32,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            bold: true,
            align: 'center'
        });
        
        // Subtitle
        slide.addText('Embrace AI-driven development and shape the future of software engineering', {
            x: 1, y: 3, w: 8, h: 1,
            fontSize: 18,
            fontFace: 'Segoe UI',
            color: this.colors.textLight,
            align: 'center'
        });
        
        console.log('✓ Created conclusion slide');
    }
    
    async generatePresentation() {
        try {
            console.log('Starting AI Coding 2050 presentation generation...');
            
            this.createTitleSlide();
            this.createOverviewSlide();
            this.createFeaturesSlide();
            this.createConclusionSlide();
            
            // Save presentation
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const filename = `ai_coding_2050_simple_${timestamp}.pptx`;
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
    const generator = new SimpleAICoding2050Generator();
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

module.exports = { SimpleAICoding2050Generator };