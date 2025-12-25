export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  gravity: number;
  drag: number;
}

export interface FeedbackInfo {
  text: string;
  isCorrect: boolean;
}

export interface Floater {
  id: number;
  char: string;
  left: string;
  fontSize: string;
  animationDuration: string;
  animationDelay: string;
}
