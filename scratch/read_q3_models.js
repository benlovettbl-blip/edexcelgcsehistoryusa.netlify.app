const fs = require('fs');

const content = fs.readFileSync('questions.js', 'utf8');

const commonjsContent = content
  .replace(/export\s+const\s+(\w+)/g, 'const $1')
  .replace(/export\s+default/g, '//')
  .replace(/export\s+\{([\s\S]*?)\}/g, '//');

const sandbox = {
  window: {},
  PAST_PAPERS_DATA: []
};

const run = new Function('sandbox', commonjsContent + '\nreturn { EXAM_SKILLS_DATA, PAST_PAPERS_DATA };');
const { EXAM_SKILLS_DATA } = run(sandbox);

const q3Data = EXAM_SKILLS_DATA.q3;

let output = '';
output += JSON.stringify(Object.keys(q3Data), null, 2) + '\n\n';

for (const key of Object.keys(q3Data)) {
  output += `=== KEY: ${key} ===\n`;
  output += `MODEL C:\n${q3Data[key].modelc}\n\n`;
  output += `MODEL D:\n${q3Data[key].modeld}\n\n`;
}

fs.writeFileSync('scratch/q3_original_models.txt', output, 'utf8');
console.log('Done!');
