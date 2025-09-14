/**
 * Intelligent Task Complexity Router
 * Routes tasks to appropriate models based on complexity analysis
 * No external dependencies like LangChain needed - pure JavaScript solution
 */

class TaskComplexityAnalyzer {
  constructor() {
    // Define complexity indicators and their weights
    this.complexityIndicators = {
      // Content length indicators
      wordCount: {
        simple: { min: 0, max: 50, weight: 0.2 },
        medium: { min: 51, max: 200, weight: 0.4 },
        complex: { min: 201, max: 500, weight: 0.6 },
        veryComplex: { min: 501, max: Infinity, weight: 0.8 }
      },
      
      // Task type complexity
      taskTypes: {
        greeting: { complexity: 0.1, keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'] },
        simpleQuestion: { complexity: 0.2, keywords: ['what is', 'how do', 'can you', 'please tell'] },
        explanation: { complexity: 0.4, keywords: ['explain', 'describe', 'tell me about', 'how does'] },
        analysis: { complexity: 0.6, keywords: ['analyze', 'compare', 'evaluate', 'assess', 'examine'] },
        creation: { complexity: 0.7, keywords: ['create', 'generate', 'build', 'design', 'develop', 'write'] },
        presentation: { complexity: 0.8, keywords: ['presentation', 'slides', 'pptx', 'powerpoint', 'slideshow'] },
        complex_creation: { complexity: 0.9, keywords: ['comprehensive', 'detailed', 'complete', 'full', 'extensive'] }
      },
      
      // Technical complexity indicators
      technicalTerms: {
        basic: { complexity: 0.2, terms: ['basic', 'simple', 'easy', 'quick'] },
        intermediate: { complexity: 0.5, terms: ['advanced', 'detailed', 'thorough', 'comprehensive'] },
        expert: { complexity: 0.8, terms: ['complex', 'sophisticated', 'intricate', 'elaborate', 'extensive'] }
      },
      
      // Output requirements
      outputRequirements: {
        short: { complexity: 0.2, indicators: ['brief', 'summary', 'quick', 'short'] },
        medium: { complexity: 0.4, indicators: ['paragraph', 'few sentences', 'explain'] },
        long: { complexity: 0.6, indicators: ['detailed', 'comprehensive', 'complete'] },
        structured: { complexity: 0.8, indicators: ['outline', 'list', 'steps', 'structure', 'format'] },
        creative: { complexity: 0.9, indicators: ['creative', 'innovative', 'unique', 'original'] }
      }
    };
    
    // Model capability tiers
    this.modelTiers = {
      tier0_primary: {
        models: ['vllm/llama'],
        priority: 1,
        maxComplexity: 1.0,
        description: 'Primary vLLM Llama 3.1 model for all tasks'
      },
      tier1_secondary: {
        models: ['nvidia/nemotron-nano-9b-v2'],
        priority: 2,
        maxComplexity: 0.8,
        description: 'Secondary Nemotron model for backup and specialized tasks'
      },
      tier2_local: {
        models: ['vllm/mistral'],
        priority: 3,
        maxComplexity: 0.7,
        description: 'Additional vLLM models for local processing'
      },
      tier3_free: {
        models: ['google/gemma-3-12b-it:free'],
        priority: 4,
        maxComplexity: 0.4,
        description: 'Free models for simple tasks'
      },
      tier4_balanced: {
        models: ['google/gemini-2.5-flash'],
        priority: 5,
        maxComplexity: 0.7,
        description: 'Balanced models for medium complexity'
      },
      tier5_premium: {
        models: ['openai/gpt-4o', 'openai/gpt-4-turbo'],
        priority: 6,
        maxComplexity: 1.0,
        description: 'Premium models for complex tasks (fallback)'
      }
    };
  }
  
  /**
   * Analyze task complexity and return a score (0-1)
   * @param {string} userMessage - The user's input message
   * @param {Object} context - Additional context (optional)
   * @returns {Object} Analysis results with complexity score and reasoning
   */
  analyzeComplexity(userMessage, context = {}) {
    if (!userMessage || typeof userMessage !== 'string') {
      return { complexity: 0.1, reasoning: ['Invalid or empty message'], tier: 'tier0_primary' };
    }
    
    const message = userMessage.toLowerCase();
    const wordCount = message.split(/\s+/).length;
    let totalComplexity = 0;
    let factors = [];
    
    // 1. Analyze word count complexity
    let wordComplexity = 0.1;
    for (const [level, config] of Object.entries(this.complexityIndicators.wordCount)) {
      if (wordCount >= config.min && wordCount <= config.max) {
        wordComplexity = config.weight;
        factors.push(`Word count: ${wordCount} words (${level})`);
        break;
      }
    }
    totalComplexity += wordComplexity * 0.2; // 20% weight
    
    // 2. Analyze task type
    let taskComplexity = 0.2; // default
    for (const [taskType, config] of Object.entries(this.complexityIndicators.taskTypes)) {
      if (config.keywords.some(keyword => message.includes(keyword))) {
        taskComplexity = Math.max(taskComplexity, config.complexity);
        factors.push(`Task type: ${taskType} (${config.complexity})`);
      }
    }
    totalComplexity += taskComplexity * 0.4; // 40% weight
    
    // 3. Analyze technical complexity
    let techComplexity = 0.1;
    for (const [level, config] of Object.entries(this.complexityIndicators.technicalTerms)) {
      if (config.terms.some(term => message.includes(term))) {
        techComplexity = Math.max(techComplexity, config.complexity);
        factors.push(`Technical level: ${level} (${config.complexity})`);
      }
    }
    totalComplexity += techComplexity * 0.2; // 20% weight
    
    // 4. Analyze output requirements
    let outputComplexity = 0.2;
    for (const [reqType, config] of Object.entries(this.complexityIndicators.outputRequirements)) {
      if (config.indicators.some(indicator => message.includes(indicator))) {
        outputComplexity = Math.max(outputComplexity, config.complexity);
        factors.push(`Output requirement: ${reqType} (${config.complexity})`);
      }
    }
    totalComplexity += outputComplexity * 0.2; // 20% weight
    
    // Normalize complexity score (0-1)
    const finalComplexity = Math.min(1.0, Math.max(0.1, totalComplexity));
    
    // Determine appropriate tier - ALWAYS prioritize local RunPod model first
    let selectedTier = 'tier0_primary'; // Always default to primary vLLM Llama 3.1 model
    
    // RunPod should be tried first for ALL complexity levels
    // The fallback logic will handle other models if RunPod fails
    
    return {
      complexity: finalComplexity,
      reasoning: factors,
      tier: selectedTier,
      recommendedModels: this.modelTiers[selectedTier].models,
      analysis: {
        wordCount,
        wordComplexity,
        taskComplexity,
        techComplexity,
        outputComplexity
      }
    };
  }
  
  /**
   * Get optimized model sequence based on task complexity
   * @param {string} userMessage - The user's input message
   * @param {Array} availableModels - Available models to choose from
   * @returns {Array} Ordered array of models to try
   */
  getOptimizedModelSequence(userMessage, availableModels) {
    const analysis = this.analyzeComplexity(userMessage);
    const recommendedTier = this.modelTiers[analysis.tier];
    
    // Start with recommended models for this complexity level
    let sequence = [];
    
    // Add recommended models first
    for (const model of recommendedTier.models) {
      if (availableModels.includes(model)) {
        sequence.push(model);
      }
    }
    
    // For high complexity tasks, add premium models if not already included
    if (analysis.complexity > 0.7) {
      for (const model of this.modelTiers.tier5_premium.models) {
        if (availableModels.includes(model) && !sequence.includes(model)) {
          sequence.push(model);
        }
      }
    }
    
    // Add remaining models as fallbacks
    for (const model of availableModels) {
      if (!sequence.includes(model)) {
        sequence.push(model);
      }
    }
    
    console.log(`🧠 Task Complexity Analysis:`);
    console.log(`   📊 Complexity Score: ${(analysis.complexity * 100).toFixed(1)}%`);
    console.log(`   🎯 Selected Tier: ${analysis.tier} (${recommendedTier.description})`);
    console.log(`   🔄 Model Sequence: ${sequence.slice(0, 3).join(' → ')}${sequence.length > 3 ? ' → ...' : ''}`);
    console.log(`   💡 Reasoning: ${analysis.reasoning.join(', ')}`);
    
    return {
      sequence,
      analysis,
      reasoning: `Complexity: ${(analysis.complexity * 100).toFixed(1)}% → ${analysis.tier}`
    };
  }
}

module.exports = { TaskComplexityAnalyzer };