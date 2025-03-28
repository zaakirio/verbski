import React, { useState } from 'react';
import { LoginModal } from './LoginModal';

interface StartScreenProps {
  startGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ startGame }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStartClick = () => {
    setShowLoginModal(true);
  };

  const handleJustPlay = () => {
    setShowLoginModal(false);
    startGame();
  };

  return (
    <div className="start-screen">
      <h2>Ready to learn Russian verbs? 📚</h2>
      <p>You'll be shown a conjugated verb form and need to select the matching pronoun.</p>
      <button
        className="start-button"
        onClick={handleStartClick}
      >
        Start Game
      </button>
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onJustPlay={handleJustPlay}
      />
    </div>
  );
};