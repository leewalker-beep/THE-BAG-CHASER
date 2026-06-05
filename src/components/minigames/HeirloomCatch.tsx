import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function HeirloomCatch({ onComplete }: { onComplete: (multiplier: number) => void }) {
  const [basketPos, setBasketPos] = useState(50);
  const basketRef = useRef(50);
  const [items, setItems] = useState<{ id: number; x: number; y: number; type: 'GOLD' | 'TRASH' }[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    basketRef.current = basketPos;
  }, [basketPos]);

  useEffect(() => {
    const spawnInterval = setInterval(() => {
      setItems(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          x: 10 + Math.random() * 80,
          y: -10,
          type: Math.random() < 0.7 ? 'GOLD' : 'TRASH'
        }
      ]);
    }, 800);

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(spawnInterval);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const gameLoop = setInterval(() => {
      setItems(prev => {
        const nextItems = prev.map(item => ({ ...item, y: item.y + 5 }));
        const caught = nextItems.filter(item => item.y >= 85 && item.y <= 95 && Math.abs(item.x - basketRef.current) < 15);
        const remaining = nextItems.filter(item => item.y < 100 && !caught.includes(item));

        caught.forEach(item => {
          if (item.type === 'GOLD') setScore(s => s + 1);
          else setScore(s => Math.max(0, s - 2));
        });

        return remaining;
      });
    }, 50);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(timer);
      clearInterval(gameLoop);
    };
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      if (score >= 8) onComplete(1.5);
      else if (score >= 4) onComplete(1.0);
      else onComplete(0.5);
    }
  }, [timeLeft]);

  const move = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setBasketPos(Math.min(90, Math.max(10, x)));
  };

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="text-center">
        <h3 className="text-xl font-black text-yellow-500 uppercase tracking-tighter">LEGACY FUND: HARVEST</h3>
        <p className="text-[10px] text-slate-400 uppercase font-bold">Secure the assets, avoid the liabilities</p>
      </div>

      <div className="flex justify-between w-full font-mono text-xs font-black px-2">
        <div className="text-slate-500">TIME: {timeLeft}s</div>
        <div className="text-yellow-500">ASSETS: {score}</div>
      </div>

      <div
        className="w-full h-64 bg-slate-950 border-2 border-slate-900 rounded-3xl relative overflow-hidden cursor-crosshair"
        onMouseMove={move}
        onTouchMove={move}
      >
        <AnimatePresence>
          {items.map(item => (
            <motion.div
              key={item.id}
              className="absolute text-2xl"
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
            >
              {item.type === 'GOLD' ? '💰' : '💣'}
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.div
          className="absolute bottom-4 h-4 w-16 bg-yellow-600 rounded-full border-t-4 border-yellow-400 shadow-[0_0_20px_rgba(234,179,8,0.3)]"
          style={{ left: `${basketPos}%`, transform: 'translateX(-50%)' }}
        />
      </div>

      <div className="text-[8px] text-slate-600 font-black uppercase text-center">Move mouse/touch to catch falling assets</div>
    </div>
  );
}
