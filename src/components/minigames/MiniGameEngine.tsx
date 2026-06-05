import { motion } from 'framer-motion';
import { TapMine } from './TapMine';
import { ChartMatch } from './ChartMatch';
import { TicTacToe } from './TicTacToe';

interface MiniGameEngineProps {
  type: 'chart_match' | 'tap_mine' | 'tic_tac_toe';
  onResult: (multiplier: number) => void;
}

export function MiniGameEngine({ type, onResult }: MiniGameEngineProps) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-slate-950 border-2 border-slate-800 rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {type === 'tap_mine' && <TapMine onComplete={onResult} />}
        {type === 'chart_match' && <ChartMatch onComplete={onResult} />}
        {type === 'tic_tac_toe' && <TicTacToe onComplete={onResult} />}

        <div className="p-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      </motion.div>
    </div>
  );
}
