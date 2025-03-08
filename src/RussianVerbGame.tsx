import React, { useState, useEffect } from 'react';
import './RussianVerbGame.css';
import verbsData from './assets/verbs.json';
import { Verb, HistoryItem } from './types';


const pronounDisplay: { [key: string]: string } = {
  ya: "я",
  ti: "ты",
  on_ona_ono: "он/она/оно",
  mi: "мы",
  vi: "вы",
  oni: "они",
};

const CORRECT_EMOJI = "✅ ";
const INCORRECT_EMOJI = "❌ ";

const RussianVerbGame: React.FC = () => {
  const [verbs, setVerbs] = useState<Verb[]>([]);
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

  const isMobileDevice = () => {
    return window.innerWidth <= 768;
  };

  const [isMobile, setIsMobile] = useState<boolean>(isMobileDevice());

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(isMobileDevice());
    };

    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    setVerbs(verbsData.verbs);
  }, []);

  const getRandomVerbAndConjugation = () => {
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
  };

  const startGame = () => {
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
  };

  const checkAnswer = (selectedPronoun: string) => {
    const isCorrect = selectedPronoun === correctPronoun;

    if (isCorrect) {
      setCorrectButton(selectedPronoun);
      setScore(score + 1);
      setStreak(streak + 1);

      // More impactful correct feedback with dynamic celebration messages
      const celebrations = [
        "✅ Отлично! (Excellent!)",
        "✅ Правильно! (Correct!)",
        "✅ Молодец! (Well done!)",
        "✅ Превосходно! (Superb!)",
        "✅ Так держать! (Keep it up!)"
      ];
      const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
      setFeedback(randomCelebration);

      // Apply highlight effect to the verb
      if (document.querySelector('.verb-conjugation')) {
        document.querySelector('.verb-conjugation')?.classList.add('highlight');
        document.querySelector('.verb-display')?.classList.add('answer-correct-effect');

        // Remove the effect after animation completes
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

    setTotalAttempts(totalAttempts + 1);

    const newHistoryItem: HistoryItem = {
      verb: `${currentVerb?.infinitive} (${currentVerb?.english})`,
      conjugation: currentConjugation,
      pronoun: selectedPronoun,
      isCorrect,
      correctPronoun: correctPronoun
    };

    setHistory([newHistoryItem, ...history]);

    setTimeout(() => {
      getRandomVerbAndConjugation();
    }, isCorrect ? 1800 : 1500); // Slightly longer delay for correct answers to enjoy the feedback
  };

  useEffect(() => {
    if (gameStarted) {
      getRandomVerbAndConjugation();
    }
  }, [gameStarted]);

  const renderStreakCounter = () => {
    if (streak < 1) return null;

    // Get encouraging message based on streak
    const getStreakMessage = () => {
      if (streak >= 10) return "🔥 отличный!";
      if (streak >= 7) return "✨";
      if (streak >= 5) return "🎯";
      if (streak >= 3) return "👍";
      return "🎮";
    };

    // On mobile, show more compact version
    if (isMobile && streak < 3) {
      return (
        <div className="streak-counter">
          <span className="streak-count">{streak}</span>
        </div>
      );
    }

    return (
      <div className="streak-counter">
        <span className="streak-count">{streak}</span>
        <span className="streak-label">{getStreakMessage()}</span>
      </div>
    );
  };

  return (
    <div className="russian-game-container">
      <header className="game-header">
        <h1>Verbski 📖</h1>
        <p>A russian verb conjugation game</p>
      </header>

      {!gameStarted ? (
        <div className="start-screen">
          <h2>Ready to learn Russian verbs? 📚</h2>
          <p>You'll be shown a conjugated verb form and need to select the matching pronoun.</p>
          <button
            className="start-button"
            onClick={startGame}
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="game-content">
          <div className="main-game-area">
            <div className="game-stats">
              <div className="score">
                <span className="score-label">Score: </span>
                <span className="score-value">{score}</span>
                <span className="score-denominator">/{totalAttempts} </span>
                {totalAttempts > 0 && (
                  <span className="percentage">
                    {Math.round((score / totalAttempts) * 100)}%
                  </span>
                )}
              </div>
              <div className="streak-display">
                {streak >= 1 && renderStreakCounter()}
              </div>
            </div>

            <div className="game-area">
              <div className="verb-display">
                <div className="verb-infinitive">{currentVerb?.infinitive} ({currentVerb?.english})</div>
                <div className="verb-conjugation">{currentConjugation}</div>
                <div className="feedback">
                  {feedback && <div className={`animate-fadeIn ${feedback.includes('✅') ? 'feedback-correct' : ''}`}>{feedback}</div>}
                </div>
              </div>

              <div className="pronoun-options">
                {Object.entries(pronounDisplay).map(([key, display]) => (
                  <button
                    key={key}
                    className={`pronoun-button ${correctButton === key ? 'correct-choice' : ''}`}
                    onClick={() => checkAnswer(key)}
                  >
                    {display}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="history-section">
              <h3>Verb History</h3>
              <div className="history-list">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className={`history-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
                  >
                    <div className="history-top">
                      <span className="history-emoji">
                        {item.isCorrect ? CORRECT_EMOJI : INCORRECT_EMOJI}
                      </span>
                      <span className="history-verb">{item.verb}</span>
                    </div>
                    <div className="history-content">
                      <span className="history-conjugation">{item.conjugation}</span>
                      <div className="history-answer">
                        <span className="history-arrow">→</span>
                        <span className="history-pronoun">{pronounDisplay[item.pronoun]}</span>
                      </div>
                    </div>
                    {!item.isCorrect && (
                      <div className="history-correct-answer">
                        Correct: {pronounDisplay[item.correctPronoun]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RussianVerbGame;