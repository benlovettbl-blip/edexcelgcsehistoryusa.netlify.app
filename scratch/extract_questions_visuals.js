const fs = require('fs');
const path = require('path');
const vm = require('vm');

let questionsCode = fs.readFileSync(path.join(__dirname, '../questions.js'), 'utf8');
questionsCode = questionsCode.replace(/export\s+const\s+(\w+)/g, 'global.$1');
questionsCode = questionsCode.replace(/export\s+let\s+(\w+)/g, 'global.$1');

const sandbox = {};
sandbox.global = sandbox;
const context = vm.createContext(sandbox);
vm.runInContext(questionsCode, context);

const EXAM_SKILLS_DATA = context.EXAM_SKILLS_DATA;
const PAST_PAPERS_DATA = context.PAST_PAPERS_DATA;

console.log("=== Visual Sources in EXAM_SKILLS_DATA ===");
function scanObject(obj, prefix = '') {
  if (!obj || typeof obj !== 'object') return;
  
  if (obj.provenance || obj.image || obj.content) {
    if (obj.image || (obj.provenance && (obj.provenance.toLowerCase().includes('photograph') || obj.provenance.toLowerCase().includes('photo') || obj.provenance.toLowerCase().includes('picture')))) {
      console.log(`\nPath: ${prefix}`);
      console.log(`  - Image: "${obj.image}"`);
      console.log(`  - Provenance: "${obj.provenance}"`);
      console.log(`  - Content: "${obj.content ? obj.content.substring(0, 120) : 'none'}..."`);
    }
  }
  
  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object') {
      scanObject(val, prefix ? `${prefix}.${key}` : key);
    }
  }
}

scanObject(EXAM_SKILLS_DATA, 'EXAM_SKILLS_DATA');

console.log("\n=== Visual Sources in PAST_PAPERS_DATA ===");
PAST_PAPERS_DATA.forEach((paper, idx) => {
  const paperTitle = paper.title || paper.year || idx;
  scanObject(paper, `PAST_PAPERS_DATA[${idx}] (${paperTitle})`);
});
