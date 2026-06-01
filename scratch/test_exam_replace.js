import fs from 'fs';

function findQuestionIndex(content, questionId) {
  let qIdx = content.indexOf(`"${questionId}"`);
  if (qIdx === -1) {
    qIdx = content.indexOf(`['${questionId}']`);
  }
  if (qIdx === -1) {
    qIdx = content.indexOf(`["${questionId}"]`);
  }
  if (qIdx === -1) {
    qIdx = content.indexOf(`${questionId}:`);
  }
  return qIdx;
}

const content = fs.readFileSync('./questions.js', 'utf8');

const testIds = ['q3_1', 'mock_exam_1', 'p_2019_q3'];
testIds.forEach(id => {
  const idx = findQuestionIndex(content, id);
  console.log(`ID: ${id} -> Index: ${idx} (${idx !== -1 ? 'Found' : 'NOT Found'})`);
});
