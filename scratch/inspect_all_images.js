const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

console.log("Analyzing all images and their provenance in lessons_data.js...");

for (const [subtopicId, data] of Object.entries(LESSONS_DATA)) {
  console.log(`\n================ ${subtopicId}: ${data.headerTitle} ================`);
  
  if (data.doNowStarter && data.doNowStarter.image) {
    console.log(`  DoNow Image: "${data.doNowStarter.image}"`);
    console.log(`    Provenance: "${data.doNowStarter.provenance}"`);
  }
  
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
      console.log(`    Caption: "${hw.sourceD.caption}"`);
    }
    if (hw.sourceE) {
      console.log(`  Source E Image: "${hw.sourceE.image}"`);
      console.log(`    Provenance: "${hw.sourceE.provenance}"`);
      console.log(`    Caption: "${hw.sourceE.caption}"`);
    }
  }
}
