import type { GameState, HustleID } from './types';

export const getInitialGameState = (diff: 1 | 2 | 3 = 3): Omit<GameState, 'setPh' | 'setTab' | 'setActiveTab' | 'setActiveHustleView' | 'adv' | 'runHustle' | 'upgradeHustle' | 'rLabor' | 'rDelivery' | 'rSurvey' | 'rPlasma' | 'rTechFlip' | 'rVintage' | 'rSmm' | 'rGig' | 'rSw' | 'rDrop' | 'sourceTechPallet' | 'repairTech' | 'sellTech' | 'buyVintageStock' | 'recruitRunner' | 'payRunnerBonus' | 'signSmmClient' | 'resolveClientCrisis' | 'escapeTheMud' | 'runCreatorContent' | 'runPodcastSyndicate' | 'runMusicSyndicate' | 'runDripLabel' | 'runNightPromo' | 'runMemeDev' | 'runSaasMvp' | 'runAgencyScale' | 'runEcomBrand'> => {
  const allHustles: string[] = [
    'labor', 'delivery', 'survey', 'plasma', 'techFlip', 'vintage', 'smm', 'gig', 'sw', 'drop',
    'cc', 'pod', 'music', 'drip', 'promo', 'meme',
    'saas_mvp', 'agency_scale', 'ecom_brand'
  ];

  const initialFatigue = allHustles.reduce((acc, hustle) => {
    acc[hustle] = 0;
    return acc;
  }, {} as Record<string, number>);

  const initialLevels = allHustles.reduce((acc, hustle) => {
    acc[hustle] = 1;
    return acc;
  }, {} as Record<string, number>);

  const initialUnlocked = allHustles.reduce((acc, hustle) => {
    acc[hustle] = false;
    return acc;
  }, {} as Record<string, boolean>);

  let startingBag = 1000;
  let startingClout = 5;
  let startingAura = 5;

  let startingTier = 0;

  if (diff === 1) {
    // Level 1: Trust Fund - ALL 10 mud tier hustles unlocked immediately
    startingBag = 25000;
    startingClout = 30;
    startingAura = 30;
    startingTier = 1;
    allHustles.forEach((h) => (initialUnlocked[h] = true));
  } else if (diff === 2) {
    startingBag = 5000;
    startingClout = 15;
    startingAura = 15;
    ['labor', 'delivery', 'survey', 'plasma', 'techFlip', 'vintage'].forEach(h => initialUnlocked[h as HustleID] = true);
  } else { // Grinder (diff 3)
    ['labor', 'delivery', 'survey', 'plasma'].forEach(h => initialUnlocked[h as HustleID] = true);
  }

  return {
    ph: 'PLAYING',
    tab: startingTier === 1 ? 'STREET' : 'MUD',
    activeTab: startingTier === 1 ? 'STREET' : 'MUD',
    activeHustleView: null,
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
      tier: startingTier,
      hustleFatigue: initialFatigue,
      hustleLevels: initialLevels,
      plasmaUsedThisMonth: false,
      techInventory: { raw: 0, refined: 0 },
      vintageInventoryValue: 0,
      runnerCount: 0,
      clientCount: 0,
      clientCrisis: false,
      runnerBurnout: false,
      swCooldownTurns: 0,
      streetStats: {
        ccSubs: 0,
        podEpisodes: 0,
        audioTracks: 0,
        dripStock: 0,
        activeMemeTokens: 0,
      },
      startupStats: {
        saasUsers: 0,
        agencyStaff: 0,
        ecomOrders: 0,
      },
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
