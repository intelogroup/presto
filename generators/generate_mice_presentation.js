/**
 * Generator script for creating a 10-slide presentation on "Human and Mouse Cohabitation and Evolution"
 * Uses PPTXGenJS for presentation generation (ensure PPTXGenJS is installed in the project)
 */
const pptxgen = require('pptxgenjs');
const fs = require('fs');
const path = require('path');

// Define slide content for the presentation
const slideContent = [
  {
    id: 1,
    title: 'Title Slide',
    content: {
      text: 'Human and Mouse Cohabitation and Evolution',
      image: '', // Path to image if needed, can be populated later
    },
  },
  // Additional slides will be added here in the future
];

// Function to generate the presentation
function generateMicePresentation() {
  const pptx = new pptxgen({
    title: 'Human and Mouse Cohabitation and Evolution',
    subject: '', // Optional
    author: '', // Optional
    keywords: '', // Optional
  });

  // Add slides based on content definition
  for (const slide of slideContent) {
    const slideToAdd = pptx.addSlide();
    
    // Add title and content
    if (slide.title) {
      slideToAdd.addText(slide.title, {
        x: 0.5, // Center alignment
        y: 1.5,
        w: 9,
        h: 1,
        text: slide.title,
        fontSize: 20,
        bold: true,
      });
    }
    // Add content text (e.g., bullets)
    if (slide.content && slide.content.text) {
      slideToAdd.addText(slide.content.text, {
        x: 0.5,
        y: 3, // Adjust positioning as needed
        text: slide.content.text,
        fontSize: 14,
      });
    }
    // Add image if specified
    if (slide.content && slide.content.image) {
      // Placeholder for image insertion; need to handle paths and dimensions
      slideToAdd.addImg(slide.content.image, { x: 5.5, y: 1.5, w: 2, h: 4 }); // Example positioning
    }
  }

  // Save the presentation
  if (outputPath) {
    return pptx.writeFile({ fileName: outputPath });
  }
  return pptx.writeFile('mice_evolution_presentation.pptx');
}

// Programmatic export
module.exports = {
  generatePresentation: async (data = {}, outputPath) => {
    // allow overriding slide content
    const slides = Array.isArray(data.slides) && data.slides.length ? data.slides : slideContent;
    // build presentation similarly
    const pptx = new pptxgen({ title: data.title || 'Human and Mouse Cohabitation and Evolution' });
    for (const slide of slides) {
      const slideToAdd = pptx.addSlide();
      if (slide.title) {
        slideToAdd.addText(slide.title, { x: 0.5, y: 1.5, w: 9, h: 1, fontSize: 20, bold: true });
      }
      if (slide.content && slide.content.text) {
        slideToAdd.addText(slide.content.text, { x: 0.5, y: 3, text: slide.content.text, fontSize: 14 });
      }
      if (slide.content && slide.content.image) {
        try {
          if (fs.existsSync(slide.content.image)) {
            slideToAdd.addImage({ path: slide.content.image, x: 5.5, y: 1.5, w: 2, h: 4 });
          } else {
            slideToAdd.addShape(pptx.ShapeType.rect, { x: 5.5, y: 1.5, w: 2, h: 4, fill: { color: '#f3f4f6' }, line: { color: '#d1d5db' } });
            slideToAdd.addText('Image', { x: 5.5, y: 3, w: 2, h: 0.4, fontSize: 12, color: '#6b7280', align: 'center' });
          }
        } catch (e) {
          // ignore
        }
      }
    }
    const out = outputPath || 'mice_evolution_presentation.pptx';
    await pptx.writeFile({ fileName: out });
    return { success: true, path: out };
  }
};
