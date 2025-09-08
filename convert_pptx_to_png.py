from presentation_comparison import PresentationConverter

# Initialize the converter
converter = PresentationConverter(output_dir="pptx_images")

# Convert the presentation
converter.convert_to_png("visual_design_presentation.pptx", prefix="slide")