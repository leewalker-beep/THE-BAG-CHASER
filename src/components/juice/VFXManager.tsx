import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJuiceStore } from '../../store/juiceStore';

const SURGE_ELEMENTS = ['👟📦', '🚀', '🏆'];
const CASCADE_ELEMENTS = ['🏷️💨', 'TOXIC', '📉'];

export function VFXManager() {
  const { events, removeEvent } = useJuiceStore();
  const [isDesaturated, setIsDesaturated] = useState(false);

  useEffect(() => {
    const hasCascade = events.some(e => e.type === 'CASCADE');
    if (hasCascade) {
      setTimeout(() => setIsDesaturated(true), 0);
    }
  }, [events]);

  useEffect(() => {
    if (isDesaturated) {
      const timer = setTimeout(() => setIsDesaturated(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isDesaturated]);

  return (
    <>
      <style>{`
        body {
          transition: filter 0.5s ease;
          filter: ${isDesaturated ? 'grayscale(0.8)' : 'none'};
        }
      `}</style>

      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
        <AnimatePresence>
          {events.map((event) => (
            <VFXEventInstance
              key={event.id}
              event={event}
              onComplete={() => removeEvent(event.id)}
            />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}

function VFXEventInstance({ event, onComplete }: { event: { type: string }, onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const isSurge = event.type === 'SURGE';
  const elements = isSurge ? SURGE_ELEMENTS : CASCADE_ELEMENTS;

  const [particles] = useState(() =>
    [...Array(15)].map(() => ({
      char: elements[Math.floor(Math.random() * elements.length)],
      startX: Math.random() * 100,
      duration: 1.5 + Math.random() * 1.5,
      delay: Math.random() * 0.5,
      rotate: Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1)
    }))
  );

  return (
    <>
      {particles.map((p, i) => (
        <VFXParticle
          key={i}
          char={p.char}
          isSurge={isSurge}
          startX={p.startX}
          duration={p.duration}
          delay={p.delay}
          rotate={p.rotate}
        />
      ))}
    </>
  );
}

function VFXParticle({ char, isSurge, startX, duration, delay, rotate }: {
  char: string,
  isSurge: boolean,
  startX: number,
  duration: number,
  delay: number,
  rotate: number
}) {
  const isToxic = char === 'TOXIC';

  return (
    <motion.div
      initial={{
        opacity: 0,
        x: `${startX}vw`,
        y: isSurge ? '110vh' : '-10vh',
        scale: isToxic ? 0.3 : 0.5,
        rotate: 0
      }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: isSurge ? '-10vh' : '110vh',
        scale: isToxic ? [0.3, 1, 1, 0.3] : [0.5, 1.5, 1.5, 0.5],
        rotate: rotate
      }}
      transition={{
        duration,
        delay,
        ease: isSurge ? "easeOut" : "easeIn"
      }}
      className={`absolute select-none ${isToxic ? 'text-red-600 font-black text-2xl' : 'text-4xl'}`}
    >
      {char}
    </motion.div>
  );
}
