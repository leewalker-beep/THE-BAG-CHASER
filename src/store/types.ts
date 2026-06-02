export type MarketType = 'NORMAL' | 'RECESSION' | 'BULL_MARKET' | 'CRACKDOWN';

export type HustleID = string;

export interface CrisisState {
  shadowbanTurns: number;       // Halves all Clout generation across Mud/Street if > 0
  deadstockOverhead: number;    // Compounding dollar fee added straight to monthly rent burn rate
  accountsFrozen: boolean;      // If true, completely blocks buying upgrades or unlocking tabs until cleared
  blacklistTurns: number;       // Locks the player out of executing Elite/Mogul operations if > 0
  laborStrikeTurns: number;     // If > 0, completely halts cash generation from all Corporate level operations
}

export interface PlayerStats {
  name: string;
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
  currentTier: GameTab;
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
    studioOwned: boolean;
  };
  assetsOwned: {
    vendingMachines: number;
    masterTracks: number;
  };
  startupStats: {
    saasUsers: number;
    agencyStaff: number;
    ecomOrders: number;
  };
  saasPanel: {
    infra: 'AWS' | 'DEVOPS' | 'ENTERPRISE';
    focus: 'GROWTH' | 'PATCH';
    subscriptionPrice: number;
  };
  festivalPanel: {
    venue: 'TOUR' | 'CIRCUIT' | 'SATURATION';
    insured: boolean;
    ticketPrice: number;
  };
  ecomBrandPanel: {
    runSize: 5000 | 25000;
    adSpend: number;
  };
  agencyPanel: {
    client: 'SMB' | 'MID' | 'ENTERPRISE';
    staff: 'INTERNS' | 'FREELANCERS';
  };
  franchisePanel: {
    sector: 'FAST_FOOD' | 'WELLNESS' | 'LOGISTICS';
    footprint: number;
    supplyChain: 'OUTSOURCED' | 'INTEGRATED';
  };
  streetwearPanel: {
    brandTier: 'UNDERGROUND_IP' | 'SOHO_STORE' | 'PARIS_RUNWAY';
  };
  hypeIsActive: boolean;
  lastExecutedHustleId: string | null;
  streak: number;
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
  setPlayerName: (name: string) => void;
  setTab: (tab: string) => void;
  setActiveTab: (tab: GameTab) => void;
  setActiveHustleView: (hustleId: string | null) => void;
  adv: (intervals?: number) => void;
  deductCostAndRollOutcome: (hustleId: string, forceSuccess?: boolean) => void;
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
  setSaaSInput: (field: string, value: any) => void;
  executeSaaSProject: () => void;
  setFestivalInput: (field: string, value: any) => void;
  executeConcertFestival: () => void;
  setEcomBrandInput: (field: string, value: any) => void;
  executeEcomBrand: () => void;
  setAgencyInput: (field: string, value: any) => void;
  executeAgencyRetainer: () => void;
  setFranchiseInput: (field: string, value: any) => void;
  executeFranchiseTurn: () => void;
  setStreetwearInput: (field: string, value: any) => void;
  executeStreetwearRun: () => void;
  setCurrentTier: (tierName: GameTab, fee?: number) => void;
}
