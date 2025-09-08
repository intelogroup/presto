#!/usr/bin/env node

/**
 * Multi-Source SVG Icon Downloader
 * Downloads icons from popular open-source libraries:
 * - Heroicons (300+ icons)
 * - Feather Icons (280+ icons) 
 * - Tabler Icons (4000+ icons)
 * - Bootstrap Icons (2000+ icons)
 * - Lucide Icons (1500+ icons)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

class IconDownloader {
    constructor() {
        this.outputDir = path.join(__dirname, 'assets-icons');
        this.catalogFile = path.join(__dirname, 'assets-icons', 'icon_catalog.json');
        
        // Icon sources with their GitHub raw URLs
        this.sources = {
            heroicons: {
                name: 'Heroicons',
                baseUrl: 'https://raw.githubusercontent.com/tailwindlabs/heroicons/master/src/24',
                categories: ['outline', 'solid'],
                license: 'MIT',
                description: 'Beautiful hand-crafted SVG icons by Tailwind CSS team',
                sampleIcons: [
                    'academic-cap', 'adjustments-horizontal', 'archive-box', 'arrow-down',
                    'arrow-left', 'arrow-right', 'arrow-up', 'at-symbol', 'bell', 'bookmark',
                    'calendar', 'camera', 'chart-bar', 'check', 'chevron-down', 'chevron-left',
                    'chevron-right', 'chevron-up', 'clock', 'cloud', 'cog', 'computer-desktop',
                    'document', 'envelope', 'eye', 'face-smile', 'folder', 'globe-alt',
                    'heart', 'home', 'information-circle', 'key', 'light-bulb', 'lock-closed',
                    'magnifying-glass', 'map', 'microphone', 'moon', 'musical-note', 'phone',
                    'photo', 'play', 'plus', 'printer', 'puzzle-piece', 'rocket-launch',
                    'shield-check', 'star', 'sun', 'trash', 'user', 'wifi'
                ]
            },
            feather: {
                name: 'Feather Icons',
                baseUrl: 'https://raw.githubusercontent.com/feathericons/feather/master/icons',
                categories: ['default'],
                license: 'MIT',
                description: 'Simply beautiful open source icons',
                sampleIcons: [
                    'activity', 'airplay', 'alert-circle', 'alert-octagon', 'alert-triangle',
                    'anchor', 'aperture', 'archive', 'arrow-down', 'arrow-left', 'arrow-right',
                    'arrow-up', 'at-sign', 'award', 'bar-chart', 'battery', 'bell', 'bluetooth',
                    'book', 'bookmark', 'box', 'briefcase', 'calendar', 'camera', 'cast',
                    'check', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up',
                    'circle', 'clipboard', 'clock', 'cloud', 'code', 'command', 'compass',
                    'copy', 'corner-down-left', 'cpu', 'credit-card', 'crop', 'crosshair',
                    'database', 'delete', 'disc', 'download', 'edit', 'external-link',
                    'eye', 'facebook', 'file', 'film', 'filter', 'flag', 'folder',
                    'gift', 'git-branch', 'globe', 'grid', 'hard-drive', 'hash', 'headphones',
                    'heart', 'help-circle', 'home', 'image', 'inbox', 'info', 'instagram'
                ]
            },
            tabler: {
                name: 'Tabler Icons',
                baseUrl: 'https://raw.githubusercontent.com/tabler/tabler-icons/master/icons',
                categories: ['default'],
                license: 'MIT',
                description: 'Over 4000+ free SVG icons for web development',
                sampleIcons: [
                    'adjustments', 'alarm', 'alert-circle', 'alert-triangle', 'anchor',
                    'aperture', 'apps', 'archive', 'arrow-down', 'arrow-left', 'arrow-right',
                    'arrow-up', 'at', 'atom', 'award', 'backspace', 'badge', 'ball-basketball',
                    'bandage', 'barcode', 'battery', 'beach', 'bell', 'bike', 'bluetooth',
                    'bold', 'book', 'bookmark', 'briefcase', 'brush', 'bucket', 'bug',
                    'building', 'bulb', 'calculator', 'calendar', 'camera', 'candle',
                    'car', 'cards', 'cash', 'cast', 'certificate', 'chart-area', 'chart-bar',
                    'chart-line', 'chart-pie', 'check', 'chevron-down', 'chevron-left',
                    'chevron-right', 'chevron-up', 'circle', 'clipboard', 'clock', 'cloud',
                    'code', 'coin', 'color-swatch', 'command', 'compass', 'copy', 'cpu'
                ]
            },
            bootstrap: {
                name: 'Bootstrap Icons',
                baseUrl: 'https://raw.githubusercontent.com/twbs/icons/main/icons',
                categories: ['default'],
                license: 'MIT',
                description: 'Official open source SVG icon library for Bootstrap',
                sampleIcons: [
                    'alarm', 'alert-circle', 'alert-triangle', 'archive', 'arrow-down',
                    'arrow-left', 'arrow-right', 'arrow-up', 'at', 'award', 'bag', 'bar-chart',
                    'battery', 'bell', 'bookmark', 'box', 'briefcase', 'bug', 'building',
                    'calculator', 'calendar', 'camera', 'card-checklist', 'cart', 'cash',
                    'chat', 'check', 'chevron-down', 'chevron-left', 'chevron-right',
                    'chevron-up', 'circle', 'clipboard', 'clock', 'cloud', 'code-slash',
                    'collection', 'compass', 'cpu', 'credit-card', 'cup', 'cursor',
                    'dash', 'diagram-2', 'diamond', 'disc', 'display', 'download',
                    'droplet', 'easel', 'egg', 'envelope', 'exclamation-triangle',
                    'eye', 'file-earmark', 'film', 'filter', 'flag', 'folder',
                    'gear', 'gem', 'gift', 'globe', 'graph-up', 'grid', 'hammer'
                ]
            },
            lucide: {
                name: 'Lucide Icons',
                baseUrl: 'https://raw.githubusercontent.com/lucide-icons/lucide/main/icons',
                categories: ['default'],
                license: 'ISC',
                description: 'Beautiful & consistent icon toolkit made by the community',
                sampleIcons: [
                    'activity', 'airplay', 'alert-circle', 'alert-octagon', 'alert-triangle',
                    'align-center', 'anchor', 'aperture', 'archive', 'arrow-down', 'arrow-left',
                    'arrow-right', 'arrow-up', 'at-sign', 'award', 'bar-chart', 'battery',
                    'bell', 'bluetooth', 'bold', 'book', 'bookmark', 'box', 'briefcase',
                    'calendar', 'camera', 'cast', 'check', 'chevron-down', 'chevron-left',
                    'chevron-right', 'chevron-up', 'circle', 'clipboard', 'clock', 'cloud',
                    'code', 'command', 'compass', 'copy', 'cpu', 'credit-card', 'crop',
                    'database', 'delete', 'disc', 'download', 'edit', 'external-link',
                    'eye', 'file', 'film', 'filter', 'flag', 'folder', 'gift',
                    'globe', 'grid', 'hard-drive', 'hash', 'headphones', 'heart',
                    'help-circle', 'home', 'image', 'inbox', 'info'
                ]
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
        
        // Create source subdirectories
        Object.keys(this.sources).forEach(source => {
            const sourceDir = path.join(this.outputDir, source);
            if (!fs.existsSync(sourceDir)) {
                fs.mkdirSync(sourceDir, { recursive: true });
            }
            
            // Create category subdirectories
            this.sources[source].categories.forEach(category => {
                const categoryDir = path.join(sourceDir, category);
                if (!fs.existsSync(categoryDir)) {
                    fs.mkdirSync(categoryDir, { recursive: true });
                }
            });
        });
    }

    /**
     * Download SVG icon from URL
     */
    async downloadIcon(url, filename, source, category) {
        return new Promise((resolve, reject) => {
            const protocol = url.startsWith('https:') ? https : http;
            const categoryDir = path.join(this.outputDir, source, category);
            const filePath = path.join(categoryDir, filename);
            
            protocol.get(url, (response) => {
                if (response.statusCode === 200) {
                    const file = fs.createWriteStream(filePath);
                    response.pipe(file);
                    
                    file.on('finish', () => {
                        file.close();
                        console.log(`✅ Downloaded: ${source}/${category}/${filename}`);
                        resolve({ success: true, path: filePath, filename, source, category });
                    });
                    
                    file.on('error', (err) => {
                        fs.unlink(filePath, () => {});
                        reject(err);
                    });
                } else if (response.statusCode === 404) {
                    resolve({ success: false, error: 'Not found', filename, source, category });
                } else {
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                }
            }).on('error', reject);
        });
    }

    /**
     * Download icons from a specific source
     */
    async downloadFromSource(sourceName, iconLimit = 20) {
        const source = this.sources[sourceName];
        if (!source) {
            console.error(`❌ Unknown source: ${sourceName}`);
            return [];
        }

        console.log(`\n📁 Downloading from ${source.name}...`);
        console.log(`📄 License: ${source.license}`);
        console.log(`📝 ${source.description}`);
        
        const results = [];
        const iconsToDownload = source.sampleIcons.slice(0, iconLimit);
        
        for (const category of source.categories) {
            console.log(`\n📂 Category: ${category}`);
            
            for (const iconName of iconsToDownload) {
                const filename = `${iconName}.svg`;
                const url = `${source.baseUrl}/${category}/${filename}`;
                
                try {
                    const result = await this.downloadIcon(url, filename, sourceName, category);
                    
                    if (result.success) {
                        results.push(result);
                        
                        // Add to catalog
                        this.downloadedCatalog.files.push({
                            filename: result.filename,
                            source: sourceName,
                            category: category,
                            path: result.path,
                            iconName: iconName,
                            downloadedAt: new Date().toISOString()
                        });
                        
                        this.downloadedCatalog.totalDownloaded++;
                        
                        if (!this.downloadedCatalog.sources[sourceName]) {
                            this.downloadedCatalog.sources[sourceName] = 0;
                        }
                        this.downloadedCatalog.sources[sourceName]++;
                        
                        if (!this.downloadedCatalog.categories[category]) {
                            this.downloadedCatalog.categories[category] = 0;
                        }
                        this.downloadedCatalog.categories[category]++;
                    } else {
                        console.log(`⚠️ Skipped: ${result.filename} (${result.error})`);
                    }
                    
                } catch (error) {
                    console.error(`❌ Failed to download ${filename}:`, error.message);
                }
                
                // Rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        
        return results;
    }

    /**
     * Download sample icons from all sources
     */
    async downloadSamples(iconsPerSource = 15) {
        console.log('🚀 Starting multi-source icon downloads...');
        console.log(`📊 Downloading ${iconsPerSource} icons per source\n`);
        
        const allResults = [];
        
        for (const sourceName of Object.keys(this.sources)) {
            const results = await this.downloadFromSource(sourceName, iconsPerSource);
            allResults.push(...results);
        }
        
        // Save catalog
        this.saveCatalog();
        
        console.log(`\n✅ Download complete! ${allResults.length} SVG icons downloaded.`);
        console.log(`📁 Icons organized in: ${this.outputDir}`);
        
        return allResults;
    }

    /**
     * Download from specific source only
     */
    async downloadSpecificSource(sourceName, iconLimit = 30) {
        if (!this.sources[sourceName]) {
            console.error(`❌ Unknown source: ${sourceName}`);
            console.log(`Available sources: ${Object.keys(this.sources).join(', ')}`);
            return [];
        }
        
        const results = await this.downloadFromSource(sourceName, iconLimit);
        this.saveCatalog();
        
        console.log(`\n✅ Downloaded ${results.length} icons from ${this.sources[sourceName].name}`);
        return results;
    }

    /**
     * Save download catalog
     */
    saveCatalog() {
        fs.writeFileSync(this.catalogFile, JSON.stringify(this.downloadedCatalog, null, 2));
        console.log(`📋 Catalog updated: ${this.catalogFile}`);
    }

    /**
     * Display available sources and usage
     */
    displayInfo() {
        console.log('\n🎨 Multi-Source SVG Icon Downloader');
        console.log('=====================================');
        
        console.log('\n📚 Available Icon Libraries:');
        Object.entries(this.sources).forEach(([key, source]) => {
            console.log(`\n• ${source.name} (${key})`);
            console.log(`  📄 License: ${source.license}`);
            console.log(`  📝 ${source.description}`);
            console.log(`  🔢 Sample icons: ${source.sampleIcons.length}`);
        });
        
        console.log('\n🚀 Usage Examples:');
        console.log('• --samples: Download samples from all sources (15 icons each)');
        console.log('• --source heroicons: Download from Heroicons only');
        console.log('• --source feather: Download from Feather Icons only');
        console.log('• --source tabler: Download from Tabler Icons only');
        console.log('• --source bootstrap: Download from Bootstrap Icons only');
        console.log('• --source lucide: Download from Lucide Icons only');
        console.log('• --help: Show this information');
        
        console.log('\n📁 Output Structure:');
        console.log('assets-icons/');
        console.log('├── heroicons/');
        console.log('│   ├── outline/');
        console.log('│   └── solid/');
        console.log('├── feather/');
        console.log('├── tabler/');
        console.log('├── bootstrap/');
        console.log('├── lucide/');
        console.log('└── icon_catalog.json');
        
        console.log('\n💡 All icons are:');
        console.log('• Open source and free to use');
        console.log('• SVG format for perfect scaling');
        console.log('• Organized by source and category');
        console.log('• Cataloged with metadata');
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    const downloader = new IconDownloader();
    
    if (args.includes('--samples')) {
        downloader.downloadSamples();
    } else if (args.includes('--source')) {
        const sourceIndex = args.indexOf('--source');
        const sourceName = args[sourceIndex + 1];
        if (sourceName) {
            downloader.downloadSpecificSource(sourceName);
        } else {
            console.error('❌ Please specify a source name after --source');
            downloader.displayInfo();
        }
    } else if (args.includes('--help')) {
        downloader.displayInfo();
    } else {
        downloader.displayInfo();
    }
}

module.exports = IconDownloader;