import React, { useState, useEffect } from 'react';
import '../styles/styles.css';
import verbsData from '../assets/verbs.json';
import { useGameLogic } from '../hooks/useGameLogic';
import { useKeyboardNavigation } from '../hooks/useKeyboardNav';
import { GameHeader } from './GameHeader';
import { GameStats } from './GameStats';
import { HistorySection } from './HistorySection';
import { PronounOptions } from './PronounOptions';
import { VerbDisplay } from './VerbDisplay';
import { GameModal } from './GameModal';
import { Verb } from '../types';

const RussianVerbGame: React.FC = () => {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [showIntro, setShowIntro] = useState(true);
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
    correctPronoun,
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

  const handleStartGame = () => {
    setShowIntro(false);
    startGame();
  };

  return (
    <div className="russian-game-container">
      <GameHeader />
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
              correctPronoun={correctPronoun}
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

      <GameModal isOpen={showIntro} onClose={handleStartGame}>
        <h2>Ready to learn Russian verbs? 📚</h2>
        <p>You'll be shown a conjugated verb form and need to select the matching pronoun.</p>
        <button
          className="start-button"
          onClick={handleStartGame}
        >
          Start Game
        </button>
      </GameModal>
    </div>
  );
};

export default RussianVerbGame;
