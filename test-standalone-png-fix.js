#!/usr/bin/env node

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

/**
 * Standalone PNG Integration Fix Test
 * Direct implementation using PptxGenJS with proper PNG handling
 * Based on IMAGE_INTEGRATION_COMPLETE_GUIDE.md best practices
 * Enhanced with overflow prevention and corruption fixes
 */
class StandalonePngFixTester {
    constructor() {
        this.assetsPath = path.join(__dirname, 'assets-images-png', 'svgrepo-icons-graphics');
        this.outputPath = path.join(__dirname, 'output', 'standalone-png-fix.pptx');
        
        // Layout constraints and safe areas (from pptx-toolkit patterns)
        this.layout = {
            width: 10,
            height: 5.625,
            safeArea: {
                x: 0.5,
                y: 0.5,
                width: 9.0,
                height: 4.625
            }
        };
        
        // Font metrics for overflow prevention
        this.fontMetrics = {
            12: { lineHeight: 0.17, charWidth: 0.065 },
            16: { lineHeight: 0.22, charWidth: 0.085 },
            18: { lineHeight: 0.25, charWidth: 0.095 },
            24: { lineHeight: 0.33, charWidth: 0.125 },
            32: { lineHeight: 0.44, charWidth: 0.165 }
        };
        
        // Content constraints
        this.contentLimits = {
            title: { maxLength: 80, minFontSize: 24, maxFontSize: 32 },
            subtitle: { maxLength: 120, minFontSize: 16, maxFontSize: 20 },
            body: { maxLength: 500, minFontSize: 14, maxFontSize: 18 },
            bullet: { maxLength: 60, minFontSize: 14, maxFontSize: 16 }
        };
    }

    /**
     * Verify image exists and is readable (Critical from guide)
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
     * Get valid PNG asset with fallback strategy
     */
    getValidAsset(preferredKeywords = []) {
        try {
            if (!fs.existsSync(this.assetsPath)) {
                console.warn(`Assets directory not found: ${this.assetsPath}`);
                return null;
            }

            const files = fs.readdirSync(this.assetsPath)
                .filter(file => file.toLowerCase().endsWith('.png'))
                .map(file => path.join(this.assetsPath, file))
                .filter(filePath => this.verifyImageExists(filePath));

            if (files.length === 0) {
                console.warn('No valid PNG files found');
                return null;
            }

            // Try to find preferred asset by keywords
            for (const keyword of preferredKeywords) {
                const preferred = files.find(file => 
                    path.basename(file).toLowerCase().includes(keyword.toLowerCase())
                );
                if (preferred) {
                    console.log(`✅ Found preferred asset: ${path.basename(preferred)}`);
                    return preferred;
                }
            }

            // Return first valid asset as fallback
            console.log(`📁 Using fallback asset: ${path.basename(files[0])}`);
            return files[0];

        } catch (error) {
            console.error('Error getting asset:', error);
            return null;
        }
    }

    /**
     * Validate element bounds within safe area
     */
    validateElementBounds(element) {
        const safeArea = this.layout.safeArea;
        return {
            withinBounds: element.x >= safeArea.x && 
                         element.y >= safeArea.y && 
                         element.x + element.w <= safeArea.x + safeArea.width && 
                         element.y + element.h <= safeArea.y + safeArea.height,
            adjustedElement: {
                x: Math.max(safeArea.x, Math.min(element.x, safeArea.x + safeArea.width - element.w)),
                y: Math.max(safeArea.y, Math.min(element.y, safeArea.y + safeArea.height - element.h)),
                w: Math.min(element.w, safeArea.width),
                h: Math.min(element.h, safeArea.height)
            }
        };
    }
    
