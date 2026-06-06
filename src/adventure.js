import { AudioEngine } from './audio.js';
import { switchView } from './navigation.js';

// Complete Syllabus Narrative Data Model
const storyNodes = {
  // -------------------------------------------------------------
  // ERA 1: CIVIL RIGHTS ORIGINS & EDUCATION DEVELOPMENTS (KT1)
  // -------------------------------------------------------------
  start: {
    year: "1954",
    topic: "1.1: Brown v. Board of Education",
    text: "You are a Black high school student in Mississippi. Civil rights lawyers have won a monumental legal decision in the Supreme Court case 'Brown v. Board of Education'. However, your town council completely blocks school integration, arguing the federal ruling is invalid.\n\nTo challenge them legally in court, you must demonstrate how the ruling breaks local laws. Which constitutional argument did the NAACP lawyers use to win the case?",
    options: [
      {
        text: "Argue that segregation directly violated the 'Equal Protection Clause' of the 14th Amendment.",
        nextNode: "brown_success",
        isCorrect: true
      },
      {
        text: "Argue that separate facilities violated interstate commerce parameters protected under the 15th Amendment.",
        nextNode: "brown_fail",
        isCorrect: false
      }
    ]
  },
  brown_fail: {
    year: "1954",
    topic: "⚠️ Misconception Detected",
    text: "Incorrect. The 15th Amendment explicitly protects voting rights. The foundation of the Brown decision was the 14th Amendment, which guarantees equal protection under the law, proving that 'separate but equal' is inherently unequal.",
    options: [
      { text: "↩️ Re-evaluate constitutional laws and retry", nextNode: "start" }
    ]
  },
  brown_success: {
    year: "1955",
    topic: "1.3: Montgomery Bus Boycott",
    text: "Correct! The Supreme Court ruled that separate educational facilities are inherently unequal under the 14th Amendment.\n\nNext Challenge: It is December 1955. News arrives from Alabama. Rosa Parks has been arrested for refusing to surrender her seat on a bus. Local activists establish the Montgomery Improvement Association (MIA) to manage a massive transit boycott. Who is chosen to lead this new campaign?",
    evidenceKey: "brown_14th",
    evidenceText: "⚖️ Brown v. Board (1954): Defeated legal school segregation using the 14th Amendment's Equal Protection Clause.",
    options: [
      {
        text: "Dr. Martin Luther King Jr., an energetic 26-year-old local minister.",
        nextNode: "montgomery_success",
        isCorrect: true
      },
      {
        text: "Malcolm X, who traveled south to champion integration.",
        nextNode: "montgomery_fail",
        isCorrect: false
      }
    ]
  },
  montgomery_fail: {
    year: "1955",
    topic: "⚠️ Chronology Error",
    text: "Incorrect. Malcolm X was operating in northern cities like New York and Detroit representing the Nation of Islam during this phase. He disagreed with integration campaigns, prioritizing Black Nationalism instead.",
    options: [
      { text: "↩️ Correct your timeline parameters", nextNode: "brown_success" }
    ]
  },
  montgomery_success: {
    year: "1956",
    topic: "1.3: Economic Boycotts",
    text: "Correct! Dr. Martin Luther King Jr. took charge of the MIA, establishing a sophisticated carpool network that kept the 381-day boycott functional.\n\nBy late 1956, city transit lines are near bankruptcy. Which legal mechanism ultimately forced the city to integrate the public bus routes?",
    evidenceKey: "mia_protest",
    evidenceText: "🚌 Montgomery Boycott (1955-56): Led by MLK's MIA. Proven non-violent economic pressure works.",
    options: [
      {
        text: "A direct federal intervention order issued by President Dwight D. Eisenhower.",
        nextNode: "bus_fail_ike",
        isCorrect: false
      },
      {
        text: "The Supreme Court's 'Browder v. Gayle' ruling, declaring bus segregation laws unconstitutional.",
        nextNode: "little_rock_transition",
        isCorrect: true
      }
    ]
  },
  bus_fail_ike: {
    year: "1956",
    topic: "⚠️ Government Authority Error",
    text: "Incorrect. President Eisenhower remained notably silent on the Montgomery Bus Boycott. Real structural change was achieved through the federal judiciary system.",
    options: [
      { text: "↩️ Re-route the legal pathway", nextNode: "montgomery_success" }
    ]
  },
  // -------------------------------------------------------------
  // ERA 2: CONFRONTING OPPOSITION & LITTLE ROCK (KT1)
  // -------------------------------------------------------------
  little_rock_transition: {
    year: "1957",
    topic: "1.2: Little Rock Crisis",
    text: "Correct! The Supreme Court step-in via 'Browder v. Gayle' broke the local deadlock.\n\nSeptember 1957. You relocate to Little Rock, Arkansas. Nine Black students register at the all-white Central High School. Governor Orval Faubus uses the state National Guard to block their entry, explicitly defying federal law. \n\nHow does the federal government respond to this direct constitutional challenge?",
    evidenceKey: "browder_gayle",
    evidenceText: "🏛️ Browder v. Gayle (1956): Supreme Court ruling that outlawed segregation on public transport networks.",
    options: [
      {
        text: "President Eisenhower federalizes the National Guard and sends the 101st Airborne Division to protect the students.",
        nextNode: "little_rock_success",
        isCorrect: true
      },
      {
        text: "Congress passes an emergency bill removing Governor Faubus from his political office.",
        nextNode: "little_rock_fail",
        isCorrect: false
      }
    ]
  },
  little_rock_fail: {
    year: "1957",
    topic: "⚠️ Separation of Powers Error",
    text: "Incorrect. Congress has no constitutional power to depose a state governor. It required executive military action as Commander-in-Chief to enforce federal court rulings.",
    options: [
      { text: "↩️ Apply correct presidential authority options", nextNode: "little_rock_transition" }
    ]
  },
  little_rock_success: {
    year: "1960",
    topic: "2.1: Sit-Ins & Student Activism",
    text: "Correct! Eisenhower sent federal soldiers to guarantee student safety, demonstrating that the federal government would use force to back civil rights rulings.\n\nFast-forward to 1960. Four Black students execute a non-violent sit-in at a segregated lunch counter in Greensboro, North Carolina. The protest pattern spreads rapidly. Which student-led civil rights organization forms to coordinate these actions?",
    evidenceKey: "little_rock_57",
    evidenceText: "🪖 Little Rock Nine (1957): Forced presidential military intervention to protect federal school integration rights.",
    options: [
      {
        text: "SNCC (Student Nonviolent Coordinating Committee)",
        nextNode: "sncc_success",
        isCorrect: true
      },
      {
        text: "SCLC (Southern Christian Leadership Conference)",
        nextNode: "sncc_fail",
        isCorrect: false
      }
    ]
  },
  sncc_fail: {
    year: "1960",
    topic: "⚠️ Organization Distinctions",
    text: "Incorrect. While SCLC supported student actions, it was an organization of adult ministers led by MLK. SNCC was formed specifically to give younger student activists their own independent direct-action framework.",
    options: [
      { text: "↩️ Differentiate organizational structures", nextNode: "little_rock_success" }
    ]
  },
  // -------------------------------------------------------------
  // ERA 3: PROTEST, PROGRESS & RADICALISM (KT2)
  // -------------------------------------------------------------
  sncc_success: {
    year: "1963",
    topic: "2.2: Birmingham & Legislative Change",
    text: "Correct! SNCC championed the sit-ins and subsequent Freedom Rides.\n\nSpring 1963. You arrive in Birmingham, Alabama, to assist the SCLC's 'Project C' campaign. Chief of Police 'Bull' Connor unleashes attack dogs and high-pressure fire hoses on peaceful young marchers. \n\nWhat critical impact did this specific campaign have on the wider national legislative landscape?",
    evidenceKey: "sncc_greensboro",
    evidenceText: "🪧 Greensboro Sit-ins (1960): Led to the creation of SNCC, establishing widespread youth-led direct action.",
    options: [
      {
        text: "It forced President John F. Kennedy to introduce a sweeping Civil Rights Bill that would outlaw public segregation.",
        nextNode: "birmingham_success",
        isCorrect: true
      },
      {
        text: "It led the state of Alabama to outlaw the Ku Klux Klan.",
        nextNode: "birmingham_fail",
        isCorrect: false
      }
    ]
  },
  birmingham_fail: {
    year: "1963",
    topic: "⚠️ Legislative Interpretation Error",
    text: "Incorrect. Southern state governments escalated anti-civil rights defenses. The true consequence of Birmingham was the widespread shock value of the media coverage, forcing federal intervention.",
    options: [
      { text: "↩️ Focus on federal consequences", nextNode: "sncc_success" }
    ]
  },
  birmingham_success: {
    year: "1965",
    topic: "2.2: Voting Rights & Selma",
    text: "Correct! Birmingham forced federal action, paving the way for the Civil Rights Act of 1964.\n\nMarch 1965. Activists organize a march from Selma to Montgomery to demand real voting rights. Marchers are brutally assaulted by state troopers on the Edmund Pettus Bridge during 'Bloody Sunday'. \n\nWhich landmark piece of federal legislation did this crisis force President Lyndon B. Johnson to pass?",
    evidenceKey: "birmingham_63",
    evidenceText: "📺 Birmingham Campaign (1963): Media coverage generated widespread moral outrage, leading to the Civil Rights Act of 1964.",
    options: [
      {
        text: "The Voting Rights Act of 1965, banning literacy tests and establishing federal voter monitoring.",
        nextNode: "selma_success",
        isCorrect: true
      },
      {
        text: "The 24th Amendment, outlawing segregation across private housing markets.",
        nextNode: "selma_fail",
        isCorrect: false
      }
    ]
  },
  selma_fail: {
    year: "1965",
    topic: "⚠️ Legislative Content Error",
    text: "Incorrect. The 24th Amendment outlawed poll taxes. Selma focused specifically on securing voter access, which resulted in the Voting Rights Act of 1965, removing literacy tests.",
    options: [
      { text: "↩️ Correct your legal terms", nextNode: "birmingham_success" }
    ]
  },
  // -------------------------------------------------------------
  // ERA 4: VIETNAM WAR & DOMESTIC CONFLICT BRIDGES (KT3/KT4)
  // -------------------------------------------------------------
  selma_success: {
    year: "1967",
    topic: "3.2 / 4.1: Vietnam Escalation & The Draft",
    text: "Correct! The Voting Rights Act dismantled structural Southern voting barriers.\n\nIt is now 1967. The United States has surged troop deployments into Vietnam following the Gulf of Tonkin Resolution. You turn 19 and receive an official selective service military draft notice.\n\nYou quickly discover that affluent students are securing higher-education deferments, while working-class Black Americans are being assigned to combat roles at a disproportionate rate. \n\nWhich prominent anti-war stance mirrors this specific civil rights and anti-draft position?",
    evidenceKey: "voting_rights_65",
    evidenceText: "🗳️ Voting Rights Act (1965): Outlawed discriminatory literacy tests; enabled massive registration spikes across the South.",
    options: [
      {
        text: "Dr. Martin Luther King Jr.'s 'Beyond Vietnam' speech, declaring the war an enemy of the poor that drains domestic reform funds.",
        nextNode: "vietnam_protest_success",
        isCorrect: true
      },
      {
        text: "The 'Silent Majority' declaration, demanding the expansion of the draft network to hit military targets.",
        nextNode: "vietnam_protest_fail",
        isCorrect: false
      }
    ]
  },
  vietnam_protest_fail: {
    year: "1967",
    topic: "⚠️ Core Perspective Error",
    text: "Incorrect. The 'Silent Majority' was a term used by President Richard Nixon to rally middle-class white Americans who *supported* the war effort and opposed anti-war demonstrations.",
    options: [
      { text: "↩️ Re-evaluate anti-war alignments", nextNode: "selma_success" }
    ]
  },
  vietnam_protest_success: {
    year: "1970",
    topic: "4.1: Kent State & Expansion of the War",
    text: "Correct! MLK and groups like the Black Panthers pointed out the deep irony of fighting for freedoms abroad that were systematically denied to Black citizens at home.\n\nMay 1970. President Nixon expands the war by invading Cambodia, triggering massive student protests nationwide. At Kent State University, National Guardsmen open fire on anti-war demonstrators.\n\nWhat was the immediate political consequence of the Kent State shootings?",
    evidenceKey: "mlk_vietnam_67",
    evidenceText: "✊ Anti-War Intersect (1967): MLK linked civil rights inequality to the draft system, driving anti-war sentiment.",
    options: [
      {
        text: "A massive nationwide student strike of over 4 million students, paralyzing hundreds of universities.",
        nextNode: "game_complete",
        isCorrect: true
      },
      {
        text: "The immediate withdrawal of all US military forces from Southeast Asia.",
        nextNode: "kent_state_fail",
        isCorrect: false
      }
    ]
  },
  kent_state_fail: {
    year: "1970",
    topic: "⚠️ Consequence Assessment Error",
    text: "Incorrect. Nixon did not withdraw troops immediately; he pursued 'Vietnamization' while expanding bombing campaigns. The real domestic fallout was a massive student strike that polarized the nation.",
    options: [
      { text: "↩️ Re-evaluate the domestic fallout data", nextNode: "vietnam_protest_success" }
    ]
  },
  // -------------------------------------------------------------
  // FINAL NODE: SYLLABUS SYNTHESIS SUMMARY
  // -------------------------------------------------------------
  game_complete: {
    year: "1975",
    topic: "🏆 Simulator Completed!",
    text: "April 1975. You watch news broadcasts showing the final evacuation of Saigon. The war is over.\n\nYou have successfully completed the timeline. You have traced how local grassroot challenges against Jim Crow in the 1950s grew into massive federal policy overhauls, and how those civil rights strategies ultimately collided with the domestic protest movements of the Vietnam War.",
    evidenceKey: "kent_state_70",
    evidenceText: "🎓 Kent State (1970): Triggered a massive strike of 4 million students, proving the deep divisions within the US home front.",
    options: [
      { text: "🔄 Restart Simulator (Refresh Knowledge Security)", nextNode: "start", isReset: true },
      { text: "🏠 Return to Dashboard", nextNode: "start", isReset: true, goDashboard: true }
    ]
  }
};

