#!/usr/bin/env node
/**
 * Dynamic Presentation Generator - Examples and API Documentation
 * 
 * This file provides comprehensive examples of how to use the Dynamic Presentation Generator
 * to create presentations that adapt to almost any user request.
 * 
 * Features Demonstrated:
 * - Default layouts (text left, images right)
 * - Icon grids and chart visualizations
 * - Intelligent template selection
 * - Content analysis and adaptive layouts
 * - Multiple color schemes and themes
 * - Error handling and validation
 */

const DynamicPresentationGenerator = require('../core/dynamic_presentation_generator');

// Example 1: Basic Usage with Default Layout (Text Left, Images Right)
async function basicExample() {
    console.log('📋 Example 1: Basic Usage with Default Layout');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'professional',
        layout: 'LAYOUT_16x9'
    });

    const data = {
        title: 'My Business Presentation',
        subtitle: 'Quarterly Results and Future Plans',
        author: 'John Doe',
        slides: {
            title: {
                title: 'My Business Presentation',
                subtitle: 'Q4 2024 Results and 2025 Strategy',
                author: 'John Doe, CEO'
            },
            
            overview: {
                title: 'Executive Summary',
                content: 'This quarter has shown remarkable growth across all business segments. Our innovative approach to customer engagement and operational efficiency has resulted in a 25% increase in revenue and 40% improvement in customer satisfaction scores.',
                images: [{ description: 'Growth chart visualization' }]
            },
            
            results: {
                title: 'Key Achievements',
                bullets: [
                    'Revenue increased by 25% compared to Q3 2024',
                    'Customer satisfaction improved to 94%',
                    'Operational costs reduced by 15%',
                    'Market share expanded in 3 new regions',
                    'Employee engagement score reached 89%'
                ]
            }
        }
    };

    try {
        await generator.generatePresentation(data, 'examples/basic_presentation.pptx');
        console.log('✅ Basic presentation created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 2: Icon Grid Layout
async function iconGridExample() {
    console.log('📋 Example 2: Icon Grid Layout');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'modern',
        layout: 'LAYOUT_16x9'
    });

    const data = {
        title: 'Service Portfolio',
        slides: {
            title: {
                title: 'Our Service Portfolio',
                subtitle: 'Comprehensive Solutions for Your Business'
            },
            
            services: {
                title: 'Available Services',
                content: 'We offer a comprehensive range of services designed to help your business thrive in the digital age.',
                icons: [
                    { symbol: '💻', label: 'Web Development' },
                    { symbol: '📱', label: 'Mobile Apps' },
                    { symbol: '☁️', label: 'Cloud Solutions' },
                    { symbol: '🔒', label: 'Cybersecurity' },
                    { symbol: '📊', label: 'Data Analytics' },
                    { symbol: '🤖', label: 'AI Solutions' },
                    { symbol: '🎨', label: 'UI/UX Design' },
                    { symbol: '⚡', label: 'Performance' },
                    { symbol: '🛠️', label: 'Maintenance' }
                ]
            }
        }
    };

    try {
        await generator.generatePresentation(data, 'examples/icon_grid_presentation.pptx');
        console.log('✅ Icon grid presentation created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 3: Chart and Data Visualization
async function chartExample() {
    console.log('📋 Example 3: Chart and Data Visualization');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'professional',
        layout: 'LAYOUT_16x9'
    });

    const data = {
        title: 'Sales Performance Report',
        slides: {
            title: {
                title: 'Sales Performance Report',
                subtitle: 'Q4 2024 Analysis and Trends'
            },
            
            monthly_sales: {
                title: 'Monthly Sales Performance',
                content: 'Sales performance has shown consistent growth throughout the quarter.',
                chartData: {
                    values: [120000, 135000, 142000, 158000, 175000, 190000, 205000, 220000]
                }
            },
            
            regional_breakdown: {
                title: 'Regional Sales Breakdown',
                content: 'Performance varies significantly across different regions.',
                chartData: {
                    values: [250000, 180000, 220000, 165000, 290000]
                }
            }
        }
    };

    try {
        await generator.generatePresentation(data, 'examples/chart_presentation.pptx');
        console.log('✅ Chart presentation created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 4: Two-Column Comparison Layout
async function twoColumnExample() {
    console.log('📋 Example 4: Two-Column Comparison Layout');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'creative',
        layout: 'LAYOUT_16x9'
    });

    const data = {
        title: 'Product Comparison',
        slides: {
            title: {
                title: 'Product Comparison',
                subtitle: 'Standard vs Premium Features'
            },
            
            feature_comparison: {
                title: 'Feature Comparison',
                leftContent: 'Standard Package:\n\n• Basic features included\n• Email support\n• Monthly reports\n• 10 GB storage\n• Standard SLA\n• Community access\n\nPrice: $99/month',
                rightContent: 'Premium Package:\n\n• All standard features\n• Priority phone support\n• Real-time analytics\n• 100 GB storage\n• Premium SLA (99.9%)\n• Expert consultation\n• Custom integrations\n\nPrice: $299/month'
            },
            
            recommendation: {
                title: 'Our Recommendation',
                content: 'For most businesses, the Premium package offers the best value with its comprehensive feature set and priority support. The additional investment pays for itself through improved efficiency and reduced downtime.',
                bullets: [
                    'Premium support reduces issue resolution time by 75%',
                    'Real-time analytics improve decision making',
                    'Higher storage limits support business growth',
                    'Custom integrations streamline workflows'
                ]
            }
        }
    };

    try {
        await generator.generatePresentation(data, 'examples/two_column_presentation.pptx');
        console.log('✅ Two-column presentation created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 5: Mixed Content Types (Advanced)
async function mixedContentExample() {
    console.log('📋 Example 5: Mixed Content Types (Advanced)');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'modern',
        layout: 'LAYOUT_16x9',
        enableValidation: true,
        enableFallbacks: true
    });

    const data = {
        title: 'Comprehensive Business Review',
        subtitle: 'Multi-faceted Analysis and Strategic Planning',
        author: 'Business Intelligence Team',
        slides: {
            title: {
                title: 'Comprehensive Business Review',
                subtitle: 'Q4 2024 • Multi-faceted Analysis • Strategic Planning',
                author: 'Business Intelligence Team'
            },
            
            // Text-heavy slide (will use full-text layout)
            market_analysis: {
                title: 'Market Analysis',
                content: 'The current market landscape presents both opportunities and challenges for our business segment. Industry reports indicate a 12% growth in our target market, driven primarily by digital transformation initiatives across enterprises. Key factors influencing this growth include increased adoption of cloud technologies, rising demand for data analytics solutions, and regulatory changes requiring enhanced security measures. Our competitive position remains strong, with market share increasing from 8.3% to 10.7% year-over-year. However, new entrants are challenging traditional players with innovative pricing models and specialized solutions. To maintain our competitive edge, we must continue investing in R&D, enhance our customer experience, and explore strategic partnerships. The regulatory environment is becoming more complex, requiring compliance investments that may impact short-term profitability but are essential for long-term sustainability.'
            },
            
            // Icon-based slide
            strategic_pillars: {
                title: 'Strategic Pillars for 2025',
                icons: [
                    { symbol: '🎯', label: 'Customer Focus' },
                    { symbol: '🚀', label: 'Innovation' },
                    { symbol: '🤝', label: 'Partnerships' },
                    { symbol: '📈', label: 'Growth' },
                    { symbol: '🛡️', label: 'Security' },
                    { symbol: '🌱', label: 'Sustainability' }
                ]
            },
            
            // Chart slide
            financial_performance: {
                title: 'Financial Performance Trends',
                content: 'Financial metrics show strong performance across all quarters.',
                chartData: {
                    values: [2.1, 2.4, 2.8, 3.2, 3.6, 4.1, 4.5, 4.8, 5.2, 5.7, 6.1, 6.5]
                }
            },
            
            // Two-column comparison
            swot_analysis: {
                title: 'SWOT Analysis',
                leftContent: 'Strengths:\n• Market leadership position\n• Strong brand recognition\n• Innovative product portfolio\n• Skilled workforce\n• Financial stability\n\nWeaknesses:\n• High operational costs\n• Limited international presence\n• Dependency on key clients\n• Legacy system constraints',
                rightContent: 'Opportunities:\n• Emerging market expansion\n• Digital transformation demand\n• Strategic acquisition targets\n• New technology adoption\n• Regulatory compliance services\n\nThreats:\n• Increased competition\n• Economic uncertainty\n• Changing customer preferences\n• Cybersecurity risks\n• Regulatory changes'
            },
            
            // Image-focused slide with text
            vision_2025: {
                title: 'Vision 2025',
                content: 'Our vision for 2025 is to become the leading provider of innovative business solutions that empower organizations to thrive in the digital economy. We will achieve this through strategic investments in technology, talent, and customer relationships.',
                images: [{ description: 'Vision 2025 roadmap illustration' }]
            }
        }
    };

    try {
        await generator.generatePresentation(data, 'examples/mixed_content_presentation.pptx');
        console.log('✅ Mixed content presentation created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 6: Simple Text-Only Generation (No Slide Structure)
async function simpleTextExample() {
    console.log('📋 Example 6: Simple Text-Only Generation');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'minimal'
    });

    const data = {
        title: 'Project Update',
        content: 'The project is progressing well with all major milestones on track. Team productivity has increased by 30% since implementing the new workflow processes.'
    };

    try {
        await generator.generatePresentation(data, 'examples/simple_text_presentation.pptx');
        console.log('✅ Simple text presentation created successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 7: Error Handling and Validation
async function errorHandlingExample() {
    console.log('📋 Example 7: Error Handling and Validation');
    
    const generator = new DynamicPresentationGenerator({
        enableValidation: true,
        enableFallbacks: true,
        maxSlides: 10
    });

    // Intentionally problematic data to demonstrate error handling
    const problematicData = {
        title: 'A'.repeat(200), // Too long title
        slides: {
            title: {
                title: 'Test Presentation',
                subtitle: 'B'.repeat(300) // Too long subtitle
            },
            
            content1: {
                title: 'Content Slide',
                content: 'C'.repeat(20000) // Very long content
            },
            
            content2: {
                title: 'Another Slide',
                bullets: Array(20).fill('Too many bullets') // Too many bullets
            }
        }
    };

    try {
        await generator.generatePresentation(problematicData, 'examples/error_handling_presentation.pptx');
        console.log('✅ Error handling presentation created successfully (with fallbacks)!');
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Example 8: Custom Configuration and Advanced Features
async function advancedConfigExample() {
    console.log('📋 Example 8: Advanced Configuration');
    
    const generator = new DynamicPresentationGenerator({
        colorScheme: 'creative',
        layout: 'LAYOUT_16x9',
        maxSlides: 50,
        maxTextLength: 5000,
        enableValidation: true,
        enableFallbacks: true,
        author: 'Advanced User',
        company: 'Tech Innovations Inc.'
    });

    // Monitor events
    generator.on('generationStarted', (data) => {
        console.log(`🚀 Generation started: ${data.outputPath}`);
    });

    generator.on('slideCreated', (data) => {
        console.log(`📄 Created ${data.type} slide ${data.index}`);
    });

    generator.on('generationCompleted', (stats) => {
        console.log(`🎉 Generation completed in ${stats.duration}ms`);
        console.log(`📊 Template: ${stats.template}, Layout: ${stats.layout}`);
    });

    const data = {
        title: 'Advanced Configuration Demo',
        template: 'adaptive', // Request specific template
        slides: {
            title: {
                title: 'Advanced Configuration Demo',
                subtitle: 'Showcasing Custom Settings and Event Monitoring'
            },
            
            features: {
                title: 'Advanced Features',
                bullets: [
                    'Custom color schemes and themes',
                    'Event monitoring and callbacks',
                    'Intelligent content analysis',
                    'Automatic layout selection',
                    'Error handling and validation',
                    'Flexible configuration options'
                ]
            }
        }
    };

    try {
        const stats = await generator.generatePresentation(data, 'examples/advanced_config_presentation.pptx');
        
        console.log('\n📈 Generation Statistics:');
        console.log(`   Content Type: ${stats.contentType}`);
        console.log(`   Template Used: ${stats.template}`);
        console.log(`   Layout Strategy: ${stats.layout}`);
        console.log(`   Slides Created: ${stats.slideCount}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// API Documentation and Usage Guide
function printAPIDocumentation() {
    console.log('\n📚 DYNAMIC PRESENTATION GENERATOR - API DOCUMENTATION');
    console.log('═'.repeat(70));
    
    console.log('\n🏗️  CONSTRUCTOR OPTIONS:');
    console.log(`
const generator = new DynamicPresentationGenerator({
    colorScheme: 'professional',  // 'professional', 'modern', 'creative', 'minimal'
    layout: 'LAYOUT_16x9',        // 'LAYOUT_16x9', 'LAYOUT_4x3', 'LAYOUT_16x10'
    maxSlides: 100,               // Maximum number of slides
    maxTextLength: 15000,         // Maximum text length per element
    enableValidation: true,       // Enable input validation
    enableFallbacks: true,        // Enable error recovery
    author: 'Your Name',          // Presentation author
    company: 'Your Company'       // Company name
});`);

    console.log('\n📋 DATA STRUCTURE:');
    console.log(`
const data = {
    title: 'Presentation Title',      // Main presentation title
    subtitle: 'Optional Subtitle',   // Optional subtitle
    author: 'Author Name',            // Optional author
    template: 'adaptive',             // Optional template override
    
    slides: {
        title: {                      // Title slide (optional)
            title: 'Slide Title',
            subtitle: 'Slide Subtitle',
            author: 'Author'
        },
        
        content_slide: {              // Content slide
            title: 'Slide Title',
            content: 'Main content text...',
            
            // Optional elements:
            bullets: ['Item 1', 'Item 2', ...],
            images: [{ description: 'Image description' }],
            icons: [{ symbol: '🎯', label: 'Label' }],
            chartData: { values: [10, 20, 30, ...] },
            leftContent: 'Left column text',
            rightContent: 'Right column text'
        }
    }
};`);

    console.log('\n🎨 LAYOUT TYPES (Automatically Selected):');
    console.log('   • textImageDefault: Text left, images right (DEFAULT)');
    console.log('   • fullText: Full-width text content');
    console.log('   • imageFocus: Large images with minimal text');
    console.log('   • chartLayout: Data visualization focused');
    console.log('   • iconGrid: Icon arrangements in grid');
    console.log('   • twoColumn: Side-by-side content comparison');

    console.log('\n🎯 CONTENT ANALYSIS:');
    console.log('   The generator automatically analyzes content to:');
    console.log('   • Detect content types (text, visual, data, conceptual)');
    console.log('   • Select appropriate layout templates');
    console.log('   • Choose optimal positioning and sizing');
    console.log('   • Apply suitable styling and themes');

    console.log('\n🔧 METHODS:');
    console.log('   • generatePresentation(data, outputPath)  - Main generation method');
    console.log('   • getContentAnalysis()                   - Get analysis results');
    console.log('   • getSupportedLayouts()                  - List available layouts');
    console.log('   • getAvailableColorSchemes()             - List color schemes');

    console.log('\n📡 EVENTS:');
    console.log('   • generationStarted  - Fired when generation begins');
    console.log('   • slideCreated       - Fired for each slide created');
    console.log('   • generationCompleted - Fired when generation completes');
    console.log('   • error              - Fired on recoverable errors');

    console.log('\n💡 USAGE TIPS:');
    console.log('   • Leave template unspecified for automatic selection');
    console.log('   • Use bulletpoint arrays for automatic formatting');
    console.log('   • Include chartData.values arrays for visualizations');
    console.log('   • Provide icon objects with symbol and label properties');
    console.log('   • Enable validation and fallbacks for robust generation');
    console.log('   • Monitor events for detailed generation feedback');
    
    console.log('\n✅ FALLBACK BEHAVIOR:');
    console.log('   • Invalid data → Validation errors with suggestions');
    console.log('   • Missing content → Default placeholder content');
    console.log('   • Oversized text → Automatic truncation with ellipsis');
    console.log('   • Layout errors → Graceful fallback to safe layouts');
    console.log('   • No slides → Automatic demo slide generation');
}

// Main execution function
async function runAllExamples() {
    console.log('🎯 DYNAMIC PRESENTATION GENERATOR - COMPREHENSIVE EXAMPLES');
    console.log('═'.repeat(70));
    
    // Create examples directory
    const fs = require('fs').promises;
    try {
        await fs.mkdir('examples', { recursive: true });
    } catch (error) {
        // Directory might already exist
    }

    // Run all examples
    try {
        await basicExample();
        await iconGridExample();
        await chartExample();
        await twoColumnExample();
        await mixedContentExample();
        await simpleTextExample();
        await errorHandlingExample();
        await advancedConfigExample();
        
        console.log('\n🎉 ALL EXAMPLES COMPLETED SUCCESSFULLY!');
        console.log('\n📁 Generated files in examples/ directory:');
        console.log('   • basic_presentation.pptx');
        console.log('   • icon_grid_presentation.pptx');
        console.log('   • chart_presentation.pptx');
        console.log('   • two_column_presentation.pptx');
        console.log('   • mixed_content_presentation.pptx');
        console.log('   • simple_text_presentation.pptx');
        console.log('   • error_handling_presentation.pptx');
        console.log('   • advanced_config_presentation.pptx');
        
    } catch (error) {
        console.error('\n❌ Example execution failed:', error.message);
    }
    
    // Print API documentation
    printAPIDocumentation();
}

// Export examples for individual use
module.exports = {
    basicExample,
    iconGridExample,
    chartExample,
    twoColumnExample,
    mixedContentExample,
    simpleTextExample,
    errorHandlingExample,
    advancedConfigExample,
    runAllExamples,
    printAPIDocumentation
};

// Run all examples if called directly
if (require.main === module) {
    runAllExamples().catch(console.error);
}
