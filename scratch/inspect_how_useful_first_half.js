const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

const keys = [
  'subtopic_1_1', 'subtopic_1_2', 'subtopic_1_3', 'subtopic_1_4',
  'subtopic_2_1', 'subtopic_2_2', 'subtopic_2_3', 'subtopic_2_4'
];

keys.forEach(k => {
  const data = LESSONS_DATA[k];
  if (data && data.howUsefulAnalyser) {
    const hw = data.howUsefulAnalyser;
    console.log(`\n================ ${k}: ${data.headerTitle} ================`);
    console.log(`Question: "${hw.question}"`);
    if (hw.sourceD) {
      console.log(`Source D:`);
      console.log(`  - Image: "${hw.sourceD.image}"`);
      console.log(`  - Provenance: "${hw.sourceD.provenance}"`);
      console.log(`  - Content: "${hw.sourceD.content ? hw.sourceD.content.substring(0, 150) : 'none'}..."`);
    }
    if (hw.sourceE) {
      console.log(`Source E:`);
      console.log(`  - Image: "${hw.sourceE.image}"`);
      console.log(`  - Provenance: "${hw.sourceE.provenance}"`);
      console.log(`  - Content: "${hw.sourceE.content ? hw.sourceE.content.substring(0, 150) : 'none'}..."`);
    }
  }
});
