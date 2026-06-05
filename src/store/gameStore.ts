import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TAB_TIER_MAPPING, type GameState, type PlayerStats } from './types';
import { getInitialGameState } from './initialState';
import { createMudSlice } from './slices/mudSlice';
import { createStreetSlice } from './slices/streetSlice';
import { createStartupSlice } from './slices/startupSlice';
import { applyAdvancement } from '../engine/advancement';
import { MASTER_HUSTLE_REGISTRY } from '../engine/hustleRegistry';
import { HUSTLE_PROGRESSIONS } from '../config/hustleProgression';
import { FLEX_ASSETS } from '../config/flexAssets';
import { MARKET_CONFIGS } from '../config/marketConfig';
import { NARRATIVE_BEATS } from '../config/narrativeConfig';
import { useJuiceStore } from './juiceStore';
import { RESOLVE_BLACKLIST_COST, RESOLVE_SHADOWBAN_COST, RESOLVE_STRIKE_COST, TIER_REQUIREMENTS, UNFREEZE_COST, UPGRADE_COSTS, HUSTLE_BALANCE } from '../config/balanceConfig';

const SAVE_KEY = 'bag-chaser-state';

export const calculateMaxStats = (pl: PlayerStats) => {
  const baseMaxClout = 100;
  const baseMaxAura = 100;
  const baseMaxMental = 100;

  let maxClout = baseMaxClout;
  let maxAura = baseMaxAura;
  let maxMentalHealth = baseMaxMental;

  FLEX_ASSETS.forEach(asset => {
    const count = pl.flexAssets[asset.id] || 0;
    if (count > 0) {
      maxClout += (asset.maxCloutBoost || 0) * count;
      maxAura += (asset.maxAuraBoost || 0) * count;
      maxMentalHealth += (asset.maxMentalHealthBoost || 0) * count;
    }
  });

  return { maxClout, maxAura, maxMentalHealth };
};

