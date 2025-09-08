const PptxMetadataExtractor = require('./pptx-toolkit/pptx-metadata-extractor.js');
const fs = require('fs');

async function main() {
    const extractor = new PptxMetadataExtractor();
    const metadata = await extractor.extractMetadata('c:\\Users\\jayve\\projects\\Slidy-presto\\Scientific Conference Slides.pptx');
    fs.writeFileSync('design_properties.json', JSON.stringify(metadata, null, 2));
}

main();