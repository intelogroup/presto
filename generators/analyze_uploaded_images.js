const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Configuration
const IMAGE_SERVER_URL = 'http://localhost:3000';
const UPLOADS_DIR = './profesional blanco';

// Function to analyze uploaded images
async function analyzeUploadedImage(filename) {
    try {
        console.log(`\n=== Analyzing uploaded image: ${filename} ===`);

        const imagePath = path.join(UPLOADS_DIR, filename);
        
        if (!fs.existsSync(imagePath)) {
            console.log(`❌ Image file not found: ${imagePath}`);
            return null;
        }

        console.log('🤖 Sending to vision analysis...');

        const response = await axios.post(`${IMAGE_SERVER_URL}/analyze-image`, {
            filename: filename
        });

        if (response.data && response.data.success) {
            const analysis = response.data;
            console.log('✅ Analysis successful!');
            
            let powerPointDescription;
            try {
                // The analysis from the server is a stringified JSON.
                // It might be wrapped in ```json ... ```
                let analysisText = analysis.analysis;
                if (analysisText.startsWith('```json')) {
                    analysisText = analysisText.substring(7, analysisText.length - 3).trim();
                }
                powerPointDescription = JSON.parse(analysisText);
            } catch (e) {
                console.error(`Could not parse analysis JSON for ${filename}: ${e.message}`);
                powerPointDescription = { error: "Failed to parse AI analysis as JSON.", details: analysis.analysis };
            }
            
            return {
                filename: filename,
                ai_analysis: analysis,
                powerpoint_description: powerPointDescription,
                timestamp: new Date().toISOString()
            };
        } else {
            throw new Error('Invalid analysis response');
        }
    } catch (error) {
        console.log(`❌ Error analyzing ${filename}:`, error.response ? error.response.data : error.message);
        return null;
    }
}

// Main function to analyze all uploaded images
async function analyzeAllUploadedImages() {
    console.log('🚀 Starting analysis of uploaded images...\n');

    // Get list of uploaded images
    const uploadedFiles = fs.readdirSync(UPLOADS_DIR)
        .filter(file => file.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i))
        .sort();

    console.log(`📊 Found ${uploadedFiles.length} uploaded images to analyze\n`);

    const results = [];
    const failed = [];

    for (const filename of uploadedFiles) {
        const result = await analyzeUploadedImage(filename);

        if (result) {
            results.push(result);
        } else {
            failed.push(filename);
        }

        // Add small delay to avoid API rate limits
        await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Save results
    const analysisResults = {
        total_analyzed: results.length,
        total_failed: failed.length,
        successful_analyses: results,
        failed_filenames: failed,
        timestamp: new Date().toISOString(),
        analysis_type: 'OpenAI GPT-4 Vision - Uploaded Images',
        powerpoint_ready: true
    };

    fs.writeFileSync(
        './uploaded_images_analysis.json',
        JSON.stringify(analysisResults, null, 2)
    );

    console.log('\n🎉 Analysis Complete!');
    console.log(`✅ ${results.length} images analyzed successfully`);
    if (failed.length > 0) {
        console.log(`❌ ${failed.length} images failed: ${failed.join(', ')}`);
    }
    console.log('💾 Results saved to: uploaded_images_analysis.json');

    // Print PowerPoint-ready summary
    console.log('\n📋 PowerPoint Descriptions Generated:');
    results.forEach((result, index) => {
        console.log(`\n${index + 1}. ${result.filename}`);
        if (result.powerpoint_description && !result.powerpoint_description.error) {
            console.log(`   Slide Type: ${result.powerpoint_description.slideType || 'N/A'}`);
            console.log(`   Layout: ${result.powerpoint_description.layout ? (result.powerpoint_description.layout.type || result.powerpoint_description.layout) : 'N/A'}`);
            
            // Handle colorPalette - it might be an array, object, or string
            let colorInfo = 'N/A';
            if (result.powerpoint_description.colorPalette) {
                if (Array.isArray(result.powerpoint_description.colorPalette)) {
                    colorInfo = result.powerpoint_description.colorPalette.map(c => c.color || c).join(', ');
                } else if (typeof result.powerpoint_description.colorPalette === 'object') {
                    colorInfo = Object.values(result.powerpoint_description.colorPalette).join(', ');
                } else {
                    colorInfo = result.powerpoint_description.colorPalette.toString();
                }
            }
            console.log(`   Colors: ${colorInfo}`);
        } else {
            console.log(`   Could not generate detailed description.`);
        }
    });

    return analysisResults;
}

// Run the analysis
if (require.main === module) {
    analyzeAllUploadedImages().catch(console.error);
}

module.exports = { analyzeUploadedImage, analyzeAllUploadedImages };