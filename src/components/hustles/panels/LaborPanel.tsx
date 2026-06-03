import { PROGRESSION_TIERS } from '../../../store/types';
import type { PanelProps } from './types';

export function LaborPanel({ onBack, state, onExecute }: PanelProps) {
  const { activeTab, weeks, propertyType, budget, action } = state.pl.laborPanel;
  const currentRankIdx = PROGRESSION_TIERS.indexOf(state.pl.currentTier);
  const canAfford = (tab: number) => {
    if (tab === 1) return true;
    if (tab === 2) {
      const baseCosts = { STUDIO: 50000, DUPLEX: 75000, LOFT: 100000 };
      const budgetMults = { ECONOMY: 1, PREMIUM: 1.2, LUXURY: 1.5 };
      return state.pl.bag >= baseCosts[propertyType] * budgetMults[budget];
    }
    if (tab === 3) return state.pl.bag >= 1500000;
    return false;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          LABOR LINEAGE
        </div>
      </div>

      <div className="flex flex-nowrap overflow-x-auto gap-2 scrollbar-none touch-pan-x border-b border-slate-800 pb-2">
        {(['LVL 1: DAY LABOR', 'LVL 2: PROPERTY FLIPS', 'LVL 3: COMMERCIAL SYNDICATE'] as const).map((label, idx) => {
          const tabNum = (idx + 1) as 1 | 2 | 3;
          const isLocked = (tabNum === 2 && currentRankIdx < 1) || (tabNum === 3 && currentRankIdx < 3);
          const reqLabel = tabNum === 2 ? '[REQUIRES STREET]' : tabNum === 3 ? '[REQUIRES CORPORATE]' : '';

          return (
            <button
              key={label}
              disabled={isLocked}
              onClick={() => state.setLaborInput('activeTab', tabNum)}
              className={`px-3 py-2 rounded text-[10px] font-black whitespace-nowrap transition-all border ${activeTab === tabNum ? 'bg-emerald-600 border-emerald-400 text-white' : isLocked ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              {label} {isLocked && <span className="ml-1 text-[8px] text-rose-500">{reqLabel}</span>}
            </button>
          );
        })}
      </div>

      {activeTab === 1 && (
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Contract Duration</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(w => (
              <button
                key={w}
                onClick={() => state.setLaborInput('weeks', w)}
                className={`py-3 rounded text-[10px] font-black transition-all border ${weeks === w ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {w} WEEK{w > 1 ? 'S' : ''}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-slate-500 italic">Trade immediate physical health for basic legal capital.</p>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Property Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['STUDIO', 'DUPLEX', 'LOFT'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => state.setLaborInput('propertyType', p)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${propertyType === p ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Renovation Budget</label>
            <select
              value={budget}
              onChange={(e) => state.setLaborInput('budget', e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs font-black text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase"
            >
              <option value="ECONOMY">Economy</option>
              <option value="PREMIUM">Premium (+20% Cost)</option>
              <option value="LUXURY">Luxury (+50% Cost)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Exit Strategy</label>
            <div className="grid grid-cols-2 gap-2">
              {(['FLIP', 'RENT'] as const).map(a => (
                <button
                  key={a}
                  onClick={() => state.setLaborInput('action', a)}
                  className={`py-3 rounded text-[10px] font-black transition-all border ${action === a ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {a === 'FLIP' ? '⚡ IMMEDIATE CAPITAL' : '🏦 PASSIVE FLOW'}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-500 mt-2 italic">
              {action === 'FLIP' ? 'Roll for high-margin volatility and immediate payout.' : 'Secure +$2,500/month permanent passive yield.'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-2xl text-center space-y-4">
           <div className="text-4xl">🏢</div>
           <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Commercial Syndicate</h3>
              <p className="text-[10px] text-slate-500 mt-2">Scale into institutional development projects. Massive upfront capital requirement for exponential returns and clout.</p>
           </div>
           <div className="text-[10px] font-black text-emerald-400">Project Cost: $1,500,000</div>
        </div>
      )}

      <button
        onClick={() => onExecute('r_labor')}
        disabled={!canAfford(activeTab)}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        {canAfford(activeTab) ? "AUTHORIZE LABOR CYCLE" : "INSUFFICIENT FUNDS"}
      </button>
    </div>
  );
}
