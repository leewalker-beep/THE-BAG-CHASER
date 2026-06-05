import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type GrantType = 'URGENT' | 'RESEARCH' | 'FRAUD';

interface Grant {
  id: number;
  type: GrantType;
  text: string;
}

const GRANT_POOL: Omit<Grant, 'id'>[] = [
  { type: 'URGENT', text: 'Clean Water Initiative' },
  { type: 'URGENT', text: 'Emergency Food Relief' },
  { type: 'RESEARCH', text: 'Quantum Energy Study' },
  { type: 'RESEARCH', text: 'AI Ethics Board' },
  { type: 'FRAUD', text: 'Offshore Shell Audit' },
  { type: 'FRAUD', text: 'Luxury Yacht Tax' },
];

export function GrantSort({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setGrants(prev => {
        if (prev.length >= 3) return prev;
        const template = GRANT_POOL[Math.floor(Math.random() * GRANT_POOL.length)];
        return [...prev, { ...template, id: Date.now() }];
      });
    }, 1500);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(interval);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (score >= 6) onComplete(1.5);
      else if (score >= 3) onComplete(1.0);
      else onComplete(0.5);
    }
  }, [timeLeft]);

  const handleSort = (id: number, choice: 'APPROVE' | 'DENY') => {
    const grant = grants.find(g => g.id === id);
    if (!grant) return;

    let correct = false;
    if (choice === 'APPROVE' && (grant.type === 'URGENT' || grant.type === 'RESEARCH')) correct = true;
    if (choice === 'DENY' && grant.type === 'FRAUD') correct = true;

    if (correct) setScore(s => s + 1);
    setGrants(prev => prev.filter(g => g.id !== id));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-rose-400 uppercase tracking-tighter">PHILANTHROPY: GRANT SORT</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Approve legitimate grants, deny fraud</p>
      </div>

      <div className="flex justify-between w-full font-mono text-xs font-black px-2">
        <div className="text-slate-500">TIME: {timeLeft}s</div>
        <div className="text-emerald-500">SCORE: {score}</div>
      </div>

      <div className="w-full h-64 bg-slate-950 border-2 border-slate-900 rounded-3xl relative overflow-hidden flex flex-col gap-2 p-4">
        <AnimatePresence>
          {grants.map((grant) => (
            <motion.div
              key={grant.id}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between gap-3 shadow-lg"
            >
              <div className="flex-1">
                <div className={`text-[8px] font-black uppercase ${grant.type === 'FRAUD' ? 'text-rose-500' : 'text-cyan-500'}`}>{grant.type}</div>
                <div className="text-[10px] text-white font-bold truncate w-24">{grant.text}</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleSort(grant.id, 'APPROVE')}
                  className="p-2 bg-emerald-600 rounded-lg text-[10px] text-white font-black"
                >
                  ✓
                </button>
                <button
                  onClick={() => handleSort(grant.id, 'DENY')}
                  className="p-2 bg-rose-600 rounded-lg text-[10px] text-white font-black"
                >
                  ✗
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {grants.length === 0 && timeLeft > 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-[10px] text-slate-700 font-black uppercase">Waiting for applications...</div>
        )}
      </div>
    </div>
  );
}
