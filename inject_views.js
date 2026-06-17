const fs = require('fs');

let viewsJs = fs.readFileSync('src/views.js', 'utf8');
let extracted = fs.readFileSync('extracted_active_figures.js', 'utf8');

if (!viewsJs.includes('export const activeFigures')) {
    fs.appendFileSync('src/views.js', '\n' + extracted + '\n');
    console.log("Successfully injected activeFigures and renderKeyIndividualsView.");
} else {
    console.log("Already exists.");
}
