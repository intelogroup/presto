/**
 * PPTX Metadata Extractor
 * Reads existing PPTX files and extracts design patterns, themes, layouts, etc.
 * Uses Pizzip for unzipping, docxtemplater for PPTX handling, and fast-xml-parser for OOXML parsing
 */

const fs = require('fs');
const PIZZIP = require('pizzip');
const Docxtemplater = require('docxtemplater');
const { DOMParser } = require('@xmldom/xmldom');
const { XMLParser } = require('fast-xml-parser');

class PptxMetadataExtractor {
    constructor() {
        this.filename = null;
        this.zip = null;
        this.slides = [];
        this.theme = {};
        this.globalProperties = {};
    }

    /**
     * Main extraction method
     */
    async extractMetadata(pptxPath) {
        try {
            this.filename = pptxPath;

            if (!fs.existsSync(pptxPath)) {
                throw new Error(`PPTX file not found: ${pptxPath}`);
            }

            console.log(`📂 Reading PPTX file: ${pptxPath}`);

            // Step 1: Load and unzip the PPTX file
            await this.loadPptxFile(pptxPath);

            // Step 2: Extract basic properties
            const properties = await this.extractBasicProperties();

            // Step 3: Extract presentation structure
            const structure = await this.extractPresentationStructure();

            // Step 4: Extract theme and styles
            const themeData = await this.extractThemeData();

            // Step 5: Extract slide layouts
            const layouts = await this.extractSlideLayouts();

            // Step 6: Extract individual slide content
            const slidesData = await this.extractSlidesContent();

            // Step 7: Analyze design patterns
            const designPatterns = await this.analyzeDesignPatterns(slidesData, themeData);

            const metadata = {
                sourceFile: this.filename,
                extractedAt: new Date().toISOString(),
                basicProperties: properties,
                structure: structure,
                theme: themeData,
                layouts: layouts,
                slides: slidesData,
                designPatterns: designPatterns,
                technicalSummary: {
                    totalSlides: slidesData.length,
                    themeColors: themeData.colors?.length || 0,
                    slideLayouts: layouts.length,
                    fontsFound: themeData.fonts?.length || 0,
                    hascharts: designPatterns.hasCharts,
                    hasImages: designPatterns.hasImages,
                    dominantColors: designPatterns.dominantColors?.slice(0, 5)
                }
            };

            console.log(`✅ Metadata extracted successfully: ${slidesData.length} slides analyzed`);

            return metadata;

        } catch (error) {
            console.error(`❌ Failed to extract metadata: ${error.message}`);
            throw error;
        }
    }

    /**
     * Load PPTX file and parse as ZIP
     */
    async loadPptxFile(filePath) {
        const content = fs.readFileSync(filePath, 'binary');
        this.zip = new PIZZIP(content);

        console.log(`📦 Unzipped PPTX: ${Object.keys(this.zip.files).length} files`);
        return this.zip;
    }

    /**
     * Extract basic presentation properties
     */
    async extractBasicProperties() {
        try {
            const docProps = this.zip.file('docProps/app.xml');
            const coreProps = this.zip.file('docProps/core.xml');

            const properties = {
                application: 'Unknown',
                title: 'Untitled',
                author: 'Unknown',
                created: null,
                modified: null,
                version: 'Unknown'
            };

            if (docProps) {
                const xmlContent = docProps.asText();
                const parser = new DOMParser();
                const doc = parser.parseFromString(xmlContent, 'text/xml');

                const appNode = doc.getElementsByTagName('Application')[0];
                if (appNode) properties.application = appNode.textContent;

                const versionNode = doc.getElementsByTagName('AppVersion')[0];
                if (versionNode) properties.version = versionNode.textContent;
            }

            if (coreProps) {
                const xmlContent = coreProps.asText();
                const parser = new DOMParser();
                const doc = parser.parseFromString(xmlContent, 'text/xml');

                const titleNode = doc.getElementsByTagName('dc:title')[0];
                if (titleNode) properties.title = titleNode.textContent;

                const authorNode = doc.getElementsByTagName('dc:creator')[0];
                if (authorNode) properties.author = authorNode.textContent;

                const createdNode = doc.getElementsByTagName('dcterms:created')[0];
                if (createdNode) properties.created = createdNode.textContent;

                const modifiedNode = doc.getElementsByTagName('dcterms:modified')[0];
                if (modifiedNode) properties.modified = modifiedNode.textContent;
            }

            console.log(`📋 Properties: ${properties.application} v${properties.version}`);
            return properties;

        } catch (error) {
            console.log(`⚠️  Could not extract basic properties: ${error.message}`);
            return { title: 'Unknown', author: 'Unknown' };
        }
    }

