import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import verbsData from '../assets/verbs.json';
import { useGameLogic } from '../hooks/useGameLogic';
import { useKeyboardNavigation } from '../hooks/useKeyboardNav';
import { GameHeader } from './GameHeader';
import { GameStats } from './GameStats';
import { HistorySection } from './HistorySection';
import { PronounOptions } from './PronounOptions';
import { StartScreen } from './StartScreen';
import { VerbDisplay } from './VerbDisplay';
import { Verb } from '../types';

const RussianVerbGame: React.FC = () => {
  const [verbs, setVerbs] = useState<Verb[]>([]);
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

  const {
    currentVerb,
    currentConjugation,
    score,
    totalAttempts,
    feedback,
    history,
    gameStarted,
    streak,
    correctButton,
    isAcceptingInput,
    startGame,
    checkAnswer
  } = useGameLogic(verbs);

  useKeyboardNavigation(gameStarted, checkAnswer, isAcceptingInput);

  return (
    <div className="russian-game-container">
      <GameHeader />

      {!gameStarted ? (
        <StartScreen startGame={startGame} />
      ) : (
        <div className="game-content">
          <div className="main-game-area">
            <GameStats
              score={score}
              totalAttempts={totalAttempts}
              streak={streak}
              isMobile={isMobile}
            />

            <div className="game-area">
              <VerbDisplay
                currentVerb={currentVerb}
                currentConjugation={currentConjugation}
                feedback={feedback}
              />
              <PronounOptions
                checkAnswer={checkAnswer}
                correctButton={correctButton}
              />
            </div>
          </div>

          {!isMobile && (
            <HistorySection history={history} />
          )}
        </div>
      )}
    </div>
  );
};

export default RussianVerbGame;