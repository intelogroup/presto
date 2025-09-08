# Dynamic Presentation Generator

A comprehensive, intelligent PowerPoint generator that adapts to almost any user request using PptxGenJS. This generator integrates advanced layout calculation, content fitting, validation, and multiple template systems to create professional presentations automatically.

## 🚀 Key Features

### Intelligent Adaptation
- **Content Analysis**: Automatically analyzes content to determine the best layout and template
- **Template Selection**: Chooses appropriate generators based on content type (data, visual, conceptual, text)
- **Layout Detection**: Selects optimal layouts from 6 available types
- **Smart Positioning**: Uses advanced layout calculator for precise element positioning

### Default Layouts
- **Text Left, Images Right**: Default layout for balanced content presentation
- **Icon Grids**: Automatic arrangement of icons in responsive grids
- **Chart Visualizations**: Data-driven chart generation with automatic scaling
- **Two-Column Layouts**: Side-by-side content comparison
- **Full-Text Layouts**: Optimized for text-heavy content
- **Image-Focus Layouts**: Large images with minimal text overlay

### Advanced Capabilities
- **Smart Content Fitting**: Automatic text sizing and overflow protection
- **Error Handling**: Comprehensive validation with graceful fallbacks
- **Multiple Color Schemes**: Professional, modern, creative, and minimal themes
- **Responsive Design**: Adapts to different slide formats (16:9, 4:3, 16:10)
- **Event Monitoring**: Real-time generation feedback and statistics

## 📋 Quick Start

### Basic Usage

```javascript
const DynamicPresentationGenerator = require('./dynamic_presentation_generator');

const generator = new DynamicPresentationGenerator({
    colorScheme: 'professional',
    layout: 'LAYOUT_16x9'
});

const data = {
    title: 'My Presentation',
    subtitle: 'Automatically Generated',
    slides: {
        title: {
            title: 'Welcome',
            subtitle: 'This is an auto-generated presentation'
        },
        
        content: {
            title: 'Key Points',
            content: 'This content will be placed on the left side of the slide.',
            images: [{ description: 'Placeholder for images on the right' }]
        }
    }
};

await generator.generatePresentation(data, 'my_presentation.pptx');
```

### Advanced Configuration

```javascript
const generator = new DynamicPresentationGenerator({
    colorScheme: 'modern',           // Color theme
    layout: 'LAYOUT_16x9',          // Slide dimensions
    maxSlides: 50,                  // Maximum slides
    maxTextLength: 5000,            // Text length limit
    enableValidation: true,         // Input validation
    enableFallbacks: true,          // Error recovery
    author: 'Your Name',            // Metadata
    company: 'Your Company'
});

// Monitor generation events
generator.on('slideCreated', (data) => {
    console.log(`Created ${data.type} slide ${data.index}`);
});

generator.on('generationCompleted', (stats) => {
    console.log(`Generated ${stats.slideCount} slides in ${stats.duration}ms`);
});
```

## 🎨 Layout Types

The generator automatically selects layouts based on content analysis:

### 1. Text-Image Default Layout (Primary)
```javascript
{
    title: 'Product Overview',
    content: 'Product description and features go here...',
    images: [{ description: 'Product image' }]
}
```
- Text positioned on the left side
- Image area on the right side
- Balanced content presentation

### 2. Icon Grid Layout
```javascript
{
    title: 'Our Services',
    icons: [
        { symbol: '💻', label: 'Web Development' },
        { symbol: '📱', label: 'Mobile Apps' },
        { symbol: '☁️', label: 'Cloud Solutions' }
    ]
}
```
- Automatic responsive grid arrangement
- Icons with labels
- Perfect for service portfolios

### 3. Chart Layout
```javascript
{
    title: 'Sales Performance',
    content: 'Performance summary',
    chartData: {
        values: [100, 150, 200, 180, 220, 250]
    }
}
```
- Data visualization focus
- Automatic scaling and formatting
- Bar chart generation from arrays

### 4. Two-Column Layout
```javascript
{
    title: 'Comparison',
    leftContent: 'Option A benefits...',
    rightContent: 'Option B benefits...'
}
```
- Side-by-side content comparison
- Equal column widths
- Perfect for comparisons

