import React, { useState, useEffect } from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';

export const Leaderboard = () => {
  const { pl, alias, artCollection, guttedFirms, isPresident, performHardReset } = useGame();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Global Scoreboard Architecture: Fetch and display Top 20
  useEffect(() => {
    const loadGlobalScores = async () => {
      try {
        // Simulate real-world database fetch latency
        await new Promise(r => setTimeout(r, 1200));
        setScores([
          { name: "ELON_GATED", worth: 520000000000, title: "MARS ARCHITECT", age: "48Y 2M", clout: 9999, aura: 8500 },
          { name: "ZUCK_META", worth: 180000000000, title: "PANOPTICON KING", age: "39Y 11M", clout: 8200, aura: -1200 },
          { name: "BERNARD_A", worth: 155000000000, title: "LUXURY MONARCH", age: "74Y 5M", clout: 7500, aura: 9200 },
          { name: "DR_DOOM", worth: 45000000000, title: "HEDGE FUND TITAN", age: "55Y 0M", clout: 4500, aura: 500 },
          { name: "NANCY_P", worth: 1200000000, title: "POLICY INSIDER", age: "83Y 1M", clout: 9500, aura: 2500 },
        ]);
      } catch (e) {
        console.error("Scoreboard fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    loadGlobalScores();
  }, []);

  const getHustleTitle = () => {
    if (isPresident) return "PRESIDENT";
    if (artCollection?.length >= 75) return "MUSEUM TYCOON";
    if (guttedFirms >= 5) return "CORP RAIDER";
    if (pl.bag >= 1000000000) return "BILLIONAIRE";
    return "HUSTLER";
  };

  const currentPlayer = {
    name: alias || "ANONYMOUS",
    worth: pl.bag,
    title: getHustleTitle(),
    age: `${(pl.age || 18) - 18}Y ${pl.month || 0}M`,
    clout: pl.clout || 0,
    aura: pl.aura || 0,
    rank: pl.bag > 1000000000000 ? 1 : 314 // Mocked rank calculation
  };

  // IF current player's score falls outside Top 20 (mocked list is 5 for brevity, but logic applies)
  const isOutsideTop = currentPlayer.rank > scores.length;

  return (
    <div className="min-h-screen bg-[#05050a] text-white font-hack flex flex-col items-center p-6 animate-fadeIn pb-32">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-[10px] text-yellow-500 font-black tracking-[0.5em] uppercase mb-4">Permanent Archives</h2>
          <h1 className="text-5xl font-black tracking-widest font-hype uppercase italic drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
            Hall of Fame
          </h1>
          <div className="h-1 w-24 bg-yellow-600 mx-auto mt-4" />
        </div>

        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/60 text-[10px] text-slate-500 font-bold uppercase tracking-widest border-b border-slate-800">
                <th className="p-4">Rank</th>
                <th className="p-4">Player</th>
                <th className="p-4">Title</th>
                <th className="p-4 text-right">Net Worth</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-12 text-center text-blue-500 animate-pulse font-black uppercase tracking-widest">
                    Synchronizing with Global Datastream...
                  </td>
                </tr>
              ) : (
                <>
                  {scores.map((p, i) => (
                    <tr key={i} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors">
                      <td className="p-4 font-black text-slate-400">#{i + 1}</td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-black text-white">{p.name}</span>
                          <span className="text-[8px] text-slate-500 uppercase">{p.age}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-800 rounded text-[9px] font-black text-slate-300">{p.title}</span>
                      </td>
                      <td className="p-4 text-right font-black text-emerald-400 font-tech">${fMny(p.worth)}</td>
                    </tr>
                  ))}

                  {/* GHOST ROW LOGIC: Stylistic break IF outside top */}
                  {isOutsideTop && (
                    <tr className="bg-black/20">
                      <td colSpan="4" className="p-4 text-center text-slate-700 tracking-[1em] font-black italic">
                        ... DISCONTINUITY DETECTED ...
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ghost Row Logic: Sticky Personal Capsule IF outside top */}
      {isOutsideTop && !loading && (
      <div className="fixed bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
        <div className="max-w-2xl mx-auto bg-blue-900/20 border-2 border-blue-500/50 rounded-2xl p-4 flex items-center justify-between backdrop-blur-xl shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black text-blue-400">#{currentPlayer.rank}</div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-white uppercase tracking-wider">{currentPlayer.name} <span className="text-[9px] text-blue-400 ml-1">[{currentPlayer.title}]</span></span>
              <div className="flex gap-2 text-[8px] font-bold text-slate-500">
                <span>{currentPlayer.age}</span>
                <span>•</span>
                <span>{currentPlayer.clout}C / {currentPlayer.aura}A</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-xl font-black text-emerald-400 font-tech">${fMny(currentPlayer.worth)}</div>
            <button
              onClick={performHardReset}
              className="bg-white text-black font-black text-[10px] px-4 py-2 rounded-lg hover:bg-blue-400 transition-all active:scale-95 uppercase tracking-widest"
            >
              Restart Cycle
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Global Action: Reset only available after viewing legacy */}
      <div className="fixed bottom-8 right-8">
        <button
          onClick={performHardReset}
          className="bg-white text-black font-black text-xs px-6 py-4 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl uppercase tracking-widest active:scale-95"
        >
          Hard Reset System
        </button>
      </div>
    </div>
  );
};
