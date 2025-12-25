import React from 'react';
import { Settings } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export const SettingsModal: React.FC = () => {
    const { isSettingsOpen, closeSettings, dailyGoal, setDailyGoal } = useSettings();

    if (!isSettingsOpen) return null;

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDailyGoal(parseInt(e.target.value, 10));
    };

    return (
        <div className="modal-overlay" onClick={closeSettings}>
            <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={closeSettings}>
                    ✕
                </button>

                <div className="modal-icon">
                    <Settings size={32} />
                </div>

                <h2>Settings</h2>

                <div className="modal-body">
                    <div className="settings-section">
                        <label className="settings-label">Daily Goal</label>
                        <p className="settings-description">
                            Set how many correct answers you want to achieve each day.
                        </p>
                        <div className="goal-slider-container">
                            <input
                                type="range"
                                min="1"
                                max="20"
                                value={dailyGoal}
                                onChange={handleSliderChange}
                                className="goal-slider"
                            />
                            <span className="goal-value">{dailyGoal}</span>
                        </div>
                    </div>

                    <button className="settings-save-button" onClick={closeSettings}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
};
