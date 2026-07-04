import { state } from './state.js';
import { AudioEngine } from './audio.js';
import { switchView, switchSubtopicMode } from './navigation.js';
import { generateSyncCode, loadSyncCode } from './sync.js';
import { 
  flipFlashcard, 
  handleFlashcardGrade, 
  renderTimelineView, 
  renderClassicView, 
  evaluateStudentAnswer, 
  renderSidebarNav, 
  updateGlobalStats,
  setActiveClassicFilter,
  closeVideoModal
} from './views.js';
import { startExam, nextExamQuestion, displayExamQuestion, finishExam, showExamSetup, speakRemedial, resumeExamFromRemedial } from './exam.js';
import { saveProgress } from './storage.js';
import { startPastPaper, generateMockExam, renderPastPapersView, initBulkWorkbookCreator } from './past_papers.js';
import { initWorkbookCreator } from './lessons.js';
import { EXAM_SKILLS_DATA } from '../questions.js';

export const SOURCE_CLUES = {
  "2018_summer_usa": {
    "A": {
      "C": "Focus on the difficulty of registering to vote described here (e.g. the unfair 'literacy tests' compared to white voters).",
      "NOP": "This is from a Northern newspaper in 1954. Northern reports were often critical of Southern segregation, but it is an external report rather than an internal state document.",
      "OK": "Recall that in Mississippi, only 5% of eligible Black adults were registered due to literacy tests, poll taxes, and intimidation."
    },
    "B": {
      "C": "Focus on the legal litigation strategy targeting the Supreme Court and dismantling the legal basis of segregation.",
      "NOP": "An internal, private report by lead NAACP lawyer Thurgood Marshall in 1953. Highly reliable and realistic, as it wasn't meant for public propaganda.",
      "OK": "Connect this to NAACP's landmark court wins like Sweatt v. Painter (1950) and the upcoming Brown v. Board of Education decision (1954)."
    },
    "C": {
      "C": "Highlight the peaceful sit-in at the lunch counter being met with severe white mob violence and police indifference.",
      "NOP": "A first-hand account by a CORE activist published in a 1952 newsletter. Extremely useful for immediate dangers, though designed to motivate members.",
      "OK": "CORE pioneered non-violent direct action (like sit-ins and boycotts) starting in Chicago in 1942, demonstrating the limits of federal law on the ground."
    }
  },
  "2019_summer_usa": {
    "A": {
      "C": "Identify what the source says about the white backlash and resistance (e.g., KKK and White Citizens' Councils).",
      "NOP": "Look at who wrote it and when - a report by a civil rights worker during the peak of Southern resistance.",
      "OK": "Remember the formation of White Citizens' Councils after the 1954 Brown decision to coordinate economic and social opposition."
    },
    "B": {
      "C": "Analyze the description of the Montgomery Bus Boycott's community organization and resolution.",
      "NOP": "An account by a boycott participant. Excellent for first-hand emotion and community spirit, though it represents a committed activist perspective.",
      "OK": "Recall that the Montgomery Bus Boycott lasted 381 days and was triggered by Rosa Parks' arrest on December 1, 1955."
    },
    "C": {
      "C": "Examine the reaction of federal authorities and the deployment of federal force or legislative action.",
      "NOP": "A speech by a federal politician. Useful for official federal positions and legislative intents, but may downplay grassroots pressure.",
      "OK": "Connect this to Eisenhower sending the 101st Airborne to Little Rock in 1957 to enforce desegregation."
    }
  },
  "2020_summer_usa": {
    "A": {
      "C": "Look at the description of the Freedom Rides and the violent response they encountered in transit terminals.",
      "NOP": "A telegram from a Freedom Rider to the Department of Justice. Urgent first-hand evidence requesting federal protection.",
      "OK": "The Freedom Rides (1961) tested the Supreme Court ruling banning segregation on interstate buses, forcing the ICC to issue a strict ban."
    },
    "B": {
      "C": "Analyze the text on the goals of the March on Washington, specifically economic and civil demands.",
      "NOP": "An official brochure for the March on Washington (1963). Designed to show a unified, peaceful front to the nation.",
      "OK": "The march attracted over 250,000 people and featured Martin Luther King Jr.'s iconic 'I Have a Dream' speech at the Lincoln Memorial."
    },
    "C": {
      "C": "Examine the details about the Voting Rights Act of 1965 and its immediate impact on voter registration.",
      "NOP": "Official Department of Justice registration statistics from 1966. Highly reliable numerical data showing dramatic registration spikes.",
      "OK": "The Voting Rights Act of 1965 banned literacy tests and sent federal registrars to the South, ending legal disenfranchisement."
    }
  },
  "2022_summer_usa": {
    "A": {
      "C": "Focus on the description of the Black Power movement and its calls for self-defense and economic control.",
      "NOP": "An article in a Black Power newspaper in 1967. Designed to rally urban youth, reflecting high frustration with slow economic progress.",
      "OK": "Stokely Carmichael coined the phrase 'Black Power' in 1966, reflecting a shift away from non-violence toward self-reliance."
    },
    "B": {
      "C": "Analyze the reasons for the urban riots of the mid-1960s (e.g., housing, employment, and police brutality).",
      "NOP": "From the official Kerner Commission Report of 1968. An authoritative government study concluding that white racism was the primary cause.",
      "OK": "The Kerner Commission warned that the nation was dividing into 'two societies, one black, one white—separate and unequal'."
    },
    "C": {
      "C": "Examine the description of the Black Panther Party's social programs in local communities.",
      "NOP": "A memoir by a former Black Panther member. Offers unique inside details of community work (e.g. free breakfast), though naturally sympathetic.",
      "OK": "Founded in Oakland in 1966 by Huey Newton and Bobby Seale, the Panthers combined armed patrols with community welfare programs."
    }
  },
  "2023_summer_usa": {
    "A": {
      "C": "Look at the reasons for US support of Ngo Dinh Diem's regime despite his unpopular authoritarian policies.",
      "NOP": "A secret CIA report from 1961. Highly reliable and frank assessment of Diem's political weakness, free from public relations spin.",
      "OK": "The US supported Diem to contain communism (Domino Theory), but his persecution of Buddhists led to his overthrow in 1963."
    },
    "B": {
      "C": "Analyze the description of Vietcong guerrilla warfare tactics and their impact on US troop morale.",
      "NOP": "An interview with a US soldier. Captures the intense daily fear and difficulty of fighting an unseen enemy using traps and tunnels.",
      "OK": "Guerrillas used the Ho Chi Minh Trail and extensive tunnel networks (like Cu Chi) to survive search-and-destroy missions."
    },
    "C": {
      "C": "Examine the visual or textual details showing the devastation of chemical defoliants like Agent Orange.",
      "NOP": "A report by a international team of doctors in 1968. Highly reliable medical observations, though focused on documenting war damage.",
      "OK": "Operation Ranch Hand sprayed over 20 million gallons of herbicides to strip jungle cover and destroy Vietcong food crops."
    }
  },
  "2024_summer_usa": {
    "A": {
      "C": "Focus on the details describing the public reaction to the Gulf of Tonkin incident in 1964.",
      "NOP": "A public opinion poll from late 1964. Reflects broad initial public support for military action before the draft expanded.",
      "OK": "The Gulf of Tonkin Resolution passed almost unanimously, giving President Johnson a 'blank check' to escalate the war."
    },
    "B": {
      "C": "Analyze the description of the 1968 Tet Offensive as a psychological turning point of the war.",
      "NOP": "A CBS news broadcast by Walter Cronkite in February 1968. Highly influential in shaping middle-class opinion toward seeking a stalemate.",
      "OK": "The Tet Offensive proved that despite 500,000 US troops, the VC could launch massive, coordinated attacks nationwide."
    },
    "C": {
      "C": "Examine the description of anti-war protests on university campuses and the response of authorities.",
      "NOP": "A student newspaper article from Kent State in May 1970. Captures the immediate anger and shock of the student shootings.",
      "OK": "The Kent State shootings (1970) saw the National Guard kill four students, triggering a strike of over 4 million students."
    }
  },
  "2025_summer_usa": {
    "A": {
      "C": "Look at the description of Nixon's 'Vietnamization' policy and the withdrawal of US ground combat forces.",
      "NOP": "A televised address by President Nixon. Designed to reassure the public ('peace with honor') and justify military policy shifts.",
      "OK": "Vietnamization aimed to train ARVN forces to fight alone, allowing US withdrawal, but ARVN remained heavily dependent on US aid."
    },
    "B": {
      "C": "Analyze the description of the final North Vietnamese offensive in early 1975 and the collapse of the ARVN.",
      "NOP": "A dispatch from a foreign war correspondent in Saigon, April 1975. Captures the chaos of the final hours before the fall.",
      "OK": "In 1974, Congress slashed aid to South Vietnam, severely damaging ARVN supplies and morale before the final offensive."
    },
    "C": {
      "C": "Examine the details of the Paris Peace Accords and the terms of the US military exit in 1973.",
      "NOP": "A joint press statement by the US and North Vietnamese negotiators. Projects diplomatic success, though it left North Vietnamese troops in the South.",
      "OK": "The Paris Peace Accords (1973) led to complete US troop withdrawal and POW release, but only created a temporary ceasefire."
    }
  }
};

const defaultClues = {
  "A": {
    "C": "Content: Look closely at the specific quotes or details mentioned. What do they directly tell us about the event?",
    "NOP": "Nature, Origin, Purpose: Consider who wrote this, their viewpoint, and why they wrote it. Is it a public speech, a private diary, or an official report?",
    "OK": "Own Knowledge: Bring in outside facts from this specific subtopic or year to verify or challenge the claims in the source."
  },
  "B": {
    "C": "Content: Identify the main argument or key quote. What does the author say is the most important factor?",
    "NOP": "Nature, Origin, Purpose: Look at the author and date. How does their role in the civil rights movement or war effort affect their perspective?",
    "OK": "Own Knowledge: Connect this source to specific historical figures, campaigns, or legal acts that you studied in the lessons."
  },
  "C": {
    "C": "Content: Analyze the visual details or text. What is the emotional tone or physical setting described?",
    "NOP": "Nature, Origin, Purpose: Think about the audience and purpose. Was it meant to motivate supporters, report neutral facts, or criticize opponents?",
    "OK": "Own Knowledge: Use your knowledge of the opposition, federal reactions, or local resistance to explain why this situation occurred."
  }
};

