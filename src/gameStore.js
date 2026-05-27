import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mudChaosPools } from "./data/chaosPools.js";
import { getInitialGameState } from "./data/initialState.js";
import { createMudSlice } from "./store/slices/mudActions.js";
import { createCorporateSlice } from "./store/slices/corporateActions.js";
import { createMacroSlice } from "./store/slices/macroActions.js";
import { createCoreSlice } from "./store/slices/coreActions.js";
import { fMny } from "./config.js";

export const TIERS = [
  { id: 0, label: 'Mud',       req: { bag: 0,           clout: 0,    aura: 0   }, hustles: ['SW', 'DROP', 'TECH_FLIP', 'VINTAGE', 'SMM', 'GIG', 'DELIVERY', 'PLASMA', 'SURVEY', 'LABOR'] },
  { id: 1, label: 'Street',    req: { bag: 100000,      clout: 30,   aura: 0   }, hustles: ['CC', 'POD', 'BOX', 'AUDIO'] },
  { id: 2, label: 'Corporate', req: { bag: 10000000,    clout: 300,  aura: 50  }, hustles: ['TECH', 'AI_AGENCY', 'CRE_FLIP', 'FRANCHISE'] },
  { id: 3, label: 'Elite',     req: { bag: 25000000,    clout: 500,  aura: 0   }, hustles: ['CRYP', 'TOUR', 'PE_ROLLUP', 'ART_SPEC'] },
  { id: 4, label: 'Mogul',     req: { bag: 250000000,   clout: 1500, aura: 500 }, hustles: ['HF', 'CONGLOMERATE', 'PMC', 'SOVEREIGN', 'MOV', 'SYNDICATE'] },
  { id: 5, label: 'President', req: { bag: 1000000000,  clout: 5000, aura: 2500 }, hustles: ['PAC', 'BLITZ', 'SMEAR', 'ELECTION'] },
];

export { mudChaosPools, getInitialGameState };

const SAVE_KEY = 'bag-chaser-save-v1';

