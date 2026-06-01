const fs = require('fs');

function inspect2025Q3b() {
    const content = fs.readFileSync('scratch/2025_que.txt', 'utf8');
    const lines = content.split('\n');
    console.log("=== 2025 LINES 350 to 450 ===");
    for (let i = 350; i < 450; i++) {
        if (lines[i]) console.log(`${i + 1}: ${lines[i]}`);
    }
}

inspect2025Q3b();
