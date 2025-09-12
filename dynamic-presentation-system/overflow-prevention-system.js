/**
 * Enhanced Overflow Prevention System
 * Addresses content overflow issues that plagued the original dynamic system
 * Built on lessons learned from AI template success patterns
 */
class OverflowPreventionSystem {
    constructor() {
        // Safe content boundaries based on PowerPoint slide dimensions (10" x 7.5")
        this.SAFE_BOUNDARIES = {
            slide: { width: 10, height: 7.5 }, // inches
            margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
            
            // Character limits per layout element (empirically tested)
            limits: {
                title: { maxChars: 60, maxLines: 2, fontSize: 36 },
                subtitle: { maxChars: 80, maxLines: 2, fontSize: 24 },
                heading: { maxChars: 50, maxLines: 1, fontSize: 24 },
                paragraph: { maxChars: 400, maxLines: 8, fontSize: 14 },
                bulletItem: { maxChars: 80, maxLines: 2, fontSize: 16 },
                bulletList: { maxItems: 8, totalChars: 640 }
            }
        };
        
        // Font metrics for accurate text measurement
        this.FONT_METRICS = {
            // Average character width in inches for common fonts
            'Calibri': {
                12: 0.07, 14: 0.08, 16: 0.09, 18: 0.10, 24: 0.14, 36: 0.20, 48: 0.27
            },
            'Arial': {
                12: 0.07, 14: 0.08, 16: 0.09, 18: 0.10, 24: 0.14, 36: 0.21, 48: 0.28
            }
        };
        
        this.DEFAULT_FONT = 'Calibri';
    }

    /**
     * Main overflow prevention method
     * Ensures content fits within safe boundaries
     */
    preventOverflow(content, layoutType, dimensions = null) {
        try {
            const safeContent = this.applySafeConstraints(content, layoutType);
            
            if (dimensions) {
                return this.validateDimensions(safeContent, layoutType, dimensions);
            }
            
            return safeContent;
        } catch (error) {
            console.warn('Overflow prevention failed, using fallback:', error.message);
            return this.createFallbackContent(layoutType);
        }
    }

    /**
     * Apply safe content constraints based on layout type
     */
    applySafeConstraints(content, layoutType) {
        switch (layoutType) {
            case 'title':
                return this.constrainTitleContent(content);
            case 'subtitle':
                return this.constrainSubtitleContent(content);
            case 'heading':
                return this.constrainHeadingContent(content);
            case 'paragraph':
                return this.constrainParagraphContent(content);
            case 'bullets':
                return this.constrainBulletContent(content);
            case 'image_caption':
                return this.constrainCaptionContent(content);
            default:
                return this.constrainGenericContent(content);
        }
    }

    /**
     * Title content constraints
     */
    constrainTitleContent(content) {
        if (!content || typeof content !== 'string') {
            return 'Presentation Title';
        }
        
        const limits = this.SAFE_BOUNDARIES.limits.title;
        const cleaned = this.cleanText(content);
        
        if (cleaned.length <= limits.maxChars) {
            return cleaned;
        }
        
        // Smart truncation at word boundaries
        return this.smartTruncate(cleaned, limits.maxChars, true);
    }

    /**
     * Subtitle content constraints
     */
    constrainSubtitleContent(content) {
        if (!content || typeof content !== 'string') {
            return '';
        }
        
        const limits = this.SAFE_BOUNDARIES.limits.subtitle;
        const cleaned = this.cleanText(content);
        
        return cleaned.length <= limits.maxChars 
            ? cleaned 
            : this.smartTruncate(cleaned, limits.maxChars, false);
    }

    /**
     * Heading content constraints
     */
    constrainHeadingContent(content) {
        if (!content || typeof content !== 'string') {
            return 'Section Heading';
        }
        
        const limits = this.SAFE_BOUNDARIES.limits.heading;
        const cleaned = this.cleanText(content);
        
        return cleaned.length <= limits.maxChars 
            ? cleaned 
            : this.smartTruncate(cleaned, limits.maxChars, true);
    }

    /**
     * Paragraph content constraints
     */
    constrainParagraphContent(content) {
        if (!content || typeof content !== 'string') {
            return 'Content will be displayed here.';
        }
        
        const limits = this.SAFE_BOUNDARIES.limits.paragraph;
        const cleaned = this.cleanText(content);
        
        if (cleaned.length <= limits.maxChars) {
            return cleaned;
        }
        
        // For paragraphs, try to break at sentence boundaries
        return this.smartTruncateAtSentence(cleaned, limits.maxChars);
    }

