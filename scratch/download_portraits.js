const fs = require('fs');
const path = require('path');
const https = require('https');

const PORTRAITS = [
  { key: 'eisenhower', search: 'Dwight D. Eisenhower official portrait', keyword: 'Eisenhower' },
  { key: 'kennedy', search: 'John F. Kennedy official portrait', keyword: 'Kennedy' },
  { key: 'johnson', search: 'Lyndon B. Johnson official portrait 1964', keyword: 'Johnson' },
  { key: 'nixon', search: 'Richard Nixon presidential portrait', keyword: 'Nixon' },
  { key: 'mlk', search: 'Martin Luther King Jr portrait', keyword: 'King' },
  { key: 'malcolm_x', search: 'Malcolm X portrait', keyword: 'Malcolm' },
  { key: 'diem', search: 'Ngo Dinh Diem portrait', keyword: 'Diem' },
  { key: 'rosa_parks', search: 'Rosa Parks portrait', keyword: 'Parks' },
  { key: 'james_meredith', search: 'James Meredith 1962', keyword: 'Meredith' },
  { key: 'earl_warren', search: 'Earl Warren Chief Justice portrait', keyword: 'Warren' },
  { key: 'westmoreland', search: 'General William Westmoreland portrait', keyword: 'Westmoreland' },
  { key: 'kissinger', search: 'Henry Kissinger portrait', keyword: 'Kissinger' },
  { key: 'ho_chi_minh', search: 'Ho Chi Minh portrait', keyword: 'Minh' }
];

const destDirs = [
  'public/assets/sources/portraits',
  'assets/sources/portraits',
  'dist/assets/sources/portraits'
];

// Ensure directories exist
destDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'AntigravityHistoryQuizApp/1.0 (fives@gmail.com) Node.js/16'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to load JSON. Status code: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const options = {
      headers: {
        'User-Agent': 'AntigravityHistoryQuizApp/1.0 (fives@gmail.com) Node.js/16'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP status ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function searchFile(query, keyword) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=15&format=json`;
  const searchRes = await getJSON(searchUrl);
  const results = searchRes.query && searchRes.query.search;
  if (results && results.length > 0) {
    // Find the first result containing the target keyword
    const match = results.find(r => {
      const t = r.title.toLowerCase();
      const isImg = t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png');
      const hasKeyword = t.includes(keyword.toLowerCase());
      return isImg && hasKeyword;
    });
    if (match) return match.title;
  }
  return null;
}

async function resolveTitleUrl(title) {
  const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&format=json`;
  const infoRes = await getJSON(infoUrl);
  const pages = infoRes.query && infoRes.query.pages;
  if (pages) {
    const pageKey = Object.keys(pages)[0];
    const page = pages[pageKey];
    if (page && page.imageinfo && page.imageinfo[0]) {
      return page.imageinfo[0].url;
    }
  }
  return null;
}

async function run() {
  console.log(`Starting filtered search and download of ${PORTRAITS.length} key figure portraits...`);
  let successCount = 0;
  
  for (const item of PORTRAITS) {
    console.log(`Searching for: ${item.key} ("${item.search}") with validation keyword "${item.keyword}"...`);
    try {
      const title = await searchFile(item.search, item.keyword);
      if (!title) {
        console.warn(`  No matching file containing "${item.keyword}" was found.`);
        continue;
      }
      console.log(`  Found matching file: "${title}"`);
      const url = await resolveTitleUrl(title);
      if (!url) {
        console.warn(`  Could not resolve URL for: "${title}"`);
        continue;
      }
      console.log(`  Downloading from: ${url}`);
      
      // Download to all directories
      for (const dir of destDirs) {
        const destPath = path.join(dir, `${item.key}.jpg`);
        await downloadFile(url, destPath);
      }
      console.log(`  Successfully saved portrait for: ${item.key}`);
      successCount++;
      
      // Wait 300ms to be nice
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.error(`  Error processing ${item.key}:`, err.message);
    }
  }
  console.log(`Portrait download complete! Success: ${successCount}/${PORTRAITS.length}`);
}

run();
