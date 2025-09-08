#!/usr/bin/env node
/**
 * Dynamic Presentation Generator for PptxGenJS
 * 
 * Comprehensive generator that adapts to user requests with intelligent defaults:
 * - Text on left, images on right layout
 * - Icons, charts, and visual elements
 * - Smart template selection based on content
 * - Advanced error handling and validation
 * - Integration with existing toolkit components
 * 
 * Author: AI Assistant
 * Version: 3.0
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs').promises;
const path = require('path');
const { EventEmitter } = require('events');

// Import existing toolkit components
const LayoutCalculator = require('./pptx-toolkit/layout-calculator');
const SmartContentFitter = require('./pptx-toolkit/content-fitter');
const PptxValidationHelper = require('./pptx-toolkit/pptx-validation-helper');

class DynamicPresentationGenerator extends EventEmitter {
    constructor(options = {}) {
        super();
        
        this.options = {
            maxSlides: options.maxSlides || 100,
            maxTextLength: options.maxTextLength || 15000,
            enableValidation: options.enableValidation !== false,
            enableFallbacks: options.enableFallbacks !== false,
            layout: options.layout || 'LAYOUT_16x9',
            colorScheme: options.colorScheme || 'professional',
            defaultTemplate: options.defaultTemplate || 'adaptive',
            ...options
        };
        
        // Initialize components
        this.layoutCalculator = new LayoutCalculator();
        this.contentFitter = new SmartContentFitter(this.options.layout);
        this.validator = new PptxValidationHelper();
        
        this.pptx = null;
        this.slideCount = 0;
        this.contentAnalysis = {};
        this.selectedTemplate = null;
        
        this.initializeGenerator();
    }

    initializeGenerator() {
        try {
            this.pptx = new PptxGenJS();
            this.setupDefaults();
            this.setupLayouts();
            this.emit('initialized');
        } catch (error) {
            this.handleError('Initialization failed', error, false);
        }
    }

    setupDefaults() {
        // Presentation properties
        this.pptx.author = this.options.author || 'Dynamic Presentation Generator';
        this.pptx.company = this.options.company || 'AI-Powered Presentations';
        this.pptx.subject = this.options.subject || 'Dynamic Presentation';
        this.pptx.title = this.options.title || 'Professional Presentation';
        this.pptx.layout = this.options.layout;

        // Enhanced color schemes
        this.colorSchemes = {
            professional: {
                primary: '1f4e79',
                secondary: '70ad47',
                accent: 'ffc000',
                text: '2f2f2f',
                lightGray: 'f2f2f2',
                darkGray: '595959',
                white: 'ffffff',
                background: 'ffffff'
            },
            modern: {
                primary: '2e86ab',
                secondary: 'a23b72',
                accent: '4caf50',
                text: '333333',
                lightGray: 'f5f5f5',
                darkGray: '666666',
                white: 'ffffff',
                background: 'ffffff'
            },
            creative: {
                primary: '8e44ad',
                secondary: 'e74c3c',
                accent: 'f39c12',
                text: '2c3e50',
                lightGray: 'ecf0f1',
                darkGray: '7f8c8d',
                white: 'ffffff',
                background: 'ffffff'
            },
            minimal: {
                primary: '000000',
                secondary: '666666',
                accent: '0066cc',
                text: '333333',
                lightGray: 'f8f9fa',
                darkGray: '6c757d',
                white: 'ffffff',
                background: 'ffffff'
            }
        };

        this.colors = this.colorSchemes[this.options.colorScheme] || this.colorSchemes.professional;

        // Font system
        this.fonts = {
            title: { face: 'Calibri', size: 44, bold: true, fallback: 'Arial' },
            subtitle: { face: 'Calibri', size: 24, fallback: 'Arial' },
            heading: { face: 'Calibri', size: 32, bold: true, fallback: 'Arial' },
            subheading: { face: 'Calibri', size: 20, bold: true, fallback: 'Arial' },
            body: { face: 'Calibri', size: 18, fallback: 'Arial' },
            caption: { face: 'Calibri', size: 14, italic: true, fallback: 'Arial' },
            small: { face: 'Calibri', size: 12, fallback: 'Arial' }
        };
    }

    setupLayouts() {
        const layout = this.layoutCalculator.getLayout(this.options.layout);
        const safeArea = layout.safeArea;

        // Define layout templates
        this.layoutTemplates = {
            // Default: Text left, images right
            textImageDefault: {
                textArea: { x: safeArea.x, y: 1.5, w: 4.5, h: 4 },
                imageArea: { x: 5.5, y: 1.5, w: 4, h: 4 },
                title: { x: safeArea.x, y: 0.3, w: safeArea.width, h: 0.8 }
            },
            
            // Full text layout
            fullText: {
                textArea: { x: safeArea.x, y: 1.5, w: safeArea.width, h: 4 },
                title: { x: safeArea.x, y: 0.3, w: safeArea.width, h: 0.8 }
            },
            
            // Image focus layout
            imageFocus: {
                imageArea: { x: safeArea.x, y: 1.0, w: 6, h: 4.5 },
                textArea: { x: 6.5, y: 1.5, w: 3, h: 4 },
                title: { x: safeArea.x, y: 0.3, w: safeArea.width, h: 0.8 }
            },
            
            // Chart layout
            chartLayout: {
                chartArea: { x: 1, y: 1.8, w: 8, h: 3.5 },
                textArea: { x: safeArea.x, y: 1.0, w: safeArea.width, h: 0.6 },
                title: { x: safeArea.x, y: 0.3, w: safeArea.width, h: 0.8 }
            },
            
            // Icon grid layout
            iconGrid: {
                gridArea: { x: 1, y: 2, w: 8, h: 3.5 },
                title: { x: safeArea.x, y: 0.3, w: safeArea.width, h: 0.8 },
                subtitle: { x: safeArea.x, y: 1.2, w: safeArea.width, h: 0.6 }
            },

            // Two column layout
            twoColumn: {
                leftColumn: { x: safeArea.x, y: 1.5, w: 4.2, h: 4 },
                rightColumn: { x: 5.2, y: 1.5, w: 4.2, h: 4 },
                title: { x: safeArea.x, y: 0.3, w: safeArea.width, h: 0.8 }
            }
        };
    }

    // Content analysis and template selection
    analyzeContent(data) {
        const analysis = {
            hasImages: false,
            hasCharts: false,
            hasIcons: false,
            hasLongText: false,
            hasBullets: false,
            hasData: false,
            contentType: 'text',
            recommendedLayout: 'textImageDefault',
            slideTypes: []
        };

        if (data.slides) {
            Object.values(data.slides).forEach(slide => {
                // Analyze content types
                if (slide.images || slide.image) analysis.hasImages = true;
                if (slide.chart || slide.chartData || slide.data) analysis.hasCharts = true;
                if (slide.icons || slide.icon) analysis.hasIcons = true;
                if (slide.bullets || slide.items) analysis.hasBullets = true;
                if (slide.table || slide.tableData) analysis.hasData = true;
                
                // Analyze text length
                const textContent = (slide.content || '') + (slide.description || '');
                if (textContent.length > 500) analysis.hasLongText = true;
                
                // Determine slide type
                if (slide.chart || slide.chartData) {
                    analysis.slideTypes.push('chart');
                } else if (slide.images || slide.image) {
                    analysis.slideTypes.push('image');
                } else if (slide.icons || slide.icon) {
                    analysis.slideTypes.push('icon');
                } else if (slide.bullets) {
                    analysis.slideTypes.push('bullet');
                } else {
                    analysis.slideTypes.push('text');
                }
            });
        }

        // Determine primary content type
        if (analysis.hasCharts) analysis.contentType = 'data';
        else if (analysis.hasImages) analysis.contentType = 'visual';
        else if (analysis.hasIcons) analysis.contentType = 'conceptual';
        else analysis.contentType = 'text';

        // Recommend layout based on analysis
        if (analysis.hasCharts) analysis.recommendedLayout = 'chartLayout';
        else if (analysis.hasImages && !analysis.hasLongText) analysis.recommendedLayout = 'imageFocus';
        else if (analysis.hasIcons) analysis.recommendedLayout = 'iconGrid';
        else if (analysis.hasLongText) analysis.recommendedLayout = 'fullText';
        else analysis.recommendedLayout = 'textImageDefault';

        this.contentAnalysis = analysis;
        return analysis;
    }

    selectTemplate(data, userTemplate = null) {
        // If user specified a template, try to use it
        if (userTemplate) {
            this.selectedTemplate = userTemplate;
            return userTemplate;
        }

        // Analyze content to determine best template
        const analysis = this.analyzeContent(data);
        
        // Template selection logic based on content analysis
        const templateMap = {
            data: 'enhanced_pptx_generator',
            visual: 'modern_sustainable_tech_presentation',
            conceptual: 'methodology_slide_generator',
            text: 'fixed_positioning_generator'
        };

        this.selectedTemplate = templateMap[analysis.contentType] || 'adaptive';
        return this.selectedTemplate;
    }

    // Enhanced slide creation methods
    createTitleSlide(data) {
        try {
            const slide = this.pptx.addSlide();
            this.slideCount++;

            // Background
            slide.background = { color: this.colors.background };

            // Main title
            const title = this.sanitizeText(data.title || 'Professional Presentation', 100);
            const titleFit = this.contentFitter.createSmartText(
                title,
                { x: 1, y: 2, w: 8, h: 1.5 },
                'title',
                { 
                    color: this.colors.primary,
                    fontFace: this.fonts.title.face,
                    bold: true,
                    align: 'center',
                    valign: 'middle'
                }
            );
            slide.addText(titleFit.text, titleFit.options);

            // Subtitle
            if (data.subtitle) {
                const subtitle = this.sanitizeText(data.subtitle, 200);
                const subtitleFit = this.contentFitter.createSmartText(
                    subtitle,
                    { x: 1, y: 4, w: 8, h: 1 },
                    'subtitle',
                    {
                        color: this.colors.secondary,
                        fontFace: this.fonts.subtitle.face,
                        align: 'center',
                        valign: 'middle'
                    }
                );
                slide.addText(subtitleFit.text, subtitleFit.options);
            }

            // Author and date
            const author = this.sanitizeText(data.author || 'AI Assistant', 50);
            const date = new Date().toLocaleDateString();
            slide.addText(`${author} | ${date}`, {
                x: 1, y: 6.5, w: 8, h: 0.5,
                ...this.fonts.caption,
                color: this.colors.darkGray,
                align: 'center'
            });

            this.addDecorativeElements(slide);
            this.emit('slideCreated', { type: 'title', index: this.slideCount });
            return slide;

        } catch (error) {
            this.handleError('Title slide creation', error);
            return this.createFallbackSlide('Title Slide Error', error.message);
        }
    }

    createAdaptiveSlide(slideData) {
        try {
            const slide = this.pptx.addSlide();
            this.slideCount++;

            const layout = this.determineSlideLayout(slideData);
            const template = this.layoutTemplates[layout];

            // Add title
            if (slideData.title) {
                const titleFit = this.contentFitter.createSmartText(
                    this.sanitizeText(slideData.title, 80),
                    template.title,
                    'heading',
                    {
                        color: this.colors.primary,
                        fontFace: this.fonts.heading.face,
                        bold: true
                    }
                );
                slide.addText(titleFit.text, titleFit.options);
            }

            // Add content based on slide type
            this.addSlideContent(slide, slideData, template);

            this.emit('slideCreated', { type: layout, index: this.slideCount });
            return slide;

        } catch (error) {
            this.handleError(`Adaptive slide creation`, error);
            return this.createFallbackSlide('Slide Error', error.message);
        }
    }

    determineSlideLayout(slideData) {
        // Determine layout based on content
        if (slideData.chart || slideData.chartData || slideData.data) {
            return 'chartLayout';
        }
        if (slideData.images && slideData.images.length > 0) {
            return 'imageFocus';
        }
        if (slideData.icons && slideData.icons.length > 0) {
            return 'iconGrid';
        }
        if (slideData.leftContent && slideData.rightContent) {
            return 'twoColumn';
        }
        if (slideData.content && slideData.content.length > 1000) {
            return 'fullText';
        }
        
        // Default layout: text left, image area right
        return 'textImageDefault';
    }

    addSlideContent(slide, slideData, template) {
        // Add main content
        if (slideData.content) {
            const contentArea = template.textArea || template.leftColumn || template.chartArea;
            const contentFit = this.contentFitter.createSmartText(
                this.sanitizeText(slideData.content, this.options.maxTextLength),
                contentArea,
                'body',
                {
                    color: this.colors.text,
                    fontFace: this.fonts.body.face,
                    valign: 'top'
                }
            );
            slide.addText(contentFit.text, contentFit.options);
        }

        // Add bullets
        if (slideData.bullets && Array.isArray(slideData.bullets)) {
            this.addBulletPoints(slide, slideData.bullets, template.textArea || template.leftColumn);
        }

        // Add images
        if (slideData.images || slideData.image) {
            this.addImages(slide, slideData.images || [slideData.image], template.imageArea || template.rightColumn);
        }

        // Add icons
        if (slideData.icons) {
            this.addIconGrid(slide, slideData.icons, template.gridArea || template.iconGrid);
        }

        // Add charts
        if (slideData.chart || slideData.chartData || slideData.data) {
            this.addChart(slide, slideData, template.chartArea || template.imageArea);
        }

        // Add two-column content
        if (slideData.leftContent && slideData.rightContent) {
            this.addTwoColumnContent(slide, slideData, template);
        }
    }

    addBulletPoints(slide, bullets, area) {
        if (!area) area = { x: 0.5, y: 1.5, w: 8.5, h: 4 };
        
        const maxBullets = 8;
        const displayBullets = bullets.slice(0, maxBullets);
        
        const bulletText = displayBullets
            .map(bullet => `• ${this.sanitizeText(bullet, 150)}`)
            .join('\n\n');

        const bulletFit = this.contentFitter.createSmartText(
            bulletText,
            area,
            'body',
            {
                color: this.colors.text,
                fontFace: this.fonts.body.face,
                valign: 'top',
                lineSpacing: 24
            }
        );
        slide.addText(bulletFit.text, bulletFit.options);
    }

    addImages(slide, images, area) {
        if (!area) area = { x: 5.5, y: 1.5, w: 4, h: 4 };
        
        // For now, add a placeholder for images since we need actual image files
        slide.addShape('rect', {
            x: area.x, y: area.y, w: area.w, h: area.h,
            fill: { color: this.colors.lightGray },
            line: { color: this.colors.darkGray, width: 2 }
        });

        slide.addText('📷 Image Area', {
            x: area.x, y: area.y + area.h/2 - 0.3, w: area.w, h: 0.6,
            fontSize: 24,
            color: this.colors.darkGray,
            align: 'center',
            valign: 'middle'
        });

        // Add image description if provided
        if (images[0] && typeof images[0] === 'object' && images[0].description) {
            slide.addText(this.sanitizeText(images[0].description, 100), {
                x: area.x, y: area.y + area.h + 0.1, w: area.w, h: 0.4,
                fontSize: 12,
                color: this.colors.darkGray,
                align: 'center',
                italic: true
            });
        }
    }

    addIconGrid(slide, icons, area) {
        if (!area) area = { x: 1, y: 2, w: 8, h: 3.5 };
        
        const maxIcons = 9; // 3x3 grid
        const displayIcons = icons.slice(0, maxIcons);
        const cols = Math.min(3, displayIcons.length);
        const rows = Math.ceil(displayIcons.length / cols);
        
        const cellWidth = area.w / cols;
        const cellHeight = area.h / rows;

        displayIcons.forEach((icon, index) => {
            const row = Math.floor(index / cols);
            const col = index % cols;
            const x = area.x + (col * cellWidth);
            const y = area.y + (row * cellHeight);

            // Icon background
            slide.addShape('circle', {
                x: x + cellWidth/2 - 0.4, y: y + 0.2, w: 0.8, h: 0.8,
                fill: { color: this.colors.accent },
                line: { color: this.colors.primary, width: 2 }
            });

            // Icon symbol (emoji or text)
            const iconSymbol = typeof icon === 'object' ? icon.symbol || icon.icon || '●' : icon;
            slide.addText(iconSymbol, {
                x: x + cellWidth/2 - 0.4, y: y + 0.2, w: 0.8, h: 0.8,
                fontSize: 24,
                color: this.colors.white,
                align: 'center',
                valign: 'middle'
            });

            // Icon label
            const label = typeof icon === 'object' ? icon.label || icon.text || 'Item' : 'Item';
            slide.addText(this.sanitizeText(label, 30), {
                x: x, y: y + 1.2, w: cellWidth, h: 0.4,
                fontSize: 14,
                color: this.colors.text,
                align: 'center',
                bold: true
            });
        });
    }

    addChart(slide, slideData, area) {
        if (!area) area = { x: 1, y: 1.8, w: 8, h: 3.5 };
        
        const chartData = slideData.chartData || slideData.data || slideData.chart;
        
        if (chartData && chartData.values && Array.isArray(chartData.values)) {
            // Simple bar chart visualization
            const values = chartData.values.slice(0, 10);
            const maxValue = Math.max(...values.filter(v => typeof v === 'number'));
            
            if (maxValue > 0) {
                values.forEach((value, index) => {
                    if (typeof value === 'number' && value > 0) {
                        const barHeight = (value / maxValue) * (area.h - 0.5);
                        const barWidth = (area.w - 1) / values.length * 0.8;
                        const x = area.x + 0.5 + (index * (area.w - 1) / values.length);
                        const y = area.y + area.h - barHeight - 0.3;

                        // Bar
                        slide.addShape('rect', {
                            x: x, y: y, w: barWidth, h: barHeight,
                            fill: { color: this.colors.accent },
                            line: { color: this.colors.primary, width: 1 }
                        });

                        // Value label
                        slide.addText(String(value), {
                            x: x - 0.2, y: y - 0.3, w: barWidth + 0.4, h: 0.25,
                            fontSize: 10,
                            color: this.colors.text,
                            align: 'center'
                        });
                    }
                });
            }
        } else {
            // Placeholder for chart
            slide.addShape('rect', {
                x: area.x, y: area.y, w: area.w, h: area.h,
                fill: { color: this.colors.lightGray },
                line: { color: this.colors.darkGray, width: 2 }
            });

            slide.addText('📊 Chart Area', {
                x: area.x, y: area.y + area.h/2 - 0.3, w: area.w, h: 0.6,
                fontSize: 24,
                color: this.colors.darkGray,
                align: 'center',
                valign: 'middle'
            });
        }
    }

    addTwoColumnContent(slide, slideData, template) {
        // Left column
        if (slideData.leftContent) {
            const leftFit = this.contentFitter.createSmartText(
                this.sanitizeText(slideData.leftContent, 800),
                template.leftColumn,
                'body',
                {
                    color: this.colors.text,
                    fontFace: this.fonts.body.face,
                    valign: 'top'
                }
            );
            slide.addText(leftFit.text, leftFit.options);
        }

        // Right column
        if (slideData.rightContent) {
            const rightFit = this.contentFitter.createSmartText(
                this.sanitizeText(slideData.rightContent, 800),
                template.rightColumn,
                'body',
                {
                    color: this.colors.text,
                    fontFace: this.fonts.body.face,
                    valign: 'top'
                }
            );
            slide.addText(rightFit.text, rightFit.options);
        }
    }

    addDecorativeElements(slide) {
        try {
            // Top accent line
            slide.addShape('rect', {
                x: 0, y: 0, w: 10, h: 0.08,
                fill: { color: this.colors.accent },
                line: { width: 0 }
            });

            // Bottom accent line
            slide.addShape('rect', {
                x: 0, y: 5.545, w: 10, h: 0.08,
                fill: { color: this.colors.accent },
                line: { width: 0 }
            });
        } catch (error) {
            this.handleError('Decorative elements', error);
        }
    }

    createFallbackSlide(title, message) {
        try {
            const slide = this.pptx.addSlide();
            this.slideCount++;

            slide.addText(title, {
                x: 1, y: 2, w: 8, h: 1,
                ...this.fonts.heading,
                color: this.colors.primary,
                align: 'center'
            });

            slide.addText(`Error: ${message}`, {
                x: 1, y: 3.5, w: 8, h: 2,
                ...this.fonts.body,
                color: this.colors.text,
                align: 'center',
                wrap: true
            });

            return slide;
        } catch (error) {
            console.error('Failed to create fallback slide:', error);
            return null;
        }
    }

    sanitizeText(text, maxLength = null) {
        if (!text) return '';
        
        let sanitized = String(text)
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
            .replace(/[\uFFFD\uFFFE\uFFFF]/g, '')
            .trim();
            
        if (maxLength && sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength - 3) + '...';
        }
        
        return sanitized;
    }

    handleError(context, error, recoverable = true) {
        const errorInfo = {
            context,
            message: error.message,
            timestamp: new Date().toISOString(),
            recoverable
        };
        
        this.emit('error', errorInfo);
        
        if (!recoverable) {
            throw error;
        }
        
        console.warn(`⚠️  ${context}: ${error.message}`);
    }

    // Main generation method
    async generatePresentation(data, outputPath = 'dynamic_presentation.pptx') {
        const startTime = Date.now();
        
        try {
            this.emit('generationStarted', { outputPath });

            // Validate input if enabled
            if (this.options.enableValidation) {
                const validation = this.validateData(data);
                if (!validation.valid && !this.options.enableFallbacks) {
                    throw new Error(`Data validation failed: ${validation.errors.join(', ')}`);
                }
            }

            // Analyze content and select template
            const analysis = this.analyzeContent(data);
            const template = this.selectTemplate(data, data.template);

            console.log(`🎯 Content Analysis: ${analysis.contentType} content detected`);
            console.log(`📋 Template Selected: ${template}`);
            console.log(`🎨 Layout Strategy: ${analysis.recommendedLayout}`);

            // Reset counters
            this.slideCount = 0;

            // Create slides
            if (data.slides) {
                // Title slide
                if (data.slides.title || data.title) {
                    this.createTitleSlide(data.slides.title || { title: data.title, subtitle: data.subtitle, author: data.author });
                }

                // Content slides
                const contentSlides = Object.entries(data.slides).filter(([key]) => key !== 'title');
                
                for (const [key, slideData] of contentSlides) {
                    if (slideData) {
                        this.createAdaptiveSlide(slideData);
                    }
                }
            } else if (data.content || data.text) {
                // Simple text-based generation
                this.createTitleSlide({ title: data.title || 'Presentation' });
                this.createAdaptiveSlide({ 
                    title: 'Content',
                    content: data.content || data.text
                });
            }

            // Ensure at least one slide exists
            if (this.slideCount === 0) {
                this.createTitleSlide({ title: 'Dynamic Presentation' });
                this.createAdaptiveSlide({
                    title: 'Default Content',
                    content: 'This presentation was generated with the Dynamic Presentation Generator. Provide content data to customize slides.',
                    icons: ['💡', '🎯', '✨']
                });
            }

            // Create output directory if needed
            const outputDir = path.dirname(outputPath);
            await fs.mkdir(outputDir, { recursive: true });

            // Save presentation
            await this.pptx.writeFile({ fileName: outputPath });

            const duration = Date.now() - startTime;
            const stats = {
                outputPath,
                slideCount: this.slideCount,
                duration,
                template: this.selectedTemplate,
                contentType: analysis.contentType,
                layout: analysis.recommendedLayout
            };

            this.emit('generationCompleted', stats);

            console.log(`✅ Dynamic presentation generated successfully!`);
            console.log(`📁 Output: ${outputPath}`);
            console.log(`📊 Slides: ${this.slideCount}`);
            console.log(`⏱️  Duration: ${duration}ms`);
            console.log(`🎨 Theme: ${this.options.colorScheme}`);

            return stats;

        } catch (error) {
            this.handleError('Presentation generation', error, false);
            throw error;
        }
    }

    validateData(data) {
        const errors = [];
        const warnings = [];

        if (!data || typeof data !== 'object') {
            errors.push('Data must be a valid object');
            return { valid: false, errors, warnings };
        }

        // Validate slides if present
        if (data.slides && typeof data.slides === 'object') {
            const slideCount = Object.keys(data.slides).length;
            if (slideCount > this.options.maxSlides) {
                errors.push(`Too many slides: ${slideCount} > ${this.options.maxSlides}`);
            }
        }

        return { valid: errors.length === 0, errors, warnings };
    }

    // Utility methods
    getContentAnalysis() {
        return this.contentAnalysis;
    }

    getSupportedLayouts() {
        return Object.keys(this.layoutTemplates);
    }

    getAvailableColorSchemes() {
        return Object.keys(this.colorSchemes);
    }
}

module.exports = DynamicPresentationGenerator;

// Example usage and testing
if (require.main === module) {
    async function demonstrateDynamicGenerator() {
        console.log('🚀 Dynamic Presentation Generator Demo');
        console.log('���'.repeat(50));

        const generator = new DynamicPresentationGenerator({
            colorScheme: 'professional',
            layout: 'LAYOUT_16x9',
            enableValidation: true
        });

        // Demo data showcasing various features
        const demoData = {
            title: 'Dynamic Presentation Generator',
            subtitle: 'Adaptive Layouts with Intelligent Content Analysis',
            author: 'AI Assistant',
            template: 'adaptive',
            slides: {
                title: {
                    title: 'Dynamic Presentation Generator',
                    subtitle: 'Adaptive Layouts • Smart Content Fitting • Multiple Templates',
                    author: 'Dynamic AI Assistant'
                },
                
                overview: {
                    title: 'Key Features Overview',
                    bullets: [
                        'Intelligent content analysis and template selection',
                        'Default layout: text on left, images on right',
                        'Automatic icon grids and chart visualizations',
                        'Smart text fitting and overflow protection',
                        'Multiple color schemes and themes',
                        'Error handling with graceful fallbacks'
                    ]
                },

                textImage: {
                    title: 'Text and Image Layout (Default)',
                    content: 'This slide demonstrates the default layout with text on the left side and image area on the right. The Dynamic Presentation Generator automatically detects content types and applies the most appropriate layout template.',
                    images: [{ description: 'Placeholder for user images' }]
                },

                icons: {
                    title: 'Icon Grid Demonstration',
                    content: 'Icons are automatically arranged in a responsive grid layout.',
                    icons: [
                        { symbol: '🎯', label: 'Precision' },
                        { symbol: '⚡', label: 'Speed' },
                        { symbol: '🛡️', label: 'Reliability' },
                        { symbol: '🎨', label: 'Design' },
                        { symbol: '📊', label: 'Analytics' },
                        { symbol: '🔧', label: 'Tools' }
                    ]
                },

                chart: {
                    title: 'Data Visualization',
                    content: 'Charts are automatically generated from data arrays.',
                    chartData: {
                        values: [85, 92, 78, 96, 88, 94, 82, 90]
                    }
                },

                twoColumn: {
                    title: 'Two-Column Comparison',
                    leftContent: 'Traditional Generators:\n\n• Fixed layouts only\n• Manual positioning required\n• Limited error handling\n• Static templates\n• No content analysis\n• Basic styling options',
                    rightContent: 'Dynamic Generator:\n\n• Adaptive layouts\n• Automatic positioning\n• Comprehensive error handling\n• Intelligent template selection\n• Advanced content analysis\n• Rich styling and themes'
                },

                capabilities: {
                    title: 'Advanced Capabilities',
                    content: 'The Dynamic Presentation Generator integrates multiple advanced components:\n\n• Layout Calculator for precise positioning\n• Smart Content Fitter for automatic text sizing\n• Validation Helper for error prevention\n• Template Selection based on content analysis\n• Multiple layout templates (text-image, full-text, image-focus, chart, icon-grid, two-column)\n• Professional color schemes and typography\n• Graceful error handling and fallback mechanisms'
                }
            }
        };

        try {
            const stats = await generator.generatePresentation(demoData, 'dynamic_presentation_demo.pptx');
            
            console.log('\n🎉 Demo presentation created successfully!');
            console.log('\n📊 Generation Statistics:');
            console.log(`   Slides: ${stats.slideCount}`);
            console.log(`   Template: ${stats.template}`);
            console.log(`   Content Type: ${stats.contentType}`);
            console.log(`   Layout: ${stats.layout}`);
            console.log(`   Duration: ${stats.duration}ms`);
            
            console.log('\n🎯 Demonstrated Features:');
            console.log('   ✅ Intelligent content analysis');
            console.log('   ✅ Adaptive layout selection');
            console.log('   ✅ Text-image default layout');
            console.log('   ✅ Icon grid arrangements');
            console.log('   ✅ Chart visualizations');
            console.log('   ✅ Two-column layouts');
            console.log('   ✅ Smart text fitting');
            console.log('   ✅ Professional styling');

        } catch (error) {
            console.error('❌ Demo failed:', error.message);
        }
    }

    demonstrateDynamicGenerator();
}
