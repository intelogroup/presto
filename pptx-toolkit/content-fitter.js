/**
 * Smart Content Fitter for PptxGenJS
 * Automatically adjusts text sizes, wraps content, and ensures proper fitting
 */

const PptxGenJS = require('pptxgenjs');

class SmartContentFitter {
    constructor(layout = 'LAYOUT_16x9') {
        this.layout = layout;
        this.layoutDimensions = {
            'LAYOUT_16x9': { width: 10, height: 5.625 },
            'LAYOUT_4x3': { width: 10, height: 7.5 },
            'LAYOUT_16x10': { width: 10, height: 6.25 }
        };

        this.fontMetrics = {
            6: { lineHeight: 0.08, charWidth: 0.035, descender: 0.015 },
            8: { lineHeight: 0.11, charWidth: 0.045, descender: 0.02 },
            10: { lineHeight: 0.14, charWidth: 0.055, descender: 0.025 },
            12: { lineHeight: 0.17, charWidth: 0.065, descender: 0.03 },
            14: { lineHeight: 0.19, charWidth: 0.075, descender: 0.035 },
            16: { lineHeight: 0.22, charWidth: 0.085, descender: 0.04 },
            18: { lineHeight: 0.25, charWidth: 0.095, descender: 0.045 },
            20: { lineHeight: 0.28, charWidth: 0.105, descender: 0.05 },
            24: { lineHeight: 0.33, charWidth: 0.125, descender: 0.06 },
            28: { lineHeight: 0.39, charWidth: 0.145, descender: 0.07 },
            32: { lineHeight: 0.44, charWidth: 0.165, descender: 0.08 },
            36: { lineHeight: 0.5, charWidth: 0.185, descender: 0.09 },
            48: { lineHeight: 0.67, charWidth: 0.245, descender: 0.12 },
            72: { lineHeight: 1.0, charWidth: 0.367, descender: 0.18 }
        };

        this.contentTypes = {
            title: { maxLength: 100, minFontSize: 24, maxFontSize: 72, priority: 'high' },
            subtitle: { maxLength: 200, minFontSize: 14, maxFontSize: 32, priority: 'medium' },
            body: { maxLength: 1000, minFontSize: 8, maxFontSize: 24, priority: 'normal' },
            caption: { maxLength: 50, minFontSize: 6, maxFontSize: 14, priority: 'low' }
        };
    }

    /**
     * Calculate text dimensions for given font size
     */
    calculateTextDimensions(text, fontSize, containerWidth) {
        const metrics = this.fontMetrics[fontSize] || this.fontMetrics[12];
        const lines = this.wrapText(text, containerWidth, fontSize);
        const lineHeight = metrics.lineHeight;
        const totalHeight = lines.length * lineHeight;

        return {
            lines: lines,
            totalHeight: totalHeight,
            lineHeight: lineHeight,
            averageLineLength: lines.length > 0 ? lines.reduce((sum, line) => sum + line.length, 0) / lines.length : 0,
            overflow: totalHeight > (containerWidth * 0.8) // Rough heuristic for overflow detection
        };
    }

