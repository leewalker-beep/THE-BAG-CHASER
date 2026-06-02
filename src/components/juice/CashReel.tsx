import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';

interface CashReelProps {
  value: number;
}

const COLORS = {
  COPPER: '#B87333',
  NEON_MINT: '#39FF14',
  ICE_CYAN: '#00F3FF',
  LIQUID_GOLD: '#FFD700',
  PRISMATIC_START: '#FFFFFF',
};

const getNetWorthStyle = (val: number) => {
  if (val < 10000) {
    return { color: COLORS.COPPER, textShadow: 'none' };
  } else if (val < 100000) {
    return { color: COLORS.NEON_MINT, textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' };
  } else if (val < 1000000) {
    return { color: COLORS.ICE_CYAN, textShadow: '0 0 15px rgba(0, 243, 255, 0.6)' };
  } else if (val < 10000000) {
    return {
      background: 'linear-gradient(to bottom, #FFD700, #FDB931)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block'
    };
  } else {
    return {
      background: 'linear-gradient(45deg, #FFFFFF, #FF00FF, #8A2BE2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      display: 'inline-block',
      animation: 'prismatic 3s linear infinite'
    };
  }
};

const formatValue = (val: number) => {
  if (val >= 1000000000) return { num: (val / 1000000000).toFixed(1), suffix: 'B' };
  if (val >= 1000000) return { num: (val / 1000000).toFixed(1), suffix: 'M' };
  if (val >= 10000) return { num: (val / 1000).toFixed(1), suffix: 'K' };
  return { num: val.toString(), suffix: '' };
};

export function CashReel({ value }: CashReelProps) {
  const { num, suffix } = formatValue(value);

  // Use motion values for smooth color lerping
  const colorValue = useMotionValue(value);
  const color = useTransform(
    colorValue,
    [0, 10000, 100000, 1000000, 10000000],
    [COLORS.COPPER, COLORS.NEON_MINT, COLORS.ICE_CYAN, COLORS.LIQUID_GOLD, COLORS.PRISMATIC_START]
  );

  useEffect(() => {
    animate(colorValue, value, { duration: 1 });
  }, [value, colorValue]);

  const style = getNetWorthStyle(value);
  // Merge lerped color into style if not in gradient/prismatic territory
  const lerpStyle = value < 1000000 ? { ...style, color } : style;

  return (
    <div className="flex items-center">
      <style>{`
        @keyframes prismatic {
          0% { filter: hue-rotate(0deg); }
          100% { filter: hue-rotate(360deg); }
        }
      `}</style>
      <motion.span className="mr-1" style={lerpStyle as any}>$</motion.span>
      <div className="flex overflow-hidden h-[1em] leading-none">
        {num.split('').map((char, i) => (
          <Digit key={`${i}-${num.length}`} char={char} style={lerpStyle} />
        ))}
      </div>
      {suffix && (
        <span className="ml-0.5 text-[#FF007F] drop-shadow-[0_0_8px_#FF007F]">
          {suffix}
        </span>
      )}
    </div>
  );
}

function Digit({ char, style }: { char: string, style: any }) {
  if (isNaN(parseInt(char))) {
    return <motion.span style={style} className="px-[1px]">{char}</motion.span>;
  }

  return (
    <div className="relative w-[0.6em] h-[1em] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={char}
          initial={{ y: '-100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          style={style}
          className="absolute inset-0 flex justify-center"
        >
          {char}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
