import React, { useState } from 'react';
import { Flame, Download } from 'lucide-react';
import { DownloadModal } from '../Modals';
import { HeroSectionProps } from '../../types';

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <>
      <section id="conjugation" className="hero" aria-labelledby="hero-heading">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="stats-row" role="list" aria-label="App statistics">
              <div className="stat-item hover-target" role="listitem">
                <Flame size={16} aria-hidden="true" />
                <span>500+ Most Common Verbs</span>
              </div>
              <button
                className="stat-item hover-target stat-button"
                onClick={() => setIsDownloadModalOpen(true)}
                aria-label="Download verb list"
              >
                <Download size={16} aria-hidden="true" />
                <span>Download</span>
              </button>
            </div>

            <h1 id="hero-heading">
              Master Russian verbs <br />
              <span>without the headache.</span>
            </h1>

            <p>
              Stop memorizing tables. Start playing with patterns. Verbski turns grammar
              logic into an addictive card-matching game. Build streaks, earn points,
              and master Russian morphology.
            </p>
          </div>

          <div className="game-showcase" role="main" aria-label="Russian verb conjugation game">
            {children}
          </div>
        </div>
      </section>

      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </>
  );
};
