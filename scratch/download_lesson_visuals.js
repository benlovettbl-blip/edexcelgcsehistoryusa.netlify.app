const fs = require('fs');
const path = require('path');
const https = require('https');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'sources');

if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// 48 images tasks
const TASKS = [
  // 1.1
  { filename: 'warren-court-1954.jpg', query: 'File:Warren Court 1953.jpg', fallback: 'Warren Court 1954' },
  { filename: 'rosa-parks-fingerprint.jpg', query: 'File:Rosa Parks Fingerprint.jpg', fallback: 'Rosa Parks fingerprinted 1956' },
  { filename: 'colored-waiting-room-sign.jpg', query: 'File:Colored Waiting Room Sign.jpg', fallback: 'Colored Waiting Room sign segregation' },
  // 1.2
  { filename: 'eisenhower-little-rock-speech.jpg', query: 'File:Dwight D. Eisenhower - address on Little Rock integration.jpg', fallback: 'Eisenhower Little Rock address' },
  { filename: 'little-rock-protest-1957.jpg', query: 'File:Little Rock integration protest 1957.jpg', fallback: 'Little Rock integration protest 1957' },
  { filename: 'airborne-little-rock-patrol.jpg', query: 'File:101st Airborne at Little Rock.jpg', fallback: '101st Airborne Central High School' },
  // 1.3
  { filename: 'wpc-boycott-leaflet.jpg', query: 'File:Montgomery Bus Boycott flyer.jpg', fallback: 'Montgomery Improvement Association carpool' },
  { filename: 'mlk-boycott-speech-1955.jpg', query: 'File:Martin Luther King Jr Montgomery Bus Boycott.jpg', fallback: 'Martin Luther King Jr Montgomery Bus Boycott 1955' },
  { filename: 'carpool-station-1956.jpg', query: 'File:Montgomery Bus Boycott carpool station.jpg', fallback: 'Montgomery Bus Boycott carpool' },
  // 1.4
  { filename: 'southern-manifesto-signing.jpg', query: 'File:Strom Thurmond.jpg', fallback: 'Strom Thurmond Southern Manifesto' },
  { filename: 'white-citizens-council-billboard.jpg', query: 'File:White Citizens Council billboard.jpg', fallback: 'White Citizens Council billboard segregation' },
  { filename: 'kkk-march-washington-1926.jpg', query: 'File:Ku Klux Klan march in Washington 1926.jpg', fallback: 'Ku Klux Klan parade Washington 1926' },
  // 2.1
  { filename: 'freedom-riders-bus-wreckage.jpg', query: 'File:Freedom Riders bus burning.jpg', fallback: 'Freedom Riders bus Anniston 1961' },
  { filename: 'greensboro-sit-in-counter.jpg', query: 'File:Greensboro sit-in Woolworths.jpg', fallback: 'Greensboro sit-in counter 1960' },
  { filename: 'james-meredith-walking.jpg', query: 'File:James Meredith University of Mississippi.jpg', fallback: 'James Meredith escort Marshals 1962' },
  // 2.2
  { filename: 'selma-troopers-bridge.jpg', query: 'File:Selma state troopers.jpg', fallback: 'Edmund Pettus Bridge Selma troopers' },
  { filename: 'mlk-dream-speech-1963.jpg', query: 'File:Martin Luther King Jr. I Have a Dream.jpg', fallback: 'Martin Luther King Jr March on Washington speech' },
  { filename: 'lbj-signing-voting-rights-1965.jpg', query: 'File:Lyndon B. Johnson signing Voting Rights Act.jpg', fallback: 'LBJ signing Voting Rights Act 1965' },
  // 2.3
  { filename: 'malcolm-x-speaking.jpg', query: 'File:Malcolm X speaking.jpg', fallback: 'Malcolm X speech' },
  { filename: 'malcolm-x-newspaper.jpg', query: 'File:Malcolm X holding newspaper.jpg', fallback: 'Malcolm X holding newspaper' },
  { filename: 'black-panthers-marching.jpg', query: 'File:Black Panthers marching.jpg', fallback: 'Black Panther Party Oakland protest' },
  // 2.4
  { filename: 'poor-peoples-campaign-1968.jpg', query: 'File:Resurrection City 1968.jpg', fallback: 'Poor Peoples Campaign Resurrection City 1968' },
  { filename: 'detroit-riot-guard-1967.jpg', query: 'File:Detroit riot 1967 National Guard.jpg', fallback: 'Detroit riot 1967' },
  { filename: 'mourners-mlk-assassination.jpg', query: 'File:Mourners MLK assassination.jpg', fallback: 'MLK assassination protest Washington' },
  // 3.1
  { filename: 'diem-eisenhower-meeting.jpg', query: 'File:Ngo Dinh Diem and Eisenhower.jpg', fallback: 'Ngo Dinh Diem Eisenhower meeting' },
  { filename: 'ngo-dinh-diem-parade.jpg', query: 'File:Ngo Dinh Diem military parade.jpg', fallback: 'Ngo Dinh Diem Saigon parade' },
  { filename: 'buddhist-protests-1963.jpg', query: 'File:Thich Quang Duc self-immolation.jpg', fallback: 'Saigon Buddhist protests 1963' },
  // 3.2
  { filename: 'robert-mcnamara-briefing.jpg', query: 'File:Robert McNamara briefing.jpg', fallback: 'Robert McNamara Vietnam briefing' },
  { filename: 'uss-maddox.jpg', query: 'File:USS Maddox.jpg', fallback: 'USS Maddox Gulf of Tonkin' },
  { filename: 'marines-landing-danang.jpg', query: 'File:Marines landing at Da Nang.jpg', fallback: 'Marines Da Nang beach 1965' },
  // 3.3
  { filename: 'huey-helicopter-vietnam.jpg', query: 'File:Huey helicopter evacuation Vietnam.jpg', fallback: 'Huey helicopter Vietnam war' },
  { filename: 'us-soldier-patrolling-swamp.jpg', query: 'File:US soldier patrolling Vietnam.jpg', fallback: 'US troops patrolling swamp Vietnam' },
  { filename: 'agent-orange-spraying-c123.jpg', query: 'File:Agent Orange spraying.jpg', fallback: 'Operation Ranch Hand C-123 Agent Orange' },
  // 3.4
  { filename: 'arvn-troops-combat.jpg', query: 'File:ARVN troops in action.jpg', fallback: 'ARVN combat Vietnam war' },
  { filename: 'nixon-visiting-troops.jpg', query: 'File:Nixon visiting troops Vietnam.jpg', fallback: 'Nixon Vietnam troops 1969' },
  { filename: 'arvn-cambodia-invasion.jpg', query: 'File:ARVN troops in Cambodia 1970.jpg', fallback: 'ARVN Cambodia combat' },
  // 4.1
  { filename: 'vietnam-draft-lottery.jpg', query: 'File:Selective Service draft lottery.jpg', fallback: 'Vietnam draft lottery 1969' },
  { filename: 'antiwar-pentagon-protest-1967.jpg', query: 'File:Anti-war protest Pentagon 1967.jpg', fallback: 'anti-war march Washington 1967' },
  { filename: 'kent-state-protests-1970.jpg', query: 'File:Kent State shootings.jpg', fallback: 'Kent State protests 1970' },
  // 4.2
  { filename: 'nixon-television-address.jpg', query: 'File:Nixon address on Vietnam.jpg', fallback: 'Nixon Silent Majority speech' },
  { filename: 'pro-war-rally-nyc.jpg', query: 'File:Pro-war rally New York.jpg', fallback: 'pro-war protest Vietnam support' },
  { filename: 'hard-hat-riot-1970.jpg', query: 'File:Hard Hat Riot NYC.jpg', fallback: 'Hard Hat Riot 1970 NYC' },
  // 4.3
  { filename: 'kissinger-peace-talks.jpg', query: 'File:Henry Kissinger.jpg', fallback: 'Henry Kissinger Paris Peace Accords 1973' },
  { filename: 'paris-peace-accords-signing.jpg', query: 'File:Signing of Paris Peace Accords.jpg', fallback: 'Paris Peace Accords signing 1973' },
  { filename: 'saigon-embassy-evacuation.jpg', query: 'File:Saigon embassy evacuation.jpg', fallback: 'Saigon evacuation helicopter 1975' },
  // 4.4
  { filename: 'general-westmoreland.jpg', query: 'File:William Westmoreland.jpg', fallback: 'General William Westmoreland' },
  { filename: 'us-troops-bogged-down.jpg', query: 'File:US troops bogged down.jpg', fallback: 'Vietnam combat patrol swamp' },
  { filename: 'vvaw-veterans-protest.jpg', query: 'File:Vietnam Veterans Against the War protest.jpg', fallback: 'VVAW veterans protest Washington medals' }
];

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
    const imgResult = results.find(r => {
      const t = r.title.toLowerCase();
      return t.endsWith('.jpg') || t.endsWith('.jpeg') || t.endsWith('.png');
    });
    if (imgResult) return imgResult.title;
  }
  return null;
}

