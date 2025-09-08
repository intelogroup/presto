const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Content constraint system for overflow protection
class ContentConstraintSystem {
    static constrainText(text, maxLength = 150) {
        if (!text || typeof text !== 'string') return '';
        return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
    }

    static constrainTitle(title, maxLength = 60) {
        if (!title || typeof title !== 'string') return '';
        return title.length > maxLength ? title.substring(0, maxLength - 3) + '...' : title;
    }

    static constrainBulletPoints(points, maxPoints = 5, maxLength = 120) {
        if (!Array.isArray(points)) return [];
        return points.slice(0, maxPoints).map(point => 
            this.constrainText(point, maxLength)
        );
    }
}

// Sustainable Technology Presentation Generator
class SustainableTechGenerator {
    constructor() {
        this.pres = new PptxGenJS();
        this.setupPresentation();
        this.colors = {
            primary: '2E7D32',      // Deep Green
            secondary: '1976D2',    // Blue
            accent: '388E3C',       // Medium Green
            light: 'E8F5E8',       // Light Green
            dark: '1B5E20',        // Dark Green
            white: 'FFFFFF',
            gray: '757575',
            lightGray: 'F5F5F5'
        };
    }

    setupPresentation() {
        try {
            // Set presentation properties
            this.pres.author = 'Sustainable Tech Generator';
            this.pres.company = 'Green Innovation Labs';
            this.pres.subject = 'Sustainable Technology Solutions';
            this.pres.title = 'The Future of Green Technology';
            this.pres.layout = 'LAYOUT_16x9';
        } catch (error) {
            console.error('Error setting up presentation:', error);
        }
    }

    addTitleSlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.lightGray;

            // Background accent shape
            slide.addShape('rect', {
                x: 0, y: 0, w: '100%', h: 2.5,
                fill: { color: this.colors.primary },
                line: { type: 'none' }
            });

            // Main title
            slide.addText('The Future of Green Technology', {
                x: 1, y: 3, w: 8, h: 1.5,
                fontSize: 44,
                bold: true,
                color: this.colors.dark,
                align: 'center'
            });

            // Subtitle
            slide.addText('Sustainable Solutions for Tomorrow\'s World', {
                x: 1, y: 4.8, w: 8, h: 0.8,
                fontSize: 24,
                color: this.colors.gray,
                align: 'center'
            });

            // Decorative elements
            slide.addShape('ellipse', {
                x: 0.5, y: 1, w: 0.3, h: 0.3,
                fill: { color: this.colors.accent },
                line: { type: 'none' }
            });

            slide.addShape('ellipse', {
                x: 9.2, y: 1.2, w: 0.2, h: 0.2,
                fill: { color: this.colors.secondary },
                line: { type: 'none' }
            });

