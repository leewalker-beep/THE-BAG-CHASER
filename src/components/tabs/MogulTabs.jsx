import React, { useState } from "react";
import { useGame } from "../../GameEngine.jsx";
import { fMny, HF_RUMORS } from "../../config.js";
import { LabShell, FlashBtn, UpgBtn, Toggles, Stepper, LockedTierScreen } from "../ui/Shared.jsx";
import PMCContractor from "./PMCContractor.jsx";

export const MovTab = () => {
  const { pl, up, mov, setMov, dUp, rMov, setTab } = useGame();
  const cst = React.useMemo(() => {
    return (mov.g === 1 ? 2000000 : mov.g === 2 ? 15000000 : 100000000) +
           (mov.s === 3 ? 10000000 : mov.s === 2 ? 5000000 : 1000000) +
           (mov.w === 2 ? 2000000 : mov.w === 3 ? 10000000 : 0) +
           (mov.d === 1 ? 1000000 : mov.d === 2 ? 5000000 : 20000000) +
           mov.m;
  }, [mov.g, mov.s, mov.w, mov.d, mov.m]);

  return (
    <LabShell t="HOLLYWOOD STUDIO" c="yellow" onHub={() => setTab('HUB')} tier={4}>
      <UpgBtn onClk={() => dUp('movStr', 500000000, 'Streaming Platform Owned. 📺')} cost={500000000} title="STREAMING PLATFORM" unl={up.movStr} pB={pl.bag} />
      <UpgBtn onClk={() => dUp('movUni', 2000000000, 'Cinematic Universe Acquired. 🌌')} cost={2000000000} title="CINEMATIC UNIVERSE" unl={up.movUni} reqC={300} pB={pl.bag} pC={pl.clout} />
      <Toggles opts={['Horror ($2M)', 'Comedy ($15M)', 'Super ($100M)']} active={mov.g} setVal={v => setMov(m => ({ ...m, g: v }))} color="yellow-600" />
      <div className="flex gap-2">
        <button onClick={() => setMov(m => ({ ...m, w: 1 }))} className={`flex-1 p-3 text-[11px] font-bold rounded active:scale-95 transition-all duration-100 ${mov.w === 1 ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>ChatGPT ($0)</button>
        <button onClick={() => setMov(m => ({ ...m, w: 2 }))} className={`flex-1 p-3 text-[11px] font-bold rounded active:scale-95 transition-all duration-100 ${mov.w === 2 ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Nepo ($2M)</button>
        <button onClick={() => setMov(m => ({ ...m, w: 3 }))} className={`flex-1 p-3 text-[11px] font-bold rounded active:scale-95 transition-all duration-100 ${mov.w === 3 ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Oscar ($10M)</button>
      </div>
      <Toggles opts={['MusicVid ($1M)', 'Indie ($5M)', 'Vision ($20M)']} active={mov.d} setVal={v => setMov(m => ({ ...m, d: v }))} color="yellow-600" />
      <Toggles opts={['TikToker ($1M)', 'Cancel ($5M)', 'A-List ($10M)']} active={mov.s} setVal={v => setMov(m => ({ ...m, s: v }))} color="yellow-600" />
      <Stepper val={mov.m} setVal={v => setMov(m => ({ ...m, m: v }))} min={0} max={100000000} step={5000000} label="Marketing" />
      <FlashBtn onClick={rMov} dis={pl.bag < cst} label={`SHOOT MOVIE - ${fMny(cst)}`} />
    </LabShell>
  );
};

export const HfTab = () => {
  const { pl, setPl, hf, setHf, rHf, setTab } = useGame();

  const handleIntelBuy = () => {
    if (pl.bag >= 5000000) {
      setPl(p => ({ ...p, bag: p.bag - 5000000 }));
      alert(`INTEL: ${HF_RUMORS[hf.r].tick} going ${HF_RUMORS[hf.r].dir === 1 ? 'UP' : 'DOWN'}`);
    }
  };

  return (
    <LabShell t="HEDGE FUND" c="yellow" fontCls="font-hack" onHub={() => setTab('HUB')} tier={4}>
      <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-xl font-hack text-sm text-blue-300 mb-2">TERMINAL: {HF_RUMORS[hf.r].tick} is volatile.</div>
      <div className="flex gap-2">
        <input type="text" value={hf.t} placeholder="TICKER" onChange={e => setHf(h => ({ ...h, t: e.target.value }))} className="p-4 w-2/3 bg-black border border-slate-700 rounded font-hack text-yellow-400 font-bold uppercase text-center" />
        <button onClick={handleIntelBuy} className="w-1/3 bg-slate-800 text-xs font-bold rounded hover:bg-slate-700 text-white active:scale-95 transition-all duration-100">INTEL ($5M)</button>
      </div>
      <Stepper val={hf.c} setVal={v => setHf(h => ({ ...h, c: v }))} min={100000} max={100000000} step={5000000} label="Capital" />
      <Stepper val={hf.l} setVal={v => setHf(h => ({ ...h, l: v }))} min={1} max={50} step={1} label="Leverage" isCurr={false} />
      <div className="flex gap-2">
        <div className="w-1/2"><FlashBtn onClick={() => rHf(true)} dis={pl.bag < hf.c || !hf.t} label={`LONG (${fMny(hf.c)})`} /></div>
        <div className="w-1/2"><FlashBtn onClick={() => rHf(false)} dis={pl.bag < hf.c || !hf.t} label={`SHORT (${fMny(hf.c)})`} /></div>
      </div>
    </LabShell>
  );
};

export const AiTab = () => {
  const { pl, ai, setAi, adv, setTab, setPl } = useGame();
  return (
    <LabShell t="AGI SUPER-LAB" c="indigo" fontCls="font-tech" onHub={() => setTab('HUB')} tier={4}>
      {!ai.ig ? (
        <FlashBtn onClick={async () => { if (pl.bag >= 50000000) { setPl(p => ({ ...p, bag: p.bag - 50000000 })); setAi(a => ({ ...a, ig: true, p: 1 })); adv(); return -50000000; } return undefined; }} dis={pl.bag < 50000000} label="IGNITE - $50M" color="indigo-600" txt="white" />
      ) : <>
        <div className="flex flex-col gap-1"><div className="flex justify-between text-xs font-bold text-red-500 uppercase tracking-widest"><span>Rival</span><span>{Math.floor(ai.r)}%</span></div><div className="bg-black/50 p-1 rounded-full border border-red-900/50"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(100, ai.r)}%` }}></div></div></div>
        <div className="flex flex-col gap-1"><div className="flex justify-between text-xs font-bold text-indigo-400 uppercase tracking-widest"><span>Your AI</span><span>{Math.floor(ai.p)}%</span></div><div className="bg-black/50 p-2 rounded-full border border-slate-700"><div className="bg-indigo-500 h-4 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: `${Math.min(100, ai.p)}%` }}></div></div></div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-black/30 p-3 rounded-lg border border-slate-800"><div className="text-[10px] text-slate-300 drop-shadow-sm font-bold mb-2 text-center uppercase tracking-widest">Data</div><Toggles opts={['Clean ($50M)', 'Scrape']} active={ai.d} setVal={v => setAi(a => ({ ...a, d: v }))} color="indigo-600" /></div>
          <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold mb-2 text-center uppercase tracking-widest">Espionage</div>
            <button onClick={() => { if (pl.bag >= 10000000) { setPl(p => ({ ...p, bag: p.bag - 10000000 })); setAi(a => ({ ...a, r: Math.max(0, a.r - 5) })); } }} className="w-full text-[10px] font-bold p-2 bg-slate-800 text-white rounded mb-2 hover:bg-slate-700 active:scale-95 transition-all duration-100">POACH ($10M)</button>
            <button onClick={() => { if (pl.bag >= 5000000) { setPl(p => ({ ...p, bag: p.bag - 5000000 })); setAi(a => ({ ...a, r: Math.max(0, a.r - 2) })); } }} className="w-full text-[10px] font-bold p-2 bg-slate-800 text-white rounded hover:bg-slate-700 active:scale-95 transition-all duration-100">SMEAR ($5M)</button>
          </div>
        </div>
        <Stepper val={ai.c} setVal={v => setAi(a => ({ ...a, c: v }))} min={1} max={10} step={1} label="Compute" isCurr={false} />
        <Stepper val={ai.s} setVal={v => setAi(a => ({ ...a, s: v }))} min={1} max={10} step={1} label="Safety" isCurr={false} />
        <AiTrainBtn />
      </>}
    </LabShell>
  );
};

