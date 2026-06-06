import { state } from './state.js';
import { AudioEngine } from './audio.js';
import { Confetti } from './confetti.js';
import { switchView } from './navigation.js';
import { initExamLeaderboard, addXp } from './views.js';


// --- Quiz Generator Engine ---
function showExamSetup() {
  document.getElementById('exam-setup-panel').style.display = 'flex';
  document.getElementById('exam-runner-panel').style.display = 'none';
  document.getElementById('exam-results-panel').style.display = 'none';
  state.examSession.isActive = false;
  
  if (state.examSession.timerInterval) {
    clearInterval(state.examSession.timerInterval);
  }
}

function startExam(scope, length, timeLimit) {
  state.examSession.isActive = true;
  state.examSession.scope = scope;
  state.examSession.length = parseInt(length);
  state.examSession.timeLimit = parseInt(timeLimit);
  state.examSession.timeRemaining = parseInt(timeLimit);
  state.examSession.timeElapsed = 0;
  state.examSession.activeIndex = 0;
  state.examSession.answers = {};
  state.examSession.grades = {};
  state.examSession.startTime = Date.now();

  // Filter pool of questions based on chosen Scope and Mode
  const analyticalToggle = document.getElementById('exam-mode-analytical');
  const isAnalytical = analyticalToggle ? analyticalToggle.checked : false;
  let pool = isAnalytical ? [...state.analyticalQuestions] : [...state.allQuestions];
  
  if (scope !== 'all') {
    if (scope.startsWith('subtopic_')) {
      pool = pool.filter(q => q.subtopicId === scope);
    } else {
      pool = pool.filter(q => q.topicId === scope);
    }
  }

  // Cap requested length to the size of the question pool
  if (state.examSession.length > pool.length) {
    state.examSession.length = pool.length;
  }

  // Shuffle pool before slicing
  const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
  const selection = shuffledPool.slice(0, state.examSession.length);

  // Optional: Chronological sort or randomized shuffle
  const sortOrder = document.getElementById('exam-order-select').value;
  if (sortOrder === 'chronological') {
    selection.sort((a, b) => a.year - b.year);
  } else {
    selection.sort(() => Math.random() - 0.5);
  }

  state.examSession.questions = selection;

  // Set up panels
  document.getElementById('exam-setup-panel').style.display = 'none';
  document.getElementById('exam-runner-panel').style.display = 'flex';
  
  // Timer Setup
  if (state.examSession.timerInterval) {
    clearInterval(state.examSession.timerInterval);
  }
  
  updateExamTimerDisplay();
  
  state.examSession.timerInterval = setInterval(() => {
    if (state.examSession.timeLimit > 0) {
      state.examSession.timeRemaining--;
      updateExamTimerDisplay();
      if (state.examSession.timeRemaining <= 0) {
        clearInterval(state.examSession.timerInterval);
        AudioEngine.play('fail');
        alert("Time is up! Submitting your recall test.");
        finishExam();
      }
    } else {
      state.examSession.timeElapsed = Math.floor((Date.now() - state.examSession.startTime) / 1000);
      updateExamTimerDisplay(true);
    }
  }, 1000);

  displayExamQuestion();
}

function updateExamTimerDisplay(incrementing = false) {
  const display = document.getElementById('exam-timer-text');
  
  if (incrementing) {
    const elapsed = state.examSession.timeElapsed;
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    display.textContent = `${mins}:${secs}`;
    display.style.color = 'var(--text-main)';
  } else {
    const remaining = state.examSession.timeRemaining;
    const mins = Math.floor(remaining / 60).toString().padStart(2, '0');
    const secs = (remaining % 60).toString().padStart(2, '0');
    display.textContent = `${mins}:${secs}`;
    
    // Alert color change if less than 1 minute
    if (remaining < 60) {
      display.style.color = 'var(--accent)';
    } else {
      display.style.color = 'var(--secondary)';
    }
  }
}

