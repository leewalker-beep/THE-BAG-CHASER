import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { styles } from '../../styles.js';

const hustleIcons = { streetwear: '👕', dropship: '📦', vintage: '👕', tech: '💻', smm: '📱', runners: '🏃' };

export const AutopsyReport = () => {
  const { death, alias, peaks, hl, tally, hustleClicks, performHardReset } = useGame();
  if (!death) return null;

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

        <button onClick={performHardReset} className="w-full p-6 bg-red-600 text-white font-black tracking-widest text-xl rounded-xl hover:bg-red-500 transition-all active:scale-95 duration-100 shadow-[0_0_20px_#dc2626]">PLUG BACK IN</button>
      </div>
    </div>
  );
};
