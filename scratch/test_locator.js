import fs from 'fs';

const content = fs.readFileSync('questions.js', 'utf8');

const keys = [
  'q3_1', 'q3_2', 'p_2019_q3', 'p_2020_q3', 'p_2022_q3', 'p_2023_q3', 'p_2024_q3', 'p_2025_q3',
  'mock_exam_1', 'mock_exam_2', 'mock_exam_3', 'mock_exam_4', 'mock_exam_5', 'mock_exam_6', 'mock_exam_7'
];

keys.forEach(k => {
  // Let's search inside the 'q3: {' block for the key
  const q3Start = content.indexOf('q3: {');
  if (q3Start === -1) {
    console.log('q3: { not found!');
    return;
  }
  
  let idx = content.indexOf(`"${k}":`, q3Start);
  if (idx === -1) idx = content.indexOf(`'${k}':`, q3Start);
  if (idx === -1) idx = content.indexOf(`${k}:`, q3Start);
  
  // If still not found, try mock style definition EXAM_SKILLS_DATA.q3["mock_exam_1"]
  if (idx === -1 || idx > content.indexOf('EXAM_SKILLS_DATA.q3["mock_exam_1"]')) {
    let mockIdx = content.indexOf(`EXAM_SKILLS_DATA.q3["${k}"]`);
    if (mockIdx === -1) mockIdx = content.indexOf(`EXAM_SKILLS_DATA.q3['${k}']`);
    if (mockIdx === -1) mockIdx = content.indexOf(`EXAM_SKILLS_DATA.q3.${k}`);
    if (mockIdx !== -1) idx = mockIdx;
  }
  
  if (idx === -1) {
    console.log('Failed for:', k);
  } else {
    console.log('Success for:', k, 'at index:', idx, 'preview:', content.substring(idx, idx + 80).replace(/\r?\n/g, ' '));
  }
});
