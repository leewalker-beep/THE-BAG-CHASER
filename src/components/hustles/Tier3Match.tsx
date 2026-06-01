import { useState } from 'react';
import { useJuiceStore } from '../../store/juiceStore';

export function RealEstateMatch({ onResult }: { onResult: (success: boolean) => void }) {
  const [val, setVal] = useState(50);
  const { triggerSurge, triggerCascade } = useJuiceStore();

  const handleClose = () => {
    const success = val > 75;
    if (success) triggerSurge(); else triggerCascade();
    onResult(success);
  };

  return (
    <div className="p-8 bg-slate-900 border-2 border-indigo-500/30 rounded-3xl text-center shadow-2xl">
      <h3 className="text-xl font-black uppercase text-indigo-400 mb-6 italic tracking-tighter">🏙️ REAL ESTATE WHOLESALING</h3>

      <div className="relative h-64 w-full bg-slate-950 rounded-xl mb-8 overflow-hidden flex items-end justify-center border border-slate-800">
        <div
          className="w-20 bg-indigo-500 transition-all duration-300 shadow-[0_0_30px_rgba(99,102,241,0.5)]"
          style={{ height: `${val}%` }}
        />
        <div className="absolute top-1/4 w-full border-t-2 border-dashed border-emerald-500/50" />
        <div className="absolute top-[10%] w-full text-[10px] font-black text-emerald-500 uppercase">PROFIT ZONE</div>
      </div>

      <div className="mb-8">
        <label className="text-[10px] font-black text-slate-500 uppercase block mb-4 tracking-[0.2em]">AGREEMENT LEVERAGE: {val}%</label>
        <input
          type="range" min="0" max="100"
          value={val} onChange={(e) => setVal(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
      </div>

      <button
        onClick={handleClose}
        className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl uppercase tracking-widest transition-all shadow-xl shadow-indigo-900/40 active:scale-95"
      >
        CLOSE THE SYNDICATE
      </button>
    </div>
  );
}
