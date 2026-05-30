export interface TierMilestone {
  fromTier: string;
  toTier: string;
  actionLabel: string;
  cashCost: number;
  cloutReq: number;
  auraReq: number;
  newExpenses: number;
}

export const PROGRESSION_MATRIX: TierMilestone[] = [
  {
    fromTier: 'MUD',
    toTier: 'STREET',
    actionLabel: 'Sign HQ Lease',
    cashCost: 3000,
    cloutReq: 20,
    auraReq: 20,
    newExpenses: 1200,
  },
  {
    fromTier: 'STREET',
    toTier: 'STARTUP',
    actionLabel: 'Incorporate Entity',
    cashCost: 15000,
    cloutReq: 80,
    auraReq: 50,
    newExpenses: 3500,
  },
  {
    fromTier: 'STARTUP',
    toTier: 'CORPORATE',
    actionLabel: 'Series A Funding',
    cashCost: 75000,
    cloutReq: 250,
    auraReq: 150,
    newExpenses: 10000,
  },
];