    /**
     * Bullet point content constraints
     */
    constrainBulletContent(content) {
        if (!Array.isArray(content)) {
            if (typeof content === 'string') {
                content = [content];
            } else {
                return ['Key point will be displayed here'];
            }
        }
        
        const limits = this.SAFE_BOUNDARIES.limits.bulletList;
        const constrainedBullets = [];
        let totalChars = 0;
        
        for (let i = 0; i < Math.min(content.length, limits.maxItems); i++) {
            const bullet = content[i];
            const bulletText = typeof bullet === 'string' ? bullet : 
                             bullet?.text || bullet?.content || `Point ${i + 1}`;
            
            const cleaned = this.cleanText(bulletText);
            const itemLimit = this.SAFE_BOUNDARIES.limits.bulletItem.maxChars;
            
            const constrainedBullet = cleaned.length <= itemLimit 
                ? cleaned 
                : this.smartTruncate(cleaned, itemLimit, false);
            
            // Check total character limit
            if (totalChars + constrainedBullet.length <= limits.totalChars) {
                constrainedBullets.push(constrainedBullet);
                totalChars += constrainedBullet.length;
            } else {
                break;
            }
        }
        
        // Ensure at least one bullet point
        if (constrainedBullets.length === 0) {
            constrainedBullets.push('Key information');
        }
        
        return constrainedBullets;
    }

    /**
     * Image caption constraints
     */
    constrainCaptionContent(content) {
        if (!content || typeof content !== 'string') {
            return '';
        }
        
        const cleaned = this.cleanText(content);
        const maxChars = 100; // Captions should be brief
        
        return cleaned.length <= maxChars 
            ? cleaned 
            : this.smartTruncate(cleaned, maxChars, false);
    }

    /**
     * Generic content constraints
     */
    constrainGenericContent(content) {
        if (!content) return '';
        
        if (typeof content === 'string') {
            return this.constrainParagraphContent(content);
        }
        
        if (Array.isArray(content)) {
            return this.constrainBulletContent(content);
        }
        
        return String(content).substring(0, 200);
    }

    /**
     * Validate content fits within specific dimensions
     */
    validateDimensions(content, layoutType, dimensions) {
        const { x, y, w, h, fontSize = 14 } = dimensions;
        
        // Calculate available space
        const availableWidth = w;
        const availableHeight = h;
        
        // Estimate text dimensions
        const estimatedDimensions = this.estimateTextDimensions(
            content, fontSize, this.DEFAULT_FONT
        );
        
        // Check if content fits
        if (estimatedDimensions.width <= availableWidth && 
            estimatedDimensions.height <= availableHeight) {
            return content;
        }
        
        // Content doesn't fit, apply more aggressive constraints
        return this.fitContentToDimensions(content, layoutType, dimensions);
    }

    /**
     * Fit content to specific dimensions
     */
    fitContentToDimensions(content, layoutType, dimensions) {
        const { w, h, fontSize = 14 } = dimensions;
        
        // Calculate maximum characters that can fit
        const charWidth = this.getCharWidth(fontSize, this.DEFAULT_FONT);
        const lineHeight = fontSize * 1.2 / 72; // Convert to inches
        
        const maxCharsPerLine = Math.floor(w / charWidth);
        const maxLines = Math.floor(h / lineHeight);
        const maxTotalChars = maxCharsPerLine * maxLines;
        
        if (typeof content === 'string') {
            return this.smartTruncate(content, maxTotalChars, false);
        }
        
        if (Array.isArray(content)) {
            // For bullet lists, reduce items to fit
            const maxItems = Math.max(1, Math.floor(maxLines * 0.8)); // Leave some spacing
            const maxCharsPerItem = Math.floor(maxTotalChars / maxItems);
            
            return content.slice(0, maxItems).map(item => {
                const text = typeof item === 'string' ? item : String(item);
                return this.smartTruncate(text, maxCharsPerItem, false);
            });
        }
        
        return this.smartTruncate(String(content), maxTotalChars, false);
    }

    /**
     * Estimate text dimensions
     */
    estimateTextDimensions(content, fontSize, fontFamily) {
        const charWidth = this.getCharWidth(fontSize, fontFamily);
        const lineHeight = fontSize * 1.2 / 72; // Convert to inches
        
        if (typeof content === 'string') {
            const lines = content.split('\n');
            const maxLineLength = Math.max(...lines.map(line => line.length));
            
            return {
                width: maxLineLength * charWidth,
                height: lines.length * lineHeight
            };
        }
        
        if (Array.isArray(content)) {
            const totalChars = content.reduce((sum, item) => {
                return sum + String(item).length;
            }, 0);
            
            return {
                width: Math.max(...content.map(item => String(item).length)) * charWidth,
                height: content.length * lineHeight
            };
        }
        
        return { width: 0, height: 0 };
    }

