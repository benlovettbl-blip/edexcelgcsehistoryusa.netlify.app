const https = require('https');

function searchCommons(query) {
  return new Promise((resolve, reject) => {
    const path = `/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&srlimit=10&format=json`;
    const options = {
      hostname: 'commons.wikimedia.org',
      path: path,
      method: 'GET',
      headers: {
        'User-Agent': 'AntigravityHistoryQuizApp/1.0 (https://github.com/fives/paper3_usa_recall_quizzes; fives@gmail.com) Node.js/16'
      }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.query && json.query.search) {
            resolve(json.query.search.map(r => r.title));
          } else {
            resolve([]);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => reject(err));
  });
}

async function run() {
  const queries = [
    'Martin Luther King Highlander',
    'Martin Luther King Communist',
    'LC-USZ62-120215',
    'Highlander Folk School'
  ];
  for (const q of queries) {
    const titles = await searchCommons(q);
    console.log(`Query: ${q}`);
    console.log('Titles:', titles);
    console.log('---');
  }
}

run();
