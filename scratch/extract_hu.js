import { LESSONS_DATA } from '../src/lessons_data.js';

Object.entries(LESSONS_DATA).forEach(([k, v]) => {
  if (v.howUsefulAnalyser) {
    console.log(`=== ${k} ===`);
    console.log(`Question: ${v.howUsefulAnalyser.question}`);
    console.log(`Source D content: ${v.howUsefulAnalyser.sourceD.content}`);
    console.log(`Source E content: ${v.howUsefulAnalyser.sourceE.content}`);
    console.log(`Model Answer:\n${v.howUsefulAnalyser.modelAnswer}\n`);
  }
});
