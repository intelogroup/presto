import requests
import os
import json
from urllib.parse import urlparse
import time
import xml.etree.ElementTree as ET

class VectorFetcher:
    def __init__(self):
        self.assets_dir = "assets-vector"
        self.temp_dir = "temp_vectors"
        
        # Ensure directories exist
        os.makedirs(self.assets_dir, exist_ok=True)
        os.makedirs(self.temp_dir, exist_ok=True)
        
        # Create subdirectories for different vector types
        self.illustrations_dir = os.path.join(self.assets_dir, "illustrations")
        self.patterns_dir = os.path.join(self.assets_dir, "patterns")
        self.shapes_dir = os.path.join(self.assets_dir, "shapes")
        self.backgrounds_dir = os.path.join(self.assets_dir, "backgrounds")
        
        for directory in [self.illustrations_dir, self.patterns_dir, self.shapes_dir, self.backgrounds_dir]:
            os.makedirs(directory, exist_ok=True)
    
    def create_scientific_vectors(self):
        """
        Create custom SVG vectors for scientific presentations
        """
        print("Creating custom scientific vectors...")
        
        vectors = []
        
        # 1. Laboratory Flask
        flask_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="flaskGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e3f2fd;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1976d2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path d="M35 20 L35 35 L20 70 L80 70 L65 35 L65 20 Z" fill="url(#flaskGradient)" stroke="#1565c0" stroke-width="2"/>
  <rect x="32" y="15" width="36" height="8" fill="#424242" rx="2"/>
  <circle cx="30" cy="55" r="3" fill="#4caf50" opacity="0.7"/>
  <circle cx="45" cy="60" r="2" fill="#4caf50" opacity="0.5"/>
  <circle cx="55" cy="50" r="2.5" fill="#4caf50" opacity="0.6"/>
</svg>'''
        
        # 2. DNA Helix
        dna_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="dnaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#4ecdc4;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#45b7d1;stop-opacity:1" />
    </linearGradient>
  </defs>
  <path d="M20 10 Q50 30 80 10 Q50 50 20 30 Q50 70 80 50 Q50 90 20 70" 
        fill="none" stroke="url(#dnaGradient)" stroke-width="3"/>
  <path d="M80 10 Q50 30 20 10 Q50 50 80 30 Q50 70 20 50 Q50 90 80 70" 
        fill="none" stroke="url(#dnaGradient)" stroke-width="3" opacity="0.7"/>
  <!-- Connection lines -->
  <line x1="35" y1="20" x2="65" y2="20" stroke="#666" stroke-width="1"/>
  <line x1="35" y1="40" x2="65" y2="40" stroke="#666" stroke-width="1"/>
  <line x1="35" y1="60" x2="65" y2="60" stroke="#666" stroke-width="1"/>
  <line x1="35" y1="80" x2="65" y2="80" stroke="#666" stroke-width="1"/>
</svg>'''
        
        # 3. Molecule Structure
        molecule_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <radialGradient id="atomGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2196f3;stop-opacity:1" />
    </radialGradient>
  </defs>
  <!-- Bonds -->
  <line x1="30" y1="30" x2="50" y2="50" stroke="#666" stroke-width="3"/>
  <line x1="50" y1="50" x2="70" y2="30" stroke="#666" stroke-width="3"/>
  <line x1="50" y1="50" x2="70" y2="70" stroke="#666" stroke-width="3"/>
  <line x1="50" y1="50" x2="30" y2="70" stroke="#666" stroke-width="3"/>
  <!-- Atoms -->
  <circle cx="30" cy="30" r="8" fill="url(#atomGradient)" stroke="#1976d2" stroke-width="2"/>
  <circle cx="70" cy="30" r="8" fill="#f44336" stroke="#d32f2f" stroke-width="2"/>
  <circle cx="70" cy="70" r="8" fill="#4caf50" stroke="#388e3c" stroke-width="2"/>
  <circle cx="30" cy="70" r="8" fill="#ff9800" stroke="#f57c00" stroke-width="2"/>
  <circle cx="50" cy="50" r="10" fill="url(#atomGradient)" stroke="#1976d2" stroke-width="2"/>
</svg>'''
        
        # 4. Chart Arrow Up
        chart_arrow_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="chartGradient" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" style="stop-color:#4caf50;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8bc34a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Chart bars -->
  <rect x="10" y="70" width="15" height="20" fill="url(#chartGradient)"/>
  <rect x="30" y="60" width="15" height="30" fill="url(#chartGradient)"/>
  <rect x="50" y="45" width="15" height="45" fill="url(#chartGradient)"/>
  <!-- Arrow -->
  <path d="M70 50 L85 35 L80 35 L80 20 L75 20 L75 35 L70 35 Z" fill="#2196f3"/>
  <path d="M70 50 L85 50 L85 45 L90 50 L85 55 L85 50" fill="#2196f3"/>
</svg>'''
        
        # 5. Discussion Bubble
        discussion_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="bubbleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#e8f5e8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c8e6c9;stop-opacity:1" />
    </linearGradient>
  </defs>
  <!-- Main bubble -->
  <ellipse cx="50" cy="40" rx="35" ry="25" fill="url(#bubbleGradient)" stroke="#4caf50" stroke-width="2"/>
  <!-- Tail -->
  <path d="M35 60 L25 75 L45 65 Z" fill="url(#bubbleGradient)" stroke="#4caf50" stroke-width="2"/>
  <!-- Text lines -->
  <line x1="30" y1="35" x2="70" y2="35" stroke="#2e7d32" stroke-width="2"/>
  <line x1="30" y1="42" x2="65" y2="42" stroke="#2e7d32" stroke-width="2"/>
  <line x1="30" y1="49" x2="60" y2="49" stroke="#2e7d32" stroke-width="2"/>
</svg>'''
        
        # 6. Data Analysis Vector
        data_analysis_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="dataGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#64b5f6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1976d2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect x="10" y="70" width="15" height="20" fill="url(#dataGradient)"/>
  <rect x="30" y="50" width="15" height="40" fill="url(#dataGradient)"/>
  <rect x="50" y="30" width="15" height="60" fill="url(#dataGradient)"/>
  <rect x="70" y="10" width="15" height="80" fill="url(#dataGradient)"/>
  <path d="M10 60 L35 40 L55 55 L80 25" fill="none" stroke="#ffc107" stroke-width="3"/>
</svg>'''

        # Save vectors
        vector_data = [
            ("laboratory_flask.svg", flask_svg, "illustrations"),
            ("dna_helix.svg", dna_svg, "illustrations"),
            ("molecule_structure.svg", molecule_svg, "illustrations"),
            ("chart_arrow_up.svg", chart_arrow_svg, "shapes"),
            ("discussion_bubble.svg", discussion_svg, "shapes"),
            ("data_analysis.svg", data_analysis_svg, "illustrations")
        ]
        
        for filename, svg_content, category in vector_data:
            if category == "illustrations":
                filepath = os.path.join(self.illustrations_dir, filename)
            elif category == "shapes":
                filepath = os.path.join(self.shapes_dir, filename)
            else:
                filepath = os.path.join(self.assets_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            
            vectors.append({
                'name': filename.replace('.svg', ''),
                'filename': filename,
                'filepath': filepath,
                'category': category,
                'type': 'custom_svg'
            })
            
            print(f"Created vector: {filename}")
        
        return vectors
    
    def create_background_patterns(self):
        """
        Create background patterns for slides
        """
        print("\nCreating background patterns...")
        
        patterns = []
        
        # 1. Subtle Grid Pattern
        grid_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#e0e0e0" stroke-width="0.5"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#grid)"/>
</svg>'''
        
        # 2. Hexagon Pattern
        hexagon_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <pattern id="hexagon" width="20" height="17.32" patternUnits="userSpaceOnUse">
      <polygon points="10,1.73 18.66,6.73 18.66,16.73 10,21.73 1.34,16.73 1.34,6.73" 
               fill="none" stroke="#f0f0f0" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#hexagon)"/>
</svg>'''
        
        # 3. Molecular Pattern
        molecular_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <pattern id="molecular" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="2" fill="#e3f2fd" opacity="0.6"/>
      <line x1="15" y1="15" x2="25" y2="10" stroke="#bbdefb" stroke-width="1" opacity="0.4"/>
      <line x1="15" y1="15" x2="5" y2="25" stroke="#bbdefb" stroke-width="1" opacity="0.4"/>
      <circle cx="25" cy="10" r="1.5" fill="#e3f2fd" opacity="0.5"/>
      <circle cx="5" cy="25" r="1.5" fill="#e3f2fd" opacity="0.5"/>
    </pattern>
  </defs>
  <rect width="100" height="100" fill="url(#molecular)"/>
</svg>'''
        
        pattern_data = [
            ("subtle_grid.svg", grid_svg),
            ("hexagon_pattern.svg", hexagon_svg),
            ("molecular_pattern.svg", molecular_svg)
        ]
        
        for filename, svg_content in pattern_data:
            filepath = os.path.join(self.patterns_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            
            patterns.append({
                'name': filename.replace('.svg', ''),
                'filename': filename,
                'filepath': filepath,
                'category': 'patterns',
                'type': 'background_pattern'
            })
            
            print(f"Created pattern: {filename}")
        
        return patterns
    
    def create_vector_catalog(self, all_vectors):
        """
        Create a catalog of all vectors
        """
        catalog = {
            'total_vectors': len(all_vectors),
            'categories': {
                'illustrations': len([v for v in all_vectors if v['category'] == 'illustrations']),
                'shapes': len([v for v in all_vectors if v['category'] == 'shapes']),
                'patterns': len([v for v in all_vectors if v['category'] == 'patterns']),
                'backgrounds': len([v for v in all_vectors if v['category'] == 'backgrounds'])
            },
            'vectors': all_vectors
        }
        
        catalog_file = os.path.join(self.assets_dir, "vector_catalog.json")
        with open(catalog_file, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
        
        print(f"\nVector catalog saved to: {catalog_file}")
        return catalog

def main():
    print("Vector Fetcher for Discussion Slide Assets")
    print("=" * 50)
    
    fetcher = VectorFetcher()
    all_vectors = []
    
    try:
        # Create custom scientific vectors
        scientific_vectors = fetcher.create_scientific_vectors()
        all_vectors.extend(scientific_vectors)
        
        # Create background patterns
        patterns = fetcher.create_background_patterns()
        all_vectors.extend(patterns)
        
        # Create catalog
        catalog = fetcher.create_vector_catalog(all_vectors)
        
        print(f"\n✅ Vector creation completed!")
        print(f"Total vectors: {catalog['total_vectors']}")
        print(f"  - Illustrations: {catalog['categories']['illustrations']}")
        print(f"  - Shapes: {catalog['categories']['shapes']}")
        print(f"  - Patterns: {catalog['categories']['patterns']}")
        print(f"  - Backgrounds: {catalog['categories']['backgrounds']}")
        
        print("\n📝 Notes:")
        print("  - All vectors are in SVG format")
        print("  - Vectors are scalable and customizable")
        print("  - Organized by category in subdirectories")
        print("  - Suitable for scientific presentations")
        
    except Exception as e:
        print(f"\n❌ Error during vector creation: {e}")

if __name__ == "__main__":
    main()