import { memo } from 'react';
import { Settings } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

export const SettingsButton = memo(() => {
    const { openSettings } = useSettings();

    return (
        <button
            className="settings-button"
            onClick={openSettings}
            aria-label="Open settings"
            title="Settings"
        >
            <Settings size={18} />
        </button>
    );
});
