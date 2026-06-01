const fs = require('fs');

function searchInFile(filename) {
  if (!fs.existsSync(filename)) return;
  const content = fs.readFileSync(filename, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('highlight') || line.includes('quote') || line.includes('model-quote')) {
      console.log(`${filename}:${i + 1}: ${line.trim()}`);
    }
  });
}

searchInFile('app.js');
searchInFile('src/lessons.js');
searchInFile('style.css');