    /**
     * Extract presentation structure
     */
    async extractPresentationStructure() {
        try {
            const presentationFile = this.zip.file('ppt/presentation.xml');
            if (!presentationFile) {
                throw new Error('No presentation.xml found');
            }

            const xmlContent = presentationFile.asText();

            // Parse XML for slide relations
            const parserOptions = {
                ignoreAttributes: false,
                attributeNamePrefix: '@_'
            };
            const parser = new XMLParser(parserOptions);
            const jsonObj = parser.parse(xmlContent);

            const structure = {
                slideCount: 0,
                slideOrder: [],
                slideMasters: [],
                slideIds: []
            };

            if (jsonObj?.presentation?.sldIdLst?.sldId) {
                const slides = Array.isArray(jsonObj.presentation.sldIdLst.sldId)
                    ? jsonObj.presentation.sldIdLst.sldId
                    : [jsonObj.presentation.sldIdLst.sldId];

                structure.slideCount = slides.length;
                structure.slideIds = slides.map(sld => sld['@_r:id']);

                slides.forEach((slide, index) => {
                    structure.slideOrder.push({
                        slideNumber: index + 1,
                        relationshipId: slide['@_r:id'],
                        slideId: slide['@_id']
                    });
                });
            }

            console.log(`📊 Structure: ${structure.slideCount} slides found`);
            return structure;

        } catch (error) {
            console.log(`⚠️  Could not extract structure: ${error.message}`);
            return { slideCount: 0, slideOrder: [] };
        }
    }

    /**
     * Extract theme data (colors, fonts, styles)
     */
    async extractThemeData() {
        try {
            // Look for theme files
            const themeFiles = Object.keys(this.zip.files).filter(key =>
                key.includes('theme') && key.endsWith('.xml')
            );

            let themeData = {
                colors: [],
                fonts: [],
                effects: [],
                masterTheme: null
            };

            for (const themeFile of themeFiles) {
                console.log(`🎨 Reading theme file: ${themeFile}`);
                const xmlContent = this.zip.file(themeFile).asText();

                const parserOptions = {
                    ignoreAttributes: false,
                    attributeNamePrefix: '@_'
                };
                const parser = new XMLParser(parserOptions);
                const jsonObj = parser.parse(xmlContent);

                if (jsonObj?.a_theme) {
                    themeData = await this.parseThemeObject(jsonObj.a_theme, themeData);
                    break; // Use first theme found
                }
            }

            console.log(`🎨 Theme extracted: ${themeData.colors.length} colors, ${themeData.fonts.length} fonts`);
            return themeData;

        } catch (error) {
            console.log(`⚠️  Could not extract theme data: ${error.message}`);
            return { colors: [], fonts: [], effects: [] };
        }
    }

    /**
     * Parse theme XML object
     */
    async parseThemeObject(themeObj, existingData) {
        const parsed = { ...existingData };

        // Extract color scheme
        if (themeObj.themeElements?.clrScheme) {
            parsed.colors = this.extractColorsFromScheme(themeObj.themeElements.clrScheme);
        }

        // Extract fonts
        if (themeObj.themeElements?.fontScheme) {
            parsed.fonts = this.extractFontsFromScheme(themeObj.themeElements.fontScheme);
        }

        // Extract effects and styles
        if (themeObj.themeElements?.fmtScheme) {
            parsed.effects = this.extractEffectsFromScheme(themeObj.themeElements.fmtScheme);
        }

        return parsed;
    }

