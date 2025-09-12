#!/usr/bin/env node
/**
 * Modern Sustainable Technology Presentation Generator
 * Creates a comprehensive 9-slide presentation with overflow protection
 * Based on successful mice evolution script pattern
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Content constraint system for overflow protection
class ContentConstraintSystem {
    static constrainTitle(text, maxLength = 60) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    static constrainText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    static constrainBulletPoints(points, maxPoints = 6, maxLength = 80) {
        return points.slice(0, maxPoints).map(point => 
            this.constrainText(point, maxLength)
        );
    }
}

class ModernSustainableTechGenerator {
    constructor() {
        this.colorScheme = {
            primary: '2E8B57',      // Sea Green
            secondary: '4682B4',    // Steel Blue
            accent: 'FF8C00',       // Dark Orange
            text: '2F4F4F',         // Dark Slate Gray
            background: 'FFFFFF',   // White
            lightGreen: 'E8F5E8',   // Light Green
            lightBlue: 'E6F3FF'     // Light Blue
        };
        
        // Initialize assets object for PNG icons
        this.assets = {
            lucidePng: [],
            simpleIconsPng: [],
            svgrepoIconsPng: [],
            devIconsPng: []
        };
        
        this.slideData = [
            {
                type: 'title',
                title: 'Modern Sustainable Technology',
                subtitle: 'Innovations for a Greener Future'
            },
            {
                type: 'content',
                title: 'Introduction to Sustainable Technology',
                content: [
                    'Technology designed to minimize environmental impact',
                    'Focus on renewable resources and energy efficiency',
                    'Integration of circular economy principles',
                    'Smart systems for resource optimization',
                    'Innovation driving environmental solutions'
                ]
            },
            {
                type: 'content',
                title: 'Renewable Energy Technologies',
                content: [
                    'Solar photovoltaic systems with improved efficiency',
                    'Advanced wind turbine designs and offshore farms',
                    'Hydroelectric power with minimal ecosystem impact',
                    'Geothermal energy extraction innovations',
                    'Energy storage solutions and smart grids'
                ]
            },
            {
                type: 'content',
                title: 'Green Transportation Solutions',
                content: [
                    'Electric vehicles with extended battery life',
                    'Hydrogen fuel cell technology advancement',
                    'Autonomous vehicles for optimized efficiency',
                    'Public transportation electrification',
                    'Sustainable aviation and maritime fuels'
                ]
            },
            {
                type: 'content',
                title: 'Smart Cities and IoT Integration',
                content: [
                    'Intelligent traffic management systems',
                    'Smart building automation for energy efficiency',
                    'Waste management optimization through sensors',
                    'Water conservation and quality monitoring',
                    'Air quality tracking and improvement systems'
                ]
            },
            {
                type: 'content',
                title: 'Circular Economy Technologies',
                content: [
                    'Advanced recycling and material recovery',
                    'Biodegradable materials and packaging',
                    'Industrial symbiosis and waste-to-energy',
                    'Product lifecycle optimization systems',
                    '3D printing with sustainable materials'
                ]
            },
            {
                type: 'content',
                title: 'Agricultural Innovation',
                content: [
                    'Precision farming with AI and drones',
                    'Vertical farming and controlled environments',
                    'Sustainable pest management systems',
                    'Water-efficient irrigation technologies',
                    'Alternative protein production methods'
                ]
            },
            {
                type: 'content',
                title: 'Implementation Challenges',
                content: [
                    'High initial investment and infrastructure costs',
                    'Technology adoption and user behavior change',
                    'Regulatory frameworks and policy alignment',
                    'Skills gap and workforce development needs',
                    'Integration with existing systems and processes'
                ]
            },
            {
                type: 'conclusion',
                title: 'Future Outlook',
                content: [
                    'Accelerating innovation in sustainable technologies',
                    'Increasing investment and government support',
                    'Growing consumer demand for green solutions',
                    'Integration of AI and machine learning',
                    'Collaborative global efforts for climate goals'
                ]
            }
        ];
    }
    
    async loadAvailableAssets() {
        console.log('🔄 Loading PNG assets...');
        
        // Load Lucide PNG icons
        try {
            const lucidePngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'lucide', 'general');
            if (fs.existsSync(lucidePngPath)) {
                this.assets.lucidePng = fs.readdirSync(lucidePngPath)
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
            if (fs.existsSync(simpleIconsPngPath)) {
                this.assets.simpleIconsPng = fs.readdirSync(simpleIconsPngPath)
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
            if (fs.existsSync(svgrepoIconsPngPath)) {
                this.assets.svgrepoIconsPng = fs.readdirSync(svgrepoIconsPngPath)
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
            if (fs.existsSync(devIconsPngPath)) {
                this.assets.devIconsPng = fs.readdirSync(devIconsPngPath)
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(devIconsPngPath, file));
                console.log(`✅ Loaded ${this.assets.devIconsPng.length} DevIcons PNG`);
            }
        } catch (error) {
            console.warn('Could not load DevIcons PNG:', error.message);
        }
    }

    createPresentation() {
        const pres = new PptxGenJS();
        pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
        pres.layout = 'LAYOUT_16x9';
        pres.title = 'Modern Sustainable Technology Presentation';
        
        this.slideData.forEach((slideData, index) => {
            switch(slideData.type) {
                case 'title':
                    this.addTitleSlide(pres, slideData);
                    break;
                case 'content':
                    this.addContentSlide(pres, slideData);
                    break;
                case 'conclusion':
                    this.addConclusionSlide(pres, slideData);
                    break;
            }
        });
        
        return pres;
    }
    
    addTitleSlide(pres, data) {
        const slide = pres.addSlide();
        
        // Background
        slide.background = { color: this.colorScheme.lightGreen };
        
        // Main title
        slide.addText(ContentConstraintSystem.constrainTitle(data.title, 50), {
            x: 1, y: 1.5, w: 8, h: 1.2,
            fontSize: 44, bold: true, color: this.colorScheme.primary,
            align: 'center', fontFace: 'Calibri'
        });
        
        // Subtitle
        slide.addText(ContentConstraintSystem.constrainText(data.subtitle, 80), {
            x: 1, y: 2.8, w: 8, h: 0.8,
            fontSize: 24, color: this.colorScheme.secondary,
            align: 'center', fontFace: 'Calibri'
        });
        
        // Decorative element
        slide.addShape('rect', {
            x: 2, y: 4, w: 6, h: 0.1,
            fill: { color: this.colorScheme.accent }
        });
    }
    
    addContentSlide(pres, data) {
        const slide = pres.addSlide();
        
        // Background
        slide.background = { color: this.colorScheme.background };
        
        // Title
        slide.addText(ContentConstraintSystem.constrainTitle(data.title, 60), {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 32, bold: true, color: this.colorScheme.primary,
            align: 'left', fontFace: 'Calibri'
        });
        
        // Title underline
        slide.addShape('rect', {
            x: 0.5, y: 1.1, w: 3, h: 0.05,
            fill: { color: this.colorScheme.accent }
        });
        
        // Content bullets
        const constrainedContent = ContentConstraintSystem.constrainBulletPoints(data.content, 6, 90);
        constrainedContent.forEach((point, index) => {
            slide.addText(`• ${point}`, {
                x: 0.8, y: 1.6 + (index * 0.6), w: 8.5, h: 0.5,
                fontSize: 18, color: this.colorScheme.text,
                align: 'left', fontFace: 'Calibri',
                bullet: false
            });
        });
        
        // Side accent
        slide.addShape('rect', {
            x: 9.2, y: 1.6, w: 0.3, h: constrainedContent.length * 0.6,
            fill: { color: this.colorScheme.lightBlue }
        });
    }
    
    addConclusionSlide(pres, data) {
        const slide = pres.addSlide();
        
        // Background
        slide.background = { color: this.colorScheme.lightGreen };
        
        // Title
        slide.addText(ContentConstraintSystem.constrainTitle(data.title, 50), {
            x: 1, y: 0.5, w: 8, h: 0.8,
            fontSize: 36, bold: true, color: this.colorScheme.primary,
            align: 'center', fontFace: 'Calibri'
        });
        
        // Content in a box
        slide.addShape('rect', {
            x: 1, y: 1.5, w: 8, h: 3.5,
            fill: { color: this.colorScheme.background },
            line: { color: this.colorScheme.primary, width: 2 }
        });
        
        const constrainedContent = ContentConstraintSystem.constrainBulletPoints(data.content, 5, 85);
        constrainedContent.forEach((point, index) => {
            slide.addText(`✓ ${point}`, {
                x: 1.3, y: 1.8 + (index * 0.6), w: 7.4, h: 0.5,
                fontSize: 16, color: this.colorScheme.text,
                align: 'left', fontFace: 'Calibri'
            });
        });
    }
    
    async generatePresentation() {
        try {
            await this.loadAvailableAssets();
            console.log('Creating modern sustainable technology presentation...');
            const pres = this.createPresentation();
            
            const outputPath = path.join(__dirname, 'sustainable_tech_presentation.pptx');
            await pres.writeFile({ fileName: outputPath });
            
            console.log(`Presentation saved to: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('Error generating presentation:', error);
            throw error;
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const generator = new ModernSustainableTechGenerator();
    generator.generatePresentation()
        .then(path => console.log(`Success! Presentation created at: ${path}`))
        .catch(error => console.error('Failed to create presentation:', error));
}

module.exports = ModernSustainableTechGenerator;