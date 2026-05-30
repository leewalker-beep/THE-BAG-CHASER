export interface PlayerStats {
  bag: number;
  mentalHealth: number;
  maxMentalHealth: number;
  aura: number;
  maxAura: number;
  clout: number;
  maxClout: number;
  heat: number;
  mo: number; // Months elapsed
  tier: number;
}

export interface GlobalModifiers {
  expenseBurnMultiplier: number;
  incomeMultiplier: number;
  stressRiskModifier: number;
}

export interface GameState {
  ph: 'PROLOGUE' | 'PROLOGUE_INTRO' | 'PLAYING' | 'POST_MORTEM' | 'LEADERBOARD';
  tab: string;
  alias: string;
  diff: 1 | 2 | 3;
  pl: PlayerStats;
  modifiers: GlobalModifiers;
  news: string[];
  lastProcessedTimestamp: number;

  // Base Actions
  setPh: (ph: GameState['ph']) => void;
  setTab: (tab: string) => void;
  adv: (intervals?: number) => void;
}
