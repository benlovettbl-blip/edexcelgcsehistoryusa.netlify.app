const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lessons_data.js');
const fileContent = fs.readFileSync(filePath, 'utf8');

// Parse the lessons data. Since it's a JS module exporting LESSONS_DATA, let's load it in Node
// by removing the "export const" and requiring it, or using simple regex extraction.
// Let's use VM or simple eval after removing "export"
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

console.log("Subtopics with Source D visual details:");
for (const [subtopicId, data] of Object.entries(LESSONS_DATA)) {
  console.log(`\n================ ${subtopicId}: ${data.headerTitle} ================`);
  if (data.sourceD) {
    console.log(`Source D:`);
    console.log(`  - Image Path: "${data.sourceD.image}"`);
    console.log(`  - Image Alt: "${data.sourceD.imageAlt}"`);
    console.log(`  - Provenance: "${data.sourceD.provenance}"`);
    console.log(`  - Content: "${data.sourceD.content.substring(0, 150)}..."`);
  } else {
    console.log(`  No Source D found.`);
  }

  // Also check if steps have images
  if (data.steps) {
    data.steps.forEach((step, idx) => {
      if (step.scholarlyDepth && step.scholarlyDepth.image) {
        console.log(`  Step ${idx + 1} Scholarly Image:`);
        console.log(`    - Path: "${step.scholarlyDepth.image}"`);
        console.log(`    - Provenance: "${step.scholarlyDepth.imageProvenance}"`);
      }
    });
  }
}
