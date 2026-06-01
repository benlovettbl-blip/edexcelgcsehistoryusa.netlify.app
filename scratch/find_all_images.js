const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

const imageList = [];

for (const [subtopicId, data] of Object.entries(LESSONS_DATA)) {
  const subtopicTitle = data.headerTitle;
  
  // 1. Check steps
  if (data.steps) {
    data.steps.forEach((step, idx) => {
      if (step.scholarlyDepth && step.scholarlyDepth.image) {
        imageList.push({
          subtopicId,
          subtopicTitle,
          location: `Step ${idx + 1} Scholarly Image`,
          image: step.scholarlyDepth.image,
          provenance: step.scholarlyDepth.imageProvenance || step.scholarlyDepth.title
        });
      }
    });
  }
  
  // 2. Check howUsefulAnalyser
  if (data.howUsefulAnalyser) {
    const hw = data.howUsefulAnalyser;
    if (hw.sourceD && hw.sourceD.image) {
      imageList.push({
        subtopicId,
        subtopicTitle,
        location: `howUsefulAnalyser Source D`,
        image: hw.sourceD.image,
        provenance: hw.sourceD.provenance
      });
    }
    if (hw.sourceE && hw.sourceE.image) {
      imageList.push({
        subtopicId,
        subtopicTitle,
        location: `howUsefulAnalyser Source E`,
        image: hw.sourceE.image,
        provenance: hw.sourceE.provenance
      });
    }
  }
}

console.log(`Found ${imageList.length} total images in lessons_data.js:`);
imageList.forEach((img, idx) => {
  console.log(`\n[${idx + 1}] Subtopic: ${img.subtopicId} (${img.location})`);
  console.log(`    Image Path: "${img.image}"`);
  console.log(`    Provenance: "${img.provenance}"`);
});
