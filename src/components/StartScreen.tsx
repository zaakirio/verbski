import React from 'react';

interface StartScreenProps {
  startGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ startGame }) => {
  return (
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
  );
};
