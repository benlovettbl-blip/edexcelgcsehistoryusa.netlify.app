const fs = require('fs');
const execSync = require('child_process').execSync;

let viewsJs = execSync('git show b6086ac:src/views.js').toString();

const keyFigBioIdx = viewsJs.indexOf('export const KEY_FIGURES_BIO = {');
const activeFigIdx = viewsJs.indexOf('export const activeFigures = [');
const renderFigIdx = viewsJs.indexOf('export function renderKeyIndividualsView() {');
const endIdx = viewsJs.indexOf('window.renderKeyIndividualsView = renderKeyIndividualsView;');

if (keyFigBioIdx > -1 && endIdx > -1) {
    fs.writeFileSync('extracted_key_individuals_full.js', viewsJs.substring(keyFigBioIdx, endIdx), 'utf8');
    console.log("Extracted full individuals logic.");
} else {
    console.log("Could not find full boundaries.");
}