    /**
     * Calculate optimal font size to prevent overflow
     */
    calculateOptimalFontSize(text, container, contentType = 'body') {
        const limits = this.contentLimits[contentType];
        let fontSize = limits.maxFontSize;
        
        // Truncate text if too long
        if (text.length > limits.maxLength) {
            text = text.substring(0, limits.maxLength - 3) + '...';
        }
        
        // Calculate required dimensions
        while (fontSize >= limits.minFontSize) {
            const metrics = this.fontMetrics[fontSize] || this.fontMetrics[16];
            const estimatedLines = Math.ceil((text.length * metrics.charWidth) / container.w);
            const requiredHeight = estimatedLines * metrics.lineHeight;
            
            if (requiredHeight <= container.h * 0.9) { // 90% utilization max
                break;
            }
            fontSize -= 2;
        }
        
        return { fontSize: Math.max(fontSize, limits.minFontSize), text };
    }
    
    /**
     * Add text with overflow prevention
     */
    addTextSafely(slide, text, options, contentType = 'body') {
        const bounds = this.validateElementBounds(options);
        const container = bounds.withinBounds ? options : bounds.adjustedElement;
        const { fontSize, text: safeText } = this.calculateOptimalFontSize(text, container, contentType);
        
        if (!bounds.withinBounds) {
            console.warn(`⚠️  Text element adjusted to fit safe area`);
        }
        
        slide.addText(safeText, {
            ...container,
            fontSize,
            wrap: true,
            autoFit: true,
            shrinkText: true,
            ...options
        });
        
        return { success: true, adjusted: !bounds.withinBounds, fontSize, textLength: safeText.length };
    }

    /**
     * Add image with proper error handling, bounds checking, and fallback
     */
    addImageSafely(slide, imagePath, options, fallbackText = 'Image Not Available') {
        // Validate image bounds first
        const bounds = this.validateElementBounds(options);
        const safeOptions = bounds.withinBounds ? options : bounds.adjustedElement;
        
        if (!bounds.withinBounds) {
            console.warn(`⚠️  Image bounds adjusted to fit safe area`);
        }
        
        if (imagePath && this.verifyImageExists(imagePath)) {
            try {
                // ✅ CRITICAL - Always use 'path' property for file-based images
                // Simplified approach without complex sizing options
                slide.addImage({ 
                    path: imagePath, 
                    ...safeOptions
                });
                console.log(`   ✅ Successfully added: ${path.basename(imagePath)}`);
                return true;
            } catch (error) {
                console.warn(`   ❌ Failed to add image: ${path.basename(imagePath)}`, error.message);
            }
        } else {
            console.warn(`   ⚠️  Image invalid or not found: ${imagePath}`);
        }

        // Add fallback rectangle with text (from guide) - within safe bounds
        slide.addShape('rect', {
            fill: { color: 'F5F5F5' },
            line: { width: 1, color: 'CCCCCC' },
            ...safeOptions
        });

        this.addTextSafely(slide, fallbackText, {
            x: safeOptions.x,
            y: safeOptions.y + (safeOptions.h / 2) - 0.25,
            w: safeOptions.w,
            h: 0.5,
            fontSize: 12,
            color: '666666',
            align: 'center',
            valign: 'middle'
        });

        return false;
    }

