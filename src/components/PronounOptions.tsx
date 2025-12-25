import React from 'react';
import { pronounDisplay } from '../utils/constants';

interface PronounOptionsProps {
  checkAnswer: (pronoun: string) => void;
  correctButton: string | null;
  wrongButton?: string | null;
  isAcceptingInput?: boolean;
}

export const PronounOptions: React.FC<PronounOptionsProps> = ({
  checkAnswer,
  correctButton,
  wrongButton = null,
  isAcceptingInput = true
}) => {
  return (
    <div className="pronoun-options">
      {Object.entries(pronounDisplay).map(([key, display]) => {
        const isCorrect = correctButton === key;
        const isWrong = wrongButton === key;
        const isDisabled = !isAcceptingInput && !isCorrect && !isWrong;

        let className = 'pronoun-button';
        if (isCorrect) className += ' correct';
        if (isWrong) className += ' wrong';
        if (isDisabled) className += ' disabled';

        return (
          <button
            key={key}
            className={className}
            onClick={() => checkAnswer(key)}
            disabled={!isAcceptingInput}
          >
            {display}
          </button>
        );
      })}
    </div>
  );
};
