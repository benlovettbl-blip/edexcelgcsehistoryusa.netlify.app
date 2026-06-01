const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const lines = content.split('\n');

console.log("Searching theme variables:");
lines.forEach((line, idx) => {
  if (line.includes('--text-main') || line.includes('--text-muted') || line.includes('--success') || line.includes('--bg-card') || line.includes('--primary') || line.includes('--accent')) {
    if (line.includes(':') && line.includes(';')) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
    }
  }
});
