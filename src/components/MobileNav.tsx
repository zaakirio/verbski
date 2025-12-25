import React from 'react';

interface MobileNavProps {
  activeTab: 'game' | 'history' | 'settings' | 'info';
  onTabChange: (tab: 'game' | 'history' | 'settings' | 'info') => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <button
        className={`mobile-nav-item ${activeTab === 'game' ? 'active' : ''}`}
        onClick={() => onTabChange('game')}
        aria-label="Game"
        aria-current={activeTab === 'game' ? 'page' : undefined}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
        <span>Game</span>
      </button>

      <button
        className={`mobile-nav-item ${activeTab === 'history' ? 'active' : ''}`}
        onClick={() => onTabChange('history')}
        aria-label="History"
        aria-current={activeTab === 'history' ? 'page' : undefined}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>History</span>
      </button>

      <button
        className={`mobile-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
        onClick={() => onTabChange('settings')}
        aria-label="Settings"
        aria-current={activeTab === 'settings' ? 'page' : undefined}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m7.08 7.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m7.08-7.08l4.24-4.24"/>
        </svg>
        <span>Settings</span>
      </button>

      <button
        className={`mobile-nav-item ${activeTab === 'info' ? 'active' : ''}`}
        onClick={() => onTabChange('info')}
        aria-label="Info"
        aria-current={activeTab === 'info' ? 'page' : undefined}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="16" x2="12" y2="12"/>
          <line x1="12" y1="8" x2="12.01" y2="8"/>
        </svg>
        <span>Info</span>
      </button>
    </nav>
  );
};
