## `pptxgenjs` Learnings

This document provides a summary of the key technical learnings from using `pptxgenjs` to replicate a complex slide design.

### Key Code Snippet

The following code from `methodology_slide_generator.js` demonstrates how to achieve precise control over slide elements:

```javascript
// Add green accent line above title
slide.addShape(pptx.ShapeType.rect, {
    x: 0.5,
    y: 0.4,
    w: 4,
    h: 0.03,
    fill: { color: '5A7454' },
    line: { width: 0 }
});

// Add main title
slide.addText('Methodology', {
    x: 0.5,
    y: 0.6,
    w: 5.5,
    h: 0.8,
    fontSize: 48,
    fontFace: 'Arial',
    color: '5A7454',
    bold: false,
    align: 'left'
});

// Add the laboratory image
const imagePath = path.join(__dirname, 'assets-images', 'laboratory.jpg');
slide.addImage({
    path: imagePath,
    x: 6.0,
    y: 1.0,
    w: 3.8,
    h: 4.5
});
```

### Explanation

*   **Precise Positioning:** `pptxgenjs` allows for the direct manipulation of element coordinates (`x`, `y`) and dimensions (`w`, `h`), providing granular control over the layout.
*   **Rich Styling Options:** The library offers a comprehensive set of styling options for shapes, text, and images, including `fill`, `line`, `fontSize`, `fontFace`, and `color`.
*   **Image Integration:** Adding images is straightforward with the `addImage` method, which allows for precise placement and sizing.
*   **Flexibility:** The JavaScript-based nature of `pptxgenjs` provides a high degree of flexibility and allows for dynamic and programmatic slide generation.

### Critical Image Integration Lessons

#### PNG Image Support with `path` Property

**IMPORTANT:** When working with PNG images (or any image files), always use the `path` property instead of `data` in `addImage` calls:

```javascript
// ✅ CORRECT - Use 'path' for file-based images
slide.addImage({
    path: imagePath,
    x: 1.0,
    y: 1.5,
    w: 2.0,
    h: 1.5
});

// ❌ INCORRECT - 'data' property causes issues with PNG files
slide.addImage({
    data: imagePath,  // This will fail!
    x: 1.0,
    y: 1.5,
    w: 2.0,
    h: 1.5
});
```

#### Asset Loading Best Practices

1. **Use `readFilePaths` for bulk asset loading:**
```javascript
const svgrepoPngs = readFilePaths(path.join(__dirname, '..', 'assets-images', 'infographics', 'svgrepo_png'));
assets.svgrepo_png = svgrepoPngs;
```

2. **Implement fallback chains for robustness:**
```javascript
const image1 = getAsset(assets, 'svgrepo_png', 0) || 
               getAsset(assets, 'unsplash', 0) || 
               getAsset(assets, 'undraw', 0);
```

3. **Always verify asset availability before use:**
```javascript
if (image1) {
    slide.addImage({
        path: image1,
        x: 1.0,
        y: 1.5,
        w: 2.0,
        h: 1.5
    });
} else {
    // Add fallback placeholder
    slide.addShape(pptx.ShapeType.rect, {
        x: 1.0,
        y: 1.5,
        w: 2.0,
        h: 1.5,
        fill: { color: 'E0E0E0' }
    });
}
```

#### Common Pitfalls to Avoid

- **Never use `data` property for file paths** - this is the most common cause of PNG integration failures
- **Always use absolute paths** when possible for better reliability
- **Test with multiple image formats** (PNG, JPG, SVG) to ensure compatibility
- **Implement proper error handling** for missing or corrupted image files