### 5. Full-Text Layout
```javascript
{
    title: 'Detailed Analysis',
    content: 'Very long detailed content that needs full slide width...'
}
```
- Full-width text area
- Optimized for text-heavy content
- Smart text fitting

### 6. Image-Focus Layout
```javascript
{
    title: 'Visual Showcase',
    images: [{ description: 'Large showcase image' }],
    content: 'Brief description'
}
```
- Large image area
- Minimal text overlay
- Visual-first presentation

## 🎯 Content Types and Template Selection

The generator analyzes content and selects appropriate templates:

| Content Type | Triggers | Selected Template | Features |
|--------------|----------|-------------------|----------|
| **Data** | `chartData`, `data`, `chart` | Enhanced PPTX Generator | Advanced charts, tables, analytics |
| **Visual** | `images`, long image arrays | Modern Sustainable Tech | Image-focused layouts, visual emphasis |
| **Conceptual** | `icons`, concept arrays | Methodology Slide Generator | Process flows, conceptual layouts |
| **Text** | Text-heavy content | Fixed Positioning Generator | Optimized text layouts, readability |

## 📊 Data Structure Reference

### Complete Data Object
```javascript
const data = {
    // Presentation metadata
    title: 'Presentation Title',
    subtitle: 'Optional subtitle',
    author: 'Author Name',
    template: 'adaptive',  // Optional: force specific template
    
    slides: {
        // Title slide (optional)
        title: {
            title: 'Main Title',
            subtitle: 'Subtitle',
            author: 'Author'
        },
        
        // Content slides
        slide_name: {
            title: 'Slide Title',
            
            // Text content
            content: 'Main text content...',
            bullets: ['Point 1', 'Point 2', 'Point 3'],
            
            // Visual elements
            images: [
                { description: 'Image description' },
                { path: 'path/to/image.jpg', description: 'Image with path' }
            ],
            
            // Icons and symbols
            icons: [
                { symbol: '🎯', label: 'Precision' },
                { symbol: '⚡', label: 'Speed' }
            ],
            
            // Data visualization
            chartData: {
                values: [10, 20, 30, 25, 35, 40]
            },
            
            // Two-column content
            leftContent: 'Left side content...',
            rightContent: 'Right side content...',
            
            // Tables (future extension)
            tableData: [
                ['Header 1', 'Header 2'],
                ['Row 1 Col 1', 'Row 1 Col 2']
            ]
        }
    }
};
```

## 🔧 Configuration Options

### Constructor Options
```javascript
new DynamicPresentationGenerator({
    // Layout and appearance
    colorScheme: 'professional',     // 'professional', 'modern', 'creative', 'minimal'
    layout: 'LAYOUT_16x9',          // 'LAYOUT_16x9', 'LAYOUT_4x3', 'LAYOUT_16x10'
    
    // Content limits
    maxSlides: 100,                 // Maximum number of slides
    maxTextLength: 15000,           // Maximum text length per element
    
    // Behavior
    enableValidation: true,         // Enable input validation
    enableFallbacks: true,          // Enable error recovery
    defaultTemplate: 'adaptive',   // Default template selection
    
    // Metadata
    author: 'Your Name',            // Presentation author
    company: 'Your Company',       // Company name
    subject: 'Presentation Topic', // Subject
    title: 'Default Title'         // Default title
})
```

### Color Schemes
- **Professional**: Blue and gray theme for business presentations
- **Modern**: Contemporary colors with vibrant accents
- **Creative**: Bold, artistic color combinations
- **Minimal**: Clean black, white, and gray palette

## 🚨 Error Handling and Validation

### Automatic Validation
```javascript
// The generator automatically handles:
{
    title: 'A'.repeat(200),        // ✅ Truncated to safe length
    content: 'B'.repeat(20000),    // ✅ Smart text fitting applied
    bullets: Array(50).fill('x'),  // ✅ Limited to safe number
    invalidData: null              // ✅ Replaced with fallback
}
```

