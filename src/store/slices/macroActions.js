import { fMny } from '../../config.js';

export const createMacroSlice = (set, get) => ({
  rPeClick: async () => {
    const state = get();
    const { pl, flex, ass, adv } = state;
    const macro = { peProgress: state.peProgress, guttedFirms: state.guttedFirms };

    if (pl.bag < 25000000 || pl.mentalHealth < 40) return;
    if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) {
      const bagPen = ass.legalTeam ? 5000000 : 10000000; const auraPen = ass.legalTeam ? 75 : 150;
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag - bagPen, aura: Math.max(0, state.pl.aura - auraPen) }, news: ["🚨 SEC SUBPOENA!", ...state.news.slice(0, 15)] }));
      return -bagPen;
    }
    set(state => ({ hustleClicks: { ...state.hustleClicks, pe: (state.hustleClicks.pe || 0) + 1 } }));
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    let profit = -25000000;
    if (macro.peProgress + 20 >= 100) {
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 25000000, clout: Math.min(state.pl.maxClout, state.pl.clout + 500), mentalHealth: Math.max(0, state.pl.mentalHealth - 30 - (40 * (1 - reduction))) }, peProgress: 0, guttedFirms: state.guttedFirms + 1, news: ["💰 PE: Buyout complete!", ...state.news.slice(0, 15)] }));
      profit = 25000000;
    } else set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 25000000, mentalHealth: state.pl.mentalHealth - (40 * (1 - reduction)) }, peProgress: (state.peProgress || 0) + 20 }));
    adv(); return profit;
  },

  rArtSpeculate: async () => {
    const { pl, adv } = get(); if (pl.mentalHealth < 20) return;
    set(state => ({ pl: { ...state.pl, mentalHealth: state.pl.mentalHealth - 20 }, artMarketSentiment: Math.max(-1, Math.min(1, state.artMarketSentiment + (Math.random() - 0.5) * 0.4)), news: ["🎨 ART: Market speculation executed.", ...state.news.slice(0, 15)] }));
    adv(); return 0;
  },

  rArtBuy: async () => {
    const { pl, artCollection, adv } = get(); const ART_PRICE = 12400000;
    if (pl.bag < ART_PRICE) return;
    const nextCount = artCollection.length + 1;
    set(state => ({
      pl: { ...state.pl, bag: state.pl.bag - ART_PRICE },
      artCollection: [...state.artCollection, { id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, name: `Elite Masterpiece #${state.artCollection.length + 1}`, baseValue: ART_PRICE, isDisplayed: true }],
      venueState: nextCount >= 50 ? "THE GALLERY / MUSEUM" : (nextCount >= 20 ? "THE CURATED EXHIBIT" : "THE VAULT"),
      news: ["🎨 ART: Elite masterpiece acquired.", ...state.news.slice(0, 15)]
    }));
    adv(); return -ART_PRICE;
  },

  finalizeAuction: (piece) => {
    const { legacyMultiplier, artBubbleMonths, adv, triggerImpact } = get();
    const finalPayout = Math.floor(piece.baseValue * (0.8 + Math.random() * 1.7) * legacyMultiplier * (artBubbleMonths > 0 ? 1.4 : 1.0));
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + finalPayout }, artCollection: state.artCollection.filter(p => p.id !== piece.id), news: [`🖼️ AUCTION: ${piece.name} hammered for $${fMny(finalPayout)}.`, ...state.news.slice(0, 15)], mod: { s: false } }));
    triggerImpact('bag', finalPayout); adv();
  },

  rArtAuction: async () => {
    const { artCollection, finalizeAuction } = get(); if (artCollection.length <= 0) return;
    const piece = artCollection[artCollection.length - 1];
    set({ gBusy: true }); await new Promise(r => setTimeout(r, 1000));
    const bid1 = Math.floor(piece.baseValue * (0.8 + Math.random() * 0.4));
    const bid2 = Math.floor(piece.baseValue * (1.2 + Math.random() * 0.4));
    const bid3 = Math.floor(piece.baseValue * (1.6 + Math.random() * 0.4));
    set({
      mod: { s: true, t: "SOTHEBY'S LIVE AUCTION", m: `Intense bidding war for "${piece.name}".\n\n- Floor: $${fMny(bid1)}\n- Phone: $${fMny(bid2)}\n- Proxy: $${fMny(bid3)}`, o: [{ label: "WATCH HAMMER FALL", action: () => finalizeAuction(piece) }], ui: "ui-modal" },
      gBusy: false
    });
  },

  rArtHostExhibit: async () => {
    const { artCollection, pl, adv } = get(); if (artCollection.length < 20 || pl.mentalHealth < 40) return;
    set({ gBusy: true }); set(state => ({ pl: { ...state.pl, mentalHealth: Math.max(0, state.pl.mentalHealth - 40) } }));
    await new Promise(r => setTimeout(r, 1500));
    const displayed = artCollection.filter(p => p.isDisplayed);
    const totalVal = displayed.reduce((acc, curr) => acc + curr.baseValue, 0);
    const cloutGain = Math.floor(displayed.length * 15);
    const gateRev = Math.floor(totalVal * 0.05);
    set(state => ({
      pl: { ...state.pl, bag: state.pl.bag + gateRev, clout: Math.min(state.pl.maxClout, state.pl.clout + cloutGain) },
      mod: { s: true, t: "PRIVATE EXHIBITION CONCLUDED", m: `Returns: $${fMny(gateRev)}.`, o: [{ label: "MASTERFUL", action: () => set({ mod: { s: false } }) }], ui: "ui-modal" },
      news: ["🎨 EXHIBIT: Conclusion.", ...state.news.slice(0, 15)],
      gBusy: false
    }));
    adv(); return gateRev;
  },

  rAcceptPatronOffer: (pieceId, offerAmount) => {
    const { adv } = get();
    set(state => ({ artCollection: state.artCollection.filter(p => p.id !== pieceId), pl: { ...state.pl, bag: state.pl.bag + offerAmount }, mod: { s: false }, news: [`🎨 PATRON: Piece sold for $${fMny(offerAmount)}.`, ...state.news.slice(0, 15)] }));
    adv(); return offerAmount;
  },

  rFormConglom: async () => {
    const { pl, saasUsers, corpClients, creOfficeCount, creRetailCount, franchiseCount, guttedFirms, artCollection, tch, crp, tur, hf } = get();
    const hasAssets = saasUsers > 0 || corpClients > 0 || creOfficeCount > 0 || creRetailCount > 0 || franchiseCount > 0 || guttedFirms > 0 || artCollection.length > 0 || tch.l || crp.l > 0 || tur.t > 1 || hf.c > 0;
    if (pl.bag < 250000000 || !hasAssets) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 250000000 }, conglomActive: true, news: ["🏢 CONGLOMERATE: Global Holding Co formed.", ...state.news.slice(0, 15)] }));
  },

  rLobbyRegulators: async () => {
    const { pl } = get(); if (pl.bag < 10000000 || pl.aura < 20) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 10000000, aura: Math.max(0, state.pl.aura - 20) }, antitrustRisk: Math.max(0, state.antitrustRisk - 40), news: ["⚖️ LOBBYING: Strategic donations made.", ...state.news.slice(0, 15)] }));
  },

  rSwfInvest: async () => {
    const { pl } = get(); if (pl.bag < 100000000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100000000 }, swfInvestment: state.swfInvestment + 100000000, news: ["🌍 SWF: 100M parked.", ...state.news.slice(0, 15)] }));
  },

  rSwfWithdraw: async () => {
    const { swfFrozen, swfInvestment, pl } = get(); if (swfFrozen || swfInvestment <= 0) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + swfInvestment }, swfInvestment: 0, news: ["🌍 SWF: Liquidation.", ...state.news.slice(0, 15)] }));
  },

  rAudioRelease: async () => {
    const { pl, flex, audioUpgrades, viralPopMonths, adv } = get(); if (pl.bag < 1000 || pl.mentalHealth < 15) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 1000, mentalHealth: state.pl.mentalHealth - (15 * (1 - reduction)) } }));
    await new Promise(r => setTimeout(r, 800));
    let successChance = 0.6; if (audioUpgrades.mixingSuite) successChance = 0.8; if (audioUpgrades.analogConsole) successChance = 0.9; if (viralPopMonths > 0) successChance = 0.9;
    if (Math.random() < successChance) set(state => ({ audioTracks: state.audioTracks + 1, news: ["<span class='news-bag'>🎵 AUDIO: New single trending.</span>", ...state.news.slice(0, 15)] }));
    else set(state => ({ news: ["🎵 Single flopped.", ...state.news.slice(0, 15)] }));
    if (Math.random() < 0.02) set(state => ({ sampleStrike: true, news: ["🚨 Sample strike detected!", ...state.news.slice(0, 15)] }));
    adv();
  },

  rAudioSettle: async () => {
    const { pl } = get(); if (pl.bag < 5000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000 }, sampleStrike: false, news: ["✅ Legal settlement paid.", ...state.news.slice(0, 15)] }));
  },

  rPmcDeploy: async () => {
    const { pl, flex, adv } = get(); if (pl.bag < 5000000 || pl.mentalHealth < 40) return;
    const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000000, mentalHealth: state.pl.mentalHealth - (40 * (1 - reduction)) } }));
    await new Promise(r => setTimeout(r, 1200));
    if (Math.random() < 0.5) set(state => ({ pmcSquads: state.pmcSquads + 1, news: ["🎖️ PMC: Tactical squad deployed.", ...state.news.slice(0, 15)] }));
    else set(state => ({ news: ["🎖️ Mission failed.", ...state.news.slice(0, 15)] }));
    if (Math.random() < 0.02) set(state => ({ intelLeak: true, news: ["🚨 Intel leak detected!", ...state.news.slice(0, 15)] }));
    adv();
  },

  rPmcSettle: async () => {
    const { pl } = get(); if (pl.bag < 2500000) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 2500000 }, intelLeak: false, news: ["✅ Damage control complete.", ...state.news.slice(0, 15)] }));
  },

  rPmcHire: async () => {
    const { pl, pmcMercCost } = get(); if (pl.bag < pmcMercCost) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - pmcMercCost }, pmcMercenaries: state.pmcMercenaries + 1, pmcMercCost: state.pmcMercCost + 15000, news: ["🎖️ New mercenary asset hired.", ...state.news.slice(0, 15)] }));
  },

  rPmcDeployContract: async () => {
    const { pmcMercenaries } = get(); if (pmcMercenaries < 1) return;
    set(state => ({ pmcMercenaries: state.pmcMercenaries - 1, pmcActiveContracts: state.pmcActiveContracts + 1, news: ["🎖️ Contract deployed.", ...state.news.slice(0, 15)] }));
  },

  rPmcBribe: async () => {
    const { pl, pmcBribeCost } = get(); if (pl.bag < pmcBribeCost) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - pmcBribeCost }, pmcHeatLevel: Math.max(0, state.pmcHeatLevel * 0.6), pmcBribeCost: state.pmcBribeCost + 5000, news: ["⚖️ Authorities bribed.", ...state.news.slice(0, 15)] }));
  },

  rMovieGreenlight: (tier) => {
    const { pl } = get(); const costs = [0, 5000000, 50000000, 200000000];
    if (pl.bag < costs[tier]) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - costs[tier] }, movieProject: { status: 'PRODUCTION', budgetTier: tier, hypeLevel: 0 }, news: ["🎬 MOVIE: Project greenlit.", ...state.news.slice(0, 15)] }));
  },

  rMovieHypeBag: async () => {
    const { pl, movieProject } = get(); if (pl.bag < 500000 || movieProject.status !== 'PRODUCTION') return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500000 }, movieProject: { ...state.movieProject, hypeLevel: Math.min(100, state.movieProject.hypeLevel + 10) }, news: ["🎬 MOVIE: PR firm hired.", ...state.news.slice(0, 15)] }));
  },

  rMovieHypeClout: async () => {
    const { pl, movieProject } = get(); if (pl.clout < 50 || movieProject.status !== 'PRODUCTION') return;
    set(state => ({ pl: { ...state.pl, clout: state.pl.clout - 50 }, movieProject: { ...state.movieProject, hypeLevel: Math.min(100, state.movieProject.hypeLevel + 15) }, news: ["🎬 MOVIE: Viral activation.", ...state.news.slice(0, 15)] }));
  },

  rMovieHypeAura: async () => {
    const { pl, movieProject } = get(); if (pl.aura < 25 || movieProject.status !== 'PRODUCTION') return;
    set(state => ({ pl: { ...state.pl, aura: state.pl.aura - 25 }, movieProject: { ...state.movieProject, hypeLevel: Math.min(100, state.movieProject.hypeLevel + 25) }, news: ["🎬 MOVIE: Celebrity endorsement.", ...state.news.slice(0, 15)] }));
  },

  rMovieRelease: async () => {
    const { movieProject, flex, adv } = get(); if (movieProject.status !== 'PRODUCTION') return;
    set({ gBusy: true }); await new Promise(r => setTimeout(r, 2000)); set({ gBusy: false });
    const budget = [0, 5000000, 50000000, 200000000][movieProject.budgetTier];
    const roll = Math.random() * 100 + (movieProject.hypeLevel / 2);
    let title = "", text = "", bagR = 0, gAur = 0, gClt = 0, mhP = 0, ui = "ui-modal";
    if (roll < 40) { title = "BOX OFFICE FLOP 💀"; text = "Commercial disaster."; bagR = Math.floor(budget * 0.1); gAur = -100; mhP = 30; ui = "ui-cyberpunk"; }
    else if (roll < 85) { title = "BOX OFFICE HIT! 📈"; text = "Cultural moment."; bagR = budget * 2; gClt = 300; gAur = 100; }
    else { title = "ACADEMY AWARD SWEEP 🏆"; text = "Cinematic perfection."; bagR = Math.floor(budget * 3.5); gClt = 500; gAur = 2500; }
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag + bagR, aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + gAur)), clout: Math.min(state.pl.maxClout, state.pl.clout + gClt), mentalHealth: Math.max(0, state.pl.mentalHealth - mhP) }, mod: { s: true, t: title, m: text + ` Returns: $${fMny(bagR)}.`, o: [{ label: "ACCEPT LEGACY", action: () => set({ mod: { s: false } }) }], ui }, movieProject: { status: 'IDLE', budgetTier: 1, hypeLevel: 0 }, hl: { ...state.hl, mov: state.hl.mov + (bagR - budget) } }));
    if (flex.media.owned && gClt > 0) set(state => ({ politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: Math.min(100, state.politicalSyndicate.politicalCapital + gClt * 0.1), status: (state.politicalSyndicate.politicalCapital + gClt * 0.1 >= 100) ? 'CAMPAIGN_READY' : state.politicalSyndicate.status } }));
    adv();
  },

  rCampaignAction: async (type) => {
    const { campaign, pl, adv } = get(); if (campaign.phase !== 'POLITICS') return;
    let cMH = 0, cClt = 0, cAur = 0, cBag = 0, gAur = 0, gClt = 0, gWch = 0, gPol = { r: '', a: 0 };
    if (type === 'RUST_BELT_RALLY') { cMH = 20; cClt = 50; gPol = { r: 'rustBelt', a: 5 }; gAur = 20; }
    else if (type === 'SUN_BELT_ADS') { cBag = 500000000; gPol = { r: 'sunBelt', a: 4 }; gClt = 300; }
    else if (type === 'SILICON_GALA') { cAur = 150; gWch = 1200000000; gPol = { r: 'blueWall', a: 6 }; }
    if (pl.mentalHealth < cMH || pl.clout < cClt || pl.aura < cAur || campaign.warchest < cBag) return;
    set(state => ({
      pl: { ...state.pl, mentalHealth: Math.max(0, state.pl.mentalHealth - cMH), clout: Math.max(0, Math.min(state.pl.maxClout, state.pl.clout - cClt - 10 + gClt)), aura: Math.max(0, Math.min(state.pl.maxAura, state.pl.aura - cAur - 5 + gAur)) },
      campaign: { ...state.campaign, currentWeek: state.campaign.currentWeek + 1, warchest: state.campaign.warchest - cBag - 100000000 + gWch, regionalPolling: { ...state.campaign.regionalPolling, [gPol.r]: Math.min(100, state.campaign.regionalPolling[gPol.r] + (gPol.a || 0)) } }
    }));

    const updatedWeek = get().campaign.currentWeek;
    if ((updatedWeek - 1) % 4 === 0) return true; // Signal October Surprise
    else { adv(); return false; }
  },

  rElectionNightResolution: async () => {
    const { campaign, setIsPresident, setTab, setMod, setGBusy } = get();
    if (campaign.currentWeek < 52) return;
    setGBusy(true); await new Promise(r => setTimeout(r, 3000)); setGBusy(false);
    let playerEVs = (campaign.regionalPolling.blueWall > campaign.opponentPolling.blueWall ? 44 : 0) + (campaign.regionalPolling.rustBelt > campaign.opponentPolling.rustBelt ? 46 : 0) + (campaign.regionalPolling.sunBelt > campaign.opponentPolling.sunBelt ? 55 : 0) + 130;
    if (playerEVs >= 270) {
      setIsPresident(true); set(state => ({ campaign: { ...state.campaign, phase: 'COMPLETED' } }));
      setMod({ s: true, t: "VICTORY", m: `EVs: ${playerEVs}`, o: [{ label: "ASCEND", action: () => { setTab('VICTORY_SPEECH'); setMod({ s: false }); } }], ui: "ui-victory" });
    } else {
      set(state => ({ campaign: { ...state.campaign, phase: 'COMPLETED' } }));
      setMod({ s: true, t: "CONCESSION", m: `EVs: ${playerEVs}`, o: [{ label: "RESUME", action: () => setMod({ s: false }) }], ui: "ui-crisis" });
    }
  },

  rPrsA: async (type) => {
    const { adv, triggerImpact } = get();
    if (type === 'gala') { set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 200000000 } })); triggerImpact('bag', 200000000); }
    else if (type === 'tv') { set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100000000, clout: Math.max(0, state.pl.clout - 10) }, prs: { ...state.prs, rst: state.prs.rst + 3, sun: state.prs.sun + 2, sub: state.prs.sub + 4 } })); }
    else if (type === 'smear') { set(state => ({ pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 25) }, prs: { ...state.prs, rst: state.prs.rst + 2, sun: state.prs.sun + 3 } })); }
    else { set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 2000000 }, prs: { ...state.prs, rst: state.prs.rst + 0.8, sun: state.prs.sun + 1 } })); }
    adv(); return undefined;
  },

  rPrs1TT: async () => { set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100000000, clout: Math.max(0, state.pl.clout - 20) }, prs: { ...state.prs, p1tt: true, sh: true } })); return undefined; },
  rPrs1OP: async () => { set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 150000000, aura: Math.max(0, state.pl.aura - 30) }, prs: { ...state.prs, p1op: true, ot: true } })); return undefined; },
  rPrs1ET: async () => { set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 50000000, clout: Math.max(0, state.pl.clout - 25) }, prs: { ...state.prs, p1et: true } })); return undefined; },
  dVp: () => { set(state => ({ prs: { ...state.prs, vu: true, rst: state.prs.rst + 4 } })); },
  dDef: () => { set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 75000000, clout: Math.max(0, state.pl.clout - 20) }, prs: { ...state.prs, du: true, sub: state.prs.sub + 5 } })); },

  rSubmitToHallOfFame: async (playerName) => {
    set({ alias: playerName });
    await new Promise(r => setTimeout(r, 1500));
    localStorage.removeItem('bag-chaser-save-v1');
    set({ ph: 'POST_MORTEM' });
  },

  rAcquirePoliticalAsset: async (type, cost, limit) => {
    const { pl, politicalSyndicate, adv } = get(); if (pl.bag < cost || politicalSyndicate.assetLeasing[type] >= limit) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost }, politicalSyndicate: { ...state.politicalSyndicate, assetLeasing: { ...state.politicalSyndicate.assetLeasing, [type]: state.politicalSyndicate.assetLeasing[type] + 1 } }, news: [`⚖️ SYNDICATE: Political asset acquired: ${type.toUpperCase()}.`, ...state.news.slice(0, 15)] }));
    adv();
  },

  rDeployNarrativeOp: async (opType) => {
    const { politicalSyndicate, pl, adv, triggerImpact } = get(); const assets = politicalSyndicate.assetLeasing;
    if (opType === "TAX_LOOPHOLE") {
      if (assets.senators < 2 || pl.clout < 100) return;
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 40000000, clout: Math.max(0, state.pl.clout - 100) }, news: ["⚖️ SYNDICATE: Tax Loophole Bill passed.", ...state.news.slice(0, 15)] }));
      triggerImpact("bag", 40000000);
    } else if (opType === "CULTURE_WAR") {
      if (assets.networkAnchors < 1 || pl.aura < 40) return;
      set(state => ({ pl: { ...state.pl, clout: Math.min(state.pl.maxClout, state.pl.clout + 500), aura: Math.max(0, state.pl.aura - 40) }, politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: Math.min(100, state.politicalSyndicate.politicalCapital + 15), status: (state.politicalSyndicate.politicalCapital + 15 >= 100) ? "CAMPAIGN_READY" : state.politicalSyndicate.status }, news: ["⚖️ SYNDICATE: Culture War manufactured.", ...state.news.slice(0, 15)] }));
    } else if (opType === "LOBBYIST_STRIKE") {
      if (pl.bag < 10000000) return;
      set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 10000000 }, politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: Math.min(100, state.politicalSyndicate.politicalCapital + 10), status: (state.politicalSyndicate.politicalCapital + 10 >= 100) ? "CAMPAIGN_READY" : state.politicalSyndicate.status }, news: ["⚖️ SYNDICATE: Lobbyist Strike Team deployed.", ...state.news.slice(0, 15)] }));
    }
    adv();
  },

  rHostPolicySummit: async () => {
    const { politicalSyndicate, pl, adv, triggerNotification } = get(); if (politicalSyndicate.politicalCapital < 100) return;
    set({ gBusy: true }); await new Promise(r => setTimeout(r, 1500)); set({ gBusy: false });
    set(state => ({
      politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: 0, status: "IDLE" },
      pl: { ...state.pl, bag: state.pl.bag + 10000000000, aura: Math.min(state.pl.maxAura, state.pl.aura + 2000), clout: Math.min(state.pl.maxClout, state.pl.clout + 1500) },
      presidencyEligible: true,
      mod: { s: true, t: "THE SUMMIT CONCLUDED", m: "Primed for POTUS.", o: [{ label: "PREPARE FOR CAMPAIGN", action: () => set({ mod: { s: false } }) }], ui: "ui-modal" },
      news: ["🏆 SYNDICATE: Global Policy Summit concluded.", ...state.news.slice(0, 15)]
    }));
    triggerNotification("SYNDICATE_COMPLETE"); adv();
  },

  rResumeCampaign: () => set(state => ({ campaign: { ...state.campaign, currentMonth: state.campaign.currentMonth + 1, phase: "POLITICS" }, tab: "WAR_ROOM", news: [`🦅 CAMPAIGN: Month ${state.campaign.currentMonth + 1}.`, ...state.news.slice(0, 15)] })),

  rFoundationSink: (amount) => {
    const { pl, flex } = get(); if (pl.bag < amount || !flex.foundation.owned) return;
    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - amount }, campaign: { ...state.campaign, regionalPolling: { blueWall: Math.min(100, state.campaign.regionalPolling.blueWall + (amount / 100000000)), rustBelt: Math.min(100, state.campaign.regionalPolling.rustBelt + (amount / 100000000)), sunBelt: Math.min(100, state.campaign.regionalPolling.sunBelt + (amount / 100000000)) } }, news: [`🏛️ PHILANTHROPY baseline increased.`, ...state.news.slice(0, 15)] }));
  },
});
