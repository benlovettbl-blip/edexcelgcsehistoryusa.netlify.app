import { state } from './state.js';
import { AudioEngine } from './audio.js';
import { switchView, switchSubtopicMode } from './navigation.js';
import { 
  flipFlashcard, 
  handleFlashcardGrade, 
  renderTimelineView, 
  renderClassicView, 
  evaluateStudentAnswer, 
  renderSidebarNav, 
  updateGlobalStats,
  setActiveClassicFilter
} from './views.js';
import { startExam, nextExamQuestion, displayExamQuestion, finishExam } from './exam.js';
import { saveProgress } from './storage.js';
import { startPastPaper, generateMockExam } from './past_papers.js';
import { EXAM_SKILLS_DATA } from '../questions.js';

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
  if (state.soundEnabled) {
    btn.innerHTML = `<i class="fa-solid fa-volume-high"></i> Sound Effects: On`;
  } else {
    btn.innerHTML = `<i class="fa-solid fa-volume-xmark"></i> Sound Effects: Off`;
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
    presetsGroup.label = 'Official Edexcel Past Papers / Presets';
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

// --- Bind Event Listeners ---
function bindEvents() {
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
  
  document.getElementById('nav-bookmarks').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('bookmarks');
  });
  
  document.getElementById('nav-timeline').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('timeline');
  });
  
  document.getElementById('nav-exam-sim').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('exam');
  });
  
  document.getElementById('nav-games').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('games');
  });

  // Dashboard Shortcuts
  document.getElementById('shortcut-timeline').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('timeline');
  });

  document.getElementById('shortcut-exam-sim').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('exam');
  });

  document.getElementById('shortcut-exam-skills').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('exam-skills');
  });

  document.getElementById('shortcut-games').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('games');
  });

  // Mobile Menu Toggle
  document.getElementById('menu-toggle').addEventListener('click', toggleMobileSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', closeMobileSidebar);

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

  // Flashcards study actions
  document.getElementById('flashcard-stage').addEventListener('click', flipFlashcard);
  document.getElementById('btn-flashcard-reveal').addEventListener('click', (e) => {
    e.stopPropagation();
    flipFlashcard();
  });
  
  document.getElementById('btn-flashcard-incorrect').addEventListener('click', (e) => {
    e.stopPropagation();
    handleFlashcardGrade(false);
  });
  
  document.getElementById('btn-flashcard-correct').addEventListener('click', (e) => {
    e.stopPropagation();
    handleFlashcardGrade(true);
  });

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


  // Quiz generator controls
  document.getElementById('btn-quick-exam-start').addEventListener('click', () => {
    AudioEngine.play('click');
    const scope = document.getElementById('quick-exam-scope').value;
    const len = document.getElementById('quick-exam-count').value;
    switchView('exam');
    startExam(scope, len, 600); // Defaults to 10 minutes (600s)
  });

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
  document.getElementById('sound-toggle-btn').addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('edexcel_sound', JSON.stringify(state.soundEnabled));
    updateSoundBtnUI();
    AudioEngine.play('click');
  });

  document.getElementById('theme-selector').addEventListener('change', (e) => {
    const nextTheme = e.target.value;
    state.theme = nextTheme;
    localStorage.setItem('edexcel_theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    AudioEngine.play('click');
  });

  document.getElementById('reset-progress-btn').addEventListener('click', () => {
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
  });



  // Exam Practice Nav Click
  document.getElementById('nav-exam-skills').addEventListener('click', () => {
    AudioEngine.play('click');
    switchView('exam-skills');
  });

  // Past Papers Nav Click
  const navPastPapers = document.getElementById('nav-past-papers');
  if (navPastPapers) {
    navPastPapers.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('past-papers');
    });
  }

  // Past Papers Shortcut Click
  const shortcutPastPapers = document.getElementById('shortcut-past-papers');
  if (shortcutPastPapers) {
    shortcutPastPapers.addEventListener('click', () => {
      AudioEngine.play('click');
      switchView('past-papers');
    });
  }

  // Tab Switcher
  document.querySelectorAll('.exam-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      AudioEngine.play('click');
      const targetPanel = btn.getAttribute('data-panel');
      
      document.querySelectorAll('.exam-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      document.querySelectorAll('.exam-panel-content').forEach(panel => {
        panel.style.display = 'none';
      });
      document.getElementById(`panel-${targetPanel}`).style.display = 'block';
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
      if (q1Img) {
        if (data.sourceA.image) {
          q1Img.src = data.sourceA.image;
          q1Img.style.display = 'block';
        } else {
          q1Img.style.display = 'none';
          q1Img.src = '';
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
  let highlighted = text;
  
  let i1Text = '';
  let i2Text = '';
  
  if (state && state.pastPaperSession && state.pastPaperSession.activePaperData) {
    i1Text = state.pastPaperSession.activePaperData.interpretation1 || '';
    i2Text = state.pastPaperSession.activePaperData.interpretation2 || '';
  }
  
  const cleanWord = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  
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
