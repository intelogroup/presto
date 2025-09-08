#!/usr/bin/env python3
"""
Asset Organizer for PowerPoint Presentations
Catalogs and organizes all enhanced assets for easy integration
"""

import os
import json
import shutil
from pathlib import Path
from typing import Dict, List, Any
import time

class AssetOrganizer:
    def __init__(self):
        self.project_root = Path(".")
        self.enhanced_dir = self.project_root / "assets-enhanced"
        self.existing_dirs = {
            "icons": self.project_root / "assets-icons",
            "images": self.project_root / "assets-images", 
            "vectors": self.project_root / "assets-vector"
        }
        self.master_catalog = {
            "icons": {
                "premium": [],
                "business": [],
                "tech": [],
                "existing": []
            },
            "vectors": {
                "backgrounds": [],
                "illustrations": [],
                "patterns": [],
                "existing": []
            },
            "images": {
                "pexels": [],
                "existing": []
            },
            "smart_art": {
                "process": [],
                "hierarchy": [],
                "relationship": []
            },
            "infographics": {
                "charts": [],
                "timelines": [],
                "comparisons": []
            },
            "templates": {
                "layouts": [],
                "themes": []
            }
        }
    
    def scan_existing_assets(self):
        """Scan existing asset directories"""
        print("\n=== Scanning Existing Assets ===")
        
        # Scan icons
        if self.existing_dirs["icons"].exists():
            for icon_dir in self.existing_dirs["icons"].iterdir():
                if icon_dir.is_dir():
                    for icon_file in icon_dir.glob("*.svg"):
                        self.master_catalog["icons"]["existing"].append({
                            "name": icon_file.name,
                            "path": str(icon_file),
                            "category": icon_dir.name,
                            "size": icon_file.stat().st_size,
                            "type": "svg"
                        })
        
        # Scan images
        if self.existing_dirs["images"].exists():
            for img_file in self.existing_dirs["images"].glob("*.jpg"):
                self.master_catalog["images"]["existing"].append({
                    "name": img_file.name,
                    "path": str(img_file),
                    "size": img_file.stat().st_size,
                    "type": "jpg"
                })
        
        # Scan vectors
        if self.existing_dirs["vectors"].exists():
            for vector_dir in self.existing_dirs["vectors"].iterdir():
                if vector_dir.is_dir():
                    for vector_file in vector_dir.glob("*.svg"):
                        self.master_catalog["vectors"]["existing"].append({
                            "name": vector_file.name,
                            "path": str(vector_file),
                            "category": vector_dir.name,
                            "size": vector_file.stat().st_size,
                            "type": "svg"
                        })
        
        print(f"Found {len(self.master_catalog['icons']['existing'])} existing icons")
        print(f"Found {len(self.master_catalog['images']['existing'])} existing images")
        print(f"Found {len(self.master_catalog['vectors']['existing'])} existing vectors")
    
    def scan_enhanced_assets(self):
        """Scan enhanced assets directory"""
        print("\n=== Scanning Enhanced Assets ===")
        
        if not self.enhanced_dir.exists():
            print("Enhanced assets directory not found")
            return
        
        # Scan enhanced icons
        icons_dir = self.enhanced_dir / "icons"
        if icons_dir.exists():
            for category_dir in icons_dir.iterdir():
                if category_dir.is_dir():
                    category = category_dir.name
                    for icon_file in category_dir.glob("*.svg"):
                        self.master_catalog["icons"][category].append({
                            "name": icon_file.name,
                            "path": str(icon_file),
                            "size": icon_file.stat().st_size,
                            "type": "svg",
                            "enhanced": True
                        })
        
        # Scan enhanced vectors
        vectors_dir = self.enhanced_dir / "vectors"
        if vectors_dir.exists():
            for category_dir in vectors_dir.iterdir():
                if category_dir.is_dir():
                    category = category_dir.name
                    for vector_file in category_dir.glob("*.svg"):
                        self.master_catalog["vectors"][category].append({
                            "name": vector_file.name,
                            "path": str(vector_file),
                            "size": vector_file.stat().st_size,
                            "type": "svg",
                            "enhanced": True
                        })
        
        # Scan smart art templates
        smartart_dir = self.enhanced_dir / "smart-art"
        if smartart_dir.exists():
            for category_dir in smartart_dir.iterdir():
                if category_dir.is_dir():
                    category = category_dir.name
                    for template_file in category_dir.glob("*.json"):
                        with open(template_file, 'r') as f:
                            template_data = json.load(f)
                        
                        self.master_catalog["smart_art"][category].append({
                            "name": template_file.name,
                            "path": str(template_file),
                            "size": template_file.stat().st_size,
                            "type": "json",
                            "template_name": template_data.get("name", ""),
                            "elements": len(template_data.get("elements", [])),
                            "colors": template_data.get("colors", []),
                            "enhanced": True
                        })
        
        # Scan infographics
        infographics_dir = self.enhanced_dir / "infographics"
        if infographics_dir.exists():
            for category_dir in infographics_dir.iterdir():
                if category_dir.is_dir():
                    category = category_dir.name
                    for template_file in category_dir.glob("*.json"):
                        with open(template_file, 'r') as f:
                            template_data = json.load(f)
                        
                        self.master_catalog["infographics"][category].append({
                            "name": template_file.name,
                            "path": str(template_file),
                            "size": template_file.stat().st_size,
                            "type": "json",
                            "template_name": template_data.get("name", ""),
                            "components": len(template_data.get("components", [])),
                            "color_scheme": template_data.get("color_scheme", []),
                            "enhanced": True
                        })
        
        print(f"Enhanced icons: {sum(len(cat) for cat in self.master_catalog['icons'].values() if cat != self.master_catalog['icons']['existing'])}")
        print(f"Enhanced vectors: {sum(len(cat) for cat in self.master_catalog['vectors'].values() if cat != self.master_catalog['vectors']['existing'])}")
        print(f"Smart art templates: {sum(len(cat) for cat in self.master_catalog['smart_art'].values())}")
        print(f"Infographic templates: {sum(len(cat) for cat in self.master_catalog['infographics'].values())}")
    
    def create_usage_guide(self):
        """Create a usage guide for PowerPoint integration"""
        guide_content = {
            "title": "PowerPoint Asset Integration Guide",
            "created_at": time.time(),
            "asset_categories": {
                "icons": {
                    "description": "SVG icons for presentations",
                    "usage": "Import as images or convert to shapes",
                    "best_practices": [
                        "Use consistent icon style throughout presentation",
                        "Maintain proper sizing and alignment",
                        "Consider color scheme compatibility"
                    ],
                    "categories": list(self.master_catalog["icons"].keys())
                },
                "vectors": {
                    "description": "Vector backgrounds and illustrations",
                    "usage": "Use as slide backgrounds or decorative elements",
                    "best_practices": [
                        "Ensure readability over background vectors",
                        "Use subtle patterns for professional look",
                        "Match vector colors with presentation theme"
                    ],
                    "categories": list(self.master_catalog["vectors"].keys())
                },
                "smart_art": {
                    "description": "Pre-designed smart art templates",
                    "usage": "JSON templates for creating PowerPoint SmartArt",
                    "best_practices": [
                        "Customize colors to match brand",
                        "Adjust text content for your needs",
                        "Maintain consistent spacing"
                    ],
                    "categories": list(self.master_catalog["smart_art"].keys())
                },
                "infographics": {
                    "description": "Infographic templates and components",
                    "usage": "Templates for data visualization",
                    "best_practices": [
                        "Use appropriate chart types for data",
                        "Keep color schemes consistent",
                        "Ensure data accuracy and clarity"
                    ],
                    "categories": list(self.master_catalog["infographics"].keys())
                }
            },
            "integration_methods": {
                "pptxgenjs": {
                    "description": "JavaScript library for PowerPoint generation",
                    "icon_usage": "addImage() with SVG path",
                    "vector_usage": "addImage() as background",
                    "template_usage": "Parse JSON and create shapes programmatically"
                },
                "python_pptx": {
                    "description": "Python library for PowerPoint manipulation",
                    "icon_usage": "slide.shapes.add_picture()",
                    "vector_usage": "Background fill or picture insertion",
                    "template_usage": "Custom shape creation from JSON data"
                },
                "manual_import": {
                    "description": "Direct import into PowerPoint",
                    "steps": [
                        "Insert > Pictures > From File",
                        "Select SVG or image files",
                        "Resize and position as needed",
                        "Apply consistent formatting"
                    ]
                }
            }
        }
        
        guide_file = self.project_root / "asset_usage_guide.json"
        with open(guide_file, 'w') as f:
            json.dump(guide_content, f, indent=2)
        
        print(f"\nUsage guide created: {guide_file}")
    
    def create_asset_index(self):
        """Create searchable asset index"""
        index = {
            "metadata": {
                "created_at": time.time(),
                "total_assets": 0,
                "categories": list(self.master_catalog.keys())
            },
            "assets": self.master_catalog,
            "search_tags": {
                "business": ["chart", "graph", "analytics", "team", "collaboration"],
                "tech": ["data", "process", "flow", "visualization", "network"],
                "design": ["abstract", "geometric", "pattern", "background", "corporate"],
                "infographic": ["comparison", "timeline", "dashboard", "statistics", "features"]
            },
            "color_schemes": {
                "primary": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"],
                "secondary": ["#8B5CF6", "#06B6D4", "#84CC16", "#F97316"],
                "neutral": ["#6B7280", "#374151", "#1F2937", "#111827"]
            }
        }
        
        # Count total assets
        total = 0
        for category in self.master_catalog.values():
            if isinstance(category, dict):
                for subcategory in category.values():
                    if isinstance(subcategory, list):
                        total += len(subcategory)
        
        index["metadata"]["total_assets"] = total
        
        index_file = self.project_root / "master_asset_index.json"
        with open(index_file, 'w') as f:
            json.dump(index, f, indent=2)
        
        print(f"Master asset index created: {index_file}")
        print(f"Total cataloged assets: {total}")
    
    def generate_summary_report(self):
        """Generate summary report of all assets"""
        print("\n=== Asset Summary Report ===")
        
        # Count assets by category
        for category, subcategories in self.master_catalog.items():
            print(f"\n{category.upper()}:")
            if isinstance(subcategories, dict):
                for subcat, items in subcategories.items():
                    if isinstance(items, list):
                        print(f"  {subcat}: {len(items)} items")
        
        # Calculate totals
        total_icons = sum(len(cat) for cat in self.master_catalog["icons"].values())
        total_vectors = sum(len(cat) for cat in self.master_catalog["vectors"].values())
        total_images = sum(len(cat) for cat in self.master_catalog["images"].values())
        total_smartart = sum(len(cat) for cat in self.master_catalog["smart_art"].values())
        total_infographics = sum(len(cat) for cat in self.master_catalog["infographics"].values())
        
        print(f"\nTOTALS:")
        print(f"  Icons: {total_icons}")
        print(f"  Vectors: {total_vectors}")
        print(f"  Images: {total_images}")
        print(f"  Smart Art: {total_smartart}")
        print(f"  Infographics: {total_infographics}")
        print(f"  GRAND TOTAL: {total_icons + total_vectors + total_images + total_smartart + total_infographics}")
    
    def run(self):
        """Main execution method"""
        print("Asset Organizer Starting...")
        
        try:
            self.scan_existing_assets()
            self.scan_enhanced_assets()
            self.create_usage_guide()
            self.create_asset_index()
            self.generate_summary_report()
            
            print("\n=== Asset Organization Complete ===")
            print("Files created:")
            print("  - asset_usage_guide.json")
            print("  - master_asset_index.json")
            print("\nAll assets are now cataloged and ready for PowerPoint integration!")
            
        except Exception as e:
            print(f"Error during asset organization: {str(e)}")
            raise

if __name__ == "__main__":
    organizer = AssetOrganizer()
    organizer.run()