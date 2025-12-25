import React from 'react';
import { Star } from 'lucide-react';
import { LivesDisplay } from './LivesDisplay';

interface GameStatsProps {
  score: number;
  streak: number;
  isMobile: boolean;
  lives?: number;
  maxLives?: number;
}

export const GameStats: React.FC<GameStatsProps> = ({
  score,
  streak,
  isMobile,
  lives = 3,
  maxLives = 3
}) => {
  const renderStreakCounter = () => {
    if (streak < 1) return null;

    const getStreakMessage = () => {
      if (streak >= 10) return "On Fire!";
      if (streak >= 7) return "Amazing!";
      if (streak >= 5) return "Great!";
      if (streak >= 3) return "Nice!";
      return "";
    };

    if (isMobile && streak < 3) {
      return (
        <div className="streak-counter">
          <span className="streak-count">{streak}</span>
        </div>
      );
    }

    return (
      <div className="streak-counter">
        <span className="streak-count">{streak}</span>
        {getStreakMessage() && <span className="streak-label">{getStreakMessage()}</span>}
      </div>
    );
  };

  return (
    <div className="game-stats">
      <LivesDisplay lives={lives} maxLives={maxLives} />

      <div className="score">
        <Star size={16} fill="currentColor" />
        <span>{score}</span>
      </div>

      <div className="streak-display">
        {streak >= 1 && renderStreakCounter()}
      </div>
    </div>
  );
};
