/**
 * Infographic & Lucid Icons Layout Generator
 * Showcases different layout types using Lucide icons and illustrations:
 * 1. Infographic Dashboard Layout
 * 2. Timeline Process Layout
 * 3. Hero Illustration Layout
 * 4. Icon Grid Features Layout
 * 5. Split Infographic Layout
 */

const PptxGenJS = require('pptxgenjs');
const path = require('path');
const fs = require('fs');

class InfographicLucidLayoutGenerator {
    constructor(pptx) {
        this.pres = pptx || new PptxGenJS();
        this.colors = {
            primary: '003366',
            secondary: '00A1E0',
            accent: 'FFC72C',
            background: 'F0F0F0',
            text: '333333',
            lightGray: 'E0E0E0',
            gray: '808080',
            border: 'C0C0C0',
            white: 'FFFFFF',
            darkText: '000000'
        };
        this.assets = { lucide: [], undraw: [], humaaans: [], infographics: [], lucidePng: [], simpleIconsPng: [], svgrepoIconsPng: [], devIconsPng: [] };
        this.iconMap = ['bar-chart-3', 'shield', 'plugs', 'lightbulb', 'server', 'cpu'];
    }

    async loadAssets() {
        this.assets = {
            lucide: [],
            undraw: [],
            humaaans: [],
            heroicons: [],
            illustrations: [],
            lucidePng: [],
            simpleIconsPng: [],
            svgrepoIconsPng: [],
            devIconsPng: []
        };

        // Load Lucide icons - the largest collection with 180+ icons
        const lucidePath = path.join(__dirname, '..', 'assets-images', 'lucide', 'general');
        try {
            if (fs.existsSync(lucidePath)) {
                this.assets.lucide = fs.readdirSync(lucidePath)
                    .filter(file => file.match(/\.svg$/i))
                    .map(file => path.join(lucidePath, file));
                console.log(`✅ Loaded ${this.assets.lucide.length} Lucide icons`);
            }
        } catch (error) {
            console.warn('Could not load Lucide icons:', error.message);
        }

        // Load Undraw illustrations
        const undrawDirectories = ['business', 'education', 'illustrations', 'science'];
        undrawDirectories.forEach(dir => {
            try {
                const undrawPath = path.join(__dirname, '..', 'assets-images', 'undraw', dir);
                if (fs.existsSync(undrawPath)) {
                    const files = fs.readdirSync(undrawPath)
                        .filter(file => file.match(/\.(jpg|png|svg)$/i))
                        .map(file => path.join(undrawPath, file));
                    this.assets.undraw.push(...files);
                }
            } catch (error) {
                console.debug(`Could not load undraw/${dir}:`, error.message);
            }
        });
        console.log(`✅ Loaded ${this.assets.undraw.length} Undraw illustrations`);

        // Load Humaaans illustrations
        const humaaansDirectories = ['business', 'education', 'illustrations', 'tech'];
        humaaansDirectories.forEach(dir => {
            try {
                const humaaansPath = path.join(__dirname, '..', 'assets-images', 'humaaans', dir);
                if (fs.existsSync(humaaansPath)) {
                    const files = fs.readdirSync(humaaansPath)
                        .filter(file => file.match(/\.(jpg|png|svg)$/i))
                        .map(file => path.join(humaaansPath, file));
                    this.assets.humaaans.push(...files);
                }
            } catch (error) {
                console.debug(`Could not load humaaans/${dir}:`, error.message);
            }
        });
        console.log(`✅ Loaded ${this.assets.humaaans.length} Humaaans illustrations`);

        // Load PNG assets from assets-images-png directory
        // Load Lucide PNG versions
        try {
            const lucidePngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'lucide', 'general');
            if (fs.existsSync(lucidePngPath)) {
                this.assets.lucidePng = fs.readdirSync(lucidePngPath)
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(lucidePngPath, file));
                console.log(`✅ Loaded ${this.assets.lucidePng.length} Lucide PNG icons`);
            }
        } catch (error) {
            console.warn('Could not load Lucide PNG icons:', error.message);
        }

        // Load Simple Icons PNG versions
        try {
            const simpleIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'simpleicons', 'brand');
            if (fs.existsSync(simpleIconsPngPath)) {
                this.assets.simpleIconsPng = fs.readdirSync(simpleIconsPngPath)
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(simpleIconsPngPath, file));
                console.log(`✅ Loaded ${this.assets.simpleIconsPng.length} Simple Icons PNG`);
            }
        } catch (error) {
            console.warn('Could not load Simple Icons PNG:', error.message);
        }

        // Load SVG Repo Icons PNG versions
        try {
            const svgrepoIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'svgrepo-icons-graphics');
            if (fs.existsSync(svgrepoIconsPngPath)) {
                this.assets.svgrepoIconsPng = fs.readdirSync(svgrepoIconsPngPath)
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(svgrepoIconsPngPath, file));
                console.log(`✅ Loaded ${this.assets.svgrepoIconsPng.length} SVG Repo Icons PNG`);
            }
        } catch (error) {
            console.warn('Could not load SVG Repo Icons PNG:', error.message);
        }

        // Load DevIcons PNG versions
        try {
            const devIconsPngPath = path.join(__dirname, '..', '..', 'assets-images-png', 'devicons', 'tech');
            if (fs.existsSync(devIconsPngPath)) {
                this.assets.devIconsPng = fs.readdirSync(devIconsPngPath)
                    .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
                    .map(file => path.join(devIconsPngPath, file));
                console.log(`✅ Loaded ${this.assets.devIconsPng.length} DevIcons PNG`);
            }
        } catch (error) {
            console.warn('Could not load DevIcons PNG:', error.message);
        }
    }

    /**
     * Get asset by type and index with fallback
     */
    getAsset(type, index) {
        if (this.assets[type] && this.assets[type].length > index) {
            return this.assets[type][index];
        }
        console.log(`⚠️  No ${type} asset at index ${index}`);
        return null;
    }

    /**
     * Get Lucide icon by name or index
     */
    getLucidIcon(iconName) {
        if (!this.assets.lucide || this.assets.lucide.length === 0) return null;

        // Icon mapping for missing icons that exist with different names
        const iconMapping = {
            'check-circle': 'check',
            'code': 'terminal',
            'keyboard': 'terminal',
            'smile': 'user', // Best available fallback for smile
            'bar-chart-3': 'chart-bar',
            'bar-chart': 'chart-bar',
            'plugs': 'zap',
            'integration': 'zap',
            'grow': 'trending-up',
            'scalability': 'trending-up',
            'rocket': 'plane',
            'launch': 'plane',
            'performance': 'zap',
            'speed': 'zap',
            'reliability': 'shield',
            'btms-connectivity': 'globe'
        };

        // Apply mapping if icon is missing
        const mappedIcon = iconMapping[iconName] || iconName;

        // First, try to find by specific icon name with 'lucide_' prefix
        const specificMatch = this.assets.lucide.find(icon =>
            path.basename(icon) === `lucide_${mappedIcon}.svg`);
        if (specificMatch) {
            console.log(`✅ Found Lucide icon: ${iconName} → ${path.basename(specificMatch)}`);
            return specificMatch;
        }

        // Second, try to find by keyword match with 'lucide_' prefix
        const keywordMatch = this.assets.lucide.find(icon =>
            path.basename(icon).toLowerCase().includes(`lucide_${mappedIcon.toLowerCase()}`));
        if (keywordMatch) {
            console.log(`✅ Found Lucide icon via keyword: ${iconName} → ${path.basename(keywordMatch)}`);
            return keywordMatch;
        }

        // Third, try original name (backward compatibility)
        const fallbackMatch = this.assets.lucide.find(icon =>
            path.basename(icon).includes(`lucide_${iconName}.svg`) ||
            path.basename(icon).toLowerCase().includes(iconName.toLowerCase()));
        if (fallbackMatch) {
            console.log(`⚠️  Found Lucide icon via fallback: ${iconName} → ${path.basename(fallbackMatch)}`);
            return fallbackMatch;
        }

        // Finally, return by hash for missing icons + log warning
        const hash = iconName.split('').reduce((a,b) => a + b.charCodeAt(0), 0);
        const index = hash % this.assets.lucide.length;
        const fallbackIcon = this.assets.lucide[index];
        console.log(`⚠️  No exact match for "${iconName}", using fallback: ${path.basename(fallbackIcon)}`);

        return fallbackIcon;
    }

    /**
     * Generate the complete presentation with all infographic layouts
     */
    async generatePresentation() {
        console.log('🎨\n🎨 Generating Infographic & Lucid Icons Layout Showcase...\n');

        await this.loadAssets();

        try {
            // Title slide with hero illustration
            this.createTitleSlide();

            // Layout 1: Infographic Dashboard Layout
            this.createInfographicDashboardSlide();

            // Layout 2: Timeline Process Layout
            this.createTimelineProcessSlide();

            // Layout 3: Hero Illustration Layout
            this.createHeroIllustrationSlide();

            // Layout 4: Icon Grid Features Layout
            this.createIconGridFeaturesSlide();

            // Layout 5: Split Infographic Layout
            this.createSplitInfographicSlide();

            // Summary slide
            this.createLayoutSummarySlide();

            // Save presentation
            const outputPath = await this.savePresentationFile();

            console.log('✅ Infographic showcase presentation generated successfully!');
            console.log(`💾 Saved to: ${outputPath}`);

            return {
                success: true,
                outputPath,
                slides: 7,
                assetTypes: {
                    lucideIcons: this.assets.lucide.length,
                    undrawIllos: this.assets.undraw.length,
                    humaaansIllos: this.assets.humaaans.length
                },
                layoutTypes: 5
            };

        } catch (error) {
            console.error('❌ Error generating infographic presentation:', error);
            throw error;
        }
    }

    /**
     * Title slide with hero illustration
     */
    createTitleSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Hero illustration (full width)
        const heroIllustration = this.getAsset('undraw', 0) || this.getAsset('humaaans', 0);
        if (heroIllustration) {
            try {
                slide.addImage({
                    path: heroIllustration,
                    x: 0, y: 0, w: 10, h: 5.625,
                    sizing: { type: 'cover' }
                });
                console.log(`✅ Added hero illustration: ${path.basename(heroIllustration)}`);
            } catch (error) {
                console.warn('Could not add hero illustration:', error.message);
            }
        }

        // Overlay text with semi-transparent background
        slide.addShape('rect', {
            x: 0.5, y: 1, w: 9, h: 3.5,
            fill: { color: this.colors.background, alpha: 85 }
        });

        // Title text
        slide.addText('Infographic & Lucid Icons Layouts', {
            x: 1, y: 1.5, w: 8, h: 1,
            fontSize: 36,
            bold: true,
            color: this.colors.text,
            align: 'center'
        });

        // Subtitle
        slide.addText('Dynamic Presentation Generator with Visual Assets', {
            x: 1, y: 3, w: 8, h: 0.4,
            fontSize: 20,
            color: this.colors.darkText,
            align: 'center'
        });

        console.log('✓ Created title slide with hero illustration');
    }

    /**
     * Layout 1: Infographic Dashboard Layout
     */
    createInfographicDashboardSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.lightGray };

        // Title
        slide.addText('Dashboard Overview - Q4 Metrics', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Central large chart/infographic
        const chartData = [
            {
                name: 'Revenue',
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                values: [120000, 135000, 158000, 182000]
            },
            {
                name: 'Growth',
                labels: ['Q1', 'Q2', 'Q3', 'Q4'],
                values: [15, 22, 32, 45]
            }
        ];

        slide.addChart('bar', chartData, {
            x: 1, y: 1.5, w: 6, h: 3.5,
            showTitle: false,
            showLegend: true,
            chartColors: this.chartColors,
            catAxisLabelColor: this.colors.darkText,
            valAxisLabelColor: this.colors.darkText
        });

        // Surrounding KPI callouts with Lucide icons
        const kpis = [
            {
                title: 'Revenue Growth',
                value: '+45%',
                icon: 'trending-up',
                color: this.colors.secondary
            },
            {
                title: 'Customer Satisfaction',
                value: '94%',
                icon: 'smile',
                color: this.colors.primary
            },
            {
                title: 'New Clients',
                value: '+27',
                icon: 'user-plus',
                color: this.colors.accent
            }
        ];

        kpis.forEach((kpi, index) => {
            const yPos = 1.2 + (index * 1.2);
            const iconPath = this.getLucidIcon(kpi.icon);

            // KPI box
            slide.addShape('rect', {
                x: 7.5, y: yPos, w: 2, h: 1,
                fill: this.colors.background,
                line: { color: kpi.color, width: 3 }
            });

            // Icon
            if (iconPath) {
                try {
                    slide.addImage({
                        path: iconPath,
                        x: 7.7, y: yPos + 0.1, w: 0.4, h: 0.4,
                        sizing: { type: 'contain' }
                    });
                } catch (error) {
                    slide.addText('📊', {
                        x: 7.7, y: yPos + 0.1, w: 0.4, h: 0.4,
                        fontSize: 16,
                        align: 'center'
                    });
                }
            }

            // KPI text
            slide.addText(kpi.title, {
                x: 8.2, y: yPos + 0.1, w: 1.2, h: 0.25,
                fontSize: 12,
                color: this.colors.darkText
            });

            slide.addText(kpi.value, {
                x: 8.2, y: yPos + 0.4, w: 1.2, h: 0.3,
                fontSize: 16,
                bold: true,
                color: kpi.color
            });
        });

        console.log('✓ Created infographic dashboard layout');
    }

    /**
     * Layout 2: Timeline Process Layout
     */
    createTimelineProcessSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Title
        slide.addText('Project Development Timeline', {
            x: 0.5, y: 0.3, w: 9, h: 0.8,
            fontSize: 28,
            bold: true,
            color: this.colors.primary,
            align: 'center'
        });

        // Horizontal timeline with Lucide icons
        const timelineSteps = [
            { name: 'Planning', icon: 'calendar', desc: 'Strategy & requirements gathering' },
            { name: 'Design', icon: 'palette', desc: 'UI/UX design and prototyping' },
            { name: 'Development', icon: 'code', desc: 'Implementation and coding' },
            { name: 'Testing', icon: 'check-circle', desc: 'Quality assurance & bug fixes' },
            { name: 'Launch', icon: 'rocket', desc: 'Production deployment' }
        ];

        timelineSteps.forEach((step, index) => {
            const xPos = 0.5 + (index * 1.9); // Increased spacing
            const yPos = 1.5;

            // Timeline line
            if (index < timelineSteps.length - 1) {
                slide.addShape('line', {
                    x: xPos + 1, y: yPos + 0.5, w: 0.9, h: 0, // Correctly positioned line
                    line: { color: this.colors.primary, width: 3 }
                });
            }

            // Icon circle background
            slide.addShape('ellipse', {
                x: xPos, y: yPos, w: 1, h: 1,
                fill: this.colors.primary
            });

            // Lucide icon
            const iconPath = this.getLucidIcon(step.icon);
            if (iconPath) {
                try {
                    slide.addImage({
                        path: iconPath,
                        x: xPos + 0.25, y: yPos + 0.25, w: 0.5, h: 0.5,
                        sizing: { type: 'contain' }
                    });
                } catch (error) {
                    slide.addText('⭕', {
                        x: xPos + 0.25, y: yPos + 0.25, w: 0.5, h: 0.5,
                        fontSize: 24
                    });
                }
            }

            // Step name
            slide.addText(step.name.toUpperCase(), {
                x: xPos, y: 2.3, w: 1, h: 0.4,
                fontSize: 14,
                bold: true,
                color: this.colors.darkText,
                align: 'center'
            });

            // Step description
            slide.addText(step.desc, {
                x: xPos, y: 2.8, w: 1, h: 0.8,
                fontSize: 12,
                color: this.colors.text,
                align: 'center'
            });
        });

        console.log('✓ Created timeline process layout');
    }

    /**
     * Layout 3: Hero Illustration Layout
     */
    createHeroIllustrationSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.primary };

        // Left side: White container for the illustration
        slide.addShape('rect', {
            x: 0, y: 0, w: '65%', h: '100%',
            fill: { color: this.colors.background }
        });

        // Large hero illustration
        const heroIllustration = this.getAsset('humaaans', 2) || this.getAsset('undraw', 2);
        if (heroIllustration) {
            try {
                slide.addImage({
                    path: heroIllustration,
                    x: '5%', y: '15%', w: '55%', h: '70%',
                    sizing: { type: 'contain', w: '55%', h: '70%' }
                });
                console.log(`✅ Added hero illustration: ${path.basename(heroIllustration)}`);
            } catch (error) {
                console.warn('Could not add hero illustration:', error.message);
                this.addIllustrationPlaceholder(slide, 0.5, 0.8, 6, 4, 'Hero Illustration');
            }
        } else {
            this.addIllustrationPlaceholder(slide, 0.5, 0.8, 6, 4, 'Hero Illustration');
        }

        // Right side content
        slide.addText('Revolutionary Approach', {
            x: '68%', y: '25%', w: '28%', h: '15%',
            fontSize: 28,
            bold: true,
            color: this.colors.background, // White text for contrast
            align: 'left',
            valign: 'top'
        });

        slide.addText('Transform your business with innovative solutions that drive growth and create lasting impact. Our comprehensive platform delivers results that matter.', {
            x: '68%', y: '45%', w: '28%', h: '40%',
            fontSize: 16,
            color: this.colors.lightGray, // Lighter text for subtext
            align: 'left',
            valign: 'top'
        });

        console.log('✓ Created hero illustration layout');
    }

    /**
     * Layout 4: Icon Grid Features Layout
     */
    createIconGridFeaturesSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        const gridParams = { cols: 3, rows: 2, y: 1.5, h: 3, w: 8 };
        const colW = gridParams.w / gridParams.cols;
        const rowH = gridParams.h / gridParams.rows;

        slide.addText('Key Features', {
            x: 0, y: 0.5, w: '100%', h: 0.75,
            align: 'center', fontSize: 32, bold: true, color: this.colors.primary
        });

        for (let row = 0; row < gridParams.rows; row++) {
            for (let col = 0; col < gridParams.cols; col++) {
                const xPos = 1 + (col * colW);
                const yPos = gridParams.y + (row * rowH);

                const iconName = this.iconMap[row * gridParams.cols + col] || 'box';
                const icon = this.getAsset('lucide', iconName);

                if (icon) {
                    slide.addImage({ path: icon, x: xPos + 0.1, y: yPos, w: 0.5, h: 0.5, sizing: { type: 'contain' } });
                }

                slide.addText(`Feature ${row * gridParams.cols + col + 1}`, {
                    x: xPos + 0.7, y: yPos, w: colW - 0.8, h: 0.5,
                    fontSize: 18, bold: true, color: this.colors.text
                });

                slide.addText('Brief description of this amazing feature.', {
                    x: xPos + 0.7, y: yPos + 0.4, w: colW - 0.8, h: 1,
                    fontSize: 12, color: this.colors.gray
                });
            }
        }

        console.log('✓ Created icon grid features layout');
    }

    /**
     * Layout 5: Split Infographic Layout
     */
    createSplitInfographicSlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.background };

        // Left side: Text content
        slide.addText('Data-Driven Insights', {
            x: 0.5, y: 1.5, w: 4, h: 0.5,
            fontSize: 32, bold: true, color: this.colors.primary
        });

        slide.addText('Our platform provides deep analytics and data visualization to help you make informed decisions. Track KPIs, monitor performance, and uncover trends with our powerful reporting tools.', {
            x: 0.5, y: 2.2, w: 4, h: 2,
            fontSize: 14, color: this.colors.text
        });

        // Right side: Chart/infographic from assets
        const chartPath = this.getAsset('infographics', 'diagrams'); // Simplified asset retrieval
        if (chartPath) {
            try {
                slide.addImage({
                    path: chartPath,
                    x: 5.5, y: 1, w: 4, h: 4,
                    sizing: { type: 'contain' }
                });
                console.log(`✅ Added infographic: ${path.basename(chartPath)}`);
            } catch (error) {
                console.warn('Could not add infographic:', error.message);
                this.addIllustrationPlaceholder(slide, 5.5, 1, 4, 4, 'Infographic');
            }
        } else {
            this.addIllustrationPlaceholder(slide, 5.5, 1, 4, 4, 'Infographic');
        }

        console.log('✓ Created split infographic layout');
    }

    /**
     * Summary slide with all layouts overview
     */
    createLayoutSummarySlide() {
        const slide = this.pres.addSlide();
        slide.background = { color: this.colors.primary };

        // Title
        slide.addText('Layout Showcase Summary', {
            x: 1, y: 0.5, w: 8, h: 0.8,
            fontSize: 32,
            bold: true,
            color: this.colors.background,
            align: 'center'
        });

        // Layout types summary
        const layoutTypes = [
            '🎯 Dashboard Analytics',
            '⏱️ Timeline Processes', 
            '🖼️ Hero Illustrations',
            '🔧 Icon Feature Grids',
            '📊 Split Infographics'
        ];

        layoutTypes.forEach((layout, index) => {
            slide.addText(layout, {
                x: 1, y: 1.8 + (index * 0.7), w: 8, h: 0.5,
                fontSize: 18,
                color: this.colors.background,
                align: 'left'
            });
        });

        // Asset usage footer
        slide.addText(`Using ${this.assets.lucide.length}+ Lucide icons and illustration galleries`, {
            x: 1, y: 4.8, w: 8, h: 0.4,
            fontSize: 14,
            color: this.colors.background,
            align: 'center',
            italic: true
        });

        console.log('✓ Created layout summary slide');
    }

    /**
     * Add illustration placeholder
     */
    addIllustrationPlaceholder(slide, x, y, w, h, label) {
        slide.addShape('rect', {
            x: x, y: y, w: w, h: h,
            fill: this.colors.lightGray,
            line: { color: this.colors.border, width: 2 }
        });

        slide.addText(label, {
            x: x + 0.2, y: y + h/3, w: w - 0.4, h: h/3,
            fontSize: 16,
            bold: true,
            color: this.colors.secondary,
            align: 'center',
            valign: 'middle'
        });
    }

    /**
     * Save presentation to file
     */
    async savePresentationFile() {
        try {
            // Ensure output directory exists
            const outputDir = path.join(__dirname, '..', 'output');
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputPath = path.join(outputDir, `infographic-lucid-layouts-${timestamp}.pptx`);

            await this.pres.writeFile({ fileName: outputPath });

            // Create detailed metadata
            const metadata = {
                title: 'Infographic & Lucid Icons Layouts Showcase',
                generatedAt: new Date().toISOString(),
                slides: 7,
                layoutTypes: [
                    'Infographic Dashboard',
                    'Timeline Process',
                    'Hero Illustration',
                    'Icon Grid Features',
                    'Split Infographic'
                ],
                assetsUsed: {
                    lucideIcons: this.assets.lucide.length,
                    undrawIllustrations: this.assets.undraw.length,
                    humaaansIllustrations: this.assets.humaaans.length,
                    assetBreakdown: {
                        heroIllustrations: 1,
                        dashboardIcons: 3,
                        timelineIcons: 5,
                        featureGridIcons: 8,
                        infographicIcons: 6
                    },
                    assetLibraries: [
                        'Lucide Icons (180+ icons)',
                        'Undraw Illustrations',
                        'Humaaans Illustrations',
                        'Dynamic Charts & Visualizations'
                    ]
                },
                features: [
                    'Dynamic Lucide icon integration',
                    'Chart-powered infographics',
                    'Hero illustration layouts',
                    'Responsive grid systems',
                    'Professional color schemes',
                    'Automated asset selection'
                ],
                dynamicGenerator: {
                    systemVersion: '2.0.0',
                    assetIntegration: true,
                    layoutOptimization: true,
                    infographicSupport: true,
                    lucideIconSystem: true
                }
            };

            const metadataPath = path.join(outputDir, 'infographic-layouts-metadata.json');
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

            return outputPath;

        } catch (error) {
            console.error('💥 Error saving infographic presentation:', error);
            throw error;
        }
    }
}

