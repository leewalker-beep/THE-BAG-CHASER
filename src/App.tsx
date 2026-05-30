import { useGameStore } from './store/gameStore';
import { getInitialGameState } from './store/initialState';

function App() {
  const state = useGameStore();
  const { pl, ph, diff, unlockedHustles, marketType, fatalCause, news } = state;
  const { bag, aura, clout, mentalHealth, mo, hustleFatigue, plasmaUsedThisMonth } = pl;

  const resetGame = (d: 1 | 2 | 3) => {
    const initialState = getInitialGameState(d);
    useGameStore.setState(initialState);
  };

  if (ph === 'POST_MORTEM') {
    return (
      <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-black mb-4">GAME OVER</h1>
        <p className="text-2xl mb-8 font-mono">{fatalCause}</p>
        <div className="space-y-4">
          <button onClick={() => resetGame(3)} className="block w-64 bg-red-900 hover:bg-red-800 text-white font-bold py-3 rounded">RESTART AS GRINDER</button>
          <button onClick={() => resetGame(2)} className="block w-64 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded">RESTART AS MIDDLE</button>
          <button onClick={() => resetGame(1)} className="block w-64 bg-yellow-900 hover:bg-yellow-800 text-white font-bold py-3 rounded">RESTART AS TRUST FUND</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Sidebar: Stats */}
        <div className="space-y-6 bg-slate-800 p-6 rounded-xl border border-slate-700">
          <h2 className="text-xl font-bold border-b border-slate-700 pb-2">PLAYER STATUS</h2>
          <div className="space-y-2">
            <div className="flex justify-between"><span>Difficulty:</span> <span className="font-mono">{diff === 1 ? 'Trust Fund' : diff === 2 ? 'Middle Grind' : 'Grinder'}</span></div>
            <div className="flex justify-between text-2xl font-black text-green-400"><span>Bag:</span> <span>${bag.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Aura:</span> <span className={aura <= 10 ? 'text-red-500' : ''}>{aura}</span></div>
            <div className="flex justify-between"><span>Clout:</span> <span className={clout <= 10 ? 'text-red-500' : ''}>{clout}</span></div>
            <div className="flex justify-between"><span>Sanity:</span> <span className={mentalHealth <= 25 ? 'text-red-500' : ''}>{mentalHealth}%</span></div>
            <div className="flex justify-between"><span>Month:</span> <span>{mo}</span></div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <div className="text-xs uppercase text-slate-500 font-bold mb-2">Market Condition</div>
              <div className="text-blue-400 font-bold">{marketType}</div>
            </div>
          </div>

          <button onClick={() => state.adv(1)} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded font-bold transition-all">ADVANCE MONTH</button>
        </div>

        {/* Main: Hustles */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-black">ACTIVE HUSTLES</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {unlockedHustles.labor && (
              <button onClick={state.rLabor} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all text-left">
                <div className="font-bold text-lg">Manual Labor</div>
                <div className="text-green-400">+$50 / Click</div>
                <div className="text-xs text-slate-400">Fatigue: {hustleFatigue.labor}</div>
              </button>
            )}

            {unlockedHustles.delivery && (
              <button onClick={state.rDelivery} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all text-left">
                <div className="font-bold text-lg">Delivery Gig</div>
                <div className="text-green-400">+$25-45 / Click</div>
                <div className="text-xs text-slate-400">Fatigue: {hustleFatigue.delivery}</div>
              </button>
            )}

            {unlockedHustles.survey && (
              <button onClick={state.rSurvey} className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:bg-slate-700 transition-all text-left">
                <div className="font-bold text-lg">Online Surveys</div>
                <div className="text-green-400">+$5 / Click</div>
                <div className="text-xs text-slate-400 font-mono">SAFE ACTION</div>
              </button>
            )}

            {unlockedHustles.plasma && (
              <button
                onClick={state.rPlasma}
                disabled={plasmaUsedThisMonth}
                className={`p-4 rounded-lg border text-left transition-all ${plasmaUsedThisMonth ? 'bg-slate-900 border-slate-800 opacity-50 cursor-not-allowed' : 'bg-red-900/20 border-red-900/50 hover:bg-red-900/30'}`}
              >
                <div className="font-bold text-lg text-red-400">Sell Plasma</div>
                <div className="text-green-400">+$300 (Once/Mo)</div>
                <div className="text-xs text-red-500">-25 Mental, -15 Aura</div>
              </button>
            )}

            {Object.entries(unlockedHustles).map(([id, unlocked]) => {
              if (unlocked && !['labor', 'delivery', 'survey', 'plasma'].includes(id)) {
                return (
                  <div key={id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 italic text-slate-500">
                    Advanced Hustle: {id} (Phase 3)
                  </div>
                );
              }
              return null;
            })}
          </div>

          <div className="mt-8 bg-black/50 p-4 rounded border border-slate-800 max-h-48 overflow-y-auto font-mono text-sm">
             <div className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-widest">Global News</div>
             {news.map((msg, i) => <div key={i} className="mb-1 text-slate-300">&gt; {msg}</div>)}
             {news.length === 0 && <div className="text-slate-600 italic">No news yet...</div>}
          </div>
        </div>
      </div>

      <div className="mt-12 flex gap-4 justify-center">
        <button onClick={() => resetGame(1)} className="text-xs text-slate-500 hover:text-white uppercase font-bold">Cheat: Trust Fund</button>
        <button onClick={() => resetGame(3)} className="text-xs text-slate-500 hover:text-white uppercase font-bold">Cheat: Reset Grinder</button>
      </div>
    </div>
  );
}

export default App;
