const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../src/views.js'), 'utf8');
const lines = content.split('\n');

console.log("Searching for 'generateChronoNarrativeParagraph':");
lines.forEach((line, idx) => {
  if (line.includes('generateChronoNarrativeParagraph')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
