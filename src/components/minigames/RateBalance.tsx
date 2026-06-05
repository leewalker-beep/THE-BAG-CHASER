import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function RateBalance({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [balance, setBalance] = useState(50);
  const balanceRef = useRef(50);
  const [target, setTarget] = useState(50);
  const targetRef = useRef(50);
  const [timeLeft, setTimeLeft] = useState(10);
  const [score, setScore] = useState(0);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    const targetInterval = setInterval(() => {
      setTarget(Math.floor(20 + Math.random() * 60));
    }, 2000);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(targetInterval);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const scoring = setInterval(() => {
      const diff = Math.abs(balanceRef.current - targetRef.current);
      if (diff < 10) setScore(s => s + 1);
    }, 100);

    return () => {
      clearInterval(targetInterval);
      clearInterval(timer);
      clearInterval(scoring);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (score >= 70) onComplete(1.5);
      else if (score >= 40) onComplete(1.0);
      else onComplete(0.5);
    }
  }, [timeLeft]);

  const adjust = (dir: number) => {
    setBalance(b => Math.min(100, Math.max(0, b + dir * 5)));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-amber-600 uppercase tracking-tighter">CENTRAL BANK: EQUILIBRIUM</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Balance rates against market targets</p>
      </div>

      <div className="flex justify-between w-full font-mono text-xs font-black px-2">
        <div className="text-slate-500">SEC: {timeLeft}s</div>
        <div className="text-amber-500 uppercase">STABILITY: {Math.min(100, score)}%</div>
      </div>

      <div className="w-full h-12 bg-slate-950 border-2 border-slate-900 rounded-full relative overflow-hidden flex items-center px-4">
        {/* Target Zone */}
        <motion.div
          className="absolute h-8 w-8 bg-amber-500/20 border border-amber-500/50 rounded-full"
          animate={{ left: `${target}%` }}
          style={{ transform: 'translateX(-50%)' }}
        />
        {/* Current Balance */}
        <motion.div
          className="w-4 h-4 bg-white rounded-full shadow-[0_0_10px_white] relative z-10"
          animate={{ left: `${balance}%` }}
          style={{ transform: 'translateX(-50%)' }}
        />
      </div>

      <div className="flex gap-4 w-full">
        <button
          onClick={() => adjust(-1)}
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xl rounded-xl transition-all active:scale-95 border-b-4 border-slate-950"
        >
          📉
        </button>
        <button
          onClick={() => adjust(1)}
          className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white font-black text-xl rounded-xl transition-all active:scale-95 border-b-4 border-slate-950"
        >
          📈
        </button>
      </div>
    </div>
  );
}
