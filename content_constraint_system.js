const PptxGenJS = require('pptxgenjs');

/**
 * Content Constraint System for PptxGenJS
 * Prevents content overflow by managing slide dimensions and content fitting
 */
class ContentConstraintSystem {
    constructor() {
        // Standard PowerPoint slide dimensions in inches
        this.layouts = {
            'LAYOUT_16x9': { width: 10, height: 5.625 },
            'LAYOUT_4x3': { width: 10, height: 7.5 },
            'A3': { width: 16.5, height: 11.7 },
            'A4': { width: 11.7, height: 8.3 }
        };
        
        // Safe content areas (accounting for margins)
        this.safeAreas = {
            'LAYOUT_16x9': { 
                x: 0.5, y: 0.5, 
                width: 9, height: 4.625,
                maxTextWidth: 8.5, maxTextHeight: 4.125
            },
            'LAYOUT_4x3': { 
                x: 0.5, y: 0.5, 
                width: 9, height: 6.5,
                maxTextWidth: 8.5, maxTextHeight: 6
            }
        };
        
        // Font size to line height ratios (approximate)
        this.fontMetrics = {
            8: { lineHeight: 0.11, charWidth: 0.06 },
            10: { lineHeight: 0.14, charWidth: 0.07 },
            12: { lineHeight: 0.17, charWidth: 0.08 },
            14: { lineHeight: 0.19, charWidth: 0.09 },
            16: { lineHeight: 0.22, charWidth: 0.10 },
            18: { lineHeight: 0.25, charWidth: 0.11 },
            20: { lineHeight: 0.28, charWidth: 0.12 },
            24: { lineHeight: 0.33, charWidth: 0.14 },
            28: { lineHeight: 0.39, charWidth: 0.16 },
            32: { lineHeight: 0.44, charWidth: 0.18 }
        };
    }
    
    /**
     * Get safe positioning area for a layout
     */
    getSafeArea(layout = 'LAYOUT_16x9') {
        return this.safeAreas[layout] || this.safeAreas['LAYOUT_16x9'];
    }
    
    /**
     * Calculate optimal font size for given text and container
     */
    calculateOptimalFontSize(text, containerWidth, containerHeight, maxFontSize = 24) {
        const lines = text.split('\n');
        const maxLineLength = Math.max(...lines.map(line => line.length));
        
        // Try font sizes from largest to smallest
        for (let fontSize = maxFontSize; fontSize >= 8; fontSize -= 2) {
            const metrics = this.fontMetrics[fontSize] || this.fontMetrics[12];
            
            // Check if text fits horizontally
            const textWidth = maxLineLength * metrics.charWidth;
            if (textWidth > containerWidth) continue;
            
            // Check if text fits vertically
            const textHeight = lines.length * metrics.lineHeight;
            if (textHeight > containerHeight) continue;
            
            return fontSize;
        }
        
        return 8; // Minimum readable font size
    }
    
    /**
     * Truncate text to fit within constraints
     */
    truncateText(text, maxWidth, fontSize = 12) {
        const metrics = this.fontMetrics[fontSize] || this.fontMetrics[12];
        const maxCharsPerLine = Math.floor(maxWidth / metrics.charWidth);
        
        const lines = text.split('\n');
        const truncatedLines = lines.map(line => {
            if (line.length <= maxCharsPerLine) return line;
            return line.substring(0, maxCharsPerLine - 3) + '...';
        });
        
        return truncatedLines.join('\n');
    }
    
    /**
     * Split long text into multiple text boxes
     */
    splitTextIntoBoxes(text, containerWidth, containerHeight, fontSize = 12) {
        const metrics = this.fontMetrics[fontSize] || this.fontMetrics[12];
        const maxCharsPerLine = Math.floor(containerWidth / metrics.charWidth);
        const maxLines = Math.floor(containerHeight / metrics.lineHeight);
        const maxCharsPerBox = maxCharsPerLine * maxLines;
        
        if (text.length <= maxCharsPerBox) {
            return [text];
        }
        
        const boxes = [];
        let remainingText = text;
        
        while (remainingText.length > 0) {
            let chunk = remainingText.substring(0, maxCharsPerBox);
            
            // Try to break at word boundaries
            if (remainingText.length > maxCharsPerBox) {
                const lastSpace = chunk.lastIndexOf(' ');
                if (lastSpace > maxCharsPerBox * 0.7) {
                    chunk = chunk.substring(0, lastSpace);
                }
            }
            
            boxes.push(chunk.trim());
            remainingText = remainingText.substring(chunk.length).trim();
        }
        
        return boxes;
    }
    
