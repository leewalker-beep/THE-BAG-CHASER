export type MarketType = 'NORMAL' | 'RECESSION' | 'BULL_MARKET' | 'CRACKDOWN';

export type HustleID =
  | 'labor'
  | 'delivery'
  | 'survey'
  | 'plasma'
  | 'techFlip'
  | 'vintage'
  | 'smm'
  | 'gig'
  | 'sw'
  | 'drop';

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
  hustleFatigue: Record<HustleID, number>;
  plasmaUsedThisMonth: boolean;
  techInventory: { raw: number; refined: number };
  vintageInventoryValue: number;
  runnerCount: number;
  clientCount: number;
  clientCrisis: boolean;
  runnerBurnout: boolean;
  swCooldownTurns: number;
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
  unlockedHustles: Record<HustleID, boolean>;
  marketType: MarketType;
  fatalCause: string | null;

  // Base Actions
  setPh: (ph: GameState['ph']) => void;
  setTab: (tab: string) => void;
  adv: (intervals?: number) => void;

  // Mud Tier Hustles
  rLabor: () => void;
  rDelivery: () => void;
  rSurvey: () => void;
  rPlasma: () => void;
  rTechFlip: () => void;
  rVintage: () => void;
  rSmm: () => void;
  rGig: () => void;
  rSw: () => void;
  rDrop: () => void;

  // Advanced Hustle Actions
  sourceTechPallet: () => void;
  repairTech: () => void;
  sellTech: () => void;
  buyVintageStock: () => void;
  recruitRunner: () => void;
  payRunnerBonus: () => void;
  signSmmClient: () => void;
  resolveClientCrisis: () => void;
  escapeTheMud: () => void;
}
