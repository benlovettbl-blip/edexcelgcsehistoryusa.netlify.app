const fs = require('fs');
let code = fs.readFileSync('src/views.js', 'utf8');
code = code.replace('container.innerHTML = "";', 'container.innerHTML = "";\n    console.log("activeFigures length:", activeFigures.length);');
fs.writeFileSync('src/views.js', code, 'utf8');
