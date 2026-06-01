const fs = require('fs');
const content = fs.readFileSync('src/lessons_data.js', 'utf8');

const targetIdx = content.indexOf('modelAnswer":');
if (targetIdx !== -1) {
  console.log(content.substring(targetIdx - 200, targetIdx + 1200));
} else {
  console.log('modelAnswer not found');
}
