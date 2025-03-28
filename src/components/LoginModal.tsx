import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJustPlay: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onJustPlay }) => {
  const { loginWithRedirect } = useAuth0();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Track Your Progress</h2>
        <p className="modal-text">
          Sign in to track your progress and see how you improve over time!
        </p>
        <div className="modal-buttons">
          <button
            onClick={() => loginWithRedirect()}
            className="modal-button modal-button-primary"
          >
            Sign In
          </button>
          <button
            onClick={onJustPlay}
            className="modal-button modal-button-secondary"
          >
            Just Play
          </button>
        </div>
      </div>
    </div>
  );
}; 