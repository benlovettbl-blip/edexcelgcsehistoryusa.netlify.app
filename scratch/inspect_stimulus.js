const fs = require('fs');
const path = require('path');

const files = ['2022_que.txt', '2023_que.txt', '2024_que.txt', '2025_que.txt'];

for (const f of files) {
    const p = path.join('scratch', f);
    if (!fs.existsSync(p)) continue;
    console.log(`\n==================================================`);
    console.log(`FILE: ${f}`);
    console.log(`==================================================`);
    const content = fs.readFileSync(p, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
        if (/Explain why/i.test(line) && !/reason why/i.test(line)) {
            console.log(`Q2 [Line ${idx + 1}] ${line.trim()}`);
            // Print next 20 lines to find stimulus
            for (let i = 1; i <= 20; i++) {
                if (lines[idx + i] && lines[idx + i].trim()) {
                    console.log(`   + ${lines[idx + i].trim()}`);
                }
            }
        }
    });
}
