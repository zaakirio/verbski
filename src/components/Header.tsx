import React, { useState } from 'react';
import { ConjugationModal, AboutModal } from './Modals';
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
      <header className="main-header" role="banner">
        <div className="container">
          <nav aria-label="Main navigation">
            <a href="#" className="logo hover-target" aria-label="Verbski - Home">
              Verbski
            </a>
            <div className="nav-links" role="menubar">
              <a
                href="#conjugation"
                className="hover-target"
                onClick={handleConjugationClick}
                role="menuitem"
                aria-label="Learn about Russian verb conjugation"
              >
                Conjugation
              </a>
              <a
                href="#about"
                className="hover-target"
                onClick={handleAboutClick}
                role="menuitem"
                aria-label="About Verbski"
              >
                About
              </a>
            </div>
            <a
              href="#game"
              className="btn btn-primary hover-target"
              onClick={handleStartPlaying}
              aria-label="Start playing the Russian verb conjugation game"
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
