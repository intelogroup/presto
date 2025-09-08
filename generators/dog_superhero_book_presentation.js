#!/usr/bin/env node
/**
 * Dog Superhero Book Presentation Generator
 * Creates a 5-slide presentation about a Dog superhero book
 * Following best practices from successful generators
 */

const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Content constraint system for overflow protection
class ContentConstraintSystem {
    static constrainTitle(text, maxLength = 60) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    static constrainText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    static constrainBulletPoints(points, maxPoints = 6, maxLength = 80) {
        return points.slice(0, maxPoints).map(point => 
            this.constrainText(point, maxLength)
        );
    }
}

class DogSuperheroBookGenerator {
    constructor() {
        // Superhero-themed color scheme with vibrant, heroic colors
        this.colorScheme = {
            primary: '1E3A8A',      // Deep Blue (superhero classic)
            secondary: 'DC2626',    // Bold Red (cape color)
            accent: 'F59E0B',       // Golden Yellow (heroic accent)
            text: '1F2937',         // Dark Gray
            background: 'FFFFFF',   // White
            lightBlue: 'DBEAFE',    // Light Blue
            lightRed: 'FEE2E2',     // Light Red
            lightYellow: 'FEF3C7'   // Light Yellow
        };
        
        this.slideData = [
            {
                type: 'title',
                title: 'Super Paws: The Ultimate Dog Superhero',
                subtitle: 'An Epic Adventure Story for Young Heroes'
            },
            {
                type: 'content',
                title: 'Meet Our Canine Hero',
                content: [
                    'Max the Golden Retriever discovers his superpowers',
                    'Super strength, flight, and incredible loyalty',
                    'Lives with the Johnson family in Heroville',
                    'Secret identity as a regular family pet',
                    'Wears a blue cape with golden paw emblem',
                    'Best friend to 8-year-old Emma Johnson'
                ]
            },
            {
                type: 'content',
                title: 'The Adventure Begins',
                content: [
                    'Mysterious villain threatens the city\'s pets',
                    'Dr. Whiskers plans to turn all dogs into robots',
                    'Max must overcome his fear of cats',
                    'Teams up with Bella the Border Collie',
                    'Epic chase scene through downtown Heroville',
                    'Discovers the power of teamwork and friendship'
                ]
            },
            {
                type: 'content',
                title: 'Themes and Life Lessons',
                content: [
                    'Courage comes in all shapes and sizes',
                    'True heroes help others without expecting rewards',
                    'Friendship and loyalty are the greatest superpowers',
                    'Everyone has unique talents and abilities',
                    'Standing up to bullies protects the community',
                    'Being different makes you special, not strange'
                ]
            },
            {
                type: 'conclusion',
                title: 'Why Kids Will Love This Book',
                content: [
                    'Relatable animal characters with human emotions',
                    'Action-packed adventure with humor and heart',
                    'Beautiful illustrations of superhero dogs',
                    'Perfect for ages 6-10, independent or read-aloud',
                    'Inspires children to be brave and kind',
                    'Sets up exciting sequel possibilities'
                ]
            }
        ];
    }
    
    createPresentation() {
        const pres = new PptxGenJS();
        pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
        pres.layout = 'LAYOUT_16x9';
        pres.title = 'Dog Superhero Book Presentation';
        
        this.slideData.forEach((slideData, index) => {
            switch(slideData.type) {
                case 'title':
                    this.addTitleSlide(pres, slideData);
                    break;
                case 'content':
                    this.addContentSlide(pres, slideData);
                    break;
                case 'conclusion':
                    this.addConclusionSlide(pres, slideData);
                    break;
                default:
                    console.warn(`Unknown slide type: ${slideData.type}`);
            }
        });
        
        return pres;
    }
    
    addTitleSlide(pres, data) {
        const slide = pres.addSlide();

        // Superhero-themed background
        slide.background = { color: this.colorScheme.lightBlue };

        // Main title with superhero styling
        slide.addText(ContentConstraintSystem.constrainTitle(data.title), {
            x: 1, y: 1.5, w: 8, h: 1.2,
            fontSize: 44, bold: true, color: this.colorScheme.primary,
            align: 'center', fontFace: 'Calibri'
        });

        // Subtitle
        slide.addText(ContentConstraintSystem.constrainText(data.subtitle), {
            x: 1, y: 2.8, w: 8, h: 0.8,
            fontSize: 24, color: this.colorScheme.secondary,
            align: 'center', fontFace: 'Calibri'
        });

        // Heroic accent elements (no outline)
        slide.addShape('rect', {
            x: 2, y: 4, w: 6, h: 0.15,
            fill: { color: this.colorScheme.accent }
        });

        // Add decorative image on the right if available, otherwise draw placeholder
        try {
            const imgPath = path.join(__dirname, 'assets-images', 'laboratory.jpg');
            if (fs.existsSync(imgPath)) {
                slide.addImage({ path: imgPath, x: 8.5, y: 1.5, w: 1.2, h: 1.2, transparency: 30 });
            } else {
                // Draw placeholder box
                slide.addShape('rect', { x: 8.5, y: 1.5, w: 1.2, h: 1.2, fill: { color: this.colorScheme.lightBlue }, line: { color: this.colorScheme.primary } });
                slide.addText('Image', { x: 8.5, y: 1.9, w: 1.2, h: 0.4, fontSize: 10, color: this.colorScheme.primary, align: 'center' });
            }
        } catch (error) {
            console.warn('Could not add title slide image:', error.message);
        }
        
        // Decorative paw prints
        slide.addShape('ellipse', {
            x: 1.5, y: 4.5, w: 0.3, h: 0.3,
            fill: { color: this.colorScheme.primary },
            line: { width: 0 }
        });
        
        slide.addShape('ellipse', {
            x: 8.2, y: 4.5, w: 0.3, h: 0.3,
            fill: { color: this.colorScheme.primary },
            line: { width: 0 }
        });
    }
    
