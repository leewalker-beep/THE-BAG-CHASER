import React, { useState } from 'react';
import { useGame, TIERS } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';

export const Stepper = ({ val, setVal, min, max, step, label, isCurr = true }) => (
  <div className="bg-black/40 px-2 py-2 rounded-lg flex items-center w-full border border-slate-800 gap-2">
    <div className="text-xs font-bold text-white uppercase tracking-widest flex-1">{label}: <span className="text-green-400">{isCurr ? '$' : ''}{fMny(val)}</span></div>
    <div className="flex gap-1">
      <button onClick={() => setVal(Math.max(min, val - step))} className="bg-slate-700 rounded px-4 py-2.5 text-xl font-black text-white hover:bg-slate-600 min-w-[44px] active:scale-95 transition-transform duration-100">-</button>
      <button onClick={() => setVal(Math.min(max, val + step))} className="bg-slate-700 rounded px-4 py-2.5 text-xl font-black text-white hover:bg-slate-600 min-w-[44px] active:scale-95 transition-transform duration-100">+</button>
    </div>
  </div>
);

export const Toggles = ({ opts, active, setVal, color }) => {
  const activeClass = color.includes('-') ? `bg-${color}` : `bg-${color}-600`;
  return (
    <div className="flex gap-1 w-full">
      {opts.map((o, i) => (
        <button key={i} onClick={() => setVal(i + 1)} className={`flex-1 py-1.5 px-1 text-[10px] font-bold rounded-lg transition-all active:scale-95 duration-100 ${active === i + 1 ? `${activeClass} text-white shadow-lg` : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{o}</button>
      ))}
    </div>
  );
};

export const FlashBtn = ({ onClick, dis, label, color = 'white', txt = 'black', cost, costStm = 0 }) => {
  const { gBusy, imp, pl } = useGame();
  const busy = gBusy || imp.some(i => !i.w);
  const [st, setSt] = useState('idle');
  const [amt, setAmt] = useState(0);

  // Safety hooks for state recovery
  const [isFlashVisible, setIsFlashVisible] = useState(true);
  const [isFlashProcessing, setIsFlashProcessing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const exhausted = pl.mentalHealth < costStm;

  const hit = async () => {
    if (dis || isDisabled || isFlashProcessing || exhausted || st !== 'idle' || (busy && st === 'idle')) return;
    const hr = cost !== undefined && pl.bag > 0 && cost >= pl.bag * 0.25;

    // UNIVERSAL RESET TIMER: Enforce state-clearing safety delay
    setTimeout(() => {
      setSt('idle');
      setIsFlashVisible(true);
      setIsFlashProcessing(false);
      setIsDisabled(false);
    }, 2000);

    setIsFlashProcessing(true);

    try {
      if (hr) {
        const actionPromise = onClick();
        await new Promise(r => setTimeout(r, 1500));
        setSt('sweat');
        await new Promise(r => setTimeout(r, 500));
        const res = await actionPromise;
        await new Promise(r => setTimeout(r, 200));
        if (res !== undefined) {
          setAmt(res);
          setSt(res >= 0 ? 'win' : 'lose');
          setTimeout(() => {
            setSt('idle');
            setIsFlashProcessing(false);
          }, 1000);
        }
        else {
          setSt('idle');
          setIsFlashProcessing(false);
        }
      } else {
        setSt('calc');
        const res = await onClick();
        if (res !== undefined) {
          setAmt(res);
          setSt(res >= 0 ? 'win' : 'lose');
          setTimeout(() => {
            setSt('idle');
            setIsFlashProcessing(false);
          }, 1500);
        }
        else {
          setSt('idle');
          setIsFlashProcessing(false);
        }
      }
    } catch (error) {
      console.error(error);
      setSt('idle');
      setIsFlashProcessing(false);
    }
  };

  let bg = (dis || isDisabled || exhausted || (busy && st === 'idle') || !isFlashVisible)
    ? 'bg-slate-800/50 text-slate-300 drop-shadow-sm opacity-40 cursor-not-allowed border-slate-700'
    : `bg-${color} text-${txt} hover:bg-gray-200`;
  let l = exhausted ? 'BURNED OUT' : label;
  if (st === 'calc')  { bg = 'bg-slate-600 text-white animate-pulse'; l = 'CALCULATING...'; }
  else if (st === 'drain') { bg = 'bg-orange-900 text-orange-400 animate-pulse'; l = '💸 DRAINING...'; }
  else if (st === 'sweat') { bg = 'bg-yellow-900/80 text-yellow-300 animate-pulse'; l = '😰 THE SWEAT...'; }
  else if (st === 'win')   { bg = 'bg-green-500 text-white shadow-[0_0_20px_#22c55e]'; l = `+$${fMny(amt)}`; }
  else if (st === 'lose')  { bg = 'bg-red-600 text-white shadow-[0_0_20px_#dc2626]'; l = `-$${fMny(Math.abs(amt))}`; }

  return <button onClick={hit} className={`w-full py-3 px-2 font-black text-sm tracking-widest rounded-xl transition-all active:scale-95 duration-100 ${bg}`}>{l.toUpperCase()}</button>;
};

export const LabShell = ({ t, c, f, onHub, children, fontCls = '', hustleKey, tier = 0 }) => {
  const { hustleFatigue, setTab } = useGame();
  const fatigue = hustleFatigue?.[hustleKey] || 0;
  const isFatigued = fatigue > 50;

  const tierStyles = [
    "border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.2)]", // T0: Mud
    "border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.2)]", // T1: Street
    "border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]", // T2: Corporate
    "border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)]", // T3: Elite
    "border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.2)]", // T4: Mogul
    "border-red-500/50 shadow-[0_0_20px_rgba(239,68,68,0.2)]", // T5: President
  ];

  return (
    <div className={`bg-slate-900/95 border p-6 rounded-2xl flex flex-col gap-2 relative ${isFatigued ? 'fatigue-warning' : tierStyles[tier] || 'border-slate-700 shadow-2xl'} transition-all duration-300`}>
      {isFatigued && (
        <div className="absolute -top-3 -right-3 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black animate-bounce shadow-lg z-10 border-2 border-white">
          !
        </div>
      )}
      <div className="text-center">
        <h3 className={`text-lg font-black text-white uppercase tracking-widest drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ${fontCls}`}>{t}</h3>
        {f && <p className="text-[10px] text-slate-300 drop-shadow-sm italic">"{f}"</p>}
      </div>
      {children}
      <button onClick={() => setTab('HUB')} className="w-full py-2 px-3 mt-1 bg-slate-800 text-white text-xs font-bold tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-transform duration-100">🏠 EMPIRE HUB</button>
    </div>
  );
};

export const UpgBtn = ({ onClk, cost, title, unl, reqA = 0, reqC = 0, pB, pA = 0, pC = 0 }) => {
  if (unl) return <div className="w-full py-1.5 px-2 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-[10px] tracking-widest rounded-xl">✓ {title}</div>;
  const meets = pB >= cost && pA >= reqA && pC >= reqC;
  let rT = ''; if (reqA > 0) rT += `${reqA} AURA `; if (reqC > 0) rT += `${reqC} CLOUT`;
  return <button onClick={onClk} disabled={!meets} className={`w-full py-2 px-2 font-black text-[10px] tracking-widest rounded-xl flex justify-center gap-2 active:scale-95 transition-transform duration-100 ${meets ? 'bg-yellow-900/20 border border-yellow-600 text-yellow-500 hover:bg-yellow-900/40' : 'bg-slate-900 border border-slate-800 text-slate-300 drop-shadow-sm opacity-40'}`}>🔒 {title} (${fMny(cost)}) {rT}</button>;
};

export const LockedTierScreen = ({ section }) => {
  const { setTab } = useGame();
  const tier = TIERS?.[section];
  if (!tier) return null;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-900/80 border border-slate-700 rounded-2xl text-center gap-4">
      <div className="text-6xl">🔒</div>
      <h2 className="text-2xl font-black text-white uppercase tracking-widest">{tier.label} LOCKED</h2>
      <p className="text-slate-300 drop-shadow-sm text-sm">Reach the required milestones to unlock this sector.</p>
      <div className="bg-black/50 p-4 rounded-xl border border-slate-800 w-full max-w-xs">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold mb-2 uppercase">Requirements</div>
        <div className="flex flex-col gap-1 text-xs font-bold">
          <div className="flex justify-between">
            <span className="text-slate-300 drop-shadow-sm">Wealth:</span>
            <span className="text-green-400">${fMny(tier.req.bag)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300 drop-shadow-sm">Clout:</span>
            <span className="text-red-400">{tier.req.clout}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-300 drop-shadow-sm">Aura:</span>
            <span className="text-yellow-400">{tier.req.aura}</span>
          </div>
        </div>
      </div>
      <button onClick={() => setTab('HUB')} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">RETURN TO HUB</button>
    </div>
  );
};
