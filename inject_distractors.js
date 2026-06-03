const fs = require('fs');
const path = require('path');
const vm = require('vm');

const databasePath = path.join(__dirname, 'questions.js');
const mappingPath = path.join(__dirname, 'scratch_distractors.json');

if (!fs.existsSync(mappingPath)) {
  console.error("Error: Mapping file not found at " + mappingPath);
  process.exit(1);
}

const mappings = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));
let fileContent = fs.readFileSync(databasePath, 'utf8');

// Parse
let contentWithoutExports = fileContent.replace(/\bexport\s+/g, '').replace(/\bconst\s+/g, 'var ').replace(/\blet\s+/g, 'var ');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(contentWithoutExports, sandbox);
const QUIZ_DATA = sandbox.QUIZ_DATA;

let updatedCount = 0;
if (!QUIZ_DATA) {
  console.error("Error: QUIZ_DATA is undefined in VM sandbox. Available keys:", Object.keys(sandbox));
  process.exit(1);
}
QUIZ_DATA.forEach(topic => {
  if (!topic.subtopics) return;
  topic.subtopics.forEach(subtopic => {
    const list = [...(subtopic.standard || []), ...(subtopic.depth || [])];
    list.forEach(q => {
      if (mappings[q.id]) {
        q.distractors = mappings[q.id];
        updatedCount++;
      }
    });
  });
});

console.log(`Updating ${updatedCount} questions in questions.js...`);
const examSkillsIdx = fileContent.indexOf('export const EXAM_SKILLS_DATA');
if (examSkillsIdx === -1) {
  console.error("Error: Could not locate EXAM_SKILLS_DATA in questions.js");
  process.exit(1);
}
const restOfContent = fileContent.substring(examSkillsIdx);
const updatedContent = `export const QUIZ_DATA = ${JSON.stringify(QUIZ_DATA, null, 2)};\n\n${restOfContent}`;
fs.writeFileSync(databasePath, updatedContent, 'utf8');
console.log("Done.");
