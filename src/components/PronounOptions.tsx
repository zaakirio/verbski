import React, { memo, useCallback } from 'react';
import { pronounDisplay } from '../utils/constants';
import { useAudio } from '../contexts/AudioContext';
import { useTutorial } from '../contexts/TutorialContext';
import { PronounOptionsProps } from '../types';

export const PronounOptions = memo<PronounOptionsProps>(({
  checkAnswer,
  correctButton,
  wrongButton = null,
  isAcceptingInput = true
}) => {
  const { playSoundEffect } = useAudio();
  const { currentStep, completeStep } = useTutorial();

  const handleMouseEnter = useCallback(() => {
    if (isAcceptingInput) {
      playSoundEffect('hover');
    }
  }, [isAcceptingInput, playSoundEffect]);

  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const key = e.currentTarget.dataset.pronoun;
    if (!key) return;

    checkAnswer(key);

    // Complete tutorial step if waiting for pronoun click
    if (currentStep?.requiredAction === 'click-pronoun') {
      completeStep();
    }
  }, [checkAnswer, currentStep, completeStep]);

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
            data-pronoun={key}
            className={className}
            onClick={handleButtonClick}
            onMouseEnter={handleMouseEnter}
            disabled={!isAcceptingInput}
          >
            {display}
          </button>
        );
      })}
    </div>
  );
});
