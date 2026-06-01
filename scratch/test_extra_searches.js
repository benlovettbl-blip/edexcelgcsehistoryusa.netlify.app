const https = require('https');

const queries = [
  'Martin Luther King waving 1963',
  'Martin Luther King Jr. waving to crowd 1963',
  'Martin Luther King waving Washington 1963',
  'Rosa Parks bus sitting 1956',
  'Rosa Parks Montgomery bus sitting'
];

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'GCSEHistoryApp/1.0 (benlovett.bl@gmail.com) Node.js/16'
      }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  for (const q of queries) {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=15&format=json`;
    const res = await getJSON(searchUrl);
    const results = res.query && res.query.search;
    if (results && results.length > 0) {
      const imageResult = results.find(r => {
        const title = r.title.toLowerCase();
        return title.endsWith('.jpg') || title.endsWith('.jpeg') || title.endsWith('.png');
      });
      if (imageResult) {
        console.log(`Query: "${q}" -> File: "${imageResult.title}"`);
      } else {
        console.log(`Query: "${q}" -> No JPEGs found (first: "${results[0].title}")`);
      }
    } else {
      console.log(`Query: "${q}" -> NOT FOUND`);
    }
  }
}

run();
