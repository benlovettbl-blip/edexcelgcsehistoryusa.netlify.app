const fs = require('fs');
const pdf = require('pdf-parse');

async function readPdf(filePath, outPath) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        fs.writeFileSync(outPath, data.text, 'utf8');
        console.log(`Successfully extracted ${filePath} to ${outPath}`);
    } catch (e) {
        console.error(`Error reading ${filePath}:`, e);
    }
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: node read_pdf.js <pdf_path> <txt_output_path>");
    process.exit(1);
}

readPdf(args[0], args[1]);
