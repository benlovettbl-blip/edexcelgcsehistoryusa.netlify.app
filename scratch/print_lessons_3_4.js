const fs = require('fs');
const content = fs.readFileSync('src/lessons_data.js', 'utf8');

const startIdx = content.indexOf('"subtopic_3_4"');
if (startIdx !== -1) {
  console.log(content.substring(startIdx + 4500, startIdx + 8500));
}
