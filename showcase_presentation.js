const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Load the analysis data
const analysisData = JSON.parse(fs.readFileSync('./uploaded_images_analysis.json', 'utf8'));

// Create a new presentation
const pptx = new PptxGenJS();

// Set presentation properties
pptx.author = 'Slidy-Presto Generator';
pptx.company = 'AI-Powered Presentation Tool';
pptx.subject = 'Template Showcase';
pptx.title = 'Analyzed Slide Templates Showcase';

// Helper function to convert hex colors to PptxGenJS format
function convertColor(hexColor) {
    return hexColor ? hexColor.replace('#', '') : 'FFFFFF';
}

// Create slides based on the analysis
function createSlideFromAnalysis(slideData) {
    const slide = pptx.addSlide();
    const analysis = slideData.powerpoint_description;
    
    // Set slide background
    if (analysis.colorPalette && analysis.colorPalette.background) {
        slide.background = { color: convertColor(analysis.colorPalette.background) };
    }
    
    // Add content based on slide type
    switch (analysis.slideType) {
        case 'Title Slide':
            createTitleSlide(slide, analysis, slideData.filename);
            break;
        case 'Title and Content':
        case 'Title and Text':
            createContentSlide(slide, analysis, slideData.filename);
            break;
        case 'contentWithImage':
            createImageContentSlide(slide, analysis, slideData.filename);
            break;
        case 'conclusion':
            createConclusionSlide(slide, analysis, slideData.filename);
            break;
        case 'thankYou':
            createThankYouSlide(slide, analysis, slideData.filename);
            break;
        default:
            createGenericSlide(slide, analysis, slideData.filename);
    }
}

function createTitleSlide(slide, analysis, filename) {
    // Add title
    slide.addText('Portafolio Artístico', {
        x: 0.5,
        y: 2.5,
        w: 5,
        h: 1.5,
        fontSize: 48,
        fontFace: 'Arial',
        color: analysis.colorPalette?.text ? convertColor(analysis.colorPalette.text) : '000000',
        bold: true
    });
    
    // Add subtitle
    slide.addText('A showcase of artistic presentation templates\nGenerated from: ' + filename, {
        x: 0.5,
        y: 4.2,
        w: 5,
        h: 1.5,
        fontSize: 20,
        fontFace: 'Arial',
        color: analysis.colorPalette?.textSecondary ? convertColor(analysis.colorPalette.textSecondary) : '666666'
    });
    
    // Add decorative shape
    slide.addShape(pptx.ShapeType.rect, {
        x: 6,
        y: 1,
        w: 3.5,
        h: 5,
        fill: { color: analysis.colorPalette?.accent ? convertColor(analysis.colorPalette.accent) : 'FFA500' },
        line: { width: 0 }
    });
    
    // Add website banner
    slide.addText('www.slidy-presto.ai', {
        x: 6.5,
        y: 6.5,
        w: 2.5,
        h: 0.5,
        fontSize: 14,
        fontFace: 'Arial',
        color: '000000',
        align: 'center',
        fill: { color: 'FFFFFF' },
        margin: 0.1
    });
}

function createContentSlide(slide, analysis, filename) {
    // Add title
    slide.addText('Content Slide Template', {
        x: 0.5,
        y: 0.5,
        w: 9,
        h: 1,
        fontSize: 32,
        fontFace: 'Arial',
        color: analysis.colorPalette?.text ? convertColor(analysis.colorPalette.text) : '333333',
        bold: true,
        align: 'center'
    });
    
    // Add content boxes with icons
    const contentItems = [
        { title: 'Creative Process', text: 'Explore innovative approaches to artistic expression and creative methodology.' },
        { title: 'Visual Design', text: 'Understand the principles of visual composition and aesthetic harmony.' },
        { title: 'Technical Skills', text: 'Master the tools and techniques essential for professional presentation.' }
    ];
    
    contentItems.forEach((item, index) => {
        const xPos = 0.5 + (index * 3.2);
        
        // Add numbered circle
        slide.addShape(pptx.ShapeType.ellipse, {
            x: xPos + 1,
            y: 2.5,
            w: 0.8,
            h: 0.8,
            fill: { color: '333333' },
            line: { width: 0 }
        });
        
        slide.addText((index + 1).toString(), {
            x: xPos + 1,
            y: 2.5,
            w: 0.8,
            h: 0.8,
            fontSize: 24,
            fontFace: 'Arial',
            color: 'FFFFFF',
            bold: true,
            align: 'center',
            valign: 'middle'
        });
        
        // Add title
        slide.addText(item.title, {
            x: xPos,
            y: 3.5,
            w: 2.8,
            h: 0.6,
            fontSize: 18,
            fontFace: 'Arial',
            color: '333333',
            bold: true,
            align: 'center'
        });
        
        // Add description
        slide.addText(item.text, {
            x: xPos,
            y: 4.2,
            w: 2.8,
            h: 1.5,
            fontSize: 14,
            fontFace: 'Arial',
            color: '555555',
            align: 'center'
        });
    });
    
    // Add source info
    slide.addText('Template source: ' + filename, {
        x: 0.5,
        y: 6.5,
        w: 9,
        h: 0.5,
        fontSize: 12,
        fontFace: 'Arial',
        color: '999999',
        align: 'center',
        italic: true
    });
}

