const fs = require('fs');
const https = require('https');

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Little_Rock_Nine_escorted_by_101st_Airborne.jpg';
const destPaths = [
  'public/assets/sources/airborne-little-rock-patrol.jpg',
  'assets/sources/airborne-little-rock-patrol.jpg',
  'dist/assets/sources/airborne-little-rock-patrol.jpg'
];

console.log('Downloading correct 101st Airborne image from:', imageUrl);

const options = {
  hostname: 'upload.wikimedia.org',
  path: '/wikipedia/commons/e/e6/Little_Rock_Nine_escorted_by_101st_Airborne.jpg',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
};

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
    console.log('All files updated successfully!');
  });
}).on('error', (err) => {
  console.error('Download error:', err.message);
  process.exit(1);
});
