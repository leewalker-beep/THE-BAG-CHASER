import React, { useState } from 'react';
import { GameProvider, useGame, TIERS } from './GameEngine.jsx';
import { fMny, MARKETS, HF_RUMORS } from './config.js';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&family=Bebas+Neue&family=Rajdhani:wght@400;700&family=Share+Tech+Mono&family=Playfair+Display:wght@700;900&display=swap');

  body, button, input, textarea, select { font-family: 'Space Grotesk', sans-serif; }
  .font-hype { font-family: 'Bebas Neue', cursive !important; letter-spacing: 0.08em; }
  .font-tech { font-family: 'Rajdhani', sans-serif !important; font-weight: 700; }
  .font-hack { font-family: 'Share Tech Mono', monospace !important; }
  .font-gov  { font-family: 'Playfair Display', serif !important; }

  @keyframes shake { 0%, 100% { transform: translateX(0); } 25%, 75% { transform: translateX(-10px) rotate(-3deg); } 50% { transform: translateX(10px) rotate(3deg); } }
  .animate-shake-hard { animation: shake 0.2s ease-in-out infinite; box-shadow: inset 0 0 100px rgba(239, 68, 68, 0.5); }
  .aura-glow { box-shadow: 0 0 15px rgba(234, 179, 8, 0.8); } .clout-glow { box-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }
  .mh-glow { box-shadow: 0 0 15px rgba(168, 85, 247, 0.8); }
  @keyframes rain { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
  .money-rain { position: fixed; color: #22c55e; font-weight: bold; font-size: 2.5rem; z-index: 100; animation: rain 1.5s linear forwards; pointer-events: none; text-shadow: 0 0 10px #22c55e; }
  @keyframes floatUp { 0% { opacity: 1; transform: translate(-50%, 0) scale(0.5); } 20% { transform: translate(-50%, -20px) scale(1.2); } 100% { opacity: 0; transform: translate(-50%, -100px) scale(1); } }
  .impact-text { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUp 2s ease-out forwards; text-shadow: 0px 10px 30px rgba(0,0,0,0.9); }
  .bg-basement { background: linear-gradient(to bottom right, #0f172a, #000000); } .bg-penthouse { background: linear-gradient(to bottom right, #1e1b4b, #000000, #312e81); }
  .bg-mansion { background: linear-gradient(to bottom right, #064e3b, #0f172a, #022c22); } .bg-oval { background: linear-gradient(to bottom right, #1e3a8a, #0f172a, #7f1d1d); }
  body { color: white; margin: 0; overflow-x: hidden; background: #000; }
  .ui-modal { background: #0f172a; border: 2px solid #3b82f6; border-radius: 12px; } .ui-crisis { background: #450a0a; border: 2px solid #ef4444; border-radius: 12px; }
  .mobile-hud { position: sticky; top: 0; z-index: 50; background: rgba(0,0,0,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid #334155; }
  .ticker-wrap { position: fixed; bottom: 0; width: 100%; overflow: hidden; background-color: rgba(0,0,0,0.95); border-top: 2px solid #3b82f6; height: 3rem; z-index: 100; display: flex; align-items: center; box-shadow: 0 -5px 20px rgba(0,0,0,0.5); }
  .ticker { display: inline-block; white-space: nowrap; padding-left: 100%; animation: ticker 45s linear infinite; font-family: 'Share Tech Mono', monospace; font-size: 1.05rem; font-weight: bold; color: #10b981; text-shadow: 0 0 8px #10b981; }
  .ticker-paused { animation-play-state: paused !important; }
  @keyframes ticker { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
  .news-bag { color: #22c55e; font-weight: 900; } .news-scandal { color: #ef4444; font-weight: 900; } .news-viral { color: #ec4899; font-weight: 900; }
  @keyframes floatUpStat { 0% { opacity: 1; transform: translateY(0) scale(0.9); } 100% { opacity: 0; transform: translateY(-60px) scale(1); } }
  .impact-aura { position: fixed; top: 70px; right: 16px; font-size: 1rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUpStat 2s ease-out forwards; color: #fbbf24; text-shadow: 0 0 8px rgba(234,179,8,0.9); }
  .impact-clout { position: fixed; top: 96px; right: 16px; font-size: 1rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUpStat 2s ease-out forwards; color: #f87171; text-shadow: 0 0 8px rgba(239,68,68,0.9); }
  @keyframes auraPanic { 0%, 100% { box-shadow: inset 0 0 80px rgba(180,0,0,0.35); } 50% { box-shadow: inset 0 0 140px rgba(220,0,0,0.6); } }
  .aura-panic { animation: auraPanic 1.2s ease-in-out infinite; }
  @keyframes fatigueBlink { 0%, 100% { border-color: #ef4444; box-shadow: 0 0 5px #ef4444; } 50% { border-color: #450a0a; box-shadow: none; } }
  .fatigue-warning { animation: fatigueBlink 1s ease-in-out infinite; border-width: 2px !important; }
  @keyframes billionaireShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .billionaire-bag { background: linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b, #d97706, #fbbf24); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: billionaireShimmer 2s ease infinite; filter: drop-shadow(0 0 8px rgba(251,191,36,0.8)); }
  .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
`;

// ─── Reusable UI components ───────────────────────────────────────────────────

const Stepper = ({ val, setVal, min, max, step, label, isCurr = true }) => (
  <div className="bg-black/40 px-2 py-2 rounded-lg flex items-center w-full border border-slate-800 gap-2">
    <div className="text-xs font-bold text-white uppercase tracking-widest flex-1">{label}: <span className="text-green-400">{isCurr ? '$' : ''}{fMny(val)}</span></div>
    <div className="flex gap-1">
      <button onClick={() => setVal(Math.max(min, val - step))} className="bg-slate-700 rounded px-4 py-2.5 text-xl font-black text-white hover:bg-slate-600 min-w-[44px] active:scale-95 transition-transform duration-100">-</button>
      <button onClick={() => setVal(Math.min(max, val + step))} className="bg-slate-700 rounded px-4 py-2.5 text-xl font-black text-white hover:bg-slate-600 min-w-[44px] active:scale-95 transition-transform duration-100">+</button>
    </div>
  </div>
);

const Toggles = ({ opts, active, setVal, color }) => {
  const activeClass = color.includes('-') ? `bg-${color}` : `bg-${color}-600`;
  return (
    <div className="flex gap-1 w-full">
      {opts.map((o, i) => (
        <button key={i} onClick={() => setVal(i + 1)} className={`flex-1 py-1.5 px-1 text-[10px] font-bold rounded-lg transition-all active:scale-95 duration-100 ${active === i + 1 ? `${activeClass} text-white shadow-lg` : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{o}</button>
      ))}
    </div>
  );
};

const FlashBtn = ({ onClick, dis, label, color = 'white', txt = 'black', cost, costStm = 0 }) => {
  const { gBusy, imp, pl } = useGame();
  const busy = gBusy || imp.some(i => !i.w);
  const [st, setSt] = useState('idle');
  const [amt, setAmt] = useState(0);

  const exhausted = pl.mentalHealth < costStm;

  const hit = async () => {
    if (dis || exhausted || st !== 'idle' || (busy && st === 'idle')) return;
    const hr = cost !== undefined && pl.bag > 0 && cost >= pl.bag * 0.25;
    try {
      if (hr) {
        const actionPromise = onClick();
        await new Promise(r => setTimeout(r, 1500));
        setSt('sweat');
        await new Promise(r => setTimeout(r, 500));
        const res = await actionPromise;
        await new Promise(r => setTimeout(r, 200));
        if (res !== undefined) { setAmt(res); setSt(res >= 0 ? 'win' : 'lose'); setTimeout(() => setSt('idle'), 1000); }
        else setSt('idle');
      } else {
        setSt('calc');
        const res = await onClick();
        if (res !== undefined) { setAmt(res); setSt(res >= 0 ? 'win' : 'lose'); setTimeout(() => setSt('idle'), 1500); }
        else setSt('idle');
      }
    } catch (error) {
      setSt('idle');
    }
  };

  let bg = (dis || exhausted || (busy && st === 'idle'))
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

const LabShell = ({ t, c, f, onHub, children, fontCls = '', hustleKey, tier = 0 }) => {
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

const UpgBtn = ({ onClk, cost, title, unl, reqA = 0, reqC = 0, pB, pA = 0, pC = 0 }) => {
  if (unl) return <div className="w-full py-1.5 px-2 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-[10px] tracking-widest rounded-xl">✓ {title}</div>;
  const meets = pB >= cost && pA >= reqA && pC >= reqC;
  let rT = ''; if (reqA > 0) rT += `${reqA} AURA `; if (reqC > 0) rT += `${reqC} CLOUT`;
  return <button onClick={onClk} disabled={!meets} className={`w-full py-2 px-2 font-black text-[10px] tracking-widest rounded-xl flex justify-center gap-2 active:scale-95 transition-transform duration-100 ${meets ? 'bg-yellow-900/20 border border-yellow-600 text-yellow-500 hover:bg-yellow-900/40' : 'bg-slate-900 border border-slate-800 text-slate-300 drop-shadow-sm opacity-40'}`}>🔒 {title} (${fMny(cost)}) {rT}</button>;
};

const LockedTierScreen = ({ section }) => {
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

const ExpView = () => {
  const { cap, pl, peaks, hl } = useGame();

  const totalLifetimeIncome = Object.values(hl || {}).reduce((a, b) => a + b, 0);
  const globalLevel = Math.floor(Math.sqrt(totalLifetimeIncome / 10000)) || 1;
  const nextMilestone = Math.pow(globalLevel + 1, 2) * 10000;
  const progress = (totalLifetimeIncome / nextMilestone) * 100;

  const stats = [
    { label: 'Current Aura', val: pl?.aura || 0, max: cap, color: 'text-yellow-400', bar: 'bg-yellow-400' },
    { label: 'Current Clout', val: pl?.clout || 0, max: cap, color: 'text-red-400', bar: 'bg-red-400' },
    { label: 'Peak Wealth', val: `$${fMny(peaks?.peakB || 0)}`, color: 'text-green-400' },
    { label: 'Peak Aura', val: peaks?.peakA || 0, color: 'text-yellow-500' },
    { label: 'Peak Clout', val: peaks?.peakC || 0, color: 'text-red-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900/80 border border-blue-600/50 p-4 rounded-2xl shadow-2xl text-center">
        <h3 className="text-xl font-black text-blue-400 uppercase tracking-widest font-tech">EXP & METRICS</h3>
        <p className="text-[10px] text-slate-300 drop-shadow-sm italic mt-1">"Tracking your ascent to godhood."</p>
      </div>

      <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl flex flex-col gap-3">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Global Level</div>
            <div className="text-3xl font-black text-blue-400">LVL {globalLevel}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Prestige Multiplier</div>
            <div className="text-xl font-black text-purple-400">1.0x</div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-[10px] font-bold mb-1">
            <span className="text-slate-300 drop-shadow-sm uppercase">Lifetime Income: ${fMny(totalLifetimeIncome)}</span>
            <span className="text-blue-400">Next: ${fMny(nextMilestone)}</span>
          </div>
          <div className="bg-black/50 h-3 rounded-full border border-slate-800 overflow-hidden">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${Math.min(100, progress)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">{s.label}</span>
              <span className={`font-black tracking-widest ${s.color}`}>{s.val}</span>
            </div>
            {s.max && (
              <div className="bg-black/50 h-2 rounded-full border border-slate-800">
                <div className={`h-full rounded-full transition-all ${s.bar}`} style={{ width: `${Math.min(100, (s.val / s.max) * 100)}%` }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const FlexShopView = () => {
  const { ass, pl, bAss, setTab, setSelTier } = useGame();

  const shopItems = [
    { key: 'hePent',    label: 'Ultra High-End Penthouse', cost: 5000000,  icon: '🏙️', desc: 'Accelerates Mental Health recovery speed by 100%.' },
    { key: 'cmYct',     label: 'Custom Mega-Yacht',        cost: 50000000, icon: '🛳️', desc: 'Massively expands max Clout caps by 10x.' },
    { key: 'legalTeam', label: 'Elite Legal Defense',      cost: 0,        icon: '⚖️', desc: 'Halves risk metrics and reduces tragedy penalties. Monthly $1M retainer.', retainer: 1000000 },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900/80 border border-blue-600/50 p-4 rounded-2xl shadow-2xl text-center">
        <h3 className="text-xl font-black text-blue-400 uppercase tracking-widest font-hype">THE FLEX SHOP</h3>
        <p className="text-[10px] text-slate-300 drop-shadow-sm italic mt-1">"Scalable money sinks for the late-game elite."</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {shopItems.map(item => {
          const owned = ass?.[item.key];
          const canAfford = (pl?.bag || 0) >= item.cost;
          return (
            <div key={item.key} className={`p-6 rounded-xl border flex flex-col gap-3 transition-all ${owned ? 'bg-blue-900/20 border-blue-700' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex flex-col">
                    <div className={`font-black tracking-widest text-xs ${owned ? 'text-blue-400' : 'text-white'}`}>{item.label.toUpperCase()}</div>
                    <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold">
                      {item.cost > 0 ? `Cost: $${fMny(item.cost)}` : 'RETAINER ONLY'}
                      {item.retainer && <span className="text-red-400"> | Retainer: ${fMny(item.retainer)}/mo</span>}
                    </div>
                  </div>
                </div>
                {owned ? (
                  <div className="text-blue-500 font-black text-xs tracking-widest shrink-0">ACTIVE ✓</div>
                ) : (
                  <button
                    onClick={() => bAss(item.key, item.cost, item.label, 0, 0)}
                    disabled={!canAfford}
                    className={`px-4 py-2 rounded-lg font-black text-xs tracking-widest transition-all active:scale-95 duration-100 shrink-0 ${canAfford ? 'bg-blue-500 text-white hover:bg-blue-400 shadow-[0_0_15px_#3b82f6]' : 'bg-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}
                  >
                    ACQUIRE
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-300 leading-relaxed italic">"{item.desc}"</p>
            </div>
          );
        })}
      </div>
      <button onClick={() => { setSelTier(pl.tier.toString()); setTab('HUB'); }} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">RETURN TO HUB</button>
    </div>
  );
};

const FlexesView = () => {
  const { ass, pl, bAss } = useGame();

  const flexItems = [
    { key: 'watch', label: 'Patek Philippe Watch', cost: 150000, icon: '⌚', clout: 25, yield: 750, yieldType: 'appr' },
    { key: 'car',   label: 'F1 Precision Supercar', cost: 450000, icon: '🏎️', clout: 150, yield: -8000, yieldType: 'maint' },
    { key: 'pent',  label: 'Skyline Penthouse',     cost: 8500000, icon: '🏢', clout: 500, aura: 200, yield: 15000, yieldType: 'yield' },
    { key: 'yct',   label: 'Mega Yacht',            cost: 65000000, icon: '🛥️', clout: 2000, aura: 500, yield: -250000, yieldType: 'maint' },
    { key: 'spt',   label: 'Pro Basketball Team',   cost: 400000000, icon: '🏀', clout: 10000, aura: 5000, yield: 0, yieldType: 'dynamic' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900/80 border border-yellow-600/50 p-4 rounded-2xl shadow-2xl text-center">
        <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest font-hype">LIFESTYLE FLEXES</h3>
        <p className="text-[10px] text-slate-300 drop-shadow-sm italic mt-1">"Burn cash to buy the world."</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {flexItems.map(item => {
          const owned = ass?.[item.key];
          const canAfford = (pl?.bag || 0) >= item.cost;
          return (
            <div key={item.key} className={`p-6 rounded-xl border flex items-center justify-between transition-all ${owned ? 'bg-green-900/20 border-green-700' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div className="flex flex-col">
                  <div className={`font-black tracking-widest text-xs ${owned ? 'text-green-400' : 'text-white'}`}>{item.label.toUpperCase()}</div>
                  <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold">Cost: ${fMny(item.cost)}</div>
                  <div className="text-[9px] text-slate-300 drop-shadow-sm">
                    {item.clout && <span className="text-red-400">+{item.clout} Clout </span>}
                    {item.aura && <span className="text-yellow-400">+{item.aura} Aura </span>}
                  </div>
                  <div className={`text-[9px] font-bold ${item.yield > 0 ? 'text-green-500' : item.yield < 0 ? 'text-red-500' : 'text-blue-400'}`}>
                    {item.yieldType === 'appr' && `Yield: +$${fMny(item.yield)}/mo appreciation`}
                    {item.yieldType === 'maint' && `Maint: -$${fMny(Math.abs(item.yield))}/mo depreciation`}
                    {item.yieldType === 'yield' && `Yield: +$${fMny(item.yield)}/mo rental income`}
                    {item.yieldType === 'dynamic' && `Maint: Dynamic Payroll Modifiers`}
                  </div>
                </div>
              </div>
              {owned ? (
                <div className="text-green-500 font-black text-xs tracking-widest shrink-0">OWNED ✓</div>
              ) : (
                <button
                  onClick={() => bAss(item.key, item.cost, item.label, item.clout || 0, item.aura || 0)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-lg font-black text-xs tracking-widest transition-all active:scale-95 duration-100 shrink-0 ${canAfford ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}
                >
                  BUY
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Autopsy Report screen ────────────────────────────────────────────────────

const AutopsyReport = () => {
  const { death, alias, peaks, hl, tally, hustleClicks } = useGame();
  if (!death) return null;

  const catNames = { sw: '👟 Streetwear Drop', drop: '📦 Dropship', cc: '📺 Creator Lab', pod: '🎙️ Podcast', box: '🥊 Fight Promo', tch: '💻 SaaS Exit', cryp: '🪙 Crypto Rug', tour: '🎪 Live Event', mov: '🎬 Hollywood', hf: '📈 Hedge Trade' };
  const top5  = Object.entries(hl).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const hustleIcons = { streetwear: '👕', dropship: '📦', vintage: '👕', tech: '💻', smm: '📱', runners: '🏃' };

  return (
    <div className="min-h-screen bg-black text-white font-hack flex flex-col items-center justify-center p-4 text-center">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-xl w-full bg-slate-900 border-2 border-red-600 rounded-2xl p-8 shadow-[0_0_80px_rgba(220,38,38,0.3)]">
        <div className="text-6xl mb-4">{hustleIcons[death.hustle] || '🪦'}</div>
        <h1 className="text-4xl font-black mb-2 text-red-500 font-hype tracking-widest">{death.r}</h1>
        <div className="h-0.5 w-full bg-red-600/30 my-6"></div>

        <p className="text-pink-400 mb-8 font-bold text-xl leading-relaxed italic">"{death.i}"</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-black/50 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase mb-1">Peak Bag</div>
            <div className="text-lg font-black text-green-400">${fMny(peaks.peakB)}</div>
          </div>
          <div className="bg-black/50 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase mb-1">Peak Aura</div>
            <div className="text-lg font-black text-yellow-400">{peaks.peakA}</div>
          </div>
          <div className="bg-black/50 p-4 rounded-xl border border-slate-800">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase mb-1">Peak Clout</div>
            <div className="text-lg font-black text-red-400">{peaks.peakC}</div>
          </div>
        </div>

        <div className="bg-black/50 p-6 rounded-xl border border-slate-800 mb-8 text-left">
          <div className="text-xs text-yellow-500 mb-4 tracking-widest uppercase font-black text-center">📊 Career Stats</div>
          <div className="space-y-2">
            {Object.entries(hustleClicks).map(([h, count]) => (
              <div key={h} className="flex justify-between text-sm items-center">
                <span className="text-slate-300 drop-shadow-sm capitalize">{h}:</span>
                <span className="font-black text-white">{count} ACTIONS</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 flex flex-col items-center">
          <div className="text-xs text-slate-300 drop-shadow-sm font-bold uppercase mb-1">Final Status</div>
          <div className="text-2xl font-black text-slate-300 drop-shadow-sm tracking-tighter">{alias || 'ANON'} — {death.rank}</div>
        </div>

        <button onClick={() => {
          localStorage.clear();
          sessionStorage.clear();
          window.location.href = window.location.origin + window.location.pathname + '?t=' + Date.now();
        }} className="w-full p-6 bg-red-600 text-white font-black tracking-widest text-xl rounded-xl hover:bg-red-500 transition-all active:scale-95 duration-100 shadow-[0_0_20px_#dc2626]">PLUG BACK IN</button>
      </div>
    </div>
  );
};

// ─── Prologue screen ──────────────────────────────────────────────────────────

const Prologue = () => {
  const { proSt, setProSt, alias, setAlias, diff, setDiff, setPh, exStart } = useGame();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <h1 className="text-5xl font-black mb-2 text-green-400 tracking-tighter drop-shadow-[0_0_15px_#22c55e] font-hype">THE BAG CHASER</h1>
      <p className="text-slate-300 drop-shadow-sm mb-8 text-sm font-tech">Build your empire from nothing. Or die broke.</p>
      <div className="w-full max-w-md bg-black/60 border border-slate-700 p-8 rounded-2xl flex flex-col items-center shadow-2xl">
        {proSt === 0 && <>
          <h3 className="font-black text-2xl text-green-400 mb-3 tracking-widest font-hype">THE BAG</h3>
          <p className="text-slate-300 drop-shadow-sm mb-2 leading-relaxed">Your cash. Every hustle costs money upfront.</p>
          <p className="text-slate-300 drop-shadow-sm mb-6 text-sm leading-relaxed">Hit $0 → BANKRUPT. Game over. Survive Market Shifts, Mortgages, and Fines. Never go dry.</p>
          <button onClick={() => setProSt(1)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">GOT IT →</button>
        </>}
        {proSt === 1 && <>
          <h3 className="font-black text-2xl text-yellow-400 mb-3 tracking-widest font-hype">AURA = REPUTATION</h3>
          <p className="text-slate-300 drop-shadow-sm mb-2 leading-relaxed">Street cred that unlocks bigger moves and boosts your revenue.</p>
          <p className="text-red-400 mb-6 text-sm font-bold leading-relaxed">⚠ Hit 0 Aura = CANCELLED. Permanent game over. Scandals and bad decisions drain it fast.</p>
          <button onClick={() => setProSt(2)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">GOT IT →</button>
        </>}
        {proSt === 2 && <>
          <h3 className="font-black text-2xl text-red-400 mb-3 tracking-widest font-hype">CLOUT = FAME</h3>
          <p className="text-slate-300 drop-shadow-sm mb-2 leading-relaxed">Unlocks arenas, political power, and God Tier moves.</p>
          <p className="text-slate-300 drop-shadow-sm mb-6 text-sm leading-relaxed">Low Clout = no one shows up. High Clout = world stage. Grind content, podcasts, and drops to build it.</p>
          <button onClick={() => setProSt(3)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">GOT IT →</button>
        </>}
        {proSt === 3 && <>
          <h3 className="font-black text-xl text-blue-400 mb-3 tracking-widest font-tech">HOW TO PLAY</h3>
          <ul className="text-slate-300 drop-shadow-sm text-xs text-left mb-5 space-y-1.5 leading-relaxed">
            <li>→ Pick any hustle from the <span className="text-white font-bold">HUB</span> and start grinding</li>
            <li>→ <span className="text-yellow-400 font-bold">Market Cycles</span> shift every 12 months — costs and risks change</li>
            <li>→ <span className="text-orange-400 font-bold">Fatigue</span>: flood the same event tier and fans check out</li>
            <li>→ <span className="text-pink-400 font-bold">Lifestyle Creep</span>: assets auto-offer at bag milestones — mortgages burn monthly</li>
            <li>→ <span className="text-purple-400 font-bold">Whale Tax</span>: the IRS clips 20-30% off any payout over $100M</li>
            <li>→ Compound to God Tier: Movies → Hedge Fund → AI Lab</li>
            <li>→ <span className="text-red-500 font-bold">POTUS Run</span>: fund a shadow campaign, win 2 of 3 regions → President</li>
          </ul>
          <button onClick={() => setProSt(4)} className="w-full p-4 bg-green-600 text-black font-black tracking-widest rounded-xl hover:bg-green-500 active:scale-95 transition-all duration-100 shadow-[0_0_15px_#22c55e]">LET'S RUN IT →</button>
        </>}
        {proSt === 4 && <>
          <input type="text" value={alias} onChange={e => setAlias(e.target.value.substring(0, 5).toUpperCase())} placeholder="ALIAS (3-5 CHARS)" className="w-full p-4 mb-4 bg-slate-900 border border-slate-600 rounded-lg text-center font-black tracking-widest text-xl text-white outline-none focus:border-green-400 transition-colors" />
          <div className="w-full mb-2">
            <div className="text-xs text-slate-300 font-bold tracking-widest mb-2">DIFFICULTY</div>
            <Toggles opts={['TRUST FUND', 'HUSTLER', 'GRINDER']} active={diff} setVal={setDiff} color="green-600" />
          </div>
          <div className="w-full mb-4 px-1">
            {diff === 3 && <p className="text-[10px] text-red-400 font-bold text-center leading-relaxed">⚠ Protect Your Aura (0 = Cancellation) | Cash Flow is King | Read the Fine Print</p>}
            {diff === 2 && <p className="text-[10px] text-yellow-400 font-bold text-center leading-relaxed">⚠ Respect the Market Cycle | Beware Lifestyle Creep (Mortgages kill) | Rotate Your Roster</p>}
            {diff === 1 && <p className="text-[10px] text-slate-300 drop-shadow-sm font-bold text-center leading-relaxed">⚠ Fame is a Target | The Feds are Watching (Whale Tax) | Leverage is a Double-Edged Sword</p>}
          </div>
          <button onClick={() => { exStart(); }} disabled={alias.length < 3} className={`w-full p-6 font-black tracking-widest text-xl rounded-xl transition-all active:scale-95 duration-100 ${alias.length >= 3 ? 'bg-green-500 text-black shadow-[0_0_20px_#22c55e] hover:bg-green-400' : 'bg-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>ENTER THE MATRIX</button>
        </>}
      </div>
    </div>
  );
};

// ─── HUB tab ──────────────────────────────────────────────────────────────────

const TierHub = () => {
  const { pl, mkt, news, skl, diff, cap, adv, setTab, selTier, setSelTier, displayBag, rRest, rRetire, setMod } = useGame();

  if (selTier === 'flexes') return <FlexesView />;
  if (selTier === 'flexShop') return <FlexShopView />;
  if (selTier === 'exp') return <ExpView />;

  const tierIdx = parseInt(selTier);
  const tier = TIERS[tierIdx];
  const isLocked = pl.tier < tierIdx;

  const tierStyles = [
    "border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]", // T0: Mud
    "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]", // T1: Street
    "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]", // T2: Corporate
    "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]", // T3: Elite
    "border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]", // T4: Mogul
    "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]", // T5: President
  ];

  const hustleMap = {
    'SW': { label: 'Streetwear', icon: '👕' },
    'DROP': { label: 'Dropship', icon: '📦' },
    'TECH_FLIP': { label: 'Tech Flipping', icon: '💻' },
    'VINTAGE': { label: 'Vintage Reselling', icon: '👕' },
    'SMM': { label: 'SMM Micro-Agency', icon: '📱' },
    'GIG': { label: 'Gig Runner Network', icon: '🏃' },
    'CC': { label: 'Creator Lab', icon: '📱' },
    'POD': { label: 'Podcast Net', icon: '🎙️' },
    'BOX': { label: 'FIGHT Promoter', icon: '🥊' },
    'AUDIO': { label: 'Indie Audio Syndicate', icon: '🎵' },
    'TECH': { label: 'SaaS Startup', icon: '💻' },
    'AI_AGENCY': { label: 'AI Marketing Agency', icon: '🤖' },
    'CRE_FLIP': { label: 'Commercial Real Estate', icon: '🏢' },
    'FRANCHISE': { label: 'National Franchise', icon: '🍟' },
    'CRYP': { label: 'Web3 Hedge', icon: '🪙' },
    'TOUR': { label: 'Events', icon: '🎪' },
    'PE_ROLLUP': { label: 'Private Equity', icon: '📊' },
    'ART_SPEC': { label: 'Art Speculation', icon: '🎨' },
    'HF': { label: 'Hedge Fund', icon: '📈' },
    'CONGLOMERATE': { label: 'Global Conglomerate', icon: '🏢' },
    'PMC': { label: 'Private Military', icon: '🎖️' },
    'SOVEREIGN': { label: 'Sovereign Wealth Fund', icon: '🌍' },
    'PAC': { label: 'Super PAC', icon: '🇺🇸' },
    'BLITZ': { label: 'Media Blitz', icon: '📣' },
    'SMEAR': { label: 'Smear Campaigns', icon: '🔥' },
    'ELECTION': { label: 'ELECTION DAY', icon: '🗳️' }
  };

  return (
    <div className={`flex flex-col gap-5 mb-8 p-4 rounded-3xl border transition-all duration-500 ${!isNaN(tierIdx) ? tierStyles[tierIdx] : 'border-slate-800 bg-slate-900/20'}`}>
      <div className="grid grid-cols-1">
        <button
          onClick={rRest}
          className="w-full py-4 bg-purple-900/40 border-2 border-purple-500 rounded-xl font-black text-purple-400 tracking-widest hover:bg-purple-800/40 transition-all active:scale-95 duration-100 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">😴</span>
          TAKE SOME MENTAL HEALTH DAYS (+50 MH, ADVANCE 1 MO)
        </button>
      </div>


      {(pl.tier >= 5 && pl.bag >= 500000000) && (
        <div className="grid grid-cols-1">
          <button
            onClick={() => setMod({
              s: true,
              t: "ASCEND & RETIRE",
              m: "Hand down your empire to your heir. You will lose your current cash, assets, and tiers, but your heir will inherit a permanent +25% multiplier to all future income. Continue the dynasty?",
              o: [
                { label: "CONFIRM ASCENSION", action: () => { rRetire(); setMod({ s: false }); } },
                { label: "CANCEL", action: () => setMod({ s: false }) }
              ],
              ui: "ui-modal"
            })}
            className="w-full py-4 bg-yellow-900/40 border-2 border-yellow-500 rounded-xl font-black text-yellow-400 tracking-widest hover:bg-yellow-800/40 transition-all active:scale-95 duration-100 flex items-center justify-center gap-3 animate-pulse"
          >
            <span className="text-2xl">👑</span>
            RETIRE & HAND DOWN EMPIRE
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">

      {tier?.hustles?.map(hKey => {
        const h = hustleMap[hKey];
        if (!h) return null;
        const isStub = h.stub;

        return (
          <div key={hKey} className="relative aspect-[4/3]">
            <button
              onClick={() => !isStub && setTab?.(hKey)}
              className={`w-full h-full p-6 rounded-xl border font-bold text-sm tracking-wide transition-all active:scale-95 duration-100 shadow-lg flex flex-col items-center justify-between
                ${isStub
                  ? 'bg-slate-900/40 border-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'
                  : 'bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800'}`}
            >
              <div className="flex-1 flex items-center justify-center">
                <span className="text-3xl">{h.icon}</span>
              </div>
              <span className="text-center">{h.label.toUpperCase()}</span>
              <div className="h-4 flex items-center justify-center">
                {isStub && <span className="text-[8px] text-yellow-600 uppercase">UNDER CONSTRUCTION</span>}
              </div>
            </button>
            {isLocked && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-4 text-center border border-slate-800 pointer-events-none">
                <span className="text-xl mb-1">🔒</span>
                <div className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Locked Sector</div>
                <div className="text-[7px] text-slate-300 drop-shadow-sm mt-1">
                  Req: ${fMny(tier.req.bag)} | {tier.req.clout} C | {tier.req.aura} A
                </div>
              </div>
            )}
          </div>
        );
      })}

      </div>
    </div>
  );
};

// Skill buy button — needs setPl / setSkl from context
const SkillBuyBtn = ({ skill, lvl, cost, penalty, ok, btnCls, statLabel, diff, cap }) => {
  const { pl, setPl, setSkl } = useGame();
  const msgs = {
    neg: `Negotiator Lvl ${lvl + 1}. -${(lvl + 1) * 2}% costs. 🤝`,
    tax: `Tax Haven Lvl ${lvl + 1}. -${(lvl + 1) * 4}% burn. 🏝️`,
    inf: `Influencer Lvl ${lvl + 1}. -${(lvl + 1) * 3}% Aura penalty. 📱`,
  };
  const buy = () => {
    if (!ok) return;
    setPl(p => {
      const penMult = diff === 1 ? 1.25 : 1.0;
      const fa = penalty.field === 'aura'  ? Math.floor(-penalty.amt * penMult) : 0;
      const fc = penalty.field === 'clout' ? Math.floor(-penalty.amt * penMult) : 0;
      return {
        ...p,
        bag:   p.bag - cost,
        aura:  Math.min(cap, Math.max(0, p.aura  + fa)),
        clout: Math.min(cap, Math.max(0, p.clout + fc)),
      };
    });
    setSkl(s => ({ ...s, [skill]: s[skill] + 1 }));
    console.log(msgs[skill]);
  };
  return (
    <button onClick={buy} className={`text-[8px] font-black px-2 py-1.5 rounded-lg shrink-0 leading-tight text-center active:scale-95 transition-all duration-100 ${ok ? btnCls : 'bg-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>
      ${fMny(cost)}<br />{statLabel}
    </button>
  );
};

// ─── Individual tab panels ────────────────────────────────────────────────────

};

// ─── Main game interface ──────────────────────────────────────────────────────

const TAB_MAP = {
  'HUB':          { component: TierHub },
  'SW':           { component: SwTab,           tier: 0 },
  'DROP':         { component: DropTab,         tier: 0 },
  'VINTAGE':      { component: VintageTab,      tier: 0 },
  'SMM':          { component: SmmTab,          tier: 0 },
  'TECH_FLIP':    { component: TechFlipTab,     tier: 0 },
  'GIG':          { component: GigTab,          tier: 0 },
  'CC':           { component: CcTab,           tier: 1 },
  'POD':          { component: PodTab,          tier: 1 },
  'BOX':          { component: BoxTab,          tier: 1 },
  'AUDIO':        { component: AudioTab,        tier: 1 },
  'TECH':         { component: TechTab,         tier: 2 },
  'AI_AGENCY':    { component: AiAgencyTab,     tier: 2 },
  'CRE_FLIP':     { component: CreTab,          tier: 2 },
  'FRANCHISE':    { component: FranchiseTab,    tier: 2 },
  'CRYP':         { component: CrpTab,          tier: 3 },
  'TOUR':         { component: TourTab,         tier: 3 },
  'PE_ROLLUP':    { component: PeTab,           tier: 3 },
  'ART_SPEC':     { component: ArtTab,          tier: 3 },
  'MOV':          { component: MovTab,          tier: 4 },
  'HF':           { component: HfTab,           tier: 4 },
  'AI':           { component: AiTab,           tier: 4 },
  'CONGLOMERATE': { component: ConglomerateTab, tier: 4 },
  'PMC':          { component: PmcTab,          tier: 4 },
  'SOVEREIGN':    { component: SovereignTab,    tier: 4 },
  'BILL':         { component: BillTab,         tier: 4 },
  'PAC':          { component: SuperPacTab,     tier: 5 },
  'BLITZ':        { component: BlitzTab,        tier: 5 },
  'SMEAR':        { component: SmearTab,        tier: 5 },
  'ELECTION':     { component: ElectionTab,     tier: 5 },
};

const GameInterface = () => {
  const game = useGame();
  const {
    pl, prs, ass, mkt, news, tab, setTab, imp, rain, mod, cancelIntro, fatalTragedyMessage, gBusy, displayBag, alias, age, cap, isTierUnlocked, peaks, selTier, setSelTier, isBreakdownActive, shakeActive, rDischarge, karmaFlags, generationCount, performHardReset
  } = game || {};


  if (!game) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;

  const handleHardReset = () => {
    performHardReset();
  };

  const busy = gBusy || imp?.some(i => !i.w);

  const karmaScore = karmaFlags ? 100 - (Object.values(karmaFlags).filter(Boolean).length * 15) : 100;
  const cancelIntroStyles = { userSelect: 'none', pointerEvents: 'none' };

  if (cancelIntro) {
    return (
      <div className="min-h-screen bg-black text-white font-hack flex flex-col items-center justify-center p-4 text-center animate-shake-hard select-none" style={cancelIntroStyles}>
        <div className="text-8xl mb-6 animate-pulse">🚫</div>
        <h1 className="text-6xl font-black text-red-500 mb-4 tracking-widest drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] font-hype">CANCELLED</h1>
        <p className="text-slate-300 drop-shadow-sm text-xl max-w-sm leading-relaxed mb-6">{cancelIntro?.r}</p>
        <p className="text-pink-400 font-bold text-lg italic">"{cancelIntro?.i}"</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${prs?.r ? 'bg-oval' : ass?.mans ? 'bg-mansion' : ass?.pent ? 'bg-penthouse' : 'bg-basement'} ${shakeActive ? 'animate-shake-hard' : ''} ${(pl?.aura || 0) < 20 ? 'aura-panic' : ''}`}>


      {isBreakdownActive && (
        <div className="fixed inset-0 bg-purple-900/90 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-black border-4 border-purple-500 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_100px_rgba(168,85,247,0.5)] animate-pulse">
            <div className="text-6xl mb-4">🧠💥</div>
            <h2 className="text-3xl font-black text-purple-400 mb-4 tracking-tighter">TOTAL NERVOUS BREAKDOWN</h2>
            <p className="text-slate-300 drop-shadow-sm mb-8 text-sm leading-relaxed">
              Your mind has buckled under the pressure of the hustle. You've been admitted to a luxury wellness retreat for mandatory recovery.
            </p>
            <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-xl mb-8 text-left text-xs space-y-2">
              <div className="flex justify-between"><span>Time Lost:</span><span className="text-purple-300">1 Month</span></div>
              <div className="flex justify-between"><span>Retreat Fee:</span><span className="text-red-400">-$300</span></div>
              <div className="flex justify-between"><span>Mental Recovery:</span><span className="text-green-400">50%</span></div>
            </div>
            <button
              onClick={rDischarge}
              className="w-full py-4 bg-purple-600 text-white font-black tracking-widest rounded-xl hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 duration-100"
            >
              DISCHARGE FROM WELLNESS CARE
            </button>
          </div>
        </div>
      )}

      {mod?.s && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className={`p-8 w-full max-w-sm ${mod?.ui} text-center shadow-[0_0_50px_rgba(0,0,0,1)]`}>
            <h2 className="text-3xl font-black mb-4 text-white tracking-widest">{mod?.t}</h2>
            <p className="mb-8 text-slate-300 drop-shadow-sm text-lg">{mod?.m}</p>
            <div className="flex flex-col gap-3">{mod?.o?.map((o, i) => <button key={i} onClick={o.action} className="p-4 bg-slate-800 border border-slate-600 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">{o.label}</button>)}</div>
          </div>
        </div>
      )}

      <Hud />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-16">
        <div key={tab + selTier} className="max-w-xl mx-auto animate-fadeIn">
          {(() => {
            const cfg = TAB_MAP[tab];
            if (!cfg) return null;
            const Component = cfg.component;
            if (cfg.tier !== undefined && !isTierUnlocked?.(cfg.tier)) {
              return <LockedTierScreen section={cfg.tier} />;
            }
            return <Component />;
          })()}

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700 my-6">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold tracking-widest mb-2 text-center uppercase">📡 REAL WORLD MONITOR</div>
            <div className={`text-center font-black text-sm mb-1 ${mkt === 1 ? 'text-green-400' : mkt === 2 ? 'text-red-400' : mkt === 3 ? 'text-purple-400' : 'text-white'}`}>{MARKETS[mkt]?.n || 'NORMAL'}</div>
            <p className="text-slate-300 drop-shadow-sm text-[10px] text-center">{MARKETS[mkt]?.desc}</p>
          </div>
        </div>
      </div>

      <NewsTicker />
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const GameIntro = () => {
  const { setPh } = useGame();
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-hack">
      <div className="max-w-md w-full bg-slate-900 border-2 border-blue-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        {page === 1 ? (
          <>
            <h2 className="text-3xl font-black text-blue-400 mb-8 uppercase tracking-widest font-hype">THE BRIEFING: PAGE 1</h2>
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">1. THE STREET TRINITY</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  <span className="text-green-400 font-bold">CASH</span> buys assets, <span className="text-red-400 font-bold">CLOUT</span> unlocks tiers, <span className="text-yellow-400 font-bold">AURA</span> scales passive multipliers. Balance all three to escape the Mud.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">2. THE TICKING CLOCK</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  You start at Age 18. Every cycle advances months. You are racing against time to build an empire before you age out.
                </p>
              </div>
            </div>
            <button onClick={() => setPage(2)} className="w-full mt-12 py-4 bg-blue-600 text-white font-black tracking-widest rounded-xl hover:bg-blue-500 transition-all active:scale-95 duration-100">NEXT PAGE →</button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-black text-blue-400 mb-8 uppercase tracking-widest font-hype">THE BRIEFING: PAGE 2</h2>
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">3. MENTAL CAPITAL & REHAB</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  Active hustle clicks drain your neon-violet <span className="text-purple-400 font-bold">Mental Health</span> bar. Passive months restore +15. Hitting 0 triggers a complete Nervous Breakdown, forcing a 1-month rehab stay and a $300 fee.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">4. THE MACRO SHADOW</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  Watch the Real World Monitor. States like Normal, Boom, or Crackdown shift your risks. Advanced tiers introduce 'Heat' where reckless operations invite regulatory raids.
                </p>
              </div>
            </div>
            <button onClick={() => setPh('PLAYING')} className="w-full mt-12 py-4 bg-green-600 text-black font-black tracking-widest rounded-xl hover:bg-green-500 transition-all active:scale-95 duration-100 shadow-[0_0_20px_rgba(34,197,94,0.4)]">BEGIN HUSTLE</button>
          </>
        )}
      </div>
    </div>
  );
};

const BagChaserInner = () => {
  const { ph, death, cancelIntro, fatalTragedyMessage, setFatalTragedyMessage, setDeath } = useGame();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {fatalTragedyMessage && (
        <div className="fixed inset-0 bg-black z-[300] flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border-4 border-red-600 rounded-3xl p-8 text-center shadow-[0_0_100px_rgba(220,38,38,0.5)]">
            <div className="text-7xl mb-6">💥</div>
            <h2 className="text-4xl font-black text-red-500 mb-4 tracking-tighter font-hype">THE FATAL BLOW</h2>
            <div className="h-0.5 w-full bg-red-600/30 my-6"></div>
            <p className="text-white text-xl font-bold leading-relaxed mb-8">
              {fatalTragedyMessage}
            </p>
            <button
              className="w-full py-5 bg-red-600 text-white font-black tracking-widest text-xl rounded-2xl hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all"
            >
              REVIEW YOUR LEGACY
            </button>
          </div>
        </div>
      )}
      {death       && !cancelIntro && !fatalTragedyMessage ? <AutopsyReport /> : null}
      {!death      && ph === 'PROLOGUE' ? <Prologue /> : null}
      {!death      && ph === 'PROLOGUE_INTRO' ? <GameIntro /> : null}
      {!death      && ph === 'PLAYING'  ? <GameInterface /> : null}
    </>
  );
};

export default function BagChaserV2() {
  return (
    <GameProvider>
      <BagChaserInner />
    </GameProvider>
  );
}