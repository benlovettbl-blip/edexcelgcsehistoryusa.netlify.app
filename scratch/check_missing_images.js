const fs = require('fs');
const path = require('path');
const vm = require('vm');

// 1. Load lessons_data.js
const fileContent = fs.readFileSync(path.join(__dirname, '../src/lessons_data.js'), 'utf8');
let cleanContent = fileContent.replace('export const LESSONS_DATA =', 'const data =') + '; module.exports = data;';
fs.writeFileSync(path.join(__dirname, 'temp_lessons_data.js'), cleanContent);
const LESSONS_DATA = require('./temp_lessons_data.js');
fs.unlinkSync(path.join(__dirname, 'temp_lessons_data.js'));

// 2. Load questions.js
let questionsCode = fs.readFileSync(path.join(__dirname, '../questions.js'), 'utf8');
questionsCode = questionsCode.replace(/export\s+const\s+(\w+)/g, 'global.$1');
questionsCode = questionsCode.replace(/export\s+let\s+(\w+)/g, 'global.$1');
const sandbox = {};
sandbox.global = sandbox;
const context = vm.createContext(sandbox);
vm.runInContext(questionsCode, context);
const EXAM_SKILLS_DATA = context.EXAM_SKILLS_DATA;
const PAST_PAPERS_DATA = context.PAST_PAPERS_DATA;

const images = new Set();
const references = [];

function addImage(imagePath, ref) {
  if (!imagePath) return;
  images.add(imagePath);
  references.push({ imagePath, ref });
}

// Extract from lessons_data.js
for (const [subtopicId, data] of Object.entries(LESSONS_DATA)) {
  if (data.doNowStarter && data.doNowStarter.image) {
    addImage(data.doNowStarter.image, `${subtopicId}.doNowStarter`);
  }
  if (data.steps) {
    data.steps.forEach((step, idx) => {
      if (step.scholarlyDepth && step.scholarlyDepth.image) {
        addImage(step.scholarlyDepth.image, `${subtopicId}.steps[${idx}].scholarlyDepth`);
      }
    });
  }
  if (data.howUsefulAnalyser) {
    const hw = data.howUsefulAnalyser;
    if (hw.sourceD && hw.sourceD.image) {
      addImage(hw.sourceD.image, `${subtopicId}.howUsefulAnalyser.sourceD`);
    }
    if (hw.sourceE && hw.sourceE.image) {
      addImage(hw.sourceE.image, `${subtopicId}.howUsefulAnalyser.sourceE`);
    }
  }
}

// Extract from questions.js (EXAM_SKILLS_DATA)
if (EXAM_SKILLS_DATA.q1) {
  Object.keys(EXAM_SKILLS_DATA.q1).forEach(key => {
    const q = EXAM_SKILLS_DATA.q1[key];
    if (q.sourceA && q.sourceA.image) addImage(q.sourceA.image, `EXAM_SKILLS_DATA.q1.${key}.sourceA`);
    if (q.sourceB && q.sourceB.image) addImage(q.sourceB.image, `EXAM_SKILLS_DATA.q1.${key}.sourceB`);
  });
}
if (EXAM_SKILLS_DATA.q3) {
  Object.keys(EXAM_SKILLS_DATA.q3).forEach(key => {
    const q = EXAM_SKILLS_DATA.q3[key];
    if (q.sourceA && q.sourceA.image) addImage(q.sourceA.image, `EXAM_SKILLS_DATA.q3.${key}.sourceA`);
    if (q.sourceB && q.sourceB.image) addImage(q.sourceB.image, `EXAM_SKILLS_DATA.q3.${key}.sourceB`);
    if (q.sourceC && q.sourceC.image) addImage(q.sourceC.image, `EXAM_SKILLS_DATA.q3.${key}.sourceC`);
  });
}

// Extract from questions.js (PAST_PAPERS_DATA)
PAST_PAPERS_DATA.forEach((paper, idx) => {
  const title = paper.title || paper.year || idx;
  if (paper.sourceA && paper.sourceA.image) addImage(paper.sourceA.image, `PAST_PAPERS_DATA[${idx}] (${title}).sourceA`);
  if (paper.sourceB && paper.sourceB.image) addImage(paper.sourceB.image, `PAST_PAPERS_DATA[${idx}] (${title}).sourceB`);
  if (paper.sourceC && paper.sourceC.image) addImage(paper.sourceC.image, `PAST_PAPERS_DATA[${idx}] (${title}).sourceC`);
});

console.log(`Checking ${images.size} unique image files...`);
let missingCount = 0;
images.forEach(img => {
  const absolutePath = path.join(__dirname, '../', img);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Missing image file: "${img}"`);
    const refs = references.filter(r => r.imagePath === img).map(r => r.ref);
    console.error(`   Referenced by: ${refs.join(', ')}`);
    missingCount++;
  } else {
    // Check if empty or extremely small
    const stats = fs.statSync(absolutePath);
    if (stats.size === 0) {
      console.error(`❌ Empty image file (0 bytes): "${img}"`);
      missingCount++;
    }
  }
});

if (missingCount === 0) {
  console.log("✓ All referenced image files exist and are non-empty!");
} else {
  console.log(`Finished with ${missingCount} errors.`);
}
