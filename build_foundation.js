const fs = require('fs');

const topicsStr = fs.readFileSync('topics.json', 'utf8');
const topics = eval(topicsStr);

const part5Data = {
  "1.1": {
    questions: [
      "What was the system of separating Black and white people called?",
      "What test was used to stop Black citizens from voting?",
      "Name one public facility that was segregated.",
      "What threat did Black people face if they tried to vote?",
      "Which area of the USA had the strictest segregation laws?"
    ],
    answers: ["Segregation", "Literacy test", "Water fountains", "Violence", "The South"]
  },
  "1.2": {
    questions: [
      "Which 1954 Supreme Court case banned school segregation?",
      "What phrase was used by the court to describe segregated schools?",
      "In which city did nine Black students try to attend Central High School?",
      "Which president sent federal troops to protect the students?",
      "What was the policy of Southern states refusing to integrate called?"
    ],
    answers: ["Brown v. Topeka", "Unconstitutional", "Little Rock", "President Eisenhower", "Massive Resistance"]
  },
  "1.3": {
    questions: [
      "Who was arrested for refusing to give up her bus seat?",
      "In which city did the bus boycott take place?",
      "Who became the leader of the bus boycott?",
      "How long did the bus boycott last?",
      "Did the Supreme Court rule bus segregation legal or illegal?"
    ],
    answers: ["Rosa Parks", "Montgomery", "Martin Luther King", "Over a year", "Illegal"]
  },
  "1.4": {
    questions: [
      "Which groups were formed by middle-class businessmen to stop integration?",
      "Which violent racist group experienced a revival in the 1950s?",
      "Who was the young boy brutally murdered in 1955?",
      "Who found his killers not guilty?",
      "What term describes a mob killing someone without a legal trial?"
    ],
    answers: ["White Citizens Councils", "KKK", "Emmett Till", "An all-white jury", "Lynching"]
  },
  "2.1": {
    questions: [
      "What type of protest happened at Greensboro lunch counters?",
      "Who traveled on interstate buses to test desegregation laws?",
      "In which city did police chief Bull Connor attack protesters?",
      "What animals were used to attack protesters in Birmingham?",
      "What type of action did protesters use?"
    ],
    answers: ["Sit-ins", "Freedom Riders", "Birmingham", "Police dogs", "Direct, non-violent action"]
  },
  "2.2": {
    questions: [
      "Which act banned segregation in public places in 1964?",
      "Where did a famous march for voting rights take place in 1965?",
      "What was the violent attack on marchers in Alabama called?",
      "Which president signed these major civil rights laws?",
      "What did the Voting Rights Act of 1965 ban?"
    ],
    answers: ["Civil Rights Act", "Selma to Montgomery", "Bloody Sunday", "Lyndon B. Johnson", "Literacy tests"]
  },
  "2.3": {
    questions: [
      "Who was a leading figure in the Nation of Islam?",
      "What did Malcolm X believe in instead of integration?",
      "According to Malcolm X, how should Black Americans fight for their rights?",
      "What term describes poor, segregated inner-city neighborhoods?",
      "Did Malcolm X believe in Martin Luther King's peaceful approach?"
    ],
    answers: ["Malcolm X", "Black Nationalism", "By any means necessary", "Ghettos", "No"]
  },
  "2.4": {
    questions: [
      "Which leader popularized the phrase 'Black Power'?",
      "Which militant group carried guns for self-defense?",
      "Name one community survival program run by the Panthers.",
      "What event in 1968 featured a famous Black Power salute?",
      "What did the Black Panthers monitor to prevent brutality?"
    ],
    answers: ["Stokely Carmichael", "Black Panthers", "Free breakfast clubs", "The Olympics", "Police patrols"]
  },
  "3.1": {
    questions: [
      "What theory suggested that if one country fell to communism, others would follow?",
      "Which superpower was the USA fighting in the Cold War?",
      "Who was the communist leader of North Vietnam?",
      "Which half of Vietnam was anti-communist?",
      "Who did the USA send to train the South Vietnamese army initially?"
    ],
    answers: ["Domino Theory", "The Soviet Union", "Ho Chi Minh", "The South", "Military advisers"]
  },
  "3.2": {
    questions: [
      "Which US warship was reportedly fired upon in 1964?",
      "In which body of water did this incident occur?",
      "What did Congress pass to give the President power to wage war?",
      "Which President used this to send combat troops?",
      "Did Congress officially declare war on North Vietnam?"
    ],
    answers: ["USS Maddox", "Gulf of Tonkin", "Gulf of Tonkin Resolution", "Lyndon B. Johnson", "No"]
  },
  "3.3": {
    questions: [
      "What was the massive bombing campaign against North Vietnam called?",
      "What type of ground missions did US soldiers conduct?",
      "Which toxic weedkiller was used to destroy jungle cover?",
      "What flammable jelly was dropped in American bombs?",
      "What was a common result of Search and Destroy missions?"
    ],
    answers: ["Operation Rolling Thunder", "Search and Destroy", "Agent Orange", "Napalm", "Civilian casualties"]
  },
  "3.4": {
    questions: [
      "What major communist attack happened in early 1968?",
      "During which holiday did this attack take place?",
      "Which US building in Saigon was breached by a suicide squad?",
      "How did the American public watch the chaos?",
      "Did this event increase or decrease support for the war in America?"
    ],
    answers: ["The Tet Offensive", "Vietnamese New Year", "The US Embassy", "On television", "Decrease"]
  },
  "4.1": {
    questions: [
      "Which President introduced the policy of Vietnamisation?",
      "What did Vietnamisation mean for American combat troops?",
      "Whose army was supposed to take over the fighting?",
      "Which neighboring country did Nixon secretly bomb?",
      "What was Nixon's promised phrase for ending the war?"
    ],
    answers: ["Richard Nixon", "Slow withdrawal", "South Vietnamese army", "Cambodia", "Peace with Honor"]
  },
  "4.2": {
    questions: [
      "What did many young men burn to avoid joining the army?",
      "Where were protests especially common?",
      "At which university were four student protesters killed in 1970?",
      "Who fired into the crowd of students?",
      "What term describes people who oppose war because it is immoral?"
    ],
    answers: ["Draft cards", "College campuses", "Kent State University", "The National Guard", "Pacifists"]
  },
  "4.3": {
    questions: [
      "In what city was a peace treaty signed in 1973?",
      "What did the Paris Peace Accords agree to across Vietnam?",
      "How long did the USA have to remove its remaining troops?",
      "What did North Vietnam agree to release?",
      "Which city was finally captured by North Vietnam in 1975?"
    ],
    answers: ["Paris", "A ceasefire", "60 days", "American Prisoners of War", "Saigon"]
  },
  "4.4": {
    questions: [
      "What brilliant tactics did the Vietcong use?",
      "What did American troops suffer from in Vietnam?",
      "What term described soldiers murdering their own officers?",
      "What did the USA lose by destroying Vietnamese homes?",
      "Which movement in America pressured the government to pull out?"
    ],
    answers: ["Guerrilla tactics", "Low morale", "Fragging", "Hearts and Minds", "The anti-war movement"]
  }
};

