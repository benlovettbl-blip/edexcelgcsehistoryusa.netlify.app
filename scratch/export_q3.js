import { EXAM_SKILLS_DATA } from '../questions.js';
import fs from 'fs';

const data = {};
for (const key in EXAM_SKILLS_DATA.q3) {
  const q = EXAM_SKILLS_DATA.q3[key];
  data[key] = {
    questiona: q.questiona,
    sourceB: q.sourceB,
    sourceC: q.sourceC
  };
}

fs.writeFileSync('scratch/all_q3_data.json', JSON.stringify(data, null, 2));
console.log('Saved to scratch/all_q3_data.json');
