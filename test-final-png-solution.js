#!/usr/bin/env node

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

/**
 * Final PNG Integration Solution Test
 * Comprehensive implementation of all IMAGE_INTEGRATION_COMPLETE_GUIDE.md best practices
 * Uses larger PNG files to ensure proper embedding
 */
class FinalPngSolutionTester {
    constructor() {
        this.assetsPath = path.join(__dirname, 'assets-images-png', 'svgrepo-icons-graphics');
        this.outputPath = path.join(__dirname, 'output', 'final-png-solution.pptx');
        this.validAssets = [];
        this.loadedAssets = new Map();
    }

    /**
     * Comprehensive file verification (Critical from guide)
     */
    verifyImageFile(imagePath) {
        try {
            if (!fs.existsSync(imagePath)) {
                return { valid: false, reason: 'File does not exist' };
            }

            const stats = fs.statSync(imagePath);
            if (stats.size === 0) {
                return { valid: false, reason: 'File is empty' };
            }

            if (stats.size > 10 * 1024 * 1024) { // 10MB limit
                return { valid: false, reason: 'File too large (>10MB)' };
            }

            // Verify it's actually a PNG by checking file header
            const buffer = fs.readFileSync(imagePath, { start: 0, end: 8 });
            const pngSignature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
            
            if (!buffer.equals(pngSignature)) {
                return { valid: false, reason: 'Invalid PNG file format' };
            }

            return { 
                valid: true, 
                size: stats.size,
                sizeKB: Math.round(stats.size / 1024)
            };
        } catch (error) {
            return { valid: false, reason: error.message };
        }
    }

    /**
     * Load and validate all PNG assets with comprehensive error handling
     */
    loadAllAssets() {
        console.log('🔍 Loading and validating PNG assets...');
        
        try {
            if (!fs.existsSync(this.assetsPath)) {
                throw new Error(`Assets directory not found: ${this.assetsPath}`);
            }

            const files = fs.readdirSync(this.assetsPath)
                .filter(file => file.toLowerCase().endsWith('.png'))
                .map(file => path.join(this.assetsPath, file));

            console.log(`📁 Found ${files.length} PNG files, validating...`);

            let validCount = 0;
            let invalidCount = 0;

            for (const filePath of files) {
                const validation = this.verifyImageFile(filePath);
                const fileName = path.basename(filePath);

                if (validation.valid) {
                    this.validAssets.push({
                        path: filePath,
                        name: fileName,
                        size: validation.size,
                        sizeKB: validation.sizeKB
                    });
                    validCount++;
                    console.log(`   ✅ ${fileName} (${validation.sizeKB}KB)`);
                } else {
                    invalidCount++;
                    console.log(`   ❌ ${fileName} - ${validation.reason}`);
                }
            }

            // Sort by size (largest first) for better embedding
            this.validAssets.sort((a, b) => b.size - a.size);

            console.log(`\n📊 Validation Summary:`);
            console.log(`   ✅ Valid assets: ${validCount}`);
            console.log(`   ❌ Invalid assets: ${invalidCount}`);
            console.log(`   📈 Largest asset: ${this.validAssets[0]?.name} (${this.validAssets[0]?.sizeKB}KB)`);

            return this.validAssets.length > 0;

        } catch (error) {
            console.error('Failed to load assets:', error);
            return false;
        }
    }

    /**
     * Get specific asset by keywords with fallback chain
     */
    getAssetByKeywords(keywords, fallbackToLargest = true) {
        // Try exact keyword matches first
        for (const keyword of keywords) {
            const match = this.validAssets.find(asset => 
                asset.name.toLowerCase().includes(keyword.toLowerCase())
            );
            if (match) {
                console.log(`🎯 Found keyword match: ${match.name} for "${keyword}"`);
                return match;
            }
        }

        // Fallback to largest asset if requested
        if (fallbackToLargest && this.validAssets.length > 0) {
            console.log(`📁 Using largest asset as fallback: ${this.validAssets[0].name}`);
            return this.validAssets[0];
        }

        return null;
    }

