import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export function PatternMatch({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const [round, setRound] = useState(1);
  const totalRounds = 3;

  useEffect(() => {
    startRound(1);
  }, []);

  const startRound = (r: number) => {
    const newSequence = Array.from({ length: r + 2 }, () => Math.floor(Math.random() * 4));
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq: number[]) => {
    setPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(r => setTimeout(r, 600));
      setHighlighted(seq[i]);
      await new Promise(r => setTimeout(r, 400));
      setHighlighted(null);
    }
    setPlaying(false);
  };

  const handlePress = (idx: number) => {
    if (playing) return;
    const nextUserSeq = [...userSequence, idx];
    setUserSequence(nextUserSeq);

    if (idx !== sequence[userSequence.length]) {
      // Failure
      onComplete(0.5);
      return;
    }

    if (nextUserSeq.length === sequence.length) {
      if (round === totalRounds) {
        onComplete(1.5);
      } else {
        setRound(r => r + 1);
        setTimeout(() => startRound(round + 1), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-indigo-500 uppercase tracking-tighter">DATA MONOPOLY: PATTERN</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Sync with the data stream</p>
      </div>

      <div className="text-[10px] text-slate-500 font-black uppercase">Round {round}/{totalRounds}</div>

      <div className="grid grid-cols-2 gap-4 w-48 h-48">
        {[0, 1, 2, 3].map((i) => (
          <motion.button
            key={i}
            onMouseDown={() => handlePress(i)}
            animate={{
              scale: highlighted === i ? 1.05 : 1,
              backgroundColor: highlighted === i ? '#6366f1' : '#1e293b',
              boxShadow: highlighted === i ? '0 0 20px #6366f1' : 'none'
            }}
            className={`w-full h-full rounded-2xl border-2 border-slate-800 flex items-center justify-center text-white font-black text-xl`}
          >
            {i === 0 && '⚡'}
            {i === 1 && '📡'}
            {i === 2 && '💾'}
            {i === 3 && '🔒'}
          </motion.button>
        ))}
      </div>

      <div className="text-xs font-black uppercase tracking-widest text-slate-500">
        {playing ? 'WATCH STREAM' : 'INPUT DATA'}
      </div>
    </div>
  );
}
