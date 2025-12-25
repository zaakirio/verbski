import React, { useState } from 'react';
import { Flame, Download } from 'lucide-react';
import { DownloadModal } from '../Modals';
import { HeroSectionProps } from '../../types';

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <>
      <section id="conjugation" className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="stats-row">
              <div className="stat-item hover-target">
                <Flame size={16} />
                <span>500+ Most Common Verbs</span>
              </div>
              <button
                className="stat-item hover-target stat-button"
                onClick={() => setIsDownloadModalOpen(true)}
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>

            <h1>
              Master Russian verbs <br />
              <span>without the headache.</span>
            </h1>

            <p>
              Stop memorizing tables. Start playing with patterns. Verbski turns grammar
              logic into an addictive card-matching game. Build streaks, earn points,
              and master Russian morphology.
            </p>
          </div>

          <div className="game-showcase">
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