    /**
     * Add image with comprehensive error handling and detailed logging
     */
    addImageWithFullErrorHandling(slide, asset, options, context = 'Unknown') {
        if (!asset) {
            console.warn(`   ⚠️  No asset provided for ${context}`);
            this.addFallbackPlaceholder(slide, options, `${context}\nNot Available`);
            return false;
        }

        try {
            // Final verification before adding
            const verification = this.verifyImageFile(asset.path);
            if (!verification.valid) {
                console.warn(`   ❌ Asset failed final verification: ${asset.name} - ${verification.reason}`);
                this.addFallbackPlaceholder(slide, options, `${context}\nInvalid`);
                return false;
            }

            // ✅ CRITICAL - Always use 'path' property for file-based images
            const imageOptions = {
                path: asset.path,
                ...options
            };

            slide.addImage(imageOptions);
            
            console.log(`   ✅ Successfully embedded: ${asset.name} (${asset.sizeKB}KB) for ${context}`);
            
            // Track successful loading
            this.loadedAssets.set(asset.path, {
                name: asset.name,
                size: asset.size,
                context: context,
                success: true
            });
            
            return true;

        } catch (error) {
            console.error(`   ❌ Failed to add ${asset.name} for ${context}:`, error.message);
            
            // Track failed loading
            this.loadedAssets.set(asset.path, {
                name: asset.name,
                size: asset.size,
                context: context,
                success: false,
                error: error.message
            });
            
            this.addFallbackPlaceholder(slide, options, `${context}\nLoad Failed`);
            return false;
        }
    }

    /**
     * Add fallback placeholder with proper styling
     */
    addFallbackPlaceholder(slide, options, text) {
        // Add styled rectangle
        slide.addShape(slide.pptx.ShapeType.rect, {
            fill: { color: 'F8F9FA' },
            line: { width: 2, color: 'DEE2E6', dashType: 'dash' },
            ...options
        });

        // Add placeholder text
        slide.addText(text, {
            x: options.x,
            y: options.y + (options.h / 2) - 0.3,
            w: options.w,
            h: 0.6,
            fontSize: 14,
            color: '6C757D',
            align: 'center',
            valign: 'middle',
            bold: true
        });
    }

    /**
     * Create comprehensive presentation with all PNG integration patterns
     */
    async createComprehensivePresentation() {
        console.log('\n🎨 Creating comprehensive PNG integration presentation...');
        
        const pptx = new PptxGenJS();
        
        // Set presentation metadata
        pptx.author = 'Final PNG Solution Tester';
        pptx.company = 'Presto Dynamic System';
        pptx.title = 'Final PNG Integration Solution';
        pptx.subject = 'Comprehensive PNG asset integration with all best practices';
        pptx.category = 'Testing';

        let successCount = 0;
        let failureCount = 0;

        // Get diverse assets for testing
        const medicalAsset = this.getAssetByKeywords(['medical', 'examination']);
        const businessAsset = this.getAssetByKeywords(['business', 'woman', 'shaking']);
        const businessTalkingAsset = this.getAssetByKeywords(['business', 'talking', 'remotely']);
        const businessExplainAsset = this.getAssetByKeywords(['business', 'explain', 'right']);
        const businessHeadsetAsset = this.getAssetByKeywords(['business', 'headset']);

        console.log('\n📄 Creating slides with comprehensive PNG integration...');

        // Slide 1: Title with large background image
        console.log('\n1️⃣ Creating title slide with background...');
        const slide1 = pptx.addSlide();
        
        slide1.addText('Final PNG Integration Solution', {
            x: 1,
            y: 1,
            w: 8,
            h: 1.2,
            fontSize: 32,
            bold: true,
            color: '1F2937',
            align: 'center',
            shadow: { type: 'outer', blur: 3, offset: 2, angle: 45, color: '00000040' }
        });

        slide1.addText('Comprehensive PNG Asset Integration Test', {
            x: 1,
            y: 2.5,
            w: 8,
            h: 0.8,
            fontSize: 18,
            color: '4B5563',
            align: 'center'
        });

        // Large background image
        if (this.addImageWithFullErrorHandling(slide1, medicalAsset, {
            x: 6.5,
            y: 3.5,
            w: 3,
            h: 3
        }, 'Title Background')) {
            successCount++;
        } else {
            failureCount++;
        }

        // Slide 2: Business presentation with multiple images
        console.log('\n2️⃣ Creating business slide with multiple images...');
        const slide2 = pptx.addSlide();
        
        slide2.addText('Business Solutions Portfolio', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.8,
            fontSize: 26,
            bold: true,
            color: '1F2937'
        });

