import requests
import os
import json
from urllib.parse import urlparse
import time

def fetch_pexels_images():
    # Use free Pexels images without API key
    print("📸 Fetching free laboratory images from Pexels...")
    
    # Create assets-images directory
    images_dir = 'assets-images'
    os.makedirs(images_dir, exist_ok=True)
    
    # Free Pexels image URLs (no API key required)
    free_images = [
        {
            'url': 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'laboratory_glassware_1.jpg',
            'description': 'Laboratory glassware with colorful liquids'
        },
        {
            'url': 'https://images.pexels.com/photos/3735747/pexels-photo-3735747.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'test_tubes_chemistry.jpg',
            'description': 'Test tubes with chemical solutions'
        },
        {
            'url': 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'laboratory_equipment.jpg',
            'description': 'Scientific laboratory equipment'
        },
        {
            'url': 'https://images.pexels.com/photos/3735780/pexels-photo-3735780.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'beakers_chemistry.jpg',
            'description': 'Chemistry beakers and flasks'
        },
        {
            'url': 'https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'scientific_research.jpg',
            'description': 'Scientific research laboratory'
        },
        {
            'url': 'https://images.pexels.com/photos/3735746/pexels-photo-3735746.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'lab_experiment.jpg',
            'description': 'Laboratory experiment setup'
        },
        {
            'url': 'https://images.pexels.com/photos/2280570/pexels-photo-2280570.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'microscope_science.jpg',
            'description': 'Scientific microscope'
        },
        {
            'url': 'https://images.pexels.com/photos/3735744/pexels-photo-3735744.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'petri_dish_bacteria.jpg',
            'description': 'Petri dish with bacterial cultures'
        },
        {
            'url': 'https://images.pexels.com/photos/2280567/pexels-photo-2280567.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'chemical_reaction.jpg',
            'description': 'Chemical reaction in progress'
        },
        {
            'url': 'https://images.pexels.com/photos/3735748/pexels-photo-3735748.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'molecular_structure.jpg',
            'description': 'Molecular structure model'
        },
        {
            'url': 'https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'technology_development.jpg',
            'description': 'Woman in black long sleeve shirt using a laptop'
        },
        {
            'url': 'https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'data_analysis.jpg',
            'description': 'Person using a laptop for data analysis'
        },
        {
            'url': 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'software_engineering.jpg',
            'description': 'Woman in white long sleeve shirt programming'
        },
        {
            'url': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'research_and_development.jpg',
            'description': 'Woman in black long sleeve shirt holding a pen, doing research'
        },
        {
            'url': 'https://images.pexels.com/photos/572056/pexels-photo-572056.jpeg?auto=compress&cs=tinysrgb&w=800',
            'filename': 'project_management.jpg',
            'description': 'Man in black jacket using a laptop for project management'
        }
    ]
    
    downloaded_images = []
    
    for i, image_info in enumerate(free_images):
        try:
            print(f"🔍 Downloading: {image_info['description']}")
            
            # Download image
            response = requests.get(image_info['url'], timeout=30)
            response.raise_for_status()
            
            filepath = os.path.join(images_dir, image_info['filename'])
            
            with open(filepath, 'wb') as f:
                f.write(response.content)
            
            downloaded_images.append({
                'filename': image_info['filename'],
                'description': image_info['description'],
                'source': 'Pexels (Free)',
                'url': image_info['url']
            })
            
            print(f"   ✅ Downloaded: {image_info['filename']}")
            
        except Exception as e:
            print(f"   ❌ Failed to download {image_info['filename']}: {e}")
    
    # Save metadata
    metadata_file = os.path.join(images_dir, 'images_metadata.json')
    with open(metadata_file, 'w') as f:
        json.dump({
            'total_images': len(downloaded_images),
            'images': downloaded_images,
            'source': 'Pexels (Free Images)'
        }, f, indent=2)
    
    print(f"\n📸 Successfully downloaded {len(downloaded_images)} images to {images_dir}/")
    print(f"📋 Metadata saved to {metadata_file}")
    
    return downloaded_images

class PexelsImageFetcher:
    def __init__(self, api_key=None):
        # Deprecated - use fetch_pexels_images() function instead
        self.assets_dir = "assets-images"
        os.makedirs(self.assets_dir, exist_ok=True)
    
    def search_and_download_images(self, query, count=10, orientation="landscape"):
        """
        Deprecated - use fetch_pexels_images() function instead
        """
        print("This method is deprecated. Use fetch_pexels_images() function instead.")
        return []
    
    def fetch_discussion_assets(self):
        """
        Deprecated - use fetch_pexels_images() function instead
        """
        print("This method is deprecated. Use fetch_pexels_images() function instead.")
        return fetch_pexels_images()

def main():
    print("Pexels Image Fetcher for Discussion Slide Assets")
    print("=" * 50)
    
    # Fetch free images without API key
    downloads = fetch_pexels_images()
    
    if downloads:
        print("\n✅ Successfully downloaded images!")
        print("\nAttribution: All images from Pexels (Free to use)")
        for download in downloads[:3]:  # Show first 3 as examples
            print(f"  - {download['filename']}: {download['description']}")
    else:
        print("\n❌ No images were downloaded. Check your internet connection.")

if __name__ == "__main__":
    main()