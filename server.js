#!/usr/bin/env node
/**
 * Presto Express.js Backend Server
 * 
 * Provides REST API endpoints for PPTX generation using:
 * - Enhanced generators from ./generators/generators-templates/
 * - Dynamic presentation system from ./dynamic-presentation-system/
 * 
 * Features:
 * - Intelligent routing based on presentation type
 * - Comprehensive error handling and fallbacks
 * - Rate limiting and security
 * - Memory management and optimization
 * - Real-time generation status
 */

// Load environment variables
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const path = require('path');
const fs = require('fs').promises;

// Import our presentation systems
const { ComprehensivePresentationSystem } = require('./dynamic-presentation-system/comprehensive-presentation-system');
const EnhancedPptxGenerator = require('./generators/generators-templates/enhanced_pptx_generator');

// Import chat routes
const chatRoutes = require('./routes/chat');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3004;

// Security and performance middleware
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

app.use(compression());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://presto-frontend-production.up.railway.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting - DISABLED
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per windowMs
//     message: {
//         error: 'Too many requests from this IP, please try again later.',
//         retryAfter: '15 minutes'
//     },
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// app.use('/api/', limiter);

// Serve static files from frontend/dist with fallback to index.html for SPA routing
app.use(express.static(path.join(__dirname, 'frontend/dist'), {
    index: false // Don't automatically serve index.html
}));

// Handle React Router - serve index.html for non-API routes
app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next();
    }
    res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

// Chat routes
app.use('/api/chat', chatRoutes);

// Initialize presentation systems
let comprehensiveSystem;
let enhancedGenerator;

try {
    comprehensiveSystem = new ComprehensivePresentationSystem();
    console.log('✅ Comprehensive Presentation System initialized');
} catch (error) {
    console.error('❌ Failed to initialize Comprehensive Presentation System:', error.message);
}

// Validation schemas
const presentationSchema = Joi.object({
    title: Joi.string().min(1).max(200).required(),
    slides: Joi.array().items(
        Joi.object({
            title: Joi.string().max(200),
            content: Joi.alternatives().try(
                Joi.string().max(5000),
                Joi.array().items(Joi.string().max(1000)),
                Joi.object()
            ),
            type: Joi.string().valid('title', 'content', 'image', 'chart', 'table', 'conclusion').default('content'),
            layout: Joi.string().valid('standard', 'two-column', 'image-focus', 'chart-focus').default('standard')
        })
    ).min(1).max(50).required(),
    theme: Joi.string().valid('professional', 'modern', 'minimal').default('professional'),
    template: Joi.string().optional(),
    userInput: Joi.string().max(2000).optional(),
    options: Joi.object({
        includeAnimations: Joi.boolean().default(false),
        includeNotes: Joi.boolean().default(false),
        compressionLevel: Joi.string().valid('low', 'medium', 'high').default('medium')
    }).optional()
});

// Middleware for request validation
const validatePresentation = (req, res, next) => {
    const { error, value } = presentationSchema.validate(req.body, { 
        abortEarly: false,
        stripUnknown: true 
    });
    
    if (error) {
        return res.status(400).json({
            error: 'Invalid presentation data',
            details: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }))
        });
    }
    
    req.validatedData = value;
    next();
};

// Intelligent routing function
function determineOptimalGenerator(presentationData, userInput = '') {
    const { slides, title, theme } = presentationData;
    const input = (userInput || '').toLowerCase();
    const slideCount = slides.length;
    
    // Analyze content complexity
    const hasCharts = slides.some(slide => 
        slide.type === 'chart' || 
        (typeof slide.content === 'string' && slide.content.includes('chart'))
    );
    
    const hasTables = slides.some(slide => 
        slide.type === 'table' || 
        (typeof slide.content === 'string' && slide.content.includes('table'))
    );
    
    const hasComplexLayouts = slides.some(slide => 
        slide.layout && slide.layout !== 'standard'
    );
    
    const isBusinessPresentation = input.includes('business') || 
        input.includes('corporate') || 
        input.includes('professional') ||
        theme === 'professional';
    
    const isCreativePresentation = input.includes('creative') || 
        input.includes('design') || 
        input.includes('artistic') ||
        hasComplexLayouts;
    
    // Decision logic
    if (slideCount > 20 || hasCharts || hasTables || isBusinessPresentation) {
        return {
            generator: 'comprehensive',
            reason: 'Complex presentation with multiple elements',
            confidence: 0.9
        };
    }
    
    if (isCreativePresentation || hasComplexLayouts) {
        return {
            generator: 'enhanced',
            reason: 'Creative presentation requiring advanced layouts',
            confidence: 0.8
        };
    }
    
    // Default to comprehensive system for reliability
    return {
        generator: 'comprehensive',
        reason: 'Standard presentation using comprehensive system',
        confidence: 0.7
    };
}

