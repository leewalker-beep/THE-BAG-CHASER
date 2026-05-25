import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn } from '../ui/Shared.jsx';

const ElectionWarRoomTab = () => {
  const {
    pl,
    campaign,
    rCampaignAction,
    rElectionNightResolution,
    setTab
  } = useGame();

  const { currentWeek, currentMonth, warchest, phase, regionalPolling, opponentPolling } = campaign || {};

  const isHqPhase = phase === 'CORPORATE_HQ';
  const isCompleted = phase === 'COMPLETED';

  const regions = [
    { id: 'blueWall', label: 'The Blue Wall', ev: 44 },
    { id: 'rustBelt', label: 'The Rust Belt', ev: 46 },
    { id: 'sunBelt',  label: 'The Sun Belt',  ev: 55 },
  ];

  return (
    <LabShell t="ELECTORAL WAR ROOM" c="red" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="relative flex flex-col gap-4 min-h-[500px]">
        {/* Phase Overlay */}
        {isHqPhase && (
          <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center rounded-xl border-2 border-red-500/50">
            <div className="text-5xl mb-4">💼</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">MONTHLY BLOCK COMPLETED</h2>
            <p className="text-slate-300 text-sm mb-6 leading-relaxed">
              Your political operators are awaiting directives from HQ. Return to your corporate empire to manage assets and clear the next block.
            </p>
            <button
              onClick={() => setTab('HUB')}
              className="px-8 py-3 bg-red-600 text-white font-black tracking-widest rounded-xl hover:bg-red-500 transition-all active:scale-95"
            >
              RETURN TO HQ
            </button>
          </div>
        )}

        {/* Header: Week Tracker */}
        <div className="bg-black border border-slate-800 p-4 rounded-xl flex justify-between items-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Election Cycle</span>
            <div className="text-xl font-black text-white font-gov tracking-tighter">
              MONTH: <span className="text-red-500">{currentMonth}</span> / 13 | WEEK: <span className="text-red-500">{currentWeek}</span> / 52
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Warchest</span>
            <div className="text-lg font-black text-green-400 font-gov">${fMny(warchest)}</div>
          </div>
        </div>

        {/* Module 1: Battleground Telemetry */}
        <div className="bg-slate-950 border border-slate-800 p-5 rounded-xl flex flex-col gap-4">
          <h3 className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Battleground Telemetry</h3>

          {regions.map(region => (
            <div key={region.id} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-white uppercase">{region.label} <span className="text-[10px] text-slate-500">({region.ev} EVs)</span></span>
                <div className="flex gap-3 text-xs font-black">
                  <span className="text-blue-400">YOU: {regionalPolling[region.id]}%</span>
                  <span className="text-red-500">OPP: {opponentPolling[region.id]}%</span>
                </div>
              </div>
              <div className="h-3 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
                {/* Opponent Bar (from right) */}
                <div
                  className="absolute right-0 top-0 h-full bg-red-900/50 transition-all duration-1000"
                  style={{ width: `${opponentPolling[region.id]}%` }}
                />
                {/* Player Bar */}
                <div
                  className={`absolute left-0 top-0 h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]`}
                  style={{ width: `${regionalPolling[region.id]}%` }}
                />
                {/* 50% Marker */}
                <div className="absolute left-1/2 top-0 w-0.5 h-full bg-white/20 z-10" />
              </div>
            </div>
          ))}
        </div>

        {/* Module 2: Weekly Operational Actions */}
        <div className="flex flex-col gap-2">
          {!isCompleted && currentWeek < 52 ? (
            <>
              <FlashBtn
                onClick={() => rCampaignAction('RUST_BELT_RALLY')}
                dis={pl.mentalHealth < 20 || pl.clout < 50 || isHqPhase}
                label="Run Rust Belt Working-Class Rallies"
                color="blue-900/40"
                txt="blue-400"
                cost={0}
              />
              <div className="flex justify-between px-2 text-[9px] text-slate-500 font-bold uppercase mb-1">
                <span>Costs: -20 MH, -50 Clout, -5A / -10C Decay</span>
                <span className="text-blue-400">+5% Rust Belt, +20 Aura</span>
              </div>

              <FlashBtn
                onClick={() => rCampaignAction('SUN_BELT_ADS')}
                dis={warchest < 500000000 || isHqPhase}
                label="Saturate Sun Belt Airwaves with TV Ads"
                color="red-900/40"
                txt="red-400"
                cost={0}
              />
              <div className="flex justify-between px-2 text-[9px] text-slate-500 font-bold uppercase mb-1">
                <span>Costs: -$500M Warchest, -5A / -10C Decay</span>
                <span className="text-red-400">+4% Sun Belt, +300 Clout</span>
              </div>

              <FlashBtn
                onClick={() => rCampaignAction('SILICON_GALA')}
                dis={pl.aura < 150 || isHqPhase}
                label="Host Elite Silicon Valley Private Gala"
                color="slate-800"
                txt="white"
                cost={0}
              />
              <div className="flex justify-between px-2 text-[9px] text-slate-500 font-bold uppercase">
                <span>Costs: -150 Aura, -5A / -10C Decay</span>
                <span className="text-emerald-400">+$1.2B Warchest, +6% Blue Wall</span>
              </div>
            </>
          ) : currentWeek === 52 && !isCompleted ? (
            <button
              onClick={rElectionNightResolution}
              className="w-full py-6 bg-gradient-to-b from-yellow-400 to-yellow-600 text-black font-black text-xl tracking-[0.2em] rounded-xl shadow-[0_0_30px_rgba(234,179,8,0.4)] hover:scale-[1.02] active:scale-95 transition-all animate-pulse uppercase"
            >
              COMMENCE ELECTORAL VOTE COUNT
            </button>
          ) : (
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-xl text-center">
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-widest">CAMPAIGN CONCLUDED</h3>
              <p className="text-slate-400 text-xs italic">"History is written by the victors."</p>
            </div>
          )}
        </div>

        <p className="text-[10px] text-slate-600 text-center italic mt-4">
          "A baseline operational fee of $100,000,000 is deducted from the Warchest every week."
        </p>
      </div>
    </LabShell>
  );
};

export default ElectionWarRoomTab;
