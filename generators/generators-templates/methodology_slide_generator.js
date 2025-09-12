const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Global assets object for PNG icons
let assets = {
    lucidePng: [],
    simpleIconsPng: [],
    svgrepoIconsPng: [],
    devIconsPng: []
};

/**
 * Load PNG assets from assets-images-png directory
 */
async function loadAvailableAssets() {
    console.log('🔄 Loading PNG assets...');
    
    // Load Lucide PNG icons
    try {
        const lucidePngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'lucide', 'general');
        if (fs.existsSync(lucidePngPath)) {
            assets.lucidePng = fs.readdirSync(lucidePngPath)
                .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                .map(file => path.join(lucidePngPath, file));
            console.log(`✅ Loaded ${assets.lucidePng.length} Lucide PNG icons`);
        }
    } catch (error) {
        console.warn('Could not load Lucide PNG icons:', error.message);
    }
    
    // Load Simple Icons PNG
    try {
        const simpleIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'simpleicons', 'brand');
        if (fs.existsSync(simpleIconsPngPath)) {
            assets.simpleIconsPng = fs.readdirSync(simpleIconsPngPath)
                .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                .map(file => path.join(simpleIconsPngPath, file));
            console.log(`✅ Loaded ${assets.simpleIconsPng.length} Simple Icons PNG`);
        }
    } catch (error) {
        console.warn('Could not load Simple Icons PNG:', error.message);
    }
    
    // Load SVG Repo Icons PNG
    try {
        const svgrepoIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'svgrepo-icons-graphics');
        if (fs.existsSync(svgrepoIconsPngPath)) {
            assets.svgrepoIconsPng = fs.readdirSync(svgrepoIconsPngPath)
                .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                .map(file => path.join(svgrepoIconsPngPath, file));
            console.log(`✅ Loaded ${assets.svgrepoIconsPng.length} SVG Repo Icons PNG`);
        }
    } catch (error) {
        console.warn('Could not load SVG Repo Icons PNG:', error.message);
    }
    
    // Load DevIcons PNG
    try {
        const devIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'devicons', 'tech');
        if (fs.existsSync(devIconsPngPath)) {
            assets.devIconsPng = fs.readdirSync(devIconsPngPath)
                .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                .map(file => path.join(devIconsPngPath, file));
            console.log(`✅ Loaded ${assets.devIconsPng.length} DevIcons PNG`);
        }
    } catch (error) {
        console.warn('Could not load DevIcons PNG:', error.message);
    }
}

/**
 * Generate methodology slide using pptxgenjs with improved design
 * Based on the lessons learned from Python implementation
 */
