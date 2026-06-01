const https = require('https');

const queries = [
  'Ho Chi Minh Trail HoTrial001',
  'Lyndon Johnson signing Civil Rights Act July 2 1964',
  'Civil rights march on washington reflecting pool',
  'Martin Luther King Jr waving to crowds 1963',
  'Rosa Parks bus 1956',
  'Little Rock Nine',
  'Freedom Riders bus burning 1961',
  'Birmingham campaign 1963 dogs',
  'Tommie Smith and John Carlos 1968 Olympics'
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
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&format=json`;
    const res = await getJSON(searchUrl);
    const results = res.query && res.query.search;
    if (results && results.length > 0) {
      const title = results[0].title;
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
      const infoRes = await getJSON(infoUrl);
      const pages = infoRes.query.pages;
      const pageKey = Object.keys(pages)[0];
      const imgUrl = pages[pageKey].imageinfo[0].url;
      console.log(`Query: "${q}" -> File: "${title}" -> URL: "${imgUrl}"`);
    } else {
      console.log(`Query: "${q}" -> NOT FOUND`);
    }
  }
}

run();
