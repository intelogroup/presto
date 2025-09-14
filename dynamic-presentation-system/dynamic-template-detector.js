/**
 * Dynamic Template Detection System
 * Intelligently identifies presentation types and selects optimal templates
 * Based on content analysis, keywords, and presentation requirements
 */

const fs = require('fs');
const path = require('path');

class DynamicTemplateDetector {
    constructor() {
        this.templateCapabilities = null;
        this.contentAnalyzer = new ContentAnalyzer();
        this.presentationClassifier = new PresentationClassifier();
        this.capabilitiesLoaded = false;
        this.loadingPromise = null;
    }

    /**
     * Load template capabilities from configuration (async, lazy-loaded)
     */
    async loadTemplateCapabilities() {
        if (this.capabilitiesLoaded) {
            return this.templateCapabilities;
        }
        
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        
        this.loadingPromise = this._loadCapabilitiesAsync();
        return this.loadingPromise;
    }
    
    async _loadCapabilitiesAsync() {
        try {
            const capabilitiesPath = path.join(__dirname, 'template-capabilities.json');
            const fs = require('fs').promises;
            const data = await fs.readFile(capabilitiesPath, 'utf8');
            this.templateCapabilities = JSON.parse(data);
            this.capabilitiesLoaded = true;
            return this.templateCapabilities;
        } catch (error) {
            console.error('Failed to load template capabilities:', error);
            this.templateCapabilities = { templates: {}, defaultGenerator: {} };
            this.capabilitiesLoaded = true;
            return this.templateCapabilities;
        }
    }

    /**
     * Main detection method - analyzes input and returns optimal template
     * @param {Object} presentationData - User input data
     * @returns {Object} Detection result with template recommendation
     */
    async detectOptimalTemplate(presentationData) {
        try {
            // Ensure template capabilities are loaded
            await this.loadTemplateCapabilities();
            
            // Step 1: Analyze content characteristics
            const contentAnalysis = this.contentAnalyzer.analyzeContent(presentationData);
            
            // Step 2: Classify presentation type
            const presentationType = this.presentationClassifier.classifyPresentation(
                presentationData, 
                contentAnalysis
            );
            
            // Step 3: Score and rank templates
            const templateScores = this.scoreTemplates(presentationType, contentAnalysis);
            
            // Step 4: Select best template with confidence score
            const selectedTemplate = this.selectBestTemplate(templateScores, contentAnalysis);
            
            return {
                success: true,
                selectedTemplate: selectedTemplate.template,
                confidence: selectedTemplate.confidence,
                presentationType: presentationType,
                contentAnalysis: contentAnalysis,
                alternativeTemplates: templateScores.slice(1, 3), // Top 2 alternatives
                reasoning: selectedTemplate.reasoning
            };
        } catch (error) {
            console.error('Template detection failed:', error);
            return {
                success: false,
                selectedTemplate: 'defaultGenerator',
                confidence: 0.5,
                error: error.message,
                fallbackReason: 'Detection system error - using default generator'
            };
        }
    }

    /**
     * Score all available templates based on presentation requirements
     */
    scoreTemplates(presentationType, contentAnalysis) {
        const templates = this.templateCapabilities.templates;
        const scores = [];

        for (const [templateId, template] of Object.entries(templates)) {
            const score = this.calculateTemplateScore(templateId, template, presentationType, contentAnalysis);
            scores.push({
                templateId,
                template: template,
                score: score.total,
                breakdown: score.breakdown
            });
        }

        // Sort by score (highest first)
        return scores.sort((a, b) => b.score - a.score);
    }