async function generateMethodologySlide(outputPath) {
    // Load PNG assets first
    await loadAvailableAssets();
    // Create new presentation
    let pptx = new PptxGenJS();

    // Set presentation properties
    pptx.author = 'Slidy-Presto Generator';
    pptx.company = 'Research Lab';
    pptx.subject = 'Methodology Slide';
    pptx.title = 'Scientific Methodology Presentation';

    // Add slide with blank layout
    let slide = pptx.addSlide();

    // Define color palette (inspired by the target image)
    const colors = {
        green: '5A7454',
        lightGreen: 'F0F3F0',
        gray: '#6c757d',
        darkGray: '#343a40',
        white: 'FFFFFF'
    };

    // Add green accent line above title
    slide.addShape(pptx.ShapeType.rect, {
        x: 0.5,
        y: 0.4,
        w: 4,
        h: 0.03,
        fill: { color: colors.green },
        line: { width: 0 }
    });

    // Add main title
    slide.addText('Methodology', {
        x: 0.5,
        y: 0.6,
        w: 5.5,
        h: 0.8,
        fontSize: 48,
        fontFace: 'Arial',
        color: colors.green,
        bold: false,
        align: 'left'
    });

    // Add subtitle
    slide.addText('Describe your experimental setup, including the list of materials used.\nKeep it clear enough for others to replicate your experiment.', {
        x: 0.5,
        y: 1.5,
        w: 5.0,
        h: 1,
        fontSize: 14,
        fontFace: 'Arial',
        color: colors.gray,
        align: 'left',
        valign: 'top'
    });

    // Define positions for 2x2 grid layout
    const gridConfig = {
        leftCol: { x: 0.5, width: 2.5 },
        rightCol: { x: 3.2, width: 2.5 },
        topRow: { y: 2.8, height: 1.2 },
        bottomRow: { y: 4.2, height: 1.2 }
    };

    // Process step boxes (2x2 grid)
    const steps = [
        { text: 'Start with the\nfirst step.', pos: 'topLeft' },
        { text: 'Outline the next\nstep.', pos: 'topRight' },
        { text: 'Highlight only key\nactions.', pos: 'bottomLeft' },
        { text: 'Keep it concise.', pos: 'bottomRight' }
    ];

    steps.forEach(step => {
        let x, y;

        switch(step.pos) {
            case 'topLeft':
                x = gridConfig.leftCol.x;
                y = gridConfig.topRow.y;
                break;
            case 'topRight':
                x = gridConfig.rightCol.x;
                y = gridConfig.topRow.y;
                break;
            case 'bottomLeft':
                x = gridConfig.leftCol.x;
                y = gridConfig.bottomRow.y;
                break;
            case 'bottomRight':
                x = gridConfig.rightCol.x;
                y = gridConfig.bottomRow.y;
                break;
        }

        // Add step box background
        slide.addShape(pptx.ShapeType.rect, {
            x: x,
            y: y,
            w: gridConfig.leftCol.width,
            h: gridConfig.topRow.height,
            fill: { color: colors.lightGreen },
            line: { width: 0 }
        });

        // Add step text
        slide.addText(step.text, {
            x: x + 0.1,
            y: y,
            w: gridConfig.leftCol.width - 0.2,
            h: gridConfig.topRow.height,
            fontSize: 12,
            fontFace: 'Arial',
            color: colors.darkGray,
            align: 'left',
            valign: 'middle'
        });
    });

    // Add connecting arrows
    // 1. topLeft -> topRight
    slide.addShape(pptx.ShapeType.line, {
        x: 3.0, y: 3.4, w: 0.2, h: 0,
        line: { color: colors.green, width: 1, endArrowType: 'arrow' }
    });

    // 2. topLeft -> bottomLeft (diagonal)
    slide.addShape(pptx.ShapeType.line, {
        x: 1.75, y: 4.0, w: 0, h: 0.2,
        line: { color: colors.green, width: 1, endArrowType: 'arrow' }
    });

    // 3. bottomLeft -> bottomRight
    slide.addShape(pptx.ShapeType.line, {
        x: 3.0, y: 4.8, w: 0.2, h: 0,
        line: { color: colors.green, width: 1, endArrowType: 'arrow' }
    });

    // Add the laboratory image if present, else draw placeholder
    const imagePath = path.join(__dirname, 'assets-images', 'laboratory.jpg');
    const fs = require('fs');
    if (fs.existsSync(imagePath)) {
        slide.addImage({ path: imagePath, x: 6.0, y: 1.0, w: 3.8, h: 4.5, sizing: { type: 'contain' } });
    } else {
        slide.addShape(pptx.ShapeType.rect, { x: 6.0, y: 1.0, w: 3.8, h: 4.5, fill: { color: '#f3f4f6' }, line: { color: '#d1d5db' } });
        slide.addText('Image placeholder', { x: 6.0, y: 2.8, w: 3.8, h: 0.4, fontSize: 14, color: '#6b7280', align: 'center' });
    }

    // Save the presentation or return the pptx instance
    if (outputPath) {
        return pptx.writeFile(outputPath).then(() => ({ success: true, path: outputPath })).catch(err => ({ success: false, error: err.message }));
    }
    return { success: true, pptx };
}

// Export programmatic API
module.exports = { generatePresentation: generateMethodologySlide };

// Add main execution block for testing
if (require.main === module) {
    const outputPath = path.join(__dirname, '../output', `methodology_presentation_${new Date().toISOString().replace(/[:.]/g, '-')}.pptx`);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    console.log('🎨 Generating methodology presentation...');
    generateMethodologySlide(outputPath)
        .then(result => {
            if (result.success) {
                console.log('✅ Methodology presentation generated successfully!');
                console.log(`💾 Saved to: ${result.path}`);
            } else {
                console.error('❌ Error generating presentation:', result.error);
            }
        })
        .catch(error => {
            console.error('❌ Unexpected error:', error);
        });
}