export const DO_NOW_CLUES = {
  "subtopic_1_1": {
    "C": "Focus on the sign reading 'COLORED WAITING ROOM' hanging prominently above the doorway.",
    "NOP": "This is an official public segregation sign from a Southern transit terminal in the early 1950s. Highly reliable for showing segregation infrastructure, though it doesn't convey the lived experiences of those who had to obey it.",
    "OK": "Recall that Jim Crow laws enforced strict separation in transit, and this system was legally challenged by the NAACP in court battles and CORE in early freedom rides."
  },
  "subtopic_1_2": {
    "C": "Observe the formal black judicial robes worn by the nine Supreme Court justices in their unified, official group photograph.",
    "NOP": "An official Supreme Court group portrait from 1954. Made to record the historic bench under Earl Warren, though it projects a unified front and hides private conflicts.",
    "OK": "Chief Justice Earl Warren fought hard to ensure a unanimous 9-0 decision in Brown v. Board of Education to send a clear message that segregation was unconstitutional."
  },
  "subtopic_1_3": {
    "C": "Focus on the lone Black student (Elizabeth Eckford) walking calmly while surrounded by a hostile, screaming white crowd.",
    "NOP": "A press photograph from September 1957. Captures the extreme public resistance on the ground, though framed by a Northern media sympathetic to the integration campaign.",
    "OK": "The state governor Orval Faubus deployed the National Guard to block the Little Rock Nine, forcing President Eisenhower to send the 101st Airborne Division to escort them."
  },
  "subtopic_1_4": {
    "C": "Observe Rosa Parks sitting peacefully in the front seats of a city bus, with a white passenger sitting directly behind her.",
    "NOP": "A publicity photograph taken in December 1956. Highly useful for celebrating the legal integration of buses, though staged by the press to mark the end of the boycott.",
    "OK": "The Montgomery Bus Boycott lasted 381 days and was resolved after the Supreme Court's Browder v. Gayle ruling declared transit segregation unconstitutional."
  },
  "subtopic_2_1": {
    "C": "Focus on Senator Strom Thurmond signing the document at his desk, surrounded by several other Southern politicians.",
    "NOP": "A publicity/press photograph from 1956. Designed to showcase official political solidarity and 'massive resistance' to federal school desegregation.",
    "OK": "The Southern Manifesto was signed by 101 Southern politicians who pledged to use all lawful means to reverse the Brown v. Board of Education decision."
  },
  "subtopic_2_2": {
    "C": "Observe the high-pressure water hoses aimed directly at peaceful protesters, pinning them against a wall.",
    "NOP": "A news photograph from May 1963 during Project C. Highly useful for showing the brutal tactics used by Birmingham authorities to crush peaceful demonstrations.",
    "OK": "Police Chief Bull Connor used police dogs and fire hoses against child marchers, which was televised globally and forced President Kennedy to draft the Civil Rights Bill."
  },
  "subtopic_2_3": {
    "C": "Focus on the row of state troopers in helmets and gas masks confronting the ranks of peaceful voting rights marchers.",
    "NOP": "A news media photograph from Bloody Sunday (7 March 1965). Captures the state-level violence used to suppress voting rights, shifting national public opinion.",
    "OK": "The marchers were attempting to walk from Selma to Montgomery. The televised violence on the Edmund Pettus Bridge forced President Johnson to introduce the Voting Rights Act of 1965."
  },
  "subtopic_2_4": {
    "C": "Observe Malcolm X speaking passionately at a microphone, surrounded by banners and listening crowds.",
    "NOP": "A photograph of a public rally in the early 1960s. Captures the charismatic appeal of Malcolm X and the Nation of Islam, though it represents a militant platform.",
    "OK": "Malcolm X critiqued the non-violent mainstream movement, advocating black nationalism and self-defense ('by any means necessary') to address urban inequality."
  },
  "subtopic_3_1": {
    "C": "Observe the formal delegates from major world powers seated around the large conference table in Geneva.",
    "NOP": "An official press photograph of the 1954 Geneva Conference. Reliable record of the formal proceedings, but hides the intense Cold War rivalries underneath.",
    "OK": "The Geneva Accords divided Vietnam at the 17th Parallel and called for national elections in 1956, which Diem and the US refused to hold, fearing a communist victory."
  },
  "subtopic_3_2": {
    "C": "Focus on the US soldiers stepping out of a military helicopter into a jungle landing zone in South Vietnam.",
    "NOP": "An official US Army photo from 1965. Shows the technological superiority and airmobility of US forces, though it presents a clean, controlled view of combat operations.",
    "OK": "While helicopters provided mobility, US forces struggled with search-and-destroy tactics in the dense jungle against the Vietcong's guerrilla warfare and tunnels."
  },
  "subtopic_3_3": {
    "C": "Observe the military planes flying low in formation, releasing thick white chemical defoliant sprays over the canopy.",
    "NOP": "A US Air Force photograph from Operation Ranch Hand. Documents the military's deforestation strategy, though it masks the severe ecological and human health damage.",
    "OK": "Agent Orange was sprayed to strip forest cover and destroy crops, but it failed to stop the Vietcong and alienated the South Vietnamese peasant population."
  },
  "subtopic_3_4": {
    "C": "Observe news anchor Walter Cronkite wearing a military helmet and flak jacket while reporting from Hue during the Tet Offensive.",
    "NOP": "A television broadcast still from February 1968. Highly influential in shaping middle-class opinion because Cronkite was trusted as the 'most trusted man in America'.",
    "OK": "Cronkite declared that the US was mired in a stalemate. Following this broadcast, President Johnson famously said he had lost the support of Middle America."
  },
  "subtopic_4_1": {
    "C": "Observe President Nixon standing and smiling among US troops in the field in South Vietnam.",
    "NOP": "A White House press photograph from 1969. Designed to show high troop morale and public relations success for Nixon's policy of withdrawing US troops.",
    "OK": "Nixon's Vietnamization policy aimed to train the ARVN to take over combat duties so US troops could withdraw, but it failed to secure South Vietnam's stability."
  },
  "subtopic_4_2": {
    "C": "Focus on the student protesters confronting lines of armed National Guardsmen on the university campus.",
    "NOP": "A news photograph from the Kent State protests in May 1970. Useful for documenting the intense domestic division and clash between students and state authority.",
    "OK": "The protest was triggered by Nixon's invasion of Cambodia. The National Guard opened fire, killing four students and sparking nationwide student strikes."
  },
  "subtopic_4_3": {
    "C": "Observe Henry Kissinger and Le Duc Tho signing the treaty documents at the conference table in Paris.",
    "NOP": "An official press photograph of the 1973 signing. Projects a successful diplomatic resolution ('peace with honor'), though it left North Vietnamese troops inside the South.",
    "OK": "The Paris Peace Accords led to the withdrawal of all US combat troops, but the ceasefire was temporary and civil war resumed almost immediately."
  },
  "subtopic_4_4": {
    "C": "Focus on the long queue of evacuees climbing the ladder to a helicopter on the roof of a Saigon building during the final evacuation.",
    "NOP": "A news photograph from April 1975 during the fall of Saigon. Captures the chaos and desperation of the final US evacuation, representing the failure of US policy.",
    "OK": "When the North Vietnamese army launched its final offensive in 1975, South Vietnam's ARVN collapsed rapidly, leading to the capture of Saigon and reunification."
  }
};

// --- Sidebar Overlay Drawer (Mobile & Desktop UI Toggle) ---
function toggleMobileSidebar() {
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
  } else {
    document.querySelector('.app-container').classList.toggle('collapsed-sidebar');
  }
}

function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('active');
  document.getElementById('sidebar-overlay').classList.remove('active');
}

function updateSoundBtnUI() {
  const btn = document.getElementById('sound-toggle-btn');
  if (btn) {
    if (state.soundEnabled) {
      btn.innerHTML = `<i class="fa-solid fa-volume-high"></i>`;
      btn.title = 'Sound Effects: On (Click to Mute)';
    } else {
      btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i>`;
      btn.title = 'Sound Effects: Off (Click to Enable)';
    }
  }

  const sidebarBtn = document.getElementById('sidebar-sound-toggle-btn');
  if (sidebarBtn) {
    if (state.soundEnabled) {
      sidebarBtn.innerHTML = `<i class="fa-solid fa-volume-high"></i> <span>Sound Effects: On</span>`;
      sidebarBtn.title = 'Sound Effects: On (Click to Mute)';
    } else {
      sidebarBtn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> <span>Sound Effects: Off</span>`;
      sidebarBtn.title = 'Sound Effects: Off (Click to Enable)';
    }
  }
}

// --- Populate Exam Practice Dropdowns Dynamically ---
function initializePracticeDropdowns() {
  const q1Select = document.getElementById('q1-topic-select');
  const q2Select = document.getElementById('q2-topic-select');
  const q3Select = document.getElementById('q3-topic-select');

  const getQ1FriendlyTitle = (key, data) => {
    if (key === 'q1_1') return '1.1: Voting Rights in the South (1954 Investigative Report)';
    if (key === 'p_2018_q1') return '2.3: Aims of the Black Panther Party (1966 Platform)';
    if (key === 'p_2019_q1') return '1.2: Opposition to Little Rock Desegregation (1957 Telegram)';
    if (key === 'p_2020_q1') return '2.2: March on Washington (1963 Photograph)';
    if (key === 'p_2021_q1') return '2.2: March on Washington (1963 Police Report)';
    if (key === 'p_2023_q1') return '3.1: Strategic Hamlet Program in Vietnam (1962 Report)';
    if (key === 'p_2024_q1') return '1.1: Treatment of Black Americans in the 1950s (Activist Memoir)';
    if (key === 'mock_exam_1') return 'Best Guess Mock 1: Radicalism (Black Panther Patrols, 1967)';
    if (key === 'mock_exam_2') return 'Best Guess Mock 2: Vietnam Home Front (Hard Hats Wall Street, 1970)';
    if (key === 'mock_exam_3') return 'Best Guess Mock 3: Early Civil Rights (Bus Segregation, 1955)';
    return `${data.topicCode || ''}: ${data.question}`;
  };

  const getQ2FriendlyTitle = (key, data) => {
    if (key === 'q2_1') return '1.1: Segregation & Discrimination in the South (early 1950s)';
    if (key === 'p_2018_q2') return '3.2: US Escalation in Vietnam (1964–68)';
    if (key === 'p_2019_q2_concern') return '3.1: US Concern about Vietnam (1963)';
    if (key === 'p_2019_q2') return '3.4: Shifts in US Involvement in Vietnam under Nixon';
    if (key === 'p_2020_q2') return '1.4: Opposition to the Civil Rights Movement (1954–60)';
    if (key === 'mock_exam_1') return 'Best Guess Mock 1: Emergence of Black Power (1960s)';
    if (key === 'mock_exam_2') return 'Best Guess Mock 2: Growth of Vietnam Opposition (1968–73)';
    if (key === 'mock_exam_3') return 'Best Guess Mock 3: Significance of Brown v. Board (1954)';
    return `${data.topicCode || ''}: ${data.question}`;
  };

  const getQ3FriendlyTitle = (key, data) => {
    if (key === 'q3_1') return '1.1: Work of Civil Rights Organisations in the early 1950s';
    if (key === 'q3_2') return '2.4: Extent of Progress in Civil Rights by 1975';
    if (key === 'p_2019_q3') return '2.2: Achievements of the Civil Rights Movement (1964–65)';
    if (key === 'p_2020_q3') return '3.3: Reasons for the Failure of the USA in Vietnam';
    if (key === 'mock_exam_1') return "Best Guess Mock 1: King's campaign in the North (Chicago, 1966)";
    if (key === 'mock_exam_2') return 'Best Guess Mock 2: Significance of Kent State (1970)';
    if (key === 'mock_exam_3') return 'Best Guess Mock 3: Significance of Montgomery Bus Boycott (1955-56)';
    if (key === 'mock_exam_4') return 'Best Guess Mock 4: Little Rock High School Crisis (1957)';
    if (key === 'mock_exam_5') return 'Best Guess Mock 5: Impact of US Tactics in Vietnam';
    if (key === 'mock_exam_6') return 'Best Guess Mock 6: Vietnamization and Nixon’s Peace Policy';
    if (key === 'mock_exam_7') return 'Best Guess Mock 7: Reasons for the US Defeat in Vietnam';
    return `${data.topicCode || ''}: ${data.enquiryTopic || data.questiona}`;
  };

  const populateSelectWithOptions = (selectEl, dataObj, friendlyTitleFn, sectionName) => {
    if (!selectEl) return;
    selectEl.innerHTML = `<option value="" disabled selected>-- Select a ${sectionName} Topic --</option>`;
    
    const presetsGroup = document.createElement('optgroup');
    presetsGroup.label = 'Practice Papers / Presets';
    presetsGroup.style.background = 'var(--bg-card)';
    presetsGroup.style.color = 'var(--text-main)';

    const mocksGroup = document.createElement('optgroup');
    mocksGroup.label = 'Best Guess Mock Exams';
    mocksGroup.style.background = 'var(--bg-card)';
    mocksGroup.style.color = 'var(--text-main)';

    Object.entries(dataObj).forEach(([key, data]) => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = friendlyTitleFn(key, data);
      
      if (key.startsWith('mock_')) {
        mocksGroup.appendChild(opt);
      } else {
        presetsGroup.appendChild(opt);
      }
    });

    selectEl.appendChild(presetsGroup);
    selectEl.appendChild(mocksGroup);
  };

  populateSelectWithOptions(q1Select, EXAM_SKILLS_DATA.q1, getQ1FriendlyTitle, 'Inference');
  populateSelectWithOptions(q2Select, EXAM_SKILLS_DATA.q2, getQ2FriendlyTitle, 'Causation');
  populateSelectWithOptions(q3Select, EXAM_SKILLS_DATA.q3, getQ3FriendlyTitle, 'Enquiry');
}

