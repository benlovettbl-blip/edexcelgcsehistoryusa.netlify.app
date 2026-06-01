import { LESSONS_DATA } from '../src/lessons_data.js';

for (const key in LESSONS_DATA) {
  const lesson = LESSONS_DATA[key];
  if (lesson.questionVault) {
    lesson.questionVault.forEach((q, idx) => {
      if (q.answer && (q.answer.includes('[[') || q.answer.includes('{{'))) {
        console.log(`Key ${key}, Q idx ${idx}:`);
        console.log(q.answer);
        console.log('------------------');
      }
    });
  }
}
