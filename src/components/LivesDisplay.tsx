import React from 'react';
import { Heart } from 'lucide-react';

interface LivesDisplayProps {
  lives: number;
  maxLives?: number;
}

export const LivesDisplay: React.FC<LivesDisplayProps> = ({ lives, maxLives = 3 }) => {
  return (
    <div className="lives-container">
      {Array.from({ length: maxLives }, (_, i) => (
        <Heart
          key={i}
          size={20}
          fill={i < lives ? 'currentColor' : 'none'}
          style={{
            opacity: i < lives ? 1 : 0.3,
          }}
        />
      ))}
    </div>
  );
};
