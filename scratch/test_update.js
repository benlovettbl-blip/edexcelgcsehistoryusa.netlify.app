import fs from 'fs';

let content = fs.readFileSync('./src/lessons_data.js', 'utf8');

// Match subtopic_1_1 howUsefulAnalyser modelAnswer
const subtopicId = 'subtopic_1_1';
const regex = new RegExp(`("${subtopicId}":\\s*\\{[\\s\S]*?"howUsefulAnalyser":\\s*\\{[\\s\S]*?"modelAnswer":\\s*")([\\s\\S]*?)("\\s*\\},)`, 'g');

const match = content.match(regex);
if (match) {
  console.log('Found match!');
  // Let's print the first 100 characters of the matched modelAnswer
  console.log(match[0].substring(0, 300));
} else {
  console.log('Match not found!');
}
