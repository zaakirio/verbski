import React from 'react';
import { BookOpen } from 'lucide-react';
import { ConjugationModalProps } from '../../types';

export const ConjugationModal: React.FC<ConjugationModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-icon">
          <BookOpen size={32} />
        </div>

        <h2>What is Conjugation?</h2>

        <div className="modal-body">
          <p>
            <strong>Conjugation</strong> is how verbs change their form to match who is doing the action.
            In Russian, verbs transform based on the subject — whether it's "I", "you", "we", or "they".
          </p>

          <div className="example-box">
            <p className="example-label">Example with "читать" (to read):</p>
            <div className="example-grid">
              <span className="pronoun">я</span>
              <span className="conjugated">читаю</span>
              <span className="pronoun">мы</span>
              <span className="conjugated">читаем</span>
              <span className="pronoun">ты</span>
              <span className="conjugated">читаешь</span>
              <span className="pronoun">вы</span>
              <span className="conjugated">читаете</span>
              <span className="pronoun">он/она</span>
              <span className="conjugated">читает</span>
              <span className="pronoun">они</span>
              <span className="conjugated">читают</span>
            </div>
          </div>

          <h3>Why Master Conjugation?</h3>
          <ul className="benefits-list">
            <li>
              <strong>Sound natural:</strong> Proper conjugation is essential for fluent Russian speech
            </li>
            <li>
              <strong>Be understood:</strong> Incorrect verb forms can change meaning or cause confusion
            </li>
            <li>
              <strong>Build confidence:</strong> Once you master patterns, speaking becomes automatic
            </li>
          </ul>

          <p className="closing-text">
            Verbski helps you practice until conjugation becomes second nature through
            quick, engaging exercises.
          </p>
        </div>
      </div>
    </div>
  );
};
