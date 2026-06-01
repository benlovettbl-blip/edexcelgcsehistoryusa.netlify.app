const fs = require('fs');
const path = require('path');
const vm = require('vm');

const code = fs.readFileSync(path.join(__dirname, '..', 'questions.js'), 'utf8').replace(/export const/g, 'var');
const sandbox = {};
vm.runInContext(code, vm.createContext(sandbox));

sandbox.QUIZ_DATA.forEach(topic => {
  console.log(`Topic: ${topic.title}`);
  topic.subtopics.forEach(sub => {
    const stdCount = sub.standard ? sub.standard.length : 0;
    const dpCount = sub.depth ? sub.depth.length : 0;
    console.log(`  - Subtopic ${sub.id}: standard=${stdCount}, depth=${dpCount}, total=${stdCount + dpCount}`);
  });
});
