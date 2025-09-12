const fs = require('fs').promises;
const path = require('path');

// Load template capabilities
let templateCapabilities = null;

async function loadTemplateCapabilities() {
    if (!templateCapabilities) {
        try {
            const capabilitiesPath = path.join(__dirname, 'template-capabilities.json');
            const data = await fs.readFile(capabilitiesPath, 'utf8');
            templateCapabilities = JSON.parse(data);
        } catch (error) {
            console.error('Failed to load template capabilities:', error);
            templateCapabilities = { templates: {}, defaultGenerator: {} };
        }
    }
    return templateCapabilities;
}

// Content validation and sanitization
class ContentValidator {
    static sanitizeText(text, maxLength = 1000) {
        if (!text) return '';
        
        let sanitized = String(text)
            .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
            .replace(/[^\w\s\-_.,!?()&:;@#$%+=\[\]{}'"]/g, '') // Allow only safe characters
            .trim();

        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength - 3) + '...';
        }
        
        return sanitized;
    }

    static validatePresentationData(data) {
        const capabilities = templateCapabilities?.contentConstraints?.globalLimits || {};
        const errors = [];

        // Title validation
        if (!data.title || data.title.trim().length === 0) {
            errors.push('Title is required');
        } else if (data.title.length > (capabilities.maxTitleLength || 100)) {
            errors.push(`Title too long (max ${capabilities.maxTitleLength || 100} characters)`);
        }

        // Subtitle validation
        if (data.subtitle && data.subtitle.length > (capabilities.maxSubtitleLength || 300)) {
            errors.push(`Subtitle too long (max ${capabilities.maxSubtitleLength || 300} characters)`);
        }

        // Slides validation
        if (!data.slides || !Array.isArray(data.slides)) {
            errors.push('Slides array is required');
        } else {
            if (data.slides.length < (capabilities.minSlides || 1)) {
                errors.push(`Minimum ${capabilities.minSlides || 1} slide required`);
            }
            if (data.slides.length > (capabilities.maxSlides || 50)) {
                errors.push(`Maximum ${capabilities.maxSlides || 50} slides allowed`);
            }

            // Validate each slide
            data.slides.forEach((slide, index) => {
                if (!slide.title) {
                    errors.push(`Slide ${index + 1}: Title is required`);
                } else if (slide.title.length > (capabilities.maxSlideTitle || 100)) {
                    errors.push(`Slide ${index + 1}: Title too long`);
                }

                if (slide.type === 'bullets') {
                    if (!slide.bullets || !Array.isArray(slide.bullets)) {
                        errors.push(`Slide ${index + 1}: Bullets array required for bullet slide`);
                    } else if (slide.bullets.length > 8) {
                        errors.push(`Slide ${index + 1}: Maximum 8 bullet points allowed`);
                    }
                } else if (slide.content && slide.content.length > (capabilities.maxContentLength || 3000)) {
                    errors.push(`Slide ${index + 1}: Content too long`);
                }
            });
        }

        return errors;
    }

    static sanitizePresentationData(data) {
        const sanitized = {
            title: this.sanitizeText(data.title, 100),
            subtitle: this.sanitizeText(data.subtitle, 300),
            colorScheme: data.colorScheme || 'professional',
            slides: []
        };

        if (data.slides && Array.isArray(data.slides)) {
            sanitized.slides = data.slides.map(slide => {
                const sanitizedSlide = {
                    title: this.sanitizeText(slide.title, 100),
                    type: slide.type || 'content'
                };

                if (slide.type === 'bullets' && slide.bullets) {
                    sanitizedSlide.bullets = slide.bullets
                        .slice(0, 8) // Max 8 bullets
                        .map(bullet => this.sanitizeText(bullet, 200));
                } else {
                    sanitizedSlide.content = this.sanitizeText(slide.content, 2000);
                }

                return sanitizedSlide;
            });
        }

        return sanitized;
    }
}

