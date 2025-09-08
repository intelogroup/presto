# Generator Patterns Quick Reference

*Quick reference for implementing successful PowerPoint generators*

## Essential Code Patterns

### 1. Basic Generator Structure

```javascript
#!/usr/bin/env node
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

class YourGenerator {
    constructor() {
        this.colorScheme = {
            primary: 'HEX_COLOR',
            secondary: 'HEX_COLOR',
            accent: 'HEX_COLOR',
            text: 'HEX_COLOR',
            background: 'FFFFFF'
        };
        
        this.slideData = [
            { type: 'title', title: 'Title', subtitle: 'Subtitle' },
            { type: 'content', title: 'Section', content: ['Point 1', 'Point 2'] }
        ];
    }
}
```

### 2. Content Constraint System

```javascript
class ContentConstraintSystem {
    static constrainTitle(text, maxLength = 60) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength - 3) + '...';
    }
    
    static constrainBulletPoints(points, maxPoints = 6, maxLength = 80) {
        return points.slice(0, maxPoints).map(point => 
            this.constrainText(point, maxLength)
        );
    }
}
```

### 3. Slide Creation Pattern

```javascript
createPresentation() {
    const pres = new PptxGenJS();
    pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
    pres.layout = 'LAYOUT_16x9';
    
    this.slideData.forEach((slideData, index) => {
        switch(slideData.type) {
            case 'title':
                this.addTitleSlide(pres, slideData);
                break;
            case 'content':
                this.addContentSlide(pres, slideData);
                break;
        }
    });
    
    return pres;
}
```

### 4. Standard Title Slide

```javascript
addTitleSlide(pres, data) {
    const slide = pres.addSlide();
    
    slide.background = { color: this.colorScheme.background };
    
    slide.addText(data.title, {
        x: 1, y: 1.5, w: 8, h: 1.2,
        fontSize: 44, bold: true, color: this.colorScheme.primary,
        align: 'center', fontFace: 'Calibri'
    });
    
    slide.addText(data.subtitle, {
        x: 1, y: 2.8, w: 8, h: 0.8,
        fontSize: 24, color: this.colorScheme.secondary,
        align: 'center', fontFace: 'Calibri'
    });
    
    // Decorative accent
    slide.addShape('rect', {
        x: 2, y: 4, w: 6, h: 0.1,
        fill: { color: this.colorScheme.accent }
    });
}
```

### 5. Standard Content Slide

```javascript
addContentSlide(pres, data) {
    const slide = pres.addSlide();
    
    slide.background = { color: this.colorScheme.background };
    
    // Title with underline
    slide.addText(data.title, {
        x: 0.5, y: 0.3, w: 9, h: 0.8,
        fontSize: 32, bold: true, color: this.colorScheme.primary,
        align: 'left', fontFace: 'Calibri'
    });
    
    slide.addShape('rect', {
        x: 0.5, y: 1.1, w: 3, h: 0.05,
        fill: { color: this.colorScheme.accent }
    });
    
    // Bullet points
    const constrainedContent = ContentConstraintSystem.constrainBulletPoints(data.content);
    constrainedContent.forEach((point, index) => {
        slide.addText(`• ${point}`, {
            x: 0.8, y: 1.6 + (index * 0.6), w: 8.5, h: 0.5,
            fontSize: 18, color: this.colorScheme.text,
            align: 'left', fontFace: 'Calibri'
        });
    });
}
```

### 6. Error Handling Pattern

```javascript
async generatePresentation() {
    try {
        console.log('Creating presentation...');
        const pres = this.createPresentation();
        
        const outputPath = path.join(__dirname, 'output.pptx');
        await pres.writeFile({ fileName: outputPath });
        
        console.log(`Presentation saved to: ${outputPath}`);
        return outputPath;
    } catch (error) {
        console.error('Error generating presentation:', error);
        throw error;
    }
}
```

### 7. Module Export Pattern

```javascript
// Execute if run directly
if (require.main === module) {
    const generator = new YourGenerator();
    generator.generatePresentation()
        .then(path => console.log(`Success! Created: ${path}`))
        .catch(error => console.error('Failed:', error));
}

module.exports = YourGenerator;
```

## Standard Dimensions & Positioning

### Layout Setup
```javascript
pres.defineLayout({ name: 'LAYOUT_16x9', width: 10, height: 5.625 });
pres.layout = 'LAYOUT_16x9';
```

### Common Positions
- **Title**: `x: 1, y: 1.5, w: 8, h: 1.2`
- **Subtitle**: `x: 1, y: 2.8, w: 8, h: 0.8`
- **Section Title**: `x: 0.5, y: 0.3, w: 9, h: 0.8`
- **Content**: `x: 0.8, y: 1.6, w: 8.5, h: 0.5`
- **Bullet Spacing**: `0.6` units between bullets

### Font Sizes
- **Main Title**: 44px
- **Subtitle**: 24px
- **Section Title**: 32px
- **Body Text**: 18px
- **Small Text**: 14px

## Color Scheme Examples

### Professional Blue-Green
```javascript
colorScheme: {
    primary: '2E8B57',      // Sea Green
    secondary: '4682B4',    // Steel Blue
    accent: 'FF8C00',       // Dark Orange
    text: '2F4F4F',         // Dark Slate Gray
    background: 'FFFFFF',   // White
    lightGreen: 'E8F5E8',   // Light Green
    lightBlue: 'E6F3FF'     // Light Blue
}
```

### Scientific Theme
```javascript
colorScheme: {
    primary: '2E86AB',      // Blue
    secondary: '8B4513',    // Brown
    accent: 'F18F01',       // Orange
    text: '333333',         // Dark Gray
    background: 'FFFFFF',   // White
    lightGray: 'F5F5F5'     // Light Gray
}
```

## Quick Checklist

✅ **Structure**
- [ ] Class-based generator
- [ ] Structured slideData array
- [ ] Color scheme object
- [ ] Type-based slide creation

✅ **Content Management**
- [ ] Content constraint system
- [ ] Overflow protection
- [ ] Consistent bullet formatting

✅ **Visual Design**
- [ ] Standard positioning
- [ ] Visual hierarchy elements
- [ ] Consistent typography
- [ ] Professional color usage

✅ **Robustness**
- [ ] Error handling
- [ ] Graceful fallbacks
- [ ] Informative logging
- [ ] Module export pattern

## Common Pitfalls to Avoid

❌ **Don't**:
- Hard-code content in slide creation methods
- Use inconsistent positioning across slides
- Ignore text overflow possibilities
- Skip error handling
- Mix content and presentation logic

✅ **Do**:
- Separate content from presentation logic
- Use consistent positioning patterns
- Implement content constraints
- Handle errors gracefully
- Follow established naming conventions

This quick reference should help you implement the proven patterns from our successful generators!