const https = require('https');

const queries = {
  "subtopic_1_1": "School Segregation and Brown v Board Crash Course Black American History 33",
  "subtopic_1_3": "The Montgomery Bus Boycott Crash Course Black American History 35",
  "subtopic_1_4": "Early Steps in the CIVIL RIGHTS Movement Heimler's History",
  "subtopic_2_2": "March on Washington HISTORY Channel American Freedom Stories",
  "subtopic_2_3": "Malcolm X Biography HISTORY",
  "subtopic_3_1": "Drawn History What is Domino Theory HISTORY Channel",
  "subtopic_3_2": "The Gulf of Tonkin Incident 1964 Simple History",
  "subtopic_3_3": "The infamous and ingenious Ho Chi Minh Trail TED Ed",
  "subtopic_4_2": "Richard Nixon Silent Majority Speech full",
  "subtopic_4_3": "The Fall of Saigon April 30th 1975 Simple History",
  "subtopic_4_4": "How did the U.S. Fail in Vietnam Animated History Armchair Historian"
};

async function fetchSearchPage(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    }).on('error', (err) => {
      resolve('');
    });
  });
}

function extractVideoIds(html) {
  const ids = new Set();
  // Look for "videoId":"..." in the JSON payload inside the HTML
  const regex = /"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    ids.add(match[1]);
  }
  
  // Also look for /watch?v=... URLs
  const watchRegex = /\/watch\?v=([a-zA-Z0-9_-]{11})/g;
  while ((match = watchRegex.exec(html)) !== null) {
    ids.add(match[1]);
  }
  
  return Array.from(ids).slice(0, 5); // Return top 5 candidates
}

async function checkoEmbed(id) {
  const url = `https://www.youtube.com/watch?v=${id}`;
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
            resolve({ valid: false });
          }
        } else {
          resolve({ valid: false });
        }
      });
    }).on('error', (err) => {
      resolve({ valid: false });
    });
  });
}

async function run() {
  for (const [subtopic, query] of Object.entries(queries)) {
    console.log(`\n=== Searching for ${subtopic}: "${query}" ===`);
    const html = await fetchSearchPage(query);
    const candidates = extractVideoIds(html);
    console.log(`Found ${candidates.length} candidates: ${candidates.join(', ')}`);
    
    let found = false;
    for (const id of candidates) {
      const result = await checkoEmbed(id);
      if (result.valid) {
        console.log(`  ✓ VALID ID: ${id} -> "${result.title}" by ${result.author}`);
        found = true;
      }
    }
    if (!found) {
      console.log(`  ❌ No valid video found for ${subtopic}`);
    }
  }
}

run();
