import type { PanelProps } from './types';

export function FestivalPanel({ onBack, state, onExecute, isEmbedded }: PanelProps) {
  const { venue, insured, ticketPrice } = state.pl.festivalPanel;
  const venueCosts = { TOUR: 50000, CIRCUIT: 150000, SATURATION: 500000 };
  const insuranceCost = 25000;
  const totalCost = venueCosts[venue] + (insured ? insuranceCost : 0);
  const canAfford = state.pl.bag >= totalCost;

  const content = (
    <>
      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-purple-400">GLOBAL FESTIVAL CIRCUIT</h2>

      {state.pl.crises.laborStrikeTurns > 0 && (
        <div className="p-3 bg-red-900/30 border border-red-500 rounded text-xs font-bold text-red-500 uppercase tracking-tighter">
          ⚠️ LABOR STRIKE ACTIVE: Corporate operations frozen for {state.pl.crises.laborStrikeTurns} months.
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Circuit Reach Selection</label>
          <div className="grid grid-cols-1 gap-2">
            {([['TOUR', 'North American Tour'], ['CIRCUIT', 'European Circuit'], ['SATURATION', 'Global Saturation']] as const).map(([v, label]) => (
              <button
                key={v}
                onClick={() => state.setFestivalInput('venue', v)}
                className={`py-3 px-4 rounded-xl text-left text-[10px] font-black transition-all border flex justify-between items-center ${venue === v ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                <span>{label}</span>
                <span className="font-mono opacity-60">${venueCosts[v].toLocaleString()}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
          <div>
            <div className="text-[10px] font-black text-white uppercase">Corporate Event Insurance</div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Recover 80% on headliner breach ($25,000)</div>
          </div>
          <button
            onClick={() => state.setFestivalInput('insured', !insured)}
            className={`w-12 h-6 rounded-full transition-all relative ${insured ? 'bg-emerald-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${insured ? 'left-7' : 'left-1'}`} />
          </button>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Average Ticket Price ($)</label>
          <input
            type="number"
            value={ticketPrice}
            onChange={(e) => state.setFestivalInput('ticketPrice', parseInt(e.target.value) || 0)}
            className="w-full bg-black border border-slate-800 rounded p-3 text-purple-400 font-mono font-bold focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Upfront Production Capital</span>
          <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase">Risk Factor: Headliner Breach of Contract / Municipal Cancellation.</span>
          <span className="font-mono font-bold text-orange-400">25%</span>
        </div>
      </div>

      <button
        onClick={() => onExecute('festival')}
        disabled={!canAfford}
        className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
      >
        {canAfford ? "AUTHORIZE CIRCUIT LAUNCH" : "INSUFFICIENT FUNDS"}
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
        <div className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
          CIRCUIT PROMOTER
        </div>
      </div>
      {content}
    </div>
  );
}
