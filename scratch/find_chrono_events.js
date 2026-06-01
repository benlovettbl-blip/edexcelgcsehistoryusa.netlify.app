const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.js'));

files.forEach(file => {
  const content = fs.readFileSync(path.join(srcDir, file), 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('CHRONOLOGY_EVENTS')) {
      console.log(`${file} Line ${idx + 1}: ${line.trim()}`);
    }
  });
});
