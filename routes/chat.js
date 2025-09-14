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
  const requestId = logger.logRequest(req, 'POST /api/chat/presentation-help');

  try {
    const { message, context } = req.body;

    // Validate input
    if (!message) {
      return errorHandler.handleValidationError(res, requestId, 'Message is required', {
        hasMessage: !!message,
        hasContext: !!context,
        contextLength: context ? context.length : 0,
        bodyKeys: Object.keys(req.body)
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

    const responseData = errorHandler.createSuccessResponse({
      response: response.content,
      type: 'presentation-help'
    }, requestId);

    const duration = Date.now() - startTime;
    logger.logResponse(requestId, 'POST /api/chat/presentation-help', true, responseData, duration);

    res.json(responseData);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logError(requestId, 'POST /api/chat/presentation-help', error, {
      duration,
      hasMessage: !!req.body.message,
      hasContext: !!req.body.context,
      messageLength: req.body.message ? req.body.message.length : 0
    });

    return errorHandler.handleAIServiceError(res, requestId, 'POST /api/chat/presentation-help', error, duration, {
      hasMessage: !!req.body.message,
      hasContext: !!req.body.context,
      messageLength: req.body.message ? req.body.message.length : 0
    });
  }
});

// GET /api/chat/status - Check AI service status
router.get('/status', (req, res) => {
  const startTime = Date.now();
  const requestId = logger.logRequest(req, 'GET /api/chat/status');

  try {
    const { PRIMARY_MODEL, FALLBACK_MODELS } = require('../config/openai-config');

    console.log(`   📊 Status check - Primary: ${PRIMARY_MODEL}, Fallbacks: ${FALLBACK_MODELS.length}`);

    const responseData = errorHandler.createSuccessResponse({
      service: 'Multi-Model AI Chat via OpenRouter',
      primaryModel: PRIMARY_MODEL,
      fallbackModels: FALLBACK_MODELS,
      totalModels: 1 + FALLBACK_MODELS.length,
      status: 'ready',
      presentationStats: presentationManager.getStats()
    }, requestId);

    const duration = Date.now() - startTime;
    logger.logResponse(requestId, 'GET /api/chat/status', true, responseData, duration);

    res.json(responseData);

  } catch (error) {
    const duration = Date.now() - startTime;
    logger.logError(requestId, 'GET /api/chat/status', error, { duration });

    return errorHandler.handleSystemError(res, requestId, 'GET /api/chat/status', error, { duration });
  }
});

module.exports = router;
