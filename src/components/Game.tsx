import React, { useState, useEffect, useRef } from 'react';
import '../styles/styles.css';
import verbsData from '../assets/verbs.json';
import { useGameLogic } from '../hooks/useGameLogic';
import { useKeyboardNavigation } from '../hooks/useKeyboardNav';
import { HistorySection } from './HistorySection';
import { PronounOptions } from './PronounOptions';
import { VerbDisplay } from './VerbDisplay';
import { GameModal } from './GameModal';
import { LivesDisplay } from './LivesDisplay';
import { ProgressBar } from './ProgressBar';
import { ConfettiCanvas, ConfettiCanvasRef } from './ConfettiCanvas';
import { NoiseOverlay } from './NoiseOverlay';
import { CustomCursor } from './CustomCursor';
import { FloatingLetters } from './FloatingLetters';
import { Header } from './Header';
import { HeroSection, AboutSection, ContributeSection, Footer } from './LandingPage';
import { Verb } from '../types';
import { Star } from 'lucide-react';

const RussianVerbGame: React.FC = () => {
  const [verbs, setVerbs] = useState<Verb[]>([]);
  const [showGameOver, setShowGameOver] = useState(false);
  const confettiRef = useRef<ConfettiCanvasRef>(null);
  const prevScoreRef = useRef<number>(0);

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
    history,
    gameStarted,
    correctButton,
    wrongButton,
    isAcceptingInput,
    showFeedbackOverlay,
    lastAnswerCorrect,
    nextVerb,
    checkAnswer,
    lives,
    dailyProgress,
    dailyGoal,
    maxLives,
    resetGame,
  } = useGameLogic(verbs);

  useKeyboardNavigation(gameStarted, checkAnswer, isAcceptingInput);

  // Fire confetti on correct answer
  useEffect(() => {
    if (score > prevScoreRef.current && confettiRef.current) {
      confettiRef.current.fire();
    }
    prevScoreRef.current = score;
  }, [score]);

  // Show game over modal when lives reach 0
  useEffect(() => {
    if (gameStarted && lives === 0 && showFeedbackOverlay) {
      setShowGameOver(true);
    }
  }, [lives, gameStarted, showFeedbackOverlay]);

  const handlePlayAgain = () => {
    setShowGameOver(false);
    resetGame();
  };

  const handleNextVerb = () => {
    nextVerb();
  };

  // Game Card Component with Feedback Overlay
  const GameCard = () => (
    <div className="game-card">
      <ConfettiCanvas ref={confettiRef} />

      {/* Feedback Overlay */}
      <div className={`feedback-overlay ${showFeedbackOverlay && !showGameOver ? 'active' : ''}`}>
        <div className="feedback-text">
          {lastAnswerCorrect ? 'Correct!' : 'Oops!'}
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
          {lastAnswerCorrect ? '+50 Points' : 'Try the next one'}
        </div>
        <button className="btn btn-primary" onClick={handleNextVerb}>
          Next Verb
        </button>
      </div>

      <div className="game-header">
        <LivesDisplay lives={lives} maxLives={maxLives} />
        <div className="live-score">
          <Star size={16} fill="currentColor" />
          <span>{score}</span>
        </div>
      </div>

      <VerbDisplay
        currentVerb={currentVerb}
        currentConjugation={currentConjugation}
        correctPronoun={correctPronoun}
        showFeedbackOverlay={showFeedbackOverlay}
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
  );

  return (
    <div className="russian-game-container">
      <NoiseOverlay />
      <CustomCursor />
      <FloatingLetters />

      <Header />

      <main>
        <HeroSection>
          <GameCard />
        </HeroSection>

        <AboutSection />
        <ContributeSection />
      </main>

      <Footer />

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

      {/* Desktop History Sidebar - Hidden for landing page layout */}
      {!isMobile && gameStarted && (
        <div style={{
          position: 'fixed',
          right: '24px',
          top: '120px',
          width: '280px',
          maxHeight: 'calc(100vh - 160px)',
          zIndex: 50,
          display: 'none',
        }}>
          <HistorySection history={history} />
        </div>
      )}
    </div>
  );
};

export default RussianVerbGame;
