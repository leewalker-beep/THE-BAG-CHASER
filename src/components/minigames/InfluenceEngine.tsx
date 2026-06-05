import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfluenceState {
  phase: 'VIRAL' | 'RESULT';
  followers: number;
  aura: number;
  multiplier: number;
  timeLeft: number;
}

interface InfluenceEngineProps {
  onComplete: (multiplier: number) => void;
}

export function InfluenceEngine({ onComplete }: InfluenceEngineProps) {
  const [state, setState] = useState<InfluenceState>({
    phase: 'VIRAL',
    followers: 10000000, // 10M base
    aura: 5000000, // 5M base
    multiplier: 1,
    timeLeft: 15,
  });

  useEffect(() => {
    if (state.phase === 'VIRAL' && state.timeLeft > 0) {
      const timer = setInterval(() => {
        setState(s => ({ ...s, timeLeft: s.timeLeft - 1 }));
      }, 1000);
      return () => clearInterval(timer);
    } else if (state.timeLeft <= 0) {
      setState(s => ({ ...s, phase: 'RESULT' }));
    }
  }, [state.phase, state.timeLeft]);

  const handleTap = () => {
    if (state.phase !== 'VIRAL') return;
    const gain = 1000000 * state.multiplier;
    const auraGain = 500000 * state.multiplier;
    setState(s => ({
      ...s,
      followers: s.followers + gain,
      aura: s.aura + auraGain,
      multiplier: Math.min(10, s.multiplier + 0.1),
    }));
  };

  const winConditionMet = state.followers >= 100000000 && state.aura >= 50000000;

  return (
    <div className="flex flex-col h-[500px] bg-slate-950 text-white font-sans p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[conic-gradient(from_0deg,_#ff00ff,_#00ffff,_#ff00ff)] animate-spin-slow" />

      <AnimatePresence mode="wait">
        {state.phase === 'VIRAL' ? (
          <motion.div key="game" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 flex flex-col h-full items-center justify-center">
            <div className="w-full flex justify-between absolute top-6 px-6">
              <div className="text-left">
                <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Followers</div>
                <div className="text-xl font-black italic">{(state.followers / 1000000).toFixed(1)}M</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Aura</div>
                <div className="text-xl font-black italic">{(state.aura / 1000000).toFixed(1)}M</div>
              </div>
            </div>

            <div className="text-6xl font-black italic text-white mb-4 animate-pulse">
              {state.timeLeft}s
            </div>

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleTap}
              className="w-48 h-48 rounded-full bg-gradient-to-tr from-pink-600 to-blue-600 flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)] border-4 border-white/20 relative"
            >
              <div className="text-4xl font-black italic uppercase tracking-tighter text-white">VIRAL</div>
              <div className="absolute -bottom-4 bg-white text-black px-4 py-1 rounded-full text-xs font-black">
                x{state.multiplier.toFixed(1)}
              </div>
            </motion.button>

            <div className="absolute bottom-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Tap to dominate the cultural zeitgeist
            </div>
          </motion.div>
        ) : (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-8">
            {winConditionMet ? (
              <>
                <div className="space-y-2">
                  <div className="text-pink-500 text-6xl font-black italic tracking-tighter uppercase">ICONIC</div>
                  <div className="text-white text-xl font-black tracking-widest uppercase">CULTURAL DOMINANCE ACHIEVED</div>
                </div>
                <p className="text-slate-400 text-sm max-w-xs font-bold uppercase tracking-widest leading-relaxed">
                  You are no longer a person. You are a brand, a myth, a god of the digital age.
                </p>
                <button onClick={() => onComplete(1.5)} className="px-12 py-5 bg-pink-600 hover:bg-pink-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all">
                  ASCEND
                </button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="text-slate-600 text-6xl font-black italic tracking-tighter uppercase">IRRELEVANT</div>
                  <div className="text-white text-xl font-black tracking-widest uppercase">THE INTERNET HAS MOVED ON</div>
                </div>
                <p className="text-slate-400 text-sm max-w-xs font-bold uppercase tracking-widest leading-relaxed">
                  The feed refreshed and you were gone. Another 15 minutes of fame, expired.
                </p>
                <button onClick={() => onComplete(0.2)} className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl transition-all">
                  LOG OFF
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
