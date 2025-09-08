import aspose.slides as slides
import aspose.pydrawing as drawing
import os

# Create output directory if it doesn't exist
output_dir = "final_scientific_presentation_images"
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Load the presentation
pres = slides.Presentation("final_scientific_presentation.pptx")

# Iterate through the slides and save each as a PNG
for i, slide in enumerate(pres.slides):
    # Save the slide to a stream
    slide.get_thumbnail(1, 1).save(os.path.join(output_dir, f"slide_{i+1}.png"), drawing.imaging.ImageFormat.png)