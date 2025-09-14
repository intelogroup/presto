const express = require('express');
const { createChatCompletion, getQuickResponse, GENERAL_CHAT_PROMPT } = require('../config/openai-config');

// Import modular utilities
const logger = require('./utils/logger');
const presentationManager = require('./utils/presentationStateManager');
const errorHandler = require('./utils/errorHandler');

const router = express.Router();

// POST /api/chat - General chat endpoint
router.post('/', async (req, res) => {
  const startTime = Date.now();
  const requestId = logger.logRequest(req, 'POST /api/chat');

  // Set request timeout to handle cold starts gracefully
  const timeout = errorHandler.createTimeoutHandler(res, requestId);

  try {
    // Validate request
    const validatedRequest = errorHandler.validateChatRequest(req);
    const { message, messages, system_prompt, options } = validatedRequest;

    // Build context for logging and processing
    const context = {
      messageType: messages ? 'conversation' : 'single',
      messageCount: validatedRequest.messageCount,
      hasSystemPrompt: validatedRequest.hasSystemPrompt,
      options: options || {},
      isPresentation: false,
      presentationStage: 'initial'
    };

    // Check for presentation intent and manage state
    let presentationState = null;
    if (message && presentationManager.detectPresentationIntent(message)) {
      context.isPresentation = true;
      presentationState = presentationManager.getPresentationState(requestId);
      context.presentationStage = presentationState.stage;
    }

    // Log context
    logger.logContext(requestId, context);

    let response;

    if (messages) {
      // Handle conversation with message history
      const hasSystemPrompt = messages.some(msg => msg.role === 'system');
      if (!hasSystemPrompt) {
        const promptToUse = context.isPresentation ?
          presentationManager.getPresentationSystemPrompt(presentationState.stage) :
          GENERAL_CHAT_PROMPT;
        messages.unshift({ role: 'system', content: promptToUse });
        console.log(`   ➕ Added ${context.isPresentation ? 'presentation' : 'general'} system prompt`);
      }
      response = await createChatCompletion(messages, options);
    } else {
      // Handle single message
      let finalSystemPrompt = system_prompt || GENERAL_CHAT_PROMPT;

      if (context.isPresentation) {
        finalSystemPrompt = presentationManager.getPresentationSystemPrompt(presentationState.stage);
      }

      response = await getQuickResponse(message, finalSystemPrompt);
    }

    // Analyze response for presentation state updates
    let canGeneratePPTX = false;

    if (context.isPresentation) {
      presentationState = presentationManager.analyzeResponseForStateChanges(response, requestId);
      canGeneratePPTX = presentationManager.canGeneratePPTX(requestId, response.content);
    } else {
      // Check for GENERATE_POWERPOINT_READY marker even in non-presentation mode
      canGeneratePPTX = presentationManager.canGeneratePPTX(requestId, response.content);
    }

    // Clear timeout on successful response
    clearTimeout(timeout);

    const responseData = errorHandler.createSuccessResponse({
      response: response.content,
      role: response.role,
      presentationState: context.isPresentation ? presentationState : null,
      canGeneratePPTX: canGeneratePPTX
    }, requestId);

    const duration = Date.now() - startTime;
    logger.logResponse(requestId, 'POST /api/chat', true, responseData, duration);

    res.json(responseData);

  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeout);

    const duration = Date.now() - startTime;
    const errorCategory = logger.logError(requestId, 'POST /api/chat', error, {
      duration,
      hasMessage: !!req.body.message,
      hasMessages: !!req.body.messages,
      messageCount: req.body.messages ? req.body.messages.length : 0
    });

    // Handle different error types
    if (error.message === 'Message or messages array is required') {
      return errorHandler.handleValidationError(res, requestId, error.message, {
        hasMessage: !!req.body.message,
        hasMessages: !!req.body.messages,
        bodyKeys: Object.keys(req.body)
      });
    }

    return errorHandler.handleAIServiceError(res, requestId, 'POST /api/chat', error, duration, {
      hasMessage: !!req.body.message,
      hasMessages: !!req.body.messages,
      messageCount: req.body.messages ? req.body.messages.length : 0
    });
  }
});

// POST /api/chat/quick - Quick response endpoint
router.post('/quick', async (req, res) => {
  const startTime = Date.now();
  const requestId = logger.logRequest(req, 'POST /api/chat/quick');

  try {
    const { message } = req.body;

    // Validate input
    if (!message) {
      return errorHandler.handleValidationError(res, requestId, 'Message is required', {
        hasMessage: !!message,
        messageLength: message ? message.length : 0,
        bodyKeys: Object.keys(req.body)
      });
    }

    console.log(`   ⚡ Quick response for message (${message.length} chars)`);

    const response = await getQuickResponse(message, GENERAL_CHAT_PROMPT);

    const responseData = errorHandler.createSuccessResponse({
      response: response.content
    }, requestId);

    const duration = Date.now() - startTime;
    logger.logResponse(requestId, 'POST /api/chat/quick', true, responseData, duration);

    res.json(responseData);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logError(requestId, 'POST /api/chat/quick', error, {
      duration,
      messageLength: req.body.message ? req.body.message.length : 0,
      hasMessage: !!req.body.message
    });

    return errorHandler.handleAIServiceError(res, requestId, 'POST /api/chat/quick', error, duration, {
      messageLength: req.body.message ? req.body.message.length : 0,
      hasMessage: !!req.body.message
    });
  }
});