async function run() {
  console.log(`Starting download of ${TASKS.length} lesson visuals...`);
  let successCount = 0;
  
  for (let i = 0; i < TASKS.length; i++) {
    const task = TASKS[i];
    const destPath = path.join(ASSETS_DIR, task.filename);
    
    // Skip if already exists and is non-empty
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`[${i+1}/${TASKS.length}] Skipping existing: ${task.filename}`);
      successCount++;
      continue;
    }
    
    console.log(`[${i+1}/${TASKS.length}] Sourcing: ${task.filename}...`);
    let resolvedUrl = null;
    
    try {
      resolvedUrl = await resolveTitleUrl(task.query);
    } catch (e) {
      // Direct title fail
    }
    
    if (!resolvedUrl) {
      try {
        const searchedTitle = await searchFile(task.fallback);
        if (searchedTitle) {
          resolvedUrl = await resolveTitleUrl(searchedTitle);
        }
      } catch (e) {
        // Search fail
      }
    }
    
    // Last resort fallback - query search using query filename text
    if (!resolvedUrl) {
      try {
        const queryText = task.filename.replace(/-/g, ' ').replace('.jpg', '');
        const searchedTitle = await searchFile(queryText);
        if (searchedTitle) {
          resolvedUrl = await resolveTitleUrl(searchedTitle);
        }
      } catch (e) {
        // Last resort fail
      }
    }
    
    if (resolvedUrl) {
      try {
        await new Promise(r => setTimeout(r, 400)); // Be nice to API
        await downloadFile(resolvedUrl, destPath);
        
        const stats = fs.statSync(destPath);
        if (stats.size < 1000) {
          throw new Error('Downloaded file too small');
        }
        console.log(`  Downloaded: ${task.filename} (${(stats.size/1024).toFixed(1)} KB)`);
        successCount++;
      } catch (err) {
        console.error(`  Failed to download ${task.filename}: ${err.message}`);
      }
    } else {
      console.error(`  Could not resolve URL for ${task.filename}`);
    }
  }
  
  console.log(`Finished downloads! Success: ${successCount}/${TASKS.length}`);
}

run();
