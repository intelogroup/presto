#!/usr/bin/env node

/**
 * Pexels API SVG Generator
 * Downloads high-quality images from Pexels and converts them to SVG format
 * Requires Pexels API key for access
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class PexelsSVGDownloader {
    constructor(apiKey = null) {
        this.apiKey = apiKey || process.env.PEXELS_API_KEY;
        this.outputDir = path.join(__dirname, 'assets-vector', 'pexels-generated');
        this.catalogFile = path.join(__dirname, 'assets-vector', 'pexels_catalog.json');
        
        // Pexels API endpoints
        this.baseUrl = 'https://api.pexels.com/v1';
        this.searchEndpoint = '/search';
        
        // Categories for business presentations
        this.categories = {
            business: ['business meeting', 'office', 'teamwork', 'presentation', 'analytics'],
            technology: ['computer', 'coding', 'artificial intelligence', 'robot', 'server'],
            education: ['learning', 'books', 'graduation', 'classroom', 'study'],
            healthcare: ['medical', 'laboratory', 'research', 'science', 'health'],
            abstract: ['geometric', 'pattern', 'minimal', 'abstract art', 'design']
        };
        
        this.downloadedCatalog = {
            totalDownloaded: 0,
            categories: {},
            files: []
        };
        
        this.ensureDirectories();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.outputDir)) {
            fs.mkdirSync(this.outputDir, { recursive: true });
        }
        
        // Create category subdirectories
        Object.keys(this.categories).forEach(category => {
            const categoryDir = path.join(this.outputDir, category);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }
        });
    }

    /**
     * Search Pexels for images
     */
    async searchPexels(query, perPage = 5) {
        if (!this.apiKey) {
            throw new Error('Pexels API key is required. Set PEXELS_API_KEY environment variable or pass it to constructor.');
        }

        return new Promise((resolve, reject) => {
            const url = `${this.baseUrl}${this.searchEndpoint}?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`;
            
            const options = {
                headers: {
                    'Authorization': this.apiKey
                }
            };

            https.get(url, options, (response) => {
                let data = '';
                
                response.on('data', (chunk) => {
                    data += chunk;
                });
                
                response.on('end', () => {
                    try {
                        const result = JSON.parse(data);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                });
            }).on('error', reject);
        });
    }

    /**
     * Download image from URL
     */
    async downloadImage(url, filename, category) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https:') ? https : http;
            const categoryDir = path.join(this.outputDir, category);
            const filePath = path.join(categoryDir, filename);
            
            protocol.get(url, (response) => {
                if (response.statusCode === 200) {
                    const file = fs.createWriteStream(filePath);
                    response.pipe(file);
                    
                    file.on('finish', () => {
                        file.close();
                        console.log(`✅ Downloaded: ${filename}`);
                        resolve({ success: true, path: filePath, filename, category });
                    });
                    
                    file.on('error', (err) => {
                        fs.unlink(filePath, () => {});
                        reject(err);
                    });
                } else {
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                }
            }).on('error', reject);
        });
    }

    /**
     * Convert image to SVG format (creates SVG wrapper)
     */
    createSVGFromImage(imagePath, outputPath, width = 800, height = 600) {
        const imageData = fs.readFileSync(imagePath, 'base64');
        const imageExt = path.extname(imagePath).toLowerCase();
        const mimeType = imageExt === '.jpg' || imageExt === '.jpeg' ? 'image/jpeg' : 'image/png';
        
        const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <style>
      .image-container { width: 100%; height: 100%; }
    </style>
  </defs>
  <image class="image-container" 
         href="data:${mimeType};base64,${imageData}" 
         x="0" y="0" width="${width}" height="${height}" 
         preserveAspectRatio="xMidYMid slice"/>
</svg>`;
        
        fs.writeFileSync(outputPath, svgContent);
        return outputPath;
    }

    /**
     * Download images for a specific category
     */
    async downloadCategoryImages(category, queries, imagesPerQuery = 2) {
        console.log(`\n📁 Downloading ${category} images...`);
        const results = [];
        
        for (const query of queries) {
            try {
                console.log(`🔍 Searching for: ${query}`);
                const searchResult = await this.searchPexels(query, imagesPerQuery);
                
                if (searchResult.photos && searchResult.photos.length > 0) {
                    for (let i = 0; i < Math.min(imagesPerQuery, searchResult.photos.length); i++) {
                        const photo = searchResult.photos[i];
                        const filename = `${query.replace(/\s+/g, '_')}_${photo.id}.jpg`;
                        const svgFilename = `${query.replace(/\s+/g, '_')}_${photo.id}.svg`;
                        
                        try {
                            // Download original image
                            const imageResult = await this.downloadImage(
                                photo.src.medium, 
                                filename, 
                                category
                            );
                            
                            // Convert to SVG
                            const svgPath = path.join(path.dirname(imageResult.path), svgFilename);
                            this.createSVGFromImage(imageResult.path, svgPath);
                            
                            // Remove original image file
                            fs.unlinkSync(imageResult.path);
                            
                            results.push({
                                ...imageResult,
                                filename: svgFilename,
                                path: svgPath,
                                originalUrl: photo.src.medium,
                                photographer: photo.photographer,
                                pexelsUrl: photo.url
                            });
                            
                            // Add to catalog
                            this.downloadedCatalog.files.push({
                                filename: svgFilename,
                                category: category,
                                query: query,
                                path: svgPath,
                                photographer: photo.photographer,
                                pexelsUrl: photo.url,
                                downloadedAt: new Date().toISOString()
                            });
                            
                            this.downloadedCatalog.totalDownloaded++;
                            
                            if (!this.downloadedCatalog.categories[category]) {
                                this.downloadedCatalog.categories[category] = 0;
                            }
                            this.downloadedCatalog.categories[category]++;
                            
                        } catch (error) {
                            console.error(`❌ Failed to download ${filename}:`, error.message);
                        }
                        
                        // Rate limiting
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } else {
                    console.log(`⚠️ No images found for: ${query}`);
                }
                
            } catch (error) {
                console.error(`❌ Search failed for ${query}:`, error.message);
            }
        }
        
        return results;
    }

    /**
     * Download sample images from all categories
     */
    async downloadSamples() {
        if (!this.apiKey) {
            console.log('❌ Pexels API key required!');
            console.log('\n🔑 To get started:');
            console.log('1. Visit: https://www.pexels.com/api/');
            console.log('2. Sign up for a free account');
            console.log('3. Get your API key');
            console.log('4. Set environment variable: set PEXELS_API_KEY=your_key_here');
            console.log('5. Or pass it to the constructor: new PexelsSVGDownloader("your_key")');
            return [];
        }

        console.log('🚀 Starting Pexels image downloads...');
        const allResults = [];
        
        for (const [category, queries] of Object.entries(this.categories)) {
            const results = await this.downloadCategoryImages(category, queries.slice(0, 2), 1);
            allResults.push(...results);
        }
        
        // Save catalog
        this.saveCatalog();
        
        console.log(`\n✅ Download complete! ${allResults.length} SVG files created from Pexels images.`);
        return allResults;
    }

    /**
     * Save download catalog
     */
    saveCatalog() {
        fs.writeFileSync(this.catalogFile, JSON.stringify(this.downloadedCatalog, null, 2));
        console.log(`📋 Catalog saved: ${this.catalogFile}`);
    }

    /**
     * Display usage instructions
     */
    displayInstructions() {
        console.log('\n📖 Pexels SVG Downloader Usage Instructions:');
        console.log('==========================================');
        console.log('\n🎯 Features:');
        console.log('• Downloads high-quality images from Pexels API');
        console.log('• Converts images to SVG format for scalability');
        console.log('• Organizes by categories (business, tech, education, etc.)');
        console.log('• Includes photographer attribution');
        console.log('• Free API with 200 requests/hour limit');
        
        console.log('\n🔑 Setup:');
        console.log('1. Get free API key: https://www.pexels.com/api/');
        console.log('2. Set environment variable: set PEXELS_API_KEY=your_key');
        console.log('3. Run: node pexels_svg_downloader.js --samples');
        
        console.log('\n🚀 Usage:');
        console.log('• --samples: Download sample images from all categories');
        console.log('• --help: Show this help message');
        
        console.log('\n📁 Output:');
        console.log('• Files saved to: assets-vector/pexels-generated/');
        console.log('• Organized by category subdirectories');
        console.log('• SVG format for perfect scaling in presentations');
        
        console.log('\n💡 Categories Available:');
        Object.entries(this.categories).forEach(([category, queries]) => {
            console.log(`• ${category}: ${queries.join(', ')}`);
        });
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const apiKey = process.env.PEXELS_API_KEY;
    const downloader = new PexelsSVGDownloader(apiKey);
    
    if (args.includes('--samples')) {
        downloader.downloadSamples();
    } else if (args.includes('--help')) {
        downloader.displayInstructions();
    } else {
        downloader.displayInstructions();
    }
}

module.exports = PexelsSVGDownloader;