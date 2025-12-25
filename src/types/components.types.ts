import React from 'react';
import { Verb, HistoryItem } from './common.types';
import { FeedbackInfo } from './game.types';

export interface ConfettiCanvasRef {
  fire: () => void;
}

export interface LivesDisplayProps {
  lives: number;
  maxLives?: number;
}

export interface ProgressBarProps {
  current: number;
  goal?: number;
  label?: string;
}

export interface HistorySectionProps {
  history: HistoryItem[];
}

export interface PronounOptionsProps {
  checkAnswer: (pronoun: string) => void;
  correctButton: string | null;
  wrongButton?: string | null;
  isAcceptingInput?: boolean;
}

export interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export interface VerbDisplayProps {
  currentVerb: Verb | null;
  currentConjugation: string;
  correctPronoun: string;
  feedback?: FeedbackInfo | null;
}

export interface HeroSectionProps {
  children: React.ReactNode;
}

export interface ConjugationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
}
