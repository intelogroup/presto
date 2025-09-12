/**
 * Advanced Error Handling and Fallback System
 * Provides comprehensive error recovery and graceful degradation
 * for the dynamic presentation generation system
 */

class AdvancedErrorHandlingSystem {
    constructor() {
        this.errorCategories = this.initializeErrorCategories();
        this.fallbackStrategies = this.initializeFallbackStrategies();
        this.errorMetrics = this.initializeErrorMetrics();
        this.recoveryAttempts = new Map();
        this.maxRecoveryAttempts = 3;
    }

    /**
     * Initialize error categories and their handling strategies
     */
    initializeErrorCategories() {
        return {
            INPUT_VALIDATION: {
                code: 'INPUT_001',
                severity: 'medium',
                recoverable: true,
                strategy: 'sanitize_and_retry'
            },
            CONTENT_OVERFLOW: {
                code: 'CONTENT_002',
                severity: 'low',
                recoverable: true,
                strategy: 'truncate_and_continue'
            },
            TEMPLATE_FAILURE: {
                code: 'TEMPLATE_003',
                severity: 'medium',
                recoverable: true,
                strategy: 'fallback_template'
            },
            GENERATION_FAILURE: {
                code: 'GENERATION_004',
                severity: 'high',
                recoverable: true,
                strategy: 'emergency_fallback'
            },
            SYSTEM_ERROR: {
                code: 'SYSTEM_005',
                severity: 'critical',
                recoverable: true,
                strategy: 'minimal_safe_output'
            },
            MEMORY_ERROR: {
                code: 'MEMORY_006',
                severity: 'high',
                recoverable: true,
                strategy: 'reduce_complexity'
            },
            TIMEOUT_ERROR: {
                code: 'TIMEOUT_007',
                severity: 'medium',
                recoverable: true,
                strategy: 'simplified_generation'
            },
            UNKNOWN_ERROR: {
                code: 'UNKNOWN_999',
                severity: 'high',
                recoverable: true,
                strategy: 'universal_fallback'
            }
        };
    }

    /**
     * Initialize fallback strategies
     */
    initializeFallbackStrategies() {
        return {
            sanitize_and_retry: {
                name: 'Input Sanitization and Retry',
                action: (error, context) => this.sanitizeInputAndRetry(error, context),
                maxAttempts: 2
            },
            truncate_and_continue: {
                name: 'Content Truncation',
                action: (error, context) => this.truncateContentAndContinue(error, context),
                maxAttempts: 1
            },
            fallback_template: {
                name: 'Fallback Template Usage',
                action: (error, context) => this.useFallbackTemplate(error, context),
                maxAttempts: 1
            },
            emergency_fallback: {
                name: 'Emergency Fallback Generation',
                action: (error, context) => this.emergencyFallbackGeneration(error, context),
                maxAttempts: 1
            },
            minimal_safe_output: {
                name: 'Minimal Safe Output',
                action: (error, context) => this.generateMinimalSafeOutput(error, context),
                maxAttempts: 1
            },
            reduce_complexity: {
                name: 'Complexity Reduction',
                action: (error, context) => this.reduceComplexityAndRetry(error, context),
                maxAttempts: 2
            },
            simplified_generation: {
                name: 'Simplified Generation',
                action: (error, context) => this.simplifiedGeneration(error, context),
                maxAttempts: 1
            },
            universal_fallback: {
                name: 'Universal Fallback',
                action: (error, context) => this.universalFallback(error, context),
                maxAttempts: 1
            }
        };
    }

    /**
     * Initialize error metrics tracking
     */
    initializeErrorMetrics() {
        return {
            totalErrors: 0,
            errorsByCategory: {},
            recoverySuccessRate: 0,
            fallbackUsageRate: 0,
            averageRecoveryTime: 0,
            criticalErrors: 0,
            lastError: null,
            errorHistory: []
        };
    }