        const businessPoints = [
            '• Strategic partnership development',
            '• Remote collaboration solutions', 
            '• Professional consultation services',
            '• Technology-enabled communication'
        ];

        slide2.addText(businessPoints.join('\n'), {
            x: 0.5,
            y: 1.3,
            w: 4.5,
            h: 3,
            fontSize: 16,
            color: '374151',
            lineSpacing: 24
        });

        // Main business image
        if (this.addImageWithFullErrorHandling(slide2, businessAsset, {
            x: 5.5,
            y: 1.5,
            w: 3.5,
            h: 2.8
        }, 'Main Business Image')) {
            successCount++;
        } else {
            failureCount++;
        }

        // Secondary business image
        if (this.addImageWithFullErrorHandling(slide2, businessTalkingAsset, {
            x: 0.5,
            y: 4.8,
            w: 2.5,
            h: 2
        }, 'Secondary Business Image')) {
            successCount++;
        } else {
            failureCount++;
        }

        // Slide 3: Communication focus with detailed images
        console.log('\n3️⃣ Creating communication slide...');
        const slide3 = pptx.addSlide();
        
        slide3.addText('Professional Communication', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.8,
            fontSize: 26,
            bold: true,
            color: '1F2937'
        });

        // Communication content
        const commContent = [
            '• Expert guidance and consultation',
            '• Advanced headset technology',
            '• Clear communication protocols',
            '• Professional presentation skills'
        ];

        slide3.addText(commContent.join('\n'), {
            x: 0.5,
            y: 1.5,
            w: 4,
            h: 2.5,
            fontSize: 16,
            color: '374151',
            lineSpacing: 24
        });

        // Explanation image
        if (this.addImageWithFullErrorHandling(slide3, businessExplainAsset, {
            x: 5,
            y: 1.5,
            w: 2.5,
            h: 2
        }, 'Explanation Image')) {
            successCount++;
        } else {
            failureCount++;
        }

        // Headset image
        if (this.addImageWithFullErrorHandling(slide3, businessHeadsetAsset, {
            x: 5,
            y: 4,
            w: 2.5,
            h: 2
        }, 'Headset Technology Image')) {
            successCount++;
        } else {
            failureCount++;
        }

        // Slide 4: Technical summary with asset statistics
        console.log('\n4️⃣ Creating technical summary slide...');
        const slide4 = pptx.addSlide();
        
        slide4.addText('PNG Integration Results', {
            x: 1,
            y: 0.5,
            w: 8,
            h: 0.8,
            fontSize: 26,
            bold: true,
            color: '1F2937',
            align: 'center'
        });

        const totalAttempts = successCount + failureCount;
        const successRate = totalAttempts > 0 ? Math.round((successCount / totalAttempts) * 100) : 0;
        
        const results = [
            `📊 Total PNG assets available: ${this.validAssets.length}`,
            `✅ Successful image embeddings: ${successCount}`,
            `❌ Failed image embeddings: ${failureCount}`,
            `📈 Success rate: ${successRate}%`,
            `💾 Total asset size: ${Math.round(this.validAssets.reduce((sum, asset) => sum + asset.size, 0) / 1024)}KB`,
            `🔧 Using 'path' property correctly: ✅`,
            `🛡️ Comprehensive error handling: ✅`,
            `📁 File verification implemented: ✅`
        ];

        slide4.addText(results.join('\n'), {
            x: 1,
            y: 1.8,
            w: 8,
            h: 4,
            fontSize: 16,
            color: '374151',
            align: 'left',
            lineSpacing: 28
        });

        // Add final summary image
        const summaryAsset = this.validAssets[Math.floor(this.validAssets.length / 2)];
        if (this.addImageWithFullErrorHandling(slide4, summaryAsset, {
            x: 7,
            y: 5.5,
            w: 2,
            h: 1.5
        }, 'Summary Asset')) {
            successCount++;
        } else {
            failureCount++;
        }

        return { pptx, successCount, failureCount, totalAttempts: successCount + failureCount };
    }

    /**
     * Run the comprehensive final test
     */
    async runTest() {
        console.log('🧪 Starting Final PNG Integration Solution Test...');
        console.log('📁 Assets path:', this.assetsPath);
        
        try {
            // Load and validate all assets
            if (!this.loadAllAssets()) {
                throw new Error('Failed to load any valid PNG assets');
            }

            // Create comprehensive presentation
            const { pptx, successCount, failureCount, totalAttempts } = await this.createComprehensivePresentation();
            
            // Ensure output directory exists
            const outputDir = path.dirname(this.outputPath);
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Save presentation with detailed logging
            console.log('\n💾 Saving comprehensive presentation...');
            await pptx.writeFile({ fileName: this.outputPath });
            
            // Comprehensive result analysis
            if (fs.existsSync(this.outputPath)) {
                const fileStats = fs.statSync(this.outputPath);
                const fileSize = fileStats.size;
                const fileSizeKB = Math.round(fileSize / 1024);
                
                // Calculate expected minimum size based on embedded assets
                const successfulAssets = Array.from(this.loadedAssets.values()).filter(asset => asset.success);
                const totalAssetSize = successfulAssets.reduce((sum, asset) => sum + asset.size, 0);
                const expectedMinSize = totalAssetSize * 0.7; // Account for compression
                
                const hasProperEmbedding = fileSize > expectedMinSize;
                
                console.log('\n🎉 Final PNG Integration Solution Test Completed!');
                console.log('📁 Output:', this.outputPath);
                console.log(`📊 File size: ${fileSizeKB}KB`);
                console.log(`🖼️  Expected min size: ${Math.round(expectedMinSize / 1024)}KB`);
                console.log(`✅ Proper embedding: ${hasProperEmbedding ? 'YES' : 'NO'}`);
                
                // Detailed asset loading report
                console.log('\n📋 Asset Loading Report:');
                for (const [assetPath, info] of this.loadedAssets) {
                    const status = info.success ? '✅' : '❌';
                    console.log(`   ${status} ${info.name} (${Math.round(info.size / 1024)}KB) - ${info.context}`);
                    if (!info.success && info.error) {
                        console.log(`      Error: ${info.error}`);
                    }
                }
                
                return {
                    success: true,
                    outputPath: this.outputPath,
                    fileSize: fileSize,
                    fileSizeKB: fileSizeKB,
                    hasProperEmbedding: hasProperEmbedding,
                    metrics: {
                        totalAssetsAvailable: this.validAssets.length,
                        successfulEmbeddings: successCount,
                        failedEmbeddings: failureCount,
                        totalAttempts: totalAttempts,
                        successRate: totalAttempts > 0 ? Math.round((successCount / totalAttempts) * 100) : 0,
                        totalAssetSizeKB: Math.round(totalAssetSize / 1024),
                        expectedMinSizeKB: Math.round(expectedMinSize / 1024),
                        compressionRatio: totalAssetSize > 0 ? Math.round(((totalAssetSize - fileSize) / totalAssetSize) * 100) : 0
                    },
                    assetDetails: Array.from(this.loadedAssets.values())
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
    const tester = new FinalPngSolutionTester();
    tester.runTest().then(result => {
        console.log('\n📋 Final Comprehensive Result:');
        console.log(JSON.stringify(result, null, 2));
        process.exit(result.success ? 0 : 1);
    }).catch(error => {
        console.error('Unexpected error:', error);
        process.exit(1);
    });
}

module.exports = FinalPngSolutionTester;