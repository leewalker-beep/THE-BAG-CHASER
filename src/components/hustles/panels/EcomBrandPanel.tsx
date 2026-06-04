import type { PanelProps } from './types';

export function EcomBrandPanel({ onBack, state, onExecute, isEmbedded }: PanelProps) {
  const { runSize, adSpend } = state.pl.ecomBrandPanel;
  const baseCost = runSize === 5000 ? 50000 : 200000;
  const totalCost = baseCost + adSpend;
  const canAfford = state.pl.bag >= totalCost;

  const content = (
    <>
      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-orange-400">DTC BRAND CONGLOMERATE</h2>

      {state.pl.crises.laborStrikeTurns > 0 && (
        <div className="p-3 bg-red-900/30 border border-red-500 rounded text-xs font-bold text-red-500 uppercase tracking-tighter">
          ⚠️ LABOR STRIKE ACTIVE: Corporate operations frozen for {state.pl.crises.laborStrikeTurns} months.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Warehouse Automation Tiers</label>
          <div className="grid grid-cols-2 gap-2">
            {([5000, 25000] as const).map(s => (
              <button
                key={s}
                onClick={() => state.setEcomBrandInput('runSize', s)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${runSize === s ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {s.toLocaleString()} UNIT DEPOT
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Cross-Border Tariff Strategy ($)</label>
          <input
            type="range"
            min="10000"
            max="200000"
            step="10000"
            value={adSpend}
            onChange={(e) => state.setEcomBrandInput('adSpend', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
          />
          <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
            <span>$10,000</span>
            <span>${adSpend.toLocaleString()}</span>
            <span>$200,000</span>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Automation + Logistics Capital</span>
          <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase">Risk Factor: Global Trade Embargo / Supply Chain Warfare.</span>
          <span className="font-mono font-bold text-orange-400">15% Risk</span>
        </div>
      </div>

      <button
        onClick={() => onExecute('ecom_brand')}
        disabled={!canAfford}
        className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 active:scale-[0.98]"
      >
        {canAfford ? "AUTHORIZE PRODUCTION CYCLE" : "INSUFFICIENT FUNDS"}
      </button>
    </>
  );

  if (isEmbedded) return content;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
        <div className="text-[10px] font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
          CONGLOMERATE HQ
        </div>
      </div>
      {content}
    </div>
  );
}
