const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'sources');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const TASKS = [
  { filename: 'ho-chi-minh-trail-bicycles.jpg', query: 'File:HoTrial001.jpg' },
  { filename: 'lbj-mlk-signing-1964.jpg', query: 'File:Lyndon Johnson signing Civil Rights Act, July 2, 1964.jpg' },
  { filename: 'march-on-washington-crowd.jpg', query: 'File:March on Washington - Reflecting Pool.jpg' },
  { filename: 'mlk-waving-washington-1963.jpg', query: 'File:Martin Luther King Jr. waving to crowds 1963.jpg' }, // try direct exact title
  { filename: 'rosa-parks-bus-1956.jpg', query: 'File:Rosa Parks 1956.jpg' },
  { filename: 'little-rock-nine-1957.jpg', query: 'File:Little Rock Nine (4384366585).jpg' },
  { filename: 'freedom-riders-bus-1961.jpg', query: 'File:Greyhound Bus Attack Anniston 5.jpg' },
  { filename: 'birmingham-protests-dogs-1963.jpg', query: 'File:Walter Gadsden attacked by dogs.jpg' },
  { filename: 'olympics-black-power-1968.jpg', query: 'File:John Carlos, Tommie Smith, Peter Norman 1968cr.jpg' }
];

// Fallback search terms if the exact file title above is not resolved by imageinfo
const SEARCH_FALLBACKS = {
  'mlk-waving-washington-1963.jpg': 'Martin Luther King Jr. waving to crowd 1963',
  'little-rock-nine-1957.jpg': 'Little Rock Nine integration 1957',
  'freedom-riders-bus-1961.jpg': 'Freedom Riders bus burning Anniston 1961'
};

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'GCSEHistoryApp/2.0 (benlovett.bl@gmail.com) Node.js/16'
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

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const options = {
      headers: {
        'User-Agent': 'GCSEHistoryApp/2.0 (benlovett.bl@gmail.com) Node.js/16'
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

async function searchFile(query) {
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=10&format=json`;
  const searchRes = await getJSON(searchUrl);
  const results = searchRes.query && searchRes.query.search;
  if (results && results.length > 0) {
    // Find first standard image format
    const imgResult = results.find(r => {
      const t = r.title.toLowerCase();
      return t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png');
    });
    if (imgResult) return imgResult.title;
  }
  return null;
}

async function run() {
  console.log('Downloading high-quality visual sources...');
  for (const task of TASKS) {
    const destPath = path.join(ASSETS_DIR, task.filename);
    console.log(`Processing: ${task.filename}...`);
    
    let resolvedUrl = null;
    try {
      resolvedUrl = await resolveTitleUrl(task.query);
    } catch (e) {
      console.log(`  Direct resolution failed for ${task.query}: ${e.message}`);
    }
    
    if (!resolvedUrl) {
      const fallbackQuery = SEARCH_FALLBACKS[task.filename] || task.filename.replace(/-/g, ' ').replace('.jpg', '');
      console.log(`  Trying search fallback for "${task.filename}" with query "${fallbackQuery}"...`);
      try {
        const title = await searchFile(fallbackQuery);
        if (title) {
          resolvedUrl = await resolveTitleUrl(title);
          console.log(`  Resolved URL from search title "${title}"`);
        }
      } catch (e) {
        console.error(`  Search fallback failed: ${e.message}`);
      }
    }
    
    if (resolvedUrl) {
      console.log(`  Downloading from: ${resolvedUrl}`);
      try {
        // Sleep for 300ms to be nice to Wikimedia API
        await new Promise(r => setTimeout(r, 300));
        await downloadFile(resolvedUrl, destPath);
        
        const stats = fs.statSync(destPath);
        if (stats.size < 1000) {
          throw new Error(`Downloaded file size is too small (${stats.size} bytes)`);
        }
        console.log(`  Successfully downloaded ${task.filename} (${(stats.size/1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  Error downloading ${task.filename}:`, err.message);
      }
    } else {
      console.error(`  Could not find any URL for ${task.filename}`);
    }
  }
  console.log('Finished downloading all visual sources!');
}

run();
