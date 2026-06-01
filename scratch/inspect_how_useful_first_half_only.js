const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

const keys = ['subtopic_1_1', 'subtopic_1_2', 'subtopic_1_3', 'subtopic_1_4'];
keys.forEach(k => {
  const data = LESSONS_DATA[k];
  console.log(`\n================ ${k}: ${data.headerTitle} ================`);
  
  if (data.steps) {
    data.steps.forEach((step, idx) => {
      if (step.scholarlyDepth && step.scholarlyDepth.image) {
        console.log(`  Step ${idx + 1} Image: "${step.scholarlyDepth.image}"`);
        console.log(`    Provenance: "${step.scholarlyDepth.imageProvenance}"`);
      }
    });
  }
  
  if (data.howUsefulAnalyser) {
    const hw = data.howUsefulAnalyser;
    if (hw.sourceD) {
      console.log(`  Source D Image: "${hw.sourceD.image}"`);
      console.log(`    Provenance: "${hw.sourceD.provenance}"`);
    }
    if (hw.sourceE) {
      console.log(`  Source E Image: "${hw.sourceE.image}"`);
      console.log(`    Provenance: "${hw.sourceE.provenance}"`);
    }
  }
});
