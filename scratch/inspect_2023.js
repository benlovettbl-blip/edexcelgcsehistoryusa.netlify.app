const fs = require('fs');

function inspect2023() {
    const content = fs.readFileSync('scratch/2023_que.txt', 'utf8');
    const lines = content.split('\n');
    console.log("=== 2023 QUESTIONS & SOURCES ===");
    lines.forEach((line, idx) => {
        if (idx < 250) {
            // Print first part to find Q1 and Q2
            console.log(`${idx + 1}: ${line}`);
        }
        if (idx > 700) {
            // Print sources and interpretations booklet
            console.log(`${idx + 1}: ${line}`);
        }
    });
}

inspect2023();