let eventsBound = false;

// --- Bind Event Listeners ---
function bindEvents() {
  if (eventsBound) return;
  eventsBound = true;
  initializePracticeDropdowns();

  // Navigation Sidebar
  document.getElementById('nav-dashboard').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('dashboard');
    const container = document.querySelector('.app-container');
    if (container && container.classList.contains('collapsed-sidebar')) {
      container.classList.remove('collapsed-sidebar');
    }
  });
  
  
  
  document.getElementById('nav-timeline').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('timeline');
  });
  
  document.getElementById('nav-map').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('map');
  });
  
  document.getElementById('nav-exam-sim').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('exam');
  });
  
  document.getElementById('nav-games').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('games');
  });

  document.getElementById('nav-ai-videos').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('ai-videos');
  });

  const navLeaderboard = document.getElementById('nav-leaderboard');
  if (navLeaderboard) {
    navLeaderboard.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('leaderboard');
    });
  }

  const navGuideHeader = document.getElementById('nav-guide-header');
  if (navGuideHeader) {
    navGuideHeader.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('guide');
    });
  }

  // Dashboard Shortcuts
  document.getElementById('shortcut-timeline').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('timeline');
  });
  
  const shortcutMap = document.getElementById('shortcut-map');
  if (shortcutMap) {
    shortcutMap.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('map');
    });
  }

  document.getElementById('shortcut-exam-sim').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('exam');
  });

  const shortcutWorksheets = document.getElementById('shortcut-worksheets');
  if (shortcutWorksheets) {
    shortcutWorksheets.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('worksheets');
    });
  }

  document.getElementById('shortcut-exam-hub').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('exam-hub', 'technique');
  });

  

  document.getElementById('shortcut-games').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('games');
  });

  document.getElementById('shortcut-ai-videos').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('ai-videos');
  });


  const heroGuideBtn = document.getElementById('hero-guide-btn');
  if (heroGuideBtn) {
    heroGuideBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('guide');
    });
  }

  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', toggleMobileSidebar);
  }
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }

  // Header Back Button
  const backBtn = document.getElementById('header-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('dashboard');
    });
  }

  const leaderboardBackBtn = document.getElementById('btn-leaderboard-back');
  if (leaderboardBackBtn) {
    leaderboardBackBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('dashboard');
    });
  }

  const guideBackBtn = document.getElementById('btn-guide-back');
  if (guideBackBtn) {
    guideBackBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('dashboard');
    });
  }

  // Fullscreen Toggle
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      AudioEngine.play('click');
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    });
  }

  // Handle Fullscreen state change icon toggle
  document.addEventListener('fullscreenchange', () => {
    const btn = document.getElementById('fullscreen-btn');
    const container = document.querySelector('.app-container');
    if (document.fullscreenElement) {
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-compress"></i>`;
        btn.setAttribute('title', 'Exit Fullscreen');
      }
      if (container) {
        container.classList.add('fullscreen-active');
      }
    } else {
      if (btn) {
        btn.innerHTML = `<i class="fa-solid fa-expand"></i>`;
        btn.setAttribute('title', 'Toggle Fullscreen');
      }
      if (container) {
        container.classList.remove('fullscreen-active');
      }
    }
  });

  // Subtopic View mode tabs (Accordions vs Flashcards)
  document.querySelectorAll('#subtopic-mode-switcher .mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      switchSubtopicMode(btn.getAttribute('data-mode'));
    });
  });

  // Classic Accordion View Filters
  document.querySelectorAll('.filter-btn-group .filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      document.querySelectorAll('.filter-btn-group .filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      setActiveClassicFilter(btn.getAttribute('data-filter'));
      renderClassicView();
    });
  });

  // Flashcards study actions are managed dynamically in views.js when rendering subtopic views.

  // Timeline Filter Action
  document.getElementById('timeline-era-select').addEventListener('change', () => {
    AudioEngine.play('click');
    renderTimelineView();
  });

  const timelineSearchInput = document.getElementById('timeline-search-input');
  if (timelineSearchInput) {
    timelineSearchInput.addEventListener('input', () => {
      renderTimelineView();
    });
  }

  const peopleToggle = document.getElementById('timeline-people-toggle');
  if (peopleToggle) {
    peopleToggle.addEventListener('click', () => {
      AudioEngine.play('click');
      peopleToggle.classList.toggle('active');
      renderTimelineView();
    });
  }
  
  const causalToggle = document.getElementById('timeline-causal-toggle');
  if (causalToggle) {
    causalToggle.addEventListener('click', () => {
      AudioEngine.play('click');
      causalToggle.classList.toggle('active');
      renderTimelineView();
    });
  }

  // Timeline Scroll to Top FAB Handler
  const timelineView = document.getElementById('view-timeline');
  const backToTopBtn = document.getElementById('btn-timeline-back-to-top');
  if (timelineView && backToTopBtn) {
    timelineView.addEventListener('scroll', () => {
      if (timelineView.scrollTop > 300) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      AudioEngine.play('click');
      timelineView.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const bindStarter = (btnId, textareaId, template) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      btn.addEventListener('click', () => {
        AudioEngine.play('click');
        const textarea = document.getElementById(textareaId);
        if (textarea) {
          if (textarea.value && !confirm('This will overwrite your current draft. Do you want to insert the writing frame?')) {
            return;
          }
          textarea.value = template;
          textarea.dispatchEvent(new Event('input')); // Trigger check heuristics
        }
      });
    }
  };

  const q2Btn = document.getElementById('btn-q2-starter');
  if (q2Btn) {
    q2Btn.addEventListener('click', () => {
      AudioEngine.play('click');
      const textarea = document.getElementById('q2-user-answer');
      if (textarea) {
        if (textarea.value && !confirm('This will overwrite your current draft. Do you want to insert the writing frame?')) {
          return;
        }
        
        let questionEl = document.getElementById('q2-question-text');
        let questionText = questionEl ? questionEl.textContent.trim() : '';
        questionText = questionText.replace(/\s*\(\s*12\s*marks\s*\)\s*$/i, '');
        let topic = questionText.replace(/^Explain\s+why\s+/i, '');
        if (topic.endsWith('.')) {
          topic = topic.slice(0, -1);
        }
        if (!topic || topic.includes('Select a topic') || topic.includes('begin...')) {
          topic = "[Topic from the question]";
        }
        
        const template = 
          `The first reason why ${topic} was because [Insert Reason 1]...\n\n` +
          `The second reason why ${topic} was because [Insert Reason 2]...\n\n` +
          `The third reason why ${topic} was because [Insert Reason 3]...\n\n` +
          `Overall, the most important reason why ${topic} was [Reason 1/2/3] because...`;
          
        textarea.value = template;
        textarea.dispatchEvent(new Event('input'));
      }
    });
  }

  bindStarter('btn-q3a-starter', 'q3a-user-answer', 
    "Source B is useful for an inquiry into [Insert Topic] because it shows...\n\n" +
    "This is supported by my own knowledge that...\n\n" +
    "The provenance of Source B also increases its usefulness because it was created by [Insert Creator] in [Insert Year], which means it provides a reliable, first-hand account of...\n\n" +
    "However, the utility of the source is slightly limited because..."
  );

  bindStarter('btn-q3b-starter', 'q3b-user-answer', 
    "The main difference between the interpretations is that Interpretation 1 claims that [Insert Claim 1], whereas Interpretation 2 claims that [Insert Claim 2]."
  );

  bindStarter('btn-q3c-starter', 'q3c-user-answer', 
    "One reason the interpretations give different views is that they rely on different sources. Interpretation 1 relies on details about [Insert Detail B] in Source B, whereas Interpretation 2 relies on details about [Insert Detail C] in Source C."
  );

  bindStarter('btn-q3d-starter', 'q3d-user-answer', 
    "Interpretation 2 argues that [Insert Claim 2]. This is supported by Source C which shows...\n\n" +
    "On the other hand, Interpretation 1 argues that [Insert Claim 1]. This is supported by Source B which shows...\n\n" +
    "Overall, I agree more with Interpretation 2 because my own knowledge shows that..."
  );



  const adaptiveToggle = document.getElementById('exam-mode-adaptive');
  const analyticalToggle = document.getElementById('exam-mode-analytical');
  
  if (adaptiveToggle && analyticalToggle) {
    const syncToggles = () => {
      if (adaptiveToggle.checked) {
        analyticalToggle.checked = false;
        analyticalToggle.disabled = true;
        analyticalToggle.parentElement.parentElement.style.opacity = '0.5';
        analyticalToggle.parentElement.parentElement.style.pointerEvents = 'none';
      } else {
        analyticalToggle.disabled = false;
        analyticalToggle.parentElement.parentElement.style.opacity = '1';
        analyticalToggle.parentElement.parentElement.style.pointerEvents = 'auto';
      }
    };

    adaptiveToggle.addEventListener('change', syncToggles);
    analyticalToggle.addEventListener('change', () => {
      if (analyticalToggle.checked) {
        adaptiveToggle.checked = false;
      }
    });

    // Run once at load
    syncToggles();
  }

  document.getElementById('btn-exam-start').addEventListener('click', () => {
    AudioEngine.play('click');
    const scope = document.getElementById('exam-scope-select').value;
    const len = document.getElementById('exam-length-select').value;
    const limit = document.getElementById('exam-timer-select').value;
    startExam(scope, len, limit);
  });

  document.getElementById('btn-exam-skip').addEventListener('click', () => {
    if (state.examSession.activeIndex >= state.examSession.questions.length) return;
    // Record empty answer and grade incorrect
    const q = state.examSession.questions[state.examSession.activeIndex];
    state.examSession.answers[q.id] = "(Skipped)";
    state.examSession.grades[q.id] = false;
    
    AudioEngine.play('fail');
    state.examSession.activeIndex++;
    
    if (state.examSession.activeIndex >= state.examSession.questions.length) {
      finishExam();
    } else {
      displayExamQuestion();
    }
  });

  // Quiz Generator Next Question
  document.getElementById('btn-exam-next').addEventListener('click', () => {
    AudioEngine.play('click');
    nextExamQuestion();
  });

  // Remedial Review Panel bindings
  document.getElementById('btn-remedial-speak').addEventListener('click', () => {
    speakRemedial();
  });

  document.getElementById('btn-remedial-resume').addEventListener('click', () => {
    AudioEngine.play('click');
    resumeExamFromRemedial();
  });
  
  // Self-Grading buttons removed (dead code)
  
  document.getElementById('btn-exam-quit').addEventListener('click', () => {
    AudioEngine.play('click');
    if (confirm("Are you sure you want to stop this recall test? Your progress will be lost.")) {
      showExamSetup();
    }
  });

  document.getElementById('btn-results-finish').addEventListener('click', () => {
    AudioEngine.play('click');
    showExamSetup();
    switchView('dashboard');
  });

  // Bottom Settings Utilities
  const toggleSound = () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('edexcel_sound', JSON.stringify(state.soundEnabled));
    updateSoundBtnUI();
    AudioEngine.play('click');
  };

  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) soundBtn.addEventListener('click', toggleSound);
  const sidebarSoundBtn = document.getElementById('sidebar-sound-toggle-btn');
  if (sidebarSoundBtn) sidebarSoundBtn.addEventListener('click', toggleSound);

  const changeTheme = (nextTheme) => {
    state.theme = nextTheme;
    localStorage.setItem('edexcel_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    
    const headerTheme = document.getElementById('theme-selector');
    if (headerTheme) headerTheme.value = nextTheme;
    const sidebarTheme = document.getElementById('sidebar-theme-selector');
    if (sidebarTheme) sidebarTheme.value = nextTheme;
    
    AudioEngine.play('click');
  };

  const themeSel = document.getElementById('theme-selector');
  if (themeSel) themeSel.addEventListener('change', (e) => changeTheme(e.target.value));
  const sidebarThemeSel = document.getElementById('sidebar-theme-selector');
  if (sidebarThemeSel) sidebarThemeSel.addEventListener('change', (e) => changeTheme(e.target.value));

  const resetProgress = () => {
    if (confirm("WARNING: This will completely erase all your mastery stats. Bookmarks will be kept. Proceed?")) {
      state.mastery = {};
      saveProgress();
      renderSidebarNav();
      updateGlobalStats();
      if (state.currentView === 'dashboard') {
        renderDashboard();
      } else if (state.currentView === 'classic') {
        renderClassicView();
      }
      AudioEngine.play('fail');
    }
  };

  const resetBtn = document.getElementById('reset-progress-btn');
  if (resetBtn) resetBtn.addEventListener('click', resetProgress);
  const sidebarResetBtn = document.getElementById('sidebar-reset-progress-btn');
  if (sidebarResetBtn) sidebarResetBtn.addEventListener('click', resetProgress);



  // Exam Hub Nav Click
  const navExamHub = document.getElementById('nav-exam-hub');
  if (navExamHub) {
    navExamHub.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('exam-hub', 'technique');
    });
  }

  // Educator Worksheets Nav Click
  const navWorksheets = document.getElementById('nav-worksheets');
  if (navWorksheets) {
    navWorksheets.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('worksheets');
    });
  }



  // Tab Switcher
  document.querySelectorAll('.exam-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      const targetPanel = btn.getAttribute('data-panel');
      
      document.querySelectorAll('.exam-tab-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.borderColor = 'transparent';
        b.style.color = 'var(--text-muted)';
      });
      
      btn.classList.add('active');
      btn.style.background = 'rgba(255, 255, 255, 0.05)';
      btn.style.color = 'var(--text-main)';
      btn.style.borderColor = 'var(--border-glass)';
      
      document.querySelectorAll('.exam-panel-content').forEach(panel => {
        panel.style.display = 'none';
      });
      const targetEl = document.getElementById(`panel-${targetPanel}`);
      if (targetEl) targetEl.style.display = 'block';
      
      if (targetPanel === 'papers') {
        renderPastPapersView();
      }
    });
  });

  // Q1: Source Inference Handler
  const q1Select = document.getElementById('q1-topic-select');
  if (q1Select) {
    q1Select.addEventListener('change', (e) => {
      const topicId = e.target.value;
      if (!topicId || !EXAM_SKILLS_DATA.q1[topicId]) return;

      AudioEngine.play('click');
      const data = EXAM_SKILLS_DATA.q1[topicId];

      document.getElementById('q1-source-provenance').textContent = data.sourceA.provenance;
      
      const q1Img = document.getElementById('q1-source-img');
      const q1ImgCol = document.getElementById('q1-source-image-col');
      if (q1Img) {
        if (data.sourceA.image) {
          q1Img.src = data.sourceA.image;
          q1Img.style.display = 'block';
          if (q1ImgCol) q1ImgCol.style.display = 'flex';
        } else {
          q1Img.style.display = 'none';
          q1Img.src = '';
          if (q1ImgCol) q1ImgCol.style.display = 'none';
        }
      }
      
      document.getElementById('q1-source-content').textContent = data.sourceA.content;
      document.getElementById('q1-question-text').textContent = data.question + " (4 marks)";
      
      document.getElementById('q1-source-card').style.display = 'block';
      document.getElementById('q1-question-card').style.display = 'block';
      document.getElementById('q1-input-area').style.display = 'flex';

      document.getElementById('q1-clue-box').style.display = 'none';
      document.getElementById('q1-answer-box').style.display = 'none';
      
      const feedbackDiv = document.getElementById('q1-mcq-feedback');
      if (feedbackDiv) {
        feedbackDiv.style.display = 'none';
        feedbackDiv.textContent = '';
      }

      // Populate Choices Checkboxes
      const choicesContainer = document.getElementById('q1-mcq-choices');
      if (choicesContainer) {
        choicesContainer.innerHTML = data.options.map((opt, oIdx) => `
          <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer; padding: 8px; border-radius: var(--border-radius-sm); background: rgba(255, 255, 255, 0.02); border-left: none; padding-left: 8px; transition: all 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='rgba(255,255,255,0.02)'">
            <input type="checkbox" class="q1-mcq-option" data-idx="${oIdx}" style="margin-top: 3px;">
            <span style="font-size: 0.9rem;">${opt}</span>
          </label>
        `).join('');
      }

      for (let i = 1; i <= 2; i++) {
        const chk = document.getElementById(`chk-q1-rubric-${i}`);
        if (chk) chk.checked = false;
      }
    });
  }

  // Need a Clue? Q1
  const btnQ1Clue = document.getElementById('btn-q1-clue');
  if (btnQ1Clue) {
    btnQ1Clue.addEventListener('click', () => {
      const topicId = q1Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q1[topicId]) return;
      const box = document.getElementById('q1-clue-box');
      const isHidden = box.style.display === 'none';
      document.getElementById('q1-clue-text').innerHTML = `<strong>Clue:</strong> ${EXAM_SKILLS_DATA.q1[topicId].clue}`;
      box.style.display = isHidden ? 'block' : 'none';
      AudioEngine.play(isHidden ? 'flip' : 'click');
    });
  }

  // Reset Q1
  const btnQ1Reset = document.getElementById('btn-q1-reset');
  if (btnQ1Reset) {
    btnQ1Reset.addEventListener('click', () => {
      AudioEngine.play('click');
      const checkboxes = document.querySelectorAll('.q1-mcq-option');
      checkboxes.forEach(cb => {
        cb.checked = false;
        const label = cb.parentElement;
        label.style.background = 'rgba(255, 255, 255, 0.02)';
        label.style.borderLeft = 'none';
        label.style.paddingLeft = '8px';
      });
      document.getElementById('q1-clue-box').style.display = 'none';
      document.getElementById('q1-answer-box').style.display = 'none';
      const feedbackDiv = document.getElementById('q1-mcq-feedback');
      if (feedbackDiv) {
        feedbackDiv.style.display = 'none';
        feedbackDiv.textContent = '';
      }
      for (let i = 1; i <= 2; i++) {
        const chk = document.getElementById(`chk-q1-rubric-${i}`);
        if (chk) chk.checked = false;
      }
    });
  }

  // Self-Check Q1
  const btnQ1Selfcheck = document.getElementById('btn-q1-selfcheck');
  if (btnQ1Selfcheck) {
    btnQ1Selfcheck.addEventListener('click', () => {
      const topicId = q1Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q1[topicId]) return;

      const feedbackDiv = document.getElementById('q1-mcq-feedback');
      const box = document.getElementById('q1-answer-box');
      const checkboxes = document.querySelectorAll('.q1-mcq-option');

      const selectedIndices = [];
      checkboxes.forEach(cb => {
        if (cb.checked) {
          selectedIndices.push(parseInt(cb.getAttribute('data-idx')));
        }
      });

      if (selectedIndices.length !== 2) {
        AudioEngine.play('fail');
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        feedbackDiv.style.color = '#ef4444';
        feedbackDiv.style.borderColor = '#ef4444';
        feedbackDiv.textContent = '⚠️ Please select exactly TWO inferences.';
        return;
      }

      const correctIndices = EXAM_SKILLS_DATA.q1[topicId].correctIndices;
      const isCorrect = selectedIndices.every(idx => correctIndices.includes(idx)) &&
                        correctIndices.every(idx => selectedIndices.includes(idx));

      feedbackDiv.style.display = 'block';
      box.style.display = 'block';

      if (isCorrect) {
        AudioEngine.play('success');
        feedbackDiv.style.background = 'rgba(34, 197, 94, 0.1)';
        feedbackDiv.style.color = '#22c55e';
        feedbackDiv.style.borderColor = '#22c55e';
        feedbackDiv.textContent = '🎉 Correct! Both inferences are supported by the source details.';
        
        document.getElementById('chk-q1-rubric-1').checked = true;
        document.getElementById('chk-q1-rubric-2').checked = true;
      } else {
        AudioEngine.play('fail');
        feedbackDiv.style.background = 'rgba(239, 68, 68, 0.1)';
        feedbackDiv.style.color = '#ef4444';
        feedbackDiv.style.borderColor = '#ef4444';
        feedbackDiv.textContent = '❌ Incorrect. Some selected inferences are incorrect or not supported.';
        
        document.getElementById('chk-q1-rubric-1').checked = false;
        document.getElementById('chk-q1-rubric-2').checked = false;
      }

      checkboxes.forEach(cb => {
        const idx = parseInt(cb.getAttribute('data-idx'));
        const label = cb.parentElement;
        if (correctIndices.includes(idx)) {
          label.style.background = 'rgba(34, 197, 94, 0.15)';
          label.style.borderLeft = '3px solid #22c55e';
          label.style.paddingLeft = '5px';
        } else if (cb.checked) {
          label.style.background = 'rgba(239, 68, 68, 0.15)';
          label.style.borderLeft = '3px solid #ef4444';
          label.style.paddingLeft = '5px';
        } else {
          label.style.background = 'rgba(255, 255, 255, 0.02)';
          label.style.borderLeft = 'none';
          label.style.paddingLeft = '8px';
        }
      });

      document.getElementById('q1-model-answer-text').innerHTML = highlightModelQuotes(EXAM_SKILLS_DATA.q1[topicId].model);
      box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }


  // Q2: Causation Handler
  const q2Select = document.getElementById('q2-topic-select');
  if (q2Select) {
    q2Select.addEventListener('change', (e) => {
      const topicId = e.target.value;
      if (!topicId || !EXAM_SKILLS_DATA.q2[topicId]) return;

      AudioEngine.play('click');
      const data = EXAM_SKILLS_DATA.q2[topicId];

      document.getElementById('q2-question-text').textContent = data.question + " (12 marks)";
      document.getElementById('q2-stimulus-1').textContent = data.stimulus1;
      document.getElementById('q2-stimulus-2').textContent = data.stimulus2;

      document.getElementById('q2-question-card').style.display = 'block';
      document.getElementById('q2-input-area').style.display = 'flex';

      document.getElementById('q2-user-answer').value = '';
      document.getElementById('q2-clue-box').style.display = 'none';
      document.getElementById('q2-answer-box').style.display = 'none';
      document.getElementById('draft-feedback-q2').style.display = 'none';

      // Populate Q2 Keywords Box
      const knowledgeContainer = document.getElementById('q2-knowledge-keywords');
      const connectiveContainer = document.getElementById('q2-connective-keywords');
      knowledgeContainer.innerHTML = '';
      connectiveContainer.innerHTML = '';

      if (data.knowledgeWords) {
        data.knowledgeWords.forEach(word => {
          const chip = document.createElement('span');
          chip.className = 'feedback-tag';
          chip.textContent = word;
          chip.dataset.keyword = word.toLowerCase();
          knowledgeContainer.appendChild(chip);
        });
      }
      if (data.connectiveWords) {
        data.connectiveWords.forEach(word => {
          const chip = document.createElement('span');
          chip.className = 'feedback-tag';
          chip.textContent = word;
          chip.dataset.keyword = word.toLowerCase();
          connectiveContainer.appendChild(chip);
        });
      }
      document.getElementById('q2-keywords-box').style.display = 'block';

      for (let i = 1; i <= 3; i++) {
        const chk = document.getElementById(`chk-q2-rubric-${i}`);
        if (chk) chk.checked = false;
      }
    });
  }

  // Need a Clue? Q2
  const btnQ2Clue = document.getElementById('btn-q2-clue');
  if (btnQ2Clue) {
    btnQ2Clue.addEventListener('click', () => {
      const topicId = q2Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q2[topicId]) return;
      const box = document.getElementById('q2-clue-box');
      const isHidden = box.style.display === 'none';
      document.getElementById('q2-clue-text').innerHTML = `<strong>Clue:</strong> ${EXAM_SKILLS_DATA.q2[topicId].clue}`;
      box.style.display = isHidden ? 'block' : 'none';
      AudioEngine.play(isHidden ? 'flip' : 'click');
    });
  }

  // Reset Q2
  const btnQ2Reset = document.getElementById('btn-q2-reset');
  if (btnQ2Reset) {
    btnQ2Reset.addEventListener('click', () => {
      AudioEngine.play('click');
      document.getElementById('q2-user-answer').value = '';
      document.getElementById('q2-clue-box').style.display = 'none';
      document.getElementById('q2-answer-box').style.display = 'none';
      document.getElementById('draft-feedback-q2').style.display = 'none';
      
      const knowledgeChips = document.querySelectorAll('#q2-knowledge-keywords .feedback-tag');
      knowledgeChips.forEach(chip => {
        chip.classList.remove('matched');
        chip.innerHTML = chip.textContent.replace(/^✓\s*/, '');
      });
      const connectiveChips = document.querySelectorAll('#q2-connective-keywords .feedback-tag');
      connectiveChips.forEach(chip => {
        chip.classList.remove('matched');
        chip.innerHTML = chip.textContent.replace(/^✓\s*/, '');
      });

      for (let i = 1; i <= 3; i++) {
        const chk = document.getElementById(`chk-q2-rubric-${i}`);
        if (chk) chk.checked = false;
      }
    });
  }

  // Self-Check Q2
  const btnQ2Selfcheck = document.getElementById('btn-q2-selfcheck');
  if (btnQ2Selfcheck) {
    btnQ2Selfcheck.addEventListener('click', () => {
      const topicId = q2Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q2[topicId]) return;

      const box = document.getElementById('q2-answer-box');
      const isHidden = box.style.display === 'none';

      if (isHidden) {
        const data = EXAM_SKILLS_DATA.q2[topicId];
        const userAnswer = document.getElementById('q2-user-answer').value;

        const evaluation = evaluateStudentAnswer('q2', data, userAnswer);

        for (let i = 1; i <= 3; i++) {
          const chk = document.getElementById(`chk-q2-rubric-${i}`);
          if (chk) chk.checked = evaluation.scores[i - 1];
        }

        document.getElementById('q2-model-answer-text').innerHTML = highlightModelQuotes(data.model);
        const feedbackContainer = document.getElementById('q2-heuristic-feedback');
        if (feedbackContainer) {
          feedbackContainer.innerHTML = evaluation.feedback;
          feedbackContainer.style.display = 'block';
        }

        box.style.display = 'block';
        AudioEngine.play('success');
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        box.style.display = 'none';
        AudioEngine.play('click');
      }
    });
  }

  // Model answer toggle button for Q2
  const btnQ2Model = document.getElementById('btn-q2-model');
  if (btnQ2Model) {
    btnQ2Model.addEventListener('click', () => {
      const topicId = q2Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q2[topicId]) return;

      const box = document.getElementById('q2-answer-box');
      const isHidden = box.style.display === 'none';

      if (isHidden) {
        document.getElementById('q2-model-answer-text').innerHTML = highlightModelQuotes(EXAM_SKILLS_DATA.q2[topicId].model);
        box.style.display = 'block';
        AudioEngine.play('flip');
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        box.style.display = 'none';
        AudioEngine.play('click');
      }
    });
  }

  // Real-time Causation check Q2
  const q2UserAnswer = document.getElementById('q2-user-answer');
  if (q2UserAnswer) {
    q2UserAnswer.addEventListener('input', (e) => {
      const topicId = q2Select.value;
      if (topicId && EXAM_SKILLS_DATA.q2[topicId]) {
        updateRealTimeFeedback('q2', e.target.value, EXAM_SKILLS_DATA.q2[topicId], topicId);
      }
    });
  }


  // Q3: Merged dropdown suite
  const q3Select = document.getElementById('q3-topic-select');
  if (q3Select) {
    q3Select.addEventListener('change', (e) => {
      const topicId = e.target.value;
      if (!topicId || !EXAM_SKILLS_DATA.q3[topicId]) return;

      AudioEngine.play('click');
      const data = EXAM_SKILLS_DATA.q3[topicId];

      // Populate Materials
      document.getElementById('q3-sourceb-provenance').textContent = data.sourceB.provenance;
      
      const sourceBImg = document.getElementById('q3-sourceb-img');
      if (sourceBImg) {
        if (data.sourceB.image) {
          sourceBImg.src = data.sourceB.image;
          sourceBImg.style.display = 'block';
        } else {
          sourceBImg.style.display = 'none';
          sourceBImg.src = '';
        }
      }
      
      document.getElementById('q3-sourceb-content').textContent = data.sourceB.content;
      document.getElementById('q3-sourcec-provenance').textContent = data.sourceC.provenance;
      
      const sourceCImg = document.getElementById('q3-sourcec-img');
      if (sourceCImg) {
        if (data.sourceC.image) {
          sourceCImg.src = data.sourceC.image;
          sourceCImg.style.display = 'block';
        } else {
          sourceCImg.style.display = 'none';
          sourceCImg.src = '';
        }
      }
      
      document.getElementById('q3-sourcec-content').textContent = data.sourceC.content;
      document.getElementById('q3-int1-author').textContent = data.interpretation1.author;
      document.getElementById('q3-int1-content').textContent = data.interpretation1.content;
      document.getElementById('q3-int2-author').textContent = data.interpretation2.author;
      document.getElementById('q3-int2-content').textContent = data.interpretation2.content;

      // Question a title
      document.getElementById('q3a-question-title').textContent = data.questiona + " (8 Marks)";

      document.getElementById('q3-materials-container').style.display = 'flex';
      document.getElementById('q3-input-area').style.display = 'flex';

      document.getElementById('q3a-user-answer').value = '';
      document.getElementById('q3b-user-answer').value = '';
      document.getElementById('q3c-user-answer').value = '';
      document.getElementById('q3d-user-answer').value = '';

      document.getElementById('q3a-clue-box').style.display = 'none';
      document.getElementById('q3a-answer-box').style.display = 'none';
      document.getElementById('draft-feedback-q3a').style.display = 'none';

      document.getElementById('q3b-answer-box').style.display = 'none';
      document.getElementById('q3c-answer-box').style.display = 'none';
      document.getElementById('q3d-clue-box').style.display = 'none';
      document.getElementById('q3d-answer-box').style.display = 'none';
      document.getElementById('draft-feedback-q3d').style.display = 'none';

      for (let i = 1; i <= 4; i++) {
        const chka = document.getElementById(`chk-q3a-rubric-${i}`);
        if (chka) chka.checked = false;
        const chkd = document.getElementById(`chk-q3d-rubric-${i}`);
        if (chkd) chkd.checked = false;
      }
    });
  }

  // Need a Clue? Q3a
  const btnQ3aClue = document.getElementById('btn-q3a-clue');
  if (btnQ3aClue) {
    btnQ3aClue.addEventListener('click', () => {
      const topicId = q3Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q3[topicId]) return;
      const box = document.getElementById('q3a-clue-box');
      const isHidden = box.style.display === 'none';
      document.getElementById('q3a-clue-text').innerHTML = `<strong>Clue:</strong> ${EXAM_SKILLS_DATA.q3[topicId].cluea}`;
      box.style.display = isHidden ? 'block' : 'none';
      AudioEngine.play(isHidden ? 'flip' : 'click');
    });
  }

  // Self-Check Q3a
  const btnQ3aSelfcheck = document.getElementById('btn-q3a-selfcheck');
  if (btnQ3aSelfcheck) {
    btnQ3aSelfcheck.addEventListener('click', () => {
      const topicId = q3Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q3[topicId]) return;

      const box = document.getElementById('q3a-answer-box');
      const isHidden = box.style.display === 'none';

      if (isHidden) {
        const data = EXAM_SKILLS_DATA.q3[topicId];
        const userAnswer = document.getElementById('q3a-user-answer').value;

        const evaluation = evaluateStudentAnswer('q3a', data, userAnswer);

        for (let i = 1; i <= 4; i++) {
          const chk = document.getElementById(`chk-q3a-rubric-${i}`);
          if (chk) chk.checked = evaluation.scores[i - 1];
        }

        document.getElementById('q3a-model-answer-text').innerHTML = highlightModelQuotes(data.modela);
        const feedbackContainer = document.getElementById('q3a-heuristic-feedback');
        if (feedbackContainer) {
          feedbackContainer.innerHTML = evaluation.feedback;
          feedbackContainer.style.display = 'block';
        }

        box.style.display = 'block';
        AudioEngine.play('success');
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        box.style.display = 'none';
        AudioEngine.play('click');
      }
    });
  }

  // Real-time Utility check (COPR checklist)
  const q3aUserAnswer = document.getElementById('q3a-user-answer');
  if (q3aUserAnswer) {
    q3aUserAnswer.addEventListener('input', (e) => {
      const topicId = q3Select.value;
      if (topicId && EXAM_SKILLS_DATA.q3[topicId]) {
        const value = e.target.value;
        const feedbackCard = document.getElementById('draft-feedback-q3a');
        if (!feedbackCard) return;

        feedbackCard.style.display = 'flex';
        const text = value.toLowerCase();

        const coprTokens = ["provenance", "useful", "reliable", "purpose", "reliable because", "unreliable", "limitation", "context", "valuable"];
        const matchedTokens = coprTokens.filter(t => text.includes(t));

        const tagsContainer = document.getElementById('copr-tags-q3a');
        if (tagsContainer) {
          tagsContainer.innerHTML = "";
          coprTokens.forEach(t => {
            const isMatched = text.includes(t);
            const tag = document.createElement("span");
            tag.className = `feedback-tag ${isMatched ? "matched" : ""}`;
            tag.innerHTML = isMatched ? `<i class="fa-solid fa-check"></i> ${t}` : t;
            tagsContainer.appendChild(tag);
          });
        }

        const keywords = getKeywordsForQuestion('q3a', topicId, EXAM_SKILLS_DATA.q3[topicId]);
        const matchedKeywords = keywords.filter(kw => text.includes(kw.toLowerCase()));
        const keyTagsContainer = document.getElementById('keyword-tags-q3a');
        if (keyTagsContainer) {
          keyTagsContainer.innerHTML = "";
          keywords.forEach(kw => {
            const isMatched = text.includes(kw.toLowerCase());
            const tag = document.createElement("span");
            tag.className = `feedback-tag ${isMatched ? "matched" : ""}`;
            tag.innerHTML = isMatched ? `<i class="fa-solid fa-check"></i> ${kw}` : kw;
            keyTagsContainer.appendChild(tag);
          });
        }

        const totalItems = coprTokens.length + keywords.length;
        const matchedItems = matchedTokens.length + matchedKeywords.length;
        const pct = totalItems > 0 ? Math.round((matchedItems / totalItems) * 100) : 0;

        const fill = document.getElementById('feedback-fill-q3a');
        if (fill) fill.style.width = `${pct}%`;

        const badge = document.getElementById('feedback-badge-q3a');
        if (badge) {
          badge.className = "feedback-badge";
          if (pct === 100) {
            badge.classList.add("status-outstanding");
            badge.textContent = "Structure: Outstanding";
          } else if (pct >= 60) {
            badge.classList.add("status-strong");
            badge.textContent = "Structure: Strong";
          } else if (pct >= 30) {
            badge.classList.add("status-developing");
            badge.textContent = "Structure: Developing";
          } else {
            badge.textContent = "Structure: Drafting";
          }
        }
      }
    });
  }

  // Self-Check Q3b
  const btnQ3bSelfcheck = document.getElementById('btn-q3b-selfcheck');
  if (btnQ3bSelfcheck) {
    btnQ3bSelfcheck.addEventListener('click', () => {
      const topicId = q3Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q3[topicId]) return;
      const box = document.getElementById('q3b-answer-box');
      const isHidden = box.style.display === 'none';
      if (isHidden) {
        document.getElementById('q3b-model-text').innerHTML = highlightModelQuotes(EXAM_SKILLS_DATA.q3[topicId].modelb);
        box.style.display = 'block';
        AudioEngine.play('success');
      } else {
        box.style.display = 'none';
        AudioEngine.play('click');
      }
    });
  }

  // Self-Check Q3c
  const btnQ3cSelfcheck = document.getElementById('btn-q3c-selfcheck');
  if (btnQ3cSelfcheck) {
    btnQ3cSelfcheck.addEventListener('click', () => {
      const topicId = q3Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q3[topicId]) return;
      const box = document.getElementById('q3c-answer-box');
      const isHidden = box.style.display === 'none';
      if (isHidden) {
        document.getElementById('q3c-model-text').innerHTML = highlightModelQuotes(EXAM_SKILLS_DATA.q3[topicId].modelc);
        box.style.display = 'block';
        AudioEngine.play('success');
      } else {
        box.style.display = 'none';
        AudioEngine.play('click');
      }
    });
  }


  // Clue Q3d
  const btnQ3dClue = document.getElementById('btn-q3d-clue');
  if (btnQ3dClue) {
    btnQ3dClue.addEventListener('click', () => {
      const topicId = q3Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q3[topicId]) return;
      const box = document.getElementById('q3d-clue-box');
      const isHidden = box.style.display === 'none';
      document.getElementById('q3d-clue-text').innerHTML = `<strong>Clue:</strong> ${EXAM_SKILLS_DATA.q3[topicId].clued}`;
      box.style.display = isHidden ? 'block' : 'none';
      AudioEngine.play(isHidden ? 'flip' : 'click');
    });
  }

  // Reset Q3 (combined reset button)
  const btnQ3Reset = document.getElementById('btn-q3-reset');
  if (btnQ3Reset) {
    btnQ3Reset.addEventListener('click', () => {
      AudioEngine.play('click');
      document.getElementById('q3a-user-answer').value = '';
      document.getElementById('q3b-user-answer').value = '';
      document.getElementById('q3c-user-answer').value = '';
      document.getElementById('q3d-user-answer').value = '';
      
      document.getElementById('q3a-clue-box').style.display = 'none';
      document.getElementById('q3a-answer-box').style.display = 'none';
      document.getElementById('draft-feedback-q3a').style.display = 'none';

      document.getElementById('q3b-answer-box').style.display = 'none';
      document.getElementById('q3c-answer-box').style.display = 'none';
      document.getElementById('q3d-clue-box').style.display = 'none';
      document.getElementById('q3d-answer-box').style.display = 'none';
      document.getElementById('draft-feedback-q3d').style.display = 'none';
      for (let i = 1; i <= 4; i++) {
        const chka = document.getElementById(`chk-q3a-rubric-${i}`);
        if (chka) chka.checked = false;
        const chkd = document.getElementById(`chk-q3d-rubric-${i}`);
        if (chkd) chkd.checked = false;
      }
    });
  }

  // Self-Check Q3d
  const btnQ3dSelfcheck = document.getElementById('btn-q3d-selfcheck');
  if (btnQ3dSelfcheck) {
    btnQ3dSelfcheck.addEventListener('click', () => {
      const topicId = q3Select.value;
      if (!topicId || !EXAM_SKILLS_DATA.q3[topicId]) return;

      const box = document.getElementById('q3d-answer-box');
      const isHidden = box.style.display === 'none';

      if (isHidden) {
        const data = EXAM_SKILLS_DATA.q3[topicId];
        const userAnswer = document.getElementById('q3d-user-answer').value;

        const evaluation = evaluateStudentAnswer('q3d', data, userAnswer);

        for (let i = 1; i <= 4; i++) {
          const chk = document.getElementById(`chk-q3d-rubric-${i}`);
          if (chk) chk.checked = evaluation.scores[i - 1];
        }

        document.getElementById('q3d-model-answer-text').innerHTML = highlightModelQuotes(data.modeld);
        const feedbackContainer = document.getElementById('q3d-heuristic-feedback');
        if (feedbackContainer) {
          feedbackContainer.innerHTML = evaluation.feedback;
          feedbackContainer.style.display = 'block';
        }

        box.style.display = 'block';
        AudioEngine.play('success');
        box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        box.style.display = 'none';
        AudioEngine.play('click');
      }
    });
  }

  // Real-time debate stem checker Q3d
  const q3dUserAnswer = document.getElementById('q3d-user-answer');
  if (q3dUserAnswer) {
    q3dUserAnswer.addEventListener('input', (e) => {
      const topicId = q3Select.value;
      if (topicId && EXAM_SKILLS_DATA.q3[topicId]) {
        const value = e.target.value;
        const feedbackCard = document.getElementById('draft-feedback-q3d');
        if (!feedbackCard) return;

        feedbackCard.style.display = 'flex';
        const text = value.toLowerCase();

        const debateTokens = ["agree", "disagree", "however", "on the other hand", "although", "while", "contrast", "alternative", "overall", "conclude", "interpretation 1", "interpretation 2"];
        const matchedTokens = debateTokens.filter(t => text.includes(t));

        const tagsContainer = document.getElementById('evaluation-tags-q3d');
        if (tagsContainer) {
          tagsContainer.innerHTML = "";
          debateTokens.forEach(t => {
            const isMatched = text.includes(t);
            const tag = document.createElement("span");
            tag.className = `feedback-tag ${isMatched ? "matched" : ""}`;
            tag.innerHTML = isMatched ? `<i class="fa-solid fa-check"></i> ${t}` : t;
            tagsContainer.appendChild(tag);
          });
        }

        const keywords = getKeywordsForQuestion('q3d', topicId, EXAM_SKILLS_DATA.q3[topicId]);
        const matchedKeywords = keywords.filter(kw => text.includes(kw.toLowerCase()));
        const keyTagsContainer = document.getElementById('keyword-tags-q3d');
        if (keyTagsContainer) {
          keyTagsContainer.innerHTML = "";
          keywords.forEach(kw => {
            const isMatched = text.includes(kw.toLowerCase());
            const tag = document.createElement("span");
            tag.className = `feedback-tag ${isMatched ? "matched" : ""}`;
            tag.innerHTML = isMatched ? `<i class="fa-solid fa-check"></i> ${kw}` : kw;
            keyTagsContainer.appendChild(tag);
          });
        }

        const totalItems = debateTokens.length + keywords.length;
        const matchedItems = matchedTokens.length + matchedKeywords.length;
        const pct = totalItems > 0 ? Math.round((matchedItems / totalItems) * 100) : 0;

        const fill = document.getElementById('feedback-fill-q3d');
        if (fill) fill.style.width = `${pct}%`;

        const badge = document.getElementById('feedback-badge-q3d');
        if (badge) {
          badge.className = "feedback-badge";
          if (pct === 100) {
            badge.classList.add("status-outstanding");
            badge.textContent = "Structure: Outstanding";
          } else if (pct >= 60) {
            badge.classList.add("status-strong");
            badge.textContent = "Structure: Strong";
          } else if (pct >= 30) {
            badge.classList.add("status-developing");
            badge.textContent = "Structure: Developing";
          } else {
            badge.textContent = "Structure: Drafting";
          }
        }
      }
    });
  }


  // Past Exam Select
  const pastPaperSelect = document.getElementById('past-paper-select');
  if (pastPaperSelect) {
    pastPaperSelect.addEventListener('change', (e) => {
      AudioEngine.play('click');
    });
  }

  // Past paper open button
  const btnStartPastPaper = document.getElementById('btn-start-past-paper');
  if (btnStartPastPaper) {
    btnStartPastPaper.addEventListener('click', () => {
      const val = pastPaperSelect.value;
      if (!val) return;
      AudioEngine.play('click');
      startPastPaper(val);
    });
  }

  // Past paper generate mock button
  const btnGenerateMock = document.getElementById('btn-generate-mock');
  if (btnGenerateMock) {
    btnGenerateMock.addEventListener('click', () => {
      AudioEngine.play('click');
      generateMockExam();
    });
  }

  // Desktop Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // Avoid triggering when user is typing in inputs or textareas
    const active = document.activeElement;
    if (active && (
      active.tagName === 'INPUT' || 
      active.tagName === 'TEXTAREA' || 
      active.isContentEditable
    )) {
      return;
    }

    // Escape Key - Global modals/sidebar
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeVideoModal();
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebar-overlay');
      if (sidebar && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
      }
      if (overlay && overlay.classList.contains('active')) {
        overlay.classList.remove('active');
      }
      return;
    }

    // Flashcard View Controls
    const flashcardView = document.getElementById('view-flashcards');
    if (flashcardView && flashcardView.classList.contains('active')) {
      const cardEl = document.getElementById('flashcard-card');
      if (cardEl && !state.flashcardSession.reinforcing) {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          flipFlashcard();
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
          e.preventDefault();
          handleFlashcardGrade(false);
        } else if (e.key === 'ArrowRight' || e.key === 'Right') {
          e.preventDefault();
          handleFlashcardGrade(true);
        }
      }
      return;
    }

    // 10-Step Unit Mastery Journey Controls (when in lesson/mastery view)
    const masteryView = document.getElementById('view-mastery');
    if (masteryView && masteryView.classList.contains('active')) {
      const homeworkCard = masteryView.querySelector('.homework-questions-card');
      if (homeworkCard) {
        if (e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          const revealBtn = homeworkCard.querySelector('.journey-reveal-answer-btn');
          if (revealBtn) revealBtn.click();
        } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
          e.preventDefault();
          const prevBtn = homeworkCard.querySelector('.journey-prev-btn');
          if (prevBtn && !prevBtn.disabled) prevBtn.click();
        } else if (e.key === 'ArrowRight' || e.key === 'Right') {
          e.preventDefault();
          const nextBtn = homeworkCard.querySelector('.journey-next-btn');
          if (nextBtn && !nextBtn.disabled) nextBtn.click();
        } else if (e.key >= '1' && e.key <= '9') {
          e.preventDefault();
          const idx = parseInt(e.key) - 1;
          const node = homeworkCard.querySelector(`.journey-step-node[data-step-index="${idx}"]`);
          if (node) node.click();
        } else if (e.key === '0') {
          e.preventDefault();
          const node = homeworkCard.querySelector(`.journey-step-node[data-step-index="9"]`);
          if (node) node.click();
        }
      }
    }
  });

  // Mobile Touch Swipe & Mouse Drag Gestures for Flashcards
  const viewFlashcards = document.getElementById('view-flashcards');
  if (viewFlashcards) {
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let deltaX = 0;
    let cardEl = null;

    viewFlashcards.addEventListener('mousedown', startDrag);
    viewFlashcards.addEventListener('touchstart', startDrag);

    // TTS Speaker Button Click
    viewFlashcards.addEventListener('click', (e) => {
      const btn = e.target.closest('.tts-speak-btn');
      if (btn) {
        e.stopPropagation(); // Avoid triggering card flip when clicking speaker icon!
        AudioEngine.play('click');
        
        const isFront = btn.id === 'btn-front-tts';
        const deck = state.flashcardSession.deck;
        const idx = state.flashcardSession.activeIndex;
        if (deck && deck[idx]) {
          const q = deck[idx];
          const textToSpeak = isFront 
            ? q.question 
            : `${q.answer}. Explanation: ${q.explanation}`;
          
          btn.style.color = 'var(--primary)';
          AudioEngine.speak(textToSpeak, 
            () => {
              btn.innerHTML = '<i class="fa-solid fa-volume-high fa-beat"></i>';
            },
            () => {
              btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
              btn.style.color = '';
            },
            () => {
              btn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
              btn.style.color = '';
            }
          );
        }
      }
    });

    function startDrag(e) {
      cardEl = document.getElementById('flashcard-card');
      if (!cardEl) return;
      
      if (state.flashcardSession.reinforcing) return;
      if (cardEl.classList.contains('swipe-right') || cardEl.classList.contains('swipe-left')) return;

      const target = e.target;
      if (target.closest('button') || target.closest('.bookmark-icon-container') || target.closest('#flashcard-reinforce-options') || target.closest('.rubric-checklist-container')) {
        return;
      }
      if (!cardEl.contains(target)) return;

      isDragging = true;
      state.flashcardSession.wasDragged = false;
      
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      startX = clientX;
      startY = clientY;
      
      cardEl.classList.remove('resetting');
      
      if (e.type === 'mousedown') {
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
      } else {
        document.addEventListener('touchmove', drag, { passive: false });
        document.addEventListener('touchend', endDrag);
      }
    }

    function drag(e) {
      if (!isDragging || !cardEl) return;
      
      const clientX = e.type.startsWith('touch') ? e.touches[0].clientX : e.clientX;
      const clientY = e.type.startsWith('touch') ? e.touches[0].clientY : e.clientY;
      
      deltaX = clientX - startX;
      const deltaY = clientY - startY;

      if (e.type.startsWith('touch') && Math.abs(deltaY) > Math.abs(deltaX) * 1.5 && Math.abs(deltaX) < 15) {
        endDrag();
        return;
      }

      if (e.cancelable) e.preventDefault();

      if (Math.abs(deltaX) > 10) {
        state.flashcardSession.wasDragged = true;
      }

      const isFlipped = cardEl.classList.contains('flipped');
      const rotationAngle = deltaX * 0.05 * (isFlipped ? -1 : 1);
      cardEl.style.transform = `translateX(${deltaX}px) rotateY(${isFlipped ? 180 : 0}deg) rotate(${rotationAngle}deg)`;
    }

    function endDrag() {
      if (!isDragging || !cardEl) return;
      isDragging = false;
      
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', endDrag);

      const threshold = 100;
      if (deltaX > threshold) {
        cardEl.style.transform = '';
        handleFlashcardGrade(true);
      } else if (deltaX < -threshold) {
        cardEl.style.transform = '';
        handleFlashcardGrade(false);
      } else {
        cardEl.classList.add('resetting');
        cardEl.style.transform = '';
        setTimeout(() => {
          cardEl.classList.remove('resetting');
        }, 200);
      }
      
      deltaX = 0;
    }
  }

  // Settings & Accessibility Drawer
  const btnToggle = document.getElementById('btn-settings-toggle');
  const settingsOverlay = document.getElementById('settings-drawer-overlay');
  const btnClose = document.getElementById('btn-settings-close');
  
  if (btnToggle && settingsOverlay) {
    btnToggle.addEventListener('click', () => {
      AudioEngine.play('click');
      settingsOverlay.style.display = 'flex';
    });
  }
  
  if (btnClose && settingsOverlay) {
    btnClose.addEventListener('click', () => {
      AudioEngine.play('click');
      settingsOverlay.style.display = 'none';
    });
    settingsOverlay.addEventListener('click', (e) => {
      if (e.target === settingsOverlay) {
        AudioEngine.play('click');
        settingsOverlay.style.display = 'none';
      }
    });
  }

  const fontBtns = document.querySelectorAll('.font-scale-btn');
  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      const scale = btn.getAttribute('data-scale');
      
      fontBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.documentElement.style.fontSize = `${scale * 100}%`;
      localStorage.setItem('edexcel_prefs_fontsize', scale);
    });
  });

  const volumeSlider = document.getElementById('settings-volume-slider');
  const percentText = document.getElementById('settings-volume-percent');
  if (volumeSlider && percentText) {
    volumeSlider.addEventListener('input', (e) => {
      const val = e.target.value;
      percentText.textContent = `${val}%`;
      state.audioVolume = val / 100;
      localStorage.setItem('edexcel_prefs_volume', state.audioVolume);
    });
    
    volumeSlider.addEventListener('change', () => {
      AudioEngine.play('click');
    });
  }

  const contrastToggle = document.getElementById('settings-contrast-toggle');
  if (contrastToggle) {
    contrastToggle.addEventListener('change', (e) => {
      AudioEngine.play('click');
      const isHigh = e.target.checked;
      if (isHigh) {
        document.documentElement.setAttribute('data-contrast', 'high');
        localStorage.setItem('edexcel_prefs_contrast', 'high');
      } else {
        document.documentElement.setAttribute('data-contrast', 'normal');
        localStorage.setItem('edexcel_prefs_contrast', 'normal');
      }
    });
  }

  // Progress Sync Listeners
  const btnSyncGenerate = document.getElementById('btn-sync-generate');
  const syncOutputContainer = document.getElementById('sync-code-output-container');
  const syncOutputField = document.getElementById('sync-code-output-field');
  const btnSyncCopy = document.getElementById('btn-sync-copy');
  const syncCopyToast = document.getElementById('sync-copy-toast');
  const btnSyncLoad = document.getElementById('btn-sync-load');
  const syncInputField = document.getElementById('sync-code-input-field');
  const syncLoadFeedback = document.getElementById('sync-load-feedback');

  if (btnSyncGenerate && syncOutputContainer && syncOutputField) {
    btnSyncGenerate.addEventListener('click', () => {
      AudioEngine.play('click');
      try {
        const code = generateSyncCode();
        syncOutputField.value = code;
        syncOutputContainer.style.display = 'flex';
        if (syncCopyToast) syncCopyToast.style.display = 'none';
      } catch (err) {
        console.error(err);
        alert("Failed to generate sync code: " + err.message);
      }
    });
  }

  if (btnSyncCopy && syncOutputField) {
    btnSyncCopy.addEventListener('click', () => {
      AudioEngine.play('click');
      syncOutputField.select();
      syncOutputField.setSelectionRange(0, 99999); // For mobile devices
      navigator.clipboard.writeText(syncOutputField.value)
        .then(() => {
          if (syncCopyToast) {
            syncCopyToast.style.display = 'block';
            setTimeout(() => {
              syncCopyToast.style.display = 'none';
            }, 3000);
          }
        })
        .catch(err => {
          console.error("Failed to copy text: ", err);
        });
    });
  }

  if (btnSyncLoad && syncInputField && syncLoadFeedback) {
    btnSyncLoad.addEventListener('click', () => {
      AudioEngine.play('click');
      const code = syncInputField.value.trim();
      if (!code) {
        syncLoadFeedback.style.color = 'var(--accent)';
        syncLoadFeedback.textContent = 'Please paste a save code first.';
        return;
      }
      
      try {
        loadSyncCode(code);
        syncLoadFeedback.style.color = 'var(--success)';
        syncLoadFeedback.textContent = 'Progress loaded successfully! Reloading...';
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        syncLoadFeedback.style.color = 'var(--accent)';
        syncLoadFeedback.textContent = err.message;
      }
    });
  }

  // Accessibility Keyboard Shortcuts for Flashcards
  window.addEventListener('keydown', (e) => {
    if (state.currentView === 'flashcards') {
      const completionCard = document.querySelector('.flashcard-completion-card');
      if (completionCard) return;

      // Ignore keydown if the user is typing in a text area or input field
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipFlashcard();
      } else if (e.key === 'ArrowLeft') {
        const incorrectBtn = document.getElementById('btn-flashcard-incorrect');
        if (incorrectBtn && incorrectBtn.style.display !== 'none' && !state.flashcardSession.reinforcing) {
          e.preventDefault();
          handleFlashcardGrade(false);
        }
      } else if (e.key === 'ArrowRight') {
        const correctBtn = document.getElementById('btn-flashcard-correct');
        if (correctBtn && correctBtn.style.display !== 'none' && !state.flashcardSession.reinforcing) {
          e.preventDefault();
          handleFlashcardGrade(true);
        }
      } else if (state.flashcardSession.reinforcing && ['1', '2', '3', '4'].includes(e.key)) {
        e.preventDefault();
        const optionBtns = document.querySelectorAll('.flashcard-mcq-option');
        const optIdx = parseInt(e.key) - 1;
        if (optionBtns[optIdx]) {
          optionBtns[optIdx].click();
        }
      }
    }
  });

  function applyLoadedSettings() {
    const savedScale = localStorage.getItem('edexcel_prefs_fontsize');
    if (savedScale) {
      document.documentElement.style.fontSize = `${savedScale * 100}%`;
      const activeBtn = document.querySelector(`.font-scale-btn[data-scale="${savedScale}"]`);
      if (activeBtn) {
        fontBtns.forEach(b => b.classList.remove('active'));
        activeBtn.classList.add('active');
      }
    }
    
    const savedVol = localStorage.getItem('edexcel_prefs_volume');
    if (savedVol !== null) {
      state.audioVolume = parseFloat(savedVol);
      if (volumeSlider && percentText) {
        volumeSlider.value = Math.round(state.audioVolume * 100);
        percentText.textContent = `${volumeSlider.value}%`;
      }
    } else {
      state.audioVolume = 0.8;
    }

    const savedContrast = localStorage.getItem('edexcel_prefs_contrast');
    if (savedContrast === 'high') {
      document.documentElement.setAttribute('data-contrast', 'high');
      if (contrastToggle) contrastToggle.checked = true;
    } else {
      document.documentElement.setAttribute('data-contrast', 'normal');
      if (contrastToggle) contrastToggle.checked = false;
    }
  }
  
  applyLoadedSettings();

  // Delegated listener for C, NOP, OK source annotator clues
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('.annotator-btn');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const paperId = btn.getAttribute('data-paper-id');
    const sourceLetter = btn.getAttribute('data-source');
    const type = btn.getAttribute('data-type');
    const displayBox = document.getElementById(`clue-display-${paperId}-${sourceLetter}`);
    if (!displayBox) return;

    const parentContainer = btn.closest('.source-annotator-buttons');
    const allBtns = parentContainer.querySelectorAll('.annotator-btn');

    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      btn.style.background = 'rgba(0,0,0,0.2)';
      btn.style.borderColor = 'var(--border-glass)';
      btn.style.color = 'var(--text-main)';
      displayBox.style.display = 'none';
      displayBox.innerHTML = '';
      return;
    }

    allBtns.forEach(b => {
      b.classList.remove('active');
      b.style.background = 'rgba(0,0,0,0.2)';
      b.style.borderColor = 'var(--border-glass)';
      b.style.color = 'var(--text-main)';
    });

    btn.classList.add('active');
    btn.style.background = 'var(--primary)';
    btn.style.borderColor = 'var(--primary)';
    btn.style.color = 'var(--text-inverse, #fff)';

    const isDoNow = (sourceLetter === 'doNow');
    const paperClues = isDoNow ? (DO_NOW_CLUES[paperId] || {}) : (SOURCE_CLUES[paperId] || {});
    const sourceClues = isDoNow ? paperClues : (paperClues[sourceLetter.split('-')[0]] || defaultClues[sourceLetter.split('-')[0]] || defaultClues['A']);
    const clueText = sourceClues[type] || "No clue available.";

    displayBox.innerHTML = `<strong>${type === 'C' ? 'Content (C)' : type === 'NOP' ? 'Nature, Origin, Purpose (NOP)' : 'Own Knowledge (OK)'} Clue:</strong> ${clueText}`;
    displayBox.style.display = 'block';
  });

  // Initialize Workbook and Bulk Workbook Creator
  initWorkbookCreator();
  initBulkWorkbookCreator();
}

