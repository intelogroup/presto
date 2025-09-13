/**
 * Fallback Mechanisms System
 * Provides graceful degradation and alternative approaches when primary methods fail
 */

class FallbackMechanismsSystem {
    constructor() {
        this.fallbackStrategies = [
            'simplified-template',
            'basic-layout',
            'minimal-content',
            'error-template'
        ];
    }

    /**
     * Handle fallback when primary system fails
     * @param {Object} presentationData - Original presentation data
     * @param {Error} error - Error that caused the fallback
     * @param {Object} context - Additional context information
     * @returns {Object} Fallback presentation result
     */
    async handleFallback(presentationData, error, context = {}) {
        console.log(`🔄 Initiating fallback for ${context.phase || 'unknown'} failure:`, error.message);

        try {
            // Try different fallback strategies in order
            for (const strategy of this.fallbackStrategies) {
                try {
                    const result = await this.executeFallbackStrategy(
                        presentationData,
                        strategy,
                        context
                    );

                    if (result.success) {
                        console.log(`✅ Fallback ${strategy} succeeded`);
                        return result;
                    }
                } catch (strategyError) {
                    console.warn(`⚠️ Fallback ${strategy} failed:`, strategyError.message);
                    continue;
                }
            }

            // If all fallbacks fail, return a minimal error presentation
            return this.createErrorPresentation(presentationData, error);

        } catch (fallbackError) {
            console.error('💥 Fallback system failed:', fallbackError);
            return {
                success: false,
                error: `Complete system failure: ${fallbackError.message}`,
                phase: context.phase || 'unknown',
                fallbackAttempted: true
            };
        }
    }

    /**
     * Execute a specific fallback strategy
     * @param {Object} presentationData - Presentation data
     * @param {string} strategy - Strategy to execute
     * @param {Object} context - Context information
     * @returns {Object} Fallback result
     */
    async executeFallbackStrategy(presentationData, strategy, context) {
        switch (strategy) {
            case 'simplified-template':
                return this.applySimplifiedTemplate(presentationData);

            case 'basic-layout':
                return this.applyBasicLayout(presentationData);

            case 'minimal-content':
                return this.applyMinimalContent(presentationData);

            case 'error-template':
                return this.applyErrorTemplate(presentationData);

            default:
                throw new Error(`Unknown fallback strategy: ${strategy}`);
        }
    }

    /**
     * Apply simplified template fallback
     * @param {Object} presentationData - Presentation data
     * @returns {Object} Simplified presentation
     */
    async applySimplifiedTemplate(presentationData) {
        const slides = presentationData.slides || [];

        const simplifiedSlides = slides.map(slide => ({
            title: slide.title || 'Slide',
            content: this.simplifyContent(slide.content),
            type: 'content'
        }));

        return {
            success: true,
            presentation: {
                title: presentationData.title || 'Generated Presentation',
                slides: simplifiedSlides,
                theme: 'simple'
            },
            metadata: {
                fallbackStrategy: 'simplified-template',
                qualityScore: 60,
                confidenceLevel: 0.8
            }
        };
    }

    /**
     * Apply basic layout fallback
     * @param {Object} presentationData - Presentation data
     * @returns {Object} Basic layout presentation
     */
    async applyBasicLayout(presentationData) {
        const slides = presentationData.slides || [];

        const basicSlides = slides.map((slide, index) => ({
            id: `slide_${index + 1}`,
            title: slide.title || `Slide ${index + 1}`,
            content: [
                'This slide was generated using fallback layout.',
                'Content may not be optimally formatted.'
            ],
            layout: 'basic'
        }));

        return {
            success: true,
            presentation: {
                title: presentationData.title || 'Presentation',
                slides: basicSlides,
                theme: 'basic'
            },
            metadata: {
                fallbackStrategy: 'basic-layout',
                qualityScore: 40,
                confidenceLevel: 0.6
            }
        };
    }

    /**
     * Apply minimal content fallback
     * @param {Object} presentationData - Presentation data
     * @returns {Object} Minimal presentation
     */
    async applyMinimalContent(presentationData) {
        return {
            success: true,
            presentation: {
                title: presentationData.title || 'Generated Presentation',
                slides: [
                    {
                        title: presentationData.title || 'Presentation',
                        content: 'Presentation generated using fallback system.',
                        type: 'content'
                    }
                ],
                theme: 'minimal'
            },
            metadata: {
                fallbackStrategy: 'minimal-content',
                qualityScore: 20,
                confidenceLevel: 0.3
            }
        };
    }

    /**
     * Apply error template as last resort
     * @param {Object} presentationData - Presentation data
     * @returns {Object} Error presentation
     */
    async applyErrorTemplate(presentationData) {
        return {
            success: false,
            presentation: {
                title: presentationData.title || 'Error',
                slides: [
                    {
                        title: 'Error',
                        content: 'Unable to generate presentation due to technical issues. Please try again with simplified content.',
                        type: 'content'
                    }
                ],
                theme: 'error'
            },
            metadata: {
                fallbackStrategy: 'error-template',
                qualityScore: 0,
                confidenceLevel: 0.1,
                errors: ['Fallback failed']
            }
        };
    }

    /**
     * Create error presentation for complete failure
     * @param {Object} presentationData - Original data
     * @param {Error} error - Original error
     * @returns {Object} Error presentation
     */
    createErrorPresentation(presentationData, error) {
        return {
            success: false,
            presentation: {
                title: 'Error',
                slides: [{
                    title: 'Generation Failed',
                    content: `Presentation generation encountered an error: ${error.message}. Please try with simpler content.`,
                    type: 'content'
                }],
                theme: 'error'
            },
            metadata: {
                error: error.message,
                phase: 'complete-failure',
                qualityScore: 0,
                confidenceLevel: 0
            }
        };
    }

    /**
     * Simplify content for fallback
     * @param {*} content - Content to simplify
     * @returns {*} Simplified content
     */
    simplifyContent(content) {
        if (typeof content === 'string') {
            return content.substring(0, 200) + (content.length > 200 ? '...' : '');
        }

        if (Array.isArray(content)) {
            return content.slice(0, 3);
        }

        return content;
    }

    /**
     * Get fallback system status
     * @returns {Object} System status
     */
    getFallbackStatus() {
        return {
            availableStrategies: this.fallbackStrategies,
            systemHealth: 'operational',
            lastUsed: null
        };
    }
}

module.exports = { FallbackMechanismsSystem };
