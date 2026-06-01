import { LESSONS_DATA } from '../src/lessons_data.js';
import fs from 'fs';

const content = fs.readFileSync('src/lessons_data.js', 'utf8');

for (const key in LESSONS_DATA) {
  const lesson = LESSONS_DATA[key];
  if (lesson.howUsefulAnalyser && lesson.howUsefulAnalyser.modelAnswer) {
    const oldModel = lesson.howUsefulAnalyser.modelAnswer;
    const serialized = JSON.stringify(oldModel);
    const found = content.includes(serialized);
    console.log(`Key ${key}: found? ${found}`);
  }
}
