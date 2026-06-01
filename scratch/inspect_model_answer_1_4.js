const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

const data = LESSONS_DATA['subtopic_1_4'];
if (data && data.howUsefulAnalyser) {
  console.log("howUsefulAnalyser:", JSON.stringify(data.howUsefulAnalyser, null, 2));
}
