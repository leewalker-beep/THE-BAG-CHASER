import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function RocketLaunch({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [fuel, setFuel] = useState(0);
  const [stage, setStage] = useState<'FUELING' | 'LAUNCHING' | 'RESULT'>('FUELING');
  const [altitude, setAltitude] = useState(0);

  const handleFuel = () => {
    if (stage !== 'FUELING') return;
    setFuel(f => Math.min(100, f + 15));
  };

  useEffect(() => {
    if (stage === 'FUELING') {
      const decay = setInterval(() => setFuel(f => Math.max(0, f - 2)), 100);
      return () => clearInterval(decay);
    }
  }, [stage]);

  const handleLaunch = () => {
    if (stage !== 'FUELING') return;
    setStage('LAUNCHING');

    const finalAlt = fuel * 2;
    const duration = 2000;
    const startTime = Date.now();

    const anim = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(1, elapsed / duration);
      setAltitude(progress * finalAlt);

      if (progress >= 1) {
        clearInterval(anim);
        setStage('RESULT');
        if (finalAlt >= 150) onComplete(1.5);
        else if (finalAlt >= 80) onComplete(1.0);
        else onComplete(0.5);
      }
    }, 20);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-cyan-400 uppercase tracking-tighter">SPACE INVESTMENT: LAUNCH</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Fuel up and launch for orbit</p>
      </div>

      <div className="w-full h-48 bg-black border-2 border-slate-800 rounded-3xl relative overflow-hidden">
        {/* Stars */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Rocket */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-4xl"
          animate={stage === 'LAUNCHING' ? { bottom: '120%' } : { y: [0, -5, 0] }}
          transition={stage === 'LAUNCHING' ? { duration: 2, ease: "easeIn" } : { repeat: Infinity, duration: 1 }}
        >
          🚀
          {stage === 'LAUNCHING' && (
            <motion.div
              className="absolute top-full left-1/2 -translate-x-1/2 w-4 bg-orange-500 rounded-full blur-sm"
              animate={{ height: [10, 30, 10] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
            />
          )}
        </motion.div>

        {stage === 'LAUNCHING' && (
          <div className="absolute top-4 right-4 font-mono text-cyan-400 text-xs font-black">
            ALT: {Math.round(altitude)}km
          </div>
        )}
      </div>

      <div className="w-full space-y-2">
        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase px-1">
          <span>Fuel Level</span>
          <span>{Math.round(fuel)}%</span>
        </div>
        <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
          <motion.div
            className="h-full bg-cyan-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${fuel}%` }}
          />
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <button
          onClick={handleFuel}
          disabled={stage !== 'FUELING'}
          className="flex-1 py-4 bg-cyan-700 hover:bg-cyan-600 disabled:bg-slate-800 text-white font-black uppercase rounded-xl transition-all active:scale-95 shadow-lg"
        >
          ⚡ FUEL
        </button>
        <button
          onClick={handleLaunch}
          disabled={stage !== 'FUELING' || fuel < 20}
          className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-black uppercase rounded-xl transition-all active:scale-95 shadow-lg"
        >
          🔥 LAUNCH
        </button>
      </div>
    </div>
  );
}