function generateSmartDistractors(correctText, pool, questionText) {
  const correct = correctText.trim();
  const lowerCorrect = correct.toLowerCase();

  // Helper to check if string is Title Case
  function isTitleCase(str) {
    const words = str.split(/\s+/);
    if (words.length === 0 || str === "") return false;
    const lowerConjs = ["of", "the", "in", "and", "to", "for", "a", "an", "but", "or", "by", "from", "on", "with", "at", "de", "von"];
    return words.every((word, idx) => {
      if (word === "") return true;
      const firstChar = word[0];
      if (idx === 0) {
        return firstChar === firstChar.toUpperCase() && /[a-zA-Z]/.test(firstChar);
      }
      if (lowerConjs.includes(word.toLowerCase())) return true;
      return firstChar === firstChar.toUpperCase() && /[a-zA-Z]/.test(firstChar);
    });
  }

  // Helper to count words
  function getWordCount(str) {
    return str.trim().split(/\s+/).filter(w => w.length > 0).length;
  }

  // 1. Year Match (4 digits)
  const yearRegex = /^\d{4}$/;
  if (yearRegex.test(correct)) {
    const yearVal = parseInt(correct, 10);
    let poolYears = pool
      .filter(ans => yearRegex.test(ans))
      .map(ans => parseInt(ans, 10))
      .filter(y => y !== yearVal);
    poolYears = Array.from(new Set(poolYears));
    if (poolYears.length >= 3) {
      poolYears.sort((a, b) => Math.abs(a - yearVal) - Math.abs(b - yearVal));
      const topClosest = poolYears.slice(0, 8);
      const chosen = topClosest.sort(() => Math.random() - 0.5).slice(0, 3);
      return chosen.map(y => String(y));
    } else {
      const generated = new Set();
      const offsets = [-1, 1, -2, 2, -3, 3, -4, 4, -5, 5, -10, 10, -15, 15];
      const shuffledOffsets = offsets.sort(() => Math.random() - 0.5);
      for (let offset of shuffledOffsets) {
        const generatedYear = yearVal + offset;
        if (generatedYear !== yearVal && generatedYear > 0) {
          generated.add(String(generatedYear));
          if (generated.size === 3) break;
        }
      }
      while (generated.size < 3) {
        generated.add(String(yearVal + Math.floor(Math.random() * 20) - 10));
      }
      return Array.from(generated);
    }
  }

  // 2. Percentage Match (e.g. 58%)
  const pctRegex = /^(\d+(?:\.\d+)?)\s*%$/;
  if (pctRegex.test(correct)) {
    const match = correct.match(pctRegex);
    const val = parseFloat(match[1]);
    let poolPcts = pool
      .filter(ans => pctRegex.test(ans))
      .map(ans => {
        const m = ans.match(pctRegex);
        return { original: ans, value: parseFloat(m[1]) };
      })
      .filter(item => item.value !== val);
    
    const seenVals = new Set();
    const uniquePoolPcts = [];
    for (let item of poolPcts) {
      if (!seenVals.has(item.value)) {
        seenVals.add(item.value);
        uniquePoolPcts.push(item);
      }
    }

    if (uniquePoolPcts.length >= 3) {
      uniquePoolPcts.sort((a, b) => Math.abs(a.value - val) - Math.abs(b.value - val));
      const topClosest = uniquePoolPcts.slice(0, 8);
      const chosen = topClosest.sort(() => Math.random() - 0.5).slice(0, 3);
      return chosen.map(item => item.original);
    } else {
      const generated = new Set();
      const isInteger = !correct.includes('.');
      const hasSpace = correct.includes(' ');
      const pctChar = hasSpace ? ' %' : '%';
      
      const offsets = [-5, 5, -10, 10, -15, 15, -20, 20, -25, 25, -30, 30];
      const shuffledOffsets = offsets.sort(() => Math.random() - 0.5);
      for (let offset of shuffledOffsets) {
        let generatedVal = val + offset;
        if (generatedVal > 0 && generatedVal <= 100 && generatedVal !== val) {
          const formatted = isInteger ? Math.round(generatedVal) : generatedVal.toFixed(1);
          generated.add(formatted + pctChar);
          if (generated.size === 3) break;
        }
      }
      while (generated.size < 3) {
        let generatedVal = Math.max(1, Math.min(100, Math.round(val + Math.random() * 30 - 15)));
        if (generatedVal !== val) {
          generated.add(generatedVal + pctChar);
        }
      }
      return Array.from(generated);
    }
  }

  // 3. Simple digits / numeric with optional comma / currency symbol (e.g. 58,000)
  const numberRegex = /^[£$]?\d{1,3}(?:,\d{3})+(?:\s*[a-zA-Z]+)?$/;
  const rawDigitsRegex = /^\d+$/;
  
  function cleanNumber(str) {
    const match = str.replace(/[£$,]/g, '').match(/\d+(?:\.\d+)?/);
    return match ? parseFloat(match[0]) : null;
  }

  const isRawDigits = rawDigitsRegex.test(correct);
  const isFormattedNumber = numberRegex.test(correct);

  if (isRawDigits || isFormattedNumber) {
    const val = cleanNumber(correct);
    if (val !== null && val !== 0) {
      let poolNums = pool
        .filter(ans => {
          const v = cleanNumber(ans);
          return v !== null && v !== val && (rawDigitsRegex.test(ans) || numberRegex.test(ans));
        })
        .map(ans => ({ original: ans, value: cleanNumber(ans) }));
      
      const seenVals = new Set();
      const uniquePoolNums = [];
      for (let item of poolNums) {
        if (!seenVals.has(item.value)) {
          seenVals.add(item.value);
          uniquePoolNums.push(item);
        }
      }

      if (uniquePoolNums.length >= 3) {
        uniquePoolNums.sort((a, b) => Math.abs(a.value - val) - Math.abs(b.value - val));
        const topClosest = uniquePoolNums.slice(0, 8);
        const chosen = topClosest.sort(() => Math.random() - 0.5).slice(0, 3);
        return chosen.map(item => item.original);
      } else {
        const generated = new Set();
        const hasComma = correct.includes(',');
        const prefix = correct.startsWith('$') ? '$' : (correct.startsWith('£') ? '£' : '');
        const suffixMatch = correct.match(/\s*[a-zA-Z]+$/);
        const suffix = suffixMatch ? suffixMatch[0] : '';
        
        const multipliers = [0.5, 0.8, 1.2, 1.5, 0.7, 1.3, 0.9, 1.1, 2];
        const shuffledMults = multipliers.sort(() => Math.random() - 0.5);
        for (let mult of shuffledMults) {
          let genVal = Math.round(val * mult);
          if (genVal === val || genVal <= 0) continue;
          
          let formatted = String(genVal);
          if (hasComma) {
            formatted = genVal.toLocaleString('en-US');
          }
          generated.add(prefix + formatted + suffix);
          if (generated.size === 3) break;
        }
        while (generated.size < 3) {
          let genVal = Math.round(val * (0.5 + Math.random()));
          if (genVal !== val && genVal > 0) {
            let formatted = String(genVal);
            if (hasComma) {
              formatted = genVal.toLocaleString('en-US');
            }
            generated.add(prefix + formatted + suffix);
          }
        }
        return Array.from(generated);
      }
    }
  }

  // 4. Month-Year Date
  const monthYearRegex = /^(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}$/i;
  if (monthYearRegex.test(correct)) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let poolDates = pool.filter(ans => monthYearRegex.test(ans) && ans.toLowerCase() !== lowerCorrect);
    poolDates = Array.from(new Set(poolDates));
    if (poolDates.length >= 3) {
      const shuffled = poolDates.sort(() => Math.random() - 0.5);
      return shuffled.slice(0, 3);
    } else {
      const parts = correct.split(/\s+/);
      const yearPart = parseInt(parts[1], 10);
      const generated = new Set();
      
      const offsets = [-1, 1, -2, 2, 0];
      const shuffledOffsets = offsets.sort(() => Math.random() - 0.5);
      for (let offset of shuffledOffsets) {
        const randomMonth = months[Math.floor(Math.random() * months.length)];
        const genYear = yearPart + offset;
        const formatted = randomMonth + " " + genYear;
        if (formatted.toLowerCase() !== lowerCorrect) {
          generated.add(formatted);
          if (generated.size === 3) break;
        }
      }
      while (generated.size < 3) {
        const randomMonth = months[Math.floor(Math.random() * months.length)];
        const genYear = yearPart + Math.floor(Math.random() * 5) - 2;
        const formatted = randomMonth + " " + genYear;
        if (formatted.toLowerCase() !== lowerCorrect) {
          generated.add(formatted);
        }
      }
      return Array.from(generated);
    }
  }

  // 5. Acronym Match (2 to 6 capital letters / digits)
  const acronymRegex = /^[A-Z0-9]{2,6}$/;
  if (acronymRegex.test(correct)) {
    let poolAcronyms = pool.filter(ans => acronymRegex.test(ans) && ans !== correct);
    poolAcronyms = Array.from(new Set(poolAcronyms));
    if (poolAcronyms.length >= 3) {
      return poolAcronyms.sort(() => Math.random() - 0.5).slice(0, 3);
    }
  }

  // 6. Proper Nouns / Title Case vs Lowercase / Scoring system
  const isCorrectTitleCase = isTitleCase(correct);
  const correctWordCount = getWordCount(correct);
  const uniquePool = Array.from(new Set(pool.filter(ans => ans.toLowerCase() !== lowerCorrect)));
  
  const scoredPool = uniquePool.map(ans => {
    let score = 0;
    const wordCount = getWordCount(ans);
    const isAnsTitleCase = isTitleCase(ans);
    
    if (isCorrectTitleCase === isAnsTitleCase) {
      score += 8;
    }
    if (correctWordCount === wordCount) {
      score += 10;
    } else if (Math.abs(correctWordCount - wordCount) === 1) {
      score += 5;
    }
    const lenDiff = Math.abs(correct.length - ans.length);
    if (lenDiff <= 5) {
      score += 4;
    } else if (lenDiff <= 10) {
      score += 2;
    }

    const personKeywords = ["who", "president", "leader", "general", "secretary", "advisor", "minister", "commander", "governor"];
    const qTextLower = (questionText || "").toLowerCase();
    const hasPersonKeyword = personKeywords.some(kw => qTextLower.includes(kw));
    
    if (hasPersonKeyword && isCorrectTitleCase && isAnsTitleCase) {
      if (wordCount === 2 || wordCount === 3) {
        score += 5;
      }
    }
    return { original: ans, score: score };
  });

  scoredPool.sort((a, b) => b.score - a.score);
  const maxScore = scoredPool.length > 0 ? scoredPool[0].score : 0;
  const highQualityCandidates = scoredPool.filter(item => item.score >= Math.max(maxScore - 6, 0));
  
  if (highQualityCandidates.length >= 3) {
    const chosen = highQualityCandidates.sort(() => Math.random() - 0.5).slice(0, 3);
    return chosen.map(item => item.original);
  } else {
    const top3 = scoredPool.slice(0, 3);
    if (top3.length === 3) {
      return top3.map(item => item.original);
    } else {
      const distractors = [];
      const shuffledUnique = uniquePool.sort(() => Math.random() - 0.5);
      for (let ans of shuffledUnique) {
        distractors.push(ans);
        if (distractors.length === 3) break;
      }
      let idx = 1;
      while (distractors.length < 3) {
        distractors.push("Alternative Option " + idx++);
      }
      return distractors;
    }
  }
}

