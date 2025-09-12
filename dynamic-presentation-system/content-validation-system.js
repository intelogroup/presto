/**
 * Content Validation and Auto-Truncation System
 * Provides comprehensive content length validation, sanitization,
 * and intelligent truncation for the dynamic presentation system
 */

class ContentValidationSystem {
    constructor() {
        this.contentLimits = this.initializeContentLimits();
        this.validationRules = this.initializeValidationRules();
        this.truncationStrategies = this.initializeTruncationStrategies();
        this.validationMetrics = this.initializeValidationMetrics();
    }

    /**
     * Initialize content length limits for different elements
     */
    initializeContentLimits() {
        return {
            // Presentation level limits
            presentation: {
                title: { min: 1, max: 80, recommended: 50 },
                subtitle: { min: 0, max: 120, recommended: 80 },
                description: { min: 0, max: 300, recommended: 200 },
                maxSlides: 25,
                maxSections: 20
            },
            
            // Slide level limits
            slide: {
                title: { min: 1, max: 60, recommended: 40 },
                content: { min: 0, max: 800, recommended: 500 },
                bulletPoints: { max: 8, itemLength: 120 },
                maxElements: 10
            },
            
            // Section level limits
            section: {
                title: { min: 1, max: 60, recommended: 40 },
                content: { min: 0, max: 1000, recommended: 600 },
                maxSubsections: 5
            },
            
            // Text element limits
            text: {
                paragraph: { min: 0, max: 400, recommended: 250 },
                sentence: { min: 1, max: 150, recommended: 100 },
                word: { min: 1, max: 30, recommended: 20 },
                line: { min: 0, max: 80, recommended: 60 }
            },
            
            // List element limits
            list: {
                maxItems: 8,
                itemLength: { min: 1, max: 120, recommended: 80 },
                maxNestingLevel: 2
            },
            
            // Special content limits
            special: {
                url: { max: 200 },
                email: { max: 100 },
                phone: { max: 20 },
                code: { max: 500 },
                quote: { max: 300 }
            }
        };
    }

    /**
     * Initialize validation rules
     */
    initializeValidationRules() {
        return {
            required: {
                name: 'Required Field Validation',
                check: (content, field) => {
                    if (field.required && (!content || content.toString().trim().length === 0)) {
                        return { valid: false, error: `${field.name} is required` };
                    }
                    return { valid: true };
                }
            },
            
            length: {
                name: 'Length Validation',
                check: (content, limits) => {
                    const length = content ? content.toString().length : 0;
                    
                    if (limits.min && length < limits.min) {
                        return { 
                            valid: false, 
                            error: `Content too short (${length} < ${limits.min})`,
                            action: 'pad'
                        };
                    }
                    
                    if (limits.max && length > limits.max) {
                        return { 
                            valid: false, 
                            error: `Content too long (${length} > ${limits.max})`,
                            action: 'truncate'
                        };
                    }
                    
                    return { valid: true, length: length };
                }
            },
            
            format: {
                name: 'Format Validation',
                check: (content, format) => {
                    if (!content) return { valid: true };
                    
                    const str = content.toString();
                    
                    // Check for invalid characters
                    const invalidChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;
                    if (invalidChars.test(str)) {
                        return { 
                            valid: false, 
                            error: 'Contains invalid control characters',
                            action: 'sanitize'
                        };
                    }
                    
                    // Check for excessive whitespace
                    const excessiveWhitespace = /\s{5,}/g;
                    if (excessiveWhitespace.test(str)) {
                        return { 
                            valid: false, 
                            error: 'Contains excessive whitespace',
                            action: 'normalize'
                        };
                    }
                    
                    return { valid: true };
                }
            },
            
            structure: {
                name: 'Structure Validation',
                check: (content, structure) => {
                    if (Array.isArray(content)) {
                        if (structure.maxItems && content.length > structure.maxItems) {
                            return { 
                                valid: false, 
                                error: `Too many items (${content.length} > ${structure.maxItems})`,
                                action: 'slice'
                            };
                        }
                        
                        // Validate each item
                        for (let i = 0; i < content.length; i++) {
                            const item = content[i];
                            if (structure.itemLength) {
                                const itemValidation = this.validationRules.length.check(item, structure.itemLength);
                                if (!itemValidation.valid) {
                                    return { 
                                        valid: false, 
                                        error: `Item ${i + 1}: ${itemValidation.error}`,
                                        action: 'truncate_items'
                                    };
                                }
                            }
                        }
                    }
                    
                    return { valid: true };
                }
            }
        };
    }

