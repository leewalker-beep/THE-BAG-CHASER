import type { PanelProps } from './types';

export function PodPanel({ onBack, state, onExecute }: PanelProps) {
  const { selectedGuest, unhingedSlider } = state.pl.podcastPanel;
  const guestCosts = { LOCAL: 100, MICRO: 500, ICON: 2500 };
  const canAfford = state.pl.bag >= guestCosts[selectedGuest];
  const riskPercent = unhingedSlider * 20;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
        </button>
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          STUDIO MODE
        </div>
      </div>

      <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-400">PODCAST SYNDICATE</h2>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Book Guest Tier</label>
          <div className="grid grid-cols-3 gap-2">
            {(['LOCAL', 'MICRO', 'ICON'] as const).map(guest => (
              <button
                key={guest}
                onClick={() => state.setPodcastInput('selectedGuest', guest)}
                className={`py-2 rounded text-[10px] font-black transition-all border ${selectedGuest === guest ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
              >
                {guest} (${guestCosts[guest].toLocaleString()})
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unhinged Level</label>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${unhingedSlider === 3 ? 'bg-red-600 text-white' : unhingedSlider === 2 ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white'}`}>
              {unhingedSlider === 1 ? 'FILTERED' : unhingedSlider === 2 ? 'EDGY' : 'CANCELABLE'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            value={unhingedSlider}
            onChange={(e) => state.setPodcastInput('unhingedSlider', parseInt(e.target.value))}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
            <span>Safe</span>
            <span>Risky</span>
            <span>Nuclear</span>
          </div>
        </div>
      </div>

      <div className={`p-4 rounded-xl border ${riskPercent >= 60 ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-800/50 border-slate-700'}`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-[10px] font-black text-slate-500 uppercase">Controversy Risk</span>
          <span className={`font-mono font-bold ${riskPercent >= 60 ? 'text-red-500' : 'text-orange-400'}`}>{riskPercent}% Explosion Chance</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase">Potential Yield</span>
          <span className="font-mono font-bold text-emerald-400">{unhingedSlider}x Clout Multiplier</span>
        </div>
      </div>

      <button
        onClick={() => onExecute('pod')}
        disabled={!canAfford || state.pl.crises.shadowbanTurns > 0}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
      >
        {state.pl.crises.shadowbanTurns > 0
          ? `SHADOWBANNED: ${state.pl.crises.shadowbanTurns} MO REMAINING`
          : canAfford ? "RECORD & SYNDICATE EPISODE" : "INSUFFICIENT FUNDS"}
      </button>
    </div>
  );
}