function createImageContentSlide(slide, analysis, filename) {
    // Add title
    slide.addText('Visual Content Layout', {
        x: 0.5,
        y: 0.5,
        w: 4.5,
        h: 1,
        fontSize: 28,
        fontFace: 'Arial',
        color: analysis.colorPalette?.text ? convertColor(analysis.colorPalette.text) : '000000',
        bold: true
    });
    
    // Add content text
    slide.addText('This layout demonstrates how images and text can work together harmoniously. The visual elements support and enhance the textual content, creating an engaging presentation experience.\n\nKey features:\n• Balanced composition\n• Clear hierarchy\n• Professional styling', {
        x: 0.5,
        y: 1.8,
        w: 4.5,
        h: 4,
        fontSize: 16,
        fontFace: 'Arial',
        color: '333333',
        bullet: false
    });
    
    // Add image placeholder
    slide.addShape(pptx.ShapeType.rect, {
        x: 5.5,
        y: 1,
        w: 4,
        h: 5,
        fill: { color: 'E8E8E8' },
        line: { color: 'CCCCCC', width: 1 }
    });
    
    slide.addText('Image Placeholder\n[Artistic Content]', {
        x: 5.5,
        y: 3,
        w: 4,
        h: 1,
        fontSize: 16,
        fontFace: 'Arial',
        color: '666666',
        align: 'center',
        valign: 'middle',
        italic: true
    });
    
    // Add source info
    slide.addText('Based on: ' + filename, {
        x: 0.5,
        y: 6.5,
        w: 9,
        h: 0.5,
        fontSize: 12,
        fontFace: 'Arial',
        color: '999999',
        italic: true
    });
}

function createConclusionSlide(slide, analysis, filename) {
    // Add title
    slide.addText('Conclusiones Finales', {
        x: 1,
        y: 1.5,
        w: 4,
        h: 1,
        fontSize: 32,
        fontFace: 'Arial',
        color: '333333',
        bold: true
    });
    
    // Add conclusion text
    slide.addText('The analysis of presentation templates reveals consistent patterns in design and layout that can be leveraged for creating professional presentations.\n\nThese templates provide a solid foundation for various presentation needs, from artistic portfolios to business presentations.', {
        x: 1,
        y: 2.8,
        w: 4,
        h: 2.5,
        fontSize: 16,
        fontFace: 'Arial',
        color: '555555'
    });
    
    // Add decorative elements (simulating images)
    const imagePositions = [
        { x: 5.5, y: 1, w: 1.5, h: 2 },
        { x: 7.2, y: 0.5, w: 1.5, h: 1.8 },
        { x: 6.8, y: 2.8, w: 1.5, h: 1.8 },
        { x: 5.2, y: 3.5, w: 1.5, h: 1.8 }
    ];
    
    imagePositions.forEach((pos, index) => {
        slide.addShape(pptx.ShapeType.rect, {
            x: pos.x,
            y: pos.y,
            w: pos.w,
            h: pos.h,
            fill: { color: ['FFB6C1', 'DDA0DD', '98FB98', 'F0E68C'][index] },
            line: { width: 0 },
            rotate: (index * 15) - 7.5
        });
    });
    
    // Add website banner
    slide.addShape(pptx.ShapeType.rect, {
        x: 1,
        y: 5.8,
        w: 2.5,
        h: 0.6,
        fill: { color: '333333' },
        line: { width: 0 }
    });
    
    slide.addText('www.slidy-presto.ai', {
        x: 1,
        y: 5.8,
        w: 2.5,
        h: 0.6,
        fontSize: 14,
        fontFace: 'Arial',
        color: 'FFFFFF',
        align: 'center',
        valign: 'middle'
    });
}

