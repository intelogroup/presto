// text-positioning-010 - Generated 2025-09-07T15:05:10.209Z
// Auto-generated battle-tested pattern

const PptxGenJS = require('pptxgenjs');

function createTextPositioning010Presentation(data = {}) {
  const pptx = new PptxGenJS();

  pptx.layout = 'LAYOUT_16x9';

  // Slide 1
  const slide1 = pptx.addSlide();
  slide1.addText('Text alignment: left, size: 24pt, position: (1,1)', {
  "x": 1,
  "y": 1,
  "w": 8,
  "h": 1,
  "fontSize": 24,
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

module.exports = { createTextPositioning010Presentation };