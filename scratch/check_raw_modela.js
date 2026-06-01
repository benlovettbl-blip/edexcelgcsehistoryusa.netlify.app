const fs = require('fs');

const content = fs.readFileSync('questions.js', 'utf8');

function showModelA(key) {
  const keyIdx = content.indexOf(key);
  if (keyIdx === -1) {
    console.log(`${key} not found`);
    return;
  }
  const modelIdx = content.indexOf('modela:', keyIdx);
  if (modelIdx !== -1) {
    console.log(`=== ${key} modela ===`);
    console.log(content.substring(modelIdx, modelIdx + 300));
  } else {
    console.log(`modela not found after ${key}`);
  }
}

showModelA('q3_1');
showModelA('mock_exam_4');
