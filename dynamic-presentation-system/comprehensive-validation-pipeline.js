/**
 * Comprehensive Validation Pipeline
 * Validates presentation content and structure
 */

class ComprehensiveValidationPipeline {
    constructor() {
        this.validationRules = {
            title: {
                required: true,
                minLength: 1,
                maxLength: 200
            },
            slides: {
                required: true,
                minSlides: 1,
                maxSlides: 100
            },
            slide: {
                title: { maxLength: 100 },
                content: { maxLength: 5000 }
            }
        };

        this.qualityMetrics = {
            contentDensity: 0,
            slideStructure: 0,
            readabilityScore: 0,
            visualBalance: 0
        };
    }

    /**
     * Validate presentation data comprehensively
     * @param {Object} presentationData - Presentation data to validate
     * @param {Object} options - Validation options
     * @returns {Object} Validation results
     */
    async validatePresentation(presentationData, options = {}) {
        const errors = [];
        const warnings = [];
        let score = 100;

        try {
            // Title validation
            if (!presentationData.title || typeof presentationData.title !== 'string') {
                errors.push('Title is required and must be a string');
                score -= 20;
            } else {
                if (presentationData.title.length < this.validationRules.title.minLength) {
                    warnings.push('Title is very short');
                    score -= 5;
                }
                if (presentationData.title.length > this.validationRules.title.maxLength) {
                    errors.push(`Title exceeds maximum length (${this.validationRules.title.maxLength} characters)`);
                    score -= 10;
                }
            }

            // Slides validation
            if (!presentationData.slides || !Array.isArray(presentationData.slides)) {
                errors.push('Slides are required and must be an array');
                score -= 30;
            } else {
                if (presentationData.slides.length < this.validationRules.slides.minSlides) {
                    errors.push(`Presentation must have at least ${this.validationRules.slides.minSlides} slide`);
                    score -= 15;
                }
                if (presentationData.slides.length > this.validationRules.slides.maxSlides) {
                    errors.push(`Presentation cannot exceed ${this.validationRules.slides.maxSlides} slides`);
                    score -= 10;
                }

                // Validate individual slides
                presentationData.slides.forEach((slide, index) => {
                    const slideErrors = this.validateSlide(slide, index);
                    errors.push(...slideErrors.errors);
                    warnings.push(...slideErrors.warnings);
                    score -= slideErrors.errors.length * 2;
                    score -= slideErrors.warnings.length * 1;
                });
            }

            // Content quality analysis
            if (presentationData.slides && presentationData.slides.length > 0) {
                const qualityAnalysis = this.analyzeContentQuality(presentationData.slides);

                if (qualityAnalysis.density < 50) {
                    warnings.push('Content density is low - consider adding more detail');
                    score -= 5;
                }

                if (qualityAnalysis.structure < 60) {
                    warnings.push('Slide structure could be improved');
                    score -= 5;
                }
            }

            // Ensure score doesn't go below 0
            score = Math.max(0, score);

            return {
                passed: errors.length === 0,
                score: Math.round(score),
                errors,
                warnings,
                metrics: {
                    totalErrors: errors.length,
                    totalWarnings: warnings.length,
                    contentQuality: this.analyzeContentQuality(presentationData.slides || [])
                }
            };

        } catch (error) {
            console.error('Validation pipeline error:', error);
            return {
                passed: false,
                score: 0,
                errors: [`Validation pipeline failed: ${error.message}`],
                warnings: [],
                metrics: {}
            };
        }
    }

    /**
     * Validate individual slide
     * @param {Object} slide - Slide data
     * @param {number} index - Slide index
     * @returns {Object} Slide validation results
     */
    validateSlide(slide, index) {
        const errors = [];
        const warnings = [];

        if (!slide || typeof slide !== 'object') {
            errors.push(`Slide ${index + 1}: Invalid slide structure`);
            return { errors, warnings };
        }

        // Title validation
        if (slide.title && typeof slide.title === 'string') {
            if (slide.title.length > this.validationRules.slide.title.maxLength) {
                errors.push(`Slide ${index + 1}: Title exceeds ${this.validationRules.slide.title.maxLength} characters`);
            }
            if (slide.title.trim().length === 0) {
                warnings.push(`Slide ${index + 1}: Title is empty`);
            }
        }

        // Content validation
        if (slide.content) {
            const contentLength = typeof slide.content === 'string'
                ? slide.content.length
                : JSON.stringify(slide.content).length;

            if (contentLength > this.validationRules.slide.content.maxLength) {
                errors.push(`Slide ${index + 1}: Content exceeds ${this.validationRules.slide.content.maxLength} characters`);
            }

            if (contentLength === 0) {
                warnings.push(`Slide ${index + 1}: Content is empty`);
            }
        } else {
            warnings.push(`Slide ${index + 1}: No content provided`);
        }

        // Type validation
        const validTypes = ['title', 'content', 'image', 'chart', 'table', 'bullets'];
        if (slide.type && !validTypes.includes(slide.type)) {
            warnings.push(`Slide ${index + 1}: Unknown slide type "${slide.type}"`);
        }

        return { errors, warnings };
    }

    /**
     * Analyze content quality metrics
     * @param {Array} slides - Array of slides
     * @returns {Object} Quality metrics
     */
    analyzeContentQuality(slides) {
        if (!slides || slides.length === 0) {
            return { density: 0, structure: 0, readability: 0 };
        }

        let totalContentLength = 0;
        let slidesWithTitles = 0;
        let slidesWithContent = 0;
        let structuralQuality = 0;

        slides.forEach(slide => {
            // Content density
            if (slide.content) {
                const contentStr = typeof slide.content === 'string'
                    ? slide.content
                    : JSON.stringify(slide.content);
                totalContentLength += contentStr.length;
            }

            if (slide.title && slide.title.trim()) {
                slidesWithTitles++;
            }

            if (slide.content) {
                slidesWithContent++;
            }

            // Structure quality
            let slideScore = 0;
            if (slide.title) slideScore += 30;
            if (slide.content) slideScore += 50;
            if (slide.type && ['content', 'bullets', 'image', 'chart'].includes(slide.type)) slideScore += 20;
            structuralQuality += slideScore / 100;
        });

        const density = Math.min(100, (totalContentLength / slides.length) / 50 * 100);
        const titleRatio = slidesWithTitles / slides.length;
        const contentRatio = slidesWithContent / slides.length;
        const structureScore = (structuralQuality / slides.length) * 100;

        return {
            density: Math.round(density),
            structure: Math.round(structureScore),
            titleCoverage: Math.round(titleRatio * 100),
            contentCoverage: Math.round(contentRatio * 100),
            readability: Math.round((density + structureScore) / 2)
        };
    }

    /**
     * Get validation configuration
     * @returns {Object} Current validation rules
     */
    getValidationConfig() {
        return {
            rules: this.validationRules,
            metrics: this.qualityMetrics
        };
    }
}

module.exports = { ComprehensiveValidationPipeline };
