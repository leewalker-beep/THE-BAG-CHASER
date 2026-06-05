import type { GameState, HustleID, MarketType } from '../store/types';
import { MARKET_CONFIGS } from '../config/marketConfig';
import { useJuiceStore } from '../store/juiceStore';

export const applyAdvancement = (state: GameState, intervals: number = 1): Partial<GameState> => {
  const currentPl = { ...state.pl };
  const currentNews = [...state.news];
  let currentMarket = state.currentMarket;
  let currentPh = state.ph;
  let currentFatalCause = state.fatalCause;

  for (let i = 0; i < intervals; i++) {
    if (currentPh === 'POST_MORTEM') break;

    // 1. Decay Fatigue
    const newFatigue = { ...currentPl.hustleFatigue };
    (Object.keys(newFatigue) as HustleID[]).forEach(h => {
      newFatigue[h] = Math.max(0, newFatigue[h] - 20);
    });
    currentPl.hustleFatigue = newFatigue;

    // 2. Financials & Ledger calculation
    let tierRent = 500;
    if (currentPl.tier === 1) tierRent = 1200;
    if (currentPl.tier === 2) tierRent = 3500;
    if (currentPl.tier >= 3) tierRent = 10000;

    const marketMultiplier = MARKET_CONFIGS[currentMarket].expenseMultiplier;
    const totalMonthlyRent = (tierRent * marketMultiplier) + currentPl.crises.deadstockOverhead;

    const vendingYield = (currentPl.assetsOwned?.vendingMachines || 0) * 250;
    const musicYield = (currentPl.assetsOwned?.masterTracks || 0) * 150;

    let treePassiveYield = 0;
    Object.values(currentPl.treePassiveYields).forEach(val => {
      treePassiveYield += val;
    });

    const totalPassiveYield = vendingYield + musicYield + (currentPl.passiveLaborYield || 0) + treePassiveYield;

    currentPl.bag += totalPassiveYield;
    currentPl.bag -= totalMonthlyRent;

    const netChange = totalPassiveYield - totalMonthlyRent;
    currentNews.unshift(`[LEDGER] Passive Yield: +$${totalPassiveYield.toLocaleString()} | Tier Rent: -$${totalMonthlyRent.toLocaleString()} | Net: ${netChange >= 0 ? '+' : ''}$${netChange.toLocaleString()}`);

    // 2b. Passive Income & Risks (Legacy & Special)
    // Vintage Liquidation
    if (currentPl.vintageInventoryValue > 0) {
      const liquidatingAmount = currentPl.vintageInventoryValue * 0.15;
      currentPl.bag += (liquidatingAmount * 1.4);
      currentPl.vintageInventoryValue -= liquidatingAmount;
    }

    // GIG (Runner Fleet)
    if (currentPl.runnerCount > 0) {
      currentPl.bag += (currentPl.runnerCount * 150);

      // Burnout Risk
      if (Math.random() < 0.15) {
        currentPl.runnerBurnout = true;
        currentPl.bag -= 500;
        currentPl.clout = Math.max(0, currentPl.clout - 10);
        currentNews.unshift("RUNNER BURNOUT: Your fleet is exhausted. Operations hit with $500 penalty and major clout loss.");
      }
    }

    // SMM (Social Media Agency)
    if (currentPl.clientCount > 0) {
      // Churn Check (Before income)
      if (currentPl.clientCrisis) {
        currentPl.clientCount = Math.max(0, currentPl.clientCount - 1);
      }

      currentPl.bag += (currentPl.clientCount * 300);

      // Crisis Risk
      if (Math.random() < 0.20) {
        currentPl.clientCrisis = true;
      }
    }

    // Cooldown Decay
    if (currentPl.swCooldownTurns > 0) {
      currentPl.swCooldownTurns -= 1;
    }

    // Crisis Turn Counters
    if (currentPl.crises.shadowbanTurns > 0) {
      currentPl.crises.shadowbanTurns -= 1;
      if (currentPl.crises.shadowbanTurns === 0) {
        if (!currentPl.stats.unlockedAchievements.includes('Shadowban Survivor')) {
          currentPl.stats.unlockedAchievements.push('Shadowban Survivor');
        }
      }
    }
    if (currentPl.crises.blacklistTurns > 0) {
      currentPl.crises.blacklistTurns -= 1;
    }
    if (currentPl.crises.laborStrikeTurns > 0) {
      currentPl.crises.laborStrikeTurns -= 1;
    }

    // Reset monthly flags
    currentPl.mo += 1;
    currentPl.plasmaUsedThisMonth = false;

    // Apply Global Crisis Filters
    if (currentPl.crises.shadowbanTurns > 0) {
       const cloutGain = currentPl.clout - state.pl.clout;
       if (cloutGain > 0) {
          currentPl.clout = Math.max(0, state.pl.clout + Math.floor(cloutGain * 0.5));
       }
    }

    // 3. Random Market Shifts
    if (Math.random() < 0.15) {
      const markets: MarketType[] = ['NORMAL', 'RECESSION', 'BULL_MARKET', 'CRACKDOWN'];
      const nextMarket = markets[Math.floor(Math.random() * markets.length)];
      if (nextMarket !== currentMarket) {
        currentMarket = nextMarket;
        currentNews.unshift(`ECONOMIC SHIFT: The world has entered a ${MARKET_CONFIGS[currentMarket].name}. ${MARKET_CONFIGS[currentMarket].description}`);
      }
    }

    // 4. The Sanity Check Interceptor
    if (currentPl.bag < 0) {
      currentPh = 'POST_MORTEM';
      currentFatalCause = 'INDICTMENT: Bankrupted and liquidated by the feds.';
    } else if (currentPl.mentalHealth <= 0) {
      currentPh = 'POST_MORTEM';
      currentFatalCause = 'AUTOPSY: Total mental and physical collapse under the grind.';
    } else if (currentPl.aura <= 0 || currentPl.clout <= 0) {
      currentPh = 'POST_MORTEM';
      currentFatalCause = 'CANCELLATION: Permanently erased from the cultural matrix.';
    }
  }

  useJuiceStore.getState().checkAndTriggerVFX(state.pl.bag, currentPl.bag);

  return {
    pl: currentPl,
    news: currentNews.slice(0, 50), // Keep news log manageable
    currentMarket: currentMarket,
    ph: currentPh,
    fatalCause: currentFatalCause,
    lastProcessedTimestamp: Date.now()
  };
};
