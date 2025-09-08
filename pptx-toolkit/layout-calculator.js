/**
 * Visual Layout Calculator for PptxGenJS
 * Helps understand positioning, calculates coordinates, and visualizes layout
 */

const PptxGenJS = require('pptxgenjs');

class LayoutCalculator {
    constructor() {
        this.layouts = {
            'LAYOUT_16x9': {
                width: 10,
                height: 5.625,
                safeArea: {
                    x: 0.5,
                    y: 0.5,
                    width: 9.0,
                    height: 4.625
                }
            },
            'LAYOUT_4x3': {
                width: 10,
                height: 7.5,
                safeArea: {
                    x: 0.5,
                    y: 0.5,
                    width: 9.0,
                    height: 6.5
                }
            },
            'LAYOUT_16x10': {
                width: 10,
                height: 6.25,
                safeArea: {
                    x: 0.5,
                    y: 0.5,
                    width: 9.0,
                    height: 5.25
                }
            }
        };

        this.gridPresets = {
            '2x2': { rows: 2, cols: 2, spacing: 0.1 },
            '3x2': { rows: 3, cols: 2, spacing: 0.1 },
            '2x3': { rows: 2, cols: 3, spacing: 0.1 },
            '4x3': { rows: 4, cols: 3, spacing: 0.08 },
            'header-footer': { rows: 3, cols: 1, spacing: 0.1 },
            'sidebar-content': { rows: 1, cols: 3, spacing: 0.05, weights: [0.25, 0.65, 0.1] }
        };
    }

    /**
     * Convert relative percentages to absolute inches
     */
    toAbsolute(value, axis, layout = 'LAYOUT_16x9') {
        const dimensions = this.layouts[layout];
        if (!dimensions) throw new Error(`Unknown layout: ${layout}`);

        const maxDimension = axis === 'x' ? dimensions.width : dimensions.height;
        return (value / 100) * maxDimension;
    }

    /**
     * Convert absolute inches to relative percentages
     */
    toPercentage(value, axis, layout = 'LAYOUT_16x9') {
        const dimensions = this.layouts[layout];
        if (!dimensions) throw new Error(`Unknown layout: ${layout}`);

        const maxDimension = axis === 'x' ? dimensions.width : dimensions.height;
        return (value / maxDimension) * 100;
    }

    /**
     * Get current layout dimensions
     */
    getLayout(layout = 'LAYOUT_16x9') {
        return this.layouts[layout] || this.layouts['LAYOUT_16x9'];
    }

    /**
     * Calculate center position for an element
     */
    centerElement(element, position = 'both', layout = 'LAYOUT_16x9') {
        const dimensions = this.getLayout(layout);
        const result = { ...element };

        if (position === 'x' || position === 'both') {
            result.x = (dimensions.width - element.w) / 2;
        }

        if (position === 'y' || position === 'both') {
            result.y = (dimensions.height - element.h) / 2;
        }

        return result;
    }

    /**
     * Create a grid layout with specified rows and columns
     */
    createGrid(totalWidth, totalHeight, rows, cols, spacing = 0.1, weights = null, startX = 0, startY = 0) {
        const cellWidth = (totalWidth - (spacing * (cols - 1))) / cols;
        const cellHeight = (totalHeight - (spacing * (rows - 1))) / rows;

        const cells = [];
        let currentY = startY;

        for (let row = 0; row < rows; row++) {
            let currentX = startX;

            for (let col = 0; col < cols; col++) {
                const colWeight = weights?.cols ? weights.cols[col] || 1 : 1;
                const adjustedCellWidth = cellWidth * colWeight;
                const rowWeight = weights?.rows ? weights.rows[row] || 1 : 1;
                const adjustedCellHeight = cellHeight * rowWeight;

                cells.push({
                    x: currentX,
                    y: currentY,
                    width: adjustedCellWidth,
                    height: adjustedCellHeight,
                    row: row,
                    col: col,
                    centerX: currentX + adjustedCellWidth / 2,
                    centerY: currentY + adjustedCellHeight / 2
                });

                currentX += adjustedCellWidth + spacing;
            }

            currentY += cellHeight + spacing;
        }

        return cells;
    }

    /**
     * Use predefined grid preset
     */
    createGridPreset(presetName, totalWidth, totalHeight, startX = 0, startY = 0) {
        const preset = this.gridPresets[presetName];
        if (!preset) {
            throw new Error(`Unknown grid preset: ${presetName}. Available: ${Object.keys(this.gridPresets).join(', ')}`);
        }

        return this.createGrid(
            totalWidth,
            totalHeight,
            preset.rows,
            preset.cols,
            preset.spacing,
            preset.weights,
            startX,
            startY
        );
    }

    /**
     * Validate that element fits within bounds
     */
    validateBounds(element, layout = 'LAYOUT_16x9') {
        const dimensions = this.getLayout(layout);
        const errors = [];

        if (element.x + element.w > dimensions.width) {
            errors.push(`Element extends ${element.x + element.w - dimensions.width} inches beyond right edge`);
        }

        if (element.y + element.h > dimensions.height) {
            errors.push(`Element extends ${element.y + element.h - dimensions.height} inches beyond bottom edge`);
        }

        if (element.x < 0) {
            errors.push(`Element starts ${-element.x} inches before left edge`);
        }

        if (element.y < 0) {
            errors.push(`Element starts ${-element.y} inches before top edge`);
        }

        return {
            valid: errors.length === 0,
            errors: errors,
            suggestion: errors.length > 0 ? this.suggestCorrection(element, dimensions) : null
        };
    }

