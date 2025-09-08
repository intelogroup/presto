#!/usr/bin/env python3
"""
Design Properties Extractor - Combine template and image analysis
Creates a comprehensive design specification for the Scientific Conference Slides template
by merging structural analysis from python-pptx with visual analysis from images.
"""

import json
import os
from collections import defaultdict
import colorsys

class DesignPropertiesExtractor:
    def __init__(self, template_analysis_file='template_analysis.json', image_analysis_file='image_analysis.json'):
        self.template_analysis_file = template_analysis_file
        self.image_analysis_file = image_analysis_file
        self.template_data = {}
        self.image_data = {}
        self.design_properties = {
            'slide_dimensions': {},
            'color_scheme': {},
            'typography': {},
            'layout_templates': {},
            'design_elements': {},
            'brand_guidelines': {}
        }
    
    def load_analysis_files(self):
        """Load both template and image analysis files"""
        try:
            with open(self.template_analysis_file, 'r', encoding='utf-8') as f:
                self.template_data = json.load(f)
            print(f"✅ Loaded template analysis from {self.template_analysis_file}")
        except FileNotFoundError:
            print(f"❌ Template analysis file not found: {self.template_analysis_file}")
            return False
        
        try:
            with open(self.image_analysis_file, 'r', encoding='utf-8') as f:
                self.image_data = json.load(f)
            print(f"✅ Loaded image analysis from {self.image_analysis_file}")
        except FileNotFoundError:
            print(f"❌ Image analysis file not found: {self.image_analysis_file}")
            return False
        
        return True
    
    def extract_slide_dimensions(self):
        """Extract slide dimensions and aspect ratio"""
        if 'slide_dimensions' in self.template_data:
            dims = self.template_data['slide_dimensions']
            # Check if dimensions are already in EMU or inches
            width_val = float(dims['width'])
            height_val = float(dims['height'])
            
            # If values are very large, they're likely already in EMU
            if width_val > 1000:
                width_inches = width_val / 914400
                height_inches = height_val / 914400
                width_emu = int(width_val)
                height_emu = int(height_val)
            else:
                width_inches = width_val
                height_inches = height_val
                width_emu = int(width_val * 914400)
                height_emu = int(height_val * 914400)
            
            self.design_properties['slide_dimensions'] = {
                'width_inches': width_inches,
                'width_emu': width_emu,
                'height_inches': height_inches,
                'height_emu': height_emu,
                'aspect_ratio': width_inches / height_inches,
                'format': 'Widescreen (16:9)' if abs(width_inches / height_inches - 16/9) < 0.1 else 'Custom'
            }
            print(f"📐 Slide dimensions: {width_inches:.2f}\" x {height_inches:.2f}\" ({self.design_properties['slide_dimensions']['format']})")
    
    def hex_to_rgb(self, hex_color):
        """Convert hex color to RGB tuple"""
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    
    def rgb_to_hsl(self, rgb):
        """Convert RGB to HSL for better color analysis"""
        r, g, b = [x/255.0 for x in rgb]
        h, l, s = colorsys.rgb_to_hls(r, g, b)
        return (int(h*360), int(s*100), int(l*100))
    
    def categorize_color(self, hex_color):
        """Categorize color by its properties"""
        rgb = self.hex_to_rgb(hex_color)
        h, s, l = self.rgb_to_hsl(rgb)
        
        # Determine color category
        if l > 90:
            category = 'light'
        elif l < 20:
            category = 'dark'
        elif s < 20:
            category = 'neutral'
        else:
            if 80 <= h <= 140:  # Green range
                category = 'primary_green'
            elif 140 <= h <= 200:  # Blue-green range
                category = 'secondary_green'
            else:
                category = 'accent'
        
        return {
            'category': category,
            'hue': h,
            'saturation': s,
            'lightness': l,
            'is_green_family': 80 <= h <= 200
        }
    
    def extract_color_scheme(self):
        """Extract comprehensive color scheme from image analysis"""
        if 'color_palette' not in self.image_data:
            return
        
        palette = self.image_data['color_palette']
        colors_by_category = defaultdict(list)
        
        # Analyze each color in the palette
        for color_info in palette['most_common_colors']:
            hex_color, frequency = color_info
            color_analysis = self.categorize_color(hex_color)
            color_analysis['hex'] = hex_color
            color_analysis['frequency'] = frequency
            color_analysis['rgb'] = self.hex_to_rgb(hex_color)
            
            colors_by_category[color_analysis['category']].append(color_analysis)
        
        # Create color scheme
        self.design_properties['color_scheme'] = {
            'primary_colors': colors_by_category.get('primary_green', [])[:3],
            'secondary_colors': colors_by_category.get('secondary_green', [])[:3],
            'neutral_colors': colors_by_category.get('neutral', [])[:3],
            'light_colors': colors_by_category.get('light', [])[:3],
            'dark_colors': colors_by_category.get('dark', [])[:3],
            'accent_colors': colors_by_category.get('accent', [])[:2],
            'total_unique_colors': palette['total_unique_colors'],
            'color_consistency': palette['color_consistency'],
            'dominant_color_family': 'green',
            'brand_colors': {
                'primary': colors_by_category.get('primary_green', [{}])[0].get('hex', '#456446'),
                'secondary': colors_by_category.get('light', [{}])[0].get('hex', '#e7f3ec'),
                'accent': colors_by_category.get('secondary_green', [{}])[0].get('hex', '#6f8770')
            }
        }
        
        print(f"🎨 Color scheme extracted: {len(colors_by_category)} categories")
        print(f"🎨 Primary brand color: {self.design_properties['color_scheme']['brand_colors']['primary']}")
    
    def extract_typography(self):
        """Extract typography information from template analysis"""
        if 'font_scheme' not in self.template_data:
            return

        font_scheme = self.template_data['font_scheme']
        major_font = font_scheme.get('majorFont', {}).get('latin') or font_scheme.get('majorFont', {}).get('Jpan')
        minor_font = font_scheme.get('minorFont', {}).get('latin') or font_scheme.get('minorFont', {}).get('Jpan')

        if not major_font:
            # Fallback to any available font
            for key, value in font_scheme.get('majorFont', {}).items():
                if value:
                    major_font = value
                    break

        if not minor_font:
            # Fallback to any available font
            for key, value in font_scheme.get('minorFont', {}).items():
                if value:
                    minor_font = value
                    break
        
        if not major_font and not minor_font:
            primary_font = 'Gothic A1'
            font_families = ['Gothic A1']
        elif major_font and minor_font and major_font != minor_font:
            primary_font = major_font
            font_families = [major_font, minor_font]
        else:
            primary_font = major_font or minor_font
            font_families = [primary_font]


        recommended_sizes = {
            'title': 44,
            'heading': 32,
            'subheading': 24,
            'body': 18,
            'caption': 14
        }

        font_hierarchy = defaultdict(list)
        all_font_entries = []
        for category, size in recommended_sizes.items():
            font_entry = {
                'name': primary_font,
                'size': size,
                'size_pt': size
            }
            font_hierarchy[category].append(font_entry)
            all_font_entries.append(font_entry)


        all_sizes = [entry['size'] for entry in all_font_entries]

        self.design_properties['typography'] = {
            'primary_font_family': primary_font,
            'font_families': font_families,
            'font_hierarchy': dict(font_hierarchy),
            'total_font_variations': len(all_font_entries),
            'size_range': {
                'min': min(all_sizes) if all_sizes else 12,
                'max': max(all_sizes) if all_sizes else 44
            },
            'recommended_sizes': recommended_sizes
        }

        print(f"📝 Typography: {primary_font} family with {len(all_font_entries)} variations")
    
    def extract_layout_templates(self):
        """Extract layout templates from template analysis"""
        if 'layouts' not in self.template_data:
            return
        
        layouts = self.template_data['layouts']
        layout_templates = {}
        
        for layout in layouts:
            layout_name = layout['name']
            placeholders = layout.get('placeholders', [])
            
            # Analyze placeholder patterns
            placeholder_types = defaultdict(int)
            for placeholder in placeholders:
                placeholder_types[placeholder['type']] += 1
            
            layout_templates[layout_name] = {
                'name': layout_name,
                'placeholder_count': len(placeholders),
                'placeholder_types': dict(placeholder_types),
                'placeholders': placeholders,
                'usage_pattern': self.determine_usage_pattern(placeholder_types)
            }
        
        self.design_properties['layout_templates'] = layout_templates
        print(f"📋 Layout templates: {len(layouts)} different layouts")
    
    def determine_usage_pattern(self, placeholder_types):
        """Determine the usage pattern of a layout based on placeholders"""
        if 'TITLE' in placeholder_types and 'SUBTITLE' in placeholder_types:
            return 'title_slide'
        elif 'TITLE' in placeholder_types and 'BODY' in placeholder_types:
            return 'content_slide'
        elif 'TITLE' in placeholder_types and 'PICTURE' in placeholder_types:
            return 'image_slide'
        elif placeholder_types.get('BODY', 0) > 1:
            return 'multi_content'
        else:
            return 'custom'
    
    def extract_design_elements(self):
        """Extract design elements and patterns"""
        # From image analysis
        layout_patterns = self.image_data.get('layout_patterns', {})
        
        # From template analysis
        slide_count = len(self.template_data.get('slides', []))
        
        self.design_properties['design_elements'] = {
            'slide_count': slide_count,
            'average_elements_per_slide': layout_patterns.get('avg_elements_per_slide', 1.0),
            'layout_consistency': layout_patterns.get('element_count_variance', 0.0),
            'design_style': 'professional_academic',
            'visual_hierarchy': 'clean_minimal',
            'content_density': 'low' if layout_patterns.get('avg_elements_per_slide', 1) < 3 else 'medium'
        }
        
        print(f"🎨 Design elements: {slide_count} slides with clean, minimal style")
    
    def create_brand_guidelines(self):
        """Create brand guidelines based on extracted properties"""
        color_scheme = self.design_properties.get('color_scheme', {})
        typography = self.design_properties.get('typography', {})
        
        self.design_properties['brand_guidelines'] = {
            'theme': 'Scientific Conference - Green Nature Theme',
            'color_palette': {
                'primary': color_scheme.get('brand_colors', {}).get('primary', '#456446'),
                'secondary': color_scheme.get('brand_colors', {}).get('secondary', '#e7f3ec'),
                'accent': color_scheme.get('brand_colors', {}).get('accent', '#6f8770'),
                'text_dark': '#2d4a2e',
                'text_light': '#ffffff',
                'background': '#ffffff'
            },
            'typography_scale': typography.get('recommended_sizes', {}),
            'font_family': typography.get('primary_font_family', 'Gothic A1'),
            'design_principles': [
                'Clean and minimal layout',
                'Nature-inspired green color scheme',
                'Professional academic presentation style',
                'Consistent typography hierarchy',
                'Balanced white space usage'
            ],
            'usage_guidelines': {
                'primary_color_usage': 'Headers, important text, accent elements',
                'secondary_color_usage': 'Backgrounds, subtle highlights',
                'font_pairing': 'Use Gothic A1 family for consistency',
                'layout_spacing': 'Maintain generous white space',
                'image_treatment': 'Clean, professional imagery with green tints'
            }
        }
        
        print(f"📋 Brand guidelines created for Scientific Conference theme")
    
    def generate_python_pptx_config(self):
        """Generate python-pptx compatible configuration"""
        config = {
            'slide_dimensions': {
                'width': self.design_properties['slide_dimensions']['width_emu'],
                'height': self.design_properties['slide_dimensions']['height_emu']
            },
            'colors': {
                'primary': self.design_properties['brand_guidelines']['color_palette']['primary'],
                'secondary': self.design_properties['brand_guidelines']['color_palette']['secondary'],
                'accent': self.design_properties['brand_guidelines']['color_palette']['accent'],
                'text_dark': self.design_properties['brand_guidelines']['color_palette']['text_dark'],
                'text_light': self.design_properties['brand_guidelines']['color_palette']['text_light']
            },
            'fonts': {
                'primary': self.design_properties['typography']['primary_font_family'],
                'sizes': self.design_properties['typography']['recommended_sizes']
            },
            'layouts': self.design_properties['layout_templates']
        }
        
        return config
    
    def run_extraction(self):
        """Run complete design properties extraction"""
        print("🔍 Starting design properties extraction...")
        
        if not self.load_analysis_files():
            return None
        
        self.extract_slide_dimensions()
        self.extract_color_scheme()
        self.extract_typography()
        self.extract_layout_templates()
        self.extract_design_elements()
        self.create_brand_guidelines()
        
        print("\n✅ Design properties extraction complete!")
        return self.design_properties
    
    def save_design_properties(self, output_file='design_properties.json'):
        """Save design properties to JSON file"""
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(self.design_properties, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Design properties saved to {output_file}")
    
    def save_python_pptx_config(self, output_file='enhanced_template_config.json'):
        """Save python-pptx compatible configuration"""
        config = self.generate_python_pptx_config()
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=2, ensure_ascii=False)
        
        print(f"💾 Python-pptx config saved to {output_file}")
        return config

def main():
    extractor = DesignPropertiesExtractor()
    design_properties = extractor.run_extraction()
    
    if design_properties:
        extractor.save_design_properties()
        config = extractor.save_python_pptx_config()
        
        # Print summary
        print("\n📋 DESIGN PROPERTIES SUMMARY")
        print("=" * 50)
        print(f"📐 Slide format: {design_properties['slide_dimensions']['format']}")
        print(f"🎨 Primary color: {design_properties['brand_guidelines']['color_palette']['primary']}")
        print(f"📝 Font family: {design_properties['typography']['primary_font_family']}")
        print(f"📋 Layout templates: {len(design_properties['layout_templates'])}")
        print(f"🎨 Design style: {design_properties['design_elements']['design_style']}")
        
        print("\n🎨 Brand Color Palette:")
        for color_type, color_value in design_properties['brand_guidelines']['color_palette'].items():
            print(f"  {color_type}: {color_value}")
        
        print("\n📝 Typography Hierarchy:")
        for size_type, size_value in design_properties['typography']['recommended_sizes'].items():
            print(f"  {size_type}: {size_value}pt")

if __name__ == "__main__":
    main()