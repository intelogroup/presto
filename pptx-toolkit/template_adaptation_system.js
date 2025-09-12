/**
 * Template Adaptation System for PptxGenJS
 * Allows AI to safely modify templates while maintaining core functionality
 * Example: Adapting dog_superhero_book_presentation.js for different subjects and slide counts
 */

class TemplateAdaptationSystem {
    constructor(baseTemplate) {
        this.baseTemplate = baseTemplate;
        this.constraints = this.extractConstraints(baseTemplate);
        this.adaptableElements = this.identifyAdaptableElements();
    }

    /**
     * Extract core constraints that must be preserved
     */
    extractConstraints(template) {
        return {
            // Layout constraints
            slideSize: { width: 10, height: 5.625 }, // 16:9 aspect ratio
            margins: { top: 0.5, bottom: 0.5, left: 0.5, right: 0.5 },
            
            // Content constraints from ContentConstraintSystem
            titleMaxLength: 60,
            subtitleMaxLength: 100,
            bulletPointMaxLength: 80,
            maxBulletPoints: 4,
            
            // Technical constraints
            maxSlides: 20,
            minSlides: 3,
            requiredSlideTypes: ['title', 'content', 'conclusion'],
            
            // PptxGenJS API constraints
            supportedShapes: ['rect', 'ellipse', 'line', 'diamond', 'triangle'],
            supportedFonts: ['Arial', 'Calibri', 'Times New Roman', 'Helvetica'],
            colorFormat: /^#[0-9A-Fa-f]{6}$/,
            
            // Image constraints
            supportedImageFormats: ['.jpg', '.jpeg', '.png', '.gif'],
            maxImageSize: '5MB',
            imagePositioning: { x: [0, 10], y: [0, 5.625] }
        };
    }

    /**
     * Identify elements that can be safely modified
     */
    identifyAdaptableElements() {
        return {
            // Content adaptable
            slideData: {
                title: 'ADAPTABLE',
                subtitle: 'ADAPTABLE', 
                slides: 'ADAPTABLE_ARRAY'
            },
            
            // Visual adaptable (with constraints)
            colorScheme: {
                primary: 'ADAPTABLE_COLOR',
                secondary: 'ADAPTABLE_COLOR',
                accent: 'ADAPTABLE_COLOR',
                background: 'ADAPTABLE_COLOR'
            },
            
            // Images adaptable
            decorativeImages: 'ADAPTABLE_ARRAY',
            
            // Partially adaptable (structure preserved)
            slideCount: 'ADAPTABLE_NUMBER',
            bulletPoints: 'ADAPTABLE_ARRAY_LIMITED'
        };
    }

    /**
     * Adapt template for new subject and requirements
     */
    adaptTemplate(adaptationRequest) {
        const { subject, slideCount, colorPreference, contentData } = adaptationRequest;
        
        // Validate adaptation request
        const validation = this.validateAdaptationRequest(adaptationRequest);
        if (!validation.isValid) {
            throw new Error(`Adaptation validation failed: ${validation.errors.join(', ')}`);
        }

        // Create adapted template
        const adaptedTemplate = this.createAdaptedTemplate({
            subject,
            slideCount,
            colorPreference,
            contentData
        });

        // Verify core functionality is preserved
        this.verifyCoreFunctionality(adaptedTemplate);

        return adaptedTemplate;
    }

