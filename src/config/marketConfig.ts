import type { MarketType } from '../store/types';

export interface MarketConfig {
  name: string;
  description: string;
  expenseMultiplier: number;
  yieldMultiplier: number;
  heatMultiplier: number;
}

export const MARKET_CONFIGS: Record<MarketType, MarketConfig> = {
  NORMAL: {
    name: 'Normal Economy',
    description: 'The grind continues as usual.',
    expenseMultiplier: 1.0,
    yieldMultiplier: 1.0,
    heatMultiplier: 1.0,
  },
  RECESSION: {
    name: 'Recession',
    description: 'Double expenses, half yields. The mud gets deeper.',
    expenseMultiplier: 2.0,
    yieldMultiplier: 0.5,
    heatMultiplier: 1.0,
  },
  BULL_MARKET: {
    name: 'Bull Market',
    description: 'Everything is pumping. Easy money.',
    expenseMultiplier: 1.0,
    yieldMultiplier: 1.5,
    heatMultiplier: 1.0,
  },
  CRACKDOWN: {
    name: 'Crackdown',
    description: 'Feds are watching. Heat accumulation doubled.',
    expenseMultiplier: 1.0,
    yieldMultiplier: 1.0,
    heatMultiplier: 2.0,
  },
};
