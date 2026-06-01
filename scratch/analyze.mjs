import { PAST_PAPERS_DATA, EXAM_SKILLS_DATA } from '../questions.js';

const examModel = EXAM_SKILLS_DATA.q3.mock_exam_3.modela;
const paperModel = PAST_PAPERS_DATA.find(p => p.id === 'mock_exam_3').q3a.model;

console.log('Exam model length:', examModel.length);
console.log('Paper model length:', paperModel.length);
console.log('Are they identical?', examModel === paperModel);
console.log('Exam Model:', examModel);
console.log('Paper Model:', paperModel);
