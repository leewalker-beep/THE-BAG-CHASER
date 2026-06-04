import type { GameState, HustleID } from './types';

export const getInitialGameState = (diff: 1 | 2 | 3 = 3): Omit<GameState, 'setPh' | 'setPlayerName' | 'setTab' | 'setActiveTab' | 'setActiveHustleView' | 'setMarket' | 'adv' | 'deductCostAndRollOutcome' | 'upgradeHustle' | 'upgradeHustleNode' | 'upgradeHustleLevel' | 'purchaseHustleUpgrade' | 'unfreezeAccounts' | 'resolveBlacklist' | 'resolveShadowban' | 'resolveLaborStrike' | 'sourceTechPallet' | 'repairTech' | 'sellTech' | 'buyVintageStock' | 'recruitRunner' | 'payRunnerBonus' | 'signSmmClient' | 'resolveClientCrisis' | 'escapeTheMud' | 'setSwInput' | 'executeStreetwearDrop' | 'setTechFlipInput' | 'setPodcastInput' | 'setSaaSInput' | 'executeSaaSProject' | 'setFestivalInput' | 'executeConcertFestival' | 'setEcomBrandInput' | 'executeEcomBrand' | 'setAgencyInput' | 'executeAgencyRetainer' | 'setFranchiseInput' | 'setStreetwearInput' | 'setLaborInput' | 'setDeliveryInput' | 'setCurrentTier'> => {
  const allHustles: string[] = [
    'r_labor', 'r_delivery', 'r_survey', 'r_plasma', 'r_scrap', 'r_vending',
    'r_flyers', 'r_pr_campaign', 'r_ghost_mode',
    'cc', 'pod', 'audio', 'drop', 'vintage', 'promo',
    'techFlip', 'smm', 'gig', 'sw', 'drip', 'meme',
    'saas_mvp', 'agency_scale', 'ecom_brand', 'festival', 'global_franchise'
  ];

  const initialFatigue = allHustles.reduce((acc, hustle) => {
    acc[hustle] = 0;
    return acc;
  }, {} as Record<string, number>);

  const initialLevels = allHustles.reduce((acc, hustle) => {
    acc[hustle] = 1;
    return acc;
  }, {} as Record<string, number>);

  const initialNodeIds = allHustles.reduce((acc, hustle) => {
    acc[hustle] = 'l1';
    return acc;
  }, {} as Record<string, string>);

  const initialTreePassiveYields = allHustles.reduce((acc, hustle) => {
    acc[hustle] = 0;
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
    // Level 1: Trust Fund
    startingBag = 25000;
    startingClout = 30;
    startingAura = 30;
    startingTier = 1;
    allHustles.forEach((h) => (initialUnlocked[h] = true));
  } else if (diff === 2) {
    startingBag = 5000;
    startingClout = 15;
    startingAura = 15;
    ['r_labor', 'r_delivery', 'r_survey', 'r_plasma', 'r_scrap', 'drop', 'vintage'].forEach(h => initialUnlocked[h as HustleID] = true);
  } else { // Grinder (diff 3)
    ['r_labor', 'r_delivery', 'r_survey', 'r_plasma', 'r_scrap'].forEach(h => initialUnlocked[h as HustleID] = true);
  }

  return {
    ph: 'PLAYING',
    tab: startingTier === 1 ? 'STREET' : 'MUD',
    activeTab: startingTier === 1 ? 'STREET' : 'MUD',
    activeHustleView: null,
    alias: '',
    diff,
    pl: {
      // SECURE THE INITIAL STATE FALLBACK: Always ensure name is a string
      name: '',
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
      currentTier: startingTier === 1 ? 'STREET' : 'MUD',
      hustleFatigue: initialFatigue,
      hustleLevels: initialLevels,
      hustleNodeIds: initialNodeIds,
      treePassiveYields: initialTreePassiveYields,
      plasmaUsedThisMonth: false,
      techInventory: { raw: 0, refined: 0 },
      vintageInventoryValue: 0,
      runnerCount: 0,
      clientCount: 0,
      clientCrisis: false,
      runnerBurnout: false,
      swCooldownTurns: 0,
      swPanelState: {
        selectedBatchSize: 50,
        selectedQuality: 'BUDGET',
        retailPrice: 50,
        warehouseBrickedStock: 0,
      },
      techFlipPanel: {
        selectedLot: 'PHONES',
        toolQuality: 'BUDGET',
        listingPrice: 300,
      },
      podcastPanel: {
        selectedGuest: 'LOCAL',
        unhingedSlider: 1,
      },
      streetStats: {
        ccSubs: 0,
        podEpisodes: 0,
        audioTracks: 0,
        dripStock: 0,
        activeMemeTokens: 0,
        studioOwned: false,
      },
      passiveLaborYield: 0,
      assetsOwned: {
        vendingMachines: 0,
        masterTracks: 0,
      },
      startupStats: {
        saasUsers: 0,
        agencyStaff: 0,
        ecomOrders: 0,
      },
      saasPanel: {
        infra: 'AWS',
        focus: 'GROWTH',
        subscriptionPrice: 20,
      },
      festivalPanel: {
        venue: 'TOUR',
        insured: false,
        ticketPrice: 500,
      },
      ecomBrandPanel: {
        runSize: 5000,
        adSpend: 50000,
      },
      agencyPanel: {
        client: 'SMB',
        staff: 'INTERNS',
      },
      franchisePanel: {
        sector: 'FAST_FOOD',
        footprint: 1,
        supplyChain: 'OUTSOURCED',
      },
      streetwearPanel: {
        brandTier: 'UNDERGROUND_IP',
      },
      laborPanel: {
        activeTab: 1,
        weeks: 1,
        propertyType: 'STUDIO',
        budget: 'ECONOMY',
        action: 'FLIP',
      },
      deliveryPanel: {
        activeTab: 1,
        weeks: 1,
        fleetType: 'E-BIKE',
        wageLevel: 'BALANCED',
      },
      hypeIsActive: false,
      lastExecutedHustleId: null,
      streak: 0,
      crises: {
        shadowbanTurns: 0,
        deadstockOverhead: 0,
        accountsFrozen: false,
        blacklistTurns: 0,
        laborStrikeTurns: 0,
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
    currentMarket: 'NORMAL',
    fatalCause: null,
    promotionNotified: {},
  };
};
