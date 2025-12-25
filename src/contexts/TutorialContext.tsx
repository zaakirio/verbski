import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type RequiredAction = 'click-audio' | 'click-pronoun' | 'acknowledge';
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TutorialStep {
    id: string;
    targetSelector: string;
    title: string;
    description: string;
    position: TooltipPosition;
    requiredAction: RequiredAction;
}

interface TutorialContextType {
    isActive: boolean;
    currentStepIndex: number;
    currentStep: TutorialStep | null;
    startTutorial: () => void;
    skipTutorial: () => void;
    completeStep: () => void;
}

const TUTORIAL_STEPS: TutorialStep[] = [
    {
        id: 'audio-click',
        targetSelector: '.conjugation-text',
        title: 'Listen to the Pronunciation',
        description: 'Click on the Russian word to hear how it sounds. This will help you learn the correct pronunciation.',
        position: 'bottom',
        requiredAction: 'click-audio',
    },
    {
        id: 'pronoun-select',
        targetSelector: '.pronoun-options',
        title: 'Select the Correct Pronoun',
        description: 'Choose the pronoun that matches this verb conjugation. Each form corresponds to a specific subject.',
        position: 'top',
        requiredAction: 'click-pronoun',
    },
    {
        id: 'lives-explain',
        targetSelector: '.lives-container',
        title: 'Your Lives',
        description: 'You have 3 hearts. Each wrong answer costs one heart. Lose all hearts and the game ends!',
        position: 'bottom',
        requiredAction: 'acknowledge',
    },
    {
        id: 'score-explain',
        targetSelector: '.live-score',
        title: 'Your Score',
        description: 'Earn points for each correct answer. Try to achieve your daily goal and keep your streak going!',
        position: 'bottom',
        requiredAction: 'acknowledge',
    },
];

export const TutorialContext = createContext<TutorialContextType>({
    isActive: false,
    currentStepIndex: 0,
    currentStep: null,
    startTutorial: () => {},
    skipTutorial: () => {},
    completeStep: () => {},
});

export const TutorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState<boolean>(false);
    const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

    const currentStep = isActive && currentStepIndex < TUTORIAL_STEPS.length
        ? TUTORIAL_STEPS[currentStepIndex]
        : null;

    const startTutorial = useCallback(() => {
        setCurrentStepIndex(0);
        setIsActive(true);
    }, []);

    const skipTutorial = useCallback(() => {
        setIsActive(false);
        setCurrentStepIndex(0);
    }, []);

    const completeStep = useCallback(() => {
        setCurrentStepIndex(prev => {
            const nextIndex = prev + 1;
            if (nextIndex >= TUTORIAL_STEPS.length) {
                setIsActive(false);
                return 0;
            }
            return nextIndex;
        });
    }, []);

    const value = {
        isActive,
        currentStepIndex,
        currentStep,
        startTutorial,
        skipTutorial,
        completeStep,
    };

    return (
        <TutorialContext.Provider value={value}>
            {children}
        </TutorialContext.Provider>
    );
};

export const useTutorial = () => useContext(TutorialContext);

export { TUTORIAL_STEPS };
