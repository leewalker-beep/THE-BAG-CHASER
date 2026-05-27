import { fMny } from '../../config.js';

export const createCorporateSlice = (set, get) => ({
  rSaasClick: async () => {
    const { pl, flex, updateFatigue, ass, adv, techFlipsComplete } = get();
    if (pl.bag < 5000 || pl.mentalHealth < 20) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000, mentalHealth: state.pl.mentalHealth - (20 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, saas: (state.hustleClicks.saas || 0) + 1 } }));
    if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) {
      const pen = ass.legalTeam ? 25000 : 50000;
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag - pen }, saasPenaltyActive: true, news: ["🚨 CYBER BREACH!", ...state.news.slice(0, 15)] }));
      return undefined;
    }
    const gain = techFlipsComplete >= 10 ? 120 : 100;
    set(state => ({ saasUsers: state.saasUsers + gain, news: [`📈 +${gain} users.`, ...state.news.slice(0, 15)] })); adv();
  },

  rAiAgencyClick: async () => {
    const { pl, flex, ass, adv } = get();
    if (pl.bag < 2500 || pl.mentalHealth < 15 || pl.bag < 1000000 || pl.clout < 150 || pl.aura < 100) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 2500, mentalHealth: state.pl.mentalHealth - (15 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, ai_agency: (state.hustleClicks.ai_agency || 0) + 1 } }));
    if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) { set(state => ({ apiLockoutMonths: ass.legalTeam ? 1 : 3, news: ["🚨 Agency suspended.", ...state.news.slice(0, 15)] })); return undefined; }
    if (Math.random() < 0.4) set(state => ({ corpClients: state.corpClients + 1, news: ["🤝 New corporate client.", ...state.news.slice(0, 15)] }));
    else set(state => ({ news: ["❌ Proposal rejected.", ...state.news.slice(0, 15)] }));
    adv();
  },

  rCreBuyOffice: async () => {
    const { pl, flex, adv } = get(); if (pl.bag < 15000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 15000000, mentalHealth: state.pl.mentalHealth - (30 * (1 - reduction)) }, creOfficeCount: state.creOfficeCount + 1, hustleClicks: { ...state.hustleClicks, cre: (state.hustleClicks.cre || 0) + 1 }, news: ["🏢 Office acquisition complete.", ...state.news.slice(0, 15)] }));
    adv();
  },

  rCreBuyRetail: async () => {
    const { pl, flex, adv } = get(); if (pl.bag < 5000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000000, mentalHealth: state.pl.mentalHealth - (30 * (1 - reduction)) }, creRetailCount: state.creRetailCount + 1, hustleClicks: { ...state.hustleClicks, cre: (state.hustleClicks.cre || 0) + 1 }, news: ["🏢 Retail Strip acquisition complete.", ...state.news.slice(0, 15)] }));
    adv();
  },

  rFranchiseClick: async () => {
    const { pl, flex, ass, adv } = get(); if (pl.bag < 500000 || pl.mentalHealth < 25 || pl.bag < 5000000 || pl.clout < 300 || pl.aura < 200) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500000, mentalHealth: state.pl.mentalHealth - (25 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, franchise: (state.hustleClicks.franchise || 0) + 1 } }));
    if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) {
      if (ass.legalTeam && Math.random() < 0.5) set(state => ({ news: ["⚖️ Legal blocked union strike.", ...state.news.slice(0, 15)] }));
      else set(state => ({ unionStrikeActive: true, news: ["🚨 UNION STRIKE!", ...state.news.slice(0, 15)] }));
      return undefined;
    }
    set(state => ({ franchiseCount: state.franchiseCount + 1, news: ["🍟 New territory acquired.", ...state.news.slice(0, 15)] })); adv();
  },

  rResolveUnionStrike: (choice) => {
    const { pl } = get();
    if (choice === 'settle') {
      if (pl.bag < 100000) return;
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100000 }, unionStrikeActive: false, unionStrikeIgnored: false, news: ["✅ Settlement paid.", ...state.news.slice(0, 15)] }));
    } else set(state => ({ unionStrikeIgnored: true, news: ["⚠️ Strike ignored.", ...state.news.slice(0, 15)] }));
  },

  rResolveSupplyChain: async () => {
    const { pl } = get(); if (pl.bag < 2000000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 2000000 }, supplyChainDisruption: false, news: ["✅ Logistics stabilized.", ...state.news.slice(0, 15)] }));
  },

  rProcessBulkPallet: async (correct = 0, incorrect = 0) => {
    const { pl, supplyChainShockMonths, legacyMultiplier, triggerImpact, adv } = get();
    const baseCost = 5000; const cost = Math.floor(baseCost * (supplyChainShockMonths > 0 ? 1.2 : 1.0));
    if (pl.bag < cost || pl.mentalHealth < 40) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost, mentalHealth: Math.max(0, state.pl.mentalHealth - 40 - (incorrect * 2)) } }));
    await new Promise(r => setTimeout(r, 1000));
    const finalPayout = Math.floor((baseCost + (650 * 14 * (correct / Math.max(1, correct + incorrect)))) * legacyMultiplier);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + finalPayout, clout: Math.min(state.pl.maxClout, state.pl.clout + 10) }, techFlipsComplete: state.techFlipsComplete + correct, news: [`📦 Net: $${(finalPayout - cost).toLocaleString()}.`, ...state.news.slice(0, 15)] }));
    triggerImpact('bag', finalPayout - cost); adv();
  },

  rTechSource: async () => {
    if (get().techItem) return;
    const { pl, bulkPalletsUnlocked, techSourceCost, updateFatigue, triggerChaos, karmaFlags } = get();
    const cost = bulkPalletsUnlocked ? Math.floor(techSourceCost * 0.6) : techSourceCost;
    if (pl.bag < cost) return; updateFatigue('tech');
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost }, techItem: { id: Math.random(), name: "Bricked Hardware" }, hustleClicks: { ...state.hustleClicks, tech: state.hustleClicks.tech + 1 } }));
    if (triggerChaos('tech')) {
      if (karmaFlags.usedCheapParts) set(state => state.pl.bag >= 250 ? { pl: { ...state.pl, bag: state.pl.bag - 250 }, news: ["💸 Swollen screen refund paid.", ...state.news.slice(0, 15)] } : { pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 15) }, news: ["💀 Refused refund.", ...state.news.slice(0, 15)] });
      else set(state => ({ techSourceCost: 250, news: ["🚫 Sourcing climbs to 50.", ...state.news.slice(0, 15)] }));
      return undefined;
    }
    set(state => ({ news: ["💻 TECH: Sourced bricked hardware.", ...state.news.slice(0, 15)] }));
  },

  rTechFixA: async () => {
    const { pl, flex, techItem, triggerNotification, legacyMultiplier, triggerImpact, adv } = get();
    if (pl.bag < 30 || pl.mentalHealth < 10 || !techItem) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 30, mentalHealth: state.pl.mentalHealth - (10 * (1 - reduction)) } }));
    await new Promise(r => setTimeout(r, 800));
    if (flex.logistics.owned || Math.random() < 0.5) {
      if (pl.bag < 100000 && pl.bag >= 10000) triggerNotification('BAG_BOOST_01');
      const payout = Math.floor(750 * legacyMultiplier);
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag + payout }, techItem: null, news: [`✅ Sold for $${payout}.`, ...state.news.slice(0, 15)] }));
      triggerImpact('bag', payout - 30);
    } else set(state => ({ pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 5) }, techItem: null, news: ["💀 Bricked hardware.", ...state.news.slice(0, 15)] }));
    adv();
  },

  rTechFixB: async () => {
    const { pl, flex, techItem, legacyMultiplier, triggerImpact, adv } = get();
    if (pl.bag < 100 || pl.mentalHealth < 15 || !techItem) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100, mentalHealth: state.pl.mentalHealth - (15 * (1 - reduction)), clout: Math.min(state.pl.maxClout, state.pl.clout + 2), aura: Math.min(state.pl.maxAura, state.pl.aura + 1) }, techFlipsComplete: state.techFlipsComplete + 1 }));
    await new Promise(r => setTimeout(r, 1000));
    const payout = Math.floor(750 * legacyMultiplier);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + payout }, techItem: null, news: [`✅ Sold for $${payout}.`, ...state.news.slice(0, 15)] }));
    triggerImpact('bag', payout - 100); adv(); return 650;
  },

  rTechMicroSolder: async (success) => {
    const { pl, legacyMultiplier, triggerImpact, adv } = get(); if (pl.bag < 1000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 1000 } }));
    await new Promise(r => setTimeout(r, 500));
    if (success) {
      const payout = Math.floor(1500 * legacyMultiplier);
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag + payout, clout: Math.min(state.pl.maxClout, state.pl.clout + 50), aura: Math.min(state.pl.maxAura, state.pl.aura + 5) }, techFlipsComplete: state.techFlipsComplete + 5, news: [`🔬 Yield doubled, +50 Clout.`, ...state.news.slice(0, 15)] }));
      triggerImpact('bag', payout - 1000);
    } else set(state => ({ pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 10), mentalHealth: Math.max(0, state.pl.mentalHealth - 15) }, news: [`💥 Circuit Shorted!`, ...state.news.slice(0, 15)] }));
    adv();
  },

  rLaunchSmmRetainer: async () => {
    const { pl } = get(); if (pl.bag < 4000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 4000 }, smmRetainerActive: true, news: ["📱 SMM: Retainer packages launched.", ...state.news.slice(0, 15)] }));
  },

  rBuySmmFactory: async () => {
    const { pl } = get(); if (pl.bag < 20000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 20000 }, aiSmmFactory: true, news: ["🤖 SMM: AI Content Factory deployed.", ...state.news.slice(0, 15)] }));
  },

  rBuySmmEmpire: async () => {
    const { pl } = get(); if (pl.bag < 250000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 250000 }, smmEmpireActive: true, news: ["🌍 SMM: Global Media Empire established.", ...state.news.slice(0, 15)] }));
  },

});
