import React from 'react';
import { Brain, Gamepad2, Code } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about">
      <div className="container">
        <h2 className="section-title">Why Verbski?</h2>
        <div className="grid-3">
          <div className="feature-card">
            <div className="feature-icon">
              <Brain size={24} />
            </div>
            <h3>Pattern Recognition</h3>
            <p>
              Instead of rote memorization, you learn to see the underlying patterns
              of Russian conjugation.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Gamepad2 size={24} />
            </div>
            <h3>Gamified Flow</h3>
            <p>
              Immediate feedback, streaks, and scoring keep you in the "flow state"
              essential for language acquisition.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <Code size={24} />
            </div>
            <h3>Open Source</h3>
            <p>
              Built by the community for the community. No paywalls, no subscriptions,
              just free learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
