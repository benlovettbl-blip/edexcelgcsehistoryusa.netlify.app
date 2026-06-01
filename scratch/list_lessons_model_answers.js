import { LESSONS_DATA } from '../src/lessons_data.js';

for (const key in LESSONS_DATA) {
  const lesson = LESSONS_DATA[key];
  if (lesson.howUsefulAnalyser && lesson.howUsefulAnalyser.modelAnswer) {
    console.log(`=== ${key} ===`);
    console.log(lesson.howUsefulAnalyser.modelAnswer);
    console.log();
  }
}
