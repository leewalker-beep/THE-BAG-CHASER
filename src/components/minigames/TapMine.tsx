import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function TapMine({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const targetTaps = 30;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          finish(taps);
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [taps]);

  const finish = (finalTaps: number) => {
    if (finalTaps >= targetTaps) {
      onComplete(1.2); // Bonus for over-achieving
    } else if (finalTaps >= targetTaps * 0.7) {
      onComplete(1.0); // Full yield
    } else {
      onComplete(0.5); // Half yield
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-amber-500 uppercase tracking-tighter">CRYPTO MINING: HASH RUSH</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Tap fast to optimize hash rate</p>
      </div>

      <div className="flex justify-between w-full px-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-black uppercase">Taps</span>
          <span className="text-2xl font-mono text-white font-black">{taps}/{targetTaps}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-slate-500 font-black uppercase">Time</span>
          <span className={`text-2xl font-mono font-black ${timeLeft < 2 ? 'text-red-500' : 'text-white'}`}>{timeLeft.toFixed(1)}s</span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setTaps(t => t + 1)}
        className="w-32 h-32 rounded-full bg-amber-600 border-4 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center text-4xl"
      >
        ⛏️
      </motion.button>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (taps / targetTaps) * 100)}%` }}
        />
      </div>
    </div>
  );
}
