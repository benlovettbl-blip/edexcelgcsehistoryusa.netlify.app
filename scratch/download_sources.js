const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'sources');

// Ensure directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Tasks mapping: local filename -> search query or exact file name on Wikimedia Commons
const DOWNLOAD_TASKS = [
  // Core Exam Photos
  {
    filename: 'ho-chi-minh-trail-bicycles.jpg',
    query: 'File:HoTrial001.jpg'
  },
  {
    filename: 'lbj-mlk-signing-1964.jpg',
    query: 'File:Lyndon_Johnson_signing_Civil_Rights_Act,_2_July,_1964.jpg'
  },
  {
    filename: 'march-on-washington-crowd.jpg',
    query: 'File:Civil rights march on washington.jpg'
  },
  {
    filename: 'mlk-waving-washington-1963.jpg',
    query: 'File:Martin Luther King Jr. waving to crowds 1963.jpg'
  },
  // Lesson Photos
  {
    filename: 'rosa-parks-bus-1956.jpg',
    query: 'File:Rosa Parks sitting on Montgomery bus 1956.jpg'
  },
  {
    filename: 'little-rock-nine-1957.jpg',
    query: 'File:Little Rock integration crisis 1957.jpg'
  },
  {
    filename: 'freedom-riders-bus-1961.jpg',
    query: 'File:Freedom Riders bus firebombed in Anniston Alabama 1961.jpg'
  },
  {
    filename: 'birmingham-protests-dogs-1963.jpg',
    query: 'File:Birmingham campaign police dogs 1963.jpg'
  },
  {
    filename: 'olympics-black-power-1968.jpg',
    query: 'File:Tommie Smith and John Carlos 1968 Olympics.jpg'
  }
];

// Helper to make HTTPS requests returning JSON
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
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Download file to disk
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const options = {
      headers: {
        'User-Agent': 'GCSEHistoryApp/1.0 (benlovett.bl@gmail.com) Node.js/16'
      }
    };
    https.get(url, options, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Handle redirect
        downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
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

// Search file on Wikimedia Commons and get direct URL
async function getDirectUrl(task) {
  try {
    let title = task.query;
    
    // If query is not a direct file link, perform a search first
    if (!title.startsWith('File:')) {
      const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(task.query)}&srnamespace=6&format=json`;
      const searchRes = await getJSON(searchUrl);
      const results = searchRes.query && searchRes.query.search;
      if (results && results.length > 0) {
        title = results[0].title;
        console.log(`Found file title "${title}" for query "${task.query}"`);
      } else {
        console.log(`No search results found for query "${task.query}". Trying direct File title...`);
        title = 'File:' + task.query;
      }
    }

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
  } catch (e) {
    console.error(`Error resolving URL for ${task.filename}:`, e.message);
  }
  return null;
}

// Fallback direct links in case search or API fails
const FALLBACK_URLS = {
  'ho-chi-minh-trail-bicycles.jpg': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/HoTrial001.jpg',
  'lbj-mlk-signing-1964.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Lyndon_Johnson_signing_Civil_Rights_Act%2C_2_July%2C_1964.jpg',
  'march-on-washington-crowd.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Civil_rights_march_on_washington.jpg',
  'mlk-waving-washington-1963.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Martin_Luther_King_Jr_waving_to_crowds_1963.jpg',
  'rosa-parks-bus-1956.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Rosa_Parks_Montgomery_Bus_Boycott_1955.jpg',
  'little-rock-nine-1957.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Little_Rock_Nine_at_Central_High_School.jpg',
  'freedom-riders-bus-1961.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Freedom_Riders_bus_burning.jpg',
  'birmingham-protests-dogs-1963.jpg': 'https://upload.wikimedia.org/wikipedia/commons/6/69/Birmingham_campaign_dogs_1963.jpg',
  'olympics-black-power-1968.jpg': 'https://upload.wikimedia.org/wikipedia/commons/f/fe/John_Carlos%2C_Tommie_Smith%2C_Peter_Norman_1968_Olympics.jpg'
};

async function run() {
  console.log('Starting Sourcing and Downloading of Visual Assets...');
  for (const task of DOWNLOAD_TASKS) {
    const destPath = path.join(ASSETS_DIR, task.filename);
    let directUrl = await getDirectUrl(task);
    
    if (!directUrl) {
      console.log(`Failed to resolve direct URL via API for ${task.filename}. Using fallback...`);
      directUrl = FALLBACK_URLS[task.filename];
    }
    
    if (directUrl) {
      console.log(`Downloading ${task.filename} from: ${directUrl}...`);
      try {
        await downloadFile(directUrl, destPath);
        console.log(`Successfully downloaded ${task.filename}`);
      } catch (err) {
        console.log(`Failed download for ${task.filename}: ${err.message}. Trying direct fallback...`);
        try {
          const fallback = FALLBACK_URLS[task.filename];
          if (fallback && fallback !== directUrl) {
            await downloadFile(fallback, destPath);
            console.log(`Successfully downloaded ${task.filename} via fallback`);
          } else {
            throw err;
          }
        } catch (fallbackErr) {
          console.error(`CRITICAL ERROR downloading ${task.filename}:`, fallbackErr.message);
        }
      }
    } else {
      console.error(`No URL found for ${task.filename}`);
    }
  }
  console.log('Finished visual assets download tasks!');
}

run();
