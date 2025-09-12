/**
 * Professional Design System
 * Comprehensive color schemes, typography, and layout patterns
 * Based on successful generator template patterns
 */

class ProfessionalDesignSystem {
    constructor() {
        this.colorSchemes = {
            professional: {
                primary: '2E86AB',
                secondary: 'A23B72', 
                accent: 'F18F01',
                text: '333333',
                background: 'FFFFFF',
                light: 'F8F9FA',
                dark: '212529'
            },
            modern: {
                primary: '264653',
                secondary: '2A9D8F',
                accent: 'E9C46A', 
                text: '264653',
                background: 'F4F3EE',
                light: 'FEFEFE',
                dark: '1A1A1A'
            },
            creative: {
                primary: '6A4C93',
                secondary: '1982C4',
                accent: 'FF6B6B',
                text: '2D3436',
                background: 'FFFFFF',
                light: 'F7F7F7',
                dark: '2D3436'
            },
            sustainable: {
                primary: '2E8B57',
                secondary: '4682B4',
                accent: 'FF8C00',
                text: '2F4F4F',
                background: 'FFFFFF',
                light: 'E8F5E8',
                dark: '1B4332'
            },
            corporate: {
                primary: '1F4E79',
                secondary: '70AD47',
                accent: 'FFC000',
                text: '404040',
                background: 'FFFFFF',
                light: 'F2F2F2',
                dark: '0F2027'
            }
        };

        this.typography = {
            fonts: {
                primary: 'Calibri',
                secondary: 'Segoe UI',
                fallback: 'Arial'
            },
            sizes: {
                title: 44,
                heading: 32,
                subheading: 24,
                body: 18,
                caption: 14,
                small: 12
            },
            weights: {
                light: 300,
                regular: 400,
                medium: 500,
                bold: 700
            }
        };

        this.spacing = {
            slide: {
                margin: 0.5,
                padding: 0.3,
                elementGap: 0.2
            },
            text: {
                lineHeight: 1.4,
                paragraphSpacing: 0.3
            }
        };

        this.layouts = {
            title: {
                titleArea: { x: 1, y: 1.5, w: 8, h: 1.5 },
                subtitleArea: { x: 1, y: 3.2, w: 8, h: 1 }
            },
            content: {
                titleArea: { x: 0.5, y: 0.3, w: 9, h: 0.8 },
                contentArea: { x: 0.5, y: 1.3, w: 9, h: 4 }
            },
            twoColumn: {
                titleArea: { x: 0.5, y: 0.3, w: 9, h: 0.8 },
                leftColumn: { x: 0.5, y: 1.3, w: 4.25, h: 4 },
                rightColumn: { x: 5.25, y: 1.3, w: 4.25, h: 4 }
            }
        };
    }

    /**
     * Get color scheme by name or detect from content
     */
    getColorScheme(themeName = 'professional', content = null) {
        // Auto-detect theme based on content keywords if not specified
        if (!themeName && content) {
            themeName = this.detectThemeFromContent(content);
        }
        
        return this.colorSchemes[themeName] || this.colorSchemes.professional;
    }

    /**
     * Detect appropriate theme based on content analysis
     */
    detectThemeFromContent(content) {
        const contentText = JSON.stringify(content).toLowerCase();
        
        if (contentText.includes('sustainable') || contentText.includes('green') || 
            contentText.includes('environment') || contentText.includes('eco')) {
            return 'sustainable';
        }
        
        if (contentText.includes('creative') || contentText.includes('design') || 
            contentText.includes('art') || contentText.includes('innovation')) {
            return 'creative';
        }
        
        if (contentText.includes('modern') || contentText.includes('digital') || 
            contentText.includes('technology') || contentText.includes('future')) {
            return 'modern';
        }
        
        if (contentText.includes('business') || contentText.includes('corporate') || 
            contentText.includes('financial') || contentText.includes('enterprise')) {
            return 'corporate';
        }
        
        return 'professional';
    }

    /**
     * Get typography style for specific element
     */
    getTypographyStyle(element, colorScheme) {
        const baseStyle = {
            fontFace: this.typography.fonts.primary,
            color: colorScheme.text
        };

        switch (element) {
            case 'title':
                return {
                    ...baseStyle,
                    fontSize: this.typography.sizes.title,
                    bold: true,
                    color: colorScheme.primary,
                    align: 'center'
                };
            
            case 'heading':
                return {
                    ...baseStyle,
                    fontSize: this.typography.sizes.heading,
                    bold: true,
                    color: colorScheme.primary
                };
            
            case 'subheading':
                return {
                    ...baseStyle,
                    fontSize: this.typography.sizes.subheading,
                    color: colorScheme.secondary
                };
            
            case 'body':
                return {
                    ...baseStyle,
                    fontSize: this.typography.sizes.body,
                    valign: 'top'
                };
            
            case 'caption':
                return {
                    ...baseStyle,
                    fontSize: this.typography.sizes.caption,
                    color: colorScheme.text + '80' // 50% opacity
                };
            
            default:
                return baseStyle;
        }
    }