export const useGameStore = create()(
  persist(
    (set, get) => ({
      ...getInitialGameState(),
      ...createCoreSlice(set, get),
      ...createMudSlice(set, get),
      ...createCorporateSlice(set, get),
      ...createMacroSlice(set, get),

      setPh: (ph) => set({ ph }),
      setProSt: (proSt) => set({ proSt }),
      setAlias: (alias) => set({ alias }),
      setDiff: (diff) => set({ diff }),
      setTab: (tab) => set({ tab }),
      setSelTier: (selTier) => set({ selTier }),
      setDeath: (death) => set({ death }),
      setCancelIntro: (cancelIntro) => set({ cancelIntro }),
      setGBusy: (gBusy) => set({ gBusy }),
      setSwFatigue: (swFatigue) => set({ swFatigue }),
      setHustleFatigue: (hustleFatigue) => set(state => ({ hustleFatigue: typeof hustleFatigue === 'function' ? hustleFatigue(state.hustleFatigue) : hustleFatigue })),
      setKarmaFlags: (karmaFlags) => set(state => ({ karmaFlags: typeof karmaFlags === 'function' ? karmaFlags(state.karmaFlags) : karmaFlags })),
      setFatalTragedyMessage: (msg) => set({ fatalTragedyMessage: msg }),
      setPl: (pl) => set(state => ({ pl: typeof pl === 'function' ? pl(state.pl) : pl })),
      setMkt: (mkt) => set({ mkt }),
      setNews: (news) => set(state => ({ news: typeof news === 'function' ? news(state.news) : news })),
      setUp: (up) => set(state => ({ up: typeof up === 'function' ? up(state.up) : up })),
      setSkl: (skl) => set(state => ({ skl: typeof skl === 'function' ? skl(state.skl) : skl })),
      setAss: (ass) => set(state => ({ ass: typeof ass === 'function' ? ass(state.ass) : ass })),
      setSw: (sw) => set(state => ({ sw: typeof sw === 'function' ? sw(state.sw) : sw })),
      setDrp: (drp) => set(state => ({ drp: typeof drp === 'function' ? drp(state.drp) : drp })),
      setCc: (cc) => set(state => ({ cc: typeof cc === 'function' ? cc(state.cc) : cc })),
      setPod: (pod) => set(state => ({ pod: typeof pod === 'function' ? pod(state.pod) : pod })),
      setBox: (box) => set(state => ({ box: typeof box === 'function' ? box(state.box) : box })),
      setTur: (tur) => set(state => ({ tur: typeof tur === 'function' ? tur(state.tur) : tur })),
      setTch: (tch) => set(state => ({ tch: typeof tch === 'function' ? tch(state.tch) : tch })),
      setCrp: (crp) => set(state => ({ crp: typeof crp === 'function' ? crp(state.crp) : crp })),
      setMov: (mov) => set(state => ({ mov: typeof mov === 'function' ? mov(state.mov) : mov })),
      setHf: (hf) => set(state => ({ hf: typeof hf === 'function' ? hf(state.hf) : hf })),
      setAi: (ai) => set(state => ({ ai: typeof ai === 'function' ? ai(state.ai) : ai })),
      setPrs: (prs) => set(state => ({ prs: typeof prs === 'function' ? prs(state.prs) : prs })),
      setPeaks: (peaks) => set(state => ({ peaks: typeof peaks === 'function' ? peaks(state.peaks) : peaks })),
      setHl: (hl) => set(state => ({ hl: typeof hl === 'function' ? hl(state.hl) : hl })),
      setTally: (tally) => set(state => ({ tally: typeof tally === 'function' ? tally(state.tally) : tally })),
      setMod: (mod) => set(state => ({ mod: typeof mod === 'function' ? mod(state.mod) : mod })),
      setIsEventModalOpen: (isOpen) => set({ isEventModalOpen: isOpen }),
      setPfwActive: (active) => set({ pfwActive: active }),
      setPassiveFrozen: (frozen) => set({ passiveFrozen: frozen }),
      setSmmClients: (smmClients) => set(state => ({ smmClients: typeof smmClients === 'function' ? smmClients(state.smmClients) : smmClients })),
      setClientCrisis: (clientCrisis) => set({ clientCrisis }),
      setVinCh: (vinCh) => set({ vinCh }),
      setHustleClicks: (hustleClicks) => set(state => ({ hustleClicks: typeof hustleClicks === 'function' ? hustleClicks(state.hustleClicks) : hustleClicks })),
      setTechItem: (techItem) => set({ techItem }),
      setTechFlipsComplete: (techFlipsComplete) => set(state => ({ techFlipsComplete: typeof techFlipsComplete === 'function' ? techFlipsComplete(state.techFlipsComplete) : techFlipsComplete })),
      setRunnerCount: (runnerCount) => set(state => ({ runnerCount: typeof runnerCount === 'function' ? runnerCount(state.runnerCount) : runnerCount })),
      setRunnerBurnout: (runnerBurnout) => set({ runnerBurnout }),
      setSaasUsers: (saasUsers) => set(state => ({ saasUsers: typeof saasUsers === 'function' ? saasUsers(state.saasUsers) : saasUsers })),
      setCorpClients: (corpClients) => set(state => ({ corpClients: typeof corpClients === 'function' ? corpClients(state.corpClients) : corpClients })),
      setCreOfficeCount: (creOfficeCount) => set(state => ({ creOfficeCount: typeof creOfficeCount === 'function' ? creOfficeCount(state.creOfficeCount) : creOfficeCount })),
      setCreRetailCount: (creRetailCount) => set(state => ({ creRetailCount: typeof creRetailCount === 'function' ? creRetailCount(state.creRetailCount) : creRetailCount })),
      setFranchiseCount: (franchiseCount) => set(state => ({ franchiseCount: typeof franchiseCount === 'function' ? franchiseCount(state.franchiseCount) : franchiseCount })),
      setSupplyChainDisruption: (disruption) => set({ supplyChainDisruption: disruption }),
      setArtCollection: (artCollection) => set(state => ({ artCollection: typeof artCollection === 'function' ? artCollection(state.artCollection) : artCollection })),
      setArtMarketSentiment: (artMarketSentiment) => set(state => ({ artMarketSentiment: typeof artMarketSentiment === 'function' ? artMarketSentiment(state.artMarketSentiment) : artMarketSentiment })),
      setVenueState: (venueState) => set({ venueState }),
      setAudioTracks: (audioTracks) => set(state => ({ audioTracks: typeof audioTracks === 'function' ? audioTracks(state.audioTracks) : audioTracks })),
      setAudioPromo: (audioPromo) => set({ audioPromo }),
      setAudioStyle: (audioStyle) => set({ audioStyle }),
      setAudioHitActive: (active) => set({ audioHitActive: active }),
      setSampleStrike: (sampleStrike) => set({ sampleStrike }),
      setPmcSquads: (pmcSquads) => set(state => ({ pmcSquads: typeof pmcSquads === 'function' ? pmcSquads(state.pmcSquads) : pmcSquads })),
      setIntelLeak: (intelLeak) => set({ intelLeak }),
      setTechInterns: (techInterns) => set(state => ({ techInterns: typeof techInterns === 'function' ? techInterns(state.techInterns) : techInterns })),
      setBulkPalletsUnlocked: (bulkPalletsUnlocked) => set({ bulkPalletsUnlocked }),
      setEnterpriseContracts: (enterpriseContracts) => set(state => ({ enterpriseContracts: typeof enterpriseContracts === 'function' ? enterpriseContracts(state.enterpriseContracts) : enterpriseContracts })),
      setAudioUpgrades: (audioUpgrades) => set(state => ({ audioUpgrades: typeof audioUpgrades === 'function' ? audioUpgrades(state.audioUpgrades) : audioUpgrades })),
      setTalentScouters: (talentScouters) => set(state => ({ talentScouters: typeof talentScouters === 'function' ? talentScouters(state.talentScouters) : talentScouters })),
      setHollywoodSyncActive: (active) => set({ holwoodSyncActive: active }),
      setCollectiblePhase: (collectiblePhase) => set({ collectiblePhase }),
      setVintageRevenueTracker: (vintageRevenueTracker) => set(state => ({ vintageRevenueTracker: typeof vintageRevenueTracker === 'function' ? vintageRevenueTracker(state.vintageRevenueTracker) : vintageRevenueTracker })),
      setVintageBoostActive: (vintageBoostActive) => set({ vintageBoostActive }),
      setSneakerBackdoorPlug: (sneakerBackdoorPlug) => set({ sneakerBackdoorPlug }),
      setConsignmentFeeActive: (consignmentFeeActive) => set({ consignmentFeeActive }),
      setVaultHoldings: (vaultHoldings) => set(state => ({ vaultHoldings: typeof vaultHoldings === 'function' ? vaultHoldings(state.vaultHoldings) : vaultHoldings })),
      setPmcUnlocked: (pmcUnlocked) => set({ pmcUnlocked }),
      setPmcMercenaries: (pmcMercenaries) => set(state => ({ pmcMercenaries: typeof pmcMercenaries === 'function' ? pmcMercenaries(state.pmcMercenaries) : pmcMercenaries })),
      setPmcActiveContracts: (pmcActiveContracts) => set(state => ({ pmcActiveContracts: typeof pmcActiveContracts === 'function' ? pmcActiveContracts(state.pmcActiveContracts) : pmcActiveContracts })),
      setPmcHeatLevel: (pmcHeatLevel) => set(state => ({ pmcHeatLevel: typeof pmcHeatLevel === 'function' ? pmcHeatLevel(state.pmcHeatLevel) : pmcHeatLevel })),
      setPmcMercCost: (pmcMercCost) => set(state => ({ pmcMercCost: typeof pmcMercCost === 'function' ? pmcMercCost(state.pmcMercCost) : pmcMercCost })),
      setPmcBribeCost: (pmcBribeCost) => set(state => ({ pmcBribeCost: typeof pmcBribeCost === 'function' ? pmcBribeCost(state.pmcBribeCost) : pmcBribeCost })),
      setSuperPacFunds: (superPacFunds) => set(state => ({ superPacFunds: typeof superPacFunds === 'function' ? superPacFunds(state.superPacFunds) : superPacFunds })),
      setApprovalRating: (approvalRating) => set(state => ({ approvalRating: typeof approvalRating === 'function' ? approvalRating(state.approvalRating) : approvalRating })),
      setLobbyists: (lobbyists) => set(state => ({ lobbyists: typeof lobbyists === 'function' ? lobbyists(state.lobbyists) : lobbyists })),
      setLobbyistCost: (lobbyistCost) => set(state => ({ lobbyistCost: typeof lobbyistCost === 'function' ? lobbyistCost(state.lobbyistCost) : lobbyistCost })),
      setMediaBlitzCost: (mediaBlitzCost) => set(state => ({ mediaBlitzCost: typeof mediaBlitzCost === 'function' ? mediaBlitzCost(state.mediaBlitzCost) : mediaBlitzCost })),
      setIsPresident: (isPresident) => set({ isPresident }),
      setPoliticalSyndicate: (politicalSyndicate) => set(state => ({ politicalSyndicate: typeof politicalSyndicate === 'function' ? politicalSyndicate(state.politicalSyndicate) : politicalSyndicate })),
      setPresidencyEligible: (presidencyEligible) => set({ presidencyEligible }),
      setCampaign: (campaign) => set(state => ({ campaign: typeof campaign === 'function' ? campaign(state.campaign) : campaign })),
      setFlex: (flex) => set(state => ({ flex: typeof flex === 'function' ? flex(state.flex) : flex })),
      setMhEmergencies: (mhEmergencies) => set(state => ({ mhEmergencies: typeof mhEmergencies === 'function' ? mhEmergencies(state.mhEmergencies) : mhEmergencies })),
      setIsBreakdownActive: (active) => set({ isBreakdownActive: active }),
      setShakeActive: (active) => set({ shakeActive: active }),
      setLastProcessedTimestamp: (ts) => set({ lastProcessedTimestamp: ts }),

      exStart: () => {
        const { alias, diff } = get();
        if (alias.length < 3) return;
        let plU;
        if (diff === 1) plU = { bag: 25000, aura: 30, clout: 30, maxMentalHealth: 100, mentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 };
        else if (diff === 2) plU = { bag: 5000, clout: 15, aura: 15, maxMentalHealth: 150, mentalHealth: 150, heat: 0, maxClout: 100, maxAura: 100 };
        else plU = { bag: 1000, clout: 5, aura: 5, maxMentalHealth: 100, mentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 };
        set(state => ({ pl: { ...state.pl, ...plU }, selTier: '0', tab: 'HUB', ph: 'PROLOGUE_INTRO' }));
      },

      getUpdatedCaps: (tier, currentFlex) => {
        const caps = [100, 250, 300, 5000, 5000, 999999999];
        const mhCaps = [100, 150, 300, 500, 500, 1000];
        let auraCap = caps[tier] || caps[0];
        let mhCap = mhCaps[tier] || mhCaps[0];
        let cloutCap = auraCap;

        if (!currentFlex) return { auraCap, cloutCap, mhCap };

        if (currentFlex?.yacht?.owned && tier < 5) {
          cloutCap = auraCap * 10;
        }

        if (currentFlex?.penthouse?.owned) {
          auraCap = Math.max(auraCap, 600);
          cloutCap = Math.max(cloutCap, 1500);
        }
        if (currentFlex?.logistics?.owned) {
          auraCap = Math.max(auraCap, 1200);
          cloutCap = Math.max(cloutCap, 1500);
        }
        if (currentFlex?.jet?.owned) {
          auraCap = Math.max(auraCap, 2000);
          cloutCap = Math.max(cloutCap, 2000);
        }

        if (currentFlex?.watch?.owned && currentFlex?.watch?.prActive) {
          auraCap = Math.max(200, auraCap);
        }

        return { auraCap, cloutCap, mhCap };
      },

      updateFatigue: (activeHustle) => {
        const { flex, lastHustle } = get();
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);

        set(state => {
          const next = { ...state.hustleFatigue };
          const isDifferent = lastHustle !== activeHustle;
          Object.keys(next).forEach(k => {
            if (k === activeHustle) {
              const increase = 15 * (1 - mhReduction);
              next[k] = Math.min(100, next[k] + increase);
            } else if (isDifferent) {
              next[k] = Math.max(0, next[k] - 10);
            }
          });
          return { hustleFatigue: next, lastHustle: activeHustle };
        });
      },

      triggerChaos: (hustleKey) => {
        const { hustleFatigue, ass } = get();
        const fatigue = hustleFatigue[hustleKey] || 0;
        let risk = 0.02 + (fatigue / 100);
        if (ass.legalTeam) risk *= 0.5;
        return Math.random() < risk;
      },

      adv: (intervals = 1) => {
        const { fatalTragedyMessage, clientCrisis, karmaFlags, runnerBurnout, apiLockoutMonths, saasPenaltyActive, artBubbleMonths, supplyChainShockMonths, viralPopMonths, talentScouters, isPresident, politicalSyndicate, flex, saasChurn, corpClients, saasPrice, mkt, ass, skl, tch, smmEmpireActive, smmClients, aiSmmFactory, smmRetainerActive, runnerCount, audioTracks, sampleStrike, pmcSquads, pmcActiveContracts, techInterns, enterpriseContracts, vintageBoostActive, collectiblePhase, peCompoundingYield, swfFrozen, swfInvestment, geoStability, conglomActive, antitrustRisk, ai, prs, legacyMultiplier, pmcHeatLevel, passiveFrozen, hustleClicks } = get();

        if (fatalTragedyMessage) return;

        set(state => {
          const now = Date.now();
          const nextHustleFatigue = { ...state.hustleFatigue };
          Object.keys(nextHustleFatigue).forEach(k => { nextHustleFatigue[k] = Math.max(0, nextHustleFatigue[k] - (20 * intervals)); });

          const nextState = {
            swFatigue: Math.max(0, state.swFatigue - (0.25 * intervals)),
            hustleFatigue: nextHustleFatigue,
            dropshipLock: Math.max(0, state.dropshipLock - intervals),
            vintageLock: Math.max(0, state.vintageLock - intervals),
            apiLockoutMonths: Math.max(0, state.apiLockoutMonths - intervals),
            saasPenaltyActive: false,
            artBubbleMonths: Math.max(0, state.artBubbleMonths - intervals),
            supplyChainShockMonths: Math.max(0, state.supplyChainShockMonths - intervals),
            viralPopMonths: Math.max(0, state.viralPopMonths - intervals)
          };

          let newsUpdate = [];
          if (clientCrisis) {
            if (karmaFlags.ignoredSmmCrisis) {
              nextState.smmClients = Math.max(0, state.smmClients - 2);
              newsUpdate.push("📉 SMM: Disgruntled clients post terrible reviews. 2 clients churned.");
            } else {
              nextState.smmClients = Math.max(0, state.smmClients - 1);
              newsUpdate.push("📉 SMM: Client churned due to unresolved crisis.");
            }
            nextState.clientCrisis = false;
          }

          if (runnerBurnout) {
            if (karmaFlags.ignoredRunnerWelfare) {
              nextState.pl = { ...state.pl, bag: state.pl.bag - 500, clout: Math.max(0, state.pl.clout - 10) };
              newsUpdate.push("📉 GIG: A disgruntled runner stole a premium package. -00, -10 Clout.");
            } else {
              nextState.runnerCount = Math.max(0, state.runnerCount - 1);
              newsUpdate.push("📉 GIG: Runner mutinied and stole inventory due to burnout.");
            }
            nextState.runnerBurnout = false;
          }

          if (artBubbleMonths > 0 && artBubbleMonths <= intervals) nextState.tickerAdvice = "WALL STREET: Art Market bubble has burst. Margins normalized.";
          if (supplyChainShockMonths > 0 && supplyChainShockMonths <= intervals) nextState.tickerAdvice = "SUPPLY CHAIN: Component logistics restored. Tech Flipping costs normalized.";
          if (viralPopMonths > 0 && viralPopMonths <= intervals) nextState.tickerAdvice = "TREND WATCH: Retro-synth viral wave fading. Audio Syndicate rates normalized.";

          if (Math.random() < 0.10) {
            const eventRoll = Math.random();
            if (eventRoll < 0.33) {
              nextState.artBubbleMonths = 3;
              nextState.tickerAdvice = "📈 WALL STREET: Art Market experiencing speculative bubble! Art Hustle resale margins boosted by +40% for the next 3 months.";
            } else if (eventRoll < 0.66) {
              nextState.supplyChainShockMonths = 3;
              nextState.tickerAdvice = "⚠️ SUPPLY CHAIN SHOCK: Electronic component shortages hit logistics. Tech Flipping Pallet costs increased by 20%.";
            } else {
              nextState.viralPopMonths = 3;
              nextState.tickerAdvice = "🎙️ VIRAL POP TREND: Retro-synth sounds going hyper-viral. Indie Audio Syndicate success rates boosted to 90%.";
            }
          }

          if (talentScouters > 0) {
            nextState.audioTracks = state.audioTracks + (talentScouters * intervals);
          }

          if (lobbyists > 0) {
            nextState.pl = nextState.pl || { ...state.pl };
            nextState.pl.clout = Math.min(nextState.pl.maxClout, nextState.pl.clout + (lobbyists * 25 * intervals));
            nextState.approvalRating = Math.min(100, state.approvalRating + (0.5 * lobbyists * intervals));
          }

          if (!isPresident) {
            nextState.approvalRating = Math.max(0, (nextState.approvalRating ?? state.approvalRating) - (2.5 * intervals));
          }

          const psAssets = politicalSyndicate.assetLeasing;
          if (psAssets.governors > 0 || psAssets.senators > 0 || psAssets.networkAnchors > 0) {
            let gain = (psAssets.governors * 0.5) + (psAssets.senators * 1.5) + (psAssets.networkAnchors * 3.0);
            if (flex.yacht.owned) {
              const isBlitzed = flex.yacht.expiresAt > Date.now();
              gain *= (isBlitzed ? 2.0 : 1.5);
            }
            let nextCapital = Math.min(100, politicalSyndicate.politicalCapital + (gain * intervals));
            nextState.politicalSyndicate = { ...politicalSyndicate, politicalCapital: nextCapital, status: nextCapital >= 100 ? 'CAMPAIGN_READY' : politicalSyndicate.status };
          }

          nextState.saasUsers = Math.max(0, state.saasUsers + ((corpClients * (10 + Math.floor(state.pl.clout / 20))) - Math.floor(state.saasUsers * saasChurn)) * intervals);
          nextState.geoStability = Math.min(1.5, Math.max(0.5, state.geoStability + (Math.random() - 0.5) * 0.1));

          let expenseBurn = 500;
          if (mkt === 2) expenseBurn *= 2;
          if (corpClients > 0) expenseBurn += 10000;
          let yieldIncome = 0;
          if (flex.watch.owned) yieldIncome += 750;
          if (flex.penthouse.owned) yieldIncome += 15000;
          if (flex.car.owned) expenseBurn += 8000;
          if (flex.yacht.owned) expenseBurn += 25000;
          if (ass.legalTeam) expenseBurn += 1000000;
          expenseBurn = Math.floor(expenseBurn * (1 - (skl.tax * 0.04)));

          let passiveSrv = (tch.l && tch.pw) ? Math.floor(500 + (tch.u * tch.srv)) : 0;
          let smmRev = smmEmpireActive ? Math.floor(25000 * (state.pl.clout / 300)) : (state.smmClients * 300) + (aiSmmFactory ? 1000 : (smmRetainerActive ? 500 : 0));
          if (flex.penthouse.owned) {
            const isBlitzed = flex.penthouse.expiresAt > Date.now();
            smmRev = Math.floor(smmRev * (isBlitzed ? 1.70 : 1.35));
          }
          const runnerRev = state.runnerCount * 150;
          const audioYield = sampleStrike ? 0 : (state.audioTracks * 400 * (state.holwoodSyncActive ? 2.0 : 1.0));
          const pmcYield = (state.pmcSquads * 75000) + (state.pmcActiveContracts * 100000);
          const techInternRev = state.techInterns * 500;
          const enterpriseRev = state.enterpriseContracts * 5000;
          let vintagePassives = vintageBoostActive ? (hustleClicks.vintage * 50) * 0.5 : 0;
          let consignmentRev = (collectiblePhase === "CONSIGNMENT") ? Math.floor(5000 * (state.pl.clout / 100)) : 0;
          const saasRev = (state.saasUsers * saasPrice) * (state.saasPenaltyActive ? 0.5 : 1);
          const saasOverhead = state.saasUsers * 2;
          const aiRev = state.apiLockoutMonths > 0 ? 0 : (corpClients * 8000);
          let creGross = (state.creOfficeCount * 45000) + (state.creRetailCount * 15000);
          if (mkt === 2 || mkt === 3) creGross = 0;
          let vacancyMult = ((state.creOfficeCount > 0 || state.creRetailCount > 0) && Math.random() < 0.15) ? 0.5 + (Math.random() * 0.4) : 1.0;
          const creNet = (creGross * vacancyMult) - (state.creOfficeCount * 20000) - (state.creRetailCount * 5000);
          const franchiseRev = (state.unionStrikeActive || state.supplyChainDisruption) ? 0 : (state.franchiseCount * 25000);
          let peRev = state.supplyChainDisruption ? -500000 : (state.guttedFirms * 100000 * state.peCompoundingYield);
          const auraBleed = (state.unionStrikeIgnored ? 50 : 0) + (state.intelLeak ? 20 : 0);
          const totalArtCount = state.artCollection?.length || 0;
          const artClout = totalArtCount * 20;
          let artPassiveRev = 0;
          if (totalArtCount >= 50) {
            const totalValue = state.artCollection.reduce((acc, curr) => acc + curr.baseValue, 0);
            artPassiveRev = Math.floor(totalValue * (totalArtCount >= 75 && flex.archive?.owned ? 0.003 : 0.001));
          }
          const artDrift = (flex.art.owned && flex.art.prActive) ? 5 : 0;

          if (collectiblePhase === "VAULT" && state.vaultHoldings.length > 0) {
            let cycles = 0;
            for (let i = 1; i <= intervals; i++) if ((state.pl.mo + i) % 12 === 0) cycles++;
            if (cycles > 0) nextState.vaultHoldings = state.vaultHoldings.map(h => ({ ...h, cost: Math.floor(h.cost * Math.pow(1.12, cycles)) }));
          }

          const currentPl = nextState.pl ?? state.pl;
          let basePassive = Math.floor((passiveSrv + smmRev + runnerRev + audioYield + pmcYield + (saasRev - saasOverhead) + aiRev + creNet + franchiseRev + peRev + techInternRev + enterpriseRev + consignmentRev + vintagePassives + artPassiveRev) * legacyMultiplier);
          if (passiveFrozen) basePassive = 0;
          const conglomBonus = conglomActive ? Math.floor(basePassive * 0.25) : 0;
          const swfYield = !state.swfFrozen ? Math.floor(state.swfInvestment * 0.06 * state.geoStability) : 0;

          nextState.pl = {
            ...currentPl,
            mo: currentPl.mo + intervals,
            bag: currentPl.bag + (-expenseBurn + yieldIncome + basePassive + (swfYield * legacyMultiplier) + conglomBonus) * intervals,
            aura: Math.min(currentPl.maxAura, Math.max(0, currentPl.aura + (-auraBleed + (collectiblePhase === "VAULT" ? (nextState.vaultHoldings ?? state.vaultHoldings).length * 50 : 0) + artDrift) * intervals)),
            clout: Math.min(currentPl.maxClout, currentPl.clout + (artClout + (nextState.audioTracks ?? state.audioTracks) * 2) * intervals),
            heat: currentPl.heat + (state.pmcSquads * 2 * (isPresident ? 0.5 : 1) * intervals),
            mentalHealth: Math.min(currentPl.maxMentalHealth, currentPl.mentalHealth + ((flex.penthouse.owned ? 30 : 15) * intervals))
          };

          let heatAdded = (state.pmcActiveContracts > 0) ? (10.0 * state.pmcActiveContracts * intervals * (isPresident ? 0.5 : 1)) : 0;
          const finalHeat = state.pmcHeatLevel + heatAdded;
          if (finalHeat > 80 && Math.random() < 0.05) {
            nextState.pl.bag -= 500000; nextState.pmcMercenaries = Math.floor(state.pmcMercenaries * 0.5);
            nextState.pmcActiveContracts = 0; nextState.pmcHeatLevel = Math.max(0, finalHeat - 30);
            newsUpdate.push("<span class='news-scandal'>🚨 INTERPOL RAID: Your PMC operations were compromised!</span>");
          } else if (heatAdded > 0) nextState.pmcHeatLevel = finalHeat;

          if (state.geoStability < 0.7 && !state.swfFrozen && Math.random() < 0.15) { nextState.swfFrozen = true; newsUpdate.push("🌍 SWF ALERT: International asset freeze."); }
          else if (state.geoStability > 1.1 && state.swfFrozen) { nextState.swfFrozen = false; newsUpdate.push("🌍 SWF: Asset freeze lifted."); }

          if (conglomActive) {
            nextState.antitrustRisk = state.antitrustRisk + (3 * intervals);
            if (nextState.antitrustRisk > (Math.random() * 80 + 20)) { nextState.pl.bag -= 50000000; newsUpdate.push("🏛️ ANTI-TRUST fine."); nextState.antitrustRisk = 0; }
          }

          if (Math.random() < 0.15) { nextState.mkt = Math.floor(Math.random() * 4); newsUpdate.push(`🚨 MARKET WATCH shift.`); }
          if (state.smmClients > 0 && Math.random() < 0.20) { nextState.clientCrisis = true; newsUpdate.push("🚨 SMM ALERT."); }
          if (state.runnerCount > 0 && Math.random() < 0.15) { nextState.runnerBurnout = true; newsUpdate.push("🚨 RUNNER ALERT."); }
          nextState.artMarketSentiment = Math.min(1, Math.max(-1, state.artMarketSentiment + (Math.random() - 0.5) * 0.4));
          if (state.guttedFirms > 0 || state.franchiseCount > 0) {
            if (Math.random() < 0.02) { nextState.supplyChainDisruption = true; newsUpdate.push("🚨 EMPIRE ALERT."); }
            if (!state.supplyChainDisruption && state.guttedFirms > 0) nextState.peCompoundingYield = state.peCompoundingYield + 0.02;
          }
          if (ai.ig) nextState.ai = { ...ai, p: Math.min(100, ai.p + ai.c * (1.2 + Math.random() * 2) * intervals), r: Math.min(100, ai.r + (1.8 + Math.random() * 2.5) * intervals) };
          if (prs.r) nextState.prs = { ...prs, m: prs.m + intervals };

          if (campaign.phase === 'POLITICS') {
            const op = { ...campaign.opponentPolling };
            ['blueWall', 'rustBelt', 'sunBelt'].forEach(reg => { op[reg] = Math.min(100, op[reg] + 0.5 * intervals); });
            nextState.campaign = { ...campaign, opponentPolling: op };
          }

          return { ...nextState, lastProcessedTimestamp: now, news: [...newsUpdate, ...state.news.slice(0, 15 - newsUpdate.length)] };
        });
      },
    }),
    {
      name: SAVE_KEY,
      version: 1.1,
      migrate: (persistedState, version) => {
        if (version === 1.0) {
          const deepMerge = (target, source) => {
            for (const key in source) {
              if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                deepMerge(target[key], source[key]);
              } else {
                target[key] = source[key];
              }
            }
            return target;
          };

          let d = persistedState;
          if (d.blitzExpiry) {
            if (d.flex?.penthouse?.owned) {
              d.flex.penthouse.expiresAt = d.blitzExpiry;
            }
            delete d.blitzExpiry;
          }

          if (d?.artHoldings !== undefined && !d?.artCollection) {
            const legacyCount = d.artHoldings;
            const migrated = [];
            for (let i = 0; i < legacyCount; i++) {
              migrated.push({
                id: `migrated-${i}-${Math.random().toString(36).substr(2, 9)}`,
                name: `Legacy Masterpiece #${i + 1}`,
                baseValue: 10000000,
                isDisplayed: true
              });
            }
            d.artCollection = migrated;
          }

          return deepMerge(getInitialGameState(), d);
        }
        return persistedState;
      }
    }
  )
);
