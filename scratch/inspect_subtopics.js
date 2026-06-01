const fs = require('fs');
const path = require('path');

const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);

const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

const targets = ['subtopic_1_3', 'subtopic_1_4', 'subtopic_4_4'];
targets.forEach(t => {
  console.log(`\n================ ${t} ================`);
  const data = LESSONS_DATA[t];
  if (!data) {
    console.log("Not found in LESSONS_DATA");
    return;
  }
  
  // Print keys
  console.log("Keys:", Object.keys(data));
  
  // If there is sourceD/sourceE
  if (data.sourceD) {
    console.log("sourceD:", JSON.stringify(data.sourceD, null, 2));
  }
  if (data.sourceE) {
    console.log("sourceE:", JSON.stringify(data.sourceE, null, 2));
  }
  
  // If there are steps, check for images in them
  if (data.steps) {
    data.steps.forEach((step, idx) => {
      console.log(`Step ${idx + 1} Title: "${step.title}"`);
      if (step.scholarlyDepth) {
        console.log(`  Scholarly Depth Keys:`, Object.keys(step.scholarlyDepth));
        if (step.scholarlyDepth.image) {
          console.log(`  Image: "${step.scholarlyDepth.image}"`);
          console.log(`  imageProvenance: "${step.scholarlyDepth.imageProvenance}"`);
        }
      }
    });
  }
});
