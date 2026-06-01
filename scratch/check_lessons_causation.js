import { LESSONS_DATA } from '../src/lessons_data.js';

console.log('--- Auditing Lessons questionVault for Causation Questions ---');
Object.entries(LESSONS_DATA).forEach(([k, v]) => {
  if (v.questionVault) {
    Object.entries(v.questionVault).forEach(([qKey, q]) => {
      const isWhy = q.question && q.question.toLowerCase().includes('why');
      if (isWhy) {
        const hasStim1 = !!q.stimulus1;
        const hasStim2 = !!q.stimulus2;
        const hasClue = !!q.clue;
        console.log(`- subtopic ${k} (qKey=${qKey}): question="${q.question}", stimulus1="${q.stimulus1}", stimulus2="${q.stimulus2}", hasClue=${hasClue}`);
        if (!hasStim1 || !hasStim2 || !hasClue) {
          console.log(`  WARNING: Missing elements in ${k}!`);
        }
      }
    });
  }
});