    /**
     * Extract colors from color scheme
     */
    extractColorsFromScheme(clrScheme) {
        const colors = [];
        const colorNodes = Object.keys(clrScheme).filter(key => key.startsWith('a:'));

        for (const colorKey of colorNodes) {
            const colorData = clrScheme[colorKey];
            if (colorData && typeof colorData === 'object') {
                const colorValue = this.extractColorValue(colorData);
                if (colorValue) {
                    colors.push({
                        name: colorKey.replace('a:', ''),
                        value: colorValue
                    });
                }
            }
        }

        return colors;
    }

    /**
     * Extract color value from XML node
     */
    extractColorValue(colorObj) {
        if (colorObj['a:srgbClr']) return `#${colorObj['a:srgbClr']['a:val']}`;
        if (colorObj['a:schemeClr']) return colorObj['a:schemeClr'];
        if (colorObj['a:hslClr']) return colorObj['a:hslClr'];
        return null;
    }

    /**
     * Extract fonts from font scheme
     */
    extractFontsFromScheme(fontScheme) {
        const fonts = [];

        if (fontScheme.majorFont) {
            fonts.push({
                type: 'major',
                latin: fontScheme.majorFont['a:latin']?.['@_typeface'],
                ea: fontScheme.majorFont['a:ea']?.['@_typeface'],
                cs: fontScheme.majorFont['a:cs']?.['@_typeface']
            });
        }

        if (fontScheme.minorFont) {
            fonts.push({
                type: 'minor',
                latin: fontScheme.minorFont['a:latin']?.['@_typeface'],
                ea: fontScheme.minorFont['a:ea']?.['@_typeface'],
                cs: fontScheme.minorFont['a:cs']?.['@_typeface']
            });
        }

        return fonts;
    }

    /**
     * Extract effects and styles from format scheme
     */
    extractEffectsFromScheme(fmtScheme) {
        return {
            hasFillStyles: !!fmtScheme.fillStyleLst,
            hasLineStyles: !!fmtScheme.lnStyleLst,
            hasEffectStyles: !!fmtScheme.effectStyleLst,
            hasBgFillStyles: !!fmtScheme.bgFillStyleLst
        };
    }

    /**
     * Extract slide layouts
     */
    async extractSlideLayouts() {
        try {
            const layoutFiles = Object.keys(this.zip.files).filter(key =>
                key.includes('slideLayout') && key.endsWith('.xml')
            );

            const layouts = [];

            for (const layoutFile of layoutFiles) {
                console.log(`📐 Reading layout: ${layoutFile}`);
                const xmlContent = this.zip.file(layoutFile).asText();

                const parserOptions = {
                    ignoreAttributes: false,
                    attributeNamePrefix: '@_'
                };
                const parser = new XMLParser(parserOptions);
                const jsonObj = parser.parse(xmlContent);

                const layoutData = {
                    filename: layoutFile,
                    type: jsonObj?.sldLayout?.['@_type'] || 'unknown',
                    shapes: this.countLayoutShapes(jsonObj),
                    placeholders: this.extractPlaceholders(jsonObj)
                };

                layouts.push(layoutData);
            }

            console.log(`📐 Extracted ${layouts.length} slide layouts`);
            return layouts;

        } catch (error) {
            console.log(`⚠️  Could not extract slide layouts: ${error.message}`);
            return [];
        }
    }

    /**
     * Count shapes in layout
     */
    countLayoutShapes(layoutObj) {
        try {
            if (!layoutObj?.sldLayout?.cSld?.spTree?.sp) return 0;

            const shapes = layoutObj.sldLayout.cSld.spTree.sp;
            return Array.isArray(shapes) ? shapes.length : 1;
        } catch {
            return 0;
        }
    }

