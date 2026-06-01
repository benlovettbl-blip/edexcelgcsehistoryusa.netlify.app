import fs from 'fs';

function replaceModelAnswer(content, subtopicId, newAnswer) {
  const subtopicIdx = content.indexOf(`"${subtopicId}":`);
  if (subtopicIdx === -1) throw new Error(`Subtopic ${subtopicId} not found`);

  const huIdx = content.indexOf('"howUsefulAnalyser":', subtopicIdx);
  if (huIdx === -1) throw new Error(`howUsefulAnalyser not found for ${subtopicId}`);

  const maKey = '"modelAnswer": "';
  const maIdx = content.indexOf(maKey, huIdx);
  if (maIdx === -1) throw new Error(`modelAnswer key not found for ${subtopicId}`);

  const valStartIdx = maIdx + maKey.length;
  
  // Find closing unescaped double quote
  let valEndIdx = -1;
  for (let i = valStartIdx; i < content.length; i++) {
    if (content[i] === '"' && content[i - 1] !== '\\') {
      valEndIdx = i;
      break;
    }
  }
  
  if (valEndIdx === -1) throw new Error(`Closing quote not found for ${subtopicId}`);

  const before = content.substring(0, valStartIdx);
  const after = content.substring(valEndIdx);
  const escapedAnswer = JSON.stringify(newAnswer).slice(1, -1);
  
  return before + escapedAnswer + after;
}

const content = fs.readFileSync('./src/lessons_data.js', 'utf8');
const testNewAnswer = 'THIS IS A TEST NEW ANSWER';
const updated = replaceModelAnswer(content, 'subtopic_1_1', testNewAnswer);
console.log('Successfully updated!');

// Check if the change is there
const checkIdx = updated.indexOf('"modelAnswer": "THIS IS A TEST NEW ANSWER"');
if (checkIdx !== -1) {
  console.log('Verified: Replacement is correct!');
} else {
  console.log('Failed: Replacement not found!');
}
