import React from 'react';
import { pronounDisplay } from '../utils/constants';
import { useAudio } from '../contexts/AudioContext';
import { useTutorial } from '../contexts/TutorialContext';

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
  const { playSoundEffect } = useAudio();
  const { currentStep, completeStep } = useTutorial();

  const handleMouseEnter = () => {
    if (isAcceptingInput) {
      playSoundEffect('hover');
    }
  };

  const handleClick = (key: string) => {
    checkAnswer(key);

    // Complete tutorial step if waiting for pronoun click
    if (currentStep?.requiredAction === 'click-pronoun') {
      completeStep();
    }
  };

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
            onClick={() => handleClick(key)}
            onMouseEnter={handleMouseEnter}
            disabled={!isAcceptingInput}
          >
            {display}
          </button>
        );
      })}
    </div>
  );
};
