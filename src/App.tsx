import { useGameStore } from './store/gameStore';
import { getInitialGameState } from './store/initialState';
import type { GameState } from './store/types';

function App() {
  const state = useGameStore();
  const { pl, ph, unlockedHustles, marketType, fatalCause, news } = state;
  const {
    bag, aura, clout, mentalHealth, mo, plasmaUsedThisMonth,
    techInventory, vintageInventoryValue, runnerCount, runnerBurnout,
    clientCount, clientCrisis, swCooldownTurns, tier
  } = pl;

  const resetGame = (d: 1 | 2 | 3) => {
    const initialState = getInitialGameState(d);
    // Explicitly set ph to PLAYING when starting a new game
    useGameStore.setState({ ...(initialState as GameState), ph: 'PLAYING' });
  };

  const formatGameTime = (months: number) => {
    const years = Math.floor(months / 12);
    const m = months % 12;
    return `Year ${years + 1}, Month ${m + 1}`;
  };

  if (ph === 'PROLOGUE_INTRO') {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-black mb-8 tracking-tighter italic">BAG CHASER</h1>
        <p className="text-xl mb-12 text-slate-400 max-w-lg">Escape the mud. Build the empire. Don't lose your soul in the process.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          <button onClick={() => resetGame(1)} className="group bg-slate-900 border-2 border-yellow-600/50 p-8 rounded-2xl hover:bg-yellow-600/10 transition-all text-left">
            <h3 className="text-yellow-500 font-bold text-xl mb-2">Trust Fund</h3>
            <p className="text-sm text-slate-400">Start with $25k and all 10 hustles unlocked. The fast track.</p>
          </button>
          <button onClick={() => resetGame(2)} className="group bg-slate-900 border-2 border-slate-700 p-8 rounded-2xl hover:bg-slate-700 transition-all text-left">
            <h3 className="text-slate-200 font-bold text-xl mb-2">Middle Grind</h3>
            <p className="text-sm text-slate-400">Start with $5k and 6 hustles unlocked. A fair fight.</p>
          </button>
          <button onClick={() => resetGame(3)} className="group bg-slate-900 border-2 border-red-900/50 p-8 rounded-2xl hover:bg-red-900/10 transition-all text-left">
            <h3 className="text-red-500 font-bold text-xl mb-2">Grinder</h3>
            <p className="text-sm text-slate-400">Start with $1k and 4 manual grinds. Out of the mud.</p>
          </button>
        </div>
      </div>
    );
  }

  if (ph === 'POST_MORTEM') {
    return (
      <div className="min-h-screen bg-black text-red-500 flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-6xl font-black mb-4">GAME OVER</h1>
        <p className="text-2xl mb-8 font-mono">{fatalCause}</p>
        <div className="space-y-4">
           <button onClick={() => state.setPh('PROLOGUE_INTRO')} className="block w-64 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded">BACK TO START</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Master Stats HUD */}
      <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 p-4 shadow-2xl">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
             <div>
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Bankroll</div>
                <div className="text-2xl font-black text-green-400 leading-none">${bag.toLocaleString()}</div>
             </div>
             <div className="w-32">
                <div className="flex justify-between text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">
                   <span>Sanity</span>
                   <span>{mentalHealth}%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                   <div className="h-full bg-red-500 transition-all" style={{ width: `${mentalHealth}%` }}></div>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-8">
             <div className="text-center">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Clout</div>
                <div className="text-xl font-bold">{clout}</div>
             </div>
             <div className="text-center">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Aura</div>
                <div className="text-xl font-bold">{aura}</div>
             </div>
             <div className="text-center border-l border-slate-800 pl-8">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Market</div>
                <div className="text-sm font-bold text-blue-400">{marketType}</div>
             </div>
             <div className="text-right border-l border-slate-800 pl-8">
                <div className="text-[10px] uppercase text-slate-500 font-bold tracking-widest">Time</div>
                <div className="text-sm font-mono font-bold text-slate-300">{formatGameTime(mo)}</div>
             </div>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:col-span-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-black flex items-center gap-3">
               ACTIVE HUSTLES
               <span className="text-xs font-mono bg-slate-800 px-2 py-1 rounded text-slate-500 uppercase tracking-tighter">1 Click = 1 Month</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {unlockedHustles.labor && (
                <button onClick={state.rLabor} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-all text-left relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="font-bold text-lg mb-1">Manual Labor</div>
                    <div className="text-green-400 font-bold">+$750</div>
                    <div className="text-xs text-slate-500 mt-2 italic">Rent is -$500. Net: +$250</div>
                    <div className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">Fatigue: +40</div>
                  </div>
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03c2.09-.13 3.75-1.85 3.75-3.97V2h-2v7zm10-7l-1 12h-3l-1-12h-2l1.5 18h4l1.5-18h-2z"/></svg>
                  </div>
                </button>
              )}

              {unlockedHustles.delivery && (
                <button onClick={state.rDelivery} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-all text-left relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="font-bold text-lg mb-1">Delivery Gig</div>
                    <div className="text-green-400 font-bold">+$600 - $700</div>
                    <div className="text-xs text-slate-500 mt-2 italic">Randomized yield. Rent deduction applies.</div>
                    <div className="text-[10px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">Fatigue: +25</div>
                  </div>
                </button>
              )}

              {unlockedHustles.survey && (
                <button onClick={state.rSurvey} className="bg-slate-900 p-6 rounded-xl border border-slate-800 hover:border-slate-600 transition-all text-left">
                  <div className="font-bold text-lg mb-1">Online Surveys</div>
                  <div className="text-green-400 font-bold">+$520</div>
                  <div className="text-xs text-slate-500 mt-2 italic">Slow, safe, zero fatigue. Net +$20 after rent.</div>
                </button>
              )}

              {unlockedHustles.plasma && (
                <button
                  onClick={state.rPlasma}
                  disabled={plasmaUsedThisMonth}
                  className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden ${plasmaUsedThisMonth ? 'bg-black/50 border-slate-900 opacity-50 cursor-not-allowed' : 'bg-red-950/20 border-red-900/50 hover:border-red-500'}`}
                >
                  <div className="font-bold text-lg text-red-400 mb-1">Sell Plasma</div>
                  <div className="text-green-400 font-bold">+$900</div>
                  <div className="text-xs text-red-500 mt-2 italic">-25 Mental, -15 Aura</div>
                  {plasmaUsedThisMonth && <div className="absolute inset-0 flex items-center justify-center bg-black/40 font-black text-xs tracking-widest text-red-500 rotate-12">COOLDOWN</div>}
                </button>
              )}

              {unlockedHustles.techFlip && (
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="font-bold text-lg">Tech Flip Processor</div>
                  <div className="flex gap-2 text-xs">
                    <div className="bg-black/50 px-3 py-2 rounded-lg flex-1 border border-slate-800">Raw: <span className="text-blue-400 font-bold">{techInventory.raw}</span></div>
                    <div className="bg-black/50 px-3 py-2 rounded-lg flex-1 border border-slate-800">Refined: <span className="text-green-400 font-bold">{techInventory.refined}</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={state.sourceTechPallet} className="text-xs bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/50 p-2 rounded-lg font-bold">Source Pallet ($100)</button>
                    <button onClick={state.repairTech} disabled={techInventory.raw <= 0} className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 rounded-lg disabled:opacity-30">Repair Tech (+15 Fatg)</button>
                    <button onClick={state.sellTech} disabled={techInventory.refined <= 0} className="text-xs bg-green-600/20 hover:bg-green-600/40 border border-green-600/50 p-2 rounded-lg font-bold disabled:opacity-30">Sell Refined (+$350)</button>
                  </div>
                </div>
              )}

              {unlockedHustles.vintage && (
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 space-y-4">
                  <div className="font-bold text-lg">Vintage Stock</div>
                  <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Inventory Value</div>
                    <div className="text-xl font-bold text-blue-400">${vintageInventoryValue.toLocaleString()}</div>
                  </div>
                  <button onClick={state.buyVintageStock} className="w-full text-xs bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/50 p-3 rounded-lg font-bold">Buy Stock ($150)</button>
                  <p className="text-[10px] text-slate-500 italic text-center">Monthly 15% liquidation @ 1.4x profit</p>
                </div>
              )}

              {unlockedHustles.gig && (
                <div className={`bg-slate-900 p-6 rounded-xl border space-y-4 ${runnerBurnout ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}>
                  <div className="font-bold text-lg flex justify-between items-center">
                    Gig Fleet
                    {runnerBurnout && <span className="bg-red-500 text-[10px] px-2 py-0.5 rounded text-white animate-pulse">BURNOUT</span>}
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Runner Count</div>
                    <div className="text-xl font-bold text-slate-200">{runnerCount} <span className="text-xs text-slate-500 font-normal">($150/ea monthly)</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={state.recruitRunner} className="text-xs bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/50 p-2 rounded-lg font-bold">Recruit ($500, 5 Clout)</button>
                    {runnerBurnout && <button onClick={state.payRunnerBonus} className="text-xs bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 p-2 rounded-lg font-bold">Clear Burnout ($200)</button>}
                  </div>
                </div>
              )}

              {unlockedHustles.smm && (
                <div className={`bg-slate-900 p-6 rounded-xl border space-y-4 ${clientCrisis ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}>
                  <div className="font-bold text-lg flex justify-between items-center">
                    SMM Agency
                    {clientCrisis && <span className="bg-red-500 text-[10px] px-2 py-0.5 rounded text-white animate-pulse">CRISIS</span>}
                  </div>
                  <div className="bg-black/50 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Clients</div>
                    <div className="text-xl font-bold text-slate-200">{clientCount} <span className="text-xs text-slate-500 font-normal">($300/ea monthly)</span></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={state.signSmmClient} className="text-xs bg-blue-600/20 hover:bg-blue-600/40 border border-blue-600/50 p-2 rounded-lg font-bold">Sign Client (10 Clout)</button>
                    {clientCrisis && <button onClick={state.resolveClientCrisis} className="text-xs bg-red-600/20 hover:bg-red-600/40 border border-red-600/50 p-2 rounded-lg font-bold text-white">Resolve Crisis (5 Clout)</button>}
                  </div>
                </div>
              )}

              {unlockedHustles.sw && (
                <button
                  onClick={state.rSw}
                  disabled={swCooldownTurns > 0}
                  className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden ${swCooldownTurns > 0 ? 'bg-black/50 border-slate-900 opacity-50 cursor-not-allowed' : 'bg-purple-950/20 border-purple-900/50 hover:border-purple-500'}`}
                >
                  <div className="font-bold text-lg text-purple-400 mb-1">Streetwear Drop</div>
                  <div className="text-green-400 font-bold">Yield: High</div>
                  <div className="text-[10px] text-slate-500 mt-2 uppercase font-bold">Cash, Clout, Aura</div>
                  {swCooldownTurns > 0 && <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-black text-xs tracking-widest text-purple-500 rotate-12">WAIT {swCooldownTurns} MO</div>}
                </button>
              )}

              {unlockedHustles.drop && (
                <button
                  onClick={state.rDrop}
                  disabled={swCooldownTurns > 0}
                  className={`p-6 rounded-xl border text-left transition-all relative overflow-hidden ${swCooldownTurns > 0 ? 'bg-black/50 border-slate-900 opacity-50 cursor-not-allowed' : 'bg-indigo-950/20 border-indigo-900/50 hover:border-indigo-500'}`}
                >
                  <div className="font-bold text-lg text-indigo-400 mb-1">Flash Dropship</div>
                  <div className="text-green-400 font-bold">Yield: High</div>
                  <div className="text-[10px] text-slate-500 mt-2 uppercase font-bold">Viral Marketing</div>
                  {swCooldownTurns > 0 && <div className="absolute inset-0 flex items-center justify-center bg-black/60 font-black text-xs tracking-widest text-indigo-500 rotate-12">WAIT {swCooldownTurns} MO</div>}
                </button>
              )}
            </div>

            {tier === 0 && (
               <div className="mt-12 p-8 bg-gradient-to-br from-yellow-900/20 to-black border border-yellow-900/30 rounded-3xl flex flex-col items-center text-center space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black text-yellow-500 uppercase tracking-[0.2em]">Graduation</h3>
                    <p className="text-xs text-slate-500 font-bold">GET OUT OF THE BASEMENT</p>
                  </div>
                  <div className="flex gap-8 text-xs font-mono">
                    <div className="flex flex-col gap-1">
                       <span className="text-slate-500 uppercase">Cash</span>
                       <span className={bag >= 5000 ? 'text-green-400 font-bold' : 'text-red-400'}>${bag}/5k</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-slate-500 uppercase">Clout</span>
                       <span className={clout >= 20 ? 'text-green-400 font-bold' : 'text-red-400'}>{clout}/20</span>
                    </div>
                    <div className="flex flex-col gap-1">
                       <span className="text-slate-500 uppercase">Aura</span>
                       <span className={aura >= 20 ? 'text-green-400 font-bold' : 'text-red-400'}>{aura}/20</span>
                    </div>
                  </div>
                  <button
                    onClick={state.escapeTheMud}
                    disabled={bag < 5000 || clout < 20 || aura < 20}
                    className="px-12 py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-20 disabled:grayscale text-white font-black rounded-full transition-all shadow-xl shadow-yellow-600/20"
                  >
                    SIGN HQ LEASE ($3,000)
                  </button>
               </div>
            )}

            <div className="mt-12 bg-black/40 p-6 rounded-2xl border border-slate-900 max-h-64 overflow-y-auto font-mono text-sm shadow-inner">
               <div className="text-[10px] text-slate-600 mb-4 font-bold uppercase tracking-[0.3em] flex items-center gap-2">
                 <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                 System Newsfeed
               </div>
               <div className="space-y-2">
                 {news.map((msg, i) => (
                   <div key={i} className="flex gap-3 text-slate-400 group">
                     <span className="text-slate-700">[{news.length - i}]</span>
                     <span className="group-hover:text-slate-200 transition-colors">{msg}</span>
                   </div>
                 ))}
                 {news.length === 0 && <div className="text-slate-800 italic">No activity recorded...</div>}
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 mt-12 border-t border-slate-900 flex justify-center gap-8">
        <button onClick={() => state.setPh('PROLOGUE_INTRO')} className="text-[10px] text-slate-700 hover:text-slate-400 uppercase font-black tracking-widest transition-colors">Abort Run</button>
        <button onClick={() => resetGame(1)} className="text-[10px] text-slate-700 hover:text-yellow-600 uppercase font-black tracking-widest transition-colors">Cheat: Trust Fund</button>
      </footer>
    </div>
  );
}

export default App;