// Game State Engine Variables
let currentNode = 'start';
let trackingScore = 0;
const unlockedEvidence = new Set();

export function initAdventureGame() {
  currentNode = 'start';
  trackingScore = 0;
  unlockedEvidence.clear();
  
  const list = document.getElementById('evidence-list');
  if (list) list.innerHTML = '';
  
  renderGameEngine();
}

function renderGameEngine() {
  const data = storyNodes[currentNode];
  if (!data) return;

  // Reset loop check
  if (data.options[0] && data.options[0].isReset && (currentNode === 'start')) {
    trackingScore = 0;
    unlockedEvidence.clear();
    const list = document.getElementById('evidence-list');
    if (list) list.innerHTML = '';
  }

  // DOM assignments
  const domYear = document.getElementById('adv-year');
  const domTopic = document.getElementById('adv-topic');
  const domText = document.getElementById('story-text');
  const domScore = document.getElementById('adv-score');

  if (domYear) domYear.innerText = data.year;
  if (domTopic) domTopic.innerText = data.topic;
  if (domText) domText.innerText = data.text;
  if (domScore) domScore.innerText = trackingScore;

  // Process Evidence Inventory Logging
  const insightBox = document.getElementById('historical-insight');
  if (insightBox) {
    if (data.evidenceKey) {
      if (!unlockedEvidence.has(data.evidenceKey)) {
        unlockedEvidence.add(data.evidenceKey);
        appendEvidenceDOM(data.evidenceText);
      }
      
      // Highlight correctness visually
      insightBox.className = "insight-box correct-node";
      insightBox.innerHTML = `<strong>✓ Factual Evidence Secured:</strong> Added to your revision bank profile on the right panel.`;
    } else if (data.topic.includes("Misconception") || data.topic.includes("Error")) {
      insightBox.className = "insight-box";
      insightBox.innerHTML = `<strong>⚠️ Exam Trap:</strong> Review this correction carefully before choosing your next path.`;
    } else {
      insightBox.className = "insight-box hidden";
    }
  }

  // Build Interactive Choice Prompts
  const controlsBox = document.getElementById('options-container');
  if (controlsBox) {
    controlsBox.innerHTML = '';

    data.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'btn-option';
      btn.innerText = opt.text;
      
      btn.addEventListener('click', () => {
        if (opt.goDashboard) {
          AudioEngine.play('click');
          switchView('dashboard');
          return;
        }

        if (opt.isCorrect) {
          trackingScore += 15;
          AudioEngine.play('success');
        } else {
          // Play click for regular flow, or fail sound on misconception nodes
          if (opt.nextNode.includes('fail')) {
            AudioEngine.play('fail');
          } else {
            AudioEngine.play('click');
          }
        }
        currentNode = opt.nextNode;
        renderGameEngine();
      });
      controlsBox.appendChild(btn);
    });
  }
}

function appendEvidenceDOM(text) {
  const list = document.getElementById('evidence-list');
  if (!list) return;
  const li = document.createElement('li');
  li.className = 'evidence-item';
  li.innerText = text;
  list.appendChild(li);
}
