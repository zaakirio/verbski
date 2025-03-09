import React from 'react';
import { Verb } from '../types';

interface VerbDisplayProps {
  currentVerb: Verb | null;
  currentConjugation: string;
  feedback: string;
}

export const VerbDisplay: React.FC<VerbDisplayProps> = ({ currentVerb, currentConjugation, feedback }) => {
  return (
    <div className="verb-display">
      <div className="verb-infinitive">{currentVerb?.infinitive} ({currentVerb?.english})</div>
      <div className="verb-conjugation">{currentConjugation}</div>
      <div className="feedback">
        {feedback && <div className={`animate-fadeIn ${feedback.includes('✅') ? 'feedback-correct' : ''}`}>{feedback}</div>}
      </div>
    </div>
  );
};