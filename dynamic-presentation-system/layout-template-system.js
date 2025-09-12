/**
 * Layout Template System
 * Provides predefined, tested layout templates with safe dimensions
 * Ensures consistent presentation generation across all content types
 */

class LayoutTemplateSystem {
    constructor() {
        this.templates = this.initializeTemplates();
        this.safeConstraints = this.initializeSafeConstraints();
        this.fallbackTemplate = this.createFallbackTemplate();
    }

    /**
     * Initialize all predefined layout templates
     */
    initializeTemplates() {
        return {
            // Standard presentation layouts
            titleSlide: {
                id: 'title-slide',
                name: 'Title Slide',
                dimensions: { width: 1920, height: 1080 },
                elements: {
                    title: {
                        maxLength: 80,
                        fontSize: 48,
                        position: { x: 960, y: 400 },
                        alignment: 'center',
                        bounds: { width: 1600, height: 120 }
                    },
                    subtitle: {
                        maxLength: 120,
                        fontSize: 32,
                        position: { x: 960, y: 550 },
                        alignment: 'center',
                        bounds: { width: 1400, height: 80 }
                    },
                    author: {
                        maxLength: 50,
                        fontSize: 24,
                        position: { x: 960, y: 950 },
                        alignment: 'center',
                        bounds: { width: 800, height: 40 }
                    }
                },
                safeArea: { x: 160, y: 108, width: 1600, height: 864 }
            },

            contentSlide: {
                id: 'content-slide',
                name: 'Content Slide',
                dimensions: { width: 1920, height: 1080 },
                elements: {
                    title: {
                        maxLength: 60,
                        fontSize: 36,
                        position: { x: 160, y: 150 },
                        alignment: 'left',
                        bounds: { width: 1600, height: 80 }
                    },
                    content: {
                        maxLength: 800,
                        fontSize: 24,
                        position: { x: 160, y: 280 },
                        alignment: 'left',
                        bounds: { width: 1600, height: 650 },
                        lineHeight: 1.4
                    }
                },
                safeArea: { x: 160, y: 108, width: 1600, height: 864 }
            },

            bulletSlide: {
                id: 'bullet-slide',
                name: 'Bullet Points Slide',
                dimensions: { width: 1920, height: 1080 },
                elements: {
                    title: {
                        maxLength: 60,
                        fontSize: 36,
                        position: { x: 160, y: 150 },
                        alignment: 'left',
                        bounds: { width: 1600, height: 80 }
                    },
                    bullets: {
                        maxItems: 8,
                        maxLengthPerItem: 120,
                        fontSize: 24,
                        position: { x: 200, y: 280 },
                        alignment: 'left',
                        bounds: { width: 1520, height: 650 },
                        itemSpacing: 60,
                        bulletStyle: '•'
                    }
                },
                safeArea: { x: 160, y: 108, width: 1600, height: 864 }
            },

            twoColumnSlide: {
                id: 'two-column-slide',
                name: 'Two Column Slide',
                dimensions: { width: 1920, height: 1080 },
                elements: {
                    title: {
                        maxLength: 60,
                        fontSize: 36,
                        position: { x: 160, y: 150 },
                        alignment: 'left',
                        bounds: { width: 1600, height: 80 }
                    },
                    leftColumn: {
                        maxLength: 400,
                        fontSize: 22,
                        position: { x: 160, y: 280 },
                        alignment: 'left',
                        bounds: { width: 760, height: 650 }
                    },
                    rightColumn: {
                        maxLength: 400,
                        fontSize: 22,
                        position: { x: 1000, y: 280 },
                        alignment: 'left',
                        bounds: { width: 760, height: 650 }
                    }
                },
                safeArea: { x: 160, y: 108, width: 1600, height: 864 }
            },

            imageSlide: {
                id: 'image-slide',
                name: 'Image with Caption Slide',
                dimensions: { width: 1920, height: 1080 },
                elements: {
                    title: {
                        maxLength: 60,
                        fontSize: 36,
                        position: { x: 160, y: 150 },
                        alignment: 'left',
                        bounds: { width: 1600, height: 80 }
                    },
                    image: {
                        position: { x: 960, y: 500 },
                        alignment: 'center',
                        bounds: { width: 1200, height: 500 },
                        fallbackText: '[Image Placeholder]'
                    },
                    caption: {
                        maxLength: 200,
                        fontSize: 20,
                        position: { x: 960, y: 850 },
                        alignment: 'center',
                        bounds: { width: 1200, height: 60 }
                    }
                },
                safeArea: { x: 160, y: 108, width: 1600, height: 864 }
            },

            summarySlide: {
                id: 'summary-slide',
                name: 'Summary/Conclusion Slide',
                dimensions: { width: 1920, height: 1080 },
                elements: {
                    title: {
                        maxLength: 50,
                        fontSize: 42,
                        position: { x: 960, y: 200 },
                        alignment: 'center',
                        bounds: { width: 1600, height: 100 }
                    },
                    keyPoints: {
                        maxItems: 5,
                        maxLengthPerItem: 100,
                        fontSize: 28,
                        position: { x: 960, y: 400 },
                        alignment: 'center',
                        bounds: { width: 1400, height: 500 },
                        itemSpacing: 80
                    },
                    callToAction: {
                        maxLength: 80,
                        fontSize: 24,
                        position: { x: 960, y: 900 },
                        alignment: 'center',
                        bounds: { width: 1200, height: 60 }
                    }
                },
                safeArea: { x: 160, y: 108, width: 1600, height: 864 }
            }
        };
    }

