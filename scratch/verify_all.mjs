import { EXAM_SKILLS_DATA, PAST_PAPERS_DATA } from '../questions.js';
import { LESSONS_DATA } from '../src/lessons_data.js';

let errors = [];

function checkModelAnswer(model, id, source) {
  if (!model) {
    errors.push(`${source} ${id} has no model answer`);
    return;
  }
  
  // Split into paragraphs
  const paragraphs = model.trim().split(/\n\s*\n/);
  if (paragraphs.length !== 2) {
    errors.push(`${source} ${id} has ${paragraphs.length} paragraphs (expected 2)`);
  }
  
  // Check double quotes (either “...” or "...")
  const quotesCount = (model.match(/[“\"”]/g) || []).length;
  if (quotesCount < 4) {
    errors.push(`${source} ${id} has only ${quotesCount} quotes (expected at least 4)`);
  }
  
  // Check contextual knowledge [[...]]
  const contextCount = (model.match(/\[\[.*?\]\]/g) || []).length;
  if (contextCount < 2) {
    errors.push(`${source} ${id} has only ${contextCount} contextual brackets [[...]] (expected at least 2)`);
  }

  // Check provenance double braces {{...}}
  const provCount = (model.match(/\{\{.*?\}\}/g) || []).length;
  if (provCount < 2) {
    errors.push(`${source} ${id} has only ${provCount} provenance braces {{...}} (expected at least 2)`);
  }
  
  // Check if provenance utility words are used (e.g. useful, provenance)
  const lower = model.toLowerCase();
  if (!lower.includes('provenance')) {
    errors.push(`${source} ${id} is missing the word 'provenance'`);
  }
  if (!lower.includes('useful')) {
    errors.push(`${source} ${id} is missing the word 'useful'`);
  }
}

// 1. Verify EXAM_SKILLS_DATA.q3
console.log('--- Verifying EXAM_SKILLS_DATA.q3 ---');
for (const key in EXAM_SKILLS_DATA.q3) {
  checkModelAnswer(EXAM_SKILLS_DATA.q3[key].modela, key, 'EXAM_SKILLS_DATA.q3');
}

// 2. Verify PAST_PAPERS_DATA
console.log('--- Verifying PAST_PAPERS_DATA ---');
PAST_PAPERS_DATA.forEach(paper => {
  if (paper.q3a) {
    checkModelAnswer(paper.q3a.model, paper.id, 'PAST_PAPERS_DATA.q3a');
  }
});

// 3. Verify LESSONS_DATA
console.log('--- Verifying LESSONS_DATA ---');
for (const key in LESSONS_DATA) {
  const lesson = LESSONS_DATA[key];
  if (lesson.howUsefulAnalyser && lesson.howUsefulAnalyser.modelAnswer) {
    checkModelAnswer(lesson.howUsefulAnalyser.modelAnswer, key, 'LESSONS_DATA.howUsefulAnalyser');
  }
}

if (errors.length === 0) {
  console.log('ALL TESTS PASSED SUCCESSFULLY! No errors found.');
} else {
  console.error('TEST FAILURES FOUND:');
  errors.forEach(err => console.error(` - ${err}`));
  process.exit(1);
}
