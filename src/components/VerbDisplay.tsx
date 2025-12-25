import React, { useEffect, useRef, useState } from 'react';
import { Verb } from '../types';
import { useAudio } from '../contexts/AudioContext';
import { Volume2, VolumeX, MessageCircle } from 'lucide-react';

interface VerbDisplayProps {
  currentVerb: Verb | null;
  currentConjugation: string;
  correctPronoun: string;
  showFeedbackOverlay?: boolean;
}

export const VerbDisplay: React.FC<VerbDisplayProps> = ({
  currentVerb,
  currentConjugation,
  correctPronoun,
  showFeedbackOverlay = false
}) => {
  const {
    isMuted,
    isPlaying,
    toggleMute,
    playAudio,
    preloadVerb
  } = useAudio();

  const conjugationRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number>(2.5);
  const lastPlayedRef = useRef<string>('');

  // Preload audio for current verb when it changes
  useEffect(() => {
    if (currentVerb?.infinitive) {
      preloadVerb(currentVerb.infinitive);
    }
  }, [currentVerb?.infinitive, preloadVerb]);

  // Play audio when a NEW verb is loaded (not during feedback overlay)
  useEffect(() => {
    if (!currentVerb || !correctPronoun || isMuted || showFeedbackOverlay) return;

    const audioKey = `${currentVerb.infinitive}_${correctPronoun}`;

    // Only play if this is a new verb/pronoun combination
    if (lastPlayedRef.current === audioKey) return;

    const timerId = setTimeout(() => {
      lastPlayedRef.current = audioKey;
      playAudio(currentVerb.infinitive, correctPronoun);
    }, 300);

    return () => clearTimeout(timerId);
  }, [currentVerb?.infinitive, correctPronoun, isMuted, showFeedbackOverlay, playAudio]);

  // Reset lastPlayedRef when feedback overlay closes (new verb coming)
  useEffect(() => {
    if (!showFeedbackOverlay) {
      // Reset after a short delay to allow new verb to trigger audio
      const timer = setTimeout(() => {
        lastPlayedRef.current = '';
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showFeedbackOverlay]);

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
          className="conjugation-text"
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
    </div>
  );
};
