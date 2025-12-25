import { memo } from 'react';
import { Heart } from 'lucide-react';
import { LivesDisplayProps } from '../types';

export const LivesDisplay = memo<LivesDisplayProps>(({ lives, maxLives = 3 }) => {
  return (
    <div className="lives-container">
      {Array.from({ length: maxLives }, (_, i) => (
        <Heart
          key={i}
          size={20}
          fill={i < lives ? 'currentColor' : 'none'}
          className={i < lives ? 'heart-active' : 'heart-inactive'}
        />
      ))}
    </div>
  );
});