    /**
     * Extract placeholder information from layout
     */
    extractPlaceholders(layoutObj) {
        try {
            const placeholders = [];

            if (layoutObj?.sldLayout?.cSld?.spTree?.sp) {
                const shapes = Array.isArray(layoutObj.sldLayout.cSld.spTree.sp)
                    ? layoutObj.sldLayout.cSld.spTree.sp
                    : [layoutObj.sldLayout.cSld.spTree.sp];

                shapes.forEach((shape, index) => {
                    if (shape?.nvSpPr?.nvPr?.ph) {
                        const ph = shape.nvSpPr.nvPr.ph;
                        placeholders.push({
                            index,
                            type: ph['@_type'] || 'unknown',
                            idx: ph['@_idx'] || 0
                        });
                    }
                });
            }

            return placeholders;
        } catch {
            return [];
        }
    }

    /**
     * Extract content from individual slides
     */
    async extractSlidesContent() {
        try {
            const slideFiles = Object.keys(this.zip.files).filter(key =>
                key.includes('slides/slide') && key.endsWith('.xml')
            );

            const slidesData = [];

            for (const slideFile of slideFiles) {
                console.log(`📄 Reading slide: ${slideFile}`);
                const xmlContent = this.zip.file(slideFile).asText();

                const parserOptions = {
                    ignoreAttributes: false,
                    attributeNamePrefix: '@_'
                };
                const parser = new XMLParser(parserOptions);
                const jsonObj = parser.parse(xmlContent);

                const slideData = {
                    filename: slideFile,
                    slideNumber: this.extractSlideNumber(slideFile),
                    background: this.extractSlideBackground(jsonObj),
                    shapes: this.extractSlideShapes(jsonObj),
                    images: this.extractSlideImages(jsonObj),
                    textBoxes: this.extractSlideText(jsonObj),
                    tables: this.extractSlideTables(jsonObj),
                    charts: this.extractSlideCharts(jsonObj)
                };

                slidesData.push(slideData);
            }

            console.log(`📄 Extracted content from ${slidesData.length} slides`);
            return slidesData;

        } catch (error) {
            console.log(`⚠️  Could not extract slide content: ${error.message}`);
            return [];
        }
    }

    /**
     * Extract slide number from filename
     */
    extractSlideNumber(filename) {
        const match = filename.match(/slide(\d+)\.xml$/);
        return match ? parseInt(match[1]) : 1;
    }

    /**
     * Extract slide background
     */
    extractSlideBackground(jsonObj) {
        try {
            if (jsonObj?.sld?.cSld?.bg) {
                const bg = jsonObj.sld.cSld.bg;

                if (bg?.bgPr?.color || bg?.bgPr?.srgbClr) {
                    return {
                        type: 'color',
                        value: this.extractColorValue(bg.bgPr)
                    };
                }

                if (bg?.bgPr?.blipFill) {
                    return {
                        type: 'image',
                        value: 'has-background-image'
                    };
                }
            }

            return { type: 'none' };
        } catch {
            return { type: 'unknown' };
        }
    }

    /**
     * Extract shapes from slide
     */
    extractSlideShapes(jsonObj) {
        try {
            const shapes = [];
            if (jsonObj?.sld?.cSld?.spTree?.sp) {
                const spTree = jsonObj.sld.cSld.spTree;
                const shapeElements = Array.isArray(spTree.sp) ? spTree.sp : [spTree.sp];

                shapes.push(...shapeElements.map(shape => ({
                    type: 'shape',
                    geometry: shape.spPr?.prstGeom?.prst || 'unknown',
                    fill: shape.spPr?.solidFill ? this.extractColorValue(shape.spPr.solidFill) : 'transparent',
                    outline: shape.spPr?.ln ? 'has-outline' : 'no-outline'
                })));
            }

            return shapes;
        } catch {
            return [];
        }
    }

