const fs = require('fs');
const path = require('path');

const rmsFiles = ['2022_rms.txt', '2023_rms.txt', '2024_rms.txt', '2025_rms.txt'];

for (const f of rmsFiles) {
    const p = path.join('scratch', f);
    if (!fs.existsSync(p)) continue;
    console.log(`\n==================================================`);
    console.log(`FILE: ${f}`);
    console.log(`==================================================`);
    const content = fs.readFileSync(p, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (/Question|Indicative content|Relevant points/i.test(line) && !/Marking instructions/i.test(line)) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
            for (let i = 1; i <= 15; i++) {
                if (lines[idx + i] && lines[idx + i].trim()) {
                    console.log(`   + ${lines[idx + i].trim()}`);
                }
            }
        }
    });
}
