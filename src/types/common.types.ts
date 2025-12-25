export interface Verb {
  infinitive: string;
  english: string;
  conjugations: {
    ya: string;
    ti: string;
    on_ona_ono: string;
    mi: string;
    vi: string;
    oni: string;
  };
}

export interface HistoryItem {
  verb: string;
  conjugation: string;
  pronoun: string;
  isCorrect: boolean;
  correctPronoun: string;
}

export interface DailyProgress {
  date: string;
  correct: number;
}