function getMultipleChoiceOptions(q) {
  const correct = q.answer.trim();
  
  if (q.distractors && Array.isArray(q.distractors) && q.distractors.length === 3) {
    const options = [correct, ...q.distractors.map(d => d.trim())].sort(() => Math.random() - 0.5);
    return options;
  }
  
  const pool = state.allQuestions
    .map(other => other.answer.trim())
    .filter(ans => ans.toLowerCase() !== correct.toLowerCase() && ans.length > 0);
  
  const distractors = generateSmartDistractors(correct, pool, q.question);
  const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
  return options;
}

function displayExamQuestion() {
  const index = state.examSession.activeIndex;
  const questions = state.examSession.questions;
  const q = questions[index];
  
  document.getElementById('exam-progress-text').textContent = `Question ${index + 1} of ${questions.length}`;
  
  // Update Accuracy during exam based on progress
  const gradesMap = Object.values(state.examSession.grades);
  const correctCount = gradesMap.filter(g => g === true).length;
  const gradedQuestionsCount = gradesMap.length;
  const scoreRatio = gradedQuestionsCount > 0 ? (correctCount / gradedQuestionsCount) : 1; // Start high
  
  document.getElementById('exam-current-mastery').textContent = Math.round(scoreRatio * 100) + "% Security";
  
  // Question Card elements
  const badge = document.getElementById('exam-q-badge');
  if (badge) {
    badge.style.display = 'none';
  }
  
  document.getElementById('exam-q-text').textContent = q.question;
  
  // Toggle states
  document.getElementById('exam-input-section').style.display = 'flex';
  document.getElementById('exam-review-section').style.display = 'none';
  
  // Generate MCQ Options
  const options = getMultipleChoiceOptions(q);
  const container = document.getElementById('exam-mcq-options-container');
  container.innerHTML = '';
  
  const letters = ['A', 'B', 'C', 'D'];
  options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'mcq-option-btn';
    btn.innerHTML = `<span class="mcq-option-prefix">${letters[i]}</span> <span>${opt}</span>`;
    btn.addEventListener('click', () => {
      selectMCQOption(opt);
    });
    container.appendChild(btn);
  });
}

