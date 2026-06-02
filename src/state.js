/*
   Edexcel GCSE History Paper 3 The USA, 1954-75: Conflict at Home and Abroad - Application Controller
   Handles SPA routing, progress syncing, audio synthesis, exam timing, 
   flashcard sessions, global search, and timeline assembly.
*/

// --- Global Application State ---
export const state = {
  currentView: 'dashboard',         // 'dashboard' | 'classic' | 'flashcards' | 'exam' | 'timeline' | 'bookmarks'
  selectedSubtopicId: null,         // Active sub-topic ID (e.g. 'subtopic_1_1')
  currentMode: 'lessons',           // 'lessons' | 'classic' | 'flashcards' (sub-topic study modes)
  mastery: {},                      // { questionId: boolean }
  bookmarks: [],                     // Array of questionIds
  soundEnabled: true,
  theme: 'desert',
  deepThinkingAnswers: {},          // { questionId: string }
  howUsefulAnswers: {},             // { subtopicId: string }
  specObjectives: {},               // { objectiveId: boolean }
  
  // Flashcard Session State
  flashcardSession: {
    deck: [],
    activeIndex: 0,
    originalLength: 0,
    masteredCount: 0
  },
  
  // Quiz Generator State
  examSession: {
    isActive: false,
    questions: [],
    activeIndex: 0,
    answers: {},                     // { questionId: string (written answer) }
    grades: {},                      // { questionId: boolean (self-graded correct) }
    startTime: null,
    timerInterval: null,
    timeRemaining: 0,
    timeLimit: 0,
    timeElapsed: 0,
    scope: 'all',
    length: 15
  },
  
  // Cache flattened questions list for quick access
  allQuestions: [],

  // Past Exam Session State
  pastPaperSession: {
    activePaperId: null,
    activePaperData: null,
    answers: {},                     // { questionId: string }
    completedQuestions: []           // Array of questionIds
  }
};