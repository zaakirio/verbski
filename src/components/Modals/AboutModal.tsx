import React from 'react';
import { Heart } from 'lucide-react';
import { AboutModalProps } from '../../types';

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content info-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-icon">
          <Heart size={32} />
        </div>

        <h2>About Verbski</h2>

        <div className="modal-body">
          <p>
            Verbski was born from a simple frustration: learning Russian verb conjugations
            felt tedious with traditional methods. We wanted something better — something
            that makes practice feel less like homework and more like a game.
          </p>

          <h3>Our Mission</h3>
          <p>
            To help Russian language learners master verb conjugation through quick,
            focused practice sessions. No lengthy lessons, no complicated grammar
            explanations — just you, the verbs, and the satisfaction of getting it right.
          </p>

          <h3>How It Works</h3>
          <ul className="benefits-list">
            <li>
              <strong>See the conjugation:</strong> A Russian verb form appears on screen
            </li>
            <li>
              <strong>Match the pronoun:</strong> Pick which subject (я, ты, он, etc.) goes with it
            </li>
            <li>
              <strong>Build your streak:</strong> Keep practicing to reinforce your knowledge
            </li>
          </ul>

          <p className="closing-text">
            Whether you're a beginner just starting out or an intermediate learner
            looking to sharpen your skills, Verbski is here to help you on your
            Russian language journey.
          </p>

          <p className="signature">
            Made with <Heart size={14} className="inline-heart" /> for Russian learners everywhere
          </p>
        </div>
      </div>
    </div>
  );
};
