import { AudioEngine } from './audio.js';
import { switchView } from './navigation.js';
import { addXp } from './views.js';

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
          addXp(10);
        } else {
          // Play click for regular flow, or fail sound on misconception nodes
          if (opt.nextNode.includes('fail')) {
            AudioEngine.play('fail');
          } else {
            AudioEngine.play('click');
          }
          addXp(3);
        }
        if (opt.nextNode === 'game_complete') {
          addXp(25);
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
          addXp(10);
        } else {
          // Play click for regular flow, or fail sound on misconception nodes
          if (opt.nextNode.includes('fail')) {
            AudioEngine.play('fail');
          } else {
            AudioEngine.play('click');
          }
          addXp(3);
        }
        if (opt.nextNode === 'saigon_final') {
          addXp(25);
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

// =============================================================
// 2.5. VIETNAM CIVILIAN ADVENTURE DATABASE
// =============================================================
const cStoryNodes = {
  start: {
    year: "1955",
    topic: "3.1: NGO Dinh Diem's Domestic Rules",
    text: "You are a member of a rice-farming family in the Mekong Delta of South Vietnam. Following the division of the country at the Geneva Conference, the new capitalist leader in Saigon, Ngo Dinh Diem, takes control. \n\nDuring the previous independence war, communist fighters redistributed farming land to your family for free. Now, Diem's officials arrive in your village backed by armed guards. They announce a new agricultural property directive.\n\nWhat structural change does Diem force upon your community?",
    options: [
      {
        text: "He cancels the communist land redistribution, forcing your family to buy buy-back your own land or pay heavy rents to wealthy Catholic landlords.",
        nextNode: "diem_land_success",
        isCorrect: true
      },
      {
        text: "He introduces free westernized industrial farming equipment, fully subsidizing all peasant rice crop yields.",
        nextNode: "diem_land_fail",
        isCorrect: false
      }
    ]
  },
  diem_land_fail: {
    year: "1955",
    topic: "⚠️ Historical Reality Error",
    text: "Incorrect. Diem did not support the peasant classes. His policies directly favored wealthy, urban, Catholic elites and landlords. This systemic economic bias quickly alienated the rural Buddhist majority.",
    options: [
      { text: "↩️ Correct your understanding of land policies", nextNode: "start" }
    ]
  },
  diem_land_success: {
    year: "1962",
    topic: "3.1: Forced Displacement",
    text: "Correct! Diem's land policies created deep resentment, making rural areas fertile recruiting grounds for the Vietcong (VC).\n\nIt is now 1962. To disrupt the growing Vietcong influence, the South Vietnamese army (ARVN) and US military advisors launch the Strategic Hamlet Program. Government forces march into your village, set fire to your thatched homes, and force your community at gunpoint to move into a new, fortified village surrounded by barbed wire and bamboo spikes.\n\nWhy did your family and community find this relocation culturally and socially devastating?",
    evidenceKey: "diem_alienation",
    evidenceText: "🌾 Peasant Alienation (1955-59): Diem reversed land reforms to benefit wealthy landlords, pushing the rural Buddhist majority toward the Vietcong.",
    options: [
      {
        text: "It severed your sacred connection to ancestral burial lands and forced you to build your own fortified containment walls without pay.",
        nextNode: "hamlet_civ_success",
        isCorrect: true
      },
      {
        text: "It required your family to convert away from Buddhism to Western Christianity to enter the complex.",
        nextNode: "hamlet_civ_fail",
        isCorrect: false
      }
    ]
  },
  hamlet_civ_fail: {
    year: "1962",
    topic: "⚠️ Policy Detail Error",
    text: "Incorrect. While Diem deeply discriminated against Buddhists (sparking the 1963 Buddhist Crisis), the Strategic Hamlet Program did not include a mandatory religious conversion clause. The anger stemmed from forced relocation, unpaid labor, and being torn away from ancestral lands.",
    options: [
      { text: "↩️ Re-evaluate the social impact", nextNode: "diem_land_success" }
    ]
  },
  hamlet_civ_success: {
    year: "1966",
    topic: "3.3: US Firepower & Destruction",
    text: "Correct! The Strategic Hamlet Program severely backfired. It felt like imprisonment, increasing rural support for the Vietcong insurgency.\n\nBy 1966, your region is classified as a 'Free Fire Zone'. US helicopters patrol overhead, while Vietcong guerrillas slip through the shadows of your village demanding shelter and food. One morning, US aircraft drop a heavy chemical defoliant to clear the thick jungle canopy where the Vietcong hide. The chemical settles over your community's rice fields.\n\nWhich specific US chemical weapon did you experience, which destroyed food supplies and caused horrific, long-term health crises?",
    evidenceKey: "civilian_hamlets",
    evidenceText: "🏡 Strategic Hamlets (1962): Forced relocations uprooted peasants from ancestral graves, transforming containment zones into breeding grounds for VC support.",
    options: [
      {
        text: "Agent Orange, a toxic herbicide designed to strip crop fields and jungle foliage.",
        nextNode: "chemical_success",
        isCorrect: true
      },
      {
        text: "Cyclon-B, a dense gas variant designed to clear underground tunnel networks.",
        nextNode: "chemical_fail",
        isCorrect: false
      }
    ]
  },
  chemical_fail: {
    year: "1966",
    topic: "⚠️ Weapon Identification Error",
    text: "Incorrect. The US military weaponized Agent Orange (for defoliation) and Napalm (jellied petroleum for burning structures and cover). Cyclon-B is historically connected to WWII European theaters, not Vietnam.",
    options: [
      { text: "↩️ Correct your military history terms", nextNode: "hamlet_civ_success" }
    ]
  },
  chemical_success: {
    year: "1968",
    topic: "3.3: Vietcong Guerrilla Pressure",
    text: "Correct! Agent Orange destroyed millions of acres of farmland, destroying food production and poisoning civilians.\n\nIt is early 1968, ahead of the Tet Offensive. Vietcong cadres enter your household at midnight. They speak of liberation and national pride, but they also demand a steep 'revolution tax' in the form of your remaining rice storage, and conscript your older sibling into service as a tunnel digger. \n\nWhich dual strategy describes how the Vietcong managed control over rural South Vietnamese populations?",
    evidenceKey: "agent_orange_impact",
    evidenceText: "☣️ Agent Orange Impact: Destroyed rural food infrastructures and livelihoods, undermining the US mission to 'win hearts and minds'.",
    options: [
      {
        text: "A calculated mix of local propaganda promising land reform, alongside brutal intimidation and violence against anyone cooperating with Saigon.",
        nextNode: "vc_tactics_success",
        isCorrect: true
      },
      {
        text: "Providing complete financial rewards in US Dollars to any peasant family that joined their ranks.",
        nextNode: "vc_tactics_fail",
        isCorrect: false
      }
    ]
  },
  vc_tactics_fail: {
    year: "1968",
    topic: "⚠️ Insurgency Mechanics Error",
    text: "Incorrect. The Vietcong did not possess or distribute US cash reserves. They relied heavily on local integration, ideological appeals, and severe violence against village leaders who cooperated with the South Vietnamese government.",
    options: [
      { text: "↩️ Re-analyze insurgent methodologies", nextNode: "chemical_success" }
    ]
  },
  vc_tactics_success: {
    year: "1975",
    topic: "4.4: Fall of Saigon Consequences",
    text: "Correct! The Vietcong combined political persuasion with severe enforcement networks, trapping civilians between two opposing sides.\n\nApril 1975. The US military has withdrawn, and North Vietnamese tanks crash through the gates of Saigon. The war is over, but peace brings deep insecurity. Because your father once worked a low-level administrative job for the old South Vietnamese government, your family is targeted by the new communist authorities.\n\nWhat immediate system did the new regime set up to deal with citizens linked to the old capitalist system?",
    evidenceKey: "vc_coercion",
    evidenceText: "👥 Vietcong Village Control: Blended grassroots promises with targeted violence against local officials to secure rural cooperation.",
    options: [
      {
        text: "Forced relocation to harsh 'Re-education Camps' involving intense manual labor and political indoctrination.",
        nextNode: "refugee_boat_transition",
        isCorrect: true
      },
      {
        text: "Offering free emigration documentation to relocate safely to Western Europe.",
        nextNode: "camp_fail",
        isCorrect: false
      }
    ]
  },
  camp_fail: {
    year: "1975",
    topic: "⚠️ Regime Outcome Error",
    text: "Incorrect. The victorious communist government did not help citizens leave. They sealed the borders and sent over 1 million South Vietnamese citizens to re-education camps, where thousands died from exhaustion and malnutrition.",
    options: [
      { text: "↩️ Correct your understanding of the war's aftermath", nextNode: "vc_tactics_success" }
    ]
  },
  refugee_boat_transition: {
    year: "1977",
    topic: "4.4: The 'Boat People' Refugee Crisis",
    text: "Correct! Re-education camps and political repression turned millions of South Vietnamese into refugees.\n\nIt is 1977. Desperate to escape the economic hardship and political crackdowns of the new regime, your family pools your remaining hidden jewelry to buy passage on a cramped, wooden fishing boat. You and 200 others slip out into the South China Sea at midnight.\n\nThe boat is unseaworthy, water supplies are running out, and you face the constant threat of Thai pirates and deadly tropical storms. \n\nWhat historical name was given to this massive humanitarian migration crisis?",
    evidenceKey: "reeducation_camps",
    evidenceText: "⛓️ Post-War Repression (1975+): Over 1 million South Vietnamese were sent to re-education camps, crushing any local support for the unified state.",
    options: [
      {
        text: "The 'Boat People' crisis, which eventually forced the international community to resettle over a million refugees worldwide.",
        nextNode: "civilian_complete",
        isCorrect: true
      },
      {
        text: "The Ho Chi Minh Trail Exodus, which funneled refugees overland into Thailand.",
        nextNode: "boat_fail",
        isCorrect: false
      }
    ]
  },
  boat_fail: {
    year: "1977",
    topic: "⚠️ Terminology Error",
    text: "Incorrect. The Ho Chi Minh Trail was a wartime military supply network running through Laos and Cambodia. The maritime escape route across the sea was universally known as the 'Boat People' crisis.",
    options: [
      { text: "↩️ Use correct historical terminology", nextNode: "refugee_boat_transition" }
    ]
  },
  civilian_complete: {
    year: "Completed",
    topic: "🏆 Perspective Module Secure!",
    text: "You survive the ocean crossing and arrive at a United Nations refugee camp in Malaysia before eventually resettling in the West. \n\nYou have successfully navigated the Vietnam War from the perspective of a South Vietnamese civilian. You have experienced how early political corruption, forced relocations, massive bombing campaigns, and post-war retaliation completely disrupted the civilian population—providing the deepest explanations for why the US failed to secure the country.",
    evidenceKey: "boat_people_crisis",
    evidenceText: "🌊 The Boat People (1975-90s): Hundreds of thousands fled South Vietnam by sea to escape political repression, creating a massive global humanitarian crisis.",
    options: [
      { text: "🔄 Restart Simulator (Lock in Civilian Analysis Foundations)", nextNode: "start", isReset: true },
      { text: "🏠 Return to Dashboard", nextNode: "start", isReset: true, goDashboard: true }
    ]
  }
};

// Vietnam Civilian Game state variables
let cCurrentNode = 'start';
let cTrackingScore = 0;
const cUnlockedEvidence = new Set();

// Vietnam Civilian Game initializer
export function initCivilianAdventureGame() {
  cCurrentNode = 'start';
  cTrackingScore = 0;
  cUnlockedEvidence.clear();
  
  const list = document.getElementById('c-evidence-list');
  if (list) list.innerHTML = '';
  
  renderCivilianEngine();
}

function renderCivilianEngine() {
  const data = cStoryNodes[cCurrentNode];
  if (!data) return;

  // Reset loop check
  if (data.options[0] && data.options[0].isReset && (cCurrentNode === 'start')) {
    cTrackingScore = 0;
    cUnlockedEvidence.clear();
    const list = document.getElementById('c-evidence-list');
    if (list) list.innerHTML = '';
  }

  // DOM assignments
  const domYear = document.getElementById('c-year');
  const domTopic = document.getElementById('c-topic');
  const domText = document.getElementById('c-story-text');
  const domScore = document.getElementById('c-score');

  if (domYear) domYear.innerText = data.year;
  if (domTopic) domTopic.innerText = data.topic;
  if (domText) domText.innerText = data.text;
  if (domScore) domScore.innerText = cTrackingScore;

  // Process Evidence Inventory Logging
  const insightBox = document.getElementById('c-historical-insight');
  if (insightBox) {
    if (data.evidenceKey) {
      if (!cUnlockedEvidence.has(data.evidenceKey)) {
        cUnlockedEvidence.add(data.evidenceKey);
        appendCivilianEvidenceDOM(data.evidenceText);
      }
      
      // Highlight correctness visually
      insightBox.className = "insight-box correct-node";
      insightBox.innerHTML = `<strong>✓ Socio-Cultural Fact Unlocked:</strong> Context metric logged into your active revision bank layout.`;
    } else if (data.topic.includes("Misconception") || data.topic.includes("Error") || data.topic.includes("Reality")) {
      insightBox.className = "insight-box";
      insightBox.innerHTML = `<strong>⚠️ Syllabus Distractor Blocked:</strong> Carefully read this misconception to avoid losing marks in essay answers.`;
    } else {
      insightBox.className = "insight-box hidden";
    }
  }

  // Build Interactive Choice Prompts
  const controlsBox = document.getElementById('c-options-container');
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
          cTrackingScore += 15;
          AudioEngine.play('success');
          addXp(10);
        } else {
          // Play click for regular flow, or fail sound on misconception/error nodes
          if (opt.nextNode.includes('fail')) {
            AudioEngine.play('fail');
          } else {
            AudioEngine.play('click');
          }
          addXp(3);
        }
        if (opt.nextNode === 'civilian_complete') {
          addXp(25);
        }
        cCurrentNode = opt.nextNode;
        renderCivilianEngine();
      });
      controlsBox.appendChild(btn);
    });
  }
}