    /**
     * Suggest correction for out-of-bounds element
     */
    suggestCorrection(element, dimensions) {
        const corrected = { ...element };

        // Clamp to boundaries
        corrected.x = Math.max(0, Math.min(element.x, dimensions.width - element.w));
        corrected.y = Math.max(0, Math.min(element.y, dimensions.height - element.h));

        return corrected;
    }

    /**
     * Calculate margins for content within safe area
     */
    calculateMargins(content, margins = 0.5, layout = 'LAYOUT_16x9') {
        const dimensions = this.getLayout(layout);
        const safeArea = dimensions.safeArea;

        if (content.margin || typeof margins === 'object') {
            const effectiveMargins = content.margin || margins;
            return {
                x: safeArea.x + (effectiveMargins.left || effectiveMargins.x || effectiveMargins || 0),
                y: safeArea.y + (effectiveMargins.top || effectiveMargins.y || effectiveMargins || 0),
                width: safeArea.width - ((effectiveMargins.left || effectiveMargins.x || effectiveMargins || 0) + (effectiveMargins.right || effectiveMargins.x || effectiveMargins || 0)),
                height: safeArea.height - ((effectiveMargins.top || effectiveMargins.y || effectiveMargins || 0) + (effectiveMargins.bottom || effectiveMargins.y || effectiveMargins || 0))
            };
        } else {
            return {
                x: safeArea.x + margins,
                y: safeArea.y + margins,
                width: safeArea.width - (margins * 2),
                height: safeArea.height - (margins * 2)
            };
        }
    }

    /**
     * Calculate proportional positioning
     */
    calculateProportional(element, reference, ratio) {
        return {
            x: reference.x + (reference.width * ratio.x),
            y: reference.y + (reference.height * ratio.y),
            w: reference.width * ratio.width,
            h: reference.height * ratio.height
        };
    }

    /**
     * Generate visual representation of layout
     */
    generateLayoutVisual(layout = 'LAYOUT_16x9') {
        const dimensions = this.getLayout(layout);
        let visual = '';

        visual += `┌${'─'.repeat(Math.floor(dimensions.width * 4))}┐\n`;
        visual += `│${' '.repeat(Math.floor(dimensions.width * 4))}│ Layout: ${layout}\n`;
        visual += `│${' '.repeat(Math.floor(dimensions.width * 4))}│ Size: ${dimensions.width}" × ${dimensions.height}"\n`;
        visual += `│${' '.repeat(Math.floor(dimensions.width * 4))}│ Safe: ${dimensions.safeArea.width}" × ${dimensions.safeArea.height}"\n`;
        visual += `└${'─'.repeat(Math.floor(dimensions.width * 4))}┘\n`;

        return visual;
    }

    /**
     * Calculate element relationships
     */
    calculateRelationships(elements) {
        const relationships = {
            alignments: [],
            overlaps: [],
            spacings: []
        };

        for (let i = 0; i < elements.length; i++) {
            for (let j = i + 1; j < elements.length; j++) {
                const elem1 = elements[i];
                const elem2 = elements[j];

                // Check horizontal alignment
                if (Math.abs(elem1.y - elem2.y) < 0.1) {
                    relationships.alignments.push(`Elements ${i+1} and ${j+1}: Horizontally aligned`);
                }

                // Check vertical alignment
                if (Math.abs(elem1.x - elem2.x) < 0.1) {
                    relationships.alignments.push(`Elements ${i+1} and ${j+1}: Vertically aligned`);
                }

                // Check overlap
                if (this.elementsOverlap(elem1, elem2)) {
                    relationships.overlaps.push(`Elements ${i+1} and ${j+1}: Overlapping!`);
                }

                // Calculate spacing
                const spacing = this.calculateSpacing(elem1, elem2);
                if (spacing > 0) {
                    relationships.spacings.push(`Elements ${i+1} and ${j+1}: ${spacing.toFixed(2)}" apart`);
                }
            }
        }

        return relationships;
    }

    /**
     * Check if two elements overlap
     */
    elementsOverlap(elem1, elem2) {
        return !(elem1.x + elem1.w <= elem2.x ||
                elem2.x + elem2.w <= elem1.x ||
                elem1.y + elem1.h <= elem2.y ||
                elem2.y + elem2.h <= elem1.y);
    }

    /**
     * Calculate minimum spacing between elements
     */
    calculateSpacing(elem1, elem2) {
        const overlaps = [
            elem1.x + elem1.w - elem2.x, // elem1 right to elem2 left
            elem2.x + elem2.w - elem1.x, // elem2 right to elem1 left
            elem1.y + elem1.h - elem2.y, // elem1 bottom to elem2 top
            elem2.y + elem2.h - elem1.y  // elem2 bottom to elem1 top
        ];

        const minOverlap = Math.min(...overlaps);
        return minOverlap > 0 ? minOverlap : 0;
    }

