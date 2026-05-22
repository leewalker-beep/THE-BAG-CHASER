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
    'AUDIO': { label: 'Indie Audio Syndicate', icon: '🎵', stub: true },
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
    'PMC': { label: 'Private Military', icon: '🎖️', stub: true },
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
          TAKE A BREAK (+50 MH, ADVANCE 1 MO)
        </button>
      </div>

      <div className="grid grid-cols-1">
        <button
          onClick={() => { setSelTier('flexShop'); setTab('HUB'); }}
          className="w-full py-4 bg-blue-900/40 border-2 border-blue-500 rounded-xl font-black text-blue-400 tracking-widest hover:bg-blue-800/40 transition-all active:scale-95 duration-100 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">💎</span>
          ENTER THE FLEX SHOP
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

const SwTab = () => {
  const { pl, setPl, up, sw, setSw, dUp, rSw, adv, karmaFlags, setKarmaFlags } = useGame();

  const dropCost = React.useMemo(() => {
    return (sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a);
  }, [sw.u, sw.i, up.swFlg, sw.a]);

  const handleGlobalSupply = async () => {
    await new Promise(r => setTimeout(r, 2000));
    const roll = Math.random(); let rev = 0; let msg = '';
    if (roll < 0.12) { rev = Math.floor(1000000 * (0.1 + Math.random() * 0.3)); msg = 'PR nightmare. Recalls overseas. Net +$' + fMny(rev - 1000000); }
    else if (roll < 0.35) { rev = Math.floor(1000000 * (1.2 + Math.random() * 0.8)); msg = 'Slow month. Global retail net +$' + fMny(rev - 1000000); }
    else if (roll < 0.80) { rev = Math.floor(1000000 * (2.5 + Math.random() * 1.5)); msg = 'Units moved worldwide. Net +$' + fMny(rev - 1000000); }
    else { rev = Math.floor(1000000 * (5 + Math.random() * 3)); msg = 'VIRAL SELLOUT GLOBALLY! Net +$' + fMny(rev - 1000000); }
    console.log(msg);
    setPl(p => ({ ...p, bag: p.bag - 1000000 + rev }));
    adv(); return rev - 1000000;
  };

  return (
    <LabShell hustleKey="streetwear" t="STREETWEAR LAB" c="purple" fontCls="font-hype" tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">USE CHEAP BLANKS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, usedCheapBlanks: !f.usedCheapBlanks }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.usedCheapBlanks ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.usedCheapBlanks ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hustle Cost</div>
        <div className="text-xs font-black text-purple-400">15 MENTAL HEALTH</div>
      </div>
      {!up.swIp
        ? <UpgBtn onClk={() => dUp('swIp', 250000, 'IP Secured. 📜')} cost={250000} title="BUY IP" pB={pl.bag} />
        : !up.swFlg
        ? <UpgBtn onClk={() => dUp('swFlg', 5000000, 'Flagship Opened! 🏬')} cost={5000000} title="SOHO FLAGSHIP" reqA={150} pB={pl.bag} pA={pl.aura} />
        : !up.swPar
        ? <UpgBtn onClk={() => dUp('swPar', 25000000, 'Paris Debut. 🗼')} cost={25000000} title="PARIS FASHION WEEK" reqA={300} reqC={100} pB={pl.bag} pA={pl.aura} pC={pl.clout} />
        : <UpgBtn onClk={() => dUp('swGlb', 150000000, 'Global. Aura bleeding. 🌍')} cost={150000000} title="GLOBAL DISTRIBUTION" unl={up.swGlb} pB={pl.bag} />
      }
      {up.swGlb ? (
        <FlashBtn onClick={handleGlobalSupply} label="SUPPLY GLOBAL - COST: $1M" />
      ) : <>
        <Toggles opts={['Tees', 'Hoodies', 'Puffers']} active={sw.i} setVal={v => setSw(s => ({ ...s, i: v }))} color="purple" />
        <Stepper val={sw.u} setVal={v => setSw(s => ({ ...s, u: v }))} min={10} max={up.swPar ? 50000 : up.swFlg ? 10000 : 2500} step={50} label="Units" isCurr={false} />
        <Stepper val={sw.p} setVal={v => setSw(s => ({ ...s, p: v }))} min={15} max={up.swPar ? 2500 : up.swFlg ? 1000 : 500} step={5} label="Price" />
        {!up.swFlg && <Stepper val={sw.a} setVal={v => setSw(s => ({ ...s, a: v }))} min={0} max={250000} step={5000} label="Ad Spend" />}
        <FlashBtn onClick={rSw} costStm={15} dis={pl.bag < dropCost} label={`DROP - $${fMny(dropCost)}`} />
      </>}
    </LabShell>
  );
};

const VintageTab = () => {
  const { pl, rVintage, rVinCh, vinCh, setTab, karmaFlags, setKarmaFlags } = useGame();
  return (
    <LabShell hustleKey="vintage" t="VINTAGE RESELLING" c="amber" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">SELL BOOTLEGS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, soldBootleg: !f.soldBootleg }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.soldBootleg ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.soldBootleg ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hustle Cost</div>
        <div className="text-xs font-black text-purple-400">10 MENTAL HEALTH</div>
      </div>
      <div className="flex flex-col gap-4">
        {vinCh === 'bootleg' ? (
          <div className="bg-red-900/40 border-2 border-red-500 p-4 rounded-xl flex flex-col gap-3 animate-pulse">
            <h4 className="text-red-400 font-black text-center uppercase">⚠️ BOOTLEG SPOTTED!</h4>
            <p className="text-[10px] text-slate-300 drop-shadow-sm text-center italic">The "Grail" you found is a high-quality replica. How do you handle it?</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => rVinCh('burn')} className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-[10px] font-bold uppercase active:scale-95 transition-transform duration-100">Burn It Legally (+$0, +2 Aura)</button>
              <button onClick={() => rVinCh('pass')} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg text-[10px] font-bold uppercase active:scale-95 transition-transform duration-100">Pass It Off (+$150, -10 Aura)</button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Inventory Status</div>
              <div className="text-xl font-black text-amber-400">SOURCING PHASE</div>
            </div>
            <FlashBtn
              onClick={rVintage}
              costStm={10}
              dis={pl.bag < 50}
              label="HIT THE CLOTHING BINS ($50)"
              color="amber-600"
              txt="white"
            />
          </>
        )}
      </div>
    </LabShell>
  );
};

