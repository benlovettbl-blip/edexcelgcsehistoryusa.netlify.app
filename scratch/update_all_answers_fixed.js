import fs from 'fs';

// Helper to escape double quotes and format text for JavaScript single-line strings in JSON
function escapeForJSON(str) {
  return JSON.stringify(str).slice(1, -1);
}

// Helper to replace the modelAnswer inside lessons_data.js
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
  const escapedAnswer = escapeForJSON(newAnswer);
  
  return before + escapedAnswer + after;
}

// Fixed helper to locate the start of a question's definition block inside EXAM_SKILLS_DATA.q3 in questions.js
function findQuestionStartIndex(content, questionId) {
  const q3Start = content.indexOf('q3: {');
  if (q3Start === -1) throw new Error('q3 section not found in EXAM_SKILLS_DATA');

  // Try finding exactly as a nested property inside q3: {
  let idx = content.indexOf(`"${questionId}":`, q3Start);
  if (idx === -1) idx = content.indexOf(`'${questionId}':`, q3Start);
  if (idx === -1) idx = content.indexOf(`${questionId}:`, q3Start);
  
  // If not found as a direct child (e.g. mock exam defines it at the bottom as EXAM_SKILLS_DATA.q3["mock_exam_1"])
  if (idx === -1 || idx > content.indexOf('EXAM_SKILLS_DATA.q3["mock_exam_1"]')) {
    let mockIdx = content.indexOf(`EXAM_SKILLS_DATA.q3["${questionId}"]`);
    if (mockIdx === -1) mockIdx = content.indexOf(`EXAM_SKILLS_DATA.q3['${questionId}']`);
    if (mockIdx === -1) mockIdx = content.indexOf(`EXAM_SKILLS_DATA.q3.${questionId}`);
    if (mockIdx !== -1) idx = mockIdx;
  }

  if (idx === -1) throw new Error(`Could not find definition for question ${questionId}`);
  return idx;
}

// Helper to replace the modela inside questions.js
function replaceExamsModelAnswer(content, questionId, newAnswer) {
  const qIdx = findQuestionStartIndex(content, questionId);
  
  const maKey = 'modela: "';
  const maIdx = content.indexOf(maKey, qIdx);
  if (maIdx === -1) throw new Error(`modela key not found for ${questionId}`);

  const valStartIdx = maIdx + maKey.length;
  
  // Find closing unescaped double quote
  let valEndIdx = -1;
  for (let i = valStartIdx; i < content.length; i++) {
    if (content[i] === '"' && content[i - 1] !== '\\') {
      valEndIdx = i;
      break;
    }
  }
  
  if (valEndIdx === -1) throw new Error(`Closing quote not found for ${questionId}`);

  const before = content.substring(0, valStartIdx);
  const after = content.substring(valEndIdx);
  const escapedAnswer = escapeForJSON(newAnswer);
  
  return before + escapedAnswer + after;
}

// Load the database source texts from update_all_answers.js by reading the file and extracting the variables
// Wait, to be safe, we can import them directly from update_all_answers.js since it's ES module
import { LESSON_ANSWERS, EXAM_ANSWERS } from './update_all_answers.js';

console.log('Starting fixed rewrites in src/lessons_data.js...');
let lessonsText = fs.readFileSync('./src/lessons_data.js', 'utf8');

for (const [subtopicId, newAnswer] of Object.entries(LESSON_ANSWERS)) {
  try {
    lessonsText = replaceModelAnswer(lessonsText, subtopicId, newAnswer);
    console.log(`- Successfully updated subtopic: ${subtopicId}`);
  } catch (err) {
    console.error(`- Error updating ${subtopicId}:`, err.message);
  }
}

fs.writeFileSync('./src/lessons_data.js', lessonsText, 'utf8');
console.log('Saved src/lessons_data.js.');

console.log('\nStarting fixed rewrites in questions.js...');
let questionsText = fs.readFileSync('./questions.js', 'utf8');

for (const [questionId, newAnswer] of Object.entries(EXAM_ANSWERS)) {
  try {
    questionsText = replaceExamsModelAnswer(questionsText, questionId, newAnswer);
    console.log(`- Successfully updated question: ${questionId}`);
  } catch (err) {
    console.error(`- Error updating ${questionId}:`, err.message);
  }
}

fs.writeFileSync('./questions.js', questionsText, 'utf8');
console.log('Saved questions.js.');