    /**
     * Wrap text to fit within container width
     */
    wrapText(text, containerWidth, fontSize) {
        const metrics = this.fontMetrics[fontSize] || this.fontMetrics[12];
        const maxCharsPerLine = Math.floor(containerWidth / metrics.charWidth);
        const words = text.split(/\s+/);
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;

            if (testLine.length <= maxCharsPerLine) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                    currentLine = word;
                } else {
                    // Word is longer than line - split it
                    const splitWord = this.splitLongWord(word, maxCharsPerLine);
                    lines.push(...splitWord.slice(0, -1));
                    currentLine = splitWord[splitWord.length - 1];
                }
            }
        }

        if (currentLine) {
            lines.push(currentLine);
        }

        return lines;
    }

    /**
     * Split long words that don't fit on a line
     */
    splitLongWord(word, maxLength) {
        const chunks = [];
        for (let i = 0; i < word.length; i += maxLength) {
            chunks.push(word.substr(i, maxLength));
        }
        return chunks;
    }

    /**
     * Find optimal font size for text to fit in container
     */
    findOptimalFontSize(text, container, contentType = 'body', options = {}) {
        const typeConfig = this.contentTypes[contentType] || this.contentTypes.body;
        const containerWidth = container.width || container.w;
        const containerHeight = container.height || container.h;

        // Conservative approach - reduce max font size by 20% to prevent overflow
        const maxFontSize = Math.floor(typeConfig.maxFontSize * 0.8);
        const startFontSize = Math.min(maxFontSize, Math.floor(containerHeight * 72)); // Rough estimate

        let bestFit = {
            fontSize: typeConfig.minFontSize,
            dimensions: null,
            fitScore: 0,
            fitted: false
        };

        // Try font sizes from reasonable to smallest, in larger steps
        for (let fontSize = startFontSize; fontSize >= typeConfig.minFontSize; fontSize -= 4) {
            const dimensions = this.calculateTextDimensions(text, fontSize, containerWidth);
            const fits = dimensions.totalHeight <= containerHeight * 0.9; // Leave 10% margin

            if (fits) {
                // Calculate fill ratio to ensure good utilization
                const metrics = this.fontMetrics[fontSize] || this.fontMetrics[12];
                const lineWidthRatio = dimensions.averageLineLength / (containerWidth / metrics.charWidth);
                const fillRatio = (dimensions.totalHeight / containerHeight) + lineWidthRatio * 0.5;

                // Better fit than previous?
                if (!bestFit.fitted || fillRatio > bestFit.fitScore) {
                    bestFit = {
                        fontSize: fontSize,
                        dimensions: dimensions,
                        fitScore: fillRatio,
                        fitted: true
                    };
                }

                // Good enough fit (70% utilization or better)
                if (fillRatio >= 0.7) {
                    break;
                }
            }
        }

        // Ensure we always have a valid result
        if (!bestFit.fitted && text) {
            // Force-fit approach: truncate or reduce to minimum
            const truncatedText = this.truncateTextIntelligently(text, Math.floor(text.length * 0.6));
            const dimensions = this.calculateTextDimensions(truncatedText, typeConfig.minFontSize, containerWidth);
            bestFit = {
                fontSize: typeConfig.minFontSize,
                dimensions: dimensions,
                fitScore: 0.3,
                fitted: true
            };
        }

        return bestFit;
    }

    /**
     * Intelligent text truncation with ellipsis
     */
    truncateTextIntelligently(text, maxLength, preserveWords = true) {
        if (text.length <= maxLength) {
            return text;
        }

        if (preserveWords) {
            const words = text.split(/\s+/);
            let truncated = '';
            let currentLength = 0;

            for (const word of words) {
                const wordWithSpace = currentLength === 0 ? word : ` ${word}`;
                if (currentLength + wordWithSpace.length + 3 > maxLength) {
                    break;
                }
                truncated += wordWithSpace;
                currentLength += wordWithSpace.length;
            }

            if (truncated.length > 0) {
                return truncated + '...';
            }
        }

        // Fall back to character truncation
        return text.substring(0, maxLength - 3) + '...';
    }

    /**
     * Create smart text element with auto-fitting
     */
    createSmartText( text, containerConfig, contentType = 'body', options = {} ) {
        const container = {
            x: containerConfig.x || 0,
            y: containerConfig.y || 0,
            width: containerConfig.width || containerConfig.w,
            height: containerConfig.height || containerConfig.h
        };

        const fitResult = this.findOptimalFontSize(text, container, contentType);

        if (!fitResult.fitted) {
            // Text doesn't fit even at minimum size - need to truncate or adjust container
            console.log(`⚠️  Text "${text.substring(0, 20)}..." doesn't fit in container. Truncating.`);

            const truncatedText = this.truncateTextIntelligently(text, Math.floor(text.length * 0.75));
            const retryFit = this.findOptimalFontSize(truncatedText, container, contentType);

            // Create text element with fallback values
            return {
                text: truncatedText,
                options: {
                    x: container.x,
                    y: container.y,
                    w: container.width,
                    h: container.height,
                    fontSize: retryFit.fontSize || this.contentTypes[contentType].minFontSize,
                    align: options.align || 'left',
                    valign: options.valign || 'top',
                    wrap: true,
                    autoFit: true,
                    shrinkText: true,
                    color: options.color || '333333',
                    fontFace: options.fontFace || 'Arial',
                    bold: options.bold || false,
                    ...options
                },
                fitInfo: {
                    originalLength: text.length,
                    truncatedLength: truncatedText.length,
                    fitAtMinSize: false,
                    containerAdjustment: this.suggestContainerAdjustment(truncatedText, container, fitResult.fontSize)
                }
            };
        }

        // Create properly fitted text element
        return {
            text: text,
            options: {
                x: container.x,
                y: container.y,
                w: container.width,
                h: container.height,
                fontSize: fitResult.fontSize,
                align: options.align || 'left',
                valign: options.valign || 'top',
                wrap: true,
                autoFit: true,
                shrinkText: true,
                color: options.color || '333333',
                fontFace: options.fontFace || 'Arial',
                bold: options.bold || false,
                ...options
            },
            fitInfo: {
                fontSize: fitResult.fontSize,
                totalHeight: fitResult.dimensions.totalHeight,
                lineCount: fitResult.dimensions.lines.length,
                averageLineLength: fitResult.dimensions.averageLineLength,
                fitScore: fitResult.fitScore,
                containerUtilization: (fitResult.dimensions.totalHeight / container.height) * 100
            }
        };
    }

    /**
     * Suggest container adjustment when text doesn't fit
     */
    suggestContainerAdjustment(text, container, fontSize) {
        const dimensions = this.calculateTextDimensions(text, fontSize, container.width);
        const neededHeight = dimensions.totalHeight + 0.2; // Add small margin

        if (neededHeight > container.height) {
            return {
                suggestedHeight: neededHeight,
                heightIncrease: neededHeight - container.height,
                reason: `Text requires ${(neededHeight - container.height).toFixed(2)}" more height`
            };
        }

        return null;
    }

    /**
     * Smart text fitting for multiple elements
     */
    fitMultipleTexts(textConfigs, layout = this.layout) {
        const fittedElements = [];
        const layoutDims = this.layoutDimensions[layout] || this.layoutDimensions['LAYOUT_16x9'];

        for (const config of textConfigs) {
            const container = {
                x: config.container.x,
                y: config.container.y,
                width: config.container.width || 3,
                height: config.container.height || 1
            };

            const fitted = this.createSmartText(
                config.text,
                container,
                config.type || 'body',
                config.options || {}
            );

            fittedElements.push(fitted);

            // Check if this element fits within layout bounds
            if (this.elementOutOfBounds(fitted.options, layoutDims)) {
                console.log(`⚠️  WARNING: Element "${config.text.substring(0, 20)}..." is out of layout bounds!`);

                // Auto-adjust position if possible
                const adjusted = this.adjustElementPosition(fitted.options, layoutDims);
                fitted.options = adjusted;
                fitted.fitInfo.adjustedPosition = true;
            }
        }

        return fittedElements;
    }

    /**
     * Check if element is within layout bounds
     */
    elementOutOfBounds(element, layoutDims) {
        return element.x < 0 ||
               element.y < 0 ||
               element.x + element.w > layoutDims.width ||
               element.y + element.h > layoutDims.height;
    }

    /**
     * Auto-adjust element position to fit within bounds
     */
    adjustElementPosition(element, layoutDims) {
        const adjusted = { ...element };

        // Clamp to boundaries
        adjusted.x = Math.max(0, Math.min(element.x, layoutDims.width - element.w));
        adjusted.y = Math.max(0, Math.min(element.y, layoutDims.height - element.h));

        return adjusted;
    }

    /**
     * Generate fitting report for multiple elements
     */
    generateFitReport(elements, layout = this.layout) {
        const report = {
            layout: layout,
            summary: {
                totalElements: elements.length,
                fittedElements: 0,
                truncatedElements: 0,
                outOfBoundsElements: 0,
                averageFontSize: 0,
                containerUtilization: 0
            },
            details: []
        };

        for (const element of elements) {
            const isTruncated = element.fitInfo.originalLength > (element.fitInfo.truncatedLength || element.text.length);
            const isOutOfBounds = element.fitInfo.adjustedPosition || false;
            const fontSize = element.options.fontSize;

            if (element.fitInfo.fitted !== false) {
                report.summary.fittedElements++;
            }

            if (isTruncated) {
                report.summary.truncatedElements++;
            }

            if (isOutOfBounds) {
                report.summary.outOfBoundsElements++;
            }

            report.summary.averageFontSize += fontSize;

            if (element.fitInfo.containerUtilization) {
                report.summary.containerUtilization += element.fitInfo.containerUtilization;
            }

            report.details.push({
                text: element.text.substring(0, 30) + (element.text.length > 30 ? '...' : ''),
                fontSize: fontSize,
                lineCount: element.fitInfo.lineCount || 1,
                truncated: isTruncated,
                outOfBounds: isOutOfBounds,
                containerUtilization: element.fitInfo.containerUtilization || 0
            });
        }

        // Calculate averages
        if (report.summary.totalElements > 0) {
            report.summary.averageFontSize /= report.summary.totalElements;
            report.summary.containerUtilization /= report.summary.totalElements;
        }

        return report;
    }

    /**
     * Print fitting report
     */
    printFitReport(report) {
        console.log('\n📏 Smart Content Fitter Report');
        console.log('═'.repeat(50));
        console.log(`Layout: ${report.layout}`);
        console.log(`Total Elements: ${report.summary.totalElements}`);
        console.log(`Successfully Fitted: ${report.summary.fittedElements}`);
        console.log(`Truncated Elements: ${report.summary.truncatedElements}`);
        console.log(`Out-of-bounds Elements: ${report.summary.outOfBoundsElements}`);
        console.log(`Average Font Size: ${report.summary.averageFontSize.toFixed(1)}pt`);
        console.log(`Average Container Utilization: ${report.summary.containerUtilization.toFixed(1)}%`);
        console.log('');

        if (report.details.length > 0) {
            console.log('🎯 Element Details:');
            report.details.forEach((detail, index) => {
                const status = [];
                if (detail.truncated) status.push('🔪');
                if (detail.outOfBounds) status.push('📍');
                const statusStr = status.length > 0 ? status.join(' ') : '✅';

                console.log(`  ${index + 1}. "${detail.text}"`);
                console.log(`     ${statusStr} ${detail.fontSize}pt, ${detail.lineCount} lines, ${detail.containerUtilization.toFixed(1)}% utilized`);
            });
        }
    }
}

