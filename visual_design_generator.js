const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

class VisualDesignGenerator {
    constructor(design) {
        this.pptx = new PptxGenJS();
        this.design = design;
        this.setupDesignSystem();
    }

    setupDesignSystem() {
        this.pptx.author = 'Visual Design Generator';
        this.pptx.company = 'Slidy-Presto';
        this.pptx.subject = 'Scientific Conference Slides';
        this.pptx.title = 'Generated Presentation';

        // Set slide dimensions
        if (this.design.slide_dimensions) {
            const widthInInches = parseInt(this.design.slide_dimensions.width) / 914400;
            const heightInInches = parseInt(this.design.slide_dimensions.height) / 914400;
            this.pptx.layout = {
                name: 'custom',
                width: widthInInches,
                height: heightInInches
            };
        }

        this.colors = {
            primary: this.design.color_scheme.dk2 || '2C3E50',
            accent: this.design.color_scheme.accent1 || '3498DB',
            titleText: this.design.color_scheme.lt1 || 'FFFFFF',
            subtitleText: this.design.color_scheme.lt2 || 'BDC3C7',
            bodyText: this.design.color_scheme.dk1 || '000000',
            headerText: this.design.color_scheme.lt1 || 'FFFFFF',
            background: this.design.color_scheme.lt1 || 'F8F9FA',
            overlay: this.design.color_scheme.dk2 || '2C3E50'
        };

        this.fonts = {
            title: { face: this.design.font_scheme.majorFont.latin || 'Arial', size: 44, bold: true },
            subtitle: { face: this.design.font_scheme.minorFont.latin || 'Arial', size: 24 },
            heading: { face: this.design.font_scheme.majorFont.latin || 'Arial', size: 32, bold: true },
            body: { face: this.design.font_scheme.minorFont.latin || 'Arial', size: 18 },
            caption: { face: this.design.font_scheme.minorFont.latin || 'Arial', size: 14 }
        };
    }

    createTitleSlide(data) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.background };
        slide.addShape(this.pptx.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: '50%',
            fill: { color: this.colors.overlay, transparency: 20 },
            line: { width: 0 }
        });
        slide.addText(data.title || 'Scientific Conference Slides', {
            x: 0, y: 0, w: '100%', h: '50%',
            ...this.fonts.title,
            color: this.colors.titleText,
            align: 'center',
            valign: 'middle'
        });
        slide.addText(data.subtitle || 'Generated Presentation', {
            x: 0, y: '50%', w: '100%', h: '25%',
            ...this.fonts.subtitle,
            color: this.colors.bodyText, // Changed to bodyText for better contrast
            align: 'center',
            valign: 'middle'
        });
        slide.addShape(this.pptx.ShapeType.rect, {
            x: '45%', y: '75%', w: '10%', h: 0.1,
            fill: { color: this.colors.accent },
            line: { width: 0 }
        });
        return slide;
    }

    createTitleAndContentSlide(data) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.background };
        slide.addShape(this.pptx.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: '15%',
            fill: { color: this.colors.primary },
            line: { width: 0 }
        });
        slide.addText(data.title || 'Content Slide', {
            x: '5%', y: 0, w: '80%', h: '15%',
            ...this.fonts.heading,
            color: this.colors.headerText,
            align: 'left',
            valign: 'middle'
        });
        slide.addText('1', { // Placeholder for slide number
            x: '90%', y: 0, w: '10%', h: '15%',
            ...this.fonts.caption,
            color: this.colors.accent,
            align: 'center',
            valign: 'middle'
        });
        if (data.content && Array.isArray(data.content)) {
            const bulletText = data.content.map(item => `• ${item}`).join('\n');
            slide.addText(bulletText, {
                x: '5%', y: '20%', w: '90%', h: '75%',
                ...this.fonts.body,
                color: this.colors.bodyText,
                align: 'left',
                valign: 'top'
            });
        }
        return slide;
    }

    createSectionHeaderSlide(data) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.primary };
        slide.addText(data.title || 'Section Header', {
            x: 0, y: 0, w: '100%', h: '100%',
            ...this.fonts.title,
            color: this.colors.titleText,
            align: 'center',
            valign: 'middle'
        });
        slide.addShape(this.pptx.ShapeType.rect, {
            x: '30%', y: '80%', w: '40%', h: 0.1,
            fill: { color: this.colors.accent },
            line: { width: 0 }
        });
        return slide;
    }

    createTwoContentSlide(data) {
        const slide = this.pptx.addSlide();
        slide.background = { color: this.colors.background };
        slide.addShape(this.pptx.ShapeType.rect, {
            x: 0, y: 0, w: '100%', h: '15%',
            fill: { color: this.colors.primary },
            line: { width: 0 }
        });
        slide.addText(data.title || 'Two Column Content', {
            x: '5%', y: 0, w: '80%', h: '15%',
            ...this.fonts.heading,
            color: this.colors.headerText,
            align: 'left',
            valign: 'middle'
        });
        slide.addText('2', { // Placeholder for slide number
            x: '90%', y: 0, w: '10%', h: '15%',
            ...this.fonts.caption,
            color: this.colors.accent,
            align: 'center',
            valign: 'middle'
        });
        if (data.content1 && Array.isArray(data.content1)) {
            const leftText = data.content1.map(item => `• ${item}`).join('\n');
            slide.addText(leftText, {
                x: '5%', y: '20%', w: '42.5%', h: '75%',
                ...this.fonts.body,
                color: this.colors.bodyText,
                align: 'left',
                valign: 'top'
            });
        }
        if (data.content2 && Array.isArray(data.content2)) {
            const rightText = data.content2.map(item => `• ${item}`).join('\n');
            slide.addText(rightText, {
                x: '52.5%', y: '20%', w: '42.5%', h: '75%',
                ...this.fonts.body,
                color: this.colors.bodyText,
                align: 'left',
                valign: 'top'
            });
        }
        return slide;
    }

    async generate(content) {
        this.createTitleSlide(content.title_slide);
        content.slides.forEach(slideData => {
            switch (slideData.type) {
                case 'title_and_content':
                    this.createTitleAndContentSlide(slideData);
                    break;
                case 'section_header':
                    this.createSectionHeaderSlide(slideData);
                    break;
                case 'two_content':
                    this.createTwoContentSlide(slideData);
                    break;
                default:
                    console.log(`Unknown slide type: ${slideData.type}`);
            }
        });

        const outputPath = path.join(__dirname, 'visual_design_presentation.pptx');
        await this.pptx.writeFile(outputPath);
        console.log(`Presentation saved to ${outputPath}`);
    }
}

async function main() {
    try {
        const designPath = path.join(__dirname, 'template_analysis.json');
        const design = JSON.parse(fs.readFileSync(designPath, 'utf8'));

        const contentPath = path.join(__dirname, 'presentation_content.json');
        const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

        const generator = new VisualDesignGenerator(design);
        await generator.generate(content);
    } catch (error) {
        console.error('Error generating presentation:', error);
    }
}

main();