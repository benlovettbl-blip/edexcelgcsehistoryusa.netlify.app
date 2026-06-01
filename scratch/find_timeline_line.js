const fs = require('fs');
const lines = fs.readFileSync('index.html', 'utf8').split('\n');
lines.forEach((line, idx) => {
  if (line.includes('Filter Timeline Era')) {
    console.log(`Line ${idx + 1}:`);
    for (let i = Math.max(0, idx - 10); i < Math.min(lines.length, idx + 20); i++) {
      console.log(`${i + 1}: ${lines[i]}`);
    }
  }
});
