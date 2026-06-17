const fs = require('fs');
const execSync = require('child_process').execSync;

let viewsJs = execSync('git show b6086ac:src/views.js').toString();
const startIdx = viewsJs.indexOf('export function renderKeyIndividualsView() {');
const endIdx = viewsJs.indexOf('window.renderKeyIndividualsView = renderKeyIndividualsView;');

if (startIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_key_individuals.js', viewsJs.substring(startIdx, endIdx), 'utf8');
    console.log("Extracted renderKeyIndividualsView.");
} else {
    console.log("Could not find function bounds.");
}
