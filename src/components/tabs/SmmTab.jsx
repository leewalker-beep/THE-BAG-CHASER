import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn } from '../ui/Shared.jsx';

export const SmmTab = () => {
  const {
    pl, smmClients, clientCrisis, rSmmPitch, rSmmFix, setTab, karmaFlags, setKarmaFlags,
    smmRetainerActive, rLaunchSmmRetainer
  } = useGame();

  // Street Tier visual spike styling
  const streetTierGlow = "shadow-[0_0_20px_rgba(59,130,246,0.4)] border-blue-500/60";

  return (
    <div className={`transition-all duration-500 rounded-2xl ${smmRetainerActive ? streetTierGlow : ''}`}>
      <LabShell hustleKey="smm" t={smmRetainerActive ? "AGENCY RETAINER DASHBOARD" : "SMM MICRO-AGENCY"} c="sky" fontCls="font-tech" onHub={() => setTab('HUB')} tier={smmRetainerActive ? 1 : 0}>
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">IGNORE CLIENT CRISIS (RISK)</div>
          <button
            onClick={() => setKarmaFlags(f => ({ ...f, ignoredSmmCrisis: !f.ignoredSmmCrisis }))}
            className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.ignoredSmmCrisis ? 'bg-red-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.ignoredSmmCrisis ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>

        {!smmRetainerActive && (
          <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Pitch Cost</div>
            <div className="text-xs font-black text-purple-400">20 MENTAL HEALTH</div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {/* Active Portfolio Display */}
          <div className={`bg-black/40 p-4 rounded-xl border transition-all text-center ${clientCrisis ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">
              {smmRetainerActive ? "Monthly Retainer Revenue" : "Active Portfolio"}
            </div>
            <div className={`text-2xl font-black ${clientCrisis ? 'text-red-500' : 'text-sky-400'}`}>
              {smmRetainerActive ? `$${fMny((smmClients * 300) + 500)} / mo` : `${smmClients} CLIENTS`}
            </div>
            <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
              {smmRetainerActive
                ? "Ticker status: PASSIVE | Flow: STABLE"
                : `Yield: +$${fMny(smmClients * 300)}/mo | +${smmClients * 2} Aura/mo`}
            </div>
          </div>

          {/* Phase 1 Pitching View */}
          {!smmRetainerActive && (
            <>
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

              <div className="mt-2 border-t border-slate-800 pt-4">
                <button
                  onClick={rLaunchSmmRetainer}
                  disabled={pl.bag < 4000}
                  className="w-full py-3 bg-blue-600/20 border border-blue-500/50 text-blue-400 font-black rounded-xl hover:bg-blue-600 hover:text-white disabled:bg-slate-800 disabled:opacity-40 disabled:text-slate-500 transition-all text-xs tracking-widest uppercase shadow-lg"
                >
                  Launch Retainer Packages (-$4,000)
                </button>
              </div>
            </>
          )}

          {/* Phase 2 Retainer View */}
          {smmRetainerActive && (
            <div className="flex flex-col gap-3">
              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-xl text-center">
                <div className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Retainer Operations</div>
                <div className="text-[10px] text-slate-400 italic">"The agency is running on autopilot. Passive income is being deposited monthly."</div>
              </div>

              <div className="p-3 bg-black/60 border border-slate-800 rounded-xl">
                 <div className="text-[9px] text-slate-500 uppercase font-black mb-2 tracking-tighter">System Health</div>
                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-slate-300">Passive Ticker</span>
                       <span className="text-[10px] text-green-400 font-bold">ONLINE</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] text-slate-300">Chaos Interceptor</span>
                       <span className="text-[10px] text-blue-400 font-bold">ACTIVE</span>
                    </div>
                 </div>
              </div>

              <p className="text-[9px] text-slate-400 text-center italic mt-2">"Retainer clients expect 24/7 coverage. 3 AM meltdowns are a constant risk."</p>
            </div>
          )}

          {!smmRetainerActive && <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">"Flat 50% success rate. Street leverage is everything."</p>}
        </div>
      </LabShell>
    </div>
  );
};