    addContentSlide(pres, data) {
        const slide = pres.addSlide();
        
        // Light themed background
        slide.background = { color: this.colorScheme.background };
        
        // Title with superhero accent
        slide.addText(ContentConstraintSystem.constrainTitle(data.title), {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 36, bold: true, color: this.colorScheme.primary,
            align: 'left', fontFace: 'Calibri'
        });
        
        // Accent line under title (no outline)
        slide.addShape('rect', {
            x: 0.5, y: 1.4, w: 3, h: 0.08,
            fill: { color: this.colorScheme.accent }
        });
        
        // Add decorative image on the right
        try {
            slide.addImage({
                path: path.join(__dirname, 'assets-images', 'scientific_research.jpg'),
                x: 7.5, y: 1.5, w: 2, h: 2.5,
                transparency: 25
            });
        } catch (error) {
            console.warn('Could not add content slide image:', error.message);
        }
        
        // Content bullets with constraint system
        const constrainedContent = ContentConstraintSystem.constrainBulletPoints(data.content);
        
        constrainedContent.forEach((point, index) => {
            const yPos = 2 + (index * 0.5);
            
            // Bullet point circle
            slide.addShape('ellipse', {
                x: 0.7, y: yPos + 0.1, w: 0.15, h: 0.15,
                fill: { color: this.colorScheme.secondary },
                line: { width: 0 }
            });
            
            // Bullet text
            slide.addText(point, {
                x: 1, y: yPos, w: 8.5, h: 0.4,
                fontSize: 18, color: this.colorScheme.text,
                align: 'left', fontFace: 'Calibri'
            });
        });
        
        // Decorative superhero element
        slide.addShape('rect', {
            x: 8.5, y: 0.5, w: 1, h: 4.5,
            fill: { color: this.colorScheme.lightBlue },
            line: { width: 0 }
        });
    }
    
    addConclusionSlide(pres, data) {
        const slide = pres.addSlide();
        
        // Heroic conclusion background
        slide.background = { color: this.colorScheme.lightYellow };
        
        // Conclusion title
        slide.addText(ContentConstraintSystem.constrainTitle(data.title), {
            x: 0.5, y: 0.5, w: 9, h: 0.8,
            fontSize: 36, bold: true, color: this.colorScheme.primary,
            align: 'center', fontFace: 'Calibri'
        });
        
        // Heroic accent line (no outline)
        slide.addShape('rect', {
            x: 2, y: 1.4, w: 6, h: 0.1,
            fill: { color: this.colorScheme.accent }
        });
        
        // Add decorative image on the right
        try {
            slide.addImage({
                path: path.join(__dirname, 'assets-images', 'technology_development.jpg'),
                x: 7.5, y: 2, w: 2, h: 2,
                transparency: 20
            });
        } catch (error) {
            console.warn('Could not add conclusion slide image:', error.message);
        }
        
        // Conclusion points
        const constrainedContent = ContentConstraintSystem.constrainBulletPoints(data.content);
        
        constrainedContent.forEach((point, index) => {
            const yPos = 2 + (index * 0.45);
            
            // Diamond bullet points for conclusion
            slide.addShape('diamond', {
                x: 0.7, y: yPos + 0.05, w: 0.2, h: 0.2,
                fill: { color: this.colorScheme.accent },
                line: { width: 0 }
            });
            
            slide.addText(point, {
                x: 1, y: yPos, w: 8.5, h: 0.4,
                fontSize: 18, color: this.colorScheme.text,
                align: 'left', fontFace: 'Calibri',
                bold: true
            });
        });
        
        // Final heroic message
        slide.addText('Every dog has the potential to be a hero!', {
            x: 1, y: 5, w: 8, h: 0.5,
            fontSize: 20, bold: true, color: this.colorScheme.secondary,
            align: 'center', fontFace: 'Calibri',
            italic: true
        });
    }
    
    async generatePresentation() {
        try {
            console.log('🐕 Generating Dog Superhero Book presentation...');
            
            const pres = this.createPresentation();
            const outputPath = path.join(__dirname, 'dog_superhero_book_presentation.pptx');
            
            await pres.writeFile({ fileName: outputPath });
            
            console.log('✅ Presentation generated successfully!');
            console.log(`📁 File saved: ${outputPath}`);
            console.log('🦸‍♂️ Ready to inspire young heroes!');
            
        } catch (error) {
            console.error('❌ Error generating presentation:', error);
            throw error;
        }
    }
}

// Execute if run directly
if (require.main === module) {
    const generator = new DogSuperheroBookGenerator();
    generator.generatePresentation()
        .then(() => process.exit(0))
        .catch(error => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

module.exports = DogSuperheroBookGenerator;
