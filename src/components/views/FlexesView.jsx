import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { styles } from '../../styles.js';

const flexItems = [
  { key: 'watch', label: 'Patek Philippe Watch', cost: 150000, icon: '⌚', clout: 25, yield: 750, yieldType: 'appr' },
  { key: 'car',   label: 'F1 Precision Supercar', cost: 450000, icon: '🏎️', clout: 150, yield: -8000, yieldType: 'maint' },
  { key: 'pent',  label: 'Skyline Penthouse',     cost: 8500000, icon: '🏢', clout: 500, aura: 200, yield: 15000, yieldType: 'yield' },
  { key: 'yct',   label: 'Mega Yacht',            cost: 65000000, icon: '🛥️', clout: 2000, aura: 500, yield: -250000, yieldType: 'maint' },
  { key: 'spt',   label: 'Pro Basketball Team',   cost: 400000000, icon: '🏀', clout: 10000, aura: 5000, yield: 0, yieldType: 'dynamic' },
];

export const FlexesView = () => {
  const { ass, pl, bAss } = useGame();

  return (
    <div className="flex flex-col gap-4">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
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
