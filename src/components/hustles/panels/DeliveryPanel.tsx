import React from 'react';
import type { PanelProps } from './types';
import { HUSTLE_PROGRESSIONS } from '../../../config/hustleProgression';

export function DeliveryPanel({ onBack, state, onExecute }: PanelProps) {
  const hustleId = 'r_delivery';
  const tree = HUSTLE_PROGRESSIONS[hustleId];
  const currentNodeId = state.pl.hustleNodeIds[hustleId] || 'l1';
  const currentNode = tree[currentNodeId];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {currentNode.name.toUpperCase()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">{currentNode.name}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Current logistics tier in the Delivery Lineage.</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <div className="text-emerald-400 font-bold">Yield: ${currentNode.yieldCash.toLocaleString()}</div>
            <div className="text-blue-400 font-bold">Mental: {currentNode.hitMental}</div>
            <div className="text-orange-400 font-bold">Success: {Math.round(currentNode.successChance * 100)}%</div>
            {currentNode.passiveMonthlyYield > 0 && (
              <div className="text-purple-400 font-bold col-span-2">Passive: ${currentNode.passiveMonthlyYield.toLocaleString()}/mo</div>
            )}
          </div>
        </div>

        {currentNode.nextNodes.length > 0 && (
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Available Upgrades</label>
            <div className="grid grid-cols-1 gap-2">
              {currentNode.nextNodes.map(nodeId => {
                const node = tree[nodeId];
                const canAfford = state.pl.bag >= node.cost;
                return (
                  <button
                    key={nodeId}
                    disabled={!canAfford}
                    onClick={() => state.upgradeHustleNode(hustleId, nodeId)}
                    className="p-4 rounded-xl text-left transition-all border bg-slate-800 border-slate-700 hover:border-emerald-500/50 flex justify-between items-center group disabled:opacity-50"
                  >
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">{node.name}</div>
                      <div className="text-[9px] font-bold text-slate-500">Cost: ${node.cost.toLocaleString()}</div>
                    </div>
                    <div className="text-emerald-500 text-[10px] font-black">UNLOCK ⚡</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onExecute(hustleId)}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        EXECUTE {currentNode.name.toUpperCase()}
      </button>
    </div>
  );
}
