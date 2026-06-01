const q = require('../questions.js');

console.log("=== EXAM_SKILLS_DATA.q3 Model Answers ===");
Object.entries(q.EXAM_SKILLS_DATA.q3).forEach(([key, val]) => {
  console.log(`\nKey: ${key}`);
  console.log(`Question: ${val.questiona || val.question}`);
  console.log(`Source B Prov: ${val.sourceB.provenance}`);
  console.log(`Source B Content: ${val.sourceB.content.substring(0, 100)}...`);
  console.log(`Source C Prov: ${val.sourceC.provenance}`);
  console.log(`Source C Content: ${val.sourceC.content.substring(0, 100)}...`);
  console.log(`Model Answer: ${val.modela}`);
});
