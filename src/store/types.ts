export type MarketType = 'NORMAL' | 'RECESSION' | 'BULL_MARKET' | 'CRACKDOWN';

export type HustleID = string;

export interface CrisisState {
  shadowbanTurns: number;       // Halves all Clout generation across Mud/Street if > 0
  deadstockOverhead: number;    // Compounding dollar fee added straight to monthly rent burn rate
  accountsFrozen: boolean;      // If true, completely blocks buying upgrades or unlocking tabs until cleared
  blacklistTurns: number;       // Locks the player out of executing Elite/Mogul operations if > 0
}

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
  hustleLevels: Record<HustleID, number>;
  plasmaUsedThisMonth: boolean;
  techInventory: { raw: number; refined: number };
  vintageInventoryValue: number;
  runnerCount: number;
  clientCount: number;
  clientCrisis: boolean;
  runnerBurnout: boolean;
  swCooldownTurns: number;
  swPanelState: {
    selectedBatchSize: number;
    selectedQuality: 'BUDGET' | 'PREMIUM' | 'LUXURY';
    retailPrice: number;
    warehouseBrickedStock: number;
  };
  techFlipPanel: {
    selectedLot: 'PHONES' | 'LAPTOPS' | 'RIGS';
    toolQuality: 'BUDGET' | 'PRECISION';
    listingPrice: number;
  };
  podcastPanel: {
    selectedGuest: 'LOCAL' | 'MICRO' | 'ICON';
    unhingedSlider: number;
  };
  streetStats: {
    ccSubs: number;
    podEpisodes: number;
    audioTracks: number;
    dripStock: number;
    activeMemeTokens: number;
  };
  startupStats: {
    saasUsers: number;
    agencyStaff: number;
    ecomOrders: number;
  };
  crises: CrisisState;
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
  unlockedHustles: Record<string, boolean>;
  marketType: MarketType;
  fatalCause: string | null;

  // Base Actions
  setPh: (ph: GameState['ph']) => void;
  setTab: (tab: string) => void;
  setActiveTab: (tab: GameTab) => void;
  setActiveHustleView: (hustleId: string | null) => void;
  adv: (intervals?: number) => void;
  runHustle: (hustleId: string) => void;
  upgradeHustle: (hustleId: string) => void;
  unfreezeAccounts: () => void;

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
  setSwInput: (field: string, value: any) => void;
  executeStreetwearDrop: () => void;
  setTechFlipInput: (field: string, value: any) => void;
  executeTechFlipDrop: () => void;
  setPodcastInput: (field: string, value: any) => void;
  executePodcastEpisode: () => void;
}
