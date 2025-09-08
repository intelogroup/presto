const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

/**
 * Generate green-themed presentation based on visual description analysis
 * Replicates the design from slide_descriptions.md
 */
function generateGreenThemePresentation() {
    // Create new presentation
    let pptx = new PptxGenJS();
    
    // Set presentation properties
    pptx.author = 'Slidy-Presto Generator';
    pptx.company = 'Research Lab';
    pptx.subject = 'Green Theme Presentation';
    pptx.title = 'Scientific Research Presentation';
    
    // Define color palette from visual description
    const colors = {
        green: '5A7454',        // Primary green from description
        lightGreen: 'F0F3F0',   // Light green background
        paleGreen: 'E8F5E8',    // Very light green
        gray: '6c757d',         // Text gray
        darkGray: '343a40',     // Dark text
        white: 'FFFFFF'
    };
    
    // SLIDE 1: Research Question (60/40 vertical split layout)
    let slide1 = pptx.addSlide();
    
    // Left zone (60%) - Text content
    slide1.addText('Research question', {
        x: 0.5,
        y: 0.8,
        w: 5.5,
        h: 0.8,
        fontSize: 36,
        fontFace: 'Arial',
        color: colors.green,
        bold: true,
        align: 'left'
    });
    
    // Body text in left zone
    slide1.addText('This section presents the fundamental research question that drives our investigation. The question should be clear, focused, and scientifically relevant to establish the foundation for our methodology and expected outcomes.\n\nOur research aims to explore innovative approaches while maintaining rigorous scientific standards throughout the investigation process.', {
        x: 0.5,
        y: 1.8,
        w: 5.5,
        h: 3.0,
        fontSize: 14,
        fontFace: 'Arial',
        color: colors.gray,
        align: 'left',
        valign: 'top'
    });
    
    // Right zone (40%) - Scientific imagery placeholder
    slide1.addShape(pptx.ShapeType.rect, {
        x: 6.2,
        y: 0.8,
        w: 3.3,
        h: 4.0,
        fill: { color: colors.lightGreen },
        line: { color: colors.green, width: 1 }
    });
    
    // Scientific imagery placeholder text
    slide1.addText('Scientific\nGlassware\nImagery', {
        x: 6.2,
        y: 2.3,
        w: 3.3,
        h: 1.0,
        fontSize: 16,
        fontFace: 'Arial',
        color: colors.green,
        align: 'center',
        valign: 'middle',
        italic: true
    });
    
    // SLIDE 2: Contents (3x3 grid layout)
    let slide2 = pptx.addSlide();
    
    // Contents title
    slide2.addText('Contents', {
        x: 0.5,
        y: 0.5,
        w: 9.0,
        h: 0.8,
        fontSize: 36,
        fontFace: 'Arial',
        color: colors.green,
        bold: true,
        align: 'center'
    });
    
    // 3x3 grid configuration
    const gridConfig = {
        startX: 1.0,
        startY: 1.5,
        cellWidth: 2.6,
        cellHeight: 1.0,
        spacingX: 0.2,
        spacingY: 0.2
    };
    
    // Contents items (9 sections as described)
    const contentsItems = [
        'Introduction', 'Literature Review', 'Methodology',
        'Data Collection', 'Analysis', 'Results',
        'Discussion', 'Conclusions', 'References'
    ];
    
    // Create 3x3 grid
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            const x = gridConfig.startX + col * (gridConfig.cellWidth + gridConfig.spacingX);
            const y = gridConfig.startY + row * (gridConfig.cellHeight + gridConfig.spacingY);
            
            // Background rectangle
            slide2.addShape(pptx.ShapeType.rect, {
                x: x,
                y: y,
                w: gridConfig.cellWidth,
                h: gridConfig.cellHeight,
                fill: { color: colors.paleGreen },
                line: { color: colors.green, width: 1 }
            });
            
            // Content text
            slide2.addText(contentsItems[index], {
                x: x + 0.1,
                y: y,
                w: gridConfig.cellWidth - 0.2,
                h: gridConfig.cellHeight,
                fontSize: 14,
                fontFace: 'Arial',
                color: colors.darkGray,
                align: 'center',
                valign: 'middle',
                bold: false
            });
        }
    }
    
    // SLIDE 3: Sample Methodology (demonstrating the theme)
    let slide3 = pptx.addSlide();
    
    // Green accent line above title
    slide3.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.4,
        w: 4,
        h: 0.03,
        fill: { color: colors.green },
        line: { width: 0 }
    });
    
    // Title
    slide3.addText('Methodology', {
        x: 0.5,
        y: 0.6,
        w: 5.5,
        h: 0.8,
        fontSize: 36,
        fontFace: 'Arial',
        color: colors.green,
        bold: true,
        align: 'left'
    });
    
    // Subtitle
    slide3.addText('Systematic approach to research design and implementation', {
        x: 0.5,
        y: 1.4,
        w: 5.0,
        h: 0.6,
        fontSize: 16,
        fontFace: 'Arial',
        color: colors.gray,
        align: 'left',
        italic: true
    });
    
    // Method steps (2x2 grid)
    const methodSteps = [
        'Data Collection\nProtocol',
        'Sample\nPreparation',
        'Analysis\nProcedure',
        'Quality\nControl'
    ];
    
    const stepPositions = [
        { x: 0.5, y: 2.2 },
        { x: 3.2, y: 2.2 },
        { x: 0.5, y: 3.6 },
        { x: 3.2, y: 3.6 }
    ];
    
    methodSteps.forEach((step, index) => {
        const pos = stepPositions[index];
        
        // Step background
        slide3.addShape(pptx.ShapeType.rect, {
            x: pos.x,
            y: pos.y,
            w: 2.5,
            h: 1.2,
            fill: { color: colors.lightGreen },
            line: { color: colors.green, width: 1 }
        });
        
        // Step text
        slide3.addText(step, {
            x: pos.x + 0.1,
            y: pos.y,
            w: 2.3,
            h: 1.2,
            fontSize: 14,
            fontFace: 'Arial',
            color: colors.darkGray,
            align: 'center',
            valign: 'middle'
        });
    });
    
    // Right side image placeholder
    slide3.addShape(pptx.ShapeType.rect, {
        x: 6.0,
        y: 1.0,
        w: 3.5,
        h: 4.0,
        fill: { color: colors.lightGreen },
        line: { color: colors.green, width: 1 }
    });
    
    slide3.addText('Laboratory\nEquipment\nImage', {
        x: 6.0,
        y: 2.5,
        w: 3.5,
        h: 1.0,
        fontSize: 16,
        fontFace: 'Arial',
        color: colors.green,
        align: 'center',
        valign: 'middle',
        italic: true
    });
    
    // Save the presentation
    const outputPath = path.join(__dirname, 'green_theme_presentation.pptx');
    pptx.writeFile(outputPath)
        .then(fileName => {
            console.log(`✅ Green theme presentation saved as ${fileName}`);
            console.log('📊 Generated slides:');
            console.log('   1. Research Question (60/40 layout)');
            console.log('   2. Contents (3x3 grid)');
            console.log('   3. Sample Methodology');
            console.log(`🎨 Theme: Professional green (#${colors.green})`);
        })
        .catch(err => {
            console.error('❌ Error saving presentation:', err);
        });
}

// Export the theme colors for reuse
const greenTheme = {
    colors: {
        green: '5A7454',
        lightGreen: 'F0F3F0',
        paleGreen: 'E8F5E8',
        gray: '6c757d',
        darkGray: '343a40',
        white: 'FFFFFF'
    },
    fonts: {
        primary: 'Arial',
        sizes: {
            title: 36,
            subtitle: 16,
            body: 14
        }
    }
};

// Run the generator if called directly
if (require.main === module) {
    generateGreenThemePresentation();
}

module.exports = { generateGreenThemePresentation, greenTheme };