    /**
     * Calculate comprehensive score for a template
     */
    calculateTemplateScore(templateId, template, presentationType, contentAnalysis) {
        const breakdown = {
            keywordMatch: 0,
            typeCompatibility: 0,
            featureSupport: 0,
            capacityMatch: 0,
            themeAlignment: 0
        };

        // Keyword matching (30% weight)
        breakdown.keywordMatch = this.scoreKeywordMatch(
            template.keywords || [], 
            presentationType.keywords
        ) * 0.3;

        // Type compatibility (25% weight)
        breakdown.typeCompatibility = this.scoreTypeCompatibility(
            template.suitableFor || [], 
            presentationType.category
        ) * 0.25;

        // Feature support (20% weight)
        breakdown.featureSupport = this.scoreFeatureSupport(
            template.capabilities, 
            contentAnalysis.requiredFeatures
        ) * 0.2;

        // Capacity match (15% weight)
        breakdown.capacityMatch = this.scoreCapacityMatch(
            template.capabilities, 
            contentAnalysis.contentMetrics
        ) * 0.15;

        // Theme alignment (10% weight)
        breakdown.themeAlignment = this.scoreThemeAlignment(
            template.capabilities.themes || [], 
            presentationType.preferredThemes
        ) * 0.1;

        const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0);

        return { total, breakdown };
    }

    /**
     * Score keyword matching between template and presentation
     */
    scoreKeywordMatch(templateKeywords, presentationKeywords) {
        if (!templateKeywords.length || !presentationKeywords.length) return 0;

        const matches = templateKeywords.filter(keyword => 
            presentationKeywords.some(pKeyword => 
                pKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
                keyword.toLowerCase().includes(pKeyword.toLowerCase())
            )
        );

        return matches.length / Math.max(templateKeywords.length, presentationKeywords.length);
    }

    /**
     * Score type compatibility
     */
    scoreTypeCompatibility(suitableFor, category) {
        if (!suitableFor.length) return 0.5; // Neutral if no specific suitability

        const categoryMatch = suitableFor.some(suitable => 
            suitable.toLowerCase().includes(category.toLowerCase()) ||
            category.toLowerCase().includes(suitable.toLowerCase())
        );

        return categoryMatch ? 1.0 : 0.2;
    }

    /**
     * Score feature support capability
     */
    scoreFeatureSupport(capabilities, requiredFeatures) {
        if (!requiredFeatures.length) return 1.0;

        let supportedCount = 0;
        requiredFeatures.forEach(feature => {
            switch (feature) {
                case 'bullets':
                    if (capabilities.supportsBullets) supportedCount++;
                    break;
                case 'images':
                    if (capabilities.supportsImages) supportedCount++;
                    break;
                case 'charts':
                    if (capabilities.supportsCharts) supportedCount++;
                    break;
            }
        });

        return supportedCount / requiredFeatures.length;
    }

    /**
     * Score capacity matching (slide count, content volume)
     */
    scoreCapacityMatch(capabilities, contentMetrics) {
        let score = 1.0;

        // Check slide count capacity
        if (contentMetrics.estimatedSlides > capabilities.maxSlides) {
            score *= 0.3; // Heavy penalty for exceeding capacity
        } else if (contentMetrics.estimatedSlides > capabilities.maxSlides * 0.8) {
            score *= 0.7; // Moderate penalty for near capacity
        }

        return score;
    }

    /**
     * Score theme alignment
     */
    scoreThemeAlignment(templateThemes, preferredThemes) {
        if (!templateThemes.length || !preferredThemes.length) return 0.5;

        const matches = templateThemes.filter(theme => 
            preferredThemes.includes(theme)
        );

        return matches.length / Math.max(templateThemes.length, preferredThemes.length);
    }

    /**
     * Select the best template with confidence assessment
     */
    selectBestTemplate(templateScores, contentAnalysis) {
        if (!templateScores.length) {
            return {
                template: 'defaultGenerator',
                confidence: 0.5,
                reasoning: 'No templates available - using default generator'
            };
        }

        const bestTemplate = templateScores[0];
        const secondBest = templateScores[1];

        // Calculate confidence based on score and gap to second best
        let confidence = bestTemplate.score;
        if (secondBest) {
            const gap = bestTemplate.score - secondBest.score;
            confidence = Math.min(confidence + gap * 0.5, 1.0);
        }

        // Use default generator if confidence is too low
        if (confidence < 0.4) {
            return {
                template: 'defaultGenerator',
                confidence: 0.6,
                reasoning: 'Low confidence in template matching - using reliable default generator'
            };
        }

        return {
            template: bestTemplate.templateId,
            confidence: confidence,
            reasoning: `Selected based on ${Object.entries(bestTemplate.breakdown)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 2)
                .map(([key]) => key)
                .join(' and ')}`
        };
    }

    /**
     * Get template requirements and constraints
     */
    getTemplateRequirements(templateId) {
        const template = this.templateCapabilities.templates[templateId] || 
                        this.templateCapabilities.defaultGenerator;
        
        return {
            capabilities: template.capabilities,
            constraints: this.templateCapabilities.contentConstraints,
            guardrails: template.guardrails || this.templateCapabilities.defaultGenerator.guardrails
        };
    }
}