    /**
     * Create constrained text options
     */
    createConstrainedTextOptions(text, x, y, width, height, options = {}) {
        const fontSize = options.fontSize || 
            this.calculateOptimalFontSize(text, width, height, options.maxFontSize || 24);
        
        const constrainedText = this.truncateText(text, width, fontSize);
        
        return {
            x: x,
            y: y,
            w: width,
            h: height,
            fontSize: fontSize,
            color: options.color || '333333',
            align: options.align || 'left',
            valign: options.valign || 'top',
            wrap: true,
            shrinkText: true,
            autoFit: true,
            margin: options.margin || 0.1,
            ...options
        };
    }
    
    /**
     * Create a grid layout system
     */
    createGridLayout(layout = 'LAYOUT_16x9', rows = 2, cols = 2) {
        const safeArea = this.getSafeArea(layout);
        const cellWidth = safeArea.width / cols;
        const cellHeight = safeArea.height / rows;
        
        const grid = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                grid.push({
                    x: safeArea.x + (col * cellWidth),
                    y: safeArea.y + (row * cellHeight),
                    width: cellWidth * 0.9, // 10% margin between cells
                    height: cellHeight * 0.9,
                    row: row,
                    col: col
                });
            }
        }
        
        return grid;
    }
    
    /**
     * Validate and adjust positioning to prevent overflow
     */
    validatePosition(x, y, width, height, layout = 'LAYOUT_16x9') {
        const layoutDims = this.layouts[layout];
        
        // Ensure content doesn't exceed slide boundaries
        const maxX = Math.max(0, layoutDims.width - width);
        const maxY = Math.max(0, layoutDims.height - height);
        
        return {
            x: Math.min(Math.max(0, x), maxX),
            y: Math.min(Math.max(0, y), maxY),
            width: Math.min(width, layoutDims.width),
            height: Math.min(height, layoutDims.height)
        };
    }
    
    /**
     * Create responsive text that adapts to container size
     */
    addResponsiveText(slide, text, container, options = {}) {
        const validated = this.validatePosition(
            container.x, container.y, 
            container.width, container.height, 
            options.layout
        );
        
        const textOptions = this.createConstrainedTextOptions(
            text, validated.x, validated.y, 
            validated.width, validated.height, 
            options
        );
        
        slide.addText(text, textOptions);
        
        return {
            actualText: text,
            options: textOptions,
            container: validated
        };
    }
    
    /**
     * Create a presentation with proper constraints
     */
    createConstrainedPresentation(layout = 'LAYOUT_16x9') {
        const pres = new PptxGenJS();
        
        // Set layout if custom
        if (!layout.startsWith('LAYOUT_')) {
            const customLayout = this.layouts[layout];
            if (customLayout) {
                pres.defineLayout({ 
                    name: layout, 
                    width: customLayout.width, 
                    height: customLayout.height 
                });
                pres.layout = layout;
            }
        } else {
            pres.layout = layout;
        }
        
        return pres;
    }
}

module.exports = ContentConstraintSystem;

// Example usage:
if (require.main === module) {
    const constraintSystem = new ContentConstraintSystem();
    
    // Create a presentation with constraints
    const pres = constraintSystem.createConstrainedPresentation('LAYOUT_16x9');
    const slide = pres.addSlide();
    
    // Add constrained content
    const safeArea = constraintSystem.getSafeArea('LAYOUT_16x9');
    
    // Title with auto-sizing
    constraintSystem.addResponsiveText(
        slide,
        'Content Constraint System Demo',
        { x: safeArea.x, y: safeArea.y, width: safeArea.width, height: 1 },
        { fontSize: 24, align: 'center', bold: true, color: '2F5597' }
    );
    
    // Body text with overflow protection
    const longText = `This is a demonstration of the content constraint system. 
It automatically calculates optimal font sizes, prevents text overflow, 
and ensures content fits within slide boundaries. 
The system handles multiple lines, long text, and various layouts 
while maintaining readability and professional appearance.`;
    
    constraintSystem.addResponsiveText(
        slide,
        longText,
        { x: safeArea.x, y: safeArea.y + 1.2, width: safeArea.width, height: 3 },
        { maxFontSize: 16, align: 'left' }
    );
    
    // Grid layout example
    const grid = constraintSystem.createGridLayout('LAYOUT_16x9', 2, 2);
    grid.forEach((cell, index) => {
        constraintSystem.addResponsiveText(
            slide,
            `Grid Cell ${index + 1}\nRow: ${cell.row}\nCol: ${cell.col}`,
            cell,
            { fontSize: 12, align: 'center', color: '666666' }
        );
    });
    
    pres.writeFile({ fileName: 'constraint_system_demo.pptx' })
        .then(() => console.log('✅ Constraint system demo created successfully!'))
        .catch(err => console.error('❌ Error:', err));
}