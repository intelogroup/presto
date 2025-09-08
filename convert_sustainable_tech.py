#!/usr/bin/env python3
"""
Convert Sustainable Technology Presentation to PNG Images
"""

from presentation_comparison import PresentationConverter
import os

def main():
    # Initialize converter
    converter = PresentationConverter(output_dir=".")
    
    # Convert the sustainable tech presentation
    pptx_file = "generators/sustainable_tech_presentation.pptx"
    
    if os.path.exists(pptx_file):
        print(f"🌱 Converting {pptx_file} to PNG images...")
        png_files = converter.convert_to_png(pptx_file, prefix="sustainable_tech")
        
        print(f"\n✅ Successfully converted {len(png_files)} slides:")
        for png_file in png_files:
            print(f"   📸 {png_file}")
    else:
        print(f"❌ File not found: {pptx_file}")

if __name__ == "__main__":
    main()