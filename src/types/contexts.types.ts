export type SoundEffectType = 'hover' | 'correct' | 'wrong';

export interface AudioContextType {
  isMuted: boolean;
  isPlaying: boolean;
  toggleMute: () => void;
  playAudio: (infinitive: string, pronoun: string) => Promise<void>;
  stopAudio: () => void;
  preloadVerb: (infinitive: string) => void;
  playSoundEffect: (type: SoundEffectType) => void;
}

export interface SettingsContextType {
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

export type RequiredAction = 'click-audio' | 'click-pronoun' | 'acknowledge';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TutorialStep {
  id: string;
  targetSelector: string;
  title: string;
  description: string;
  position: TooltipPosition;
  requiredAction: RequiredAction;
}

export interface TutorialContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: TutorialStep | null;
  startTutorial: () => void;
  skipTutorial: () => void;
  completeStep: () => void;
}
