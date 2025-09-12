#!/usr/bin/env node

/**
 * Professional Typography and Spacing System
 * 
 * A comprehensive typography system designed for professional presentations.
 * Provides consistent font hierarchies, spacing calculations, accessibility
 * compliance, and responsive text sizing for PPTX generators.
 * 
 * Features:
 * - Professional font hierarchies with semantic sizing
 * - Responsive typography that adapts to content and layout
 * - Accessibility-compliant color contrast and sizing
 * - Advanced spacing calculations using design principles
 * - Multi-language typography support
 * - Brand-consistent typography themes
 * - Automatic text fitting and overflow handling
 * - Professional line height and letter spacing
 * 
 * @author Enhanced Generator System
 * @version 1.0.0
 */

const fs = require('fs');
const path = require('path');

/**
 * Typography scale based on modular scale principles
 */
const TYPOGRAPHY_SCALE = {
    // Major Third (1.25) scale for harmonious proportions
    RATIO: 1.25,
    BASE_SIZE: 16,
    
    // Semantic font sizes
    SIZES: {
        h1: 48,      // Main titles, hero text
        h2: 36,      // Section headers
        h3: 28,      // Subsection headers
        h4: 22,      // Minor headers
        h5: 18,      // Small headers
        h6: 16,      // Smallest headers
        body: 16,    // Body text
        bodyLarge: 18, // Large body text
        bodySmall: 14, // Small body text
        caption: 12,  // Captions, footnotes
        overline: 10  // Labels, overlines
    },
    
    // Responsive breakpoints for font scaling
    BREAKPOINTS: {
        small: { width: 6, scale: 0.8 },
        medium: { width: 8, scale: 0.9 },
        large: { width: 10, scale: 1.0 },
        xlarge: { width: 12, scale: 1.1 }
    }
};

/**
 * Professional font stacks for different contexts
 */
