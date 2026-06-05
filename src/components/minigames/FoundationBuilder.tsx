import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FoundationState {
  phase: 'STRATEGY' | 'RESULT';
  assets: number;
  aura: number;
  initiatives: {
    philanthropy: number;
    policy: number;
    media: number;
  };
  round: number;
}

interface FoundationBuilderProps {
  onComplete: (multiplier: number) => void;
}

const INITIATIVES = [
  { id: 'philanthropy', name: 'Global Health', cost: 20000000000, auraGain: 1000000, assetGain: -15000000000 },
  { id: 'policy', name: 'Policy Influence', cost: 10000000000, auraGain: 500000, assetGain: 20000000000 },
  { id: 'media', name: 'Media Buyout', cost: 50000000000, auraGain: 2000000, assetGain: 5000000000 },
];

export function FoundationBuilder({ onComplete }: FoundationBuilderProps) {
  const [state, setState] = useState<FoundationState>({
    phase: 'STRATEGY',
    assets: 100000000000, // Starting with $100B
    aura: 2000000, // Starting with 2M Aura
    initiatives: { philanthropy: 0, policy: 0, media: 0 },
    round: 1,
  });

  const [message, setMessage] = useState('Allocate resources to shape your legacy.');

  const handleInvest = (id: 'philanthropy' | 'policy' | 'media') => {
    const init = INITIATIVES.find(i => i.id === id)!;
    if (state.assets < init.cost) {
      setMessage('Insufficient assets for this initiative!');
      return;
    }

    setState(s => ({
      ...s,
      assets: s.assets + init.assetGain,
      aura: s.aura + init.auraGain,
      initiatives: { ...s.initiatives, [id]: s.initiatives[id] + 1 },
      round: s.round + 1,
    }));
    setMessage(`Successfully launched ${init.name}.`);

    if (state.round >= 8) {
      setState(s => ({ ...s, phase: 'RESULT' }));
    }
  };

  const winConditionMet = state.assets >= 500000000000 && state.aura >= 10000000;

  return (
    <div className="flex flex-col h-[500px] bg-slate-950 text-white font-serif p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />

      <AnimatePresence mode="wait">
        {state.phase === 'STRATEGY' ? (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 flex flex-col h-full">
            <div className="flex justify-between items-start border-b border-white/10 pb-4">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">The Legacy Foundation</div>
                <div className="text-xl font-serif text-amber-500">ASSETS: ${(state.assets / 1000000000).toFixed(0)}B</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Aura</div>
                <div className="text-xl font-serif text-purple-400">{(state.aura / 1000000).toFixed(1)}M</div>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {INITIATIVES.map(i => (
                <button
                  key={i.id}
                  onClick={() => handleInvest(i.id as any)}
                  className="w-full bg-slate-900/50 hover:bg-slate-800 transition-all p-4 rounded-xl border border-white/5 text-left group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-lg font-serif text-white group-hover:text-amber-500 transition-colors">{i.name}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Cost: ${(i.cost / 1000000000).toFixed(0)}B</span>
                  </div>
                  <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest">
                    <span className="text-emerald-400">Net Assets: {i.assetGain > 0 ? '+' : ''}${(i.assetGain / 1000000000).toFixed(0)}B</span>
                    <span className="text-purple-400">Aura: +{(i.auraGain / 1000000).toFixed(1)}M</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center space-y-2">
              <div className="text-[10px] text-slate-400 italic">"{message}"</div>
              <div className="text-[9px] text-slate-600 font-bold uppercase">Quarter {state.round} / 8</div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-8">
            {winConditionMet ? (
              <>
                <div className="space-y-2">
                  <div className="text-amber-500 text-6xl font-serif italic tracking-tighter uppercase">LEGACY SECURED</div>
                  <div className="text-white text-xl font-serif tracking-widest uppercase">THE WORLD IS YOURS</div>
                </div>
                <p className="text-slate-400 text-sm max-w-xs font-serif italic leading-relaxed">
                  Your foundation will outlast nations. You have achieved immortality in the history books.
                </p>
                <button onClick={() => onComplete(1.5)} className="px-12 py-5 bg-amber-600 hover:bg-amber-500 text-black font-bold uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all">
                  ETERNITY
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-slate-500 text-6xl font-serif italic tracking-tighter uppercase">FADED</div>
                  <div className="text-white text-xl font-serif tracking-widest uppercase">FAILED TO LEAVE A MARK</div>
                </div>
                <p className="text-slate-400 text-sm max-w-xs font-serif italic leading-relaxed">
                  The resources are gone, and the public has forgotten. Your name is just a footnote.
                </p>
                <button onClick={() => onComplete(0.2)} className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all">
                  OBLIVION
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
