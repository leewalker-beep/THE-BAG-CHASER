import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';

const CORP_FLEX_DATA = [
  {
    id: 'penthouse',
    type: 'functional',
    name: 'Skyline Penthouse',
    cost: 8500000,
    desc: 'Shatters stat caps to 600 Clout/Aura. Accelerates Mental Health recovery by 100% and adds +$15,000/mo rental income.',
  },
  {
    id: 'logistics',
    type: 'functional',
    name: 'Logistics Hub',
    cost: 5000000,
    desc: 'Shatters stat caps to 1,200 Clout/Aura. Eliminates Tech Flipping processing errors entirely.',
  },
  {
    id: 'jet',
    type: 'functional',
    name: 'Private Jet Membership',
    cost: 12000000,
    desc: 'Shatters stat caps to 2,000 Clout/Aura. Reduces Mental Health drain of all grinds by 15%.',
  },
  {
    id: 'watch',
    type: 'trophy',
    name: 'Patek Philippe Watch',
    cost: 150000,
    reward: '+25 Clout and +$750/mo appreciation yield.',
  },
  {
    id: 'car',
    type: 'trophy',
    name: 'F1 Precision Supercar',
    cost: 450000,
    reward: '+150 Clout. High maintenance: -$8,000/mo.',
  },
  {
    id: 'art',
    type: 'trophy',
    name: 'Rare Fine Art Collection',
    cost: 8000000,
    reward: 'Permanent passive +5 Aura drift per engine tick.',
  }
];

export const CorporateFlexesTab = () => {
  const { pl, flex, rBuyFlex, rTriggerFlexPR, setTab } = useGame();

  const renderFlexCard = (item) => {
    const status = flex?.[item.id];
    const isOwned = status?.owned;
    const isBlitzed = status?.expiresAt > Date.now();
    const isPRActive = status?.prActive;
    const canAfford = (pl?.bag || 0) >= item.cost;

    const prCost = Math.floor(item.cost * 0.25); // "High Cash Premium" - 25%
    const canAffordPR = (pl?.bag || 0) >= prCost;

    return (
      <div key={item.id} className={`glass-card p-5 rounded-2xl border transition-all ${item.type === 'trophy' ? 'border-emerald-500/40 bg-emerald-900/10' : 'border-blue-500/40 bg-blue-900/10'}`}>
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className={`font-black text-sm uppercase tracking-widest ${item.type === 'trophy' ? 'text-emerald-400' : 'text-blue-400'}`}>{item.name}</h4>
            <div className="text-[10px] font-bold text-slate-400">MARKET PRICE: ${fMny(item.cost)}</div>
          </div>
          {isOwned ? (
            <div className="flex items-center gap-1.5 bg-green-500/20 px-2 py-1 rounded-lg border border-green-500/30">
               <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
               <span className="text-[9px] font-black text-green-400 tracking-tighter">SECURED</span>
            </div>
          ) : (
            <button
              disabled={!canAfford}
              onClick={() => rBuyFlex(item.id, item.cost)}
              data-testid={`buy-flex-${item.id}`}
              className={`text-[10px] font-black px-4 py-2 rounded-xl transition-all active:scale-95 ${canAfford ? 'bg-white text-black hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              PURCHASE
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed mb-4 font-medium italic">"{item.desc || item.reward}"</p>

        {isOwned && (
          <div className="pt-3 border-t border-slate-800/60 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PR Media Blitz</div>
              {item.type === 'functional' ? (
                <div className={`text-[9px] font-bold ${isBlitzed ? 'text-yellow-400 animate-pulse' : 'text-slate-600'}`}>
                  {isBlitzed ? '⚡ 2X HUSTLE BOOST ACTIVE' : 'STATUS: STANDBY'}
                </div>
              ) : (
                <div className={`text-[9px] font-bold ${isPRActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                  {isPRActive ? '✓ STAT DROP CLAIMED' : 'STATUS: LOCKED'}
                </div>
              )}
            </div>

            {((item.type === 'functional' && !isBlitzed) || (item.type === 'trophy' && !isPRActive)) && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => rTriggerFlexPR(item.id, false)}
                  className="py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[9px] font-black rounded-xl hover:from-blue-500 hover:to-indigo-500 transition-all uppercase tracking-tighter shadow-lg"
                >
                  Watch Ad / TMZ Leak
                </button>
                <button
                  disabled={!canAffordPR}
                  onClick={() => rTriggerFlexPR(item.id, true, prCost)}
                  className={`py-2.5 text-[9px] font-black rounded-xl transition-all uppercase tracking-tighter border ${canAffordPR ? 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700 shadow-md' : 'bg-slate-900/50 text-slate-700 border-slate-800 cursor-not-allowed'}`}
                >
                  Cash Premium (${fMny(prCost)})
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div className="bg-gradient-to-br from-slate-900 to-black border-2 border-blue-500/30 p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <h3 className="text-3xl font-black text-white uppercase tracking-[0.2em] font-hype italic mb-1">Corporate Flexes</h3>
        <p className="text-[11px] text-blue-400 font-black uppercase tracking-[0.3em] opacity-80">Phase 1: Status Acquisition</p>
      </div>

      <div className="grid grid-cols-1 gap-5 animate-fadeIn">
        {CORP_FLEX_DATA.map(renderFlexCard)}
      </div>

      <button onClick={() => setTab('HUB')} className="w-full py-5 bg-slate-900 border border-slate-800 text-slate-400 font-black tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-800 hover:text-white transition-all active:scale-[0.98] uppercase shadow-2xl">
        Return to Global Operations
      </button>

      <style jsx>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
      `}</style>
    </div>
  );
};

export default CorporateFlexesTab;
