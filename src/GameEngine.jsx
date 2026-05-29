import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useGameStore, TIERS as STORE_TIERS, mudChaosPools } from './gameStore.js';
import { fMny } from './config.js';

export const TIERS = STORE_TIERS;
export { mudChaosPools };

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const SAVE_KEY = 'bag-chaser-save-v1';

export const GameProvider = ({ children }) => {
  const storeData = useGameStore();
  const {
    ph = 'PROLOGUE', setPh, proSt = 0, setProSt, alias = '', setAlias, diff = 1, setDiff, tab = 'HUB', setTab, selTier = '0', setSelTier,
    death = null, setDeath, cancelIntro = false, gBusy = false, setGBusy, rain = false, swFatigue = 0, setSwFatigue, hustleFatigue = {}, setHustleFatigue,
    karmaFlags = {}, setKarmaFlags, fatalTragedyMessage = '', setFatalTragedyMessage, lastHustle = '',
    dropshipLock = 0, vintageLock = 0, smmPenalty = false, techSourceCost = 100, smmClients = 0, setSmmClients,
    clientCrisis = false, setClientCrisis, vinCh = {}, setVinCh, hustleClicks = {}, setHustleClicks, techItem = null, setTechItem,
    techFlipsComplete = 0, setTechFlipsComplete, runnerCount = 0, setRunnerCount, runnerBurnout = false, setRunnerBurnout,
    saasUsers = 0, setSaasUsers, saasPrice = 20, saasChurn = 0.05, saasPenaltyActive = false, corpClients = 0, setCorpClients,
    apiLockoutMonths = 0, setApiLockoutMonths, creOfficeCount = 0, setCreOfficeCount, creRetailCount = 0, setCreRetailCount,
    franchiseCount = 0, setFranchiseCount, unionStrikeActive = false, unionStrikeIgnored = false, peProgress = 0, setPeProgress,
    guttedFirms = 0, supplyChainDisruption = false, peCompoundingYield = 1.0, artMarketSentiment = 0, setArtMarketSentiment,
    artCollection = [], setArtCollection, venueState = 'THE VAULT', setVenueState, audioTracks = 0, setAudioTracks,
    sampleStrike = false, setSampleStrike, pmcSquads = 0, setPmcSquads, intelLeak = false, setIntelLeak,
    techInterns = 0, setTechInterns, bulkPalletsUnlocked = false, enterpriseContracts = 0, setEnterpriseContracts,
    audioUpgrades = {}, setAudioUpgrades, talentScouters = 0, setTalentScouters, holwoodSyncActive = false,
    collectiblePhase = 'VINTAGE', setCollectiblePhase, vintageRevenueTracker = 0, setVintageRevenueTracker,
    vintageBoostActive = false, setVintageBoostActive, sneakerBackdoorPlug = false, setSneakerBackdoorPlug,
    consignmentFeeActive = false, setConsignmentFeeActive, vaultHoldings = [], setVaultHoldings,
    smmRetainerActive = false, aiSmmFactory = false, smmEmpireActive = false, pmcUnlocked = false, setPmcUnlocked,
    pmcMercenaries = 0, setPmcMercenaries, pmcActiveContracts = 0, setPmcActiveContracts,
    pmcHeatLevel = 0, setPmcHeatLevel, pmcMercCost = 50000, setPmcMercCost, pmcBribeCost = 25000, setPmcBribeCost,
    conglomActive = false, movieProject = {}, antitrustRisk = 0, setAntitrustRisk, swfInvestment = 0, setSwfInvestment,
    geoStability = 1.0, setGeoStability, swfFrozen = false, setSwfFrozen, superPacFunds = 0, setSuperPacFunds,
    approvalRating = 50, setApprovalRating, lobbyists = 0, setLobbyists, lobbyistCost = 100000, setLobbyistCost,
    mediaBlitzCost = 250000, setMediaBlitzCost, isPresident = false, setIsPresident, politicalSyndicate = {}, setPoliticalSyndicate,
    presidencyEligible = false, setPresidencyEligible, tickerAdvice = '', artBubbleMonths = 0, setArtBubbleMonths,
    supplyChainShockMonths = 0, setSupplyChainShockMonths, viralPopMonths = 0, setViralPopMonths,
    flex = {}, setFlex, campaign = {}, setCampaign, seenNotifications = [], setSeenNotifications,
    activeNotification = null, mhEmergencies = 0, setMhEmergencies, pfwActive = false, setPfwActive,
    activeEvent = null, isEventModalOpen = false, setIsEventModalOpen, isBreakdownActive = false, shakeActive = false,
    passiveFrozen = false, setPassiveFrozen, pl = {}, setPl, mkt = 1, setMkt, news = [], setNews, imp = [], mod = {}, setMod,
    up = {}, setUp, skl = {}, setSkl, ass = {}, setAss, sw = {}, setSw, drp = {}, setDrp, cc = {}, setCc, pod = {}, setPod,
    box = {}, setBox, tur = {}, setTur, tch = {}, setTch, crp = {}, setCrp, mov = {}, setMov, hf = {}, setHf, ai = {}, setAi,
    prs = {}, setPrs, peaks = {}, setPeaks, hl = {}, setHl, tally = {}, setTally, generationCount = 0,
    lastProcessedTimestamp = Date.now(), getUpdatedCaps, adv, exStart, dUp, bAss, triggerImpact,
    updateFatigue, triggerChaos, executeChaosRoll, triggerNotification, closeNotification,
    rVintage, rVinCh, rSw, rSwSpin, rSneakerDrop, rBuyConsignment, rBuyVault, rBuyVaultAsset,
    rVaultAuction, rLaunchSmmRetainer, rBuySmmFactory, rBuySmmEmpire, rSmmPitch, rSmmFix,
    rDelivery, rPlasma, rSurvey, rLabor, rRest, rTechSource, rTechFixA, rTechFixB,
    rProcessBulkPallet, rTechMicroSolder, rRunnerRecruit, rRunnerFix, rSaasClick,
    rAiAgencyClick, rCreBuyOffice, rCreBuyRetail, rFranchiseClick, rResolveUnionStrike,
    rResolveSupplyChain, rPeClick, rArtSpeculate, rArtBuy, finalizeAuction,
    rArtHostExhibit, rAcceptPatronOffer, rFormConglom, rLobbyRegulators, rSwfInvest,
    rSwfWithdraw, rAudioRelease, rAudioSettle, rPmcDeploy, rPmcSettle, rPmcHire,
    rPmcDeployContract, rPmcBribe, rAcquirePoliticalAsset, rDeployNarrativeOp,
    rHostPolicySummit, rSubmitToHallOfFame, rCampaignAction, rResumeCampaign,
    rRetire, performHardReset
  } = storeData || {};

  const displayBag = pl?.bag || 0;
  const age = 18 + Math.floor((pl?.mo || 0) / 12);
  const legacyMultiplier = 1 + (generationCount * 0.25);

  // Global Side Effects
  useEffect(() => {
    const macroInterval = setInterval(() => {
      if (ph === 'PLAYING') adv();
    }, 15000);
    return () => clearInterval(macroInterval);
  }, [ph, adv]);

  const catchUp = () => {
    if (ph !== 'PLAYING') return;
    const now = Date.now();
    const elapsedMs = now - lastProcessedTimestamp;
    const intervalsElapsed = Math.floor(elapsedMs / 15000);
    if (intervalsElapsed > 0) adv(intervalsElapsed);
  };

  useEffect(() => {
    if (ph === 'PLAYING') catchUp();
    const onFocus = () => catchUp();
    const onVisibilityChange = () => { if (document.visibilityState === 'visible') catchUp(); };
    window.addEventListener('focus', onFocus);
    window.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [ph]);

  useEffect(() => {
    if (ph !== 'PLAYING') return;
    const { auraCap, cloutCap, mhCap } = getUpdatedCaps(pl?.tier || 0, flex || {});
    if (pl?.maxClout !== cloutCap || pl?.maxAura !== auraCap || pl?.maxMentalHealth !== mhCap) {
      setPl(prev => ({ ...prev, maxClout: cloutCap, maxAura: auraCap, maxMentalHealth: mhCap, clout: Math.min(cloutCap, prev.clout || 0), aura: Math.min(auraCap, prev.aura || 0), mentalHealth: Math.min(mhCap, prev.mentalHealth || 0) }));
    }
  }, [pl?.tier, ph, flex, getUpdatedCaps, setPl]);

  useEffect(() => {
    if (ph !== 'PLAYING' || !pl) return;
    if (pl.bag > peaks.peakB || pl.aura > peaks.peakA || pl.clout > peaks.peakC) {
      setPeaks(prev => ({ peakB: Math.max(prev.peakB, pl.bag), peakA: Math.max(prev.peakA, pl.aura), peakC: Math.max(prev.peakC, pl.clout) }));
    }
    if (pl.bag < 0 && !fatalTragedyMessage) setFatalTragedyMessage("BANKRUPTCY: Net worth negative.");
    if (pl.mentalHealth <= 0 && !isBreakdownActive) {
      setIsBreakdownActive(true); setGBusy(true);
    }
    if (pl.mentalHealth < 20 && !window.mhInCrisis) {
      window.mhInCrisis = true; setMhEmergencies(prev => prev + 1);
    } else if (pl.mentalHealth >= 20) window.mhInCrisis = false;
  }, [pl, ph, peaks, isBreakdownActive, fatalTragedyMessage, setPeaks, setFatalTragedyMessage, setGBusy, setMhEmergencies]);

  useEffect(() => {
    if (ph !== 'PLAYING' || !pl) return;
    let nextTier = pl.tier;
    for (let i = nextTier + 1; i < TIERS.length; i++) {
      const req = TIERS[i].req;
      const meetsTime = i === 2 ? pl.mo >= 10 : true;
      if (peaks.peakB >= req.bag && peaks.peakC >= req.clout && peaks.peakA >= req.aura && meetsTime) nextTier = i;
      else break;
    }
    if (nextTier !== pl.tier) {
      setPl(prev => ({ ...prev, tier: nextTier }));
      if (nextTier >= 4) setPmcUnlocked(true);
      setNews(prev => [`🏆 TIER UP! You ascended to ${TIERS[nextTier].label}.`, ...prev.slice(0, 15)]);
    }
  }, [peaks, ph, pl.tier, pl.mo, setPl, setPmcUnlocked, setNews]);

  useEffect(() => {
    if (ph !== 'PLAYING') return;
    const interval = setInterval(() => {
      if (Math.random() > 0.05) return;
      const { conglomActive, ass, pl: curPl, saasUsers, artCollection } = storeData || {};
      const roll = Math.random();
      if (roll < 0.33 && conglomActive) {
        if (ass.legalTeam) setNews(prev => ["⚖️ LEGAL defense blocked IRS audit.", ...prev.slice(0, 15)]);
        else {
          const pen = Math.floor(curPl.bag * 0.1); setPl(prev => ({ ...prev, bag: prev.bag - pen }));
          setMod({ s: true, t: "IRS ANTI-TRUST SWEEP", m: `Regulators seized $${pen.toLocaleString()}.`, o: [{ label: "COMPLY", action: () => setMod({ s: false }) }], ui: "ui-crisis" });
        }
      } else if (roll < 0.66 && (saasUsers > 0 || (artCollection?.length || 0) > 0)) {
        if (saasUsers > 0 && Math.random() > 0.5) {
          const gain = 500 + (Math.floor(curPl.clout / 10) * 100); setSaasUsers(p => p + gain);
          setMod({ s: true, t: "VIRAL PRODUCT", m: `Gained ${gain} users.`, o: [{ label: "RIDE THE WAVE", action: () => setMod({ s: false }) }], ui: "ui-modal" });
        } else if ((artCollection?.length || 0) > 0) {
          setArtMarketSentiment(p => Math.min(1, p + 0.5));
          setMod({ s: true, t: "ART MANIA", m: "Valuation skyrocketing.", o: [{ label: "EXCELLENT", action: () => setMod({ s: false }) }], ui: "ui-modal" });
        }
      } else if ((artCollection?.length || 0) >= 50 && roll < 0.15) {
        const disp = artCollection.filter(p => p.isDisplayed);
        if (disp.length > 0) {
          const p = disp[Math.floor(Math.random() * disp.length)];
          const offer = Math.floor(p.baseValue * (1.5 + Math.random() * 2.0));
          setMod({ s: true, t: "PATRON OFFER", m: `Offer for "${p.name}": $${fMny(offer)}.`, o: [{ label: `ACCEPT ($${fMny(offer)})`, action: () => rAcceptPatronOffer(p.id, offer) }, { label: "DECLINE", action: () => setMod({ s: false }) }], ui: "ui-modal" });
        }
      } else if (curPl.mentalHealth < 20) {
        setPassiveFrozen(true);
        setMod({ s: true, t: "EMPIRE BURNOUT", m: "Operations frozen.", o: [{ label: "BREAK", action: () => setMod({ s: false }) }], ui: "ui-crisis" });
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [ph, storeData, setPl, setNews, setMod, setSaasUsers, setArtMarketSentiment, setPassiveFrozen, rAcceptPatronOffer]);

  const isTierUnlocked = useMemo(() => (idx) => pl.tier >= idx, [pl.tier]);
  const cap = useMemo(() => pl.maxClout || 100, [pl.maxClout]);


  const rCampaignActionProxy = async (type) => {
    const isOctoberSurprise = await rCampaignAction(type);
    if (isOctoberSurprise) triggerOctoberSurprise();
  };

  const triggerOctoberSurprise = () => {
    setMod({
      s: true, t: "OCTOBER SURPRISE", m: "Records leak threat.",
      o: [
        { label: "PAY OFF (-$250M)", action: () => { setCampaign(prev => ({ ...prev, warchest: prev.warchest - 250000000 })); finalizeMonthlyTick(); } },
        { label: "LET IT LEAK", action: () => { setPl(p => ({ ...p, clout: Math.min(p.maxClout, p.clout + 1000), aura: Math.max(0, p.aura - 150) })); setCampaign(prev => ({ ...prev, regionalPolling: { blueWall: Math.min(100, prev.regionalPolling.blueWall + 3), rustBelt: Math.min(100, prev.regionalPolling.rustBelt + 3), sunBelt: Math.min(100, prev.regionalPolling.sunBelt + 3) } })); finalizeMonthlyTick(); } },
        { label: "APOLOGIZE", action: () => { setPl(p => ({ ...p, clout: Math.max(0, p.clout - 200), mentalHealth: Math.max(0, p.mentalHealth - 40) })); setCampaign(prev => ({ ...prev, regionalPolling: { blueWall: Math.max(0, prev.regionalPolling.blueWall - 5), rustBelt: Math.max(0, prev.regionalPolling.rustBelt - 5), sunBelt: Math.max(0, prev.regionalPolling.sunBelt - 5) } })); finalizeMonthlyTick(); } }
      ],
      ui: "ui-crisis"
    });
  };

  const finalizeMonthlyTick = () => {
    setCampaign(prev => ({ ...prev, phase: 'CORPORATE_HQ' })); adv(1);
    setMod({ s: true, t: "MONTHLY BRIEFING", m: "Return to HQ.", o: [{ label: "ACKNOWLEDGE", action: () => setMod({ s: false }) }], ui: "ui-modal" });
  };

  return (
    <GameContext.Provider value={{
      ...storeData,
      displayBag, age, legacyMultiplier, isTierUnlocked, cap,
      rCampaignAction: rCampaignActionProxy,
    }}>
      {children}
    </GameContext.Provider>
  );
};