    /**
     * Initialize safe constraints for all content types
     */
    initializeSafeConstraints() {
        return {
            global: {
                maxTitleLength: 80,
                maxSubtitleLength: 120,
                maxContentLength: 1000,
                maxBulletPoints: 8,
                maxBulletLength: 120,
                maxSlidesPerPresentation: 50,
                minSlidesPerPresentation: 2
            },
            fonts: {
                minSize: 16,
                maxSize: 72,
                safeLineHeight: 1.4,
                fallbackFont: 'Arial, sans-serif'
            },
            spacing: {
                minMargin: 40,
                safeMargin: 160,
                minPadding: 20,
                safePadding: 40,
                minLineSpacing: 30,
                safeLineSpacing: 60
            },
            colors: {
                safeForeground: '#333333',
                safeBackground: '#FFFFFF',
                safeAccent: '#0066CC',
                highContrast: true
            }
        };
    }

    /**
     * Create ultra-safe fallback template
     */
    createFallbackTemplate() {
        return {
            id: 'fallback-safe',
            name: 'Ultra-Safe Fallback Template',
            dimensions: { width: 1920, height: 1080 },
            elements: {
                title: {
                    maxLength: 50,
                    fontSize: 32,
                    position: { x: 960, y: 300 },
                    alignment: 'center',
                    bounds: { width: 1200, height: 80 }
                },
                content: {
                    maxLength: 300,
                    fontSize: 20,
                    position: { x: 960, y: 500 },
                    alignment: 'center',
                    bounds: { width: 1200, height: 400 },
                    lineHeight: 1.6
                }
            },
            safeArea: { x: 360, y: 216, width: 1200, height: 648 },
            fallbackMessage: 'Content generated with safe fallback template'
        };
    }

    /**
     * Select the most appropriate template for given content
     */
    selectTemplate(contentType, contentData = {}) {
        try {
            // Analyze content to determine best template
            const analysis = this.analyzeContent(contentData);
            
            // Template selection logic
            if (analysis.isTitle) {
                return this.templates.titleSlide;
            }
            
            if (analysis.hasBullets && analysis.bulletCount <= 8) {
                return this.templates.bulletSlide;
            }
            
            if (analysis.hasImage) {
                return this.templates.imageSlide;
            }
            
            if (analysis.isSummary || analysis.isConclusion) {
                return this.templates.summarySlide;
            }
            
            if (analysis.needsTwoColumns) {
                return this.templates.twoColumnSlide;
            }
            
            // Default to content slide
            return this.templates.contentSlide;
            
        } catch (error) {
            console.warn('Template selection failed, using fallback:', error.message);
            return this.fallbackTemplate;
        }
    }

    /**
     * Analyze content to determine characteristics
     */
    analyzeContent(contentData) {
        const analysis = {
            isTitle: false,
            hasBullets: false,
            bulletCount: 0,
            hasImage: false,
            isSummary: false,
            isConclusion: false,
            needsTwoColumns: false,
            contentLength: 0
        };

        try {
            // Check if it's a title slide
            if (contentData.slideIndex === 0 || 
                (contentData.title && !contentData.content && !contentData.sections)) {
                analysis.isTitle = true;
                return analysis;
            }

            // Check for bullet points
            if (Array.isArray(contentData.content)) {
                analysis.hasBullets = true;
                analysis.bulletCount = contentData.content.length;
            } else if (contentData.bullets || contentData.items) {
                analysis.hasBullets = true;
                analysis.bulletCount = (contentData.bullets || contentData.items).length;
            }

            // Check for images
            if (contentData.image || contentData.imageUrl || contentData.media) {
                analysis.hasImage = true;
            }

            // Check for summary/conclusion keywords
            const text = (contentData.title || '') + ' ' + (contentData.content || '');
            const summaryKeywords = ['summary', 'conclusion', 'recap', 'takeaway', 'key points'];
            analysis.isSummary = summaryKeywords.some(keyword => 
                text.toLowerCase().includes(keyword)
            );

            // Check if two columns would be beneficial
            const contentLength = typeof contentData.content === 'string' ? 
                contentData.content.length : 0;
            analysis.contentLength = contentLength;
            analysis.needsTwoColumns = contentLength > 600 && !analysis.hasBullets;

            return analysis;
            
        } catch (error) {
            console.warn('Content analysis failed:', error.message);
            return analysis; // Return default analysis
        }
    }

