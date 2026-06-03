import { PROGRESSION_TIERS } from '../../../store/types';
import type { PanelProps } from './types';
import type { PlayerStats } from '../../../store/types';

export function DeliveryPanel({ onBack, state, onExecute }: PanelProps) {
  const { activeTab, weeks, fleetType, wageLevel } = state.pl.deliveryPanel;
  const currentRankIdx = PROGRESSION_TIERS.indexOf(state.pl.currentTier);
  const canAfford = (tab: number) => {
    if (tab === 1) return true;
    if (tab === 2) {
      const fleetCosts = { 'E-BIKE': 15000, SPRINTER: 40000, FREIGHT: 85000 };
      return state.pl.bag >= fleetCosts[fleetType] && state.pl.clout >= 40;
    }
    if (tab === 3) return state.pl.bag >= 2000000 && state.pl.clout >= 150;
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
          DELIVERY LINEAGE
        </div>
      </div>

      <div className="flex flex-nowrap overflow-x-auto gap-2 scrollbar-none touch-pan-x border-b border-slate-800 pb-2">
        {(['LVL 1: COURIER SPRINT', 'LVL 2: FLEET DISPATCH', 'LVL 3: 3PL AUTOMATED HUB'] as const).map((label, idx) => {
          const tabNum = (idx + 1) as 1 | 2 | 3;
          const isLocked = (tabNum === 2 && currentRankIdx < 1) || (tabNum === 3 && currentRankIdx < 3);
          const reqLabel = tabNum === 2 ? '[REQUIRES STREET]' : tabNum === 3 ? '[REQUIRES CORPORATE]' : '';

          return (
            <button
              key={label}
              disabled={isLocked}
              onClick={() => state.setDeliveryInput('activeTab', tabNum)}
              className={`px-3 py-2 rounded text-[10px] font-black whitespace-nowrap transition-all border ${activeTab === tabNum ? 'bg-emerald-600 border-emerald-400 text-white' : isLocked ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
            >
              {label} {isLocked && <span className="ml-1 text-[8px] text-rose-500">{reqLabel}</span>}
            </button>
          );
        })}
      </div>

      {activeTab === 1 && (
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Algorithmic Route Duration</label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(w => (
              <button
                key={w}
                onClick={() => state.setDeliveryInput('weeks', w)}
                className={`py-3 rounded text-[10px] font-black transition-all border ${weeks === w ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {w} WEEK{w > 1 ? 'S' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Fleet Configuration</label>
            <div className="grid grid-cols-3 gap-2">
              {(['E-BIKE', 'SPRINTER', 'FREIGHT'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => state.setDeliveryInput('fleetType', f)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${fleetType === f ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Driver Wage Split: {wageLevel}</label>
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={wageLevel === 'LOW' ? 0 : wageLevel === 'BALANCED' ? 1 : 2}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                const levels: PlayerStats['deliveryPanel']['wageLevel'][] = ['LOW', 'BALANCED', 'PREMIUM'];
                state.setDeliveryInput('wageLevel', levels[val]);
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
              <span>Low (Risk)</span>
              <span>Balanced</span>
              <span>Premium (Safe)</span>
            </div>
            <p className="text-[9px] text-slate-500 mt-2 italic">
              {wageLevel === 'LOW' ? 'Maximize short-term margins, but risk a total Driver Strike walkout.' : wageLevel === 'PREMIUM' ? 'Sacrifice profits for absolute worker stability and clout.' : 'Market standard stability.'}
            </p>
          </div>
        </div>
      )}

      {activeTab === 3 && (
        <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-2xl text-center space-y-4">
           <div className="text-4xl">🤖</div>
           <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">3PL Automated Hub</h3>
              <p className="text-[10px] text-slate-500 mt-2">Deploy AI-driven robotic sorting and autonomous freight dispatch. Total dominance of regional supply chains.</p>
           </div>
           <div className="text-[10px] font-black text-emerald-400">Deployment Cost: $2,000,000</div>
        </div>
      )}

      <button
        onClick={() => onExecute('r_delivery')}
        disabled={!canAfford(activeTab)}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        {canAfford(activeTab) ? "AUTHORIZE LOGISTICS CYCLE" : "INSUFFICIENT FUNDS"}
      </button>
    </div>
  );
}
