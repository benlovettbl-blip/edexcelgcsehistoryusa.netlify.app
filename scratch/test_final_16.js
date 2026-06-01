const https = require('https');

const videos = {
  "subtopic_1_1": {
    "id": "NBlqcAEv4nk",
    "title": "School Segregation and Brown v Board: Crash Course Black American History #33"
  },
  "subtopic_1_2": {
    "id": "ym8rdtq-KBE",
    "title": "60 Years On, A Look Back at the Little Rock Nine"
  },
  "subtopic_1_3": {
    "id": "ylOpide9dus",
    "title": "The Montgomery Bus Boycott: Crash Course Black American History #35"
  },
  "subtopic_1_4": {
    "id": "0sUpGqKayWY",
    "title": "Early Steps in the CIVIL RIGHTS Movement (1940s-50s) [APUSH Review]"
  },
  "subtopic_2_1": {
    "id": "dJqA6PQRh3U",
    "title": "Sound Smart: The Freedom Rides | History"
  },
  "subtopic_2_2": {
    "id": "qjL1E3R9dF4",
    "title": "Bet You Didn't Know: March on Washington | History"
  },
  "subtopic_2_3": {
    "id": "tFh4OloaJMo",
    "title": "The Life of Malcolm X | Biography"
  },
  "subtopic_2_4": {
    "id": "lJrWmKsxEos",
    "title": "“ WATTS RIOT OR REVOLT? ” AUGUST, 1965 WATTS, LOS ANGELES RACE RIOTS SPECIAL REPORT PART 2"
  },
  "subtopic_3_1": {
    "id": "44cnzhzcYjs",
    "title": "Drawn History: What is Domino Theory? | History"
  },
  "subtopic_3_2": {
    "id": "crALHjTiXbk",
    "title": "The Gulf of Tonkin Incident (1964)"
  },
  "subtopic_3_3": {
    "id": "poE_nNW9-yk",
    "title": "The infamous and ingenious Ho Chi Minh Trail - Cameron Paterson"
  },
  "subtopic_3_4": {
    "id": "jnbhRdmK6ek",
    "title": "President Richard Nixon Address to the Nation on Vietnam, April 26, 1972"
  },
  "subtopic_4_1": {
    "id": "BPgWqgpgVRc",
    "title": "How The Tet Offensive Changed The Vietnam War | History"
  },
  "subtopic_4_2": {
    "id": "TpCWHQ30Do8",
    "title": "The Great Silent Majority (full version)"
  },
  "subtopic_4_3": {
    "id": "dsSXMQ306iU",
    "title": "The Fall of Saigon (April 30th, 1975 - The End of the Vietnam War)"
  },
  "subtopic_4_4": {
    "id": "zAq6MrYgLr0",
    "title": "How did the U.S. Fail in Vietnam? | Animated History"
  }
};

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
  console.log(`Checking all 16 final videos...`);
  let allValid = true;
  for (const [subtopic, data] of Object.entries(videos)) {
    const result = await checkoEmbed(data.id);
    if (result.valid) {
      console.log(`✓ ${subtopic} (${data.id}): VALID - "${result.title}" by ${result.author}`);
    } else {
      console.log(`❌ ${subtopic} (${data.id}): INVALID (Status Code: ${result.statusCode || 'N/A'}, Error: ${result.error || 'Video not found'})`);
      allValid = false;
    }
  }
  if (allValid) {
    console.log("\nSUCCESS: All 16 video links are verified as 100% active and working!");
  } else {
    console.log("\nWARNING: Some video links are still failing. Please correct them.");
  }
}

run();
