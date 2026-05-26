import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useGameStore, TIERS as STORE_TIERS, mudChaosPools } from './gameStore.js';
import { fMny } from './config.js';

export const TIERS = STORE_TIERS;
export { mudChaosPools };

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const SAVE_KEY = 'bag-chaser-save-v1';

export const GameProvider = ({ children }) => {
  const store = useGameStore();

  const {
    ph, setPh, proSt, setProSt, alias, setAlias, diff, setDiff, tab, setTab, selTier, setSelTier,
    death, setDeath, cancelIntro, gBusy, setGBusy, rain, swFatigue, setSwFatigue, hustleFatigue, setHustleFatigue,
    karmaFlags, setKarmaFlags, fatalTragedyMessage, setFatalTragedyMessage, lastHustle,
    dropshipLock, vintageLock, smmPenalty, techSourceCost, smmClients, setSmmClients,
    clientCrisis, setClientCrisis, vinCh, setVinCh, hustleClicks, setHustleClicks, techItem, setTechItem,
    techFlipsComplete, setTechFlipsComplete, runnerCount, setRunnerCount, runnerBurnout, setRunnerBurnout,
    saasUsers, setSaasUsers, saasPrice, saasChurn, saasPenaltyActive, corpClients, setCorpClients,
    apiLockoutMonths, setApiLockoutMonths, creOfficeCount, setCreOfficeCount, creRetailCount, setCreRetailCount,
    franchiseCount, setFranchiseCount, unionStrikeActive, unionStrikeIgnored, peProgress, setPeProgress,
    guttedFirms, supplyChainDisruption, peCompoundingYield, artMarketSentiment, setArtMarketSentiment,
    artCollection, setArtCollection, venueState, setVenueState, audioTracks, setAudioTracks,
    sampleStrike, setSampleStrike, pmcSquads, setPmcSquads, intelLeak, setIntelLeak,
    techInterns, setTechInterns, bulkPalletsUnlocked, enterpriseContracts, setEnterpriseContracts,
    audioUpgrades, setAudioUpgrades, talentScouters, setTalentScouters, holwoodSyncActive,
    collectiblePhase, setCollectiblePhase, vintageRevenueTracker, setVintageRevenueTracker,
    vintageBoostActive, setVintageBoostActive, sneakerBackdoorPlug, setSneakerBackdoorPlug,
    consignmentFeeActive, setConsignmentFeeActive, vaultHoldings, setVaultHoldings,
    smmRetainerActive, aiSmmFactory, smmEmpireActive, pmcUnlocked, setPmcUnlocked,
    pmcMercenaries, setPmcMercenaries, pmcActiveContracts, setPmcActiveContracts,
    pmcHeatLevel, setPmcHeatLevel, pmcMercCost, setPmcMercCost, pmcBribeCost, setPmcBribeCost,
    conglomActive, movieProject, antitrustRisk, setAntitrustRisk, swfInvestment, setSwfInvestment,
    geoStability, setGeoStability, swfFrozen, setSwfFrozen, superPacFunds, setSuperPacFunds,
    approvalRating, setApprovalRating, lobbyists, setLobbyists, lobbyistCost, setLobbyistCost,
    mediaBlitzCost, setMediaBlitzCost, isPresident, setIsPresident, politicalSyndicate, setPoliticalSyndicate,
    presidencyEligible, setPresidencyEligible, tickerAdvice, artBubbleMonths, setArtBubbleMonths,
    supplyChainShockMonths, setSupplyChainShockMonths, viralPopMonths, setViralPopMonths,
    flex, setFlex, campaign, setCampaign, seenNotifications, setSeenNotifications,
    activeNotification, mhEmergencies, setMhEmergencies, pfwActive, setPfwActive,
    activeEvent, isEventModalOpen, setIsEventModalOpen, isBreakdownActive, shakeActive,
    passiveFrozen, setPassiveFrozen, pl, setPl, mkt, setMkt, news, setNews, imp, mod, setMod,
    up, setUp, skl, setSkl, ass, setAss, sw, setSw, drp, setDrp, cc, setCc, pod, setPod,
    box, setBox, tur, setTur, tch, setTch, crp, setCrp, mov, setMov, hf, setHf, ai, setAi,
    prs, setPrs, peaks, setPeaks, hl, setHl, tally, setTally, generationCount,
    lastProcessedTimestamp, getUpdatedCaps, adv, exStart, dUp, bAss, triggerImpact,
    updateFatigue, triggerChaos, executeChaosRoll, triggerNotification, closeNotification,
    rVintage, rVinCh, rSw, rSwSpin, rSneakerDrop, rBuyConsignment, rBuyVault, rBuyVaultAsset,
    rVaultAuction, rLaunchSmmRetainer, rBuySmmFactory, rBuySmmEmpire, rSmmPitch, rSmmFix,
    rDelivery, rPlasma, rSurvey, rLabor, rRest, rTechSource, rTechFixA, rTechFixB,
    rProcessBulkPallet, rTechMicroSolder, rRunnerRecruit, rRunnerFix, rSaasClick,
    rAiAgencyClick, rCreBuyOffice, rCreBuyRetail, rFranchiseClick, rResolveUnionStrike,
    rResolveSupplyChain, rPeClick, rArtSpeculate, handleArtPurchase, finalizeAuction,
    rArtHostExhibit, rAcceptPatronOffer, rFormConglom, rLobbyRegulators, rSwfInvest,
    rSwfWithdraw, rAudioRelease, rAudioSettle, rPmcDeploy, rPmcSettle, rPmcHire,
    rPmcDeployContract, rPmcBribe, rAcquirePoliticalAsset, rDeployNarrativeOp,
    rHostPolicySummit, rSubmitToHallOfFame, rCampaignAction, rResumeCampaign,
    rRetire, performHardReset
  } = store;

  const displayBag = pl.bag;
  const age = 18 + Math.floor(pl.mo / 12);
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
    if (pl.maxClout !== cloutCap || pl.maxAura !== auraCap || pl.maxMentalHealth !== mhCap) {
      setPl(prev => ({ ...prev, maxClout: cloutCap, maxAura: auraCap, maxMentalHealth: mhCap, clout: Math.min(cloutCap, prev.clout), aura: Math.min(auraCap, prev.aura), mentalHealth: Math.min(mhCap, prev.mentalHealth) }));
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
      if (peaks.peakB >= req.bag && peaks.peakC >= req.clout && peaks.peakA >= req.aura) nextTier = i;
      else break;
    }
    if (nextTier !== pl.tier) {
      setPl(prev => ({ ...prev, tier: nextTier }));
      if (nextTier >= 4) setPmcUnlocked(true);
      setNews(prev => [`🏆 TIER UP! You ascended to ${TIERS[nextTier].label}.`, ...prev.slice(0, 15)]);
    }
  }, [peaks, ph, pl.tier, setPl, setPmcUnlocked, setNews]);

  useEffect(() => {
    if (ph !== 'PLAYING') return;
    const interval = setInterval(() => {
      if (Math.random() > 0.05) return;
      const { conglomActive, ass, pl: curPl, saasUsers, artCollection } = store;
      const roll = Math.random();
      if (roll < 0.33 && conglomActive) {
        if (ass.legalTeam) setNews(prev => ["⚖️ LEGAL defense blocked IRS audit.", ...prev.slice(0, 15)]);
        else {
          const pen = Math.floor(curPl.bag * 0.1); setPl(prev => ({ ...prev, bag: prev.bag - pen }));
          setMod({ s: true, t: "IRS ANTI-TRUST SWEEP", m: `Regulators seized $${pen.toLocaleString()}.`, o: [{ label: "COMPLY", action: () => setMod({ s: false }) }], ui: "ui-crisis" });
        }
      } else if (roll < 0.66 && (saasUsers > 0 || artCollection.length > 0)) {
        if (saasUsers > 0 && Math.random() > 0.5) {
          const gain = 500 + (Math.floor(curPl.clout / 10) * 100); setSaasUsers(p => p + gain);
          setMod({ s: true, t: "VIRAL PRODUCT", m: `Gained ${gain} users.`, o: [{ label: "RIDE THE WAVE", action: () => setMod({ s: false }) }], ui: "ui-modal" });
        } else if (artCollection.length > 0) {
          setArtMarketSentiment(p => Math.min(1, p + 0.5));
          setMod({ s: true, t: "ART MANIA", m: "Valuation skyrocketing.", o: [{ label: "EXCELLENT", action: () => setMod({ s: false }) }], ui: "ui-modal" });
        }
      } else if (artCollection.length >= 50 && roll < 0.15) {
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
  }, [ph, store, setPl, setNews, setMod, setSaasUsers, setArtMarketSentiment, setPassiveFrozen, rAcceptPatronOffer]);

  const isTierUnlocked = useMemo(() => (idx) => pl.tier >= idx, [pl.tier]);
  const cap = useMemo(() => pl.maxClout || 100, [pl.maxClout]);

  const rPrsA = async (type) => {
    if (type === 'gala') { setPl(p => ({ ...p, bag: p.bag + 200000000 })); triggerImpact('bag', 200000000); }
    else if (type === 'tv') { setPl(p => ({ ...p, bag: p.bag - 100000000, clout: Math.max(0, p.clout - 10) })); setPrs(prev => ({ ...prev, rst: prev.rst + 3, sun: prev.sun + 2, sub: prev.sub + 4 })); }
    else if (type === 'smear') { setPl(p => ({ ...p, aura: Math.max(0, p.aura - 25) })); setPrs(prev => ({ ...prev, rst: prev.rst + 2, sun: prev.sun + 3 })); }
    else { setPl(p => ({ ...p, bag: p.bag - 2000000 })); setPrs(prev => ({ ...prev, rst: prev.rst + 0.8, sun: prev.sun + 1 })); }
    adv(); return undefined;
  };

  const rPrs1TT = async () => { setPl(p => ({ ...p, bag: p.bag - 100000000, clout: Math.max(0, p.clout - 20) })); setPrs(p => ({ ...p, p1tt: true, sh: true })); return undefined; };
  const rPrs1OP = async () => { setPl(p => ({ ...p, bag: p.bag - 150000000, aura: Math.max(0, p.aura - 30) })); setPrs(p => ({ ...p, p1op: true, ot: true })); return undefined; };
  const rPrs1ET = async () => { setPl(p => ({ ...p, bag: p.bag - 50000000, clout: Math.max(0, p.clout - 25) })); setPrs(p => ({ ...p, p1et: true })); return undefined; };
  const dVp = () => { setPrs(p => ({ ...p, vu: true, rst: p.rst + 4 })); };
  const dDef = () => { setPl(p => ({ ...p, bag: p.bag - 75000000, clout: Math.max(0, p.clout - 20) })); setPrs(p => ({ ...p, du: true, sub: p.sub + 5 })); };

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

  const rElectionNightResolution = async () => {
    if (campaign.currentWeek < 52) return;
    setGBusy(true); await new Promise(r => setTimeout(r, 3000)); setGBusy(false);
    let playerEVs = (campaign.regionalPolling.blueWall > campaign.opponentPolling.blueWall ? 44 : 0) + (campaign.regionalPolling.rustBelt > campaign.opponentPolling.rustBelt ? 46 : 0) + (campaign.regionalPolling.sunBelt > campaign.opponentPolling.sunBelt ? 55 : 0) + 130;
    if (playerEVs >= 270) {
      setIsPresident(true); setCampaign(prev => ({ ...prev, phase: 'COMPLETED' }));
      setMod({ s: true, t: "VICTORY", m: `EVs: ${playerEVs}`, o: [{ label: "ASCEND", action: () => { setTab('VICTORY_SPEECH'); setMod({ s: false }); } }], ui: "ui-victory" });
    } else {
      setCampaign(prev => ({ ...prev, phase: 'COMPLETED' }));
      setMod({ s: true, t: "CONCESSION", m: `EVs: ${playerEVs}`, o: [{ label: "RESUME", action: () => setMod({ s: false }) }], ui: "ui-crisis" });
    }
  };

  return (
    <GameContext.Provider value={{
      ...store,
      displayBag, age, legacyMultiplier, isTierUnlocked, cap,
      rPrsA, rPrs1TT, rPrs1OP, rPrs1ET, dVp, dDef,
      rCampaignAction: rCampaignActionProxy,
      rElectionNightResolution
    }}>
      {children}
    </GameContext.Provider>
  );
};