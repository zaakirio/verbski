import React from 'react';

interface ProgressBarProps {
  current: number;
  goal?: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  goal = 5,
  label = 'Daily Goal'
}) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const displayCurrent = Math.min(current, goal);

  return (
    <div className="progress-container">
      <div className="progress-label">
        <span>{label}</span>
        <span>{displayCurrent}/{goal}</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
