export interface FlexAssetConfig {
  id: string;
  name: string;
  cost: number;
  icon: string;
  maxCloutBoost?: number;
  maxAuraBoost?: number;
  maxMentalHealthBoost?: number;
  passiveMonthlyYield?: number;
}

export const FLEX_ASSETS: FlexAssetConfig[] = [
  {
    id: 'vintage_watch',
    name: 'Vintage Watch',
    cost: 10000,
    icon: '⌚',
    maxCloutBoost: 5,
  },
  {
    id: 'sports_car',
    name: 'Sports Car',
    cost: 50000,
    icon: '🏎️',
    maxAuraBoost: 10,
  },
  {
    id: 'yacht',
    name: 'Yacht',
    cost: 500000,
    icon: '🛥️',
    maxCloutBoost: 25,
    maxAuraBoost: 25,
    passiveMonthlyYield: 10000,
  },
  {
    id: 'penthouse',
    name: 'Penthouse',
    cost: 1000000,
    icon: '🏙️',
    maxCloutBoost: 50,
    maxAuraBoost: 50,
    passiveMonthlyYield: 25000,
  },
  {
    id: 'private_jet',
    name: 'Private Jet',
    cost: 5000000,
    icon: '🛩️',
    maxCloutBoost: 100,
    maxAuraBoost: 100,
    passiveMonthlyYield: 50000,
  },
  {
    id: 'island_resort',
    name: 'Island Resort',
    cost: 25000000,
    icon: '🏝️',
    maxCloutBoost: 250,
    maxAuraBoost: 250,
    maxMentalHealthBoost: 50,
    passiveMonthlyYield: 100000,
  },
  {
    id: 'sports_franchise',
    name: 'Sports Franchise',
    cost: 100000000,
    icon: '🏟️',
    maxCloutBoost: 500,
    maxAuraBoost: 500,
    passiveMonthlyYield: 500000,
  },
  {
    id: 'media_empire',
    name: 'Media Empire',
    cost: 500000000,
    icon: '🎙️',
    maxCloutBoost: 1000,
    maxAuraBoost: 1000,
    passiveMonthlyYield: 2500000,
  },
];
