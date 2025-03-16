import React, { useEffect, useRef, useState } from 'react';
import { Verb } from '../types';
import { useAudio } from '../contexts/AudioContext';
import { Volume2, VolumeX } from 'lucide-react';

interface VerbDisplayProps {
  currentVerb: Verb | null;
  currentConjugation: string;
  feedback: string;
}

export const VerbDisplay: React.FC<VerbDisplayProps> = ({ 
  currentVerb, 
  currentConjugation, 
  feedback
}) => {
  const { 
    isMuted, 
    isPlaying, 
    toggleMute, 
    playAudio, 
  } = useAudio();
  
  const conjugationRef = useRef<HTMLSpanElement>(null);
  const [fontSize, setFontSize] = useState<number>(2.5); // Default size in rem
  
  useEffect(() => {
    if (currentConjugation && !isMuted) {
      const timerId = setTimeout(() => {
        playAudio(currentConjugation);
      }, 300);
      
      return () => clearTimeout(timerId);
    }
  }, [currentConjugation, isMuted, playAudio]);
  
  // Logic mainly for mobile
  useEffect(() => {
    if (!conjugationRef.current) return;
    
    conjugationRef.current.style.fontSize = '2.5rem';
    
    const containerWidth = conjugationRef.current.parentElement?.clientWidth || 0;
    if (containerWidth === 0) return;
    
    const textWidth = conjugationRef.current.scrollWidth;
    const textLength = currentConjugation.length;
    
    // If text is wider than container, adjust font size
    if (textWidth > containerWidth * 0.8) {
      // Calculate an appropriate font size
      // Short words (< 10 chars) shouldn't go below 1.5rem
      // Longer words can go down to 1.2rem
      const minSize = textLength < 10 ? 1.5 : 1.2;
      const calculatedSize = Math.max(minSize, 2.5 * (containerWidth * 0.8) / textWidth);
      setFontSize(calculatedSize);
    } else {
      // Reset to default size if not too wide
      setFontSize(textLength > 12 ? 2 : 2.5);
    }
  }, [currentConjugation]);

  return (
    <div className="verb-display">
      <div className="verb-infinitive">{currentVerb?.infinitive} ({currentVerb?.english})</div>
      <div className="verb-conjugation">
        <span 
          ref={conjugationRef}
          className="conjugation-text"
          onClick={() => !isMuted && playAudio(currentConjugation)}
          style={{ 
            cursor: isMuted ? 'default' : 'pointer',
            fontSize: `${fontSize}rem`
          }}
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