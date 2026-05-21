import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const TIERS = [
  { id: 0, label: 'Mud',       req: { bag: 0,           clout: 0,    aura: 0   }, hustles: ['SW', 'DROP', 'TECH_FLIP', 'VINTAGE', 'SMM', 'GIG'] },
  { id: 1, label: 'Street',    req: { bag: 100000,      clout: 30,   aura: 0   }, hustles: ['CC', 'POD', 'BOX', 'AUDIO'] },
  { id: 2, label: 'Corporate', req: { bag: 1000000,     clout: 150,  aura: 50  }, hustles: ['TECH', 'AI_AGENCY', 'CRE_FLIP', 'FRANCHISE'] },
  { id: 3, label: 'Elite',     req: { bag: 25000000,    clout: 500,  aura: 0   }, hustles: ['CRYP', 'TOUR', 'PE_ROLLUP', 'ART_SPEC'] },
  { id: 4, label: 'Mogul',     req: { bag: 250000000,   clout: 1500, aura: 500 }, hustles: ['HF', 'CONGLOMERATE', 'PMC', 'SOVEREIGN'] },
  { id: 5, label: 'President', req: { bag: 1000000000,  clout: 5000, aura: 2500 }, hustles: ['PAC', 'BLITZ', 'SMEAR', 'ELECTION'] },
];

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const SAVE_KEY = 'bag-chaser-save-v1';

