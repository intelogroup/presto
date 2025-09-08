/**
 * PptxGenJS Validation Helper
 * Validates PptxGenJS configurations, catches errors early, and provides suggestions
 */

const fs = require('fs');
const path = require('path');

class PptxValidationHelper {
    constructor() {
        this.validationRules = this.loadValidationRules();
        this.errorHistory = [];
        this.successCount = 0;
    }

    loadValidationRules() {
        return {
            // Presentation properties
            presentation: {
                title: { type: 'string', maxLength: 255 },
                subject: { type: 'string', maxLength: 255 },
                author: { type: 'string', maxLength: 255 },
                company: { type: 'string', maxLength: 255 }
            },

            // Slide properties
            slide: {
                background: {
                    color: { type: 'color' },
                    transparency: { type: 'percentage' }
                },
                hidden: { type: 'boolean' }
            },

            // Text elements
            text: {
                x: { type: 'percentage' },
                y: { type: 'percentage' },
                w: { type: 'percentage' },
                h: { type: 'percentage' },
                fontSize: { type: 'number', min: 6, max: 400 },
                bold: { type: 'boolean' },
                italic: { type: 'boolean' },
                underline: { type: 'boolean', values: [true, false, 'single', 'double', 'heavy', 'dotted', 'heavyHeavy', 'dottedHeavy'] },
                color: { type: 'color' },
                align: { type: 'enum', values: ['left', 'center', 'right', 'justify'] },
                valign: { type: 'enum', values: ['top', 'middle', 'bottom'] },
                fontFace: { type: 'string' },
                wrap: { type: 'boolean' },
                shrinkText: { type: 'boolean' },
                autoFit: { type: 'boolean' },
                lineSpacing: { type: 'number', min: 0, max: 132 },
                margin: { type: 'number', min: 0 },
                shadow: {
                    type: 'object',
                    properties: {
                        type: { type: 'enum', values: ['outer', 'inner'] },
                        color: { type: 'color' },
                        opacity: { type: 'percentage' },
                        blur: { type: 'number', min: 0, max: 100 },
                        offset: { type: 'number', min: -100, max: 100 }
                    }
                }
            },

            // Shape elements
            shape: {
                x: { type: 'percentage' },
                y: { type: 'percentage' },
                w: { type: 'percentage' },
                h: { type: 'percentage' },
                fill: {
                    type: 'object',
                    properties: {
                        color: { type: 'color' },
                        transparency: { type: 'percentage' }
                    }
                },
                line: {
                    type: 'object',
                    properties: {
                        color: { type: 'color' },
                        width: { type: 'number', min: 0, max: 100 },
                        style: { type: 'enum', values: ['solid', 'dashed', 'dotted', 'dashDot'] },
                        transparency: { type: 'percentage' }
                    }
                }
            },

            // Image elements
            image: {
                x: { type: 'percentage' },
                y: { type: 'percentage' },
                w: { type: 'percentage' },
                h: { type: 'percentage' },
                path: { type: 'string', validator: this.validateImagePath.bind(this) },
                sizing: {
                    type: 'object',
                    properties: {
                        type: { type: 'enum', values: ['contain', 'cover', 'crop'] },
                        x: { type: 'percentage' },
                        y: { type: 'percentage' },
                        w: { type: 'percentage' },
                        h: { type: 'percentage' }
                    }
                }
            },

            // Chart elements
            chart: {
                x: { type: 'percentage' },
                y: { type: 'percentage' },
                w: { type: 'percentage' },
                h: { type: 'percentage' },
                type: { type: 'enum', values: ['line', 'bar', 'area', 'pie', 'scatter'] },
                data: { type: 'array', validator: this.validateChartData.bind(this) }
            }
        };
    }

    validateImagePath(path) {
        if (!path) return { valid: false, error: 'Image path is required' };
        if (!fs.existsSync(path)) return { valid: false, error: `Image file not found: ${path}` };

        const ext = path.toLowerCase().split('.').pop();
        const validExts = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'svg'];
        if (!validExts.includes(ext)) {
            return { valid: false, error: `Unsupported image format: ${ext}. Supported: ${validExts.join(', ')}` };
        }

        try {
            const stats = fs.statSync(path);
            if (stats.size > 10 * 1024 * 1024) { // 10MB limit
                return { valid: false, error: 'Image file too large (>10MB)' };
            }
        } catch (error) {
            return { valid: false, error: `Cannot read image file: ${error.message}` };
        }

