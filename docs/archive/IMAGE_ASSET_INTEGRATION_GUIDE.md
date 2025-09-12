# Image Asset Integration Guide for pptxgenjs

This guide provides comprehensive best practices for integrating various image formats with pptxgenjs, based on lessons learned from successful PNG integration.

## Quick Reference

### ✅ DO
- Use `path` property for all file-based images
- Implement fallback chains for asset availability
- Use `readFilePaths` for bulk asset loading
- Test with multiple image formats
- Implement proper error handling

### ❌ DON'T
- Use `data` property for file paths (common failure point)
- Assume assets are always available
- Skip fallback mechanisms
- Use relative paths without verification

## Supported Image Formats

pptxgenjs supports the following image formats:
- **PNG** - Recommended for graphics with transparency
- **JPG/JPEG** - Good for photographs
- **SVG** - Vector graphics (with some limitations)
- **GIF** - Basic support

## Asset Loading Patterns

### 1. Bulk Asset Loading

```javascript
function loadAvailableAssets() {
    const assets = {};
    
    // Load PNG assets
    const svgrepoPngs = readFilePaths(path.join(__dirname, '..', 'assets-images', 'infographics', 'svgrepo_png'));
    assets.svgrepo_png = svgrepoPngs;
    console.log(`Loaded ${svgrepoPngs.length} SVG Repo PNG images`);
    
    // Load other formats
    const unsplashImages = readFilePaths(path.join(__dirname, '..', 'assets-images', 'unsplash', 'business'));
    assets.unsplash = unsplashImages;
    
    return assets;
}
```

### 2. Asset Selection with Fallbacks

```javascript
function getAsset(assets, category, index = 0) {
    if (assets[category] && assets[category].length > index) {
        return assets[category][index];
    }
    return null;
}

// Usage with fallback chain
const image = getAsset(assets, 'svgrepo_png', 0) || 
              getAsset(assets, 'unsplash', 0) || 
              getAsset(assets, 'undraw', 0);
```

## Image Integration Patterns

### 1. Standard Image Addition

```javascript
// ✅ CORRECT - Always use 'path' property
if (imagePath) {
    slide.addImage({
        path: imagePath,
        x: 1.0,
        y: 1.5,
        w: 2.0,
        h: 1.5
    });
}
```

### 2. Image with Fallback Placeholder

```javascript
const image = getAsset(assets, 'svgrepo_png', 0);

if (image) {
    slide.addImage({
        path: image,
        x: 1.0,
        y: 1.5,
        w: 2.0,
        h: 1.5
    });
} else {
    // Fallback placeholder
    slide.addShape(pptx.ShapeType.rect, {
        x: 1.0,
        y: 1.5,
        w: 2.0,
        h: 1.5,
        fill: { color: 'E0E0E0' },
        line: { width: 1, color: 'CCCCCC' }
    });
    
    // Optional: Add placeholder text
    slide.addText('Image Not Available', {
        x: 1.0,
        y: 2.0,
        w: 2.0,
        h: 0.5,
        fontSize: 12,
        color: '666666',
        align: 'center'
    });
}
```

### 3. Multiple Images with Priority

```javascript
// Prioritize PNG images, fallback to others
const image1 = getAsset(assets, 'svgrepo_png', 0) || 
               getAsset(assets, 'unsplash', 0) || 
               getAsset(assets, 'undraw', 0);

const image2 = getAsset(assets, 'svgrepo_png', 1) || 
               getAsset(assets, 'unsplash', 1) || 
               getAsset(assets, 'undraw', 1);

[image1, image2].forEach((img, index) => {
    if (img) {
        slide.addImage({
            path: img,
            x: 1.0 + (index * 3.0),
            y: 1.5,
            w: 2.0,
            h: 1.5
        });
    }
});
```

## Error Handling Best Practices

### 1. File Existence Verification

```javascript
const fs = require('fs');

function verifyImageExists(imagePath) {
    try {
        return fs.existsSync(imagePath);
    } catch (error) {
        console.warn(`Error checking image: ${imagePath}`, error);
        return false;
    }
}

// Usage
if (imagePath && verifyImageExists(imagePath)) {
    slide.addImage({ path: imagePath, x: 1, y: 1, w: 2, h: 1.5 });
}
```

### 2. Graceful Degradation

```javascript
function addImageWithFallback(slide, imagePath, options, fallbackOptions = {}) {
    if (imagePath && verifyImageExists(imagePath)) {
        try {
            slide.addImage({ path: imagePath, ...options });
            return true;
        } catch (error) {
            console.warn(`Failed to add image: ${imagePath}`, error);
        }
    }
    
    // Add fallback shape
    slide.addShape(pptx.ShapeType.rect, {
        fill: { color: 'F0F0F0' },
        line: { width: 1, color: 'DDDDDD' },
        ...options,
        ...fallbackOptions
    });
    
    return false;
}
```

## Performance Considerations

### 1. Asset Preloading

```javascript
// Load assets once at the beginning
const assets = loadAvailableAssets();
console.log('Asset loading summary:');
Object.keys(assets).forEach(category => {
    console.log(`  ${category}: ${assets[category].length} files`);
});
```

### 2. Image Size Optimization

- Keep image dimensions reasonable (avoid very large images)
- Use appropriate formats (PNG for graphics, JPG for photos)
- Consider image compression for large presentations

## Common Issues and Solutions

### Issue: "Cannot read property 'data' of undefined"
**Solution:** Use `path` property instead of `data` for file-based images.

### Issue: Images not appearing in presentation
**Solution:** 
1. Verify file paths are correct and absolute
2. Check file permissions
3. Ensure image format is supported
4. Implement proper error handling

### Issue: Inconsistent image loading
**Solution:**
1. Use `readFilePaths` for consistent asset discovery
2. Implement fallback mechanisms
3. Add asset availability checks

## Testing Checklist

- [ ] Test with PNG images
- [ ] Test with JPG images  
- [ ] Test with missing image files
- [ ] Test with corrupted image files
- [ ] Verify fallback mechanisms work
- [ ] Check console logs for asset loading
- [ ] Validate final presentation opens correctly

## Migration Guide

If you have existing code using `data` property:

```javascript
// OLD (problematic)
slide.addImage({
    data: imagePath,
    x: 1, y: 1, w: 2, h: 1.5
});

// NEW (correct)
slide.addImage({
    path: imagePath,
    x: 1, y: 1, w: 2, h: 1.5
});
```

Search and replace pattern:
- Find: `data: `
- Replace: `path: `
- Context: Within `addImage` calls

## Related Documentation

- [pptxgenjs Official Documentation](https://gitbrent.github.io/PptxGenJS/)
- [Generator Anatomy Best Practices](./generator_anatomy_best_practices.md)
- [pptxgenjs Learnings](./code-learning/pptxgenjs/learnings.md)