import type { GameState } from './types';

export const getInitialGameState = (): Omit<GameState, 'setPh' | 'setTab' | 'adv'> => ({
  ph: 'PROLOGUE',
  tab: 'STREET',
  alias: '',
  diff: 1,
  pl: {
    bag: 0,
    mentalHealth: 100,
    maxMentalHealth: 100,
    aura: 0,
    maxAura: 100,
    clout: 0,
    maxClout: 100,
    heat: 0,
    mo: 0,
    tier: 0,
  },
  modifiers: {
    expenseBurnMultiplier: 1.0,
    incomeMultiplier: 1.0,
    stressRiskModifier: 1.0,
  },
  news: [],
  lastProcessedTimestamp: Date.now(),
});
