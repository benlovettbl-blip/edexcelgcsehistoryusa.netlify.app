const https = require('https');

const candidates = [
  // subtopic_1_1
  { id: 'NBlqcAEv4nk', desc: 'Crash Course Brown v Board' },
  { id: 'kYJqD262F6Q', desc: 'Heimler Brown v Board' },
  
  // subtopic_1_3
  { id: 't5A53O97V7k', desc: 'HISTORY Montgomery Bus Boycott' },
  { id: 'ylOpide9dus', desc: 'Crash Course Montgomery Bus Boycott #35' },
  
  // subtopic_1_4
  { id: 'kR03a6kH-fA', desc: 'Heimler APUSH 8.6 Early Civil Rights' },
  { id: 'Jb7Z_S8W4S0', desc: 'Heimler APUSH 8.6 1940s-50s' },
  
  // subtopic_2_2
  { id: '3-z8Evm5kxM', desc: 'HISTORY March on Washington' },
  
  // subtopic_2_3
  { id: 'oqKVKp96fEA', desc: 'Biography Malcolm X' },
  { id: 'g1Pua-n4eN0', desc: 'Malcolm X candidate 2' },
  
  // subtopic_3_1
  { id: 'kYJ4Jm471b0', desc: 'Domino Theory Drawn History' },
  
  // subtopic_3_2
  { id: 'kYJv8y6H73s', desc: 'Simple History Gulf of Tonkin' },
  { id: 'crALHjTiXbk', desc: 'Simple History Gulf of Tonkin (from cand)' },
  { id: 's5R8B1Z0w0c', desc: 'Simple History Gulf of Tonkin candidate 3' },
  
  // subtopic_3_3
  { id: 'poE_nNW9-yk', desc: 'TED-Ed Ho Chi Minh Trail (Extracted)' },
  
  // subtopic_4_2
  { id: 'TpCWHQ30Do8', desc: 'Nixon Foundation Silent Majority' },
  
  // subtopic_4_3
  { id: 'R9K-g5167OQ', desc: 'Fall of Saigon candidate 1' },
  { id: 'kYJv8Z1t64Y', desc: 'Fall of Saigon candidate 2' },
  { id: 'N4hH9xK3158', desc: 'BBC Fall of Saigon' },
  
  // subtopic_4_4
  { id: 'k856r7w1_l0', desc: 'Armchair Historian Fail in Vietnam' }
];

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
  console.log(`Checking ${candidates.length} candidates...`);
  for (const cand of candidates) {
    const result = await checkoEmbed(cand.id);
    if (result.valid) {
      console.log(`✓ ${cand.id} (${cand.desc}): VALID - "${result.title}" by ${result.author}`);
    } else {
      console.log(`❌ ${cand.id} (${cand.desc}): INVALID (Status Code: ${result.statusCode || 'N/A'}, Error: ${result.error || 'Video not found'})`);
    }
  }
}

run();