        return { valid: true };
    }

    validateChartData(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return { valid: false, error: 'Chart data must be non-empty array' };
        }

        // Basic validation - first row should be headers
        if (!Array.isArray(data[0])) {
            return { valid: false, error: 'Chart data must be 2D array' };
        }

        return { valid: true };
    }

    validateType(value, type, context = {}) {
        const result = { valid: true, value, warnings: [] };

        switch (type) {
            case 'string':
                if (typeof value !== 'string') {
                    result.valid = false;
                    result.error = `Expected string, got ${typeof value}`;
                    result.suggestion = `"${value}"`;
                } else if (context.maxLength && value.length > context.maxLength) {
                    result.valid = false;
                    result.error = `String too long: ${value.length}/${context.maxLength}`;
                    result.suggestion = value.substring(0, context.maxLength - 3) + '...';
                }
                break;

            case 'number':
                if (typeof value !== 'number' || isNaN(value)) {
                    result.valid = false;
                    result.error = `Expected number, got ${typeof value}`;
                } else if (context.min !== undefined && value < context.min) {
                    result.valid = false;
                    result.error = `Number too small: ${value} < ${context.min}`;
                    result.suggestion = context.min;
                } else if (context.max !== undefined && value > context.max) {
                    result.valid = false;
                    result.error = `Number too large: ${value} > ${context.max}`;
                    result.suggestion = context.max;
                }
                break;

            case 'boolean':
                if (typeof value !== 'boolean') {
                    result.valid = false;
                    result.error = `Expected boolean, got ${typeof value}`;
                    result.suggestion = Boolean(value);
                }
                break;

            case 'percentage':
                if (typeof value !== 'number' || isNaN(value)) {
                    result.valid = false;
                    result.error = `Expected number for percentage, got ${typeof value}`;
                } else if (value < 0 || value > 100) {
                    result.valid = false;
                    result.error = `Percentage out of range: ${value} (0-100 expected)`;
                    result.suggestion = Math.max(0, Math.min(100, value));
                }
                break;

            case 'color':
                if (typeof value !== 'string') {
                    result.valid = false;
                    result.error = `Expected string for color, got ${typeof value}`;
                } else {
                    const colorRegex = /^#[0-9A-Fa-f]{6}$/;
                    if (!colorRegex.test(value)) {
                        result.valid = false;
                        result.error = `Invalid color format: ${value}`;
                        result.suggestion = this.suggestColor(value);
                    }
                }
                break;

            case 'enum':
                if (context.values && !context.values.includes(value)) {
                    result.valid = false;
                    result.error = `Invalid value: ${value}. Expected: ${context.values.join(', ')}`;
                    result.suggestion = context.values[0];
                }
                break;

            case 'object':
                if (typeof value !== 'object' || value === null) {
                    result.valid = false;
                    result.error = `Expected object, got ${typeof value}`;
                }
                break;

            case 'array':
                if (!Array.isArray(value)) {
                    result.valid = false;
                    result.error = `Expected array, got ${typeof value}`;
                }
                break;

            default:
                if (context.validator) {
                    const customResult = context.validator(value);
                    if (!customResult.valid) {
                        result.valid = false;
                        result.error = customResult.error;
                        result.suggestion = customResult.suggestion;
                    }
                }
        }

        return result;
    }

    suggestColor(value) {
        // Simple color suggestions
        const suggestions = {
            'red': '#FF0000',
            'green': '#00FF00',
            'blue': '#0000FF',
            'black': '#000000',
            'white': '#FFFFFF',
            'gray': '#808080'
        };

        const lowerValue = value.toLowerCase();
        return suggestions[lowerValue] ||
               value.replace(/[^0-9A-Fa-f]/g, '').padStart(6, '#').substring(0, 7);
    }

    validateConfig(config, elementType = 'presentation') {
        const result = {
            valid: true,
            errors: [],
            warnings: [],
            suggestions: {}
        };

        if (!config || typeof config !== 'object') {
            result.valid = false;
            result.errors.push('Configuration must be an object');
            return result;
        }

        const rules = this.validationRules[elementType];
        if (!rules) {
            result.valid = false;
            result.errors.push(`Unknown element type: ${elementType}`);
            return result;
        }

        // Validate each property
        for (const [key, value] of Object.entries(config)) {
            const rule = rules[key];
            if (!rule) {
                result.warnings.push(`Unknown property: ${key}`);
                continue;
            }

            const validation = this.validateType(value, rule.type, rule);
            if (!validation.valid) {
                result.valid = false;
                result.errors.push(`${key}: ${validation.error}`);
                if (validation.suggestion !== undefined) {
                    result.suggestions[key] = validation.suggestion;
                }
            }
            if (validation.warnings) {
                result.warnings.push(...validation.warnings);
            }
        }

        return result;
    }

    validateSlide(slide) {
        const result = this.validateConfig(slide, 'slide');
        result.elements = [];

        // Validate elements if they exist
        if (slide.elements && Array.isArray(slide.elements)) {
            slide.elements.forEach((element, index) => {
                if (element.type === 'text') {
                    const elementResult = this.validateConfig(element.options || element, 'text');
                    if (!elementResult.valid) {
                        result.valid = false;
                        result.errors.push(`Element ${index}: ${elementResult.errors.join(', ')}`);
                    }
                } else if (element.type === 'image') {
                    const elementResult = this.validateConfig(element.options || element, 'image');
                    if (!elementResult.valid) {
                        result.valid = false;
                        result.errors.push(`Element ${index}: ${elementResult.errors.join(', ')}`);
                    }
                }
            });
        }

        return result;
    }

    reportValidation(validationResult, context = {}) {
        const report = {
            timestamp: new Date().toISOString(),
            context: context,
            summary: {
                totalErrors: validationResult.errors.length,
                totalWarnings: validationResult.warnings.length,
                valid: validationResult.valid
            },
            errors: validationResult.errors,
            warnings: validationResult.warnings,
            suggestions: validationResult.suggestions
        };

        // Store in history
        this.errorHistory.push(report);

        if (!validationResult.valid) {
            this.showErrorReport(report);
        } else {
            this.successCount++;
        }

        return report;
    }

    showErrorReport(report) {
        console.log('❌ PptxGenJS Validation Report');
        console.log('═'.repeat(50));

        if (!report.summary.valid) {
            report.errors.forEach((error, index) => {
                console.log(`🔴 Error ${index + 1}: ${error}`);
            });

            console.log('');

            if (Object.keys(report.suggestions).length > 0) {
                console.log('💡 Suggestions:');
                Object.entries(report.suggestions).forEach(([key, suggestion]) => {
                    console.log(`   ${key}: ${suggestion}`);
                });
            }
        }

        if (report.warnings.length > 0) {
            console.log('');
            console.log('⚠️  Warnings:');
            report.warnings.forEach((warning, index) => {
                console.log(`   ${index + 1}. ${warning}`);
            });
        }

        console.log('');
        console.log(`📊 Summary: ${report.summary.totalErrors} errors, ${report.summary.totalWarnings} warnings`);
        console.log('═'.repeat(50));
    }

    getStats() {
        return {
            totalValidations: this.errorHistory.length + this.successCount,
            successRate: ((this.successCount / (this.errorHistory.length + this.successCount)) * 100) || 100,
            recentErrors: this.errorHistory.slice(-5),
            commonErrors: this.getCommonErrors()
        };
    }

    getCommonErrors() {
        const errors = {};
        this.errorHistory.forEach(report => {
            report.errors.forEach(error => {
                errors[error] = (errors[error] || 0) + 1;
            });
        });
        return Object.entries(errors).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }

    // Static method for quick validation
    static quickValidate(config, elementType = 'presentation') {
        const validator = new PptxValidationHelper();
        return validator.validateConfig(config, elementType);
    }
}

module.exports = PptxValidationHelper;

// CLI usage
if (require.main === module) {
    const validator = new PptxValidationHelper();

    // Example usage
    const config = {
        title: 'Test Presentation',
        author: 'Test User',
        elements: [{
            type: 'text',
            text: 'Hello World',
            options: {
                x: 1,
                y: 1,
                w: 8,
                h: 2,
                fontSize: 44,
                color: 'INVALID_COLOR'
            }
        }]
    };

    console.log('🔍 Validating PptxGenJS configuration...');
    const result = validator.validateSlide(config);
    validator.reportValidation(result, { source: 'test.js' });

    console.log('');
    console.log('📈 Validation Statistics:', validator.getStats());
}
