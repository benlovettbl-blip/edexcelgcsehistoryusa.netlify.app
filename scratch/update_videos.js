const fs = require('fs');

let content = fs.readFileSync('questions.js', 'utf8');

const subtopics = [
  '1_1', '1_2', '1_3', '1_4',
  '2_1', '2_2', '2_3', '2_4',
  '3_1', '3_2', '3_3', '3_4',
  '4_1', '4_2', '4_3', '4_4'
];

let idx = 0;
content = content.replace(/embedVideo:\s*"[^"]+"/g, (match) => {
  const sub = subtopics[idx++];
  return `embedVideo: "videos/subtopic_${sub}.mp4"`;
});

fs.writeFileSync('questions.js', content, 'utf8');
console.log('Successfully updated questions.js with local video paths!');
