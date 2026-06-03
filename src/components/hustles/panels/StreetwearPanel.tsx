import type { PanelProps } from './types';

export function StreetwearPanel({ onBack, state, onExecute }: PanelProps) {
  const { brandTier } = state.pl.streetwearPanel;
  const tierData = {
    'UNDERGROUND_IP': { cost: 500, clReq: 0, auReq: 0, label: 'Underground IP Collection' },
    'SOHO_STORE': { cost: 8000, clReq: 40, auReq: 30, label: 'Soho Retail Flagship' },
    'PARIS_RUNWAY': { cost: 35000, clReq: 80, auReq: 60, label: 'Paris Fashion Week' }
  };
  const currentTier = tierData[brandTier];
  const canAfford = state.pl.bag >= currentTier.cost;
  const meetsReqs = state.pl.clout >= currentTier.clReq && state.pl.aura >= currentTier.auReq;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
        <div className="text-[10px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20 uppercase">
          DESIGN ATELIER
        </div>
      </div>

      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-purple-400">STREETWEAR DRIP LAB</h2>

      <div className="space-y-4">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Collection Tier Selection</label>
        <div className="grid grid-cols-1 gap-2">
          {(['UNDERGROUND_IP', 'SOHO_STORE', 'PARIS_RUNWAY'] as const).map(t => {
            const data = tierData[t];
            const locked = state.pl.clout < data.clReq || state.pl.aura < data.auReq;
            return (
              <button
                key={t}
                onClick={() => state.setStreetwearInput('brandTier', t)}
                className={`p-4 rounded-xl text-left transition-all border flex justify-between items-center ${brandTier === t ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'} ${locked ? 'opacity-50' : ''}`}
              >
                <div>
                  <div className="text-[11px] font-black uppercase tracking-widest">{data.label}</div>
                  <div className="text-[9px] font-bold opacity-60 uppercase">Cost: ${data.cost.toLocaleString()}</div>
                </div>
                {locked && (
                  <div className="text-[8px] font-black text-red-400 uppercase">Req: {data.clReq} Clout / {data.auReq} Aura</div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Operational Cost</span>
          <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${currentTier.cost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase">Success Chance</span>
          <span className="font-mono font-bold text-emerald-400">100% (IP RESTORED)</span>
        </div>
      </div>

      <button
        onClick={() => onExecute('vintage')}
        disabled={!canAfford || !meetsReqs || state.pl.swCooldownTurns > 0}
        className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
      >
        {state.pl.swCooldownTurns > 0
          ? `COOLDOWN: ${state.pl.swCooldownTurns} MO`
          : meetsReqs ? (canAfford ? "EXECUTE DESIGN RUN" : "INSUFFICIENT FUNDS") : "REQUIREMENTS NOT MET"}
      </button>
    </div>
  );
}
