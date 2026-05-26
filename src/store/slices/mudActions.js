import { mudChaosPools } from '../../data/chaosPools.js';
import { fMny } from '../../config.js';

export const createMudSlice = (set, get) => ({
  rVintage: async () => {
    const { pl, sneakerBackdoorPlug, vintageLock, flex, triggerChaos, updateFatigue, triggerNotification, karmaFlags, triggerImpact, collectiblePhase, adv } = get();
    const cost = sneakerBackdoorPlug ? 500 : 50;
    if (pl.bag < cost || pl.mentalHealth < 10) return;
    if (vintageLock > 0) {
      if (pl.bag >= 150) {
        set(state => ({
          mod: {
            s: true,
            t: "WAREHOUSE BRIBE",
            m: "The warehouse boss is still blocking your entry. Pay a 50 bribe to clear the blacklist?",
            o: [
              { label: "PAY BRIBE (50)", action: () => {
                get().triggerNotification('HET_LOW_01');
                set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 150 }, vintageLock: 0, mod: { s: false } }));
              } },
              { label: "CANCEL", action: () => set(state => ({ mod: { s: false } })) }
            ],
            ui: "ui-modal"
          }
        }));
      }
      return;
    }
    updateFatigue('vintage');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);

    set(state => ({
      pl: { ...state.pl, bag: state.pl.bag - cost, mentalHealth: state.pl.mentalHealth - (10 * (1 - mhReduction)) },
      hustleClicks: { ...state.hustleClicks, vintage: state.hustleClicks.vintage + 1 }
    }));

    if (triggerChaos('vintage')) {
      const { pl: currentPl, karmaFlags: currentKarma } = get();
      const financialPhase = currentPl.bag < 10000 ? 1 : currentPl.bag < 100000 ? 2 : currentPl.bag < 500000 ? 3 : 0;
      if (currentPl.bag < 500000 && financialPhase === 3) triggerNotification('AUR_FAIL_01');

      if (currentKarma.soldBootleg) {
        set(state => ({
          pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 20) },
          smmPenalty: true,
          news: ["🚫 THE COMMUNITY EXPOSURE: Thrift community exposed your bootleg sales online. -20 Aura, SMM access locked.", ...state.news.slice(0, 15)]
        }));
      } else {
        set(state => ({
          vintageLock: 3,
          news: ["🚫 THE WAREHOUSE BLACKLIST: Boss blocks entry for 3 months unless you pay a 50 bribe.", ...state.news.slice(0, 15)]
        }));
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 800));

    const roll = Math.random();
    let profit = -cost;
    if (roll < 0.01) { // GRAIL!
      set(state => ({
        pl: { ...state.pl, bag: state.pl.bag + 600, clout: Math.min(state.pl.maxClout, state.pl.clout + 15), aura: Math.min(state.pl.maxAura, state.pl.aura + 1) },
        vaultHoldings: collectiblePhase === 'VAULT' ? [...state.vaultHoldings, { name: "Thrifted Grail", cost: 600 }] : state.vaultHoldings,
        news: ["👕 GRAIL FOUND! A rare archive piece secured for the vault.", ...state.news.slice(0, 15)],
        mod: {
          s: true,
          t: "GRAIL SECURED! 🏆",
          m: "You hit the bins and found an authentic 1990s Grail. The street authenticity and clout boost is massive.",
          o: [{ label: "CELEBRATE", action: () => set(state => ({ mod: { s: false } })) }],
          ui: "ui-modal"
        }
      }));
      triggerImpact('bag', 600);
      profit = 600;
    } else if (roll < 0.61) { // Mid-Tier
      set(state => ({
        pl: { ...state.pl, bag: state.pl.bag + 120, clout: Math.min(state.pl.maxClout, state.pl.clout + 3) }
      }));
      triggerImpact('bag', 120);
      profit = 120;
    } else if (roll < 0.90) { // Common Thrift
      set(state => ({
        pl: { ...state.pl, bag: state.pl.bag + 35 }
      }));
      triggerImpact('bag', 35);
      profit = 35;
    } else { // Bootleg
      set({ vinCh: 'bootleg' });
      return undefined;
    }

    const net = profit - cost;
    if (net > 0) {
      set(state => {
        const nextRev = state.vintageRevenueTracker + net;
        let nextPhase = state.collectiblePhase;
        let nextBoost = state.vintageBoostActive;
        let nextAura = state.pl.aura;
        let newsUpdate = [];

        if (nextRev >= 2500 && state.collectiblePhase === 'VINTAGE') {
          nextPhase = 'SNEAKER';
          nextBoost = true;
          nextAura += 500;
          newsUpdate = ["🌟 VINTAGE EMPIRE UNLOCKED! +500 Aura & +50% Passive Revenue Boost!"];
        }

        return {
          vintageRevenueTracker: nextRev,
          collectiblePhase: nextPhase,
          vintageBoostActive: nextBoost,
          pl: { ...state.pl, aura: nextAura },
          news: [...newsUpdate, ...state.news.slice(0, 15 - newsUpdate.length)]
        };
      });
    }

    adv();
    return profit;
  },

  rVinCh: async (choice) => {
    const { adv, triggerImpact, triggerNotification } = get();
    if (choice === 'burn') {
      set(state => ({
        pl: { ...state.pl, aura: Math.min(state.pl.maxAura, state.pl.aura + 1) },
        news: ["🔥 VINTAGE: Burned the bootleg. Street authenticity +1.", ...state.news.slice(0, 15)]
      }));
    } else if (choice === 'pass') {
      triggerNotification('CLT_FAIL_01');
      set(state => ({
        pl: { ...state.pl, bag: state.pl.bag + 150, aura: Math.max(0, state.pl.aura - 10) },
        news: ["💀 VINTAGE: Passed off a rep. Reputation damaged, but bags secured.", ...state.news.slice(0, 15)]
      }));
      triggerImpact('bag', 150);
    }
    set({ vinCh: null });
    adv();
  },

  rSw: async () => {
    const { pl, sw, up, flex, swFatigue, updateFatigue, triggerChaos, triggerNotification, ass, karmaFlags, triggerImpact, adv, mkt, legacyMultiplier } = get();
    const totalOut = (sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a);
    if (pl.mentalHealth < 15) return;
    updateFatigue('streetwear');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);

    set(state => ({
      pl: { ...state.pl, bag: state.pl.bag - totalOut, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) },
      hustleClicks: { ...state.hustleClicks, streetwear: state.hustleClicks.streetwear + 1 }
    }));

    if (triggerChaos('streetwear')) {
      const { pl: currentPl } = get();
      const financialPhase = currentPl.bag < 10000 ? 1 : currentPl.bag < 100000 ? 2 : currentPl.bag < 500000 ? 3 : 0;
      if (financialPhase === 2) triggerNotification('HET_RISE_01');

      if (karmaFlags.usedCheapBlanks) {
        const cloutPen = ass.legalTeam ? 7 : 15;
        set(state => ({
          pl: { ...state.pl, clout: Math.max(0, state.pl.clout - cloutPen) },
          news: ["💀 KARMA DETONATION: Influencer rips your stitching apart. Penalty mitigated by legal.", ...state.news.slice(0, 15)]
        }));
      } else {
        const bagPen = ass.legalTeam ? 200 : 400;
        const cloutPen = ass.legalTeam ? 7 : 15;
        const mhPen = ass.legalTeam ? 12 : 25;
        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag - bagPen, clout: Math.max(0, state.pl.clout - cloutPen), mentalHealth: Math.max(0, state.pl.mentalHealth - mhPen) },
          news: ["🚫 THE COPYRIGHT STRIKE: Legal team reduced damages.", ...state.news.slice(0, 15)]
        }));
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 1000));

    const baseValue = sw.i === 1 ? 50 : sw.i === 2 ? 125 : 300;
    let hype = (pl.aura * 0.5) + (pl.clout * 0.3) + (sw.a / 2500);
    if (mkt === 1) hype *= 1.6;

    if (sw.p > baseValue) {
      hype *= Math.max(0, 1 - ((sw.p - baseValue) * 0.04));
    }

    hype *= Math.max(0, 1 - (swFatigue * 0.15));

    let unitsSold = Math.floor(Math.min(sw.u, Math.max(0, hype * (5 + Math.random() * 5))));
    unitsSold = Math.max(0, unitsSold);

    const revenue = Math.floor(unitsSold * sw.p * legacyMultiplier);
    const profit = revenue - totalOut;

    set(state => ({ swFatigue: state.swFatigue + (sw.u / 1000) }));

    let auraGain = 0;
    let cloutGain = 0;
    let newsMsg = "";

    if (unitsSold >= sw.u * 0.8) {
      const { pl: currentPl } = get();
      const financialPhase = currentPl.bag < 10000 ? 1 : currentPl.bag < 100000 ? 2 : currentPl.bag < 500000 ? 3 : 0;
      if (currentPl.bag < 500000 && financialPhase === 3) triggerNotification('BAG_WIN_01');

      auraGain = 10;
      cloutGain = 5;
      newsMsg = "👟 VIRAL SELLOUT! Cleared all inventory.";
    } else if (unitsSold < sw.u * 0.2) {
      auraGain = -15;
      newsMsg = "👟 Bricked. Heavy boxes sitting in the warehouse.";
    } else {
      newsMsg = `👟 Drop concluded. Moved ${unitsSold.toLocaleString()} units.`;
    }

    set(state => ({
      pl: {
        ...state.pl,
        bag: state.pl.bag + revenue,
        aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + auraGain)),
        clout: Math.min(state.pl.maxClout, state.pl.clout + (cloutGain || 0))
      },
      news: [newsMsg, ...state.news.slice(0, 15)],
      hl: { ...state.hl, sw: state.hl.sw + Math.max(0, profit) }
    }));

    triggerImpact('bag', profit);
    adv();
    return profit;
  },

  rSwSpin: async (bet) => {
    const { pl, pfwActive, up, adv } = get();
    if (pl.bag < bet || pl.mentalHealth < 10) return;

    const effectivePfw = pfwActive && up.swFlg;
    const pool = effectivePfw ? ['🧍‍♂️', '🧍‍♀️', '🕴️'] : ['👕', '🧥', '🥼'];
    const theme = effectivePfw ? "High Fashion Editorial Payout" : "Standard Drop Payout";

    set(state => ({
      pl: { ...state.pl, bag: state.pl.bag - bet, mentalHealth: state.pl.mentalHealth - 10 }
    }));

    await new Promise(r => setTimeout(r, 600));

    const reels = [
      pool[Math.floor(Math.random() * pool.length)],
      pool[Math.floor(Math.random() * pool.length)],
      pool[Math.floor(Math.random() * pool.length)],
      pool[Math.floor(Math.random() * pool.length)]
    ];

    let streak = 1;
    for (let i = 1; i < 4; i++) {
      if (reels[i] === reels[0]) streak++;
      else break;
    }

    let multiplier = 0;
    if (streak === 4) multiplier = 2.0;
    else if (streak === 3) multiplier = 1.0;
    else if (streak === 2) multiplier = 0.5;

    const payout = Math.floor(bet * multiplier);
    const profit = payout - bet;

    set(state => ({
      pl: { ...state.pl, bag: state.pl.bag + payout },
      news: [`🎰 RISK TERMINAL: ${theme}. [${reels.join('')}] Streak: ${streak}. Net: $${fMny(profit)}`, ...state.news.slice(0, 15)]
    }));

    adv();
    return { reels, profit, streak };
  },

  rSmmPitch: async () => {
    const { pl, smmPenalty, smmRetainerActive, flex, updateFatigue, triggerChaos, triggerNotification, karmaFlags, adv } = get();
    if (pl.clout < 15 || pl.mentalHealth < 20 || smmPenalty) return;
    updateFatigue('smm');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, mentalHealth: state.pl.mentalHealth - (20 * (1 - mhReduction)) }, hustleClicks: { ...state.hustleClicks, smm: state.hustleClicks.smm + 1 } }));
    if (triggerChaos('smm')) {
      const { pl: curPl } = get();
      const phase = curPl.bag < 10000 ? 1 : curPl.bag < 100000 ? 2 : curPl.bag < 500000 ? 3 : 0;
      if (curPl.bag < 500000 && phase === 3) triggerNotification('HET_CRASH_01');
      if (karmaFlags.ignoredSmmCrisis) set(state => ({ smmClients: Math.max(0, state.smmClients - 2), news: ["📉 KARMA DETONATION: 2 clients lost.", ...state.news.slice(0, 15)] }));
      else set(state => ({ smmPenalty: true, news: ["🚫 THE GROUP-CHAT BLACKLIST.", ...state.news.slice(0, 15)] }));
      return undefined;
    }
    await new Promise(r => setTimeout(r, 800));
    if (Math.random() < (smmPenalty ? 0.1 : 0.5)) set(state => ({ smmClients: state.smmClients + 1, news: ["🤝 SMM: Pitch successful!", ...state.news.slice(0, 15)] }));
    else set(state => ({ news: ["❌ SMM: Pitch Rejected.", ...state.news.slice(0, 15)] }));
    adv();
  },

  rSmmFix: async () => {
    const { pl, flex, adv } = get(); if (pl.mentalHealth < 15) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) } }));
    await new Promise(r => setTimeout(r, 800));
    set({ clientCrisis: false });
    set(state => ({ news: ["✅ SMM: Content strategy fixed.", ...state.news.slice(0, 15)] }));
    adv();
  },

  rDelivery: async () => {
    const { pl, flex, adv } = get(); if (pl.mentalHealth < 15) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 25, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) } }));
    adv(); return 25;
  },

  rPlasma: async () => {
    const { pl, flex, adv } = get(); if (pl.mentalHealth < 40) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 60, mentalHealth: state.pl.mentalHealth - (40 * (1 - mhReduction)) } }));
    adv(); return 60;
  },

  rSurvey: async () => {
    const { pl, flex, adv } = get(); if (pl.mentalHealth < 10) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 10, mentalHealth: state.pl.mentalHealth - (10 * (1 - mhReduction)) } }));
    adv(); return 10;
  },

  rLabor: async () => {
    const { pl, flex, adv } = get(); if (pl.mentalHealth < 25) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 45, mentalHealth: state.pl.mentalHealth - (25 * (1 - mhReduction)) } }));
    adv(); return 45;
  },

  rRunnerRecruit: async () => {
    const { pl, flex, updateFatigue, triggerChaos, karmaFlags, triggerNotification, adv } = get();
    if (pl.bag < 300 || pl.mentalHealth < 25 || pl.clout < 20) return; updateFatigue('runners');
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 300, mentalHealth: state.pl.mentalHealth - (25 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, runners: state.hustleClicks.runners + 1 } }));
    if (triggerChaos('runners')) {
      if (karmaFlags.ignoredRunnerWelfare) set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500, clout: Math.max(0, state.pl.clout - 10) }, news: ["📉 Runner stole package.", ...state.news.slice(0, 15)] }));
      else set(state => ({ runnerCount: Math.max(0, state.runnerCount - 3), pl: { ...state.pl, bag: state.pl.bag - 400 }, news: ["🚫 Sidewalk raid.", ...state.news.slice(0, 15)] }));
      return undefined;
    }
    if (pl.bag < 100000 && pl.bag >= 10000) triggerNotification('AUR_BOOST_01');
    set(state => ({ runnerCount: state.runnerCount + 1, news: ["🏃 GIG: New fleet courier recruited.", ...state.news.slice(0, 15)] }));
    adv();
  },

  rRunnerFix: async () => {
    const { pl } = get(); if (pl.bag < 200) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 200 }, runnerBurnout: false, news: ["✅ Fleet burnout resolved.", ...state.news.slice(0, 15)] }));
  },

  rPod: async () => {
    const { up, pod, pl, adv, triggerImpact } = get();
    const cost = (up.podCmp ? 0 : pod.q) + (pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000);
    if (pl.bag < cost) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost } }));
    await new Promise(r => setTimeout(r, 1000));
    const legacy = (1 + (get().generationCount * 0.25));
    const rev = Math.floor(cost * (1.2 + Math.random() * 1.8) * legacy);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + rev, clout: Math.min(state.pl.maxClout, state.pl.clout + 15) }, hl: { ...state.hl, pod: state.hl.pod + rev - cost } }));
    triggerImpact('bag', rev - cost); adv(); return rev - cost;
  },

  rSneakerDrop: async () => {
    const { pl, flex, sneakerBackdoorPlug, updateFatigue, triggerImpact, adv } = get();
    if (pl.bag < 300 || pl.mentalHealth < 15) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 300, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) } }));
    await new Promise(r => setTimeout(r, 800));
    const success = sneakerBackdoorPlug || Math.random() < 0.5;
    let profit = -300;
    if (success) {
      profit = 600;
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 900, clout: Math.min(state.pl.maxClout, state.pl.clout + 15), aura: Math.min(state.pl.maxAura, state.pl.aura + 10) }, news: ["🔥 HYPEBEAST WIN!", ...state.news.slice(0, 15)] }));
      triggerImpact('bag', 600);
    } else {
      set(state => ({ pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 20), mentalHealth: Math.max(0, state.pl.mentalHealth - 10) }, news: ["💀 CAUGHT BUSTED!", ...state.news.slice(0, 15)] }));
    }
    adv(); return profit;
  },

  rBuyConsignment: async () => {
    const { pl } = get(); if (pl.bag < 1500000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 1500000 }, collectiblePhase: 'CONSIGNMENT', consignmentFeeActive: true, news: ["📱 PLATFORM: Hype Consignment Network launched.", ...state.news.slice(0, 15)] }));
  },

  rBuyVault: async () => {
    const { pl } = get(); if (pl.bag < 5000000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000000 }, collectiblePhase: 'VAULT', news: ["🔒 VAULT: Blue-Chip Collectible Vault constructed.", ...state.news.slice(0, 15)] }));
  },

  rBuyVaultAsset: async (asset) => {
    const { pl } = get(); if (pl.bag < asset.cost) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - asset.cost, aura: Math.min(state.pl.maxAura, state.pl.aura + asset.aura) }, vaultHoldings: [...state.vaultHoldings, { name: asset.name, cost: asset.cost }], news: [`🏆 VAULT: Acquired ${asset.name}.`, ...state.news.slice(0, 15)] }));
  },

  rVaultAuction: async () => {
    const { pl, adv } = get(); if (pl.bag < 500000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500000 } }));
    await new Promise(r => setTimeout(r, 1000));
    const itemNames = ["1985 Game-Worn Jordans", "Original Comic Art #1", "Pre-War Luxury Timepiece", "Historical Document Fragment"];
    const name = itemNames[Math.floor(Math.random() * itemNames.length)];
    set(state => ({ vaultHoldings: [...state.vaultHoldings, { name, cost: 500000 }], news: [`🏆 AUCTION: Secured ${name}.`, ...state.news.slice(0, 15)] }));
    adv();
  },

  rDrp: async () => {
    const { pl, dUp, drp, setDrp, triggerImpact, adv } = get();
    const cost = 10000;
    if (pl.bag < cost) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost } }));
    await new Promise(r => setTimeout(r, 1000));
    const rev = Math.floor(cost * (1.5 + Math.random() * 2.0));
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + rev }, news: [`📦 DROPSHIP: Shipments delivered. Net: $${fMny(rev - cost)}.`, ...state.news.slice(0, 15)] }));
    triggerImpact('bag', rev - cost); adv();
  },
});
