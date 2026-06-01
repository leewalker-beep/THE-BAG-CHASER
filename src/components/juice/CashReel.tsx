import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CashReelProps {
  value: number;
}

export function CashReel({ value }: CashReelProps) {
  const [phase, setPhase] = useState<'IDLE' | 'SLOW_DROP' | 'LOCK_IN' | 'RAPID_RISE'>('IDLE');
  const [spinEmoji] = useState(() => ['💵', '💰', '💎', '💳'][Math.floor(Math.random() * 4)]);
  const prevValue = useRef(value);

  const startAnimation = () => {
    setPhase('SLOW_DROP');

    // Phase 1: Slow Drop (Vertical Reel Spin)
    setTimeout(() => {
      setPhase('LOCK_IN');

      // Phase 2: Lock-In (Snap + Flash)
      setTimeout(() => {
        setPhase('RAPID_RISE');

        // Phase 3: Rapid Rise (Vacuum)
        setTimeout(() => {
          setPhase('IDLE');
        }, 400);
      }, 500);
    }, 1500);
  };

  useEffect(() => {
    if (value !== prevValue.current) {
      startAnimation();
      prevValue.current = value;
    }
  }, [value]);

  return (
    <div className="relative overflow-visible flex items-center justify-end">
      <AnimatePresence mode="wait">
        {phase === 'IDLE' ? (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm font-black text-emerald-400"
          >
            ${value.toLocaleString()}
          </motion.div>
        ) : phase === 'SLOW_DROP' ? (
          <motion.div
            key="slow_drop"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ scale: 1.2, filter: "brightness(2)" }}
            transition={{ duration: 0.2, repeat: 5, repeatType: "loop", ease: "linear" }}
            className="text-sm font-black text-emerald-500 italic"
          >
            {spinEmoji} SPINNING...
          </motion.div>
        ) : phase === 'LOCK_IN' ? (
          <motion.div
            key="lock_in"
            initial={{ scale: 0.8, filter: "brightness(0)" }}
            animate={{ scale: [1.2, 1], filter: "brightness(1.5)" }}
            className="text-sm font-black text-white bg-emerald-600 px-2 py-0.5 rounded shadow-[0_0_15px_rgba(16,185,129,0.8)]"
          >
            ${value.toLocaleString()} ⚡
          </motion.div>
        ) : (
          <motion.div
            key="rapid_rise"
            initial={{ y: 0, opacity: 1, scale: 1 }}
            animate={{ y: -100, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: "backIn" }}
            className="text-lg font-black text-emerald-400"
          >
            ${value.toLocaleString()} 💸
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Shake & Flash Overlay (only during Lock-In) */}
      {phase === 'LOCK_IN' && (
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-[200] pointer-events-none"
        />
      )}
    </div>
  );
}
