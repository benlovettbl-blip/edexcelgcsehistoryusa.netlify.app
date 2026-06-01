const fs = require('fs');
const sandbox = { global: {} };
const vm = require('vm');

const code = fs.readFileSync('src/lessons_data.js', 'utf8')
  .replace('export const LESSONS_DATA =', 'global.LESSONS_DATA =');

vm.createContext(sandbox);
vm.runInContext(code, sandbox);
const data = sandbox.global.LESSONS_DATA;

console.log("=== subtopic_1_1 Vault ===");
console.log(JSON.stringify(data.subtopic_1_1.questionVault, null, 2));

console.log("=== subtopic_3_1 Vault ===");
console.log(JSON.stringify(data.subtopic_3_1.questionVault, null, 2));
