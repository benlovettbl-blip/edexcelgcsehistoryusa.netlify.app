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
        if (/^\s*[2]\s*\(a\)/i.test(line) || /^\s*[2]\s*\(b\)/i.test(line) || /^\s*OR\s*$/i.test(line)) {
            console.log(`Line ${idx + 1}: ${line.trim()}`);
            for (let i = 1; i <= 5; i++) {
                if (lines[idx + i]) console.log(`   + ${lines[idx + i].trim()}`);
            }
        }
    });
}
