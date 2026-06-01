const fs = require('fs');
const path = require('path');

const contentPath = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\647b312b-6ed3-4ff0-8837-e204b6f5134c\\.system_generated\\steps\\980\\content.md';
const content = fs.readFileSync(contentPath, 'utf8');

// Regex for youtube ID patterns
const regexes = [
  /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/g,
  /youtube\.com\/embed\/([a-zA-Z0-9_-]+)/g,
  /youtu\.be\/([a-zA-Z0-9_-]+)/g,
  /"youtubeId"\s*:\s*"([a-zA-Z0-9_-]+)"/g,
  /video_id\s*:\s*"([a-zA-Z0-9_-]+)"/g
];

console.log("Searching for YouTube patterns...");
for (const regex of regexes) {
  let match;
  while ((match = regex.exec(content)) !== null) {
    console.log(`Found pattern match: ${match[0]} -> ID: ${match[1]}`);
  }
}
