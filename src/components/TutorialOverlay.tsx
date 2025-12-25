import React, { useEffect, useState, useCallback } from 'react';
import { useTutorial, TUTORIAL_STEPS } from '../contexts/TutorialContext';

interface Position {
    top: number;
    left: number;
    width: number;
    height: number;
}

interface TooltipPosition {
    top: number;
    left: number;
}

export const TutorialOverlay: React.FC = () => {
    const { isActive, currentStep, currentStepIndex, skipTutorial, completeStep } = useTutorial();
    const [targetPosition, setTargetPosition] = useState<Position | null>(null);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });

    const updatePositions = useCallback(() => {
        if (!currentStep) return;

        const targetEl = document.querySelector(currentStep.targetSelector);
        if (!targetEl) return;

        const rect = targetEl.getBoundingClientRect();
        const padding = 8;

        setTargetPosition({
            top: rect.top - padding,
            left: rect.left - padding,
            width: rect.width + padding * 2,
            height: rect.height + padding * 2,
        });

        // Calculate tooltip position based on step position preference
        const tooltipWidth = 320;
        const tooltipHeight = 180;
        const gap = 16;

        let tooltipTop = 0;
        let tooltipLeft = 0;

        switch (currentStep.position) {
            case 'bottom':
                tooltipTop = rect.bottom + gap;
                tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'top':
                tooltipTop = rect.top - tooltipHeight - gap;
                tooltipLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
                break;
            case 'left':
                tooltipTop = rect.top + rect.height / 2 - tooltipHeight / 2;
                tooltipLeft = rect.left - tooltipWidth - gap;
                break;
            case 'right':
                tooltipTop = rect.top + rect.height / 2 - tooltipHeight / 2;
                tooltipLeft = rect.right + gap;
                break;
        }

        // Keep tooltip within viewport
        tooltipLeft = Math.max(16, Math.min(tooltipLeft, window.innerWidth - tooltipWidth - 16));
        tooltipTop = Math.max(16, Math.min(tooltipTop, window.innerHeight - tooltipHeight - 16));

        setTooltipPosition({ top: tooltipTop, left: tooltipLeft });

        // Add spotlight class to target element
        targetEl.classList.add('tutorial-spotlight-target');
    }, [currentStep]);

    useEffect(() => {
        if (!isActive || !currentStep) return;

        // Initial position update
        updatePositions();

        // Update on resize/scroll
        window.addEventListener('resize', updatePositions);
        window.addEventListener('scroll', updatePositions);

        return () => {
            window.removeEventListener('resize', updatePositions);
            window.removeEventListener('scroll', updatePositions);

            // Remove spotlight class from all elements
            document.querySelectorAll('.tutorial-spotlight-target').forEach(el => {
                el.classList.remove('tutorial-spotlight-target');
            });
        };
    }, [isActive, currentStep, updatePositions]);

    if (!isActive || !currentStep || !targetPosition) return null;

    const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1;
    const isAcknowledgeStep = currentStep.requiredAction === 'acknowledge';

    const getArrowClass = () => {
        switch (currentStep.position) {
            case 'bottom':
                return 'top';
            case 'top':
                return 'bottom';
            case 'left':
                return 'right';
            case 'right':
                return 'left';
            default:
                return 'top';
        }
    };

    return (
        <div className="tutorial-overlay">
            {/* Spotlight */}
            <div
                className="tutorial-spotlight"
                style={{
                    top: targetPosition.top,
                    left: targetPosition.left,
                    width: targetPosition.width,
                    height: targetPosition.height,
                }}
            />

            {/* Tooltip */}
            <div
                className="tutorial-tooltip"
                style={{
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                }}
            >
                <div className={`tutorial-tooltip-arrow ${getArrowClass()}`} />

                <h3 className="tutorial-tooltip-title">{currentStep.title}</h3>
                <p className="tutorial-tooltip-description">{currentStep.description}</p>

                <div className="tutorial-tooltip-actions">
                    <button className="tutorial-tooltip-skip" onClick={skipTutorial}>
                        Skip tutorial
                    </button>

                    <div className="tutorial-step-indicator">
                        {TUTORIAL_STEPS.map((_, index) => (
                            <div
                                key={index}
                                className={`tutorial-step-dot ${index === currentStepIndex ? 'active' : ''}`}
                            />
                        ))}
                    </div>

                    {isAcknowledgeStep && (
                        <button className="tutorial-tooltip-next" onClick={completeStep}>
                            {isLastStep ? 'Done' : 'Next'}
                        </button>
                    )}
                </div>

                {!isAcknowledgeStep && (
                    <p className="tutorial-action-hint">
                        {currentStep.requiredAction === 'click-audio'
                            ? 'Click the word above to continue'
                            : 'Select a pronoun to continue'}
                    </p>
                )}
            </div>
        </div>
    );
};
