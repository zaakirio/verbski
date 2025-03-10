import React from 'react';

interface GameStatsProps {
  score: number;
  totalAttempts: number;
  streak: number;
  isMobile: boolean;
}

export const GameStats: React.FC<GameStatsProps> = ({ score, totalAttempts, streak, isMobile }) => {
  const losses = totalAttempts - score;

  const renderStreakCounter = () => {
    if (streak < 1) return null;

    const getStreakMessage = () => {
      if (streak >= 10) return "🔥 отличный!";
      if (streak >= 7) return "✨";
      if (streak >= 5) return "🎯";
      if (streak >= 3) return "👍";
      return "🎮";
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
        <span className="streak-label">{getStreakMessage()}</span>
      </div>
    );
  };

  return (
    <div className="game-stats">
      <div className="score">
        <span className="score-value">Score: </span>
        <span className="score-label">{score} - {losses}</span>
        {totalAttempts > 0 && (
          <span className={`percentage ${score / totalAttempts < 0.3 ? 'percentage-low' :
              score / totalAttempts < 0.55 ? 'percentage-medium' :
                'percentage-high'
            }`}>
            {Math.round((score / totalAttempts) * 100)}%
          </span>
        )}
      </div>
      <div className="streak-display">
        {streak >= 1 && renderStreakCounter()}
      </div>
    </div>
  );
};
