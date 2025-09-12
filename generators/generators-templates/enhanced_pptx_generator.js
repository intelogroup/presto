#!/usr/bin/env node

/**
 * Enhanced PPTX Generator - Fallback generator for server.js
 * Simple, reliable generator that can handle basic presentation requests
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs').promises;

class EnhancedPptxGenerator {
    constructor(options = {}) {
        this.options = {
            theme: options.theme || 'professional',
            enableFallbacks: options.enableFallbacks !== false,
            maxSlides: options.maxSlides || 50
        };
        
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
            creative: {
                primary: '6A4C93',
                secondary: '1982C4',
                accent: 'FF6B6B',
                text: '2D3436',
                background: 'FFFFFF'
            }
        };
        
        this.colors = this.colorSchemes[this.options.theme] || this.colorSchemes.professional;
        
        // Initialize assets object for PNG icons
        this.assets = {
            lucidePng: [],
            simpleIconsPng: [],
            svgrepoIconsPng: [],
            devIconsPng: []
        };
    }
    
    async loadAvailableAssets() {
        console.log('🔄 Loading PNG assets...');
        
        // Load Lucide PNG icons
        try {
            const lucidePngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'lucide', 'general');
            if (await this.pathExists(lucidePngPath)) {
                const files = await fs.readdir(lucidePngPath);
                this.assets.lucidePng = files
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(lucidePngPath, file));
                console.log(`✅ Loaded ${this.assets.lucidePng.length} Lucide PNG icons`);
            }
        } catch (error) {
            console.warn('Could not load Lucide PNG icons:', error.message);
        }
        
        // Load Simple Icons PNG
        try {
            const simpleIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'simpleicons', 'brand');
            if (await this.pathExists(simpleIconsPngPath)) {
                const files = await fs.readdir(simpleIconsPngPath);
                this.assets.simpleIconsPng = files
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(simpleIconsPngPath, file));
                console.log(`✅ Loaded ${this.assets.simpleIconsPng.length} Simple Icons PNG`);
            }
        } catch (error) {
            console.warn('Could not load Simple Icons PNG:', error.message);
        }
        
        // Load SVG Repo Icons PNG
        try {
            const svgrepoIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'svgrepo-icons-graphics');
            if (await this.pathExists(svgrepoIconsPngPath)) {
                const files = await fs.readdir(svgrepoIconsPngPath);
                this.assets.svgrepoIconsPng = files
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(svgrepoIconsPngPath, file));
                console.log(`✅ Loaded ${this.assets.svgrepoIconsPng.length} SVG Repo Icons PNG`);
            }
        } catch (error) {
            console.warn('Could not load SVG Repo Icons PNG:', error.message);
        }
        
        // Load DevIcons PNG
        try {
            const devIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'devicons', 'tech');
            if (await this.pathExists(devIconsPngPath)) {
                const files = await fs.readdir(devIconsPngPath);
                this.assets.devIconsPng = files
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(devIconsPngPath, file));
                console.log(`✅ Loaded ${this.assets.devIconsPng.length} DevIcons PNG`);
            }
        } catch (error) {
            console.warn('Could not load DevIcons PNG:', error.message);
        }
    }
    
    async pathExists(path) {
        try {
            await fs.access(path);
            return true;
        } catch {
            return false;
        }
    }
    
    async generatePresentation(requestData, outputPath) {
        try {
            console.log(`🎯 Enhanced generator starting with theme: ${this.options.theme}`);
            
            const pres = new PptxGenJS();
            
            // Set up presentation
            pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
            pres.layout = 'LAYOUT_16x9';
            pres.author = 'Enhanced PPTX Generator';
            pres.company = 'Presto';
            pres.subject = requestData.title || 'Generated Presentation';
            pres.title = requestData.title || 'Generated Presentation';
            
            // Process slides
            if (requestData.slides && Array.isArray(requestData.slides)) {
                for (let i = 0; i < Math.min(requestData.slides.length, this.options.maxSlides); i++) {
                    const slideData = requestData.slides[i];
                    this.addSlide(pres, slideData, i);
                }
            } else {
                // Create a default slide if no slides provided
                this.addDefaultSlide(pres, requestData);
            }
            
            // Save presentation
            await pres.writeFile({ fileName: outputPath });
            
            console.log(`✅ Enhanced generator completed: ${outputPath}`);
            return { success: true, outputPath };
            
        } catch (error) {
            console.error(`❌ Enhanced generator failed:`, error.message);
            throw error;
        }
    }
    
    addSlide(pres, slideData, index) {
        const slide = pres.addSlide();
        
        if (slideData.type === 'title') {
            this.addTitleSlide(slide, slideData);
        } else if (slideData.type === 'content') {
            this.addContentSlide(slide, slideData);
        } else {
            // Default to content slide
            this.addContentSlide(slide, slideData);
        }
    }
    
    addTitleSlide(slide, slideData) {
        // Add background
        slide.background = { color: this.colors.background };
        
        // Add title
        if (slideData.title) {
            slide.addText(slideData.title, {
                x: 1,
                y: 1.5,
                w: 8,
                h: 1.5,
                fontSize: 44,
                fontFace: 'Calibri',
                color: this.colors.primary,
                bold: true,
                align: 'center'
            });
        }
        
        // Add subtitle
        if (slideData.content || slideData.subtitle) {
            const subtitle = slideData.content || slideData.subtitle;
            slide.addText(subtitle, {
                x: 1,
                y: 3.2,
                w: 8,
                h: 1,
                fontSize: 24,
                fontFace: 'Calibri',
                color: this.colors.text,
                align: 'center'
            });
        }
    }
    
    addContentSlide(slide, slideData) {
        // Add background
        slide.background = { color: this.colors.background };
        
        // Add title
        if (slideData.title) {
            slide.addText(slideData.title, {
                x: 0.5,
                y: 0.3,
                w: 9,
                h: 0.8,
                fontSize: 32,
                fontFace: 'Calibri',
                color: this.colors.primary,
                bold: true
            });
        }
        
        // Add content
        if (slideData.content) {
            let contentText = '';
            
            if (Array.isArray(slideData.content)) {
                // Handle bullet points
                contentText = slideData.content.map(item => `• ${item}`).join('\n');
            } else {
                // Handle plain text
                contentText = slideData.content;
            }
            
            slide.addText(contentText, {
                x: 0.5,
                y: 1.3,
                w: 9,
                h: 4,
                fontSize: 18,
                fontFace: 'Calibri',
                color: this.colors.text,
                valign: 'top'
            });
        }
    }
    
    addDefaultSlide(pres, requestData) {
        const slide = pres.addSlide();
        slide.background = { color: this.colors.background };
        
        slide.addText(requestData.title || 'Generated Presentation', {
            x: 1,
            y: 2,
            w: 8,
            h: 1.5,
            fontSize: 36,
            fontFace: 'Calibri',
            color: this.colors.primary,
            bold: true,
            align: 'center'
        });
        
        slide.addText('Generated by Enhanced PPTX Generator', {
            x: 1,
            y: 3.5,
            w: 8,
            h: 0.5,
            fontSize: 16,
            fontFace: 'Calibri',
            color: this.colors.text,
            align: 'center'
        });
    }
}

module.exports = EnhancedPptxGenerator;

// CLI usage
if (require.main === module) {
    const generator = new EnhancedPptxGenerator();
    
    const testData = {
        title: 'Test Presentation',
        slides: [
            {
                type: 'title',
                title: 'Enhanced Generator Test',
                content: 'Testing the fallback generator'
            },
            {
                type: 'content',
                title: 'Test Content',
                content: ['Point 1', 'Point 2', 'Point 3']
            }
        ]
    };
    
    generator.generatePresentation(testData, 'enhanced-generator-test.pptx')
        .then(() => console.log('✅ Test completed successfully'))
        .catch(error => console.error('❌ Test failed:', error));
}