    /**
     * Initialize truncation strategies
     */
    initializeTruncationStrategies() {
        return {
            smart: {
                name: 'Smart Truncation',
                description: 'Truncates at word boundaries, preserves meaning',
                execute: (content, maxLength) => this.smartTruncate(content, maxLength)
            },
            
            sentence: {
                name: 'Sentence Boundary Truncation',
                description: 'Truncates at sentence boundaries',
                execute: (content, maxLength) => this.sentenceTruncate(content, maxLength)
            },
            
            word: {
                name: 'Word Boundary Truncation',
                description: 'Truncates at word boundaries',
                execute: (content, maxLength) => this.wordTruncate(content, maxLength)
            },
            
            ellipsis: {
                name: 'Ellipsis Truncation',
                description: 'Adds ellipsis to indicate truncation',
                execute: (content, maxLength) => this.ellipsisTruncate(content, maxLength)
            },
            
            summary: {
                name: 'Summary Truncation',
                description: 'Creates a summary of the content',
                execute: (content, maxLength) => this.summaryTruncate(content, maxLength)
            },
            
            hard: {
                name: 'Hard Truncation',
                description: 'Simple character-based truncation',
                execute: (content, maxLength) => this.hardTruncate(content, maxLength)
            }
        };
    }

    /**
     * Initialize validation metrics
     */
    initializeValidationMetrics() {
        return {
            totalValidations: 0,
            validContent: 0,
            invalidContent: 0,
            truncations: 0,
            sanitizations: 0,
            validationErrors: [],
            averageContentLength: 0,
            truncationSavings: 0
        };
    }

    /**
     * Main validation entry point
     */
    async validateContent(input, options = {}) {
        try {
            const validationOptions = {
                strategy: options.strategy || 'smart',
                strict: options.strict || false,
                autoFix: options.autoFix !== false, // Default to true
                preserveStructure: options.preserveStructure !== false,
                ...options
            };
            
            const validationResult = {
                valid: true,
                original: input,
                validated: null,
                issues: [],
                fixes: [],
                metrics: {
                    originalLength: this.calculateTotalLength(input),
                    validatedLength: 0,
                    truncationSavings: 0,
                    validationTime: 0
                }
            };
            
            const startTime = Date.now();
            
            // Validate and fix the input
            validationResult.validated = await this.validateAndFixInput(input, validationOptions, validationResult);
            
            // Calculate final metrics
            validationResult.metrics.validatedLength = this.calculateTotalLength(validationResult.validated);
            validationResult.metrics.truncationSavings = 
                validationResult.metrics.originalLength - validationResult.metrics.validatedLength;
            validationResult.metrics.validationTime = Date.now() - startTime;
            
            // Update system metrics
            this.updateValidationMetrics(validationResult);
            
            return validationResult;
            
        } catch (error) {
            console.error('Content validation failed:', error);
            
            // Return safe fallback
            return {
                valid: false,
                original: input,
                validated: this.createSafeFallback(input),
                issues: [{ type: 'validation_error', message: error.message }],
                fixes: [{ type: 'fallback', message: 'Used safe fallback content' }],
                metrics: { validationTime: Date.now() - Date.now() }
            };
        }
    }

