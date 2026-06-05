import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function HypeMeter({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [hype, setHype] = useState(50);
  const hypeRef = useRef(50);
  const [timeLeft, setTimeLeft] = useState(5.0);
  const [status, setStatus] = useState<'READY' | 'PLAYING' | 'FINISHED'>('READY');
  const [successTime, setSuccessTime] = useState(0);

  const start = () => setStatus('PLAYING');

  useEffect(() => {
    hypeRef.current = hype;
  }, [hype]);

  useEffect(() => {
    if (status === 'PLAYING') {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 0.1) {
            clearInterval(timer);
            setStatus('FINISHED');
            return 0;
          }
          return t - 0.1;
        });
      }, 100);

      const decay = setInterval(() => {
        setHype(h => Math.max(0, h - 1.5));
      }, 50);

      const scoring = setInterval(() => {
        if (hypeRef.current >= 70 && hypeRef.current <= 90) {
          setSuccessTime(s => s + 0.1);
        }
      }, 100);

      return () => {
        clearInterval(timer);
        clearInterval(decay);
        clearInterval(scoring);
      };
    }
  }, [status]);

  useEffect(() => {
    if (status === 'FINISHED') {
      if (successTime >= 3.0) onComplete(1.5);
      else if (successTime >= 1.5) onComplete(1.0);
      else onComplete(0.5);
    }
  }, [status]);

  const handlePump = () => {
    if (status === 'READY') start();
    if (status === 'PLAYING') {
      setHype(h => Math.min(100, h + 8));
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-rose-500 uppercase tracking-tighter">FIGHT PROMOTER: HYPE BUILD</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Keep hype in the GOLDEN ZONE (70-90%)</p>
      </div>

      <div className="w-full h-48 bg-slate-900 border-2 border-slate-800 rounded-3xl relative overflow-hidden flex flex-col items-center justify-end p-4">
        {/* Hype Zone */}
        <div className="absolute bottom-[70%] top-[10%] left-0 right-0 bg-emerald-500/10 border-y border-emerald-500/30" />
        <div className="absolute bottom-[70%] left-4 text-[8px] font-black text-emerald-500 uppercase">Hype Zone</div>

        {/* Meter */}
        <motion.div
          className="w-full bg-gradient-to-t from-rose-600 via-orange-500 to-emerald-400 rounded-xl"
          initial={{ height: '0%' }}
          animate={{ height: `${hype}%` }}
          transition={{ type: 'spring', bounce: 0.4, duration: 0.2 }}
        />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-4xl font-black text-white/20">{Math.round(hype)}%</span>
        </div>
      </div>

      <div className="flex justify-between w-full font-mono text-xs font-black px-2">
        <div className={timeLeft < 2 ? 'text-rose-500' : 'text-slate-500'}>TIME: {timeLeft.toFixed(1)}s</div>
        <div className="text-emerald-500 uppercase">STREAK: {successTime.toFixed(1)}s</div>
      </div>

      <button
        onMouseDown={handlePump}
        className="w-full py-6 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase rounded-2xl shadow-xl active:scale-95 transition-all"
      >
        📣 PUMP THE FIGHT
      </button>
    </div>
  );
}
