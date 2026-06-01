const fs = require('fs');

function inspect2023Q12() {
    const content = fs.readFileSync('scratch/2023_que.txt', 'utf8');
    const lines = content.split('\n');
    console.log("=== 2023 Q1 & Q2 ===");
    for (let i = 50; i < 180; i++) {
        if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
    }
}

inspect2023Q12();
