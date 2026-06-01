const fs = require('fs');
try {
  const content = fs.readFileSync('C:\\Users\\fives\\\.gemini\\antigravity\\scratch\\firefly_recall_quizzes\\consequence_dump.txt', 'utf16le');
  fs.writeFileSync('C:\\Users\\fives\\\.gemini\\antigravity\\scratch\\firefly_recall_quizzes\\consequence_dump_utf8.txt', content, 'utf8');
  console.log('Conversion successful. Length of content:', content.length);
} catch (e) {
  console.error('Error during conversion:', e);
}
