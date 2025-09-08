/**
 * Pattern Discovery Engine for PPTXGenJS
 * Battle tests configurations and captures working patterns
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs').promises;
const path = require('path');

class PatternDiscoveryEngine {
    constructor() {
        this.discoveredPatterns = new Map();
        this.failurePatterns = new Map();
        this.successRates = new Map();
        this.libraryPath = path.join(__dirname, '..', 'template-library');
    }

    async initialize() {
        await this.ensureLibraryDirectories();
        console.log('🏗️  Pattern Discovery Engine initialized');
        console.log(`💾 Template library: ${this.libraryPath}`);
    }

    async ensureLibraryDirectories() {
        const dirs = [
            this.libraryPath,
            path.join(this.libraryPath, 'working-patterns'),
            path.join(this.libraryPath, 'tested-configurations'),
            path.join(this.libraryPath, 'failure-reports'),
            path.join(this.libraryPath, 'code-snippets')
        ];

        for (const dir of dirs) {
            await fs.mkdir(dir, { recursive: true });
        }
    }

    /**
     * Battle test a configuration pattern
     */
    async battleTestPattern(patternConfig, patternName = 'untitled') {
        const testId = `${patternName}-${Date.now()}`;

        try {
            console.log(`🧪 Testing pattern: ${patternName}`);

            const pptx = await this.generateWithConfig(patternConfig);
            const testFileName = `battle-test-${testId}.pptx`;
            await pptx.writeFile({ fileName: testFileName });

            // Success! Capture the pattern
            const capturedPattern = {
                name: patternName,
                config: patternConfig,
                generatedCode: this.generateSnippet(patternConfig, patternName),
                metadata: {
                    testId,
                    successRate: 1.0,
                    testedAt: new Date().toISOString(),
                    fileSize: 0 // Will be calculated
                }
            };

            await this.saveSuccessfulPattern(capturedPattern);
            this.updateSuccessRate(patternName, true);

            console.log(`✅ Pattern "${patternName}" works! Saved to library.`);
            return { success: true, pattern: capturedPattern };

        } catch (error) {
            console.log(`❌ Pattern "${patternName}" failed: ${error.message}`);

            const failureInfo = {
                patternName,
                config: patternConfig,
                error: error.message,
                errorStack: error.stack,
                testId,
                testedAt: new Date().toISOString()
            };

            await this.saveFailurePattern(failureInfo);
            this.updateSuccessRate(patternName, false);

            return { success: false, error: error.message };
        }
    }

    /**
     * Battle test multiple configuration variations
     */
    async battleTestVariations(configurations, baseName = 'variation') {
        const results = {
            total: configurations.length,
            successful: 0,
            failed: 0,
            patterns: [],
            failures: []
        };

        console.log(`🎯 Starting battle test: ${configurations.length} variations of "${baseName}"`);
        console.log('');

        for (let i = 0; i < configurations.length; i++) {
            const patternName = `${baseName}-${String(i + 1).padStart(3, '0')}`;
            const result = await this.battleTestPattern(configurations[i], patternName);

            if (result.success) {
                results.successful++;
                results.patterns.push(result.pattern);
            } else {
                results.failed++;
                results.failures.push({ config: i, error: result.error });
            }

            // Progress indicator
            const progress = Math.round((i + 1) / configurations.length * 100);
            console.log(`📊 Progress: ${progress}% (${results.successful} successful, ${results.failed} failed)`);
        }

        console.log('');
        console.log('🏁 Battle test completed:');
        console.log(`   ✅ Successful: ${results.successful}`);
        console.log(`   ❌ Failed: ${results.failed}`);
        console.log(`   📊 Success Rate: ${((results.successful / results.total) * 100).toFixed(1)}%`);

        // Save test summary
        await this.saveTestSummary(results, baseName);

        return results;
    }

    /**
     * Generate PPTX from configuration
     */
    async generateWithConfig(config) {
        const pptx = new PptxGenJS();

        // Apply presentation settings
        if (config.presentation) {
            if (config.presentation.layout) pptx.layout = config.presentation.layout;
            if (config.presentation.title) pptx.title = config.presentation.title;
            if (config.presentation.author) pptx.author = config.presentation.author;
        }

        // Generate slides
        if (config.slides) {
            for (const slideConfig of config.slides) {
                const slide = pptx.addSlide();

                // Apply background if specified
                if (slideConfig.background) {
                    slide.background = slideConfig.background;
                }

                // Add elements
                if (slideConfig.elements) {
                    for (const element of slideConfig.elements) {
                        this.addElementToSlide(slide, element);
                    }
                }
            }
        }

        return pptx;
    }

    /**
     * Add element to slide
     */
    addElementToSlide(slide, element) {
        if (element.type === 'text') {
            slide.addText(element.text, element.options);
        } else if (element.type === 'image') {
            slide.addImage(element.options);
        } else if (element.type === 'shape') {
            slide.addShape(element.shapeType, element.options);
        } else if (element.type === 'chart') {
            slide.addChart(element.chartType, element.options);
        }
    }

    /**
     * Generate working code snippet from config
     */
    generateSnippet(config, patternName) {
        let code = `// ${patternName} - Generated ${new Date().toISOString()}
// Auto-generated battle-tested pattern

const PptxGenJS = require('pptxgenjs');

function create${this.capitalizeName(patternName)}Presentation(data = {}) {
  const pptx = new PptxGenJS();

`;

        // Add presentation settings
        if (config.presentation) {
            if (config.presentation.layout) {
                code += `  pptx.layout = '${config.presentation.layout}';\n`;
            }
            if (config.presentation.title) {
                code += `  pptx.title = '${config.presentation.title}';\n`;
            }
            if (config.presentation.author) {
                code += `  pptx.author = '${config.presentation.author}';\n`;
            }
        }

        code += '\n';

        // Add slides
        if (config.slides) {
            config.slides.forEach((slideConfig, slideIndex) => {
                code += `  // Slide ${slideIndex + 1}\n`;
                code += `  const slide${slideIndex + 1} = pptx.addSlide();\n`;

                // Background
                if (slideConfig.background) {
                    code += `  slide${slideIndex + 1}.background = ${JSON.stringify(slideConfig.background)};\n`;
                }

                // Elements
                if (slideConfig.elements) {
                    slideConfig.elements.forEach((element, elementIndex) => {
                        const options = JSON.stringify(element.options, null, 2);
                        code += `  slide${slideIndex + 1}.add${this.capitalizeName(element.type)}(${element.text ? `'${element.text}', ` : ''}${options});\n`;
                    });
                }

                code += '\n';
            });
        }

        code += `  return pptx;\n`;
        code += `}\n\n`;
        code += `module.exports = { create${this.capitalizeName(patternName)}Presentation };`;

        return code;
    }

    /**
     * Save successful pattern
     */
    async saveSuccessfulPattern(pattern) {
        const filename = `${pattern.name}.js`;
        const filePath = path.join(this.libraryPath, 'working-patterns', filename);

        try {
            await fs.writeFile(filePath, pattern.generatedCode, 'utf8');

            // Also save as JSON for metadata
            const jsonPath = path.join(this.libraryPath, 'tested-configurations', `${pattern.name}.json`);
            const jsonData = {
                name: pattern.name,
                config: pattern.config,
                metadata: pattern.metadata
            };
            await fs.writeFile(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');

            console.log(`📁 Saved pattern: ${filename}`);
        } catch (error) {
            console.error(`❌ Failed to save pattern ${pattern.name}:`, error);
        }
    }

    /**
     * Save failure pattern for analysis
     */
    async saveFailurePattern(failureInfo) {
        const filename = `${failureInfo.patternName}.md`;
        const filePath = path.join(this.libraryPath, 'failure-reports', filename);

        const content = `# Pattern Failure: ${failureInfo.patternName}

**Test ID:** ${failureInfo.testId}
**Tested At:** ${failureInfo.testedAt}

## Error
${failureInfo.error}

## Error Stack
\`\`\`
${failureInfo.errorStack}
\`\`\`

## Configuration
\`\`\`json
${JSON.stringify(failureInfo.config, null, 2)}
\`\`\`

## Analysis Required
- [ ] Identify root cause
- [ ] Find workaround
- [ ] Update pattern guidelines
- [ ] Test alternative approaches
`;

        await fs.writeFile(filePath, content, 'utf8');
    }

    /**
     * Save test summary
     */
    async saveTestSummary(results, baseName) {
        const summary = {
            testName: baseName,
            timestamp: new Date().toISOString(),
            statistics: {
                totalVariations: results.total,
                successful: results.successful,
                failed: results.failed,
                successRate: (results.successful / results.total) * 100
            },
            failures: results.failures
        };

        const filename = `test-summary-${baseName}-${Date.now()}.json`;
        const filePath = path.join(this.libraryPath, 'tested-configurations', filename);

        await fs.writeFile(filePath, JSON.stringify(summary, null, 2), 'utf8');
    }

    /**
     * Update success rate statistics
     */
    updateSuccessRate(patternName, success) {
        const baseName = patternName.split('-')[0]; // Extract base name
        const current = this.successRates.get(baseName) || { attempts: 0, successes: 0 };

        current.attempts++;
        if (success) current.successes++;

        this.successRates.set(baseName, current);
    }

    /**
     * Generate variations for battle testing
     */
    generateTextVariations() {
        const variations = [];
        const alignments = ['left', 'center', 'right'];
        const fontSizes = [12, 16, 20, 24, 28, 32, 36, 48];
        const positions = [
            { x: 1, y: 1, w: 8, h: 1 },
            { x: 2, y: 1.5, w: 6, h: 0.8 },
            { x: 1.5, y: 2, w: 7, h: 1.2 }
        ];

        for (const align of alignments) {
            for (const size of fontSizes) {
                for (const pos of positions) {
                    variations.push({
                        presentation: { layout: 'LAYOUT_16x9' },
                        slides: [{
                            elements: [{
                                type: 'text',
                                text: `Text alignment: ${align}, size: ${size}pt, position: (${pos.x},${pos.y})`,
                                options: {
                                    x: pos.x,
                                    y: pos.y,
                                    w: pos.w,
                                    h: pos.h,
                                    fontSize: size,
                                    align: align,
                                    color: '333333'
                                }
                            }]
                        }]
                    });
                }
            }
        }

        return variations;
    }

    /**
     * Quick test for common patterns
     */
    async quickTest(patternName) {
        const variations = this.generateTextVariations();
        const sample = variations.slice(0, 10); // Test first 10 variations

        console.log(`🚀 Quick testing "${patternName}" with ${sample.length} variations...`);
        return await this.battleTestVariations(sample, patternName);
    }

    capitalizeName(name) {
        return name.replace(/(?:^|-)(\w)/g, (_, c) => c.toUpperCase()).replace(/-/g, '');
    }

    getStats() {
        return {
            totalPatterns: this.discoveredPatterns.size,
            failurePatterns: this.failurePatterns.size,
            successRates: Object.fromEntries(this.successRates),
            libraryLocation: this.libraryPath
        };
    }
}

module.exports = PatternDiscoveryEngine;

// CLI usage
if (require.main === module) {
    async function runDiscovery() {
        const engine = new PatternDiscoveryEngine();
        await engine.initialize();

        // Example: Quick test text variations
        if (process.argv.includes('--quick-test')) {
            await engine.quickTest('text-positioning');
        }

        // Show stats
        console.log('\n📊 Discovery Engine Stats:', engine.getStats());
    }

    runDiscovery().catch(console.error);
}
