/**
 * Adaptive Layout Engine for Dynamic Presentation System
 * Handles intelligent layout adaptation and content fitting
 */

class AdaptiveLayoutEngine {
  constructor() {
    this.layoutStrategies = {
      'text-heavy': this.textHeavyLayout.bind(this),
      'image-focused': this.imageFocusedLayout.bind(this),
      'balanced': this.balancedLayout.bind(this),
      'minimal': this.minimalLayout.bind(this)
    };
    
    this.contentConstraints = {
      maxTextLength: 500,
      maxBulletPoints: 6,
      maxImageSize: { width: 800, height: 600 },
      minFontSize: 12
    };
  }

  /**
   * Analyze content and determine optimal layout strategy
   */
  analyzeContent(slideContent) {
    const textLength = this.getTextLength(slideContent);
    const imageCount = this.getImageCount(slideContent);
    const bulletCount = this.getBulletCount(slideContent);

    if (textLength > 300) return 'text-heavy';
    if (imageCount > 1) return 'image-focused';
    if (bulletCount > 4) return 'text-heavy';
    return 'balanced';
  }

  /**
   * Apply adaptive layout based on content analysis
   */
  adaptLayout(slideContent, templateConstraints = {}) {
    const strategy = this.analyzeContent(slideContent);
    return this.layoutStrategies[strategy](slideContent, templateConstraints);
  }

  /**
   * Text-heavy layout strategy
   */
  textHeavyLayout(content, constraints) {
    return {
      strategy: 'text-heavy',
      fontSize: Math.max(constraints.minFontSize || 14, 16),
      lineSpacing: 1.4,
      margins: { top: 60, bottom: 60, left: 80, right: 80 },
      contentArea: { width: '80%', height: '70%' }
    };
  }

  /**
   * Image-focused layout strategy
   */
  imageFocusedLayout(content, constraints) {
    return {
      strategy: 'image-focused',
      imageSize: { width: '60%', height: 'auto' },
      textArea: { width: '35%' },
      layout: 'side-by-side',
      margins: { top: 40, bottom: 40, left: 60, right: 60 }
    };
  }

  /**
   * Balanced layout strategy
   */
  balancedLayout(content, constraints) {
    return {
      strategy: 'balanced',
      fontSize: 18,
      lineSpacing: 1.3,
      margins: { top: 50, bottom: 50, left: 70, right: 70 },
      contentDistribution: 'even'
    };
  }

  /**
   * Minimal layout strategy
   */
  minimalLayout(content, constraints) {
    return {
      strategy: 'minimal',
      fontSize: 20,
      lineSpacing: 1.5,
      margins: { top: 80, bottom: 80, left: 100, right: 100 },
      emphasis: 'high'
    };
  }

  /**
   * Helper methods for content analysis
   */
  getTextLength(content) {
    if (typeof content === 'string') return content.length;
    if (content.bullets) return content.bullets.join(' ').length;
    if (content.content) return content.content.length;
    return 0;
  }

  getImageCount(content) {
    if (content.images) return content.images.length;
    return 0;
  }

  getBulletCount(content) {
    if (content.bullets) return content.bullets.length;
    return 0;
  }

  /**
   * Generate adaptive layouts for presentation data
   * This is the main method called by ComprehensivePresentationSystem
   */
  async generateAdaptiveLayouts(presentationData, templateDetection, options = {}) {
    const layouts = [];
    
    for (const slide of presentationData.slides) {
      const adaptedLayout = this.adaptLayout(slide, templateDetection.constraints);
      const validationResult = this.validateConstraints(adaptedLayout);
      
      layouts.push({
        slideIndex: layouts.length,
        slide: slide, // Include original slide data
        layout: adaptedLayout,
        validation: validationResult,
        templateInfo: templateDetection
      });
    }
    
    return {
      layouts,
      slides: presentationData.slides, // Also include slides array for compatibility
      strategy: 'adaptive',
      quality: this.calculateLayoutQuality(layouts)
    };
  }

  /**
   * Calculate overall layout quality score
   */
  calculateLayoutQuality(layouts) {
    const validLayouts = layouts.filter(l => l.validation.isValid).length;
    return (validLayouts / layouts.length) * 100;
  }

  /**
   * Validate layout constraints
   */
  validateConstraints(layout) {
    const issues = [];
    
    if (layout.fontSize < this.contentConstraints.minFontSize) {
      issues.push('Font size too small');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
}

module.exports = { AdaptiveLayoutEngine };