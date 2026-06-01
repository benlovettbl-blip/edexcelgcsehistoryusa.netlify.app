const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');
const stripped = content.replace(/export const/g, 'var').replace(/export /g, '');
const fn = new Function('stripped', stripped + '\nreturn { EXAM_SKILLS_DATA };');
const result = fn();

for (const k of Object.keys(result.EXAM_SKILLS_DATA.q2)) {
  const item = result.EXAM_SKILLS_DATA.q2[k];
  console.log(k, "keys:", Object.keys(item).filter(x => x.startsWith('stimulus') || x === 'stimulus'));
}
