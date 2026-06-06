import { AudioEngine } from './audio.js';
import { switchView } from './navigation.js';

// =============================================================
// 1. US CIVIL RIGHTS ADVENTURE DATABASE
// =============================================================
const storyNodes = {
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

// =============================================================
// 2. VIETNAM CAMPAIGN ADVENTURE DATABASE
// =============================================================
const vStoryNodes = {
  start: {
    year: "1954",
    topic: "3.1: Roots of Involvement",
    text: "You are an 18-year-old American student listening to a televised address by President Eisenhower. Following the French defeat at Dien Bien Phu, the geopolitical landscape of Southeast Asia has shifted. Eisenhower outlines why the US must send financial aid to back the capitalist regime of Ngo Dinh Diem in South Vietnam.\n\nWhich core cold-war concept does Eisenhower use to justify this international spending intervention?",
    options: [
      {
        text: "The Domino Theory—the belief that if South Vietnam fell to communism, neighboring countries would rapidly follow.",
        nextNode: "domino_success",
        isCorrect: true
      },
      {
        text: "The Rollback Policy—the active objective to deploy American military forces to invade North Vietnam and topple Ho Chi Minh.",
        nextNode: "domino_fail",
        isCorrect: false
      }
    ]
  },
  domino_fail: {
    year: "1954",
    topic: "⚠️ Concept Misconception",
    text: "Incorrect. The US policy under Eisenhower focused on containment, not rollback. The specific rationale used for Vietnam was the Domino Theory, arguing that a communist takeover in Saigon would destabilize the rest of Southeast Asia.",
    options: [
      { text: "↩️ Correct your strategic concepts", nextNode: "start" }
    ]
  },
  domino_success: {
    year: "1962",
    topic: "3.1: Diem's Weakness & Strategic Hamlets",
    text: "Correct! The Domino Theory became the foundational baseline for US involvement.\n\nBy 1962, communist Vietcong (VC) guerrillas are gaining massive influence across rural South Vietnam. President Kennedy backs the Strategic Hamlet Program to stop VC recruitment. The initiative forces thousands of Vietnamese peasants out of their ancestral lands into fortified villages.\n\nWhat was the primary historical consequence of this program?",
    evidenceKey: "domino_theory",
    evidenceText: "♟️ Domino Theory (1954): Geopolitical justification that bound US security interests to maintaining a non-communist South Vietnam.",
    options: [
      {
        text: "It alienated the peasant population, driving them to support the Vietcong due to resentment over forced relocation.",
        nextNode: "hamlet_success",
        isCorrect: true
      },
      {
        text: "It successfully cut off Vietcong food networks, securing rural support for Diem's capitalist government.",
        nextNode: "hamlet_fail",
        isCorrect: false
      }
    ]
  },
  hamlet_fail: {
    year: "1962",
    topic: "⚠️ Policy Failure Assessment",
    text: "Incorrect. The Strategic Hamlet Program was a disastrous failure for the US. Peasants deeply resented being forced off their land, which increased support for the Vietcong instead of limiting it.",
    options: [
      { text: "↩️ Correct the policy evaluation parameter", nextNode: "domino_success" }
    ]
  },
  hamlet_success: {
    year: "1964",
    topic: "3.2: Gulf of Tonkin Incident",
    text: "Correct! The Strategic Hamlet program backfired, pushing more peasants to side with the VC.\n\nAugust 1964. You have left university and are now eligible for the military draft system. News breaks that US destroyers were reportedly attacked by North Vietnamese torpedo boats in the Gulf of Tonkin. President Johnson demands a congressional vote.\n\nWhat did the resulting Gulf of Tonkin Resolution authorize Johnson to do?",
    evidenceKey: "strategic_hamlets",
    evidenceText: "🏡 Strategic Hamlets (1962): Counter-insurgency failure that alienated rural peasants and boosted Vietcong recruitment.",
    options: [
      {
        text: "Take all necessary measures to repel armed attacks, allowing him to escalate the war without a formal declaration of war.",
        nextNode: "tonkin_success",
        isCorrect: true
      },
      {
        text: "Declare immediate war on China and North Vietnam, setting up a mandatory draft for all American citizens.",
        nextNode: "tonkin_fail",
        isCorrect: false
      }
    ]
  },
  tonkin_fail: {
    year: "1964",
    topic: "⚠️ Constitutional Law Error",
    text: "Incorrect. The Resolution was intentionally not an official declaration of war. Instead, it gave the President a 'blank check' to escalate military operations without consulting Congress first.",
    options: [
      { text: "↩️ Re-examine executive war powers", nextNode: "hamlet_success" }
    ]
  },
  tonkin_success: {
    year: "1966",
    topic: "3.3: Nature of Conflict & Guerrilla Warfare",
    text: "Correct! The Resolution granted Johnson total control over escalation, triggering Operation Rolling Thunder and the deployment of ground troops.\n\nIn 1966, you are drafted into the US Army and deployed to the central highlands. You quickly discover that conventional warfare rules do not apply here. The Vietcong hide in elaborate tunnel networks, use booby traps, and follow a strategy of 'hanging onto American belts' to avoid artillery fire.\n\nWhich US tactic was designed to counter this invisible enemy but frequently devastated civilian support?",
    evidenceKey: "tonkin_resolution",
    evidenceText: "⚓ Tonkin Resolution (1964): Granted LBJ executive power to escalate US troop presence without congressional approval.",
    options: [
      {
        text: "Search and Destroy operations using helicopters to raid villages and chemical weapons like Agent Orange/Napalm.",
        nextNode: "tactics_success",
        isCorrect: true
      },
      {
        text: "Guerrilla ambush operations modeled after British tactics in Malaya.",
        nextNode: "tactics_fail",
        isCorrect: false
      }
    ]
  },
  tactics_fail: {
    year: "1966",
    topic: "⚠️ Tactical Classification Error",
    text: "Incorrect. The US military relied heavily on overwhelming firepower and technology, rather than adopting guerrilla methods. These heavy-handed tactics alienated rural civilians.",
    options: [
      { text: "↩️ Re-evaluate operational choices", nextNode: "tonkin_success" }
    ]
  },
  tactics_success: {
    year: "1968",
    topic: "3.4 / 4.1: The Tet Offensive",
    text: "Correct! Search and Destroy operations and chemical strikes caused severe civilian casualties, damaging the mission to win hearts and minds.\n\nJanuary 1968. The North Vietnamese army and Vietcong launch a massive, synchronized surprise attack on over 100 cities and bases during the Tet holiday. While US forces recover the territory militarily, the sheer scale of the offensive is broadcast across American television networks.\n\nWhat was the crucial domestic consequence of the Tet Offensive?",
    evidenceKey: "search_destroy",
    evidenceText: "🔥 Combat Tactics (1965-68): Firepower reliance (Napalm/Search & Destroy) failed to defeat VC networks and alienated rural populations.",
    options: [
      {
        text: "It created a severe 'Credibility Gap' in America, proving the government had misled the public about the war being near an end.",
        nextNode: "tet_success",
        isCorrect: true
      },
      {
        text: "It united public opinion behind a plan to expand the war effort into North Vietnam.",
        nextNode: "tet_fail",
        isCorrect: false
      }
    ]
  },
  tet_fail: {
    year: "1968",
    topic: "⚠️ Public Opinion Inversion",
    text: "Incorrect. Tet did not rally support; it shattered public trust. Media anchors like Walter Cronkite openly questioned if the war was winnable, sparking widespread domestic opposition.",
    options: [
      { text: "↩️ Correct your domestic impact tracking data", nextNode: "tactics_success" }
    ]
  },
  tet_success: {
    year: "1969",
    topic: "3.4 / 4.2: Vietnamization & The Silent Majority",
    text: "Correct! Tet marked the major turning point where anti-war sentiment became a dominant political force.\n\nRichard Nixon takes office, promising 'Peace with Honor'. To ease mounting anti-war pressure, he introduces 'Vietnamization' while appealing to the 'Silent Majority' of Americans who support the mission. \n\nWhat did the policy of Vietnamization explicitly involve?",
    evidenceKey: "tet_offensive_68",
    evidenceText: "📺 Tet Offensive (1968): A political defeat for the US that opened a 'Credibility Gap' and turned public opinion against the war.",
    options: [
      {
        text: "Gradually withdrawing US troops while training and funding the South Vietnamese army (ARVN) to fight on their own.",
        nextNode: "nixon_success",
        isCorrect: true
      },
      {
        text: "Handing operational control over to United Nations peacekeepers to set up neutral borders.",
        nextNode: "nixon_fail",
        isCorrect: false
      }
    ]
  },
  nixon_fail: {
    year: "1969",
    topic: "⚠️ Policy Strategy Error",
    text: "Incorrect. Vietnamization was designed to shift the burden of ground combat directly onto the South Vietnamese (ARVN) forces, allowing US troops to withdraw without looking like an immediate defeat.",
    options: [
      { text: "↩️ Align policy terms with definitions", nextNode: "tet_success" }
    ]
  },
  nixon_success: {
    year: "1973",
    topic: "4.3: The Paris Peace Accords",
    text: "Correct! Vietnamization allowed Nixon to begin withdrawing US troops. However, expanding bombing raids into Cambodia in 1970 triggered widespread student protests back home.\n\nIn January 1973, National Security Advisor Henry Kissinger secures the Paris Peace Accords. The remaining US combat units pull out of the country. \n\nBy early 1975, North Vietnamese forces launch a massive invasion into the South. Why was the ARVN unable to hold the line without US support?",
    evidenceKey: "vietnamization",
    evidenceText: "🔄 Vietnamization (1969-73): Nixon's exit strategy; pulled out US troops while shifting combat responsibilities over to ARVN forces.",
    options: [
      {
        text: "The US Congress cut off financial aid and military funding to Saigon, leaving the ARVN under-supplied against the North.",
        nextNode: "saigon_final",
        isCorrect: true
      },
      {
        text: "The Soviet Union deployed thousands of combat troops directly into South Vietnam to capture the capital.",
        nextNode: "saigon_fail",
        isCorrect: false
      }
    ]
  },
  saigon_fail: {
    year: "1975",
    topic: "⚠️ International Context Misconception",
    text: "Incorrect. The Soviet Union and China supplied equipment, not combat troops. The collapse of the South was caused by the ARVN's internal corruption and the US Congress's decision to cut off financial aid.",
    options: [
      { text: "↩️ Correct the causal breakdown factors", nextNode: "nixon_success" }
    ]
  },
  saigon_final: {
    year: "1975",
    topic: "🏆 Vietnam Conflict Module Completed!",
    text: "April 30, 1975. You watch news broadcasts showing the chaotic evacuation of the US Embassy roof as communist tanks crash through the gates of the Presidential Palace in Saigon. \n\nYou have completed your historical review. You have traced how the containment strategies of the 1950s led to complex guerrilla fighting in the 1960s, and how domestic opposition back home ultimately forced a US withdrawal, leading to the collapse of South Vietnam.",
    evidenceKey: "fall_of_saigon",
    evidenceText: "📉 Fall of Saigon (1975): Marked the final collapse of South Vietnam after US funding was cut off, sealing the failure of containment policy.",
    options: [
      { text: "🔄 Restart Simulator (Lock in Retention Framework)", nextNode: "start", isReset: true },
      { text: "🏠 Return to Dashboard", nextNode: "start", isReset: true, goDashboard: true }
    ]
  }
};

// =============================================================
// 3. GAME STATE ENGINES & RENDERING
// =============================================================

// US Game state variables
let currentNode = 'start';
let trackingScore = 0;
const unlockedEvidence = new Set();

// Vietnam Game state variables
let vCurrentNode = 'start';
let vTrackingScore = 0;
const vUnlockedEvidence = new Set();

// US Game initializer
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

// Vietnam Game initializer
export function initVietnamAdventureGame() {
  vCurrentNode = 'start';
  vTrackingScore = 0;
  vUnlockedEvidence.clear();
  
  const list = document.getElementById('v-evidence-list');
  if (list) list.innerHTML = '';
  
  renderVietnamEngine();
}

function renderVietnamEngine() {
  const data = vStoryNodes[vCurrentNode];
  if (!data) return;

  // Reset loop check
  if (data.options[0] && data.options[0].isReset && (vCurrentNode === 'start')) {
    vTrackingScore = 0;
    vUnlockedEvidence.clear();
    const list = document.getElementById('v-evidence-list');
    if (list) list.innerHTML = '';
  }

  // DOM assignments
  const domYear = document.getElementById('v-year');
  const domTopic = document.getElementById('v-topic');
  const domText = document.getElementById('v-story-text');
  const domScore = document.getElementById('v-score');

  if (domYear) domYear.innerText = data.year;
  if (domTopic) domTopic.innerText = data.topic;
  if (domText) domText.innerText = data.text;
  if (domScore) domScore.innerText = vTrackingScore;

  // Process Evidence Inventory Logging
  const insightBox = document.getElementById('v-historical-insight');
  if (insightBox) {
    if (data.evidenceKey) {
      if (!vUnlockedEvidence.has(data.evidenceKey)) {
        vUnlockedEvidence.add(data.evidenceKey);
        appendVietnamEvidenceDOM(data.evidenceText);
      }
      
      // Highlight correctness visually
      insightBox.className = "insight-box correct-node";
      insightBox.innerHTML = `<strong>✓ Case Study Unlocked:</strong> Case study details added to your revision bank layout on the right.`;
    } else if (data.topic.includes("Misconception") || data.topic.includes("Error")) {
      insightBox.className = "insight-box";
      insightBox.innerHTML = `<strong>⚠️ Syllabus Trap:</strong> Review this correction carefully before choosing your next path.`;
    } else {
      insightBox.className = "insight-box hidden";
    }
  }

  // Build Interactive Choice Prompts
  const controlsBox = document.getElementById('v-options-container');
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
          vTrackingScore += 15;
          AudioEngine.play('success');
        } else {
          // Play click for regular flow, or fail sound on misconception nodes
          if (opt.nextNode.includes('fail')) {
            AudioEngine.play('fail');
          } else {
            AudioEngine.play('click');
          }
        }
        vCurrentNode = opt.nextNode;
        renderVietnamEngine();
      });
      controlsBox.appendChild(btn);
    });
  }
}

function appendVietnamEvidenceDOM(text) {
  const list = document.getElementById('v-evidence-list');
  if (!list) return;
  const li = document.createElement('li');
  li.className = 'evidence-item';
  li.innerText = text;
  list.appendChild(li);
}