// POST /api/chat/presentation-help - Presentation-specific AI assistance
router.post('/presentation-help', async (req, res) => {
  const startTime = Date.now();
  const requestId = logRequest(req, 'POST /api/chat/presentation-help');
  
  try {
    const { message, context } = req.body;
    
    // Validate input
    if (!message) {
      const error = new Error('Message is required');
      const errorCategory = logError(requestId, 'POST /api/chat/presentation-help', error, {
        hasMessage: !!message,
        hasContext: !!context,
        contextLength: context ? context.length : 0,
        bodyKeys: Object.keys(req.body)
      });
      
      return res.status(400).json({
        error: 'Message is required',
        errorCategory,
        requestId
      });
    }
    
    console.log(`   🎯 Presentation help request${context ? ' with context' : ''}`);
    if (context) {
      console.log(`   📋 Context: "${context.substring(0, 50)}${context.length > 50 ? '...' : ''}"`);
    }
    
    const systemPrompt = `You are an AI assistant specialized in helping with presentation creation and design. 
    You have expertise in PowerPoint, presentation structure, visual design, and content organization.
    Provide helpful, actionable advice for creating effective presentations.
    ${context ? `Context: ${context}` : ''}`;
    
    const response = await getQuickResponse(message, systemPrompt);
    
    const responseData = {
      success: true,
      response: response.content,
      type: 'presentation-help',
      timestamp: new Date().toISOString(),
      requestId
    };
    
    const duration = Date.now() - startTime;
    logResponse(requestId, 'POST /api/chat/presentation-help', true, responseData, duration);
    
    res.json(responseData);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorCategory = logError(requestId, 'POST /api/chat/presentation-help', error, {
      duration,
      hasMessage: !!req.body.message,
      hasContext: !!req.body.context,
      messageLength: req.body.message ? req.body.message.length : 0
    });
    
    // Enhanced error handling with better categorization
    let statusCode = 500;
    let userMessage = 'Failed to get presentation help';
    
    const errorMsg = error.message || error.toString();
    
    if (errorMsg.includes('API key') || errorMsg.includes('401') || errorMsg.includes('unauthorized')) {
      statusCode = 401;
      userMessage = 'There seems to be an authentication issue. Please check the API configuration.';
    } else if (errorMsg.includes('rate limit') || errorMsg.includes('429') || errorMsg.includes('quota')) {
      statusCode = 429;
      userMessage = 'I\'m getting too many requests right now. The system is automatically trying alternative models. Please wait a moment. ⏰';
    } else if (errorMsg.includes('timeout') || errorMsg.includes('ECONNRESET') || errorMsg.includes('ETIMEDOUT') || errorMsg.includes('Request timeout')) {
      statusCode = 408;
      userMessage = 'The request timed out. The system is automatically retrying with backup models. Please try again. ⏱️';
    } else if (errorMsg.includes('All models failed') || errorMsg.includes('No more models to try')) {
      statusCode = 503;
      userMessage = 'All AI models are currently unavailable after trying multiple fallbacks. Please try again later. 🔧';
    } else if (errorMsg.includes('500') || errorMsg.includes('502') || errorMsg.includes('503') || errorMsg.includes('504')) {
      statusCode = 502;
      userMessage = 'The AI service is experiencing issues. The system is trying alternative models automatically. 🛠️';
    } else if (errorMsg.includes('Invalid response') || errorMsg.includes('Empty response')) {
      statusCode = 502;
      userMessage = 'Received an invalid response from the AI. The system is automatically retrying with backup models. 🔄';
    } else {
      userMessage = 'Hmm, I\'m having trouble connecting right now. 🌐 Could you try again in a moment?';
    }
    
    res.status(statusCode).json({
      error: userMessage,
      details: error.message,
      errorCategory,
      requestId,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/chat/status - Check AI service status
router.get('/status', (req, res) => {
  const startTime = Date.now();
  const requestId = logRequest(req, 'GET /api/chat/status');
  
  try {
    const { PRIMARY_MODEL, FALLBACK_MODELS } = require('../config/openai-config');
    
    console.log(`   📊 Status check - Primary: ${PRIMARY_MODEL}, Fallbacks: ${FALLBACK_MODELS.length}`);
    
    const responseData = {
      success: true,
      service: 'Multi-Model AI Chat via OpenRouter',
      primaryModel: PRIMARY_MODEL,
      fallbackModels: FALLBACK_MODELS,
      totalModels: 1 + FALLBACK_MODELS.length,
      status: 'ready',
      timestamp: new Date().toISOString(),
      requestId
    };
    
    const duration = Date.now() - startTime;
    logResponse(requestId, 'GET /api/chat/status', true, responseData, duration);
    
    res.json(responseData);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorCategory = logError(requestId, 'GET /api/chat/status', error, { duration });

    // Temporary: include stack in response to aid remote debugging. Remove before production.
    res.status(500).json({
      error: 'Failed to get status',
      details: error.message,
      errorCategory,
      requestId,
      timestamp: new Date().toISOString(),
      stack: error.stack ? error.stack.split('\n').slice(0,10) : undefined
    });
  }
});

module.exports = router;
