import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';

const stats = [
  { label: 'Current Aura', key: 'aura', color: 'text-yellow-400', bar: 'bg-yellow-400' },
  { label: 'Current Clout', key: 'clout', color: 'text-red-400', bar: 'bg-red-400' },
  { label: 'Peak Wealth', valFunc: (peaks) => `$${fMny(peaks?.peakB || 0)}`, color: 'text-green-400' },
  { label: 'Peak Aura', key: 'peakA', isPeak: true, color: 'text-yellow-500' },
  { label: 'Peak Clout', key: 'peakC', isPeak: true, color: 'text-red-500' },
];

export const ExpView = () => {
  const { cap, pl, peaks, hl } = useGame();

  const totalLifetimeIncome = Object.values(hl || {}).reduce((a, b) => a + b, 0);
  const globalLevel = Math.floor(Math.sqrt(totalLifetimeIncome / 10000)) || 1;
  const nextMilestone = Math.pow(globalLevel + 1, 2) * 10000;
  const progress = (totalLifetimeIncome / nextMilestone) * 100;

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
        {stats.map((s, i) => {
          let val;
          if (s.valFunc) val = s.valFunc(peaks);
          else if (s.isPeak) val = peaks?.[s.key] || 0;
          else val = pl?.[s.key] || 0;

          return (
            <div key={i} className="p-6 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">{s.label}</span>
                <span className={`font-black tracking-widest ${s.color}`}>{val}</span>
              </div>
              {s.key && !s.isPeak && (
                <div className="bg-black/50 h-2 rounded-full border border-slate-800">
                  <div className={`h-full rounded-full transition-all ${s.bar}`} style={{ width: `${Math.min(100, (val / cap) * 100)}%` }}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
