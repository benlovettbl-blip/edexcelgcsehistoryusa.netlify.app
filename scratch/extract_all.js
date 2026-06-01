const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

const extractions = [
    { pdf: "1hia-33-que-20220610.pdf", txt: "2022_que.txt" },
    { pdf: "1hia-33-rms-20220825.pdf", txt: "2022_rms.txt" },
    { pdf: "1hia-33-pef-20220825.pdf", txt: "2022_pef.txt" },
    
    { pdf: "1hi0-33-que-20230616.pdf", txt: "2023_que.txt" },
    { pdf: "1hi0-33-rms-20230824.pdf", txt: "2023_rms.txt" },
    { pdf: "1hi0-33-pef-20230824.pdf", txt: "2023_pef.txt" },
    
    { pdf: "1hi0-33-que-20240612.pdf", txt: "2024_que.txt" },
    { pdf: "1hi0-33-rms-20240822.pdf", txt: "2024_rms.txt" },
    
    { pdf: "1hi0-33-que-20250611.pdf", txt: "2025_que.txt" },
    { pdf: "1hi0-33-rms-20250821.pdf", txt: "2025_rms.txt" },
    { pdf: "1hi0-33-pef-20250821.pdf", txt: "2025_pef.txt" }
];

async function run() {
    const pdfDir = "P3 33 USA past exams";
    const outDir = "scratch";
    for (const item of extractions) {
        const pdfPath = path.join(pdfDir, item.pdf);
        const outPath = path.join(outDir, item.txt);
        if (fs.existsSync(pdfPath)) {
            try {
                const dataBuffer = fs.readFileSync(pdfPath);
                const data = await pdf(dataBuffer);
                fs.writeFileSync(outPath, data.text, 'utf8');
                console.log(`Extracted: ${item.pdf} -> ${item.txt}`);
            } catch (e) {
                console.error(`Error: ${item.pdf}`, e);
            }
        } else {
            console.log(`Not found: ${pdfPath}`);
        }
    }
}

run();
