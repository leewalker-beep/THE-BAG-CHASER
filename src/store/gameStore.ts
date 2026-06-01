import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TAB_TIER_MAPPING, type GameState } from './types';
import { getInitialGameState } from './initialState';
import { createMudSlice } from './slices/mudSlice';
import { createStreetSlice } from './slices/streetSlice';
import { createStartupSlice } from './slices/startupSlice';
import { applyAdvancement } from './engine';
import { MASTER_HUSTLE_REGISTRY } from '../engine/hustleRegistry';

const SAVE_KEY = 'bag-chaser-state';

const clampStats = (state: GameState): GameState => {
  const { tier } = state.pl;
  let ceiling = Infinity;

  if (tier === 0) ceiling = 30; // MUD
  else if (tier === 1) ceiling = 50; // STREET
  else if (tier === 2) ceiling = 100; // STARTUP
  else if (tier === 3) ceiling = 200; // CORPORATE
  else if (tier === 5) ceiling = 300; // ELITE
  else if (tier === 6) ceiling = 500; // MOGUL
  else if (tier === 8) ceiling = 1000; // PRESIDENT
  else if (tier >= 9) ceiling = Infinity; // OPEN

  const news = [...state.news];
  let reached = false;

  let nextClout = state.pl.clout;
  let nextAura = state.pl.aura;

  if (nextClout > ceiling) {
    nextClout = ceiling;
    reached = true;
  }
  if (nextAura > ceiling) {
    nextAura = ceiling;
    reached = true;
  }

  if (reached) {
    console.warn("MAX CEILING REACHED: Upgrade your progression tier to expand your stats capacity.");
    if (!news[0]?.includes("MAX CEILING REACHED")) {
      news.unshift("MAX CEILING REACHED: Upgrade your progression tier to expand your stats capacity.");
    }
  }

  return {
    ...state,
    pl: {
      ...state.pl,
      clout: nextClout,
      aura: nextAura
    },
    news
  };
};

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

      setTechFlipInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          techFlipPanel: { ...state.pl.techFlipPanel, [field]: value }
        }
      })),

      executeTechFlipDrop: () => set((state) => {
        const { selectedLot, toolQuality, listingPrice } = state.pl.techFlipPanel;
        const lotCosts = { PHONES: 150, LAPTOPS: 400, RIGS: 1200 };
        const toolCosts = { BUDGET: 50, PRECISION: 200 };
        const totalCost = lotCosts[selectedLot] + toolCosts[toolQuality];

        if (state.pl.bag < totalCost) {
          return { news: [`INSUFFICIENT FUNDS: Need $${totalCost} for this operation.`, ...state.news] };
        }

        const baseChances = { PHONES: 0.85, LAPTOPS: 0.70, RIGS: 0.55 };
        let successChance = baseChances[selectedLot];
        if (toolQuality === 'PRECISION') successChance += 0.15;

        const isSuccess = Math.random() < successChance;
        const currentNews = [...state.news];
        let yieldCash = 0;
        let yieldClout = 0;
        let yieldAura = 0;
        let hitMental = -8;

        if (isSuccess) {
          const maxPrice = lotCosts[selectedLot] * 2;
          yieldCash = Math.min(listingPrice, maxPrice);
          yieldClout = 5;
          currentNews.unshift(`SUCCESS: Refurbished ${selectedLot} sold for $${yieldCash.toLocaleString()}.`);
        } else {
          yieldCash = 0;
          yieldAura = -10;
          hitMental = -20;
          currentNews.unshift(`FAILURE: The hardware fried. Lost the lot and took a hit to your reputation.`);
        }

        // Anti-Spam Filter
        if (state.pl.lastExecutedHustleId === 'techFlip' || state.pl.lastExecutedHustleId === 'tech_flip') {
          yieldCash *= 0.5;
          yieldClout *= 0.5;
          currentNews.unshift("MARKET FATIGUE: Spamming the same operation has cut your yields by 50%.");
        }

        const nextState = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - totalCost + yieldCash,
            clout: state.pl.clout + yieldClout,
            aura: state.pl.aura + yieldAura,
            mentalHealth: Math.max(0, state.pl.mentalHealth + hitMental),
            lastExecutedHustleId: selectedLot === 'PHONES' ? 'tech_flip' : 'techFlip',
          },
          news: currentNews
        };

        return applyAdvancement(clampStats(nextState), 1);
      }),

      setPodcastInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          podcastPanel: { ...state.pl.podcastPanel, [field]: value }
        }
      })),

      executePodcastEpisode: () => set((state) => {
        const { selectedGuest, unhingedSlider } = state.pl.podcastPanel;
        const guestCosts = { LOCAL: 100, MICRO: 500, ICON: 2500 };
        const baseCloutYields = { LOCAL: 10, MICRO: 40, ICON: 200 };

        if (state.pl.bag < guestCosts[selectedGuest]) {
          return { news: [`INSUFFICIENT FUNDS: Need $${guestCosts[selectedGuest]} to book this guest.`, ...state.news] };
        }

        const controversyChance = unhingedSlider * 0.20;
        const isCrisis = Math.random() < controversyChance;
        const currentNews = [...state.news];

        let finalYieldClout = 0;
        let finalYieldCash = 0;
        let finalHitMental = -5;
        const nextCrises = { ...state.pl.crises };

        if (isCrisis) {
          finalHitMental = -25;
          nextCrises.shadowbanTurns = 3;
          currentNews.unshift(`CONTROVERSY: The episode exploded... in the wrong way. You've been shadowbanned.`);
        } else {
          finalYieldClout = baseCloutYields[selectedGuest] * unhingedSlider;
          finalYieldCash = (guestCosts[selectedGuest] * 0.5) * unhingedSlider;
          currentNews.unshift(`VIRAL: The episode with the ${selectedGuest} guest was a hit! (+${finalYieldClout} Clout)`);
        }

        // Anti-Spam Filter
        if (state.pl.lastExecutedHustleId === 'pod') {
          finalYieldCash *= 0.5;
          finalYieldClout *= 0.5;
          currentNews.unshift("MARKET FATIGUE: Spamming the same operation has cut your yields by 50%.");
        }

        const nextState = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - guestCosts[selectedGuest] + finalYieldCash,
            clout: state.pl.clout + finalYieldClout,
            mentalHealth: Math.max(0, state.pl.mentalHealth + finalHitMental),
            crises: nextCrises,
            hypeIsActive: !isCrisis,
            lastExecutedHustleId: 'pod'
          },
          news: currentNews
        };

        return applyAdvancement(clampStats(nextState), 1);
      }),

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

      setCurrentTier: (tierName, fee = 0) => set((state) => {
        const newTier = TAB_TIER_MAPPING[tierName];
        const nextState = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - fee,
            tier: newTier,
            currentTier: tierName
          },
          news: [`SYSTEM: Tier upgraded to ${tierName}. Filing fees of $${fee.toLocaleString()} deducted.`, ...state.news]
        };
        return clampStats(nextState);
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
          } else if (hustleId === 'techFlip' || hustleId === 'tech_flip') {
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

      executeHustle: (hustleId: string) =>
        set((state) => {
          const config = MASTER_HUSTLE_REGISTRY.find((h) => h.id === hustleId);
          if (!config) return {};

          // 1. Passive Asset Handle (Instant Execution with Time Advancement)
          if (config.isPassive && hustleId === 'r_vending') {
            if (state.pl.bag < config.upfrontCost) {
              return { news: [`INSUFFICIENT FUNDS: Need $${config.upfrontCost.toLocaleString()} to purchase ${config.name}.`, ...state.news] };
            }
            const nextState = {
              ...state,
              pl: {
                ...state.pl,
                bag: state.pl.bag - config.upfrontCost,
                assetsOwned: {
                  ...state.pl.assetsOwned,
                  vendingMachines: state.pl.assetsOwned.vendingMachines + 1
                }
              },
              news: ["ASSET ACQUIRED: Added 1 Vending Machine to your portfolio.", ...state.news]
            };
            return applyAdvancement(clampStats(nextState as GameState), 1);
          }

          // 2. Special Logic: Audio Studio (Music Syndicate)
          if (hustleId === 'audio') {
            if (!state.pl.streetStats.studioOwned) {
              if (state.pl.bag < config.upfrontCost) {
                return { news: [`INSUFFICIENT FUNDS: Need $${config.upfrontCost.toLocaleString()} to build out the Music Studio.`, ...state.news] };
              }
              return {
                pl: {
                  ...state.pl,
                  bag: state.pl.bag - config.upfrontCost,
                  streetStats: { ...state.pl.streetStats, studioOwned: true }
                },
                news: ["ASSET ACQUIRED: Music Studio is now operational. You can now produce Master Tracks.", ...state.news]
              };
            }
            // If already owned, it costs $500 per track and advances time
            if (state.pl.bag < 500) {
              return { news: ["INSUFFICIENT FUNDS: Need $500 for studio time and production costs.", ...state.news] };
            }
          }

          // 3. Validation Logic
          const effectiveUpfrontCost = (hustleId === 'audio' && state.pl.streetStats.studioOwned) ? 500 : config.upfrontCost;

          if (state.pl.bag < effectiveUpfrontCost) {
            return { news: [`INSUFFICIENT FUNDS: Need $${effectiveUpfrontCost.toLocaleString()} to execute ${config.name}.`, ...state.news] };
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

          // 4. Execution & Mitigation Logic
          const isSuccess = config.id.startsWith('r_') && config.id !== 'r_vending' ? true : Math.random() < config.successChance;
          const currentLvl = state.pl.hustleLevels[hustleId] || 1;
          let finalYieldCash = isSuccess ? config.yieldCash : 0;

          if (state.pl.crises.laborStrikeTurns > 0 && config.tier === 'CORPORATE') {
            finalYieldCash = 0;
          }

          let finalYieldClout = isSuccess ? config.yieldClout : 0;
          let finalYieldAura = isSuccess ? config.yieldAura : 0;
          let finalHitMental = config.hitMental;
          let finalHitHeat = config.hitHeat;

          const currentNews = [...state.news];

          const nextCrises = { ...state.pl.crises };

          if (isSuccess) {
            // Anti-Spam Filter
            if (hustleId === state.pl.lastExecutedHustleId) {
              finalYieldCash *= 0.5;
              finalYieldClout *= 0.5;
              currentNews.unshift("MARKET FATIGUE: Spamming the same operation has cut your yields by 50%.");
            }

            // Synergy Ingestion
            if (state.pl.hypeIsActive && (hustleId === 'drop' || hustleId === 'vintage')) {
              finalYieldCash *= 2;
              finalYieldAura *= 2;
              currentNews.unshift("SYNERGY COMBO: Content hype applied! Business payouts doubled.");
            }

            if (currentLvl > 1) {
              if (hustleId === 'drop') {
                if (currentLvl === 2) finalYieldCash *= 1.8;
                if (currentLvl === 3) finalYieldCash *= 3.5;
              } else if (hustleId === 'techFlip' || hustleId === 'tech_flip') {
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
              if (hustleId === 'r_pr_campaign') {
                finalYieldCash = 0;
                finalYieldAura = 0;
                finalHitMental = -10; // Will be doubled to -20 below
                finalHitHeat = 20;
                currentNews.unshift(`STUNT BACKFIRED: The PR campaign was exposed as a fake! Your reputation is in tatters and the heat is on.`);
              }
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
            bag: state.pl.bag - effectiveUpfrontCost + finalYieldCash,
            clout: Math.min(state.pl.maxClout, Math.max(0, state.pl.clout + finalYieldClout)),
            aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + finalYieldAura)),
            mentalHealth: Math.min(state.pl.maxMentalHealth, Math.max(0, state.pl.mentalHealth + finalHitMental)),
            heat: Math.min(100, Math.max(0, state.pl.heat + finalHitHeat)),
            hustleFatigue: {
              ...state.pl.hustleFatigue,
              [hustleId]: (state.pl.hustleFatigue[hustleId] || 0) + (isSuccess ? config.fatigueCost : Math.floor(config.fatigueCost * 0.5))
            },
            hypeIsActive: (isSuccess && (hustleId === 'cc' || hustleId === 'pod'))
                          ? true
                          : (isSuccess && (hustleId === 'drop' || hustleId === 'vintage'))
                            ? false
                            : state.pl.hypeIsActive,
            lastExecutedHustleId: hustleId,
            crises: nextCrises
          };

          // 5. Increment specialized stats (Only on Success)
          if (isSuccess) {
            const nextStreet = { ...nextPl.streetStats };
            const nextStartup = { ...nextPl.startupStats };
            const nextAssets = { ...nextPl.assetsOwned };

            if (hustleId === 'cc') nextStreet.ccSubs += 1000;
            if (hustleId === 'pod') nextStreet.podEpisodes += 1;
            if (hustleId === 'audio') {
              nextStreet.audioTracks += 1;
              nextAssets.masterTracks += 1;
            }
            if (hustleId === 'drip') nextStreet.dripStock += 10;
            if (hustleId === 'meme') nextStreet.activeMemeTokens += 1;
            if (hustleId === 'saas_mvp') nextStartup.saasUsers += 500;
            if (hustleId === 'agency_scale') nextStartup.agencyStaff += 1;
            if (hustleId === 'ecom_brand') nextStartup.ecomOrders += 200;

            if (hustleId === 'r_plasma') nextPl.plasmaUsedThisMonth = true;
            if (hustleId === 'sw' || hustleId === 'drop' || hustleId === 'vintage') nextPl.swCooldownTurns = 3;

            nextPl.streetStats = nextStreet;
            nextPl.startupStats = nextStartup;
            nextPl.assetsOwned = nextAssets;
          }

          const nextState: GameState = {
            ...state,
            pl: nextPl,
            news: currentNews,
          };

          return applyAdvancement(clampStats(nextState), 1);
        }),

      ...createMudSlice(set),
      ...createStreetSlice(set),
      ...createStartupSlice(set),

      setStreetwearInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          streetwearPanel: { ...state.pl.streetwearPanel, [field]: value }
        }
      })),

      executeStreetwearRun: () => set((state) => {
        const { brandTier } = state.pl.streetwearPanel;
        const currentNews = [...state.news];
        let yieldCash = 0;
        let yieldClout = 0;
        let yieldAura = 0;
        let cost = 0;

        if (brandTier === 'UNDERGROUND_IP') {
          cost = 500;
          yieldCash = 1800;
          yieldClout = 10;
          yieldAura = 5;
        } else if (brandTier === 'SOHO_STORE') {
          cost = 8000;
          if (state.pl.clout < 40 || state.pl.aura < 30) {
            currentNews.unshift("LOCKED: Soho Flagship requires 40 Clout and 30 Aura.");
            return { news: currentNews };
          }
          yieldCash = 12000;
          yieldClout = 25;
          yieldAura = 30;
        } else if (brandTier === 'PARIS_RUNWAY') {
          cost = 35000;
          if (state.pl.clout < 80 || state.pl.aura < 60) {
            currentNews.unshift("LOCKED: Paris Runway requires 80 Clout and 60 Aura.");
            return { news: currentNews };
          }
          yieldCash = 0;
          yieldClout = 100;
          yieldAura = 150;
        }

        if (state.pl.bag < cost) {
          currentNews.unshift(`INSUFFICIENT FUNDS: Need $${cost.toLocaleString()} for this operation.`);
          return { news: currentNews };
        }

        // Anti-Spam Filter
        if (state.pl.lastExecutedHustleId === 'vintage') {
          yieldCash *= 0.5;
          yieldClout *= 0.5;
          currentNews.unshift("MARKET FATIGUE: Spamming the same operation has cut your yields by 50%.");
        }

        // Synergy Ingestion
        if (state.pl.hypeIsActive) {
          yieldCash *= 2;
          yieldAura *= 2;
          currentNews.unshift("SYNERGY COMBO: Content hype applied! Business payouts doubled.");
        }

        const nextPl = {
          ...state.pl,
          bag: state.pl.bag - cost + yieldCash,
          clout: Math.min(state.pl.maxClout, state.pl.clout + yieldClout),
          aura: Math.min(state.pl.maxAura, state.pl.aura + yieldAura),
          hypeIsActive: false,
          lastExecutedHustleId: 'vintage'
        };

        const nextState = {
          ...state,
          pl: nextPl,
          news: currentNews
        };

        return applyAdvancement(clampStats(nextState as GameState), 1);
      }),

      setFranchiseInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          franchisePanel: { ...state.pl.franchisePanel, [field]: value }
        }
      })),

      executeFranchiseTurn: () => set((state) => {
        const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === 'global_franchise');
        const { sector, footprint, supplyChain } = state.pl.franchisePanel;
        const baseSetupCosts = { FAST_FOOD: 10000, WELLNESS: 25000, LOGISTICS: 65000 };
        const totalSetupCost = baseSetupCosts[sector] * footprint;

        if (state.pl.bag < totalSetupCost) {
          return { news: [`INSUFFICIENT FUNDS: Need $${totalSetupCost.toLocaleString()} to deploy this expansion.`, ...state.news] };
        }

        const isSuccess = Math.random() < (config?.successChance || 0.85);
        const currentNews = [...state.news];

        let finalYieldCash = 0;
        let finalYieldClout = 0;
        let finalYieldAura = 0;
        let hitMental = -20;
        const nextCrises = { ...state.pl.crises };
        let nextHypeIsActive = state.pl.hypeIsActive;

        if (isSuccess) {
          const baseCashYields = { FAST_FOOD: 12000, WELLNESS: 28000, LOGISTICS: 75000 };
          const baseCloutYields = { FAST_FOOD: 40, WELLNESS: 150, LOGISTICS: 100 };

          finalYieldCash = baseCashYields[sector] * footprint;

          if (state.pl.crises.laborStrikeTurns > 0) {
             finalYieldCash = 0;
             currentNews.unshift(`STRIKE BLOCK: No cash generated from corporate franchise operations during the active labor strike.`);
          }

          finalYieldClout = baseCloutYields[sector] * footprint;
          finalYieldAura = 20 * footprint;

          if (supplyChain === 'OUTSOURCED') {
            finalYieldCash *= 0.6; // 40% logistics tax
            currentNews.unshift(`EXPANSION SUCCESS: ${sector} network scaled via outsourced logistics. 40% tax applied.`);
          } else {
            currentNews.unshift(`EXPANSION SUCCESS: Vertically integrated ${sector} network is now operational.`);
          }

          if (state.pl.hypeIsActive && sector === 'WELLNESS') {
            finalYieldCash *= 2;
            finalYieldClout *= 2;
            nextHypeIsActive = false;
            currentNews.unshift(`SYNERGY: Wellness hype cycle triggered! Franchise yields doubled.`);
          }
        } else {
          finalYieldCash = 0;
          hitMental = -40;
          if (supplyChain === 'INTEGRATED') {
            nextCrises.laborStrikeTurns = 3;
            currentNews.unshift(`CRITICAL FAILURE: Supply chain collapse triggered a total Labor Strike.`);
          } else {
            currentNews.unshift(`FAILURE: The franchise failed to find local market fit. Total capital loss.`);
          }
        }

        const nextState = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - totalSetupCost + finalYieldCash,
            clout: Math.min(200, state.pl.clout + finalYieldClout),
            aura: Math.min(200, state.pl.aura + finalYieldAura),
            mentalHealth: Math.max(0, state.pl.mentalHealth + hitMental),
            hypeIsActive: nextHypeIsActive,
            lastExecutedHustleId: 'global_franchise',
            crises: nextCrises
          },
          news: currentNews
        };

        return applyAdvancement(clampStats(nextState as GameState), 1);
      }),
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
