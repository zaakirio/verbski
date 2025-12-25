import { memo } from 'react';
import { HistorySectionProps } from '../types';
import { pronounDisplay, CORRECT_EMOJI, INCORRECT_EMOJI } from '../utils/constants';

export const HistorySection = memo<HistorySectionProps>(({ history }) => {
  return (
    <div className="history-section">
      <h3>Verb History</h3>
      <div className="history-list">
        {history.map((item, index) => (
          <div
            key={index}
            className={`history-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
          >
            <div className="history-top">
              <span className="history-emoji">
                {item.isCorrect ? CORRECT_EMOJI : INCORRECT_EMOJI}
              </span>
              <span className="history-verb">{item.verb}</span>
            </div>
            <div className="history-content">
              <span className="history-conjugation">{item.conjugation}</span>
              <div className="history-answer">
                <span className="history-arrow">→</span>
                <span className="history-pronoun">{pronounDisplay[item.pronoun]}</span>
              </div>
            </div>
            {!item.isCorrect && (
              <div className="history-correct-answer">
                Correct: {pronounDisplay[item.correctPronoun]}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});