function generateChecklist() {
  return topics.map(t => `
    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 6px; font-size: 13.5px; line-height: 1.3;">
        <div class="check-box" style="width: 20px; height: 20px; border: 2px solid var(--text); border-radius: 4px; flex-shrink: 0;"></div>
        <div><strong>Key Topic ${t.title}</strong></div>
    </div>`).join('\n');
}

function generatePages() {
  return topics.map(topic => `
<div class="page">
    <header style="margin-bottom: 20px; text-align: center; padding-bottom: 15px;">
        <h1 style="font-size: 24px; color: var(--primary); margin: 0; font-weight: bold; text-decoration: underline; text-underline-offset: 4px;">Key Topic ${topic.title}</h1>
    </header>

    <div class="activity-section" style="display: flex; flex-direction: column; flex-grow: 1;">
        
        <!-- PART 1 -->
        <div style="margin-bottom: 35px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 1: The Core Story (Fill in the blanks)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Read the paragraph below and use the words in the Word Bank to fill in the missing gaps.</div>
            <div style="font-size: 16px; line-height: 2.0; margin-bottom: 20px;">
                ${topic.part1.text.replace(/\[ \d \]/g, match => `<span style="display: inline-block; width: 120px; border-bottom: 1px solid #000; text-align: center;">&nbsp;</span>`)}
            </div>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; text-align: center;">
                <strong style="font-size: 15px; color: var(--primary-dark);">Word Bank:</strong><br><br>
                <span style="font-size: 16px; letter-spacing: 1px; font-weight: bold;">[ ${topic.part1.words.join(' ] &nbsp;&nbsp;&nbsp;&nbsp; [ ')} ]</span>
            </div>
        </div>

        <!-- PART 2 -->
        <div style="margin-bottom: 35px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 2: Key Vocabulary (Matching)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Draw a line to connect each key term on the left with its correct meaning on the right.</div>
            
            <div style="display: flex; justify-content: space-between; font-size: 16px;">
                <div style="width: 40%; display: flex; flex-direction: column; gap: 25px; padding-top: 5px;">
                    ${topic.part2.map((item, idx) => `<div><strong>${idx + 1}. ${item.term}</strong></div>`).join('')}
                </div>
                <div style="width: 55%; display: flex; flex-direction: column; gap: 25px; padding-top: 5px;">
                    ${topic.part2.map((item, idx) => `<div><em>${String.fromCharCode(65 + idx)}. ${item.def}</em></div>`).join('')}
                </div>
            </div>
        </div>

        <!-- PART 3 -->
        <div style="margin-bottom: 20px; flex-grow: 1;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 3: Fact Check (True or False)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Read each statement carefully. Circle 'True' if it is a fact, or 'False' if it is incorrect.</div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; font-size: 16px;">
                ${topic.part3.map((item, idx) => `
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                    <div style="width: 80%;">${idx + 1}. ${item.text}</div>
                    <div style="width: 15%; text-align: right; font-weight: bold;">True / False</div>
                </div>`).join('')}
            </div>
        </div>

    </div>
</div>

<div class="page">
    <header style="margin-bottom: 25px; text-align: center; padding-bottom: 10px; border-bottom: 2px solid var(--border);">
        <h1 style="font-size: 24px; color: var(--primary); margin: 0; font-weight: bold;">${topic.title} (Continued)</h1>
    </header>

    <div class="activity-section" style="display: flex; flex-direction: column; flex-grow: 1;">

        <!-- PART 4 -->
        <div style="margin-bottom: 25px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 8px;">Part 4: The 'One Sentence' Challenge</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Finish the sentence below using one piece of knowledge you have learned about this topic.</div>
            
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px;">"${topic.part4}"</div>
            
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%; margin-bottom: 25px;"></div>
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%; margin-bottom: 25px;"></div>
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%;"></div>
        </div>

        <!-- PART 5 -->
        <div style="margin-bottom: 15px; flex-grow: 1;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 8px;">Part 5: Core Recall</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Answer the five core questions below. Choose the correct answers from the Answer Bank at the bottom of the page.</div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; font-size: 16px;">
                ${topic.part5.questions.map((q, idx) => `
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <div><strong>${idx + 1}.</strong> ${q}</div>
                    <div style="border-bottom: 2px solid #000; width: 100%; height: 20px;"></div>
                </div>`).join('')}
            </div>
        </div>

        <!-- ANSWER BANK -->
        <div style="margin-top: auto; padding-top: 15px; page-break-inside: avoid; break-inside: avoid;">
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 2px solid var(--border); text-align: center;">
                <strong style="font-size: 16px; color: var(--primary-dark);">Answer Bank:</strong><br><br>
                <div style="font-size: 16px; font-weight: bold; display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
                    ${[...topic.part5.answers].sort(() => Math.random() - 0.5).map(ans => `<span style="background: #e2e8f0; padding: 5px 15px; border-radius: 20px; border: 1px solid #cbd5e1;">${ans}</span>`).join('')}
                </div>
            </div>
        </div>

    </div>
</div>
`).join('\n');
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Foundation Quiz Pack</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

        :root {
            --primary: #2563eb;
            --primary-dark: #1e40af;
            --border: #cbd5e1;
            --bg-light: #f8fafc;
            --text: #0f172a;
        }

        body {
            font-family: 'Inter', sans-serif;
            color: var(--text);
            line-height: 1.5;
            margin: 0;
            padding: 0;
            background: #e2e8f0;
        }

        @page {
            size: A4;
            margin: 15mm;
        }

        .page {
            background: white;
            width: 210mm;
            min-height: 297mm;
            margin: 20px auto;
            padding: 20mm;
            box-sizing: border-box;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            position: relative;
            display: flex;
            flex-direction: column;
        }

        .cover-page {
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 40mm 20mm;
        }

        @media print {
            body { background: none; }
            .page { 
                margin: 0; padding: 0; border: none; box-shadow: none; 
                width: 100%; min-height: 100%;
                page-break-after: always;
            }
        }
    </style>
</head>
<body>

<!-- Cover Page -->
<div class="page cover-page">
    <div class="cover-title" style="font-size: 42px; font-weight: 800; color: var(--primary-dark); margin-bottom: 10px; line-height: 1.2;">Foundation Quiz Pack</div>
    <div class="cover-subtitle" style="font-size: 18px; color: #475569; margin-bottom: 15px;">The USA, 1954–75: conflict at home and abroad</div>
    
    <div class="cover-name-box" style="border: 2px dashed var(--border); padding: 12px; width: 85%; text-align: left; font-size: 15px; margin-bottom: 15px;">
        <strong>Name:</strong> _________________________________________<br><br>
        <strong>Class:</strong> _________________________________________
    </div>

    <div class="checklist" style="text-align: left; width: 85%; background: var(--bg-light); padding: 12px 20px; border-radius: 8px; border: 1px solid var(--border);">
        <h3 style="margin-top: 0; border-bottom: 1px solid var(--border); padding-bottom: 8px; margin-bottom: 12px; font-size: 1.1rem;">Key Topics Checklist</h3>
        ${generateChecklist()}
    </div>
</div>

${generatePages()}

</body>
</html>`;

fs.writeFileSync('public/foundation_quiz_pack.html', htmlContent);
console.log('Foundation Quiz Pack generated successfully at public/foundation_quiz_pack.html');
