const fs = require('fs');
const file = 'src/views.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('const isUnlocked = forceUnlock || totalXP >= requiredXP;', 'const isUnlocked = true; // forceUnlock || totalXP >= requiredXP;');
fs.writeFileSync(file, content, 'utf8');
