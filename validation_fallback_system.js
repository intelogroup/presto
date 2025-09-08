#!/usr/bin/env node
/**
 * Comprehensive Validation and Fallback System
 * 
 * Provides robust validation, error handling, and fallback mechanisms for:
 * - Input data validation
 * - Schema validation
 * - Content sanitization
 * - Fallback content generation
 * - Error recovery strategies
 * 
 * Author: AI Assistant
 * Version: 1.0
 */

class ValidationFallbackSystem {
    constructor(options = {}) {
        this.options = {
            strictMode: options.strictMode || false,
            enableFallbacks: options.enableFallbacks !== false,
            maxRetries: options.maxRetries || 3,
            fallbackLanguage: options.fallbackLanguage || 'en',
            logLevel: options.logLevel || 'warn',
            ...options
        };
        
        this.validationRules = new Map();
        this.fallbackStrategies = new Map();
        this.errorHistory = [];
        
        this.setupDefaultRules();
        this.setupDefaultFallbacks();
    }

    setupDefaultRules() {
        // Text validation rules
        this.addValidationRule('text', (value) => {
            if (typeof value !== 'string') return { valid: false, error: 'Must be string' };
            if (value.length > 10000) return { valid: false, error: 'Text too long' };
            return { valid: true };
        });
        
        // Number validation rules
        this.addValidationRule('number', (value) => {
            if (typeof value !== 'number') return { valid: false, error: 'Must be number' };
            if (!isFinite(value)) return { valid: false, error: 'Must be finite number' };
            return { valid: true };
        });
        
        // Array validation rules
        this.addValidationRule('array', (value) => {
            if (!Array.isArray(value)) return { valid: false, error: 'Must be array' };
            if (value.length > 1000) return { valid: false, error: 'Array too large' };
            return { valid: true };
        });
        
        // Object validation rules
        this.addValidationRule('object', (value) => {
            if (typeof value !== 'object' || value === null) return { valid: false, error: 'Must be object' };
            if (Object.keys(value).length > 100) return { valid: false, error: 'Object too complex' };
            return { valid: true };
        });
        
        // Color validation rules
        this.addValidationRule('color', (value) => {
            if (typeof value !== 'string') return { valid: false, error: 'Color must be string' };
            const colorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(\d+,\s*\d+,\s*\d+\)$|^rgba\(\d+,\s*\d+,\s*\d+,\s*[0-1](\.\d+)?\)$/;
            if (!colorRegex.test(value)) return { valid: false, error: 'Invalid color format' };
            return { valid: true };
        });
        
        // URL validation rules
        this.addValidationRule('url', (value) => {
            if (typeof value !== 'string') return { valid: false, error: 'URL must be string' };
            try {
                new URL(value);
                return { valid: true };
            } catch {
                return { valid: false, error: 'Invalid URL format' };
            }
        });
    }

