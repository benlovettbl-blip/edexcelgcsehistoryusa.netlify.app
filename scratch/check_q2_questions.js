import { EXAM_SKILLS_DATA, PAST_PAPERS_DATA } from '../questions.js';

console.log('--- Checking EXAM_SKILLS_DATA.q2 ---');
if (EXAM_SKILLS_DATA.q2) {
  Object.entries(EXAM_SKILLS_DATA.q2).forEach(([k, v]) => {
    const hasStim1 = !!v.stimulus1;
    const hasStim2 = !!v.stimulus2;
    const hasClue = !!v.clue;
    const hasQuestion = !!v.question;
    const isWhy = v.question && v.question.toLowerCase().includes('why');
    console.log(`- ${k}: isWhy=${isWhy}, hasQuestion=${hasQuestion}, stimulus1="${v.stimulus1}", stimulus2="${v.stimulus2}", hasClue=${hasClue}`);
  });
}

console.log('\n--- Checking PAST_PAPERS_DATA q2 ---');
PAST_PAPERS_DATA.forEach(paper => {
  if (paper.q2) {
    const q = paper.q2;
    const hasStim = q.stimulus && q.stimulus.length > 0;
    const stimCount = q.stimulus ? q.stimulus.length : 0;
    const hasClue = !!q.clue;
    const isWhy = q.question && q.question.toLowerCase().includes('why');
    console.log(`- paper ${paper.id}: isWhy=${isWhy}, question="${q.question}", stimCount=${stimCount}, stimulus=${JSON.stringify(q.stimulus)}, hasClue=${hasClue}`);
  }
});
