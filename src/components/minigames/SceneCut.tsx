import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function SceneCut({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [round, setRound] = useState(1);
  const totalRounds = 3;
  const [score, setScore] = useState(0);
  const [indicatorPos, setIndicatorPos] = useState(0);
  const [isMoving, setIsMoving] = useState(true);
  const [result, setResult] = useState<'HIT' | 'MISS' | null>(null);

  useEffect(() => {
    if (!isMoving) return;
    const interval = setInterval(() => {
      setIndicatorPos(p => (p + 5) % 200);
    }, 20);
    return () => clearInterval(interval);
  }, [isMoving]);

  const handleCut = () => {
    if (!isMoving) return;
    setIsMoving(false);
    // Center is 100, target zone is 85-115
    const hit = indicatorPos >= 85 && indicatorPos <= 115;
    if (hit) {
      setScore(s => s + 1);
      setResult('HIT');
    } else {
      setResult('MISS');
    }

    setTimeout(() => {
      if (round < totalRounds) {
        setRound(r => r + 1);
        setIsMoving(true);
        setResult(null);
        setIndicatorPos(0);
      } else {
        const finalScore = hit ? score + 1 : score;
        if (finalScore === totalRounds) onComplete(1.5);
        else if (finalScore >= 1) onComplete(1.0);
        else onComplete(0.5);
      }
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-purple-500 uppercase tracking-tighter">FILM STUDIO: PERFECT CUT</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Time the cut for maximum impact</p>
      </div>

      <div className="text-[10px] text-slate-500 font-black uppercase">Scene {round}/{totalRounds}</div>

      <div className="w-full h-16 bg-slate-900 border border-slate-800 rounded-lg relative overflow-hidden flex items-center">
        <div className="absolute left-1/2 -translate-x-1/2 w-8 h-full bg-emerald-500/20 border-x border-emerald-500/50" />
        <motion.div
          className="w-1 h-full bg-white shadow-[0_0_10px_white] absolute"
          style={{ left: `${(indicatorPos / 200) * 100}%` }}
        />
        {result && (
          <div className={`absolute inset-0 flex items-center justify-center font-black text-2xl italic tracking-tighter ${result === 'HIT' ? 'text-emerald-500' : 'text-rose-500'}`}>
            {result}
          </div>
        )}
      </div>

      <button
        onClick={handleCut}
        disabled={!isMoving}
        className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 text-white font-black uppercase rounded-xl transition-colors shadow-lg active:scale-95"
      >
        🎬 ACTION!
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i < score ? 'bg-emerald-500' : 'bg-slate-800'}`}
          />
        ))}
      </div>
    </div>
  );
}
