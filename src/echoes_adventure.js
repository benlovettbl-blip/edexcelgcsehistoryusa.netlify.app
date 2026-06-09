import { AudioEngine } from './audio.js';
import { switchView } from './navigation.js';
import { addXp } from './views.js';

// =========================================================================
// GAME STATE & CONFIGURATION
// =========================================================================
let currentAct = 1;
let activeMode = 'LOOK';
let activeChar = 'ACTIVIST'; // Alternates with 'SOLDIER' in Act 2
let inventory = [];
let gameXp = 0;
let voiceEnabled = true;
let currentQuestion = null; // Active quiz prompt
let activeScene = 'ACT1_MONUMENTS';

// Preloaded background images cache
const sceneImages = {};
const sceneImageUrls = {
  ACT1_MONUMENTS: 'assets/scenes/lincoln_memorial.png',
  ACT2_FIREBASE: 'assets/scenes/vietnam_firebase.png',
  ACT2_CAMPUS: 'assets/scenes/kent_state.png',
  ACT3_FINALE: 'assets/scenes/saigon_evacuation.png'
};

// Hotspots with coordinate triggers
const hotspots = {
  ACT1_MONUMENTS: [
    {
      id: 'monument',
      name: 'Lincoln Statue',
      x: 425, y: 190, radius: 45,
      look: 'A towering marble statue of Abraham Lincoln sitting in his chair. He represents the promise of freedom and civil rights.',
      interact: 'You stand before the statue of Lincoln, inspired by the struggle for equality.'
    },
    {
      id: 'podium',
      name: 'Speaker Podium',
      x: 395, y: 275, radius: 35,
      look: 'The wooden podium where speakers address the March on Washington. You see some notes left on it.',
      interact: 'You search the podium and find some scrambled "Speech Notes" about the 14th Amendment and legal segregation.',
      item: 'Speech Notes'
    },
    {
      id: 'bench',
      name: 'Stone Bench',
      x: 710, y: 310, radius: 35,
      look: 'A heavy stone bench. A megaphone is sitting on it.',
      interact: 'You pick up the Megaphone! This will make your voice carry.',
      item: 'Megaphone'
    },
    {
      id: 'banner',
      name: 'Protest Banner',
      x: 170, y: 200, radius: 45,
      look: 'A large, blank protest banner stretched between two poles. It needs a clear civil rights slogan.',
      interact: 'You write a bold slogan: "EQUAL PROTECTION UNDER THE 14TH AMENDMENT!"'
    }
  ],
  ACT2_FIREBASE: [
    {
      id: 'radio',
      name: 'Radio Console',
      x: 190, y: 245, radius: 40,
      look: 'A military radio console. It is static-filled and needs a specific frequency to communicate with command.',
      interact: 'The radio console is static-filled. If you have the frequency from the home front, use it to call in air support.'
    },
    {
      id: 'maps',
      name: 'Tactical Maps',
      x: 430, y: 250, radius: 45,
      look: 'Tactical maps of the Mekong Delta and the Ho Chi Minh Trail. It details the containment strategy.',
      interact: 'The map shows Vietcong troop concentrations. They rely on guerrilla tactics and hide in local villages.'
    },
    {
      id: 'clipboard',
      name: 'Decryption Clipboard',
      x: 675, y: 250, radius: 40,
      look: 'An intelligence clipboard detailing enemy codewords. It is locked behind a codeword cipher.',
      interact: 'The clipboard text reads: [CIPHER: KEYWORD REQ]. The key is a major Cold War concept.'
    }
  ],
  ACT2_CAMPUS: [
    {
      id: 'flyer_stand',
      name: 'Flyer Stand',
      x: 195, y: 280, radius: 40,
      look: 'A stand stacked with anti-war flyers.',
      interact: 'You take a flyer. It reads: "RALLY RADIO: 70.2 MHz, CODEWORD: DOMINO." This is the key!',
      item: 'Anti-Draft Flyer'
    },
    {
      id: 'board',
      name: 'Bulletin Board',
      x: 450, y: 190, radius: 45,
      look: 'A board detailing draft deferment rules: wealthy students stay in college, while working-class citizens get drafted.',
      interact: 'You inspect the board, noting the inequalities of the conscription system.'
    },
    {
      id: 'campus_bench',
      name: 'Campus Megaphone',
      x: 705, y: 295, radius: 35,
      look: 'A megaphone sits on a stone bench.',
      interact: 'You pick up the Megaphone to rally anti-war students.',
      item: 'Megaphone'
    }
  ],
  ACT3_FINALE: [
    {
      id: 'kissinger',
      name: 'Negotiation Table',
      x: 210, y: 230, radius: 45,
      look: 'Delegates are signing the Paris Peace Accords (1973), agreeing to a full withdrawal of US forces.',
      interact: 'You witness the signing.'
    },
    {
      id: 'television',
      name: 'Saigon TV Broadcast',
      x: 470, y: 195, radius: 45,
      look: 'A TV set broadcasting the fall of Saigon (April 1975). Helicopters are evacuating people from the US Embassy roof.',
      interact: 'You watch the broadcast. The US containment policy has collapsed.'
    },
    {
      id: 'draft_card',
      name: 'Draft Document',
      x: 710, y: 240, radius: 35,
      look: 'Selective Service registration cards marked with a giant red stamp: "ABOLISHED".',
      interact: 'You check the document. Domestic protests and politics ended the draft in 1973.'
    }
  ]
};

