import { memo, useMemo } from 'react';
import { ProgressBarProps } from '../types';

export const ProgressBar = memo<ProgressBarProps>(({
  current,
  goal = 5,
  label = 'Daily Goal'
}) => {
  const percentage = Math.min((current / goal) * 100, 100);
  const displayCurrent = Math.min(current, goal);

  const fillStyle = useMemo(() => ({ width: `${percentage}%` }), [percentage]);

  return (
    <div className="progress-container">
      <div className="progress-label">
        <span>{label}</span>
        <span>{displayCurrent}/{goal}</span>
      </div>
      <div className="progress-track">
        <div
          className="progress-fill"
          style={fillStyle}
        />
      </div>
    </div>
  );
});
