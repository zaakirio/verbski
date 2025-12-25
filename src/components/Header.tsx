import React from 'react';
import { Zap } from 'lucide-react';

export const Header: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="main-header">
      <div className="container">
        <nav>
          <a href="#" className="logo hover-target">
            <Zap fill="currentColor" size={24} />
            Verbski
          </a>
          <div className="nav-links">
            <a
              href="#conjugation"
              className="hover-target"
              onClick={(e) => handleNavClick(e, 'conjugation')}
            >
              Conjugation
            </a>
            <a
              href="#about"
              className="hover-target"
              onClick={(e) => handleNavClick(e, 'about')}
            >
              About
            </a>
            <a
              href="#contribute"
              className="hover-target"
              onClick={(e) => handleNavClick(e, 'contribute')}
            >
              Contribute
            </a>
          </div>
          <a
            href="#conjugation"
            className="btn btn-primary hover-target"
            onClick={(e) => handleNavClick(e, 'conjugation')}
          >
            Start Playing
          </a>
        </nav>
      </div>
    </header>
  );
};
