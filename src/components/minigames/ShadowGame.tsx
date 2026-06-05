import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ShadowState {
  phase: 'PLANNING' | 'ACTION' | 'RESULT';
  agencies: Record<string, number>;
  resources: {
    bribes: number;
    blackmail: number;
    loyalty: number;
  };
  round: number;
}

interface ShadowGameProps {
  onComplete: (multiplier: number) => void;
}

const AGENCIES = [
  { id: 'CIA', name: 'CIA', weight: 15 },
  { id: 'FBI', name: 'FBI', weight: 15 },
  { id: 'NSA', name: 'NSA', weight: 10 },
  { id: 'PENTAGON', name: 'Pentagon', weight: 25 },
  { id: 'TREASURY', name: 'Treasury', weight: 20 },
  { id: 'STATE', name: 'State Dept', weight: 15 },
];

export function ShadowGame({ onComplete }: ShadowGameProps) {
  const [state, setState] = useState<ShadowState>({
    phase: 'PLANNING',
    agencies: { CIA: 0, FBI: 0, NSA: 0, PENTAGON: 0, TREASURY: 0, STATE: 0 },
    resources: { bribes: 3, blackmail: 3, loyalty: 3 },
    round: 1,
  });

  const [message, setMessage] = useState('Select an agency to influence.');

  const totalControl = Object.entries(state.agencies).reduce((acc, [id, val]) => {
    const agency = AGENCIES.find(a => a.id === id);
    return acc + (val * (agency?.weight || 0) / 100);
  }, 0);

  const handleAction = (agencyId: string, type: 'bribes' | 'blackmail' | 'loyalty') => {
    if (state.resources[type] <= 0) {
      setMessage(`Not enough ${type}!`);
      return;
    }

    const boost = type === 'bribes' ? 20 : type === 'blackmail' ? 25 : 15;
    const failChance = type === 'blackmail' ? 0.3 : 0.1;

    // Move Math.random out of the state updater to satisfy purity if needed,
    // although it was already outside. Actually the lint error suggested it was inside.
    // It's in the event handler, which should be fine, but let's be super safe.
    const roll = Math.random();
    const isFail = roll < failChance;

    if (isFail) {
      setMessage(`The attempt at ${agencyId} backfired!`);
      setState(s => {
        const nextRound = s.round + 1;
        return {
          ...s,
          resources: { ...s.resources, [type]: s.resources[type] - 1 },
          round: nextRound,
          phase: nextRound > 9 ? 'RESULT' : s.phase
        };
      });
    } else {
      setMessage(`Successfully increased control over ${agencyId}.`);
      setState(s => {
        const nextRound = s.round + 1;
        return {
          ...s,
          agencies: { ...s.agencies, [agencyId]: Math.min(100, s.agencies[agencyId] + boost) },
          resources: { ...s.resources, [type]: s.resources[type] - 1 },
          round: nextRound,
          phase: nextRound > 9 ? 'RESULT' : s.phase
        };
      });
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-950 text-white font-mono p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 to-transparent" />

      <AnimatePresence mode="wait">
        {state.phase !== 'RESULT' ? (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase">Operation Shadow Game</div>
                <div className="text-xl font-black italic text-rose-500">CONTROL: {totalControl.toFixed(1)}%</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-500 uppercase">Phase {state.round} / 9</div>
                <div className="text-sm font-black text-slate-300">ESTABLISHING DOMINANCE</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[9px] text-slate-500 uppercase">Bribes</div>
                <div className="text-lg font-black text-emerald-400">{state.resources.bribes}</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[9px] text-slate-500 uppercase">Blackmail</div>
                <div className="text-lg font-black text-purple-400">{state.resources.blackmail}</div>
              </div>
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                <div className="text-[9px] text-slate-500 uppercase">Loyalty</div>
                <div className="text-lg font-black text-blue-400">{state.resources.loyalty}</div>
              </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-3">
                {AGENCIES.map(a => (
                  <div key={a.id} className="bg-slate-800/50 p-3 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-black text-xs">{a.name} ({a.weight}%)</span>
                      <span className="text-xs font-bold text-rose-400">{state.agencies[a.id]}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-rose-500" style={{ width: `${state.agencies[a.id]}%` }} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAction(a.id, 'bribes')} className="flex-1 py-1 bg-emerald-900/30 hover:bg-emerald-600 hover:text-black text-[9px] font-bold uppercase rounded border border-emerald-500/30">Bribe</button>
                      <button onClick={() => handleAction(a.id, 'blackmail')} className="flex-1 py-1 bg-purple-900/30 hover:bg-purple-600 hover:text-black text-[9px] font-bold uppercase rounded border border-purple-500/30">Blackmail</button>
                      <button onClick={() => handleAction(a.id, 'loyalty')} className="flex-1 py-1 bg-blue-900/30 hover:bg-blue-600 hover:text-black text-[9px] font-bold uppercase rounded border border-blue-500/30">Loyalty</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-[10px] text-center text-slate-400 italic">"{message}"</div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-8">
            {totalControl >= 51 ? (
              <>
                <div className="space-y-2">
                  <div className="text-emerald-500 text-6xl font-black italic tracking-tighter uppercase">COUP SUCCESS</div>
                  <div className="text-white text-xl font-black tracking-widest uppercase">{totalControl.toFixed(1)}% CONTROL ACHIEVED</div>
                </div>
                <p className="text-slate-400 text-sm max-w-xs uppercase font-bold tracking-widest leading-relaxed">
                  The shadow government is now the only government. The agencies answer to you.
                </p>
                <button onClick={() => onComplete(1.5)} className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all">
                  EXECUTE ORDER
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-rose-600 text-6xl font-black italic tracking-tighter uppercase">EXPOSED</div>
                  <div className="text-white text-xl font-black tracking-widest uppercase">FAILED TO SECURE MAJORITY</div>
                </div>
                <p className="text-slate-400 text-sm max-w-xs uppercase font-bold tracking-widest leading-relaxed">
                  Your connections failed. The agencies have turned over your files to the DOJ.
                </p>
                <button onClick={() => onComplete(0.2)} className="px-12 py-5 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all">
                  ACCEPT FATE
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
