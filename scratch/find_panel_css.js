const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const lines = content.split('\n');

console.log("Searching for 'causal-success-panel' in style.css:");
lines.forEach((line, idx) => {
  if (line.includes('causal-success-panel')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
