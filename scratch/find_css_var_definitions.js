const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const lines = content.split('\n');

console.log("Searching for variable definitions in style.css:");
lines.forEach((line, idx) => {
  if (line.includes('--text-main:') || line.includes('--success:') || line.includes('--text-muted:') || line.includes('--primary:')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
  }
});