function appendCivilianEvidenceDOM(text) {
  const list = document.getElementById('c-evidence-list');
  if (!list) return;
  const li = document.createElement('li');
  li.className = 'evidence-item';
  li.innerText = text;
  list.appendChild(li);
}

// =============================================================
// 2.7. NORTH VIETNAMESE ADVENTURE DATABASE
// =============================================================
const nStoryNodes = {
  start: {
    year: "Pre-1945",
    topic: "Context: French Indochina",
    text: "You grow up in a rural village in northern Tonkin under French colonial rule. Your community experiences severe exploitation: the French government holds complete monopolies on salt, alcohol, and opium, while taxing your family heavily. Local dissent is crushed brutally by the French Foreign Legion, and many of your neighbors are forced into unpaid labor on rubber plantations or inside coal mines.\n\nWhat structural reality of French rule fueled the early growth of anti-colonial resistance groups like Ho Chi Minh's Viet Minh?",
    options: [
      {
        text: "The absolute lack of political rights for the Vietnamese majority, combined with widespread economic exploitation that left the peasantry impoverished.",
        nextNode: "french_colonial_success",
        isCorrect: true
      },
      {
        text: "The French policy of forcing all Vietnamese citizens to move to industrial cities in France to work in car factories.",
        nextNode: "french_colonial_fail",
        isCorrect: false
      }
    ]
  },
  french_colonial_fail: {
    year: "Pre-1945",
    topic: "⚠️ Colonial Context Misconception",
    text: "Incorrect. The French did not move the population to Europe; they exploited Vietnam's natural resources (rubber, rice, coal) right on the spot, using the local population as cheap, heavily controlled labor. This exploitation directly fueled nationalist resistance.",
    options: [
      { text: "↩️ Correct your understanding of French Indochina", nextNode: "start" }
    ]
  },
  french_colonial_success: {
    year: "1945-1954",
    topic: "Context: First Indochina War",
    text: "Correct! The deep inequalities of French colonialism turned the rural population into a solid base for nationalist resistance.\n\nSeptember 1945. Following the defeat of Japanese occupation forces, Ho Chi Minh steps up to a microphone in Hanoi and declares the independence of the Democratic Republic of Vietnam, quoting the US Declaration of Independence. \n\nHowever, the French return with military force to reclaim their empire, starting the First Indochina War. After nine long years of brutal guerrilla warfare, your forces trap the French army in a remote valley fortress in 1954. What was the name of this decisive battle that broke the French empire?",
    evidenceKey: "anti_colonial_roots",
    evidenceText: "✊ Anti-Colonial Motivation: Decades of oppressive French economic exploitation unified the Vietnamese population, viewing the conflict as a long-term fight for national survival.",
    options: [
      {
        text: "The Battle of Dien Bien Phu",
        nextNode: "dien_bien_phu_success",
        isCorrect: true
      },
      {
        text: "The Battle of Inchon",
        nextNode: "dien_bien_phu_fail",
        isCorrect: false
      }
    ]
  },
  dien_bien_phu_fail: {
    year: "1954",
    topic: "⚠️ Battle Identification Error",
    text: "Incorrect. The Battle of Inchon was an amphibious landing during the Korean War. The siege that defeated the French in Vietnam was the Battle of Dien Bien Phu (1954), which led directly to the Geneva Conference.",
    options: [
      { text: "↩️ Correct your battle data points", nextNode: "french_colonial_success" }
    ]
  },
  dien_bien_phu_success: {
    year: "1955",
    topic: "3.1: Consolidation of the North",
    text: "Correct! General Vo Nguyen Giap's victory at Dien Bien Phu shattered French colonial rule, leading to the partition of Vietnam at the 17th Parallel.\n\nNow secure in Hanoi, Ho Chi Minh’s government launches a sweeping land reform campaign. Party cadres arrive in your village to dismantle the old colonial landlord system, redistributing land to poor peasants, though the process involves harsh ideological trials.\n\nWhat was the primary political value of this program for the upcoming war against the US-backed South?",
    evidenceKey: "dien_bien_phu_54",
    evidenceText: "💥 Dien Bien Phu (1954): The decisive military victory over France that proved Vietnamese guerrilla strategies could defeat a Western superpower.",
    options: [
      {
        text: "It secured the absolute loyalty of the rural peasantry to the communist party, creating a highly unified home front.",
        nextNode: "land_reform_success",
        isCorrect: true
      },
      {
        text: "It converted the entire population to industrial manufacturing, ending agricultural rice production completely.",
        nextNode: "land_reform_fail",
        isCorrect: false
      }
    ]
  },
  land_reform_fail: {
    year: "1955",
    topic: "⚠️ Strategy Misconception",
    text: "Incorrect. The land reforms targeted rural farming land, keeping agricultural production central to the economy. By giving land to the poorest families, the party gained deep ideological loyalty from the peasantry.",
    options: [
      { text: "↩️ Correct your land reform analysis", nextNode: "dien_bien_phu_success" }
    ]
  },
  land_reform_success: {
    year: "1965",
    topic: "3.2 / 3.3: Rolling Thunder",
    text: "Correct! The land reforms secured solid peasant backing, giving the regime a highly resilient home front.\n\nIn 1965, the US launches 'Operation Rolling Thunder'—a massive strategic bombing campaign targeting North Vietnam. Air raid sirens sound daily. To survive this onslaught and keep society functioning, how does the civilian population adapt?",
    evidenceKey: "north_land_loyalty",
    evidenceText: "🌾 Peasant Support Base: Land reforms gave millions of poor peasants an economic stake in the regime's survival, ensuring strong support during future US air wars.",
    options: [
      {
        text: "The government evacuates factories and schools to remote jungle caves, while citizens dig millions of small, concrete 'manhole' shelters along city streets.",
        nextNode: "rolling_thunder_success",
        isCorrect: true
      },
      {
        text: "Civilians riot against the government in Hanoi, demanding an immediate surrender to stop the American bombings.",
        nextNode: "rolling_thunder_fail",
        isCorrect: false
      }
    ]
  },
  rolling_thunder_fail: {
    year: "1965",
    topic: "⚠️ Morale Misconception",
    text: "Incorrect. US planners thought the bombing campaigns would break civilian morale, but it had the exact opposite effect. It unified the population against the foreign threat and strengthened their determination to resist.",
    options: [
      { text: "↩️ Re-evaluate civilian resilience data", nextNode: "land_reform_success" }
    ]
  },
  rolling_thunder_success: {
    year: "1967",
    topic: "3.3: The Ho Chi Minh Trail Logistics",
    text: "Correct! Decentralizing society into caves and street shelters neutralized the strategic goals of the US air war.\n\nIn 1967, you join the military logistics corps and are sent south down the Ho Chi Minh Trail. This is a grueling journey through the jungle. You march for months on foot through neutral Laos and Cambodia, carrying 40kg of supplies on your back. B-52 strikes rain down unexploded ordnance, and your unit is devastated by severe bouts of malaria.\n\nHow did this trail network survive such constant, intense US military pressure?",
    evidenceKey: "civilian_adaptation",
    evidenceText: "🛡️ Air Raid Defense (1965): Millions of street-level manhole shelters and the relocation of infrastructure into caves protected the workforce and kept the war effort going.",
    options: [
      {
        text: "It was a constantly changing, 12,000-mile web of hidden dirt tracks and footpaths hidden under thick jungle cover, repaired overnight by over 500,000 civilian workers.",
        nextNode: "trail_success",
        isCorrect: true
      },
      {
        text: "It was a wide, concrete highway network defended by a fleet of advanced jet fighter aircraft.",
        nextNode: "trail_fail",
        isCorrect: false
      }
    ]
  },
  trail_fail: {
    year: "1967",
    topic: "⚠️ Logistical Structure Error",
    text: "Incorrect. The trail survived precisely because it was low-tech, flexible, and heavily camouflaged. Symmetrical concrete highways would have been easily destroyed by American bombers. It was kept open through sheer, continuous human effort.",
    options: [
      { text: "↩️ Correct your understanding of guerrilla logistics", nextNode: "rolling_thunder_success" }
    ]
  },
  trail_success: {
    year: "1968",
    topic: "3.4 / 4.1: The Tet Offensive Realities",
    text: "Correct! The trail's flexible, decentralized design made it practically impossible for US air power to cut off supply lines.\n\nJanuary 1968. Your unit participates in the massive, synchronized surprise attack of the Tet Offensive, striking over 100 cities in South Vietnam. However, the expected urban uprising fails to happen. Superior US firepower and air support pin your units down. Your forces suffer a military catastrophe, losing over 45,000 fighters and nearly wiping out the underground Vietcong infrastructure.\n\nDespite this severe military defeat in the field, why was the Tet Offensive considered the ultimate political success for your side?",
    evidenceKey: "trail_hardships",
    evidenceText: "🚚 Ho Chi Minh Trail: A flexible, 12,000-mile logistical network that relied on half a million workers to manually transport supplies despite disease and heavy bombing.",
    options: [
      {
        text: "The sheer scale of the attacks was broadcast on US television, destroying public trust in the US government and opening a severe 'Credibility Gap' that turned the American public against the war.",
        nextNode: "tet_success",
        isCorrect: true
      },
      {
        text: "It forced the South Vietnamese army to immediately surrender and hand over Saigon.",
        nextNode: "tet_fail",
        isCorrect: false
      }
    ]
  },
  tet_fail: {
    year: "1968",
    topic: "⚠️ Outcome Analysis Error",
    text: "Incorrect. Militarily, the US and ARVN won the battle and held all the cities. The true impact of Tet was psychological—it shattered the US government's claims that the war was almost won, accelerating the anti-war movement in America.",
    options: [
      { text: "↩️ Align your military vs. political outcomes", nextNode: "trail_success" }
    ]
  },
  tet_success: {
    year: "1972",
    topic: "4.3: Operation Linebacker II",
    text: "Correct! Tet was a military defeat but a massive political triumph, shifting US policy toward withdrawal and 'Vietnamization'.\n\nDecember 1972. President Nixon launches 'Operation Linebacker II'—the intense 'Christmas Bombings' targeting Hanoi to force concessions at the peace talks. Massive B-52 formations drop heavy payloads over your neighborhoods. \n\nTo defend your capital, your military forces deploy advanced technology supplied by your superpower allies. What systems helped counter the American air superiority?",
    evidenceKey: "tet_credibility_gap",
    evidenceText: "📺 Tet Outcomes (1968): A severe military loss for communist forces, but a decisive political victory that created a 'Credibility Gap' and turned US public opinion against the war.",
    options: [
      {
        text: "Soviet-supplied radar networks and Surface-to-Air Missiles (SAMs) that shot down dozens of B-52 bombers over the city.",
        nextNode: "linebacker_success",
        isCorrect: true
      },
      {
        text: "Anti-aircraft laser arrays built locally in underground factories.",
        nextNode: "linebacker_fail",
        isCorrect: false
      }
    ]
  },
  linebacker_fail: {
    year: "1972",
    topic: "⚠️ Technology Mapping Error",
    text: "Incorrect. North Vietnam depended heavily on advanced military equipment supplied by the Soviet Union (USSR) and China. Soviet SAM systems were the primary weapons used to counter US heavy bombers over Hanoi.",
    options: [
      { text: "↩️ Correct your superpower alliance tracking", nextNode: "tet_success" }
    ]
  },
  linebacker_success: {
    year: "1975",
    topic: "4.4: Fall of Saigon & Unification",
    text: "Correct! Soviet SAM systems inflicted unsustainable aircraft losses on the US Air Force, helping secure the signing of the Paris Peace Accords and the final withdrawal of US forces.\n\nApril 30, 1975. You stand in the streets as news arrives that communist tanks have crashed through the gates of the Presidential Palace in Saigon. The war is won, and the country is unified under a single socialist flag. \n\nLooking back on the decades of conflict since the days of French colonial rule, you reflect on the absolute commitment required to defeat a superpower. What was the estimated scale of total Vietnamese casualties?",
    evidenceKey: "soviet_aid_network",
    evidenceText: "🚀 Superpower Aid: Material assistance and SAM technology transfers from the Soviet Union were critical in limiting the effectiveness of US strategic bombing campaigns.",
    options: [
      {
        text: "Between 2 to 3 million Vietnamese soldiers and civilians dead, showing a level of total war sacrifice that conventional military strategies could not break.",
        nextNode: "extended_complete",
        isCorrect: true
      },
      {
        text: "Fewer than 10,000 casualties due to the rural nature of the guerrilla fighting.",
        nextNode: "extended_cost_fail",
        isCorrect: false
      }
    ]
  },
  extended_cost_fail: {
    year: "1975",
    topic: "⚠️ Casualty Misconception",
    text: "Incorrect. The human toll was massive, with between 2 to 3 million Vietnamese losing their lives across both sides. This immense sacrifice highlights a determination for national independence that conventional US military containment strategies completely underestimated.",
    options: [
      { text: "↩️ Correct your casualty data values", nextNode: "linebacker_success" }
    ]
  },
  extended_complete: {
    year: "Completed",
    topic: "🏆 Full Syllabus Perspective Unlocked!",
    text: "You have completed the full chronological journey from the perspective of the North Vietnamese forces.\n\nYou have traced the entire conflict: from the early roots of anti-colonial resistance against France, through the land reforms that unified the peasantry, the survival strategies against Operation Rolling Thunder, the grueling hardships of the Ho Chi Minh Trail, the military devastation yet political triumph of Tet, and the final unification of 1975. You now possess a comprehensive, top-tier analytical framework for your GCSE history exam.",
    evidenceKey: "total_war_commitment",
    evidenceText: "🇻🇳 Total War Dedication: The sacrifice of 2-3 million lives underscores a determination for independence that conventional US military strategies could not break.",
    options: [
      { text: "🔄 Restart Simulator (Lock in Complete Historical Knowledge Security)", nextNode: "start", isReset: true },
      { text: "🏠 Return to Dashboard", nextNode: "start", isReset: true, goDashboard: true }
    ]
  }
};

