const https = require('https');

const URLS = {
  // Ho Chi Minh Trail
  'ho-chi-minh-trail-bicycles.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/HoTrial001.jpg',
  
  // LBJ signing
  'lbj-mlk-signing-1964.jpg': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Lyndon_Johnson_signing_Civil_Rights_Act%2C_July_2%2C_1964.jpg',
  
  // March on Washington crowd
  'march-on-washington-crowd-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/2/29/Civil_Rights_March_on_Washington%2C_D.C._%28Crowd_at_the_Lincoln_Memorial%29_-_GPN-2000-001426.jpg',
  'march-on-washington-crowd-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Civil_rights_march_on_washington.jpg',
  
  // MLK waving
  'mlk-waving-washington-1963-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Martin_Luther_King_Jr_waving_to_crowds_1963.jpg',
  'mlk-waving-washington-1963-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/0/02/Martin_Luther_King_Jr_waving_to_crowds_1963.JPG',
  
  // Rosa Parks Montgomery
  'rosa-parks-bus-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Rosa_Parks_Montgomery_Bus_Boycott_1955.jpg',
  'rosa-parks-bus-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Rosa_Parks_sitting_on_Montgomery_bus_boycott_1956.jpg',
  
  // Little Rock Nine
  'little-rock-nine-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Little_Rock_Nine_at_Central_High_School.jpg',
  'little-rock-nine-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/d/de/Little_Rock_Nine_at_Central_High_School.jpg',
  
  // Freedom Riders
  'freedom-riders-bus-1.jpg': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Freedom_Riders_bus_burning.jpg',
  'freedom-riders-bus-2.jpg': 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Freedom_Riders_bus_burning.jpg',
  
  // Birmingham dogs
  'birmingham-protests-dogs.jpg': 'https://upload.wikimedia.org/wikipedia/commons/9/94/Walter_Gadsden_attacked_by_dogs.jpg',
  
  // Olympics salute
  'olympics-black-power.jpg': 'https://upload.wikimedia.org/wikipedia/commons/3/3e/John_Carlos%2C_Tommie_Smith%2C_Peter_Norman_1968cr.jpg'
};

function checkUrl(name, url) {
  return new Promise((resolve) => {
    const options = {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    const req = https.request(url, options, (res) => {
      resolve({ name, url, statusCode: res.statusCode });
    });
    req.on('error', (err) => {
      resolve({ name, url, statusCode: 500, error: err.message });
    });
    req.end();
  });
}

async function run() {
  const promises = Object.entries(URLS).map(([name, url]) => checkUrl(name, url));
  const results = await Promise.all(promises);
  console.log('--- PROBE RESULTS ---');
  results.forEach(r => {
    console.log(`${r.name}: Status=${r.statusCode} ${r.statusCode === 200 ? '?? OK' : '? Failed'} (${r.url})`);
  });
}

run();
