/**
 * Dynamic Presentation Generator
 * Core presentation generation engine for PPTXGenJS
 */

const PptxGenJS = require('pptxgenjs');

class DynamicPresentationGenerator {
    constructor() {
        this.pres = null;
        this.slideCount = 0;
    }

    /**
     * Generate presentation from processed data
     * @param {Object} presentationData - Processed presentation data
     * @param {Object} options - Generation options
     * @returns {Object} Generated presentation
     */
    async generate(presentationData, options = {}) {
        try {
            // Create new presentation
            this.pres = new PptxGenJS();

            // Set presentation properties
            this.pres.title = presentationData.title || 'Generated Presentation';
            this.pres.author = presentationData.author || 'Dynamic Generator';
            this.pres.subject = presentationData.subject || '';

            // Generate slides
            const slides = presentationData.slides || [];
            for (let i = 0; i < slides.length; i++) {
                await this.addSlide(slides[i], presentationData.theme, options);
            }

            return {
                success: true,
                presentation: this.pres,
                slideCount: slides.length,
                metadata: {
                    title: presentationData.title,
                    slides: slides.length,
                    theme: presentationData.theme
                }
            };

        } catch (error) {
            console.error('Error generating presentation:', error);
            return {
                success: false,
                error: error.message,
                metadata: {}
            };
        }
    }

    /**
     * Add a slide to the presentation
     * @param {Object} slideData - Slide data
     * @param {Object} theme - Theme settings
     * @param {Object} options - Generation options
     */
    async addSlide(slideData, theme, options) {
        const slide = this.pres.addSlide();

        // Set theme/background if provided
        if (theme && theme.background) {
            slide.background = { color: theme.background };
        }

        const textColor = theme?.textColor || '#000000';
        const accentColor = theme?.accentColor || '#0066CC';

        try {
            // Add title if present
            if (slideData.title) {
                slide.addText(slideData.title, {
                    x: 0.5,
                    y: 0.3,
                    w: 9.0,
                    h: 0.8,
                    fontSize: 28,
                    bold: true,
                    color: textColor,
                    align: 'center'
                });
            }

            // Add subtitle if present
            if (slideData.subtitle) {
                slide.addText(slideData.subtitle, {
                    x: 0.5,
                    y: 1.0,
                    w: 9.0,
                    h: 0.5,
                    fontSize: 18,
                    color: textColor,
                    align: 'center'
                });
            }

            // Add content based on type
            if (slideData.content) {
                this.addContentToSlide(slide, slideData, textColor, accentColor);
            }

        } catch (error) {
            console.warn('Error adding slide content:', error);
            // Add fallback content
            slide.addText('Presentation Slide', {
                x: 0.5,
                y: 2.0,
                w: 9.0,
                h: 0.5,
                fontSize: 24,
                color: textColor,
                align: 'center'
            });
        }
    }

    /**
     * Add content to slide based on content type
     * @param {Object} slide - PPTXGenJS slide object
     * @param {Object} slideData - Slide data
     * @param {string} textColor - Text color
     * @param {string} accentColor - Accent color
     */
    addContentToSlide(slide, slideData, textColor, accentColor) {
        let yPosition = 1.5;
        const contentHeight = 2.5;

        if (slideData.type === 'bullets' && Array.isArray(slideData.content)) {
            // Add bullet points
            const bullets = slideData.content.map(item => ({
                text: item,
                options: { bullet: true }
            }));

            slide.addText(bullets, {
                x: 0.5,
                y: yPosition,
                w: 9.0,
                h: contentHeight,
                fontSize: 16,
                color: textColor,
                align: 'left',
                bullet: { style: 'bullet' }
            });

        } else if (typeof slideData.content === 'string') {
            // Add regular text
            slide.addText(slideData.content, {
                x: 0.5,
                y: yPosition,
                w: 9.0,
                h: contentHeight,
                fontSize: 18,
                color: textColor,
                align: 'left'
            });

        } else if (Array.isArray(slideData.content)) {
            // Handle array content - could be mixed media
            slideData.content.forEach((item, index) => {
                if (typeof item === 'string') {
                    slide.addText(item, {
                        x: 0.5,
                        y: yPosition + (index * 0.3),
                        w: 9.0,
                        h: 0.3,
                        fontSize: 14,
                        color: textColor,
                        align: 'left'
                    });
                }
            });
        }
    }

    /**
     * Write presentation to buffer
     * @param {string} format - Output format ('buffer' or 'stream')
     * @returns {Buffer|Stream} Presentation output
     */
    async write(format = 'buffer') {
        if (!this.pres) {
            throw new Error('No presentation generated yet');
        }

        try {
            if (format === 'buffer') {
                return await this.pres.stream();
            } else {
                throw new Error('Stream format not yet supported');
            }
        } catch (error) {
            console.error('Error writing presentation:', error);
            throw error;
        }
    }

    /**
     * Get presentation metadata
     * @returns {Object} Metadata object
     */
    getMetadata() {
        return {
            slideCount: this.slideCount || 0,
            title: this.pres?.title || 'Untitled',
            author: this.pres?.author || 'Unknown',
            format: 'PowerPoint'
        };
    }
}

module.exports = { DynamicPresentationGenerator };
