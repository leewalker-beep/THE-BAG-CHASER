import { useState } from 'react';
import type { PanelProps } from './panels/types';
import { HUSTLE_PROGRESSIONS } from '../../config/hustleProgression';

export function ProgressionPanel({ hustleId, onBack, state, onExecute, isEmbedded }: PanelProps & { hustleId: string, isEmbedded?: boolean }) {
  const tree = HUSTLE_PROGRESSIONS[hustleId];
  if (!tree) return null;

  const currentNodeId = state.pl.hustleNodeIds[hustleId] || 'l1';
  const currentNode = tree[currentNodeId];
  const [previewNodeId, setPreviewNodeId] = useState<string | null>(null);

  const activeNode = previewNodeId ? tree[previewNodeId] : currentNode;
  const isPreview = previewNodeId !== null && previewNodeId !== currentNodeId;
  const canAfford = state.pl.bag >= activeNode.cost;

  const content = (
    <>
      <div className="space-y-4">
        <div className={`p-4 border rounded-xl transition-all ${isPreview ? 'bg-indigo-950/30 border-indigo-500/50' : 'bg-slate-950/50 border-slate-800'}`}>
          <div className="flex justify-between items-start">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              {activeNode.name}
              {isPreview && <span className="ml-2 text-[10px] text-indigo-400 animate-pulse">(PREVIEW)</span>}
            </h3>
            {isPreview && (
              <button
                onClick={() => setPreviewNodeId(null)}
                className="text-[9px] font-black text-slate-500 hover:text-white uppercase"
              >
                Reset
              </button>
            )}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
            <div className="text-emerald-400 font-bold">Yield: ${activeNode.yieldCash.toLocaleString()}</div>
            <div className="text-blue-400 font-bold">Mental: {activeNode.hitMental}</div>
            <div className="text-indigo-400 font-bold">Clout: +{activeNode.yieldClout}</div>
            <div className="text-purple-400 font-bold">Aura: +{activeNode.yieldAura}</div>
            <div className="text-orange-400 font-bold">Success: {Math.round(activeNode.successChance * 100)}%</div>
            {activeNode.passiveMonthlyYield > 0 && (
              <div className="text-amber-400 font-bold">Passive: ${activeNode.passiveMonthlyYield.toLocaleString()}/mo</div>
            )}
          </div>

          {isPreview && (
            <div className="mt-4 pt-4 border-t border-indigo-500/20 flex justify-between items-center">
              <div className="text-[10px] font-bold text-slate-400">
                Upgrade Cost: <span className={canAfford ? 'text-white' : 'text-red-500'}>${activeNode.cost.toLocaleString()}</span>
              </div>
              <button
                disabled={!canAfford}
                onClick={() => {
                  state.purchaseHustleUpgrade(hustleId, activeNode.id);
                  setPreviewNodeId(null);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-black rounded uppercase tracking-widest transition-all"
              >
                UPGRADE ⚡
              </button>
            </div>
          )}
        </div>

        {currentNode.nextNodes.length > 0 && !isPreview && (
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Available Branches</label>
            <div className="grid grid-cols-1 gap-2">
              {currentNode.nextNodes.map(nodeId => {
                const node = tree[nodeId];
                return (
                  <button
                    key={nodeId}
                    onClick={() => setPreviewNodeId(nodeId)}
                    className="p-4 rounded-xl text-left transition-all border bg-slate-800 border-slate-700 hover:border-indigo-500/50 flex justify-between items-center group"
                  >
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white">{node.name}</div>
                      <div className="text-[9px] font-bold text-slate-500">View Requirements</div>
                    </div>
                    <div className="text-indigo-400 text-[10px] font-black">BRANCH ➔</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {!isPreview && !isEmbedded && (
        <button
          onClick={() => onExecute(hustleId)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98] mt-4"
        >
          EXECUTE {currentNode.name.toUpperCase()}
        </button>
      )}
    </>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          {currentNode.name.toUpperCase()}
        </div>
      </div>
      {content}
    </div>
  );
}
