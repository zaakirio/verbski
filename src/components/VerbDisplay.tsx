import React, { useEffect, useRef, useState } from 'react';
import { Verb } from '../types';
import { useAudio } from '../contexts/AudioContext';
import { useTutorial } from '../contexts/TutorialContext';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';

interface FeedbackInfo {
  text: string;
  isCorrect: boolean;
}

interface VerbDisplayProps {
  currentVerb: Verb | null;
  currentConjugation: string;
  correctPronoun: string;
  feedback?: FeedbackInfo | null;
}

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

  // Track mount/unmount
  useEffect(() => {
    console.log('[VerbDisplay] *** COMPONENT MOUNTED ***');
    return () => console.log('[VerbDisplay] *** COMPONENT UNMOUNTED ***');
  }, []);

  // Track render count
  const renderCountRef = useRef(0);
  renderCountRef.current++;
  console.log('[VerbDisplay] Render #', renderCountRef.current);

  // Preload audio for current verb when it changes
  useEffect(() => {
    if (currentVerb?.infinitive) {
      preloadVerb(currentVerb.infinitive);
    }
  }, [currentVerb?.infinitive, preloadVerb]);

  // Track previous deps to see what's changing
  const prevDepsRef = useRef({ infinitive: '', pronoun: '', muted: false });

  // Play audio when verb/pronoun changes
  // Using playAudioRef to prevent effect re-runs from playAudio reference changes
  useEffect(() => {
    const prev = prevDepsRef.current;
    const curr = { infinitive: currentVerb?.infinitive || '', pronoun: correctPronoun, muted: isMuted };

    console.log('[VerbDisplay] Audio effect running. Deps changed?',
      'infinitive:', prev.infinitive !== curr.infinitive ? `"${prev.infinitive}" -> "${curr.infinitive}"` : 'NO',
      'pronoun:', prev.pronoun !== curr.pronoun ? `"${prev.pronoun}" -> "${curr.pronoun}"` : 'NO',
      'muted:', prev.muted !== curr.muted ? `${prev.muted} -> ${curr.muted}` : 'NO'
    );

    prevDepsRef.current = curr;

    if (currentVerb?.infinitive && correctPronoun && !isMuted) {
      console.log('[VerbDisplay] Setting 300ms timeout to play audio');
      const infinitive = currentVerb.infinitive;
      const timerId = setTimeout(() => {
        console.log('[VerbDisplay] Timeout fired - calling playAudio');
        playAudioRef.current(infinitive, correctPronoun);
      }, 300);

      return () => {
        console.log('[VerbDisplay] Cleanup - clearing timeout');
        clearTimeout(timerId);
      };
    } else {
      console.log('[VerbDisplay] Skipped - conditions not met');
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
    console.log('[VerbDisplay] Manual click - currentVerb:', currentVerb?.infinitive, 'isMuted:', isMuted);
    if (currentVerb && !isMuted) {
      console.log('[VerbDisplay] Calling playAudio from manual click');
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
