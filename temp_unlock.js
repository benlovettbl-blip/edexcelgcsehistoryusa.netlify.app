const fs = require('fs');
const file = 'src/views.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('const isUnlocked = totalXP >= requiredXP;', 'const isUnlocked = true; // TEMPORARY UNLOCK');
fs.writeFileSync(file, content, 'utf8');
