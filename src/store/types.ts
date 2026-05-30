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
  ownedFlexIds: string[];
}

export interface GlobalModifiers {
  expenseBurnMultiplier: number;
  incomeMultiplier: number;
  stressRiskModifier: number;
}

export type GameTab = 'MUD' | 'STREET' | 'STARTUP' | 'CORPORATE' | 'FLEX1' | 'ELITE' | 'MOGUL' | 'FLEX2' | 'PRESIDENT' | 'OPEN' | 'EXP';

export const TAB_TIER_MAPPING: Record<GameTab, number> = {
  MUD: 0,
  STREET: 1,
  STARTUP: 2,
  CORPORATE: 3,
  FLEX1: 4,
  ELITE: 5,
  MOGUL: 6,
  FLEX2: 7,
  PRESIDENT: 8,
  OPEN: 9,
  EXP: 10,
};

export interface GameState {
  ph: 'PROLOGUE' | 'PROLOGUE_INTRO' | 'PLAYING' | 'POST_MORTEM' | 'LEADERBOARD';
  tab: string;
  activeTab: GameTab;
  activeHustleView: string | null;
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
  setActiveTab: (tab: GameTab) => void;
  setActiveHustleView: (hustleId: string | null) => void;
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
  performUpgrade: () => void;
  buyFlexItem: (itemId: string) => void;
}
