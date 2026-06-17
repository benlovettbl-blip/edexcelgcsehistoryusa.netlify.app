const fs = require('fs');
const execSync = require('child_process').execSync;

let viewsJs = execSync('git show b6086ac:src/views.js').toString();

const activeFigIdx = viewsJs.indexOf('export const activeFigures = [');
const renderFigIdx = viewsJs.indexOf('export function renderKeyIndividualsView() {');
const endIdx = viewsJs.indexOf('window.renderKeyIndividualsView = renderKeyIndividualsView;');

if (activeFigIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_active_figures.js', viewsJs.substring(activeFigIdx, endIdx), 'utf8');
    console.log("Extracted activeFigures and render logic.");
} else {
    console.log("Could not find full boundaries.");
}
