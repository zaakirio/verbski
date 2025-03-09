import { useState, useEffect, useCallback } from 'react';
import { Verb, HistoryItem } from '../types';
import { pronounDisplay, celebrations } from '../utils/constants';

export const useGameLogic = (verbs: Verb[]) => {
  const [currentVerb, setCurrentVerb] = useState<Verb | null>(null);
  const [currentConjugation, setCurrentConjugation] = useState<string>("");
  const [correctPronoun, setCorrectPronoun] = useState<string>("");
  const [score, setScore] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [correctButton, setCorrectButton] = useState<string | null>(null);
  const [isAcceptingInput, setIsAcceptingInput] = useState<boolean>(true);

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
    setFeedback("");
    setIsAcceptingInput(true);
  }, [verbs]);

  const startGame = useCallback(() => {
    if (verbs.length === 0) {
      alert("Error loading verbs data. Please try again later.");
      return;
    }

    setGameStarted(true);
    setScore(0);
    setTotalAttempts(0);
    setHistory([]);
    setStreak(0);
    getRandomVerbAndConjugation();
  }, [currentVerb, currentConjugation, correctPronoun, getRandomVerbAndConjugation]);

  const checkAnswer = useCallback((selectedPronoun: string) => {
    if (!isAcceptingInput) return;
    setIsAcceptingInput(false);
    const isCorrect = selectedPronoun === correctPronoun;

    if (isCorrect) {
      setCorrectButton(selectedPronoun);
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);

      const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
      setFeedback(randomCelebration);

      if (document.querySelector('.verb-conjugation')) {
        document.querySelector('.verb-conjugation')?.classList.add('highlight');
        document.querySelector('.verb-display')?.classList.add('answer-correct-effect');

        setTimeout(() => {
          document.querySelector('.verb-conjugation')?.classList.remove('highlight');
          document.querySelector('.verb-display')?.classList.remove('answer-correct-effect');
          setCorrectButton(null);
        }, 1000);
      }
    } else {
      setFeedback(`❌ Incorrect. The correct answer is ${pronounDisplay[correctPronoun]}`);
      setStreak(0);
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

    setTimeout(() => {
      getRandomVerbAndConjugation();
    }, isCorrect ? 1800 : 1500); // Slightly longer delay for correct answers
  }, [currentVerb, currentConjugation, correctPronoun, getRandomVerbAndConjugation, isAcceptingInput]);
  useEffect(() => {
    if (gameStarted) {
      getRandomVerbAndConjugation();
    }
  }, [gameStarted, getRandomVerbAndConjugation]);

  return {
    currentVerb,
    currentConjugation,
    correctPronoun,
    score,
    totalAttempts,
    feedback,
    history,
    gameStarted,
    streak,
    correctButton,
    startGame,
    checkAnswer,
    isAcceptingInput
  };
};