// --- Real-time Fact / Connective Verification Checklist for Essay Writing ---

function extractKeywordsFromAnswer(htmlAnswer) {
  if (!htmlAnswer) return [];
  // Strip HTML tags
  const cleanText = htmlAnswer.replace(/<[^>]*>/g, ' ');
  
  const candidates = [];
  // Match capitalized sequences (Proper nouns)
  const propReg = /\b[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*\b/g;
  let match;
  while ((match = propReg.exec(cleanText)) !== null) {
    const term = match[0].trim();
    if (term.length > 2 && !candidates.includes(term)) {
      candidates.push(term);
    }
  }
  
  // Match numbers (especially years or quantities)
  const numReg = /\b\d{2,4}\b/g;
  while ((match = numReg.exec(cleanText)) !== null) {
    const term = match[0].trim();
    if (!candidates.includes(term)) {
      candidates.push(term);
    }
  }

  // Common stopwords or noisy words to filter out
  const stopWords = ['One', 'This', 'The', 'Following', 'Point', 'It', 'By', 'In', 'Explain', 'Both', 'To', 'USA', 'US', 'Vietnam', 'American', 'Black', 'White', 'Southern', 'North', 'South', 'Vietcong', 'President', 'Court'];
  
  const filtered = candidates.filter(term => {
    return !stopWords.includes(term);
  });
  
  return filtered.slice(0, 5);
}

function getKeywordsForQuestion(type, questionId, questionObj) {
  let qObj = questionObj;
  if (!qObj && type && typeof type === 'object') {
    qObj = type;
  }
  if (!qObj) return [];

  // If we can resolve the question in EXAM_SKILLS_DATA.q2, prefer its knowledgeWords
  if (qObj.id && typeof EXAM_SKILLS_DATA !== 'undefined' && EXAM_SKILLS_DATA.q2 && EXAM_SKILLS_DATA.q2[qObj.id]) {
    const dbQ = EXAM_SKILLS_DATA.q2[qObj.id];
    if (dbQ.knowledgeWords) return dbQ.knowledgeWords;
  }

  if (qObj.knowledgeWords && Array.isArray(qObj.knowledgeWords)) {
    return qObj.knowledgeWords;
  }
  if (type === 'q2' && qObj.knowledgeWords) {
    return qObj.knowledgeWords;
  }
  if (qObj.keywords && Array.isArray(qObj.keywords)) {
    return qObj.keywords;
  }
  
  const answerText = (type === 'q3a') ? qObj.modela : (type === 'q3d') ? qObj.modeld : (qObj.model || qObj.answer || qObj.modeld || qObj.modelc || qObj.modelb || "");
  return extractKeywordsFromAnswer(answerText);
}

function updateRealTimeFeedback(type, value, questionObj, questionId) {
  const feedbackCard = document.getElementById(`draft-feedback-${type}`);
  if (!feedbackCard) return;

  feedbackCard.style.display = 'flex';

  const text = (value || "").toLowerCase();
  
  // 1. Causal Connectives checklist
  let connectives = ["as a result", "consequently", "this led to", "therefore"];
  if (type === 'q2' && questionObj && questionObj.connectiveWords) {
    connectives = questionObj.connectiveWords;
  }
  const matchedConnectives = [];
  
  const connectiveTagsContainer = document.getElementById(`connective-tags-${type}`);
  if (connectiveTagsContainer) {
    connectiveTagsContainer.innerHTML = "";
    connectives.forEach(conn => {
      const isMatched = text.includes(conn.toLowerCase());
      if (isMatched) matchedConnectives.push(conn);
      
      const tag = document.createElement("span");
      tag.className = `feedback-tag ${isMatched ? "matched" : ""}`;
      tag.innerHTML = isMatched ? `<i class="fa-solid fa-check"></i> ${conn}` : conn;
      connectiveTagsContainer.appendChild(tag);
    });
  }
  
  // 2. Key Terms checklist
  const keywords = getKeywordsForQuestion(type, questionId, questionObj);
  const matchedKeywords = [];
  
  const keywordTagsContainer = document.getElementById(`keyword-tags-${type}`);
  const keywordRow = document.getElementById(`keyword-feedback-row-${type}`);
  
  if (keywords && keywords.length > 0) {
    if (keywordRow) keywordRow.style.display = "block";
    if (keywordTagsContainer) {
      keywordTagsContainer.innerHTML = "";
      keywords.forEach(kw => {
        const isMatched = text.includes(kw.toLowerCase());
        if (isMatched) matchedKeywords.push(kw);
        
        const tag = document.createElement("span");
        tag.className = `feedback-tag ${isMatched ? "matched" : ""}`;
        tag.innerHTML = isMatched ? `<i class="fa-solid fa-check"></i> ${kw}` : kw;
        keywordTagsContainer.appendChild(tag);
      });
    }
  } else {
    if (keywordRow) keywordRow.style.display = "none";
  }
  
  // 3. Compute Progress & Badge Status
  const totalItems = connectives.length + keywords.length;
  const matchedItems = matchedConnectives.length + matchedKeywords.length;
  const pct = totalItems > 0 ? Math.round((matchedItems / totalItems) * 100) : 0;
  
  const fillEl = document.getElementById(`feedback-fill-${type}`);
  if (fillEl) {
    fillEl.style.width = `${pct}%`;
  }
  
  const badgeEl = document.getElementById(`feedback-badge-${type}`);
  if (badgeEl) {
    badgeEl.className = "feedback-badge";
    if (pct === 100) {
      badgeEl.classList.add("status-outstanding");
      badgeEl.textContent = "Structure: Outstanding";
    } else if (pct >= 70) {
      badgeEl.classList.add("status-strong");
      badgeEl.textContent = "Structure: Strong";
    } else if (pct >= 30) {
      badgeEl.classList.add("status-developing");
      badgeEl.textContent = "Structure: Developing";
    } else {
      badgeEl.textContent = "Structure: Drafting";
    }
  }

  // Calculate live causal points for Q2 Essay Practice
  if (type === 'q2') {
    const analyticalWords = ["because", "caused", "influenced", "triggered", "consequence", "reason", "due to", "impacted", "significance", "factor"];
    const matchedAnalytical = [];
    analyticalWords.forEach(w => {
      if (text.includes(w)) matchedAnalytical.push(w);
    });
    const connPoints = Math.min(matchedConnectives.length * 15, 30);
    const kwPoints = Math.min(matchedKeywords.length * 20, 60);
    const analyticalPoints = Math.min(matchedAnalytical.length * 10, 20);
    const totalPoints = Math.min(connPoints + kwPoints + analyticalPoints, 100);

    const scoreBadge = document.getElementById('causal-score-badge-q2');
    if (scoreBadge) {
      scoreBadge.className = "feedback-badge";
      if (totalPoints >= 80) {
        scoreBadge.classList.add("status-outstanding");
      } else if (totalPoints >= 50) {
        scoreBadge.classList.add("status-strong");
      } else if (totalPoints >= 30) {
        scoreBadge.classList.add("status-developing");
      }
      scoreBadge.innerHTML = `<i class="fa-solid fa-fire"></i> Causation Score: ${totalPoints}/100 pts`;
    }

    // Light up chips in the keywords box
    const knowledgeChips = document.querySelectorAll('#q2-knowledge-keywords .feedback-tag');
    knowledgeChips.forEach(chip => {
      const word = chip.dataset.keyword;
      const isMatched = text.includes(word);
      if (isMatched) {
        chip.classList.add('matched');
        chip.innerHTML = `<i class="fa-solid fa-check"></i> ${chip.textContent.replace(/^✓\s*/, '')}`;
      } else {
        chip.classList.remove('matched');
        chip.innerHTML = chip.textContent.replace(/^✓\s*/, '').replace(/.*check.*\s*/, '');
      }
    });

    const connectiveChips = document.querySelectorAll('#q2-connective-keywords .feedback-tag');
    connectiveChips.forEach(chip => {
      const word = chip.dataset.keyword;
      const isMatched = text.includes(word);
      if (isMatched) {
        chip.classList.add('matched');
        chip.innerHTML = `<i class="fa-solid fa-check"></i> ${chip.textContent.replace(/^✓\s*/, '')}`;
      } else {
        chip.classList.remove('matched');
        chip.innerHTML = chip.textContent.replace(/^✓\s*/, '').replace(/.*check.*\s*/, '');
      }
    });
  }
}


export function highlightModelQuotes(text) {
  if (!text) return '';
  // Convert style/class double quotes inside HTML tags to single quotes to prevent breaking them with double quotes regex
  let highlighted = text.replace(/style="([^"]*)"/g, "style='$1'").replace(/class="([^"]*)"/g, "class='$1'");
  
  let i1Text = '';
  let i2Text = '';
  
  if (state && state.pastPaperSession && state.pastPaperSession.activePaperData) {
    i1Text = state.pastPaperSession.activePaperData.interpretation1 || '';
    i2Text = state.pastPaperSession.activePaperData.interpretation2 || '';
  }
  
  const cleanWord = (str) => {
    if (!str) return '';
    let val = str;
    if (typeof str === 'object') {
      val = str.content || str.text || '';
    }
    return String(val).toLowerCase().replace(/[^a-z0-9]/g, '');
  };
  
  // Double quotes
  highlighted = highlighted.replace(/["“]([^"”]{2,})["”]/g, '<span class="model-quote">“$1”</span>');
  
  // Special Interpretation quotes (1 = Interpretation 1, 2 = Interpretation 2)
  highlighted = highlighted.replace(/\[1\[(.*?)\]1\]/g, (match, quote) => {
    const cleanQuote = cleanWord(quote);
    if (!cleanQuote) return `<span class="model-quote-i1">“${quote}”</span>`;
    
    // Check active paper first
    if (i1Text || i2Text) {
      const cleanI1 = cleanWord(i1Text);
      const cleanI2 = cleanWord(i2Text);
      if (cleanI2.includes(cleanQuote) && !cleanI1.includes(cleanQuote)) {
        return `<span class="model-quote-i2">“${quote}”</span>`;
      }
      if (cleanI1.includes(cleanQuote)) {
        return `<span class="model-quote-i1">“${quote}”</span>`;
      }
    }
    
    // Dynamic search fallback in all EXAM_SKILLS_DATA.q3 entries
    if (typeof EXAM_SKILLS_DATA !== 'undefined' && EXAM_SKILLS_DATA.q3) {
      for (const key of Object.keys(EXAM_SKILLS_DATA.q3)) {
        const qData = EXAM_SKILLS_DATA.q3[key];
        const cleanI1 = cleanWord(qData.interpretation1);
        const cleanI2 = cleanWord(qData.interpretation2);
        if (cleanI2.includes(cleanQuote) && !cleanI1.includes(cleanQuote)) {
          return `<span class="model-quote-i2">“${quote}”</span>`;
        }
        if (cleanI1.includes(cleanQuote)) {
          return `<span class="model-quote-i1">“${quote}”</span>`;
        }
      }
    }
    
    return `<span class="model-quote-i1">“${quote}”</span>`;
  });
  
  highlighted = highlighted.replace(/\[2\[(.*?)\]2\]/g, '<span class="model-quote-i2">“$1”</span>');
  
  // Provenance double braces
  highlighted = highlighted.replace(/\{\{(.*?)\}\}/g, '<span class="model-provenance">$1</span>');
  // Contextual knowledge double brackets (processed last to avoid conflicts with class attribute quotes)
  highlighted = highlighted.replace(/\[\[(.*?)\]\]/g, '<span class="contextual-knowledge">$1</span>');
  
  return highlighted;
}

export {
  toggleMobileSidebar,
  closeMobileSidebar,
  updateSoundBtnUI,
  bindEvents,
  extractKeywordsFromAnswer,
  getKeywordsForQuestion,
  updateRealTimeFeedback
};
