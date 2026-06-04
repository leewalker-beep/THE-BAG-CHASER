import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TAB_TIER_MAPPING, type GameState } from './types';
import { getInitialGameState } from './initialState';
import { createMudSlice } from './slices/mudSlice';
import { createStreetSlice } from './slices/streetSlice';
import { createStartupSlice } from './slices/startupSlice';
import { applyAdvancement } from '../engine/advancement';
import { MASTER_HUSTLE_REGISTRY } from '../engine/hustleRegistry';
import { HUSTLE_PROGRESSIONS } from '../config/hustleProgression';
import { MARKET_CONFIGS } from '../config/marketConfig';
import { useJuiceStore } from './juiceStore';
import { RESOLVE_BLACKLIST_COST, RESOLVE_SHADOWBAN_COST, RESOLVE_STRIKE_COST, TIER_REQUIREMENTS, UNFREEZE_COST, HUSTLE_BALANCE, UPGRADE_COSTS } from '../config/balanceConfig';

const SAVE_KEY = 'bag-chaser-state';

const clampStats = (state: GameState): GameState => {
  const { tier } = state.pl;
  let ceiling = Infinity;

  if (tier === 0) ceiling = 30; // MUD
  else if (tier === 1) ceiling = 50; // STREET
  else if (tier === 2) ceiling = 100; // STARTUP
  else if (tier === 3) ceiling = 200; // CORPORATE
  else if (tier === 4) ceiling = 500; // ELITE
  else if (tier === 5) ceiling = 800; // MOGUL
  else if (tier === 6) ceiling = 1000; // PRESIDENT
  else if (tier >= 7) ceiling = Infinity; // OPEN

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

      setPlayerName: (name) => set((state) => ({
        pl: { ...state.pl, name }
      })),

      setTab: (tab) => set({ tab }),

      setActiveTab: (activeTab) => set({ activeTab }),

      setActiveHustleView: (activeHustleView) => set({ activeHustleView }),

      setMarket: (currentMarket) => set({ currentMarket }),

      adv: (intervals = 1) => set((state) => applyAdvancement(state, intervals)),

      setLaborInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          laborPanel: { ...state.pl.laborPanel, [field]: value }
        }
      })),

      setDeliveryInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          deliveryPanel: { ...state.pl.deliveryPanel, [field]: value }
        }
      })),

      setTechFlipInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          techFlipPanel: { ...state.pl.techFlipPanel, [field]: value }
        }
      })),

      setPodcastInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          podcastPanel: { ...state.pl.podcastPanel, [field]: value }
        }
      })),

      unfreezeAccounts: () => set((state) => {
        if (state.pl.bag < UNFREEZE_COST) {
          return { news: [`INSUFFICIENT FUNDS: Need $${UNFREEZE_COST.toLocaleString()} to retain legal counsel and unfreeze accounts.`, ...state.news] };
        }
        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - UNFREEZE_COST,
            crises: { ...state.pl.crises, accountsFrozen: false }
          },
          news: ["SYSTEM: Legal retainer paid. Corporate accounts have been UNFROZEN.", ...state.news]
        };
      }),

      resolveBlacklist: () => set((state) => {
        if (state.pl.bag < RESOLVE_BLACKLIST_COST) {
          return { news: [`INSUFFICIENT FUNDS: Need $${RESOLVE_BLACKLIST_COST.toLocaleString()} to clear your reputation and lift the blacklist.`, ...state.news] };
        }
        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - RESOLVE_BLACKLIST_COST,
            crises: { ...state.pl.crises, blacklistTurns: 0 }
          },
          news: ["SYSTEM: Reputation laundered. You are no longer BLACKLISTED from elite circles.", ...state.news]
        };
      }),

      resolveShadowban: () => set((state) => {
        if (state.pl.bag < RESOLVE_SHADOWBAN_COST) {
          return { news: [`INSUFFICIENT FUNDS: Need $${RESOLVE_SHADOWBAN_COST.toLocaleString()} for a managed PR scrub to lift the shadowban.`, ...state.news] };
        }
        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - RESOLVE_SHADOWBAN_COST,
            crises: { ...state.pl.crises, shadowbanTurns: 0 }
          },
          news: ["SYSTEM: Digital footprint scrubbed. The SHADOWBAN has been lifted.", ...state.news]
        };
      }),

      resolveLaborStrike: () => set((state) => {
        if (state.pl.bag < RESOLVE_STRIKE_COST) {
          return { news: [`INSUFFICIENT FUNDS: Need $${RESOLVE_STRIKE_COST.toLocaleString()} to settle union demands and end the strike.`, ...state.news] };
        }
        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - RESOLVE_STRIKE_COST,
            crises: { ...state.pl.crises, laborStrikeTurns: 0 }
          },
          news: ["SYSTEM: Labor dispute settled. The STRIKE has ended.", ...state.news]
        };
      }),

      setCurrentTier: (tierName, fee = 0) => set((state) => {
        const reqs = TIER_REQUIREMENTS[tierName];
        if (reqs) {
          if (state.pl.bag < reqs.cash || state.pl.clout < reqs.clout || state.pl.aura < reqs.aura) {
            return { news: [`ADVANCEMENT DENIED: You do not meet the minimum requirements for ${tierName}.`, ...state.news] };
          }
        }

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

          const upgradeTable = UPGRADE_COSTS[hustleId];
          if (!upgradeTable || !upgradeTable[currentLvl]) return {};
          cost = upgradeTable[currentLvl];

          if (hustleId === 'drop') {
            rankName = currentLvl === 1 ? "Store Phase: Private Wholesaler" : "Chain Phase: Global E-Com Empire";
          } else if (hustleId === 'techFlip' || hustleId === 'tech_flip') {
            rankName = currentLvl === 1 ? "Store Phase: Strip-Mall Kiosk" : "Chain Phase: Automated Refurb Plant";
          } else if (hustleId === 'vintage') {
            rankName = currentLvl === 1 ? "Store Phase: Consignment Boutique" : "Chain Phase: The Luxury Grail Archive";
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

      upgradeHustleNode: (hustleId, nodeId) => set((state) => {
        if (state.pl.crises.accountsFrozen) {
          return { news: ["ACCOUNTS FROZEN: You cannot perform upgrades until legal issues are resolved.", ...state.news] };
        }
        const tree = HUSTLE_PROGRESSIONS[hustleId];
        if (!tree) return {};
        const node = tree[nodeId];
        if (!node) return {};

        if (state.pl.bag < node.cost) {
          return { news: [`INSUFFICIENT FUNDS: Need $${node.cost.toLocaleString()} to unlock ${node.name}.`, ...state.news] };
        }

        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - node.cost,
            hustleNodeIds: {
              ...state.pl.hustleNodeIds,
              [hustleId]: nodeId
            },
            treePassiveYields: {
              ...state.pl.treePassiveYields,
              [hustleId]: node.passiveMonthlyYield
            }
          },
          news: [`SYSTEM: ${hustleId.toUpperCase()} upgraded to ${node.name}.`, ...state.news]
        };
      }),

      purchaseHustleUpgrade: (hustleId, nodeId) => set((state) => {
        if (state.pl.crises.accountsFrozen) {
          return { news: ["ACCOUNTS FROZEN: You cannot perform upgrades until legal issues are resolved.", ...state.news] };
        }
        const tree = HUSTLE_PROGRESSIONS[hustleId];
        if (!tree) return {};
        const node = tree[nodeId];
        if (!node) return {};

        if (state.pl.bag < node.cost) {
          return { news: [`INSUFFICIENT FUNDS: Need $${node.cost.toLocaleString()} to unlock ${node.name}.`, ...state.news] };
        }

        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - node.cost,
            hustleNodeIds: {
              ...state.pl.hustleNodeIds,
              [hustleId]: nodeId
            },
            treePassiveYields: {
              ...state.pl.treePassiveYields,
              [hustleId]: node.passiveMonthlyYield
            }
          },
          news: [`SYSTEM: ${hustleId.toUpperCase()} upgraded to ${node.name}.`, ...state.news]
        };
      }),

      deductCostAndRollOutcome: (hustleId: string, forceSuccess?: boolean) => {
        set((state) => {
          const config = MASTER_HUSTLE_REGISTRY.find((h) => h.id === hustleId);
          if (!config) return {};

          const market = MARKET_CONFIGS[state.currentMarket];

          // 0. Lineage Cost/Yield Override
          let effectiveUpfrontCost = (hustleId === 'audio' && state.pl.streetStats.studioOwned)
            ? HUSTLE_BALANCE.audio.studioOwnedProductionCost
            : config.upfrontCost;

          let lineageYieldCash = config.yieldCash;
          let lineageYieldClout = config.yieldClout;
          let lineageYieldAura = config.yieldAura;
          let lineageHitMental = config.hitMental;
          let lineageFatigue = config.fatigueCost;
          let lineageSuccessChance = config.successChance;

          const tree = HUSTLE_PROGRESSIONS[hustleId];
          if (tree) {
            const currentNodeId = state.pl.hustleNodeIds[hustleId] || 'l1';
            const node = tree[currentNodeId];
            if (node) {
              effectiveUpfrontCost = 0; // The per-execution cost for tree-based hustles is typically 0 unless otherwise stated, cost is in the upgrade.
              lineageYieldCash = node.yieldCash;
              lineageYieldClout = node.yieldClout;
              lineageYieldAura = node.yieldAura;
              lineageHitMental = node.hitMental;
              lineageSuccessChance = node.successChance;
            }
          }

          effectiveUpfrontCost *= market.expenseMultiplier;

          lineageYieldCash *= market.yieldMultiplier;
          lineageYieldClout *= market.yieldMultiplier;
          lineageYieldAura *= market.yieldMultiplier;
          const lineageNews: string[] = [];
          const nextPlOverrides: Partial<typeof state.pl> = {};

          if (tree) {
            // Progression tree stats already assigned above, skip legacy overrides
          } else if (hustleId === 'r_labor') {
            const { activeTab, weeks, propertyType, budget, action } = state.pl.laborPanel;
            if (activeTab === 1) {
              const mult = weeks / 4;
              lineageYieldCash = config.yieldCash * mult;
              lineageFatigue = config.fatigueCost * mult;
              lineageHitMental = config.hitMental * mult;
            } else if (activeTab === 2) {
              const { baseCosts, budgetMults, cloutReq: laborCloutReq2 } = HUSTLE_BALANCE.r_labor.level2;
              if (state.pl.clout < laborCloutReq2) {
                return { news: [`LACK OF CLOUT: Need ${laborCloutReq2} Clout for Property Flip operations.`, ...state.news] };
              }
              effectiveUpfrontCost = baseCosts[propertyType] * budgetMults[budget];
              lineageFatigue = 60;
              if (action === 'FLIP') {
                const margin = effectiveUpfrontCost * (0.1 + Math.random() * 0.4); // 10% to 50% profit
                lineageYieldCash = effectiveUpfrontCost + margin;
                lineageYieldClout = 20;
                lineageNews.push(`PROPERTY FLIP: Successfully renovated and flipped the ${propertyType}. Profit: $${margin.toLocaleString()}.`);
              } else {
                lineageYieldCash = 0;
                lineageYieldClout = 10;
                nextPlOverrides.passiveLaborYield = (state.pl.passiveLaborYield || 0) + 2500;
                lineageNews.push(`PROPERTY RENT: The ${propertyType} has been added to your rental portfolio. +$2,500/mo passive flow.`);
              }
            } else if (activeTab === 3) {
              const { cost: laborCost3, cloutReq: laborCloutReq3, auraReq: laborAuraReq3 } = HUSTLE_BALANCE.r_labor.level3;
              if (state.pl.clout < laborCloutReq3) {
                return { news: [`LACK OF CLOUT: Need ${laborCloutReq3} Clout for Commercial Syndicate operations.`, ...state.news] };
              }
              if (state.pl.aura < laborAuraReq3) {
                return { news: [`LACK OF AURA: Need ${laborAuraReq3} Aura for Commercial Syndicate operations.`, ...state.news] };
              }
              effectiveUpfrontCost = laborCost3;
              lineageYieldCash = 2500000;
              lineageYieldClout = 150;
              lineageYieldAura = 100;
              lineageFatigue = 80;
              lineageNews.push(`COMMERCIAL SYNDICATE: Major development project completed. Huge market impact.`);
            }
          }

          if (hustleId === 'r_delivery') {
            const { activeTab, weeks, fleetType, wageLevel } = state.pl.deliveryPanel;
            if (activeTab === 1) {
              const mult = weeks / 4;
              lineageYieldCash = config.yieldCash * mult;
              lineageFatigue = config.fatigueCost * mult;
              lineageHitMental = config.hitMental * mult;
            } else if (activeTab === 2) {
              const { fleetCosts, fleetYields, cloutReq: deliveryCloutReq2 } = HUSTLE_BALANCE.r_delivery.level2;
              if (state.pl.clout < deliveryCloutReq2) {
                return { news: [`LACK OF CLOUT: Need ${deliveryCloutReq2} Clout for Fleet Dispatch operations.`, ...state.news] };
              }
              effectiveUpfrontCost = fleetCosts[fleetType];
              let wageMult = 1.0;
              let strikeRisk = 0.05;
              if (wageLevel === 'LOW') { wageMult = 1.5; strikeRisk = 0.4; }
              if (wageLevel === 'PREMIUM') { wageMult = 0.8; strikeRisk = 0; }

              lineageYieldCash = fleetYields[fleetType] * wageMult;
              lineageFatigue = 40;
              lineageSuccessChance = 1.0; // Guaranteed to run, but may strike

              if (Math.random() < strikeRisk) {
                lineageYieldCash = 0;
                lineageHitMental = -30;
                nextPlOverrides.crises = { ...state.pl.crises, laborStrikeTurns: 2 };
                lineageNews.push(`DRIVER STRIKE: Low wages triggered a fleet-wide walkout. Operations halted.`);
              } else {
                lineageNews.push(`FLEET DISPATCH: ${fleetType} fleet successfully completed all routes.`);
              }
            } else if (activeTab === 3) {
              const { cost: deliveryCost3, cloutReq: deliveryCloutReq3, auraReq: deliveryAuraReq3 } = HUSTLE_BALANCE.r_delivery.level3;
              if (state.pl.clout < deliveryCloutReq3) {
                return { news: [`LACK OF CLOUT: Need ${deliveryCloutReq3} Clout for 3PL Automated Hub deployment.`, ...state.news] };
              }
              if (state.pl.aura < deliveryAuraReq3) {
                return { news: [`LACK OF AURA: Need ${deliveryAuraReq3} Aura for 3PL Automated Hub deployment.`, ...state.news] };
              }
              effectiveUpfrontCost = deliveryCost3;
              lineageYieldCash = 3500000;
              lineageYieldClout = 250;
              lineageYieldAura = 150;
              lineageFatigue = 70;
              lineageNews.push(`3PL AUTOMATED HUB: Regional logistics dominance established. Automation maximizing margins.`);
            }
          }

          // 0.2 Tech Flip Logic
          if (hustleId === 'tech_flip') {
            const { selectedLot, toolQuality, listingPrice } = state.pl.techFlipPanel;
            const { lotCosts, toolCosts, baseChances } = HUSTLE_BALANCE.techFlip;
            effectiveUpfrontCost = lotCosts[selectedLot] + toolCosts[toolQuality];
            lineageSuccessChance = baseChances[selectedLot];
            if (toolQuality === 'PRECISION') lineageSuccessChance += 0.15;

            const maxPrice = lotCosts[selectedLot] * 2;
            lineageYieldCash = Math.min(listingPrice, maxPrice);
            lineageYieldClout = 5;
            lineageYieldAura = 0;
            lineageHitMental = 5;

            // Overrides for failure case in deductCostAndRollOutcome are handled by the core roll
          }

          // 0.3 Podcast Logic
          if (hustleId === 'pod') {
            const { selectedGuest, unhingedSlider } = state.pl.podcastPanel;
            const { guestCosts, baseCloutYields } = HUSTLE_BALANCE.pod;
            effectiveUpfrontCost = guestCosts[selectedGuest];

            const controversyChance = unhingedSlider * 0.20;
            const isCrisis = Math.random() < controversyChance;

            if (isCrisis) {
              lineageSuccessChance = 0; // Force failure roll
              lineageHitMental = -25;
              // shadowban will be handled in failure block
            } else {
              lineageSuccessChance = 1.0;
              lineageYieldClout = baseCloutYields[selectedGuest] * unhingedSlider;
              lineageYieldCash = (guestCosts[selectedGuest] * 0.5) * unhingedSlider;
              lineageHitMental = -5;
            }
          }

          // 0.4 Streetwear Logic
          if (hustleId === 'vintage') {
            const { brandTier } = state.pl.streetwearPanel;
            const tierData = HUSTLE_BALANCE.vintage.tiers[brandTier];
            if (!tierData) return {};
            effectiveUpfrontCost = tierData.cost;

            if (state.pl.clout < tierData.clReq || state.pl.aura < tierData.auReq) {
              return { news: [`LACK OF STATS: Need ${tierData.clReq} Clout and ${tierData.auReq} Aura for ${brandTier}.`, ...state.news] };
            }

            lineageSuccessChance = 1.0; // Deterministic for these tiers
            if (brandTier === 'UNDERGROUND_IP') {
              lineageYieldCash = 1800;
              lineageYieldClout = 10;
              lineageYieldAura = 5;
            } else if (brandTier === 'SOHO_STORE') {
              lineageYieldCash = 12000;
              lineageYieldClout = 25;
              lineageYieldAura = 30;
            } else if (brandTier === 'PARIS_RUNWAY') {
              lineageYieldCash = 0;
              lineageYieldClout = 100;
              lineageYieldAura = 150;
            }
          }

          // 0.5 Franchise Logic
          if (hustleId === 'global_franchise') {
            const { sector, footprint, supplyChain } = state.pl.franchisePanel;
            const { baseSetupCosts, baseCashYields, baseCloutYields } = HUSTLE_BALANCE.global_franchise;
            effectiveUpfrontCost = (baseSetupCosts[sector] || 0) * footprint;

            lineageYieldCash = (baseCashYields[sector] || 0) * footprint;
            lineageYieldClout = baseCloutYields[sector] * footprint;
            lineageYieldAura = 20 * footprint;
            lineageHitMental = -20;

            if (supplyChain === 'OUTSOURCED') {
              lineageYieldCash *= 0.6;
            }

            if (state.pl.hypeIsActive && sector === 'WELLNESS') {
              lineageYieldCash *= 2;
              lineageYieldClout *= 2;
            }
          }

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
            const advancedState = applyAdvancement(clampStats(nextState as GameState), 1) as GameState;
            return advancedState;
          }

          // 2. Special Logic: Audio Studio (Music Syndicate)
          if (hustleId === 'audio') {
            if (!state.pl.streetStats.studioOwned) {
              if (state.pl.bag < config.upfrontCost) {
                return { news: [`INSUFFICIENT FUNDS: Need $${config.upfrontCost.toLocaleString()} to build out the Music Studio.`, ...state.news] };
              }
              const nextState = {
                ...state,
                pl: {
                  ...state.pl,
                  bag: state.pl.bag - config.upfrontCost,
                  streetStats: { ...state.pl.streetStats, studioOwned: true }
                },
                news: ["ASSET ACQUIRED: Music Studio is now operational. You can now produce Master Tracks.", ...state.news]
              };
              return nextState;
            }
            // If already owned, it costs $500 per track and advances time
            const studioCost = HUSTLE_BALANCE.audio.studioOwnedProductionCost;
            if (state.pl.bag < studioCost) {
              return { news: [`INSUFFICIENT FUNDS: Need $${studioCost.toLocaleString()} for studio time and production costs.`, ...state.news] };
            }
            effectiveUpfrontCost = studioCost;
          }

          // 3. Validation Logic
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
          const isSuccess = forceSuccess !== undefined
            ? forceSuccess
            : (config.id.startsWith('r_') && config.id !== 'r_vending' && hustleId !== 'r_labor' && hustleId !== 'r_delivery')
              ? true
              : Math.random() < lineageSuccessChance;
          const currentLvl = state.pl.hustleLevels[hustleId] || 1;
          let finalYieldCash = isSuccess ? lineageYieldCash : 0;

          if (state.pl.crises.laborStrikeTurns > 0 && config.tier === 'CORPORATE') {
            finalYieldCash = 0;
          }

          let finalYieldClout = isSuccess ? lineageYieldClout : 0;
          let finalYieldAura = isSuccess ? lineageYieldAura : 0;
          let finalHitMental = lineageHitMental;
          let finalHitHeat = config.hitHeat * market.heatMultiplier;

          const currentNews = [...lineageNews, ...state.news];

          const nextCrises = { ...state.pl.crises };

          if (isSuccess) {
            // Anti-Spam Filter (Handle techFlip vs tech_flip alias)
            const isSpam = (hustleId === state.pl.lastExecutedHustleId) ||
                           (hustleId === 'tech_flip' && state.pl.lastExecutedHustleId === 'techFlip') ||
                           (hustleId === 'techFlip' && state.pl.lastExecutedHustleId === 'tech_flip');

            if (isSpam) {
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

            // Specific Success News
            if (hustleId === 'tech_flip') {
              currentNews.unshift(`SUCCESS: Refurbished hardware sold for $${finalYieldCash.toLocaleString()}.`);
            } else if (hustleId === 'pod') {
              currentNews.unshift(`VIRAL: The episode was a hit! (+${finalYieldClout} Clout)`);
            } else if (hustleId === 'vintage') {
              currentNews.unshift(`COLLECTION DROPPED: Market reception is positive. Brand equity increasing.`);
            } else if (hustleId === 'global_franchise') {
              const { sector, supplyChain } = state.pl.franchisePanel;
              if (supplyChain === 'OUTSOURCED') {
                currentNews.unshift(`EXPANSION SUCCESS: ${sector} network scaled via outsourced logistics. 40% tax applied.`);
              } else {
                currentNews.unshift(`EXPANSION SUCCESS: Vertically integrated ${sector} network is now operational.`);
              }
            } else {
              currentNews.unshift(`EXECUTED: ${config.name}. ${config.description}`);
            }
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

              // Specific Failure logic
              if (hustleId === 'tech_flip') {
                finalYieldCash = 0;
                finalYieldAura = -10;
                finalHitMental = -10; // Becomes -20
                currentNews.unshift(`FAILURE: The hardware fried. Lost the lot and took a hit to your reputation.`);
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

              // Specific Crisis Triggers
              if (hustleId === 'pod') {
                nextCrises.shadowbanTurns = 3;
                currentNews.unshift(`CONTROVERSY: The episode exploded... in the wrong way. You've been shadowbanned.`);
              }
              if (hustleId === 'global_franchise' && state.pl.franchisePanel.supplyChain === 'INTEGRATED') {
                nextCrises.laborStrikeTurns = 3;
                currentNews.unshift(`CRITICAL FAILURE: Supply chain collapse triggered a total Labor Strike.`);
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
              [hustleId]: (state.pl.hustleFatigue[hustleId] || 0) + (isSuccess ? lineageFatigue : Math.floor(lineageFatigue * 0.5))
            },
            hypeIsActive: (isSuccess && (hustleId === 'cc' || hustleId === 'pod'))
                          ? true
                          : (isSuccess && (hustleId === 'drop' || hustleId === 'vintage'))
                            ? false
                            : state.pl.hypeIsActive,
            lastExecutedHustleId: hustleId,
            streak: isSuccess ? state.pl.streak + 1 : 0,
            crises: nextCrises,
            ...nextPlOverrides
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

          useJuiceStore.getState().checkAndTriggerVFX(state.pl.bag, nextPl.bag, isSuccess ? 'SURGE' : 'CASCADE');

          const nextState: GameState = {
            ...state,
            pl: nextPl,
            news: currentNews,
          };

          const advancedState = applyAdvancement(clampStats(nextState), 1) as GameState;

          return advancedState;
        });
      },

      ...createMudSlice(set),
      ...createStreetSlice(set),
      ...createStartupSlice(set),

      setStreetwearInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          streetwearPanel: { ...state.pl.streetwearPanel, [field]: value }
        }
      })),

      setFranchiseInput: (field, value) => set((state) => ({
        pl: {
          ...state.pl,
          franchisePanel: { ...state.pl.franchisePanel, [field]: value }
        }
      })),
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
      merge: (persistedState: unknown, currentState: GameState) => {
        const persisted = persistedState as Partial<GameState> | undefined;
        const merged = { ...currentState, ...persisted };
        // SECURE THE INITIAL STATE FALLBACK: Ensure name exists for legacy players
        if (merged.pl) {
          merged.pl = {
            ...merged.pl,
            name: persisted?.pl?.name || merged.pl.name || "",
          };
        }
        return merged;
      },
    }
  )
);
