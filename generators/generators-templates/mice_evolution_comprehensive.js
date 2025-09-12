#!/usr/bin/env node
/**
 * Comprehensive Mice Evolution and Cohabitation Presentation Generator
 * Creates a 10-slide presentation with overflow protection and rich content
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

class MiceEvolutionGenerator {
    constructor() {
        this.colorScheme = {
            primary: '2E86AB',
            secondary: '8B4513',
            accent: 'F18F01',
            text: '333333',
            background: 'FFFFFF',
            lightGray: 'F5F5F5'
        };
        
        // Initialize assets object for PNG icons
        this.assets = {
            lucidePng: [],
            simpleIconsPng: [],
            svgrepoIconsPng: [],
            devIconsPng: []
        };
        
        this.slideData = [
            {
                type: 'title',
                title: 'Human and Mice Cohabitation',
                subtitle: 'Evolution, Adaptation, and Shared Environments',
                image: 'assets-images/laboratory.jpg'
            },
            {
                type: 'content',
                title: 'Introduction to Human-Mouse Relationships',
                leftContent: [
                    'Mice have lived alongside humans for over 10,000 years',
                    'Commensal relationship: mice benefit, humans typically neutral',
                    'Found in human settlements worldwide',
                    'Three main species: house mouse, field mouse, deer mouse',
                    'Evolutionary pressure from human environments'
                ],
                image: 'assets-images/scientific_research.jpg'
            },
            {
                type: 'content',
                title: 'Historical Timeline of Cohabitation',
                leftContent: [
                    '8000 BCE: First agricultural settlements attract mice',
                    '3000 BCE: Mice spread via trade routes',
                    '1500s: Global colonization spreads house mice',
                    '1800s: Industrial revolution creates new habitats',
                    '1900s: Modern pest control methods develop',
                    'Present: Urban environments shape mouse evolution'
                ],
                image: 'assets-images/research_and_development.jpg'
            },
            {
                type: 'content',
                title: 'Mouse Evolution and Adaptation',
                leftContent: [
                    'Rapid reproductive cycle enables quick adaptation',
                    'Behavioral changes: increased neophobia in urban mice',
                    'Physical adaptations: smaller body size in cities',
                    'Dietary flexibility: omnivorous feeding strategies',
                    'Enhanced cognitive abilities for problem-solving'
                ],
                image: 'assets-images/laboratory_equipment.jpg'
            },
            {
                type: 'content',
                title: 'Genetic Changes in Urban Mice',
                leftContent: [
                    'Mutations in coat color genes (Agouti locus)',
                    'Changes in metabolism for processed food diets',
                    'Stress response modifications',
                    'Immune system adaptations to urban pathogens',
                    'Circadian rhythm adjustments to artificial lighting'
                ],
                image: 'assets-images/microscope_science.jpg'
            },
            {
                type: 'content',
                title: 'Behavioral Adaptations',
                leftContent: [
                    'Increased wariness of new objects (neophobia)',
                    'Modified foraging patterns in human environments',
                    'Social structure changes in high-density areas',
                    'Learning to avoid traps and poisons',
                    'Exploiting human food storage and waste'
                ],
                image: 'assets-images/data_analysis.jpg'
            },
            {
                type: 'content',
                title: 'Impact on Human Society',
                leftContent: [
                    'Economic costs: $2 billion annually in crop damage',
                    'Disease transmission: 35+ pathogens carried',
                    'Property damage: gnawing and nesting behaviors',
                    'Positive aspects: laboratory research contributions',
                    'Cultural significance: folklore and symbolism'
                ],
                image: 'assets-images/project_management.jpg'
            },
            {
                type: 'content',
                title: 'Laboratory Mice: A Special Case',
                leftContent: [
                    'Domesticated for over 100 years',
                    'Genetic standardization for research',
                    'Behavioral differences from wild populations',
                    'Contributions to medical breakthroughs',
                    'Ethical considerations in research'
                ],
                image: 'assets-images/lab_experiment.jpg'
            },
            {
                type: 'content',
                title: 'Modern Coexistence Strategies',
                leftContent: [
                    'Integrated pest management approaches',
                    'Habitat modification to reduce attraction',
                    'Biological control methods',
                    'Smart technology for monitoring',
                    'Sustainable coexistence models'
                ],
                image: 'assets-images/technology_development.jpg'
            },
            {
                type: 'conclusion',
                title: 'Future of Human-Mouse Cohabitation',
                leftContent: [
                    'Continued evolutionary pressure from urbanization',
                    'Climate change impacts on distribution',
                    'Emerging technologies for management',
                    'Research opportunities in evolutionary biology',
                    'Balancing coexistence with human needs'
                ],
                image: 'assets-images/beakers_chemistry.jpg'
            }
        ];
    }
    
    async loadAvailableAssets() {
        console.log('🔄 Loading PNG assets...');
        
        // Load Lucide PNG icons
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
        
        // Load Simple Icons PNG
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
        
        // Load SVG Repo Icons PNG
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
        
        // Load DevIcons PNG
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

    createPresentation() {
        const pres = new PptxGenJS();
        pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
        pres.layout = 'LAYOUT_16x9';
        
        // Set presentation properties
        pres.title = 'Human and Mice Cohabitation and Evolution';
        pres.subject = 'Evolutionary Biology and Human-Animal Interactions';
        pres.author = 'Presentation Generator';
        
        this.slideData.forEach((slideInfo, index) => {
            this.addSlide(pres, slideInfo, index + 1);
        });
        
        return pres;
    }

    addSlide(pres, slideInfo, slideNumber) {
        const slide = pres.addSlide();
        
        if (slideInfo.type === 'title') {
            this.addTitleSlide(slide, slideInfo);
        } else {
            this.addContentSlide(slide, slideInfo, slideNumber);
        }
    }

    addTitleSlide(slide, slideInfo) {
        // Background
        slide.background = { color: this.colorScheme.background };
        
        // Main title
        slide.addText(slideInfo.title, {
            x: 1,
            y: 1.5,
            w: 8,
            h: 1.2,
            fontSize: 36,
            bold: true,
            color: this.colorScheme.primary,
            align: 'center',
            fontFace: 'Arial'
        });
        
        // Subtitle
        slide.addText(slideInfo.subtitle, {
            x: 1,
            y: 2.8,
            w: 8,
            h: 0.8,
            fontSize: 20,
            color: this.colorScheme.secondary,
            align: 'center',
            fontFace: 'Arial'
        });
        
        // Add decorative element
        slide.addShape('rect', {
            x: 2,
            y: 4,
            w: 6,
            h: 0.1,
            fill: { color: this.colorScheme.accent }
        });
    }

    addContentSlide(slide, slideInfo, slideNumber) {
        // Background
        slide.background = { color: this.colorScheme.background };
        
        // Title
        slide.addText(slideInfo.title, {
            x: 0.5,
            y: 0.3,
            w: 9,
            h: 0.8,
            fontSize: 24,
            bold: true,
            color: this.colorScheme.primary,
            fontFace: 'Arial'
        });
        
        // Left content area with bullet points
        const bulletText = slideInfo.leftContent.map(item => `• ${item}`).join('\n\n');
        
        slide.addText(bulletText, {
            x: 0.5,
            y: 1.3,
            w: 4.8,
            h: 3.8,
            fontSize: 14,
            color: this.colorScheme.text,
            fontFace: 'Arial',
            valign: 'top',
            lineSpacing: 20
        });
        
        // Right image area
        if (slideInfo.image && fs.existsSync(slideInfo.image)) {
            slide.addImage({
                path: slideInfo.image,
                x: 5.5,
                y: 1.3,
                w: 4,
                h: 3.8,
                sizing: { type: 'contain', w: 4, h: 3.8 }
            });
        } else {
            // Fallback: colored rectangle with text
            slide.addShape('rect', {
                x: 5.5,
                y: 1.3,
                w: 4,
                h: 3.8,
                fill: { color: this.colorScheme.lightGray },
                line: { color: this.colorScheme.secondary, width: 2 }
            });
            
            slide.addText('Image\nPlaceholder', {
                x: 5.5,
                y: 2.8,
                w: 4,
                h: 1,
                fontSize: 16,
                color: this.colorScheme.secondary,
                align: 'center',
                valign: 'middle',
                fontFace: 'Arial'
            });
        }
        
        // Slide number
        slide.addText(`${slideNumber}`, {
            x: 9.2,
            y: 5.2,
            w: 0.6,
            h: 0.3,
            fontSize: 12,
            color: this.colorScheme.secondary,
            align: 'center',
            fontFace: 'Arial'
        });
        
        // Bottom accent line
        slide.addShape('rect', {
            x: 0.5,
            y: 5.4,
            w: 9,
            h: 0.05,
            fill: { color: this.colorScheme.accent }
        });
    }

    async generatePresentation() {
        try {
            console.log('Creating mice evolution presentation...');
            
            // Load PNG assets first
            await this.loadAvailableAssets();
            
            const pres = this.createPresentation();
            
            const outputPath = path.join(__dirname, 'mice_evolution_comprehensive.pptx');
            await pres.writeFile({ fileName: outputPath });
            
            console.log(`Presentation saved to: ${outputPath}`);
            return outputPath;
        } catch (error) {
            console.error('Error generating presentation:', error);
            throw error;
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const generator = new MiceEvolutionGenerator();
    generator.generatePresentation()
        .then(path => console.log(`Success! Presentation created at: ${path}`))
        .catch(error => console.error('Failed to create presentation:', error));
}

module.exports = MiceEvolutionGenerator;