topics.forEach(t => {
  if (part5Data[t.id]) {
    t.part5 = part5Data[t.id];
  }
});

const generateChecklistCode = `function generateChecklist() {
  return topics.map(t => \`
    <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 6px; font-size: 13.5px; line-height: 1.3;">
        <div class="check-box" style="width: 20px; height: 20px; border: 2px solid var(--text); border-radius: 4px; flex-shrink: 0;"></div>
        <div><strong>Key Topic \${t.title}</strong></div>
    </div>\`).join('\\n');
}
`;

const generatePagesCode = `function generatePages() {
  return topics.map(topic => \`
<div class="page">
    <header style="margin-bottom: 20px; text-align: center; padding-bottom: 15px;">
        <h1 style="font-size: 24px; color: var(--primary); margin: 0; font-weight: bold; text-decoration: underline; text-underline-offset: 4px;">Key Topic \${topic.title}</h1>
    </header>

    <div class="activity-section" style="display: flex; flex-direction: column; flex-grow: 1;">
        
        <!-- PART 1 -->
        <div style="margin-bottom: 35px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 1: The Core Story (Fill in the blanks)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Read the paragraph below and use the words in the Word Bank to fill in the missing gaps.</div>
            <div style="font-size: 16px; line-height: 2.0; margin-bottom: 20px;">
                \${topic.part1.text.replace(/\\[ \\d \\]/g, match => \`<span style="display: inline-block; width: 120px; border-bottom: 1px solid #000; text-align: center;">&nbsp;</span>\`)}
            </div>
            <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; border: 1px dashed #cbd5e1; text-align: center;">
                <strong style="font-size: 15px; color: var(--primary-dark);">Word Bank:</strong><br><br>
                <span style="font-size: 16px; letter-spacing: 1px; font-weight: bold;">[ \${topic.part1.words.join(' ] &nbsp;&nbsp;&nbsp;&nbsp; [ ')} ]</span>
            </div>
        </div>

        <!-- PART 2 -->
        <div style="margin-bottom: 35px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 2: Key Vocabulary (Matching)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Draw a line to connect each key term on the left with its correct meaning on the right.</div>
            
            <div style="display: flex; justify-content: space-between; font-size: 16px;">
                <div style="width: 40%; display: flex; flex-direction: column; gap: 25px; padding-top: 5px;">
                    \${topic.part2.map((item, idx) => \`<div><strong>\${idx + 1}. \${item.term}</strong></div>\`).join('')}
                </div>
                <div style="width: 55%; display: flex; flex-direction: column; gap: 25px; padding-top: 5px;">
                    \${topic.part2.map((item, idx) => \`<div><em>\${String.fromCharCode(65 + idx)}. \${item.def}</em></div>\`).join('')}
                </div>
            </div>
        </div>

        <!-- PART 3 -->
        <div style="margin-bottom: 20px; flex-grow: 1;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 3: Fact Check (True or False)</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 15px;">Read each statement carefully. Circle 'True' if it is a fact, or 'False' if it is incorrect.</div>
            
            <div style="display: flex; flex-direction: column; gap: 20px; font-size: 16px;">
                \${topic.part3.map((item, idx) => \`
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
                    <div style="width: 80%;">\${idx + 1}. \${item.text}</div>
                    <div style="width: 15%; text-align: right; font-weight: bold;">True / False</div>
                </div>\`).join('')}
            </div>
        </div>

    </div>
</div>

<div class="page">
    <header style="margin-bottom: 30px; text-align: center; padding-bottom: 15px; border-bottom: 2px solid var(--border);">
        <h1 style="font-size: 24px; color: var(--primary); margin: 0; font-weight: bold;">\${topic.title} (Continued)</h1>
    </header>

    <div class="activity-section" style="display: flex; flex-direction: column; flex-grow: 1;">

        <!-- PART 4 -->
        <div style="margin-bottom: 40px;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 4: The 'One Sentence' Challenge</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 20px;">Finish the sentence below using one piece of knowledge you have learned about this topic.</div>
            
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 30px;">"\${topic.part4}"</div>
            
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%; margin-bottom: 35px;"></div>
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%; margin-bottom: 35px;"></div>
            <div style="border-bottom: 2px dotted #94a3b8; width: 100%;"></div>
        </div>

        <!-- PART 5 -->
        <div style="margin-bottom: 20px; flex-grow: 1;">
            <h3 style="color: var(--primary-dark); font-size: 18px; margin-top: 0; margin-bottom: 10px;">Part 5: Core Recall</h3>
            <div style="font-size: 14px; font-style: italic; color: #475569; margin-bottom: 25px;">Answer the five core questions below. Choose the correct answers from the Answer Bank at the bottom of the page.</div>
            
            <div style="display: flex; flex-direction: column; gap: 35px; font-size: 16px;">
                \${topic.part5.questions.map((q, idx) => \`
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div><strong>\${idx + 1}.</strong> \${q}</div>
                    <div style="border-bottom: 2px solid #000; width: 100%; height: 20px;"></div>
                </div>\`).join('')}
            </div>
        </div>

        <!-- ANSWER BANK -->
        <div style="margin-top: auto; padding-top: 20px;">
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; border: 2px solid var(--border); text-align: center;">
                <strong style="font-size: 16px; color: var(--primary-dark);">Answer Bank:</strong><br><br>
                <div style="font-size: 16px; font-weight: bold; display: flex; flex-wrap: wrap; justify-content: center; gap: 20px;">
                    \${[...topic.part5.answers].sort(() => Math.random() - 0.5).map(ans => \`<span style="background: #e2e8f0; padding: 5px 15px; border-radius: 20px; border: 1px solid #cbd5e1;">\${ans}</span>\`).join('')}
                </div>
            </div>
        </div>

    </div>
</div>
\`).join('\\n');
}
`;

const htmlWrapper = \`const htmlContent = \\\`<!DOCTYPE html>
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
        \\\${generateChecklist()}
    </div>
</div>

\\\${generatePages()}

</body>
</html>\\\`;

fs.writeFileSync('public/foundation_quiz_pack.html', htmlContent);
console.log('Foundation Quiz Pack generated successfully at public/foundation_quiz_pack.html');
\`;

const completeCode = "const fs = require('fs');\\n\\n" +
  "const topics = " + JSON.stringify(topics, null, 2) + ";\\n\\n" +
  generateChecklistCode + "\\n\\n" +
  generatePagesCode + "\\n\\n" +
  htmlWrapper;

fs.writeFileSync('generate_foundation_pack.js', completeCode);
console.log("Successfully rebuilt generate_foundation_pack.js completely.");
