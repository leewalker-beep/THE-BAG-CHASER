import type { PanelProps } from './types';

export function SaaSPanel({ onBack, state, onExecute, isEmbedded }: PanelProps) {
  const { infra, focus, subscriptionPrice } = state.pl.saasPanel;
  const infraCosts = { AWS: 500, DEVOPS: 2000, ENTERPRISE: 6000 };
  const canAfford = state.pl.bag >= infraCosts[infra];
  let outageRisk = 0;
  if (focus === 'GROWTH') {
    if (infra === 'AWS') outageRisk = 50;
    else if (infra === 'DEVOPS') outageRisk = 20;
  }

  const content = (
    <>
      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-emerald-400">SAAS MVP DASHBOARD</h2>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Infrastructure Stack</label>
          <div className="grid grid-cols-3 gap-2">
            {(['AWS', 'DEVOPS', 'ENTERPRISE'] as const).map(i => (
              <button
                key={i}
                onClick={() => state.setSaaSInput('infra', i)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${infra === i ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {i}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Operational Focus</label>
          <div className="grid grid-cols-2 gap-2">
            {(['GROWTH', 'PATCH'] as const).map(f => (
              <button
                key={f}
                onClick={() => state.setSaaSInput('focus', f)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${focus === f ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Subscription Price ($)</label>
          <input
            type="number"
            value={subscriptionPrice}
            onChange={(e) => state.setSaaSInput('subscriptionPrice', parseInt(e.target.value) || 0)}
            className="w-full bg-black border border-slate-800 rounded p-3 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${outageRisk > 30 ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-800/50 border-slate-700'}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Monthly Infra Cost</span>
          <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${infraCosts[infra].toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase">Server Crash Risk</span>
          <span className={`font-mono font-bold ${outageRisk > 0 ? 'text-red-500' : 'text-emerald-400'}`}>{outageRisk}%</span>
        </div>
      </div>

      <button
        onClick={() => onExecute('saas_mvp')}
        disabled={!canAfford}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        {canAfford ? "DEPLOY & SCALE PLATFORM" : "INSUFFICIENT FUNDS"}
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
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          ENGINEERING BAY
        </div>
      </div>
      {content}
    </div>
  );
}
