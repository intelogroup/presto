import os
import sys
from pathlib import Path

try:
    import cairosvg
except ImportError:
    print("Error: cairosvg is not installed. Please install it using:")
    print("pip install cairosvg")
    sys.exit(1)

def convert_svg_to_png(input_dir, output_dir):
    """
    Converts all SVG files in a directory to PNG format.

    Args:
        input_dir (str): The directory containing SVG files.
        output_dir (str): The directory to save the PNG files.
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)

    if not input_path.is_dir():
        print(f"Error: Input directory not found at '{input_dir}'")
        sys.exit(1)

    output_path.mkdir(parents=True, exist_ok=True)

    svg_files = list(input_path.glob("*.svg"))

    if not svg_files:
        print(f"No SVG files found in '{input_dir}'")
        return

    print(f"Found {len(svg_files)} SVG files to convert.")

    for svg_file in svg_files:
        png_file = output_path / (svg_file.stem + ".png")
        print(f"Converting '{svg_file.name}' to '{png_file.name}'...")
        try:
            cairosvg.svg2png(url=str(svg_file), write_to=str(png_file))
        except Exception as e:
            print(f"Error converting '{svg_file.name}': {e}")

    print(f"\nConversion complete. PNG files saved in '{output_dir}'")

def main():
    """
    Main function to handle command-line arguments.
    """
    if len(sys.argv) != 3:
        print("Usage: python svg_to_png_converter.py <input_directory> <output_directory>")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2]

    convert_svg_to_png(input_dir, output_dir)

if __name__ == "__main__":
    main()