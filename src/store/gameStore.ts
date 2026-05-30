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

      unfreezeAccounts: () => set((state) => {
        if (state.pl.bag < 5000) {
          return { news: ["INSUFFICIENT FUNDS: Need $5,000 to retain legal counsel and unfreeze accounts.", ...state.news] };
        }
        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - 5000,
            crises: { ...state.pl.crises, accountsFrozen: false }
          },
          news: ["SYSTEM: Legal retainer paid. Corporate accounts have been UNFROZEN.", ...state.news]
        };
      }),

      upgradeHustle: (hustleId: string) =>
        set((state) => {
          if (state.pl.crises.accountsFrozen) {
            return { news: ["ACCOUNTS FROZEN: You cannot perform upgrades until legal issues are resolved.", ...state.news] };
          }
          const currentLvl = state.pl.hustleLevels[hustleId] || 1;
          if (currentLvl >= 3) return {};

          let cost = 0;
          let rankName = "";

          if (hustleId === 'drop') {
            cost = currentLvl === 1 ? 4000 : 12000;
            rankName = currentLvl === 1 ? "Store Phase: Private Wholesaler" : "Chain Phase: Global E-Com Empire";
          } else if (hustleId === 'techFlip') {
            cost = currentLvl === 1 ? 2500 : 8500;
            rankName = currentLvl === 1 ? "Store Phase: Strip-Mall Kiosk" : "Chain Phase: Automated Refurb Plant";
          } else if (hustleId === 'vintage') {
            cost = currentLvl === 1 ? 2000 : 7000;
            rankName = currentLvl === 1 ? "Store Phase: Consignment Boutique" : "Chain Phase: The Luxury Grail Archive";
          } else {
            return {};
          }

          if (state.pl.bag < cost) {
            return { news: [`INSUFFICIENT FUNDS: Need $${cost.toLocaleString()} for upgrade.`, ...state.news] };
          }

          return {
            pl: {
              ...state.pl,
              bag: state.pl.bag - cost,
              hustleLevels: {
                ...state.pl.hustleLevels,
                [hustleId]: currentLvl + 1
              }
            },
            news: [`RANK PROMOTED: ${hustleId.toUpperCase()} is now Level ${currentLvl + 1} (${rankName})`, ...state.news]
          };
        }),

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

          if (state.pl.crises.blacklistTurns > 0 && (config.tier === 'ELITE' || config.tier === 'MOGUL')) {
            return { news: [`BLACKLISTED: You are currently exiled from ${config.tier} circles for ${state.pl.crises.blacklistTurns} more months.`, ...state.news] };
          }

          // Special check for Plasma
          if (hustleId === 'r_plasma' && state.pl.plasmaUsedThisMonth) {
             return { news: ["MEDICAL LIMIT: You can only sell plasma once per month.", ...state.news] };
          }

          // Special check for Cooldowns (SW/Drop/Vintage)
          if ((hustleId === 'sw' || hustleId === 'drop' || hustleId === 'vintage') && state.pl.swCooldownTurns > 0) {
            return { news: ["COOLDOWN: You need to wait for the hype to rebuild before another drop.", ...state.news] };
          }

          // 2. Execution & Mitigation Logic
          const isSuccess = Math.random() < config.successChance;
          const currentLvl = state.pl.hustleLevels[hustleId] || 1;
          let finalYieldCash = isSuccess ? config.yieldCash : 0;
          let finalYieldClout = isSuccess ? config.yieldClout : 0;
          let finalYieldAura = isSuccess ? config.yieldAura : 0;
          let finalHitMental = config.hitMental;

          const currentNews = [...state.news];

          const nextCrises = { ...state.pl.crises };

          if (isSuccess) {
            if (currentLvl > 1) {
              if (hustleId === 'drop') {
                if (currentLvl === 2) finalYieldCash *= 1.8;
                if (currentLvl === 3) finalYieldCash *= 3.5;
              } else if (hustleId === 'techFlip') {
                if (currentLvl === 2) finalYieldCash *= 2.0;
                if (currentLvl === 3) finalYieldCash *= 4.0;
              } else if (hustleId === 'vintage') {
                if (currentLvl === 2) finalYieldCash *= 2.2;
                if (currentLvl === 3) {
                  finalYieldCash = 0;
                  finalYieldAura = 15;
                  finalYieldClout = 10;
                }
              }
            }

            // Shadowban Filter
            if (state.pl.crises.shadowbanTurns > 0 && (config.tier === 'MUD' || config.tier === 'STREET')) {
              finalYieldClout *= 0.5;
            }

            currentNews.unshift(`EXECUTED: ${config.name}. ${config.description}`);
          } else {
            // FAILURE & AURA ARMOR MITIGATION
            if (state.pl.aura >= 100) {
              finalYieldAura = -30;
              currentNews.unshift(`CRISIS MITIGATED: Your high Aura absorbed the public blow. Prevented systemic collapse.`);
            } else {
              finalHitMental *= 2;
              if (config.tier === 'MUD' || config.tier === 'STREET') {
                if (Math.random() < 0.5) {
                  nextCrises.shadowbanTurns = 3;
                } else {
                  nextCrises.deadstockOverhead += 250;
                }
                currentNews.unshift(`CRITICAL FAILURE: Brand integrity shattered! You have been shadowbanned or hit with deadstock fees.`);
              } else if (config.tier === 'STARTUP' || config.tier === 'CORPORATE') {
                nextCrises.accountsFrozen = true;
                currentNews.unshift(`CRITICAL FAILURE: Regulatory audit or broken contract detected. Corporate bank accounts have been FROZEN.`);
              } else if (config.tier === 'ELITE' || config.tier === 'MOGUL') {
                nextCrises.blacklistTurns = 4;
                currentNews.unshift(`CRITICAL FAILURE: Exiled from high-society network circles. You are BLACKLISTED from elite operations.`);
              } else {
                currentNews.unshift(`CRITICAL FAILURE: ${config.name} collapsed spectacularly.`);
              }
            }
          }

          const nextPl = {
            ...state.pl,
            bag: state.pl.bag - config.upfrontCost + finalYieldCash,
            clout: Math.min(state.pl.maxClout, Math.max(0, state.pl.clout + finalYieldClout)),
            aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + finalYieldAura)),
            mentalHealth: Math.min(state.pl.maxMentalHealth, Math.max(0, state.pl.mentalHealth + finalHitMental)),
            heat: Math.min(100, Math.max(0, state.pl.heat + config.hitHeat)),
            hustleFatigue: {
              ...state.pl.hustleFatigue,
              [hustleId]: (state.pl.hustleFatigue[hustleId] || 0) + (isSuccess ? config.fatigueCost : Math.floor(config.fatigueCost * 0.5))
            },
            crises: nextCrises
          };

          // 3. Increment specialized stats (Only on Success)
          if (isSuccess) {
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

            if (hustleId === 'r_plasma') nextPl.plasmaUsedThisMonth = true;
            if (hustleId === 'sw' || hustleId === 'drop' || hustleId === 'vintage') nextPl.swCooldownTurns = 3;

            nextPl.streetStats = nextStreet;
            nextPl.startupStats = nextStartup;
          }

          const nextState: GameState = {
            ...state,
            pl: nextPl,
            news: currentNews,
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