/**
 * Content Analysis Engine
 */
class ContentAnalyzer {
    analyzeContent(presentationData) {
        const analysis = {
            contentMetrics: this.calculateContentMetrics(presentationData),
            requiredFeatures: this.identifyRequiredFeatures(presentationData),
            complexityLevel: this.assessComplexity(presentationData),
            contentTypes: this.identifyContentTypes(presentationData)
        };

        return analysis;
    }

    // Helper function to get content as string
    getContentAsString(slide) {
        if (!slide.content) return '';
        if (Array.isArray(slide.content)) {
            return slide.content.join(' ');
        }
        return String(slide.content);
    }

    calculateContentMetrics(data) {
        const slides = data.slides || [];
        const totalContent = slides.reduce((total, slide) => {
            return total + this.getContentAsString(slide).length + 
                   (slide.bullets || []).join(' ').length;
        }, 0);

        return {
            slideCount: slides.length,
            estimatedSlides: Math.max(slides.length, Math.ceil(totalContent / 1000)),
            totalContentLength: totalContent,
            averageContentPerSlide: slides.length ? totalContent / slides.length : 0,
            maxBulletPoints: Math.max(...slides.map(s => (s.bullets || []).length), 0)
        };
    }

    identifyRequiredFeatures(data) {
        const features = [];
        const slides = data.slides || [];

        // Check for bullets
        if (slides.some(slide => slide.bullets && slide.bullets.length > 0)) {
            features.push('bullets');
        }

        // Check for images (placeholder detection)
        if (slides.some(slide => {
            const content = this.getContentAsString(slide).toLowerCase();
            return content.includes('image') ||
                   content.includes('chart') ||
                   content.includes('graph');
        })) {
            features.push('images');
        }

        // Check for charts/data visualization
        if (slides.some(slide => {
            const content = this.getContentAsString(slide).toLowerCase();
            return content.includes('chart') ||
                   content.includes('graph') ||
                   content.includes('data') ||
                   (slide.bullets || []).some(bullet => 
                       bullet.toLowerCase().includes('chart') ||
                       bullet.toLowerCase().includes('data')
                   );
        })) {
            features.push('charts');
        }

        return features;
    }

    assessComplexity(data) {
        const slides = data.slides || [];
        let complexityScore = 0;

        // Factor in slide count
        complexityScore += Math.min(slides.length / 10, 1) * 0.3;

        // Factor in content density
        const avgContentLength = slides.reduce((sum, slide) => 
            sum + this.getContentAsString(slide).length, 0) / slides.length;
        complexityScore += Math.min(avgContentLength / 500, 1) * 0.3;

        // Factor in bullet point complexity
        const avgBullets = slides.reduce((sum, slide) => 
            sum + (slide.bullets || []).length, 0) / slides.length;
        complexityScore += Math.min(avgBullets / 5, 1) * 0.2;

        // Factor in technical content
        const technicalTerms = ['methodology', 'analysis', 'research', 'data', 'algorithm', 'process'];
        const hasTechnicalContent = slides.some(slide => 
            technicalTerms.some(term => 
                this.getContentAsString(slide).toLowerCase().includes(term) ||
                (slide.title || '').toLowerCase().includes(term)
            )
        );
        if (hasTechnicalContent) complexityScore += 0.2;

        return Math.min(complexityScore, 1);
    }

