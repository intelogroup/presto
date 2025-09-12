#!/usr/bin/env node

const ComprehensivePresentationSystem = require('./dynamic-presentation-system/comprehensive-presentation-system');
const fs = require('fs');
const path = require('path');

/**
 * Fixed Dynamic System Test with Proper PNG Integration
 * Based on IMAGE_INTEGRATION_COMPLETE_GUIDE.md best practices
 */
class FixedDynamicSystemTester {
    constructor() {
        this.assetsPath = path.join(__dirname, 'assets-images-png', 'svgrepo-icons-graphics');
        this.outputPath = path.join(__dirname, 'output', 'dynamic-system-fixed.pptx');
    }

    /**
     * Verify image exists and is readable (from guide)
     */
    verifyImageExists(imagePath) {
        try {
            return fs.existsSync(imagePath) && fs.statSync(imagePath).size > 0;
        } catch (error) {
            console.warn(`Error checking image: ${imagePath}`, error);
            return false;
        }
    }

    /**
     * Get valid PNG asset path with fallback
     */
    getValidAssetPath(preferredName) {
        try {
            if (!fs.existsSync(this.assetsPath)) {
                console.warn(`Assets directory not found: ${this.assetsPath}`);
                return null;
            }

            const files = fs.readdirSync(this.assetsPath)
                .filter(file => file.toLowerCase().endsWith('.png'));

            // Try to find preferred asset
            if (preferredName) {
                const preferred = files.find(file => 
                    file.toLowerCase().includes(preferredName.toLowerCase())
                );
                if (preferred) {
                    const fullPath = path.join(this.assetsPath, preferred);
                    if (this.verifyImageExists(fullPath)) {
                        return fullPath;
                    }
                }
            }

            // Fallback to first valid asset
            for (const file of files) {
                const fullPath = path.join(this.assetsPath, file);
                if (this.verifyImageExists(fullPath)) {
                    return fullPath;
                }
            }

            return null;
        } catch (error) {
            console.error('Error getting asset path:', error);
            return null;
        }
    }

    /**
     * Create test content with proper PNG paths
     */
    createTestContent() {
        console.log('🔍 Preparing test content with PNG assets...');

        // Get valid asset paths
        const businessIcon = this.getValidAssetPath('business');
        const techIcon = this.getValidAssetPath('technology') || this.getValidAssetPath('icon');
        const chartIcon = this.getValidAssetPath('chart') || this.getValidAssetPath('graph');
        const teamIcon = this.getValidAssetPath('team') || this.getValidAssetPath('person');
        const backgroundImage = this.getValidAssetPath('background') || businessIcon;

        console.log('📁 Selected assets:');
        console.log(`   Business icon: ${businessIcon ? path.basename(businessIcon) : 'Not found'}`);
        console.log(`   Tech icon: ${techIcon ? path.basename(techIcon) : 'Not found'}`);
        console.log(`   Chart icon: ${chartIcon ? path.basename(chartIcon) : 'Not found'}`);
        console.log(`   Team icon: ${teamIcon ? path.basename(teamIcon) : 'Not found'}`);
        console.log(`   Background: ${backgroundImage ? path.basename(backgroundImage) : 'Not found'}`);

        return {
            title: "Dynamic System with PNG Assets",
            theme: "professional",
            slides: [
                {
                    type: "title",
                    title: "Dynamic Presentation System",
                    subtitle: "Testing PNG Asset Integration",
                    // ✅ CORRECT - Use 'path' property for file-based images
                    backgroundImage: backgroundImage ? { path: backgroundImage } : null
                },
                {
                    type: "content",
                    title: "Business Overview",
                    content: [
                        "• Strategic business planning",
                        "• Market analysis and insights",
                        "• Performance optimization",
                        "• Growth opportunities"
                    ],
                    // ✅ CORRECT - Use 'path' property
                    image: businessIcon ? { path: businessIcon } : null
                },
                {
                    type: "content",
                    title: "Technology Integration",
                    content: [
                        "• Modern tech stack",
                        "• Scalable architecture",
                        "• Security best practices",
                        "• Performance monitoring"
                    ],
                    // ✅ CORRECT - Use 'path' property
                    icon: techIcon ? { path: techIcon } : null
                },
                {
                    type: "content",
                    title: "Analytics Dashboard",
                    content: [
                        "• Real-time metrics",
                        "• Data visualization",
                        "• Trend analysis",
                        "• Predictive insights"
                    ],
                    // ✅ CORRECT - Use 'path' property
                    image: chartIcon ? { path: chartIcon } : null
                },
                {
                    type: "content",
                    title: "Team Collaboration",
                    content: [
                        "• Cross-functional teams",
                        "• Agile methodologies",
                        "• Communication tools",
                        "• Knowledge sharing"
                    ],
                    // ✅ CORRECT - Use 'path' property
                    icon: teamIcon ? { path: teamIcon } : null
                },
                {
                    type: "conclusion",
                    title: "Success Metrics",
                    content: [
                        "✅ PNG assets properly integrated",
                        "✅ File-based image loading working",
                        "✅ Fallback mechanisms in place",
                        "✅ Error handling implemented"
                    ],
                    // ✅ CORRECT - Use 'path' property
                    backgroundImage: backgroundImage ? { path: backgroundImage } : null
                }
            ]
        };
    }

