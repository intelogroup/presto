#!/usr/bin/env node

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

/**
 * PNG Integration Test Script
 * Based on IMAGE_INTEGRATION_COMPLETE_GUIDE.md best practices
 */
class PngIntegrationTester {
    constructor() {
        this.pptx = new PptxGenJS();
        this.assetsPath = path.join(__dirname, 'assets-images-png', 'svgrepo-icons-graphics');
        this.outputPath = path.join(__dirname, 'output', 'png-integration-test.pptx');
        this.assets = {};
    }

    /**
     * Verify image exists and is readable
     * Critical function from the guide
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
     * Load available PNG assets with proper verification
     */
    loadAvailableAssets() {
        console.log('🔍 Loading PNG assets...');
        
        try {
            if (!fs.existsSync(this.assetsPath)) {
                console.error(`Assets directory not found: ${this.assetsPath}`);
                return [];
            }

            const files = fs.readdirSync(this.assetsPath)
                .filter(file => file.toLowerCase().endsWith('.png'))
                .map(file => path.join(this.assetsPath, file))
                .filter(filePath => this.verifyImageExists(filePath));

            console.log(`✅ Found ${files.length} valid PNG assets`);
            files.forEach((file, index) => {
                const fileName = path.basename(file);
                const fileSize = fs.statSync(file).size;
                console.log(`   ${index + 1}. ${fileName} (${Math.round(fileSize / 1024)}KB)`);
            });

            return files;
        } catch (error) {
            console.error('Failed to load assets:', error);
            return [];
        }
    }

    /**
     * Add image with comprehensive fallback (from guide)
     */
    addImageWithFallback(slide, imagePath, options, fallbackOptions = {}) {
        if (imagePath && this.verifyImageExists(imagePath)) {
            try {
                // ✅ CORRECT - Always use 'path' property for file-based images
                slide.addImage({ path: imagePath, ...options });
                console.log(`   ✅ Added image: ${path.basename(imagePath)}`);
                return true; // Success
            } catch (error) {
                console.warn(`   ❌ Failed to add image: ${path.basename(imagePath)}`, error.message);
            }
        } else {
            console.warn(`   ⚠️  Image not found or invalid: ${imagePath}`);
        }

        // Add fallback shape as per guide
        slide.addShape(this.pptx.ShapeType.rect, {
            fill: { color: 'F0F0F0' },
            line: { width: 1, color: 'DDDDDD' },
            ...options,
            ...fallbackOptions
        });

        // Add placeholder text
        slide.addText('Image Not Available', {
            x: options.x,
            y: options.y + (options.h / 2) - 0.25,
            w: options.w,
            h: 0.5,
            fontSize: 12,
            color: '666666',
            align: 'center'
        });

        return false; // Failed, used fallback
    }

    /**
     * Create title slide with PNG background
     */
    createTitleSlide(assets) {
        console.log('\n📄 Creating title slide...');
        const slide = this.pptx.addSlide();

        // Add title
        slide.addText('PNG Integration Test', {
            x: 1,
            y: 1,
            w: 8,
            h: 1.5,
            fontSize: 36,
            bold: true,
            color: '2E4057',
            align: 'center'
        });

        // Add subtitle
        slide.addText('Testing PNG Asset Integration with PptxGenJS', {
            x: 1,
            y: 2.5,
            w: 8,
            h: 0.8,
            fontSize: 18,
            color: '5A6C7D',
            align: 'center'
        });

        // Add background PNG if available
        if (assets.length > 0) {
            const backgroundImage = assets.find(asset => 
                path.basename(asset).includes('business') || 
                path.basename(asset).includes('technology')
            ) || assets[0];

            this.addImageWithFallback(slide, backgroundImage, {
                x: 7,
                y: 4,
                w: 2.5,
                h: 2.5
            });
        }
    }

    /**
     * Create content slide with multiple PNG images
     */
    createContentSlide(assets, slideNumber) {
        console.log(`\n📄 Creating content slide ${slideNumber}...`);
        const slide = this.pptx.addSlide();

        // Add slide title
        slide.addText(`PNG Assets Showcase - Slide ${slideNumber}`, {
            x: 0.5,
            y: 0.5,
            w: 9,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: '2E4057'
        });

        // Add multiple images in a grid
        const imagesPerSlide = 4;
        const startIndex = (slideNumber - 1) * imagesPerSlide;
        
        for (let i = 0; i < imagesPerSlide; i++) {
            const assetIndex = startIndex + i;
            if (assetIndex >= assets.length) break;

            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = 1 + (col * 4);
            const y = 2 + (row * 2.5);

            const imagePath = assets[assetIndex];
            const fileName = path.basename(imagePath, '.png');

            // Add image with proper error handling
            const success = this.addImageWithFallback(slide, imagePath, {
                x: x,
                y: y,
                w: 2.5,
                h: 2
            });

            // Add image label
            slide.addText(fileName, {
                x: x,
                y: y + 2.1,
                w: 2.5,
                h: 0.3,
                fontSize: 10,
                color: success ? '2E4057' : '999999',
                align: 'center'
            });
        }
    }