function createThankYouSlide(slide, analysis, filename) {
    // Add main title
    slide.addText('Muchas Gracias', {
        x: 1,
        y: 2.5,
        w: 4.5,
        h: 1.2,
        fontSize: 36,
        fontFace: 'Arial',
        color: '000000',
        bold: true
    });
    
    // Add thank you message
    slide.addText('Thank you for exploring our AI-powered presentation template analysis. This showcase demonstrates how machine learning can extract and recreate design patterns from existing presentations.', {
        x: 1,
        y: 3.8,
        w: 4.5,
        h: 1.8,
        fontSize: 16,
        fontFace: 'Arial',
        color: '555555'
    });
    
    // Add contact information
    const contacts = [
        { icon: '📞', text: '+1 (555) 123-4567' },
        { icon: '✉️', text: 'contact@slidy-presto.ai' },
        { icon: '🌐', text: 'www.slidy-presto.ai' }
    ];
    
    contacts.forEach((contact, index) => {
        slide.addText(contact.icon + '  ' + contact.text, {
            x: 1,
            y: 5.8 + (index * 0.4),
            w: 4,
            h: 0.3,
            fontSize: 14,
            fontFace: 'Arial',
            color: '000000'
        });
    });
    
    // Add decorative image area
    slide.addShape(pptx.ShapeType.rect, {
        x: 5.5,
        y: 0.5,
        w: 4,
        h: 6,
        fill: { color: 'F5F5F5' },
        line: { color: 'DDDDDD', width: 1 }
    });
    
    slide.addText('Artistic\nInspiration', {
        x: 5.5,
        y: 3,
        w: 4,
        h: 1,
        fontSize: 24,
        fontFace: 'Arial',
        color: '888888',
        align: 'center',
        valign: 'middle',
        italic: true
    });
}

function createGenericSlide(slide, analysis, filename) {
    slide.addText('Template Analysis: ' + analysis.slideType, {
        x: 0.5,
        y: 1,
        w: 9,
        h: 1,
        fontSize: 28,
        fontFace: 'Arial',
        color: '333333',
        bold: true,
        align: 'center'
    });
    
    slide.addText('Layout: ' + (typeof analysis.layout === 'object' ? JSON.stringify(analysis.layout) : analysis.layout), {
        x: 0.5,
        y: 2.5,
        w: 9,
        h: 0.8,
        fontSize: 18,
        fontFace: 'Arial',
        color: '555555',
        align: 'center'
    });
    
    // Display color palette
    if (analysis.colorPalette) {
        let colorText = 'Color Palette: ';
        if (typeof analysis.colorPalette === 'object') {
            colorText += Object.values(analysis.colorPalette).join(', ');
        } else {
            colorText += analysis.colorPalette;
        }
        
        slide.addText(colorText, {
            x: 0.5,
            y: 3.5,
            w: 9,
            h: 1,
            fontSize: 16,
            fontFace: 'Arial',
            color: '666666',
            align: 'center'
        });
    }
    
    slide.addText('Source: ' + filename, {
        x: 0.5,
        y: 6,
        w: 9,
        h: 0.5,
        fontSize: 12,
        fontFace: 'Arial',
        color: '999999',
        align: 'center',
        italic: true
    });
}

// Create slides from analysis data
console.log('🎨 Creating presentation from analyzed templates...');
console.log(`📊 Found ${analysisData.successful_analyses.length} templates to showcase`);

// Add introduction slide
const introSlide = pptx.addSlide();
introSlide.addText('AI-Powered Template Analysis', {
    x: 1,
    y: 2,
    w: 8,
    h: 1.5,
    fontSize: 44,
    fontFace: 'Arial',
    color: '2E4057',
    bold: true,
    align: 'center'
});

introSlide.addText('Showcasing ' + analysisData.successful_analyses.length + ' Analyzed Slide Templates', {
    x: 1,
    y: 3.8,
    w: 8,
    h: 1,
    fontSize: 24,
    fontFace: 'Arial',
    color: '5A6C7D',
    align: 'center'
});

introSlide.addText('Generated by Slidy-Presto AI • ' + new Date().toLocaleDateString(), {
    x: 1,
    y: 5.5,
    w: 8,
    h: 0.8,
    fontSize: 16,
    fontFace: 'Arial',
    color: '8A9BA8',
    align: 'center',
    italic: true
});

// Create slides from analysis (limit to first 8 for demo)
analysisData.successful_analyses.slice(0, 8).forEach((slideData, index) => {
    console.log(`📄 Creating slide ${index + 1}: ${slideData.filename} (${slideData.powerpoint_description.slideType})`);
    createSlideFromAnalysis(slideData);
});

// Save the presentation
const outputPath = './showcase_presentation.pptx';
pptx.writeFile({ fileName: outputPath })
    .then(() => {
        console.log('\n✅ Presentation created successfully!');
        console.log(`📁 Saved as: ${path.resolve(outputPath)}`);
        console.log(`📊 Total slides: ${pptx.slides.length}`);
        console.log('\n🎯 This presentation demonstrates how the analyzed templates can be used to create professional presentations with PptxGenJS.');
    })
    .catch(err => {
        console.error('❌ Error creating presentation:', err);
    });

module.exports = { createSlideFromAnalysis };