module.exports = SmartContentFitter;

// CLI usage
if (require.main === module) {
    const fitter = new SmartContentFitter();
    const PptxGenJS = require('pptxgenjs');

    // Example usage with test data
    console.log('🎯 SMART CONTENT FITTER TEST');
    console.log('');

    const testTexts = [
        {
            text: 'Modern Artificial Intelligence and Machine Learning',
            container: { x: 1, y: 1, width: 4, height: 0.8 },
            type: 'title'
        },
        {
            text: 'This is a subtitle that needs to fit properly within the container boundaries',
            container: { x: 1, y: 1.9, width: 4, height: 0.6 },
            type: 'subtitle'
        },
        {
            text: 'Neural networks are computing systems inspired by biological neural networks. They learn to perform tasks by considering examples, generally without being programmed with any task-specific rules.',
            container: { x: 1, y: 2.8, width: 3.8, height: 1.2 },
            type: 'body'
        }
    ];

    console.log('Fitting text elements...');
    const fittedElements = fitter.fitMultipleTexts(testTexts);

    // Show fit results
    console.log('\nFitted Elements:');
    fittedElements.forEach((elem, index) => {
        console.log(`${index + 1}. Font: ${elem.options.fontSize}pt, Text: "${elem.text.substring(0, 40)}..."`);
    });

    // Generate and show report
    fitter.printFitReport(fitter.generateFitReport(fittedElements));

    // Example of positioning calculation
    console.log('\n📐 Container Calculation Examples:');
    const largeText = 'This is some very long text that needs to be properly wrapped and fitted within the specified container dimensions to ensure it displays correctly on the slide.';
    const fitResult = fitter.createSmartText(largeText, { x: 2, y: 3, width: 3, height: 1.5 });
    console.log(`Large text fitted at ${fitResult.options.fontSize}pt with ${fitResult.fitInfo.lineCount} lines`);
}
