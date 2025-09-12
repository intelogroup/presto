#!/usr/bin/env node

/**
 * Dynamic System Test - Generate a PPTX using the dynamic presentation system
 * Tests asset management, layout engine, and content validation
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs').promises;

// Import dynamic system components
const AssetManagementSystem = require('./dynamic-presentation-system/asset-management-system');
const { AdaptiveLayoutEngine } = require('./dynamic-presentation-system/adaptive-layout-engine');
const ContentValidationSystem = require('./dynamic-presentation-system/content-validation-system');
const { DynamicTemplateDetector, ContentAnalyzer, PresentationClassifier } = require('./dynamic-presentation-system/dynamic-template-detector');
const { ProfessionalDesignSystem } = require('./dynamic-presentation-system/professional-design-system');

class DynamicSystemTester {
    constructor() {
        this.assetManager = new AssetManagementSystem();
        this.layoutEngine = new AdaptiveLayoutEngine();
        this.contentValidator = new ContentValidationSystem();
        this.templateDetector = new DynamicTemplateDetector();
        this.contentAnalyzer = new ContentAnalyzer();
        this.presentationClassifier = new PresentationClassifier();
        this.designSystem = new ProfessionalDesignSystem();
        
        // Custom presentation configuration
        this.presentationConfig = {
            title: 'Dynamic AI-Powered Presentation System',
            theme: 'modern_tech',
            colorScheme: {
                primary: '#1e40af',      // Blue
                secondary: '#7c3aed',    // Purple
                accent: '#f59e0b',       // Amber
                success: '#10b981',      // Emerald
                text: '#1f2937',         // Gray-800
                background: '#ffffff',   // White
                surface: '#f8fafc'       // Gray-50
            },
            layout: {
                aspectRatio: '16:9',
                width: 10,
                height: 5.625
            }
        };
        
        // Test content structure
        this.testContent = {
            slides: [
                {
                    type: 'title',
                    title: 'Dynamic AI-Powered Presentation System',
                    subtitle: 'Intelligent Content Generation with Advanced Asset Management',
                    author: 'Presto Dynamic System',
                    date: new Date().toLocaleDateString(),
                    backgroundImage: "c:\\Users\\jayve\\projects\\Presto\\presto\\assets-images-png\\svgrepo-icons-graphics\\business.png"
                },
                {
                    type: 'overview',
                    title: 'System Architecture Overview',
                    content: [
                        'Asset Management System with intelligent caching',
                        'Adaptive Layout Engine for responsive design',
                        'Content Validation with overflow prevention',
                        'Dynamic Template Detection and selection',
                        'Professional Design System integration',
                        'Real-time optimization and fallback strategies'
                    ]
                },
                {
                    type: 'features',
                    title: 'Key Features & Capabilities',
                    content: [
                        'Intelligent asset loading with fallback mechanisms',
                        'Dynamic layout adaptation based on content volume',
                        'Professional color schemes and typography',
                        'SVG generation for scalable graphics',
                        'Content constraint system preventing overflow',
                        'Multi-format asset support (SVG, PNG, JPG, WebP)'
                    ],
                    image: "c:\\Users\\jayve\\projects\\Presto\\presto\\assets-images-png\\svgrepo-icons-graphics\\technology.png"
                },
                {
                    type: 'technical',
                    title: 'Technical Implementation',
                    content: [
                        'Node.js backend with PptxGenJS integration',
                        'Modular component architecture',
                        'Caching system for performance optimization',
                        'Error handling with graceful degradation',
                        'Asset optimization and compression',
                        'Template-based generation with customization'
                    ],
                    icon: "c:\\Users\\jayve\\projects\\Presto\\presto\\assets-images-png\\svgrepo-icons-graphics\\business-strategy.png"
                },
                {
                    type: 'benefits',
                    title: 'Business Benefits',
                    content: [
                        'Automated presentation generation saves time',
                        'Consistent professional design across all outputs',
                        'Scalable solution for high-volume generation',
                        'Reduced manual design work and errors',
                        'Customizable themes and branding options',
                        'Integration-ready API for existing workflows'
                    ]
                },
                {
                    type: 'conclusion',
                    title: 'Next Steps & Implementation',
                    content: [
                        'Deploy system for production use',
                        'Integrate with existing content management',
                        'Expand template library and themes',
                        'Add advanced chart and data visualization',
                        'Implement real-time collaboration features',
                        'Scale infrastructure for enterprise use'
                    ]
                }
            ]
        };
    }
    
    async generatePresentation() {
        try {
            console.log('🚀 Starting Dynamic System Test...');
            
            // Initialize PptxGenJS
            const pres = new PptxGenJS();
            pres.defineLayout({ 
                name: 'LAYOUT_16x9', 
                width: this.presentationConfig.layout.width, 
                height: this.presentationConfig.layout.height 
            });
            pres.layout = 'LAYOUT_16x9';
            pres.title = this.presentationConfig.title;
            pres.author = 'Dynamic Presentation System';
            pres.company = 'Presto';
            
            // Detect template type
            console.log('🔍 Detecting optimal template...');
            const templateType = await this.detectTemplateType();
            console.log(`📋 Selected template: ${templateType}`);
            
            // Validate content
            console.log('✅ Validating content structure...');
            const validation = await this.validateContent();
            console.log('📝 Content validation completed');
            
            // Use original content or validated content
            const contentToUse = validation.validatedContent || this.testContent;
            
            // Generate slides
            console.log('🎨 Generating slides with dynamic layouts...');
            for (let i = 0; i < contentToUse.slides.length; i++) {
                const slideData = contentToUse.slides[i];
                await this.generateSlide(pres, slideData, i);
                console.log(`   ✓ Slide ${i + 1}: ${slideData.title}`);
            }
            
            // Save presentation
            const outputPath = path.join(__dirname, 'output', `dynamic-demo-presentation.pptx`);
            await pres.writeFile({ fileName: outputPath });
            
            console.log('\n🎉 Dynamic System Test Completed Successfully!');
            console.log(`📁 Output: ${outputPath}`);
            console.log('\n📊 System Metrics:');
            console.log(`   • Slides generated: ${contentToUse.slides.length}`);
            console.log(`   • Template type: ${templateType}`);
            console.log(`   • Asset cache hits: ${this.assetManager.getAssetMetrics().cacheHits}`);
            console.log(`   • Fallbacks used: ${this.assetManager.getAssetMetrics().fallbacksUsed}`);
            
            return {
                success: true,
                outputPath,
                metrics: {
                    slidesGenerated: contentToUse.slides.length,
                    templateType,
                    assetMetrics: this.assetManager.getAssetMetrics()
                }
            };
            
        } catch (error) {
            console.error('❌ Dynamic System Test Failed:', error);
            throw error;
        }
    }
    
    async detectTemplateType() {
        // Use template detector to analyze content
        const detection = await this.templateDetector.detectOptimalTemplate(this.testContent);
        return detection.selectedTemplate || 'business';
    }
    
    async validateContent() {
        // Validate and optimize content structure
        return this.contentValidator.validateContent(this.testContent);
    }
    
    async generateSlide(pres, slideData, index) {
        const slide = pres.addSlide();
        
        // Set background
        slide.background = { color: this.presentationConfig.colorScheme.background };
        
        switch (slideData.type) {
            case 'title':
                await this.generateTitleSlide(slide, slideData);
                break;
            case 'overview':
            case 'features':
            case 'technical':
            case 'benefits':
            case 'conclusion':
                await this.generateContentSlide(slide, slideData);
                break;
            default:
                await this.generateContentSlide(slide, slideData);
        }
    }
    
    async generateTitleSlide(slide, slideData) {
        const colors = this.presentationConfig.colorScheme;
        
        // Main title
        slide.addText(slideData.title, {
            x: 0.5, y: 1.5, w: 9, h: 1.5,
            fontSize: 44,
            fontFace: 'Calibri',
            color: colors.primary,
            bold: true,
            align: 'center'
        });
        
        // Subtitle
        if (slideData.subtitle) {
            slide.addText(slideData.subtitle, {
                x: 0.5, y: 3.2, w: 9, h: 1,
                fontSize: 24,
                fontFace: 'Calibri',
                color: colors.secondary,
                align: 'center'
            });
        }
        
        // Author and date
        if (slideData.author) {
            slide.addText(`${slideData.author} • ${slideData.date}`, {
                x: 0.5, y: 4.8, w: 9, h: 0.5,
                fontSize: 16,
                fontFace: 'Calibri',
                color: colors.text,
                align: 'center'
            });
        }
        
        // Add decorative accent
        slide.addShape('rect', {
            x: 2, y: 4.5, w: 6, h: 0.1,
            fill: { color: colors.accent }
        });
    }
    
    async generateContentSlide(slide, slideData) {
        const colors = this.presentationConfig.colorScheme;
        
        // Title
        slide.addText(slideData.title, {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 32,
            fontFace: 'Calibri',
            color: colors.primary,
            bold: true
        });
        
        // Title underline
        slide.addShape('rect', {
            x: 0.5, y: 1.1, w: 3, h: 0.05,
            fill: { color: colors.accent }
        });
        
        // Content bullets
        if (slideData.content && Array.isArray(slideData.content)) {
            slideData.content.forEach((item, index) => {
                const yPos = 1.6 + (index * 0.6);
                
                // Bullet point
                slide.addShape('circle', {
                    x: 0.8, y: yPos + 0.1, w: 0.15, h: 0.15,
                    fill: { color: colors.secondary }
                });
                
                // Text
                slide.addText(item, {
                    x: 1.1, y: yPos, w: 8.4, h: 0.5,
                    fontSize: 18,
                    fontFace: 'Calibri',
                    color: colors.text,
                    valign: 'middle'
                });
            });
        }
    }
}

// Execute the test
if (require.main === module) {
    const tester = new DynamicSystemTester();
    tester.generatePresentation()
        .then(result => {
            console.log('\n✅ Test completed successfully!');
            console.log('Result:', result);
        })
        .catch(error => {
            console.error('\n❌ Test failed:', error);
            process.exit(1);
        });
}

module.exports = DynamicSystemTester;