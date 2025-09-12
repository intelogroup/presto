/**
 * Ten Slide Layout Showcase Generator
 * Creates a 10-slide presentation demonstrating different layout types:
 * 1. Block text on the right and image on the left
 * 2. 3 block text with icons or graphics on top of each
 * 3. 2 paragraphs stacked vertically on the right and 2 images stacked vertically on the left
 * Plus additional creative layouts for a comprehensive showcase
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

class TenSlideLayoutShowcase {
    constructor() {
        this.pres = new PptxGenJS();
        this.setupPresentation();
        this.loadAvailableAssets();
    }

    /**
     * Set up presentation with proper layout and theme
     */
    setupPresentation() {
        // Define layout (16:9 aspect ratio)
        this.pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
        this.pres.layout = 'LAYOUT_16x9';

        // Set presentation properties
        this.pres.author = 'Ten Slide Layout Showcase Generator';
        this.pres.title = 'Dynamic Layout Showcase - 10 Slides';
        this.pres.subject = 'Comprehensive Layout System Demonstration';

        // Define professional color scheme
        this.colors = {
            primary: '#2E7D32',     // Forest green
            secondary: '#1976D2',   // Professional blue
            accent: '#FF8F00',      // Amber accent
            background: '#FFFFFF',
            text: '#212121',
            lightGray: '#F5F5F5',
            mediumGray: '#BDBDBD',
            border: '#E0E0E0',
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336'
        };
    }

    /**
     * Load available assets from the file system
     */
    loadAvailableAssets() {
        this.assets = {
            infographics: [],
            simpleicons: [],
            lucide: [],
            undraw: [],
            unsplash: [],
            business: [],
            simpleIconsPng: [],
            svgrepoIconsPng: [],
            devIconsPng: [],
            lucidePng: []
        };

        const readFilePaths = (dir, filter) => {
            try {
                if (fs.existsSync(dir)) {
                    return fs.readdirSync(dir)
                        .filter(file => file.match(filter) && file !== 'catalog.json')
                        .map(file => path.join(dir, file));
                }
                return [];
            } catch (error) {
                console.warn(`Could not load assets from ${dir}:`, error.message);
                return [];
            }
        };

        // Load infographic PNGs from svgrepo_png
        const infographicsPath = path.join(__dirname, '..', '..', 'assets-images', 'infographics', 'svgrepo_png');
        this.assets.infographics = readFilePaths(infographicsPath, /\.png$/i);
        console.log(`✅ Loaded ${this.assets.infographics.length} infographic PNGs`);

        // Load simple icons (brand icons)
        const simpleiconsPath = path.join(__dirname, '..', '..', 'assets-images', 'simpleicons', 'brand');
        this.assets.simpleicons = readFilePaths(simpleiconsPath, /\.svg$/i);
        console.log(`✅ Loaded ${this.assets.simpleicons.length} brand icons`);

        // Load Lucide icons
        const lucidePath = path.join(__dirname, '..', '..', 'assets-images', 'lucide', 'general');
        this.assets.lucide = readFilePaths(lucidePath, /\.svg$/i);
        console.log(`✅ Loaded ${this.assets.lucide.length} Lucide icons`);

        // Load Undraw illustrations
        const undrawPath = path.join(__dirname, '..', '..', 'assets-images', 'undraw', 'business');
        this.assets.undraw = readFilePaths(undrawPath, /\.(svg|png)$/i);
        console.log(`✅ Loaded ${this.assets.undraw.length} Undraw illustrations`);

        // Load Unsplash images
        const unsplashPath = path.join(__dirname, '..', '..', 'assets-images', 'unsplash', 'business');
        this.assets.unsplash = readFilePaths(unsplashPath, /\.(jpg|png)$/i);
        console.log(`✅ Loaded ${this.assets.unsplash.length} Unsplash images`);

        // Load SVG Repo PNG images
        const svgrepoPngPath = path.join(__dirname, '..', '..', 'assets-images', 'infographics', 'svgrepo_png');
        this.assets.svgrepo_png = readFilePaths(svgrepoPngPath, /\.png$/i);
        console.log(`✅ Loaded ${this.assets.svgrepo_png.length} SVG Repo PNG images`);

        // Load PNG assets from assets-images-png directory
        // Load Simple Icons PNG versions
        const simpleIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'simpleicons', 'brand');
        this.assets.simpleIconsPng = readFilePaths(simpleIconsPngPath, /\.(jpg|jpeg|png)$/i);
        console.log(`✅ Loaded ${this.assets.simpleIconsPng.length} Simple Icons PNG`);

        // Load SVG Repo icons PNG versions
        const svgrepoIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'svgrepo-icons-graphics');
        this.assets.svgrepoIconsPng = readFilePaths(svgrepoIconsPngPath, /\.(jpg|jpeg|png)$/i);
        console.log(`✅ Loaded ${this.assets.svgrepoIconsPng.length} SVG Repo Icons PNG`);

        // Load DevIcons PNG versions
        const devIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'devicons', 'tech');
        this.assets.devIconsPng = readFilePaths(devIconsPngPath, /\.(jpg|jpeg|png)$/i);
        console.log(`✅ Loaded ${this.assets.devIconsPng.length} DevIcons PNG`);

        // Load Lucide PNG versions
        const lucidePngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'lucide', 'general');
        this.assets.lucidePng = readFilePaths(lucidePngPath, /\.(jpg|jpeg|png)$/i);
        console.log(`✅ Loaded ${this.assets.lucidePng.length} Lucide PNG`);

        // Keep business as fallback (for backward compatibility)
        this.assets.business = this.assets.infographics.concat(this.assets.undraw);
    }

    /**
     * Get asset by type and index with fallback
     */
    getAsset(type, index = 0) {
        if (this.assets[type] && this.assets[type].length > 0) {
            return this.assets[type][index % this.assets[type].length];
        }
        return null;
    }

    /**
     * Generate the complete 10-slide presentation
     */
    async generatePresentation() {
        console.log('🎯 Starting Ten Slide Layout Showcase generation...');
        
        try {
            // Slide 1: Title Slide
            this.createTitleSlide();
            
            // Slide 2: Layout Type 1 - Block text right, image left
            this.createImageLeftTextRightSlide();
            
            // Slide 3: Layout Type 2 - 3 block text with icons on top
            this.createThreeColumnsWithIconsSlide();
            
            // Slide 4: Layout Type 3 - Stacked content (2 paragraphs right, 2 images left)
            this.createStackedContentSlide();
            
            // Slide 5: Hero Layout with Central Focus
            this.createHeroLayoutSlide();
            
            // Slide 6: Dashboard Style Layout
            this.createDashboardLayoutSlide();
            
            // Slide 7: Timeline Process Layout
            this.createTimelineLayoutSlide();
            
            // Slide 8: Feature Comparison Layout
            this.createComparisonLayoutSlide();
            
            // Slide 9: Infographic Style Layout
            this.createInfographicLayoutSlide();
            
            // Slide 10: Summary/Conclusion Slide
            this.createSummarySlide();
            
            console.log('✅ All 10 slides created successfully');
            
            // Save the presentation
            const result = await this.savePresentationFile();
            return result;
            
        } catch (error) {
            console.error('❌ Error generating presentation:', error);
            throw error;
        }
    }

    /**
     * Slide 1: Professional Title Slide
     */
    createTitleSlide() {
        const slide = this.pres.addSlide();
        
        // Background gradient
        slide.background = { fill: this.colors.primary };
        
        // Main title
        slide.addText('Dynamic Layout Showcase', {
            x: 1,
            y: 1.5,
            w: 8,
            h: 1.2,
            fontSize: 44,
            bold: true,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        // Subtitle
        slide.addText('10 Slides Demonstrating Advanced Layout Techniques', {
            x: 1,
            y: 2.8,
            w: 8,
            h: 0.8,
            fontSize: 24,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        // Date and author
        slide.addText(`Generated on ${new Date().toLocaleDateString()}`, {
            x: 1,
            y: 4.5,
            w: 8,
            h: 0.5,
            fontSize: 16,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        console.log('✅ Created Slide 1: Title Slide');
    }

    /**
     * Slide 2: Layout Type 1 - Image Left, Block Text Right
     */
    createImageLeftTextRightSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.background };
        
        // Slide title
        slide.addText('Layout Type 1: Image Left, Text Right', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });
        
        // Left side - Image (using infographic SVG)
        const infographicImage = this.getAsset('infographics', 0);
        if (infographicImage) {
            slide.addImage({
                path: infographicImage,
                x: 0.5,
                y: 1.2,
                w: 4,
                h: 3.5,
                sizing: { type: 'contain' }
            });
        } else {
            // Fallback placeholder
            slide.addShape(this.pres.ShapeType.rect, {
                x: 0.5,
                y: 1.2,
                w: 4,
                h: 3.5,
                fill: { color: this.colors.lightGray },
                line: { color: this.colors.border, width: 1 }
            });
            slide.addText('Infographic\nPlaceholder', {
                x: 0.5,
                y: 2.7,
                w: 4,
                h: 0.8,
                fontSize: 16,
                color: this.colors.text,
                align: 'center',
                fontFace: 'Arial'
            });
        }
        
        // Right side - Block text
        slide.addText('Strategic Business Growth', {
            x: 5,
            y: 1.2,
            w: 4.5,
            h: 0.6,
            fontSize: 24,
            bold: true,
            color: this.colors.secondary,
            fontFace: 'Arial'
        });
        
        slide.addText('Our comprehensive approach to business development focuses on sustainable growth strategies that deliver measurable results. We combine innovative thinking with proven methodologies to help organizations achieve their strategic objectives.\n\nKey benefits include:\n• Enhanced operational efficiency\n• Improved market positioning\n• Sustainable competitive advantage\n• Measurable ROI improvements', {
            x: 5,
            y: 2,
            w: 4.5,
            h: 2.7,
            fontSize: 14,
            color: this.colors.text,
            fontFace: 'Arial',
            lineSpacing: 20
        });
        
        console.log('✅ Created Slide 2: Image Left, Text Right Layout');
    }

    /**
     * Slide 3: Layout Type 2 - Three Columns with Icons on Top
     */
    createThreeColumnsWithIconsSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.background };
        
        // Slide title
        slide.addText('Layout Type 2: Three Columns with Icons', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });
        
        const columnWidth = 2.8;
        const columnSpacing = 0.6;
        const startX = 0.8;
        
        const columns = [
            {
                title: 'Innovation',
                content: 'Drive breakthrough solutions through creative thinking and cutting-edge technology. Our innovation framework helps organizations stay ahead of market trends and deliver exceptional value to customers.',
                iconName: 'lightbulb'
            },
            {
                title: 'Efficiency',
                content: 'Optimize processes and workflows to maximize productivity and minimize waste. Our systematic approach to operational excellence ensures sustainable performance improvements.',
                iconName: 'cpu'
            },
            {
                title: 'Growth',
                content: 'Scale your business with strategic planning and execution. Our growth strategies are designed to expand market reach while maintaining quality and customer satisfaction.',
                iconName: 'bar-chart-3'
            }
        ];
        
        columns.forEach((column, index) => {
            const x = startX + (index * (columnWidth + columnSpacing));
            
            // Small SVG repo PNG image on top
            const svgrepoPng = this.getAsset('svgrepo_png', index);
            if (svgrepoPng) {
                slide.addImage({
                    path: svgrepoPng,
                    x: x + (columnWidth / 2) - 0.3,
                    y: 1.2,
                    w: 0.6,
                    h: 0.6,
                    sizing: { type: 'contain' }
                });
            }
            
            // Icon below the SVG repo image
            const lucideIcon = this.getAsset('lucide', index);
            if (lucideIcon) {
                slide.addImage({
                    path: lucideIcon,
                    x: x + (columnWidth / 2) - 0.4,
                    y: 1.9,
                    w: 0.8,
                    h: 0.8,
                    sizing: { type: 'contain' }
                });
            } else {
                // Fallback icon placeholder
                slide.addShape(this.pres.ShapeType.ellipse, {
                    x: x + (columnWidth / 2) - 0.4,
                    y: 1.9,
                    w: 0.8,
                    h: 0.8,
                    fill: { color: this.colors.accent },
                    line: { color: this.colors.border, width: 1 }
                });
            }
            
            // Column title
            slide.addText(column.title, {
                x: x,
                y: 2.9,
                w: columnWidth,
                h: 0.5,
                fontSize: 20,
                bold: true,
                color: this.colors.secondary,
                align: 'center',
                fontFace: 'Arial'
            });
            
            // Column content
            slide.addText(column.content, {
                x: x,
                y: 3.5,
                w: columnWidth,
                h: 2.2,
                fontSize: 12,
                color: this.colors.text,
                align: 'left',
                fontFace: 'Arial',
                lineSpacing: 18
            });
        });
        
        console.log('✅ Created Slide 3: Three Columns with Icons Layout');
    }

    /**
     * Slide 4: Layout Type 3 - Stacked Content (2 images left, 2 paragraphs right)
     */
    createStackedContentSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.background };
        
        // Slide title
        slide.addText('Layout Type 3: Stacked Content Layout', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });
        
        // Left side - Two stacked images
        const image1 = this.getAsset('svgrepo_png', 0) || this.getAsset('unsplash', 0) || this.getAsset('undraw', 0);
        const image2 = this.getAsset('svgrepo_png', 1) || this.getAsset('unsplash', 1) || this.getAsset('undraw', 1);
        
        if (image1) {
            slide.addImage({
                path: image1,
                x: 0.5,
                y: 1.2,
                w: 4,
                h: 1.8,
                sizing: { type: 'contain' }
            });
        } else {
            slide.addShape(this.pres.ShapeType.rect, {
                x: 0.5,
                y: 1.2,
                w: 4,
                h: 1.8,
                fill: { color: this.colors.lightGray },
                line: { color: this.colors.border, width: 1 }
            });
            slide.addText('Image 1\nPlaceholder', {
                x: 0.5,
                y: 1.9,
                w: 4,
                h: 0.4,
                fontSize: 14,
                color: this.colors.text,
                align: 'center'
            });
        }
        
        if (image2) {
            slide.addImage({
                path: image2,
                x: 0.5,
                y: 3.2,
                w: 4,
                h: 1.8,
                sizing: { type: 'contain' }
            });
        } else {
            slide.addShape(this.pres.ShapeType.rect, {
                x: 0.5,
                y: 3.2,
                w: 4,
                h: 1.8,
                fill: { color: this.colors.lightGray },
                line: { color: this.colors.border, width: 1 }
            });
            slide.addText('Image 2\nPlaceholder', {
                x: 0.5,
                y: 3.9,
                w: 4,
                h: 0.4,
                fontSize: 14,
                color: this.colors.text,
                align: 'center'
            });
        }
        
        // Right side - Two stacked paragraphs
        slide.addText('Digital Transformation Strategy', {
            x: 5,
            y: 1.2,
            w: 4.5,
            h: 0.4,
            fontSize: 18,
            bold: true,
            color: this.colors.secondary,
            fontFace: 'Arial'
        });
        
        slide.addText('Modern businesses require comprehensive digital transformation strategies to remain competitive. Our approach integrates technology, processes, and people to create sustainable change that drives growth and innovation. We focus on practical implementation that delivers immediate value while building long-term capabilities.', {
            x: 5,
            y: 1.7,
            w: 4.5,
            h: 1.3,
            fontSize: 13,
            color: this.colors.text,
            fontFace: 'Arial',
            lineSpacing: 18
        });
        
        slide.addText('Implementation Excellence', {
            x: 5,
            y: 3.2,
            w: 4.5,
            h: 0.4,
            fontSize: 18,
            bold: true,
            color: this.colors.secondary,
            fontFace: 'Arial'
        });
        
        slide.addText('Success depends on flawless execution and continuous optimization. Our implementation methodology ensures smooth transitions, minimal disruption, and maximum adoption. We provide comprehensive support throughout the transformation journey, from initial planning to full deployment and beyond.', {
            x: 5,
            y: 3.7,
            w: 4.5,
            h: 1.3,
            fontSize: 13,
            color: this.colors.text,
            fontFace: 'Arial',
            lineSpacing: 18
        });
        
        console.log('✅ Created Slide 4: Stacked Content Layout');
    }

    /**
     * Slide 5: Hero Layout with Central Focus
     */
    createHeroLayoutSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.secondary };
        
        // Central hero content
        slide.addText('Transform Your Business', {
            x: 1,
            y: 1.5,
            w: 8,
            h: 1,
            fontSize: 40,
            bold: true,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        slide.addText('Unlock potential through strategic innovation and operational excellence', {
            x: 1,
            y: 2.7,
            w: 8,
            h: 0.8,
            fontSize: 20,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        // Call to action button
        slide.addShape(this.pres.ShapeType.rect, {
            x: 4,
            y: 3.8,
            w: 2,
            h: 0.6,
            fill: { color: this.colors.accent },
            line: { color: this.colors.accent, width: 0 },
            rectRadius: 0.1
        });
        
        slide.addText('Get Started', {
            x: 4,
            y: 3.8,
            w: 2,
            h: 0.6,
            fontSize: 16,
            bold: true,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        console.log('✅ Created Slide 5: Hero Layout');
    }

    /**
     * Slide 6: Dashboard Style Layout
     */
    createDashboardLayoutSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.background };
        
        // Title
        slide.addText('Performance Dashboard', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });
        
        // Metric cards
        const metrics = [
            { title: 'Revenue Growth', value: '+24%', color: this.colors.success },
            { title: 'Customer Satisfaction', value: '94%', color: this.colors.secondary },
            { title: 'Market Share', value: '+12%', color: this.colors.accent },
            { title: 'Efficiency Gain', value: '+18%', color: this.colors.primary }
        ];
        
        metrics.forEach((metric, index) => {
            const x = 0.5 + (index * 2.25);
            const y = 1.5;
            
            // Card background
            slide.addShape(this.pres.ShapeType.rect, {
                x: x,
                y: y,
                w: 2,
                h: 1.2,
                fill: { color: this.colors.lightGray },
                line: { color: this.colors.border, width: 1 },
                rectRadius: 0.1
            });
            
            // Metric value
            slide.addText(metric.value, {
                x: x,
                y: y + 0.2,
                w: 2,
                h: 0.5,
                fontSize: 24,
                bold: true,
                color: metric.color,
                align: 'center',
                fontFace: 'Arial'
            });
            
            // Metric title
            slide.addText(metric.title, {
                x: x,
                y: y + 0.7,
                w: 2,
                h: 0.3,
                fontSize: 12,
                color: this.colors.text,
                align: 'center',
                fontFace: 'Arial'
            });
        });
        
        // Chart placeholder
        slide.addShape(this.pres.ShapeType.rect, {
            x: 1,
            y: 3,
            w: 8,
            h: 2,
            fill: { color: this.colors.lightGray },
            line: { color: this.colors.border, width: 1 }
        });
        
        slide.addText('Performance Trends Chart\n(Interactive Dashboard Element)', {
            x: 1,
            y: 3.7,
            w: 8,
            h: 0.6,
            fontSize: 16,
            color: this.colors.text,
            align: 'center',
            fontFace: 'Arial'
        });
        
        console.log('✅ Created Slide 6: Dashboard Layout');
    }

    /**
     * Slide 7: Timeline Process Layout
     */
    createTimelineLayoutSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.background };
        
        // Title
        slide.addText('Implementation Timeline', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });
        
        // Timeline line
        slide.addShape(this.pres.ShapeType.line, {
            x: 1,
            y: 2.5,
            w: 8,
            h: 0,
            line: { color: this.colors.secondary, width: 3 }
        });
        
        const phases = [
            { title: 'Planning', duration: '2 weeks', description: 'Strategic analysis and roadmap development' },
            { title: 'Design', duration: '3 weeks', description: 'Solution architecture and prototyping' },
            { title: 'Development', duration: '6 weeks', description: 'Implementation and testing' },
            { title: 'Deployment', duration: '2 weeks', description: 'Go-live and optimization' }
        ];
        
        phases.forEach((phase, index) => {
            const x = 1.5 + (index * 2.2);
            
            // Timeline dot
            slide.addShape(this.pres.ShapeType.ellipse, {
                x: x - 0.1,
                y: 2.4,
                w: 0.2,
                h: 0.2,
                fill: { color: this.colors.accent },
                line: { color: this.colors.secondary, width: 2 }
            });
            
            // Phase title
            slide.addText(phase.title, {
                x: x - 0.75,
                y: 1.7,
                w: 1.5,
                h: 0.3,
                fontSize: 14,
                bold: true,
                color: this.colors.secondary,
                align: 'center',
                fontFace: 'Arial'
            });
            
            // Duration
            slide.addText(phase.duration, {
                x: x - 0.75,
                y: 2,
                w: 1.5,
                h: 0.2,
                fontSize: 10,
                color: this.colors.accent,
                align: 'center',
                fontFace: 'Arial'
            });
            
            // Description
            slide.addText(phase.description, {
                x: x - 1,
                y: 2.8,
                w: 2,
                h: 1,
                fontSize: 10,
                color: this.colors.text,
                align: 'center',
                fontFace: 'Arial',
                lineSpacing: 14
            });
        });
        
        console.log('✅ Created Slide 7: Timeline Layout');
    }

    /**
     * Slide 8: Feature Comparison Layout
     */
    createComparisonLayoutSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.background };
        
        // Title
        slide.addText('Solution Comparison', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });
        
        // Comparison table
        const features = [
            { name: 'Scalability', basic: '✓', premium: '✓✓', enterprise: '✓✓✓' },
            { name: 'Security', basic: '✓', premium: '✓✓', enterprise: '✓✓✓' },
            { name: 'Support', basic: 'Email', premium: '24/7', enterprise: 'Dedicated' },
            { name: 'Integration', basic: 'Basic', premium: 'Advanced', enterprise: 'Custom' },
            { name: 'Analytics', basic: 'Standard', premium: 'Advanced', enterprise: 'AI-Powered' }
        ];
        
        // Table headers
        const headers = ['Features', 'Basic', 'Premium', 'Enterprise'];
        headers.forEach((header, index) => {
            slide.addShape(this.pres.ShapeType.rect, {
                x: 1 + (index * 2),
                y: 1.2,
                w: 2,
                h: 0.5,
                fill: { color: this.colors.secondary },
                line: { color: this.colors.border, width: 1 }
            });
            
            slide.addText(header, {
                x: 1 + (index * 2),
                y: 1.2,
                w: 2,
                h: 0.5,
                fontSize: 14,
                bold: true,
                color: this.colors.background,
                align: 'center',
                fontFace: 'Arial'
            });
        });
        
        // Table rows
        features.forEach((feature, rowIndex) => {
            const y = 1.7 + (rowIndex * 0.5);
            const values = [feature.name, feature.basic, feature.premium, feature.enterprise];
            
            values.forEach((value, colIndex) => {
                slide.addShape(this.pres.ShapeType.rect, {
                    x: 1 + (colIndex * 2),
                    y: y,
                    w: 2,
                    h: 0.5,
                    fill: { color: colIndex === 0 ? this.colors.lightGray : this.colors.background },
                    line: { color: this.colors.border, width: 1 }
                });
                
                slide.addText(value, {
                    x: 1 + (colIndex * 2),
                    y: y,
                    w: 2,
                    h: 0.5,
                    fontSize: 12,
                    bold: colIndex === 0,
                    color: this.colors.text,
                    align: 'center',
                    fontFace: 'Arial'
                });
            });
        });
        
        console.log('✅ Created Slide 8: Comparison Layout');
    }

    /**
     * Slide 9: Infographic Style Layout
     */
    createInfographicLayoutSlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.background };
        
        // Title
        slide.addText('Key Statistics', {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.6,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            fontFace: 'Arial'
        });
        
        // Central infographic elements
        const stats = [
            { value: '500+', label: 'Projects Completed', x: 2.5, y: 2, color: this.colors.success },
            { value: '98%', label: 'Client Satisfaction', x: 7.5, y: 2, color: this.colors.secondary },
            { value: '50+', label: 'Team Members', x: 2.5, y: 4, color: this.colors.accent },
            { value: '24/7', label: 'Support Available', x: 7.5, y: 4, color: this.colors.primary }
        ];
        
        stats.forEach(stat => {
            // Circular background
            slide.addShape(this.pres.ShapeType.ellipse, {
                x: stat.x - 0.8,
                y: stat.y - 0.8,
                w: 1.6,
                h: 1.6,
                fill: { color: stat.color },
                line: { color: stat.color, width: 0 }
            });
            
            // Statistic value
            slide.addText(stat.value, {
                x: stat.x - 0.8,
                y: stat.y - 0.2,
                w: 1.6,
                h: 0.4,
                fontSize: 20,
                bold: true,
                color: this.colors.background,
                align: 'center',
                fontFace: 'Arial'
            });
            
            // Label
            slide.addText(stat.label, {
                x: stat.x - 1,
                y: stat.y + 0.9,
                w: 2,
                h: 0.4,
                fontSize: 12,
                color: this.colors.text,
                align: 'center',
                fontFace: 'Arial'
            });
        });
        
        console.log('✅ Created Slide 9: Infographic Layout');
    }

    /**
     * Slide 10: Summary/Conclusion Slide
     */
    createSummarySlide() {
        const slide = this.pres.addSlide();
        slide.background = { fill: this.colors.primary };
        
        // Title
        slide.addText('Layout Showcase Complete', {
            x: 1,
            y: 1,
            w: 8,
            h: 0.8,
            fontSize: 32,
            bold: true,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        // Summary points
        slide.addText('✓ Image Left, Text Right Layout\n✓ Three Columns with Icons\n✓ Stacked Content Layout\n✓ Hero and Dashboard Styles\n✓ Timeline and Comparison Views\n✓ Infographic Elements', {
            x: 2,
            y: 2.2,
            w: 6,
            h: 2,
            fontSize: 16,
            color: this.colors.background,
            align: 'left',
            fontFace: 'Arial',
            lineSpacing: 24
        });
        
        // Footer
        slide.addText('Dynamic Presentation System - Versatile Layout Engine', {
            x: 1,
            y: 4.8,
            w: 8,
            h: 0.4,
            fontSize: 14,
            color: this.colors.background,
            align: 'center',
            fontFace: 'Arial'
        });
        
        console.log('✅ Created Slide 10: Summary Slide');
    }

    /**
     * Save the presentation to file
     */
    async savePresentationFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `ten-slide-layout-showcase-${timestamp}.pptx`;
        const outputPath = path.join(__dirname, '..', '..', 'output', filename);
        
        try {
            await this.pres.writeFile({ fileName: outputPath });
            
            const result = {
                success: true,
                filename: filename,
                path: outputPath,
                slideCount: 10,
                layouts: [
                    'Title Slide',
                    'Image Left, Text Right',
                    'Three Columns with Icons',
                    'Stacked Content',
                    'Hero Layout',
                    'Dashboard Style',
                    'Timeline Process',
                    'Feature Comparison',
                    'Infographic Style',
                    'Summary Slide'
                ],
                timestamp: new Date().toISOString(),
                generator: 'TenSlideLayoutShowcase'
            };
            
            console.log(`\n🎉 SUCCESS: Ten Slide Layout Showcase generated!`);
            console.log(`📁 File: ${filename}`);
            console.log(`📍 Path: ${outputPath}`);
            console.log(`📊 Slides: ${result.slideCount}`);
            console.log(`🎨 Layouts: ${result.layouts.length} different types`);
            
            return result;
            
        } catch (error) {
            console.error('❌ Error saving presentation:', error);
            throw error;
        }
    }
}

/**
 * Run the ten slide layout showcase generator
 */
async function runTenSlideShowcase() {
    console.log('🚀 Starting Ten Slide Layout Showcase Generator...');
    
    try {
        const generator = new TenSlideLayoutShowcase();
        const result = await generator.generatePresentation();
        
        console.log('\n✅ Generation completed successfully!');
        console.log('📋 Result:', JSON.stringify(result, null, 2));
        
        return result;
        
    } catch (error) {
        console.error('❌ Generation failed:', error);
        throw error;
    }
}

// Export for use in other modules
module.exports = { TenSlideLayoutShowcase, runTenSlideShowcase };

// Run if called directly
if (require.main === module) {
    runTenSlideShowcase()
        .then(result => {
            console.log('🎯 Ten Slide Layout Showcase completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Ten Slide Layout Showcase failed:', error);
            process.exit(1);
        });
}