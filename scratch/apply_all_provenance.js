import fs from 'fs';
import { LESSONS_DATA } from '../src/lessons_data.js';
import { EXAM_SKILLS_DATA, PAST_PAPERS_DATA } from '../questions.js';

// Helper to wrap provenance in a single paragraph
function wrapProvenanceInParagraph(p) {
  // Let us find the sentence that contains "provenance" (case-insensitive)
  const sentences = p.split(/(?<=[.!?])\s+(?=[A-Z“])/);
  let provIndex = -1;
  for (let i = 0; i < sentences.length; i++) {
    if (sentences[i].toLowerCase().includes('provenance')) {
      provIndex = i;
      break;
    }
  }
  if (provIndex === -1) return p;
  
  const before = sentences.slice(0, provIndex).join(' ');
  const after = sentences.slice(provIndex).join(' ');
  return `${before} {{${after}}}`;
}

// Process a model answer string (with 2 paragraphs)
function processModelAnswer(text) {
  if (!text) return '';
  const paragraphs = text.trim().split(/\n\s*\n/);
  const processed = paragraphs.map(p => wrapProvenanceInParagraph(p));
  return processed.join('\n\n');
}

// 1. Process src/lessons_data.js
console.log('--- Processing src/lessons_data.js ---');
let lessonsContent = fs.readFileSync('src/lessons_data.js', 'utf8');
let lessonsReplaced = 0;

for (const key in LESSONS_DATA) {
  const lesson = LESSONS_DATA[key];
  if (lesson.howUsefulAnalyser && lesson.howUsefulAnalyser.modelAnswer) {
    const oldModel = lesson.howUsefulAnalyser.modelAnswer;
    const newModel = processModelAnswer(oldModel);
    
    const oldSerialized = JSON.stringify(oldModel);
    const newSerialized = JSON.stringify(newModel);
    
    if (lessonsContent.includes(oldSerialized)) {
      lessonsContent = lessonsContent.replace(oldSerialized, newSerialized);
      lessonsReplaced++;
      console.log(`Replaced lesson model for: ${key}`);
    } else {
      console.warn(`Could not find serialized model answer in lessons_data.js for ${key}`);
    }
  }
}
fs.writeFileSync('src/lessons_data.js', lessonsContent, 'utf8');
console.log(`Lessons updated: ${lessonsReplaced}/16`);

// 2. Process questions.js
console.log('\n--- Processing questions.js ---');
let questionsContent = fs.readFileSync('questions.js', 'utf8');
let questionsReplaced = 0;

for (const key in EXAM_SKILLS_DATA.q3) {
  const oldModel = EXAM_SKILLS_DATA.q3[key].modela;
  if (!oldModel) continue;
  const newModel = processModelAnswer(oldModel);
  
  const oldSerialized = JSON.stringify(oldModel);
  const newSerialized = JSON.stringify(newModel);
  
  if (questionsContent.includes(oldSerialized)) {
    const count = questionsContent.split(oldSerialized).length - 1;
    questionsContent = questionsContent.split(oldSerialized).join(newSerialized);
    questionsReplaced += count;
    console.log(`Replaced questions key ${key} (${count} occurrences)`);
  } else {
    console.warn(`Could not find old serialized model answer for questions key ${key}`);
  }
}

fs.writeFileSync('questions.js', questionsContent, 'utf8');
console.log(`Questions updated total replacements: ${questionsReplaced}`);
