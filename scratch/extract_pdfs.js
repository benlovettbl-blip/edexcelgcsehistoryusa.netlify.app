const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function extractPdf(pdfPath, txtOutPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);
    fs.writeFileSync(txtOutPath, data.text, 'utf8');
    console.log(`Successfully extracted ${pdfPath} to ${txtOutPath}`);
  } catch (err) {
    console.error(`Error extracting ${pdfPath}:`, err);
  }
}

async function run() {
  const dir = 'P3 33 USA past exams';
  await extractPdf(path.join(dir, '1HI0_33_que_20190612.pdf'), 'scratch/2019_que.txt');
  await extractPdf(path.join(dir, '1HI0_33_que_20201120.pdf'), 'scratch/2020_que.txt');
  await extractPdf(path.join(dir, '1HI0_33_rms_20190822.pdf'), 'scratch/2019_rms.txt');
  await extractPdf(path.join(dir, '1HI0_33_msc_20210211.pdf'), 'scratch/2020_rms.txt');
}

run();
