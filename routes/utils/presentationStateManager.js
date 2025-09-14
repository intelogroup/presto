/**
 * Presentation State Manager
 * Handles presentation creation workflow and state tracking
 */

class PresentationStateManager {
  constructor() {
    // Map to store presentation states by request ID
    this.presentationStates = new Map();
    
    // Keywords that indicate presentation intent
    this.presentationKeywords = [
      'presentation', 'slides', 'powerpoint', 'pptx', 'slideshow',
      'pitch deck', 'slide deck', 'present about', 'create slides'
    ];
  }

  /**
   * Detect if a message has presentation intent
   */
  detectPresentationIntent(message) {
    if (!message || typeof message !== 'string') return false;
    
    const lowerMessage = message.toLowerCase();
    return this.presentationKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
  }

  /**
   * Get presentation state for a request
   */
  getPresentationState(requestId) {
    return this.presentationStates.get(requestId) || {
      stage: 'initial',
      title: null,
      audience: null,
      slideCount: null,
      outline: null,
      fullContent: null,
      userApproved: false,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Update presentation state
   */
  updatePresentationState(requestId, updates) {
    const currentState = this.getPresentationState(requestId);
    const newState = { 
      ...currentState, 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    this.presentationStates.set(requestId, newState);
    return newState;
  }

  /**
   * Analyze response content to determine presentation state changes
   */
  analyzeResponseForStateChanges(response, requestId) {
    if (!response || !response.content) return null;
    
    const content = response.content.toLowerCase();
    let stateUpdates = {};
    
    // Detect stage progression based on content
    if (content.includes('title:') && content.includes('audience:') && content.includes('slides:')) {
      stateUpdates.stage = 'details_collected';
    } else if (content.includes('outline:') || content.includes('slide 1:')) {
      stateUpdates.stage = 'outline_created';
    } else if (content.includes('full content') || (content.includes('slide') && content.includes('content:'))) {
      stateUpdates.stage = 'content_shown';
    }
    
    // Check for user approval indicators
    if (content.includes('approve') || content.includes('generate') || content.includes('create pptx')) {
      stateUpdates.userApproved = true;
    }
    
    // Update state if any changes detected
    if (Object.keys(stateUpdates).length > 0) {
      return this.updatePresentationState(requestId, stateUpdates);
    }
    
    return this.getPresentationState(requestId);
  }

  /**
   * Check if presentation can be generated based on current state
   */
  canGeneratePPTX(requestId, responseContent) {
    // Primary detection: Look for GENERATE_POWERPOINT_READY marker
    if (responseContent && responseContent.includes('```GENERATE_POWERPOINT_READY```')) {
      console.log(`   ✅ GENERATE_POWERPOINT_READY marker detected - enabling PPTX generation`);
      return true;
    }
    
    // Fallback: Check presentation state
    const state = this.getPresentationState(requestId);
    if (state.stage === 'content_shown' && state.userApproved) {
      return true;
    }
    
    return false;
  }

  /**
   * Get appropriate system prompt based on presentation stage
   */
  getPresentationSystemPrompt(stage = 'initial') {
    const basePrompt = `You are a presentation creation assistant. Guide users through these steps in order:
1. First, ask for presentation title, target audience, and number of slides
2. Create and show a detailed outline of all slides
3. Present the full content for each slide with specific text and layout details
4. Only after showing complete content and getting user approval, offer to generate the PPTX

Never skip steps. Always be thorough and wait for user confirmation before proceeding.`;

    const stagePrompts = {
      initial: basePrompt,
      details_collected: basePrompt + '\n\nCurrent stage: Details collected - now create the outline.',
      outline_created: basePrompt + '\n\nCurrent stage: Outline created - now show full content for each slide.',
      content_shown: basePrompt + '\n\nCurrent stage: Content shown - wait for user approval to generate PPTX.'
    };

    return stagePrompts[stage] || basePrompt;
  }

  /**
   * Clean up old presentation states (optional - for memory management)
   */
  cleanupOldStates(maxAge = 24 * 60 * 60 * 1000) { // 24 hours default
    const now = new Date();
    const statesToDelete = [];
    
    for (const [requestId, state] of this.presentationStates.entries()) {
      const stateAge = now - new Date(state.createdAt);
      if (stateAge > maxAge) {
        statesToDelete.push(requestId);
      }
    }
    
    statesToDelete.forEach(requestId => {
      this.presentationStates.delete(requestId);
    });
    
    if (statesToDelete.length > 0) {
      console.log(`🧹 Cleaned up ${statesToDelete.length} old presentation states`);
    }
  }

  /**
   * Get statistics about current presentation states
   */
  getStats() {
    const states = Array.from(this.presentationStates.values());
    const stageStats = {};
    
    states.forEach(state => {
      stageStats[state.stage] = (stageStats[state.stage] || 0) + 1;
    });
    
    return {
      totalStates: states.length,
      stageDistribution: stageStats,
      oldestState: states.length > 0 ? Math.min(...states.map(s => new Date(s.createdAt))) : null
    };
  }
}

// Export singleton instance
module.exports = new PresentationStateManager();
