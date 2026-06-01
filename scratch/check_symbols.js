import { LESSONS_DATA } from '../src/lessons_data.js';
import { EXAM_SKILLS_DATA } from '../questions.js';

function check(text, name) {
  if (!text) return;
  const ob = (text.match(/\[\[/g) || []).length;
  const cb = (text.match(/\]\]/g) || []).length;
  const oc = (text.match(/\{\{/g) || []).length;
  const cc = (text.match(/\}\}/g) || []).length;
  
  const hasNestedBraces = (text.match(/\{\{[^{}]*\{\{/g) || []).length > 0;
  const hasNestedBrackets = (text.match(/\[\[[^\[\]]*\[\[/g) || []).length > 0;
  
  // also check if there is any unmatched single [ or { or } or ] that looks like a typo, e.g. {{ without }}
  if (ob !== cb || oc !== cc || hasNestedBraces || hasNestedBrackets) {
    console.log(`Mismatch/Nested in ${name}: ob=${ob}, cb=${cb}, oc=${oc}, cc=${cc}, nestedBraces=${hasNestedBraces}, nestedBrackets=${hasNestedBrackets}`);
    console.log(`Content snippet: ${text.substring(0, 150)}...\n`);
  }
}

console.log('--- Checking lessons_data ---');
Object.entries(LESSONS_DATA).forEach(([k, v]) => {
  if (v.howUsefulAnalyser && v.howUsefulAnalyser.modelAnswer) {
    check(v.howUsefulAnalyser.modelAnswer, `lessons_data: ${k}`);
  }
});

console.log('--- Checking questions.js ---');
if (EXAM_SKILLS_DATA.q1) {
  Object.entries(EXAM_SKILLS_DATA.q1).forEach(([k, v]) => {
    if (v.model) check(v.model, `q1: ${k}`);
  });
}
if (EXAM_SKILLS_DATA.q2) {
  Object.entries(EXAM_SKILLS_DATA.q2).forEach(([k, v]) => {
    if (v.model) check(v.model, `q2: ${k}`);
  });
}
if (EXAM_SKILLS_DATA.q3) {
  Object.entries(EXAM_SKILLS_DATA.q3).forEach(([k, v]) => {
    if (v.modela) check(v.modela, `q3: ${k} (modela)`);
    if (v.modelb) check(v.modelb, `q3: ${k} (modelb)`);
    if (v.modelc) check(v.modelc, `q3: ${k} (modelc)`);
    if (v.modeld) check(v.modeld, `q3: ${k} (modeld)`);
  });
}
