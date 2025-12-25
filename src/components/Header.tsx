import React, { useState } from 'react';
import { ConjugationModal } from './ConjugationModal';
import { AboutModal } from './AboutModal';
import { useTutorial } from '../contexts/TutorialContext';

export const Header: React.FC = () => {
  const [isConjugationModalOpen, setIsConjugationModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const { startTutorial } = useTutorial();

  const handleStartPlaying = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const element = document.getElementById('game');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Start tutorial after scroll completes
      setTimeout(() => {
        startTutorial();
      }, 500);
    }
  };

  const handleConjugationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsConjugationModalOpen(true);
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsAboutModalOpen(true);
  };

  return (
    <>
      <header className="main-header">
        <div className="container">
          <nav>
            <a href="#" className="logo hover-target">
              Verbski
            </a>
            <div className="nav-links">
              <a
                href="#conjugation"
                className="hover-target"
                onClick={handleConjugationClick}
              >
                Conjugation
              </a>
              <a
                href="#about"
                className="hover-target"
                onClick={handleAboutClick}
              >
                About
              </a>
            </div>
            <a
              href="#game"
              className="btn btn-primary hover-target"
              onClick={handleStartPlaying}
            >
              Start Playing
            </a>
          </nav>
        </div>
      </header>

      <ConjugationModal
        isOpen={isConjugationModalOpen}
        onClose={() => setIsConjugationModalOpen(false)}
      />
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </>
  );
};
