import { LESSONS_DATA } from '../src/lessons_data.js';
import { EXAM_SKILLS_DATA } from '../questions.js';

function wrapProvenanceInParagraph(p) {
  // Let us find the sentence that contains "provenance" (case-insensitive)
  // Sentences are separated by periods followed by space or capital letter.
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

function processModelAnswer(text) {
  const paragraphs = text.trim().split(/\n\s*\n/);
  const processed = paragraphs.map(p => wrapProvenanceInParagraph(p));
  return processed.join('\n\n');
}

console.log('=== TESTING LESSONS_DATA ===');
for (const key in LESSONS_DATA) {
  const lesson = LESSONS_DATA[key];
  if (lesson.howUsefulAnalyser && lesson.howUsefulAnalyser.modelAnswer) {
    const original = lesson.howUsefulAnalyser.modelAnswer;
    const result = processModelAnswer(original);
    console.log(`Key ${key}:`);
    console.log(result);
    console.log('----------------------------------------------------');
  }
}
