/**
 * Game configuration constants
 * Centralized configuration for the verbski game
 */

export const GAME_CONFIG = {
  MAX_LIVES: 3,
  DEFAULT_DAILY_GOAL: 5,
  MIN_DAILY_GOAL: 1,
  MAX_DAILY_GOAL: 20,
  ANSWER_DELAY_CORRECT: 1200,
  ANSWER_DELAY_WRONG: 1500,
  CONFETTI_PARTICLE_COUNT: 60,
  AUDIO_PRELOAD_CACHE_SIZE: 18,
} as const;

export const STORAGE_KEYS = {
  AUDIO_MUTED: 'verbski-audio-muted',
  DAILY_GOAL: 'verbski-daily-goal',
  DAILY_PROGRESS: 'verbski-daily-progress',
} as const;

export const PRONOUNS = ['ya', 'ti', 'on_ona_ono', 'mi', 'vi', 'oni'] as const;
