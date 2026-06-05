import React from 'react';
import { FLEX_ASSETS } from '../config/flexAssets';
import { useGameStore } from '../store/gameStore';
import { useShallow } from 'zustand/react/shallow';

export const FlexMarket: React.FC = () => {
  const { bag, flexAssets, purchaseFlexAsset } = useGameStore(
    useShallow((s) => ({
      bag: s.pl.bag,
      flexAssets: s.pl.flexAssets,
      purchaseFlexAsset: s.purchaseFlexAsset,
    }))
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white italic">FLEX ACQUISITIONS MARKET</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Convert liquid capital into permanent social status.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {FLEX_ASSETS.map((asset) => {
          const ownedCount = flexAssets[asset.id] || 0;
          const canAfford = bag >= asset.cost;

          return (
            <div
              key={asset.id}
              className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4 group hover:border-emerald-500/50 transition-all shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-slate-800 p-3 rounded-xl shadow-inner">{asset.icon}</div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-white uppercase tracking-widest">{asset.name}</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">${asset.cost.toLocaleString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">OWNED</div>
                  <div className="text-xl font-black text-white font-mono">{ownedCount}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {asset.maxCloutBoost && (
                  <div className="p-2 bg-blue-500/5 border border-blue-500/20 rounded text-[9px] font-bold text-blue-400 uppercase tracking-tighter">
                    +{asset.maxCloutBoost} Max Clout
                  </div>
                )}
                {asset.maxAuraBoost && (
                  <div className="p-2 bg-purple-500/5 border border-purple-500/20 rounded text-[9px] font-bold text-purple-400 uppercase tracking-tighter">
                    +{asset.maxAuraBoost} Max Aura
                  </div>
                )}
                {asset.maxMentalHealthBoost && (
                  <div className="p-2 bg-rose-500/5 border border-rose-500/20 rounded text-[9px] font-bold text-rose-400 uppercase tracking-tighter">
                    +{asset.maxMentalHealthBoost} Max Mental
                  </div>
                )}
                {asset.passiveMonthlyYield && (
                  <div className="p-2 bg-emerald-500/5 border border-emerald-500/20 rounded text-[9px] font-bold text-emerald-400 uppercase tracking-tighter">
                    +${asset.passiveMonthlyYield.toLocaleString()}/mo
                  </div>
                )}
              </div>

              <button
                onClick={() => purchaseFlexAsset(asset.id)}
                disabled={!canAfford}
                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 ${
                  canAfford
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-black shadow-lg shadow-emerald-900/20'
                    : 'bg-slate-800 text-slate-600 border border-slate-700 opacity-50 cursor-not-allowed'
                }`}
              >
                {canAfford ? '⚡ Purchase Asset' : 'Insufficient Funds'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
