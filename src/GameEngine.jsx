import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const TIERS = [
  { id: 0, label: 'Mud',       req: { bag: 0,           clout: 0,    aura: 0   }, hustles: ['SW', 'DROP', 'TECH_FLIP', 'VINTAGE', 'SMM', 'GIG'] },
  { id: 1, label: 'Street',    req: { bag: 100000,      clout: 50,   aura: 0   }, hustles: ['CC', 'POD', 'BOX', 'AUDIO'] },
  { id: 2, label: 'Corporate', req: { bag: 1000000,     clout: 150,  aura: 50  }, hustles: ['TECH', 'AI_AGENCY', 'CRE_FLIP', 'FRANCHISE'] },
  { id: 3, label: 'Elite',     req: { bag: 25000000,    clout: 500,  aura: 0   }, hustles: ['CRYP', 'TOUR', 'PE_ROLLUP', 'ART_SPEC'] },
  { id: 4, label: 'Mogul',     req: { bag: 250000000,   clout: 1500, aura: 500 }, hustles: ['HF', 'COMMODITIES', 'PMC', 'SOVEREIGN'] },
  { id: 5, label: 'President', req: { bag: 1000000000,  clout: 5000, aura: 2500 }, hustles: ['PAC', 'BLITZ', 'SMEAR', 'ELECTION'] },
];

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

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
  const [smmClients, setSmmClients] = useState(0);
  const [clientCrisis, setClientCrisis] = useState(false);
  const [vinCh, setVinCh] = useState(null);
  const [hustleClicks, setHustleClicks] = useState({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
  const [techItem, setTechItem] = useState(null);
  const [techFlipsComplete, setTechFlipsComplete] = useState(0);
  const [runnerCount, setRunnerCount] = useState(0);
  const [runnerBurnout, setRunnerBurnout] = useState(false);
  const [breakdown, setBreakdown] = useState(false);

  // Financial Systems & Vital Signs
  const [pl, setPl] = useState({ bag: 25000, aura: 100, clout: 20, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0 });
  const displayBag = pl.bag;
  const age = 18 + Math.floor(pl.mo / 12);
  const cap = 500;

  // Macro Environment
  const [mkt, setMkt] = useState(0);
  const [news, setNews] = useState(['Booting life simulation... System optimal.', 'Market Cycle initialized: NORMAL economy.']);
  const [imp, setImp] = useState([]);
  const [mod, setMod] = useState({ s: false, t: '', m: '', o: [], ui: '' });

  // Tech Tree Infrastructure
  const [up, setUp] = useState({ swIp: false, swFlg: false, swPar: false, swGlb: false, drpFac: false, ccAge: false, ccNet: false, podCmp: false, boxLg: false, boxBrd: false, trFst: false, tchGov: false, movStr: false, movUni: false });
  const [skl, setSkl] = useState({ neg: 0, tax: 0, inf: 0 });
  const [ass, setAss] = useState({ watch: false, pent: false, mtgPent: false, mans: false, mtgMans: false, jet: false, mtgJet: false, yct: false, mtgYct: false, spt: false, spc: false, swf: false });

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

    if ((pl.bag || 0) <= 0 && !hasPassive) {
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

    if (pl.mentalHealth <= 0 && !breakdown) {
      setBreakdown(true);
      setGBusy(true);
    }
  }, [pl, ph, peaks, breakdown]);

  const rDischarge = () => {
    setPl(prev => ({
      ...prev,
      bag: prev.bag - 300,
      mo: prev.mo + 1,
      mentalHealth: Math.floor(prev.maxMentalHealth * 0.5)
    }));
    setBreakdown(false);
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

  // Global Pulse Advance Logic
  const adv = (months = 1) => {
    setSwFatigue(prev => Math.max(0, prev - (0.25 * months)));

    if (clientCrisis) {
      setSmmClients(c => Math.max(0, c - 1));
      setNews(prev => ["📉 SMM: Client churned due to unresolved crisis.", ...prev.slice(0, 15)]);
      setClientCrisis(false);
    }

    if (runnerBurnout) {
      setRunnerCount(c => Math.max(0, c - 1));
      setNews(prev => ["📉 GIG: Runner mutinied and stole inventory due to burnout.", ...prev.slice(0, 15)]);
      setRunnerBurnout(false);
    }

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
      const reduction = 1 - (skl.tax * 0.04);
      expenseBurn = Math.floor(expenseBurn * reduction);

      let passiveSrv = 0;
      if (tch.l && tch.pw) {
        passiveSrv = Math.floor(500 + (tch.u * tch.srv));
      }

      const smmRev = smmClients * 300;
    const smmAura = smmClients * 1;

      const runnerRev = runnerCount * 150;
    const runnerAura = runnerCount * 1;

      return {
        ...prev,
        mo: prev.mo + months,
        bag: prev.bag - expenseBurn + passiveSrv + yieldIncome + smmRev + runnerRev,
        aura: Math.min(cap, prev.aura + smmAura + runnerAura),
        mentalHealth: Math.min(prev.maxMentalHealth, prev.mentalHealth + 15)
      };
    });

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
      setPl(p => ({ ...p, bag: 25000, clout: 30, aura: 30, maxMentalHealth: 300, mentalHealth: 300, heat: 0 }));
    } else if (diff === 2) { // HUSTLER (Normal)
      setPl(p => ({ ...p, bag: 5000, clout: 15, aura: 15, maxMentalHealth: 150, mentalHealth: 150, heat: 0 }));
    } else { // GRINDER (Difficult)
      setPl(p => ({ ...p, bag: 1000, clout: 5, aura: 5, maxMentalHealth: 100, mentalHealth: 100, heat: 0 }));
    }

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
        clout: Math.min(cap, p.clout + cloutBump),
        aura: Math.min(cap, p.aura + auraBump)
      }));
      setAss(a => ({ ...a, [key]: true }));
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
    setPl(p => ({ ...p, bag: p.bag - 50, mentalHealth: p.mentalHealth - 10 }));
    setHustleClicks(prev => ({ ...prev, vintage: prev.vintage + 1 }));
    await new Promise(r => setTimeout(r, 800));

    const roll = Math.random();
    let profit = -50;
    if (roll < 0.01) { // GRAIL!
      setPl(p => ({ ...p, bag: p.bag + 600, clout: Math.min(cap, p.clout + 15), aura: Math.min(cap, p.aura + 1) }));
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
      setPl(p => ({ ...p, bag: p.bag + 120, clout: Math.min(cap, p.clout + 3) }));
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
    if (pl.clout < 15 || pl.mentalHealth < 20) return;
    setPl(p => ({ ...p, mentalHealth: p.mentalHealth - 20 }));
    setHustleClicks(prev => ({ ...prev, smm: prev.smm + 1 }));
    await new Promise(r => setTimeout(r, 800));

    if (Math.random() < 0.5) {
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
    adv();
    setNews(prev => ["😴 Resting... MentalHealth recovered.", ...prev.slice(0, 15)]);
  };

  const rTechSource = async () => {
    if (pl.bag < 150) return;
    setPl(p => ({ ...p, bag: p.bag - 150 }));
    setTechItem({ id: Math.random(), name: "Bricked Hardware" });
    setHustleClicks(prev => ({ ...prev, tech: prev.tech + 1 }));
    setNews(n => ["💻 TECH: Sourced bricked hardware for $150. Ready for repair.", ...n.slice(0, 15)]);
  };

  const rTechFixA = async () => {
    if (pl.bag < 30 || pl.mentalHealth < 10 || !techItem) return;
    setPl(p => ({ ...p, bag: p.bag - 30, mentalHealth: p.mentalHealth - 10 }));
    await new Promise(r => setTimeout(r, 800));

    if (Math.random() < 0.5) {
      setPl(p => ({ ...p, bag: p.bag + 750 }));
      setTechItem(null);
      triggerImpact('bag', 720);
      setNews(n => ["✅ TECH: Repair successful with cheap parts! Sold for $750.", ...n.slice(0, 15)]);
    } else {
      setPl(p => ({ ...p, aura: Math.max(0, p.aura - 5) }));
      setTechItem(null);
      setNews(n => ["💀 TECH: Hardware bricked during repair. Aura decreased.", ...n.slice(0, 15)]);
    }
    adv();
  };

  const rTechFixB = async () => {
    if (pl.bag < 100 || pl.mentalHealth < 15 || !techItem) return;
    setPl(p => ({ ...p, bag: p.bag - 100, mentalHealth: p.mentalHealth - 15, clout: Math.min(cap, p.clout + 2), aura: Math.min(cap, p.aura + 1) }));
    setTechFlipsComplete(prev => prev + 1);
    await new Promise(r => setTimeout(r, 1000));
    setPl(p => ({ ...p, bag: p.bag + 750 }));
    setTechItem(null);
    triggerImpact('bag', 650);
    setNews(n => ["✅ TECH: Premium repair successful! Sold for $750. Hardware Mastery increased.", ...n.slice(0, 15)]);
    adv();
    return 650;
  };

  const rRunnerRecruit = async () => {
    if (pl.bag < 300 || pl.mentalHealth < 25 || pl.clout < 20) return;
    setPl(p => ({ ...p, bag: p.bag - 300, mentalHealth: p.mentalHealth - 25 }));
    setRunnerCount(prev => prev + 1);
    setHustleClicks(prev => ({ ...prev, runners: prev.runners + 1 }));
    setNews(n => ["🏃 GIG: New fleet courier recruited.", ...n.slice(0, 15)]);
    adv();
  };

  const rRunnerFix = async () => {
    if (pl.bag < 200) return;
    setPl(p => ({ ...p, bag: p.bag - 200 }));
    setRunnerBurnout(false);
    setNews(n => ["✅ GIG: Bonus paid. Fleet burnout resolved.", ...n.slice(0, 15)]);
  };

  const rVinCh = async (choice) => {
    if (choice === 'burn') {
      setPl(p => ({ ...p, aura: Math.min(cap, p.aura + 1) }));
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

    setPl(p => ({ ...p, bag: p.bag - totalOut, mentalHealth: p.mentalHealth - 15 }));
    setHustleClicks(prev => ({ ...prev, streetwear: prev.streetwear + 1 }));
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

    const revenue = unitsSold * sw.p;
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
      aura: Math.min(cap, Math.max(0, p.aura + auraGain)),
      clout: Math.min(cap, p.clout + cloutGain)
    }));

    setNews(prev => [newsMsg, ...prev.slice(0, 15)]);
    setHl(h => ({ ...h, sw: h.sw + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rDrp = async () => {
    const costBasis = drp.u * 10 + drp.a;
    if (pl.mentalHealth < 10) return;
    setPl(p => ({ ...p, bag: p.bag - costBasis, mentalHealth: p.mentalHealth - 10 }));
    setHustleClicks(prev => ({ ...prev, dropship: prev.dropship + 1 }));
    await new Promise(r => setTimeout(r, 800));

    const modifier = up.drpFac ? 1.5 : 1.1;
    const revenue = Math.floor((drp.u * drp.p) * (Math.random() * modifier));
    const profit = revenue - costBasis;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(cap, p.clout + 3) }));
    setHl(h => ({ ...h, drop: h.drop + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rCc = async (type) => {
    await new Promise(r => setTimeout(r, 700));
    let profit = 0; let cloutGain = 0; let auraGain = 0;

    if (type === 'sol') {
      profit = Math.floor(Math.random() * 2500);
      cloutGain = 5;
      setPl(p => ({ ...p, bag: p.bag - 500 + profit, clout: Math.min(cap, p.clout + cloutGain) }));
    } else if (type === 'feu') {
      profit = -25000; cloutGain = 35; auraGain = -15;
      setPl(p => ({ ...p, bag: p.bag + profit, clout: Math.min(cap, p.clout + cloutGain), aura: Math.max(0, p.aura + auraGain) }));
    } else {
      profit = Math.floor(Math.random() * 75000); cloutGain = 20;
      setPl(p => ({ ...p, bag: p.bag + profit, clout: Math.min(cap, p.clout + cloutGain) }));
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

    let revenue = Math.floor(totalOut * (1.2 + Math.random() * 1.8));
    let profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(cap, p.clout + 15) }));
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
      revenue = 12000 + (pl.clout * 250);
      cloutGain = 5;
      heatGain = 10;
    } else {
      revenue = Math.floor(totalOut * (1.1 + Math.random() * 2.2));
    }

    let profit = revenue - totalOut;

    setPl(p => ({
      ...p,
      bag: p.bag + revenue,
      clout: Math.min(cap, p.clout + cloutGain),
      heat: p.heat + heatGain
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
    const revenue = Math.floor(totalOut * (Math.random() * revMult));
    const profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(cap, p.clout + 55), aura: Math.min(cap, p.aura + 15) }));
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
      let value = tch.u * pl.aura;
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
      let reward = crp.l;
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
    const revenue = Math.floor(cst * success);
    const profit = revenue - cst;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(cap, p.clout + 75) }));
    setHl(h => ({ ...h, mov: h.mov + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rHf = async (isLong) => {
    setPl(p => ({ ...p, bag: p.bag - hf.c }));
    await new Promise(r => setTimeout(r, 1500));

    const accurate = Math.random() > 0.45;
    const variance = (hf.l * 0.04) * Math.random();
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

  const isTierUnlocked = useMemo(() => {
    return (tierIdx) => {
      return pl.tier >= tierIdx;
    };
  }, [pl.tier]);

  return (
    <GameContext.Provider value={{
      ph, setPh, proSt, setProSt, alias, setAlias, diff, setDiff, death, cancelIntro, gBusy, rain, swFatigue, setSwFatigue, smmClients, setSmmClients, clientCrisis, setClientCrisis, vinCh, setVinCh, tab, setTab, selTier, setSelTier, pl, setPl, displayBag, age, cap, mkt, news, imp, mod, setMod, up, setUp, skl, setSkl, ass, setAss, sw, setSw, drp, setDrp, cc, setCc, pod, setPod, box, setBox, tur, setTur, tch, setTch, crp, setCrp, mov, setMov, hf, setHf, ai, setAi, prs, setPrs, peaks, hl, tally, adv, exStart, dUp, bAss, rVintage, rVinCh, rSw, rDrp, rSmmPitch, rSmmFix, rRest, rCc, rPod, rBox, rTur, rTch, rCrp, rMov, rHf, rPrsA, rPrs1TT, rPrs1OP, rPrs1ET, dVp, dDef, isTierUnlocked,
      hustleClicks, setHustleClicks, techItem, setTechItem, techFlipsComplete, setTechFlipsComplete, runnerCount, setRunnerCount, runnerBurnout, setRunnerBurnout,
      rTechSource, rTechFixA, rTechFixB, rRunnerRecruit, rRunnerFix
    }}>
      {children}
    </GameContext.Provider>
  );
};