import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState, HustleID, MarketType } from './types';
import { getInitialGameState } from './initialState';
import { createMudSlice } from './slices/mudSlice';
import { MARKET_CONFIGS } from '../engine/worldMarkets';

const SAVE_KEY = 'bag-chaser-state';

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...getInitialGameState() as GameState,

      setPh: (ph) => set({ ph }),

      setTab: (tab) => set({ tab }),

      adv: (intervals = 1) => set((state) => {
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
          const baseExpense = 500;
          const marketMultiplier = MARKET_CONFIGS[currentMarket].expenseMultiplier;
          currentPl.bag -= (baseExpense * marketMultiplier);

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
      }),

      ...createMudSlice(set),
    }),
    {
      name: SAVE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            JSON.parse(str);
            return str;
          } catch (e) {
            console.error("Storage corruption detected, clearing key", e);
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
    }
  )
);
