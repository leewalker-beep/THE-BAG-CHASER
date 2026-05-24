import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn } from '../ui/Shared.jsx';

export const MovieMogulTab = () => {
  const {
    pl, movieProject, rMovieGreenlight, rMovieHypeBag, rMovieHypeClout, rMovieHypeAura, rMovieRelease, setTab
  } = useGame();

  const mogulPurpleGlow = "shadow-[0_0_35px_rgba(168,85,247,0.4)] border-purple-500/60";

  return (
    <div className={`transition-all duration-500 rounded-2xl ${mogulPurpleGlow}`}>
      <LabShell hustleKey="mov" t="BLOCKBUSTER STUDIO" c="purple" fontCls="font-hype" onHub={() => setTab('HUB')} tier={4}>
        <div className="flex flex-col gap-4 animate-fadeIn">

          {/* Header Info */}
          <div className="bg-black/90 border-2 border-yellow-500 p-5 rounded-2xl text-center shadow-[inset_0_0_30px_rgba(234,179,8,0.1)]">
            <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-yellow-500 to-purple-400 font-hype tracking-widest uppercase">
              Hollywood Studio Executive
            </h3>
            <p className="text-[10px] text-slate-300 mt-1 font-medium italic">
              "Produce cinematic masterpieces to redefine your global legacy."
            </p>
          </div>

          {movieProject.status === 'IDLE' ? (
            /* PHASE 1: GREENLIGHT */
            <div className="space-y-3">
              <div className="text-[10px] text-purple-400 font-black uppercase tracking-widest text-center mb-1">Select Project Tier</div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { tier: 1, label: "Indie Art-House", cost: 5000000 },
                  { tier: 2, label: "Mid-Budget Drama", cost: 50000000 },
                  { tier: 3, label: "Blockbuster Tentpole", cost: 200000000 }
                ].map((p) => (
                  <button
                    key={p.tier}
                    onClick={() => rMovieGreenlight(p.tier)}
                    disabled={pl.bag < p.cost}
                    className="p-4 bg-black/60 border border-purple-500/30 rounded-xl flex justify-between items-center hover:border-yellow-500/50 transition-all group disabled:opacity-40"
                  >
                    <div className="text-left">
                      <div className="font-bold text-xs text-purple-300 uppercase tracking-widest group-hover:text-yellow-400 transition-colors">{p.label}</div>
                      <div className="text-[9px] text-slate-500 mt-1 italic">Production Budget Required</div>
                    </div>
                    <div className="text-yellow-500 font-black text-sm">${fMny(p.cost)}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* PHASE 2 & 3: PRODUCTION & RELEASE */
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-purple-500/40 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] text-purple-300 font-black uppercase tracking-widest">Active Production</span>
                  <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-500 rounded border border-yellow-500/30 font-bold uppercase">
                    {movieProject.budgetTier === 1 ? 'INDIE' : movieProject.budgetTier === 2 ? 'STUDIO' : 'BLOCKBUSTER'}
                  </span>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">
                    <span>Marketing Hype Level</span>
                    <span className="text-yellow-400">{movieProject.hypeLevel}%</span>
                  </div>
                  <div className="bg-black/60 h-3 rounded-full border border-slate-800 overflow-hidden p-0.5">
                    <div
                      className="bg-gradient-to-r from-purple-600 to-yellow-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      style={{ width: `${movieProject.hypeLevel}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <button
                      onClick={rMovieHypeBag}
                      disabled={pl.bag < 500000 || movieProject.hypeLevel >= 100}
                      className="bg-purple-900/40 border border-purple-500/40 p-2 rounded-lg flex flex-col items-center hover:bg-purple-800/40 transition-all disabled:opacity-30"
                    >
                      <span className="text-[10px] font-black text-purple-300 uppercase">PR FIRM</span>
                      <span className="text-[8px] text-yellow-500">-$500K</span>
                    </button>
                    <button
                      onClick={rMovieHypeClout}
                      disabled={pl.clout < 50 || movieProject.hypeLevel >= 100}
                      className="bg-red-900/20 border border-red-500/40 p-2 rounded-lg flex flex-col items-center hover:bg-red-800/20 transition-all disabled:opacity-30"
                    >
                      <span className="text-[10px] font-black text-red-400 uppercase">VIRAL AD</span>
                      <span className="text-[8px] text-red-500">-50 CLOUT</span>
                    </button>
                    <button
                      onClick={rMovieHypeAura}
                      disabled={pl.aura < 25 || movieProject.hypeLevel >= 100}
                      className="bg-yellow-900/20 border border-yellow-500/40 p-2 rounded-lg flex flex-col items-center hover:bg-yellow-800/20 transition-all disabled:opacity-30"
                    >
                      <span className="text-[10px] font-black text-yellow-400 uppercase">ENDORSE</span>
                      <span className="text-[8px] text-yellow-500">-25 AURA</span>
                    </button>
                  </div>

                  <div className="h-px bg-purple-900/30 my-2"></div>

                  <FlashBtn
                    onClick={rMovieRelease}
                    label="WORLD PREMIERE & GALA RELEASE"
                    color="yellow-600"
                    txt="white"
                    size="lg"
                  />
                </div>
              </div>

              <p className="text-[9px] text-slate-500 text-center italic px-6 leading-relaxed">
                "Global release results are calculated based on Hype Level and random market volatility. High risk, legendary rewards."
              </p>
            </div>
          )}

        </div>
      </LabShell>
    </div>
  );
};