    /**
     * Main error handling entry point
     */
    async handleError(error, context = {}) {
        const startTime = Date.now();
        
        try {
            // Categorize the error
            const errorCategory = this.categorizeError(error);
            
            // Log the error
            this.logError(error, errorCategory, context);
            
            // Check if we've exceeded recovery attempts
            const attemptKey = this.generateAttemptKey(error, context);
            const currentAttempts = this.recoveryAttempts.get(attemptKey) || 0;
            
            if (currentAttempts >= this.maxRecoveryAttempts) {
                console.warn('Max recovery attempts exceeded, using universal fallback');
                return await this.universalFallback(error, context);
            }
            
            // Increment recovery attempts
            this.recoveryAttempts.set(attemptKey, currentAttempts + 1);
            
            // Get the appropriate fallback strategy
            const strategy = this.fallbackStrategies[errorCategory.strategy];
            
            if (!strategy) {
                console.warn('No strategy found for error category, using universal fallback');
                return await this.universalFallback(error, context);
            }
            
            // Execute the recovery strategy
            const result = await strategy.action(error, context);
            
            // Record successful recovery
            const recoveryTime = Date.now() - startTime;
            this.recordSuccessfulRecovery(errorCategory, recoveryTime);
            
            // Clear recovery attempts on success
            this.recoveryAttempts.delete(attemptKey);
            
            return result;
            
        } catch (recoveryError) {
            console.error('Error during recovery:', recoveryError);
            
            // If recovery fails, use universal fallback
            return await this.universalFallback(error, context);
        }
    }

    /**
     * Categorize error based on type and message
     */
    categorizeError(error) {
        try {
            const errorMessage = (error.message || '').toLowerCase();
            const errorName = (error.name || '').toLowerCase();
            
            // Input validation errors
            if (errorMessage.includes('invalid') || 
                errorMessage.includes('validation') ||
                errorMessage.includes('required') ||
                errorName.includes('validation')) {
                return this.errorCategories.INPUT_VALIDATION;
            }
            
            // Content overflow errors
            if (errorMessage.includes('overflow') ||
                errorMessage.includes('too long') ||
                errorMessage.includes('exceeds') ||
                errorMessage.includes('limit')) {
                return this.errorCategories.CONTENT_OVERFLOW;
            }
            
            // Template errors
            if (errorMessage.includes('template') ||
                errorMessage.includes('layout') ||
                errorMessage.includes('render')) {
                return this.errorCategories.TEMPLATE_FAILURE;
            }
            
            // Memory errors
            if (errorMessage.includes('memory') ||
                errorMessage.includes('heap') ||
                errorName.includes('rangeerror')) {
                return this.errorCategories.MEMORY_ERROR;
            }
            
            // Timeout errors
            if (errorMessage.includes('timeout') ||
                errorMessage.includes('time') ||
                errorName.includes('timeout')) {
                return this.errorCategories.TIMEOUT_ERROR;
            }
            
            // Generation errors
            if (errorMessage.includes('generation') ||
                errorMessage.includes('create') ||
                errorMessage.includes('build')) {
                return this.errorCategories.GENERATION_FAILURE;
            }
            
            // System errors
            if (errorName.includes('system') ||
                errorName.includes('reference') ||
                errorName.includes('type')) {
                return this.errorCategories.SYSTEM_ERROR;
            }
            
            // Default to unknown error
            return this.errorCategories.UNKNOWN_ERROR;
            
        } catch (categorizationError) {
            console.warn('Error categorization failed:', categorizationError);
            return this.errorCategories.UNKNOWN_ERROR;
        }
    }

    /**
     * Sanitize input and retry generation
     */
    async sanitizeInputAndRetry(error, context) {
        try {
            const sanitizedInput = this.sanitizeInput(context.input || {});
            
            return {
                success: true,
                result: sanitizedInput,
                recovery: 'input_sanitized',
                message: 'Input sanitized and ready for retry'
            };
            
        } catch (sanitizationError) {
            return await this.useFallbackTemplate(error, context);
        }
    }

    /**
     * Sanitize input data
     */
    sanitizeInput(input) {
        try {
            const sanitized = {};
            
            // Sanitize title
            if (input.title) {
                sanitized.title = String(input.title).substring(0, 80).trim() || 'Untitled Presentation';
            } else {
                sanitized.title = 'Untitled Presentation';
            }
            
            // Sanitize subtitle
            if (input.subtitle) {
                sanitized.subtitle = String(input.subtitle).substring(0, 120).trim();
            }
            
            // Sanitize sections
            if (Array.isArray(input.sections)) {
                sanitized.sections = input.sections.slice(0, 20).map(section => ({
                    title: String(section.title || 'Section').substring(0, 60).trim(),
                    content: this.sanitizeContent(section.content)
                }));
            } else if (input.content) {
                sanitized.sections = [{
                    title: 'Content',
                    content: this.sanitizeContent(input.content)
                }];
            } else {
                sanitized.sections = [{
                    title: 'Default Section',
                    content: 'This presentation was generated with default content.'
                }];
            }
            
            // Sanitize slide count
            if (input.slideCount && typeof input.slideCount === 'number') {
                sanitized.slideCount = Math.max(2, Math.min(20, Math.floor(input.slideCount)));
            } else {
                sanitized.slideCount = Math.max(2, sanitized.sections.length + 1);
            }
            
            return sanitized;
            
        } catch (error) {
            // Emergency sanitization
            return {
                title: 'Emergency Presentation',
                sections: [{
                    title: 'Content',
                    content: 'This presentation was generated using emergency fallback.'
                }],
                slideCount: 2
            };
        }
    }

