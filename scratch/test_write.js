import fs from 'fs';
import { LESSONS_DATA } from '../src/lessons_data.js';

// Copy the file first to a backup
fs.writeFileSync('./src/lessons_data.js.bak', fs.readFileSync('./src/lessons_data.js'));

// Modify a minor value
LESSONS_DATA.subtopic_1_1.knowledgeCheck[0].question += ' ';

// Write back
const output = `export const LESSONS_DATA = ${JSON.stringify(LESSONS_DATA, null, 2)};\n`;
fs.writeFileSync('./src/lessons_data.js', output, 'utf8');

console.log('Modified lessons_data.js successfully!');