    /**
     * Validate and fix input content
     */
    async validateAndFixInput(input, options, result) {
        if (!input || typeof input !== 'object') {
            return this.createSafeFallback(input);
        }
        
        const validated = { ...input };
        
        // Validate presentation title
        if (validated.title) {
            const titleResult = this.validateAndFixField(
                validated.title, 
                this.contentLimits.presentation.title,
                'title',
                options
            );
            validated.title = titleResult.content;
            if (titleResult.issues.length > 0) {
                result.issues.push(...titleResult.issues);
                result.fixes.push(...titleResult.fixes);
            }
        } else {
            validated.title = 'Untitled Presentation';
            result.fixes.push({ type: 'default', field: 'title', message: 'Added default title' });
        }
        
        // Validate presentation subtitle
        if (validated.subtitle) {
            const subtitleResult = this.validateAndFixField(
                validated.subtitle,
                this.contentLimits.presentation.subtitle,
                'subtitle',
                options
            );
            validated.subtitle = subtitleResult.content;
            if (subtitleResult.issues.length > 0) {
                result.issues.push(...subtitleResult.issues);
                result.fixes.push(...subtitleResult.fixes);
            }
        }
        
        // Validate sections
        if (validated.sections && Array.isArray(validated.sections)) {
            const sectionsResult = this.validateAndFixSections(validated.sections, options);
            validated.sections = sectionsResult.content;
            if (sectionsResult.issues.length > 0) {
                result.issues.push(...sectionsResult.issues);
                result.fixes.push(...sectionsResult.fixes);
            }
        } else if (validated.content) {
            // Convert single content to sections
            const contentResult = this.validateAndFixField(
                validated.content,
                this.contentLimits.section.content,
                'content',
                options
            );
            validated.sections = [{
                title: 'Content',
                content: contentResult.content
            }];
            result.fixes.push({ type: 'structure', message: 'Converted content to sections' });
        } else {
            validated.sections = [{
                title: 'Default Section',
                content: 'This presentation contains default content.'
            }];
            result.fixes.push({ type: 'default', field: 'sections', message: 'Added default sections' });
        }
        
        // Validate slide count
        if (validated.slideCount) {
            const slideCount = Math.max(2, Math.min(this.contentLimits.presentation.maxSlides, 
                Math.floor(Number(validated.slideCount) || validated.sections.length + 1)));
            
            if (slideCount !== validated.slideCount) {
                result.fixes.push({ 
                    type: 'adjustment', 
                    field: 'slideCount', 
                    message: `Adjusted slide count from ${validated.slideCount} to ${slideCount}` 
                });
            }
            
            validated.slideCount = slideCount;
        } else {
            validated.slideCount = Math.min(validated.sections.length + 1, this.contentLimits.presentation.maxSlides);
            result.fixes.push({ type: 'default', field: 'slideCount', message: 'Set default slide count' });
        }
        
        return validated;
    }

    /**
     * Validate and fix sections array
     */
    validateAndFixSections(sections, options) {
        const result = {
            content: [],
            issues: [],
            fixes: []
        };
        
        // Limit number of sections
        const limitedSections = sections.slice(0, this.contentLimits.presentation.maxSections);
        
        if (limitedSections.length < sections.length) {
            result.fixes.push({
                type: 'truncation',
                field: 'sections',
                message: `Reduced sections from ${sections.length} to ${limitedSections.length}`
            });
        }
        
        // Validate each section
        for (let i = 0; i < limitedSections.length; i++) {
            const section = limitedSections[i];
            const validatedSection = { ...section };
            
            // Validate section title
            if (validatedSection.title) {
                const titleResult = this.validateAndFixField(
                    validatedSection.title,
                    this.contentLimits.section.title,
                    `section[${i}].title`,
                    options
                );
                validatedSection.title = titleResult.content;
                if (titleResult.issues.length > 0) {
                    result.issues.push(...titleResult.issues);
                    result.fixes.push(...titleResult.fixes);
                }
            } else {
                validatedSection.title = `Section ${i + 1}`;
                result.fixes.push({ 
                    type: 'default', 
                    field: `section[${i}].title`, 
                    message: 'Added default section title' 
                });
            }
            
            // Validate section content
            if (validatedSection.content) {
                const contentResult = this.validateAndFixSectionContent(
                    validatedSection.content,
                    options,
                    i
                );
                validatedSection.content = contentResult.content;
                if (contentResult.issues.length > 0) {
                    result.issues.push(...contentResult.issues);
                    result.fixes.push(...contentResult.fixes);
                }
            } else {
                validatedSection.content = `Content for ${validatedSection.title}`;
                result.fixes.push({ 
                    type: 'default', 
                    field: `section[${i}].content`, 
                    message: 'Added default section content' 
                });
            }
            
            result.content.push(validatedSection);
        }
        
        return result;
    }

