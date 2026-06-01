const fs = require('fs');
const https = require('https');
const path = require('path');

const filePath = path.join(__dirname, '../src/videos_data.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Simple regex to extract subtopics and urls
const regex = /"subtopic_\d_\d":\s*\{[\s\S]*?"youtube_url":\s*"(https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+))"/g;
const urls = [];
let match;
while ((match = regex.exec(fileContent)) !== null) {
  urls.push({
    key: match[0].split(':')[0].replace(/["\s]/g, ''),
    url: match[1],
    id: match[2]
  });
}

async function checkoEmbed(url) {
  const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
  return new Promise((resolve) => {
    https.get(oembedUrl, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            resolve({ valid: true, title: json.title, author: json.author_name });
          } catch (e) {
            resolve({ valid: false, error: 'JSON Parse Error' });
          }
        } else {
          resolve({ valid: false, statusCode: res.statusCode });
        }
      });
    }).on('error', (err) => {
      resolve({ valid: false, error: err.message });
    });
  });
}

async function run() {
  console.log(`Checking ${urls.length} subtopics...`);
  for (const item of urls) {
    const result = await checkoEmbed(item.url);
    if (result.valid) {
      console.log(`✓ ${item.key}: VALID - "${result.title}" by ${result.author} (ID: ${item.id})`);
    } else {
      console.log(`❌ ${item.key}: INVALID (Status Code: ${result.statusCode || 'N/A'}, Error: ${result.error || 'Video not found'}) (URL: ${item.url})`);
    }
  }
}

run();
