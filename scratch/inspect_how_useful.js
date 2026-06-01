const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

for (const [subtopicId, data] of Object.entries(LESSONS_DATA)) {
  if (data.howUsefulAnalyser) {
    const hw = data.howUsefulAnalyser;
    console.log(`\n================ ${subtopicId}: ${data.headerTitle} ================`);
    console.log(`Question: "${hw.question}"`);
    if (hw.sourceD) {
      console.log(`Source D:`);
      console.log(`  - Type: "${hw.sourceD.type}"`);
      console.log(`  - Image: "${hw.sourceD.image}"`);
      console.log(`  - Provenance: "${hw.sourceD.provenance}"`);
      console.log(`  - Content: "${hw.sourceD.content ? hw.sourceD.content.substring(0, 100) : 'none'}..."`);
    }
    if (hw.sourceE) {
      console.log(`Source E:`);
      console.log(`  - Type: "${hw.sourceE.type}"`);
      console.log(`  - Image: "${hw.sourceE.image}"`);
      console.log(`  - Provenance: "${hw.sourceE.provenance}"`);
      console.log(`  - Content: "${hw.sourceE.content ? hw.sourceE.content.substring(0, 100) : 'none'}..."`);
    }
  }
}
