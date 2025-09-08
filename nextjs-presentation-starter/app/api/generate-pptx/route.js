import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

// Import PptxGenJS
const PptxGenJS = require('pptxgenjs');

// Server-side presentation generator
class ServerPresentationGenerator {
  constructor() {
    this.pptx = new PptxGenJS();
    this.setupPresentation();
  }

  setupPresentation() {
    // Set presentation properties
    this.pptx.author = 'Slidy Presto';
    this.pptx.subject = 'AI Generated Presentation';
    this.pptx.layout = 'LAYOUT_WIDE';
    
    // Define slide master with consistent styling
    this.pptx.defineSlideMaster({
      title: 'MASTER_SLIDE',
      background: { color: 'FFFFFF' },
      objects: [
        {
          placeholder: {
            options: { name: 'title', type: 'title', x: 0.5, y: 0.13, w: 8.5, h: 1.0 },
            text: 'Click to edit Master title style'
          }
        },
        {
          placeholder: {
            options: { name: 'body', type: 'body', x: 0.5, y: 1.5, w: 8.5, h: 5.25 },
            text: 'Click to edit Master text styles'
          }
        }
      ]
    });
  }

  getThemeColors(theme = 'professional') {
    const themes = {
      professional: { primary: '2E86AB', secondary: 'A23B72', accent: 'F18F01' },
      modern: { primary: '264653', secondary: '2A9D8F', accent: 'E9C46A' },
      creative: { primary: '6A4C93', secondary: 'C06C84', accent: 'F8961E' }
    };
    return themes[theme] || themes.professional;
  }

  createTitleSlide(title, subtitle = '', theme = 'professional') {
    const slide = this.pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    const colors = this.getThemeColors(theme);
    
    // Title
    slide.addText(title, {
      x: 0.5,
      y: 2,
      w: 9,
      h: 1.5,
      fontSize: 44,
      fontFace: 'Arial',
      color: colors.primary,
      align: 'center',
      bold: true
    });
    
    // Subtitle
    if (subtitle) {
      slide.addText(subtitle, {
        x: 0.5,
        y: 3.8,
        w: 9,
        h: 1,
        fontSize: 24,
        fontFace: 'Arial',
        color: colors.secondary,
        align: 'center'
      });
    }
  }

  createContentSlide(title, content, theme = 'professional') {
    const slide = this.pptx.addSlide({ masterName: 'MASTER_SLIDE' });
    const colors = this.getThemeColors(theme);
    
    // Slide title
    slide.addText(title, {
      x: 0.5,
      y: 0.5,
      w: 9,
      h: 1,
      fontSize: 32,
      fontFace: 'Arial',
      color: colors.primary,
      bold: true
    });
    
    // Content
    if (content) {
      let contentText = '';
      if (Array.isArray(content)) {
        contentText = content.map(item => `• ${item}`).join('\n\n');
      } else {
        contentText = content;
      }
      
      slide.addText(contentText, {
        x: 1,
        y: 2,
        w: 8,
        h: 4,
        fontSize: 20,
        fontFace: 'Arial',
        color: '333333',
        valign: 'top'
      });
    }
  }

  async generatePresentation(presentationData) {
    try {
      const { title, subtitle, slides, theme } = presentationData;
      
      // Create title slide
      this.createTitleSlide(title || 'Generated Presentation', subtitle, theme);
      
      // Process content slides
      if (slides && Array.isArray(slides)) {
        slides.forEach((slide, index) => {
          if (slide.title || slide.content) {
            this.createContentSlide(slide.title || `Slide ${index + 1}`, slide.content, theme);
          }
        });
      }
      
      // Generate the presentation buffer
      const pptxBuffer = await this.pptx.write('nodebuffer');
      return pptxBuffer;
      
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw new Error(`Failed to generate presentation: ${error.message}`);
    }
  }
}

export async function POST(request) {
  try {
    const presentationData = await request.json();

    if (!presentationData || !presentationData.title) {
      return NextResponse.json(
        { error: 'Invalid presentation data - title is required' },
        { status: 400 }
      );
    }

    // Create server-side presentation generator
    const generator = new ServerPresentationGenerator();
    
    // Generate the presentation buffer
    const pptxBuffer = await generator.generatePresentation(presentationData);
    
    // Return the PPTX file as response
    return new NextResponse(pptxBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${presentationData.title.replace(/[^a-zA-Z0-9]/g, '_')}.pptx"`
      }
    });
    
  } catch (error) {
    console.error('Generation API error:', error);
    return NextResponse.json(
      { error: `Failed to generate presentation: ${error.message}` },
      { status: 500 }
    );
  }
}