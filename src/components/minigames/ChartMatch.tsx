import { useState, useEffect } from 'react';

export function ChartMatch({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [target, setTarget] = useState<'UP' | 'DOWN' | 'STABLE'>('UP');
  const [current, setCurrent] = useState<'UP' | 'DOWN' | 'STABLE' | null>(null);
  const [round, setRound] = useState(1);
  const totalRounds = 3;
  const [score, setScore] = useState(0);

  useEffect(() => {
    generateTarget();
  }, [round]);

  const generateTarget = () => {
    const options: ('UP' | 'DOWN' | 'STABLE')[] = ['UP', 'DOWN', 'STABLE'];
    setTarget(options[Math.floor(Math.random() * options.length)]);
    setCurrent(null);
  };

  const handleSelect = (choice: 'UP' | 'DOWN' | 'STABLE') => {
    setCurrent(choice);
    if (choice === target) setScore(s => s + 1);

    setTimeout(() => {
      if (round < totalRounds) {
        setRound(r => r + 1);
      } else {
        const finalScore = choice === target ? score + 1 : score;
        if (finalScore === totalRounds) onComplete(1.5);
        else if (finalScore >= 1) onComplete(1.0);
        else onComplete(0.5);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-blue-500 uppercase tracking-tighter">DATA ANALYTICS: TREND MATCH</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Identify the market direction</p>
      </div>

      <div className="text-[10px] text-slate-500 font-black uppercase">Round {round}/{totalRounds}</div>

      <div className="w-full h-32 bg-black border border-slate-800 rounded flex items-center justify-center relative overflow-hidden">
        <div className="text-4xl">
          {target === 'UP' && <span className="text-emerald-500">📈</span>}
          {target === 'DOWN' && <span className="text-rose-500">📉</span>}
          {target === 'STABLE' && <span className="text-blue-500">📊</span>}
        </div>
        <div className="absolute inset-0 bg-blue-500/5 animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-3 w-full">
        <button
          onClick={() => handleSelect('UP')}
          className={`py-3 rounded border font-black uppercase text-[10px] transition-all ${current === 'UP' ? (target === 'UP' ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400') : 'bg-slate-800 border-slate-700'}`}
        >
          Bullish
        </button>
        <button
          onClick={() => handleSelect('STABLE')}
          className={`py-3 rounded border font-black uppercase text-[10px] transition-all ${current === 'STABLE' ? (target === 'STABLE' ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400') : 'bg-slate-800 border-slate-700'}`}
        >
          Stable
        </button>
        <button
          onClick={() => handleSelect('DOWN')}
          className={`py-3 rounded border font-black uppercase text-[10px] transition-all ${current === 'DOWN' ? (target === 'DOWN' ? 'bg-emerald-600 border-emerald-400' : 'bg-rose-600 border-rose-400') : 'bg-slate-800 border-slate-700'}`}
        >
          Bearish
        </button>
      </div>
    </div>
  );
}