    /**
     * Get layout configuration for slide type
     */
    getLayout(slideType) {
        return this.layouts[slideType] || this.layouts.content;
    }

    /**
     * Generate complete slide styling
     */
    generateSlideStyle(slideType, colorScheme, options = {}) {
        const layout = this.getLayout(slideType);
        const colors = this.getColorScheme(colorScheme);
        
        return {
            background: { color: colors.background },
            layout,
            colors,
            typography: {
                title: this.getTypographyStyle('title', colors),
                heading: this.getTypographyStyle('heading', colors),
                subheading: this.getTypographyStyle('subheading', colors),
                body: this.getTypographyStyle('body', colors),
                caption: this.getTypographyStyle('caption', colors)
            },
            spacing: this.spacing,
            ...options
        };
    }

    /**
     * Content constraint system for overflow protection
     */
    constrainContent(content, type = 'text', maxLength = null) {
        const constraints = {
            title: 60,
            heading: 80,
            text: 500,
            bulletPoint: 100,
            bulletList: 6
        };

        const limit = maxLength || constraints[type] || constraints.text;

        if (type === 'bulletList' && Array.isArray(content)) {
            return content.slice(0, limit).map(item => 
                this.constrainContent(item, 'bulletPoint')
            );
        }

        if (typeof content === 'string' && content.length > limit) {
            return content.substring(0, limit - 3) + '...';
        }

        return content;
    }

    /**
     * Generate professional slide with all design patterns applied
     */
    generateProfessionalSlide(pres, slideData, theme = 'professional') {
        const slide = pres.addSlide();
        const colors = this.getColorScheme(theme, slideData);
        const slideType = slideData.type || 'content';
        const style = this.generateSlideStyle(slideType, colors);

        // Apply background
        slide.background = style.background;

        // Add content based on slide type
        if (slideType === 'title') {
            this.addTitleContent(slide, slideData, style);
        } else if (slideType === 'content') {
            this.addContentSlide(slide, slideData, style);
        } else if (slideType === 'twoColumn') {
            this.addTwoColumnContent(slide, slideData, style);
        }

        return slide;
    }

    /**
     * Add title slide content
     */
    addTitleContent(slide, slideData, style) {
        const layout = style.layout;
        
        if (slideData.title) {
            slide.addText(this.constrainContent(slideData.title, 'title'), {
                ...layout.titleArea,
                ...style.typography.title
            });
        }

        if (slideData.subtitle || slideData.content) {
            const subtitle = slideData.subtitle || slideData.content;
            slide.addText(this.constrainContent(subtitle, 'heading'), {
                ...layout.subtitleArea,
                ...style.typography.subheading,
                align: 'center'
            });
        }
    }

    /**
     * Add content slide
     */
    addContentSlide(slide, slideData, style) {
        const layout = style.layout;
        
        if (slideData.title) {
            slide.addText(this.constrainContent(slideData.title, 'heading'), {
                ...layout.titleArea,
                ...style.typography.heading
            });
        }

        if (slideData.content) {
            let contentText = '';
            
            if (Array.isArray(slideData.content)) {
                const constrainedPoints = this.constrainContent(slideData.content, 'bulletList');
                contentText = constrainedPoints.map(item => `• ${item}`).join('\n');
            } else {
                contentText = this.constrainContent(slideData.content, 'text');
            }

            slide.addText(contentText, {
                ...layout.contentArea,
                ...style.typography.body
            });
        }
    }

    /**
     * Add two-column content
     */
    addTwoColumnContent(slide, slideData, style) {
        const layout = style.layout;
        
        if (slideData.title) {
            slide.addText(this.constrainContent(slideData.title, 'heading'), {
                ...layout.titleArea,
                ...style.typography.heading
            });
        }

        if (slideData.leftContent) {
            let leftText = Array.isArray(slideData.leftContent) 
                ? slideData.leftContent.map(item => `• ${item}`).join('\n')
                : slideData.leftContent;
            
            slide.addText(this.constrainContent(leftText, 'text', 250), {
                ...layout.leftColumn,
                ...style.typography.body
            });
        }

        if (slideData.rightContent) {
            let rightText = Array.isArray(slideData.rightContent) 
                ? slideData.rightContent.map(item => `• ${item}`).join('\n')
                : slideData.rightContent;
            
            slide.addText(this.constrainContent(rightText, 'text', 250), {
                ...layout.rightColumn,
                ...style.typography.body
            });
        }
    }

    /**
     * Get system information
     */
    getSystemInfo() {
        return {
            availableThemes: Object.keys(this.colorSchemes),
            availableLayouts: Object.keys(this.layouts),
            typography: this.typography,
            version: '1.0.0'
        };
    }
}

module.exports = { ProfessionalDesignSystem };