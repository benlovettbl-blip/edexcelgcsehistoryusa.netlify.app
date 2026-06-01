const fs = require('fs');
const https = require('https');
const path = require('path');

const url = 'https://upload.wikimedia.org/wikipedia/commons/6/63/Company_E%2C_3rd_Battalion%2C_7th_Infantry_machine_gunner_wades_through_stream.jpg';
const dest = path.join(__dirname, '..', 'public', 'assets', 'sources', 'us-soldier-patrolling-swamp.jpg');

const options = {
  headers: {
    'User-Agent': 'GCSEHistoryApp/1.0 (benlovett.bl@gmail.com) Node.js/16'
  }
};

console.log('Downloading authentic Vietnam War image...');
https.get(url, options, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download: Status Code ${res.statusCode}`);
    process.exit(1);
  }
  const fileStream = fs.createWriteStream(dest);
  res.pipe(fileStream);
  fileStream.on('finish', () => {
    fileStream.close();
    console.log('Downloaded successfully and saved to ' + dest);
  });
}).on('error', (err) => {
  console.error('Error downloading:', err.message);
  process.exit(1);
});
