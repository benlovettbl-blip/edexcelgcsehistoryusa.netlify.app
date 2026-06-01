const fs = require('fs');

function inspect2025Q3() {
    const content = fs.readFileSync('scratch/2025_que.txt', 'utf8');
    const lines = content.split('\n');
    console.log("=== 2025 Q3 QUESTIONS ===");
    lines.forEach((line, idx) => {
        if (/Interpretation 1 and Interpretation 2/i.test(line) || /suggest one reason/i.test(line) || /how far do you agree/i.test(line)) {
            console.log(`[Line ${idx + 1}] ${line.trim()}`);
            for (let i = 1; i <= 3; i++) {
                if (lines[idx + i]) console.log(`   + ${lines[idx + i].trim()}`);
            }
        }
    });
}

inspect2025Q3();
