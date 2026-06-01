import { LESSONS_DATA } from '../src/lessons_data.js';
import { EXAM_SKILLS_DATA } from '../questions.js';

console.log('=== LESSONS Q2 MODEL ANSWERS ===');
Object.entries(LESSONS_DATA).forEach(([k, v]) => {
  if (v.questionVault && v.questionVault['0']) {
    const q = v.questionVault['0'];
    const isWhy = q.question && q.question.toLowerCase().includes('why');
    if (isWhy) {
      console.log(`\n--- subtopic ${k} ---`);
      console.log(`Question: ${q.question}`);
      console.log(`Answer:\n${q.answer}`);
    }
  }
});

console.log('\n=== EXAM Q2 MODEL ANSWERS ===');
if (EXAM_SKILLS_DATA.q2) {
  Object.entries(EXAM_SKILLS_DATA.q2).forEach(([k, v]) => {
    console.log(`\n--- exam Q2 ${k} ---`);
    console.log(`Question: ${v.question}`);
    console.log(`Answer:\n${v.model}`);
  });
}