            console.log('✓ Title slide created');
        } catch (error) {
            console.error('Error creating title slide:', error);
        }
    }

    addOverviewSlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.white;

            // Header
            slide.addText('Sustainable Technology Overview', {
                x: 0.5, y: 0.5, w: 9, h: 0.8,
                fontSize: 32,
                bold: true,
                color: this.colors.primary
            });

            // Content areas with icons (simulated)
            const topics = [
                { title: '🌞 Clean Energy', desc: 'Solar, Wind & Hydro Solutions' },
                { title: '🏙️ Smart Cities', desc: 'IoT & Connected Infrastructure' },
                { title: '🚗 Electric Transport', desc: 'EVs & Sustainable Mobility' },
                { title: '♻️ Circular Economy', desc: 'Waste Reduction & Recycling' },
                { title: '🏢 Green Buildings', desc: 'Energy Efficient Architecture' },
                { title: '🔬 Future Tech', desc: 'Innovation & Research' }
            ];

            topics.forEach((topic, index) => {
                const row = Math.floor(index / 2);
                const col = index % 2;
                const x = 0.5 + (col * 4.5);
                const y = 1.8 + (row * 1.8);

                // Background card
                slide.addShape('rect', {
                    x: x, y: y, w: 4, h: 1.5,
                    fill: { color: this.colors.light },
                    line: { color: this.colors.accent, width: 1 }
                });

                // Title
                slide.addText(ContentConstraintSystem.constrainTitle(topic.title, 25), {
                    x: x + 0.2, y: y + 0.1, w: 3.6, h: 0.6,
                    fontSize: 18,
                    bold: true,
                    color: this.colors.dark
                });

                // Description
                slide.addText(ContentConstraintSystem.constrainText(topic.desc, 40), {
                    x: x + 0.2, y: y + 0.7, w: 3.6, h: 0.6,
                    fontSize: 14,
                    color: this.colors.gray
                });
            });

            console.log('✓ Overview slide created');
        } catch (error) {
            console.error('Error creating overview slide:', error);
        }
    }

    addCleanEnergySlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.white;

            // Header with accent
            slide.addShape('rect', {
                x: 0, y: 0, w: '100%', h: 1.2,
                fill: { color: this.colors.primary },
                line: { type: 'none' }
            });

            slide.addText('Clean Energy Solutions', {
                x: 0.5, y: 0.2, w: 9, h: 0.8,
                fontSize: 28,
                bold: true,
                color: this.colors.white
            });

            // Left content
            const energyStats = [
                '• Solar capacity grew 22% in 2023',
                '• Wind power costs dropped 85% since 2010',
                '• Renewable energy now 30% of global capacity',
                '• $1.8 trillion invested in clean energy',
                '• 13.7 million jobs in renewable sector'
            ];

            slide.addText('Key Statistics:', {
                x: 0.5, y: 1.5, w: 4, h: 0.5,
                fontSize: 20,
                bold: true,
                color: this.colors.dark
            });

            energyStats.forEach((stat, index) => {
                slide.addText(ContentConstraintSystem.constrainText(stat, 50), {
                    x: 0.5, y: 2 + (index * 0.4), w: 4, h: 0.4,
                    fontSize: 14,
                    color: this.colors.gray
                });
            });

            // Right side - Technology types
            slide.addText('Technology Focus Areas:', {
                x: 5.5, y: 1.5, w: 4, h: 0.5,
                fontSize: 20,
                bold: true,
                color: this.colors.dark
            });

            const techTypes = [
                { name: 'Solar PV', progress: 85 },
                { name: 'Wind Turbines', progress: 78 },
                { name: 'Hydroelectric', progress: 65 },
                { name: 'Geothermal', progress: 45 },
                { name: 'Energy Storage', progress: 60 }
            ];

            techTypes.forEach((tech, index) => {
                const y = 2 + (index * 0.6);
                
                // Technology name
                slide.addText(tech.name, {
                    x: 5.5, y: y, w: 2, h: 0.3,
                    fontSize: 12,
                    color: this.colors.dark
                });

                // Progress bar background
                slide.addShape('rect', {
                    x: 7.5, y: y + 0.05, w: 1.8, h: 0.2,
                    fill: { color: this.colors.lightGray },
                    line: { type: 'none' }
                });

                // Progress bar fill
                slide.addShape('rect', {
                    x: 7.5, y: y + 0.05, w: (1.8 * tech.progress / 100), h: 0.2,
                    fill: { color: this.colors.accent },
                    line: { type: 'none' }
                });

                // Percentage
                slide.addText(`${tech.progress}%`, {
                    x: 7.6, y: y, w: 1.6, h: 0.3,
                    fontSize: 10,
                    color: this.colors.white,
                    align: 'center'
                });
            });

            console.log('✓ Clean Energy slide created');
        } catch (error) {
            console.error('Error creating clean energy slide:', error);
        }
    }

    addSmartCitiesSlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.white;

            // Title
            slide.addText('Smart Cities & IoT Infrastructure', {
                x: 0.5, y: 0.3, w: 9, h: 0.8,
                fontSize: 28,
                bold: true,
                color: this.colors.secondary
            });

            // Central hub concept
            slide.addShape('ellipse', {
                x: 4, y: 2.5, w: 2, h: 2,
                fill: { color: this.colors.secondary },
                line: { type: 'none' }
            });

            slide.addText('Smart\nCity Hub', {
                x: 4.2, y: 3.2, w: 1.6, h: 0.6,
                fontSize: 14,
                bold: true,
                color: this.colors.white,
                align: 'center'
            });

            // Connected systems
            const systems = [
                { name: 'Traffic\nManagement', x: 1.5, y: 1.5 },
                { name: 'Energy\nGrid', x: 7.5, y: 1.5 },
                { name: 'Water\nSystems', x: 1.5, y: 4.5 },
                { name: 'Waste\nManagement', x: 7.5, y: 4.5 },
                { name: 'Public\nTransport', x: 2.5, y: 0.8 },
                { name: 'Emergency\nServices', x: 6.5, y: 0.8 }
            ];

            systems.forEach(system => {
                // System node
                slide.addShape('ellipse', {
                    x: system.x, y: system.y, w: 1.2, h: 1.2,
                    fill: { color: this.colors.light },
                    line: { color: this.colors.accent, width: 2 }
                });

                // System label
                slide.addText(system.name, {
                    x: system.x + 0.1, y: system.y + 0.3, w: 1, h: 0.6,
                    fontSize: 10,
                    color: this.colors.dark,
                    align: 'center'
                });

                // Connection line to hub
                slide.addShape('line', {
                    x: system.x + 0.6, y: system.y + 0.6,
                    w: (5 - system.x - 0.6), h: (3.5 - system.y - 0.6),
                    line: { color: this.colors.gray, width: 1, dashType: 'dash' }
                });
            });

            console.log('✓ Smart Cities slide created');
        } catch (error) {
            console.error('Error creating smart cities slide:', error);
        }
    }

    addElectricTransportSlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.white;

            // Title
            slide.addText('Electric Transportation Revolution', {
                x: 0.5, y: 0.3, w: 9, h: 0.8,
                fontSize: 28,
                bold: true,
                color: this.colors.primary
            });

            // Growth chart simulation
            slide.addText('EV Market Growth Projection', {
                x: 0.5, y: 1.2, w: 4, h: 0.5,
                fontSize: 18,
                bold: true,
                color: this.colors.dark
            });

            // Chart background
            slide.addShape('rect', {
                x: 0.5, y: 1.8, w: 4, h: 3,
                fill: { color: this.colors.lightGray },
                line: { color: this.colors.gray, width: 1 }
            });

            // Chart bars
            const years = ['2020', '2022', '2024', '2026', '2028'];
            const values = [3, 8, 15, 28, 45]; // Million units

            years.forEach((year, index) => {
                const barHeight = (values[index] / 50) * 2.5; // Scale to fit
                const x = 0.7 + (index * 0.7);
                const y = 4.8 - barHeight;

                // Bar
                slide.addShape('rect', {
                    x: x, y: y, w: 0.5, h: barHeight,
                    fill: { color: index < 2 ? this.colors.gray : this.colors.accent },
                    line: { type: 'none' }
                });

                // Year label
                slide.addText(year, {
                    x: x, y: 4.9, w: 0.5, h: 0.3,
                    fontSize: 10,
                    color: this.colors.dark,
                    align: 'center'
                });

                // Value label
                slide.addText(`${values[index]}M`, {
                    x: x, y: y - 0.3, w: 0.5, h: 0.2,
                    fontSize: 8,
                    color: this.colors.dark,
                    align: 'center'
                });
            });

            // Benefits section
            slide.addText('Key Benefits:', {
                x: 5.5, y: 1.2, w: 4, h: 0.5,
                fontSize: 18,
                bold: true,
                color: this.colors.dark
            });

            const benefits = [
                '✓ Zero direct emissions',
                '✓ Lower operating costs',
                '✓ Reduced noise pollution',
                '✓ Energy independence',
                '✓ Advanced technology features',
                '✓ Government incentives'
            ];

            benefits.forEach((benefit, index) => {
                slide.addText(ContentConstraintSystem.constrainText(benefit, 35), {
                    x: 5.5, y: 1.8 + (index * 0.4), w: 4, h: 0.4,
                    fontSize: 14,
                    color: this.colors.gray
                });
            });

            console.log('✓ Electric Transport slide created');
        } catch (error) {
            console.error('Error creating electric transport slide:', error);
        }
    }

    addCircularEconomySlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.white;

            // Title
            slide.addText('Circular Economy & Waste Reduction', {
                x: 0.5, y: 0.3, w: 9, h: 0.8,
                fontSize: 28,
                bold: true,
                color: this.colors.accent
            });

            // Circular process visualization
            const centerX = 5;
            const centerY = 3.5;
            const radius = 1.8;

            // Central circle
            slide.addShape('ellipse', {
                x: centerX - 0.8, y: centerY - 0.8, w: 1.6, h: 1.6,
                fill: { color: this.colors.accent },
                line: { type: 'none' }
            });

            slide.addText('Circular\nEconomy', {
                x: centerX - 0.6, y: centerY - 0.3, w: 1.2, h: 0.6,
                fontSize: 12,
                bold: true,
                color: this.colors.white,
                align: 'center'
            });

            // Process steps
            const steps = [
                { name: 'Design', angle: 0 },
                { name: 'Produce', angle: 60 },
                { name: 'Distribute', angle: 120 },
                { name: 'Use', angle: 180 },
                { name: 'Collect', angle: 240 },
                { name: 'Recycle', angle: 300 }
            ];

            steps.forEach((step, index) => {
                const angle = (step.angle * Math.PI) / 180;
                const x = centerX + radius * Math.cos(angle) - 0.4;
                const y = centerY + radius * Math.sin(angle) - 0.4;

                // Step circle
                slide.addShape('ellipse', {
                    x: x, y: y, w: 0.8, h: 0.8,
                    fill: { color: this.colors.light },
                    line: { color: this.colors.accent, width: 2 }
                });

                // Step label
                slide.addText(step.name, {
                    x: x, y: y + 0.2, w: 0.8, h: 0.4,
                    fontSize: 10,
                    color: this.colors.dark,
                    align: 'center'
                });

                // Arrow to next step
                const nextIndex = (index + 1) % steps.length;
                const nextAngle = (steps[nextIndex].angle * Math.PI) / 180;
                const arrowStartX = x + 0.4 + 0.3 * Math.cos(angle);
                const arrowStartY = y + 0.4 + 0.3 * Math.sin(angle);
                const arrowEndX = centerX + (radius - 0.5) * Math.cos(nextAngle);
                const arrowEndY = centerY + (radius - 0.5) * Math.sin(nextAngle);

                slide.addShape('line', {
                    x: arrowStartX, y: arrowStartY,
                    w: arrowEndX - arrowStartX, h: arrowEndY - arrowStartY,
                    line: { color: this.colors.secondary, width: 2 }
                });
            });

            // Impact metrics
            slide.addText('Impact Metrics:', {
                x: 0.5, y: 5.5, w: 9, h: 0.5,
                fontSize: 16,
                bold: true,
                color: this.colors.dark
            });

            const metrics = [
                '80% waste reduction potential',
                '60% lower resource consumption',
                '$4.5T economic opportunity by 2030'
            ];

            metrics.forEach((metric, index) => {
                slide.addText(`• ${ContentConstraintSystem.constrainText(metric, 50)}`, {
                    x: 0.5 + (index * 3), y: 6, w: 2.8, h: 0.4,
                    fontSize: 12,
                    color: this.colors.gray
                });
            });

            console.log('✓ Circular Economy slide created');
        } catch (error) {
            console.error('Error creating circular economy slide:', error);
        }
    }

    addGreenBuildingSlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.white;

            // Title
            slide.addText('Green Building Technology', {
                x: 0.5, y: 0.3, w: 9, h: 0.8,
                fontSize: 28,
                bold: true,
                color: this.colors.primary
            });

            // Building silhouette
            slide.addShape('rect', {
                x: 1, y: 1.5, w: 3, h: 4,
                fill: { color: this.colors.light },
                line: { color: this.colors.accent, width: 2 }
            });

            // Building features
            const features = [
                { name: 'Solar Panels', x: 1.2, y: 1.3, w: 2.6, h: 0.2 },
                { name: 'Smart Windows', x: 1.5, y: 2, w: 0.4, h: 0.6 },
                { name: 'Green Roof', x: 1.2, y: 1.5, w: 2.6, h: 0.3 },
                { name: 'Energy Storage', x: 3.2, y: 4.8, w: 0.6, h: 0.4 }
            ];

            features.forEach(feature => {
                slide.addShape('rect', {
                    x: feature.x, y: feature.y, w: feature.w, h: feature.h,
                    fill: { color: this.colors.secondary },
                    line: { type: 'none' }
                });
            });

            // Efficiency metrics
            slide.addText('Energy Efficiency Gains:', {
                x: 5, y: 1.5, w: 4, h: 0.5,
                fontSize: 18,
                bold: true,
                color: this.colors.dark
            });

            const efficiencyData = [
                { category: 'Heating/Cooling', saving: '40%' },
                { category: 'Lighting', saving: '60%' },
                { category: 'Water Usage', saving: '30%' },
                { category: 'Overall Energy', saving: '50%' }
            ];

            efficiencyData.forEach((data, index) => {
                const y = 2.2 + (index * 0.6);
                
                slide.addText(data.category, {
                    x: 5, y: y, w: 2, h: 0.4,
                    fontSize: 14,
                    color: this.colors.dark
                });

                slide.addText(data.saving, {
                    x: 7.5, y: y, w: 1, h: 0.4,
                    fontSize: 16,
                    bold: true,
                    color: this.colors.accent,
                    align: 'center'
                });

                // Separator line
                slide.addShape('line', {
                    x: 5, y: y + 0.4, w: 3.5, h: 0,
                    line: { color: this.colors.lightGray, width: 1 }
                });
            });

            // Certification badges
            slide.addText('Certifications:', {
                x: 5, y: 4.8, w: 4, h: 0.4,
                fontSize: 16,
                bold: true,
                color: this.colors.dark
            });

            const certifications = ['LEED', 'BREEAM', 'ENERGY STAR'];
            certifications.forEach((cert, index) => {
                slide.addShape('ellipse', {
                    x: 5 + (index * 1.2), y: 5.3, w: 0.8, h: 0.8,
                    fill: { color: this.colors.accent },
                    line: { type: 'none' }
                });

                slide.addText(cert, {
                    x: 5 + (index * 1.2), y: 5.5, w: 0.8, h: 0.4,
                    fontSize: 10,
                    bold: true,
                    color: this.colors.white,
                    align: 'center'
                });
            });

            console.log('✓ Green Building slide created');
        } catch (error) {
            console.error('Error creating green building slide:', error);
        }
    }

    addFutureInnovationsSlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.white;

            // Title
            slide.addText('Future Innovations & Research', {
                x: 0.5, y: 0.3, w: 9, h: 0.8,
                fontSize: 28,
                bold: true,
                color: this.colors.secondary
            });

            // Timeline
            slide.addShape('line', {
                x: 1, y: 3, w: 8, h: 0,
                line: { color: this.colors.primary, width: 3 }
            });

            const innovations = [
                { year: '2025', tech: 'Advanced Battery\nTechnology', x: 1.5 },
                { year: '2027', tech: 'Hydrogen\nEconomy', x: 3.5 },
                { year: '2030', tech: 'Carbon Capture\nScale-up', x: 5.5 },
                { year: '2035', tech: 'Fusion Power\nCommercial', x: 7.5 }
            ];

            innovations.forEach(innovation => {
                // Timeline marker
                slide.addShape('ellipse', {
                    x: innovation.x - 0.1, y: 2.9, w: 0.2, h: 0.2,
                    fill: { color: this.colors.secondary },
                    line: { type: 'none' }
                });

                // Year
                slide.addText(innovation.year, {
                    x: innovation.x - 0.3, y: 2.4, w: 0.6, h: 0.3,
                    fontSize: 12,
                    bold: true,
                    color: this.colors.dark,
                    align: 'center'
                });

                // Technology box
                slide.addShape('rect', {
                    x: innovation.x - 0.6, y: 3.3, w: 1.2, h: 1,
                    fill: { color: this.colors.light },
                    line: { color: this.colors.accent, width: 1 }
                });

                // Technology name
                slide.addText(innovation.tech, {
                    x: innovation.x - 0.5, y: 3.5, w: 1, h: 0.6,
                    fontSize: 10,
                    color: this.colors.dark,
                    align: 'center'
                });
            });

            // Research areas
            slide.addText('Key Research Areas:', {
                x: 0.5, y: 4.8, w: 9, h: 0.5,
                fontSize: 18,
                bold: true,
                color: this.colors.dark
            });

            const researchAreas = [
                'Quantum computing for optimization',
                'Bio-based materials and processes',
                'AI-driven energy management',
                'Atmospheric carbon removal',
                'Next-generation solar cells',
                'Sustainable aviation fuels'
            ];

            researchAreas.forEach((area, index) => {
                const col = index % 2;
                const row = Math.floor(index / 2);
                const x = 0.5 + (col * 4.5);
                const y = 5.4 + (row * 0.4);

                slide.addText(`• ${ContentConstraintSystem.constrainText(area, 35)}`, {
                    x: x, y: y, w: 4, h: 0.4,
                    fontSize: 12,
                    color: this.colors.gray
                });
            });

            console.log('✓ Future Innovations slide created');
        } catch (error) {
            console.error('Error creating future innovations slide:', error);
        }
    }

    addCallToActionSlide() {
        try {
            const slide = this.pres.addSlide();
            slide.bkgd = this.colors.primary;

            // Main message
            slide.addText('Together, We Can Build\na Sustainable Future', {
                x: 1, y: 2, w: 8, h: 1.5,
                fontSize: 36,
                bold: true,
                color: this.colors.white,
                align: 'center'
            });

            // Action items
            const actions = [
                'Invest in clean technology',
                'Support sustainable policies',
                'Adopt green practices',
                'Drive innovation forward'
            ];

            slide.addText('How You Can Contribute:', {
                x: 1, y: 4, w: 8, h: 0.5,
                fontSize: 20,
                color: this.colors.light,
                align: 'center'
            });

            actions.forEach((action, index) => {
                slide.addText(`${index + 1}. ${ContentConstraintSystem.constrainText(action, 40)}`, {
                    x: 2, y: 4.8 + (index * 0.4), w: 6, h: 0.4,
                    fontSize: 16,
                    color: this.colors.white,
                    align: 'center'
                });
            });

            // Decorative elements
            slide.addShape('ellipse', {
                x: 0.2, y: 1, w: 0.4, h: 0.4,
                fill: { color: this.colors.accent },
                line: { type: 'none' }
            });

            slide.addShape('ellipse', {
                x: 9.4, y: 5.8, w: 0.3, h: 0.3,
                fill: { color: this.colors.light },
                line: { type: 'none' }
            });

            console.log('✓ Call to Action slide created');
        } catch (error) {
            console.error('Error creating call to action slide:', error);
        }
    }

    async generatePresentation() {
        try {
            console.log('🌱 Starting Sustainable Technology Presentation Generation...');
            
            // Generate all slides
            this.addTitleSlide();
            this.addOverviewSlide();
            this.addCleanEnergySlide();
            this.addSmartCitiesSlide();
            this.addElectricTransportSlide();
            this.addCircularEconomySlide();
            this.addGreenBuildingSlide();
            this.addFutureInnovationsSlide();
            this.addCallToActionSlide();

            // Save presentation
            const outputPath = path.join(__dirname, 'sustainable_tech_presentation.pptx');
            await this.pres.writeFile({ fileName: outputPath });
            
            console.log('✅ Sustainable Technology Presentation generated successfully!');
            console.log(`📁 Saved to: ${outputPath}`);
            console.log('📊 Features included:');
            console.log('   • 9 professionally designed slides');
            console.log('   • Modern green color scheme');
            console.log('   • Interactive visualizations');
            console.log('   • Data-driven content');
            console.log('   • Overflow-safe text constraints');
            console.log('   • Advanced layout patterns');
            
            return outputPath;
        } catch (error) {
            console.error('❌ Error generating presentation:', error);
            throw error;
        }
    }
}

// Execute the generator
if (require.main === module) {
    const generator = new SustainableTechGenerator();
    generator.generatePresentation().catch(console.error);
}

module.exports = SustainableTechGenerator;