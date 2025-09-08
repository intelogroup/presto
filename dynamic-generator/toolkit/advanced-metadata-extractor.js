const fs = require('fs');
const path = require('path');
const PizZip = require('pizzip');
const { XMLParser } = require('fast-xml-parser');

class AdvancedPptxMetadataExtractor {
    constructor() {
        console.log('🚀 Advanced PPTX Metadata Extractor initialized');
    }

    async extractMetadata(pptxPath) {
        try {
            console.log(`🔍 Analyzing PPTX file: ${pptxPath}`);

            if (!fs.existsSync(pptxPath)) {
                throw new Error(`PPTX file not found: ${pptxPath}`);
            }

            const content = fs.readFileSync(pptxPath, 'binary');
            const zip = new PizZip(content);

            const metadata = {
                filename: path.basename(pptxPath),
                filepath: pptxPath,
                slides: [],
            };

            const parser = new XMLParser({ignoreAttributes : false});

            const relsXml = zip.file('ppt/_rels/presentation.xml.rels').asText();
            const relsJson = parser.parse(relsXml);
            const slideIdToFileNameMap = {};
            if (Array.isArray(relsJson.Relationships.Relationship)) {
                for (const rel of relsJson.Relationships.Relationship) {
                    if (rel['@_Type'] === 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide') {
                        slideIdToFileNameMap[rel['@_Id']] = rel['@_Target'];
                    }
                }
            } else {
                const rel = relsJson.Relationships.Relationship;
                if (rel['@_Type'] === 'http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide') {
                    slideIdToFileNameMap[rel['@_Id']] = rel['@_Target'];
                }
            }

            const presentationXml = zip.file('ppt/presentation.xml').asText();
            const presentationJson = parser.parse(presentationXml);
            const slideIds = presentationJson['p:presentation']['p:sldIdLst']['p:sldId'].map(s => s['@_r:id']);

            for (const slideId of slideIds) {
                const slideFileName = `ppt/${slideIdToFileNameMap[slideId]}`;
                const slideXml = zip.file(slideFileName).asText();
                const slideJson = parser.parse(slideXml);
                const slideData = {
                    slideNumber: parseInt(slideId.replace('rId', '')),
                    elements: [],
                };
                
                if (slideJson['p:sld']['p:cSld']['p:spTree']['p:sp']) {
                    const shapes = Array.isArray(slideJson['p:sld']['p:cSld']['p:spTree']['p:sp']) ? slideJson['p:sld']['p:cSld']['p:spTree']['p:sp'] : [slideJson['p:sld']['p:cSld']['p:spTree']['p:sp']];
                    for (const shape of shapes) {
                        if (shape['p:txBody'] && shape['p:txBody']['a:p']) {
                            const paragraphs = Array.isArray(shape['p:txBody']['a:p']) ? shape['p:txBody']['a:p'] : [shape['p:txBody']['a:p']];
                            const textRuns = paragraphs.map(p => {
                                if (p['a:r']) {
                                    const runs = Array.isArray(p['a:r']) ? p['a:r'] : [p['a:r']];
                                    return runs.map(r => r['a:t']).join('');
                                }
                                return '';
                            }).join('\n');

                            slideData.elements.push({
                                type: 'text',
                                content: textRuns,
                            });
                        }
                    }
                }
                metadata.slides.push(slideData);
            }

            console.log(`✅ Advanced metadata extracted for ${metadata.filename}`);
            return metadata;

        } catch (error) {
            console.error(`❌ Failed to extract advanced metadata: ${error.message}`);
            throw error;
        }
    }
}

if (require.main === module) {
    async function main() {
        const extractor = new AdvancedPptxMetadataExtractor();
        const filePath = process.argv[2];

        if (!filePath) {
            console.log('Usage: node advanced-metadata-extractor.js <path_to_pptx_file>');
            return;
        }

        try {
            const metadata = await extractor.extractMetadata(filePath);
            console.log(JSON.stringify(metadata, null, 2));
        } catch (error) {
            console.error(`Error processing file: ${error.message}`);
        }
    }

    main().catch(console.error);
}