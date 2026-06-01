const https = require('https');

const CANDIDATES = {
  "subtopic_1_1_cand1": "https://www.youtube.com/watch?v=5Ue0u7o1lJc", // Heimler Brown v Board
  "subtopic_1_3_cand1": "https://www.youtube.com/watch?v=A1g-Vf2i99g", // HISTORY Montgomery Bus Boycott
  "subtopic_1_4_cand1": "https://www.youtube.com/watch?v=J_O71eYV_bA", // Heimler Civil Rights APUSH
  "subtopic_2_2_cand1": "https://www.youtube.com/watch?v=smEqnnklfYs", // HISTORY March on Washington
  "subtopic_3_1_cand1": "https://www.youtube.com/watch?v=QyB-yM2gB6E", // HISTORY Domino Theory
  "subtopic_3_2_cand1": "https://www.youtube.com/watch?v=crALHjTiXbk", // Simple History Tonkin
  "subtopic_3_3_cand1": "https://www.youtube.com/watch?v=OC3fdP5vAqg", // TED-Ed Ho Chi Minh Trail
  "subtopic_4_2_cand1": "https://www.youtube.com/watch?v=TpCWHQ30Do8", // Richard Nixon Foundation Silent Majority (Old ID)
  "subtopic_4_3_cand1": "https://www.youtube.com/watch?v=0k-s3a-0eXk", // BBC News Fall of Saigon
  "subtopic_4_4_cand1": "https://www.youtube.com/watch?v=gT5R24Jd-34", // Armchair Historian U.S. Fail
};

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
  console.log(`Checking ${Object.keys(CANDIDATES).length} candidate video URLs...`);
  for (const [key, url] of Object.entries(CANDIDATES)) {
    const result = await checkoEmbed(url);
    if (result.valid) {
      console.log(`✓ ${key}: VALID - "${result.title}" by ${result.author} (URL: ${url})`);
    } else {
      console.log(`❌ ${key}: INVALID (Status Code: ${result.statusCode || 'N/A'}, Error: ${result.error || 'Video not found'}) (URL: ${url})`);
    }
  }
}

run();