    /**
     * Create summary slide with asset statistics
     */
    createSummarySlide(assets, successCount, failureCount) {
        console.log('\n📄 Creating summary slide...');
        const slide = this.pptx.addSlide();

        // Add title
        slide.addText('PNG Integration Summary', {
            x: 1,
            y: 1,
            w: 8,
            h: 1,
            fontSize: 28,
            bold: true,
            color: '2E4057',
            align: 'center'
        });

        // Add statistics
        const stats = [
            `Total PNG assets found: ${assets.length}`,
            `Successfully loaded: ${successCount}`,
            `Failed to load: ${failureCount}`,
            `Success rate: ${assets.length > 0 ? Math.round((successCount / assets.length) * 100) : 0}%`,
            `Assets directory: ${this.assetsPath}`
        ];

        stats.forEach((stat, index) => {
            slide.addText(stat, {
                x: 1.5,
                y: 2.5 + (index * 0.6),
                w: 7,
                h: 0.5,
                fontSize: 16,
                color: '5A6C7D'
            });
        });

        // Add a sample image if available
        if (assets.length > 0) {
            const sampleImage = assets[Math.floor(assets.length / 2)];
            this.addImageWithFallback(slide, sampleImage, {
                x: 7,
                y: 2.5,
                w: 2,
                h: 2
            });
        }
    }

    /**
     * Run the complete PNG integration test
     */
    async runTest() {
        console.log('🧪 Starting PNG Integration Test...');
        console.log('📁 Assets path:', this.assetsPath);
        
        try {
            // Load assets
            const assets = this.loadAvailableAssets();
            
            if (assets.length === 0) {
                console.error('❌ No PNG assets found. Test cannot proceed.');
                return { success: false, error: 'No assets found' };
            }

            // Set presentation properties
            this.pptx.author = 'PNG Integration Tester';
            this.pptx.company = 'Presto Dynamic System';
            this.pptx.title = 'PNG Asset Integration Test';
            this.pptx.subject = 'Testing PNG image integration with PptxGenJS';

            let successCount = 0;
            let failureCount = 0;

            // Create title slide
            this.createTitleSlide(assets);

            // Create content slides (4 images per slide)
            const slidesNeeded = Math.ceil(assets.length / 4);
            for (let i = 1; i <= Math.min(slidesNeeded, 5); i++) { // Limit to 5 content slides
                this.createContentSlide(assets, i);
            }

            // Test each asset and count successes/failures
            console.log('\n🔍 Verifying all assets...');
            assets.forEach((asset, index) => {
                if (this.verifyImageExists(asset)) {
                    successCount++;
                } else {
                    failureCount++;
                    console.warn(`   ❌ Asset ${index + 1} failed verification: ${path.basename(asset)}`);
                }
            });

            // Create summary slide
            this.createSummarySlide(assets, successCount, failureCount);

            // Save presentation
            console.log('\n💾 Saving presentation...');
            
            // Ensure output directory exists
            const outputDir = path.dirname(this.outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            await this.pptx.writeFile({ fileName: this.outputPath });
            
            console.log('\n🎉 PNG Integration Test Completed Successfully!');
            console.log('📁 Output:', this.outputPath);
            
            const fileStats = fs.statSync(this.outputPath);
            console.log(`📊 File size: ${Math.round(fileStats.size / 1024)}KB`);
            
            return {
                success: true,
                outputPath: this.outputPath,
                metrics: {
                    totalAssets: assets.length,
                    successfulAssets: successCount,
                    failedAssets: failureCount,
                    successRate: assets.length > 0 ? Math.round((successCount / assets.length) * 100) : 0,
                    slidesGenerated: 2 + Math.min(Math.ceil(assets.length / 4), 5),
                    fileSize: fileStats.size
                }
            };

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
    const tester = new PngIntegrationTester();
    tester.runTest().then(result => {
        console.log('\n📋 Final Result:');
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });
}

module.exports = PngIntegrationTester;