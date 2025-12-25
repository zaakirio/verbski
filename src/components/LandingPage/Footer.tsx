import { memo } from 'react';
import { Zap } from 'lucide-react';

export const Footer = memo(() => {
  return (
    <footer role="contentinfo" aria-label="Site footer">
      <div className="container">
        <div className="logo" aria-hidden="true">
          <Zap fill="currentColor" size={24} aria-hidden="true" />
          Verbski
        </div>
        <p>Master Russian verb conjugation.</p>
        <nav className="footer-links" aria-label="Footer navigation">
          <a href="#" className="hover-target" aria-label="Privacy policy">Privacy</a>
          <a href="#" className="hover-target" aria-label="Contact us">Contact</a>
        </nav>
      </div>
    </footer>
  );
});