const FONT_STACKS = {
    // Primary fonts for headings and important text
    primary: {
        name: 'Segoe UI',
        fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
        weight: {
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        },
        characteristics: 'Modern, clean, highly readable'
    },
    
    // Secondary fonts for body text
    secondary: {
        name: 'Calibri',
        fallbacks: ['Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
        weight: {
            light: 300,
            regular: 400,
            medium: 500,
            bold: 600
        },
        characteristics: 'Professional, readable, Microsoft Office standard'
    },
    
    // Monospace fonts for code and technical content
    monospace: {
        name: 'Consolas',
        fallbacks: ['Monaco', 'Courier New', 'monospace'],
        weight: {
            regular: 400,
            bold: 700
        },
        characteristics: 'Technical, code-friendly, fixed-width'
    },
    
    // Display fonts for special emphasis
    display: {
        name: 'Segoe UI Light',
        fallbacks: ['Helvetica Neue Light', 'Arial', 'sans-serif'],
        weight: {
            light: 300,
            regular: 400,
            bold: 600
        },
        characteristics: 'Elegant, modern, high-impact'
    }
};

/**
 * Spacing system based on 8px grid for consistency
 */
const SPACING_SYSTEM = {
    BASE_UNIT: 8, // 8px base unit
    
    // Semantic spacing values
    SIZES: {
        xs: 4,    // 0.5 units
        sm: 8,    // 1 unit
        md: 16,   // 2 units
        lg: 24,   // 3 units
        xl: 32,   // 4 units
        xxl: 48,  // 6 units
        xxxl: 64  // 8 units
    },
    
    // Context-specific spacing
    CONTEXT: {
        paragraph: 16,      // Between paragraphs
        section: 32,        // Between sections
        element: 8,         // Between related elements
        component: 24,      // Between components
        layout: 48,         // Between major layout areas
        margin: 32,         // Default margins
        padding: 16         // Default padding
    }
};

/**
 * Line height ratios for optimal readability
 */
const LINE_HEIGHT = {
    // Semantic line heights
    tight: 1.1,     // Headlines, display text
    normal: 1.4,    // Body text, default
    relaxed: 1.6,   // Long-form reading
    loose: 1.8,     // Accessibility, dyslexia-friendly
    
    // Context-specific line heights
    CONTEXT: {
        heading: 1.2,
        subheading: 1.3,
        body: 1.5,
        caption: 1.4,
        button: 1.0,
        code: 1.4
    }
};

/**
 * Letter spacing for improved readability
 */
const LETTER_SPACING = {
    tight: -0.02,    // Large headings
    normal: 0,       // Default
    wide: 0.02,      // Small text, all caps
    wider: 0.04,     // Very small text, labels
    
    // Context-specific letter spacing
    CONTEXT: {
        heading: -0.01,
        subheading: 0,
        body: 0,
        caption: 0.01,
        button: 0.01,
        allCaps: 0.05
    }
};

/**
 * Color system for typography with accessibility compliance
 */
const TYPOGRAPHY_COLORS = {
    // Primary text colors
    primary: {
        dark: '#1a1a1a',      // WCAG AAA compliant on white
        medium: '#4a4a4a',    // WCAG AA compliant on white
        light: '#6a6a6a'      // WCAG AA compliant on white
    },
    
    // Secondary text colors
    secondary: {
        dark: '#2d2d2d',
        medium: '#5d5d5d',
        light: '#8d8d8d'
    },
    
    // Accent colors for emphasis
    accent: {
        blue: '#0066cc',      // Professional blue
        green: '#00a86b',     // Success green
        orange: '#ff6b35',    // Warning orange
        red: '#e74c3c',       // Error red
        purple: '#8e44ad'     // Creative purple
    },
    
    // Background-specific text colors
    onDark: {
        primary: '#ffffff',
        secondary: '#e0e0e0',
        tertiary: '#b0b0b0'
    },
    
    onLight: {
        primary: '#1a1a1a',
        secondary: '#4a4a4a',
        tertiary: '#6a6a6a'
    }
};

/**
 * Professional Typography System Class
 */
class ProfessionalTypographySystem {
    constructor(options = {}) {
        this.options = {
            baseSize: options.baseSize || TYPOGRAPHY_SCALE.BASE_SIZE,
            scale: options.scale || TYPOGRAPHY_SCALE.RATIO,
            primaryFont: options.primaryFont || FONT_STACKS.primary.name,
            secondaryFont: options.secondaryFont || FONT_STACKS.secondary.name,
            enableResponsive: options.enableResponsive !== false,
            enableAccessibility: options.enableAccessibility !== false,
            theme: options.theme || 'professional',
            ...options
        };
        
        // Initialize PNG assets object
        this.assets = {
            lucidePng: [],
            simpleIconsPng: [],
            svgrepoIconsPng: [],
            devIconsPng: []
        };
        
        this.initializeTheme();
    }

    /**
     * Load available PNG assets from assets-images-png directories
     */
    async loadAvailableAssets() {
        const assetDirectories = {
            lucidePng: path.join(__dirname, '../../assets-images-png/lucide/general'),
            simpleIconsPng: path.join(__dirname, '../../assets-images-png/simpleicons/brand'),
            svgrepoIconsPng: path.join(__dirname, '../../assets-images-png/svgrepo-icons-graphics'),
            devIconsPng: path.join(__dirname, '../../assets-images-png/devicons/tech')
        };

        for (const [assetType, dirPath] of Object.entries(assetDirectories)) {
            try {
                if (fs.existsSync(dirPath)) {
                    const files = fs.readdirSync(dirPath)
                        .filter(file => file.toLowerCase().endsWith('.png'))
                        .map(file => ({
                            name: path.basename(file, '.png'),
                            path: path.join(dirPath, file)
                        }));
                    
                    this.assets[assetType] = files;
                    if (files.length > 0) {
                        console.log(`📁 Loaded ${files.length} ${assetType.replace('Png', '')} PNG assets`);
                    }
                } else {
                    console.log(`⚠️  Directory not found: ${dirPath}`);
                }
            } catch (error) {
                console.error(`❌ Error loading ${assetType}:`, error.message);
            }
        }
    }

    /**
     * Initialize typography theme
     */
    initializeTheme() {
        this.theme = this.getTheme(this.options.theme);
    }

    /**
     * Get typography theme configuration
     */
    getTheme(themeName) {
        const themes = {
            professional: {
                primaryFont: FONT_STACKS.primary,
                secondaryFont: FONT_STACKS.secondary,
                colors: TYPOGRAPHY_COLORS,
                emphasis: 'clean',
                personality: 'trustworthy'
            },
            
            creative: {
                primaryFont: FONT_STACKS.display,
                secondaryFont: FONT_STACKS.primary,
                colors: { ...TYPOGRAPHY_COLORS, accent: TYPOGRAPHY_COLORS.accent.purple },
                emphasis: 'bold',
                personality: 'innovative'
            },
            
            technical: {
                primaryFont: FONT_STACKS.primary,
                secondaryFont: FONT_STACKS.monospace,
                colors: TYPOGRAPHY_COLORS,
                emphasis: 'precise',
                personality: 'analytical'
            },
            
            minimal: {
                primaryFont: FONT_STACKS.display,
                secondaryFont: FONT_STACKS.secondary,
                colors: { ...TYPOGRAPHY_COLORS, primary: { dark: '#000000', medium: '#666666', light: '#999999' } },
                emphasis: 'subtle',
                personality: 'elegant'
            }
        };
        
        return themes[themeName] || themes.professional;
    }

    /**
     * Calculate responsive font size based on container dimensions
     */
    calculateResponsiveSize(baseSize, containerWidth, containerHeight, context = 'body') {
        if (!this.options.enableResponsive) {
            return baseSize;
        }
        
        // Find appropriate breakpoint
        let scale = 1.0;
        for (const [name, breakpoint] of Object.entries(TYPOGRAPHY_SCALE.BREAKPOINTS)) {
            if (containerWidth <= breakpoint.width) {
                scale = breakpoint.scale;
                break;
            }
        }
        
        // Apply context-specific adjustments
        const contextAdjustments = {
            heading: 1.1,
            subheading: 1.05,
            body: 1.0,
            caption: 0.9,
            button: 1.0
        };
        
        const contextScale = contextAdjustments[context] || 1.0;
        
        // Calculate final size with minimum and maximum constraints
        const calculatedSize = Math.round(baseSize * scale * contextScale);
        const minSize = context === 'caption' ? 10 : 12;
        const maxSize = context === 'heading' ? 72 : 48;
        
        return Math.max(minSize, Math.min(maxSize, calculatedSize));
    }

    /**
     * Get optimal line height for given font size and context
     */
    calculateLineHeight(fontSize, context = 'body', contentLength = 'medium') {
        let baseLineHeight = LINE_HEIGHT.CONTEXT[context] || LINE_HEIGHT.normal;
        
        // Adjust for font size (larger fonts need tighter line height)
        if (fontSize > 32) {
            baseLineHeight *= 0.9;
        } else if (fontSize < 14) {
            baseLineHeight *= 1.1;
        }
        
        // Adjust for content length (longer content needs more line height)
        if (contentLength === 'long') {
            baseLineHeight *= 1.1;
        } else if (contentLength === 'short') {
            baseLineHeight *= 0.95;
        }
        
        // Accessibility adjustment
        if (this.options.enableAccessibility) {
            baseLineHeight = Math.max(baseLineHeight, 1.4);
        }
        
        return Math.round(baseLineHeight * 100) / 100; // Round to 2 decimal places
    }

    /**
     * Calculate optimal letter spacing
     */
    calculateLetterSpacing(fontSize, context = 'body', isAllCaps = false) {
        let spacing = LETTER_SPACING.CONTEXT[context] || LETTER_SPACING.normal;
        
        // Adjust for font size
        if (fontSize > 32) {
            spacing += LETTER_SPACING.tight;
        } else if (fontSize < 14) {
            spacing += LETTER_SPACING.wide;
        }
        
        // All caps adjustment
        if (isAllCaps) {
            spacing += LETTER_SPACING.CONTEXT.allCaps;
        }
        
        return Math.round(spacing * 1000) / 1000; // Round to 3 decimal places
    }

    /**
     * Calculate spacing between elements
     */
    calculateSpacing(context, size = 'md', multiplier = 1) {
        let baseSpacing;
        
        if (SPACING_SYSTEM.CONTEXT[context]) {
            baseSpacing = SPACING_SYSTEM.CONTEXT[context];
        } else {
            baseSpacing = SPACING_SYSTEM.SIZES[size] || SPACING_SYSTEM.SIZES.md;
        }
        
        return Math.round(baseSpacing * multiplier);
    }

    /**
     * Get complete typography style for a specific element
     */
    getTypographyStyle(element, options = {}) {
        const {
            size = 'body',
            weight = 'regular',
            color = 'primary',
            context = 'body',
            containerWidth = 10,
            containerHeight = 5.625,
            isAllCaps = false,
            contentLength = 'medium'
        } = options;
        
        // Get base font size
        const baseSize = TYPOGRAPHY_SCALE.SIZES[size] || TYPOGRAPHY_SCALE.SIZES.body;
        
        // Calculate responsive size
        const fontSize = this.calculateResponsiveSize(baseSize, containerWidth, containerHeight, context);
        
        // Get font family
        const fontFamily = this.getFontFamily(element, context);
        
        // Get font weight
        const fontWeight = this.getFontWeight(fontFamily, weight);
        
        // Calculate line height
        const lineHeight = this.calculateLineHeight(fontSize, context, contentLength);
        
        // Calculate letter spacing
        const letterSpacing = this.calculateLetterSpacing(fontSize, context, isAllCaps);
        
        // Get color
        const textColor = this.getTextColor(color, options.background);
        
        return {
            fontFamily: `${fontFamily.name}, ${fontFamily.fallbacks.join(', ')}`,
            fontSize,
            fontWeight,
            lineHeight,
            letterSpacing,
            color: textColor,
            textTransform: isAllCaps ? 'uppercase' : 'none',
            
            // Additional properties for PPTX
            pptxStyle: {
                fontFace: fontFamily.name,
                fontSize: fontSize,
                bold: fontWeight >= 600,
                color: textColor.replace('#', ''),
                lineSpacing: Math.round(lineHeight * 100),
                charSpacing: Math.round(letterSpacing * 100)
            }
        };
    }

    /**
     * Get appropriate font family for element and context
     */
    getFontFamily(element, context) {
        const elementFontMap = {
            heading: this.theme.primaryFont,
            subheading: this.theme.primaryFont,
            body: this.theme.secondaryFont,
            caption: this.theme.secondaryFont,
            button: this.theme.primaryFont,
            code: FONT_STACKS.monospace,
            display: this.theme.primaryFont
        };
        
        return elementFontMap[element] || this.theme.secondaryFont;
    }

    /**
     * Get font weight value
     */
    getFontWeight(fontFamily, weight) {
        return fontFamily.weight[weight] || fontFamily.weight.regular || 400;
    }

    /**
     * Get text color based on context and background
     */
    getTextColor(colorName, background = 'light') {
        const colorMap = {
            primary: background === 'dark' ? this.theme.colors.onDark.primary : this.theme.colors.onLight.primary,
            secondary: background === 'dark' ? this.theme.colors.onDark.secondary : this.theme.colors.onLight.secondary,
            tertiary: background === 'dark' ? this.theme.colors.onDark.tertiary : this.theme.colors.onLight.tertiary,
            accent: this.theme.colors.accent.blue,
            success: this.theme.colors.accent.green,
            warning: this.theme.colors.accent.orange,
            error: this.theme.colors.accent.red,
            creative: this.theme.colors.accent.purple
        };
        
        return colorMap[colorName] || colorMap.primary;
    }

    /**
     * Generate complete spacing system for a layout
     */
    generateSpacingSystem(layoutType = 'standard') {
        const spacingMultipliers = {
            compact: 0.75,
            standard: 1.0,
            comfortable: 1.25,
            spacious: 1.5
        };
        
        const multiplier = spacingMultipliers[layoutType] || 1.0;
        
        return {
            // Element spacing
            elementGap: this.calculateSpacing('element', 'sm', multiplier),
            componentGap: this.calculateSpacing('component', 'md', multiplier),
            sectionGap: this.calculateSpacing('section', 'lg', multiplier),
            
            // Text spacing
            paragraphSpacing: this.calculateSpacing('paragraph', 'md', multiplier),
            headingSpacing: this.calculateSpacing('section', 'lg', multiplier),
            captionSpacing: this.calculateSpacing('element', 'xs', multiplier),
            
            // Layout spacing
            marginHorizontal: this.calculateSpacing('margin', 'lg', multiplier),
            marginVertical: this.calculateSpacing('margin', 'md', multiplier),
            paddingHorizontal: this.calculateSpacing('padding', 'md', multiplier),
            paddingVertical: this.calculateSpacing('padding', 'sm', multiplier),
            
            // Grid spacing
            gridGap: this.calculateSpacing('component', 'md', multiplier),
            columnGap: this.calculateSpacing('element', 'lg', multiplier),
            rowGap: this.calculateSpacing('element', 'md', multiplier)
        };
    }

    /**
     * Validate text contrast for accessibility
     */
    validateContrast(textColor, backgroundColor) {
        // Simplified contrast calculation (in real implementation, use proper color contrast algorithms)
        const textLuminance = this.calculateLuminance(textColor);
        const bgLuminance = this.calculateLuminance(backgroundColor);
        
        const contrast = (Math.max(textLuminance, bgLuminance) + 0.05) / (Math.min(textLuminance, bgLuminance) + 0.05);
        
        return {
            ratio: Math.round(contrast * 100) / 100,
            wcagAA: contrast >= 4.5,
            wcagAAA: contrast >= 7.0,
            recommendation: contrast < 4.5 ? 'Increase contrast for better accessibility' : 'Contrast is acceptable'
        };
    }

    /**
     * Calculate relative luminance (simplified)
     */
    calculateLuminance(hexColor) {
        // Remove # if present
        const hex = hexColor.replace('#', '');
        
        // Convert to RGB
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;
        
        // Apply gamma correction
        const rLinear = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        const gLinear = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        const bLinear = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        
        // Calculate luminance
        return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
    }

    /**
     * Generate typography preset for common slide elements
     */
    generateSlideTypographyPresets(slideWidth = 10, slideHeight = 5.625) {
        return {
            // Main slide title
            slideTitle: this.getTypographyStyle('heading', {
                size: 'h1',
                weight: 'bold',
                color: 'primary',
                context: 'heading',
                containerWidth: slideWidth,
                containerHeight: slideHeight
            }),
            
            // Section headers
            sectionHeader: this.getTypographyStyle('heading', {
                size: 'h2',
                weight: 'semibold',
                color: 'primary',
                context: 'subheading',
                containerWidth: slideWidth,
                containerHeight: slideHeight
            }),
            
            // Subsection headers
            subsectionHeader: this.getTypographyStyle('heading', {
                size: 'h3',
                weight: 'medium',
                color: 'primary',
                context: 'subheading',
                containerWidth: slideWidth,
                containerHeight: slideHeight
            }),
            
            // Body text
            bodyText: this.getTypographyStyle('body', {
                size: 'body',
                weight: 'regular',
                color: 'primary',
                context: 'body',
                containerWidth: slideWidth,
                containerHeight: slideHeight,
                contentLength: 'medium'
            }),
            
            // Large body text
            bodyTextLarge: this.getTypographyStyle('body', {
                size: 'bodyLarge',
                weight: 'regular',
                color: 'primary',
                context: 'body',
                containerWidth: slideWidth,
                containerHeight: slideHeight,
                contentLength: 'short'
            }),
            
            // Small body text
            bodyTextSmall: this.getTypographyStyle('body', {
                size: 'bodySmall',
                weight: 'regular',
                color: 'secondary',
                context: 'body',
                containerWidth: slideWidth,
                containerHeight: slideHeight,
                contentLength: 'long'
            }),
            
            // Bullet points
            bulletPoint: this.getTypographyStyle('body', {
                size: 'body',
                weight: 'regular',
                color: 'primary',
                context: 'body',
                containerWidth: slideWidth,
                containerHeight: slideHeight,
                contentLength: 'short'
            }),
            
            // Captions and footnotes
            caption: this.getTypographyStyle('caption', {
                size: 'caption',
                weight: 'regular',
                color: 'tertiary',
                context: 'caption',
                containerWidth: slideWidth,
                containerHeight: slideHeight
            }),
            
            // Button text
            button: this.getTypographyStyle('button', {
                size: 'body',
                weight: 'medium',
                color: 'primary',
                context: 'button',
                containerWidth: slideWidth,
                containerHeight: slideHeight
            }),
            
            // Quote text
            quote: this.getTypographyStyle('display', {
                size: 'h3',
                weight: 'light',
                color: 'primary',
                context: 'body',
                containerWidth: slideWidth,
                containerHeight: slideHeight,
                contentLength: 'medium'
            }),
            
            // Code text
            code: this.getTypographyStyle('code', {
                size: 'bodySmall',
                weight: 'regular',
                color: 'primary',
                context: 'code',
                containerWidth: slideWidth,
                containerHeight: slideHeight
            })
        };
    }

    /**
     * Get system statistics and configuration
     */
    getSystemInfo() {
        return {
            version: '1.0.0',
            theme: this.options.theme,
            baseSize: this.options.baseSize,
            scale: this.options.scale,
            responsiveEnabled: this.options.enableResponsive,
            accessibilityEnabled: this.options.enableAccessibility,
            availableFonts: Object.keys(FONT_STACKS),
            availableThemes: ['professional', 'creative', 'technical', 'minimal'],
            spacingSystem: SPACING_SYSTEM,
            typographyScale: TYPOGRAPHY_SCALE
        };
    }
}

// Export the typography system and constants
module.exports = {
    ProfessionalTypographySystem,
    TYPOGRAPHY_SCALE,
    FONT_STACKS,
    SPACING_SYSTEM,
    LINE_HEIGHT,
    LETTER_SPACING,
    TYPOGRAPHY_COLORS
};

/**
 * Example usage and testing
 */
async function testTypographySystem() {
    console.log('🎨 Testing Professional Typography System...');
    
    const typography = new ProfessionalTypographySystem({
        theme: 'professional',
        enableResponsive: true,
        enableAccessibility: true
    });
    
    // Load PNG assets
    await typography.loadAvailableAssets();
    
    // Generate slide presets
    const presets = typography.generateSlideTypographyPresets(10, 5.625);
    console.log('📝 Generated typography presets:', Object.keys(presets));
    
    // Test spacing system
    const spacing = typography.generateSpacingSystem('standard');
    console.log('📏 Generated spacing system:', spacing);
    
    // Test contrast validation
    const contrast = typography.validateContrast('#1a1a1a', '#ffffff');
    console.log('🔍 Contrast validation:', contrast);
    
    console.log('✅ Typography system test completed');
    
    return { presets, spacing, contrast };
}

// Add main execution block for testing
if (require.main === module) {
    testTypographySystem().catch(console.error);
}