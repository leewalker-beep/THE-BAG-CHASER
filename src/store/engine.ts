import type { GameState, HustleID, MarketType } from './types';
import { MARKET_CONFIGS } from '../engine/worldMarkets';
import { PROGRESSION_MATRIX } from '../engine/progressionMatrix';
import { FLEX_ITEMS_REGISTRY } from '../engine/flexRegistry';

export const applyAdvancement = (state: GameState, intervals: number = 1): Partial<GameState> => {
  const currentPl = { ...state.pl };
  const currentNews = [...state.news];
  let currentMarket = state.marketType;
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

    // 2. Apply Baseline Expenses
    let baseExpense = 500;
    if (currentPl.tier > 0) {
      const milestone = PROGRESSION_MATRIX[currentPl.tier - 1];
      if (milestone) {
        baseExpense = milestone.newExpenses;
      } else {
        // Fallback for tiers beyond what's currently in the matrix
        baseExpense = 10000 + (currentPl.tier * 5000);
      }
    }
    const marketMultiplier = MARKET_CONFIGS[currentMarket].expenseMultiplier;
    currentPl.bag -= (baseExpense * marketMultiplier);

    // 2a. Flex Upkeep
    currentPl.ownedFlexIds.forEach(id => {
      const item = FLEX_ITEMS_REGISTRY.find(f => f.id === id);
      if (item) {
        currentPl.bag -= item.monthlyUpkeep;
      }
    });

    // 2b. Passive Income & Risks
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

    // Reset monthly flags
    currentPl.mo += 1;
    currentPl.plasmaUsedThisMonth = false;

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

  return {
    pl: currentPl,
    news: currentNews.slice(0, 50), // Keep news log manageable
    marketType: currentMarket,
    ph: currentPh,
    fatalCause: currentFatalCause,
    lastProcessedTimestamp: Date.now()
  };
};