// North Vietnamese Game state variables
let nExtendedCurrentNode = 'start';
let nExtendedTrackingScore = 0;
const nExtendedUnlockedEvidence = new Set();

// North Vietnamese Game initializer
export function initNorthVietnamAdventureGame() {
  nExtendedCurrentNode = 'start';
  nExtendedTrackingScore = 0;
  nExtendedUnlockedEvidence.clear();
  
  const list = document.getElementById('n-evidence-list');
  if (list) list.innerHTML = '';
  
  renderNorthVietnamEngine();
}

function renderNorthVietnamEngine() {
  const data = nStoryNodes[nExtendedCurrentNode];
  if (!data) return;

  // Reset loop check
  if (data.options[0] && data.options[0].isReset && (nExtendedCurrentNode === 'start')) {
    nExtendedTrackingScore = 0;
    nExtendedUnlockedEvidence.clear();
    const list = document.getElementById('n-evidence-list');
    if (list) list.innerHTML = '';
  }

  // DOM assignments
  const domYear = document.getElementById('n-year');
  const domTopic = document.getElementById('n-topic');
  const domText = document.getElementById('n-story-text');
  const domScore = document.getElementById('n-score');

  if (domYear) domYear.innerText = data.year;
  if (domTopic) domTopic.innerText = data.topic;
  if (domText) domText.innerText = data.text;
  if (domScore) domScore.innerText = nExtendedTrackingScore;

  // Process Evidence Inventory Logging
  const insightBox = document.getElementById('n-historical-insight');
  if (insightBox) {
    if (data.evidenceKey) {
      if (!nExtendedUnlockedEvidence.has(data.evidenceKey)) {
        nExtendedUnlockedEvidence.add(data.evidenceKey);
        appendNorthVietnamEvidenceDOM(data.evidenceText);
      }
      
      // Highlight correctness visually
      insightBox.className = "insight-box correct-node";
      insightBox.innerHTML = `<strong>✓ High-Value Case Study Unlocked:</strong> Context metric logged into your active essay bank profile on the right panel.`;
    } else if (data.topic.includes("Misconception") || data.topic.includes("Error") || data.topic.includes("Reality")) {
      insightBox.className = "insight-box";
      insightBox.innerHTML = `<strong>⚠️ Syllabus Distractor Blocked:</strong> Note this correction carefully to safeguard your marks against common exam mistakes.`;
    } else {
      insightBox.className = "insight-box hidden";
    }
  }

  // Build Interactive Choice Prompts
  const controlsBox = document.getElementById('n-options-container');
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
          nExtendedTrackingScore += 15;
          AudioEngine.play('success');
          addXp(10);
        } else {
          // Play click for regular flow, or fail sound on misconception/error nodes
          if (opt.nextNode.includes('fail')) {
            AudioEngine.play('fail');
          } else {
            AudioEngine.play('click');
          }
          addXp(3);
        }
        if (opt.nextNode === 'extended_complete') {
          addXp(25);
        }
        nExtendedCurrentNode = opt.nextNode;
        renderNorthVietnamEngine();
      });
      controlsBox.appendChild(btn);
    });
  }
}

function appendNorthVietnamEvidenceDOM(text) {
  const list = document.getElementById('n-evidence-list');
  if (!list) return;
  const li = document.createElement('li');
  li.className = 'evidence-item';
  li.innerText = text;
  list.appendChild(li);
}
