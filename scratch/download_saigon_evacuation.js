const fs = require('fs');
const https = require('https');

const options = {
  hostname: 'upload.wikimedia.org',
  path: '/wikipedia/commons/e/e0/Helicopter_evacuation_of_Saigon_atop_22_Gia_Long_Street.webp',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

const destPaths = [
  'public/assets/sources/saigon-embassy-evacuation.jpg',
  'assets/sources/saigon-embassy-evacuation.jpg',
  'dist/assets/sources/saigon-embassy-evacuation.jpg'
];

console.log('Downloading correct Saigon evacuation image from Wikimedia...');

https.get(options, (response) => {
  if (response.statusCode !== 200) {
    console.error('Failed to download image. Status code:', response.statusCode);
    process.exit(1);
  }

  const data = [];
  response.on('data', (chunk) => data.push(chunk));
  response.on('end', () => {
    const buffer = Buffer.concat(data);
    
    destPaths.forEach(destPath => {
      const dir = destPath.substring(0, destPath.lastIndexOf('/'));
      if (fs.existsSync(dir)) {
        fs.writeFileSync(destPath, buffer);
        console.log('Saved correct image to:', destPath);
      } else {
        console.log('Directory does not exist, skipping:', dir);
      }
    });
    console.log('Saigon evacuation image updated successfully!');
  });
}).on('error', (err) => {
  console.error('Download error:', err.message);
  process.exit(1);
});