    /**
     * Generate debug slide showing layout calculations
     */
    generateDebugSlide(elements = [], layout = 'LAYOUT_16x9') {
        const pres = new PptxGenJS();
        const dimensions = this.getLayout(layout);

        pres.defineLayout({
            name: 'DEBUG_LAYOUT',
            width: dimensions.width,
            height: dimensions.height
        });
        pres.layout = 'DEBUG_LAYOUT';

        const slide = pres.addSlide();
        slide.background = { color: 'F5F5F5' };

        // Draw slide boundaries
        slide.addShape('rect', {
            x: 0, y: 0,
            w: dimensions.width, h: dimensions.height,
            line: { color: 'FF0000', width: 4 },
            fill: { color: 'FFFFFF' }
        });

        // Draw safe area
        const safeArea = dimensions.safeArea;
        slide.addShape('rect', {
            x: safeArea.x, y: safeArea.y,
            w: safeArea.width, h: safeArea.height,
            line: { color: '00FF00', width: 2, style: 'dashed' },
            fill: { color: 'transparent' }
        });

        // Add labels
        slide.addText('SLIDE BOUNDARY', {
            x: 0.1, y: 0.1, w: 2, h: 0.3,
            fontSize: 10, color: 'FF0000', bold: true
        });

        slide.addText('SAFE AREA', {
            x: safeArea.x, y: safeArea.y + safeArea.height - 0.3, w: 1.5, h: 0.2,
            fontSize: 8, color: '00FF00', bold: true
        });

        // Draw elements
        elements.forEach((element, index) => {
            slide.addShape('rect', {
                x: element.x, y: element.y,
                w: element.w, h: element.h,
                line: { color: '0000FF', width: 1 },
                fill: { color: 'E0E0FF', transparency: 50 }
            });

            slide.addText(`${index + 1}`, {
                x: element.x, y: element.y, w: 0.2, h: 0.2,
                fontSize: 8, color: 'FFFFFF',
                align: 'center', valign: 'middle'
            });
        });

        return pres;
    }

    /**
     * Show comprehensive layout report
     */
    generateLayoutReport(elements = [], layout = 'LAYOUT_16x9') {
        const report = {
            layout: this.getLayout(layout),
            elements: elements.map((elem, index) => ({
                id: index + 1,
                x: elem.x,
                y: elem.y,
                width: elem.w,
                height: elem.h,
                bounds: this.validateBounds(elem, layout)
            })),
            calculations: this.calculateRelationships(elements)
        };

        console.log('\n📐 Layout Calculator Report');
        console.log('═'.repeat(50));
        console.log(`Layout: ${layout}`);
        console.log(`Dimensions: ${report.layout.width}" × ${report.layout.height}"`);
        console.log(`Safe Area: ${report.layout.safeArea.width}" × ${report.layout.safeArea.height}"`);
        console.log('');

        if (elements.length > 0) {
            console.log('🔲 Elements:');
            report.elements.forEach(elem => {
                console.log(`  Element ${elem.id}: (${elem.x.toFixed(2)}", ${elem.y.toFixed(2)}") ${elem.width}" × ${elem.height}"`);
                if (!elem.bounds.valid) {
                    console.log(`    ⚠️  ${elem.bounds.errors.join(', ')}`);
                    if (elem.bounds.suggestion) {
                        console.log(`    💡 Suggested: (${elem.bounds.suggestion.x.toFixed(2)}", ${elem.bounds.suggestion.y.toFixed(2)}")`);
                    }
                }
            });
            console.log('');

            console.log('🔗 Relationships:');
            report.calculations.alignments.forEach(alignment => console.log(`  ${alignment}`));
            report.calculations.overlaps.forEach(overlap => console.log(`  ⚠️  ${overlap}`));
            report.calculations.spacings.forEach(spacing => console.log(`  📏 ${spacing}`));
        }

        return report;
    }
}

module.exports = LayoutCalculator;

// CLI usage
if (require.main === module) {
    const calculator = new LayoutCalculator();

    console.log('🔔 LAYOUT CALCULATOR');
    console.log('');

    // Show visual layout
    console.log(calculator.generateLayoutVisual('LAYOUT_16x9'));

    // Test center calculation
    const testElement = { x: 2, y: 1, w: 2, h: 1.5 };
    const centered = calculator.centerElement(testElement);
    console.log('📍 Centered element:', centered);

    // Test grid creation
    const safeArea = calculator.getLayout().safeArea;
    const grid = calculator.createGrid(safeArea.width, safeArea.height, 2, 3, 0.2, null, safeArea.x, safeArea.y);
    console.log('🎛️  2x3 Grid:');
    grid.forEach((cell, index) => {
        console.log(`  Cell ${index + 1}: (${cell.x.toFixed(1)}", ${cell.y.toFixed(1)}") ${cell.width.toFixed(1)}" × ${cell.height.toFixed(1)}"`);
    });

    // Show layout report
    calculator.generateLayoutReport(grid.slice(0, 3));
}
