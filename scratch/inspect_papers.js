const fs = require('fs');
const path = require('path');

const files = ['2023_que.txt', '2024_que.txt', '2025_que.txt'];

for (const f of files) {
    const p = path.join('scratch', f);
    if (!fs.existsSync(p)) continue;
    console.log(`\n==================================================`);
    console.log(`FILE: ${f}`);
    console.log(`==================================================`);
    const content = fs.readFileSync(p, 'utf8');
    const lines = content.split('\n');
    
    // Print lines containing Question markers
    lines.forEach((line, idx) => {
        if (/Source A:/i.test(line) || /Source B:/i.test(line) || /Source C:/i.test(line) || /Interpretation 1:/i.test(line) || /Interpretation 2:/i.test(line)) {
            console.log(`[Line ${idx + 1}] ${line.trim()}`);
            // Print next 5 lines
            for (let i = 1; i <= 6; i++) {
                if (lines[idx + i]) console.log(`   + ${lines[idx + i].trim()}`);
            }
        }
        if (/^\s*[1-3]\s+.*Explain|^\s*[1-3]\s+\(a\)|^\s*[1-3]\s+\(b\)|^\s*[1-3]\s+\(c\)|^\s*[1-3]\s+\(d\)|^\s*1\s+Give|^\s*2\s+Explain/i.test(line)) {
            console.log(`[Line ${idx + 1}] Q-LINE: ${line.trim()}`);
            for (let i = 1; i <= 3; i++) {
                if (lines[idx + i]) console.log(`   + ${lines[idx + i].trim()}`);
            }
        }
    });
}
