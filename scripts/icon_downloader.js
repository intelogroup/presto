const axios = require('axios');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'assets-images', 'svgrepo-random');
const MAX_ICONS = 20;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function searchIcons(query, page = 1) {
  try {
    const response = await axios.get(`https://svgrepo.com/api/search?query=${query}&page=${page}`);
    return response.data.vectors;
  } catch (error) {
    console.error('Error searching for icons:', error.message);
    return [];
  }
}

async function downloadIcon(icon) {
    try {
        const response = await axios.get(icon.download_url, { responseType: 'arraybuffer' });
        const fileName = path.basename(icon.download_url);
        const filePath = path.join(OUTPUT_DIR, fileName);
        fs.writeFileSync(filePath, response.data);
        console.log(`Downloaded: ${fileName}`);
    } catch (error) {
        console.error(`Error downloading icon ${icon.download_url}:`, error.message);
    }
}

async function main() {
  console.log(`Downloading ${MAX_ICONS} random icons from svgrepo.com...`);

  let icons = [];
  let page = 1;
  while (icons.length < MAX_ICONS) {
    const results = await searchIcons('icon', page);
    if (results.length === 0) {
      break;
    }
    icons = icons.concat(results);
    page++;
  }

  icons = icons.slice(0, MAX_ICONS);

  for (const icon of icons) {
    await downloadIcon(icon);
  }

  console.log('Download complete.');
}

main();