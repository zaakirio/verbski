import React from 'react';
import { HistoryItem } from '../types';
import { pronounDisplay, CORRECT_EMOJI, INCORRECT_EMOJI } from '../utils/constants';

interface MobileHistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
}

export const MobileHistoryDrawer: React.FC<MobileHistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`mobile-drawer-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <div
        className={`mobile-drawer ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="History drawer"
      >
        {/* Drag handle */}
        <div className="mobile-drawer-handle" onClick={onClose}>
          <span />
        </div>

        <div className="mobile-drawer-header">
          <h3>Verb History</h3>
          <button
            className="mobile-drawer-close"
            onClick={onClose}
            aria-label="Close history"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mobile-drawer-content">
          {history.length === 0 ? (
            <div className="mobile-drawer-empty">
              <p>No history yet. Start playing to see your attempts here!</p>
            </div>
          ) : (
            <div className="mobile-history-list">
              {history.slice(0, 20).map((item, index) => (
                <div
                  key={index}
                  className={`mobile-history-item ${item.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="mobile-history-top">
                    <span className="mobile-history-emoji">
                      {item.isCorrect ? CORRECT_EMOJI : INCORRECT_EMOJI}
                    </span>
                    <span className="mobile-history-verb">{item.verb}</span>
                  </div>
                  <div className="mobile-history-content">
                    <span className="mobile-history-conjugation">{item.conjugation}</span>
                    <div className="mobile-history-answer">
                      <span className="mobile-history-arrow">→</span>
                      <span className="mobile-history-pronoun">{pronounDisplay[item.pronoun]}</span>
                    </div>
                  </div>
                  {!item.isCorrect && (
                    <div className="mobile-history-correct">
                      Correct: {pronounDisplay[item.correctPronoun]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
