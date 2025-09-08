const PptxGenJS = require('pptxgenjs');
const fs = require('fs').promises;
const path = require('path');

class SimplePptxGenerator {
    constructor() {
        this.pptx = new PptxGenJS();
        this.setupDefaults();
    }

    setupDefaults() {
        // Set presentation properties
        this.pptx.author = 'Presto Slides - AI PowerPoint Generator';
        this.pptx.company = 'Presto Slides';
        this.pptx.subject = 'AI Generated Presentation';
        this.pptx.title = 'Presentation';
        
        // Define safe colors
        this.colors = {
            primary: '0ea5e9',
            secondary: '64748b', 
            accent: '22c55e',
            text: '1f2937',
            background: 'ffffff',
            light: 'f8fafc'
        };
    }

    sanitizeText(text, maxLength = 1000) {
        if (!text) return '';
        
        let sanitized = String(text)
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
            .replace(/[^\w\s\-_.,!?()&:;@#$%+=\[\]{}'"]/g, '') // Allow only safe characters
            .trim();

        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength - 3) + '...';
        }
        
        return sanitized;
    }

    addTitleSlide(title, subtitle) {
        const slide = this.pptx.addSlide();
        
        // Add title
        slide.addText(this.sanitizeText(title, 100), {
            x: 0.5,
            y: 2,
            w: 9,
            h: 1.5,
            fontSize: 44,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial',
            align: 'center',
            valign: 'middle'
        });

        // Add subtitle if provided
        if (subtitle) {
            slide.addText(this.sanitizeText(subtitle, 200), {
                x: 0.5,
                y: 3.5,
                w: 9,
                h: 1,
                fontSize: 20,
                color: this.colors.secondary,
                fontFace: 'Arial',
                align: 'center',
                valign: 'middle'
            });
        }

        // Add decorative line
        slide.addShape(this.pptx.shapes.RECTANGLE, {
            x: 3,
            y: 1.5,
            w: 4,
            h: 0.05,
            fill: { color: this.colors.primary },
            line: { width: 0 }
        });
    }

    addContentSlide(slideData, slideIndex) {
        const slide = this.pptx.addSlide();
        
        // Add slide title
        slide.addText(this.sanitizeText(slideData.title, 80), {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 32,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });

        // Add content based on type
        if (slideData.type === 'bullets' && slideData.bullets) {
            // Create bullet points
            const bulletText = slideData.bullets
                .slice(0, 8) // Max 8 bullets
                .map(bullet => `• ${this.sanitizeText(bullet, 150)}`)
                .join('\n');

            slide.addText(bulletText, {
                x: 0.8,
                y: 1.5,
                w: 8.5,
                h: 3.5,
                fontSize: 18,
                color: this.colors.text,
                fontFace: 'Arial',
                valign: 'top'
            });
        } else if (slideData.content) {
            // Add regular content
            slide.addText(this.sanitizeText(slideData.content, 1500), {
                x: 0.5,
                y: 1.5,
                w: 9,
                h: 3.5,
                fontSize: 18,
                color: this.colors.text,
                fontFace: 'Arial',
                valign: 'top'
            });
        }

        // Add slide number
        slide.addText(`${slideIndex + 1}`, {
            x: 9,
            y: 5,
            w: 0.5,
            h: 0.3,
            fontSize: 12,
            color: this.colors.secondary,
            fontFace: 'Arial',
            align: 'center'
        });
    }

    async generatePresentation(data, outputPath) {
        try {
            console.log('🎯 Starting simple PPTX generation...');
            
            // Validate required data
            if (!data.title) {
                throw new Error('Title is required');
            }
            
            if (!data.slides || !Array.isArray(data.slides) || data.slides.length === 0) {
                throw new Error('At least one slide is required');
            }

            // Limit slides to reasonable number
            const slides = data.slides.slice(0, 50);
            
            console.log(`Creating presentation: "${data.title}" with ${slides.length} slides`);

            // Add title slide
            this.addTitleSlide(data.title, data.subtitle);

            // Add content slides
            slides.forEach((slideData, index) => {
                this.addContentSlide(slideData, index);
            });

            // Save the presentation
            console.log(`Saving to: ${outputPath}`);
            await this.pptx.writeFile({ fileName: outputPath });
            
            console.log('✅ Simple PPTX generation completed successfully');
            
            return {
                success: true,
                path: outputPath,
                slides: slides.length + 1, // +1 for title slide
                generator: 'SimplePptxGenerator'
            };

        } catch (error) {
            console.error('❌ Simple PPTX generation failed:', error.message);
            return {
                success: false,
                error: error.message,
                generator: 'SimplePptxGenerator'
            };
        }
    }
}

module.exports = SimplePptxGenerator;