    /**
     * Validate and fix section content (can be string or array)
     */
    validateAndFixSectionContent(content, options, sectionIndex) {
        const result = {
            content: content,
            issues: [],
            fixes: []
        };
        
        if (Array.isArray(content)) {
            // Handle array content (bullet points)
            const listResult = this.validateAndFixList(content, options, `section[${sectionIndex}].content`);
            result.content = listResult.content;
            result.issues.push(...listResult.issues);
            result.fixes.push(...listResult.fixes);
        } else {
            // Handle string content
            const textResult = this.validateAndFixField(
                content,
                this.contentLimits.section.content,
                `section[${sectionIndex}].content`,
                options
            );
            result.content = textResult.content;
            result.issues.push(...textResult.issues);
            result.fixes.push(...textResult.fixes);
        }
        
        return result;
    }

    /**
     * Validate and fix list content
     */
    validateAndFixList(list, options, fieldName) {
        const result = {
            content: [],
            issues: [],
            fixes: []
        };
        
        // Limit number of items
        const limitedList = list.slice(0, this.contentLimits.list.maxItems);
        
        if (limitedList.length < list.length) {
            result.fixes.push({
                type: 'truncation',
                field: fieldName,
                message: `Reduced list items from ${list.length} to ${limitedList.length}`
            });
        }
        
        // Validate each item
        for (let i = 0; i < limitedList.length; i++) {
            const item = limitedList[i];
            const itemResult = this.validateAndFixField(
                item,
                this.contentLimits.list.itemLength,
                `${fieldName}[${i}]`,
                options
            );
            
            if (itemResult.content && itemResult.content.toString().trim().length > 0) {
                result.content.push(itemResult.content);
            }
            
            if (itemResult.issues.length > 0) {
                result.issues.push(...itemResult.issues);
                result.fixes.push(...itemResult.fixes);
            }
        }
        
        return result;
    }

    /**
     * Validate and fix individual field
     */
    validateAndFixField(content, limits, fieldName, options) {
        const result = {
            content: content,
            issues: [],
            fixes: []
        };
        
        if (!content) {
            return result;
        }
        
        let processedContent = content.toString();
        
        // Format validation and sanitization
        const formatValidation = this.validationRules.format.check(processedContent);
        if (!formatValidation.valid) {
            result.issues.push({
                type: 'format',
                field: fieldName,
                message: formatValidation.error
            });
            
            if (options.autoFix) {
                processedContent = this.sanitizeContent(processedContent);
                result.fixes.push({
                    type: 'sanitization',
                    field: fieldName,
                    message: 'Sanitized content format'
                });
            }
        }
        
        // Length validation and truncation
        const lengthValidation = this.validationRules.length.check(processedContent, limits);
        if (!lengthValidation.valid) {
            result.issues.push({
                type: 'length',
                field: fieldName,
                message: lengthValidation.error
            });
            
            if (options.autoFix && lengthValidation.action === 'truncate') {
                const strategy = this.truncationStrategies[options.strategy] || this.truncationStrategies.smart;
                processedContent = strategy.execute(processedContent, limits.max);
                
                result.fixes.push({
                    type: 'truncation',
                    field: fieldName,
                    message: `Truncated using ${strategy.name} (${lengthValidation.length} → ${processedContent.length})`
                });
            } else if (options.autoFix && lengthValidation.action === 'pad') {
                processedContent = this.padContent(processedContent, limits.min);
                result.fixes.push({
                    type: 'padding',
                    field: fieldName,
                    message: `Padded content to minimum length`
                });
            }
        }
        
        result.content = processedContent;
        return result;
    }