    /**
     * Extract images from slide
     */
    extractSlideImages(jsonObj) {
        try {
            const images = [];
            if (jsonObj?.sld?.cSld?.spTree?.pic) {
                const picElements = Array.isArray(jsonObj.sld.cSld.spTree.pic)
                    ? jsonObj.sld.cSld.spTree.pic
                    : [jsonObj.sld.cSld.spTree.pic];

                picElements.forEach(pic => {
                    if (pic?.blipFill?.blip) {
                        images.push({ type: 'image', has: true });
                    }
                });
            }

            return images;
        } catch {
            return [];
        }
    }

    /**
     * Extract text content from slide
     */
    extractSlideText(jsonObj) {
        try {
            const textBoxes = [];
            if (jsonObj?.sld?.cSld?.spTree?.sp) {
                const spElements = Array.isArray(jsonObj.sld.cSld.spTree.sp)
                    ? jsonObj.sld.cSld.spTree.sp
                    : [jsonObj.sld.cSld.spTree.sp];

                spElements.forEach(sp => {
                    if (sp?.txBody?.p) {
                        const paragraphs = Array.isArray(sp.txBody.p) ? sp.txBody.p : [sp.txBody.p];
                        const textContent = paragraphs.map(p => {
                            if (p?.r) {
                                const runs = Array.isArray(p.r) ? p.r : [p.r];
                                return runs.map(r => r.t || '').join('');
                            }
                            if (p?.endParaRPr?.t) return p.endParaRPr.t;
                            return '';
                        }).join('\n');

                        if (textContent.trim()) {
                            textBoxes.push({
                                text: textContent,
                                paragraphs: paragraphs.length,
                                style: sp?.style
                            });
                        }
                    }
                });
            }

            return textBoxes;
        } catch {
            return [];
        }
    }

    /**
     * Extract tables from slide
     */
    extractSlideTables(jsonObj) {
        try {
            const tables = [];
            if (jsonObj?.sld?.cSld?.spTree?.graphicFrame) {
                const frames = Array.isArray(jsonObj.sld.cSld.spTree.graphicFrame)
                    ? jsonObj.sld.cSld.spTree.graphicFrame
                    : [jsonObj.sld.cSld.spTree.graphicFrame];

                frames.forEach(frame => {
                    if (frame?.graphic?.graphicData?.tbl) {
                        tables.push({
                            type: 'table',
                            hasContent: true,
                            rows: frame.graphic.graphicData.tbl?.tr?.length || 0
                        });
                    }
                });
            }

            return tables;
        } catch {
            return [];
        }
    }

    /**
     * Extract charts from slide
     */
    extractSlideCharts(jsonObj) {
        try {
            const charts = [];
            if (jsonObj?.sld?.cSld?.spTree?.graphicFrame) {
                const frames = Array.isArray(jsonObj.sld.cSld.spTree.graphicFrame)
                    ? jsonObj.sld.cSld.spTree.graphicFrame
                    : [jsonObj.sld.cSld.spTree.graphicFrame];

                frames.forEach(frame => {
                    if (frame?.graphic?.graphicData?.chart) {
                        charts.push({
                            type: 'chart',
                            hasContent: true
                        });
                    }
                });
            }

            return charts;
        } catch {
            return [];
        }
    }

    /**
     * Analyze design patterns from extracted data
     */
    async analyzeDesignPatterns(slidesData, themeData) {
        const patterns = {
            dominantColors: [],
            layoutPatterns: [],
            textStyles: [],
            hasImages: false,
            hasCharts: false,
            hasTables: false,
            visualDensity: 'low',
            colorHarmony: 'unknown'
        };

        // Analyze colors used
        const colorsUsed = [];
        if (themeData.colors) {
            colorsUsed.push(...themeData.colors.map(c => c.value));
        }

        if (slidesData.length > 0) {
            slidesData.forEach(slide => {
                if (slide.background.type === 'color' && slide.background.value) {
                    colorsUsed.push(slide.background.value);
                }

                slide.shapes.forEach(shape => {
                    if (shape.fill && shape.fill !== 'transparent') {
                        colorsUsed.push(shape.fill);
                    }
                });
            });

            patterns.dominantColors = colorsUsed.filter((c, i) => colorsUsed.indexOf(c) === i).slice(0, 10);
            patterns.hasImages = slidesData.some(slide => slide.images.length > 0);
            patterns.hasCharts = slidesData.some(slide => slide.charts.length > 0);
            patterns.hasTables = slidesData.some(slide => slide.tables.length > 0);

            // Analyze visual density
            const totalElements = slidesData.reduce((sum, slide) =>
                sum + slide.shapes.length + slide.textBoxes.length, 0);
            const averageElements = totalElements / slidesData.length;

            if (averageElements < 5) patterns.visualDensity = 'low';
            else if (averageElements < 10) patterns.visualDensity = 'medium';
            else patterns.visualDensity = 'high';
        }

        return patterns;
    }

