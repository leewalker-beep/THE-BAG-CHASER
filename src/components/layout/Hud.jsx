import React from 'react';
import { useGame, TIERS } from '../../GameEngine.jsx';
import { fMny, MARKETS } from '../../config.js';

export const Hud = () => {
  const {
    pl, prs, ass, mkt, imp, rain, displayBag, alias, age, cap, selTier, setSelTier, setTab, tab, performHardReset
  } = useGame();

  const handleHardReset = () => {
    performHardReset();
  };

  return (
    <>
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
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${ (tab === 'HUB' && selTier === idx.toString()) ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'} ${!unlocked ? 'opacity-60' : ''}`}>
                {unlocked ? t.label.toUpperCase() : `🔒 ${t.label.toUpperCase()}`}
              </button>
            );
          })}
          <span className="text-slate-700 mx-1">|</span>
          <button onClick={() => { setTab('FLEXES'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${tab === 'FLEXES' ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'}`}>
            FLEXES
          </button>
          <button onClick={() => { setTab('FLEX_SHOP'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${tab === 'FLEX_SHOP' ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'}`}>
            FLEX SHOP
          </button>
          <button onClick={() => { setTab('EXP'); }}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black whitespace-nowrap tracking-wide transition-all active:scale-95 duration-100 ${tab === 'EXP' ? 'bg-white text-black' : 'bg-slate-800 text-slate-300 drop-shadow-sm hover:bg-slate-700'}`}>
            EXP POINTS
          </button>
        </div>
      </div>
    </>
  );
};
