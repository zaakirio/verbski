import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { SettingsContextType } from '../types';

const STORAGE_KEY = 'verbski-daily-goal';
const DEFAULT_DAILY_GOAL = 5;
const MIN_DAILY_GOAL = 1;
const MAX_DAILY_GOAL = 20;

export const SettingsContext = createContext<SettingsContextType>({
    dailyGoal: DEFAULT_DAILY_GOAL,
    setDailyGoal: () => {},
    isSettingsOpen: false,
    openSettings: () => {},
    closeSettings: () => {},
});

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dailyGoal, setDailyGoalState] = useState<number>(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = parseInt(stored, 10);
                if (!isNaN(parsed) && parsed >= MIN_DAILY_GOAL && parsed <= MAX_DAILY_GOAL) {
                    return parsed;
                }
            }
        } catch {
            // Ignore localStorage errors
        }
        return DEFAULT_DAILY_GOAL;
    });

    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

    const setDailyGoal = useCallback((goal: number) => {
        const clampedGoal = Math.max(MIN_DAILY_GOAL, Math.min(MAX_DAILY_GOAL, goal));
        setDailyGoalState(clampedGoal);
        try {
            localStorage.setItem(STORAGE_KEY, clampedGoal.toString());
        } catch {
            // Ignore localStorage errors
        }
    }, []);

    const openSettings = useCallback(() => {
        setIsSettingsOpen(true);
    }, []);

    const closeSettings = useCallback(() => {
        setIsSettingsOpen(false);
    }, []);

    const value = {
        dailyGoal,
        setDailyGoal,
        isSettingsOpen,
        openSettings,
        closeSettings,
    };

    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);
