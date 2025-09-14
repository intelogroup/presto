/**
 * Enhanced logging utility for chat API requests
 * Provides structured logging with request tracking and error categorization
 */

class ChatLogger {
  constructor() {
    this.requestCounter = 0;
  }

  /**
   * Generate a unique request ID
   */
  generateRequestId(req) {
    this.requestCounter++;
    return req.headers['x-request-id'] || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log incoming request details
   */
  logRequest(req, endpoint) {
    const timestamp = new Date().toISOString();
    const requestId = this.generateRequestId(req);
    
    console.log(`🔵 [${timestamp}] ${endpoint} - Request ID: ${requestId}`);
    
    const ip = req.ip || (req.connection && req.connection.remoteAddress) || 
               (req.socket && req.socket.remoteAddress) || 'unknown';
    console.log(`   📍 IP: ${ip}`);
    
    let bodySize = 0;
    try {
      bodySize = req.body ? JSON.stringify(req.body).length : 0;
    } catch (e) {
      bodySize = 0;
    }
    console.log(`   📦 Body size: ${bodySize} chars`);
    
    if (req.body && req.body.message) {
      const preview = typeof req.body.message === 'string' ? req.body.message : JSON.stringify(req.body.message);
      console.log(`   💬 Message preview: "${preview.substring(0, 100)}${preview.length > 100 ? '...' : ''}"`);
    }
    
    return requestId;
  }

  /**
   * Log successful response details
   */
  logResponse(requestId, endpoint, success, responseData, duration) {
    const timestamp = new Date().toISOString();
    const status = success ? '✅' : '❌';
    
    console.log(`${status} [${timestamp}] ${endpoint} - Request ID: ${requestId} (${duration}ms)`);
    
    if (success && responseData) {
      console.log(`   📤 Response size: ${JSON.stringify(responseData).length} chars`);
      if (responseData.response) {
        console.log(`   💭 Response preview: "${responseData.response.substring(0, 100)}${responseData.response.length > 100 ? '...' : ''}"`);
      }
    }
  }

  /**
   * Log and categorize errors
   */
  logError(requestId, endpoint, error, context = {}) {
    const timestamp = new Date().toISOString();
    
    console.error(`🔴 [${timestamp}] ${endpoint} - Request ID: ${requestId} - ERROR`);
    console.error(`   🚨 Error Type: ${error.name || 'Unknown'}`);
    console.error(`   📝 Error Message: ${error.message}`);
    console.error(`   🔍 Error Code: ${error.code || 'N/A'}`);
    console.error(`   📊 Context:`, context);
    
    // Log stack trace for debugging (first 5 lines)
    if (error.stack) {
      console.error(`   📚 Stack Trace:`);
      error.stack.split('\n').slice(0, 5).forEach(line => {
        console.error(`      ${line}`);
      });
    }
    
    // Categorize error types
    const errorCategory = this.categorizeError(error);
    console.error(`   🏷️  Error Category: ${errorCategory}`);
    
    return errorCategory;
  }

  /**
   * Categorize errors for better handling
   */
  categorizeError(error) {
    const message = error.message || '';
    
    if (message.includes('API key')) return 'AUTH_ERROR';
    if (message.includes('rate limit')) return 'RATE_LIMIT';
    if (message.includes('timeout')) return 'TIMEOUT';
    if (message.includes('network')) return 'NETWORK_ERROR';
    if (message.includes('All AI models failed')) return 'MODEL_FAILURE';
    if (error.code === 'ECONNREFUSED') return 'CONNECTION_REFUSED';
    
    return 'UNKNOWN';
  }

  /**
   * Log request context information
   */
  logContext(requestId, context) {
    console.log(`   🔄 Processing ${context.messageType} with ${context.messageCount} message(s)`);
    if (context.isPresentation) {
      console.log(`   🎯 Presentation detected - Current stage: ${context.presentationStage}`);
    }
  }
}

// Export singleton instance
module.exports = new ChatLogger();
