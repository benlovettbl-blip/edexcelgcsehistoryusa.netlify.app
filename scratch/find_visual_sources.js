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

const visualSources = [];

// Helper to check source fields
function checkSource(source, pathInfo) {
  if (!source) return;
  const prov = (source.provenance || '').toLowerCase();
  const cont = (source.content || '').toLowerCase();
  if (prov.includes('photograph') || prov.includes('photo') || prov.includes('drawing') || prov.includes('cartoon') || prov.includes('image') ||
      cont.includes('photograph') || cont.includes('photo') || cont.includes('drawing') || cont.includes('cartoon') || cont.includes('image')) {
    visualSources.push({
      path: pathInfo,
      provenance: source.provenance,
      content: source.content
    });
  }
}

// Check EXAM_SKILLS_DATA
if (EXAM_SKILLS_DATA.q1) {
  Object.keys(EXAM_SKILLS_DATA.q1).forEach(key => {
    const q = EXAM_SKILLS_DATA.q1[key];
    checkSource(q.sourceA, `EXAM_SKILLS_DATA.q1.${key}.sourceA`);
  });
}

if (EXAM_SKILLS_DATA.q3) {
  Object.keys(EXAM_SKILLS_DATA.q3).forEach(key => {
    const q = EXAM_SKILLS_DATA.q3[key];
    checkSource(q.sourceB, `EXAM_SKILLS_DATA.q3.${key}.sourceB`);
    checkSource(q.sourceC, `EXAM_SKILLS_DATA.q3.${key}.sourceC`);
  });
}

// Check PAST_PAPERS_DATA
PAST_PAPERS_DATA.forEach((paper, idx) => {
  const paperTitle = paper.title || paper.year || idx;
  checkSource(paper.sourceA, `PAST_PAPERS_DATA[${idx}] (${paperTitle}).sourceA`);
  checkSource(paper.sourceB, `PAST_PAPERS_DATA[${idx}] (${paperTitle}).sourceB`);
  checkSource(paper.sourceC, `PAST_PAPERS_DATA[${idx}] (${paperTitle}).sourceC`);
});

console.log(`Found ${visualSources.length} visual sources:`);
visualSources.forEach(vs => {
  console.log(`\n- Path: ${vs.path}`);
  console.log(`  Provenance: "${vs.provenance}"`);
  console.log(`  Content: "${vs.content.substring(0, 100)}..."`);
});
