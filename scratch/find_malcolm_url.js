const https = require('https');

function getImageUrl(filename) {
  return new Promise((resolve, reject) => {
    const encodedFilename = encodeURIComponent(filename);
    const path = `/w/api.php?action=query&titles=${encodedFilename}&prop=imageinfo&iiprop=url&format=json`;
    
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
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pageId === '-1') {
            resolve(null);
            return;
          }
          const imageinfo = pages[pageId].imageinfo;
          if (imageinfo && imageinfo.length > 0) {
            resolve(imageinfo[0].url);
          } else {
            resolve(null);
          }
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', err => reject(err));
  });
}

async function run() {
  const files = [
    'File:Malcolm_X_speaking_at_a_meeting_of_the_Nation_of_Islam_in_Chicago_1963.jpg',
    'File:Malcolm X NYWTS 2.jpg',
    'File:Malcolm X NYWTS.jpg'
  ];
  for (const f of files) {
    const url = await getImageUrl(f);
    console.log(`${f} -> ${url}`);
  }
}

run();
