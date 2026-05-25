import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LockedTierScreen } from '../ui/Shared.jsx';

const SOV_FLEX_DATA = [
  {
    id: 'yacht',
    type: 'functional',
    name: '400-Foot Mega-Yacht',
    cost: 250000000,
    desc: 'Unlocks Kingmaker Syndicate. Increases Political Capital (PC) generation by +50%. Maintenance: -$250,000/mo.',
  },
  {
    id: 'media',
    type: 'functional',
    name: 'Media Conglomerate Buyout',
    cost: 450000000,
    desc: 'Converts 10% of Clout from Movies/Boxing directly into Political Capital.',
  },
  {
    id: 'foundation',
    type: 'functional',
    name: 'Global Philanthropic Foundation',
    cost: 600000000,
    desc: 'Enables financial-to-political sink. Donate cash to buy permanent boosts to National Polling.',
  },
  {
    id: 'spt',
    type: 'trophy',
    name: 'Pro Sports Franchise',
    cost: 500000000,
    reward: 'Absolute legendary +1,500 Aura injection straight to the profile.',
  },
  {
    id: 'island',
    type: 'trophy',
    name: 'Private Island Compound',
    cost: 750000000,
    reward: 'Global sovereign status: +1,000 Clout and +500 Aura.',
  },
  {
    id: 'archive',
    type: 'trophy',
    name: 'Historical Archive Vault',
    cost: 300000000,
    reward: 'Permanent +800 Aura. Signals absolute institutional dominance.',
  }
];

export const SovereignFlexesTab = () => {
  const { pl, flex, rBuyFlex, rTriggerFlexPR, rFoundationSink, setTab, isTierUnlocked } = useGame();

  // Visually locked until Elite/Mogul tier (Tier 3 or 4)
  if (!isTierUnlocked(3)) {
    return <LockedTierScreen section="SOVEREIGN ASSETS" />;
  }

  const renderFlexCard = (item) => {
    const status = flex?.[item.id];
    const isOwned = status?.owned;
    const isBlitzed = status?.expiresAt > Date.now();
    const isPRActive = status?.prActive;
    const canAfford = (pl?.bag || 0) >= item.cost;

    const prCost = Math.floor(item.cost * 0.20); // Sovereign PR cost - 20%
    const canAffordPR = (pl?.bag || 0) >= prCost;

    return (
      <div key={item.id} className={`glass-card p-6 rounded-2xl border transition-all ${item.type === 'trophy' ? 'border-amber-500/40 bg-amber-900/10' : 'border-purple-500/40 bg-purple-900/10'}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className={`font-black text-base uppercase tracking-widest ${item.type === 'trophy' ? 'text-amber-400' : 'text-purple-400'}`}>{item.name}</h4>
            <div className="text-[10px] font-bold text-slate-400">SOVEREIGN PRICE: ${fMny(item.cost)}</div>
          </div>
          {isOwned ? (
            <div className="flex items-center gap-1.5 bg-yellow-500/20 px-3 py-1.5 rounded-xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
               <span className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></span>
               <span className="text-[10px] font-black text-yellow-400 tracking-widest">DOMINATING</span>
            </div>
          ) : (
            <button
              disabled={!canAfford}
              onClick={() => rBuyFlex(item.id, item.cost)}
              className={`text-[10px] font-black px-5 py-2.5 rounded-xl transition-all active:scale-95 ${canAfford ? 'bg-gradient-to-b from-white to-slate-300 text-black hover:to-white shadow-[0_10px_20px_rgba(0,0,0,0.4)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              ACQUIRE
            </button>
          )}
        </div>

        <p className="text-[12px] text-slate-200 leading-relaxed mb-5 font-medium italic opacity-90">"{item.desc || item.reward}"</p>

        {isOwned && (
          <div className="pt-4 border-t border-slate-700/50 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Influence Operation</div>
              {item.type === 'functional' ? (
                <div className={`text-[10px] font-black ${isBlitzed ? 'text-amber-400 animate-pulse' : 'text-slate-600'}`}>
                  {isBlitzed ? 'SYSTEMIC POWER OVERRIDE ACTIVE' : 'STATUS: READY'}
                </div>
              ) : (
                <div className={`text-[10px] font-black ${isPRActive ? 'text-green-400' : 'text-slate-600'}`}>
                  {isPRActive ? 'WORLD-STAGE STATUS SECURED' : 'STATUS: UNCLAIMED'}
                </div>
              )}
            </div>

            {((item.type === 'functional' && !isBlitzed) || (item.type === 'trophy' && !isPRActive)) && (
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => rTriggerFlexPR(item.id, false)}
                  className="py-3 bg-gradient-to-r from-purple-700 to-indigo-800 text-white text-[10px] font-black rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all uppercase tracking-widest shadow-xl border border-white/10"
                >
                  Global Media Blitz
                </button>
                <button
                  disabled={!canAffordPR}
                  onClick={() => rTriggerFlexPR(item.id, true, prCost)}
                  className={`py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest border shadow-lg ${canAffordPR ? 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700' : 'bg-slate-900/50 text-slate-700 border-slate-800 cursor-not-allowed'}`}
                >
                  Sovereign Bypass (${fMny(prCost)})
                </button>
              </div>
            )}

            {item.id === 'foundation' && (
              <div className="bg-black/60 p-4 rounded-2xl border border-purple-500/20 shadow-inner">
                <div className="text-[10px] font-black text-purple-400 mb-3 uppercase tracking-widest text-center">Inject Capital into National Narrative</div>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => rFoundationSink?.(100000000)} className="py-2.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded-xl hover:bg-slate-800 hover:border-purple-500/40 transition-all uppercase">Donate $100M</button>
                  <button onClick={() => rFoundationSink?.(500000000)} className="py-2.5 bg-slate-900 border border-slate-700 text-white text-[9px] font-black rounded-xl hover:bg-slate-800 hover:border-purple-500/40 transition-all uppercase">Donate $500M</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="bg-gradient-to-br from-indigo-950 via-slate-950 to-black border-2 border-purple-500/40 p-10 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.2)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>

        <h3 className="text-3xl font-black text-white uppercase tracking-[0.3em] font-hype italic mb-2 drop-shadow-2xl">Sovereign Flexes</h3>
        <p className="text-[11px] text-purple-400 font-black uppercase tracking-[0.4em] opacity-90 drop-shadow-md">Phase 2: Global Dominance</p>
      </div>

      <div className="grid grid-cols-1 gap-6 animate-fadeIn">
        {SOV_FLEX_DATA.map(renderFlexCard)}
      </div>

      <button onClick={() => setTab('HUB')} className="w-full py-6 bg-slate-950 border border-slate-800 text-slate-500 font-black tracking-[0.3em] text-[10px] rounded-3xl hover:bg-black hover:text-white transition-all active:scale-[0.98] uppercase shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
        Return to Global Headquarters
      </button>

      <style jsx>{`
        .glass-card {
          background: linear-gradient(135deg, rgba(30, 27, 75, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default SovereignFlexesTab;
