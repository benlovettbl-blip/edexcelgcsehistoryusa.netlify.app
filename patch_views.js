const fs = require('fs');
let code = fs.readFileSync('src/views.js', 'utf8');
code += '\nwindow.renderKeyIndividualsView = renderKeyIndividualsView;\n';
fs.writeFileSync('src/views.js', code, 'utf8');
