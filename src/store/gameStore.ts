import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from './types';
import { getInitialGameState } from './initialState';
import { createMudSlice } from './slices/mudSlice';
import { createStreetSlice } from './slices/streetSlice';
import { createStartupSlice } from './slices/startupSlice';
import { applyAdvancement } from './engine';
import { MASTER_HUSTLE_REGISTRY } from '../engine/hustleRegistry';

const SAVE_KEY = 'bag-chaser-state';

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...(getInitialGameState() as GameState),
      ph: 'PROLOGUE_INTRO',

      setPh: (ph) => set({ ph }),

      setTab: (tab) => set({ tab }),

      setActiveTab: (activeTab) => set({ activeTab }),

      setActiveHustleView: (activeHustleView) => set({ activeHustleView }),

      adv: (intervals = 1) => set((state) => applyAdvancement(state, intervals)),

      runHustle: (hustleId: string) =>
        set((state) => {
          const config = MASTER_HUSTLE_REGISTRY.find((h) => h.id === hustleId);
          if (!config) return {};

          // 1. Validation Logic
          if (state.pl.bag < config.upfrontCost) {
            return { news: [`INSUFFICIENT FUNDS: Need $${config.upfrontCost.toLocaleString()} to execute ${config.name}.`, ...state.news] };
          }
          if (state.pl.clout < config.cloutReq) {
            return { news: [`LACK OF CLOUT: Need ${config.cloutReq} Clout to pull off ${config.name}.`, ...state.news] };
          }

          // Special check for Plasma
          if (hustleId === 'plasma' && state.pl.plasmaUsedThisMonth) {
             return { news: ["MEDICAL LIMIT: You can only sell plasma once per month.", ...state.news] };
          }

          // Special check for Cooldowns (SW/Drop)
          if ((hustleId === 'sw' || hustleId === 'drop') && state.pl.swCooldownTurns > 0) {
            return { news: ["COOLDOWN: You need to wait for the hype to rebuild before another drop.", ...state.news] };
          }

          // 2. Base Rewards & Penalties
          const nextPl = {
            ...state.pl,
            bag: state.pl.bag - config.upfrontCost + config.yieldCash,
            clout: Math.min(state.pl.maxClout, Math.max(0, state.pl.clout + config.yieldClout)),
            aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + config.yieldAura)),
            mentalHealth: Math.min(state.pl.maxMentalHealth, Math.max(0, state.pl.mentalHealth + config.hitMental)),
            heat: Math.min(100, Math.max(0, state.pl.heat + config.hitHeat)),
            hustleFatigue: {
              ...state.pl.hustleFatigue,
              [hustleId]: (state.pl.hustleFatigue[hustleId] || 0) + config.fatigueCost
            }
          };

          // 3. Increment specialized stats
          const nextStreet = { ...nextPl.streetStats };
          const nextStartup = { ...nextPl.startupStats };

          if (hustleId === 'cc') nextStreet.ccSubs += 1000;
          if (hustleId === 'pod') nextStreet.podEpisodes += 1;
          if (hustleId === 'music') nextStreet.audioTracks += 1;
          if (hustleId === 'drip') nextStreet.dripStock += 10;
          if (hustleId === 'meme') nextStreet.activeMemeTokens += 1;
          if (hustleId === 'saas_mvp') nextStartup.saasUsers += 500;
          if (hustleId === 'agency_scale') nextStartup.agencyStaff += 1;
          if (hustleId === 'ecom_brand') nextStartup.ecomOrders += 200;

          if (hustleId === 'plasma') nextPl.plasmaUsedThisMonth = true;
          if (hustleId === 'sw' || hustleId === 'drop') nextPl.swCooldownTurns = 3;

          nextPl.streetStats = nextStreet;
          nextPl.startupStats = nextStartup;

          const nextState: GameState = {
            ...state,
            pl: nextPl,
            news: [`EXECUTED: ${config.name}. ${config.description}`, ...state.news],
          };

          return applyAdvancement(nextState, 1);
        }),

      ...createMudSlice(set),
      ...createStreetSlice(set),
      ...createStartupSlice(set),
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
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ph, ...rest } = state;
        return rest;
      },
    }
  )
);