// Walkthrough hints mapping
const actHints = {
  1: "💡 ACT 1 HINT: Click the Stone Bench to pick up the Megaphone, and click the Speaker Podium to pick up the Speech Notes. Once you have both, click the Speaker Podium again to address the marchers!",
  2: {
    ACTIVIST: "💡 ACT 2 HINT (Activist): Click the Flyer Stand to collect the Anti-Draft Flyer. It contains the radio frequency (70.2 MHz) and codeword (DOMINO). Then click 'SWAP HERO' to switch back to the Soldier and use this info on the Radio!",
    SOLDIER: "💡 ACT 2 HINT (Soldier): You need the frequency and codeword from the Kent State home front. Click 'SWAP HERO' to alternate characters, search the Flyer Stand as the Activist, then swap back and click the Radio Console!"
  },
  3: "💡 ACT 3 HINT: Click the Negotiation Table to read the Paris Peace Accords and click the Television to watch the Saigon evacuation. Answer the quiz questions to complete the revision simulation!"
};

// Canvas references
let canvas = null;
let ctx = null;
let hoveredHotspot = null;
let gameLoopActive = false;

// =========================================================================
// INITIALIZER
// =========================================================================
export function initEchoesAdventureGame() {
  canvas = document.getElementById('adv-canvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  // Bind global functions to window for HTML handlers
  window.toggleMute = toggleMute;
  window.setMode = setMode;
  window.triggerCharacterSwap = triggerCharacterSwap;
  window.handleParseSubmit = handleParseSubmit;
  window.showActHint = showActHint;
  window.handleOptionSelect = handleOptionSelect;

  // Preload illustrated backdrop scenes
  preloadSceneImages();

  // Reset state
  currentAct = 1;
  activeChar = 'ACTIVIST';
  inventory = [];
  gameXp = 0;
  currentQuestion = null;
  activeScene = 'ACT1_MONUMENTS';
  activeMode = 'LOOK';
  hoveredHotspot = null;

  // Sync HUD
  syncHUD();

  // Clear and setup log
  const logStream = document.getElementById('log-stream');
  if (logStream) {
    logStream.innerHTML = `<p class="sys-text">[CRITICAL SYSTEM READY: ECHOES ENGINE ACTIVE]</p>
    <p class="sys-text">[LOCATION: WASHINGTON D.C. - AUGUST 1963]</p>
    <p>You are a <span class="keyword-text">Core Activist</span> at the Lincoln Memorial. Over 250,000 marchers are gathering. Click on the illustrated scene hotspots to explore, or type revision commands in the terminal below.</p>`;
    logStream.scrollTop = logStream.scrollHeight;
  }

  // Setup mode buttons
  updateActionBar();

  // Register canvas mouse events for hotspot hover and click
  canvas.removeEventListener('mousemove', handleCanvasMouseMove);
  canvas.removeEventListener('click', handleCanvasClick);
  canvas.addEventListener('mousemove', handleCanvasMouseMove);
  canvas.addEventListener('click', handleCanvasClick);

  // Boot up loop
  gameLoopActive = true;
  requestAnimationFrame(gameLoop);
}

function preloadSceneImages() {
  for (const [key, url] of Object.entries(sceneImageUrls)) {
    if (typeof window.Image === 'function' && !sceneImages[key]) {
      const img = new Image();
      img.src = url;
      sceneImages[key] = img;
    }
  }
}

// =========================================================================
// GAME LOOP
// =========================================================================
function gameLoop() {
  if (!gameLoopActive) return;
  renderFrame();
  requestAnimationFrame(gameLoop);
}

// =========================================================================
// RENDER MODULES
// =========================================================================
function renderFrame() {
  if (!canvas || !ctx) return;

  // Clear Canvas
  ctx.fillStyle = '#05070c';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw preloaded background illustration scene
  drawSceneBackground();

  // Draw Hotspots (Flashing neon rings)
  drawSceneHotspots();

  // Draw Hover Highlight Overlay
  if (hoveredHotspot) {
    ctx.strokeStyle = activeMode === 'LOOK' ? 'rgba(16, 185, 129, 0.75)' : (activeMode === 'INTERACT' ? 'rgba(245, 158, 11, 0.75)' : 'rgba(56, 189, 248, 0.75)');
    ctx.lineWidth = 2.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(hoveredHotspot.x, hoveredHotspot.y, hoveredHotspot.radius + 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Hover tooltip text box
    const textLabel = `CLICK TO EXAMINE: ${hoveredHotspot.name.toUpperCase()}`;
    ctx.font = 'bold 11px monospace';
    const textWidth = ctx.measureText(textLabel).width;
    ctx.fillStyle = 'rgba(3, 7, 18, 0.9)';
    ctx.fillRect(hoveredHotspot.x - (textWidth / 2) - 6, hoveredHotspot.y - hoveredHotspot.radius - 30, textWidth + 12, 20);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.strokeRect(hoveredHotspot.x - (textWidth / 2) - 6, hoveredHotspot.y - hoveredHotspot.radius - 30, textWidth + 12, 20);

    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.fillText(textLabel, hoveredHotspot.x, hoveredHotspot.y - hoveredHotspot.radius - 16);
    ctx.textAlign = 'left'; // reset
  }

  // Draw current objective overlay indicator in the corner of canvas
  ctx.fillStyle = 'rgba(3, 7, 18, 0.8)';
  ctx.fillRect(15, 15, 220, 26);
  ctx.strokeStyle = '#10B981';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(15, 15, 220, 26);
  ctx.fillStyle = '#FFF';
  ctx.font = 'bold 11px monospace';
  ctx.fillText(`SYSTEM ENGINE ACTIVE`, 25, 31);
}

function drawSceneBackground() {
  const bgImg = sceneImages[activeScene];
  if (bgImg && bgImg.complete && bgImg.naturalWidth !== 0) {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
  } else {
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#090d16');
    grad.addColorStop(1, '#020617');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function drawSceneHotspots() {
  const sceneHotspots = hotspots[activeScene];
  if (!sceneHotspots) return;

  sceneHotspots.forEach(h => {
    // We don't draw hotspots for items already picked up
    if (h.item && inventory.includes(h.item)) return;

    const pulse = Math.sin(Date.now() / 200) * 3;

    // Glowing center dot
    ctx.fillStyle = h.id === 'monument' || h.id === 'television' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(245, 158, 11, 0.45)';
    ctx.beginPath();
    ctx.arc(h.x, h.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Outer pulsing ring
    ctx.strokeStyle = h.id === 'monument' || h.id === 'television' ? 'rgba(56, 189, 248, 0.75)' : 'rgba(245, 158, 11, 0.75)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(h.x, h.y, 14 + pulse, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// =========================================================================
// MOUSE INTERACTIVE TRIGGERS
// =========================================================================
function handleCanvasMouseMove(e) {
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const mX = (e.clientX - rect.left) * scaleX;
  const mY = (e.clientY - rect.top) * scaleY;

  const sceneHotspots = hotspots[activeScene];
  if (!sceneHotspots) return;

  let found = null;
  for (const h of sceneHotspots) {
    if (h.item && inventory.includes(h.item)) continue; // ignore taken items

    const dx = h.x - mX;
    const dy = h.y - mY;
    if (Math.sqrt(dx * dx + dy * dy) <= h.radius) {
      found = h;
      break;
    }
  }

  hoveredHotspot = found;
  canvas.style.cursor = found ? 'pointer' : 'default';
}

function handleCanvasClick(e) {
  if (!canvas) return;

  const hs = hoveredHotspot;
  if (hs) {
    AudioEngine.play('click');
    executeSmartAction(hs);
  }
}

// =========================================================================
// SMART INTERACTION SYSTEM (No Clunky Modes)
// =========================================================================
function executeSmartAction(hs) {
  // 1. Special Case: Speaker Podium (Act 1)
  if (hs.id === 'podium') {
    logText(`👁️ You examine the Speaker Podium:`);
    logText(`"${hs.look}"`);
    if (voiceEnabled) AudioEngine.speak(hs.look);

    const hasMegaphone = inventory.includes('Megaphone');
    const hasNotes = inventory.includes('Speech Notes');

    if (hasMegaphone && hasNotes) {
      AudioEngine.play('success');
      logSuccess('✓ Success! You mount the Megaphone at the podium to address the crowd on the steps of the Lincoln Memorial.');
      triggerFactualQuestion('march');
    } else if (!hasNotes) {
      inventory.push('Speech Notes');
      logSuccess('✓ Retrieved item: [Speech Notes] from the Speaker Podium!');
      syncHUD();
      if (!hasMegaphone) {
        logText('Objective check: You have the Speech Notes, but your voice won\'t carry. Inspect the Stone Bench on the right to retrieve the Megaphone.');
      } else {
        logText('Objective check: You have both items! Click the podium again (or type "use megaphone") to speak to the crowd.');
      }
    } else {
      logError('⚠️ You have the Speech Notes, but your voice won\'t carry! Inspect the Stone Bench on the right to retrieve the Megaphone first.');
    }
    return;
  }

  // 2. Special Case: Radio Console (Act 2)
  if (hs.id === 'radio') {
    logText(`👁️ You examine the Radio Console:`);
    logText(`"${hs.look}"`);
    if (voiceEnabled) AudioEngine.speak(hs.look);

    if (inventory.includes('Anti-Draft Flyer')) {
      AudioEngine.play('success');
      logSuccess('✓ Success! You use the broadcast details from the anti-draft flyer. You tune the radio to 70.2 MHz and key in codeword: DOMINO.');
      solveVietnamRadio();
    } else {
      logError('⚠️ The radio is filled with static. You need the frequency and codeword from the Kent State home front. Click "SWAP HERO" to switch to the Activist and locate them!');
    }
    return;
  }

  // 3. General item collection
  if (hs.item && !inventory.includes(hs.item)) {
    inventory.push(hs.item);
    logSuccess(`✓ Retrieved item: [${hs.item}]!`);
    syncHUD();
    return;
  }

  // 4. Default look interactions
  logText(`👁️ You examine the ${hs.name}:`);
  logText(`"${hs.look}"`);
  if (voiceEnabled) AudioEngine.speak(hs.look);

  if (hs.id === 'clipboard') {
    triggerFactualQuestion('domino');
  } else if (hs.id === 'television') {
    triggerFactualQuestion('saigon');
  } else if (hs.id === 'kissinger') {
    triggerFactualQuestion('paris');
  } else if (hs.id === 'banner') {
    logSuccess('✓ Protest Banner updated: Slogan "EQUAL PROTECTION UNDER THE 14TH AMENDMENT" written in bold ink.');
  }
}

// =========================================================================
// ACTION BAR & MULTIPLE CHOICE INTERFACE
// =========================================================================
function setMode(mode) {
  AudioEngine.play('click');
  activeMode = mode;
  logText(`[SYSTEM: Switched interaction focus to ${mode}]`);
  updateActionBar();
}

function updateActionBar() {
  const btnLook = document.getElementById('mode-look');
  const btnInteract = document.getElementById('mode-interact');
  const btnCombine = document.getElementById('mode-combine');
  const btnOptA = document.getElementById('opt-a-btn');
  const btnOptB = document.getElementById('opt-b-btn');

  if (currentQuestion) {
    // Hide standard buttons
    if (btnLook) btnLook.style.display = 'none';
    if (btnInteract) btnInteract.style.display = 'none';
    if (btnCombine) btnCombine.style.display = 'none';

    // Show Option buttons with question options
    if (btnOptA) {
      btnOptA.style.display = 'block';
      btnOptA.textContent = `🟢 A: ${currentQuestion.optionA}`;
    }
    if (btnOptB) {
      btnOptB.style.display = 'block';
      btnOptB.textContent = `🔵 B: ${currentQuestion.optionB}`;
    }
  } else {
    // Show standard buttons
    if (btnLook) {
      btnLook.style.display = 'block';
      btnLook.className = activeMode === 'LOOK' ? 'action-btn active' : 'action-btn';
    }
    if (btnInteract) {
      btnInteract.style.display = 'block';
      btnInteract.className = activeMode === 'INTERACT' ? 'action-btn active' : 'action-btn';
    }
    if (btnCombine) {
      btnCombine.style.display = 'block';
      btnCombine.className = activeMode === 'COMBINE' ? 'action-btn active' : 'action-btn';
    }

    // Hide Option buttons
    if (btnOptA) btnOptA.style.display = 'none';
    if (btnOptB) btnOptB.style.display = 'none';
  }
}

function handleOptionSelect(choice) {
  submitQuizAnswer(choice.toLowerCase());
}

function submitQuizAnswer(choice) {
  if (!currentQuestion) return;

  const userChoice = choice.trim().toLowerCase();
  const correctChoice = currentQuestion.correctAnswer;

  if (userChoice === 'a' || userChoice === 'b' || userChoice.includes('option a') || userChoice.includes('option b')) {
    const isCorrect = userChoice === correctChoice || userChoice.includes('option ' + correctChoice) || userChoice.startsWith(correctChoice);
    if (isCorrect) {
      AudioEngine.play('success');
      logSuccess(currentQuestion.feedbackSuccess);
      gameXp += 25;
      const resolveFn = currentQuestion.resolve;
      currentQuestion = null;
      syncHUD();
      updateActionBar();
      resolveFn();
    } else {
      AudioEngine.play('fail');
      logError(currentQuestion.feedbackFail);
    }
  } else {
    logError(`⚠️ Please answer by clicking Option A or Option B, or type "A" or "B".`);
  }
}

// =========================================================================
// WALKTHROUGH HINTS & OBJECTIVE ENGINE
// =========================================================================
function showActHint() {
  AudioEngine.play('click');
  let hint = "";
  if (currentAct === 1) {
    hint = actHints[1];
  } else if (currentAct === 2) {
    hint = actHints[2][activeChar];
  } else {
    hint = actHints[3];
  }
  logText(`<span style="color: #f59e0b; font-weight: bold;">${hint}</span>`);
}

function getObjectiveText() {
  if (currentAct === 1) {
    const hasMegaphone = inventory.includes('Megaphone');
    const hasNotes = inventory.includes('Speech Notes');
    if (!hasMegaphone && !hasNotes) {
      return "Retrieve the Speech Notes from the Speaker Podium and the Megaphone from the Stone Bench.";
    } else if (!hasMegaphone) {
      return "Speech Notes collected! Find the Megaphone sitting on the stone bench.";
    } else if (!hasNotes) {
      return "Megaphone collected! Find the Speech Notes on the Speaker Podium.";
    } else {
      return "Megaphone and notes collected! Click the Speaker Podium to address the March on Washington crowd.";
    }
  } else if (currentAct === 2) {
    if (activeChar === 'SOLDIER') {
      if (inventory.includes('Anti-Draft Flyer')) {
        return "Frequency secure! Click on the Radio Console to tune it and call reinforcements.";
      } else {
        return "Communications are down. Click 'SWAP HERO' to switch to the home front at Kent State and locate the frequency.";
      }
    } else {
      if (inventory.includes('Anti-Draft Flyer')) {
        return "Anti-Draft Flyer collected! Click 'SWAP HERO' to return to the Soldier in Vietnam and transmit the codes.";
      } else {
        return "Protests are peaking at Kent State. Inspect the Flyer Stand to find the anti-draft frequency flyer.";
      }
    }
  } else if (currentAct === 3) {
    return "Witness the final chapter: Click the Negotiation Table to read the treaty, and the TV to watch the evacuation.";
  }
  return "Explore the scene to revise critical historical points.";
}

function triggerCharacterSwap() {
  if (currentAct !== 2) {
    logText('👥 Hero Swap is only available in Act 2 to alternate perspectives!');
    return;
  }
  AudioEngine.play('flip');
  if (activeChar === 'ACTIVIST') {
    activeChar = 'SOLDIER';
    activeScene = 'ACT2_FIREBASE';
    logSuccess('👥 Swapped to SOLDIER in Vietnam (1968 Jungle Firebase).');
  } else {
    activeChar = 'ACTIVIST';
    activeScene = 'ACT2_CAMPUS';
    logSuccess('👥 Swapped to CORE ACTIVIST at Kent State University (1970).');
  }
  syncHUD();
}

// =========================================================================
// HISTORICAL EXAMINATION QUESTIONS
// =========================================================================
function triggerFactualQuestion(type) {
  if (type === 'march') {
    currentQuestion = {
      text: 'EXAM QUESTION: What was the primary legal justification used by NAACP lawyers in Brown v. Board of Education (1954)?',
      optionA: 'The 14th Amendment Equal Protection Clause',
      optionB: 'The 15th Amendment Voting Guarantee',
      correctAnswer: 'a',
      feedbackSuccess: 'Correct! The 14th Amendment Equal Protection Clause was the cornerstone of desegregation. +25 XP.',
      feedbackFail: 'Incorrect. The 15th Amendment protects voting. Brown relied on equal protection. Try again!',
      resolve: () => {
        currentAct = 2;
        activeChar = 'SOLDIER';
        activeScene = 'ACT2_FIREBASE';
        const swapBtn = document.getElementById('swap-btn');
        if (swapBtn) swapBtn.style.display = 'block';
        
        logSuccess('--- PROCEEDING TO ACT 2: DUAL CAMPAIGNS ---');
        logText('You are now a Soldier in a Vietnam Firebase. Vietcong guerrilla attacks have increased. You must decrypt communications and call for reinforcements.');
        syncHUD();
      }
    };
  } else if (type === 'domino') {
    currentQuestion = {
      text: 'EXAM QUESTION: Which Cold War doctrine stated that if South Vietnam fell to communism, neighboring states would follow?',
      optionA: 'Containment Policy',
      optionB: 'Domino Theory',
      correctAnswer: 'b',
      feedbackSuccess: 'Correct! Eisenhower formulated the Domino Theory in 1954 to justify funding the French and later Ngo Dinh Diem. +25 XP.',
      feedbackFail: 'Incorrect. The broad strategy was containment, but the specific domino concept refers to neighboring states collapsing. Try again!',
      resolve: () => {
        logSuccess('✓ Decrypted! The intelligence notes confirm Vietcong guerrilla supply paths rely on the Ho Chi Minh Trail. You need to call in air support.');
      }
    };
  } else if (type === 'vietnam_radio') {
    currentQuestion = {
      text: 'EXAM QUESTION: In 1968, the Vietcong launched a massive surprise attack during the lunar new year, shattering the US claim that the war was almost won. What was this offensive called?',
      optionA: 'Gulf of Tonkin Offensive',
      optionB: 'Tet Offensive',
      correctAnswer: 'b',
      feedbackSuccess: 'Correct! The Tet Offensive in January 1968 created a massive "Credibility Gap" on the home front. +30 XP.',
      feedbackFail: 'Incorrect. The Gulf of Tonkin Incident happened in 1964. Tet happened in 1968. Try again!',
      resolve: () => {
        currentAct = 3;
        activeChar = 'ACTIVIST';
        activeScene = 'ACT3_FINALE';
        const swapBtn = document.getElementById('swap-btn');
        if (swapBtn) swapBtn.style.display = 'none'; // Lock swap in finale
        
        logSuccess('--- PROCEEDING TO ACT 3: THE FINALE (1973-1975) ---');
        logText('You are at the Paris Peace Accords table. The domestic anti-war movement and rising combat costs have forced US diplomatic withdrawal.');
        syncHUD();
      }
    };
  } else if (type === 'paris') {
    currentQuestion = {
      text: 'EXAM QUESTION: What exit policy did President Nixon adopt starting in 1969 to gradually withdraw US forces while training ARVN forces?',
      optionA: 'Vietnamization',
      optionB: 'Demilitarization',
      correctAnswer: 'a',
      feedbackSuccess: 'Correct! Vietnamization sought to transfer combat burdens to South Vietnamese troops. +25 XP.',
      feedbackFail: 'Incorrect. Demilitarization is an armistice status. The policy was Vietnamization. Try again!',
      resolve: () => {
        logSuccess('The Accords are signed in 1973. US ground combat troops leave Vietnam. Inspect the Television Set to see the final chapter.');
      }
    };
  } else if (type === 'saigon') {
    currentQuestion = {
      text: 'EXAM QUESTION: Why did South Vietnam collapse so quickly in April 1975 to North Vietnamese troops after years of US backing?',
      optionA: 'Congress cut off military and financial aid to Saigon',
      optionB: 'UN peacekeepers active in Saigon joined the communist forces',
      correctAnswer: 'a',
      feedbackSuccess: 'Correct! The US Congress voted to cut off funding and aid, leaving the ARVN under-equipped and unable to resist the final offensive. +40 XP.',
      feedbackFail: 'Incorrect. UN peacekeepers did not join the communists. The cutoff of US aid was the decisive cause. Try again!',
      resolve: () => {
        triggerGameWin();
      }
    };
  }

  logText(`\n<span style="color: #60a5fa; font-weight: bold;">${currentQuestion.text}</span>`);
  logText(`- A: ${currentQuestion.optionA}`);
  logText(`- B: ${currentQuestion.optionB}`);
  if (voiceEnabled) {
    AudioEngine.speak(currentQuestion.text + " Option A: " + currentQuestion.optionA + " Option B: " + currentQuestion.optionB);
  }
  updateActionBar();
}

function solveVietnamRadio() {
  logSuccess('✓ Command Radio tuned correctly to 70.2 MHz! Frequency secured.');
  triggerFactualQuestion('vietnam_radio');
}

function triggerGameWin() {
  AudioEngine.play('cheer');
  logSuccess('🏆 GAME COMPLETED: Echoes of Conflict: Home & Abroad!');
  logText('You have successfully navigated the timeline of Paper 3: Conflict at Home and Abroad (1954-1975).');
  logText(`You earned a total of ${gameXp} XP during this simulation! It has been added to your profile.`);
  
  // Add XP globally
  addXp(gameXp);
  
  currentQuestion = null;
  currentAct = 3;
  activeScene = 'ACT3_FINALE';

  // Display completion stats
  const logStream = document.getElementById('log-stream');
  if (logStream) {
    logStream.innerHTML += `<div style="padding: 10px; background: rgba(16, 185, 129, 0.1); border: 2px solid #10b981; border-radius: 4px; margin-top: 10px; text-align: center;">
      <h3 style="color: #10b981; margin: 0 0 5px 0;">🎉 Revision Master Certificate!</h3>
      <p style="margin: 0; font-size: 0.85rem;">You secured all case studies on Brown v. Board, March on Washington, Vietnamization, and the Fall of Saigon!</p>
    </div>`;
    logStream.scrollTop = logStream.scrollHeight;
  }
}

// =========================================================================
// TERMINAL INPUT COMMAND INTERPRETER (Forgiving Parser)
// =========================================================================
function handleParseSubmit(event) {
  if (event.key !== 'Enter') return;
  
  const inputEl = document.getElementById('parse-input');
  if (!inputEl) return;
  
  const cmdRaw = inputEl.value.trim();
  inputEl.value = ''; // clear input
  if (!cmdRaw) return;

  logText(`&gt; ${cmdRaw}`);
  
  const cmd = cmdRaw.toLowerCase();

  // Active question interceptor
  if (currentQuestion) {
    if (cmd === 'a' || cmd === 'b' || cmd.includes('option a') || cmd.includes('option b') || cmd.startsWith('a') || cmd.startsWith('b')) {
      const parsedChoice = (cmd === 'a' || cmd.startsWith('a') || cmd.includes('option a')) ? 'a' : 'b';
      submitQuizAnswer(parsedChoice);
    } else {
      logError(`⚠️ Please answer the exam question. Click the option buttons above or type "A" or "B".`);
    }
    return;
  }

  // Verb-Noun parser
  const tokens = cmd.split(' ');
  const verb = tokens[0];
  const target = tokens.slice(1).join(' ');

  // List of recognized command verbs
  const recognizedVerbs = ['look', 'take', 'get', 'use', 'combine', 'swap', 'hint', 'help', 'inventory', 'inv'];

  if (verb === 'help') {
    logText('Available Commands:\n- look [hotspot]\n- take [item]\n- swap (swap characters in Act 2)\n- hint (get walkthrough tips)\n- inventory\n- help');
  } else if (verb === 'hint') {
    showActHint();
  } else if (verb === 'inventory' || verb === 'inv') {
    logText(`Inventory: ${inventory.length > 0 ? inventory.join(', ') : 'EMPTY'}`);
  } else if (verb === 'swap' || (verb === 'swap' && target === 'hero')) {
    triggerCharacterSwap();
  } else if (verb === 'look') {
    if (!target) {
      logText('What do you want to look at? Try "look monument", "look radio", etc.');
      return;
    }
    const h = findHotspot(target);
    if (h) {
      logText(`👁️ ${h.name}: "${h.look}"`);
      if (voiceEnabled) AudioEngine.speak(h.look);
      
      if (h.id === 'clipboard') {
        triggerFactualQuestion('domino');
      } else if (h.id === 'television') {
        triggerFactualQuestion('saigon');
      } else if (h.id === 'kissinger') {
        triggerFactualQuestion('paris');
      }
    } else {
      logText(`You look around, but you don't see any "${target}".`);
    }
  } else if (verb === 'take' || verb === 'get') {
    if (!target) {
      logText('What do you want to take?');
      return;
    }
    const h = findHotspot(target);
    if (h) {
      if (h.item && !inventory.includes(h.item)) {
        inventory.push(h.item);
        logSuccess(`Picked up [${h.item}]!`);
        syncHUD();
      } else if (h.item && inventory.includes(h.item)) {
        logText(`You already have [${h.item}] in your inventory.`);
      } else {
        logText(`You cannot pick up the "${h.name}".`);
      }
    } else {
      logText(`There is no "${target}" to take here.`);
    }
  } else if (verb === 'combine' || verb === 'use') {
    if (!target) {
      logText('What do you want to use? Try "use Megaphone on Podium".');
      return;
    }

    const parts = target.split(' with ');
    const parts2 = target.split(' on ');
    const parts3 = target.split(' at ');

    let item1 = parts[0];
    let item2 = parts[1];

    if (!item2 && parts2[1]) {
      item1 = parts2[0];
      item2 = parts2[1];
    }
    if (!item2 && parts3[1]) {
      item1 = parts3[0];
      item2 = parts3[1];
    }

    if (!item2) {
      // Auto-target logical interactives if they type "use megaphone" or "use notes"
      item1 = target;
      if (currentAct === 1) {
        item2 = 'podium';
      } else if (currentAct === 2) {
        item2 = activeChar === 'SOLDIER' ? 'radio' : 'flyer_stand';
      }
    }

    const matchingItem = inventory.find(i => i.toLowerCase().includes(item1.trim().toLowerCase()));
    if (!matchingItem) {
      logText(`You don't have "[${item1}]" in your inventory.`);
      return;
    }

    const h = findHotspot(item2.trim());
    if (h) {
      executeSmartAction(h);
    } else {
      logText(`Target "${item2}" not found. Try clicking on the scene hotspots directly to use items automatically.`);
    }
  } else {
    // If not a recognized verb, check if command contains a direct keyword for smart action
    const keywords = ['megaphone', 'notes', 'speech', 'flyer', 'radio', 'podium', 'statue', 'lincoln', 'bench', 'map', 'clipboard', 'negotiation', 'paris', 'television', 'tv', 'draft'];
    const matchedKeyword = keywords.find(k => cmd.includes(k));

    if (matchedKeyword) {
      const targetHotspot = findHotspot(matchedKeyword);
      if (targetHotspot) {
        executeSmartAction(targetHotspot);
      } else {
        logText(`You see nothing related to "${cmdRaw}" in this scene.`);
      }
    } else {
      logText(`Unknown command string "${cmdRaw}". Try typing "help", "hint", or click the scene directly.`);
    }
  }
}

// =========================================================================
// HUD & ENGINE UTILITIES
// =========================================================================
function findHotspot(nameQuery) {
  const sceneHotspots = hotspots[activeScene];
  if (!sceneHotspots) return null;
  
  // Clean query
  const query = nameQuery.toLowerCase();
  
  // Match specific synonyms
  if (query.includes('statue') || query.includes('lincoln') || query.includes('monument')) {
    return sceneHotspots.find(h => h.id === 'monument');
  }
  if (query.includes('podium') || query.includes('speech') || query.includes('notes')) {
    return sceneHotspots.find(h => h.id === 'podium');
  }
  if (query.includes('bench') || query.includes('megaphone')) {
    return sceneHotspots.find(h => h.id === 'bench' || h.id === 'campus_bench');
  }
  if (query.includes('banner')) {
    return sceneHotspots.find(h => h.id === 'banner');
  }
  if (query.includes('radio') || query.includes('console')) {
    return sceneHotspots.find(h => h.id === 'radio');
  }
  if (query.includes('map') || query.includes('delta')) {
    return sceneHotspots.find(h => h.id === 'maps');
  }
  if (query.includes('clipboard') || query.includes('cipher')) {
    return sceneHotspots.find(h => h.id === 'clipboard');
  }
  if (query.includes('flyer') || query.includes('stand')) {
    return sceneHotspots.find(h => h.id === 'flyer_stand');
  }
  if (query.includes('board') || query.includes('bulletin')) {
    return sceneHotspots.find(h => h.id === 'board');
  }
  if (query.includes('table') || query.includes('negotiation') || query.includes('kissinger') || query.includes('treaty')) {
    return sceneHotspots.find(h => h.id === 'kissinger');
  }
  if (query.includes('television') || query.includes('tv') || query.includes('broadcast') || query.includes('saigon')) {
    return sceneHotspots.find(h => h.id === 'television');
  }
  if (query.includes('draft') || query.includes('document') || query.includes('card')) {
    return sceneHotspots.find(h => h.id === 'draft_card');
  }

  // Generic fallback
  return sceneHotspots.find(h => 
    h.name.toLowerCase().includes(query) || 
    h.id.toLowerCase().includes(query)
  );
}

function syncHUD() {
  const actTitle = document.getElementById('hud-act-title');
  const charDisplay = document.getElementById('hud-char-display');
  const invDisplay = document.getElementById('hud-inv-display');
  const xpDisplay = document.getElementById('hud-xp-display');
  const objectiveText = document.getElementById('hud-objective-text');

  if (actTitle) actTitle.textContent = `ACT ${currentAct}: ${currentAct === 1 ? 'MONUMENTS' : (currentAct === 2 ? 'DUAL CAMPAIGNS' : 'FINALE')}`;
  if (charDisplay) charDisplay.textContent = activeChar;
  if (invDisplay) invDisplay.textContent = inventory.length > 0 ? inventory.join(', ') : 'EMPTY';
  if (xpDisplay) xpDisplay.textContent = gameXp;
  
  if (objectiveText) {
    objectiveText.textContent = getObjectiveText();
  }

  const swapBtn = document.getElementById('swap-btn');
  if (swapBtn) {
    swapBtn.style.display = (currentAct === 2) ? 'block' : 'none';
  }
}

function toggleMute() {
  voiceEnabled = !voiceEnabled;
  const btn = document.getElementById('audio-toggle');
  if (btn) {
    btn.textContent = voiceEnabled ? '🔊 VOICE: ON' : '🔇 VOICE: OFF';
    btn.className = voiceEnabled ? 'audio-btn' : 'audio-btn muted';
  }
  AudioEngine.play('click');
}

function logText(text) {
  const logStream = document.getElementById('log-stream');
  if (!logStream) return;
  const p = document.createElement('p');
  p.innerHTML = text.replace(/\n/g, '<br/>');
  logStream.appendChild(p);
  logStream.scrollTop = logStream.scrollHeight;
}

function logSuccess(text) {
  logText(`<span class="success-text">${text}</span>`);
}

function logError(text) {
  logText(`<span class="error-text">${text}</span>`);
}
