import { LESSONS_DATA } from '../src/lessons_data.js';
import { EXAM_SKILLS_DATA } from '../questions.js';

console.log('=== LESSONS DATA HOW USEFUL ===');
Object.entries(LESSONS_DATA).forEach(([k, v]) => {
  if (v.howUsefulAnalyser && v.howUsefulAnalyser.modelAnswer) {
    const ma = v.howUsefulAnalyser.modelAnswer;
    const hasNestedBraces = (ma.match(/\{\{[^{}]*\{\{/g) || []).length > 0;
    const countBraces = (ma.match(/\{\{/g) || []).length;
    const countBrackets = (ma.match(/\[\[/g) || []).length;
    console.log(`- ${k}: Braces: ${countBraces}, Brackets: ${countBrackets}, Nested Braces: ${hasNestedBraces}`);
  }
});

console.log('\n=== EXAM SKILLS DATA HOW USEFUL (Q3a modela) ===');
Object.entries(EXAM_SKILLS_DATA.q3).forEach(([k, v]) => {
  if (v.modela) {
    const ma = v.modela;
    const hasNestedBraces = (ma.match(/\{\{[^{}]*\{\{/g) || []).length > 0;
    const countBraces = (ma.match(/\{\{/g) || []).length;
    const countBrackets = (ma.match(/\[\[/g) || []).length;
    console.log(`- ${k}: Braces: ${countBraces}, Brackets: ${countBrackets}, Nested Braces: ${hasNestedBraces}`);
  }
});