    /**
     * Get character width for font and size
     */
    getCharWidth(fontSize, fontFamily) {
        const metrics = this.FONT_METRICS[fontFamily] || this.FONT_METRICS[this.DEFAULT_FONT];
        
        // Find closest font size
        const availableSizes = Object.keys(metrics).map(Number).sort((a, b) => a - b);
        let closestSize = availableSizes[0];
        
        for (const size of availableSizes) {
            if (Math.abs(size - fontSize) < Math.abs(closestSize - fontSize)) {
                closestSize = size;
            }
        }
        
        return metrics[closestSize];
    }

    /**
     * Clean text content
     */
    cleanText(text) {
        if (!text || typeof text !== 'string') return '';
        
        return text
            .replace(/[\r\n\t]+/g, ' ') // Replace line breaks and tabs with spaces
            .replace(/\s+/g, ' ') // Collapse multiple spaces
            .trim();
    }

    /**
     * Smart truncation at word boundaries
     */
    smartTruncate(text, maxLength, preserveWords = true) {
        if (!text || text.length <= maxLength) return text;
        
        if (!preserveWords) {
            return text.substring(0, maxLength - 3) + '...';
        }
        
        const truncated = text.substring(0, maxLength - 3);
        const lastSpace = truncated.lastIndexOf(' ');
        
        // If we can find a good word boundary (not too far back)
        if (lastSpace > maxLength * 0.7) {
            return truncated.substring(0, lastSpace) + '...';
        }
        
        return truncated + '...';
    }

    /**
     * Smart truncation at sentence boundaries
     */
    smartTruncateAtSentence(text, maxLength) {
        if (!text || text.length <= maxLength) return text;
        
        const sentences = text.split(/[.!?]+/);
        let result = '';
        
        for (const sentence of sentences) {
            const trimmed = sentence.trim();
            if (!trimmed) continue;
            
            const withPunctuation = trimmed + '.';
            
            if ((result + withPunctuation).length <= maxLength - 3) {
                result += (result ? ' ' : '') + withPunctuation;
            } else {
                break;
            }
        }
        
        return result || this.smartTruncate(text, maxLength, true);
    }

    /**
     * Create fallback content when constraints fail
     */
    createFallbackContent(layoutType) {
        const fallbacks = {
            title: 'Presentation',
            subtitle: 'Generated Content',
            heading: 'Section',
            paragraph: 'Content will be displayed here.',
            bullets: ['Key information'],
            image_caption: 'Image',
            generic: 'Content'
        };
        
        return fallbacks[layoutType] || fallbacks.generic;
    }

    /**
     * Validate layout configuration
     */
    validateLayout(layout) {
        const errors = [];
        
        if (!layout.x || layout.x < 0 || layout.x > this.SAFE_BOUNDARIES.slide.width) {
            errors.push('Invalid x position');
        }
        
        if (!layout.y || layout.y < 0 || layout.y > this.SAFE_BOUNDARIES.slide.height) {
            errors.push('Invalid y position');
        }
        
        if (!layout.w || layout.w <= 0 || layout.x + layout.w > this.SAFE_BOUNDARIES.slide.width) {
            errors.push('Invalid width or exceeds slide boundary');
        }
        
        if (!layout.h || layout.h <= 0 || layout.y + layout.h > this.SAFE_BOUNDARIES.slide.height) {
            errors.push('Invalid height or exceeds slide boundary');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Get safe layout recommendations
     */
    getSafeLayoutRecommendations() {
        return {
            titleSlide: {
                title: { x: 1, y: 1.5, w: 8, h: 1.2, fontSize: 36 },
                subtitle: { x: 1, y: 2.8, w: 8, h: 0.8, fontSize: 24 }
            },
            contentSlide: {
                title: { x: 0.5, y: 0.3, w: 6, h: 0.8, fontSize: 24 },
                content: { x: 0.5, y: 1.3, w: 6, h: 3.5, fontSize: 14 },
                image: { x: 7, y: 1.3, w: 2.5, h: 3.5 }
            },
            bulletSlide: {
                title: { x: 0.5, y: 0.3, w: 9, h: 0.8, fontSize: 24 },
                bullets: { x: 0.5, y: 1.3, w: 9, h: 4, fontSize: 16 }
            }
        };
    }

    /**
     * Get overflow prevention statistics
     */
    getPreventionStats() {
        return {
            safeBoundaries: this.SAFE_BOUNDARIES,
            fontMetrics: this.FONT_METRICS,
            recommendedLayouts: this.getSafeLayoutRecommendations()
        };
    }
}

module.exports = OverflowPreventionSystem;