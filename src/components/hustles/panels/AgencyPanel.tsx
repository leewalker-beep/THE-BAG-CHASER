import type { PanelProps } from './types';

export function AgencyPanel({ onBack, state, onExecute, isEmbedded }: PanelProps) {
  const { client, staff } = state.pl.agencyPanel;
  const yields = { SMB: 3000, MID: 9000, ENTERPRISE: 25000 };
  const canAfford = staff === 'FREELANCERS' ? (state.pl.bag >= yields[client] * 0.5) : true;
  const successChance = staff === 'INTERNS' ? 60 : 95;

  const content = (
    <>
      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-400">AGENCY RETAINER LAB</h2>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Target Client Tier</label>
          <div className="grid grid-cols-3 gap-2">
            {(['SMB', 'MID', 'ENTERPRISE'] as const).map(c => (
              <button
                key={c}
                onClick={() => state.setAgencyInput('client', c)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${client === c ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Staffing Strategy</label>
          <div className="grid grid-cols-2 gap-2">
            {(['INTERNS', 'FREELANCERS'] as const).map(s => (
              <button
                key={s}
                onClick={() => state.setAgencyInput('staff', s)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${staff === s ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Payroll / Execution Cost</span>
          <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${(staff === 'FREELANCERS' ? yields[client] * 0.5 : 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase">Project Success Rate</span>
          <span className={`font-mono font-bold ${successChance < 70 ? 'text-orange-500' : 'text-emerald-400'}`}>{successChance}%</span>
        </div>
      </div>

      <button
        onClick={() => onExecute('agency_scale')}
        disabled={!canAfford}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
      >
        {canAfford ? "PITCH & CLOSE RETAINER" : "INSUFFICIENT FUNDS"}
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
        <div className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
          AGENCY HQ
        </div>
      </div>
      {content}
    </div>
  );
}
