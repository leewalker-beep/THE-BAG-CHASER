import React, { useState } from 'react';
import { useGame } from '../../GameEngine.jsx';
import { styles } from '../../styles.js';

export const GameIntro = () => {
  const { setPh } = useGame();
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-hack">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="max-w-md w-full bg-slate-900 border-2 border-blue-500 rounded-3xl p-8 shadow-[0_0_50px_rgba(59,130,246,0.3)]">
        {page === 1 ? (
          <>
            <h2 className="text-3xl font-black text-blue-400 mb-8 uppercase tracking-widest font-hype">THE BRIEFING: PAGE 1</h2>
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">1. THE STREET TRINITY</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  <span className="text-green-400 font-bold">CASH</span> buys assets, <span className="text-red-400 font-bold">CLOUT</span> unlocks tiers, <span className="text-yellow-400 font-bold">AURA</span> scales passive multipliers. Balance all three to escape the Mud.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">2. THE TICKING CLOCK</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  You start at Age 18. Every cycle advances months. You are racing against time to build an empire before you age out.
                </p>
              </div>
            </div>
            <button onClick={() => setPage(2)} className="w-full mt-12 py-4 bg-blue-600 text-white font-black tracking-widest rounded-xl hover:bg-blue-500 transition-all active:scale-95 duration-100">NEXT PAGE →</button>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-black text-blue-400 mb-8 uppercase tracking-widest font-hype">THE BRIEFING: PAGE 2</h2>
            <div className="space-y-8 text-left">
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">3. MENTAL CAPITAL & REHAB</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  Active hustle clicks drain your neon-violet <span className="text-purple-400 font-bold">Mental Health</span> bar. Passive months restore +15. Hitting 0 triggers a complete Nervous Breakdown, forcing a 1-month rehab stay and a $300 fee.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">4. THE MACRO SHADOW</h3>
                <p className="text-slate-300 drop-shadow-sm text-sm leading-relaxed">
                  Watch the Real World Monitor. States like Normal, Boom, or Crackdown shift your risks. Advanced tiers introduce 'Heat' where reckless operations invite regulatory raids.
                </p>
              </div>
            </div>
            <button onClick={() => setPh('PLAYING')} className="w-full mt-12 py-4 bg-green-600 text-black font-black tracking-widest rounded-xl hover:bg-green-500 transition-all active:scale-95 duration-100 shadow-[0_0_20px_rgba(34,197,94,0.4)]">BEGIN HUSTLE</button>
          </>
        )}
      </div>
    </div>
  );
};
