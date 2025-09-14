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
  const requestId = logRequest(req, 'POST /api/chat');
  
  // Set request timeout to handle cold starts gracefully
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).json({
        error: 'Request timeout - the service may be starting up. Please try again in a few seconds.',
        errorCategory: 'COLD_START_TIMEOUT',
        requestId,
        suggestion: 'This usually happens after periods of inactivity. The service should respond normally on the next request.'
      });
    }
  }, 25000); // 25 second timeout
  
  try {
    const { message, messages, system_prompt, options } = req.body;
    
    // Validate input
    if (!message && !messages) {
      const error = new Error('Message or messages array is required');
      const errorCategory = logError(requestId, 'POST /api/chat', error, { 
        hasMessage: !!message, 
        hasMessages: !!messages,
        bodyKeys: Object.keys(req.body)
      });
      
      return res.status(400).json({
        error: 'Message or messages array is required',
        errorCategory,
        requestId
      });
    }
    
    let response;
    const context = {
      messageType: messages ? 'conversation' : 'single',
      messageCount: messages ? messages.length : 1,
      hasSystemPrompt: messages ? messages.some(msg => msg.role === 'system') : !!system_prompt,
      options: options || {}
    };
    
    console.log(`   🔄 Processing ${context.messageType} with ${context.messageCount} message(s)`);
    
    // Check for presentation intent and manage state
    let presentationState = null;
    let isPresentation = false;
    
    if (message && detectPresentationIntent(message)) {
      isPresentation = true;
      presentationState = getPresentationState(requestId);
      console.log(`   🎯 Presentation detected - Current stage: ${presentationState.stage}`);
    }
    
    if (messages) {
      // Handle conversation with message history
      // Add system prompt if not already present
      const hasSystemPrompt = messages.some(msg => msg.role === 'system');
      if (!hasSystemPrompt) {
        const promptToUse = isPresentation ? 
          `You are a presentation creation assistant. Guide users through these steps in order:
1. First, ask for presentation title, target audience, and number of slides
2. Create and show a detailed outline of all slides
3. Present the full content for each slide with specific text and layout details
4. Only after showing complete content and getting user approval, offer to generate the PPTX

Never skip steps. Always be thorough and wait for user confirmation before proceeding.` :
          GENERAL_CHAT_PROMPT;
        messages.unshift({ role: 'system', content: promptToUse });
        console.log(`   ➕ Added ${isPresentation ? 'presentation' : 'general'} system prompt`);
      }
      response = await createChatCompletion(messages, options);
    } else {
      // Handle single message
      let finalSystemPrompt = system_prompt || GENERAL_CHAT_PROMPT;
      
      if (isPresentation) {
        finalSystemPrompt = `You are a presentation creation assistant. The user wants to create a presentation.
Guide them through these steps in order:
1. Ask for presentation title, target audience, and number of slides
2. Create and show a detailed outline
3. Present full content for each slide
4. Only after complete content review and approval, offer PPTX generation

Current stage: ${presentationState.stage}
Be helpful but thorough - don't skip any steps.`;
      }
      
      response = await getQuickResponse(message, finalSystemPrompt);
    }
    
    // Analyze response for presentation state updates
    let canGeneratePPTX = false;
    
    // Check for GENERATE_POWERPOINT_READY marker (primary detection)
    if (response.content && response.content.includes('```GENERATE_POWERPOINT_READY```')) {
      canGeneratePPTX = true;
      console.log(`   ✅ GENERATE_POWERPOINT_READY marker detected - enabling PPTX generation`);
    }
    
    // Legacy presentation state system (fallback)
    if (isPresentation && response.content) {
      const content = response.content.toLowerCase();
      
      // Update presentation state based on response content
      if (content.includes('title:') && content.includes('audience:') && content.includes('slides:')) {
        presentationState = updatePresentationState(requestId, { stage: 'details_collected' });
      } else if (content.includes('outline:') || content.includes('slide 1:')) {
        presentationState = updatePresentationState(requestId, { stage: 'outline_created' });
      } else if (content.includes('full content') || (content.includes('slide') && content.includes('content:'))) {
        presentationState = updatePresentationState(requestId, { stage: 'content_shown' });
      }
      
      // Check if we can generate PPTX (all steps completed + user approval)
      if (presentationState.stage === 'content_shown' && 
          (content.includes('approve') || content.includes('generate') || content.includes('create pptx'))) {
        canGeneratePPTX = true;
        presentationState = updatePresentationState(requestId, { userApproved: true });
      }
    }
    
    // Clear timeout on successful response
    clearTimeout(timeout);
    
    const responseData = {
      success: true,
      response: response.content,
      role: response.role,
      timestamp: new Date().toISOString(),
      requestId,
      presentationState: isPresentation ? presentationState : null,
      canGeneratePPTX: canGeneratePPTX
    };
    
    const duration = Date.now() - startTime;
    logResponse(requestId, 'POST /api/chat', true, responseData, duration);
    
    res.json(responseData);
    
  } catch (error) {
    // Clear timeout on error
    clearTimeout(timeout);
    
    const duration = Date.now() - startTime;
    const errorCategory = logError(requestId, 'POST /api/chat', error, {
      duration,
      hasMessage: !!req.body.message,
      hasMessages: !!req.body.messages,
      messageCount: req.body.messages ? req.body.messages.length : 0
    });
    
    // Enhanced error handling with better categorization
    let statusCode = 500;
    let userMessage = 'Failed to get AI response';
    
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

// POST /api/chat/quick - Quick response endpoint
router.post('/quick', async (req, res) => {
  const startTime = Date.now();
  const requestId = logRequest(req, 'POST /api/chat/quick');
  
  try {
    const { message } = req.body;
    
    // Validate input
    if (!message) {
      const error = new Error('Message is required');
      const errorCategory = logError(requestId, 'POST /api/chat/quick', error, {
        hasMessage: !!message,
        messageLength: message ? message.length : 0,
        bodyKeys: Object.keys(req.body)
      });
      
      return res.status(400).json({
        error: 'Message is required',
        errorCategory,
        requestId
      });
    }
    
    console.log(`   ⚡ Quick response for message (${message.length} chars)`);
    
    const response = await getQuickResponse(message, GENERAL_CHAT_PROMPT);
    
    const responseData = {
      success: true,
      response: response.content,
      timestamp: new Date().toISOString(),
      requestId
    };
    
    const duration = Date.now() - startTime;
    logResponse(requestId, 'POST /api/chat/quick', true, responseData, duration);
    
    res.json(responseData);
    
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorCategory = logError(requestId, 'POST /api/chat/quick', error, {
      duration,
      messageLength: req.body.message ? req.body.message.length : 0,
      hasMessage: !!req.body.message
    });
    
    // Enhanced error handling with better categorization
    let statusCode = 500;
    let userMessage = 'Failed to get quick AI response';
    
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
