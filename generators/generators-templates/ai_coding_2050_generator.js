#!/usr/bin/env node

/**
 * AI Coding in 2050 Presentation Generator
 * Custom layouts with specified design language:
 * - White background theme with dark blue and orange accents
 * - Image on right, text blocks on left layouts
 * - Multiple stacked image and text combinations
 * - Table and bullet point slides
 * - Dark blue backgrounds with white/orange text
 * - Vertical image stacking on right side
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

// Correct PowerPoint 16:9 Layout Constants (from docs)
const PPTX_LAYOUT = {
    WIDTH: 10,      // PowerPoint 16:9 width
    HEIGHT: 5.625   // PowerPoint 16:9 height
};

// Utility function for reading file paths (from docs)
function readFilePaths(dirPath) {
    if (!dirPath || typeof dirPath !== 'string') return [];

    const absolutPaths = [];
    try {
        if (!fs.existsSync(dirPath)) {
            console.log(`Path does not exist: ${dirPath}`);
            return [];
        }

        const items = fs.readdirSync(dirPath);
        items.forEach(item => {
            const itemPath = path.join(dirPath, item);
            const stat = fs.statSync(itemPath);
            if (stat.isFile()) {
                absolutPaths.push(itemPath);
            }
        });
    } catch (error) {
        console.log(`Error reading directory ${dirPath}:`, error.message);
        return [];
    }

    return absolutPaths;
}

class AICoding2050Generator {
    constructor() {
        this.pres = new PptxGenJS();
        this.setupPresentation();
        this.loadAvailableAssets();
    }

    /**
     * Get asset with smart prioritization based on slide type
     * - Slide 4 (paradigms): Use only icons
     * - Slides 1,2,5,6: Use Unsplash images, fallback to SVGrepo
     * - Other slides: Use SVGrepo images
     */
    getSmartAsset(slideIndex, category, index = 0) {
        // Slide 4 (0-indexed as 3): Only use icons - no images
        if (slideIndex === 3) {
            return this.getAsset('icons', index);
        }

        // For icon requests in general, return icons
        if (category === 'icons') {
            return this.getAsset('icons', index);
        }

        // Slides 1,2,5,6 (indices 0,1,4,5): Prefer Unsplash over SVGrepo
        const unsplashSlides = [0, 1, 4, 5]; // Slides that get Unsplash priority
        if (unsplashSlides.includes(slideIndex)) {
            const unsplashAsset = this.getAsset('unsplash', index);
            if (unsplashAsset) {
                return unsplashAsset;
            }

            // Fallback to SVGrepo if no Unsplash available
            return this.getAsset('svgrepo', index);
        }

        // For other slides: Use SVGrepo images
        return this.getAsset('svgrepo', index);
    }

    /**
     * Set up presentation with the white/dark blue/orange theme
     */
    setupPresentation() {
        // Define layout (16:9 aspect ratio)
        this.pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
        this.pres.layout = 'LAYOUT_16x9';

        // Set presentation properties
        this.pres.author = 'AI Coding 2050 Generator';
        this.pres.title = 'AI Coding in 2050';
        this.pres.subject = 'Exploring the future of programming with artificial intelligence';

        // Define the specified color scheme
        this.colors = {
            background: '#FFFFFF',   // White background
            primary: '#1E3A8A',      // Dark blue
            secondary: '#EA580C',    // Orange
            text: '#1F2937',         // Dark gray for body text
            accent: '#F59E0B',       // Light orange
            lightBlue: '#3B82F6',    // Light blue for variations
            darkText: '#FFFFFF'      // White text for dark backgrounds
        };
    }

    /**
     * Load available assets from the file system
     */
    loadAvailableAssets() {
        this.assets = {
            icons: [],
            images: [],
            svgrepo: [],
            unsplash: [],
            svgrepoIcons: []
        };

        // Load technology icons using readFilePaths utility
        const techPath = path.join(__dirname, '..', '..', 'assets-icons', 'simpleicons', 'brand');
        this.assets.icons = readFilePaths(techPath).filter(file =>
            file.match(/\.(svg|png)$/i));

        // Load general images using readFilePaths utility (SVG files need conversion or use JPG/PNG path)
        const imagesPath = path.join(__dirname, '..', '..', 'assets-images-png', 'simpleicons', 'brand');  // PNG versions
        this.assets.images = readFilePaths(imagesPath).filter(file =>
            file.match(/\.(jpg|jpeg|png)$/i));

        // Load svgrepo infographics PNG versions using readFilePaths utility
        const svgrepoPath = path.join(__dirname, '..', '..', 'assets-images', 'infographics', 'svgrepo_png');
        this.assets.svgrepo = readFilePaths(svgrepoPath).filter(file =>
            file.match(/\.(jpg|jpeg|png)$/i));

        // Load SVG Repo icons (larger PNG versions for presentations)
        const svgrepoIconsPath = path.join(__dirname, '..', '..', 'assets-images-png', 'svgrepo-icons-graphics');
        this.assets.svgrepoIcons = readFilePaths(svgrepoIconsPath).filter(file =>
            file.match(/\.(jpg|jpeg|png)$/i));

        // Load tech icons (PNG versions)
        const techIconPath = path.join(__dirname, '..', '..', 'assets-images-png', 'devicons', 'tech');
        this.assets.techIcons = readFilePaths(techIconPath).filter(file =>
            file.match(/\.(jpg|jpeg|png)$/i));

        // Load Lucide general icons (PNG versions)
        const lucidePath = path.join(__dirname, '..', '..', 'assets-images-png', 'lucide', 'general');
        this.assets.lucideIcons = readFilePaths(lucidePath).filter(file =>
            file.match(/\.(jpg|jpeg|png)$/i));

        // Load Unsplash business images for slides 1,2,5,6 (index 0,1,4,5)
        const unsplashPath = path.join(__dirname, '..', '..', 'assets-images', 'unsplash', 'business');
        this.assets.unsplash = readFilePaths(unsplashPath).filter(file =>
            file.match(/\.(jpg|jpeg|png)$/i));

        console.log(`📦 AI Coding 2050 Assets Loaded: ${this.assets.icons.length} icons, ${this.assets.images.length} images, ${this.assets.svgrepo.length} infographics, ${this.assets.unsplash.length} unsplash images, ${this.assets.lucideIcons.length} lucide icons, ${this.assets.svgrepoIcons.length} svgrepo icons`);
    }

    /**
     * Get asset by index with fallback
     */
    getAsset(type, index) {
        const assets = this.assets[type] || [];
        return assets[index] || assets[0] || null;
    }

    /**
     * Safe existsSync wrapper to avoid deprecation warnings
     */
    safeExistsSync(filePath) {
        try {
            if (typeof filePath !== 'string' || filePath.trim() === '') {
                return false;
            }
            return fs.existsSync(filePath);
        } catch (error) {
            return false;
        }
    }

    /**
     * Get specific icon by name pattern
     */
    getIcon(name) {
        if (!this.assets.icons || this.assets.icons.length === 0) return null;

        const matches = this.assets.icons.filter(icon =>
            path.basename(icon).toLowerCase().includes(name.toLowerCase())
        );

        return matches.length > 0 ? matches[0] : this.assets.icons[Math.floor(Math.random() * this.assets.icons.length)];
    }

    /**
     * Get specific Lucide icon by name
     */
    getLucideIcon(name) {
        if (!this.assets.lucideIcons || this.assets.lucideIcons.length === 0) return null;

        const matches = this.assets.lucideIcons.filter(icon =>
            path.basename(icon).toLowerCase().includes(name.toLowerCase())
        );

        return matches.length > 0 ? matches[0] : null;
    }

    /**
     * Get specific SVG Repo icon by name
     */
    getSvgRepoIcon(name) {
        if (!this.assets.svgrepoIcons || this.assets.svgrepoIcons.length === 0) return null;

        const matches = this.assets.svgrepoIcons.filter(icon =>
            path.basename(icon).toLowerCase().includes(name.toLowerCase())
        );

        return matches.length > 0 ? matches[0] : null;
    }

    /**
     * Generate the complete AI Coding 2050 presentation
     */
    async generatePresentation() {
        console.log('🎨 Generating "AI Coding in 2050" Presentation with Custom Layouts...');

        try {
            // Title slide
            this.createTitleSlide();

            // Slide 1: Two images stacked on right, two text blocks on left
            this.createStackedImagesTextLeftSlide();

            // Slide 2: Image on right, comprehensive text on left (AI Evolution)
            this.createImageRightComprehensiveTextSlide();

            // Slide 3: 3 text blocks with AI/ML icons
            this.createThreeTextBlocksWithIconsSlide();

            // Slide 4: Information table on right, bullet points on left
            this.createTableRightBulletsLeftSlide();

            // Slide 5: Image covering 30% right, bullet points on left
            this.createImage30PercentBulletsSlide();

            // Slide 6: 40% left dark blue background with white/orange text, 60% right with two stacked images
            this.createDarkBlueBackgroundStackedImagesSlide();

            // Slide 7: AI coding tools and frameworks
            this.createAICodingToolsSlide();

            // Slide 8: Ethical considerations
            this.createEthicsSlide();

            // Slide 9: Future predictions
            this.createFuturePredictionsSlide();

            // Final conclusion slide
            this.createConclusionSlide();

            // Save presentation
            const outputPath = await this.savePresentation();

            console.log('✅ "AI Coding in 2050" presentation generated successfully!');
            console.log(`💾 Saved to: ${outputPath}`);

            return {
                success: true,
                outputPath,
                slides: 10,
                theme: 'Dark Blue & Orange',
                layouts: 6  // Unique layout types used
            };

        } catch (error) {
            console.error('❌ Error generating AI Coding presentation:', error);
            throw error;
        }
    }

    /**
     * Create title slide
     */
    createTitleSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Main title
        slide.addText('AI Coding in 2050', {
            x: 1, y: 1.5, w: 8, h: 1.2,
            fontSize: 48,
            bold: true,
            color: this.colors.primary,
            align: 'center',
            fontFace: 'Calibri'
        });

        // Subtitle
        slide.addText('The Future of Programming with Artificial Intelligence', {
            x: 1, y: 2.8, w: 8, h: 0.8,
            fontSize: 24,
            color: this.colors.secondary,
            align: 'center',
            fontFace: 'Calibri'
        });

        //futuristic accent line
        slide.addShape('rect', {
            x: 2, y: 4.2, w: 6, h: 0.08,
            fill: { color: this.colors.accent }
        });

        console.log('✓ Created AI Coding 2050 title slide');
    }

    /**
     * Slide 1: Two images stacked on right, two text blocks on left
     */
    createStackedImagesTextLeftSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('AI-Powered Development Revolution', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 32,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Left side - First text block (AI Assistance)
        slide.addText('Natural Language Coding', {
            x: 0.5, y: 1.3, w: 4.5, h: 0.5,
            fontSize: 20,
            bold: true,
            color: this.colors.primary
        });

        slide.addText('Developers will write code using plain English instructions. AI understands context and generates production-ready code from simple descriptions like "create a user authentication system" or "build a data visualization dashboard."', {
            x: 0.5, y: 1.9, w: 4.5, h: 1.6,
            fontSize: 16,
            color: this.colors.text,
            align: 'left'
        });

        // Left side - Second text block (Intelligent Debugging)
        slide.addText('Intelligent Debugging & Optimization', {
            x: 0.5, y: 3.7, w: 4.5, h: 0.5,
            fontSize: 20,
            bold: true,
            color: this.colors.secondary
        });

        slide.addText('AI analyzes entire codebases instantly, identifying bugs, performance bottlenecks, and security vulnerabilities before they reach production. Automatic code optimization reduces runtime by 40-60%.', {
            x: 0.5, y: 4.3, w: 4.5, h: 1.2,
            fontSize: 16,
            color: this.colors.text,
            align: 'left'
        });

        // Right side - Top stacked image (AI/Brain representation) - Use Unsplash
        const topImage = this.getSmartAsset(0, 'unsplash', 0);  // Slide 1 (0-indexed)
        if (topImage && this.safeExistsSync(topImage)) {
            slide.addImage({
                path: topImage,
                x: 5.5, y: 1.3, w: 4, h: 1.8,
                transparency: 15,
                sizing: { type: 'contain' }
            });
        }

        // Right side - Bottom stacked image (Code/Data representation) - Use Unsplash
        const bottomImage = this.getSmartAsset(0, 'unsplash', 1);  // Slide 1 (0-indexed)
        if (bottomImage && this.safeExistsSync(bottomImage)) {
            slide.addImage({
                path: bottomImage,
                x: 5.5, y: 3.3, w: 4, h: 1.8,
                transparency: 15,
                sizing: { type: 'contain' }
            });
        }

        console.log('✓ Created stacked images text blocks slide');
    }

    /**
     * Slide 2: Comprehensive text on left, image on right
     */
    createImageRightComprehensiveTextSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('The AI Development Workflow of Tomorrow', {
            x: 0.5, y: 0.3, w: 6, h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colors.primary
        });

        // Left side comprehensive content
        const workflowPoints = [
            { text: 'Idea → AI generates initial architecture and codebase', options: { bullet: true } },
            { text: 'Natural language refinements for specific requirements', options: { bullet: true } },
            { text: 'Automated testing and continuous integration', options: { bullet: true } },
            { text: 'Real-time performance monitoring and optimization', options: { bullet: true } },
            { text: 'Predictive bug detection and prevention', options: { bullet: true } },
            { text: 'Automatic documentation and API generation', options: { bullet: true } },
            { text: 'Continuous learning from successful patterns', options: { bullet: true } },
            { text: 'Cross-platform deployment optimization', options: { bullet: true } }
        ];

        slide.addText(workflowPoints, {
            x: 0.5, y: 1.3, w: 6, h: 3.5,
            fontSize: 14,
            color: this.colors.text
        });

        // Right side large image (AI/Development workflow visualization) - Use Unsplash
        const workflowImage = this.getSmartAsset(1, 'unsplash', 2);  // Slide 2 (0-indexed as 1)
        if (workflowImage && this.safeExistsSync(workflowImage)) {
            slide.addImage({
                path: workflowImage,
                x: 7, y: 1.3, w: 2.5, h: 3.5,
                transparency: 10,
                sizing: { type: 'contain' }
            });
        } else {
            slide.addShape('rect', {
                x: 7, y: 1.3, w: 2.5, h: 3.5,
                fill: { color: '#F3F4F6' },
                line: { width: 2, color: this.colors.primary }
            });
            slide.addText('AI\nWorkflow\nVisualization', {
                x: 7, y: 2, w: 2.5, h: 1.5,
                fontSize: 16,
                color: this.colors.primary,
                align: 'center',
                valign: 'middle'
            });
        }

        console.log('✓ Created comprehensive text with image slide');
    }

    /**
     * Slide 3: 3 text blocks with AI/ML icons
     */
    createThreeTextBlocksWithIconsSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('AI Development Paradigms', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Three columns with AI/ML focus
        const columns = [
            {
                title: 'Contextual Code Generation',
                description: 'AI understands project context and generates code that fits existing architecture patterns.',
                iconName: 'technology-idea',
                x: 0.5
            },
            {
                title: 'Intelligent Testing',
                description: 'Automated test generation with edge case detection and comprehensive coverage analysis.',
                iconName: 'business-strategy',
                x: 3.5
            },
            {
                title: 'Predictive Architecture',
                description: 'AI designs scalable system architectures based on usage patterns and requirements.',
                iconName: 'technology',
                x: 6.5
            }
        ];

        columns.forEach((col, index) => {
            // Get the specific SvgRepo icon
            const iconPath = this.getSvgRepoIcon(col.iconName);
            
            if (iconPath && this.safeExistsSync(iconPath)) {
                // Add the PNG icon image
                slide.addImage({
                    path: iconPath,
                    x: col.x + 0.75, y: 1.5, w: 1.5, h: 1.5,
                    sizing: { type: 'contain', w: 1.5, h: 1.5 }
                });
            }
            // No fallback placeholder - just skip if icon not found

            // Title
            slide.addText(col.title, {
                x: col.x, y: 3.2, w: 3, h: 0.6,
                fontSize: 16,
                bold: true,
                color: this.colors.primary,
                align: 'center'
            });

            // Description
            slide.addText(col.description, {
                x: col.x, y: 3.9, w: 3, h: 1.2,
                fontSize: 12,
                color: this.colors.text,
                align: 'center',
                valign: 'top'
            });
        });

        console.log('✓ Created 3 text blocks with icons slide');
    }

    /**
     * Slide 4: AI Coding Skills Comparison
     */
    createTableRightBulletsLeftSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('AI Coding Skills Comparison 2024 vs 2050', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Three columns for comparison
        const columns = [
            {
                title: 'Debugging',
                description: 'From hours of manual work to seconds with AI-powered analysis.',
                iconName: 'technology-idea',
                x: 0.5
            },
            {
                title: 'Learning Curve',
                description: 'Weeks of learning new frameworks reduced to minutes with AI-guided onboarding.',
                iconName: 'business-strategy',
                x: 3.5
            },
            {
                title: 'Code Quality',
                description: 'Manual code reviews replaced by real-time, AI-driven quality assurance.',
                iconName: 'technology',
                x: 6.5
            }
        ];

        columns.forEach((col, index) => {
            const iconPath = this.getSvgRepoIcon(col.iconName);
            
            if (iconPath && this.safeExistsSync(iconPath)) {
                slide.addImage({
                    path: iconPath,
                    x: col.x + 0.75, y: 1.5, w: 1.5, h: 1.5,
                    sizing: { type: 'contain', w: 1.5, h: 1.5 }
                });
            }

            slide.addText(col.title, {
                x: col.x, y: 3.2, w: 3, h: 0.6,
                fontSize: 16,
                bold: true,
                color: this.colors.primary,
                align: 'center'
            });

            slide.addText(col.description, {
                x: col.x, y: 3.9, w: 3, h: 1.2,
                fontSize: 12,
                color: this.colors.text,
                align: 'center',
                valign: 'top'
            });
        });

        console.log('✓ Created AI Coding Skills Comparison slide with icons');
    }

    /**
     * Slide 5: Three text boxes with icons on top
     */
    createImage30PercentBulletsSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('Future AI Development Environments', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colors.primary
        });

        // Three columns with icons and text
        const columns = [
            {
                icon: 'technology-idea',
                title: 'Neural IDE',
                content: [
                    'AI learns developer preferences',
                    'Predictive code completion',
                    'Automated refactoring suggestions',
                    'Context-aware debugging'
                ]
            },
            {
                icon: 'business-strategy',
                title: 'Voice Programming',
                content: [
                    'Natural language coding',
                    'Voice dictation capabilities',
                    'Multi-language support',
                    'Real-time collaboration'
                ]
            },
            {
                icon: 'medical-cross',
                title: 'AR Debugging',
                content: [
                    '3D code visualization',
                    'Augmented reality interface',
                    'Brain-computer integration',
                    'Quantum acceleration'
                ]
            }
        ];

        columns.forEach((column, index) => {
            const x = 0.5 + (index * 3.2);
            
            // Add icon on top
            const icon = this.getSvgRepoIcon(column.icon);
            if (icon && this.safeExistsSync(icon)) {
                slide.addImage({
                    path: icon,
                    x: x + 1, y: 1.3, w: 1.2, h: 1.2
                });
            }
            
            // Add title below icon
            slide.addText(column.title, {
                x: x, y: 2.7, w: 3, h: 0.5,
                fontSize: 18,
                bold: true,
                color: this.colors.primary,
                align: 'center'
            });
            
            // Add content points
            const bulletPoints = column.content.map(text => ({ text, options: { bullet: true } }));
            slide.addText(bulletPoints, {
                x: x, y: 3.3, w: 3, h: 1.8,
                fontSize: 12,
                color: this.colors.text
            });
        });

        console.log('✓ Created three text boxes with icons slide');
    }

    /**
     * Slide 6: 40% left dark blue background with white/orange text, 60% right with two stacked images
     */
    createDarkBlueBackgroundStackedImagesSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Left side 40% - Dark blue background with white text
        slide.addShape('rect', {
            x: 0, y: 0, w: 4, h: 5.625,
            fill: { color: this.colors.primary },
            line: { width: 2, color: this.colors.secondary }
        });

        // White/orange text on the dark background
        slide.addText('REDEFINING\nCODING\nSTANDARDS', {
            x: 0, y: 0.8, w: 4, h: 1,
            fontSize: 28,
            color: this.colors.darkText,
            align: 'center',
            bold: true
        });

        slide.addText('AI transforms software development from manual craftsmanship to intelligent orchestration, where developers direct sophisticated AI systems through natural language and intent.', {
            x: 0.3, y: 2.2, w: 3.4, h: 1.5,
            fontSize: 16,
            color: this.colors.darkText,
            align: 'left'
        });

        // Orange accent text
        slide.addText('95% Code\nGeneration\nAutomation', {
            x: 0.3, y: 4, w: 3.4, h: 1,
            fontSize: 20,
            color: this.colors.secondary,
            align: 'center',
            bold: true
        });

        // Right side 60% - Two stacked images vertically - Use Unsplash
        const topImage = this.getSmartAsset(5, 'svgrepo', 0);  // Slide 6 (0-indexed as 5)
        if (topImage && this.safeExistsSync(topImage)) {
            slide.addImage({
                path: topImage,
                x: 4.2, y: 0.8, w: 5.5, h: 2,
                transparency: 25,
                sizing: { type: 'contain' }
            });
        } else {
            slide.addShape('rect', {
                x: 4.2, y: 0.8, w: 5.5, h: 2,
                fill: { color: '#E5E7EB' }
            });
            slide.addText('AI Code Generation', {
                x: 4.2, y: 1.4, w: 5.5, h: 0.6,
                fontSize: 16,
                color: this.colors.primary,
                align: 'center'
            });
        }

        const bottomImage = this.getSmartAsset(5, 'svgrepo', 1);  // Slide 6 (0-indexed as 5)
        if (bottomImage && this.safeExistsSync(bottomImage)) {
            slide.addImage({
                path: bottomImage,
                x: 4.2, y: 3.2, w: 5.5, h: 2,
                transparency: 25,
                sizing: { type: 'contain' }
            });
        } else {
            slide.addShape('rect', {
                x: 4.2, y: 3.2, w: 5.5, h: 2,
                fill: { color: '#E5E7EB' }
            });
            slide.addText('AI Code Review', {
                x: 4.2, y: 3.8, w: 5.5, h: 0.6,
                fontSize: 16,
                color: this.colors.primary,
                align: 'center'
            });
        }

        console.log('✓ Created dark blue background with stacked images slide');
    }

    /**
     * Slide 7: AI coding tools and frameworks
     */
    createAICodingToolsSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('AI Coding Tools of 2050', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Three AI tool showcases
        const aiTools = [
            {
                name: 'NeuraCode',
                description: 'Neural network-based IDE with predictive code completion and instant refactoring',
                capabilities: ['Predictive coding', 'Auto-refactoring', 'Bug prevention']
            },
            {
                name: 'QuantumDebug',
                description: 'Quantum-accelerated debugging with instant codebase analysis',
                capabilities: ['Instant analysis', 'Quantum speedup', 'Pattern recognition']
            },
            {
                name: 'SynthoTest',
                description: 'AI-generated comprehensive test suites with perfect coverage',
                capabilities: ['Auto test generation', 'Edge case detection', 'Performance validation']
            }
        ];

        aiTools.forEach((tool, index) => {
            const x = index * 2.8 + 1;
            const y = 1.5;

            // Tool icon (placeholder)
            slide.addShape('ellipse', {
                x: x, y: y, w: 1, h: 1,
                fill: { color: this.colors.primary }
            });
            slide.addText('AI', {
                x: x, y: y, w: 1, h: 1,
                fontSize: 20,
                color: this.colors.darkText,
                align: 'center',
                valign: 'middle'
            });

            // Tool name
            slide.addText(tool.name, {
                x: x - 0.2, y: y + 1.3, w: 1.4, h: 0.4,
                fontSize: 16,
                bold: true,
                color: this.colors.primary,
                align: 'center'
            });

            // Description
            slide.addText(tool.description, {
                x: x - 0.2, y: y + 1.8, w: 1.4, h: 1,
                fontSize: 12,
                color: this.colors.text,
                align: 'center'
            });

            // Capabilities
            tool.capabilities.forEach((cap, capIndex) => {
                slide.addText(`• ${cap}`, {
                    x: x - 0.2, y: y + 3 + (capIndex * 0.3), w: 1.4, h: 0.3,
                    fontSize: 10,
                    color: this.colors.text,
                    align: 'left'
                });
            });
        });

        console.log('✓ Created AI coding tools slide');
    }

    /**
     * Slide 8: Ethical considerations
     */
    createEthicsSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('Ethical Considerations in AI Coding', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        const ethicalPoints = [
            'How do we maintain human creativity and problem-solving skills?',
            'Who is responsible for bugs and errors in AI-generated code?',
            'How do we ensure AI systems don\'t perpetuate existing biases?',
            'What happens to traditional coding jobs and career paths?',
            'How do we balance automation efficiency with human oversight?',
            'What are the security implications of AI-generated code?'
        ];

        slide.addText(ethicalPoints.map(text => ({ text, options: { bullet: true } })), {
            x: 1, y: 1.5, w: 6, h: 3.5,
            fontSize: 14,
            color: this.colors.text,
            align: 'left'
        });

        // Ethical concern visualization on right
        const ethicsImage = this.getSmartAsset(7, 'unsplash', 0);
        if (ethicsImage && this.safeExistsSync(ethicsImage)) {
            slide.addImage({
                path: ethicsImage,
                x: 7.5, y: 1.8, w: 2, h: 2.5,
            });
        }

        console.log('✓ Created ethics slide');
    }

    /**
     * Slide 9: Future predictions
     */
    createFuturePredictionsSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('Predictions for 2050', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Predictions table
        const predictionsTable = [
            [
                { text: 'Technology', options: { color: this.colors.darkText, backgroundColor: this.colors.primary, bold: true } },
                { text: 'Impact Level', options: { color: this.colors.darkText, backgroundColor: this.colors.primary, bold: true } },
                { text: 'Timeline', options: { color: this.colors.darkText, backgroundColor: this.colors.primary, bold: true } }
            ],
            [
                { text: 'AI Code Generation', options: { color: this.colors.text, backgroundColor: this.colors.background } },
                { text: 'Very High', options: { color: this.colors.secondary, backgroundColor: this.colors.background, bold: true } },
                { text: '2026-2030', options: { color: this.colors.text, backgroundColor: this.colors.background } }
            ],
            [
                { text: 'Quantum Computing', options: { color: this.colors.text, backgroundColor: '#F9FAFB' } },
                { text: 'High', options: { color: this.colors.secondary, backgroundColor: '#F9FAFB', bold: true } },
                { text: '2030-2040', options: { color: this.colors.text, backgroundColor: '#F9FAFB' } }
            ],
            [
                { text: 'Brain-Computer Interfaces', options: { color: this.colors.text, backgroundColor: this.colors.background } },
                { text: 'Medium-High', options: { color: this.colors.secondary, backgroundColor: this.colors.background, bold: true } },
                { text: '2035-2050', options: { color: this.colors.text, backgroundColor: this.colors.background } }
            ],
            [
                { text: 'Universal Programming', options: { color: this.colors.text, backgroundColor: '#F9FAFB' } },
                { text: 'Very High', options: { color: this.colors.secondary, backgroundColor: '#F9FAFB', bold: true } },
                { text: '2040-2050', options: { color: this.colors.text, backgroundColor: '#F9FAFB' } }
            ]
        ];

        slide.addTable(predictionsTable, {
            x: 1, y: 1.5, w: 8, h: 3.5,
            fontSize: 11,
            border: { type: 'solid', pt: 1, color: this.colors.accent },
            colW: [3.2, 1.8, 1.8]
        });

        console.log('✓ Created future predictions slide');
    }

    /**
     * Slide 10: Conclusion
     */
    createConclusionSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Main conclusion
        slide.addText('AI & Human Developers:\nPerfect Partnership', {
            x: 1, y: 1, w: 8, h: 1,
            fontSize: 32,
            bold: true,
            color: this.colors.primary,
            align: 'center',
            fontFace: 'Calibri'
        });

        // Key message
        slide.addText('By 2050, AI will amplify human creativity, not replace it.\nDevelopers will focus on vision, strategy, and innovation\nwhile AI handles implementation details.', {
            x: 1, y: 2.5, w: 8, h: 1.2,
            fontSize: 20,
            color: this.colors.text,
            align: 'center',
            fontFace: 'Calibri'
        });

        // Call to action with orange accent
        slide.addText('Embrace the AI coding revolution.\nStart learning and adapting today.', {
            x: 1, y: 4, w: 8, h: 0.6,
            fontSize: 18,
            color: this.colors.secondary,
            align: 'center',
            fontFace: 'Calibri',
            bold: true
        });

        console.log('✓ Created conclusion slide');
    }

    /**
     * Save presentation to file with timestamp to avoid conflicts
     */
    async savePresentation() {
        try {
            const outputDir = path.join(__dirname, '..', 'output');
            if (!this.safeExistsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Generate unique filename with timestamp to avoid conflicts
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const filename = `ai_coding_2050_presentation_${timestamp}.pptx`;
            const outputPath = path.join(outputDir, filename);

            console.log(`💾 Saving presentation to: ${outputPath}`);
            await this.pres.writeFile({ fileName: outputPath });

            return outputPath;

        } catch (error) {
            console.error('💥 Error saving AI Coding presentation:', error);
            throw error;
        }
    }
}

// Execute generator if run directly
if (require.main === module) {
    const generator = new AICoding2050Generator();

    generator.generatePresentation()
        .then(result => {
            console.log('\n🎉 AI Coding in 2050 presentation created successfully!');
            console.log(`📊 Slides: ${result.slides}`);
            console.log(`🎨 Theme: ${result.theme}`);
            console.log(`📐 Layout Types: ${result.layouts}`);
            console.log(`💾 Location: ${result.outputPath}`);
        })
        .catch(error => {
            console.error('\n❌ Failed to generate AI Coding presentation:', error.message);
            process.exit(1);
        });
}

module.exports = AICoding2050Generator;
