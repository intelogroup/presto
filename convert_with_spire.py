from spire.presentation import *
from spire.presentation.common import *
import os

# Create a Presentation instance
pres = Presentation()

# Specify the input PowerPoint file
inputFile = "discussion_slide_pptxgenjs.pptx"

# Check if the file exists
if not os.path.exists(inputFile):
    print(f"Error: Input file not found at {inputFile}")
else:
    try:
        # Load the PowerPoint file
        pres.LoadFromFile(inputFile)

        # Get the first slide
        slide = pres.Slides[0]

        # Specify the output image file
        outputFile = "discussion_slide_pptxgenjs.png"

        # Save the slide as a PNG image
        image = slide.SaveAsImage()
        image.Save(outputFile)
        image.Dispose()
        
        print(f"Successfully converted '{inputFile}' to '{outputFile}'")

    except Exception as e:
        print(f"An error occurred: {e}")

    finally:
        # Dispose of the Presentation instance
        pres.Dispose()