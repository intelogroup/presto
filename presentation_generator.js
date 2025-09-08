const pptxgen = require("pptxgenjs");
const fs = require("fs");

// Load the design properties and theme analysis
const designProperties = JSON.parse(fs.readFileSync("design_properties.json", "utf8"));
const themeAnalysis = JSON.parse(fs.readFileSync("template_analysis.json", "utf8"));

// Create a new presentation
const pptx = new pptxgen();

// --- Theme Definition ---
const themeName = "CustomTheme";
const slideLayout = { name: themeName, width: 13334400, height: 7502400 };

const theme = {
  themeName,
  colorScheme: themeAnalysis.color_scheme || {},
  fontScheme: {
    major: themeAnalysis.font_scheme.majorFont || { latin: 'Arial' },
    minor: themeAnalysis.font_scheme.minorFont || { latin: 'Arial' },
  },
};

pptx.defineLayout(slideLayout);
pptx.theme = theme;

// --- Slide Generation ---
designProperties.slides.forEach(slideData => {
  const slide = pptx.addSlide();

  // Add background if specified
  if (slideData.background && slideData.background.type === "image") {
    slide.background = { path: slideData.background.path };
  }

  // Add shapes
  slideData.shapes.forEach(shape => {
    slide.addShape(pptx.shapes[shape.type], {
      x: shape.x,
      y: shape.y,
      w: shape.w,
      h: shape.h,
      fill: { color: shape.fill.color }
    });
  });

  // Add text boxes
  slideData.textBoxes.forEach(textBox => {
    slide.addText(textBox.text, {
      x: textBox.x,
      y: textBox.y,
      w: textBox.w,
      h: textBox.h,
      fontFace: textBox.fontFace,
      fontSize: textBox.fontSize,
      color: textBox.color,
      align: textBox.align,
      valign: textBox.valign
    });
  });

  // Add images
  slideData.images.forEach(image => {
    slide.addImage({
      path: image.path,
      x: image.x,
      y: image.y,
      w: image.w,
      h: image.h
    });
  });
});

// --- Save the Presentation ---
pptx.writeFile({ fileName: "generated_presentation.pptx" })
  .then(fileName => {
    console.log(`Presentation created: ${fileName}`);
  })
  .catch(err => {
    console.error(err);
  });