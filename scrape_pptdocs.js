const axios = require('axios');
const fs = require('fs');

const ACTOR_ID = 'm0INTJJS7muTy2sXX';
const API_TOKEN = 'zWOhKZpwXTQYqtbwdyEyFOQIo0aOiY154gLN';
const URL = 'https://gitbrent.github.io/PptxGenJS/';

async function scrapeDocs() {
  try {
    console.log('Starting Apify actor run...');
    const startRun = await axios.post(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs?token=${API_TOKEN}`, {
      startUrls: [{ url: URL }]
    });

    const runId = startRun.data.id;
    console.log(`Run started with ID: ${runId}`);

    // Poll for completion
    let runStatus;
    while (true) {
      runStatus = await axios.get(`https://api.apify.com/v2/acts/${ACTOR_ID}/runs/${runId}?token=${API_TOKEN}`);
      const status = runStatus.data.status;
      console.log(`Run status: ${status}`);
      if (status === 'SUCCEEDED') {
        break;
      } else if (status === 'FAILED' || status === 'ABORTED') {
        console.error('Actor run failed');
        return;
      }
      // Wait 5 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log('Actor run succeeded, fetching dataset...');
    const datasetId = runStatus.data.defaultDatasetId;
    const itemsResponse = await axios.get(`https://api.apify.com/v2/datasets/${datasetId}/items?format=json&token=${API_TOKEN}`);

    const items = itemsResponse.data;
    let content = '';
    items.forEach(item => {
      if (item.text) {
        content += item.text + '\n';
      } else if (item.content) {
        content += item.content + '\n';
      } else {
        // Fallback to entire item
        content += JSON.stringify(item, null, 2) + '\n';
      }
    });

    fs.writeFileSync('pptxgenjs_docs.txt', content);
    console.log('Docs saved to pptxgenjs_docs.txt');

  } catch (error) {
    console.error('Error scraping docs:', error.message);
  }
}

scrapeDocs();