const AiTrainBtn = () => {
  const { pl, ai, setAi, adv, setPl } = useGame();
  const label = ai.p >= 100 ? 'SELL TO DOD' : ai.c > ai.s + 3 ? '⚠️ TRAIN 1 MO (ROGUE RISK)' : 'TRAIN 1 MO';
  return (
    <FlashBtn onClick={async () => {
      if (ai.p >= 100 && ai.p > ai.r) {
        await new Promise(r => setTimeout(r, 2000));
        setPl(p => ({ ...p, bag: p.bag + 10000000000 }));
        setAi({ ig: false, p: 0, r: 0, d: 1, c: 1, s: 1, dj: 0 });
        return 10000000000;
      }
      if (ai.c > ai.s + 3 && Math.random() < 0.25) {
        setPl(p => ({ ...p, bag: Math.floor(p.bag * 0.5) }));
        setAi(a => ({ ...a, p: 0 }));
        return undefined;
      }
      adv(); return undefined;
    }} label={label} />
  );
};

export const BillTab = () => {
  const { pl, ass, setAss, setPl, bAss, mkt, setTab } = useGame();
  const sellPrice = (base) => Math.floor(base * (mkt === 1 ? 1.5 + Math.random() * 0.5 : mkt === 2 ? 0.5 + Math.random() * 0.2 : 1.1 + Math.random() * 0.1));
  const mktTag = mkt === 1 ? '🟢 BULL' : mkt === 2 ? '🔴 RECESSION' : '⚪ NORMAL';
  return (
    <LabShell t="LIFESTYLE & LEGACY" c="green" onHub={() => setTab('HUB')} tier={4}>
      <div className="text-[10px] font-bold text-slate-300 drop-shadow-sm uppercase tracking-widest text-center">Assets</div>
      {ass.pent
        ? <div className="flex items-center gap-2"><div className="flex-1 p-3 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-xs tracking-widest rounded-xl">✓ PENTHOUSE {ass.mtgPent ? '(MORTGAGED +60k/mo)' : '(CASH +10k/mo)'}</div><button onClick={() => { const p = sellPrice(5000000); setPl(s => ({ ...s, bag: s.bag + p })); setAss(a => ({ ...a, pent: false, mtgPent: false })); }} className="shrink-0 px-3 py-3 bg-red-900/60 border border-red-700 text-red-400 font-black text-[10px] tracking-widest rounded-xl hover:bg-red-800 active:scale-95 transition-all duration-100">SELL</button></div>
        : <button onClick={() => { if (pl.bag >= 1000000) { setAss(a => ({ ...a, pent: true, mtgPent: true })); setPl(p => ({ ...p, bag: p.bag - 200000 })); } }} className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-300 drop-shadow-sm text-center font-bold text-xs tracking-widest rounded-xl hover:bg-slate-800 active:scale-95 transition-all duration-100">🏢 MORTGAGE PENTHOUSE ($200K DOWN)</button>}
      {ass.mans
        ? <div className="flex items-center gap-2"><div className="flex-1 p-3 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-xs tracking-widest rounded-xl">✓ MANSION {ass.mtgMans ? '(MORTGAGED +250k/mo)' : '(CASH +50k/mo)'}</div><button onClick={() => { const p = sellPrice(25000000); setPl(s => ({ ...s, bag: s.bag + p })); setAss(a => ({ ...a, mans: false, mtgMans: false })); }} className="shrink-0 px-3 py-3 bg-red-900/60 border border-red-700 text-red-400 font-black text-[10px] tracking-widest rounded-xl hover:bg-red-800 active:scale-95 transition-all duration-100">SELL</button></div>
        : <button onClick={() => { if (pl.bag >= 5000000) { setAss(a => ({ ...a, mans: true, mtgMans: true })); setPl(p => ({ ...p, bag: p.bag - 1000000 })); } }} className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-300 drop-shadow-sm text-center font-bold text-xs tracking-widest rounded-xl hover:bg-slate-800 active:scale-95 transition-all duration-100">🏡 MORTGAGE MANSION ($1M DOWN)</button>}
      <div className="text-[10px] font-bold text-slate-300 drop-shadow-sm uppercase mt-2 tracking-widest text-center">Flex Fleet</div>
      {ass.jet
        ? <div className="flex items-center gap-2"><div className="flex-1 p-3 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-xs tracking-widest rounded-xl">✓ PRIVATE JET {ass.mtgJet ? '(FINANCED +1.5M/mo)' : '(CASH +250k/mo)'}</div><button onClick={() => { const p = sellPrice(100000000); setPl(s => ({ ...s, bag: s.bag + p })); setAss(a => ({ ...a, jet: false, mtgJet: false })); }} className="shrink-0 px-3 py-3 bg-red-900/60 border border-red-700 text-red-400 font-black text-[10px] tracking-widest rounded-xl hover:bg-red-800 active:scale-95 transition-all duration-100">SELL</button></div>
        : <button onClick={() => { if (pl.bag >= 20000000) { setAss(a => ({ ...a, jet: true, mtgJet: true })); setPl(p => ({ ...p, bag: p.bag - 5000000 })); } }} className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-300 drop-shadow-sm text-center font-bold text-xs tracking-widest rounded-xl hover:bg-slate-800 active:scale-95 transition-all duration-100">🛩️ FINANCE PRIVATE JET ($5M DOWN)</button>}
      <div className="text-[10px] font-bold text-slate-300 drop-shadow-sm uppercase mt-4 tracking-widest text-center">God Tier Flexes</div>
      <UpgBtn onClk={() => bAss('spt', 2000000000, 'SPORTS TEAM')} cost={2000000000} title="SPORTS TEAM" unl={ass.spt} pB={pl.bag} />
      <UpgBtn onClk={() => bAss('spc', 10000000000, 'SPACE CORP')} cost={10000000000} title="SPACE CORP" unl={ass.spc} pB={pl.bag} />
      <div className="text-[10px] font-bold text-slate-300 drop-shadow-sm uppercase mt-4 tracking-widest text-center">Legacy Prestige (New Game+)</div>
      <UpgBtn onClk={() => bAss('swf', 25000000000, 'SOVEREIGN WEALTH')} cost={25000000000} title="SOVEREIGN WEALTH FUND" unl={ass.swf} pB={pl.bag} />
      <div className="text-[8px] text-slate-300 drop-shadow-sm text-center mt-1">{mktTag} — sell prices vary with market</div>
    </LabShell>
  );
};

export const ConglomerateTab = () => {
  const { pl, conglomActive, antitrustRisk, rFormConglom, rLobbyRegulators, setTab,
    saasUsers, saasPrice, saasPenaltyActive, corpClients, apiLockoutMonths,
    creOfficeCount, creRetailCount, franchiseCount, unionStrikeActive,
    guttedFirms, peCompoundingYield, supplyChainDisruption,
    tch, smmClients, runnerCount } = useGame();

  const locked = pl.bag < 250000000;

  // Estimate monthly yields for display (simplified clone of adv logic)
  const basePassive = React.useMemo(() => {
    const passiveSrv = (tch.l && tch.pw) ? Math.floor(500 + (tch.u * tch.srv)) : 0;
    const smmRev = smmClients * 300;
    const runnerRev = runnerCount * 150;
    const saasRev = (saasUsers * saasPrice) * (saasPenaltyActive ? 0.5 : 1) - (saasUsers * 2);
    const aiRev = apiLockoutMonths > 0 ? 0 : (corpClients * 8000);
    const creNet = (creOfficeCount * 25000) + (creRetailCount * 10000); // Rough net
    const franchiseRev = unionStrikeActive ? 0 : (franchiseCount * 25000);
    const peRev = supplyChainDisruption ? -500000 : (guttedFirms * 100000 * peCompoundingYield);

    return passiveSrv + smmRev + runnerRev + saasRev + aiRev + creNet + franchiseRev + peRev;
  }, [tch, smmClients, runnerCount, saasUsers, saasPrice, saasPenaltyActive, apiLockoutMonths, corpClients, creOfficeCount, creRetailCount, unionStrikeActive, franchiseCount, supplyChainDisruption, guttedFirms, peCompoundingYield]);

  const currentBonus = React.useMemo(() => {
    return conglomActive ? Math.floor(basePassive * 0.25) : 0;
  }, [conglomActive, basePassive]);

  if (locked) return <LockedTierScreen section={4} />;

  return (
    <LabShell t="GLOBAL CONGLOMERATE" c="slate" fontCls="font-hype" onHub={() => setTab('HUB')} tier={4}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${conglomActive ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Conglomerate Status</div>
        <div className={`text-2xl font-black ${conglomActive ? 'text-blue-400' : 'text-slate-500'}`}>
          {conglomActive ? 'ACTIVE HOLDING CO' : 'INACTIVE'}
        </div>
        {conglomActive && (
          <div className="text-[10px] text-green-400 font-bold mt-1">
            Yield Bonus: +${fMny(currentBonus)}/mo (+25%)
          </div>
        )}
      </div>

      {conglomActive ? (
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-red-400 uppercase mb-1 tracking-widest">
              <span>Anti-Trust Risk</span>
              <span>{Math.floor(antitrustRisk)}%</span>
            </div>
            <div className="bg-black/50 h-3 rounded-full border border-slate-800 overflow-hidden">
              <div className="bg-red-500 h-full transition-all duration-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: `${Math.min(100, antitrustRisk)}%` }}></div>
            </div>
          </div>

          <FlashBtn
            onClick={rLobbyRegulators}
            dis={pl.bag < 10000000 || pl.aura < 20}
            label={`LOBBY REGULATORS ($10M + 20 AURA)`}
            color="slate-100"
            txt="black"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-[10px] text-slate-300 drop-shadow-sm text-center italic mb-2">
            "Consolidate your Tier 3 and 4 assets into a mega-corporation to trigger massive global efficiency bonuses."
          </p>
          <FlashBtn
            onClick={rFormConglom}
            dis={pl.bag < 250000000}
            label="FORM GLOBAL CONGLOMERATE ($250M)"
            color="blue-600"
            txt="white"
          />
        </div>
      )}
    </LabShell>
  );
};

export const SovereignTab = () => {
  const { pl, swfInvestment, geoStability, swfFrozen, rSwfInvest, rSwfWithdraw, setTab } = useGame();
  const locked = pl.bag < 250000000;

  if (locked) return <LockedTierScreen section={4} />;

  const currentYield = !swfFrozen ? Math.floor(swfInvestment * 0.06 * geoStability) : 0;
  const stabilityLabel = geoStability > 1.2 ? "STABLE" : geoStability < 0.8 ? "VOLATILE" : "NORMAL";
  const stabilityColor = geoStability > 1.2 ? "text-green-400" : geoStability < 0.8 ? "text-red-400" : "text-yellow-400";
  const barColor = geoStability > 1.2 ? "bg-green-500" : geoStability < 0.8 ? "bg-red-500" : "bg-yellow-500";

  return (
    <LabShell t="SOVEREIGN WEALTH FUND" c="emerald" fontCls="font-hype" onHub={() => setTab('HUB')} tier={4}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${swfFrozen ? 'border-red-600 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Invested Capital</div>
        <div className="text-3xl font-black text-white">${fMny(swfInvestment)}</div>
        {!swfFrozen && swfInvestment > 0 && (
          <div className="text-[10px] text-green-400 font-bold mt-1">
            Est. Monthly Yield: +${fMny(currentYield)}
          </div>
        )}
        {swfFrozen && (
          <div className="text-[10px] text-red-500 font-black mt-1 tracking-tighter">
            ⚠️ ASSETS FROZEN DUE TO INSTABILITY
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-bold uppercase mb-1 tracking-widest">
          <span className="text-slate-300">Geopolitical Stability</span>
          <span className={stabilityColor}>{stabilityLabel}</span>
        </div>
        <div className="bg-black/50 h-3 rounded-full border border-slate-800 overflow-hidden">
          <div className={`h-full transition-all duration-1000 ${barColor}`} style={{ width: `${(geoStability / 1.5) * 100}%` }}></div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FlashBtn
          onClick={rSwfInvest}
          dis={pl.bag < 100000000}
          label="PARK $100M IN FOREIGN ASSETS"
          color="emerald-600"
          txt="white"
        />
        <button
          onClick={rSwfWithdraw}
          disabled={swfFrozen || swfInvestment <= 0}
          className={`w-full py-3 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 duration-100 ${!swfFrozen && swfInvestment > 0 ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-800 text-slate-300 drop-shadow-sm opacity-40 cursor-not-allowed'}`}
        >
          WITHDRAW ALL CAPITAL
        </button>
      </div>
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-4">
        "Yields scale with global stability. Instability risks permanent or temporary asset freezes."
      </p>
    </LabShell>
  );
};

export const PmcTab = PMCContractor;
