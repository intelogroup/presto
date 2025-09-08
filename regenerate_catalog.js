#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class CatalogGenerator {
    constructor() {
        this.iconsDir = path.join(__dirname, 'assets-icons');
        this.catalogPath = path.join(this.iconsDir, 'icon_catalog.json');
        this.icons = [];
        this.libraries = {};
    }

    async generateCatalog() {
        console.log('🔄 Regenerating icon catalog...');
        
        try {
            await this.scanDirectory(this.iconsDir);
            await this.saveCatalog();
            this.printSummary();
        } catch (error) {
            console.error('❌ Error generating catalog:', error.message);
        }
    }

    async scanDirectory(dir, library = null) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                // Skip if it's a catalog file or other non-library directory
                if (item === 'icon_catalog.json' || item.startsWith('.')) {
                    continue;
                }
                
                // Determine if this is a library directory or subdirectory
                const isLibraryRoot = path.dirname(fullPath) === this.iconsDir;
                const currentLibrary = isLibraryRoot ? item : library;
                
                await this.scanDirectory(fullPath, currentLibrary);
            } else if (item.endsWith('.svg')) {
                // This is an SVG file
                const relativePath = path.relative(this.iconsDir, fullPath);
                const iconName = path.basename(item, '.svg');
                const iconLibrary = library || 'unknown';
                
                this.icons.push({
                    name: iconName,
                    filename: item,
                    filepath: relativePath.replace(/\\/g, '/'), // Normalize path separators
                    library: iconLibrary,
                    fullPath: fullPath
                });
                
                // Count by library
                if (!this.libraries[iconLibrary]) {
                    this.libraries[iconLibrary] = 0;
                }
                this.libraries[iconLibrary]++;
            }
        }
    }

    async saveCatalog() {
        const catalog = {
            generated_at: new Date().toISOString(),
            total_icons: this.icons.length,
            libraries: this.libraries,
            icons: this.icons.map(icon => ({
                name: icon.name,
                filename: icon.filename,
                filepath: icon.filepath,
                library: icon.library
            }))
        };
        
        fs.writeFileSync(this.catalogPath, JSON.stringify(catalog, null, 2));
        console.log(`📋 Catalog saved to: ${this.catalogPath}`);
    }

    printSummary() {
        console.log('\n📊 Icon Catalog Summary:');
        console.log('=' .repeat(40));
        console.log(`Total Icons: ${this.icons.length}`);
        console.log('\nBy Library:');
        
        Object.entries(this.libraries)
            .sort(([,a], [,b]) => b - a)
            .forEach(([library, count]) => {
                console.log(`  ${library}: ${count} icons`);
            });
        
        console.log('\n✅ Catalog generation complete!');
        console.log('\n💡 Usage:');
        console.log('  - Open icon_browser.html to browse icons visually');
        console.log('  - Use icon_catalog.json for programmatic access');
        console.log('  - Icons are organized in assets-icons/ by library');
    }
}

// Run if called directly
if (require.main === module) {
    const generator = new CatalogGenerator();
    generator.generateCatalog();
}

module.exports = CatalogGenerator;