import React from 'react';
import { Flame, Globe, Github } from 'lucide-react';

interface HeroSectionProps {
  children: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ children }) => {
  return (
    <section id="conjugation" className="hero">
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="stats-row">
            <div className="stat-item hover-target">
              <Flame size={16} />
              <span>Open Source</span>
            </div>
            <div className="stat-item hover-target">
              <Globe size={16} />
              <span>Russian Only</span>
            </div>
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

          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary hover-target"
            >
              <Github size={18} />
              Star on GitHub
            </a>
          </div>
        </div>

        <div className="game-showcase">
          {children}
        </div>
      </div>
    </section>
  );
};
