import requests
import os
import json
import zipfile
import shutil
from pathlib import Path
import time

class IconFetcher:
    def __init__(self):
        self.assets_dir = "assets-icons"
        self.temp_dir = "temp_icons"
        
        # Ensure directories exist
        os.makedirs(self.assets_dir, exist_ok=True)
        os.makedirs(self.temp_dir, exist_ok=True)
        
        # Create subdirectories for each icon library
        self.lucide_dir = os.path.join(self.assets_dir, "lucide")
        self.fontawesome_dir = os.path.join(self.assets_dir, "fontawesome")
        self.heroicons_dir = os.path.join(self.assets_dir, "heroicons")
        
        os.makedirs(self.lucide_dir, exist_ok=True)
        os.makedirs(self.fontawesome_dir, exist_ok=True)
        os.makedirs(self.heroicons_dir, exist_ok=True)
    
    def fetch_lucide_icons(self):
        """
        Fetch Lucide icons from GitHub repository
        """
        print("Fetching Lucide icons...")
        
        # Lucide icons GitHub repository
        lucide_url = "https://api.github.com/repos/lucide-icons/lucide/contents/icons"
        
        try:
            response = requests.get(lucide_url)
            response.raise_for_status()
            
            icons_data = response.json()
            downloaded_icons = []
            
            for icon in icons_data:
                if icon['type'] == 'file' and icon['name'].endswith('.svg'):
                    icon_name = icon['name'].replace('.svg', '')

                    # Download the SVG file
                    svg_response = requests.get(icon['download_url'])
                    svg_response.raise_for_status()

                    filepath = os.path.join(self.lucide_dir, icon['name'])
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(svg_response.text)

                    downloaded_icons.append({
                        'name': icon_name,
                        'filename': icon['name'],
                        'filepath': filepath,
                        'library': 'lucide'
                    })

                    print(f"Downloaded Lucide icon: {icon['name']}")
                    time.sleep(0.2)  # Rate limiting
            
            return downloaded_icons
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Lucide icons: {e}")
            return []
    
    def fetch_heroicons(self):
        """
        Fetch Heroicons from GitHub repository
        """
        print("\nFetching Heroicons...")
        
        # Heroicons GitHub repository (outline icons)
        heroicons_url = "https://api.github.com/repos/tailwindlabs/heroicons/contents/src/24/outline"
        
        try:
            response = requests.get(heroicons_url)
            response.raise_for_status()
            
            icons_data = response.json()
            downloaded_icons = []
            
            # Focus on discussion/presentation related icons
            relevant_icons = [
                "presentation-chart-bar", "presentation-chart-line",
                "chart-bar", "chart-pie", "users", "user-group",
                "chat-bubble-left", "chat-bubble-left-right",
                "light-bulb", "target", "arrow-trending-up",
                "check-circle", "x-circle", "exclamation-circle",
                "information-circle", "arrow-right", "arrow-left",
                "play", "pause", "stop", "arrow-path",
                "eye", "magnifying-glass", "funnel", "cog-6-tooth",
                "server-stack", "circle-stack", "cloud", "code-bracket", "cpu-chip", "chart-bar-square",
                "briefcase", "trophy", "clipboard-document-list", "folder"
            ]
            
            for icon in icons_data:
                if icon['type'] == 'file' and icon['name'].endswith('.svg'):
                    icon_name = icon['name'].replace('.svg', '')
                    
                    if icon_name in relevant_icons:
                        # Download the SVG file
                        svg_response = requests.get(icon['download_url'])
                        svg_response.raise_for_status()
                        
                        filepath = os.path.join(self.heroicons_dir, icon['name'])
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(svg_response.text)
                        
                        downloaded_icons.append({
                            'name': icon_name,
                            'filename': icon['name'],
                            'filepath': filepath,
                            'library': 'heroicons'
                        })
                        
                        print(f"Downloaded Heroicon: {icon['name']}")
                        time.sleep(0.1)  # Rate limiting
            
            return downloaded_icons
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching Heroicons: {e}")
            return []
    
    def create_fontawesome_placeholders(self):
        """
        Create placeholder files for FontAwesome icons
        Note: FontAwesome requires a license for automated downloading
        """
        print("\nCreating FontAwesome placeholders...")
        
        # Common FontAwesome icons for presentations
        fa_icons = [
            "chart-bar", "chart-line", "chart-pie", "chart-area",
            "users", "user-check", "comments", "comment",
            "lightbulb", "bullseye", "arrow-trend-up", "arrow-trend-down",
            "check-circle", "times-circle", "exclamation-circle", "info-circle",
            "arrow-right", "arrow-left", "arrow-up", "arrow-down",
            "play", "pause", "stop", "sync",
            "eye", "search", "filter", "cog"
        ]
        
        placeholders = []
        
        for icon_name in fa_icons:
            # Create a simple SVG placeholder
            svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
  <!-- FontAwesome {icon_name} placeholder -->
  <rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
  <text x="12" y="16" text-anchor="middle" font-size="8" fill="currentColor">FA</text>