// Run the infographic layout test
async function runInfographicLayoutTest() {
    console.log('🎨 Starting Infographic & Lucid Layouts Test...\n');

    try {
        const test = new InfographicLucidLayoutGenerator();
        const result = await test.generatePresentation();

        console.log('\n🎉 Infographic layouts test completed successfully!');
        console.log('📊 Results:');
        console.log(`   • Success: ${result.success}`);
        console.log(`   • Slides: ${result.slides}`);
        console.log(`   • Layout Types: ${result.layoutTypes}`);
        console.log(`   • Lucide Icons Available: ${result.assetTypes.lucideIcons}`);
        console.log(`   • Undraw Illustrations: ${result.assetTypes.undrawIllos}`);
        console.log(`   • Humaaans Illustrations: ${result.assetTypes.humaaansIllos}`);
        console.log(`   • Output: ${result.outputPath}`);
        console.log('\n✅ Dynamic presentation system now supports infographics and Lucide icons!');

        return result;

    } catch (error) {
        console.error('\n💥 Infographic test failed:', error.message);
        console.error('Stack:', error.stack);
        throw error;
    }
}

// Export for use in other modules
module.exports = { InfographicLucidLayoutGenerator, runInfographicLayoutTest };

// Direct execution
if (require.main === module) {
    runInfographicLayoutTest()
        .then(result => {
            console.log('\n🎉 All infographic layouts with Lucide icons generated successfully!');
            console.log('🎯 Presentation ready with multiple professional layout types!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Infographic test failed:', error.message);
            process.exit(1);
        });
}
