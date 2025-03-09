import React from 'react';
import { pronounDisplay } from '../utils/constants';

interface PronounOptionsProps {
  checkAnswer: (pronoun: string) => void;
  correctButton: string | null;
}

export const PronounOptions: React.FC<PronounOptionsProps> = ({ checkAnswer, correctButton }) => {
  return (
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
  );
};