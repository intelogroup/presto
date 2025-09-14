/**
 * Enhanced Error Handler for Chat API
 * Provides consistent error handling with proper status codes and user-friendly messages
 */

class ChatErrorHandler {
  constructor() {
    // Timeout duration for cold starts
    this.COLD_START_TIMEOUT = 25000; // 25 seconds
  }

  /**
   * Create a timeout handler for requests
   */
  createTimeoutHandler(res, requestId) {
    return setTimeout(() => {
      if (!res.headersSent) {
        res.status(408).json({
          error: 'Request timeout - the service may be starting up. Please try again in a few seconds.',
          errorCategory: 'COLD_START_TIMEOUT',
          requestId,
          suggestion: 'This usually happens after periods of inactivity. The service should respond normally on the next request.'
        });
      }
    }, this.COLD_START_TIMEOUT);
  }

  /**
   * Handle validation errors
   */
  handleValidationError(res, requestId, message, context = {}) {
    return res.status(400).json({
      error: message,
      errorCategory: 'VALIDATION_ERROR',
      requestId,
      context
    });
  }

  /**
   * Handle AI service errors with enhanced categorization
   */
  handleAIServiceError(res, requestId, endpoint, error, duration, context = {}) {
    const errorMsg = error.message || error.toString();
    let statusCode = 500;
    let userMessage = 'Failed to get AI response';
    let errorCategory = 'UNKNOWN';

    // Categorize and handle different error types
    if (errorMsg.includes('API key') || errorMsg.includes('401') || errorMsg.includes('unauthorized')) {
      statusCode = 401;
      userMessage = 'There seems to be an authentication issue. Please check the API configuration.';
      errorCategory = 'AUTH_ERROR';
    } else if (errorMsg.includes('rate limit') || errorMsg.includes('429') || errorMsg.includes('quota')) {
      statusCode = 429;
      userMessage = 'I\'m getting too many requests right now. The system is automatically trying alternative models. Please wait a moment. ⏰';
      errorCategory = 'RATE_LIMIT';
    } else if (errorMsg.includes('timeout') || errorMsg.includes('ECONNRESET') || errorMsg.includes('ETIMEDOUT') || errorMsg.includes('Request timeout')) {
      statusCode = 408;
      userMessage = 'The request timed out. The system is automatically retrying with backup models. Please try again. ⏱️';
      errorCategory = 'TIMEOUT';
    } else if (errorMsg.includes('All models failed') || errorMsg.includes('No more models to try')) {
      statusCode = 503;
      userMessage = 'All AI models are currently unavailable after trying multiple fallbacks. Please try again later. 🔧';
      errorCategory = 'MODEL_FAILURE';
    } else if (errorMsg.includes('500') || errorMsg.includes('502') || errorMsg.includes('503') || errorMsg.includes('504')) {
      statusCode = 502;
      userMessage = 'The AI service is experiencing issues. The system is trying alternative models automatically. 🛠️';
      errorCategory = 'SERVICE_ERROR';
    } else if (errorMsg.includes('Invalid response') || errorMsg.includes('Empty response')) {
      statusCode = 502;
      userMessage = 'Received an invalid response from the AI. The system is automatically retrying with backup models. 🔄';
      errorCategory = 'INVALID_RESPONSE';
    } else {
      userMessage = 'Hmm, I\'m having trouble connecting right now. 🌐 Could you try again in a moment?';
      errorCategory = 'NETWORK_ERROR';
    }

    return res.status(statusCode).json({
      error: userMessage,
      details: error.message,
      errorCategory,
      requestId,
      timestamp: new Date().toISOString(),
      duration,
      context
    });
  }

  /**
   * Handle system errors (500-level errors)
   */
  handleSystemError(res, requestId, endpoint, error, context = {}) {
    console.error(`💥 System error in ${endpoint}:`, error);

    // Don't expose internal errors to users in production
    const isProduction = process.env.NODE_ENV === 'production';

    return res.status(500).json({
      error: 'Internal server error occurred',
      errorCategory: 'SYSTEM_ERROR',
      requestId,
      timestamp: new Date().toISOString(),
      details: isProduction ? undefined : error.message,
      stack: isProduction ? undefined : error.stack?.split('\n').slice(0, 10),
      context
    });
  }

  /**
   * Create standardized success response
   */
  createSuccessResponse(data, requestId, additionalFields = {}) {
    return {
      success: true,
      timestamp: new Date().toISOString(),
      requestId,
      ...data,
      ...additionalFields
    };
  }

  /**
   * Validate request body for chat endpoints
   */
  validateChatRequest(req) {
    const { message, messages, system_prompt, options } = req.body;

    if (!message && !messages) {
      throw new Error('Message or messages array is required');
    }

    // Validate messages array if provided
    if (messages && !Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    // Validate message content
    if (message && typeof message !== 'string') {
      throw new Error('Message must be a string');
    }

    return {
      message,
      messages,
      system_prompt,
      options: options || {},
      hasMessage: !!message,
      hasMessages: !!messages,
      messageCount: messages ? messages.length : 1,
      hasSystemPrompt: messages ? messages.some(msg => msg.role === 'system') : !!system_prompt
    };
  }

  /**
   * Get error recovery suggestions based on error type
   */
  getRecoverySuggestions(errorCategory) {
    const suggestions = {
      'AUTH_ERROR': [
        'Check if API keys are properly configured',
        'Verify API key permissions and quotas',
        'Contact administrator if issue persists'
      ],
      'RATE_LIMIT': [
        'Wait 1-2 minutes before trying again',
        'Consider reducing request frequency',
        'The system will automatically retry with alternative models'
      ],
      'TIMEOUT': [
        'Try again in a few seconds',
        'Check network connectivity',
        'The service may be experiencing high load'
      ],
      'MODEL_FAILURE': [
        'Try again later when models are available',
        'Check service status page',
        'Consider using simpler prompts'
      ],
      'NETWORK_ERROR': [
        'Check internet connectivity',
        'Try refreshing the page',
        'Contact support if issue persists'
      ]
    };

    return suggestions[errorCategory] || [
      'Try again in a few moments',
      'Check your connection',
      'Contact support if the problem continues'
    ];
  }
}

// Export singleton instance
module.exports = new ChatErrorHandler();
