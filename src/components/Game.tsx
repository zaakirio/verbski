import React, { useState, useEffect, useRef } from 'react';
import '../styles/index.css';
import verbsData from '../assets/verbs.json';
import { useGameLogic } from '../hooks/useGameLogic';
import { useKeyboardNavigation } from '../hooks/useKeyboardNav';
import { useAudio } from '../contexts/AudioContext';
import { useSettings } from '../contexts/SettingsContext';
import { PronounOptions } from './PronounOptions';
import { VerbDisplay } from './VerbDisplay';
import { GameModal, SettingsModal } from './Modals';
import { LivesDisplay } from './LivesDisplay';
import { ProgressBar } from './ProgressBar';
import { ConfettiCanvas, NoiseOverlay, CustomCursor, FloatingLetters, SettingsButton } from './UI';
import { ConfettiCanvasRef } from '../types';
import { Header } from './Header';
import { HeroSection } from './LandingPage';
import { Verb } from '../types';
import { Star } from 'lucide-react';

const RussianVerbGame: React.FC = () => {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const confettiRef = useRef<ConfettiCanvasRef>(null);
  const prevScoreRef = useRef<number>(0);
  const { playSoundEffect } = useAudio();
  const { dailyGoal: settingsDailyGoal } = useSettings();

  useEffect(() => {
    setVerbs(verbsData.verbs);
  }, []);

  const {
    currentVerb,
    currentConjugation,
    correctPronoun,
    score,
    gameStarted,
    correctButton,
    wrongButton,
    isAcceptingInput,
    checkAnswer,
    lives,
    dailyProgress,
    dailyGoal,
    maxLives,
    resetGame,
  } = useGameLogic(verbs, settingsDailyGoal);

  useKeyboardNavigation(gameStarted, checkAnswer, isAcceptingInput);

  // Fire confetti and play sound on correct answer
  useEffect(() => {
    if (score > prevScoreRef.current) {
      if (confettiRef.current) {
        confettiRef.current.fire();
      }
      playSoundEffect('correct');
    }
    prevScoreRef.current = score;
  }, [score, playSoundEffect]);

  // Play wrong sound when wrong button is shown
  useEffect(() => {
    if (wrongButton) {
      playSoundEffect('wrong');
    }
  }, [wrongButton, playSoundEffect]);

  // Show game over modal when lives reach 0
  useEffect(() => {
    if (gameStarted && lives === 0) {
      // Delay to let the wrong answer animation show
      setTimeout(() => {
        setShowGameOver(true);
      }, 1500);
    }
  }, [lives, gameStarted]);

  const handlePlayAgain = () => {
    setShowGameOver(false);
    resetGame();
  };

  // Determine feedback text based on last answer
  const getFeedbackText = () => {
    if (correctButton && !wrongButton) {
      return { text: 'Correct! +50', isCorrect: true };
    }
    if (wrongButton) {
      return { text: 'Oops! Try again', isCorrect: false };
    }
    return null;
  };

  const feedback = getFeedbackText();

  return (
    <div className="russian-game-container">
      <NoiseOverlay />
      <CustomCursor />
      <FloatingLetters />

      <Header />

      <main>
        <HeroSection>
          {/* Game Card - inlined to prevent unmount/remount on re-renders */}
          <div id="game" className="game-card">
            <ConfettiCanvas ref={confettiRef} />

            <div className="game-header">
              <LivesDisplay lives={lives} maxLives={maxLives} />
              <SettingsButton />
              <div className="live-score">
                <Star size={16} fill="currentColor" />
                <span>{score}</span>
              </div>
            </div>

            <VerbDisplay
              currentVerb={currentVerb}
              currentConjugation={currentConjugation}
              correctPronoun={correctPronoun}
              feedback={feedback}
            />

            <PronounOptions
              checkAnswer={checkAnswer}
              correctButton={correctButton}
              wrongButton={wrongButton}
              isAcceptingInput={isAcceptingInput}
            />

            <ProgressBar
              current={dailyProgress}
              goal={dailyGoal}
            />
          </div>
        </HeroSection>
      </main>

      {/* Game Over Modal */}
      <GameModal isOpen={showGameOver} onClose={handlePlayAgain}>
        <h2>Game Over!</h2>
        <p>You scored {score} points. Ready to try again?</p>
        <button
          className="start-button"
          onClick={handlePlayAgain}
        >
          Play Again
        </button>
      </GameModal>

      {/* Settings Modal */}
      <SettingsModal />
    </div>
  );
};

export default RussianVerbGame;
