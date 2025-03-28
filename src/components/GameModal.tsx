import React from 'react';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const GameModal: React.FC<GameModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {children}
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}; 