export const GameProvider = ({ children }) => {
  // Navigation & Core Frame
  const [ph, setPh] = useState('PROLOGUE');
  const [proSt, setProSt] = useState(0);
  const [alias, setAlias] = useState('');
  const [diff, setDiff] = useState(2);
  const [tab, setTab] = useState('HUB');
  const [selTier, setSelTier] = useState('0');
  const [death, setDeath] = useState(null);
  const [cancelIntro, setCancelIntro] = useState(null);
  const [gBusy, setGBusy] = useState(false);
  const [rain, setRain] = useState(false);
  const [swFatigue, setSwFatigue] = useState(0);
  const [hustleFatigue, setHustleFatigue] = useState({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
  const [karmaFlags, setKarmaFlags] = useState({ usedCheapBlanks: false, ignoredRefunds: false, soldBootleg: false, ignoredSmmCrisis: false, usedCheapParts: false, ignoredRunnerWelfare: false });
  const [fatalTragedyMessage, setFatalTragedyMessage] = useState(null);
  const [lastHustle, setLastHustle] = useState(null);
  const [dropshipLock, setDropshipLock] = useState(0);
  const [vintageLock, setVintageLock] = useState(0);
  const [smmPenalty, setSmmPenalty] = useState(false);
  const [techSourceCost, setTechSourceCost] = useState(150);

  const [smmClients, setSmmClients] = useState(0);
  const [clientCrisis, setClientCrisis] = useState(false);
  const [vinCh, setVinCh] = useState(null);
  const [hustleClicks, setHustleClicks] = useState({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
  const [techItem, setTechItem] = useState(null);
  const [techFlipsComplete, setTechFlipsComplete] = useState(0);
  const [runnerCount, setRunnerCount] = useState(0);
  const [runnerBurnout, setRunnerBurnout] = useState(false);

  const [saasUsers, setSaasUsers] = useState(0);
  const [saasPrice, setSaasPrice] = useState(50);
  const [saasChurn, setSaasChurn] = useState(0.05);
  const [saasPenaltyActive, setSaasPenaltyActive] = useState(false);
  const [corpClients, setCorpClients] = useState(0);
  const [apiLockoutMonths, setApiLockoutMonths] = useState(0);
  const [creOfficeCount, setCreOfficeCount] = useState(0);
  const [creRetailCount, setCreRetailCount] = useState(0);
  const [franchiseCount, setFranchiseCount] = useState(0);
  const [unionStrikeActive, setUnionStrikeActive] = useState(false);
  const [unionStrikeIgnored, setUnionStrikeIgnored] = useState(false);

  const [peProgress, setPeProgress] = useState(0);
  const [guttedFirms, setGuttedFirms] = useState(0);
  const [supplyChainDisruption, setSupplyChainDisruption] = useState(false);
  const [peCompoundingYield, setPeCompoundingYield] = useState(1.0);
  const [artMarketSentiment, setArtMarketSentiment] = useState(0);
  const [artHoldings, setArtHoldings] = useState(0);

  const [conglomActive, setConglomActive] = useState(false);
  const [antitrustRisk, setAntitrustRisk] = useState(0);
  const [swfInvestment, setSwfInvestment] = useState(0);
  const [geoStability, setGeoStability] = useState(1.0);
  const [swfFrozen, setSwfFrozen] = useState(false);

  const [isBreakdownActive, setIsBreakdownActive] = useState(false);
  const [shakeActive, setShakeActive] = useState(false);
  const [passiveFrozen, setPassiveFrozen] = useState(false);

  // Financial Systems & Vital Signs
  const [pl, setPl] = useState({ bag: 25000, aura: 100, clout: 20, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 });
  const displayBag = pl.bag;
  const age = 18 + Math.floor(pl.mo / 12);

  // Macro Environment
  const [mkt, setMkt] = useState(0);
  const [news, setNews] = useState(['Booting life simulation... System optimal.', 'Market Cycle initialized: NORMAL economy.']);
  const [imp, setImp] = useState([]);
  const [mod, setMod] = useState({ s: false, t: '', m: '', o: [], ui: '' });

  // Tech Tree Infrastructure
  const [up, setUp] = useState({ swIp: false, swFlg: false, swPar: false, swGlb: false, drpFac: false, ccAge: false, ccNet: false, podCmp: false, boxLg: false, boxBrd: false, trFst: false, tchGov: false, movStr: false, movUni: false });
  const [skl, setSkl] = useState({ neg: 0, tax: 0, inf: 0 });
  const [ass, setAss] = useState({ watch: false, pent: false, mtgPent: false, mans: false, mtgMans: false, jet: false, mtgJet: false, yct: false, mtgYct: false, spt: false, spc: false, swf: false, hePent: false, cmYct: false, legalTeam: false });

  // Active Venture Vectors
  const [sw, setSw] = useState({ i: 1, u: 250, p: 45, a: 5000 });
  const [drp, setDrp] = useState({ i: 1, u: 500, p: 35, a: 10000 });
  const [cc, setCc] = useState({ m: 'solo', v: 1, n: 1 });
  const [pod, setPod] = useState({ g: 1, q: 20000 });
  const [box, setBox] = useState({ v: 1, t: 1, b: 100000, p: 1 });
  const [tur, setTur] = useState({ t: 1, m: 150000, a: 50000, l: 100000 });
  const [tch, setTch] = useState({ l: false, u: 1200, srv: 0.15, pw: false, vc: false, m: 15000 });
  const [crp, setCrp] = useState({ l: 0, t: '', i: 25000, m: 15000 });
  const [mov, setMov] = useState({ g: 1, w: 1, d: 1, s: 1, m: 5000000 });
  const [hf, setHf] = useState({ r: 0, t: 'NVDA', c: 5000000, l: 5 });
  const [ai, setAi] = useState({ ig: false, p: 0, r: 0, d: 1, c: 1, s: 1, dj: 0 });
  const [prs, setPrs] = useState({ r: false, m: 0, cd: 0, rem: false, rst: 44, sun: 42, sub: 45, vp: 1, fr: false, vu: false, du: false, sh: false, ot: false, p1tt: false, p1op: false, p1et: false, ev: { d1: false, d2: false, o: false }, chest: 0, polls: 0 });

  // Legacy Registry
  const [peaks, setPeaks] = useState({ peakB: 25000, peakA: 100, peakC: 20 });
  const [hl, setHl] = useState({ sw: 0, drop: 0, cc: 0, pod: 0, box: 0, tch: 0, cryp: 0, tour: 0, mov: 0, hf: 0 });
  const [tally, setTally] = useState({ cryp: 0, box: 0, hf: 0, pres: 0 });
  const [generationCount, setGenerationCount] = useState(0);
  const legacyMultiplier = 1 + (generationCount * 0.25);

  // Persistent Save Engine Ref for Stable Background Saves
  const stateRef = React.useRef();
  stateRef.current = {
    ph, proSt, alias, diff, tab, selTier, swFatigue, hustleFatigue, karmaFlags,
    lastHustle, dropshipLock, vintageLock, smmPenalty, techSourceCost, smmClients,
    clientCrisis, vinCh, hustleClicks, techItem, techFlipsComplete, runnerCount,
    runnerBurnout, saasUsers, saasPrice, saasChurn, saasPenaltyActive, corpClients,
    apiLockoutMonths, creOfficeCount, creRetailCount, franchiseCount, unionStrikeActive,
    unionStrikeIgnored, peProgress, guttedFirms, supplyChainDisruption, peCompoundingYield,
    artMarketSentiment, artHoldings, conglomActive, antitrustRisk, swfInvestment,
    geoStability, swfFrozen, passiveFrozen, pl, mkt, news, up, skl, ass, sw, drp, cc, pod,
    box, tur, tch, crp, mov, hf, ai, prs, peaks, hl, tally, generationCount
  };

  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.ph) setPh(d.ph);
        if (d.proSt !== undefined) setProSt(d.proSt);
        if (d.alias) setAlias(d.alias);
        if (d.diff !== undefined) setDiff(d.diff);
        if (d.tab) setTab(d.tab);
        if (d.selTier) setSelTier(d.selTier);
        if (d.swFatigue !== undefined) setSwFatigue(d.swFatigue);
        if (d.hustleFatigue) setHustleFatigue(d.hustleFatigue);
        if (d.karmaFlags) setKarmaFlags(d.karmaFlags);
        if (d.lastHustle) setLastHustle(d.lastHustle);
        if (d.dropshipLock !== undefined) setDropshipLock(d.dropshipLock);
        if (d.vintageLock !== undefined) setVintageLock(d.vintageLock);
        if (d.smmPenalty !== undefined) setSmmPenalty(d.smmPenalty);
        if (d.techSourceCost !== undefined) setTechSourceCost(d.techSourceCost);
        if (d.smmClients !== undefined) setSmmClients(d.smmClients);
        if (d.clientCrisis !== undefined) setClientCrisis(d.clientCrisis);
        if (d.vinCh) setVinCh(d.vinCh);
        if (d.hustleClicks) setHustleClicks(d.hustleClicks);
        if (d.techItem) setTechItem(d.techItem);
        if (d.techFlipsComplete !== undefined) setTechFlipsComplete(d.techFlipsComplete);
        if (d.runnerCount !== undefined) setRunnerCount(d.runnerCount);
        if (d.runnerBurnout !== undefined) setRunnerBurnout(d.runnerBurnout);
        if (d.saasUsers !== undefined) setSaasUsers(d.saasUsers);
        if (d.saasPrice !== undefined) setSaasPrice(d.saasPrice);
        if (d.saasChurn !== undefined) setSaasChurn(d.saasChurn);
        if (d.saasPenaltyActive !== undefined) setSaasPenaltyActive(d.saasPenaltyActive);
        if (d.corpClients !== undefined) setCorpClients(d.corpClients);
        if (d.apiLockoutMonths !== undefined) setApiLockoutMonths(d.apiLockoutMonths);
        if (d.creOfficeCount !== undefined) setCreOfficeCount(d.creOfficeCount);
        if (d.creRetailCount !== undefined) setCreRetailCount(d.creRetailCount);
        if (d.franchiseCount !== undefined) setFranchiseCount(d.franchiseCount);
        if (d.unionStrikeActive !== undefined) setUnionStrikeActive(d.unionStrikeActive);
        if (d.unionStrikeIgnored !== undefined) setUnionStrikeIgnored(d.unionStrikeIgnored);
        if (d.peProgress !== undefined) setPeProgress(d.peProgress);
        if (d.guttedFirms !== undefined) setGuttedFirms(d.guttedFirms);
        if (d.supplyChainDisruption !== undefined) setSupplyChainDisruption(d.supplyChainDisruption);
        if (d.peCompoundingYield !== undefined) setPeCompoundingYield(d.peCompoundingYield);
        if (d.artMarketSentiment !== undefined) setArtMarketSentiment(d.artMarketSentiment);
        if (d.artHoldings !== undefined) setArtHoldings(d.artHoldings);
        if (d.conglomActive !== undefined) setConglomActive(d.conglomActive);
        if (d.antitrustRisk !== undefined) setAntitrustRisk(d.antitrustRisk);
        if (d.swfInvestment !== undefined) setSwfInvestment(d.swfInvestment);
        if (d.geoStability !== undefined) setGeoStability(d.geoStability);
        if (d.swfFrozen !== undefined) setSwfFrozen(d.swfFrozen);
        if (d.passiveFrozen !== undefined) setPassiveFrozen(d.passiveFrozen);
        if (d.pl) setPl(d.pl);
        if (d.mkt !== undefined) setMkt(d.mkt);
        if (d.news) setNews(d.news);
        if (d.up) setUp(d.up);
        if (d.skl) setSkl(d.skl);
        if (d.ass) setAss(d.ass);
        if (d.sw) setSw(d.sw);
        if (d.drp) setDrp(d.drp);
        if (d.cc) setCc(d.cc);
        if (d.pod) setPod(d.pod);
        if (d.box) setBox(d.box);
        if (d.tur) setTur(d.tur);
        if (d.tch) setTch(d.tch);
        if (d.crp) setCrp(d.crp);
        if (d.mov) setMov(d.mov);
        if (d.hf) setHf(d.hf);
        if (d.ai) setAi(d.ai);
        if (d.prs) setPrs(d.prs);
        if (d.peaks) setPeaks(d.peaks);
        if (d.hl) setHl(d.hl);
        if (d.tally) setTally(d.tally);
        if (d.generationCount !== undefined) setGenerationCount(d.generationCount);
      } catch (e) {
        console.error("Failed to load save data", e);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Dynamic Stat Caps
  useEffect(() => {
    if (ph !== 'PLAYING') return;
    const caps = [100, 250, 500, 2000, 10000, 999999999];
    let currentCap = caps[pl.tier] || caps[0];
    let cloutCap = currentCap;
    if (ass.cmYct && pl.tier < 5) {
      cloutCap = currentCap * 10;
    }
    setPl(prev => {
      if (prev.maxClout === cloutCap && prev.maxAura === currentCap) return prev;
      return {
        ...prev,
        maxClout: cloutCap,
        maxAura: currentCap,
        clout: Math.min(cloutCap, prev.clout),
        aura: Math.min(currentCap, prev.aura)
      };
    });
  }, [pl.tier, ph, ass.cmYct]);

  // Keep Track of Records & Auto Failures
  useEffect(() => {
    if (ph !== 'PLAYING' || !pl) return;
    if ((pl.bag || 0) > (peaks?.peakB || 0) || (pl.aura || 0) > (peaks?.peakA || 0) || (pl.clout || 0) > (peaks?.peakC || 0)) {
      setPeaks(prev => ({
        peakB: Math.max(prev?.peakB || 0, pl.bag || 0),
        peakA: Math.max(prev?.peakA || 0, pl.aura || 0),
        peakC: Math.max(prev?.peakC || 0, pl.clout || 0)
      }));
    }
    const maxMudAge = 30;
    const isMud = pl.tier === 0;
    const hasPassive = smmClients > 0 || runnerCount > 0 || ass?.watch || ass?.pent || (tch.l && tch.pw);

    if ((pl.bag || 0) < 0 && !fatalTragedyMessage) {
      setFatalTragedyMessage("BANKRUPTCY: Your net worth has dipped into the negative. The creditors have arrived, and they aren't here to talk. The hustle is dead.");
    }

    if (((pl.bag || 0) <= 0 && !hasPassive) || fatalTragedyMessage) {
      const topHustle = Object.keys(hustleClicks).reduce((a, b) => hustleClicks[a] > hustleClicks[b] ? a : b);
      const roasts = {
        vintage: "You spent your best years bin dipping. You died smelling like vintage mothballs, holding a bootleg hoodie you swore was a Grail.",
        streetwear: "Hyped yourself into poverty. You ended up an old man with 500 unsold, screen-printed graphic tees rotting in your parents' garage.",
        dropship: "Automated your way to absolute zero. You spent your whole life staring at unoptimized Facebook ad pixels and arguing with foreign suppliers.",
        tech: "Bricked your own future. You blew your life savings on cheap, third-party phone batteries that ended up melting your workbench.",
        smm: "Killed by client feedback. You spent your youth getting yelled at by a local pizzeria owner over a low-performing Instagram Reel.",
        runners: "Overthrown by local middle-schoolers. Your neighborhood bicycle delivery cartel mutinied and stole your inventory over a $200 bonus dispute."
      };

      setDeath({
        r: "THE AUTOPSY REPORT",
        i: roasts[topHustle] || "You failed to find a groove and the world moved on without you.",
        rank: "BROKE HUSTLER",
        hustle: topHustle
      });
    } else if (age >= maxMudAge && isMud) {
      const topHustle = Object.keys(hustleClicks).reduce((a, b) => hustleClicks[a] > hustleClicks[b] ? a : b);
      const roasts = {
        vintage: "You spent your best years bin dipping. You died smelling like vintage mothballs, holding a bootleg hoodie you swore was a Grail.",
        streetwear: "Hyped yourself into poverty. You ended up an old man with 500 unsold, screen-printed graphic tees rotting in your parents' garage.",
        dropship: "Automated your way to absolute zero. You spent your whole life staring at unoptimized Facebook ad pixels and arguing with foreign suppliers.",
        tech: "Bricked your own future. You blew your life savings on cheap, third-party phone batteries that ended up melting your workbench.",
        smm: "Killed by client feedback. You spent your youth getting yelled at by a local pizzeria owner over a low-performing Instagram Reel.",
        runners: "Overthrown by local middle-schoolers. Your neighborhood bicycle delivery cartel mutinied and stole your inventory over a $200 bonus dispute."
      };

      setDeath({
        r: "THE AUTOPSY REPORT",
        i: "MUD TIER EXCLUSION: " + (roasts[topHustle] || "Your youth expired before your empire began."),
        rank: "MUD TIER CASUALTY",
        hustle: topHustle
      });
    }
    if ((pl.aura || 0) <= 0) {
      setCancelIntro({ r: "PERMANENT DE-PLATFORMING SCANDAL", i: "Public sentiment reached total rejection. Sponsors canceled you, your platforms were erased." });
    }

    if (pl.mentalHealth <= 0 && !isBreakdownActive) {
      setIsBreakdownActive(true);
      setShakeActive(true);
      setGBusy(true);
      setTimeout(() => setShakeActive(false), 500);
    }
  }, [pl, ph, peaks, isBreakdownActive]);

  const rDischarge = () => {
    setPl(prev => ({
      ...prev,
      bag: prev.bag - 300,
      mo: prev.mo + 1,
      mentalHealth: Math.floor(prev.maxMentalHealth * 0.5)
    }));
    setIsBreakdownActive(false);
    setGBusy(false);
    setNews(prev => ["🏥 DISCHARGED: You've completed mandatory wellness rehab. -$300 fee applied.", ...prev.slice(0, 15)]);
  };

  // Tier Progression System
  useEffect(() => {
    if (ph !== 'PLAYING' || !pl) return;
    let nextTier = pl.tier || 0;
    const tiersCount = TIERS?.length || 0;
    for (let i = nextTier + 1; i < tiersCount; i++) {
      const req = TIERS[i]?.req;
      if (!req) break;
      if ((peaks?.peakB || 0) >= (req.bag || 0) && (peaks?.peakC || 0) >= (req.clout || 0) && (peaks?.peakA || 0) >= (req.aura || 0)) {
        nextTier = i;
      } else {
        break;
      }
    }
    if (nextTier !== (pl.tier || 0)) {
      setPl(prev => ({ ...prev, tier: nextTier }));
      setNews(prev => [`🏆 TIER UP! You have ascended to the ${TIERS[nextTier]?.label || 'Next'} Tier.`, ...prev.slice(0, 15)]);
    }
  }, [peaks, ph, pl.tier]);

  // Random Chaos & Empire Alert Engine
  useEffect(() => {
    if (ph !== 'PLAYING') return;

    const interval = setInterval(() => {
      // Tiny chance (5%) for a random event every 30 seconds
      if (Math.random() > 0.05) return;

      const { conglomActive, ass, pl, saasUsers, artHoldings } = stateRef.current;
      const roll = Math.random();

      // 1. IRS Audit / Anti-Trust Sweep (Requires Conglomerate)
      if (roll < 0.33 && conglomActive) {
        if (ass.legalTeam) {
          setNews(prev => ["⚖️ LEGAL: Elite defense team blocked a surprise IRS audit.", ...prev.slice(0, 15)]);
        } else {
          const penalty = Math.floor(pl.bag * 0.1);
          setPl(prev => ({ ...prev, bag: prev.bag - penalty }));
          setMod({
            s: true,
            t: "IRS ANTI-TRUST SWEEP",
            m: `The feds raided your holding company. Regulators seized $${penalty.toLocaleString()} in 'unaccounted' assets.`,
            o: [{ label: "COMPLY", action: () => setMod({ s: false }) }],
            ui: "ui-crisis"
          });
        }
      }
      // 2. Viral Market Windfall
      else if (roll < 0.66 && (saasUsers > 0 || artHoldings > 0)) {
        const cloutBonus = Math.floor(pl.clout / 10);
        if (saasUsers > 0 && Math.random() > 0.5) {
          const gain = 500 + (cloutBonus * 100);
          setSaasUsers(prev => prev + gain);
          setMod({
            s: true,
            t: "VIRAL PRODUCT REACTION",
            m: `An A-list celebrity tagged your SaaS. You just gained ${gain.toLocaleString()} new users overnight!`,
            o: [{ label: "RIDE THE WAVE", action: () => setMod({ s: false }) }],
            ui: "ui-modal"
          });
        } else if (artHoldings > 0) {
          setArtMarketSentiment(prev => Math.min(1, prev + 0.5));
          setMod({
            s: true,
            t: "ART MARKET MANIA",
            m: "A global auction record just shattered. Your fine art collection's valuation is skyrocketing.",
            o: [{ label: "EXCELLENT", action: () => setMod({ s: false }) }],
            ui: "ui-modal"
          });
        }
      }
      // 3. Burnout Crisis
      else if (pl.mentalHealth < 20) {
        setPassiveFrozen(true);
        setMod({
          s: true,
          t: "EMPIRE BURNOUT",
          m: "Your mental state is critical. You've gone AWOL, and passive operations have frozen until you rest or upgrade your lifestyle.",
          o: [{ label: "I NEED A BREAK", action: () => setMod({ s: false }) }],
          ui: "ui-crisis"
        });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [ph]);

  // Click Chaos Helpers
  const triggerChaos = (hustleKey) => {
    const fatigue = hustleFatigue[hustleKey] || 0;
    let risk = 0.02 + (fatigue / 100);
    if (ass.legalTeam) risk *= 0.5;
    return Math.random() < risk;
  };

  const updateFatigue = (activeHustle) => {
    setHustleFatigue(prev => {
      const next = { ...prev };
      const isDifferent = lastHustle !== activeHustle;
      Object.keys(next).forEach(k => {
        if (k === activeHustle) {
          next[k] = Math.min(100, next[k] + 15);
        } else if (isDifferent) {
          next[k] = Math.max(0, next[k] - 10);
        }
      });
      return next;
    });
    setLastHustle(activeHustle);
  };

  // Global Pulse Advance Logic
  const adv = (months = 1) => {
    if (fatalTragedyMessage) return;
    setSwFatigue(prev => Math.max(0, prev - (0.25 * months)));
    setHustleFatigue(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { next[k] = Math.max(0, next[k] - 20); });
      return next;
    });
    setDropshipLock(prev => Math.max(0, prev - months));
    setVintageLock(prev => Math.max(0, prev - months));

    if (clientCrisis) {
      if (karmaFlags.ignoredSmmCrisis) {
        setSmmClients(c => Math.max(0, c - 2));
        setNews(prev => ["📉 SMM: Disgruntled clients post terrible reviews. 2 clients churned.", ...prev.slice(0, 15)]);
      } else {
        setSmmClients(c => Math.max(0, c - 1));
        setNews(prev => ["📉 SMM: Client churned due to unresolved crisis.", ...prev.slice(0, 15)]);
      }
      setClientCrisis(false);
    }

    if (runnerBurnout) {
      if (karmaFlags.ignoredRunnerWelfare) {
        setPl(prev => ({ ...prev, bag: prev.bag - 500, clout: Math.max(0, prev.clout - 10) }));
        setNews(prev => ["📉 GIG: A disgruntled runner stole a premium package. -$500, -10 Clout.", ...prev.slice(0, 15)]);
      } else {
        setRunnerCount(c => Math.max(0, c - 1));
        setNews(prev => ["📉 GIG: Runner mutinied and stole inventory due to burnout.", ...prev.slice(0, 15)]);
      }
      setRunnerBurnout(false);
    }

    if (apiLockoutMonths > 0) setApiLockoutMonths(m => m - 1);
    if (saasPenaltyActive) setSaasPenaltyActive(false);
    setSaasUsers(prev => Math.floor(prev * (1 - saasChurn)));

    setGeoStability(prev => {
      const next = prev + (Math.random() - 0.5) * 0.1;
      return Math.min(1.5, Math.max(0.5, next));
    });

    setPl(prev => {
      let expenseBurn = 500;
      if (mkt === 2) expenseBurn *= 2;

      // Asset Yield and Maintenance
      let yieldIncome = 0;
      if (ass?.watch) yieldIncome += 750;
      if (ass?.pent) yieldIncome += 15000;

      if (ass?.pent && ass?.mtgPent) expenseBurn += 60000;
      if (ass?.mans && ass?.mtgMans) expenseBurn += 250000;
      if (ass?.jet && ass?.mtgJet) expenseBurn += 1500000;
      if (ass?.yct && ass?.mtgYct) expenseBurn += 3000000;

      // New balance sheet impacts
      if (ass?.car) expenseBurn += 8000;
      if (ass?.yct && !ass?.mtgYct) expenseBurn += 250000;

      // Deducting level perk buffs
      if (ass.legalTeam) expenseBurn += 1000000;

      const reduction = 1 - (skl.tax * 0.04);
      expenseBurn = Math.floor(expenseBurn * reduction);

      let passiveSrv = 0;
      if (tch.l && tch.pw) {
        passiveSrv = Math.floor(500 + (tch.u * tch.srv));
      }

      const smmRev = smmClients * 300;
      const runnerRev = runnerCount * 150;

      const saasRev = (saasUsers * saasPrice) * (saasPenaltyActive ? 0.5 : 1);
      const saasOverhead = saasUsers * 2;
      const aiRev = apiLockoutMonths > 0 ? 0 : (corpClients * 8000);

      let creGross = (creOfficeCount * 45000) + (creRetailCount * 15000);
      if (mkt === 2 || mkt === 3) creGross = 0; // Mass Commercial Vacancy

      let vacancyMult = 1.0;
      if ((creOfficeCount > 0 || creRetailCount > 0) && Math.random() < 0.15) {
        vacancyMult = 0.5 + (Math.random() * 0.4);
      }
      const creNet = (creGross * vacancyMult) - (creOfficeCount * 20000) - (creRetailCount * 5000);

      const franchiseRev = unionStrikeActive ? 0 : (franchiseCount * 25000);
      let peRev = supplyChainDisruption ? -500000 : (guttedFirms * 100000 * peCompoundingYield);

      const auraBleed = unionStrikeIgnored ? 50 : 0;
      const artClout = artHoldings * 20;

      const swfYield = !swfFrozen ? Math.floor(swfInvestment * 0.06 * geoStability) : 0;
      let basePassive = Math.floor((passiveSrv + smmRev + runnerRev + (saasRev - saasOverhead) + aiRev + creNet + franchiseRev + peRev) * legacyMultiplier);
      if (passiveFrozen) basePassive = 0;
      const conglomBonus = conglomActive ? Math.floor(basePassive * 0.25) : 0;

      return {
        ...prev,
        mo: prev.mo + months,
        bag: prev.bag - expenseBurn + yieldIncome + basePassive + (swfYield * legacyMultiplier) + conglomBonus,
        aura: Math.min(prev.maxAura, Math.max(0, prev.aura - auraBleed)),
        clout: Math.min(prev.maxClout, prev.clout + artClout),
        mentalHealth: Math.min(prev.maxMentalHealth, prev.mentalHealth + (ass.hePent ? 30 : 15))
      };
    });

    // SWF Freeze / Unfreeze
    if (geoStability < 0.7 && !swfFrozen && Math.random() < 0.15) {
      setSwfFrozen(true);
      setNews(prev => ["🌍 SWF ALERT: Geopolitical instability has triggered an international asset freeze.", ...prev.slice(0, 15)]);
    } else if (geoStability > 1.1 && swfFrozen) {
      setSwfFrozen(false);
      setNews(prev => ["🌍 SWF: Global stability restored. Asset freeze lifted.", ...prev.slice(0, 15)]);
    }

    // Conglomerate Risk & Fines
    if (conglomActive) {
      setAntitrustRisk(prev => {
        const next = prev + 3;
        if (next > (Math.random() * 80 + 20)) {
          setPl(p => ({ ...p, bag: p.bag - 50000000 }));
          setNews(prevNews => ["🏛️ ANTI-TRUST: Monopoly investigation triggered a $50M regulatory fine.", ...prevNews.slice(0, 15)]);
          return 0;
        }
        return next;
      });
    }

    // Market Cycle Shift Calculation
    if (Math.random() < 0.15) {
      const nextMarket = Math.floor(Math.random() * 4);
      setMkt(nextMarket);
      const mktNames = ["NORMAL", "BULL MARKET", "RECESSION", "CRACKDOWN"];
      setNews(prev => [`🚨 MARKET WATCH: Shift detected. Economy is now in ${mktNames[nextMarket]} mode.`, ...prev.slice(0, 15)]);
    }

    // SMM Crisis Trigger
    if (smmClients > 0 && Math.random() < 0.20) {
      setClientCrisis(true);
      setNews(prev => ["🚨 SMM ALERT: Client Crisis! Algorithm Shift detected.", ...prev.slice(0, 15)]);
    }

    // Runner Burnout Trigger
    if (runnerCount > 0 && Math.random() < 0.15) {
      setRunnerBurnout(true);
      setNews(prev => ["🚨 RUNNER ALERT: Fleet Burnout! Bonus required to retain courier.", ...prev.slice(0, 15)]);
    }

    // Art Market Sentiment Shift
    setArtMarketSentiment(prev => {
      const shift = (Math.random() - 0.5) * 0.4;
      return Math.min(1, Math.max(-1, prev + shift));
    });

    // Private Equity Disruption & Compounding
    if (guttedFirms > 0) {
      if (Math.random() < 0.02) {
        setSupplyChainDisruption(true);
        setNews(prev => ["🚨 PE ALERT: Supply Chain Disruption! National franchise operations frozen. High overhead spike detected.", ...prev.slice(0, 15)]);
      }
      if (!supplyChainDisruption) {
        setPeCompoundingYield(prev => prev + 0.02);
      }
    }

    // AI Engine Race Simulation
    if (ai.ig) {
      setAi(prev => {
        const compGains = prev.c * (1.2 + Math.random() * 2);
        const rivalGains = 1.8 + Math.random() * 2.5;
        return {
          ...prev,
          p: Math.min(100, prev.p + compGains),
          r: Math.min(100, prev.r + rivalGains)
        };
      });
    }

    // Campaign Clock System
    if (prs.r) {
      setPrs(prev => {
        const nextMonth = prev.m + 1;
        if (nextMonth >= 12) {
          const winRst = prev.rst >= 51;
          const winSun = prev.sun >= 51;
          const winSub = prev.sub >= 51;
          const score = (winRst ? 1 : 0) + (winSun ? 1 : 0) + (winSub ? 1 : 0);
          setTimeout(() => {
            if (score >= 2) {
              setMod({ s: true, t: "VICTORY ACHIEVED", m: "You won the presidential race and secured the Oval Office control.", o: [{ label: "ACCEPT TERM", action: () => window.location.reload() }], ui: "ui-modal" });
            } else {
              setDeath({ r: "CAMPAIGN CONCESSION NIGHT", i: "Failed to gather 270 electoral units across swing systems.", rank: "DEFEATED NOMINEE" });
            }
          }, 100);
        }
        return { ...prev, m: nextMonth };
      });
    }
  };

  const exStart = () => {
    if (alias.length < 3) return;

    if (diff === 1) { // TRUST FUND (Easy)
      setPl(p => ({ ...p, bag: 25000, clout: 30, aura: 30, maxMentalHealth: 300, mentalHealth: 300, heat: 0, maxClout: 100, maxAura: 100 }));
    } else if (diff === 2) { // HUSTLER (Normal)
      setPl(p => ({ ...p, bag: 5000, clout: 15, aura: 15, maxMentalHealth: 150, mentalHealth: 150, heat: 0, maxClout: 100, maxAura: 100 }));
    } else { // GRINDER (Difficult)
      setPl(p => ({ ...p, bag: 1000, clout: 5, aura: 5, maxMentalHealth: 100, mentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 }));
    }

    setSelTier('0');
    setTab('HUB');
    setPh('PROLOGUE_INTRO');
  };

  const dUp = (key, cost, flashMsg) => {
    if (pl.bag >= cost) {
      setPl(p => ({ ...p, bag: p.bag - cost }));
      setUp(u => ({ ...u, [key]: true }));
      setNews(n => [flashMsg, ...n.slice(0, 15)]);
    }
  };

  const bAss = (key, cost, label, cloutBump = 45, auraBump = 0) => {
    if (pl.bag >= cost) {
      setPl(p => ({
        ...p,
        bag: p.bag - cost,
        clout: Math.min(p.maxClout, p.clout + cloutBump),
        aura: Math.min(p.maxAura, p.aura + auraBump)
      }));
      setAss(a => ({ ...a, [key]: true }));
      if (key === 'pent' || key === 'hePent') setPassiveFrozen(false);
      setNews(n => [`💎 FLEET UPGRADE: Acquired ownership rights to ${label}. Balance sheet updated.`, ...n.slice(0, 15)]);
    }
  };

  const triggerImpact = (kind, amount) => {
    const id = Math.random();
    setImp(prev => [...prev, { id, kind, a: amount, w: amount >= 0 }]);
    setTimeout(() => setImp(curr => curr.filter(i => i.id !== id)), 1900);
  };

  const rVintage = async () => {
    if (pl.bag < 50 || pl.mentalHealth < 10) return;
    if (vintageLock > 0) {
      if (pl.bag >= 150) {
        setMod({
          s: true,
          t: "WAREHOUSE BRIBE",
          m: "The warehouse boss is still blocking your entry. Pay a $150 bribe to clear the blacklist?",
          o: [
            { label: "PAY BRIBE ($150)", action: () => { setPl(p => ({ ...p, bag: p.bag - 150 })); setVintageLock(0); setMod({ s: false }); } },
            { label: "CANCEL", action: () => setMod({ s: false }) }
          ],
          ui: "ui-modal"
        });
      }
      return;
    }
    updateFatigue('vintage');
    setPl(p => ({ ...p, bag: p.bag - 50, mentalHealth: p.mentalHealth - 10 }));
    setHustleClicks(prev => ({ ...prev, vintage: prev.vintage + 1 }));

    if (triggerChaos('vintage')) {
      if (karmaFlags.soldBootleg) {
        setPl(p => ({ ...p, aura: Math.max(0, p.aura - 20) }));
        setSmmPenalty(true);
        setNews(n => ["🚫 THE COMMUNITY EXPOSURE: Thrift community exposed your bootleg sales online. -20 Aura, SMM access locked.", ...n.slice(0, 15)]);
      } else {
        setVintageLock(3);
        setNews(n => ["🚫 THE WAREHOUSE BLACKLIST: Boss blocks entry for 3 months unless you pay a $150 bribe.", ...n.slice(0, 15)]);
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 800));

    const roll = Math.random();
    let profit = -50;
    if (roll < 0.01) { // GRAIL!
      setPl(p => ({ ...p, bag: p.bag + 600, clout: Math.min(p.maxClout, p.clout + 15), aura: Math.min(p.maxAura, p.aura + 1) }));
      setNews(n => ["👕 GRAIL FOUND! A rare archive piece secured for the vault.", ...n.slice(0, 15)]);
      setMod({
        s: true,
        t: "GRAIL SECURED! 🏆",
        m: "You hit the bins and found an authentic 1990s Grail. The street authenticity and clout boost is massive.",
        o: [{ label: "CELEBRATE", action: () => setMod({ s: false }) }],
        ui: "ui-modal"
      });
      triggerImpact('bag', 600);
      profit = 600;
    } else if (roll < 0.61) { // Mid-Tier
      setPl(p => ({ ...p, bag: p.bag + 120, clout: Math.min(p.maxClout, p.clout + 3) }));
      triggerImpact('bag', 120);
      profit = 120;
    } else if (roll < 0.90) { // Common Thrift
      setPl(p => ({ ...p, bag: p.bag + 35 }));
      triggerImpact('bag', 35);
      profit = 35;
    } else { // Bootleg
      setVinCh('bootleg');
      return undefined;
    }
    adv();
    return profit;
  };

  const rSmmPitch = async () => {
    if (pl.clout < 15 || pl.mentalHealth < 20 || smmPenalty) return;
    updateFatigue('smm');
    setPl(p => ({ ...p, mentalHealth: p.mentalHealth - 20 }));
    setHustleClicks(prev => ({ ...prev, smm: prev.smm + 1 }));

    if (triggerChaos('smm')) {
      if (karmaFlags.ignoredSmmCrisis) {
        setSmmClients(c => Math.max(0, c - 2));
        setNews(n => ["📉 KARMA DETONATION: Disgruntled clients post terrible reviews. 2 clients lost.", ...n.slice(0, 15)]);
      } else {
        setNews(n => ["🚫 THE GROUP-CHAT BLACKLIST: Chamber of Commerce tags you as spam. Pitch success drops to 10%.", ...n.slice(0, 15)]);
        setSmmPenalty(true);
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 800));

    const successProb = smmPenalty ? 0.1 : 0.5;
    if (Math.random() < successProb) {
      setSmmClients(c => c + 1);
      setNews(prev => ["🤝 SMM: Pitch successful! New client onboarded.", ...prev.slice(0, 15)]);
    } else {
      setNews(prev => ["❌ SMM: Pitch Rejected: Need more street leverage.", ...prev.slice(0, 15)]);
    }
    adv();
  };

  const rSmmFix = async () => {
    if (pl.mentalHealth < 15) return;
    setPl(p => ({ ...p, mentalHealth: p.mentalHealth - 15 }));
    await new Promise(r => setTimeout(r, 800));
    setClientCrisis(false);
    setNews(prev => ["✅ SMM: Content strategy fixed. Crisis averted.", ...prev.slice(0, 15)]);
    return undefined;
  };

  const rRest = async () => {
    setPl(p => ({ ...p, mentalHealth: Math.min(p.maxMentalHealth, p.mentalHealth + 50) }));
    setPassiveFrozen(false);
    adv();
    setNews(prev => ["😴 Resting... MentalHealth recovered. Passive income resumes.", ...prev.slice(0, 15)]);
  };

  const rTechSource = async () => {
    if (pl.bag < techSourceCost) return;
    updateFatigue('tech');
    setPl(p => ({ ...p, bag: p.bag - techSourceCost }));
    setTechItem({ id: Math.random(), name: "Bricked Hardware" });
    setHustleClicks(prev => ({ ...prev, tech: prev.tech + 1 }));

    if (triggerChaos('tech')) {
      if (karmaFlags.usedCheapParts) {
        const pay = 250;
        if (pl.bag >= pay) {
          setPl(p => ({ ...p, bag: p.bag - pay }));
          setNews(n => ["💸 KARMA DETONATION: Swollen screen refund paid. -$250.", ...n.slice(0, 15)]);
        } else {
          setPl(p => ({ ...p, aura: Math.max(0, p.aura - 15) }));
          setNews(n => ["💀 KARMA DETONATION: Refused refund. -15 Aura.", ...n.slice(0, 15)]);
        }
      } else {
        setNews(n => ["🚫 THE LISTING TAKEDOWN: Marketplace flags down reach. Sourcing climbs to $250.", ...n.slice(0, 15)]);
        setTechSourceCost(250);
      }
      return undefined;
    }

    setNews(n => ["💻 TECH: Sourced bricked hardware. Ready for repair.", ...n.slice(0, 15)]);
  };

  const rTechFixA = async () => {
    if (pl.bag < 30 || pl.mentalHealth < 10 || !techItem) return;
    setPl(p => ({ ...p, bag: p.bag - 30, mentalHealth: p.mentalHealth - 10 }));
    await new Promise(r => setTimeout(r, 800));

    if (Math.random() < 0.5) {
      const payout = Math.floor(750 * legacyMultiplier);
      setPl(p => ({ ...p, bag: p.bag + payout }));
      setTechItem(null);
      triggerImpact('bag', payout - 30);
      setNews(n => [`✅ TECH: Repair successful with cheap parts! Sold for $${payout.toLocaleString()}.`, ...n.slice(0, 15)]);
    } else {
      setPl(p => ({ ...p, aura: Math.max(0, p.aura - 5) }));
      setTechItem(null);
      setNews(n => ["💀 TECH: Hardware bricked during repair. Aura decreased.", ...n.slice(0, 15)]);
    }
    adv();
  };

  const rTechFixB = async () => {
    if (pl.bag < 100 || pl.mentalHealth < 15 || !techItem) return;
    setPl(p => ({ ...p, bag: p.bag - 100, mentalHealth: p.mentalHealth - 15, clout: Math.min(p.maxClout, p.clout + 2), aura: Math.min(p.maxAura, p.aura + 1) }));
    setTechFlipsComplete(prev => prev + 1);
    await new Promise(r => setTimeout(r, 1000));
    const payout = Math.floor(750 * legacyMultiplier);
    setPl(p => ({ ...p, bag: p.bag + payout }));
    setTechItem(null);
    triggerImpact('bag', payout - 100);
    setNews(n => [`✅ TECH: Premium repair successful! Sold for $${payout.toLocaleString()}. Hardware Mastery increased.`, ...n.slice(0, 15)]);
    adv();
    return 650;
  };

  const rRunnerRecruit = async () => {
    if (pl.bag < 300 || pl.mentalHealth < 25 || pl.clout < 20) return;
    updateFatigue('runners');
    setPl(p => ({ ...p, bag: p.bag - 300, mentalHealth: p.mentalHealth - 25 }));
    setHustleClicks(prev => ({ ...prev, runners: prev.runners + 1 }));

    if (triggerChaos('runners')) {
      if (karmaFlags.ignoredRunnerWelfare) {
        setPl(p => ({ ...p, bag: p.bag - 500, clout: Math.max(0, p.clout - 10) }));
        setNews(n => ["📉 KARMA DETONATION: Disgruntled runner stole package. -$500, -10 Clout.", ...n.slice(0, 15)]);
      } else {
        setRunnerCount(c => Math.max(0, c - 3));
        setPl(p => ({ ...p, bag: p.bag - 400 }));
        setNews(n => ["🚫 THE SIDEWALK RAID: Bikes impounded. Lost 3 couriers, -$400 fine.", ...n.slice(0, 15)]);
      }
      return undefined;
    }

    setRunnerCount(prev => prev + 1);
    setNews(n => ["🏃 GIG: New fleet courier recruited.", ...n.slice(0, 15)]);
    adv();
  };

  const rRunnerFix = async () => {
    if (pl.bag < 200) return;
    setPl(p => ({ ...p, bag: p.bag - 200 }));
    setRunnerBurnout(false);
    setNews(n => ["✅ GIG: Bonus paid. Fleet burnout resolved.", ...n.slice(0, 15)]);
  };

  const rSaasClick = async () => {
    if (pl.bag < 5000 || pl.mentalHealth < 20) return;
    setPl(p => ({ ...p, bag: p.bag - 5000, mentalHealth: p.mentalHealth - 20 }));
    setHustleClicks(prev => ({ ...prev, saas: (prev.saas || 0) + 1 }));

    // Click Catastrophe: Cyber Breach (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      const penalty = ass.legalTeam ? 25000 : 50000;
      setPl(p => ({ ...p, bag: p.bag - penalty }));
      setSaasPenaltyActive(true);
      setNews(prev => ["🚨 CYBER BREACH: Hackers breached your SaaS servers. -$50,000 and 50% revenue cut next cycle.", ...prev.slice(0, 15)]);
      return undefined;
    }

    const userGain = techFlipsComplete >= 10 ? 120 : 100;
    setSaasUsers(prev => prev + userGain);
    setNews(prev => [`📈 SAAS: Marketing push successful! +${userGain} users acquired.`, ...prev.slice(0, 15)]);
    adv();
  };

  const rAiAgencyClick = async () => {
    if (pl.bag < 2500 || pl.mentalHealth < 15 || pl.bag < 1000000 || pl.clout < 150 || pl.aura < 100) return;
    setPl(p => ({ ...p, bag: p.bag - 2500, mentalHealth: p.mentalHealth - 15 }));
    setHustleClicks(prev => ({ ...prev, ai_agency: (prev.ai_agency || 0) + 1 }));

    // Click Catastrophe: API Poisoning (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      setApiLockoutMonths(ass.legalTeam ? 1 : 3);
      setNews(prev => ["🚨 API POISONING: Your lead bots were flagged. Agency suspended for 3 game months.", ...prev.slice(0, 15)]);
      return undefined;
    }

    if (Math.random() < 0.4) {
      setCorpClients(c => c + 1);
      setNews(prev => ["🤝 AI AGENCY: New high-ticket corporate client secured.", ...prev.slice(0, 15)]);
    } else {
      setNews(prev => ["❌ AI AGENCY: Proposal rejected. Refine your models.", ...prev.slice(0, 15)]);
    }
    adv();
  };

  const rCreBuyOffice = async () => {
    if (pl.bag < 15000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
    setPl(p => ({ ...p, bag: p.bag - 15000000, mentalHealth: p.mentalHealth - 30 }));
    setCreOfficeCount(t => t + 1);
    setHustleClicks(prev => ({ ...prev, cre: (prev.cre || 0) + 1 }));
    setNews(prev => ["🏢 CRE: Office Tower acquisition complete. Massive passive rent added.", ...prev.slice(0, 15)]);
    adv();
  };

  const rCreBuyRetail = async () => {
    if (pl.bag < 5000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
    setPl(p => ({ ...p, bag: p.bag - 5000000, mentalHealth: p.mentalHealth - 30 }));
    setCreRetailCount(t => t + 1);
    setHustleClicks(prev => ({ ...prev, cre: (prev.cre || 0) + 1 }));
    setNews(prev => ["🏢 CRE: Retail Strip acquisition complete. Monthly yield increased.", ...prev.slice(0, 15)]);
    adv();
  };

  const rFranchiseClick = async () => {
    if (pl.bag < 500000 || pl.mentalHealth < 25 || pl.bag < 5000000 || pl.clout < 300 || pl.aura < 200) return;
    setPl(p => ({ ...p, bag: p.bag - 500000, mentalHealth: p.mentalHealth - 25 }));
    setHustleClicks(prev => ({ ...prev, franchise: (prev.franchise || 0) + 1 }));

    // Click Catastrophe: Union Strike (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      if (ass.legalTeam && Math.random() < 0.5) {
        setNews(prev => ["⚖️ LEGAL: Elite defense team blocked the union strike.", ...prev.slice(0, 15)]);
      } else {
        setUnionStrikeActive(true);
        setNews(prev => ["🚨 UNION STRIKE: Franchise workers have walked out. Operations halted.", ...prev.slice(0, 15)]);
      }
      return undefined;
    }

    setFranchiseCount(f => f + 1);
    setNews(prev => ["🍟 FRANCHISE: New territory acquired. Revenue scaling.", ...prev.slice(0, 15)]);
    adv();
  };

  const rResolveUnionStrike = (choice) => {
    if (choice === 'settle') {
      if (pl.bag < 100000) return;
      setPl(p => ({ ...p, bag: p.bag - 100000 }));
      setUnionStrikeActive(false);
      setUnionStrikeIgnored(false);
      setNews(prev => ["✅ FRANCHISE: Strike resolved via $100,000 wage settlement.", ...prev.slice(0, 15)]);
    } else {
      setUnionStrikeIgnored(true);
      setNews(prev => ["⚠️ FRANCHISE: Strike ignored. Operations remain zeroed, Aura will bleed.", ...prev.slice(0, 15)]);
    }
  };

  const rResolveSupplyChain = async () => {
    if (pl.bag < 2000000) return;
    setPl(p => ({ ...p, bag: p.bag - 2000000 }));
    setSupplyChainDisruption(false);
    setNews(prev => ["✅ PE: Supply chain stabilized. Operations resumed.", ...prev.slice(0, 15)]);
  };

  const rPeClick = async () => {
    if (pl.bag < 25000000 || pl.mentalHealth < 40 || pl.bag < 50000000 || pl.clout < 450 || pl.aura < 400) return;
    setPl(p => ({ ...p, bag: p.bag - 25000000, mentalHealth: p.mentalHealth - 40 }));
    setHustleClicks(prev => ({ ...prev, pe: (prev.pe || 0) + 1 }));

    // Click Catastrophe: SEC Pension Subpoena (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      const bagPen = ass.legalTeam ? 5000000 : 10000000;
      const auraPen = ass.legalTeam ? 75 : 150;
      setPl(p => ({ ...p, bag: p.bag - bagPen, aura: Math.max(0, p.aura - auraPen) }));
      setNews(prev => ["🚨 SEC SUBPOENA: Pension fund irregularities detected. -$10,000,000 and -150 Aura.", ...prev.slice(0, 15)]);
      return undefined;
    }

    setPeProgress(p => {
      const next = p + 20;
      if (next >= 100) {
        setPl(prev => ({ ...prev, bag: prev.bag + 25000000 }));
        setGuttedFirms(g => g + 1);
        setNews(prev => ["💰 PE: Buyout complete! Awarded $25,000,000 liquid windfall.", ...prev.slice(0, 15)]);
        return 0;
      }
      return next;
    });
    adv();
  };

  const rArtBuy = async () => {
    const acquisitionCost = Math.floor(10000000 * (1 + artMarketSentiment * 0.5));
    if (pl.bag < acquisitionCost || pl.mentalHealth < 35 || pl.bag < 30000000 || pl.clout < 500 || pl.aura < 450) return;
    setPl(p => ({ ...p, bag: p.bag - acquisitionCost, mentalHealth: p.mentalHealth - 35 }));
    setHustleClicks(prev => ({ ...prev, art: (prev.art || 0) + 1 }));

    // Click Catastrophe: Forgery Scandal (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      const cloutPen = ass.legalTeam ? 100 : 200;
      setPl(p => ({ ...p, clout: Math.max(0, p.clout - cloutPen) }));
      setNews(prev => ["🚨 FORGERY SCANDAL: Masterpiece proven fake. Piece confiscated and -200 Clout.", ...prev.slice(0, 15)]);
      return undefined;
    }

    setArtHoldings(a => a + 1);
    setNews(prev => ["🎨 ART: Collection expanded. Passive Clout increased.", ...prev.slice(0, 15)]);
    adv();
  };

  const rArtAuction = async () => {
    if (artHoldings <= 0) return;
    setArtHoldings(a => a - 1);

    const roll = Math.random() - 0.5;
    let yieldAmt = Math.floor(15000000 * (1 + artMarketSentiment * 2 + roll) * legacyMultiplier);
    yieldAmt = Math.max(500000, yieldAmt);

    setPl(p => ({ ...p, bag: p.bag + yieldAmt }));
    setNews(prev => [`🖼️ ART AUCTION: Piece sold for $${fMny(yieldAmt)}.`, ...prev.slice(0, 15)]);
    triggerImpact('bag', yieldAmt);
    adv();
  };

  const rFormConglom = async () => {
    const hasAssets = saasUsers > 0 || corpClients > 0 || creOfficeCount > 0 || creRetailCount > 0 || franchiseCount > 0 || guttedFirms > 0 || artHoldings > 0 || tch.l || crp.l > 0 || tur.t > 1 || hf.c > 0;
    if (pl.bag < 250000000 || !hasAssets) return;
    setPl(p => ({ ...p, bag: p.bag - 250000000 }));
    setConglomActive(true);
    setNews(prev => ["🏢 CONGLOMERATE: Global Holding Co formed. Passive yields consolidated and boosted. -$250,000,000.", ...prev.slice(0, 15)]);
  };

  const rLobbyRegulators = async () => {
    if (pl.bag < 10000000 || pl.aura < 20) return;
    setPl(p => ({ ...p, bag: p.bag - 10000000, aura: Math.max(0, p.aura - 20) }));
    setAntitrustRisk(prev => Math.max(0, prev - 40));
    setNews(prev => ["⚖️ LOBBYING: Strategic donations made to key regulators. Anti-trust risk decreased.", ...prev.slice(0, 15)]);
  };

  const rSwfInvest = async () => {
    if (pl.bag < 100000000) return;
    setPl(p => ({ ...p, bag: p.bag - 100000000 }));
    setSwfInvestment(prev => prev + 100000000);
    setNews(prev => ["🌍 SWF: $100,000,000 parked in international sovereign assets.", ...prev.slice(0, 15)]);
  };

  const rSwfWithdraw = async () => {
    if (swfFrozen || swfInvestment <= 0) return;
    setPl(p => ({ ...p, bag: p.bag + swfInvestment }));
    setSwfInvestment(0);
    setNews(prev => ["🌍 SWF: International holdings liquidated into Bag.", ...prev.slice(0, 15)]);
  };

  const rVinCh = async (choice) => {
    if (choice === 'burn') {
      setPl(p => ({ ...p, aura: Math.min(p.maxAura, p.aura + 1) }));
      setNews(n => ["🔥 VINTAGE: Burned the bootleg. Street authenticity +1.", ...n.slice(0, 15)]);
    } else if (choice === 'pass') {
      setPl(p => ({ ...p, bag: p.bag + 150, aura: Math.max(0, p.aura - 10) }));
      setNews(n => ["💀 VINTAGE: Passed off a rep. Reputation damaged, but bags secured.", ...n.slice(0, 15)]);
      triggerImpact('bag', 150);
    }
    setVinCh(null);
    adv();
  };

  const rSw = async () => {
    const totalOut = (sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a);
    if (pl.mentalHealth < 15) return;
    updateFatigue('streetwear');
    setPl(p => ({ ...p, bag: p.bag - totalOut, mentalHealth: p.mentalHealth - 15 }));
    setHustleClicks(prev => ({ ...prev, streetwear: prev.streetwear + 1 }));

    if (triggerChaos('streetwear')) {
      if (karmaFlags.usedCheapBlanks) {
        const cloutPen = ass.legalTeam ? 7 : 15;
        setPl(p => ({ ...p, clout: Math.max(0, p.clout - cloutPen) }));
        setNews(n => ["💀 KARMA DETONATION: Influencer rips your stitching apart. Penalty mitigated by legal.", ...n.slice(0, 15)]);
      } else {
        const bagPen = ass.legalTeam ? 200 : 400;
        const cloutPen = ass.legalTeam ? 7 : 15;
        const mhPen = ass.legalTeam ? 12 : 25;
        setPl(p => ({ ...p, bag: p.bag - bagPen, clout: Math.max(0, p.clout - cloutPen), mentalHealth: Math.max(0, p.mentalHealth - mhPen) }));
        setNews(n => ["🚫 THE COPYRIGHT STRIKE: Legal team reduced damages.", ...n.slice(0, 15)]);
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

    setSwFatigue(prev => prev + (sw.u / 1000));

    let auraGain = 0;
    let cloutGain = 0;
    let newsMsg = "";

    if (unitsSold >= sw.u * 0.8) {
      auraGain = 10;
      cloutGain = 5;
      newsMsg = "👟 VIRAL SELLOUT! Cleared all inventory.";
    } else if (unitsSold < sw.u * 0.2) {
      auraGain = -15;
      newsMsg = "👟 Bricked. Heavy boxes sitting in the warehouse.";
    } else {
      newsMsg = `👟 Drop concluded. Moved ${unitsSold.toLocaleString()} units.`;
    }

    setPl(p => ({
      ...p,
      bag: p.bag + revenue,
      aura: Math.min(p.maxAura, Math.max(0, p.aura + auraGain)),
      clout: Math.min(p.maxClout, p.clout + cloutGain)
    }));

    setNews(prev => [newsMsg, ...prev.slice(0, 15)]);
    setHl(h => ({ ...h, sw: h.sw + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rDrp = async () => {
    const costBasis = drp.u * 10 + drp.a;
    if (pl.mentalHealth < 10 || dropshipLock > 0) return;
    updateFatigue('dropship');
    setPl(p => ({ ...p, bag: p.bag - costBasis, mentalHealth: p.mentalHealth - 10 }));
    setHustleClicks(prev => ({ ...prev, dropship: prev.dropship + 1 }));

    if (triggerChaos('dropship')) {
      if (karmaFlags.ignoredRefunds) {
        const bagPen = ass.legalTeam ? 300 : 600;
        setPl(p => ({ ...p, bag: p.bag - bagPen }));
        setNews(n => ["💸 KARMA DETONATION: Gateway freezes assets. Legal mitigated loss.", ...n.slice(0, 15)]);
      } else {
        const mhPen = ass.legalTeam ? 15 : 30;
        setPl(p => ({ ...p, mentalHealth: Math.max(0, p.mentalHealth - mhPen) }));
        setDropshipLock(ass.legalTeam ? 1 : 2);
        setNews(n => ["🚫 THE ALGORITHM LOCKDOWN: Income zeroed. Legal team accelerated resolution.", ...n.slice(0, 15)]);
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 800));

    const modifier = up.drpFac ? 1.5 : 1.1;
    const revenue = Math.floor((drp.u * drp.p) * (Math.random() * modifier) * legacyMultiplier);
    const profit = revenue - costBasis;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 3) }));
    setHl(h => ({ ...h, drop: h.drop + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rCc = async (type) => {
    await new Promise(r => setTimeout(r, 700));
    let profit = 0; let cloutGain = 0; let auraGain = 0;

    if (type === 'sol') {
      profit = Math.floor(Math.random() * 2500 * legacyMultiplier);
      cloutGain = 5;
      setPl(p => ({ ...p, bag: p.bag - 500 + profit, clout: Math.min(p.maxClout, p.clout + cloutGain) }));
    } else if (type === 'feu') {
      profit = -25000; cloutGain = 35; auraGain = -15;
      setPl(p => ({ ...p, bag: p.bag + profit, clout: Math.min(p.maxClout, p.clout + cloutGain), aura: Math.max(0, p.aura + auraGain) }));
    } else {
      profit = Math.floor(Math.random() * 75000 * legacyMultiplier); cloutGain = 20;
      setPl(p => ({ ...p, bag: p.bag + profit, clout: Math.min(p.maxClout, p.clout + cloutGain) }));
    }
    setHl(h => ({ ...h, cc: h.cc + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rPod = async () => {
    let rentalCost = up.podCmp ? 0 : pod.q;
    let baseBooking = pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000;
    const totalOut = rentalCost + baseBooking;

    setPl(p => ({ ...p, bag: p.bag - totalOut }));
    await new Promise(r => setTimeout(r, 1000));

    let revenue = Math.floor(totalOut * (1.2 + Math.random() * 1.8) * legacyMultiplier);
    let profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 15) }));
    setHl(h => ({ ...h, pod: h.pod + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rBox = async () => {
    let venueCost = up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000);
    let totalOut = (up.boxBrd ? 0 : box.b) + venueCost;

    setPl(p => ({ ...p, bag: p.bag - totalOut }));
    await new Promise(r => setTimeout(r, 1200));

    let revenue = 0;
    let cloutGain = 40;
    let heatGain = 0;

    if (up.boxBrd) {
      revenue = Math.floor((12000 + (pl.clout * 250)) * legacyMultiplier);
      cloutGain = 5;
      heatGain = 10;
    } else {
      revenue = Math.floor(totalOut * (1.1 + Math.random() * 2.2) * legacyMultiplier);
    }

    let profit = revenue - totalOut;

    setPl(p => ({
      ...p,
      bag: p.bag + revenue,
      clout: Math.min(p.maxClout, p.clout + cloutGain),
      heat: p.heat + (ass.legalTeam ? Math.floor(heatGain * 0.5) : heatGain)
    }));
    setTally(t => ({ ...t, box: t.box + 1 }));
    setHl(h => ({ ...h, box: h.box + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rTur = async () => {
    const totalOut = tur.m + tur.a + tur.l;
    setPl(p => ({ ...p, bag: p.bag - totalOut }));
    await new Promise(r => setTimeout(r, 1500));

    const revMult = up.trFst ? 2.5 : 1.6;
    const revenue = Math.floor(totalOut * (Math.random() * revMult) * legacyMultiplier);
    const profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 55), aura: Math.min(p.maxAura, p.aura + 15) }));
    setHl(h => ({ ...h, tour: h.tour + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rTch = async (action) => {
    if (action === 'seed') {
      setPl(p => ({ ...p, bag: p.bag + 5000000 }));
      setTch(t => ({ ...t, l: true, vc: true, u: 50000 }));
      setNews(n => ['💻 VENTURE CAP: Contract signed. Seed injection completed ($5.0M). VC holds exit equity.', ...n.slice(0, 15)]);
      return 5000000;
    }
    if (action === 'b2b') {
      setPl(p => ({ ...p, bag: p.bag - tch.m }));
      await new Promise(r => setTimeout(r, 900));
      const netGain = Math.floor((tch.m / 5) * (1 + Math.random() * 2));
      setTch(t => ({ ...t, u: t.u + netGain }));
      adv();
      return 0;
    }
    if (action === 'ipo') {
      let value = Math.floor(tch.u * pl.aura * legacyMultiplier);
      if (tch.vc) value = Math.floor(value * 0.7);
      setPl(p => ({ ...p, bag: p.bag + value }));
      setTch({ l: false, u: 0, srv: 0.1, pw: false, vc: false, m: 2000 });
      setTab('HUB');
      setHl(h => ({ ...h, tch: h.tch + value }));
      triggerImpact('bag', value);
      setNews(n => [`🔔 WALL STREET EXIT: IPO finalized. Listed holdings liquidated into $${value.toLocaleString()}.`, ...n.slice(0, 15)]);
      return value;
    }
    return 0;
  };

  const rCrp = async (action) => {
    if (action === 'dep') {
      setPl(p => ({ ...p, bag: p.bag - crp.i }));
      setCrp(c => ({ ...c, l: c.i * 2 }));
      return undefined;
    }
    if (action === 'shil') {
      setPl(p => ({ ...p, bag: p.bag - crp.m }));
      await new Promise(r => setTimeout(r, 800));
      setCrp(c => ({ ...c, l: Math.floor(c.l * (1.1 + Math.random() * 1.5)) }));
      adv();
      return 0;
    }
    if (action === 'rug') {
      let reward = Math.floor(crp.l * legacyMultiplier);
      setPl(p => ({ ...p, bag: p.bag + reward, aura: Math.max(0, p.aura - 120) }));
      setCrp({ l: 0, t: '', i: 5000, m: 5000 });
      setTally(t => ({ ...t, cryp: t.cryp + 1 }));
      setTab('HUB');
      setHl(h => ({ ...h, cryp: h.cryp + reward }));
      triggerImpact('bag', reward);
      setNews(n => [`💀 LIQUIDITY RUGGED: Contract liquidity drained. Net reward: $${reward.toLocaleString()}. Aura crashed.`, ...n.slice(0, 15)]);
      return reward;
    }
  };

  const rMov = async () => {
    const cst = (mov.g === 1 ? 2000000 : mov.g === 2 ? 15000000 : 100000000) + mov.m;
    setPl(p => ({ ...p, bag: p.bag - cst }));
    await new Promise(r => setTimeout(r, 2000));

    const success = Math.random() * (up.movUni ? 3.0 : 1.8);
    const revenue = Math.floor(cst * success * legacyMultiplier);
    const profit = revenue - cst;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 75) }));
    setHl(h => ({ ...h, mov: h.mov + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rHf = async (isLong) => {
    setPl(p => ({ ...p, bag: p.bag - hf.c }));
    await new Promise(r => setTimeout(r, 1500));

    const accurate = Math.random() > 0.45;
    const variance = (hf.l * 0.04) * Math.random() * legacyMultiplier;
    const finalReturn = accurate ? hf.c * (1 + variance) : hf.c * (1 - variance);
    const netPayout = Math.floor(finalReturn - hf.c);

    setPl(p => ({ ...p, bag: p.bag + Math.floor(finalReturn) }));
    setTally(t => ({ ...t, hf: t.hf + 1 }));
    setHl(h => ({ ...h, hf: h.hf + Math.max(0, netPayout) }));
    triggerImpact('bag', netPayout);
    adv();
    return netPayout;
  };

  const rPrsA = async (type) => {
    if (type === 'gala') {
      setPl(p => ({ ...p, bag: p.bag + 200000000 }));
      triggerImpact('bag', 200000000);
    } else if (type === 'tv') {
      setPl(p => ({ ...p, bag: p.bag - 100000000, clout: Math.max(0, p.clout - 10) }));
      setPrs(prev => ({ ...prev, rst: prev.rst + 3, sun: prev.sun + 2, sub: prev.sub + 4 }));
    } else if (type === 'smear') {
      setPl(p => ({ ...p, aura: Math.max(0, p.aura - 25) }));
      setPrs(prev => ({ ...prev, rst: prev.rst + 2, sun: prev.sun + 3 }));
    } else {
      setPl(p => ({ ...p, bag: p.bag - 2000000 }));
      setPrs(prev => ({ ...prev, rst: prev.rst + 0.8, sun: prev.sun + 1 }));
    }
    adv();
    return undefined;
  };

  const rPrs1TT = async () => { setPl(p => ({ ...p, bag: p.bag - 100000000, clout: Math.max(0, p.clout - 20) })); setPrs(p => ({ ...p, p1tt: true, sh: true })); return undefined; };
  const rPrs1OP = async () => { setPl(p => ({ ...p, bag: p.bag - 150000000, aura: Math.max(0, p.aura - 30) })); setPrs(p => ({ ...p, p1op: true, ot: true })); return undefined; };
  const rPrs1ET = async () => { setPl(p => ({ ...p, bag: p.bag - 50000000, clout: Math.max(0, p.clout - 25) })); setPrs(p => ({ ...p, p1et: true })); return undefined; };
  const dVp = () => { setPrs(p => ({ ...p, vu: true, rst: p.rst + 4 })); };
  const dDef = () => { setPl(p => ({ ...p, bag: p.bag - 75000000, clout: Math.max(0, p.clout - 20) })); setPrs(p => ({ ...p, du: true, sub: p.sub + 5 })); };

  const rRetire = () => {
    setGenerationCount(g => g + 1);

    // Reset core stats based on difficulty
    if (diff === 1) { // TRUST FUND
      setPl({ bag: 25000, aura: 30, clout: 30, mo: 0, tier: 0, mentalHealth: 300, maxMentalHealth: 300, heat: 0, maxClout: 100, maxAura: 100 });
    } else if (diff === 2) { // HUSTLER
      setPl({ bag: 5000, clout: 15, aura: 15, mo: 0, tier: 0, mentalHealth: 150, maxMentalHealth: 150, heat: 0, maxClout: 100, maxAura: 100 });
    } else { // GRINDER
      setPl({ bag: 1000, clout: 5, aura: 5, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 });
    }

    // Reset everything else
    setTab('HUB');
    setSelTier('0');
    setDeath(null);
    setGBusy(false);
    setSwFatigue(0);
    setHustleFatigue({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
    setKarmaFlags({ usedCheapBlanks: false, ignoredRefunds: false, soldBootleg: false, ignoredSmmCrisis: false, usedCheapParts: false, ignoredRunnerWelfare: false });
    setFatalTragedyMessage(null);
    setLastHustle(null);
    setDropshipLock(0);
    setVintageLock(0);
    setSmmPenalty(false);
    setTechSourceCost(150);
    setSmmClients(0);
    setClientCrisis(false);
    setVinCh(null);
    setHustleClicks({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
    setTechItem(null);
    setTechFlipsComplete(0);
    setRunnerCount(0);
    setRunnerBurnout(false);
    setSaasUsers(0);
    setSaasPrice(50);
    setSaasChurn(0.05);
    setSaasPenaltyActive(false);
    setCorpClients(0);
    setApiLockoutMonths(0);
    setCreOfficeCount(0);
    setCreRetailCount(0);
    setFranchiseCount(0);
    setUnionStrikeActive(false);
    setUnionStrikeIgnored(false);
    setPeProgress(0);
    setGuttedFirms(0);
    setSupplyChainDisruption(false);
    setPeCompoundingYield(1.0);
    setArtMarketSentiment(0);
    setArtHoldings(0);
    setConglomActive(false);
    setAntitrustRisk(0);
    setSwfInvestment(0);
    setGeoStability(1.0);
    setSwfFrozen(false);
    setIsBreakdownActive(false);
    setPassiveFrozen(false);
    setUp({ swIp: false, swFlg: false, swPar: false, swGlb: false, drpFac: false, ccAge: false, ccNet: false, podCmp: false, boxLg: false, boxBrd: false, trFst: false, tchGov: false, movStr: false, movUni: false });
    setSkl({ neg: 0, tax: 0, inf: 0 });
    setAss({ watch: false, pent: false, mtgPent: false, mans: false, mtgMans: false, jet: false, mtgJet: false, yct: false, mtgYct: false, spt: false, spc: false, swf: false, hePent: false, cmYct: false, legalTeam: false });
    setPeaks({ peakB: 25000, peakA: 100, peakC: 20 });
    setHl({ sw: 0, drop: 0, cc: 0, pod: 0, box: 0, tch: 0, cryp: 0, tour: 0, mov: 0, hf: 0 });
    setTally({ cryp: 0, box: 0, hf: 0, pres: 0 });
    setPrs({ r: false, m: 0, cd: 0, rem: false, rst: 44, sun: 42, sub: 45, vp: 1, fr: false, vu: false, du: false, sh: false, ot: false, p1tt: false, p1op: false, p1et: false, ev: { d1: false, d2: false, o: false }, chest: 0, polls: 0 });

    setPh('PROLOGUE');
    setProSt(0);
    setNews(['Your legacy continues... A new generation begins.', 'Market Cycle initialized: NORMAL economy.']);
  };

  const isTierUnlocked = useMemo(() => {
    return (tierIdx) => {
      return pl.tier >= tierIdx;
    };
  }, [pl.tier]);

  return (
    <GameContext.Provider value={{
      ph, setPh, proSt, setProSt, alias, setAlias, diff, setDiff, death, setDeath, cancelIntro, gBusy, rain, swFatigue, setSwFatigue, hustleFatigue, setHustleFatigue, karmaFlags, setKarmaFlags, fatalTragedyMessage, setFatalTragedyMessage, smmClients, setSmmClients, clientCrisis, setClientCrisis, vinCh, setVinCh, tab, setTab, selTier, setSelTier, pl, setPl, displayBag, age, mkt, news, imp, mod, setMod, up, setUp, skl, setSkl, ass, setAss, sw, setSw, drp, setDrp, cc, setCc, pod, setPod, box, setBox, tur, setTur, tch, setTch, crp, setCrp, mov, setMov, hf, setHf, ai, setAi, prs, setPrs, peaks, hl, tally, adv, exStart, dUp, bAss, rVintage, rVinCh, rSw, rDrp, rSmmPitch, rSmmFix, rRest, rCc, rPod, rBox, rTur, rTch, rCrp, rMov, rHf, rPrsA, rPrs1TT, rPrs1OP, rPrs1ET, dVp, dDef, isTierUnlocked,
      hustleClicks, setHustleClicks, techItem, setTechItem, techFlipsComplete, setTechFlipsComplete, runnerCount, setRunnerCount, runnerBurnout, setRunnerBurnout,
      rTechSource, rTechFixA, rTechFixB, rRunnerRecruit, rRunnerFix, techSourceCost,
      isBreakdownActive, shakeActive, rDischarge,
      saasUsers, saasPrice, saasChurn, saasPenaltyActive, corpClients, apiLockoutMonths, creOfficeCount, creRetailCount, franchiseCount, unionStrikeActive, unionStrikeIgnored,
      rSaasClick, rAiAgencyClick, rCreBuyOffice, rCreBuyRetail, rFranchiseClick, rResolveUnionStrike,
      supplyChainDisruption, peCompoundingYield, rResolveSupplyChain, peProgress, guttedFirms,
      artMarketSentiment, artHoldings,
      conglomActive, antitrustRisk, swfInvestment, geoStability, swfFrozen,
      passiveFrozen, setPassiveFrozen,
      rFormConglom, rLobbyRegulators, rSwfInvest, rSwfWithdraw,
      generationCount, legacyMultiplier, rRetire
    }}>
      {children}
    </GameContext.Provider>
  );
};