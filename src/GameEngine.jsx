import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { TIER_UNLOCKS } from './config.js';

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // Navigation & Core Frame
  const [ph, setPh] = useState('PROLOGUE');
  const [proSt, setProSt] = useState(0);
  const [alias, setAlias] = useState('');
  const [diff, setDiff] = useState(2);
  const [tab, setTab] = useState('HUB');
  const [death, setDeath] = useState(null);
  const [cancelIntro, setCancelIntro] = useState(null);
  const [gBusy, setGBusy] = useState(false);
  const [rain, setRain] = useState(false);

  // Financial Systems & Vital Signs
  const [pl, setPl] = useState({ bag: 25000, aura: 100, clout: 20, mo: 0 });
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
  const [ass, setAss] = useState({ pent: false, mtgPent: false, mans: false, mtgMans: false, jet: false, mtgJet: false, yct: false, mtgYct: false, spt: false, spc: false, swf: false });

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
  const [prs, setPrs] = useState({ r: false, m: 0, cd: 0, rem: false, rst: 44, sun: 42, sub: 45, vp: 1, fr: false, vu: false, du: false, sh: false, ot: false, p1tt: false, p1op: false, p1et: false, ev: { d1: false, d2: false, o: false } });

  // Legacy Registry
  const [peaks, setPeaks] = useState({ peakB: 25000, peakA: 100, peakC: 20 });
  const [hl, setHl] = useState({ sw: 0, drop: 0, cc: 0, pod: 0, box: 0, tch: 0, cryp: 0, tour: 0, mov: 0, hf: 0 });
  const [tally, setTally] = useState({ cryp: 0, box: 0, hf: 0, pres: 0 });

  // Keep Track of Records & Auto Failures
  useEffect(() => {
    if (ph !== 'PLAYING') return;
    if (pl.bag > peaks.peakB || pl.aura > peaks.peakA || pl.clout > peaks.peakC) {
      setPeaks(prev => ({
        peakB: Math.max(prev.peakB, pl.bag),
        peakA: Math.max(prev.peakA, pl.aura),
        peakC: Math.max(prev.peakC, pl.clout)
      }));
    }
    if (pl.bag <= 0) {
      setDeath({ r: "BANKRUPTCY PROCEEDINGS INDICTED", i: "Your liquid assets reached absolute zero. The banks claimed your enterprise assets.", rank: "BROKE HUSTLER" });
    }
    if (pl.aura <= 0) {
      setCancelIntro({ r: "PERMANENT DE-PLATFORMING SCANDAL", i: "Public sentiment reached total rejection. Sponsors canceled you, your platforms were erased." });
    }
  }, [pl, ph]);

  // Global Pulse Advance Logic
  const adv = (months = 1) => {
    setPl(prev => {
      let expenseBurn = 500; 
      if (mkt === 2) expenseBurn *= 2; 
      if (ass.mtgPent) expenseBurn += 60000;
      if (ass.mtgMans) expenseBurn += 250000;
      if (ass.mtgJet) expenseBurn += 1500000;
      if (ass.mtgYct) expenseBurn += 3000000;

      // Deducting level perk buffs
      const reduction = 1 - (skl.tax * 0.04);
      expenseBurn = Math.floor(expenseBurn * reduction);

      let passiveSrv = 0;
      if (tch.l && tch.pw) {
        passiveSrv = Math.floor(500 + (tch.u * tch.srv));
      }

      return {
        ...prev,
        mo: prev.mo + months,
        bag: prev.bag - expenseBurn + passiveSrv
      };
    });

    // Market Cycle Shift Calculation
    if (Math.random() < 0.15) {
      const nextMarket = Math.floor(Math.random() * 4);
      setMkt(nextMarket);
      const mktNames = ["NORMAL", "BULL MARKET", "RECESSION", "CRACKDOWN"];
      setNews(prev => [`🚨 MARKET WATCH: Shift detected. Economy is now in ${mktNames[nextMarket]} mode.`, ...prev.slice(0, 15)]);
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

  const exStart = () => { if (alias.length >= 3) setPh('PLAYING'); };

  const dUp = (key, cost, flashMsg) => {
    if (pl.bag >= cost) {
      setPl(p => ({ ...p, bag: p.bag - cost }));
      setUp(u => ({ ...u, [key]: true }));
      setNews(n => [flashMsg, ...n.slice(0, 15)]);
    }
  };

  const bAss = (key, cost, label) => {
    if (pl.bag >= cost) {
      setPl(p => ({ ...p, bag: p.bag - cost, clout: Math.min(cap, p.clout + 45) }));
      setAss(a => ({ ...a, [key]: true }));
      setNews(n => [`💎 FLEET UPGRADE: Acquired ownership rights to ${label}.`, ...n.slice(0, 15)]);
    }
  };

  const triggerImpact = (kind, amount) => {
    const id = Math.random();
    setImp(prev => [...prev, { id, kind, a: amount, w: amount >= 0 }]);
    setTimeout(() => setImp(curr => curr.filter(i => i.id !== id)), 1900);
  };

  const rSw = async () => {
    const unitCost = sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90;
    const prodExpense = sw.u * unitCost;
    const totalOut = prodExpense + (up.swFlg ? 0 : sw.a);

    setPl(p => ({ ...p, bag: p.bag - totalOut }));
    await new Promise(r => setTimeout(r, 1000));

    const roll = Math.random() * (mkt === 1 ? 2.2 : 1.4);
    const revenue = Math.floor(sw.u * sw.p * roll);
    const profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, aura: Math.min(cap, p.aura + 8), clout: Math.min(cap, p.clout + 4) }));
    setHl(h => ({ ...h, sw: h.sw + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rDrp = async () => {
    const costBasis = drp.u * 10 + drp.a;
    setPl(p => ({ ...p, bag: p.bag - costBasis }));
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

    let revenue = Math.floor(totalOut * (1.1 + Math.random() * 2.2));
    let profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(cap, p.clout + 40) }));
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
    return (section) => {
      const req = TIER_UNLOCKS[section];
      if (!req) return true;
      return peaks.peakB >= req.peakBag && peaks.peakC >= req.peakClout;
    };
  }, [peaks]);

  return (
    <GameContext.Provider value={{
      ph, setPh, proSt, setProSt, alias, setAlias, diff, setDiff, death, cancelIntro, gBusy, rain, tab, setTab, pl, setPl, displayBag, age, cap, mkt, news, imp, mod, setMod, up, setUp, skl, setSkl, ass, setAss, sw, setSw, drp, setDrp, cc, setCc, pod, setPod, box, setBox, tur, setTur, tch, setTch, crp, setCrp, mov, setMov, hf, setHf, ai, setAi, prs, setPrs, peaks, hl, tally, adv, exStart, dUp, bAss, rSw, rDrp, rCc, rPod, rBox, rTur, rTch, rCrp, rMov, rHf, rPrsA, rPrs1TT, rPrs1OP, rPrs1ET, dVp, dDef, isTierUnlocked
    }}>
      {children}
    </GameContext.Provider>
  );
};