</svg>'''
            
            filename = f"{icon_name}.svg"
            filepath = os.path.join(self.fontawesome_dir, filename)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(svg_content)
            
            placeholders.append({
                'name': icon_name,
                'filename': filename,
                'filepath': filepath,
                'library': 'fontawesome',
                'note': 'placeholder - replace with actual FontAwesome icons'
            })
        
        print(f"Created {len(placeholders)} FontAwesome placeholders")
        return placeholders
    
    def create_icon_catalog(self, all_icons):
        """
        Create a catalog of all downloaded icons
        """
        catalog = {
            'total_icons': len(all_icons),
            'libraries': {
                'lucide': len([i for i in all_icons if i['library'] == 'lucide']),
                'heroicons': len([i for i in all_icons if i['library'] == 'heroicons']),
                'fontawesome': len([i for i in all_icons if i['library'] == 'fontawesome'])
            },
            'icons': all_icons
        }
        
        catalog_file = os.path.join(self.assets_dir, "icon_catalog.json")
        with open(catalog_file, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, indent=2, ensure_ascii=False)
        
        print(f"\nIcon catalog saved to: {catalog_file}")
        return catalog
    
    def cleanup(self):
        """
        Clean up temporary files
        """
        if os.path.exists(self.temp_dir):
            shutil.rmtree(self.temp_dir)

def main():
    print("Icon Fetcher for Discussion Slide Assets")
    print("=" * 50)
    
    fetcher = IconFetcher()
    all_icons = []
    
    try:
        # Fetch Lucide icons
        lucide_icons = fetcher.fetch_lucide_icons()
        all_icons.extend(lucide_icons)
        
        # Fetch Heroicons
        heroicons = fetcher.fetch_heroicons()
        all_icons.extend(heroicons)
        
        # Create FontAwesome placeholders
        fa_placeholders = fetcher.create_fontawesome_placeholders()
        all_icons.extend(fa_placeholders)
        
        # Create catalog
        catalog = fetcher.create_icon_catalog(all_icons)
        
        print(f"\n✅ Icon fetching completed!")
        print(f"Total icons: {catalog['total_icons']}")
        print(f"  - Lucide: {catalog['libraries']['lucide']}")
        print(f"  - Heroicons: {catalog['libraries']['heroicons']}")
        print(f"  - FontAwesome (placeholders): {catalog['libraries']['fontawesome']}")
        
        print("\n📝 Notes:")
        print("  - All icons are in SVG format")
        print("  - FontAwesome icons are placeholders (license required for actual icons)")
        print("  - Icons are organized in subdirectories by library")
        
    except Exception as e:
        print(f"\n❌ Error during icon fetching: {e}")
    
    finally:
        fetcher.cleanup()

if __name__ == "__main__":
    main()