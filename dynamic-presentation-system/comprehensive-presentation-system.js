/**
 * Comprehensive Presentation System
 * Main orchestrator for the dynamic presentation generation system
 */

const { AdaptiveLayoutEngine } = require('./adaptive-layout-engine');
const AssetManagementSystem = require('./asset-management-system');
const ContentValidationSystem = require('./content-validation-system');
const { DynamicTemplateDetector } = require('./dynamic-template-detector');
const LayoutTemplateSystem = require('./layout-template-system');
const OverflowPreventionSystem = require('./overflow-prevention-system');
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
      // Initialize all subsystems - AssetManagementSystem doesn't need explicit initialization
      // ContentValidationSystem is ready to use after construction
      
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
      console.log('✅ Comprehensive Presentation System initialized successfully');
      console.log(`🔍 Input presentation data:`, JSON.stringify(presentationData, null, 2));
      console.log(`🔍 Input slides count: ${presentationData.slides?.length || 0}`);
      // Step 1: Validate input content
      const validationResult = await this.contentValidationSystem.validateContent(presentationData);
      if (!validationResult.valid) {
        const errorMessages = validationResult.issues ? validationResult.issues.map(issue => issue.message).join(', ') : 'Unknown validation error';
        throw new Error(`Content validation failed: ${errorMessages}`);
      }

      // Step 2: Detect optimal template
      const templateDetection = await this.dynamicTemplateDetector.detectOptimalTemplate(presentationData);
      
      // Step 3: Generate adaptive layouts
      const adaptiveLayouts = await this.adaptiveLayoutEngine.generateAdaptiveLayouts(
        presentationData, 
        templateDetection, 
        options
      );

      // Step 4: Apply professional design
      console.log(`🔧 Before design application - slides count: ${adaptiveLayouts.slides?.length || 0}`);
      const designedPresentation = await this.professionalDesignSystem.applyDesign(
        adaptiveLayouts,
        templateDetection.theme || 'professional'
      );
      console.log(`🔧 After design application - slides count: ${designedPresentation.slides?.length || 0}`);

      // Step 5: Prevent overflow issues
      console.log(`🔧 Before overflow prevention - slides count: ${designedPresentation.slides?.length || 0}`);
      const optimizedPresentation = {
        ...designedPresentation,
        slides: designedPresentation.slides.map(slide => {
          if (slide.content) {
            slide.content = this.overflowPreventionSystem.preventOverflow(
              slide.content,
              slide.layout || 'generic'
            );
          }
          return slide;
        })
      };
      console.log(`🔧 After overflow prevention - slides count: ${optimizedPresentation.slides?.length || 0}`);
      console.log(`🔧 Optimized presentation type:`, typeof optimizedPresentation);
      console.log(`🔧 Optimized presentation keys:`, Object.keys(optimizedPresentation || {}));

      // Step 6: Manage assets
      console.log(`🔧 Before asset processing - slides count: ${optimizedPresentation.slides?.length || 0}`);
      const finalPresentation = await this.assetManagementSystem.processAssets(
        optimizedPresentation
      );
      console.log(`🔧 After asset processing - slides count: ${finalPresentation.slides?.length || 0}`);
      console.log(`🔧 Final presentation structure:`, JSON.stringify(finalPresentation, null, 2));

      // Step 7: Generate PPTX file
      const outputPath = await this.generatePPTXFile(finalPresentation, options.outputPath);

      return {
        success: true,
        outputPath: outputPath,
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
   * Generate PPTX file from presentation data
   */
  async generatePPTXFile(presentationData, outputPath) {
    const PptxGenJS = require('pptxgenjs');
    const path = require('path');
    const fs = require('fs');

    try {
      const pptx = new PptxGenJS();
      
      // Set presentation properties
      pptx.author = 'Presto Dynamic System';
      pptx.company = 'Presto';
      pptx.title = presentationData.title || 'Dynamic Presentation';
      
      // Process each slide
      console.log(`📋 Processing ${presentationData.slides?.length || 0} slides for PPTX generation`);
      for (const slideData of presentationData.slides || []) {
        console.log(`🔍 Slide data:`, JSON.stringify(slideData, null, 2));
        const slide = pptx.addSlide();
        
        // Add title if present
        if (slideData.title) {
          slide.addText(slideData.title, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 1,
            fontSize: 24,
            bold: true,
            color: '363636'
          });
        }
        
        // Add content if present
        if (slideData.content) {
          const contentText = Array.isArray(slideData.content) 
            ? slideData.content.join('\n') 
            : slideData.content;
          
          slide.addText(contentText, {
            x: 0.5,
            y: 2,
            w: 9,
            h: 4,
            fontSize: 16,
            color: '363636'
          });
        }
        
        // Add bullets if present
        if (slideData.bullets && Array.isArray(slideData.bullets)) {
          slideData.bullets.forEach((bullet, index) => {
            slide.addText(`• ${bullet}`, {
              x: 1,
              y: 3 + (index * 0.5),
              w: 8,
              h: 0.4,
              fontSize: 14,
              color: '363636'
            });
          });
        }
        
        // Add images if present
        if (slideData.image && slideData.image.path) {
          console.log(`🖼️ Adding image: ${slideData.image.path}`);
          try {
            slide.addImage({
              path: slideData.image.path,
              x: 6,
              y: 2,
              w: 3,
              h: 2.5
            });
            console.log(`✅ Image added successfully: ${path.basename(slideData.image.path)}`);
          } catch (error) {
            console.warn(`⚠️ Failed to add image ${slideData.image.path}:`, error.message);
          }
        }
        
        // Add icon if present
        if (slideData.icon && slideData.icon.path) {
          console.log(`🎯 Adding icon: ${slideData.icon.path}`);
          try {
            slide.addImage({
              path: slideData.icon.path,
              x: 0.5,
              y: 1.5,
              w: 0.5,
              h: 0.5
            });
            console.log(`✅ Icon added successfully: ${path.basename(slideData.icon.path)}`);
          } catch (error) {
            console.warn(`⚠️ Failed to add icon ${slideData.icon.path}:`, error.message);
          }
        }
        
        // Add background image if present
        if (slideData.backgroundImage && slideData.backgroundImage.path) {
          console.log(`🌄 Adding background: ${slideData.backgroundImage.path}`);
          try {
            slide.addImage({
              path: slideData.backgroundImage.path,
              x: 0,
              y: 0,
              w: '100%',
              h: '100%',
              sizing: { type: 'cover' }
            });
            console.log(`✅ Background added successfully: ${path.basename(slideData.backgroundImage.path)}`);
          } catch (error) {
            console.warn(`⚠️ Failed to add background image ${slideData.backgroundImage.path}:`, error.message);
          }
        }
      }
      
      // Ensure output directory exists
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      // Write the file
      await pptx.writeFile({ fileName: outputPath });
      
      console.log(`✅ PPTX file created: ${outputPath}`);
      return outputPath;
      
    } catch (error) {
      console.error('❌ PPTX generation failed:', error.message);
      throw new Error(`Failed to generate PPTX file: ${error.message}`);
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

module.exports = ComprehensivePresentationSystem;