const SmmTab = () => {
  const { pl, smmClients, clientCrisis, rSmmPitch, rSmmFix, setTab, karmaFlags, setKarmaFlags } = useGame();
  return (
    <LabShell hustleKey="smm" t="SMM MICRO-AGENCY" c="sky" fontCls="font-tech" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">IGNORE CLIENT CRISIS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, ignoredSmmCrisis: !f.ignoredSmmCrisis }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.ignoredSmmCrisis ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.ignoredSmmCrisis ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Pitch Cost</div>
        <div className="text-xs font-black text-purple-400">20 MENTAL HEALTH</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className={`bg-black/40 p-4 rounded-xl border transition-all text-center ${clientCrisis ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
          <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Active Portfolio</div>
          <div className={`text-2xl font-black ${clientCrisis ? 'text-red-500' : 'text-sky-400'}`}>{smmClients} CLIENTS</div>
          <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">Yield: +${fMny(smmClients * 300)}/mo | +{smmClients * 2} Aura/mo</div>
        </div>

        {clientCrisis && (
          <div className="ui-crisis p-4 flex flex-col gap-2">
            <h4 className="text-red-500 font-black text-center text-xs uppercase">🚨 CLIENT CRISIS: ALGORITHM SHIFT!</h4>
            <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">Clients are panicking. Fix it now or lose 1 retainer next month.</p>
            <FlashBtn
              onClick={rSmmFix}
              costStm={15}
              label="FIX CONTENT STRATEGY"
              color="red-600"
              txt="white"
            />
          </div>
        )}

        <FlashBtn
          onClick={rSmmPitch}
          costStm={20}
          dis={pl.clout < 15 || clientCrisis}
          label={clientCrisis ? "🔒 CRISIS: SOLVE TO PITCH" : pl.clout >= 15 ? "PITCH LOCAL BUSINESS" : "🔒 NEED 15 CLOUT TO PITCH"}
          color="sky-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">"Flat 50% success rate. Street leverage is everything."</p>
      </div>
    </LabShell>
  );
};

const DropTab = () => {
  const { pl, up, drp, setDrp, dUp, rDrp, setTab, karmaFlags, setKarmaFlags } = useGame();
  const adCost = React.useMemo(() => (drp.u * 10) + drp.a, [drp.u, drp.a]);
  return (
    <LabShell hustleKey="dropship" t="DROPSHIPPING" c="blue" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">IGNORE REFUNDS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, ignoredRefunds: !f.ignoredRefunds }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.ignoredRefunds ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.ignoredRefunds ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Setup Cost</div>
        <div className="text-xs font-black text-purple-400">10 MENTAL HEALTH</div>
      </div>
      <UpgBtn onClk={() => dUp('drpFac', 250000, 'Factory Secured. 🏭')} cost={250000} title="PRIVATE LABEL FACTORY" unl={up.drpFac} pB={pl.bag} />
      <Toggles opts={['LEDs', 'Fake Pods', 'Supps']} active={drp.i} setVal={v => setDrp(s => ({ ...s, i: v }))} color="blue-600" />
      <Stepper val={drp.u} setVal={v => setDrp(s => ({ ...s, u: v }))} min={50} max={10000} step={250} label="Units" isCurr={false} />
      <Stepper val={drp.p} setVal={v => setDrp(s => ({ ...s, p: v }))} min={15} max={up.drpFac ? 250 : 150} step={5} label="Price" />
      <Stepper val={drp.a} setVal={v => setDrp(s => ({ ...s, a: v }))} min={0} max={500000} step={5000} label="Ad Budget" />
      <FlashBtn onClick={rDrp} costStm={10} dis={pl.bag < adCost} label={`LAUNCH AD - $${fMny(adCost)}`} />
    </LabShell>
  );
};

const TechFlipTab = () => {
  const { pl, techItem, techFlipsComplete, rTechSource, rTechFixA, rTechFixB, setTab, karmaFlags, setKarmaFlags } = useGame();
  return (
    <LabShell hustleKey="tech" t="TECH FLIPPING" c="cyan" fontCls="font-tech" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">USE CHEAP PARTS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, usedCheapParts: !f.usedCheapParts }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.usedCheapParts ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.usedCheapParts ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Repair Cost</div>
        <div className="text-xs font-black text-purple-400">10-15 MENTAL HEALTH</div>
      </div>
      <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center mb-4">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hardware Mastery</div>
        <div className="text-2xl font-black text-cyan-400">{techFlipsComplete} FLIPS</div>
      </div>

      {!techItem ? (
        <FlashBtn
          onClick={rTechSource}
          dis={pl.bag < 150}
          label="SOURCE BRICKED UNIT ($150)"
          color="cyan-600"
          txt="white"
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-cyan-900/20 border border-cyan-700 p-3 rounded-lg text-center">
            <div className="text-xs font-bold text-cyan-400 uppercase">Item Sourced: {techItem.name}</div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <FlashBtn
              onClick={rTechFixA}
              costStm={10}
              dis={pl.bag < 30}
              label="CHEAP PARTS ($30, 50% WIN)"
              color="slate"
              txt="white"
            />
            <FlashBtn
              onClick={rTechFixB}
              costStm={15}
              dis={pl.bag < 100}
              label="PREMIUM OEM PARTS ($100, 100% WIN)"
              color="cyan-600"
              txt="white"
            />
          </div>
        </div>
      )}
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"Cheap parts risk bricking the unit and losing Aura."</p>
    </LabShell>
  );
};

const GigTab = () => {
  const { pl, runnerCount, runnerBurnout, rRunnerRecruit, rRunnerFix, setTab, karmaFlags, setKarmaFlags } = useGame();
  return (
    <LabShell hustleKey="runners" t="GIG RUNNER NETWORK" c="orange" fontCls="font-tech" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">IGNORE RUNNER WELFARE (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, ignoredRunnerWelfare: !f.ignoredRunnerWelfare }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.ignoredRunnerWelfare ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.ignoredRunnerWelfare ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Recruit Cost</div>
        <div className="text-xs font-black text-purple-400">25 MENTAL HEALTH</div>
      </div>
      <div className={`bg-black/40 p-4 rounded-xl border transition-all text-center mb-4 ${runnerBurnout ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Active Fleet</div>
        <div className={`text-2xl font-black ${runnerBurnout ? 'text-red-500' : 'text-orange-400'}`}>{runnerCount} COURIERS</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">Yield: +${fMny(runnerCount * 150)}/mo | +{runnerCount * 3} Aura/mo</div>
      </div>

      {runnerBurnout && (
        <div className="ui-crisis p-4 flex flex-col gap-2 mb-4">
          <h4 className="text-red-500 font-black text-center text-xs uppercase">🚨 FLEET BURNOUT!</h4>
          <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">Runners are exhausted. Pay a bonus or lose 1 courier next month.</p>
          <FlashBtn
            onClick={rRunnerFix}
            dis={pl.bag < 200}
            label="PAY $200 BONUS"
            color="red-600"
            txt="white"
          />
        </div>
      )}

      <FlashBtn
        onClick={rRunnerRecruit}
        costStm={25}
        dis={pl.clout < 20 || pl.bag < 300 || runnerBurnout}
        label={runnerBurnout ? "🔒 RESOLVE BURNOUT" : pl.clout >= 20 ? "RECRUIT COURIER ($300)" : "🔒 NEED 20 CLOUT"}
        color="orange-600"
        txt="white"
      />
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"High mentalHealth cost to vet and onboard new runners."</p>
    </LabShell>
  );
};

const CcTab = () => {
  const { pl, up, cc, setCc, dUp, rCc, setTab } = useGame();
  return (
    <LabShell t="CREATOR LAB" c="emerald" fontCls="font-tech" onHub={() => setTab('HUB')} tier={1}>
      {!up.ccAge
        ? <UpgBtn onClk={() => dUp('ccAge', 1000000, 'Agency launched. 🤝')} cost={1000000} title="TALENT AGENCY" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('ccNet', 20000000, 'Network Launched! 📺')} cost={20000000} title="STREAMING NETWORK" unl={up.ccNet} reqC={150} pB={pl.bag} pC={pl.clout} />
      }
      <div className="flex bg-slate-800 p-1 rounded-xl mb-2">
        <button onClick={() => setCc(c => ({ ...c, m: 'solo' }))} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'solo' ? 'bg-emerald-600 text-white' : 'text-slate-300 drop-shadow-sm'}`}>SOLO</button>
        <button onClick={() => { if (pl.bag >= 100000 && pl.clout >= 50) setCc(c => ({ ...c, m: 'house' })); }} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'house' ? 'bg-emerald-600 text-white' : pl.bag >= 100000 && pl.clout >= 50 ? 'text-slate-300 drop-shadow-sm' : 'text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.bag >= 100000 && pl.clout >= 50 ? 'HOUSE' : '🔒 ($100K/50C)'}</button>
      </div>
      {cc.m === 'house' ? <>
        <Toggles opts={['Drama', 'Gaming', 'Lifestyle']} active={cc.v} setVal={v => setCc(s => ({ ...s, v }))} color="emerald-600" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <FlashBtn onClick={() => rCc('feu')} dis={pl.bag < 25000} label="FEUD ($25K)" color="emerald-600" txt="white" />
          <FlashBtn onClick={() => rCc('mch')} dis={pl.bag < 25000} label="COLLAB ($25K)" />
        </div>
        {up.ccAge && !up.ccNet && <FlashBtn onClick={() => rCc('meg')} label="MEGA-DEAL ($0)" color="purple" txt="white" />}
        {up.ccNet && <FlashBtn onClick={() => rCc('net')} label="COLLECT SUBS ($0)" color="yellow-600" txt="white" />}
      </> : <>
        <Toggles opts={['Brainrot', 'Finance', 'IRL']} active={cc.n} setVal={v => setCc(s => ({ ...s, n: v }))} color="emerald-600" />
        <FlashBtn onClick={() => rCc('sol')} dis={pl.bag < 500} label="STREAM - $500" />
      </>}
    </LabShell>
  );
};

const PodTab = () => {
  const { pl, up, pod, setPod, dUp, rPod, setTab } = useGame();
  const recCost = React.useMemo(() => (up.podCmp ? 0 : pod.q) + (pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000), [up.podCmp, pod.q, pod.g]);
  return (
    <LabShell t="PODCAST NET" c="pink" onHub={() => setTab('HUB')} tier={1}>
      <UpgBtn onClk={() => dUp('podCmp', 500000, 'Compound Built. 🎙️')} cost={500000} title="BUILD COMPOUND" unl={up.podCmp} pB={pl.bag} />
      <div className="flex gap-1 w-full">
        <button onClick={() => setPod(s => ({ ...s, g: 1 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 1 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Z-List</button>
        <button onClick={() => { if (pl.clout >= 50) setPod(s => ({ ...s, g: 2 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 2 ? 'bg-pink-600 text-white' : pl.clout >= 50 ? 'bg-slate-800 text-slate-300 drop-shadow-sm' : 'bg-slate-900 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.clout >= 50 ? 'Drama' : '🔒(50C)'}</button>
        <button onClick={() => { if (pl.clout >= 100) setPod(s => ({ ...s, g: 3 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 3 ? 'bg-pink-600 text-white' : pl.clout >= 100 ? 'bg-slate-800 text-slate-300 drop-shadow-sm' : 'bg-slate-900 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.clout >= 100 ? 'A-List' : '🔒(100C)'}</button>
        {up.podCmp && <button onClick={() => setPod(s => ({ ...s, g: 4 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 4 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Billionaire</button>}
      </div>
      {!up.podCmp && <Stepper val={pod.q} setVal={v => setPod(s => ({ ...s, q: v }))} min={10000} max={100000} step={10000} label="Studio Rental" />}
      <FlashBtn onClick={rPod} dis={pl.bag < recCost} label={`RECORD - $${fMny(recCost)}`} />
    </LabShell>
  );
};

const BoxTab = () => {
  const { pl, up, box, setBox, dUp, rBox, setTab } = useGame();
  const fightCost = React.useMemo(() => (up.boxBrd ? 0 : box.b) + (up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000)), [up.boxBrd, box.b, up.boxLg, box.v]);
  return (
    <LabShell t="FIGHT PROMOTER" c="orange" onHub={() => setTab('HUB')} tier={1}>
      {!up.boxLg
        ? <UpgBtn onClk={() => dUp('boxLg', 2000000, 'League Founded. 🥊')} cost={2000000} title="FOUND LEAGUE" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('boxBrd', 15000000, 'Network Deal! 📺')} cost={15000000} title="BROADCAST DEAL" unl={up.boxBrd} reqC={125} pB={pl.bag} pC={pl.clout} />
      }
      {!up.boxLg && <Toggles opts={['Basement', 'Arena', 'Stadium']} active={box.v} setVal={v => setBox(s => ({ ...s, v }))} color="orange-600" />}
      <Toggles opts={up.boxLg ? ['Scrap', 'MMAvYT', 'Pro', 'Super'] : ['Scrap', 'MMAvYT', 'Pro']} active={box.t} setVal={v => setBox(s => ({ ...s, t: v }))} color="orange-600" />
      {!up.boxBrd && <Stepper val={box.b} setVal={v => setBox(s => ({ ...s, b: v }))} min={box.t === 4 ? 10000000 : 50004} max={box.t === 4 ? 50000000 : 5000000} step={50000} label="Promo Budget" />}
      <Toggles opts={['Respectful', 'Script Brawl']} active={box.p} setVal={v => setBox(s => ({ ...s, p: v }))} color="orange-600" />
      <FlashBtn onClick={rBox} dis={pl.bag < fightCost} label={up.boxBrd ? 'HOST NETWORK FIGHT ($0)' : `HOST - $${fMny(fightCost)}`} />
    </LabShell>
  );
};

const TourTab = () => {
  const { pl, up, tur, setTur, dUp, rTur, setTab } = useGame();
  return (
    <LabShell t="LIVE EVENTS" c="teal" onHub={() => setTab('HUB')} tier={3}>
      <UpgBtn onClk={() => dUp('trFst', 150000000, 'Mega Festival Secured. 🎪')} cost={150000000} title="OWN MEGA-FESTIVAL" unl={up.trFst} pB={pl.bag} reqC={200} pC={pl.clout} />
      <Toggles opts={['Club', 'Arena', 'Stadium']} active={tur.t} setVal={v => setTur(t => ({ ...t, t: v }))} color="teal-600" />
      <Stepper val={tur.m} setVal={v => setTur(t => ({ ...t, m: v }))} min={50000} max={10000000} step={50000} label="Marketing" />
      <Stepper val={tur.a} setVal={v => setTur(t => ({ ...t, a: v }))} min={10000} max={5000000} step={10000} label="Artist Fees" />
      <Stepper val={tur.l} setVal={v => setTur(t => ({ ...t, l: v }))} min={50000} max={5000000} step={50000} label="Logistics" />
      <FlashBtn onClick={rTur} dis={pl.bag < tur.m + tur.a + tur.l} label={`LAUNCH ${up.trFst ? 'FESTIVAL' : 'TOUR'} - $${fMny(tur.m + tur.a + tur.l)}`} />
    </LabShell>
  );
};

const TechTab = () => {
  const { pl, saasUsers, saasPrice, saasChurn, saasPenaltyActive, techFlipsComplete, rSaasClick, setTab } = useGame();
  const locked = (pl?.bag || 0) < 1000000 || (pl?.clout || 0) < 150 || (pl?.aura || 0) < 50;

  if (locked) return <LockedTierScreen section={2} />;

  const speedBoost = techFlipsComplete >= 10;
  const mrr = saasUsers * saasPrice * (saasPenaltyActive ? 0.5 : 1);

  return (
    <LabShell t="SAAS AUTOMATION" c="cyan" fontCls="font-tech" onHub={() => setTab('HUB')} tier={2}>
      <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center mb-4">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Monthly Recurring Revenue</div>
        <div className="text-2xl font-black text-cyan-400">${fMny(mrr)}/mo</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          {saasUsers.toLocaleString()} Users @ ${saasPrice}/mo | {(saasChurn * 100).toFixed(0)}% Churn
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Server Costs</div>
          <div className="text-lg font-black text-red-400">-${fMny(saasUsers * 2)}/mo</div>
        </div>

        <FlashBtn
          onClick={rSaasClick}
          costStm={20}
          dis={pl.bag < 5000}
          label="MARKETING PUSH ($5,000)"
          color="cyan-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">
          {speedBoost ? "Hardware Mastery boosting acquisition by 20%." : "Master 10 Tech Flips to boost user acquisition."}
        </p>
      </div>
    </LabShell>
  );
};

const AiAgencyTab = () => {
  const { pl, corpClients, apiLockoutMonths, rAiAgencyClick, setTab } = useGame();
  const locked = pl.bag < 1000000 || pl.clout < 150 || pl.aura < 100;

  if (locked) return <LockedTierScreen section={2} />;

  const growthPerTick = corpClients * (10 + Math.floor(pl.clout / 20));

  return (
    <LabShell t="AI MARKETING AGENCY" c="indigo" fontCls="font-tech" onHub={() => setTab('HUB')} tier={2}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${apiLockoutMonths > 0 ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Corporate Clients</div>
        <div className={`text-2xl font-black ${apiLockoutMonths > 0 ? 'text-red-500' : 'text-indigo-400'}`}>{corpClients} RETAINERS</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          {apiLockoutMonths > 0 ? `API LOCKOUT: ${apiLockoutMonths} MO REMAINING` : `Passive: +$${fMny(corpClients * 8000)}/mo`}
        </div>
        {corpClients > 0 && !apiLockoutMonths && (
          <div className="mt-2 pt-2 border-t border-slate-800">
            <div className="text-[9px] text-cyan-400 font-bold uppercase">SaaS Multiplier Active</div>
            <div className="text-[9px] text-slate-300">+ {growthPerTick} Passive Users / month</div>
            <div className="text-[9px] text-red-400">Ad Spend: -$10K/mo</div>
          </div>
        )}
      </div>

      <FlashBtn
        onClick={rAiAgencyClick}
        costStm={15}
        dis={pl.bag < 2500 || apiLockoutMonths > 0}
        label={apiLockoutMonths > 0 ? "LOCKOUT ACTIVE" : "DEPLOY AI SCRAPING LEAD BOTS ($2,500)"}
        color="indigo-600"
        txt="white"
      />
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"40% success rate per deployment. Watch for API Poisoning."</p>
    </LabShell>
  );
};

const CreTab = () => {
  const { pl, creOfficeCount, creRetailCount, mkt, rCreBuyOffice, rCreBuyRetail, setTab } = useGame();
  const locked = pl.bag < 15000000 || pl.clout < 200 || pl.aura < 250;
  const isVulnerable = mkt === 2 || mkt === 3;

  if (locked) return <LockedTierScreen section={2} />;

  const grossYield = (creOfficeCount * 45000) + (creRetailCount * 15000);
  const totalMortgage = (creOfficeCount * 20000) + (creRetailCount * 5000);

  return (
    <LabShell t="COMMERCIAL REAL ESTATE" c="slate" fontCls="font-hype" onHub={() => setTab('HUB')} tier={2}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${isVulnerable ? 'border-red-500' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Portfolio Yield</div>
        <div className={`text-2xl font-black ${isVulnerable ? 'text-red-500' : 'text-white'}`}>
          ${fMny(isVulnerable ? 0 : grossYield)}/mo
        </div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          Mortgage: -${fMny(totalMortgage)}/mo | Net: ${fMny((isVulnerable ? 0 : grossYield) - totalMortgage)}/mo
        </div>
        {isVulnerable && (
          <div className="text-[9px] text-red-500 font-bold uppercase mt-1 animate-pulse">
            ⚠️ MARKET CRISIS: VACANCY RISK 100%
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Office Towers</div>
          <div className="text-xl font-black text-white">{creOfficeCount}</div>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Retail Strips</div>
          <div className="text-xl font-black text-white">{creRetailCount}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FlashBtn
          onClick={rCreBuyOffice}
          costStm={30}
          dis={pl.bag < 15000000}
          label="BUY OFFICE TOWER ($15M)"
          color="slate-100"
          txt="black"
        />
        <FlashBtn
          onClick={rCreBuyRetail}
          costStm={30}
          dis={pl.bag < 5000000}
          label="BUY RETAIL STRIP ($5M)"
          color="slate-600"
          txt="white"
        />
      </div>
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">
        "Assets subject to background vacancy risk and market volatility."
      </p>
    </LabShell>
  );
};

const FranchiseTab = () => {
  const { pl, franchiseCount, unionStrikeActive, supplyChainDisruption, rFranchiseClick, rResolveUnionStrike, rResolveSupplyChain, setTab } = useGame();
  const locked = pl.bag < 5000000 || pl.clout < 300 || pl.aura < 200;

  if (locked) return <LockedTierScreen section={2} />;

  const isHalted = unionStrikeActive || supplyChainDisruption;

  return (
    <LabShell t="NATIONAL FRANCHISE" c="yellow" fontCls="font-hype" onHub={() => setTab('HUB')} tier={2}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${isHalted ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Territories</div>
        <div className={`text-2xl font-black ${isHalted ? 'text-red-500' : 'text-yellow-400'}`}>{franchiseCount} UNITS</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          {unionStrikeActive ? "UNION STRIKE: INCOME HALTED" : supplyChainDisruption ? "SUPPLY CHAIN SHOCK: INCOME HALTED" : `Passive: +$${fMny(franchiseCount * 25000)}/mo`}
        </div>
      </div>

      {unionStrikeActive ? (
        <div className="flex flex-col gap-2">
          <button onClick={() => rResolveUnionStrike('settle')} className="w-full py-3 bg-green-600 text-white font-black text-xs rounded-xl hover:bg-green-500 active:scale-95 transition-all duration-100">PAY $100,000 WAGE SETTLEMENT</button>
          <button onClick={() => rResolveUnionStrike('ignore')} className="w-full py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-500 active:scale-95 transition-all duration-100">IGNORE (AURA PENALTY)</button>
        </div>
      ) : supplyChainDisruption ? (
        <div className="flex flex-col gap-2">
          <FlashBtn
            onClick={rResolveSupplyChain}
            dis={pl.bag < 2000000}
            label="STABILIZE LOGISTICS ($2M)"
            color="red-600"
            txt="white"
          />
        </div>
      ) : (
        <FlashBtn
          onClick={rFranchiseClick}
          costStm={25}
          dis={pl.bag < 500000}
          label="ACQUIRE FAST FOOD TERRITORY ($500,000)"
          color="yellow-500"
          txt="black"
        />
      )}
    </LabShell>
  );
};

const PeTab = () => {
  const { pl, peProgress, guttedFirms, supplyChainDisruption, peCompoundingYield, rPeClick, rResolveSupplyChain, setTab } = useGame();
  const locked = pl.bag < 50000000 || pl.clout < 450 || pl.aura < 400;

  if (locked) return <LockedTierScreen section={3} />;

  const basePassive = guttedFirms * 100000;
  const currentPassive = supplyChainDisruption ? -500000 : Math.floor(basePassive * peCompoundingYield);

  return (
    <LabShell t="PRIVATE EQUITY" c="slate" fontCls="font-tech" onHub={() => setTab('HUB')} tier={3}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${supplyChainDisruption ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Portfolio</div>
        <div className="text-2xl font-black text-slate-100">{guttedFirms} FIRMS GUTTED</div>
        <div className={`text-[10px] font-bold mt-1 ${currentPassive >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          Yield: ${fMny(currentPassive)}/mo
        </div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm">
          Dividend Multiplier: {peCompoundingYield.toFixed(2)}x
        </div>
      </div>

      {supplyChainDisruption && (
        <div className="ui-crisis p-4 flex flex-col gap-2 mb-4">
          <h4 className="text-red-500 font-black text-center text-xs uppercase">🚨 SUPPLY CHAIN DISRUPTION!</h4>
          <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">National franchise operations are frozen. Overhead is spiking.</p>
          <FlashBtn
            onClick={rResolveSupplyChain}
            dis={pl.bag < 2000000}
            label="STABILIZE LOGISTICS ($2M)"
            color="red-600"
            txt="white"
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase px-1">
          <span>Buyout Progress</span>
          <span>{peProgress}%</span>
        </div>
        <div className="bg-black/50 h-3 rounded-full border border-slate-800 overflow-hidden">
          <div className="bg-slate-100 h-full transition-all duration-300" style={{ width: `${peProgress}%` }}></div>
        </div>

        <FlashBtn
          onClick={rPeClick}
          costStm={40}
          dis={pl.bag < 25000000 || supplyChainDisruption}
          label={supplyChainDisruption ? "🔒 RESOLVE DISRUPTION" : "EXECUTE LEVERAGED BUYOUT ($25M)"}
          color="slate-100"
          txt="black"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"Buyouts orchestrated via leveraged debt on national franchises."</p>
      </div>
    </LabShell>
  );
};

const ArtTab = () => {
  const { pl, artHoldings, artMarketSentiment, rArtBuy, rArtAuction, setTab } = useGame();
  const locked = pl.bag < 30000000 || pl.clout < 500 || pl.aura < 450;

  if (locked) return <LockedTierScreen section={3} />;

  const acquisitionCost = Math.floor(10000000 * (1 + artMarketSentiment * 0.5));
  const sentimentLabel = artMarketSentiment > 0.3 ? "🔥 BULLISH" : artMarketSentiment < -0.3 ? "🧊 BEARISH" : "⚖️ NEUTRAL";
  const sentimentColor = artMarketSentiment > 0.3 ? "text-green-400" : artMarketSentiment < -0.3 ? "text-red-400" : "text-slate-300";

  return (
    <LabShell t="ART SPECULATION" c="pink" fontCls="font-hype" onHub={() => setTab('HUB')} tier={3}>
      <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center mb-4">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Market Sentiment</div>
        <div className={`text-2xl font-black ${sentimentColor}`}>{sentimentLabel}</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          Private Collection: {artHoldings} Pieces | +{artHoldings * 20} Clout/mo
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FlashBtn
          onClick={rArtBuy}
          costStm={35}
          dis={pl.bag < acquisitionCost}
          label={`PURCHASE FINE ART ($${fMny(acquisitionCost)})`}
          color="pink-600"
          txt="white"
        />
        <button
          onClick={rArtAuction}
          disabled={artHoldings <= 0}
          className={`w-full py-3 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 duration-100 ${artHoldings > 0 ? 'bg-white text-black hover:bg-gray-200' : 'bg-slate-800 text-slate-300 drop-shadow-sm opacity-40 cursor-not-allowed'}`}
        >
          AUCTION AT SOTHEBY'S
        </button>
      </div>
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"High-volatility asset loops. Market sentiment drastically alters auction results."</p>
    </LabShell>
  );
};

const CrpTab = () => {
  const { pl, crp, setCrp, rCrp, setTab } = useGame();
  return (
    <LabShell t="WEB3 LAB" c="green" fontCls="font-hack" onHub={() => setTab('HUB')} tier={3}>
      {!crp.l ? <>
        <input type="text" value={crp.t} placeholder="$TICKER" onChange={e => setCrp(c => ({ ...c, t: e.target.value }))} className="w-full p-4 bg-black border border-slate-700 rounded font-hack text-green-400 font-bold uppercase text-center" />
        <Stepper val={crp.i} setVal={v => setCrp(c => ({ ...c, i: v }))} min={5000} max={1000000} step={25000} label="Liquidity" />
        <FlashBtn onClick={() => rCrp('dep')} dis={pl.bag < crp.i || !crp.t} label={`DEPLOY - $${fMny(crp.i)}`} />
      </> : <>
        <div className="p-6 bg-green-900/20 border border-green-500 rounded text-center">
          <h4 className="text-3xl font-black text-green-400 mb-2 font-hack">{crp.t}</h4>
          <p className="font-hack text-slate-300 drop-shadow-sm">LP Pool: ${fMny(crp.l)}</p>
        </div>
        <Stepper val={crp.m} setVal={v => setCrp(c => ({ ...c, m: v }))} min={5000} max={250000} step={5000} label="Shill Budget" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <FlashBtn onClick={() => rCrp('shil')} dis={pl.bag < crp.m} label={`SHILL ($${(crp.m / 1000).toFixed(0)}K)`} color="green-600" txt="white" />
          <FlashBtn onClick={() => rCrp('rug')} label="RUG PULL" />
        </div>
      </>}
    </LabShell>
  );
};

const MovTab = () => {
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
      <FlashBtn onClick={rMov} dis={pl.bag < cst} label={`SHOOT MOVIE - $${fMny(cst)}`} />
    </LabShell>
  );
};

const HfTab = () => {
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
        <div className="w-1/2"><FlashBtn onClick={() => rHf(true)} dis={pl.bag < hf.c || !hf.t} label={`LONG ($${fMny(hf.c)})`} /></div>
        <div className="w-1/2"><FlashBtn onClick={() => rHf(false)} dis={pl.bag < hf.c || !hf.t} label={`SHORT ($${fMny(hf.c)})`} /></div>
      </div>
    </LabShell>
  );
};

const AiTab = () => {
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

const BillTab = () => {
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

const ConglomerateTab = () => {
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
  }, [tch.l, tch.pw, tch.u, tch.srv, smmClients, runnerCount, saasUsers, saasPrice, saasPenaltyActive, apiLockoutMonths, corpClients, creOfficeCount, creRetailCount, unionStrikeActive, franchiseCount, supplyChainDisruption, guttedFirms, peCompoundingYield]);

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

const SovereignTab = () => {
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

const SuperPacTab = () => {
  const { pl, prs, setPl, setPrs, adv, setTab } = useGame();
  const [deposit, setDeposit] = useState(10000000);

  return (
    <LabShell t="SUPER PAC FUNDRAISING" c="red" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-red-800 text-center flex flex-col gap-4">
        <div className="text-4xl font-black text-white font-gov">${fMny(prs?.chest || 0)}</div>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">Campaign War Chest</div>

        <Stepper val={deposit} setVal={setDeposit} min={1000000} max={pl?.bag || 0} step={1000000} label="Deposit Amt" />

        <FlashBtn
          onClick={async () => {
            if ((pl?.bag || 0) < deposit) return;
            setPl(p => ({ ...p, bag: p.bag - deposit }));
            setPrs(p => ({ ...p, chest: (p.chest || 0) + deposit }));
            return -deposit;
          }}
          dis={(pl?.bag || 0) < deposit}
          label={`DEPOSIT INTO PAC - $${fMny(deposit)}`}
          color="red-600"
          txt="white"
        />
      </div>
    </LabShell>
  );
};

const BlitzTab = () => {
  const { pl, prs, setPl, setPrs, adv, setTab } = useGame();

  const runBlitz = async () => {
    const cost = 50000000;
    const cloutCost = 100;
    if ((pl?.bag || 0) < cost || (pl?.clout || 0) < cloutCost) return;

    setPl(p => ({ ...p, bag: p.bag - cost, clout: p.clout - cloutCost }));
    const gain = 2 + Math.random() * 3;
    setPrs(p => ({ ...p, polls: Math.min(100, (p.polls || 0) + gain) }));
    adv();
    return -cost;
  };

  return (
    <LabShell t="MEDIA BLITZ & PROPAGANDA" c="blue" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-800 text-center flex flex-col gap-4">
        <div className="text-5xl font-black text-blue-400 font-gov">{(prs?.polls || 0).toFixed(1)}%</div>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">Current Polls</div>

        <div className="bg-black/50 h-4 rounded-full border border-slate-800 overflow-hidden">
          <div className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_15px_#3b82f6]" style={{ width: `${prs?.polls || 0}%` }}></div>
        </div>

        <FlashBtn
          onClick={runBlitz}
          dis={(pl?.bag || 0) < 50000000 || (pl?.clout || 0) < 100}
          label="RUN NATIONAL BLITZ ($50M + 100 CLOUT)"
          color="blue-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm italic">"Flood the airwaves with tailored narratives."</p>
      </div>
    </LabShell>
  );
};

const SmearTab = () => {
  const { pl, prs, setPl, setPrs, adv, setTab } = useGame();

  const runSmear = async () => {
    const cost = 25000000;
    const auraCost = 50;
    if ((pl?.bag || 0) < cost || (pl?.aura || 0) < auraCost) return;

    setPl(p => ({ ...p, bag: p.bag - cost, aura: p.aura - auraCost }));
    // In this simplified version, smear increases your lead
    const gain = 1 + Math.random() * 2;
    setPrs(p => ({ ...p, polls: Math.min(100, (p.polls || 0) + gain) }));
    adv();
    return -cost;
  };

  return (
    <LabShell t="SMEAR CAMPAIGNS" c="orange" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-orange-800 text-center flex flex-col gap-4">
        <div className="text-3xl font-black text-orange-500 uppercase tracking-tighter">Mudslinging Active</div>
        <FlashBtn
          onClick={runSmear}
          dis={(pl?.bag || 0) < 25000000 || (pl?.aura || 0) < 50}
          label="SMEAR RIVAL ($25M + 50 AURA)"
          color="orange-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm">Target rival's character to swing undecided voters.</p>
      </div>
    </LabShell>
  );
};

const ElectionTab = () => {
  const { prs, pl, setTab, setMod } = useGame();
  const ready = (prs?.polls || 0) >= 51;
  const tier6Achieved = (pl?.tier || 0) >= 5;

  return (
    <LabShell t="ELECTION DAY" c="green" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-8 rounded-2xl border border-green-800 text-center flex flex-col gap-6">
        <div className="text-6xl mb-2">{ready ? '🗳️' : '🔒'}</div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest">The Ballot</h3>

        <div className="bg-black/40 p-4 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase mb-2">Threshold Required</div>
          <div className="text-xl font-black text-green-400">51.0% POLLS</div>
          <div className="text-sm text-slate-300 drop-shadow-sm mt-1">Current: {(prs?.polls || 0).toFixed(1)}%</div>
        </div>

        <button
          onClick={() => {
            if (!ready) return;
            setMod({
              s: true,
              t: "PRESIDENTIAL VICTORY",
              m: "The people have spoken. You are the Commander in Chief.",
              o: [{ label: "ASCEND TO OVAL OFFICE", action: () => window.location.reload() }],
              ui: "ui-modal"
            });
          }}
          disabled={!ready}
          className={`w-full py-6 rounded-2xl font-black text-xl tracking-widest transition-all active:scale-95 duration-100 ${ready ? 'bg-green-600 text-white shadow-[0_0_30px_#16a34a] hover:bg-green-500' : 'bg-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}
        >
          {ready ? 'SUBMIT BALLOT' : 'BALLOT LOCKED'}
        </button>

        <div className="mt-4 pt-6 border-t border-slate-800 text-left">
          <h4 className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase mb-3 tracking-widest">Special Sub-Section</h4>
          <div className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${tier6Achieved ? 'bg-indigo-900/20 border-indigo-700' : 'bg-slate-800/40 border-slate-700 opacity-50 grayscale'}`}>
            <span className="text-3xl">🤖</span>
            <div>
              <div className="font-black text-xs text-white uppercase tracking-wide">Mud Tier AI Overseer Bot</div>
              <div className="text-[9px] text-slate-300 drop-shadow-sm font-bold">
                {tier6Achieved ? 'SYSTEM ONLINE - AUTOMATING LOW-TIER OPERATIONS' : 'LOCKED - REQUIRES TIER 6 ASCENSION'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LabShell>
  );
};

// ─── Main game interface ──────────────────────────────────────────────────────

const GameInterface = () => {
  const game = useGame();
  const {
    pl, prs, ass, mkt, news, tab, setTab, imp, rain, mod, cancelIntro, fatalTragedyMessage, gBusy, displayBag, alias, age, cap, isTierUnlocked, peaks, selTier, setSelTier, isBreakdownActive, shakeActive, rDischarge, karmaFlags, generationCount, performHardReset
  } = game || {};

  const TAB_MAP = React.useMemo(() => ({
    'HUB':          () => <TierHub />,
    'SW':           () => isTierUnlocked?.(0) ? <SwTab /> : <LockedTierScreen section={0} />,
    'DROP':         () => isTierUnlocked?.(0) ? <DropTab /> : <LockedTierScreen section={0} />,
    'VINTAGE':      () => isTierUnlocked?.(0) ? <VintageTab /> : <LockedTierScreen section={0} />,
    'SMM':          () => isTierUnlocked?.(0) ? <SmmTab /> : <LockedTierScreen section={0} />,
    'TECH_FLIP':    () => isTierUnlocked?.(0) ? <TechFlipTab /> : <LockedTierScreen section={0} />,
    'GIG':          () => isTierUnlocked?.(0) ? <GigTab /> : <LockedTierScreen section={0} />,
    'CC':           () => isTierUnlocked?.(1) ? <CcTab /> : <LockedTierScreen section={1} />,
    'POD':          () => isTierUnlocked?.(1) ? <PodTab /> : <LockedTierScreen section={1} />,
    'BOX':          () => isTierUnlocked?.(1) ? <BoxTab /> : <LockedTierScreen section={1} />,
    'TECH':         () => isTierUnlocked?.(2) ? <TechTab /> : <LockedTierScreen section={2} />,
    'AI_AGENCY':    () => isTierUnlocked?.(2) ? <AiAgencyTab /> : <LockedTierScreen section={2} />,
    'CRE_FLIP':     () => isTierUnlocked?.(2) ? <CreTab /> : <LockedTierScreen section={2} />,
    'FRANCHISE':    () => isTierUnlocked?.(2) ? <FranchiseTab /> : <LockedTierScreen section={2} />,
    'CRYP':         () => isTierUnlocked?.(3) ? <CrpTab /> : <LockedTierScreen section={3} />,
    'TOUR':         () => isTierUnlocked?.(3) ? <TourTab /> : <LockedTierScreen section={3} />,
    'PE_ROLLUP':    () => isTierUnlocked?.(3) ? <PeTab /> : <LockedTierScreen section={3} />,
    'ART_SPEC':     () => isTierUnlocked?.(3) ? <ArtTab /> : <LockedTierScreen section={3} />,
    'MOV':          () => isTierUnlocked?.(4) ? <MovTab /> : <LockedTierScreen section={4} />,
    'HF':           () => isTierUnlocked?.(4) ? <HfTab /> : <LockedTierScreen section={4} />,
    'AI':           () => isTierUnlocked?.(4) ? <AiTab /> : <LockedTierScreen section={4} />,
    'CONGLOMERATE': () => isTierUnlocked?.(4) ? <ConglomerateTab /> : <LockedTierScreen section={4} />,
    'SOVEREIGN':    () => isTierUnlocked?.(4) ? <SovereignTab /> : <LockedTierScreen section={4} />,
    'BILL':         () => isTierUnlocked?.(4) ? <BillTab /> : <LockedTierScreen section={4} />,
    'PAC':          () => isTierUnlocked?.(5) ? <SuperPacTab /> : <LockedTierScreen section={5} />,
    'BLITZ':        () => isTierUnlocked?.(5) ? <BlitzTab /> : <LockedTierScreen section={5} />,
    'SMEAR':        () => isTierUnlocked?.(5) ? <SmearTab /> : <LockedTierScreen section={5} />,
    'ELECTION':     () => isTierUnlocked?.(5) ? <ElectionTab /> : <LockedTierScreen section={5} />,
  }), [isTierUnlocked]);

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

      {/* Floating impacts */}
      {imp?.map(i => i.kind === 'bag'
        ? <div key={i.id} className={`impact-text ${i.w ? 'text-green-400' : 'text-red-500'}`}>{i.w ? '+' : '-'}${fMny(Math.abs(i.a))}</div>
        : i.kind === 'aura'
        ? <div key={i.id} className="impact-aura">{i.a > 0 ? '+' : ''}{i.a} AURA</div>
        : <div key={i.id} className="impact-clout">{i.a > 0 ? '+' : ''}{i.a} CLOUT</div>
      )}
      {rain && Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="money-rain" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }}>💸</div>
      ))}

      {/* Modal */}
      {mod?.s && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className={`p-8 w-full max-w-sm ${mod?.ui} text-center shadow-[0_0_50px_rgba(0,0,0,1)]`}>
            <h2 className="text-3xl font-black mb-4 text-white tracking-widest">{mod?.t}</h2>
            <p className="mb-8 text-slate-300 drop-shadow-sm text-lg">{mod?.m}</p>
            <div className="flex flex-col gap-3">{mod?.o?.map((o, i) => <button key={i} onClick={o.action} className="p-4 bg-slate-800 border border-slate-600 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">{o.label}</button>)}</div>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="px-3 pt-6 pb-2 relative">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="text-[9px] font-bold text-slate-300 drop-shadow-sm tracking-widest leading-none font-hack">NET WORTH — {alias || 'ANON'}</div>
              <button
                onClick={handleHardReset}
                className="text-[8px] font-black text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-500 px-1.5 py-0.5 rounded bg-red-900/10 transition-all active:scale-95 uppercase tracking-widest font-hack"
              >
                Wipe Save
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              {(displayBag || 0) >= 1000000000
                ? <div className="text-2xl font-black billionaire-bag leading-none">${fMny(displayBag || 0)}</div>
                : <div className="text-2xl font-black text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] leading-none font-hack">${fMny(displayBag || 0)}</div>
              }
              <div className="text-lg">{prs?.r ? '🇺🇸' : ass?.mans ? '🤳😎' : ass?.pent ? '🕴️💎' : '🧢🎒'}</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div>
              <div className="flex justify-between text-[9px] font-bold text-yellow-400 tracking-widest leading-none"><span>AURA</span><span>{pl?.aura || 0}/{cap || 500}</span></div>
              <div className="bg-black/50 h-1.5 rounded-full mt-0.5 border border-slate-700"><div className="bg-yellow-400 h-full rounded-full aura-glow transition-all" style={{ width: `${Math.min(100, ((pl?.aura || 0) / (cap || 500)) * 100)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-bold text-red-400 tracking-widest leading-none"><span>CLOUT</span><span>{pl?.clout || 0}/{cap || 500}</span></div>
              <div className="bg-black/50 h-1.5 rounded-full mt-0.5 border border-slate-700"><div className="bg-red-500 h-full rounded-full clout-glow transition-all" style={{ width: `${Math.min(100, ((pl?.clout || 0) / (cap || 500)) * 100)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-bold text-purple-400 tracking-widest leading-none"><span>MENTAL HEALTH</span><span>{pl?.mentalHealth || 0}/{pl?.maxMentalHealth || 100}</span></div>
              <div className="bg-black/50 h-1.5 rounded-full mt-0.5 border border-slate-700"><div className="bg-purple-500 h-full rounded-full mh-glow transition-all" style={{ width: `${Math.min(100, ((pl?.mentalHealth || 0) / (pl?.maxMentalHealth || 100)) * 100)}%` }}></div></div>
            </div>
          </div>
          <div className="text-[9px] font-hack text-slate-300 drop-shadow-sm text-right leading-relaxed flex-shrink-0">
            <div>AGE <span className="text-white font-bold">{age}</span></div>
            <div>MO <span className="text-white font-bold">{(pl?.mo || 0) % 12 + 1}</span></div>
            <div><span className={`font-bold ${mkt === 1 ? 'text-green-400' : mkt === 2 ? 'text-red-400' : mkt === 3 ? 'text-purple-400' : 'text-white'}`}>{MARKETS[mkt]?.n || 'NORMAL'}</span></div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto mt-2 pb-1 scrollbar-hide items-center">
          {TIERS?.map((t, idx) => {
            const unlocked = (pl?.tier || 0) >= idx;
            return (
              <button key={t.id} onClick={() => { setSelTier(idx.toString()); setTab('HUB'); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${selTier === idx.toString() ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'} ${!unlocked ? 'opacity-60' : ''}`}>
                {unlocked ? t.label.toUpperCase() : `🔒 ${t.label.toUpperCase()}`}
              </button>
            );
          })}
          <span className="text-slate-700 mx-1">|</span>
          <button onClick={() => { setSelTier('flexes'); setTab('HUB'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${selTier === 'flexes' ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'}`}>
            FLEXES
          </button>
          <button onClick={() => { setSelTier('flexShop'); setTab('HUB'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${selTier === 'flexShop' ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'}`}>
            FLEX SHOP
          </button>
          <button onClick={() => { setSelTier('exp'); setTab('HUB'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${selTier === 'exp' ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'}`}>
            EXP POINTS
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-16">
        <div key={tab + selTier} className="max-w-xl mx-auto animate-fadeIn">
          {(() => {
            const Component = TAB_MAP[tab];
            return Component ? <Component /> : null;
          })()}

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700 my-6">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold tracking-widest mb-2 text-center uppercase">📡 REAL WORLD MONITOR</div>
            <div className={`text-center font-black text-sm mb-1 ${mkt === 1 ? 'text-green-400' : mkt === 2 ? 'text-red-400' : mkt === 3 ? 'text-purple-400' : 'text-white'}`}>{MARKETS[mkt]?.n || 'NORMAL'}</div>
            <p className="text-slate-300 drop-shadow-sm text-[10px] text-center">{MARKETS[mkt]?.desc}</p>
          </div>
        </div>
      </div>

      {/* News ticker */}
      <div className="ticker-wrap">
        <div className={`ticker ${fatalTragedyMessage ? 'ticker-paused' : ''}`}>
          {news?.map((n, i) => <span key={i} className="mx-12" dangerouslySetInnerHTML={{ __html: n }} />)}
          <span className="mx-12 text-slate-300 drop-shadow-sm">/// END FEED ///</span>
        </div>
      </div>
    </div>
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