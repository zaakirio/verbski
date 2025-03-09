import React, { useEffect } from 'react';
import { Verb } from '../types';
import { useAudio } from '../contexts/AudioContext';
import { Volume2, VolumeX } from 'lucide-react';

interface VerbDisplayProps {
  currentVerb: Verb | null;
  currentConjugation: string;
  feedback: string;
  correctPronoun: string;
}

export const VerbDisplay: React.FC<VerbDisplayProps> = ({
  currentVerb,
  currentConjugation,
  feedback
}) => {
  const { isMuted, isPlaying, toggleMute, playAudio } = useAudio();

  useEffect(() => {
    if (currentConjugation && !isMuted) {
      const timerId = setTimeout(() => {
        playAudio(currentConjugation);
      }, 300);

      return () => clearTimeout(timerId);
    }
  }, [currentConjugation, isMuted, playAudio]);

  return (
    <div className="verb-display">
      <div className="verb-infinitive">{currentVerb?.infinitive} ({currentVerb?.english})</div>
      <div className="verb-conjugation">
        <span
          className="conjugation-text"
          onClick={() => !isMuted && playAudio(currentConjugation)}
          style={{ cursor: isMuted ? 'default' : 'pointer' }}
          title={isMuted ? "Audio is muted" : "Click to hear pronunciation"}
        >
          {currentConjugation}
        </span>
        <button
          className={`audio-button ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMute}
          aria-label={isMuted ? "Enable audio" : "Disable audio"}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
      <div className="feedback">
        {feedback && <div className={`animate-fadeIn ${feedback.includes('✅') ? 'feedback-correct' : ''}`}>{feedback}</div>}
      </div>
    </div>
  );
};