const fs = require('fs');
const https = require('https');
const path = require('path');

async function checkUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = '';
      let resolved = false;
      res.on('data', (chunk) => {
        data += chunk;
        if (data.length > 30000 && !resolved) {
          resolved = true;
          const isUnavailable = data.includes('Video unavailable') || data.includes('unplayable') || res.statusCode === 404;
          resolve({ statusCode: res.statusCode, isUnavailable });
          res.destroy();
        }
      });
      res.on('end', () => {
        if (!resolved) {
          resolved = true;
          const isUnavailable = data.includes('Video unavailable') || data.includes('unplayable') || res.statusCode === 404;
          resolve({ statusCode: res.statusCode, isUnavailable });
        }
      });
    });
    req.on('error', (err) => {
      resolve({ error: err.message });
    });
  });
}

async function run() {
  const filePath = path.join(__dirname, '../src/videos_data.js');
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const blockRegex = /"subtopic_\d_\d":\s*\{[\s\S]*?\}/g;
  const blocks = content.match(blockRegex) || [];
  
  const urls = [];
  for (const block of blocks) {
    const idMatch = block.match(/"(subtopic_\d_\d)"/);
    const urlMatch = block.match(/"youtube_url":\s*"(.*?)"/);
    
    if (idMatch && urlMatch) {
      const subtopicId = idMatch[1];
      const url = urlMatch[1];
      urls.push({ subtopicId, url });
    }
  }

  console.log("Checking video URLs...");
  for (const item of urls) {
    const result = await checkUrl(item.url);
    if (result.error) {
      console.log(`❌ ${item.subtopicId}: Connection error: ${result.error}`);
    } else if (result.isUnavailable) {
      console.log(`❌ ${item.subtopicId}: Video is unavailable or 404 (URL: ${item.url})`);
    } else {
      console.log(`✓ ${item.subtopicId}: OK (URL: ${item.url})`);
    }
  }
}

run();