    /**
     * Validate adaptation request against constraints
     */
    validateAdaptationRequest(request) {
        const errors = [];
        
        // Slide count validation
        if (request.slideCount < this.constraints.minSlides || 
            request.slideCount > this.constraints.maxSlides) {
            errors.push(`Slide count must be between ${this.constraints.minSlides} and ${this.constraints.maxSlides}`);
        }
        
        // Color validation
        if (request.colorPreference) {
            Object.values(request.colorPreference).forEach(color => {
                if (!this.constraints.colorFormat.test(color)) {
                    errors.push(`Invalid color format: ${color}`);
                }
            });
        }
        
        // Content validation
        if (request.contentData) {
            if (request.contentData.title && request.contentData.title.length > this.constraints.titleMaxLength) {
                errors.push(`Title exceeds maximum length of ${this.constraints.titleMaxLength}`);
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    /**
     * Create adapted template while preserving structure
     */
    createAdaptedTemplate({ subject, slideCount, colorPreference, contentData }) {
        // Start with base template structure
        const adapted = JSON.parse(JSON.stringify(this.baseTemplate));
        
        // Adapt color scheme
        if (colorPreference) {
            adapted.colorScheme = {
                ...adapted.colorScheme,
                ...colorPreference
            };
        }
        
        // Adapt content for new subject
        adapted.slideData = this.adaptContentForSubject(subject, contentData);
        
        // Adjust slide count
        adapted.slideData.slides = this.adjustSlideCount(
            adapted.slideData.slides, 
            slideCount
        );
        
        // Update decorative elements for subject
        adapted.decorativeElements = this.adaptDecorativeElements(subject);
        
        return adapted;
    }

    /**
     * Adapt content for new subject while maintaining structure
     */
    adaptContentForSubject(subject, contentData) {
        const subjectMappings = {
            'flowers': {
                titlePrefix: 'The Beauty of',
                themes: ['Growth', 'Pollination', 'Seasons', 'Varieties'],
                decorativeImages: ['botanical.jpg', 'garden.jpg', 'nature.jpg']
            },
            'technology': {
                titlePrefix: 'Innovation in',
                themes: ['AI', 'Robotics', 'Future Tech', 'Digital Transformation'],
                decorativeImages: ['tech.jpg', 'innovation.jpg', 'digital.jpg']
            },
            'business': {
                titlePrefix: 'Success in',
                themes: ['Strategy', 'Growth', 'Leadership', 'Innovation'],
                decorativeImages: ['office.jpg', 'meeting.jpg', 'success.jpg']
            }
        };
        
        const mapping = subjectMappings[subject.toLowerCase()] || {
            titlePrefix: 'Exploring',
            themes: ['Introduction', 'Key Concepts', 'Applications', 'Future'],
            decorativeImages: ['general.jpg']
        };
        
        return {
            title: contentData?.title || `${mapping.titlePrefix} ${subject}`,
            subtitle: contentData?.subtitle || `A comprehensive guide to ${subject.toLowerCase()}`,
            slides: contentData?.slides || this.generateDefaultSlides(mapping.themes)
        };
    }

    /**
     * Adjust slide count while maintaining required slide types
     */
    adjustSlideCount(baseSlides, targetCount) {
        if (targetCount === baseSlides.length) return baseSlides;
        
        if (targetCount < baseSlides.length) {
            // Reduce slides but keep title and conclusion
            const title = baseSlides[0];
            const conclusion = baseSlides[baseSlides.length - 1];
            const contentSlides = baseSlides.slice(1, -1).slice(0, targetCount - 2);
            return [title, ...contentSlides, conclusion];
        } else {
            // Add more content slides
            const additionalSlides = [];
            const contentTemplate = baseSlides[1]; // Use second slide as template
            
            for (let i = baseSlides.length; i < targetCount; i++) {
                additionalSlides.push({
                    ...contentTemplate,
                    title: `Additional Topic ${i - 1}`,
                    content: [`Key point about topic ${i - 1}`, `Supporting detail ${i - 1}`]
                });
            }
            
            // Insert additional slides before conclusion
            const conclusion = baseSlides[baseSlides.length - 1];
            return [...baseSlides.slice(0, -1), ...additionalSlides, conclusion];
        }
    }

    /**
     * Adapt decorative elements for subject
     */
    adaptDecorativeElements(subject) {
        const subjectImages = {
            'flowers': ['botanical.jpg', 'garden.jpg', 'nature.jpg'],
            'technology': ['laboratory.jpg', 'scientific_research.jpg', 'technology_development.jpg'],
            'business': ['office.jpg', 'meeting.jpg', 'presentation.jpg']
        };
        
        return subjectImages[subject.toLowerCase()] || ['general.jpg'];
    }

    /**
     * Generate default slides for themes
     */
    generateDefaultSlides(themes) {
        return themes.map((theme, index) => ({
            title: theme,
            content: [
                `Key aspects of ${theme.toLowerCase()}`,
                `Important considerations for ${theme.toLowerCase()}`,
                `Best practices in ${theme.toLowerCase()}`
            ]
        }));
    }

    /**
     * Verify core functionality is preserved after adaptation
     */
    verifyCoreFunctionality(adaptedTemplate) {
        const checks = [
            // Structure checks
            () => adaptedTemplate.hasOwnProperty('slideData'),
            () => adaptedTemplate.hasOwnProperty('colorScheme'),
            () => Array.isArray(adaptedTemplate.slideData.slides),
            
            // Content constraint checks
            () => adaptedTemplate.slideData.title.length <= this.constraints.titleMaxLength,
            () => adaptedTemplate.slideData.slides.length >= this.constraints.minSlides,
            () => adaptedTemplate.slideData.slides.length <= this.constraints.maxSlides,
            
            // Color format checks
            () => Object.values(adaptedTemplate.colorScheme).every(color => 
                this.constraints.colorFormat.test(color)
            )
        ];
        
        const failedChecks = checks.filter(check => !check());
        
        if (failedChecks.length > 0) {
            throw new Error(`Core functionality verification failed: ${failedChecks.length} checks failed`);
        }
        
        return true;
    }

    /**
     * Generate safe adaptation guidelines for AI
     */
    generateAdaptationGuidelines() {
        return {
            safeToModify: [
                'slideData.title (max 60 chars)',
                'slideData.subtitle (max 100 chars)', 
                'slideData.slides content (max 4 bullets per slide)',
                'colorScheme colors (hex format only)',
                'decorativeImages array (supported formats only)'
            ],
            
            neverModify: [
                'ContentConstraintSystem class structure',
                'PptxGenJS API calls and parameters',
                'Slide layout positioning logic',
                'Error handling mechanisms',
                'File export functionality'
            ],
            
            modifyWithCaution: [
                'Slide count (3-20 range only)',
                'Font families (use supported fonts only)',
                'Image positioning (within slide bounds)',
                'Shape types (use supported shapes only)'
            ],
            
            validationRequired: [
                'All color values must be valid hex codes',
                'Text content must not exceed length limits',
                'Slide count must be within allowed range',
                'All images must exist in assets folder',
                'Generated template must pass core functionality verification'
            ]
        };
    }
}

// Example usage for AI adaptation
class AITemplateAdapter {
    constructor() {
        this.adaptationSystem = null;
    }

    /**
     * Load and prepare template for adaptation
     */
    loadTemplate(templatePath) {
        // In production, this would load the actual template
        const baseTemplate = require(templatePath);
        this.adaptationSystem = new TemplateAdaptationSystem(baseTemplate);
        return this.adaptationSystem.generateAdaptationGuidelines();
    }

    /**
     * Safely adapt template based on user request
     */
    adaptForUser(userRequest) {
        try {
            const adaptationRequest = this.parseUserRequest(userRequest);
            const adaptedTemplate = this.adaptationSystem.adaptTemplate(adaptationRequest);
            
            return {
                success: true,
                template: adaptedTemplate,
                message: 'Template successfully adapted while preserving core functionality'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fallback: 'Use original template with minimal modifications'
            };
        }
    }

    /**
     * Parse user request into structured adaptation parameters
     */
    parseUserRequest(request) {
        // Example: "Create a flower presentation with 12 slides using green colors"
        return {
            subject: this.extractSubject(request),
            slideCount: this.extractSlideCount(request),
            colorPreference: this.extractColorPreference(request),
            contentData: this.extractContentData(request)
        };
    }

    extractSubject(request) {
        // Simple keyword extraction - in production use NLP
        const subjects = ['flowers', 'technology', 'business', 'science', 'education'];
        return subjects.find(subject => 
            request.toLowerCase().includes(subject)
        ) || 'general';
    }

    extractSlideCount(request) {
        const match = request.match(/(\d+)\s*slides?/i);
        return match ? parseInt(match[1]) : 5; // default
    }

    extractColorPreference(request) {
        const colorMappings = {
            'green': { primary: '#2E7D32', secondary: '#4CAF50', accent: '#8BC34A' },
            'blue': { primary: '#1976D2', secondary: '#2196F3', accent: '#03A9F4' },
            'red': { primary: '#D32F2F', secondary: '#F44336', accent: '#FF5722' }
        };
        
        const color = Object.keys(colorMappings).find(color => 
            request.toLowerCase().includes(color)
        );
        
        return color ? colorMappings[color] : null;
    }

    extractContentData(request) {
        // In production, this would use NLP to extract structured content
        return null; // Use defaults
    }
}

module.exports = {
    TemplateAdaptationSystem,
    AITemplateAdapter
};

// Example usage:
// const adapter = new AITemplateAdapter();
// const guidelines = adapter.loadTemplate('./dog_superhero_book_presentation.js');
// const result = adapter.adaptForUser('Create a flower presentation with 12 slides using green colors');
