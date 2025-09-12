/**
 * Comprehensive Presentation System
 * Main orchestrator for the dynamic presentation generation system
 */

const { AdaptiveLayoutEngine } = require('./adaptive-layout-engine');
const { AssetManagementSystem } = require('./asset-management-system');
const { ContentValidationSystem } = require('./content-validation-system');
const { DynamicTemplateDetector } = require('./dynamic-template-detector');
const { LayoutTemplateSystem } = require('./layout-template-system');
const { OverflowPreventionSystem } = require('./overflow-prevention-system');
const { ProfessionalDesignSystem } = require('./professional-design-system');

class ComprehensivePresentationSystem {
  constructor() {
    this.adaptiveLayoutEngine = new AdaptiveLayoutEngine();
    this.assetManagementSystem = new AssetManagementSystem();
    this.contentValidationSystem = new ContentValidationSystem();
    this.dynamicTemplateDetector = new DynamicTemplateDetector();
    this.layoutTemplateSystem = new LayoutTemplateSystem();
    this.overflowPreventionSystem = new OverflowPreventionSystem();
    this.professionalDesignSystem = new ProfessionalDesignSystem();
    
    this.initialized = false;
  }

  /**
   * Initialize the comprehensive presentation system
   */
  async initialize() {
    try {
      // Initialize all subsystems
      await this.assetManagementSystem.initialize();
      await this.layoutTemplateSystem.initialize();
      
      this.initialized = true;
      console.log('✅ Comprehensive Presentation System initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Comprehensive Presentation System:', error.message);
      return false;
    }
  }

  /**
   * Generate a complete presentation using all system components
   */
  async generatePresentation(presentationData, options = {}) {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      // Step 1: Validate input content
      const validationResult = await this.contentValidationSystem.validatePresentation(presentationData);
      if (!validationResult.isValid) {
        throw new Error(`Content validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Step 2: Detect optimal template
      const templateDetection = await this.dynamicTemplateDetector.detectTemplate(presentationData);
      
      // Step 3: Generate adaptive layouts
      const adaptiveLayouts = await this.adaptiveLayoutEngine.generateAdaptiveLayouts(
        presentationData, 
        templateDetection, 
        options
      );

      // Step 4: Apply professional design
      const designedPresentation = await this.professionalDesignSystem.applyDesign(
        adaptiveLayouts,
        templateDetection.theme || 'professional'
      );

      // Step 5: Prevent overflow issues
      const optimizedPresentation = await this.overflowPreventionSystem.preventOverflow(
        designedPresentation
      );

      // Step 6: Manage assets
      const finalPresentation = await this.assetManagementSystem.processAssets(
        optimizedPresentation
      );

      return {
        success: true,
        presentation: finalPresentation,
        metadata: {
          templateUsed: templateDetection.template,
          layoutStrategy: adaptiveLayouts.strategy,
          designTheme: templateDetection.theme || 'professional',
          processingTime: Date.now()
        }
      };
    } catch (error) {
      console.error('❌ Presentation generation failed:', error.message);
      return {
        success: false,
        error: error.message,
        fallback: await this.generateFallbackPresentation(presentationData)
      };
    }
  }

  /**
   * Generate a simple fallback presentation when main generation fails
   */
  async generateFallbackPresentation(presentationData) {
    try {
      return {
        title: presentationData.title || 'Presentation',
        slides: presentationData.slides || [
          {
            title: 'Title Slide',
            content: 'Generated with fallback system',
            type: 'title'
          }
        ],
        theme: 'professional'
      };
    } catch (error) {
      console.error('❌ Even fallback generation failed:', error.message);
      return null;
    }
  }

  /**
   * Get system status and health information
   */
  getSystemStatus() {
    return {
      initialized: this.initialized,
      components: {
        adaptiveLayoutEngine: !!this.adaptiveLayoutEngine,
        assetManagementSystem: !!this.assetManagementSystem,
        contentValidationSystem: !!this.contentValidationSystem,
        dynamicTemplateDetector: !!this.dynamicTemplateDetector,
        layoutTemplateSystem: !!this.layoutTemplateSystem,
        overflowPreventionSystem: !!this.overflowPreventionSystem,
        professionalDesignSystem: !!this.professionalDesignSystem
      },
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Cleanup resources
   */
  async cleanup() {
    try {
      await this.assetManagementSystem.cleanup();
      this.initialized = false;
      console.log('✅ Comprehensive Presentation System cleaned up successfully');
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
    }
  }
}

module.exports = { ComprehensivePresentationSystem };