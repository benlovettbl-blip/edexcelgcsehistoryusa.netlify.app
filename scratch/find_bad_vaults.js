const fs = require('fs');
const sandbox = { global: {} };
const vm = require('vm');

const code = fs.readFileSync('src/lessons_data.js', 'utf8')
  .replace('export const LESSONS_DATA =', 'global.LESSONS_DATA =');

vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const data = sandbox.global.LESSONS_DATA;

for (const [key, sub] of Object.entries(data)) {
  if (sub.questionVault) {
    sub.questionVault.forEach((v, vIdx) => {
      if (v.sourceB || v.interpretation1 || v.sourceC || v.interpretation2) {
        console.log(`Subtopic ${key} has a bad vault question at index ${vIdx}:`, Object.keys(v));
      }
    });
  }
}
