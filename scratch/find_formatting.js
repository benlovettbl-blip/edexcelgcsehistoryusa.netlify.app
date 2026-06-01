const fs = require('fs');
const code = fs.readFileSync('questions.js', 'utf8');

const regex = /modela:\s*("[^"]*")/g;
const match = regex.exec(code);
if (match) {
  const content = match[1];
  console.log('Contains literal newlines?', content.includes('\n'));
  console.log('Contains escaped newlines?', content.includes('\\n'));
}
