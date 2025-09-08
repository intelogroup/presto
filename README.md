# Slidy Presto - Enhanced Presentation Generator

This project provides an enhanced presentation generator that uses Jinja2 templates to create PowerPoint presentations from JSON data. It automatically extracts design elements (colors and fonts) from a template presentation to ensure brand consistency.

## Features

- **Template-based Generation**: Uses a `.pptx` file as a template for design and layout.
- **Design Extraction**: Automatically analyzes the template to extract color schemes and font styles.
- **Jinja2 Templating**: Leverages Jinja2 for flexible and dynamic content rendering in slides.
- **Multiple Slide Layouts**: Supports a variety of slide layouts, including:
    - Title Slide
    - Title and Content
    - Section Header
    - Two Content
    - Comparison
    - Title Only
    - Blank
    - Content with Caption
    - Picture with Caption
- **JSON Data Source**: Drives presentation content from a structured JSON file.

## How to Use

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Prepare your Template**:

   - Place your template `.pptx` file in the project root (e.g., `Copie de Scientific Conference Slides.pptx`).

3. **Prepare your Content**:

   - Create a JSON file with your presentation data. See `complex_test_case.json` for a detailed example.

4. **Run the Generator**:

   - Use the `test_enhanced_generator.py` script to generate a presentation.

   ```bash
   python test_enhanced_generator.py
   ```

   - This will create `complex_test_output.pptx` in the project root.

## Project Structure

- `enhanced_presentation_generator.py`: The main script for the presentation generator.
- `templates/`: Directory containing Jinja2 templates for different slide layouts.
- `template_analysis.json`: Stores the extracted design information from the template.
- `complex_test_case.json`: An example of a complex data file for generating a presentation.
- `test_enhanced_generator.py`: An example script to run the generator.