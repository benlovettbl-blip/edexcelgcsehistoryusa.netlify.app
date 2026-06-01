const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
const lines = content.split('\n');

console.log("Searching for 'Source D' or image properties in lessons_data.js:");
lines.forEach((line, idx) => {
  if (line.includes('sourceD') || line.includes('Source D') || line.includes('image:') || line.includes('imageProvenance') || line.includes('provenance:')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
