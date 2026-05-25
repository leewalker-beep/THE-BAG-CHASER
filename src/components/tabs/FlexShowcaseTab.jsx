import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';

const FLEX_DATA = [
  // Bridge 1: Post-Corporate (Net Worth >= $25M)
  {
    id: 'penthouse',
    type: 'functional',
    bridge: 1,
    name: 'Skyline Penthouse HQ',
    cost: 2500000,
    desc: 'Permanently expands max stat limits from 300 to 600 Clout & Aura. Boosts passive SMM Retainer yields by +35%.',
    reqBag: 25000000
  },
  {
    id: 'logistics',
    type: 'functional',
    bridge: 1,
    name: 'Multi-Pallet Logistics Hub',
    cost: 5000000,
    desc: 'Permanently expands max stat limits from 600 to 1,200 Clout & Aura. Eliminates Tech Flipping processing errors entirely (0% failure rate).',
    reqBag: 25000000
  },
  {
    id: 'jet',
    type: 'functional',
    bridge: 1,
    name: 'Private Jet Fleet Membership',
    cost: 12000000,
    desc: 'Permanently expands max stat limits from 1,200 to 2,000 Clout & Aura. Reduces the Mental Health drain of all active grinds and manual actions by 15%.',
    reqBag: 25000000
  },
  {
    id: 'hypercar',
    type: 'badge',
    bridge: 1,
    name: 'Custom Hypercar Garage',
    cost: 4000000,
    reward: '+250 Clout injection.',
    reqBag: 25000000
  },
  {
    id: 'art',
    type: 'badge',
    bridge: 1,
    name: 'Rare Fine Art Collection',
    cost: 8000000,
    reward: 'Permanent passive +5 Aura drift per engine tick.',
    reqBag: 25000000
  },
  {
    id: 'watchVault',
    type: 'badge',
    bridge: 1,
    name: 'Diamond Watch Vault',
    cost: 3500000,
    reward: 'Permanent baseline protection of +200 Aura (cannot drop below this value).',
    reqBag: 25000000
  },
  // Bridge 2: Post-Elite (Net Worth >= $500M)
  {
    id: 'yacht',
    type: 'functional',
    bridge: 2,
    name: '400-Foot Mega-Yacht',
    cost: 250000000,
    desc: 'Directly materializes the Super PAC / Kingmaker Syndicate gameplay. Increases passive Political Capital (PC) generation speed by +50%.',
    reqBag: 500000000
  },
  {
    id: 'media',
    type: 'functional',
    bridge: 2,
    name: 'Media Conglomerate Buyout',
    cost: 450000000,
    desc: 'Hooks entertainment fame into systemic power. 10% of generated Clout from movies/boxing converts directly into Political Capital.',
    reqBag: 500000000
  },
  {
    id: 'foundation',
    type: 'functional',
    bridge: 2,
    name: 'Global Philanthropic Foundation',
    cost: 600000000,
    desc: 'Unlocks a financial-to-political sink. Donate excess cash to buy permanent baseline boosts to National Voter Polling.',
    reqBag: 500000000
  },
  {
    id: 'sportsTeam',
    type: 'badge',
    bridge: 2,
    name: 'Pro Sports Franchise',
    cost: 500000000,
    reward: 'An absolute legendary +1,500 Aura injection straight to the profile.',
    reqBag: 500000000
  },
  {
    id: 'island',
    type: 'badge',
    bridge: 2,
    name: 'Private Sovereign Island Compound',
    cost: 750000000,
    reward: 'Massive flat +1,000 Clout and +500 Aura.',
    reqBag: 500000000
  },
  {
    id: 'archive',
    type: 'badge',
    bridge: 2,
    name: 'Historical Archive Vault',
    cost: 300000000,
    reward: 'Permanent +800 Aura, signaling absolute old-money institutional dominance.',
    reqBag: 500000000
  }
];

