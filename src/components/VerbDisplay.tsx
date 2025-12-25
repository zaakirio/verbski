import React, { useEffect, useRef, useState } from 'react';
import { VerbDisplayProps } from '../types';
import { useAudio } from '../contexts/AudioContext';
import { useTutorial } from '../contexts/TutorialContext';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';

export const VerbDisplay: React.FC<VerbDisplayProps> = ({
  currentVerb,
  currentConjugation,
  correctPronoun,
  feedback
}) => {
  const {
    isMuted,
    isPlaying,
    toggleMute,
    playAudio,
    preloadVerb
  } = useAudio();
  const { currentStep, completeStep } = useTutorial();

  const conjugationRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number>(2.5);

  // Store playAudio in a ref to avoid it triggering effect re-runs
  const playAudioRef = useRef(playAudio);
  useEffect(() => {
    playAudioRef.current = playAudio;
  }, [playAudio]);

  // Preload audio for current verb when it changes
  useEffect(() => {
    if (currentVerb?.infinitive) {
      preloadVerb(currentVerb.infinitive);
    }
  }, [currentVerb?.infinitive, preloadVerb]);

  // Play audio when verb/pronoun changes
  // Using playAudioRef to prevent effect re-runs from playAudio reference changes
  useEffect(() => {
    if (currentVerb?.infinitive && correctPronoun && !isMuted) {
      const infinitive = currentVerb.infinitive;
      const timerId = setTimeout(() => {
        playAudioRef.current(infinitive, correctPronoun);
      }, 300);

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [currentVerb?.infinitive, correctPronoun, isMuted]);

  // Dynamic font sizing for mobile
  useEffect(() => {
    if (!conjugationRef.current) return;

    conjugationRef.current.style.fontSize = '2.5rem';

    const containerWidth = conjugationRef.current.parentElement?.clientWidth || 0;
    if (containerWidth === 0) return;

    const textWidth = conjugationRef.current.scrollWidth;
    const textLength = currentConjugation.length;

    if (textWidth > containerWidth * 0.8) {
      const minSize = textLength < 10 ? 1.5 : 1.2;
      const calculatedSize = Math.max(minSize, 2.5 * (containerWidth * 0.8) / textWidth);
      setFontSize(calculatedSize);
    } else {
      setFontSize(textLength > 12 ? 2 : 2.5);
    }
  }, [currentConjugation]);

  const handleManualPlay = () => {
    if (currentVerb && !isMuted) {
      playAudio(currentVerb.infinitive, correctPronoun);
    }

    // Complete tutorial step if waiting for audio click
    if (currentStep?.requiredAction === 'click-audio') {
      completeStep();
    }
  };

  return (
    <div className="verb-display">
      {/* English meaning with icon */}
      <div className="verb-meaning">
        <MessageCircle size={16} />
        <span>{currentVerb?.english || 'loading...'}</span>
      </div>

      {/* Russian infinitive */}
      <div className="verb-infinitive">
        {currentVerb?.infinitive?.toUpperCase() || 'LOADING...'}
      </div>

      {/* Conjugation with audio button */}
      <div className="verb-conjugation">
        <span
          ref={conjugationRef}
          className={`conjugation-text ${feedback?.isCorrect ? 'highlight' : ''}`}
          onClick={handleManualPlay}
          style={{
            cursor: isMuted ? 'default' : 'pointer',
            fontSize: `${fontSize}rem`
          }}
          title={isMuted ? "Audio is muted" : "Click to hear pronunciation"}
        >
          {currentConjugation || '...'}
        </span>
        <button
          className={`audio-button ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMute}
          aria-label={isMuted ? "Enable audio" : "Disable audio"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Feedback message */}
      <div className="feedback">
        {feedback && (
          <div className={`animate-fadeIn ${feedback.isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
            {feedback.text}
          </div>
        )}
      </div>
    </div>
  );
};
