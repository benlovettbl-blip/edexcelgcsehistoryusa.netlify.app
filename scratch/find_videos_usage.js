const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lessons.js');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

console.log("Searching for 'VIDEOS_DATA' inside src/lessons.js:");
lines.forEach((line, idx) => {
  if (line.includes('VIDEOS_DATA')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