export const FlexShowcaseTab = () => {
  const { pl, flex, rBuyFlex, rTriggerFlexPR, rFoundationSink, setTab } = useGame();

  const netWorth = pl.bag; // Using liquid bag for net worth checks per prompt logic

  const bridge1Visible = netWorth >= 25000000;
  const bridge2Visible = netWorth >= 500000000;

  const renderFlexCard = (item) => {
    const status = flex[item.id];
    const isOwned = status.owned;
    const isBlitzed = status.blitzExpiry > Date.now();
    const isPRActive = status.prActive;
    const canAfford = pl.bag >= item.cost;

    const prCost = Math.floor(item.cost * 0.15); // Premium PR firm cost
    const canAffordPR = pl.bag >= prCost;

    return (
      <div key={item.id} className={`glass-card p-4 rounded-xl border flex flex-col gap-3 transition-all ${item.type === 'badge' ? 'border-yellow-500/50 bg-yellow-900/10' : 'border-blue-500/50 bg-blue-900/10'}`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className={`font-black text-sm uppercase tracking-tighter ${item.type === 'badge' ? 'text-yellow-400' : 'text-blue-400'}`}>{item.name}</h4>
            <div className="text-[10px] font-bold text-slate-400">COST: ${fMny(item.cost)}</div>
          </div>
          {isOwned ? (
            <span className="text-[10px] font-black text-green-500 tracking-widest bg-green-900/30 px-2 py-1 rounded">OWNED</span>
          ) : (
            <button
              disabled={!canAfford}
              onClick={() => rBuyFlex(item.id, item.cost)}
              className={`text-[10px] font-black px-3 py-1 rounded transition-all active:scale-95 ${canAfford ? 'bg-white text-black hover:bg-slate-200 shadow-lg' : 'bg-slate-800 text-slate-500 cursor-not-allowed'}`}
            >
              ACQUIRE
            </button>
          )}
        </div>

        <p className="text-[10px] text-slate-300 leading-relaxed italic">"{item.desc || item.reward}"</p>

        {isOwned && (
          <div className="mt-2 pt-2 border-t border-slate-800 flex flex-col gap-2">
            {item.type === 'functional' ? (
              <>
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-slate-400">PR STATUS:</span>
                  <span className={isBlitzed ? 'text-yellow-400 animate-pulse' : 'text-slate-500'}>
                    {isBlitzed ? 'MEDIA BLITZ ACTIVE (2x MULT)' : 'IDLE'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => rTriggerFlexPR(item.id, false)}
                    className="py-1.5 bg-blue-600 text-white text-[8px] font-black rounded hover:bg-blue-500 transition-all uppercase"
                  >
                    Watch Ad to Leak to TMZ
                  </button>
                  <button
                    disabled={!canAffordPR}
                    onClick={() => rTriggerFlexPR(item.id, true, prCost)}
                    className={`py-1.5 text-[8px] font-black rounded transition-all uppercase ${canAffordPR ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-900 text-slate-600'}`}
                  >
                    Hire PR Firm (${fMny(prCost)})
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-[9px] font-bold">
                  <span className="text-slate-400">PRESS RELEASE:</span>
                  <span className={isPRActive ? 'text-green-400' : 'text-slate-500'}>
                    {isPRActive ? 'POINTS CLAIMED' : 'POINTS LOCKED'}
                  </span>
                </div>
                {!isPRActive && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => rTriggerFlexPR(item.id, false)}
                      className="py-1.5 bg-yellow-600 text-white text-[8px] font-black rounded hover:bg-yellow-500 transition-all uppercase"
                    >
                      Run Global Ad Press Release
                    </button>
                    <button
                      disabled={!canAffordPR}
                      onClick={() => rTriggerFlexPR(item.id, true, prCost)}
                      className={`py-1.5 text-[8px] font-black rounded transition-all uppercase ${canAffordPR ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-900 text-slate-600'}`}
                    >
                      Premium Bypass (${fMny(prCost)})
                    </button>
                  </div>
                )}
              </>
            )}

            {item.id === 'foundation' && isOwned && (
              <div className="mt-2 p-2 bg-black/40 rounded-lg border border-slate-800">
                <div className="text-[9px] font-black text-blue-400 mb-1 uppercase">Foundation Donations</div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => rFoundationSink(100000000)} className="py-1 bg-slate-800 text-white text-[8px] font-bold rounded hover:bg-slate-700">Donate $100M</button>
                  <button onClick={() => rFoundationSink(500000000)} className="py-1 bg-slate-800 text-white text-[8px] font-bold rounded hover:bg-slate-700">Donate $500M</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <div className="bg-slate-900/80 border border-yellow-500/50 p-6 rounded-2xl shadow-2xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent"></div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest font-hype italic">THE SHOWCASE FLEX</h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Shatter your limits. Cement your legacy.</p>
      </div>

      {!bridge1Visible && !bridge2Visible && (
        <div className="bg-black/40 border border-slate-800 p-8 rounded-2xl text-center">
          <div className="text-4xl mb-4 opacity-30">🏢🔒</div>
          <h4 className="text-slate-500 font-black tracking-widest uppercase">CATALOG LOCKED</h4>
          <p className="text-[10px] text-slate-600 mt-2 font-bold uppercase">Reach $25,000,000 Net Worth to unlock Bridge 1 assets.</p>
        </div>
      )}

      {bridge1Visible && (
        <section className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800"></div>
            <h5 className="text-[10px] font-black text-slate-500 tracking-widest uppercase italic">Bridge 1: Post-Corporate</h5>
            <div className="h-px flex-1 bg-slate-800"></div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {FLEX_DATA.filter(f => f.bridge === 1).map(renderFlexCard)}
          </div>
        </section>
      )}

      {bridge2Visible && (
        <section className="flex flex-col gap-4 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-800"></div>
            <h5 className="text-[10px] font-black text-yellow-500/50 tracking-widest uppercase italic font-hype">Bridge 2: Institutional Elite</h5>
            <div className="h-px flex-1 bg-slate-800"></div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {FLEX_DATA.filter(f => f.bridge === 2).map(renderFlexCard)}
          </div>
        </section>
      )}

      <button onClick={() => setTab('HUB')} className="w-full py-4 bg-slate-900 border border-slate-700 text-white font-black tracking-widest text-xs rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-xl">
        RETURN TO OPERATIONS
      </button>

      <style jsx>{`
        .glass-card {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  );
};
