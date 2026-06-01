const fs = require('fs');

const logPath = 'C:\\Users\\fives\\.gemini\\antigravity\\brain\\3cd8e349-b86d-4e8a-b37b-b5f756266f88\\.system_generated\\tasks\\task-1304.log';
if (!fs.existsSync(logPath)) {
  console.log("Log not found");
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const regex = /URI\((https?:\/\/[^\)]+youtube[^\)]+)\)/gi;
let match;

// Let's print each match and 200 characters before and after in the log file
while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  const idx = match.index;
  const start = Math.max(0, idx - 300);
  const end = Math.min(content.length, idx + 300);
  console.log("====================================");
  console.log("URL:", url);
  console.log("CONTEXT:", content.substring(start, end).replace(/\r\n/g, ' ').replace(/\n/g, ' '));
}
