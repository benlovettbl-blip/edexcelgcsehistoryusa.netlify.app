const q = require('../questions.js');
let countQ = 0, countB = 0;
Object.values(q.EXAM_SKILLS_DATA.q3).forEach(v => {
  if (v.modela) {
    if (v.modela.includes('"') || v.modela.includes('“')) countQ++;
    if (v.modela.includes('[[')) countB++;
  }
});
console.log('EXAM_SKILLS_DATA.q3:');
console.log('  with quotes:', countQ);
console.log('  with brackets [[...]]:', countB);

let countQ_pp = 0, countB_pp = 0;
q.PAST_PAPERS_DATA.forEach(p => {
  if (p.q3a && p.q3a.model) {
    if (p.q3a.model.includes('"') || p.q3a.model.includes('“')) countQ_pp++;
    if (p.q3a.model.includes('[[')) countB_pp++;
  }
});
console.log('PAST_PAPERS_DATA:');
console.log('  with quotes:', countQ_pp);
console.log('  with brackets [[...]]:', countB_pp);