    /**
     * Sanitize content (text or array)
     */
    sanitizeContent(content) {
        try {
            if (Array.isArray(content)) {
                return content.slice(0, 8).map(item => 
                    String(item).substring(0, 120).trim()
                ).filter(item => item.length > 0);
            } else if (typeof content === 'string') {
                return content.substring(0, 800).trim();
            } else {
                return String(content).substring(0, 800).trim();
            }
        } catch (error) {
            return 'Content could not be processed.';
        }
    }

    /**
     * Truncate content and continue
     */
    async truncateContentAndContinue(error, context) {
        try {
            const truncatedInput = this.truncateAllContent(context.input || {});
            
            return {
                success: true,
                result: truncatedInput,
                recovery: 'content_truncated',
                message: 'Content truncated to safe limits'
            };
            
        } catch (truncationError) {
            return await this.useFallbackTemplate(error, context);
        }
    }

    /**
     * Truncate all content to safe limits
     */
    truncateAllContent(input) {
        const truncated = { ...input };
        
        // Aggressive truncation
        if (truncated.title) {
            truncated.title = String(truncated.title).substring(0, 50);
        }
        
        if (truncated.subtitle) {
            truncated.subtitle = String(truncated.subtitle).substring(0, 80);
        }
        
        if (Array.isArray(truncated.sections)) {
            truncated.sections = truncated.sections.slice(0, 5).map(section => ({
                title: String(section.title || '').substring(0, 40),
                content: this.aggressiveTruncateContent(section.content)
            }));
        }
        
        if (truncated.slideCount > 10) {
            truncated.slideCount = 10;
        }
        
        return truncated;
    }

    /**
     * Aggressively truncate content
     */
    aggressiveTruncateContent(content) {
        try {
            if (Array.isArray(content)) {
                return content.slice(0, 5).map(item => 
                    String(item).substring(0, 80)
                );
            } else {
                return String(content).substring(0, 400);
            }
        } catch (error) {
            return 'Content truncated due to processing error.';
        }
    }

    /**
     * Use fallback template
     */
    async useFallbackTemplate(error, context) {
        try {
            const fallbackContent = {
                title: 'Presentation Generated with Fallback',
                subtitle: 'Content processed using safe fallback template',
                sections: [
                    {
                        title: 'Content Overview',
                        content: 'This presentation was generated using a safe fallback template due to processing constraints.'
                    },
                    {
                        title: 'System Information',
                        content: `Generated on ${new Date().toLocaleDateString()} using advanced error recovery.`
                    }
                ],
                slideCount: 3
            };
            
            return {
                success: true,
                result: fallbackContent,
                recovery: 'fallback_template',
                message: 'Generated using safe fallback template'
            };
            
        } catch (fallbackError) {
            return await this.emergencyFallbackGeneration(error, context);
        }
    }

    /**
     * Emergency fallback generation
     */
    async emergencyFallbackGeneration(error, context) {
        try {
            const emergencyContent = {
                title: 'Emergency Presentation',
                sections: [{
                    title: 'Emergency Content',
                    content: 'This presentation was generated using emergency fallback procedures.'
                }],
                slideCount: 2
            };
            
            return {
                success: true,
                result: emergencyContent,
                recovery: 'emergency_fallback',
                message: 'Generated using emergency fallback'
            };
            
        } catch (emergencyError) {
            return await this.generateMinimalSafeOutput(error, context);
        }
    }

    /**
     * Generate minimal safe output
     */
    async generateMinimalSafeOutput(error, context) {
        try {
            return {
                success: true,
                result: {
                    title: 'Safe Presentation',
                    slideCount: 1,
                    content: 'Minimal safe presentation generated.'
                },
                recovery: 'minimal_safe',
                message: 'Generated minimal safe output'
            };
        } catch (minimalError) {
            return this.universalFallback(error, context);
        }
    }

    /**
     * Reduce complexity and retry
     */
    async reduceComplexityAndRetry(error, context) {
        try {
            const simplifiedInput = {
                title: 'Simplified Presentation',
                sections: [{
                    title: 'Content',
                    content: 'Simplified content due to complexity constraints.'
                }],
                slideCount: 2
            };
            
            return {
                success: true,
                result: simplifiedInput,
                recovery: 'complexity_reduced',
                message: 'Complexity reduced for processing'
            };
            
        } catch (reductionError) {
            return await this.universalFallback(error, context);
        }
    }