    /**
     * Apply template constraints to content
     */
    applyTemplateConstraints(content, template) {
        try {
            const constrainedContent = { ...content };
            
            // Apply title constraints
            if (constrainedContent.title && template.elements.title) {
                constrainedContent.title = this.truncateText(
                    constrainedContent.title, 
                    template.elements.title.maxLength
                );
            }

            // Apply subtitle constraints
            if (constrainedContent.subtitle && template.elements.subtitle) {
                constrainedContent.subtitle = this.truncateText(
                    constrainedContent.subtitle, 
                    template.elements.subtitle.maxLength
                );
            }

            // Apply content constraints
            if (constrainedContent.content) {
                if (Array.isArray(constrainedContent.content) && template.elements.bullets) {
                    // Handle bullet points
                    constrainedContent.content = constrainedContent.content
                        .slice(0, template.elements.bullets.maxItems)
                        .map(item => this.truncateText(
                            String(item), 
                            template.elements.bullets.maxLengthPerItem
                        ));
                } else if (typeof constrainedContent.content === 'string' && template.elements.content) {
                    // Handle regular content
                    constrainedContent.content = this.truncateText(
                        constrainedContent.content, 
                        template.elements.content.maxLength
                    );
                }
            }

            return constrainedContent;
            
        } catch (error) {
            console.warn('Failed to apply template constraints:', error.message);
            return content; // Return original content if constraint application fails
        }
    }

    /**
     * Safely truncate text with ellipsis
     */
    truncateText(text, maxLength) {
        try {
            if (!text || typeof text !== 'string') {
                return '';
            }
            
            if (text.length <= maxLength) {
                return text;
            }
            
            // Find the last space before the limit to avoid cutting words
            const truncated = text.substring(0, maxLength - 3);
            const lastSpace = truncated.lastIndexOf(' ');
            
            if (lastSpace > maxLength * 0.7) {
                return truncated.substring(0, lastSpace) + '...';
            }
            
            return truncated + '...';
            
        } catch (error) {
            console.warn('Text truncation failed:', error.message);
            return String(text).substring(0, 50) + '...'; // Emergency fallback
        }
    }

    /**
     * Validate template dimensions and constraints
     */
    validateTemplate(template) {
        try {
            const validation = {
                isValid: true,
                errors: [],
                warnings: []
            };

            // Check required properties
            if (!template.id || !template.dimensions) {
                validation.isValid = false;
                validation.errors.push('Template missing required properties');
                return validation;
            }

            // Check dimensions
            const { width, height } = template.dimensions;
            if (!width || !height || width < 800 || height < 600) {
                validation.isValid = false;
                validation.errors.push('Invalid template dimensions');
            }

            // Check safe area
            if (template.safeArea) {
                const { x, y, width: safeWidth, height: safeHeight } = template.safeArea;
                if (x + safeWidth > width || y + safeHeight > height) {
                    validation.warnings.push('Safe area exceeds template dimensions');
                }
            }

            // Validate elements
            if (template.elements) {
                Object.entries(template.elements).forEach(([key, element]) => {
                    if (element.bounds) {
                        const { x, y, width: elemWidth, height: elemHeight } = element.bounds;
                        if (x + elemWidth > width || y + elemHeight > height) {
                            validation.warnings.push(`Element '${key}' bounds exceed template dimensions`);
                        }
                    }
                });
            }

            return validation;
            
        } catch (error) {
            return {
                isValid: false,
                errors: [`Template validation failed: ${error.message}`],
                warnings: []
            };
        }
    }

    /**
     * Get all available templates
     */
    getAvailableTemplates() {
        return Object.keys(this.templates).map(key => ({
            id: this.templates[key].id,
            name: this.templates[key].name,
            description: `Template for ${this.templates[key].name.toLowerCase()}`
        }));
    }

    /**
     * Get template by ID with fallback
     */
    getTemplate(templateId) {
        try {
            const template = Object.values(this.templates).find(t => t.id === templateId);
            return template || this.fallbackTemplate;
        } catch (error) {
            console.warn('Failed to get template:', error.message);
            return this.fallbackTemplate;
        }
    }

    /**
     * Get safe constraints
     */
    getSafeConstraints() {
        return { ...this.safeConstraints };
    }

    /**
     * Generate layout metrics for monitoring
     */
    getLayoutMetrics() {
        return {
            totalTemplates: Object.keys(this.templates).length,
            availableLayouts: this.getAvailableTemplates(),
            safeConstraints: this.safeConstraints.global,
            fallbackTemplate: this.fallbackTemplate.id,
            lastValidation: new Date().toISOString()
        };
    }
}

module.exports = LayoutTemplateSystem;