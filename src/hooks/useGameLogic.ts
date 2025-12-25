import { useState, useEffect, useCallback } from 'react';
import { Verb, HistoryItem } from '../types';

const DAILY_GOAL = 5;
const MAX_LIVES = 3;
const STORAGE_KEY = 'verbski-daily-progress';

interface DailyProgress {
  date: string;
  correct: number;
}

const getTodayDateString = (): string => {
  return new Date().toISOString().split('T')[0];
};

const loadDailyProgress = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress: DailyProgress = JSON.parse(stored);
      if (progress.date === getTodayDateString()) {
        return progress.correct;
      }
    }
  } catch {
    // Ignore localStorage errors
  }
  return 0;
};

const saveDailyProgress = (correct: number): void => {
  try {
    const progress: DailyProgress = {
      date: getTodayDateString(),
      correct,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore localStorage errors
  }
};

export const useGameLogic = (verbs: Verb[]) => {
  const [currentVerb, setCurrentVerb] = useState<Verb | null>(null);
  const [currentConjugation, setCurrentConjugation] = useState<string>("");
  const [correctPronoun, setCorrectPronoun] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [correctButton, setCorrectButton] = useState<string | null>(null);
  const [wrongButton, setWrongButton] = useState<string | null>(null);
  const [isAcceptingInput, setIsAcceptingInput] = useState<boolean>(true);
  const [showFeedbackOverlay, setShowFeedbackOverlay] = useState<boolean>(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean>(false);

  // New state for lives and daily progress
  const [lives, setLives] = useState<number>(MAX_LIVES);
  const [dailyProgress, setDailyProgress] = useState<number>(() => loadDailyProgress());

  const getRandomVerbAndConjugation = useCallback(() => {
    if (verbs.length === 0) return;

    const randomVerbIndex = Math.floor(Math.random() * verbs.length);
    const verb = verbs[randomVerbIndex];

    const pronouns = Object.keys(verb.conjugations) as Array<keyof typeof verb.conjugations>;
    const randomPronounIndex = Math.floor(Math.random() * pronouns.length);
    const pronoun = pronouns[randomPronounIndex];

    setCurrentVerb(verb);
    setCurrentConjugation(verb.conjugations[pronoun]);
    setCorrectPronoun(pronoun);
    setCorrectButton(null);
    setWrongButton(null);
    setIsAcceptingInput(true);
    setShowFeedbackOverlay(false);
  }, [verbs]);

  const resetGame = useCallback(() => {
    setLives(MAX_LIVES);
    setScore(0);
    setTotalAttempts(0);
    setHistory([]);
    setStreak(0);
    setShowFeedbackOverlay(false);
    getRandomVerbAndConjugation();
  }, [getRandomVerbAndConjugation]);

  // Auto-start the game when verbs are loaded
  useEffect(() => {
    if (verbs.length > 0 && !gameStarted) {
      setGameStarted(true);
      getRandomVerbAndConjugation();
    }
  }, [verbs.length, gameStarted, getRandomVerbAndConjugation]);

  const nextVerb = useCallback(() => {
    getRandomVerbAndConjugation();
  }, [getRandomVerbAndConjugation]);

  const checkAnswer = useCallback((selectedPronoun: string) => {
    if (!isAcceptingInput) return;
    setIsAcceptingInput(false);
    const isCorrect = selectedPronoun === correctPronoun;
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      setCorrectButton(selectedPronoun);
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);

      // Update daily progress
      setDailyProgress(prev => {
        const newProgress = prev + 1;
        saveDailyProgress(newProgress);
        return newProgress;
      });
    } else {
      setWrongButton(selectedPronoun);
      setCorrectButton(correctPronoun); // Highlight the correct answer too
      setStreak(0);

      // Decrement lives
      setLives(prev => Math.max(0, prev - 1));
    }

    setTotalAttempts(prev => prev + 1);

    const newHistoryItem: HistoryItem = {
      verb: `${currentVerb?.infinitive} (${currentVerb?.english})`,
      conjugation: currentConjugation,
      pronoun: selectedPronoun,
      isCorrect,
      correctPronoun: correctPronoun
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    // Show feedback overlay after a short delay
    setTimeout(() => {
      setShowFeedbackOverlay(true);
    }, 400);
  }, [currentVerb, currentConjugation, correctPronoun, isAcceptingInput]);

  return {
    currentVerb,
    currentConjugation,
    correctPronoun,
    score,
    totalAttempts,
    history,
    gameStarted,
    streak,
    correctButton,
    wrongButton,
    checkAnswer,
    isAcceptingInput,
    showFeedbackOverlay,
    lastAnswerCorrect,
    nextVerb,
    // Lives and daily progress
    lives,
    dailyProgress,
    dailyGoal: DAILY_GOAL,
    maxLives: MAX_LIVES,
    resetGame,
  };
};
