import React, { useState } from 'react';
import { ConjugationModal, AboutModal } from './Modals';
import { useTutorial } from '../contexts/TutorialContext';

export const Header: React.FC = () => {
  const [isConjugationModalOpen, setIsConjugationModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { startTutorial } = useTutorial();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleStartPlaying = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMobileMenu();
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
    closeMobileMenu();
    setIsConjugationModalOpen(true);
  };

  const handleAboutClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeMobileMenu();
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
              className="btn btn-primary hover-target desktop-cta"
              onClick={handleStartPlaying}
              aria-label="Start playing the Russian verb conjugation game"
            >
              Start Playing
            </a>
            {/* Mobile hamburger button */}
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
        aria-hidden={!isMobileMenuOpen}
      />

      {/* Mobile menu panel */}
      <div
        className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="mobile-menu-content">
          <a
            href="#conjugation"
            className="mobile-menu-link"
            onClick={handleConjugationClick}
          >
            Conjugation
          </a>
          <a
            href="#about"
            className="mobile-menu-link"
            onClick={handleAboutClick}
          >
            About
          </a>
          <a
            href="#game"
            className="btn btn-primary mobile-menu-cta"
            onClick={handleStartPlaying}
          >
            Start Playing
          </a>
        </div>
      </div>

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
