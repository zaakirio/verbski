import React from 'react';
import { Zap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="container">
        <div className="logo">
          <Zap fill="currentColor" size={24} />
          Verbski
        </div>
        <p>Master Russian verb conjugation.</p>
        <div className="footer-links">
          <a href="#" className="hover-target">Privacy</a>
          <a href="#" className="hover-target">Contact</a>
        </div>
      </div>
    </footer>
  );
};