    /**
     * Smart truncation - preserves word boundaries and meaning
     */
    smartTruncate(content, maxLength) {
        if (!content || content.length <= maxLength) {
            return content;
        }
        
        const str = content.toString();
        
        // Try sentence boundary first
        const sentences = str.split(/[.!?]+/);
        let result = '';
        
        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence && (result + trimmedSentence + '. ').length <= maxLength - 3) {
                result += (result ? ' ' : '') + trimmedSentence + '.';
            } else {
                break;
            }
        }
        
        if (result.length > 0 && result.length <= maxLength - 3) {
            return result;
        }
        
        // Fall back to word boundary
        return this.wordTruncate(str, maxLength);
    }

    /**
     * Sentence boundary truncation
     */
    sentenceTruncate(content, maxLength) {
        if (!content || content.length <= maxLength) {
            return content;
        }
        
        const str = content.toString();
        const sentences = str.split(/[.!?]+/);
        let result = '';
        
        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence) {
                const nextResult = result + (result ? ' ' : '') + trimmedSentence + '.';
                if (nextResult.length <= maxLength) {
                    result = nextResult;
                } else {
                    break;
                }
            }
        }
        
        return result || this.wordTruncate(str, maxLength);
    }

    /**
     * Word boundary truncation
     */
    wordTruncate(content, maxLength) {
        if (!content || content.length <= maxLength) {
            return content;
        }
        
        const str = content.toString();
        const words = str.split(/\s+/);
        let result = '';
        
        for (const word of words) {
            const nextResult = result + (result ? ' ' : '') + word;
            if (nextResult.length <= maxLength - 3) {
                result = nextResult;
            } else {
                break;
            }
        }
        
        return result + (result.length < str.length ? '...' : '');
    }

    /**
     * Ellipsis truncation
     */
    ellipsisTruncate(content, maxLength) {
        if (!content || content.length <= maxLength) {
            return content;
        }
        
        const str = content.toString();
        return str.substring(0, maxLength - 3) + '...';
    }

    /**
     * Summary truncation - creates a summary of the content
     */
    summaryTruncate(content, maxLength) {
        if (!content || content.length <= maxLength) {
            return content;
        }
        
        const str = content.toString();
        
        // Extract key sentences (first and last)
        const sentences = str.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        if (sentences.length <= 1) {
            return this.wordTruncate(str, maxLength);
        }
        
        const firstSentence = sentences[0].trim() + '.';
        const lastSentence = sentences[sentences.length - 1].trim() + '.';
        
        if (firstSentence === lastSentence) {
            return this.wordTruncate(firstSentence, maxLength);
        }
        
        const summary = firstSentence + ' ... ' + lastSentence;
        
        if (summary.length <= maxLength) {
            return summary;
        }
        
        return this.wordTruncate(firstSentence, maxLength);
    }

    /**
     * Hard truncation - simple character-based
     */
    hardTruncate(content, maxLength) {
        if (!content || content.length <= maxLength) {
            return content;
        }
        
        return content.toString().substring(0, maxLength);
    }

    /**
     * Sanitize content format
     */
    sanitizeContent(content) {
        if (!content) return content;
        
        let sanitized = content.toString();
        
        // Remove control characters
        sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
        
        // Normalize whitespace
        sanitized = sanitized.replace(/\s+/g, ' ');
        
        // Trim
        sanitized = sanitized.trim();
        
        return sanitized;
    }

    /**
     * Pad content to minimum length
     */
    padContent(content, minLength) {
        if (!content) {
            return 'Content placeholder'.repeat(Math.ceil(minLength / 18)).substring(0, minLength);
        }
        
        const str = content.toString();
        if (str.length >= minLength) {
            return str;
        }
        
        const padding = ' (additional content)';
        return str + padding.repeat(Math.ceil((minLength - str.length) / padding.length))
            .substring(0, minLength - str.length);
    }

    /**
     * Calculate total content length
     */
    calculateTotalLength(input) {
        if (!input) return 0;
        
        let totalLength = 0;
        
        if (typeof input === 'string') {
            return input.length;
        }
        
        if (typeof input === 'object') {
            if (input.title) totalLength += input.title.toString().length;
            if (input.subtitle) totalLength += input.subtitle.toString().length;
            if (input.description) totalLength += input.description.toString().length;
            
            if (input.sections && Array.isArray(input.sections)) {
                for (const section of input.sections) {
                    if (section.title) totalLength += section.title.toString().length;
                    if (section.content) {
                        if (Array.isArray(section.content)) {
                            totalLength += section.content.reduce((sum, item) => 
                                sum + item.toString().length, 0);
                        } else {
                            totalLength += section.content.toString().length;
                        }
                    }
                }
            }
            
            if (input.content) {
                if (Array.isArray(input.content)) {
                    totalLength += input.content.reduce((sum, item) => 
                        sum + item.toString().length, 0);
                } else {
                    totalLength += input.content.toString().length;
                }
            }
        }
        
        return totalLength;
    }

    /**
     * Create safe fallback content
     */
    createSafeFallback(input) {
        return {
            title: 'Safe Presentation',
            subtitle: 'Generated with content validation fallback',
            sections: [{
                title: 'Safe Content',
                content: 'This presentation was generated using safe fallback content due to validation constraints.'
            }],
            slideCount: 2
        };
    }

    /**
     * Update validation metrics
     */
    updateValidationMetrics(validationResult) {
        this.validationMetrics.totalValidations++;
        
        if (validationResult.valid) {
            this.validationMetrics.validContent++;
        } else {
            this.validationMetrics.invalidContent++;
        }
        
        if (validationResult.fixes.some(fix => fix.type === 'truncation')) {
            this.validationMetrics.truncations++;
        }
        
        if (validationResult.fixes.some(fix => fix.type === 'sanitization')) {
            this.validationMetrics.sanitizations++;
        }
        
        this.validationMetrics.truncationSavings += validationResult.metrics.truncationSavings || 0;
        
        // Update average content length
        this.validationMetrics.averageContentLength = 
            (this.validationMetrics.averageContentLength * (this.validationMetrics.totalValidations - 1) + 
             validationResult.metrics.validatedLength) / this.validationMetrics.totalValidations;
    }

    /**
     * Get validation metrics
     */
    getValidationMetrics() {
        return {
            ...this.validationMetrics,
            validationRate: this.validationMetrics.totalValidations > 0 ? 
                (this.validationMetrics.validContent / this.validationMetrics.totalValidations) * 100 : 0,
            truncationRate: this.validationMetrics.totalValidations > 0 ? 
                (this.validationMetrics.truncations / this.validationMetrics.totalValidations) * 100 : 0,
            sanitizationRate: this.validationMetrics.totalValidations > 0 ? 
                (this.validationMetrics.sanitizations / this.validationMetrics.totalValidations) * 100 : 0
        };
    }

    /**
     * Reset validation metrics
     */
    resetValidationMetrics() {
        this.validationMetrics = this.initializeValidationMetrics();
    }

    /**
     * Get content limits for a specific type
     */
    getContentLimits(type) {
        return this.contentLimits[type] || {};
    }

    /**
     * Get available truncation strategies
     */
    getTruncationStrategies() {
        return Object.keys(this.truncationStrategies);
    }

    /**
     * Validate content length only (quick check)
     */
    validateLength(content, maxLength) {
        if (!content) return { valid: true, length: 0 };
        
        const length = content.toString().length;
        return {
            valid: length <= maxLength,
            length: length,
            excess: Math.max(0, length - maxLength)
        };
    }

    /**
     * Quick truncate without full validation
     */
    quickTruncate(content, maxLength, strategy = 'smart') {
        if (!content || content.toString().length <= maxLength) {
            return content;
        }
        
        const truncationStrategy = this.truncationStrategies[strategy] || this.truncationStrategies.smart;
        return truncationStrategy.execute(content, maxLength);
    }
}

module.exports = ContentValidationSystem;