    /**
     * Run the fixed dynamic system test
     */
    async runTest() {
        console.log('🧪 Starting Fixed Dynamic System Test...');
        console.log('📁 Assets path:', this.assetsPath);
        
        try {
            // Create test content with proper PNG integration
            const testContent = this.createTestContent();
            
            // Initialize dynamic presentation system
            console.log('\n🚀 Initializing Dynamic Presentation System...');
            const dynamicSystem = new ComprehensivePresentationSystem();
            
            // Generate presentation
            console.log('\n📊 Generating presentation...');
            const result = await dynamicSystem.generatePresentation(testContent, {
                outputPath: this.outputPath,
                enableAssetManagement: true,
                enableAdaptiveLayout: true,
                enableContentValidation: true
            });
            
            if (result.success) {
                console.log('\n🎉 Fixed Dynamic System Test Completed Successfully!');
                console.log('📁 Output:', result.outputPath);
                
                // Verify file was created and get stats
                if (fs.existsSync(result.outputPath)) {
                    const fileStats = fs.statSync(result.outputPath);
                    console.log(`📊 File size: ${Math.round(fileStats.size / 1024)}KB`);
                    
                    // Check if file size indicates proper image embedding
                    const hasImages = fileStats.size > 200000; // > 200KB suggests images are embedded
                    console.log(`🖼️  Images embedded: ${hasImages ? '✅ Yes' : '❌ No (file too small)'}`);
                    
                    return {
                        success: true,
                        outputPath: result.outputPath,
                        fileSize: fileStats.size,
                        hasEmbeddedImages: hasImages,
                        metrics: result.metrics || {},
                        assetsUsed: {
                            totalAssets: Object.keys(testContent.slides.filter(slide => 
                                slide.image || slide.icon || slide.backgroundImage
                            )).length,
                            validAssets: testContent.slides.filter(slide => 
                                (slide.image && slide.image.path) ||
                                (slide.icon && slide.icon.path) ||
                                (slide.backgroundImage && slide.backgroundImage.path)
                            ).length
                        }
                    };
                } else {
                    throw new Error('Output file was not created');
                }
            } else {
                throw new Error(result.error || 'Generation failed');
            }
            
        } catch (error) {
            console.error('❌ Test failed:', error);
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
}

// Run the test if this file is executed directly
if (require.main === module) {
    const tester = new FixedDynamicSystemTester();
    tester.runTest().then(result => {
        console.log('\n📋 Final Result:');
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });
}

module.exports = FixedDynamicSystemTester;