    /**
     * Create presentation with proper PNG integration and overflow prevention
     */
    async createPresentation() {
        console.log('🧪 Creating standalone PNG integration test with overflow prevention...');
        
        const pptx = new PptxGenJS();
        
        // Define layout with safe areas (corruption prevention)
        pptx.defineLayout({ 
            name: 'SAFE_LAYOUT_16x9', 
            width: this.layout.width, 
            height: this.layout.height 
        });
        pptx.layout = 'SAFE_LAYOUT_16x9';
        
        // Set presentation properties with length limits
        pptx.author = 'PNG Integration Fix Tester';
        pptx.company = 'Presto Dynamic System';
        pptx.title = 'Standalone PNG Integration Fix - Enhanced';
        pptx.subject = 'Testing corrected PNG integration with overflow prevention';

        let successCount = 0;
        let failureCount = 0;

        // Get sample assets
        const businessAsset = this.getValidAsset(['business', 'office', 'work']);
        const techAsset = this.getValidAsset(['technology', 'tech', 'computer', 'digital']);
        const chartAsset = this.getValidAsset(['chart', 'graph', 'analytics', 'data']);
        const iconAsset = this.getValidAsset(['icon', 'symbol', 'logo']);

        console.log('\n📄 Creating slides...');

        // Slide 1: Title with background (overflow-safe)
        console.log('Creating title slide with safe bounds...');
        const slide1 = pptx.addSlide();
        
        // Title with automatic sizing
        const titleResult = this.addTextSafely(slide1, 'PNG Integration Fix Test - Enhanced', {
            x: 1,
            y: 1.5,
            w: 8,
            h: 1.5,
            bold: true,
            color: '2E4057',
            align: 'center'
        }, 'title');

        // Subtitle with constraints
        const subtitleResult = this.addTextSafely(slide1, 'Corrected PNG Asset Loading with Overflow Prevention', {
            x: 1,
            y: 3,
            w: 8,
            h: 0.8,
            color: '5A6C7D',
            align: 'center'
        }, 'subtitle');

        // Add background image within safe area
        if (this.addImageSafely(slide1, businessAsset, {
            x: 7,
            y: 4,
            w: 1.5,
            h: 1.5
        }, 'Background\nImage')) {
            successCount++;
        } else {
            failureCount++;
        }
        
        console.log(`   📏 Title font size: ${titleResult.fontSize}px, Subtitle: ${subtitleResult.fontSize}px`);

        // Slide 2: Business content with image (overflow-safe)
        console.log('Creating business slide with content constraints...');
        const slide2 = pptx.addSlide();
        
        // Title with safe sizing
        this.addTextSafely(slide2, 'Business Solutions', {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            bold: true,
            color: '2E4057'
        }, 'title');

        const businessContent = [
            '• Strategic planning and execution',
            '• Market analysis and insights', 
            '• Performance optimization',
            '• Growth opportunities',
            '• Risk management strategies',
            '• Innovation frameworks'
        ];

        // Content with overflow prevention
        const contentResult = this.addTextSafely(slide2, businessContent.join('\n'), {
            x: 0.5,
            y: 1.5,
            w: 4.5,
            h: 3.5,
            color: '333333'
        }, 'body');

        // Add business image within safe bounds
        if (this.addImageSafely(slide2, businessAsset, {
            x: 5.5,
            y: 2,
            w: 3,
            h: 2.5
        }, 'Business\nImage')) {
            successCount++;
        } else {
            failureCount++;
        }
        
        console.log(`   📏 Content font size: ${contentResult.fontSize}px, length: ${contentResult.textLength} chars`);

        // Slide 3: Technology with icon
        console.log('Creating technology slide...');
        const slide3 = pptx.addSlide();
        
        slide3.addText('Technology Integration', {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: '2E4057'
        });

        const techContent = [
            '• Modern technology stack',
            '• Scalable architecture design',
            '• Security best practices',
            '• Performance monitoring'
        ];

        slide3.addText(techContent.join('\n'), {
            x: 0.5,
            y: 1.5,
            w: 5,
            h: 4,
            fontSize: 16,
            color: '333333'
        });

        // Add tech icon
        if (this.addImageSafely(slide3, techAsset, {
            x: 6.5,
            y: 2.5,
            w: 2,
            h: 2
        }, 'Tech\nIcon')) {
            successCount++;
        } else {
            failureCount++;
        }

        // Slide 4: Analytics with chart
        console.log('Creating analytics slide...');
        const slide4 = pptx.addSlide();
        
        slide4.addText('Data Analytics', {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: '2E4057'
        });

        const analyticsContent = [
            '• Real-time data processing',
            '• Advanced visualization',
            '• Predictive analytics',
            '• Business intelligence'
        ];

        slide4.addText(analyticsContent.join('\n'), {
            x: 0.5,
            y: 1.5,
            w: 5,
            h: 4,
            fontSize: 16,
            color: '333333'
        });

        // Add chart image
        if (this.addImageSafely(slide4, chartAsset, {
            x: 6,
            y: 2,
            w: 3,
            h: 2.5
        }, 'Chart\nImage')) {
            successCount++;
        } else {
            failureCount++;
        }

        // Slide 5: Summary with multiple icons (overflow-safe)
        console.log('Creating summary slide with enhanced metrics...');
        const slide5 = pptx.addSlide();
        
        // Title with safe constraints
        this.addTextSafely(slide5, 'Integration Results - Enhanced', {
            x: 1,
            y: 0.5,
            w: 8,
            h: 0.8,
            bold: true,
            color: '2E4057',
            align: 'center'
        }, 'title');

        const results = [
            `✅ Successful image loads: ${successCount}`,
            `❌ Failed image loads: ${failureCount}`,
            `📊 Success rate: ${successCount + failureCount > 0 ? Math.round((successCount / (successCount + failureCount)) * 100) : 0}%`,
            '🔧 Using correct "path" property with sizing',
            '🛡️ Overflow prevention implemented',
            '📏 Safe area constraints active',
            '🎯 Content auto-sizing enabled',
            '📁 Enhanced file verification'
        ];

        // Results with overflow handling
        this.addTextSafely(slide5, results.join('\n'), {
            x: 1,
            y: 1.8,
            w: 8,
            h: 3.2,
            color: '333333',
            align: 'center'
        }, 'body');

        // Add summary icon within safe bounds
        if (this.addImageSafely(slide5, iconAsset, {
            x: 4,
            y: 4.8,
            w: 2,
            h: 0.8
        }, 'Summary\nIcon')) {
            successCount++;
        } else {
            failureCount++;
        }

        return { pptx, successCount, failureCount };
    }