// Main PPTX generation endpoint
app.post('/api/generate-pptx', validatePresentation, async (req, res) => {
    const generationId = uuidv4();
    const startTime = Date.now();
    
    console.log(`🎯 [${generationId}] Starting PPTX generation`);
    console.log(`📊 Request data:`, {
        title: req.validatedData.title,
        slideCount: req.validatedData.slides.length,
        theme: req.validatedData.theme,
        userInput: req.validatedData.userInput?.substring(0, 100) + '...'
    });
    
    try {
        // Determine optimal generator
        const routing = determineOptimalGenerator(
            req.validatedData, 
            req.validatedData.userInput
        );
        
        console.log(`🤖 [${generationId}] Using ${routing.generator} generator: ${routing.reason}`);
        
        let pptxBuffer;
        let templateUsed = 'presto_default';
        let isValidated = false;
        
        if (routing.generator === 'comprehensive' && comprehensiveSystem) {
            // Use comprehensive presentation system
            try {
                const result = await comprehensiveSystem.generatePresentation(
                    req.validatedData,
                    {
                        outputFormat: 'buffer',
                        includeMetadata: true,
                        generationId
                    }
                );
                
                pptxBuffer = result.buffer;
                templateUsed = result.templateUsed || 'comprehensive_dynamic';
                isValidated = result.validated || false;
                
                console.log(`✅ [${generationId}] Comprehensive system completed`);
            } catch (comprehensiveError) {
                console.warn(`⚠️ [${generationId}] Comprehensive system failed, falling back to enhanced generator:`, comprehensiveError.message);
                throw comprehensiveError; // Will be caught by fallback logic
            }
        } else {
            // Fallback to enhanced generator
            throw new Error('Using enhanced generator fallback');
        }
        
        // If we reach here, generation was successful
        const generationTime = Date.now() - startTime;
        
        // Set response headers with metadata
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        res.setHeader('Content-Disposition', `attachment; filename="${req.validatedData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx"`);
        res.setHeader('X-Presto-Template', templateUsed);
        res.setHeader('X-Presto-Validated', isValidated.toString());
        res.setHeader('X-Presto-Generation-Time', generationTime.toString());
        res.setHeader('X-Presto-Generator', routing.generator);
        
        console.log(`🎉 [${generationId}] PPTX generated successfully in ${generationTime}ms`);
        
        return res.send(pptxBuffer);
        
    } catch (error) {
        console.error(`❌ [${generationId}] Primary generation failed:`, error.message);
        
        // Enhanced generator fallback
        try {
            console.log(`🔄 [${generationId}] Attempting enhanced generator fallback...`);
            
            enhancedGenerator = new EnhancedPptxGenerator({
                theme: req.validatedData.theme,
                enableFallbacks: true,
                maxSlides: 50
            });
            
            const outputPath = path.join(__dirname, 'temp', `${generationId}.pptx`);
            
            // Ensure temp directory exists
            await fs.mkdir(path.dirname(outputPath), { recursive: true });
            
            // Generate using enhanced generator
            await enhancedGenerator.generatePresentation(req.validatedData, outputPath);
            
            // Read the generated file
            const pptxBuffer = await fs.readFile(outputPath);
            
            // Clean up temp file
            await fs.unlink(outputPath).catch(() => {}); // Ignore cleanup errors
            
            const generationTime = Date.now() - startTime;
            
            // Set response headers
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
            res.setHeader('Content-Disposition', `attachment; filename="${req.validatedData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx"`);
            res.setHeader('X-Presto-Template', 'enhanced_fallback');
            res.setHeader('X-Presto-Validated', 'false');
            res.setHeader('X-Presto-Generation-Time', generationTime.toString());
            res.setHeader('X-Presto-Generator', 'enhanced_fallback');
            
            console.log(`✅ [${generationId}] Enhanced generator fallback succeeded in ${generationTime}ms`);
            
            return res.send(pptxBuffer);
            
        } catch (fallbackError) {
            console.error(`❌ [${generationId}] Enhanced generator fallback also failed:`, fallbackError.message);
            
            return res.status(500).json({
                error: 'PPTX generation failed',
                message: 'Both primary and fallback generators failed. Please try again with simpler content.',
                generationId,
                details: {
                    primaryError: error.message,
                    fallbackError: fallbackError.message
                }
            });
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const systemStatus = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        systems: {
            comprehensiveSystem: !!comprehensiveSystem,
            enhancedGenerator: true // Always available as it's instantiated on demand
        }
    };
    
    if (comprehensiveSystem && typeof comprehensiveSystem.getSystemStatus === 'function') {
        try {
            systemStatus.comprehensiveSystemMetrics = comprehensiveSystem.getSystemStatus();
        } catch (error) {
            systemStatus.comprehensiveSystemError = error.message;
        }
    }
    
    res.json(systemStatus);
});

// System status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        service: 'Presto PPTX Generator',
        version: '1.0.0',
        status: 'operational',
        generators: {
            comprehensive: !!comprehensiveSystem,
            enhanced: true
        },
        endpoints: {
            'POST /api/generate-pptx': 'Generate PPTX from presentation data',
            'GET /api/health': 'System health check',
            'GET /api/status': 'Service status information',
            'GET /api/templates': 'Available templates information'
        }
    });
});

