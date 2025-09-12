import os
import sys
from pathlib import Path

try:
    import cairosvg
except ImportError:
    print("Error: cairosvg is not installed. Please install it using:")
    print("pip install cairosvg")
    sys.exit(1)

def convert_svg_to_png_recursive(input_dir, output_dir):
    """
    Recursively converts all SVG files in a directory tree to PNG format,
    maintaining the directory structure.

    Args:
        input_dir (str): The root directory containing SVG files.
        output_dir (str): The root directory to save the PNG files.
    """
    input_path = Path(input_dir)
    output_path = Path(output_dir)

    if not input_path.is_dir():
        print(f"Error: Input directory not found at '{input_dir}'")
        return False

    output_path.mkdir(parents=True, exist_ok=True)
    
    total_converted = 0
    total_errors = 0

    # Walk through all directories and subdirectories
    for root, dirs, files in os.walk(input_path):
        root_path = Path(root)
        
        # Find all SVG files in current directory
        svg_files = [f for f in files if f.lower().endswith('.svg')]
        
        if svg_files:
            # Calculate relative path from input_dir to current directory
            relative_path = root_path.relative_to(input_path)
            
            # Create corresponding output directory
            current_output_dir = output_path / relative_path
            current_output_dir.mkdir(parents=True, exist_ok=True)
            
            print(f"\nProcessing directory: {relative_path}")
            print(f"Found {len(svg_files)} SVG files")
            print(f"Output directory: {current_output_dir}")
            
            for svg_file in svg_files:
                svg_path = root_path / svg_file
                
                # Remove .svg extension and add .png
                png_filename = svg_file.rsplit('.svg', 1)[0] + '.png'
                png_path = current_output_dir / png_filename
                
                print(f"  Converting '{svg_file}' to '{png_filename}'...")
                print(f"    Source: {svg_path}")
                print(f"    Target: {png_path}")
                
                try:
                    # Ensure the output directory exists
                    png_path.parent.mkdir(parents=True, exist_ok=True)
                    
                    # Convert SVG to PNG
                    cairosvg.svg2png(url=str(svg_path), write_to=str(png_path))
                    
                    # Verify the file was created
                    if png_path.exists():
                        file_size = png_path.stat().st_size
                        print(f"    ✅ Success! File size: {file_size} bytes")
                        total_converted += 1
                    else:
                        print(f"    ❌ File was not created")
                        total_errors += 1
                        
                except Exception as e:
                    print(f"    ❌ Error converting '{svg_file}': {e}")
                    total_errors += 1
    
    print(f"\n=== Conversion Summary ===")
    print(f"Total files converted: {total_converted}")
    print(f"Total errors: {total_errors}")
    print(f"PNG files saved in: {output_dir}")
    
    return total_errors == 0

def main():
    """
    Main function to convert all SVGs in the assets folder.
    """
    # Define paths
    assets_dir = "assets-images"
    output_dir = "assets-images-png"
    
    print("SVG to PNG Converter")
    print("====================")
    print(f"Input directory: {assets_dir}")
    print(f"Output directory: {output_dir}")
    
    if not os.path.exists(assets_dir):
        print(f"Error: Assets directory '{assets_dir}' not found!")
        print("Please run this script from the project root directory.")
        sys.exit(1)
    
    success = convert_svg_to_png_recursive(assets_dir, output_dir)
    
    if success:
        print("\n✅ All SVG files converted successfully!")
    else:
        print("\n⚠️  Some files failed to convert. Check the output above for details.")

if __name__ == "__main__":
    main()