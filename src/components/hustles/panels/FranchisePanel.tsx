import type { PanelProps } from './types';

import { HUSTLE_BALANCE } from '../../../config/balanceConfig';

export function FranchisePanel({ onBack, state, onExecute, isEmbedded }: PanelProps) {
  const { sector, footprint, supplyChain } = state.pl.franchisePanel;
  const { baseSetupCosts } = HUSTLE_BALANCE.global_franchise;
  const totalSetupCost = baseSetupCosts[sector] * footprint;
  const canAfford = state.pl.bag >= totalSetupCost;

  const content = (
    <>
      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-indigo-400">FRANCHISE SYNDICATE CONTROL</h2>

      {state.pl.crises.laborStrikeTurns > 0 && (
        <div className="p-3 bg-red-900/30 border border-red-500 rounded text-xs font-bold text-red-500 uppercase tracking-tighter">
          ⚠️ LABOR STRIKE ACTIVE: Corporate operations frozen for {state.pl.crises.laborStrikeTurns} months.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Industry Sector</label>
          <div className="grid grid-cols-3 gap-2">
            {(['FAST_FOOD', 'WELLNESS', 'LOGISTICS'] as const).map(s => (
              <button
                key={s}
                onClick={() => state.setFranchiseInput('sector', s)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${sector === s ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Footprint Saturation: {footprint}x</label>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={footprint}
            onChange={(e) => state.setFranchiseInput('footprint', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
            <span>National</span>
            <span>Regional</span>
            <span>Global</span>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Supply Chain Architecture</label>
          <div className="grid grid-cols-2 gap-2">
            {(['OUTSOURCED', 'INTEGRATED'] as const).map(sc => (
              <button
                key={sc}
                onClick={() => state.setFranchiseInput('supplyChain', sc)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${supplyChain === sc ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {sc}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-slate-500 mt-2 italic">
            {supplyChain === 'OUTSOURCED' ? '40% Logistics Tax applied to all revenue.' : 'Vertical integration maximizes profit but risks total Labor Strike.'}
          </p>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Total Setup Capital</span>
          <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalSetupCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase">Est. Success Chance</span>
          <span className="font-mono font-bold text-indigo-400">85%</span>
        </div>
      </div>

      <button
        onClick={() => onExecute('global_franchise')}
        disabled={!canAfford}
        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
      >
        {canAfford ? "AUTHORIZE GLOBAL EXPANSION" : "INSUFFICIENT FUNDS"}
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
        <div className="text-[10px] font-mono text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          BOARDROOM
        </div>
      </div>
      {content}
    </div>
  );
}