    setupDefaultFallbacks() {
        // Text fallbacks
        this.addFallbackStrategy('text', (originalValue, context) => {
            if (typeof originalValue === 'string') {
                return originalValue.substring(0, 1000); // Truncate long text
            }
            return context?.defaultText || 'Default Text';
        });
        
        // Number fallbacks
        this.addFallbackStrategy('number', (originalValue, context) => {
            if (typeof originalValue === 'number' && isFinite(originalValue)) {
                return originalValue;
            }
            if (typeof originalValue === 'string') {
                const parsed = parseFloat(originalValue);
                if (isFinite(parsed)) return parsed;
            }
            return context?.defaultNumber || 0;
        });
        
        // Array fallbacks
        this.addFallbackStrategy('array', (originalValue, context) => {
            if (Array.isArray(originalValue)) {
                return originalValue.slice(0, 100); // Limit array size
            }
            if (originalValue != null) {
                return [originalValue]; // Wrap single value in array
            }
            return context?.defaultArray || [];
        });
        
        // Object fallbacks
        this.addFallbackStrategy('object', (originalValue, context) => {
            if (typeof originalValue === 'object' && originalValue !== null) {
                // Limit object complexity
                const keys = Object.keys(originalValue).slice(0, 50);
                const limited = {};
                keys.forEach(key => {
                    limited[key] = originalValue[key];
                });
                return limited;
            }
            return context?.defaultObject || {};
        });
        
        // Color fallbacks
        this.addFallbackStrategy('color', (originalValue, context) => {
            const defaultColors = ['#333333', '#666666', '#999999', '#CCCCCC'];
            
            if (typeof originalValue === 'string') {
                // Try to extract hex color from string
                const hexMatch = originalValue.match(/#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})/);
                if (hexMatch) return hexMatch[0];
            }
            
            return context?.defaultColor || defaultColors[Math.floor(Math.random() * defaultColors.length)];
        });
        
        // URL fallbacks
        this.addFallbackStrategy('url', (originalValue, context) => {
            if (typeof originalValue === 'string') {
                // Try to fix common URL issues
                let fixed = originalValue.trim();
                if (!fixed.startsWith('http://') && !fixed.startsWith('https://')) {
                    fixed = 'https://' + fixed;
                }
                try {
                    new URL(fixed);
                    return fixed;
                } catch {}
            }
            return context?.defaultUrl || 'https://example.com';
        });
    }

    addValidationRule(type, validator) {
        this.validationRules.set(type, validator);
    }

    addFallbackStrategy(type, strategy) {
        this.fallbackStrategies.set(type, strategy);
    }

    // Validate single value
    validateValue(value, type, context = {}) {
        try {
            const validator = this.validationRules.get(type);
            if (!validator) {
                return { valid: true, value, warning: `No validator for type: ${type}` };
            }
            
            const result = validator(value, context);
            
            if (result.valid) {
                return { valid: true, value };
            } else {
                // Apply fallback if enabled
                if (this.options.enableFallbacks) {
                    const fallbackValue = this.applyFallback(value, type, context);
                    return {
                        valid: true,
                        value: fallbackValue,
                        warning: `Applied fallback for ${type}: ${result.error}`,
                        originalError: result.error
                    };
                } else {
                    return {
                        valid: false,
                        value,
                        error: result.error
                    };
                }
            }
        } catch (error) {
            this.logError('validateValue', error, { value, type, context });
            
            if (this.options.enableFallbacks) {
                const fallbackValue = this.applyFallback(value, type, context);
                return {
                    valid: true,
                    value: fallbackValue,
                    warning: `Validation error, applied fallback: ${error.message}`
                };
            } else {
                return {
                    valid: false,
                    value,
                    error: `Validation failed: ${error.message}`
                };
            }
        }
    }

    // Apply fallback strategy
    applyFallback(value, type, context = {}) {
        try {
            const strategy = this.fallbackStrategies.get(type);
            if (strategy) {
                return strategy(value, context);
            } else {
                // Generic fallback
                return this.getGenericFallback(type, context);
            }
        } catch (error) {
            this.logError('applyFallback', error, { value, type, context });
            return this.getGenericFallback(type, context);
        }
    }

    getGenericFallback(type, context = {}) {
        const fallbacks = {
            'string': 'Default Text',
            'text': 'Default Text',
            'number': 0,
            'boolean': false,
            'array': [],
            'object': {},
            'color': '#333333',
            'url': 'https://example.com'
        };
        
        return context[`default${type.charAt(0).toUpperCase() + type.slice(1)}`] || fallbacks[type] || null;
    }

    // Validate object schema
    validateSchema(data, schema, context = {}) {
        const results = {
            valid: true,
            data: {},
            errors: [],
            warnings: []
        };
        
        try {
            // Validate required fields
            if (schema.required) {
                for (const field of schema.required) {
                    if (!(field in data)) {
                        if (this.options.enableFallbacks && schema.properties?.[field]) {
                            const fieldSchema = schema.properties[field];
                            const fallbackValue = this.applyFallback(undefined, fieldSchema.type, {
                                ...context,
                                field,
                                schema: fieldSchema
                            });
                            results.data[field] = fallbackValue;
                            results.warnings.push(`Missing required field '${field}', applied fallback`);
                        } else {
                            results.valid = false;
                            results.errors.push(`Missing required field: ${field}`);
                        }
                    }
                }
            }
            
            // Validate properties
            if (schema.properties) {
                for (const [field, fieldSchema] of Object.entries(schema.properties)) {
                    if (field in data) {
                        const validation = this.validateValue(data[field], fieldSchema.type, {
                            ...context,
                            field,
                            schema: fieldSchema
                        });
                        
                        if (validation.valid) {
                            results.data[field] = validation.value;
                            if (validation.warning) {
                                results.warnings.push(`Field '${field}': ${validation.warning}`);
                            }
                        } else {
                            results.valid = false;
                            results.errors.push(`Field '${field}': ${validation.error}`);
                        }
                    } else if (!schema.required?.includes(field)) {
                        // Optional field, use default if available
                        if (fieldSchema.default !== undefined) {
                            results.data[field] = fieldSchema.default;
                        }
                    }
                }
            }
            
            // Copy additional properties if allowed
            if (schema.additionalProperties !== false) {
                for (const [field, value] of Object.entries(data)) {
                    if (!schema.properties?.[field] && !(field in results.data)) {
                        results.data[field] = value;
                    }
                }
            }
            
        } catch (error) {
            this.logError('validateSchema', error, { data, schema, context });
            results.valid = false;
            results.errors.push(`Schema validation failed: ${error.message}`);
        }
        
        return results;
    }

    // Sanitize content for presentation
    sanitizeContent(content, options = {}) {
        try {
            if (typeof content === 'string') {
                return this.sanitizeText(content, options);
            } else if (Array.isArray(content)) {
                return content.map(item => this.sanitizeContent(item, options));
            } else if (typeof content === 'object' && content !== null) {
                const sanitized = {};
                Object.entries(content).forEach(([key, value]) => {
                    sanitized[key] = this.sanitizeContent(value, options);
                });
                return sanitized;
            } else {
                return content;
            }
        } catch (error) {
            this.logError('sanitizeContent', error, { content, options });
            return this.applyFallback(content, 'text', options);
        }
    }

    sanitizeText(text, options = {}) {
        if (typeof text !== 'string') {
            return String(text);
        }
        
        let sanitized = text;
        
        // Remove potentially harmful content
        if (options.removeScripts !== false) {
            sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
        }
        
        if (options.removeHtml !== false) {
            sanitized = sanitized.replace(/<[^>]*>/g, '');
        }
        
        // Normalize whitespace
        if (options.normalizeWhitespace !== false) {
            sanitized = sanitized.replace(/\s+/g, ' ').trim();
        }
        
        // Limit length
        const maxLength = options.maxLength || 5000;
        if (sanitized.length > maxLength) {
            sanitized = sanitized.substring(0, maxLength) + '...';
        }
        
        return sanitized;
    }

    // Error recovery with retries
    async executeWithRetry(operation, context = {}) {
        let lastError = null;
        
        for (let attempt = 1; attempt <= this.options.maxRetries; attempt++) {
            try {
                const result = await operation(attempt, context);
                
                // Log successful recovery if not first attempt
                if (attempt > 1) {
                    this.log('info', `Operation succeeded on attempt ${attempt}`, context);
                }
                
                return { success: true, result, attempts: attempt };
                
            } catch (error) {
                lastError = error;
                this.logError(`executeWithRetry_attempt_${attempt}`, error, context);
                
                // Wait before retry (exponential backoff)
                if (attempt < this.options.maxRetries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        // All attempts failed
        return {
            success: false,
            error: lastError,
            attempts: this.options.maxRetries
        };
    }

    // Logging methods
    log(level, message, context = {}) {
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        const currentLevel = levels[this.options.logLevel] || 1;
        const messageLevel = levels[level] || 1;
        
        if (messageLevel <= currentLevel) {
            const timestamp = new Date().toISOString();
            const contextStr = Object.keys(context).length > 0 ? JSON.stringify(context) : '';
            console.log(`[${timestamp}] ${level.toUpperCase()}: ${message} ${contextStr}`);
        }
    }

    logError(operation, error, context = {}) {
        const errorInfo = {
            operation,
            message: error.message,
            stack: error.stack,
            context,
            timestamp: Date.now()
        };
        
        this.errorHistory.push(errorInfo);
        
        // Keep only last 100 errors
        if (this.errorHistory.length > 100) {
            this.errorHistory = this.errorHistory.slice(-100);
        }
        
        this.log('error', `${operation}: ${error.message}`, context);
    }

    // Get error statistics
    getErrorStats() {
        const stats = {
            totalErrors: this.errorHistory.length,
            recentErrors: this.errorHistory.filter(e => Date.now() - e.timestamp < 300000).length, // Last 5 minutes
            errorsByOperation: {},
            mostCommonErrors: {}
        };
        
        this.errorHistory.forEach(error => {
            // Count by operation
            stats.errorsByOperation[error.operation] = (stats.errorsByOperation[error.operation] || 0) + 1;
            
            // Count by message
            stats.mostCommonErrors[error.message] = (stats.mostCommonErrors[error.message] || 0) + 1;
        });
        
        return stats;
    }

    // Reset error history
    clearErrorHistory() {
        this.errorHistory = [];
    }
}

// Export the system
module.exports = ValidationFallbackSystem;

// Example usage
if (require.main === module) {
    const validator = new ValidationFallbackSystem({
        enableFallbacks: true,
        logLevel: 'info'
    });
    
    // Test validation
    console.log('🧪 Testing Validation System...');
    
    // Test individual values
    console.log('\n📝 Testing individual values:');
    console.log('Text:', validator.validateValue('Hello World', 'text'));
    console.log('Long text:', validator.validateValue('x'.repeat(15000), 'text'));
    console.log('Number:', validator.validateValue(42, 'number'));
    console.log('Invalid number:', validator.validateValue('not a number', 'number'));
    console.log('Color:', validator.validateValue('#FF0000', 'color'));
    console.log('Invalid color:', validator.validateValue('red', 'color'));
    
    // Test schema validation
    console.log('\n📋 Testing schema validation:');
    const schema = {
        required: ['title', 'content'],
        properties: {
            title: { type: 'text' },
            content: { type: 'text' },
            color: { type: 'color', default: '#333333' },
            count: { type: 'number', default: 0 }
        }
    };
    
    const testData = {
        title: 'Test Slide',
        content: 'This is test content',
        color: 'invalid-color',
        extra: 'This should be preserved'
    };
    
    const schemaResult = validator.validateSchema(testData, schema);
    console.log('Schema validation result:', schemaResult);
    
    // Test content sanitization
    console.log('\n🧹 Testing content sanitization:');
    const dirtyContent = '<script>alert("xss")</script><p>Clean content</p>   Extra   spaces   ';
    console.log('Sanitized:', validator.sanitizeContent(dirtyContent));
    
    // Test error recovery
    console.log('\n🔄 Testing error recovery:');
    validator.executeWithRetry(async (attempt) => {
        if (attempt < 3) {
            throw new Error(`Simulated failure on attempt ${attempt}`);
        }
        return `Success on attempt ${attempt}`;
    }).then(result => {
        console.log('Recovery result:', result);
        console.log('Error stats:', validator.getErrorStats());
    });
}