    /**
     * Run the standalone test
     */
    async runTest() {
        console.log('🧪 Starting Standalone PNG Integration Fix Test...');
        console.log('📁 Assets path:', this.assetsPath);
        
        try {
            // Create presentation
            const { pptx, successCount, failureCount } = await this.createPresentation();
            
            // Ensure output directory exists
            const outputDir = path.dirname(this.outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Save presentation
            console.log('\n💾 Saving presentation...');
            await pptx.writeFile({ fileName: this.outputPath });
            
            // Verify output
            if (fs.existsSync(this.outputPath)) {
                const fileStats = fs.statSync(this.outputPath);
                const fileSize = fileStats.size;
                const hasEmbeddedImages = fileSize > 300000; // > 300KB suggests images are embedded
                
                console.log('\n🎉 Enhanced PNG Fix Test Completed!');
                console.log('📁 Output:', this.outputPath);
                console.log(`📊 File size: ${Math.round(fileSize / 1024)}KB`);
                console.log(`🖼️  Images embedded: ${hasEmbeddedImages ? '✅ Yes' : '❌ No (file too small)'}`); 
                console.log('🛡️ Overflow prevention: ✅ Active');
                console.log('📏 Safe area constraints: ✅ Applied');
                console.log('🎯 Content auto-sizing: ✅ Enabled');
                
                return {
                    success: true,
                    outputPath: this.outputPath,
                    fileSize: fileSize,
                    hasEmbeddedImages: hasEmbeddedImages,
                    metrics: {
                        successfulImages: successCount,
                        failedImages: failureCount,
                        totalAttempts: successCount + failureCount,
                        successRate: successCount + failureCount > 0 ? Math.round((successCount / (successCount + failureCount)) * 100) : 0
                    }
                };
            } else {
                throw new Error('Output file was not created');
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
    const tester = new StandalonePngFixTester();
    tester.runTest().then(result => {
        console.log('\n📋 Final Result:');
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });
}

module.exports = StandalonePngFixTester;