function selectMCQOption(optionText) {
  const index = state.examSession.activeIndex;
  const questions = state.examSession.questions;
  const q = questions[index];
  
  const isCorrect = (optionText === q.answer.trim());
  state.examSession.answers[q.id] = optionText;
  state.examSession.grades[q.id] = isCorrect;
  
  // Play sound
  AudioEngine.play(isCorrect ? 'success' : 'fail');
  
  // Set review contents
  document.getElementById('exam-correct-term').textContent = q.answer;
  document.getElementById('exam-correct-exp').textContent = q.explanation;
  
  const reviewAnswer = document.getElementById('exam-review-user-answer');
  if (reviewAnswer) {
    reviewAnswer.textContent = optionText;
    reviewAnswer.style.color = isCorrect ? 'var(--success)' : 'var(--accent)';
  }
  
  // Update result banner
  const banner = document.getElementById('exam-result-banner');
  if (banner) {
    if (isCorrect) {
      banner.className = 'exam-result-banner correct';
      banner.innerHTML = '<i class="fa-solid fa-circle-check"></i> Correct Choice! (+1 Point)';
    } else {
      banner.className = 'exam-result-banner incorrect';
      banner.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> Incorrect Choice!';
    }
  }
  
  // Toggle displays
  document.getElementById('exam-input-section').style.display = 'none';
  document.getElementById('exam-review-section').style.display = 'flex';
}