### Error Recovery
- **Invalid Data**: Replaced with safe defaults
- **Oversized Content**: Automatic truncation and fitting
- **Missing Elements**: Graceful fallback to available content
- **Template Errors**: Automatic fallback to working templates

### Validation Events
```javascript
generator.on('error', (errorInfo) => {
    console.log(`Recoverable error: ${errorInfo.message}`);
});
```

## 📡 Event Monitoring

Track generation progress with events:

```javascript
generator.on('generationStarted', (data) => {
    console.log(`Starting generation: ${data.outputPath}`);
});

generator.on('slideCreated', (data) => {
    console.log(`Created ${data.type} slide ${data.index}`);
});

generator.on('generationCompleted', (stats) => {
    console.log(`Completed: ${stats.slideCount} slides, ${stats.duration}ms`);
    console.log(`Template: ${stats.template}, Layout: ${stats.layout}`);
});
```

## 🔍 Content Analysis

The generator provides detailed content analysis:

```javascript
const analysis = generator.getContentAnalysis();
console.log(analysis);
// Output:
{
    hasImages: true,
    hasCharts: false,
    hasIcons: true,
    contentType: 'visual',
    recommendedLayout: 'imageFocus',
    slideTypes: ['title', 'image', 'icon']
}
```

## 📚 Examples

Run the examples to see all features in action:

```bash
node dynamic_generator_examples.js
```

This generates 8 different presentation examples showcasing:
- Basic text-image layouts
- Icon grids and visualizations
- Chart and data presentations
- Two-column comparisons
- Mixed content types
- Error handling
- Advanced configurations

## 🛠️ Integration with Existing Toolkit

The dynamic generator integrates with existing pptx-toolkit components:

- **Layout Calculator**: Precise positioning and grid calculations
- **Smart Content Fitter**: Automatic text sizing and overflow protection
- **Validation Helper**: Input validation and error checking
- **Template Capabilities**: Template selection and capability mapping

## 🎯 Use Cases

### Business Presentations
```javascript
// Automatic quarterly reports
const businessData = {
    title: 'Q4 Business Review',
    slides: {
        summary: { content: '...', chartData: {...} },
        performance: { bullets: [...], images: [...] }
    }
};
```

### Educational Content
```javascript
// Course materials with mixed content
const educationalData = {
    title: 'Introduction to AI',
    slides: {
        concepts: { icons: [...] },
        examples: { leftContent: '...', rightContent: '...' }
    }
};
```

### Product Showcases
```javascript
// Product demonstrations
const productData = {
    title: 'Product Launch',
    slides: {
        features: { icons: [...] },
        comparison: { leftContent: '...', rightContent: '...' },
        metrics: { chartData: {...} }
    }
};
```

## 🔮 Future Enhancements

- **Image Integration**: Automatic image fetching and integration
- **Advanced Charts**: Multiple chart types (pie, line, scatter)
- **Template Customization**: User-defined template creation
- **Animation Support**: Slide transitions and animations
- **Export Formats**: PDF, HTML, and other format support
- **AI Enhancement**: GPT-powered content optimization

## 📞 Support

The dynamic generator includes comprehensive error handling and fallback mechanisms. If you encounter issues:

1. Enable validation: `enableValidation: true`
2. Enable fallbacks: `enableFallbacks: true`
3. Monitor events for detailed feedback
4. Check the generated examples for reference patterns

## 🎉 Summary

The Dynamic Presentation Generator provides:

✅ **Intelligent Content Analysis** - Automatically determines optimal layouts  
✅ **Default Text-Image Layout** - Text left, images right as primary pattern  
✅ **Icon Grids & Charts** - Automatic arrangement and visualization  
✅ **Multiple Templates** - Adapts to business, educational, and creative needs  
✅ **Error Handling** - Robust validation and fallback mechanisms  
✅ **Professional Styling** - Multiple color schemes and typography  
✅ **Event Monitoring** - Real-time feedback and statistics  
✅ **Comprehensive Examples** - 8 different use case demonstrations  

Create presentations that adapt to any user request with intelligent defaults and professional results!
