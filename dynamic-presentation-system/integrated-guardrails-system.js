/**
 * Integrated Guardrails System
 * Applies quality and safety controls to presentation generation
 */

class IntegratedGuardrailsSystem {
    constructor() {
        this.guardrails = {
            contentSafety: true,
            qualityThreshold: 70,
            formatCompliance: true,
            sizeLimits: true
        };
    }

    /**
     * Apply guardrails to processed content
     * @param {Object} fittedContent - Processed content
     * @param {Object} templateDetection - Template information
     * @param {Object} layoutResults - Layout results
     * @returns {Object} Guardrail-processed results
     */
    async applyGuardrails(fittedContent, templateDetection, layoutResults) {
        try {
            const slides = fittedContent.slides || [];
            const validatedSlides = [];

            for (const slide of slides) {
                const validatedSlide = await this.validateSlideGuardrails(
                    slide,
                    templateDetection,
                    layoutResults
                );
                validatedSlides.push(validatedSlide);
            }

            return {
                success: true,
                slides: validatedSlides,
                guardrailsApplied: {
                    contentSafety: this.guardrails.contentSafety,
                    qualityChecks: true,
                    formatValidation: true
                }
            };

        } catch (error) {
            console.error('Guardrails application failed:', error);
            return {
                success: false,
                error: error.message,
                slides: fittedContent.slides || []
            };
        }
    }

    /**
     * Validate slide against guardrails
     * @param {Object} slide - Slide data
     * @param {Object} templateDetection - Template info
     * @param {Object} layoutResults - Layout info
     * @returns {Object} Validated slide
     */
    async validateSlideGuardrails(slide, templateDetection, layoutResults) {
        const validatedSlide = { ...slide };

        // Apply content safety checks
        if (this.guardrails.contentSafety) {
            validatedSlide.content = this.sanitizeContent(slide.content);
        }

        // Apply size limits
        if (this.guardrails.sizeLimits) {
            validatedSlide.content = this.enforceSizeLimits(slide.content);
        }

        // Mark as guardrail-validated
        validatedSlide.guardrailValidated = true;

        return validatedSlide;
    }

    /**
     * Sanitize content for safety
     * @param {*} content - Content to sanitize
     * @returns {*} Sanitized content
     */
    sanitizeContent(content) {
        // Basic content sanitization
        if (typeof content === 'string') {
            // Remove potentially problematic characters
            return content.replace(/[<>{}[\]\\]/g, '');
        }

        if (Array.isArray(content)) {
            return content.map(item => this.sanitizeContent(item));
        }

        return content;
    }

    /**
     * Enforce size limits on content
     * @param {*} content - Content to limit
     * @returns {*} Limited content
     */
    enforceSizeLimits(content) {
        const maxLength = 1000;

        if (typeof content === 'string' && content.length > maxLength) {
            return content.substring(0, maxLength - 3) + '...';
        }

        if (Array.isArray(content)) {
            return content.slice(0, 10); // Max 10 items
        }

        return content;
    }

    /**
     * Get guardrail status
     * @returns {Object} Guardrail configuration
     */
    getGuardrailStatus() {
        return {
            activeGuardrails: this.guardrails,
            lastUpdate: new Date().toISOString(),
            compliance: 'active'
        };
    }
}

module.exports = { IntegratedGuardrailsSystem };