function nextExamQuestion() {
  const questions = state.examSession.questions;
  state.examSession.activeIndex++;
  
  if (state.examSession.activeIndex >= questions.length) {
    finishExam();
  } else {
    displayExamQuestion();
  }
}

function finishExam() {
  clearInterval(state.examSession.timerInterval);
  state.examSession.isActive = false;
  
  const questions = state.examSession.questions;
  const grades = state.examSession.grades;
  
  let score = 0;
  questions.forEach(q => {
    if (grades[q.id] === true) score++;
  });
  
  const pct = Math.round((score / questions.length) * 100);
  const universalGrade = getUniversalGrade(pct);
  
  // Time Taken
  let timeStr = "N/A";
  if (state.examSession.timeLimit > 0) {
    const elapsed = state.examSession.timeLimit - state.examSession.timeRemaining;
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    timeStr = `${mins}:${secs}`;
  } else {
    const elapsed = state.examSession.timeElapsed;
    const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
    const secs = (elapsed % 60).toString().padStart(2, '0');
    timeStr = `${mins}:${secs}`;
  }
  
  // Render results
  const gradeEl = document.getElementById('results-grade');
  gradeEl.textContent = universalGrade;
  gradeEl.classList.remove('long-text', 'medium-text');
  if (universalGrade.length > 7) {
    gradeEl.classList.add('long-text');
  } else if (universalGrade.length > 3) {
    gradeEl.classList.add('medium-text');
  }

  document.getElementById('results-score').textContent = `${score} / ${questions.length}`;
  document.getElementById('results-percent').textContent = `${pct}%`;
  document.getElementById('results-questions-count').textContent = questions.length;
  document.getElementById('results-time').textContent = timeStr;
  
  state.examSession.score = score;
  state.examSession.pct = pct;

  // Grade Feedback
  const feedbackEl = document.getElementById('results-feedback-text');
  if (pct >= 85) {
    feedbackEl.innerHTML = `<strong>Rank: ${universalGrade}</strong><br><br>Superb historical recall! You demonstrated excellent command of key terms and deep analysis. Keep this standard up!`;
    AudioEngine.play('cheer');
    Confetti.spawn(120);
  } else if (pct >= 70) {
    feedbackEl.innerHTML = `<strong>Rank: ${universalGrade}</strong><br><br>Strong performance. You recalled most key events, but reviewing the details-explanations will push your grades higher to reach Master!`;
    AudioEngine.play('cheer');
    Confetti.spawn(50);
  } else if (pct >= 50) {
    feedbackEl.innerHTML = `<strong>Rank: ${universalGrade}</strong><br><br>Good progress! Spend more time in Flashcards Study mode to build active recall on key years and organizations to reach Expert.`;
  } else {
    feedbackEl.innerHTML = `<strong>Rank: ${universalGrade}</strong><br><br>Focus required. Revise the timeline and study standard recall definitions to reach Scholar level!`;
  }
  
  // Build scorecard list
  const breakdownList = document.getElementById('exam-results-breakdown-list');
  breakdownList.innerHTML = '';
  
  questions.forEach((q, idx) => {
    const correct = grades[q.id] === true;
    const item = document.createElement('div');
    item.className = 'topic-list-card';
    item.style.cursor = 'default';
    item.style.borderColor = correct ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)';
    
    item.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
        <span style="font-weight: 600; font-size: 0.85rem;">Q${idx + 1}: ${q.question}</span>
        <span style="font-size: 1rem; color: ${correct ? 'var(--success)' : 'var(--accent)'};">
          <i class="fa-solid ${correct ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
        </span>
      </div>
      <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 4px;">
        <div><strong>Your Answer:</strong> <span style="font-style: italic;">${state.examSession.answers[q.id]}</span></div>
        <div style="margin-top: 2px;"><strong>Correct Term:</strong> <span style="color: var(--success); font-weight: 600;">${q.answer}</span></div>
      </div>
    `;
    breakdownList.appendChild(item);
  });
  
  // Initialize points-based leaderboard
  initExamLeaderboard(state.examSession.scope || 'all', pct);
  addXp(25);

  document.getElementById('exam-runner-panel').style.display = 'none';
  document.getElementById('exam-results-panel').style.display = 'flex';
}

function getLetterGrade(percentage) {
  if (percentage >= 90) return 'A*';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  if (percentage >= 40) return 'E';
  return 'U';
}

function getGcseLevel(percentage) {
  if (percentage >= 90) return 'Grade 9';
  if (percentage >= 80) return 'Grade 8';
  if (percentage >= 70) return 'Grade 7';
  if (percentage >= 60) return 'Grade 6';
  if (percentage >= 50) return 'Grade 5';
  if (percentage >= 40) return 'Grade 4';
  return 'Below Grade 4';
}

function getUniversalGrade(percentage) {
  if (percentage >= 85) return 'Master';
  if (percentage >= 70) return 'Expert';
  if (percentage >= 50) return 'Scholar';
  return 'Apprentice';
}

export {
  showExamSetup,
  startExam,
  updateExamTimerDisplay,
  getMultipleChoiceOptions,
  displayExamQuestion,
  selectMCQOption,
  nextExamQuestion,
  finishExam,
  getLetterGrade,
  getGcseLevel,
  getUniversalGrade
};
