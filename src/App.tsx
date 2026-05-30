import { useGameStore } from './store/gameStore';

function App() {
  const tier = useGameStore((state) => state.pl.tier);
  const bag = useGameStore((state) => state.pl.bag);
  const phase = useGameStore((state) => state.ph);
  const adv = useGameStore((state) => state.adv);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-green-400">BAG CHASER REBUILD</h1>

      <div className="bg-slate-800 p-6 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <span className="text-slate-400 uppercase tracking-widest text-xs font-bold">Phase</span>
            <span className="font-mono text-blue-400">{phase}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <span className="text-slate-400 uppercase tracking-widest text-xs font-bold">Current Tier</span>
            <span className="text-2xl font-black">{tier}</span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-700 pb-2">
            <span className="text-slate-400 uppercase tracking-widest text-xs font-bold">Bag</span>
            <span className="text-2xl font-black text-green-500">${bag.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => adv(1)}
          className="w-full mt-8 bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-all active:scale-95 shadow-lg shadow-green-900/20"
        >
          ADVANCE TIME (1 MO)
        </button>
      </div>

      <p className="mt-8 text-slate-500 text-sm">
        Vite + React + TypeScript + Zustand + Tailwind
      </p>
    </div>
  );
}

export default App;
