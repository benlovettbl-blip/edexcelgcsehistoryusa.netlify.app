const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');

// Strip "export" and change const to var for all
const stripped = content.replace(/export const/g, 'var').replace(/export /g, '');

// Evaluate in a function to isolate
const sandbox = {};
const fn = new Function('sandbox', stripped + '\nreturn { QUIZ_DATA, EXAM_SKILLS_DATA, PAST_PAPERS_DATA };');
const result = fn();

console.log("EXAM_SKILLS_DATA keys:", Object.keys(result.EXAM_SKILLS_DATA));
console.log("q1 keys:", Object.keys(result.EXAM_SKILLS_DATA.q1));
console.log("q2 keys:", Object.keys(result.EXAM_SKILLS_DATA.q2));
console.log("q3 keys:", Object.keys(result.EXAM_SKILLS_DATA.q3));

const firstQ1 = Object.keys(result.EXAM_SKILLS_DATA.q1)[0];
console.log("\nQ1 Item (example):", firstQ1);
console.log(Object.keys(result.EXAM_SKILLS_DATA.q1[firstQ1]));

const firstQ2 = Object.keys(result.EXAM_SKILLS_DATA.q2)[0];
console.log("\nQ2 Item (example):", firstQ2);
console.log(Object.keys(result.EXAM_SKILLS_DATA.q2[firstQ2]));

const firstQ3 = Object.keys(result.EXAM_SKILLS_DATA.q3)[0];
console.log("\nQ3 Item (example):", firstQ3);
console.log(Object.keys(result.EXAM_SKILLS_DATA.q3[firstQ3]));
