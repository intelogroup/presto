#!/usr/bin/env node

/**
 * Modern SVG Illustration Downloader
 * Downloads high-quality SVG illustrations from top free sources
 * Compatible with Apify and Firecrawl for automated collection
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { URL } = require('url');

class SVGDownloader {
    constructor() {
        this.outputDir = path.join(__dirname, 'assets-vector', 'downloaded');
        this.catalogFile = path.join(__dirname, 'assets-vector', 'downloaded_catalog.json');
        
        // Top free SVG sources with direct download capabilities
        this.sources = {
            undraw: {
                name: 'unDraw',
                baseUrl: 'https://undraw.co',
                apiUrl: 'https://undraw.co/api/illustrations',
                type: 'api',
                license: 'MIT (No attribution required)',
                categories: ['business', 'technology', 'education', 'healthcare', 'finance']
            },
            svgrepo: {
                name: 'SVG Repo',
                baseUrl: 'https://www.svgrepo.com',
                searchUrl: 'https://www.svgrepo.com/vectors',
                type: 'scrape',
                license: 'Commercial friendly',
                categories: ['business', 'technology', 'medical', 'education', 'finance']
            },
            freesvg: {
                name: 'FreeSVG',
                baseUrl: 'https://freesvg.org',
                type: 'scrape',
                license: 'Creative Commons 0 (Public Domain)',
                categories: ['abstract', 'business', 'technology', 'nature', 'symbols']
            },
            vecteezy: {
                name: 'Vecteezy',
                baseUrl: 'https://www.vecteezy.com',
                searchUrl: 'https://www.vecteezy.com/free-vector/svg',
                type: 'scrape',
                license: 'Free License (Check individual files)',
                categories: ['business', 'technology', 'abstract', 'nature', 'people']
            }
        };
        
        this.downloadedCatalog = {
            totalDownloaded: 0,
            sources: {},
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
        const categories = ['business', 'technology', 'education', 'healthcare', 'abstract', 'people'];
        categories.forEach(category => {
            const categoryDir = path.join(this.outputDir, category);
            if (!fs.existsSync(categoryDir)) {
                fs.mkdirSync(categoryDir, { recursive: true });
            }
        });
    }

    /**
     * Download SVG file from URL
     */
    async downloadSVG(url, filename, category = 'general') {
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
     * Generate Apify scraper configuration for SVG sources
     */
    generateApifyConfig() {
        const apifyConfig = {
            name: 'svg-illustration-scraper',
            description: 'Scrapes modern SVG illustrations from top free sources',
            sources: [],
            extractionRules: {
                svgLinks: {
                    selector: 'a[href$=".svg"], a[download$=".svg"], .download-svg',
                    attribute: 'href'
                },
                downloadButtons: {
                    selector: '.download, .btn-download, [data-download]',
                    attribute: 'href'
                },
                svgImages: {
                    selector: 'img[src$=".svg"]',
                    attribute: 'src'
                }
            },
            filters: {
                minFileSize: 1024, // 1KB minimum
                maxFileSize: 1048576, // 1MB maximum
                allowedDomains: [
                    'undraw.co',
                    'svgrepo.com',
                    'freesvg.org',
                    'vecteezy.com'
                ]
            }
        };

        // Add source URLs
        Object.values(this.sources).forEach(source => {
            apifyConfig.sources.push({
                url: source.baseUrl,
                name: source.name,
                license: source.license,
                categories: source.categories
            });
        });

        return apifyConfig;
    }

    /**
     * Generate Firecrawl configuration for SVG scraping
     */
    generateFirecrawlConfig() {
        const firecrawlConfig = {
            crawlerOptions: {
                includes: ['**/*.svg', '**/download/**', '**/free/**'],
                excludes: ['**/premium/**', '**/paid/**'],
                limit: 100,
                allowBackwardCrawling: false,
                allowExternalContentLinks: false
            },
            pageOptions: {
                onlyMainContent: true,
                includeHtml: false,
                includeRawHtml: false,
                includeLinks: true
            },
            extractorOptions: {
                mode: 'llm-extraction',
                extractionPrompt: `Extract all SVG download links, file names, categories, and licensing information from this page. Focus on:
                1. Direct SVG download URLs
                2. File names and descriptions
                3. Category/tag information
                4. License/usage rights
                5. File size if available
                
                Return as JSON with structure:
                {
                    "svgFiles": [
                        {
                            "url": "direct download URL",
                            "filename": "suggested filename",
                            "category": "business/tech/etc",
                            "license": "license info",
                            "description": "brief description"
                        }
                    ]
                }`
            },
            sources: Object.values(this.sources).map(source => ({
                url: source.baseUrl,
                name: source.name,
                maxDepth: 2
            }))
        };

        return firecrawlConfig;
    }

    /**
     * Working SVG URLs from reliable sources
     */
    getSampleSVGUrls() {
        return {
            business: [
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/briefcase.svg',
                    filename: 'briefcase.svg',
                    source: 'Tabler Icons'
                },
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/chart-line.svg',
                    filename: 'chart_line.svg',
                    source: 'Tabler Icons'
                },
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/users.svg',
                    filename: 'team_users.svg',
                    source: 'Tabler Icons'
                }
            ],
            technology: [
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/code.svg',
                    filename: 'programming_code.svg',
                    source: 'Tabler Icons'
                },
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/server.svg',
                    filename: 'server.svg',
                    source: 'Tabler Icons'
                },
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/robot.svg',
                    filename: 'ai_robot.svg',
                    source: 'Tabler Icons'
                }
            ],
            education: [
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/book.svg',
                    filename: 'learning_book.svg',
                    source: 'Tabler Icons'
                },
                {
                    url: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons/school.svg',
                    filename: 'graduation_school.svg',
                    source: 'Tabler Icons'
                }
            ]
        };
    }

    /**
     * Download sample SVGs for immediate use
     */
    async downloadSamples() {
        console.log('🚀 Starting sample SVG downloads...');
        const samples = this.getSampleSVGUrls();
        const results = [];

        for (const [category, files] of Object.entries(samples)) {
            console.log(`\n📁 Downloading ${category} illustrations...`);
            
            for (const file of files) {
                try {
                    const result = await this.downloadSVG(file.url, file.filename, category);
                    results.push({
                        ...result,
                        source: file.source,
                        url: file.url
                    });
                    
                    // Add to catalog
                    this.downloadedCatalog.files.push({
                        filename: file.filename,
                        category: category,
                        source: file.source,
                        url: file.url,
                        path: result.path,
                        downloadedAt: new Date().toISOString()
                    });
                    
                    this.downloadedCatalog.totalDownloaded++;
                    
                    // Update category count
                    if (!this.downloadedCatalog.categories[category]) {
                        this.downloadedCatalog.categories[category] = 0;
                    }
                    this.downloadedCatalog.categories[category]++;
                    
                    // Update source count
                    if (!this.downloadedCatalog.sources[file.source]) {
                        this.downloadedCatalog.sources[file.source] = 0;
                    }
                    this.downloadedCatalog.sources[file.source]++;
                    
                } catch (error) {
                    console.error(`❌ Failed to download ${file.filename}:`, error.message);
                }
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Save catalog
        this.saveCatalog();
        
        console.log(`\n✅ Download complete! ${results.length} SVG files downloaded.`);
        return results;
    }

    /**
     * Save download catalog
     */
    saveCatalog() {
        fs.writeFileSync(this.catalogFile, JSON.stringify(this.downloadedCatalog, null, 2));
        console.log(`📋 Catalog saved: ${this.catalogFile}`);
    }

    /**
     * Generate automation scripts
     */
    generateAutomationScripts() {
        // Apify configuration
        const apifyConfigPath = path.join(__dirname, 'apify_svg_config.json');
        fs.writeFileSync(apifyConfigPath, JSON.stringify(this.generateApifyConfig(), null, 2));
        
        // Firecrawl configuration
        const firecrawlConfigPath = path.join(__dirname, 'firecrawl_svg_config.json');
        fs.writeFileSync(firecrawlConfigPath, JSON.stringify(this.generateFirecrawlConfig(), null, 2));
        
        console.log('🤖 Automation configurations generated:');
        console.log(`   - Apify: ${apifyConfigPath}`);
        console.log(`   - Firecrawl: ${firecrawlConfigPath}`);
    }

    /**
     * Display usage instructions
     */
    displayInstructions() {
        console.log('\n📖 SVG Downloader Usage Instructions:');
        console.log('=====================================');
        console.log('\n🎯 Best Free SVG Sources Found:');
        
        Object.values(this.sources).forEach(source => {
            console.log(`\n• ${source.name} (${source.baseUrl})`);
            console.log(`  License: ${source.license}`);
            console.log(`  Categories: ${source.categories.join(', ')}`);
        });
        
        console.log('\n🚀 Quick Start:');
        console.log('1. Run: node svg_downloader.js --samples');
        console.log('2. Check: assets-vector/downloaded/ for files');
        console.log('3. Use automation configs for bulk downloads');
        
        console.log('\n🤖 Automation Options:');
        console.log('• Apify: Use apify_svg_config.json for web scraping');
        console.log('• Firecrawl: Use firecrawl_svg_config.json for crawling');
        console.log('• Manual: Visit sources and download specific illustrations');
        
        console.log('\n💡 Recommended Workflow:');
        console.log('1. Start with sample downloads (immediate results)');
        console.log('2. Use unDraw.co for customizable illustrations');
        console.log('3. Use SVG Repo for specific icons and symbols');
        console.log('4. Use automation for bulk collection');
    }
}

// Main execution
if (require.main === module) {
    const downloader = new SVGDownloader();
    const args = process.argv.slice(2);
    
    if (args.includes('--samples')) {
        downloader.downloadSamples();
    } else if (args.includes('--config')) {
        downloader.generateAutomationScripts();
    } else {
        downloader.displayInstructions();
        downloader.generateAutomationScripts();
    }
}

module.exports = SVGDownloader;