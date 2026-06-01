const fs = require('fs');
const code = fs.readFileSync('questions.js', 'utf8');

const targetStr = 'id: "mock_exam_1"';
const idx = code.indexOf(targetStr);
if (idx !== -1) {
  // Find where q3a is defined after this point
  const q3aIdx = code.indexOf('q3a:', idx);
  console.log(code.substring(q3aIdx, q3aIdx + 400));
} else {
  console.log('Not found');
}
