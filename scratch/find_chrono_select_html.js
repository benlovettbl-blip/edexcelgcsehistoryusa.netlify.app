const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const lines = content.split('\n');

console.log("Searching for 'chrono-game-topic-select' in index.html:");
lines.forEach((line, idx) => {
  if (line.includes('chrono-game-topic-select')) {
    console.log(`Line ${idx + 1}: ${line.trim()}`);
    // print surrounding lines
    for (let i = Math.max(0, idx - 5); i < Math.min(lines.length, idx + 15); i++) {
      console.log(`  [${i + 1}]: ${lines[i].trim()}`);
    }
  }
});
