// text-positioning-005 - Generated 2025-09-07T15:05:07.631Z
// Auto-generated battle-tested pattern

const PptxGenJS = require('pptxgenjs');

function createTextPositioning005Presentation(data = {}) {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9';

  // Slide 1
  const slide1 = pptx.addSlide();
  slide1.addText('Text alignment: left, size: 16pt, position: (2,1.5)', {
  "x": 2,
  "y": 1.5,
  "w": 6,
  "h": 0.8,
  "fontSize": 16,
  "align": "left",
  "color": "333333",
  "objectName": "Text 0",
  "line": {},
  "lineSpacing": null,
  "lineSpacingMultiple": null,
  "_bodyProp": {
    "autoFit": false,
    "anchor": "ctr",
    "vert": null,
    "wrap": true,
    "align": "left"
  },
  "_lineIdx": 0
});

  return pptx;
}

module.exports = { createTextPositioning005Presentation };