const fs = require('fs');
const vm = require('vm');

let questionsCode = fs.readFileSync('questions.js', 'utf8');
questionsCode = questionsCode.replace(/export\s+const\s+(\w+)/g, 'global.$1');
questionsCode = questionsCode.replace(/export\s+let\s+(\w+)/g, 'global.$1');

const sandbox = {};
sandbox.global = sandbox;
const context = vm.createContext(sandbox);
vm.runInContext(questionsCode, context);

const EXAM_SKILLS_DATA = context.EXAM_SKILLS_DATA;
const PAST_PAPERS_DATA = context.PAST_PAPERS_DATA;

console.log("Auditing images in questions.js:");

function checkImage(obj, path) {
  if (!obj) return;
  if (obj.image) {
    console.log(`Found image at ${path}:`);
    console.log(`  Image: "${obj.image}"`);
    console.log(`  Provenance: "${obj.provenance}"`);
  }
}

// Check EXAM_SKILLS_DATA
if (EXAM_SKILLS_DATA.q1) {
  Object.keys(EXAM_SKILLS_DATA.q1).forEach(key => {
    const q = EXAM_SKILLS_DATA.q1[key];
    checkImage(q.sourceA, `EXAM_SKILLS_DATA.q1.${key}.sourceA`);
    checkImage(q.sourceB, `EXAM_SKILLS_DATA.q1.${key}.sourceB`);
  });
}

if (EXAM_SKILLS_DATA.q3) {
  Object.keys(EXAM_SKILLS_DATA.q3).forEach(key => {
    const q = EXAM_SKILLS_DATA.q3[key];
    checkImage(q.sourceA, `EXAM_SKILLS_DATA.q3.${key}.sourceA`);
    checkImage(q.sourceB, `EXAM_SKILLS_DATA.q3.${key}.sourceB`);
    checkImage(q.sourceC, `EXAM_SKILLS_DATA.q3.${key}.sourceC`);
  });
}

// Check PAST_PAPERS_DATA
PAST_PAPERS_DATA.forEach((paper, idx) => {
  const title = paper.title || paper.year || idx;
  checkImage(paper.sourceA, `PAST_PAPERS_DATA[${idx}] (${title}).sourceA`);
  checkImage(paper.sourceB, `PAST_PAPERS_DATA[${idx}] (${title}).sourceB`);
  checkImage(paper.sourceC, `PAST_PAPERS_DATA[${idx}] (${title}).sourceC`);
});
