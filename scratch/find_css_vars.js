const fs = require('fs');
const path = require('path');

const content = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const rootMatch = content.match(/:root\s*\{([\s\S]*?)\}/);

if (rootMatch) {
  console.log("CSS Variables in :root:");
  console.log(rootMatch[1].trim());
} else {
  console.log("Could not find :root variables in style.css");
}
