const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');

// Strip "export" and change const to var for all
const stripped = content.replace(/export const/g, 'var').replace(/export /g, '');

// Evaluate in a function to isolate
const fn = new Function('stripped', stripped + '\nreturn { EXAM_SKILLS_DATA };');
const result = fn();

console.log("=== Q2 EXAMPLE (q2_1) ===");
console.log(JSON.stringify(result.EXAM_SKILLS_DATA.q2.q2_1, null, 2));
