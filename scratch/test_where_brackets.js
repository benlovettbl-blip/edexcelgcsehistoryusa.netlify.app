const q = require('../questions.js');

console.log("Checking where [[ is used in questions.js:");

function checkObj(obj, path) {
  if (!obj) return;
  if (typeof obj === 'string') {
    if (obj.includes('[[')) {
      console.log(`Found [[ in string at ${path}`);
    }
    return;
  }
  if (typeof obj === 'object') {
    Object.keys(obj).forEach(k => {
      checkObj(obj[k], `${path}.${k}`);
    });
  }
}

checkObj(q.EXAM_SKILLS_DATA, 'EXAM_SKILLS_DATA');
checkObj(q.PAST_PAPERS_DATA, 'PAST_PAPERS_DATA');
