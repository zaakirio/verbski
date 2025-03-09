import { useEffect } from 'react';
import { pronounKeys } from '../utils/constants';

export const useKeyboardNavigation = (
  gameStarted: boolean,
  checkAnswer: (pronoun: string) => void,
  isAcceptingInput: boolean
) => {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!gameStarted || !isAcceptingInput) return;

      if (event.key >= '1' && event.key <= '6') {
        const index = parseInt(event.key) - 1;
        if (index >= 0 && index < pronounKeys.length) {
          checkAnswer(pronounKeys[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameStarted, checkAnswer, isAcceptingInput]);};