const clampStats = (state: GameState): GameState => {
  const { tier } = state.pl;
  const { maxClout, maxAura, maxMentalHealth } = calculateMaxStats(state.pl);

  let ceiling = Infinity;

  if (tier === 0) ceiling = 30; // MUD
  else if (tier === 1) ceiling = 50; // STREET
  else if (tier === 2) ceiling = 100; // STARTUP
  else if (tier === 3) ceiling = 200; // CORPORATE
  else if (tier === 4) ceiling = 5000; // ELITE
  else if (tier === 5) ceiling = 25000; // MOGUL
  else if (tier === 6) ceiling = 1000000; // PRESIDENT
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
      aura: nextAura,
      maxClout,
      maxAura,
      maxMentalHealth
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

      dismissNarrative: () => set((state) => ({
        activeNarrative: null,
        lastNarrativeTriggered: state.activeNarrative || state.lastNarrativeTriggered
      })),

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
        const nextStats = { ...state.pl.stats };
        nextStats.crisisCounts.frozen += 1;
        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - UNFREEZE_COST,
            crises: { ...state.pl.crises, accountsFrozen: false },
            stats: nextStats
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
        const nextStats = { ...state.pl.stats };
        if (!nextStats.unlockedAchievements.includes('Shadowban Survivor')) {
          nextStats.unlockedAchievements.push('Shadowban Survivor');
        }
        return {
          pl: {
            ...state.pl,
            bag: state.pl.bag - RESOLVE_SHADOWBAN_COST,
            crises: { ...state.pl.crises, shadowbanTurns: 0 },
            stats: nextStats
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
        const nextStats = { ...state.pl.stats };

        // Finalize old tier record
        if (nextStats.tierHistory[state.pl.currentTier]) {
          // No explicit time-to-reach field in TierHistoryEntry interface?
          // Re-checking types.ts: reachedAtMonth is there.
        }

        // Initialize new tier record
        nextStats.tierHistory[tierName] = {
          reachedAtMonth: state.pl.mo,
          cashEarned: 0,
          cloutDelta: 0,
          auraDelta: 0,
          hustlesExecuted: {},
          crises: [],
          flexAssets: [],
          milestone: `Reached ${tierName}`
        };

        if (!nextStats.unlockedAchievements.includes(`${tierName} Unlocked`)) {
          nextStats.unlockedAchievements.push(`${tierName} Unlocked`);
        }

        const shouldTriggerNarrative = NARRATIVE_BEATS[tierName] && state.lastNarrativeTriggered !== tierName;

        const nextState = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - fee,
            tier: newTier,
            currentTier: tierName,
            stats: nextStats
          },
          news: [`SYSTEM: Tier upgraded to ${tierName}. Filing fees of $${fee.toLocaleString()} deducted.`, ...state.news],
          activeNarrative: shouldTriggerNarrative ? tierName : state.activeNarrative
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

      upgradeHustleLevel: (hustleId, branchPath) => set((state) => {
        console.log('gameStore: upgradeHustleLevel called for', hustleId, branchPath);
        if (state.pl.crises.accountsFrozen) {
          console.warn('upgradeHustleLevel: accountsFrozen');
          return { news: ["ACCOUNTS FROZEN: You cannot perform upgrades until legal issues are resolved.", ...state.news] };
        }
        const tree = HUSTLE_PROGRESSIONS[hustleId];
        if (!tree) {
          console.error('upgradeHustleLevel: Tree not found for', hustleId);
          return {};
        }
        const node = tree[branchPath];
        if (!node) {
          console.error('upgradeHustleLevel: Node not found for', branchPath);
          return {};
        }

        const cloutReq = node.cloutReq || 0;
        const auraReq = node.auraReq || 0;

        if (state.pl.bag < node.cost) {
          console.warn('upgradeHustleLevel: Insufficient funds');
          return { news: [`INSUFFICIENT FUNDS: Need $${node.cost.toLocaleString()} for ${node.name}.`, ...state.news] };
        }
        if (state.pl.clout < cloutReq) {
          console.warn('upgradeHustleLevel: Lack of clout');
          return { news: [`LACK OF CLOUT: Need ${cloutReq} Clout for ${node.name}.`, ...state.news] };
        }
        if (state.pl.aura < auraReq) {
          console.warn('upgradeHustleLevel: Lack of aura');
          return { news: [`LACK OF AURA: Need ${auraReq} Aura for ${node.name}.`, ...state.news] };
        }

        const nextLevel = parseInt(branchPath.charAt(1)) || (state.pl.hustleLevels[hustleId] + 1);

        useJuiceStore.getState().triggerSurge();

        console.log('upgradeHustleLevel: Success, updating state for', hustleId, node.name);

        return {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - node.cost,
            hustleLevels: {
              ...state.pl.hustleLevels,
              [hustleId]: nextLevel
            },
            hustleNodeIds: {
              ...state.pl.hustleNodeIds,
              [hustleId]: branchPath
            },
            treePassiveYields: {
              ...state.pl.treePassiveYields,
              [hustleId]: node.passiveMonthlyYield
            }
          },
          news: [`UPGRADE SUCCESS: ${hustleId.toUpperCase()} is now Level ${nextLevel} (${node.name})`, ...state.news]
        };
      }),

      purchaseHustleUpgrade: (hustleId, nodeId) => set((state) => {
        console.log('gameStore: purchaseHustleUpgrade called for', hustleId, nodeId);
        if (state.pl.crises.accountsFrozen) {
          console.warn('purchaseHustleUpgrade: accountsFrozen');
          return { news: ["ACCOUNTS FROZEN: You cannot perform upgrades until legal issues are resolved.", ...state.news] };
        }
        const tree = HUSTLE_PROGRESSIONS[hustleId];
        if (!tree) {
          console.error('purchaseHustleUpgrade: Tree not found for', hustleId);
          return {};
        }
        const node = tree[nodeId];
        if (!node) {
          console.error('purchaseHustleUpgrade: Node not found for', nodeId);
          return {};
        }

        const cloutReq = node.cloutReq || 0;
        const auraReq = node.auraReq || 0;

        if (state.pl.bag < node.cost) {
          console.warn('purchaseHustleUpgrade: Insufficient funds');
          return { news: [`INSUFFICIENT FUNDS: Need $${node.cost.toLocaleString()} to unlock ${node.name}.`, ...state.news] };
        }
        if (state.pl.clout < cloutReq) {
          console.warn('purchaseHustleUpgrade: Lack of clout');
          return { news: [`LACK OF CLOUT: Need ${cloutReq} Clout for ${node.name}.`, ...state.news] };
        }
        if (state.pl.aura < auraReq) {
          console.warn('purchaseHustleUpgrade: Lack of aura');
          return { news: [`LACK OF AURA: Need ${auraReq} Aura for ${node.name}.`, ...state.news] };
        }

        const nextLevel = parseInt(nodeId.charAt(1)) || (state.pl.hustleLevels[hustleId] + 1);

        useJuiceStore.getState().triggerSurge();

        console.log('purchaseHustleUpgrade: Success, updating state for', hustleId, node.name);

        return {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - node.cost,
            hustleLevels: {
              ...state.pl.hustleLevels,
              [hustleId]: nextLevel
            },
            hustleNodeIds: {
              ...state.pl.hustleNodeIds,
              [hustleId]: nodeId
            },
            treePassiveYields: {
              ...state.pl.treePassiveYields,
              [hustleId]: node.passiveMonthlyYield
            }
          },
          news: [`UPGRADE SUCCESS: ${hustleId.toUpperCase()} is now Level ${nextLevel} (${node.name})`, ...state.news]
        };
      }),

      deductCostAndRollOutcome: (hustleId: string, forceSuccess?: boolean, yieldMultiplier: number = 1) => {
        set((state) => {
          const config = MASTER_HUSTLE_REGISTRY.find((h) => h.id === hustleId);
          if (!config) return {};

          const market = MARKET_CONFIGS[state.currentMarket];
          const tree = HUSTLE_PROGRESSIONS[hustleId];
          const savedNodeId = state.pl.hustleNodeIds[hustleId];
          const currentNode = tree ? tree[savedNodeId || 'l1'] : null;

          console.log(`[DEBUG] Hustle: ${hustleId} | SavedNodeID: ${savedNodeId} | NodeYield: ${currentNode?.yieldCash}`);

          // Calculate effective cost
          let effectiveUpfrontCost = (hustleId === 'audio' && state.pl.streetStats.studioOwned)
            ? HUSTLE_BALANCE.audio.studioOwnedProductionCost
            : (currentNode ? currentNode.cost : config.upfrontCost);

          let lineageYieldCash = currentNode ? currentNode.yieldCash : config.yieldCash;
          let lineageYieldClout = currentNode ? currentNode.yieldClout : config.yieldClout;
          let lineageYieldAura = currentNode ? currentNode.yieldAura : config.yieldAura;
          let lineageHitMental = currentNode ? currentNode.hitMental : config.hitMental;
          let lineageFatigue = config.fatigueCost;
          let lineageSuccessChance = currentNode ? currentNode.successChance : config.successChance;

          // Apply market multipliers
          effectiveUpfrontCost *= market.expenseMultiplier;
          lineageYieldCash *= market.yieldMultiplier;
          lineageYieldClout *= market.yieldMultiplier;
          lineageYieldAura *= market.yieldMultiplier;

          // Apply minigame yield multiplier
          lineageYieldCash *= yieldMultiplier;
          lineageYieldClout *= yieldMultiplier;
          lineageYieldAura *= yieldMultiplier;

          // Validation
          if (state.pl.bag < effectiveUpfrontCost) {
            return { news: [`INSUFFICIENT FUNDS: Need $${effectiveUpfrontCost.toLocaleString()} to execute ${config.name}.`, ...state.news] };
          }

          if (state.pl.clout < config.cloutReq) {
            return { news: [`LACK OF CLOUT: Need ${config.cloutReq} Clout to pull off ${config.name}.`, ...state.news] };
          }

          if (state.pl.crises.blacklistTurns > 0 && (config.tier === 'ELITE' || config.tier === 'MOGUL' || config.tier === 'PRESIDENT')) {
            return { news: [`BLACKLISTED: You are currently exiled from ${config.tier} circles.`, ...state.news] };
          }

          // Special cooldowns
          if (hustleId === 'r_plasma' && state.pl.plasmaUsedThisMonth) {
            return { news: ["MEDICAL LIMIT: You can only sell plasma once per month.", ...state.news] };
          }
          if ((hustleId === 'sw' || hustleId === 'drop' || hustleId === 'vintage') && state.pl.swCooldownTurns > 0) {
            return { news: ["COOLDOWN: Hype needs to rebuild before another drop.", ...state.news] };
          }

          // Execution
          const isSuccess = forceSuccess !== undefined
            ? forceSuccess
            : (config.id.startsWith('r_') && config.id !== 'r_vending')
              ? true
              : Math.random() < lineageSuccessChance;

          let finalYieldCash = isSuccess ? lineageYieldCash : 0;
          let finalYieldClout = isSuccess ? lineageYieldClout : 0;
          let finalYieldAura = isSuccess ? lineageYieldAura : 0;
          let finalHitMental = lineageHitMental;
          let finalHitHeat = config.hitHeat * market.heatMultiplier;

          const currentNews = [...state.news];
          const nextCrises = { ...state.pl.crises };

          // Anti-spam
          const isSpam = hustleId === state.pl.lastExecutedHustleId;
          if (isSuccess && isSpam) {
            finalYieldCash *= 0.5;
            finalYieldClout *= 0.5;
            currentNews.unshift("MARKET FATIGUE: Spamming this operation cut yields by 50%.");
          }

          // Synergy bonuses
          if (state.pl.hypeIsActive && (hustleId === 'drop' || hustleId === 'vintage')) {
            finalYieldCash *= 2;
            finalYieldAura *= 2;
            currentNews.unshift("SYNERGY COMBO: Content hype applied! Payouts doubled.");
          }

          // SINGLE cost deduction (critical fix)
          const nextBag = state.pl.bag - effectiveUpfrontCost + finalYieldCash;

          // Update stats
          const nextStats = { ...state.pl.stats };
          nextStats.totalHustles += 1;
          if (isSuccess) nextStats.successfulHustles += 1;
          nextStats.lifetimeEarnings += finalYieldCash;

          // Achievement checks
          if (nextStats.lifetimeEarnings >= 1000000 && !nextStats.unlockedAchievements.includes('First Million')) {
            nextStats.unlockedAchievements.push('First Million');
            currentNews.unshift("🏆 ACHIEVEMENT UNLOCKED: First Million ($1,000,000 earned)");
          }

          // Update tier history
          const currentTierStats = nextStats.tierHistory[state.pl.currentTier] || {
            reachedAtMonth: state.pl.mo,
            cashEarned: 0,
            cloutDelta: 0,
            auraDelta: 0,
            hustlesExecuted: {},
            crises: [],
            flexAssets: [],
            milestone: ''
          };
          currentTierStats.cashEarned += finalYieldCash;
          currentTierStats.cloutDelta += finalYieldClout;
          currentTierStats.auraDelta += finalYieldAura;
          currentTierStats.hustlesExecuted[hustleId] = (currentTierStats.hustlesExecuted[hustleId] || 0) + 1;
          nextStats.tierHistory[state.pl.currentTier] = currentTierStats;

          // Failure crises
          if (!isSuccess && !forceSuccess) {
            finalHitMental *= 2;
            if (config.tier === 'MUD' || config.tier === 'STREET') {
              nextCrises.shadowbanTurns = 3;
              currentNews.unshift(`CRITICAL FAILURE: Shadowbanned for 3 months.`);
            } else if (config.tier === 'STARTUP' || config.tier === 'CORPORATE') {
              nextCrises.accountsFrozen = true;
              currentNews.unshift(`CRITICAL FAILURE: Accounts frozen due to regulatory breach.`);
            } else if (config.tier === 'ELITE' || config.tier === 'MOGUL' || config.tier === 'PRESIDENT') {
              nextCrises.blacklistTurns = 4;
              currentNews.unshift(`CRITICAL FAILURE: Blacklisted from elite circles for 4 months.`);
            }
          }

          // Build next state
          const nextPl = {
            ...state.pl,
            bag: nextBag,
            clout: Math.min(state.pl.maxClout, Math.max(0, state.pl.clout + finalYieldClout)),
            aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + finalYieldAura)),
            mentalHealth: Math.min(state.pl.maxMentalHealth, Math.max(0, state.pl.mentalHealth + finalHitMental)),
            heat: Math.min(100, Math.max(0, state.pl.heat + finalHitHeat)),
            hustleFatigue: {
              ...state.pl.hustleFatigue,
              [hustleId]: (state.pl.hustleFatigue[hustleId] || 0) + (isSuccess ? lineageFatigue : Math.floor(lineageFatigue * 0.5))
            },
            hypeIsActive: (isSuccess && (hustleId === 'cc' || hustleId === 'pod')) ? true : false,
            lastExecutedHustleId: hustleId,
            streak: isSuccess ? state.pl.streak + 1 : 0,
            crises: nextCrises,
            stats: nextStats,
          };

          // Specialized stats on success
          if (isSuccess) {
            if (hustleId === 'cc') nextPl.streetStats.ccSubs += 1000;
            if (hustleId === 'pod') nextPl.streetStats.podEpisodes += 1;
            if (hustleId === 'audio') {
              nextPl.streetStats.audioTracks += 1;
              nextPl.assetsOwned.masterTracks += 1;
            }
            if (hustleId === 'drip') nextPl.streetStats.dripStock += 10;
            if (hustleId === 'meme') nextPl.streetStats.activeMemeTokens += 1;
            if (hustleId === 'saas_mvp') nextPl.startupStats.saasUsers += 500;
            if (hustleId === 'agency_scale') nextPl.startupStats.agencyStaff += 1;
            if (hustleId === 'ecom_brand') nextPl.startupStats.ecomOrders += 200;
            if (hustleId === 'r_plasma') nextPl.plasmaUsedThisMonth = true;
            if (hustleId === 'sw' || hustleId === 'drop' || hustleId === 'vintage') nextPl.swCooldownTurns = 3;
            if (hustleId === 'r_vending') nextPl.assetsOwned.vendingMachines += 1;
          }

          // Trigger VFX
          useJuiceStore.getState().checkAndTriggerVFX(state.pl.bag, nextBag, isSuccess ? 'SURGE' : 'CASCADE');

          const nextState: GameState = {
            ...state,
            pl: nextPl,
            news: currentNews,
          };

          // Advance time
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

      purchaseFlexAsset: (assetId) => set((state) => {
        const asset = FLEX_ASSETS.find(a => a.id === assetId);
        if (!asset) return {};

        if (state.pl.bag < asset.cost) {
          return { news: [`INSUFFICIENT FUNDS: Need $${asset.cost.toLocaleString()} for ${asset.name}.`, ...state.news] };
        }

        const nextFlexAssets = {
          ...state.pl.flexAssets,
          [assetId]: (state.pl.flexAssets[assetId] || 0) + 1
        };

        const nextStats = { ...state.pl.stats };
        const currentTierStats = nextStats.tierHistory[state.pl.currentTier];
        if (currentTierStats) {
          currentTierStats.flexAssets.push(asset.name);
        }

        const totalFlex = Object.values(nextFlexAssets).reduce((a, b) => a + b, 0);
        if (totalFlex >= 5 && !nextStats.unlockedAchievements.includes('Flex Collector')) {
          nextStats.unlockedAchievements.push('Flex Collector');
        }

        const nextState = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - asset.cost,
            flexAssets: nextFlexAssets,
            stats: nextStats
          },
          news: [`ASSET ACQUIRED: ${asset.name} added to your collection.`, ...state.news]
        };

        return clampStats(nextState);
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
