const fs = require('fs');
const https = require('https');

const imageUrl = 'https://upload.wikimedia.org/wikipedia/commons/6/69/Malcolm_X_NYWTS_2.jpg';
const destPaths = [
  'public/assets/sources/malcolm-x-speaking.jpg',
  'assets/sources/malcolm-x-speaking.jpg',
  'dist/assets/sources/malcolm-x-speaking.jpg'
];

console.log('Downloading correct Malcolm X speaking image from:', imageUrl);

const options = {
  hostname: 'upload.wikimedia.org',
  path: '/wikipedia/commons/6/69/Malcolm_X_NYWTS_2.jpg',
  method: 'GET',
  headers: {
    'User-Agent': 'AntigravityHistoryQuizApp/1.0 (https://github.com/fives/paper3_usa_recall_quizzes; fives@gmail.com) Node.js/16'
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
        console.log('Saved image to:', destPath);
      } else {
        console.log('Directory does not exist, skipping:', dir);
      }
    });
    console.log('Malcolm X speaking image updated successfully!');
  });
}).on('error', (err) => {
  console.error('Download error:', err.message);
  process.exit(1);
});