    identifyContentTypes(data) {
        const types = [];
        const allText = JSON.stringify(data).toLowerCase();

        const typePatterns = {
            'educational': ['learn', 'teach', 'education', 'training', 'course'],
            'business': ['business', 'corporate', 'company', 'revenue', 'profit', 'strategy'],
            'scientific': ['research', 'study', 'experiment', 'methodology', 'analysis'],
            'technical': ['technology', 'software', 'system', 'algorithm', 'development'],
            'creative': ['design', 'creative', 'art', 'visual', 'aesthetic'],
            'data-driven': ['data', 'statistics', 'metrics', 'analytics', 'chart']
        };

        for (const [type, patterns] of Object.entries(typePatterns)) {
            if (patterns.some(pattern => allText.includes(pattern))) {
                types.push(type);
            }
        }

        return types.length ? types : ['general'];
    }
}

/**
 * Presentation Classification Engine
 */
class PresentationClassifier {
    classifyPresentation(presentationData, contentAnalysis) {
        const classification = {
            category: this.determineCategory(presentationData, contentAnalysis),
            keywords: this.extractKeywords(presentationData),
            preferredThemes: this.suggestThemes(presentationData, contentAnalysis),
            formality: this.assessFormality(presentationData),
            audience: this.identifyAudience(presentationData)
        };

        return classification;
    }

    determineCategory(data, analysis) {
        const contentTypes = analysis.contentTypes;
        
        // Priority-based category determination
        if (contentTypes.includes('scientific')) return 'scientific';
        if (contentTypes.includes('business')) return 'business';
        if (contentTypes.includes('technical')) return 'technical';
        if (contentTypes.includes('educational')) return 'educational';
        if (contentTypes.includes('creative')) return 'creative';
        if (contentTypes.includes('data-driven')) return 'analytical';
        
        return 'general';
    }

    extractKeywords(data) {
        const allText = JSON.stringify(data).toLowerCase();
        const keywords = [];

        // Extract from title and subtitle
        if (data.title) {
            keywords.push(...data.title.toLowerCase().split(/\s+/)
                .filter(word => word.length > 3));
        }
        if (data.subtitle) {
            keywords.push(...data.subtitle.toLowerCase().split(/\s+/)
                .filter(word => word.length > 3));
        }

        // Extract significant terms from content
        const significantTerms = [
            'business', 'technology', 'research', 'education', 'science',
            'methodology', 'analysis', 'development', 'innovation', 'strategy',
            'sustainability', 'environment', 'digital', 'data', 'artificial',
            'intelligence', 'machine', 'learning', 'healthcare', 'medical'
        ];

        significantTerms.forEach(term => {
            if (allText.includes(term)) {
                keywords.push(term);
            }
        });

        return [...new Set(keywords)]; // Remove duplicates
    }

    suggestThemes(data, analysis) {
        const themes = [];
        const contentTypes = analysis.contentTypes;

        if (contentTypes.includes('business')) themes.push('professional', 'modern');
        if (contentTypes.includes('scientific')) themes.push('academic', 'professional');
        if (contentTypes.includes('technical')) themes.push('modern', 'tech');
        if (contentTypes.includes('creative')) themes.push('creative', 'modern');
        if (analysis.complexityLevel > 0.7) themes.push('professional');

        // Default themes if none identified
        if (!themes.length) themes.push('professional', 'modern');

        return [...new Set(themes)];
    }

    assessFormality(data) {
        const allText = JSON.stringify(data).toLowerCase();
        
        const formalIndicators = ['research', 'methodology', 'analysis', 'study', 'investigation'];
        const informalIndicators = ['fun', 'easy', 'simple', 'quick', 'cool'];
        
        const formalCount = formalIndicators.filter(term => allText.includes(term)).length;
        const informalCount = informalIndicators.filter(term => allText.includes(term)).length;
        
        if (formalCount > informalCount) return 'formal';
        if (informalCount > formalCount) return 'informal';
        return 'neutral';
    }

    identifyAudience(data) {
        const allText = JSON.stringify(data).toLowerCase();
        
        if (allText.includes('student') || allText.includes('education')) return 'academic';
        if (allText.includes('business') || allText.includes('corporate')) return 'business';
        if (allText.includes('research') || allText.includes('scientific')) return 'research';
        if (allText.includes('technical') || allText.includes('developer')) return 'technical';
        
        return 'general';
    }
}

module.exports = {
    DynamicTemplateDetector,
    ContentAnalyzer,
    PresentationClassifier
};