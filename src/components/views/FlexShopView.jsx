import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { styles } from '../../styles.js';

const shopItems = [
  { key: 'hePent',    label: 'Ultra High-End Penthouse', cost: 5000000,  icon: '🏙️', desc: 'Accelerates Mental Health recovery speed by 100%.' },
  { key: 'cmYct',     label: 'Custom Mega-Yacht',        cost: 50000000, icon: '🛳️', desc: 'Massively expands max Clout caps by 10x.' },
  { key: 'legalTeam', label: 'Elite Legal Defense',      cost: 0,        icon: '⚖️', desc: 'Halves risk metrics and reduces tragedy penalties. Monthly $1M retainer.', retainer: 1000000 },
];

export const FlexShopView = () => {
  const { ass, pl, bAss, setTab, setSelTier } = useGame();

  return (
    <div className="flex flex-col gap-4">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
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
