const fs = require('fs');
const vm = require('vm');

// Load questions.js
let questionsCode = fs.readFileSync('questions.js', 'utf8');
questionsCode = questionsCode.replace(/export\s+const\s+(\w+)/g, 'global.$1');
questionsCode = questionsCode.replace(/export\s+let\s+(\w+)/g, 'global.$1');

const sandbox = {};
sandbox.global = sandbox;
const context = vm.createContext(sandbox);
vm.runInContext(questionsCode, context);

const EXAM_SKILLS_DATA = context.EXAM_SKILLS_DATA;
const PAST_PAPERS_DATA = context.PAST_PAPERS_DATA;

function checkQ2Model(id, modelText, questionText) {
  const errors = [];
  if (!modelText) {
    errors.push("Missing model answer");
    return errors;
  }
  
  if (modelText.includes('"') || modelText.includes('“') || modelText.includes('”')) {
    errors.push("Contains double quotation marks (which might indicate source quotes)");
  }
  
  const paragraphs = modelText.split('\n').filter(p => p.trim() !== '');
  if (paragraphs.length !== 3) {
    errors.push(`Has ${paragraphs.length} paragraphs (expected exactly 3)`);
  }
  
  const expectedPrefixes = [
    "One reason why",
    "A second reason why",
    "A third reason why"
  ];
  
  paragraphs.forEach((p, idx) => {
    const prefix = expectedPrefixes[idx] || `Paragraph ${idx + 1}`;
    if (!p.trim().startsWith(prefix)) {
      errors.push(`Paragraph ${idx + 1} does not start with "${prefix}" (got: "${p.trim().substring(0, 45)}...")`);
    }
  });
  
  return errors;
}

function checkQ3cModel(id, modelText) {
  const errors = [];
  if (!modelText) {
    errors.push("Missing model answer");
    return errors;
  }
  
  if (modelText.includes('[[') || modelText.includes(']]')) {
    errors.push("Contains own knowledge brackets [[...]]");
  }
  
  const quoteCount = (modelText.match(/"/g) || []).length / 2;
  const curlyCountStart = (modelText.match(/“/g) || []).length;
  const curlyCountEnd = (modelText.match(/”/g) || []).length;
  const totalQuotes = quoteCount + Math.max(curlyCountStart, curlyCountEnd);
  
  if (totalQuotes !== 4) {
    errors.push(`Has ${totalQuotes} quotes (expected exactly 4, got ${totalQuotes})`);
  }
  
  return errors;
}

function checkQ3dModel(id, modelText) {
  const errors = [];
  if (!modelText) {
    errors.push("Missing model answer");
    return errors;
  }
  
  if (!modelText.includes('[[') || !modelText.includes(']]')) {
    errors.push("Missing own knowledge/contextual knowledge highlight [[...]]");
  }
  
  if (!modelText.includes('[1[') || !modelText.includes(']1]')) {
    errors.push("Missing Interpretation 1 quotes [1[...]1]");
  }
  
  if (!modelText.includes('[2[') || !modelText.includes(']2]')) {
    errors.push("Missing Interpretation 2 quotes [2[...]2]");
  }
  
  return errors;
}

console.log("=== ERRORS IN EXAM_SKILLS_DATA ===");
let hasSkillsErrors = false;
if (EXAM_SKILLS_DATA.q2) {
  Object.keys(EXAM_SKILLS_DATA.q2).forEach(key => {
    const q = EXAM_SKILLS_DATA.q2[key];
    const errors = checkQ2Model(key, q.model, q.question);
    if (errors.length > 0) {
      hasSkillsErrors = true;
      console.log(`Q2: ${key} -> ERRORS:`, errors);
    }
  });
}

if (EXAM_SKILLS_DATA.q3) {
  Object.keys(EXAM_SKILLS_DATA.q3).forEach(key => {
    const q = EXAM_SKILLS_DATA.q3[key];
    if (q.modelc) {
      const errors = checkQ3cModel(`${key}_c`, q.modelc);
      if (errors.length > 0) {
        hasSkillsErrors = true;
        console.log(`Q3c: ${key} -> ERRORS:`, errors);
      }
    }
    if (q.modeld) {
      const errors = checkQ3dModel(`${key}_d`, q.modeld);
      if (errors.length > 0) {
        hasSkillsErrors = true;
        console.log(`Q3d: ${key} -> ERRORS:`, errors);
      }
    }
  });
}
if (!hasSkillsErrors) console.log("None.");

console.log("\n=== ERRORS IN PAST_PAPERS_DATA ===");
let hasPaperErrors = false;
PAST_PAPERS_DATA.forEach((paper, paperIdx) => {
  const paperTitle = paper.title || paper.year || paperIdx;
  const questionsObj = paper.questions || paper;
  
  Object.keys(questionsObj).forEach(qKey => {
    const q = questionsObj[qKey];
    if (!q || typeof q !== 'object') return;
    
    if (qKey === 'q2') {
      const errors = checkQ2Model(qKey, q.model, q.question);
      if (errors.length > 0) {
        hasPaperErrors = true;
        console.log(`  Paper "${paperTitle}" Q2 -> ERRORS:`, errors);
      }
    } else if (qKey === 'q3c') {
      const errors = checkQ3cModel(qKey, q.model);
      if (errors.length > 0) {
        hasPaperErrors = true;
        console.log(`  Paper "${paperTitle}" Q3c -> ERRORS:`, errors);
      }
    } else if (qKey === 'q3d') {
      const errors = checkQ3dModel(qKey, q.model);
      if (errors.length > 0) {
        hasPaperErrors = true;
        console.log(`  Paper "${paperTitle}" Q3d -> ERRORS:`, errors);
      }
    }
  });
});
if (!hasPaperErrors) console.log("None.");
