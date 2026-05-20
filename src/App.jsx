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
  @keyframes ticker { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
  .news-bag { color: #22c55e; font-weight: 900; } .news-scandal { color: #ef4444; font-weight: 900; } .news-viral { color: #ec4899; font-weight: 900; }
  @keyframes floatUpStat { 0% { opacity: 1; transform: translateY(0) scale(0.9); } 100% { opacity: 0; transform: translateY(-60px) scale(1); } }
  .impact-aura { position: fixed; top: 70px; right: 16px; font-size: 1rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUpStat 2s ease-out forwards; color: #fbbf24; text-shadow: 0 0 8px rgba(234,179,8,0.9); }
  .impact-clout { position: fixed; top: 96px; right: 16px; font-size: 1rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUpStat 2s ease-out forwards; color: #f87171; text-shadow: 0 0 8px rgba(239,68,68,0.9); }
  @keyframes auraPanic { 0%, 100% { box-shadow: inset 0 0 80px rgba(180,0,0,0.35); } 50% { box-shadow: inset 0 0 140px rgba(220,0,0,0.6); } }
  .aura-panic { animation: auraPanic 1.2s ease-in-out infinite; }
  @keyframes billionaireShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .billionaire-bag { background: linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b, #d97706, #fbbf24); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: billionaireShimmer 2s ease infinite; filter: drop-shadow(0 0 8px rgba(251,191,36,0.8)); }
  .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

// ─── Reusable UI components ───────────────────────────────────────────────────

const Stepper = ({ val, setVal, min, max, step, label, isCurr = true }) => (
  <div className="bg-black/40 px-2 py-2 rounded-lg flex items-center w-full border border-slate-800 gap-2">
    <div className="text-xs font-bold text-white uppercase tracking-widest flex-1">{label}: <span className="text-green-400">{isCurr ? '$' : ''}{fMny(val)}</span></div>
    <div className="flex gap-1">
      <button onClick={() => setVal(Math.max(min, val - step))} className="bg-slate-700 rounded px-4 py-2.5 text-xl font-black text-white hover:bg-slate-600 min-w-[44px]">-</button>
      <button onClick={() => setVal(Math.min(max, val + step))} className="bg-slate-700 rounded px-4 py-2.5 text-xl font-black text-white hover:bg-slate-600 min-w-[44px]">+</button>
    </div>
  </div>
);

const Toggles = ({ opts, active, setVal, color }) => (
  <div className="flex gap-1 w-full">
    {opts.map((o, i) => (
      <button key={i} onClick={() => setVal(i + 1)} className={`flex-1 py-1.5 px-1 text-[10px] font-bold rounded-lg transition-colors ${active === i + 1 ? `bg-${color}-600 text-white shadow-lg` : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{o}</button>
    ))}
  </div>
);

const FlashBtn = ({ onClick, dis, label, color = 'white', txt = 'black', cost }) => {
  const { gBusy, imp, pl } = useGame();
  const busy = gBusy || imp.some(i => !i.w);
  const [st, setSt] = useState('idle');
  const [amt, setAmt] = useState(0);

  const hit = async () => {
    if (dis || st !== 'idle' || (busy && st === 'idle')) return;
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

  let bg = (dis || (busy && st === 'idle'))
    ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed border-slate-700'
    : `bg-${color} text-${txt} hover:bg-gray-200`;
  let l = label;
  if (st === 'calc')  { bg = 'bg-slate-600 text-white animate-pulse'; l = 'CALCULATING...'; }
  else if (st === 'drain') { bg = 'bg-orange-900 text-orange-400 animate-pulse'; l = '💸 DRAINING...'; }
  else if (st === 'sweat') { bg = 'bg-yellow-900/80 text-yellow-300 animate-pulse'; l = '😰 THE SWEAT...'; }
  else if (st === 'win')   { bg = 'bg-green-500 text-white shadow-[0_0_20px_#22c55e]'; l = `+$${fMny(amt)}`; }
  else if (st === 'lose')  { bg = 'bg-red-600 text-white shadow-[0_0_20px_#dc2626]'; l = `-$${fMny(Math.abs(amt))}`; }

  return <button onClick={hit} className={`w-full py-3 px-2 font-black text-sm tracking-widest rounded-xl transition-all ${bg}`}>{l}</button>;
};

const LabShell = ({ t, c, f, onHub, children, fontCls = '' }) => (
  <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-2xl shadow-2xl flex flex-col gap-2">
    <div className="text-center">
      <h3 className={`text-lg font-black text-${c}-400 uppercase tracking-widest ${fontCls}`}>{t}</h3>
      {f && <p className="text-[10px] text-slate-500 italic">"{f}"</p>}
    </div>
    {children}
    <button onClick={onHub} className="w-full py-2 px-3 mt-1 bg-slate-800 text-white text-xs font-bold tracking-widest rounded-xl hover:bg-slate-700">🏠 EMPIRE HUB</button>
  </div>
);

const UpgBtn = ({ onClk, cost, title, unl, reqA = 0, reqC = 0, pB, pA = 0, pC = 0 }) => {
  if (unl) return <div className="w-full py-1.5 px-2 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-[10px] tracking-widest rounded-xl">✓ {title}</div>;
  const meets = pB >= cost && pA >= reqA && pC >= reqC;
  let rT = ''; if (reqA > 0) rT += `${reqA} AURA `; if (reqC > 0) rT += `${reqC} CLOUT`;
  return <button onClick={onClk} disabled={!meets} className={`w-full py-2 px-2 font-black text-[10px] tracking-widest rounded-xl flex justify-center gap-2 ${meets ? 'bg-yellow-900/20 border border-yellow-600 text-yellow-500 hover:bg-yellow-900/40' : 'bg-slate-900 border border-slate-800 text-slate-600'}`}>🔒 {title} (${fMny(cost)}) {rT}</button>;
};

const ExpView = () => {
  const { pl, peaks, cap } = useGame();

  const stats = [
    { label: 'Current Aura', val: pl.aura, max: cap, color: 'text-yellow-400', bar: 'bg-yellow-400' },
    { label: 'Current Clout', val: pl.clout, max: cap, color: 'text-red-400', bar: 'bg-red-400' },
    { label: 'Peak Wealth', val: `$${fMny(peaks.peakB)}`, color: 'text-green-400' },
    { label: 'Peak Aura', val: peaks.peakA, color: 'text-yellow-500' },
    { label: 'Peak Clout', val: peaks.peakC, color: 'text-red-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900/80 border border-blue-600/50 p-4 rounded-2xl shadow-2xl text-center">
        <h3 className="text-xl font-black text-blue-400 uppercase tracking-widest font-tech">EXP & METRICS</h3>
        <p className="text-[10px] text-slate-500 italic mt-1">"Tracking your ascent to godhood."</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {stats.map((s, i) => (
          <div key={i} className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{s.label}</span>
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

const FlexesView = () => {
  const { ass, setAss, pl, setPl, bAss } = useGame();

  const flexItems = [
    { key: 'watch', label: 'Luxury Watch', cost: 50000, icon: '⌚' },
    { key: 'pent',  label: 'Penthouse',     cost: 1000000, icon: '🏢' },
    { key: 'mans',  label: 'Mansion',      cost: 5000000, icon: '🏡' },
    { key: 'jet',   label: 'Private Jet',  cost: 20000000, icon: '🛩️' },
    { key: 'spt',   label: 'Sports Team',  cost: 2000000000, icon: '🏟️' },
    { key: 'spc',   label: 'Space Corp',   cost: 10000000000, icon: '🚀' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-slate-900/80 border border-yellow-600/50 p-4 rounded-2xl shadow-2xl text-center">
        <h3 className="text-xl font-black text-yellow-400 uppercase tracking-widest font-hype">LIFESTYLE FLEXES</h3>
        <p className="text-[10px] text-slate-500 italic mt-1">"Burn cash to buy the world."</p>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {flexItems.map(item => {
          const owned = ass[item.key];
          const canAfford = pl.bag >= item.cost;
          return (
            <div key={item.key} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${owned ? 'bg-green-900/20 border-green-700' : 'bg-slate-900/60 border-slate-800'}`}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <div className={`font-black tracking-widest ${owned ? 'text-green-400' : 'text-white'}`}>{item.label.toUpperCase()}</div>
                  <div className="text-xs text-slate-500 font-bold">${fMny(item.cost)}</div>
                </div>
              </div>
              {owned ? (
                <div className="text-green-500 font-black text-xs tracking-widest">OWNED ✓</div>
              ) : (
                <button
                  onClick={() => bAss(item.key, item.cost, item.label)}
                  disabled={!canAfford}
                  className={`px-4 py-2 rounded-lg font-black text-xs tracking-widest transition-all ${canAfford ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}
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

// ─── Legacy Autopsy screen ────────────────────────────────────────────────────

const LegacyAutopsy = () => {
  const { death, alias, peaks, hl, tally } = useGame();
  if (!death) return null;

  const catNames = { sw: '👟 Streetwear Drop', drop: '📦 Dropship', cc: '📺 Creator Lab', pod: '🎙️ Podcast', box: '🥊 Fight Promo', tch: '💻 SaaS Exit', cryp: '🪙 Crypto Rug', tour: '🎪 Live Event', mov: '🎬 Hollywood', hf: '📈 Hedge Trade' };
  const top5  = Object.entries(hl).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const shame = [
    ...(tally.cryp === 0 ? ['Terrified of the blockchain. NGMI. 💀'] : []),
    ...(tally.box  === 0 ? ["Couldn't look at a fight card. Soft era. 🥊"] : []),
    ...(tally.hf   === 0 ? ['Paper hands. Never even checked a chart. 📉'] : []),
    ...(tally.pres === 0 ? ["Didn't attempt world domination. Ran it back. 🗳️"] : []),
  ];

  return (
    <div className="min-h-screen bg-black text-white font-hack flex flex-col items-center justify-center p-4 text-center">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-xl w-full bg-slate-900 border border-slate-700 rounded-xl p-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        <h1 className="text-4xl font-black mb-2 text-red-500 font-hype tracking-widest">LEGACY AUTOPSY</h1>
        <p className="text-slate-400 mb-4 italic">{death.r}</p>
        <p className="text-pink-400 mb-8 font-bold text-lg">"{death.i}"</p>
        <div className="bg-black/50 p-6 rounded-lg mb-4">
          <h2 className="text-sm text-slate-500 mb-4 tracking-widest uppercase">The Peak</h2>
          <div className="grid grid-cols-3 gap-4 text-lg">
            <div><span className="text-green-400 font-black">${fMny(peaks.peakB)}</span><div className="text-xs text-slate-500">BAG</div></div>
            <div><span className="text-yellow-400 font-black">{peaks.peakA}</span><div className="text-xs text-slate-500">AURA</div></div>
            <div><span className="text-red-400 font-black">{peaks.peakC}</span><div className="text-xs text-slate-500">CLOUT</div></div>
          </div>
        </div>
        {top5.length > 0 && (
          <div className="bg-black/50 p-4 rounded-lg mb-4 text-left">
            <div className="text-xs text-yellow-500 mb-2 tracking-widest uppercase font-black text-center">🏆 Top 5 Plays</div>
            {top5.map(([cat, val]) => (
              <div key={cat} className="flex justify-between text-sm py-1 border-b border-slate-800 last:border-0">
                <span className="text-slate-400">{catNames[cat] ?? cat}</span>
                <span className="text-green-400 font-black">+${fMny(val)}</span>
              </div>
            ))}
          </div>
        )}
        {shame.length > 0 && (
          <div className="bg-red-950/30 border border-red-900/60 p-4 rounded-lg mb-4 text-left">
            <div className="text-xs text-red-500 mb-2 tracking-widest uppercase font-black text-center">🪦 Wall of Shame</div>
            {shame.map((s, i) => <div key={i} className="text-[11px] text-red-400 py-1 border-b border-red-900/30 last:border-0">{s}</div>)}
          </div>
        )}
        <div className="mb-4 text-2xl font-black text-slate-300">{alias || 'GHOST'} — {death.rank}</div>
        <button onClick={() => window.location.reload()} className="w-full p-6 bg-white text-black font-black tracking-widest rounded-xl hover:bg-gray-200">PLUG BACK IN</button>
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
      <p className="text-slate-500 mb-8 text-sm font-tech">Build your empire from nothing. Or die broke.</p>
      <div className="w-full max-w-md bg-black/60 border border-slate-700 p-8 rounded-2xl flex flex-col items-center shadow-2xl">
        {proSt === 0 && <>
          <h3 className="font-black text-2xl text-green-400 mb-3 tracking-widest font-hype">THE BAG</h3>
          <p className="text-slate-400 mb-2 leading-relaxed">Your cash. Every hustle costs money upfront.</p>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">Hit $0 → BANKRUPT. Game over. Survive Market Shifts, Mortgages, and Fines. Never go dry.</p>
          <button onClick={() => setProSt(1)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700">GOT IT →</button>
        </>}
        {proSt === 1 && <>
          <h3 className="font-black text-2xl text-yellow-400 mb-3 tracking-widest font-hype">AURA = REPUTATION</h3>
          <p className="text-slate-400 mb-2 leading-relaxed">Street cred that unlocks bigger moves and boosts your revenue.</p>
          <p className="text-red-400 mb-6 text-sm font-bold leading-relaxed">⚠ Hit 0 Aura = CANCELLED. Permanent game over. Scandals and bad decisions drain it fast.</p>
          <button onClick={() => setProSt(2)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700">GOT IT →</button>
        </>}
        {proSt === 2 && <>
          <h3 className="font-black text-2xl text-red-400 mb-3 tracking-widest font-hype">CLOUT = FAME</h3>
          <p className="text-slate-400 mb-2 leading-relaxed">Unlocks arenas, political power, and God Tier moves.</p>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">Low Clout = no one shows up. High Clout = world stage. Grind content, podcasts, and drops to build it.</p>
          <button onClick={() => setProSt(3)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700">GOT IT →</button>
        </>}
        {proSt === 3 && <>
          <h3 className="font-black text-xl text-blue-400 mb-3 tracking-widest font-tech">HOW TO PLAY</h3>
          <ul className="text-slate-400 text-xs text-left mb-5 space-y-1.5 leading-relaxed">
            <li>→ Pick any hustle from the <span className="text-white font-bold">HUB</span> and start grinding</li>
            <li>→ <span className="text-yellow-400 font-bold">Market Cycles</span> shift every 12 months — costs and risks change</li>
            <li>→ <span className="text-orange-400 font-bold">Fatigue</span>: flood the same event tier and fans check out</li>
            <li>→ <span className="text-pink-400 font-bold">Lifestyle Creep</span>: assets auto-offer at bag milestones — mortgages burn monthly</li>
            <li>→ <span className="text-purple-400 font-bold">Whale Tax</span>: the IRS clips 20-30% off any payout over $100M</li>
            <li>→ Compound to God Tier: Movies → Hedge Fund → AI Lab</li>
            <li>→ <span className="text-red-500 font-bold">POTUS Run</span>: fund a shadow campaign, win 2 of 3 regions → President</li>
          </ul>
          <button onClick={() => setProSt(4)} className="w-full p-4 bg-green-600 text-black font-black tracking-widest rounded-xl hover:bg-green-500 shadow-[0_0_15px_#22c55e]">LET'S RUN IT →</button>
        </>}
        {proSt === 4 && <>
          <input type="text" value={alias} onChange={e => setAlias(e.target.value.substring(0, 5).toUpperCase())} placeholder="ALIAS (3-5 CHARS)" className="w-full p-4 mb-4 bg-slate-900 border border-slate-600 rounded-lg text-center font-black tracking-widest text-xl text-white outline-none focus:border-green-400 transition-colors" />
          <div className="w-full mb-2">
            <div className="text-xs text-slate-500 font-bold tracking-widest mb-2">DIFFICULTY</div>
            <Toggles opts={['TRUST FUND', 'SIDE HUSTLE', 'OUT THE MUD']} active={diff} setVal={setDiff} color="green" />
          </div>
          <div className="w-full mb-4 px-1">
            {diff === 3 && <p className="text-[10px] text-red-400 font-bold text-center leading-relaxed">⚠ Protect Your Aura (0 = Cancellation) | Cash Flow is King | Read the Fine Print</p>}
            {diff === 2 && <p className="text-[10px] text-yellow-400 font-bold text-center leading-relaxed">⚠ Respect the Market Cycle | Beware Lifestyle Creep (Mortgages kill) | Rotate Your Roster</p>}
            {diff === 1 && <p className="text-[10px] text-slate-400 font-bold text-center leading-relaxed">⚠ Fame is a Target | The Feds are Watching (Whale Tax) | Leverage is a Double-Edged Sword</p>}
          </div>
          <button onClick={() => { exStart(); setPh('PLAYING'); }} disabled={alias.length < 3} className={`w-full p-6 font-black tracking-widest text-xl rounded-xl transition-all ${alias.length >= 3 ? 'bg-green-500 text-black shadow-[0_0_20px_#22c55e] hover:bg-green-400' : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>ENTER THE MATRIX</button>
        </>}
      </div>
    </div>
  );
};

// ─── HUB tab ──────────────────────────────────────────────────────────────────

const TierHub = () => {
  const { pl, mkt, news, skl, diff, cap, adv, setTab, selTier, displayBag } = useGame();

  if (selTier === 'flexes') return <FlexesView />;
  if (selTier === 'exp') return <ExpView />;

  const tierIdx = parseInt(selTier);
  const tier = TIERS[tierIdx];
  const isLocked = pl.tier < tierIdx;

  const hustleMap = {
    'SW': { label: 'Streetwear', icon: '👕' },
    'DROP': { label: 'Dropship', icon: '📦' },
    'CC': { label: 'Creator Lab', icon: '📱' },
    'POD': { label: 'Podcast Net', icon: '🎙️' },
    'BOX': { label: 'FIGHT Promoter', icon: '🥊' },
    'TECH': { label: 'SaaS Startup', icon: '💻' },
    'CRYP': { label: 'Web3 Hedge', icon: '🪙' },
    'TOUR': { label: 'Events', icon: '🎪' },
    'HF': { label: 'Hedge Fund', icon: '📈' },
    'AI': { label: 'AGI Super-Lab', icon: '🧠' },
    'MOV': { label: 'Movie Studio', icon: '🎬' },
    'BILL': { label: 'Flex & Legacy', icon: '💎' },
    'PRES': { label: 'POTUS', icon: '🇺🇸' }
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      {tierIdx === 0 && (
        <>
          <div className="col-span-2 bg-slate-900/80 rounded-xl p-4 border border-slate-700 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">CASH FLOW</div>
                <div className="text-2xl font-black text-green-400 font-hack">${fMny(displayBag)}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-bold tracking-widest uppercase mb-1">AURA / CLOUT</div>
                <div className="text-lg font-black text-white">{pl.aura} <span className="text-yellow-500">A</span> / {pl.clout} <span className="text-red-500">C</span></div>
              </div>
            </div>
          </div>

          <div className="col-span-2 bg-slate-900/80 rounded-xl p-3 border border-slate-700">
            <div className="text-[10px] text-slate-500 font-bold tracking-widest mb-2 text-center uppercase">📡 MARKET INTEL</div>
            <div className={`text-center font-black text-sm mb-1 ${mkt === 1 ? 'text-green-400' : mkt === 2 ? 'text-red-400' : mkt === 3 ? 'text-purple-400' : 'text-white'}`}>{MARKETS[mkt].n}</div>
            <p className="text-slate-400 text-[10px] text-center">{MARKETS[mkt].desc}</p>
          </div>
        </>
      )}

      {tier.hustles.map(hKey => {
        const h = hustleMap[hKey];
        return (
          <button
            key={hKey}
            onClick={() => !isLocked && setTab(hKey)}
            className={`py-6 px-2 rounded-xl border font-bold text-sm tracking-wide transition-all shadow-lg flex flex-col items-center justify-center gap-2
              ${isLocked
                ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800'}`}
          >
            <span className="text-2xl">{h.icon}</span>
            <span>{isLocked ? '🔒 ' : ''}{h.label.toUpperCase()}</span>
          </button>
        );
      })}

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
    <button onClick={buy} className={`text-[8px] font-black px-2 py-1.5 rounded-lg shrink-0 leading-tight text-center ${ok ? btnCls : 'bg-slate-800 text-slate-600 cursor-not-allowed'}`}>
      ${fMny(cost)}<br />{statLabel}
    </button>
  );
};

// ─── Individual tab panels ────────────────────────────────────────────────────

const SwTab = () => {
  const { pl, up, sw, setSw, dUp, rSw, adv } = useGame();
  return (
    <LabShell t="STREETWEAR LAB" c="purple" fontCls="font-hype" onHub={() => useGame().setTab('HUB')}>
      {!up.swIp
        ? <UpgBtn onClk={() => dUp('swIp', 250000, 'IP Secured. 📜')} cost={250000} title="BUY IP" pB={pl.bag} />
        : !up.swFlg
        ? <UpgBtn onClk={() => dUp('swFlg', 5000000, 'Flagship Opened! 🏬')} cost={5000000} title="SOHO FLAGSHIP" reqA={150} pB={pl.bag} pA={pl.aura} />
        : !up.swPar
        ? <UpgBtn onClk={() => dUp('swPar', 25000000, 'Paris Debut. 🗼')} cost={25000000} title="PARIS FASHION WEEK" reqA={300} reqC={100} pB={pl.bag} pA={pl.aura} pC={pl.clout} />
        : <UpgBtn onClk={() => dUp('swGlb', 150000000, 'Global. Aura bleeding. 🌍')} cost={150000000} title="GLOBAL DISTRIBUTION" unl={up.swGlb} pB={pl.bag} />
      }
      {up.swGlb ? (
        <FlashBtn onClick={async () => {
          await new Promise(r => setTimeout(r, 2000));
          const roll = Math.random(); let rev = 0; let msg = '';
          if (roll < 0.12) { rev = Math.floor(1000000 * (0.1 + Math.random() * 0.3)); msg = 'PR nightmare. Recalls overseas. Net +$' + fMny(rev - 1000000); }
          else if (roll < 0.35) { rev = Math.floor(1000000 * (1.2 + Math.random() * 0.8)); msg = 'Slow month. Global retail net +$' + fMny(rev - 1000000); }
          else if (roll < 0.80) { rev = Math.floor(1000000 * (2.5 + Math.random() * 1.5)); msg = 'Units moved worldwide. Net +$' + fMny(rev - 1000000); }
          else { rev = Math.floor(1000000 * (5 + Math.random() * 3)); msg = 'VIRAL SELLOUT GLOBALLY! Net +$' + fMny(rev - 1000000); }
          console.log(msg);
          useGame().setPl(p => ({ ...p, bag: p.bag - 1000000 + rev }));
          adv(); return rev - 1000000;
        }} label="SUPPLY GLOBAL - COST: $1M" />
      ) : <>
        <Toggles opts={['Tees', 'Hoodies', 'Puffers']} active={sw.i} setVal={v => setSw(s => ({ ...s, i: v }))} color="purple" />
        <Stepper val={sw.u} setVal={v => setSw(s => ({ ...s, u: v }))} min={10} max={up.swPar ? 50000 : up.swFlg ? 10000 : 2500} step={50} label="Units" isCurr={false} />
        <Stepper val={sw.p} setVal={v => setSw(s => ({ ...s, p: v }))} min={15} max={up.swPar ? 2500 : up.swFlg ? 1000 : 500} step={5} label="Price" />
        {!up.swFlg && <Stepper val={sw.a} setVal={v => setSw(s => ({ ...s, a: v }))} min={0} max={250000} step={5000} label="Ad Spend" />}
        <FlashBtn onClick={rSw} dis={pl.bag < (sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a)} label={`DROP - $${fMny((sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a))}`} />
      </>}
    </LabShell>
  );
};

const DropTab = () => {
  const { pl, up, drp, setDrp, dUp, rDrp, setTab } = useGame();
  return (
    <LabShell t="DROPSHIPPING" c="blue" fontCls="font-hype" onHub={() => setTab('HUB')}>
      <UpgBtn onClk={() => dUp('drpFac', 250000, 'Factory Secured. 🏭')} cost={250000} title="PRIVATE LABEL FACTORY" unl={up.drpFac} pB={pl.bag} />
      <Toggles opts={['LEDs', 'Fake Pods', 'Supps']} active={drp.i} setVal={v => setDrp(s => ({ ...s, i: v }))} color="blue" />
      <Stepper val={drp.u} setVal={v => setDrp(s => ({ ...s, u: v }))} min={50} max={10000} step={250} label="Units" isCurr={false} />
      <Stepper val={drp.p} setVal={v => setDrp(s => ({ ...s, p: v }))} min={15} max={up.drpFac ? 250 : 150} step={5} label="Price" />
      <Stepper val={drp.a} setVal={v => setDrp(s => ({ ...s, a: v }))} min={0} max={500000} step={5000} label="Ad Budget" />
      <FlashBtn onClick={rDrp} dis={pl.bag < (drp.u * 10) + drp.a} label={`LAUNCH AD - $${fMny((drp.u * 10) + drp.a)}`} />
    </LabShell>
  );
};

const CcTab = () => {
  const { pl, up, cc, setCc, dUp, rCc, setTab } = useGame();
  return (
    <LabShell t="CREATOR LAB" c="emerald" fontCls="font-tech" onHub={() => setTab('HUB')}>
      {!up.ccAge
        ? <UpgBtn onClk={() => dUp('ccAge', 1000000, 'Agency launched. 🤝')} cost={1000000} title="TALENT AGENCY" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('ccNet', 20000000, 'Network Launched! 📺')} cost={20000000} title="STREAMING NETWORK" unl={up.ccNet} reqC={150} pB={pl.bag} pC={pl.clout} />
      }
      <div className="flex bg-slate-800 p-1 rounded-xl mb-2">
        <button onClick={() => setCc(c => ({ ...c, m: 'solo' }))} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'solo' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>SOLO</button>
        <button onClick={() => { if (pl.bag >= 100000 && pl.clout >= 50) setCc(c => ({ ...c, m: 'house' })); }} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'house' ? 'bg-emerald-600 text-white' : pl.bag >= 100000 && pl.clout >= 50 ? 'text-slate-400' : 'text-slate-600 cursor-not-allowed'}`}>{pl.bag >= 100000 && pl.clout >= 50 ? 'HOUSE' : '🔒 ($100K/50C)'}</button>
      </div>
      {cc.m === 'house' ? <>
        <Toggles opts={['Drama', 'Gaming', 'Lifestyle']} active={cc.v} setVal={v => setCc(s => ({ ...s, v }))} color="emerald" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <FlashBtn onClick={() => rCc('feu')} dis={pl.bag < 25000} label="FEUD ($25K)" color="emerald" txt="white" />
          <FlashBtn onClick={() => rCc('mch')} dis={pl.bag < 25000} label="COLLAB ($25K)" />
        </div>
        {up.ccAge && !up.ccNet && <FlashBtn onClick={() => rCc('meg')} label="MEGA-DEAL ($0)" color="purple" txt="white" />}
        {up.ccNet && <FlashBtn onClick={() => rCc('net')} label="COLLECT SUBS ($0)" color="yellow" txt="black" />}
      </> : <>
        <Toggles opts={['Brainrot', 'Finance', 'IRL']} active={cc.n} setVal={v => setCc(s => ({ ...s, n: v }))} color="emerald" />
        <FlashBtn onClick={() => rCc('sol')} dis={pl.bag < 500} label="STREAM - $500" />
      </>}
    </LabShell>
  );
};

const PodTab = () => {
  const { pl, up, pod, setPod, dUp, rPod, setTab } = useGame();
  return (
    <LabShell t="PODCAST NET" c="pink" onHub={() => setTab('HUB')}>
      <UpgBtn onClk={() => dUp('podCmp', 500000, 'Compound Built. 🎙️')} cost={500000} title="BUILD COMPOUND" unl={up.podCmp} pB={pl.bag} />
      <div className="flex gap-1 w-full">
        <button onClick={() => setPod(s => ({ ...s, g: 1 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 1 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Z-List</button>
        <button onClick={() => { if (pl.clout >= 50) setPod(s => ({ ...s, g: 2 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 2 ? 'bg-pink-600 text-white' : pl.clout >= 50 ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-slate-600 cursor-not-allowed'}`}>{pl.clout >= 50 ? 'Drama' : '🔒(50C)'}</button>
        <button onClick={() => { if (pl.clout >= 100) setPod(s => ({ ...s, g: 3 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 3 ? 'bg-pink-600 text-white' : pl.clout >= 100 ? 'bg-slate-800 text-slate-400' : 'bg-slate-900 text-slate-600 cursor-not-allowed'}`}>{pl.clout >= 100 ? 'A-List' : '🔒(100C)'}</button>
        {up.podCmp && <button onClick={() => setPod(s => ({ ...s, g: 4 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 4 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Billionaire</button>}
      </div>
      {!up.podCmp && <Stepper val={pod.q} setVal={v => setPod(s => ({ ...s, q: v }))} min={10000} max={100000} step={10000} label="Studio Rental" />}
      <FlashBtn onClick={rPod} dis={pl.bag < (up.podCmp ? 0 : pod.q) + (pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000)} label={`RECORD - $${fMny((up.podCmp ? 0 : pod.q) + (pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000))}`} />
    </LabShell>
  );
};

const BoxTab = () => {
  const { pl, up, box, setBox, dUp, rBox, setTab } = useGame();
  return (
    <LabShell t="FIGHT PROMOTER" c="orange" onHub={() => setTab('HUB')}>
      {!up.boxLg
        ? <UpgBtn onClk={() => dUp('boxLg', 2000000, 'League Founded. 🥊')} cost={2000000} title="FOUND LEAGUE" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('boxBrd', 15000000, 'Network Deal! 📺')} cost={15000000} title="BROADCAST DEAL" unl={up.boxBrd} reqC={125} pB={pl.bag} pC={pl.clout} />
      }
      {!up.boxLg && <Toggles opts={['Basement', 'Arena', 'Stadium']} active={box.v} setVal={v => setBox(s => ({ ...s, v }))} color="orange" />}
      <Toggles opts={up.boxLg ? ['Scrap', 'MMAvYT', 'Pro', 'Super'] : ['Scrap', 'MMAvYT', 'Pro']} active={box.t} setVal={v => setBox(s => ({ ...s, t: v }))} color="orange" />
      {!up.boxBrd && <Stepper val={box.b} setVal={v => setBox(s => ({ ...s, b: v }))} min={box.t === 4 ? 10000000 : 50004} max={box.t === 4 ? 50000000 : 5000000} step={50000} label="Promo Budget" />}
      <Toggles opts={['Respectful', 'Script Brawl']} active={box.p} setVal={v => setBox(s => ({ ...s, p: v }))} color="orange" />
      <FlashBtn onClick={rBox} dis={pl.bag < (up.boxBrd ? 0 : box.b) + (up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000))} label={up.boxBrd ? 'HOST NETWORK FIGHT ($0)' : `HOST - $${fMny(box.b + (up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000)))}`} />
    </LabShell>
  );
};

const TourTab = () => {
  const { pl, up, tur, setTur, dUp, rTur, setTab } = useGame();
  return (
    <LabShell t="LIVE EVENTS" c="teal" onHub={() => setTab('HUB')}>
      <UpgBtn onClk={() => dUp('trFst', 150000000, 'Mega Festival Secured. 🎪')} cost={150000000} title="OWN MEGA-FESTIVAL" unl={up.trFst} pB={pl.bag} reqC={200} pC={pl.clout} />
      <Toggles opts={['Club', 'Arena', 'Stadium']} active={tur.t} setVal={v => setTur(t => ({ ...t, t: v }))} color="teal" />
      <Stepper val={tur.m} setVal={v => setTur(t => ({ ...t, m: v }))} min={50000} max={10000000} step={50000} label="Marketing" />
      <Stepper val={tur.a} setVal={v => setTur(t => ({ ...t, a: v }))} min={10000} max={5000000} step={10000} label="Artist Fees" />
      <Stepper val={tur.l} setVal={v => setTur(t => ({ ...t, l: v }))} min={50000} max={5000000} step={50000} label="Logistics" />
      <FlashBtn onClick={rTur} dis={pl.bag < tur.m + tur.a + tur.l} label={`LAUNCH ${up.trFst ? 'FESTIVAL' : 'TOUR'} - $${fMny(tur.m + tur.a + tur.l)}`} />
    </LabShell>
  );
};

const TechTab = () => {
  const { pl, up, tch, setTch, dUp, rTch, setTab } = useGame();
  return (
    <LabShell t="SAAS STARTUP" c="cyan" fontCls="font-tech" onHub={() => setTab('HUB')}>
      {!tch.l ? (
        <FlashBtn onClick={() => rTch('seed')} dis={pl.bag < 250000 || pl.clout < 75} label={pl.bag >= 250000 && pl.clout >= 75 ? '🚀 TAKE VC SEED (+$5M, 30% OUT)' : '🔒 REQUIRES $250K & 75 CLOUT'} cost={0} />
      ) : <>
        <UpgBtn onClk={() => dUp('tchGov', 10000000, 'Defense Contract Secured! 🛡️')} cost={10000000} title="GOV CONTRACTS" unl={up.tchGov} reqA={100} reqC={100} pB={pl.bag} pA={pl.aura} pC={pl.clout} />
        <div className="p-3 bg-black/50 border border-slate-700 rounded-lg text-center">
          <div className="font-hack text-cyan-400 text-xl font-black">{tch.u >= 1000000 ? `${(tch.u / 1000000).toFixed(1)}M` : tch.u >= 1000 ? `${(tch.u / 1000).toFixed(0)}K` : tch.u} Users</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tier {tch.u >= 1000000 ? '3' : tch.u >= 100000 ? '2' : '1'} · Srv ${fMny(500 + Math.floor(tch.u * tch.srv))}/mo{tch.pw ? ' · 💰 PAYWALL' : ''}{tch.vc ? ' · VC −30% IPO' : ''}</div>
        </div>
        {up.tchGov ? <FlashBtn onClick={() => rTch('dod')} label="SERVE PENTAGON" color="cyan" txt="white" /> : <div className="flex flex-col gap-2">
          {tch.u < 100000 && <>
            <div className="text-[9px] text-slate-500 font-black text-center tracking-widest uppercase">TIER 1 — FIND PRODUCT-MARKET FIT</div>
            <Stepper val={tch.m} setVal={v => setTch(t => ({ ...t, m: v }))} min={2000} max={250000} step={2000} label="B2B Budget" />
            <div className="grid grid-cols-2 gap-2">
              <FlashBtn onClick={() => rTch('b2b')} dis={pl.bag < tch.m} label={`B2B SPAM ($${(tch.m / 1000).toFixed(0)}K)`} color="cyan" txt="white" cost={tch.m} />
              <FlashBtn onClick={() => rTch('freemium')} label="FREEMIUM BAIT (FREE)" color="slate" txt="white" cost={0} />
            </div>
          </>}
          {tch.u >= 100000 && tch.u < 1000000 && <>
            <div className="text-[9px] text-cyan-600 font-black text-center tracking-widest uppercase">🚀 TIER 2 — SCALE OR DIE</div>
            <Stepper val={tch.m} setVal={v => setTch(t => ({ ...t, m: v }))} min={2000} max={250000} step={2000} label="B2B Budget" />
            <FlashBtn onClick={() => rTch('b2b')} dis={pl.bag < tch.m} label={`B2B SPAM ($${(tch.m / 1000).toFixed(0)}K)`} color="cyan" txt="white" cost={tch.m} />
            <FlashBtn onClick={() => rTch('pivot')} dis={pl.bag < 10000000} label="PIVOT TO AI ($10M)" cost={10000000} />
            <button onClick={() => { setTch(t => ({ ...t, pw: !t.pw })); }} className={`w-full py-2 font-black text-xs rounded-xl ${tch.pw ? 'bg-green-700 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{tch.pw ? '✓ PAYWALL ACTIVE — PASSIVE ON' : 'ACTIVATE PAYWALL'}</button>
          </>}
          {tch.u >= 1000000 && <>
            <div className="text-[9px] text-yellow-500 font-black text-center tracking-widest uppercase">👑 TIER 3 — GOD MODE</div>
            <FlashBtn onClick={() => rTch('data')} label="SELL USER DATA (10% → CASH, 30% DOJ RISK)" color="orange" txt="black" />
            <button onClick={() => { setTch(t => ({ ...t, pw: !t.pw })); }} className={`w-full py-2 font-black text-xs rounded-xl ${tch.pw ? 'bg-green-700 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{tch.pw ? '✓ PAYWALL ACTIVE' : 'TOGGLE PAYWALL'}</button>
          </>}
          <FlashBtn onClick={() => rTch('ipo')} label={`IPO EXIT — ${tch.u >= 1000000 ? `${(tch.u / 1000000).toFixed(1)}M` : tch.u >= 1000 ? `${(tch.u / 1000).toFixed(0)}K` : tch.u} users × ${pl.aura} Aura${tch.vc ? ' (−30% VC)' : ''}`} cost={0} />
        </div>}
      </>}
    </LabShell>
  );
};

const CrpTab = () => {
  const { pl, crp, setCrp, rCrp, setTab } = useGame();
  return (
    <LabShell t="WEB3 LAB" c="green" fontCls="font-hack" onHub={() => setTab('HUB')}>
      {!crp.l ? <>
        <input type="text" value={crp.t} placeholder="$TICKER" onChange={e => setCrp(c => ({ ...c, t: e.target.value }))} className="w-full p-4 bg-black border border-slate-700 rounded font-hack text-green-400 font-bold uppercase text-center" />
        <Stepper val={crp.i} setVal={v => setCrp(c => ({ ...c, i: v }))} min={5000} max={1000000} step={25000} label="Liquidity" />
        <FlashBtn onClick={() => rCrp('dep')} dis={pl.bag < crp.i || !crp.t} label={`DEPLOY - $${fMny(crp.i)}`} />
      </> : <>
        <div className="p-6 bg-green-900/20 border border-green-500 rounded text-center">
          <h4 className="text-3xl font-black text-green-400 mb-2 font-hack">{crp.t}</h4>
          <p className="font-hack text-slate-300">LP Pool: ${fMny(crp.l)}</p>
        </div>
        <Stepper val={crp.m} setVal={v => setCrp(c => ({ ...c, m: v }))} min={5000} max={250000} step={5000} label="Shill Budget" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <FlashBtn onClick={() => rCrp('shil')} dis={pl.bag < crp.m} label={`SHILL ($${(crp.m / 1000).toFixed(0)}K)`} color="green" txt="white" />
          <FlashBtn onClick={() => rCrp('rug')} label="RUG PULL" />
        </div>
      </>}
    </LabShell>
  );
};

const MovTab = () => {
  const { pl, up, mov, setMov, dUp, rMov, setTab } = useGame();
  const cst = (mov.g === 1 ? 2000000 : mov.g === 2 ? 15000000 : 100000000) + (mov.s === 3 ? 10000000 : mov.s === 2 ? 5000000 : 1000000) + (mov.w === 2 ? 2000000 : mov.w === 3 ? 10000000 : 0) + (mov.d === 1 ? 1000000 : mov.d === 2 ? 5000000 : 20000000) + mov.m;
  return (
    <LabShell t="HOLLYWOOD STUDIO" c="yellow" onHub={() => setTab('HUB')}>
      <UpgBtn onClk={() => dUp('movStr', 500000000, 'Streaming Platform Owned. 📺')} cost={500000000} title="STREAMING PLATFORM" unl={up.movStr} pB={pl.bag} />
      <UpgBtn onClk={() => dUp('movUni', 2000000000, 'Cinematic Universe Acquired. 🌌')} cost={2000000000} title="CINEMATIC UNIVERSE" unl={up.movUni} reqC={300} pB={pl.bag} pC={pl.clout} />
      <Toggles opts={['Horror ($2M)', 'Comedy ($15M)', 'Super ($100M)']} active={mov.g} setVal={v => setMov(m => ({ ...m, g: v }))} color="yellow" />
      <div className="flex gap-2">
        <button onClick={() => setMov(m => ({ ...m, w: 1 }))} className={`flex-1 p-3 text-[11px] font-bold rounded ${mov.w === 1 ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}>ChatGPT ($0)</button>
        <button onClick={() => setMov(m => ({ ...m, w: 2 }))} className={`flex-1 p-3 text-[11px] font-bold rounded ${mov.w === 2 ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Nepo ($2M)</button>
        <button onClick={() => setMov(m => ({ ...m, w: 3 }))} className={`flex-1 p-3 text-[11px] font-bold rounded ${mov.w === 3 ? 'bg-yellow-600 text-white' : 'bg-slate-800 text-slate-400'}`}>Oscar ($10M)</button>
      </div>
      <Toggles opts={['MusicVid ($1M)', 'Indie ($5M)', 'Vision ($20M)']} active={mov.d} setVal={v => setMov(m => ({ ...m, d: v }))} color="yellow" />
      <Toggles opts={['TikToker ($1M)', 'Cancel ($5M)', 'A-List ($10M)']} active={mov.s} setVal={v => setMov(m => ({ ...m, s: v }))} color="yellow" />
      <Stepper val={mov.m} setVal={v => setMov(m => ({ ...m, m: v }))} min={0} max={100000000} step={5000000} label="Marketing" />
      <FlashBtn onClick={rMov} dis={pl.bag < cst} label={`SHOOT MOVIE - $${fMny(cst)}`} />
    </LabShell>
  );
};

const HfTab = () => {
  const { pl, hf, setHf, rHf, setTab } = useGame();
  return (
    <LabShell t="HEDGE FUND" c="yellow" fontCls="font-hack" onHub={() => setTab('HUB')}>
      <div className="bg-blue-900/20 border border-blue-500/50 p-4 rounded-xl font-hack text-sm text-blue-300 mb-2">TERMINAL: {HF_RUMORS[hf.r].tick} is volatile.</div>
      <div className="flex gap-2">
        <input type="text" value={hf.t} placeholder="TICKER" onChange={e => setHf(h => ({ ...h, t: e.target.value }))} className="p-4 w-2/3 bg-black border border-slate-700 rounded font-hack text-yellow-400 font-bold uppercase text-center" />
        <button onClick={() => { if (pl.bag >= 5000000) { useGame().setPl(p => ({ ...p, bag: p.bag - 5000000 })); alert(`INTEL: ${HF_RUMORS[hf.r].tick} going ${HF_RUMORS[hf.r].dir === 1 ? 'UP' : 'DOWN'}`); } }} className="w-1/3 bg-slate-800 text-xs font-bold rounded hover:bg-slate-700 text-white">INTEL ($5M)</button>
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
    <LabShell t="AGI SUPER-LAB" c="indigo" fontCls="font-tech" onHub={() => setTab('HUB')}>
      {!ai.ig ? (
        <FlashBtn onClick={async () => { if (pl.bag >= 50000000) { setPl(p => ({ ...p, bag: p.bag - 50000000 })); setAi(a => ({ ...a, ig: true, p: 1 })); adv(); return -50000000; } return undefined; }} dis={pl.bag < 50000000} label="IGNITE - $50M" color="indigo" txt="white" />
      ) : <>
        <div className="flex flex-col gap-1"><div className="flex justify-between text-xs font-bold text-red-500 uppercase tracking-widest"><span>Rival</span><span>{Math.floor(ai.r)}%</span></div><div className="bg-black/50 p-1 rounded-full border border-red-900/50"><div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(100, ai.r)}%` }}></div></div></div>
        <div className="flex flex-col gap-1"><div className="flex justify-between text-xs font-bold text-indigo-400 uppercase tracking-widest"><span>Your AI</span><span>{Math.floor(ai.p)}%</span></div><div className="bg-black/50 p-2 rounded-full border border-slate-700"><div className="bg-indigo-500 h-4 rounded-full shadow-[0_0_10px_#6366f1]" style={{ width: `${Math.min(100, ai.p)}%` }}></div></div></div>
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="bg-black/30 p-3 rounded-lg border border-slate-800"><div className="text-[10px] text-slate-500 font-bold mb-2 text-center uppercase tracking-widest">Data</div><Toggles opts={['Clean ($50M)', 'Scrape']} active={ai.d} setVal={v => setAi(a => ({ ...a, d: v }))} color="indigo" /></div>
          <div className="bg-black/30 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] text-slate-500 font-bold mb-2 text-center uppercase tracking-widest">Espionage</div>
            <button onClick={() => { if (pl.bag >= 10000000) { setPl(p => ({ ...p, bag: p.bag - 10000000 })); setAi(a => ({ ...a, r: Math.max(0, a.r - 5) })); } }} className="w-full text-[10px] font-bold p-2 bg-slate-800 text-white rounded mb-2 hover:bg-slate-700">POACH ($10M)</button>
            <button onClick={() => { if (pl.bag >= 5000000) { setPl(p => ({ ...p, bag: p.bag - 5000000 })); setAi(a => ({ ...a, r: Math.max(0, a.r - 2) })); } }} className="w-full text-[10px] font-bold p-2 bg-slate-800 text-white rounded hover:bg-slate-700">SMEAR ($5M)</button>
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
    <LabShell t="LIFESTYLE & LEGACY" c="green" onHub={() => setTab('HUB')}>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Assets</div>
      {ass.pent
        ? <div className="flex items-center gap-2"><div className="flex-1 p-3 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-xs tracking-widest rounded-xl">✓ PENTHOUSE {ass.mtgPent ? '(MORTGAGED +60k/mo)' : '(CASH +10k/mo)'}</div><button onClick={() => { const p = sellPrice(5000000); setPl(s => ({ ...s, bag: s.bag + p })); setAss(a => ({ ...a, pent: false, mtgPent: false })); }} className="shrink-0 px-3 py-3 bg-red-900/60 border border-red-700 text-red-400 font-black text-[10px] tracking-widest rounded-xl hover:bg-red-800">SELL</button></div>
        : <button onClick={() => { if (pl.bag >= 1000000) { setAss(a => ({ ...a, pent: true, mtgPent: true })); setPl(p => ({ ...p, bag: p.bag - 200000 })); } }} className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-300 text-center font-bold text-xs tracking-widest rounded-xl hover:bg-slate-800">🏢 MORTGAGE PENTHOUSE ($200K DOWN)</button>}
      {ass.mans
        ? <div className="flex items-center gap-2"><div className="flex-1 p-3 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-xs tracking-widest rounded-xl">✓ MANSION {ass.mtgMans ? '(MORTGAGED +250k/mo)' : '(CASH +50k/mo)'}</div><button onClick={() => { const p = sellPrice(25000000); setPl(s => ({ ...s, bag: s.bag + p })); setAss(a => ({ ...a, mans: false, mtgMans: false })); }} className="shrink-0 px-3 py-3 bg-red-900/60 border border-red-700 text-red-400 font-black text-[10px] tracking-widest rounded-xl hover:bg-red-800">SELL</button></div>
        : <button onClick={() => { if (pl.bag >= 5000000) { setAss(a => ({ ...a, mans: true, mtgMans: true })); setPl(p => ({ ...p, bag: p.bag - 1000000 })); } }} className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-300 text-center font-bold text-xs tracking-widest rounded-xl hover:bg-slate-800">🏡 MORTGAGE MANSION ($1M DOWN)</button>}
      <div className="text-[10px] font-bold text-slate-500 uppercase mt-2 tracking-widest text-center">Flex Fleet</div>
      {ass.jet
        ? <div className="flex items-center gap-2"><div className="flex-1 p-3 bg-green-900/30 border border-green-700 text-green-500 text-center font-bold text-xs tracking-widest rounded-xl">✓ PRIVATE JET {ass.mtgJet ? '(FINANCED +1.5M/mo)' : '(CASH +250k/mo)'}</div><button onClick={() => { const p = sellPrice(100000000); setPl(s => ({ ...s, bag: s.bag + p })); setAss(a => ({ ...a, jet: false, mtgJet: false })); }} className="shrink-0 px-3 py-3 bg-red-900/60 border border-red-700 text-red-400 font-black text-[10px] tracking-widest rounded-xl hover:bg-red-800">SELL</button></div>
        : <button onClick={() => { if (pl.bag >= 20000000) { setAss(a => ({ ...a, jet: true, mtgJet: true })); setPl(p => ({ ...p, bag: p.bag - 5000000 })); } }} className="w-full p-3 bg-slate-900 border border-slate-700 text-slate-300 text-center font-bold text-xs tracking-widest rounded-xl hover:bg-slate-800">🛩️ FINANCE PRIVATE JET ($5M DOWN)</button>}
      <div className="text-[10px] font-bold text-slate-500 uppercase mt-4 tracking-widest text-center">God Tier Flexes</div>
      <UpgBtn onClk={() => bAss('spt', 2000000000, 'SPORTS TEAM')} cost={2000000000} title="SPORTS TEAM" unl={ass.spt} pB={pl.bag} />
      <UpgBtn onClk={() => bAss('spc', 10000000000, 'SPACE CORP')} cost={10000000000} title="SPACE CORP" unl={ass.spc} pB={pl.bag} />
      <div className="text-[10px] font-bold text-slate-500 uppercase mt-4 tracking-widest text-center">Legacy Prestige (New Game+)</div>
      <UpgBtn onClk={() => bAss('swf', 25000000000, 'SOVEREIGN WEALTH')} cost={25000000000} title="SOVEREIGN WEALTH FUND" unl={ass.swf} pB={pl.bag} />
      <div className="text-[8px] text-slate-600 text-center mt-1">{mktTag} — sell prices vary with market</div>
    </LabShell>
  );
};

const PresTab = () => {
  const { pl, prs, setPrs, rPrsA, rPrs1TT, rPrs1OP, rPrs1ET, dVp, dDef, setTab, adv, setPl } = useGame();
  return (
    <LabShell t="POTUS WAR ROOM" c="red" fontCls="font-gov" onHub={() => setTab('HUB')}>
      {prs.cd > 0 ? (
        <div className="p-8 text-center bg-red-900/20 text-red-500 font-black tracking-widest rounded-xl font-gov">POLITICAL EXILE ({prs.cd} MO)</div>
      ) : !prs.r ? <>
        <div className="bg-red-900/20 border border-red-800/50 p-3 rounded-xl text-center">
          <div className="text-red-400 font-black text-sm tracking-widest font-gov">PHASE 1: SHADOW CAMPAIGN</div>
          <div className="text-slate-500 text-[10px] mt-1">One-time pre-campaign moves. Stack tokens before going public.</div>
        </div>
        {prs.p1tt
          ? <div className="w-full p-2 bg-green-900/30 border border-green-700 text-green-400 text-center font-bold text-[10px] tracking-widest rounded-xl">✓ THINK TANK {prs.sh ? '— 🛡️ MEDIA SHIELD READY' : '(FAILED)'}</div>
          : <FlashBtn onClick={rPrs1TT} dis={pl.bag < 100000000 || pl.clout < 20} label="FUND THINK TANK ($100M + 20 CLOUT)" />}
        {prs.p1op
          ? <div className="w-full p-2 bg-green-900/30 border border-green-700 text-green-400 text-center font-bold text-[10px] tracking-widest rounded-xl">✓ OPPO RESEARCH {prs.ot ? '— 💣 OCT SURPRISE LOADED' : '(FAILED — DOJ FINE)'}</div>
          : <FlashBtn onClick={rPrs1OP} dis={pl.bag < 150000000 || pl.aura < 30} label="OPPO RESEARCH ($150M + 30 AURA)" />}
        {prs.p1et
          ? <div className="w-full p-2 bg-green-900/30 border border-green-700 text-green-400 text-center font-bold text-[10px] tracking-widest rounded-xl">✓ EXPLORATORY TOUR — BASE POLLS +2% ALL</div>
          : <FlashBtn onClick={rPrs1ET} dis={pl.bag < 50000000 || pl.clout < 25} label="EXPLORATORY TOUR ($50M + 25 CLOUT)" />}
        <div className="border-t border-slate-700 pt-2 mt-1">
          <div className="text-[10px] text-slate-500 font-bold tracking-widest mb-2 text-center">SELECT VP PICK</div>
          <Toggles opts={['Establishment', 'Maverick', 'Nepo']} active={prs.vp} setVal={v => setPrs(pr => ({ ...pr, vp: v }))} color="red" />
          <div className="mt-2">
            <FlashBtn onClick={async () => {
              if (pl.bag < 105000000) return undefined;
              await new Promise(r => setTimeout(r, 2000));
              setPl(p => ({ ...p, bag: p.bag - 100000000 }));
              setPrs({ r: true, m: 0, cd: 0, rem: prs.rem, rst: (prs.rem ? 42 : 35) + (prs.p1et ? 2 : 0), sun: (prs.rem ? 42 : 35) + (prs.p1et ? 2 : 0), sub: (prs.rem ? 42 : 35) + (prs.p1et ? 2 : 0), vp: prs.vp, fr: false, vu: false, du: false, sh: prs.sh, ot: prs.ot, p1tt: prs.p1tt, p1op: prs.p1op, p1et: prs.p1et, ev: { d1: false, d2: false, o: false } });
              adv(); return -100000000;
            }} dis={pl.bag < 105000000} label="ANNOUNCE CANDIDACY ($100M — REQUIRES $105M BUFFER)" color="red" txt="white" />
          </div>
        </div>
      </> : <div className="flex flex-col gap-2">
        <div className="text-center font-black text-xl text-white bg-slate-900 p-2 rounded-lg border border-slate-700 font-gov">{12 - prs.m} MO LEFT</div>
        {['rst', 'sun', 'sub'].map(r => (
          <div key={r} className="bg-black/50 p-2 rounded-lg border border-slate-800">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest mb-1"><span className={r === 'rst' ? 'text-yellow-400' : r === 'sun' ? 'text-green-400' : 'text-red-400'}>{r === 'rst' ? 'Rust Belt' : r === 'sun' ? 'Sun Belt' : 'Suburbs'}</span><span className="text-white">{prs[r].toFixed(1)}%</span></div>
            <div className="bg-slate-900 h-2 rounded-full"><div className={`${prs[r] >= 51 ? 'bg-green-500 shadow-[0_0_10px_#22c55e]' : 'bg-slate-500'} h-full rounded-full transition-all`} style={{ width: `${Math.min(100, prs[r])}%` }}></div></div>
          </div>
        ))}
        <div className="text-[10px] text-slate-500 font-bold tracking-widest text-center mt-1">AIR WAR & GROUND GAME</div>
        <FlashBtn onClick={() => rPrsA('tv')} dis={pl.bag < 100000000 || pl.clout < 10} label="NATIONAL TV BUY ($100M + 10 C)" color="blue" txt="white" />
        <FlashBtn onClick={() => rPrsA('smear')} dis={pl.aura < 25} label="SMEAR OPP (25 AURA)" />
        <FlashBtn onClick={() => rPrsA('gala')} label="GALA (+$200M)" color="yellow" txt="black" />
        <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t border-slate-700">
          <button onClick={dVp} disabled={prs.vu} className={`w-full p-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${!prs.vu ? 'bg-slate-800 text-white border border-slate-600 hover:bg-slate-700' : 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed'}`}>Deploy VP Action</button>
          <button onClick={() => { void dDef(); }} disabled={prs.du || pl.bag < 75000000 || pl.clout < 20} className={`w-full p-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors ${(!prs.du && pl.bag >= 75000000 && pl.clout >= 20) ? 'bg-red-900/40 text-red-400 border border-red-800 hover:bg-red-900/60' : 'bg-slate-900 text-slate-700 border border-slate-800 cursor-not-allowed'}`}>Black Ops ($75M)</button>
        </div>
      </div>}
    </LabShell>
  );
};

// ─── Main game interface ──────────────────────────────────────────────────────

const GameInterface = () => {
  const { pl, prs, ass, mkt, news, tab, setTab, imp, rain, mod, cancelIntro, gBusy, displayBag, alias, age, cap, isTierUnlocked, peaks } = useGame();
  const busy = gBusy || imp.some(i => !i.w);
  const cancelIntroStyles = { userSelect: 'none', pointerEvents: 'none' };

  if (cancelIntro) {
    return (
      <div className="min-h-screen bg-black text-white font-hack flex flex-col items-center justify-center p-4 text-center animate-shake-hard select-none" style={cancelIntroStyles}>
        <div className="text-8xl mb-6 animate-pulse">🚫</div>
        <h1 className="text-6xl font-black text-red-500 mb-4 tracking-widest drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] font-hype">CANCELLED</h1>
        <p className="text-slate-300 text-xl max-w-sm leading-relaxed mb-6">{cancelIntro.r}</p>
        <p className="text-pink-400 font-bold text-lg italic">"{cancelIntro.i}"</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${prs.r ? 'bg-oval' : ass.mans ? 'bg-mansion' : ass.pent ? 'bg-penthouse' : 'bg-basement'} ${busy ? 'animate-shake-hard' : ''} ${pl.aura < 20 ? 'aura-panic' : ''}`}>

      {/* Floating impacts */}
      {imp.map(i => i.kind === 'bag'
        ? <div key={i.id} className={`impact-text ${i.w ? 'text-green-400' : 'text-red-500'}`}>{i.w ? '+' : '-'}${fMny(Math.abs(i.a))}</div>
        : i.kind === 'aura'
        ? <div key={i.id} className="impact-aura">{i.a > 0 ? '+' : ''}{i.a} AURA</div>
        : <div key={i.id} className="impact-clout">{i.a > 0 ? '+' : ''}{i.a} CLOUT</div>
      )}
      {rain && Array.from({ length: 30 }).map((_, i) => (
        <div key={i} className="money-rain" style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 0.5}s` }}>💸</div>
      ))}

      {/* Modal */}
      {mod.s && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4">
          <div className={`p-8 w-full max-w-sm ${mod.ui} text-center shadow-[0_0_50px_rgba(0,0,0,1)]`}>
            <h2 className="text-3xl font-black mb-4 text-white tracking-widest">{mod.t}</h2>
            <p className="mb-8 text-slate-300 text-lg">{mod.m}</p>
            <div className="flex flex-col gap-3">{mod.o.map((o, i) => <button key={i} onClick={o.action} className="p-4 bg-slate-800 border border-slate-600 text-white font-black tracking-widest rounded-xl hover:bg-slate-700">{o.label}</button>)}</div>
          </div>
        </div>
      )}

      {/* HUD */}
      <div className="mobile-hud px-3 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="text-[9px] font-bold text-slate-400 tracking-widest leading-none mb-0.5 font-hack">NET WORTH — {alias || 'ANON'}</div>
            <div className="flex items-center gap-1.5">
              {displayBag >= 1000000000
                ? <div className="text-2xl font-black billionaire-bag leading-none">${fMny(displayBag)}</div>
                : <div className="text-2xl font-black text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)] leading-none font-hack">${fMny(displayBag)}</div>
              }
              <div className="text-lg">{prs.r ? '🇺🇸' : ass.mans ? '🤳😎' : ass.pent ? '🕴️💎' : '🧢🎒'}</div>
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1 min-w-0">
            <div>
              <div className="flex justify-between text-[9px] font-bold text-yellow-400 tracking-widest leading-none"><span>AURA</span><span>{pl.aura}/{cap}</span></div>
              <div className="bg-black/50 h-1.5 rounded-full mt-0.5 border border-slate-700"><div className="bg-yellow-400 h-full rounded-full aura-glow transition-all" style={{ width: `${Math.min(100, (pl.aura / cap) * 100)}%` }}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-[9px] font-bold text-red-400 tracking-widest leading-none"><span>CLOUT</span><span>{pl.clout}/{cap}</span></div>
              <div className="bg-black/50 h-1.5 rounded-full mt-0.5 border border-slate-700"><div className="bg-red-500 h-full rounded-full clout-glow transition-all" style={{ width: `${Math.min(100, (pl.clout / cap) * 100)}%` }}></div></div>
            </div>
          </div>
          <div className="text-[9px] font-hack text-slate-400 text-right leading-relaxed flex-shrink-0">
            <div>AGE <span className="text-white font-bold">{age}</span></div>
            <div>MO <span className="text-white font-bold">{pl.mo % 12 + 1}</span></div>
            <div><span className={`font-bold ${mkt === 1 ? 'text-green-400' : mkt === 2 ? 'text-red-400' : mkt === 3 ? 'text-purple-400' : 'text-white'}`}>{MARKETS[mkt].n}</span></div>
          </div>
        </div>
        {/* Tab bar */}
        <div className="flex gap-1 overflow-x-auto mt-2 pb-1 scrollbar-hide">
          {TABS.map(tb => {
            const unlocked = tb.id === 'HUB' || isTierUnlocked(tb.section);
            const req = TIER_UNLOCKS[tb.section];
            return (
              <button key={tb.id} onClick={() => unlocked && setTab(tb.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-colors ${tb.cls} ${!unlocked ? 'bg-slate-900/80 text-slate-600 cursor-not-allowed border border-slate-800' : tab === tb.id ? 'bg-white text-black' : tb.section === 'pres' ? 'bg-red-900/40 text-red-400 border border-red-800/60' : tb.section === 'god' ? 'bg-slate-700/60 text-slate-300' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>
                {unlocked ? tb.label : `🔒 ${tb.label}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 pb-16">
        <div className="max-w-xl mx-auto">
          {tab === 'HUB'  && <HubTab />}
          {tab === 'SW'   && (isTierUnlocked('core') ? <SwTab /> : <LockedTierScreen section="core" />)}
          {tab === 'DROP' && (isTierUnlocked('core') ? <DropTab /> : <LockedTierScreen section="core" />)}
          {tab === 'CC'   && (isTierUnlocked('core') ? <CcTab /> : <LockedTierScreen section="core" />)}
          {tab === 'POD'  && (isTierUnlocked('core') ? <PodTab /> : <LockedTierScreen section="core" />)}
          {tab === 'BOX'  && (isTierUnlocked('empire') ? <BoxTab /> : <LockedTierScreen section="empire" />)}
          {tab === 'TOUR' && (isTierUnlocked('empire') ? <TourTab /> : <LockedTierScreen section="empire" />)}
          {tab === 'TECH' && (isTierUnlocked('empire') ? <TechTab /> : <LockedTierScreen section="empire" />)}
          {tab === 'CRYP' && (isTierUnlocked('empire') ? <CrpTab /> : <LockedTierScreen section="empire" />)}
          {tab === 'MOV'  && (isTierUnlocked('god') ? <MovTab /> : <LockedTierScreen section="god" />)}
          {tab === 'HF'   && (isTierUnlocked('god') ? <HfTab /> : <LockedTierScreen section="god" />)}
          {tab === 'AI'   && (isTierUnlocked('god') ? <AiTab /> : <LockedTierScreen section="god" />)}
          {tab === 'BILL' && (isTierUnlocked('god') ? <BillTab /> : <LockedTierScreen section="god" />)}
          {tab === 'PRES' && (isTierUnlocked('pres') ? <PresTab /> : <LockedTierScreen section="pres" />)}
        </div>
      </div>

      {/* News ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          {news.map((n, i) => <span key={i} className="mx-12" dangerouslySetInnerHTML={{ __html: n }} />)}
          <span className="mx-12 text-slate-500">/// END FEED ///</span>
        </div>
      </div>
    </div>
  );
};

// ─── Root ─────────────────────────────────────────────────────────────────────

const BagChaserInner = () => {
  const { ph, death, cancelIntro } = useGame();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {death       && !cancelIntro ? <LegacyAutopsy /> : null}
      {!death      && ph === 'PROLOGUE' ? <Prologue /> : null}
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