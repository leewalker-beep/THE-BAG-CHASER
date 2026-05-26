import React, { useState } from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';

export const PostMortem = () => {
  const { pl, artCollection, guttedFirms, isPresident, mhEmergencies, ph, setPh, alias } = useGame();

  const netWorth = pl.bag;
  const months = Math.max(1, pl.mo);
  const efficiency = Math.floor(netWorth / months);

  const getArchetype = () => {
    if (isPresident) return "THE COMMANDER IN CHIEF";
    if (artCollection.length >= 50 && guttedFirms < 2) return "THE CULTURAL OLIGARCH";
    if (guttedFirms >= 5) return "THE CORPORATE RAIDER";
    if (netWorth >= 1000000000) return "THE BILLIONAIRE MOGUL";
    if (netWorth < 10000) return "LIQUIDATED / WASHED";
    return "THE STRATEGIC HUSTLER";
  };

  const archetype = getArchetype();

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-hack flex flex-col items-center justify-center p-6 animate-fadeIn">
      <div className="max-w-md w-full bg-slate-900/50 border-2 border-blue-500/30 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_100px_rgba(59,130,246,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

        <div className="text-center mb-8">
          <h2 className="text-[10px] text-blue-400 font-black tracking-[0.4em] uppercase mb-2">Session Terminated</h2>
          <h1 className="text-4xl font-black tracking-tighter font-hype uppercase italic text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Run Performance Matrix
          </h1>
        </div>

        <div className="space-y-6">
          <div className="bg-black/40 border border-slate-800 p-6 rounded-2xl text-center">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Determined Archetype</div>
            <div className="text-2xl font-black text-blue-400 tracking-tight font-hype uppercase">{archetype}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-black/40 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Efficiency</div>
              <div className="text-xl font-black text-emerald-400">${fMny(efficiency)}<span className="text-[8px] text-slate-500 ml-1">/MO</span></div>
            </div>
            <div className="bg-black/40 border border-slate-800 p-4 rounded-2xl text-center">
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Emergencies</div>
              <div className="text-xl font-black text-red-500">{mhEmergencies}</div>
            </div>
          </div>

          <div className="bg-black/40 border border-slate-800 p-6 rounded-2xl">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase">Final Net Worth</span>
                <span className="font-black text-white">${fMny(netWorth)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase">Empire Duration</span>
                <span className="font-black text-white">{Math.floor(months/12)}Y {months%12}M</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-bold uppercase">Global Respect</span>
                <span className="font-black text-yellow-500">{pl.aura} AURA / {pl.clout} CLOUT</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setPh('LEADERBOARD')}
          className="w-full mt-8 py-5 bg-blue-600 text-white font-black tracking-[0.2em] rounded-2xl hover:bg-blue-500 transition-all active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.3)] uppercase text-xs"
        >
          View Global Standings
        </button>
      </div>
    </div>
  );
};
