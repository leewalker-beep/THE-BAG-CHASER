import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeatDrizzleProps {
  heat: number;
}

export function HeatDrizzle({ heat }: HeatDrizzleProps) {
  const [particles, setParticles] = useState<{ id: number; x: number; size: number; duration: number }[]>([]);

  useEffect(() => {
    if (heat < 80) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      const newParticle = {
        id: Math.random(),
        x: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 2 + 1,
      };
      setParticles((prev) => [...prev.slice(-20), newParticle]);
    }, 100);

    return () => clearInterval(interval);
  }, [heat]);

  if (heat < 80) return null;

  return (
    <div className="absolute inset-x-0 bottom-0 h-0 pointer-events-none overflow-visible">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{
              opacity: 0,
              x: `${p.x}%`,
              y: 0,
              scale: 0,
              backgroundColor: "#f97316", // orange-500
              boxShadow: "0 0 10px #ef4444" // red-500
            }}
            animate={{
              opacity: [0, 1, 0.8, 0],
              y: "100vh",
              scale: [1, 1.5, 0.5],
              rotate: 360,
              backgroundColor: ["#fb923c", "#f97316", "#dc2626"] // orange-400, orange-500, red-600
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: p.duration,
              ease: "linear"
            }}
            className="absolute rounded-full"
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </AnimatePresence>

      {/* Heat Distortion Effect Overlay */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-orange-600/20 to-transparent blur-3xl"
      />
    </div>
  );
}