    /**
     * Simplified generation
     */
    async simplifiedGeneration(error, context) {
        return await this.reduceComplexityAndRetry(error, context);
    }

    /**
     * Universal fallback - always succeeds
     */
    async universalFallback(error, context) {
        return {
            success: true,
            result: {
                title: 'Universal Fallback Presentation',
                slideCount: 1,
                fallback: true,
                message: 'Generated using universal fallback system'
            },
            recovery: 'universal_fallback',
            message: 'Universal fallback executed successfully'
        };
    }

    /**
     * Generate attempt key for tracking recovery attempts
     */
    generateAttemptKey(error, context) {
        try {
            const errorType = error.name || 'UnknownError';
            const contextHash = JSON.stringify(context).substring(0, 50);
            return `${errorType}_${contextHash}`;
        } catch (keyError) {
            return `fallback_${Date.now()}`;
        }
    }

    /**
     * Log error for monitoring and debugging
     */
    logError(error, category, context) {
        try {
            const errorRecord = {
                timestamp: new Date().toISOString(),
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack
                },
                category: category.code,
                severity: category.severity,
                context: context,
                recoverable: category.recoverable
            };
            
            // Update metrics
            this.errorMetrics.totalErrors++;
            this.errorMetrics.errorsByCategory[category.code] = 
                (this.errorMetrics.errorsByCategory[category.code] || 0) + 1;
            
            if (category.severity === 'critical') {
                this.errorMetrics.criticalErrors++;
            }
            
            this.errorMetrics.lastError = errorRecord;
            this.errorMetrics.errorHistory.push(errorRecord);
            
            // Keep only last 100 errors in history
            if (this.errorMetrics.errorHistory.length > 100) {
                this.errorMetrics.errorHistory = this.errorMetrics.errorHistory.slice(-100);
            }
            
            console.warn(`[${category.code}] ${category.severity.toUpperCase()}: ${error.message}`);
            
        } catch (loggingError) {
            console.error('Failed to log error:', loggingError);
        }
    }

    /**
     * Record successful recovery
     */
    recordSuccessfulRecovery(category, recoveryTime) {
        try {
            // Update success rate calculation
            const totalRecoveries = Object.values(this.errorMetrics.errorsByCategory)
                .reduce((sum, count) => sum + count, 0);
            
            this.errorMetrics.recoverySuccessRate = 
                ((totalRecoveries - this.errorMetrics.criticalErrors) / totalRecoveries) * 100;
            
            // Update average recovery time
            this.errorMetrics.averageRecoveryTime = 
                (this.errorMetrics.averageRecoveryTime + recoveryTime) / 2;
            
        } catch (recordingError) {
            console.warn('Failed to record recovery metrics:', recordingError);
        }
    }

    /**
     * Get error metrics
     */
    getErrorMetrics() {
        return {
            ...this.errorMetrics,
            activeRecoveryAttempts: this.recoveryAttempts.size,
            errorCategories: Object.keys(this.errorCategories).length,
            fallbackStrategies: Object.keys(this.fallbackStrategies).length
        };
    }

    /**
     * Reset error metrics
     */
    resetErrorMetrics() {
        this.errorMetrics = this.initializeErrorMetrics();
        this.recoveryAttempts.clear();
    }

    /**
     * Check system health
     */
    getSystemHealth() {
        const metrics = this.getErrorMetrics();
        
        return {
            status: metrics.criticalErrors === 0 ? 'healthy' : 'degraded',
            errorRate: metrics.totalErrors,
            recoveryRate: metrics.recoverySuccessRate,
            lastError: metrics.lastError?.timestamp || 'none',
            recommendations: this.generateHealthRecommendations(metrics)
        };
    }

    /**
     * Generate health recommendations
     */
    generateHealthRecommendations(metrics) {
        const recommendations = [];
        
        if (metrics.criticalErrors > 0) {
            recommendations.push('Critical errors detected - review system logs');
        }
        
        if (metrics.recoverySuccessRate < 90) {
            recommendations.push('Recovery success rate below 90% - investigate error patterns');
        }
        
        if (metrics.averageRecoveryTime > 1000) {
            recommendations.push('Recovery time exceeds 1 second - optimize fallback strategies');
        }
        
        if (recommendations.length === 0) {
            recommendations.push('System operating within normal parameters');
        }
        
        return recommendations;
    }
}

module.exports = AdvancedErrorHandlingSystem;