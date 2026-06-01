const fs = require('fs');
const content = fs.readFileSync('questions.js', 'utf8');
const q2Start = content.indexOf('q2: {');
const q2End = content.indexOf('q3: {');
const q2Text = content.substring(q2Start, q2End);

const regex = /"p_\d{4}_q[123]":|"[a-z0-9_]+":/g;
let match;
console.log("Keys found in q2 section:");
while ((match = regex.exec(q2Text)) !== null) {
  console.log(match[0]);
}