// Intelligent template matcher
class TemplateIntelligence {
    static async analyzeUserRequest(userInput, presentationData) {
        await loadTemplateCapabilities();
        
        const analysis = {
            detectedTopics: [],
            recommendedTemplate: null,
            confidence: 0,
            reasoning: '',
            useDefault: false
        };

        // Convert input to lowercase for keyword matching
        const inputText = (userInput + ' ' + (presentationData?.title || '') + ' ' + 
                          (presentationData?.subtitle || '')).toLowerCase();

        // Score each template based on keyword matches
        const templateScores = {};
        
        for (const [templateId, template] of Object.entries(templateCapabilities.templates)) {
            let score = 0;
            const matchedKeywords = [];

            // Check keyword matches
            for (const keyword of template.keywords) {
                if (inputText.includes(keyword.toLowerCase())) {
                    score += 10;
                    matchedKeywords.push(keyword);
                }
            }

            // Check suitable-for matches
            for (const suitableType of template.suitableFor) {
                if (inputText.includes(suitableType.toLowerCase())) {
                    score += 15;
                    matchedKeywords.push(suitableType);
                }
            }

            // Check capabilities match
            if (presentationData?.slides) {
                const slideCount = presentationData.slides.length;
                if (slideCount <= template.capabilities.maxSlides) {
                    score += 5;
                }

                // Check if content type matches template capabilities
                const hasBullets = presentationData.slides.some(s => s.type === 'bullets');
                if (hasBullets && template.capabilities.supportsBullets) {
                    score += 5;
                }
            }

            if (score > 0) {
                templateScores[templateId] = {
                    score,
                    matchedKeywords,
                    template
                };
            }
        }

        // Find best match
        const bestMatch = Object.entries(templateScores)
            .sort(([,a], [,b]) => b.score - a.score)[0];

        if (bestMatch && bestMatch[1].score >= 20) {
            analysis.recommendedTemplate = bestMatch[0];
            analysis.confidence = Math.min(bestMatch[1].score / 50, 1.0);
            analysis.detectedTopics = bestMatch[1].matchedKeywords;
            analysis.reasoning = `Matched keywords: ${bestMatch[1].matchedKeywords.join(', ')}. Template specializes in ${bestMatch[1].template.suitableFor.join(', ')}.`;
        } else {
            analysis.useDefault = true;
            analysis.reasoning = 'No specific template match found. Using reliable default generator for general presentations.';
        }

        return analysis;
    }

    static generateEnhancedPrompt(userInput, analysis) {
        const capabilities = templateCapabilities?.defaultGenerator?.capabilities || {};
        
        let prompt = `You are an expert PowerPoint presentation generator. `;
        
        if (analysis.recommendedTemplate) {
            const template = templateCapabilities.templates[analysis.recommendedTemplate];
            prompt += `Based on the user's request, I've identified this as suitable for the "${template.name}" template, which specializes in ${template.suitableFor.join(', ')}. `;
        } else {
            prompt += `I'll create a general-purpose presentation using our reliable default generator. `;
        }

        prompt += `Generate a structured JSON response for: "${userInput}"

REQUIREMENTS:
- Maximum ${capabilities.maxSlides || 50} slides
- Title: Maximum ${capabilities.maxTitleLength || 100} characters
- Subtitle: Maximum ${capabilities.maxSubtitleLength || 200} characters  
- Slide titles: Maximum ${capabilities.maxSlideTitle || 80} characters
- Bullet points: Maximum 8 per slide, 200 characters each
- Content: Maximum ${capabilities.maxContentLength || 2000} characters per slide
- Use colorScheme: "${analysis.recommendedTemplate ? 'professional' : 'professional'}"

Format your response as this exact JSON structure:
{
  "title": "Presentation Title",
  "subtitle": "Optional subtitle", 
  "slides": [
    {"title": "Slide Title", "content": "Slide content"},
    {"title": "Slide Title", "type": "bullets", "bullets": ["Point 1", "Point 2"]}
  ],
  "colorScheme": "professional"
}

IMPORTANT: Only respond with the JSON object, no additional text.`;

        return prompt;
    }
}

// Main routing function
async function routePresentationRequest(userInput, presentationData = null) {
    try {
        await loadTemplateCapabilities();

        // Validate and sanitize data if provided
        if (presentationData) {
            const validationErrors = ContentValidator.validatePresentationData(presentationData);
            if (validationErrors.length > 0) {
                return {
                    success: false,
                    error: 'Validation failed: ' + validationErrors.join(', '),
                    validationErrors
                };
            }

            presentationData = ContentValidator.sanitizePresentationData(presentationData);
        }

        // Analyze request and determine routing
        const analysis = await TemplateIntelligence.analyzeUserRequest(userInput, presentationData);

        return {
            success: true,
            analysis,
            enhancedPrompt: TemplateIntelligence.generateEnhancedPrompt(userInput, analysis),
            sanitizedData: presentationData,
            recommendedTemplate: analysis.useDefault ? null : analysis.recommendedTemplate
        };

    } catch (error) {
        console.error('Error in intelligent routing:', error);
        return {
            success: false,
            error: error.message,
            fallbackToDefault: true
        };
    }
}

module.exports = {
    routePresentationRequest,
    TemplateIntelligence,
    ContentValidator,
    loadTemplateCapabilities
};