// Templates information endpoint
app.get('/api/templates', (req, res) => {
    res.json({
        available: {
            themes: ['professional', 'modern', 'minimal'],
            layouts: ['standard', 'two-column', 'image-focus', 'chart-focus'],
            slideTypes: ['title', 'content', 'image', 'chart', 'table', 'conclusion']
        },
        generators: {
            comprehensive: {
                name: 'Comprehensive Presentation System',
                description: 'Advanced AI-powered presentation generation with dynamic templates',
                features: ['Dynamic template detection', 'Adaptive layouts', 'Content optimization', 'Validation pipeline'],
                bestFor: ['Complex presentations', 'Business content', 'Data-heavy slides']
            },
            enhanced: {
                name: 'Enhanced PPTX Generator',
                description: 'Robust presentation generator with advanced layouts and error handling',
                features: ['Multiple themes', 'Custom layouts', 'Error recovery', 'Memory optimization'],
                bestFor: ['Creative presentations', 'Custom designs', 'Reliable fallback']
            }
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    
    res.status(500).json({
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Endpoint ${req.method} ${req.path} not found`,
        availableEndpoints: [
            'POST /api/generate-pptx',
            'GET /api/health',
            'GET /api/status',
            'GET /api/templates',
            'POST /api/chat',
            'POST /api/chat/quick',
            'POST /api/chat/presentation-help',
            'GET /api/chat/status'
        ]
    });
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 SIGINT received, shutting down gracefully...');
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    console.log('🚀 Presto Backend Server Started');
    console.log('═'.repeat(50));
    console.log(`📡 Server running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Status: http://localhost:${PORT}/api/status`);
    console.log(`🎯 Generate PPTX: POST http://localhost:${PORT}/api/generate-pptx`);
    console.log('═'.repeat(50));
    console.log('🎨 Available Generators:');
    console.log(`   ✅ Comprehensive System: ${!!comprehensiveSystem ? 'Ready' : 'Failed to initialize'}`);
    console.log(`   ✅ Enhanced Generator: Ready (on-demand)`);
    console.log('═'.repeat(50));
});

module.exports = app;