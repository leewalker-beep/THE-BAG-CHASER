import type { GameState, HustleID } from './types';

export const getInitialGameState = (diff: 1 | 2 | 3 = 3): Omit<GameState, 'setPh' | 'setTab' | 'adv' | 'rLabor' | 'rDelivery' | 'rSurvey' | 'rPlasma' | 'rTechFlip' | 'rVintage' | 'rSmm' | 'rGig' | 'rSw' | 'rDrop'> => {
  const allHustles: HustleID[] = [
    'labor', 'delivery', 'survey', 'plasma', 'techFlip', 'vintage', 'smm', 'gig', 'sw', 'drop'
  ];

  const initialFatigue = allHustles.reduce((acc, hustle) => {
    acc[hustle] = 0;
    return acc;
  }, {} as Record<HustleID, number>);

  const initialUnlocked = allHustles.reduce((acc, hustle) => {
    acc[hustle] = false;
    return acc;
  }, {} as Record<HustleID, boolean>);

  let startingBag = 1000;
  let startingClout = 5;
  let startingAura = 5;

  if (diff === 1) { // Trust Fund
    startingBag = 25000;
    startingClout = 30;
    startingAura = 30;
    allHustles.forEach(h => initialUnlocked[h] = true);
  } else if (diff === 2) { // Middle Grind
    startingBag = 5000;
    startingClout = 15;
    startingAura = 15;
    ['labor', 'delivery', 'survey', 'plasma', 'techFlip', 'vintage'].forEach(h => initialUnlocked[h as HustleID] = true);
  } else { // Grinder (diff 3)
    ['labor', 'delivery', 'survey', 'plasma'].forEach(h => initialUnlocked[h as HustleID] = true);
  }

  return {
    ph: 'PROLOGUE',
    tab: 'STREET',
    alias: '',
    diff,
    pl: {
      bag: startingBag,
      mentalHealth: 100,
      maxMentalHealth: 100,
      aura: startingAura,
      maxAura: 100,
      clout: startingClout,
      maxClout: 100,
      heat: 0,
      mo: 0,
      tier: 0,
      hustleFatigue: initialFatigue,
      plasmaUsedThisMonth: false,
    },
    modifiers: {
      expenseBurnMultiplier: 1.0,
      incomeMultiplier: 1.0,
      stressRiskModifier: 1.0,
    },
    news: [],
    lastProcessedTimestamp: Date.now(),
    unlockedHustles: initialUnlocked,
    marketType: 'NORMAL',
    fatalCause: null,
  };
};