    /**
     * Generate readable stats for extracted metadata
     */
    generateStats() {
        if (!this.zip) {
            return { error: 'No PPTX file loaded' };
        }

        const fileCount = Object.keys(this.zip.files).length;

        return {
            totalFiles: fileCount,
            slides: this.slides.length,
            themes: Object.keys(this.theme).length,
            properties: Object.keys(this.globalProperties).length,
            estimatedComplexity: this.slides.length > 0 ? 'medium' : 'simple'
        };
    }

    /**
     * Get a specific file from the PPTX archive
     */
    getFile(path) {
        return this.zip ? this.zip.file(path) : null;
    }

    /**
     * List all files in the PPTX archive
     */
    listFiles() {
        return this.zip ? Object.keys(this.zip.files) : [];
    }
}

module.exports = PptxMetadataExtractor;

// CLI usage
if (require.main === module) {
    const path = require('path');

    async function extractSample() {
        const extractor = new PptxMetadataExtractor();

        try {
            // Find a PPTX file to extract
            const testFiles = [
                'business_demo_with_icons.pptx',
                'reliability-tools-demo.pptx',
                'debug-presentation.pptx'
            ];

            let testFile = null;
            for (const file of testFiles) {
                if (require('fs').existsSync(file)) {
                    testFile = file;
                    break;
                }
            }

            if (!testFile) {
                console.log('❌ No PPTX test file found');
                return;
            }

            console.log(`🎯 Extracting metadata from: ${testFile}\n`);

            const metadata = await extractor.extractMetadata(testFile);

            // Display summary
            console.log('\n📊 EXTRACTION SUMMARY');
            console.log('═'.repeat(60));

            if (metadata.basicProperties) {
                console.log(`📄 Presentation: ${metadata.basicProperties.title}`);
                console.log(`👤 Author: ${metadata.basicProperties.author}`);
                console.log(`🏗️  Application: ${metadata.basicProperties.application}`);
            }

            if (metadata.structure) {
                console.log(`📊 Slides: ${metadata.structure.slideCount}`);
            }

            if (metadata.theme) {
                console.log(`🎨 Theme Colors: ${metadata.theme.colors?.length || 0}`);
                console.log(`🔤 Fonts: ${metadata.theme.fonts?.length || 0}`);
            }

            if (metadata.designPatterns) {
                console.log(`🌈 Dominant Colors: ${metadata.designPatterns.dominantColors?.length || 0}`);
                console.log(`📐 Visual Density: ${metadata.designPatterns.visualDensity}`);
                console.log(`🖼️  Has Images: ${metadata.designPatterns.hasImages}`);
                console.log(`📊 Has Charts: ${metadata.designPatterns.hasCharts}`);
                console.log(`📋 Has Tables: ${metadata.designPatterns.hasTables}`);
            }

            console.log('\n💾 Saving detailed metadata...');

            // Save to file
            const outputPath = `pptx-metadata-${Date.now()}.json`;
            require('fs').writeFileSync(outputPath, JSON.stringify(metadata, null, 2));
            console.log(`✅ Metadata saved to: ${outputPath}`);

        } catch (error) {
            console.error('❌ Extraction failed:', error.message);
        }
    }

    extractSample();
}
