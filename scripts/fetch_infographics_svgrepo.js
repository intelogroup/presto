#!/usr/bin/env node
/**
 * Fetch Infographics SVGs from SVGRepo (Public Domain/CC0 collections)
 * Target collection: https://www.svgrepo.com/collection/infographic/
 *
 * Strategy:
 * - Crawl the "infographic" collection index pages (pagination: ?page=2,3,...)
 * - Extract icon detail page links (/svg/ID/name)
 * - On each icon page, find the "Download SVG" link (/download/ID/name.svg or similar)
 * - Download direct SVG into assets-images/infographics/svgrepo
 *
 * Notes:
 * - SVGRepo hosts many CC0/public-domain assets. Always store the license in metadata when available.
 * - This script is polite (rate limits), deduplicates, and has basic error handling.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE = 'https://www.svgrepo.com';
// Expanded keywords for comprehensive infographic collection
const KEYWORDS = [
  'medical',
  'world',
  'environment',
  'health',
  'education',
  'art',
  'music',
  'sports',
  'gaming',
  'entertainment'
];

function categoryUrl(keyword, page) {
  const base = `${BASE}/vectors/${encodeURIComponent(keyword)}/`;
  return page === 1 ? base : `${base}?page=${page}`;
}

const OUTPUT_BASE = path.join(__dirname, '..', 'assets-images', 'svgrepo-random');
const CATALOG_FILE = path.join(OUTPUT_BASE, 'catalog.json');

// CLI args
const args = process.argv.slice(2);
const pagesArgIdx = args.indexOf('--pages');
const limitArgIdx = args.indexOf('--limit');

const MAX_PAGES = pagesArgIdx !== -1 && args[pagesArgIdx + 1] ? parseInt(args[pagesArgIdx + 1], 10) : 1;
const MAX_SVGS = limitArgIdx !== -1 && args[limitArgIdx + 1] ? parseInt(args[limitArgIdx + 1], 10) : 20;
const DELAY_MS = 300; // politeness delay per request (optimized for bulk fetching)

if (!fs.existsSync(OUTPUT_BASE)) {
  fs.mkdirSync(OUTPUT_BASE, { recursive: true });
}

function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function fetch(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Presto-Firecrawl-Fallback/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // handle redirects
          const location = res.headers.location.startsWith('http')
            ? res.headers.location
            : BASE + res.headers.location;
          res.resume();
          resolve(fetch(location));
          return;
        }

        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        }

        let data = '';
        res.setEncoding('utf8');
        res.on('data', chunk => (data += chunk));
        res.on('end', () => resolve(data));
      }
    );
    req.on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https
      .get(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Presto-Firecrawl-Fallback/1.0)',
            'Accept': 'image/svg+xml,*/*;q=0.8',
            'Referer': BASE,
          },
        },
        (res) => {
          if (res.statusCode === 200) {
            res.pipe(file);
            file.on('finish', () => {
              file.close(() => resolve(true));
            });
          } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            // Redirect to signed URL, follow once
            res.resume();
            downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
          } else {
            res.resume();
            fs.unlink(destPath, () => {});
            reject(new Error(`HTTP ${res.statusCode} for ${url}`));
          }
        }
      )
      .on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
  });
}

function unique(arr) {
  return Array.from(new Set(arr));
}

// Extract icon detail links from collection page HTML
function extractIconLinks(html) {
  // Match typical icon detail URLs like /svg/xxxx/name or similar
  const regex = /href="(\/svg\/[0-9]+\/[a-z0-9\-]+)"/gi;
  const links = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    links.push(m[1]);
  }
  return unique(links);
}

// Extract download link from icon detail page HTML
function extractDownloadLink(html) {
  // Prefer direct download anchor containing "/download/" and ending in ".svg"
  // e.g., href="/download/12345/name.svg"
  const regex = /href="(\/download\/[0-9]+\/[a-z0-9\-]+\.svg[^"]*)"/gi;
  const matches = [];
  let m;
  while ((m = regex.exec(html)) !== null) {
    matches.push(m[1]);
  }
  // SVGRepo pages often have multiple sizes; pick the first
  return matches.length ? matches[0] : null;
}

async function main() {
  console.log(`\n📚 Fetching SVG infographics from SVGRepo collection (${MAX_PAGES} pages, up to ${MAX_SVGS} files)...`);

  const allIconLinks = [];
  for (const kw of KEYWORDS) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const url = categoryUrl(kw, page);
      try {
        console.log(`🔎 Keyword "${kw}" page ${page}: ${url}`);
        const html = await fetch(url);
        const links = extractIconLinks(html);
        console.log(`  • Found ${links.length} icon detail links for "${kw}"`);
        allIconLinks.push(...links);
      } catch (e) {
        console.warn(`  ⚠️ Failed to fetch "${kw}" page ${page}: ${e.message}`);
      }
      await sleep(DELAY_MS);
    }
  }

  const detailLinks = unique(allIconLinks).slice(0, MAX_SVGS * 3); // collect more detail links than needed (some may not have SVG)
  console.log(`\n🔗 Total unique icon pages to consider: ${detailLinks.length}`);

  // Load or init catalog
  let catalog = { source: 'svgrepo', collection: 'infographic', downloaded: [] };
  if (fs.existsSync(CATALOG_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(CATALOG_FILE, 'utf8'));
      catalog = existing;
      if (!Array.isArray(catalog.downloaded)) catalog.downloaded = [];
    } catch {}
  }

  let success = 0;
  let attempted = 0;
  const already = new Set(catalog.downloaded.map((x) => x.filename));

  for (const rel of detailLinks) {
    if (success >= MAX_SVGS) break;

    const detailUrl = BASE + rel;
    attempted++;
    try {
      const html = await fetch(detailUrl);
      const downloadRel = extractDownloadLink(html);
      if (!downloadRel) {
        console.log(`  • No direct SVG download found: ${detailUrl}`);
        await sleep(DELAY_MS);
        continue;
      }
      const downloadUrl = downloadRel.startsWith('http') ? downloadRel : BASE + downloadRel;

      // Derive filename from URL
      const filePart = decodeURIComponent(downloadUrl.split('/').pop().split('?')[0]);
      const safeName = filePart.replace(/[^a-z0-9\.\-\_]/gi, '_');
      const outPath = path.join(OUTPUT_BASE, safeName);

      if (already.has(safeName) || fs.existsSync(outPath)) {
        console.log(`  • Skipping existing: ${safeName}`);
        await sleep(DELAY_MS);
        continue;
      }

      await downloadFile(downloadUrl, outPath);
      success++;
      console.log(`✅ Saved: ${safeName}`);

      catalog.downloaded.push({
        filename: safeName,
        url: downloadUrl,
        iconPage: detailUrl,
        license: 'Check item page; many on SVGRepo are CC0/Public Domain',
        source: 'svgrepo',
        collection: 'infographic',
        downloadedAt: new Date().toISOString(),
      });

      // Periodically write catalog
      if (success % 10 === 0) {
        fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));
      }
    } catch (e) {
      console.warn(`  ⚠️ Failed to download from ${detailUrl}: ${e.message}`);
    }
    await sleep(DELAY_MS);
  }

  fs.writeFileSync(CATALOG_FILE, JSON.stringify(catalog, null, 2));
  console.log(`\n🎉 Done. Downloaded ${success} SVG infographics to: ${OUTPUT_BASE}`);
}

main().catch((e) => {
  console.error('❌ Fatal error:', e);
  process.exit(1);
});
