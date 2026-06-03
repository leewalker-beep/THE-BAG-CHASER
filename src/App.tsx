import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { VFXManager } from './components/juice/VFXManager';
import { HeatDrizzle } from './components/juice/HeatDrizzle';
import { getInitialGameState } from './store/initialState';
import type { GameState, GameTab } from './store/types';
import { MASTER_HUSTLE_REGISTRY } from './engine/hustleRegistry';
import { SneakerDropMatch, PalletFlippingMatch } from './components/hustles/Tier1Match';
import { MemeCoinMatch, ViralStreamMatch } from './components/hustles/Tier2Match';
import { RealEstateMatch } from './components/hustles/Tier3Match';

const PROGRESSION_TIERS: GameTab[] = ['MUD', 'STREET', 'STARTUP', 'CORPORATE', 'ELITE', 'MOGUL'];
const NAV_TABS: GameTab[] = ['MUD', 'STREET', 'STARTUP', 'CORPORATE', 'FLEX1', 'ELITE'];

const TIER_REQUIREMENTS: Record<string, { cash: number, clout: number, aura: number, fee: number, description: string }> = {
  STREET: { cash: 5000, clout: 20, aura: 20, fee: 3000, description: "HQ Lease & Street Cred" },
  STARTUP: { cash: 15000, clout: 50, aura: 50, fee: 5000, description: "Startup Incorporation" },
  CORPORATE: { cash: 100000, clout: 100, aura: 100, fee: 25000, description: "Institutional Compliance" },
  ELITE: { cash: 5000000, clout: 200, aura: 200, fee: 1000000, description: "Sovereign Elite Syndicate" },
};

function App() {
  const state = useGameStore();

  const {
    pl, ph, fatalCause, news,
    activeTab, setActiveTab, activeHustleView, setActiveHustleView
  } = state;

  const [selectedLineageHustleId, setSelectedLineageHustleId] = useState<string | null>(null);
  const [displayedCash, setDisplayedCash] = useState(pl?.bag || 0);
  const [cashSplash, setCashSplash] = useState<{ text: string; isWin: boolean } | null>(null);
  const isAnimating = useRef(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [news]);

  useEffect(() => {
    if (!isAnimating.current && pl) {
      setDisplayedCash(pl.bag);
    }
  }, [pl?.bag]);

  const executeHustle = async (id: string, forceSuccess?: boolean) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === id);
    if (!config) {
      isAnimating.current = false;
      return;
    }

    // Phase 1: Cost Tick Down
    let upfrontCost = (id === 'audio' && pl.streetStats.studioOwned) ? 500 : config.upfrontCost;

    if (id === 'r_labor') {
      const { activeTab, propertyType, budget } = pl.laborPanel;
      if (activeTab === 2) {
        const baseCosts = { STUDIO: 50000, DUPLEX: 75000, LOFT: 100000 };
        const budgetMults = { ECONOMY: 1, PREMIUM: 1.2, LUXURY: 1.5 };
        upfrontCost = baseCosts[propertyType] * budgetMults[budget];
      } else if (activeTab === 3) {
        upfrontCost = 1500000;
      }
    }

    if (id === 'r_delivery') {
      const { activeTab, fleetType } = pl.deliveryPanel;
      if (activeTab === 2) {
        const fleetCosts = { 'E-BIKE': 15000, SPRINTER: 40000, FREIGHT: 85000 };
        upfrontCost = fleetCosts[fleetType];
      } else if (activeTab === 3) {
        upfrontCost = 2000000;
      }
    }

    const startCash = pl.bag;
    const floorCash = startCash - upfrontCost;

    if (upfrontCost > 0) {
      const steps = 20;
      const stepVal = upfrontCost / steps;
      for (let i = 1; i <= steps; i++) {
        setDisplayedCash(Math.floor(startCash - (stepVal * i)));
        await new Promise(r => setTimeout(r, 20));
      }
    }
    setDisplayedCash(floorCash);

    // Phase 2: Splash Impact
    await new Promise(r => setTimeout(r, 150));
    state.deductCostAndRollOutcome(id, forceSuccess);

    // Capture state immediately after dispatch
    const newState = useGameStore.getState();
    const finalCash = newState.pl.bag;
    const netPayout = finalCash - floorCash;

    if (netPayout > 0) {
      setCashSplash({ text: `+$${netPayout.toLocaleString()}`, isWin: true });
    } else {
      setCashSplash({ text: `-$${Math.abs(netPayout).toLocaleString()}`, isWin: false });
    }

    setTimeout(() => setCashSplash(null), 600);

    // Phase 3: Outcome Roll
    const steps = 30;
    const currentDisplayed = floorCash;
    const totalDelta = finalCash - currentDisplayed;
    const stepVal = totalDelta / steps;

    for (let i = 1; i <= steps; i++) {
      setDisplayedCash(Math.floor(currentDisplayed + (stepVal * i)));
      await new Promise(r => setTimeout(r, 15));
    }

    setDisplayedCash(finalCash);
    isAnimating.current = false;
  };

  const resetGame = (d: 1 | 2 | 3) => {
    const currentName = useGameStore.getState().pl?.name || "";
    const initialState = getInitialGameState(d);
    useGameStore.setState({
      ...(initialState as GameState),
      ph: 'PLAYING',
      pl: { ...initialState.pl, name: currentName }
    });
  };

  if (!pl || !pl.name || pl.name.trim() === "") {
    return (
      <div className="fixed inset-0 bg-[#020817] z-[9999] flex flex-col items-center justify-center p-6 text-center select-none">
        <div className="max-w-md w-full space-y-8">
          <div className="space-y-4 text-center">
            <div className="text-emerald-400 font-mono tracking-widest text-sm mb-4">System Auth Required</div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white">
              SYSTEM READY... INITIALIZING RUN. ENTER OPERATOR ALIAS:
            </h2>
          </div>
          <div className="space-y-6">
            <input
              type="text"
              autoFocus
              className="bg-slate-900 border border-slate-800 text-white placeholder-slate-600 rounded px-4 py-3 text-center text-lg font-mono focus:outline-none focus:border-emerald-500 w-full max-w-xs mb-4"
              placeholder="_____"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = e.currentTarget.value.trim().toUpperCase();
                  if (val) state.setPlayerName(val);
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input') as HTMLInputElement;
                const val = input.value.trim().toUpperCase();
                if (val) state.setPlayerName(val);
              }}
              className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/40"
            >
              ⚡ ACTIVATE SYSTEM
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    bag, aura, clout, mentalHealth, heat, mo, plasmaUsedThisMonth
  } = pl;

  const ageYears = 18 + Math.floor(mo / 12);
  const ageMonths = mo % 12;

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
    <div className="h-screen w-full flex flex-col bg-[#020817] text-white font-mono overflow-hidden select-none selection:bg-emerald-500">
      <VFXManager />

      <style>{`
        @keyframes molten-glow {
          0%, 100% { border-color: #f97316; box-shadow: 0 0 15px #f97316, inset 0 0 15px #f97316; }
          50% { border-color: #ef4444; box-shadow: 0 0 25px #ef4444, inset 0 0 25px #ef4444; }
        }
        .molten-streak-glow {
          animation: molten-glow 2s ease-in-out infinite;
          border-width: 3px !important;
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          14% { transform: scale(1.08); }
          28% { transform: scale(1); }
          42% { transform: scale(1.08); }
          70% { transform: scale(1); }
        }
        .animate-heartbeat { animation: heartbeat 0.8s infinite ease-in-out; }
      `}</style>

      <div className="w-full flex flex-col shrink-0 bg-slate-950 border-b border-slate-900">
        <div className="w-full flex justify-between items-center px-4 py-2 bg-slate-950 border-b border-slate-900 shrink-0">
          {/* LEFT COLUMN: THE OPERATOR ID FILE */}
          <div className="flex flex-col text-left font-mono text-[11px] leading-tight select-none">
            <span className="text-emerald-400 font-extrabold tracking-widest text-[12px] mb-0.5">RANK: {pl.currentTier}</span>
            <span className="text-slate-400">👤 OP: {pl.name || "LEE"}</span>
            <span className="text-slate-500 text-[10px]">⏳ AGE: {ageYears}y {ageMonths}m</span>
          </div>

          {/* RIGHT COLUMN: THE WEALTH TERMINAL */}
          <div className="flex flex-col text-right font-mono select-none">
            <span className="text-[9px] tracking-widest text-slate-500 uppercase font-bold scale-90 origin-right">LIQUID CAPITAL</span>
            <span className="text-2xl font-black text-emerald-400 tracking-tight font-mono -mt-0.5">
              ${displayedCash.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ROW 3: SUB-STATS GRID (COMPACT) */}
        <div className="w-full px-4 pb-2">
          <div className="grid grid-cols-4 gap-1.5 bg-[#020817]/80 p-2 rounded-lg border border-slate-900 text-center">
            {/* CLOUT */}
            <div className="flex flex-col items-center justify-center">
              <div className="text-[9px] text-slate-500 font-bold">CLT</div>
              <div className="flex items-center">
                <span className="text-sm font-black text-blue-400">{clout}</span>
                <svg className="w-6 h-3 inline-block ml-1" viewBox="0 0 24 10">
                  <path d="M0,8 Q6,4 12,7 T24,2" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>

            {/* MENTAL HEALTH */}
            <div className={`flex flex-col items-center justify-center transition-all ${mentalHealth <= 20 ? 'animate-heartbeat text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]' : ''}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">MNT</div>
              <div className="flex items-center">
                <span className={`${mentalHealth <= 20 ? 'text-base font-black tracking-tight text-rose-500 scale-105 animate-pulse' : 'text-sm font-black text-emerald-400'}`}>{mentalHealth}%</span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,5 L4,5 L6,2 L8,8 L10,5 L24,5" fill="none" stroke="currentColor" strokeWidth={mentalHealth <= 20 ? "2.5" : "1.5"} />
                </svg>
              </div>
            </div>

            {/* AURA */}
            <div className={`flex flex-col items-center justify-center transition-all ${aura <= 10 ? 'animate-heartbeat text-rose-500' : ''}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">AUR</div>
              <div className="flex items-center">
                <span className={`${aura <= 10 ? 'text-base font-black tracking-tight text-rose-500 scale-105' : 'text-sm font-black text-purple-400'}`}>{aura}</span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,7 C4,7 6,3 12,5 S20,3 24,7" fill="none" stroke={aura <= 10 ? "currentColor" : "#a855f7"} strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* HEAT */}
            <div className={`flex flex-col items-center justify-center transition-all ${heat >= 80 ? 'animate-heartbeat text-red-500 font-bold' : ''}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">HT</div>
              <div className="flex items-center">
                <span className={`${heat >= 80 ? 'text-base font-black tracking-tight text-red-500 animate-pulse' : 'text-sm font-black text-orange-400'}`}>{heat}%</span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,9 L8,9 L8,6 L16,6 L16,3 L24,3" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 4: FIXED HORIZONTAL SCROLL NAV TABS */}
        <div className="w-full flex flex-nowrap overflow-x-auto gap-2 px-4 py-2.5 bg-slate-950 border-t border-slate-900/40 scrollbar-none touch-pan-x">
          {NAV_TABS.map((tier) => {
            const isActive = activeTab === tier;
            const currentRankIdx = PROGRESSION_TIERS.indexOf(pl.currentTier);
            const tabRankIdx = PROGRESSION_TIERS.indexOf(tier as GameTab);

            // FLEX1 is a non-blocking sandbox, unlocked if CORPORATE (index 3) is reached
            const isFlex1 = tier === 'FLEX1';
            const isLocked = isFlex1
              ? currentRankIdx < 3
              : tabRankIdx > currentRankIdx + 1;

            return (
              <button
                key={tier}
                disabled={pl.crises.accountsFrozen || isLocked}
                onClick={() => {
                  setActiveTab(tier as GameTab);
                  setActiveHustleView(null);
                }}
                className={`px-4 py-1.5 rounded text-xs font-bold tracking-widest uppercase transition-all shrink-0 select-none ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 shadow shadow-emerald-500/10'
                    : isLocked
                      ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 active:scale-95'
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>
      </div>

      <HeatDrizzle heat={heat} />

      {/* CENTER IMPACT SPLASH */}
      {cashSplash && (
        <div className="fixed inset-0 pointer-events-none z-[999] flex items-center justify-center animate-[ping_0.4s_ease-out_1]">
          <span className={`text-4xl font-black font-mono tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.75)] transition-all duration-700 ease-in ${
            cashSplash.isWin ? 'text-emerald-400 scale-110' : 'text-rose-500 scale-100'
          }`}>
            {cashSplash.text}
          </span>
        </div>
      )}

      {/* GLOBAL ALERTS TRAY */}
      <div className="w-full flex flex-col gap-1 px-4 py-2 pointer-events-none">
        <AnimatePresence>
          {pl.crises.shadowbanTurns > 0 && (
            <AlertPill color="bg-red-600">⚠️ SHADOWBANNED ({pl.crises.shadowbanTurns}mo)</AlertPill>
          )}
          {pl.crises.accountsFrozen && (
            <AlertPill color="bg-red-900 border-2 border-white">🚫 ACCOUNTS FROZEN</AlertPill>
          )}
          {pl.crises.laborStrikeTurns > 0 && (
            <AlertPill color="bg-orange-600 animate-pulse">⚠️ LABOR STRIKE ({pl.crises.laborStrikeTurns}mo)</AlertPill>
          )}
        </AnimatePresence>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 pb-28 space-y-4 touch-pan-y max-w-4xl mx-auto w-full">
        {pl.crises.accountsFrozen && (
           <div className="mb-8 p-6 bg-red-900/20 border-2 border-red-600 rounded-2xl flex flex-col items-center gap-4 text-center">
              <div className="text-sm font-black text-white uppercase tracking-widest">Legal Crisis Detected</div>
              <p className="text-xs text-red-400 font-bold">Your corporate accounts are frozen. Operations and upgrades are halted.</p>
              <button
                onClick={() => state.unfreezeAccounts()}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded uppercase tracking-widest transition-all shadow-xl shadow-red-900/40"
              >
                Pay $5,000 Corporate Legal Retainer to Unfreeze Accounts
              </button>
           </div>
        )}

        {activeHustleView === null ? (
          (() => {
            if (activeTab === 'FLEX1') {
              return (
                <div className="mb-8 p-12 bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center text-center gap-6 opacity-60">
                  <div className="text-4xl opacity-40">⚙️</div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">FLEX ACQUISITIONS MARKET</h3>
                    <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest max-w-xs">DECK UNDER CONSTRUCTION (YACHTS / REAL ESTATE / LIQUIDITY TRADING)</p>
                  </div>
                </div>
              );
            }

            const currentRankIdx = PROGRESSION_TIERS.indexOf(state.pl.currentTier);
            const targetTabIdx = PROGRESSION_TIERS.indexOf(activeTab);

            if (targetTabIdx > currentRankIdx) {
              return (
                <div className="mb-8 p-8 bg-slate-900 border-2 border-slate-800 rounded-3xl backdrop-blur-sm flex flex-col items-center text-center gap-6 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-emerald-600/20 rounded-2xl flex items-center justify-center text-4xl shadow-inner border border-emerald-500/30">🏛️</div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2 italic">The Incorporation & Advancement Bureau</h2>
                    <p className="text-xs text-slate-400 font-bold max-w-md mx-auto uppercase tracking-widest leading-relaxed">Official registration and compliance checks are required to unlock {activeTab} operations. meet the milestones below to advance.</p>
                  </div>

                  <div className="w-full max-w-sm grid grid-cols-1 gap-3">
                    {TIER_REQUIREMENTS[activeTab] ? (
                      <GraduationCheck
                        reqs={TIER_REQUIREMENTS[activeTab]}
                        current={{ cash: bag, clout: clout, aura: aura }}
                        description={TIER_REQUIREMENTS[activeTab].description}
                        onUnlock={() => {
                          state.setCurrentTier(activeTab, TIER_REQUIREMENTS[activeTab].fee);
                          setActiveTab(activeTab);
                          setActiveHustleView(null);
                        }}
                        disabled={pl.crises.accountsFrozen}
                        unlockLabel={activeTab === 'ELITE' ? "⚡ Establish Sovereign Elite Syndicate (-$1,000,000)" : undefined}
                      />
                    ) : (
                      <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Requires {activeTab} Graduation</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            const currentTabHustles = MASTER_HUSTLE_REGISTRY.filter(hustle => hustle.tier === activeTab);
            return (
              <div className="grid grid-cols-2 gap-3 w-full">
                {currentTabHustles.map(hustle => (
                  <HustleCard
                    key={hustle.id}
                    title={hustle.name}
                    icon={hustle.icon}
                    disabled={hustle.id === 'r_plasma' && plasmaUsedThisMonth}
                    onClick={() => {
                      if (hustle.id === 'r_labor' || hustle.id === 'r_delivery') {
                        // Intercept default execution and open the newly built SubGamePanel lineage menu
                        setSelectedLineageHustleId(hustle.id);
                      } else {
                        executeHustle(hustle.id);
                      }
                    }}
                  />
                ))}
              </div>
            );
          })()
        ) : (
          <SubGamePanel
            hustleId={activeHustleView}
            onBack={() => setActiveHustleView(null)}
            state={state}
            onExecute={executeHustle}
          />
        )}


        <div className="mt-8 flex justify-center gap-6">
           <button onClick={() => state.setPh('PROLOGUE_INTRO')} className="text-[9px] text-slate-700 hover:text-slate-400 uppercase font-bold tracking-tighter transition-colors">Terminate Run</button>
        </div>
      </main>

      {/* STEP 2: THE FIXED BOTTOM ZONE (CONSOLE REGISTRY) */}
      <footer className="fixed bottom-0 left-0 right-0 h-12 bg-slate-950 border-t border-slate-800 p-2 overflow-hidden z-50 text-[11px] font-mono text-emerald-400">
        <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
          {news.slice(0, 2).map((msg, i) => (
            <div key={i} className="flex gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-slate-700 shrink-0">[{i+1}]</span>
              <span className={msg.startsWith('SYSTEM') ? 'text-blue-400 font-bold' : 'text-emerald-400'}>{msg}</span>
            </div>
          ))}
          {news.length === 0 && <div className="text-slate-800 italic">SYSTEM READY... STANDBY FOR INPUT...</div>}
        </div>
      </footer>

      {selectedLineageHustleId && (
        <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-md z-[100] flex flex-col p-6 font-mono text-white overflow-y-auto">
          <div className="flex justify-between items-center border-b border-slate-900 pb-3 mb-4 shrink-0">
            <h2 className="text-sm font-black tracking-widest text-emerald-400 uppercase">
              🚀 {selectedLineageHustleId === 'r_labor' ? 'MANUAL LABOR LINEAGE' : 'APP DELIVERY LOGISTICS'}
            </h2>
            <button
              onClick={() => setSelectedLineageHustleId(null)}
              className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs font-bold text-rose-400 active:scale-95 transition-all"
            >
              ✖ CLOSE
            </button>
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-1 gap-4">
              {[1, 2, 3].map((lvl) => {
                const currentRankIdx = PROGRESSION_TIERS.indexOf(pl.currentTier);
                const isLocked = (lvl === 2 && currentRankIdx < 1) || (lvl === 3 && currentRankIdx < 3);
                const label = selectedLineageHustleId === 'r_labor'
                  ? (lvl === 1 ? 'LVL 1: DAY LABOR' : lvl === 2 ? 'LVL 2: PROPERTY FLIPS' : 'LVL 3: COMMERCIAL SYNDICATE')
                  : (lvl === 1 ? 'LVL 1: COURIER SPRINT' : lvl === 2 ? 'LVL 2: FLEET DISPATCH' : 'LVL 3: 3PL AUTOMATED HUB');
                const reqLabel = lvl === 2 ? '[REQUIRES STREET]' : lvl === 3 ? '[REQUIRES CORPORATE]' : '';

                return (
                  <button
                    key={lvl}
                    disabled={isLocked}
                    onClick={() => {
                      if (selectedLineageHustleId === 'r_labor') {
                        state.setLaborInput('activeTab', lvl);
                      } else {
                        state.setDeliveryInput('activeTab', lvl);
                      }
                      executeHustle(selectedLineageHustleId);
                      setSelectedLineageHustleId(null);
                    }}
                    className={`p-6 rounded-xl border-2 text-left transition-all ${
                      isLocked
                        ? 'bg-slate-900/50 border-slate-800 text-slate-600 opacity-50 cursor-not-allowed'
                        : 'bg-slate-900 border-slate-800 hover:border-emerald-500/50 active:scale-95'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-black tracking-tighter">{label}</span>
                      {isLocked && <span className="text-[10px] text-rose-500 font-bold">{reqLabel}</span>}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 uppercase font-bold tracking-widest">
                      {isLocked ? 'Verification Required' : 'Authorize Mission Cycle'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function GraduationCheck({ reqs, current, description, onUnlock, disabled, unlockLabel }: {
  reqs: { cash: number, clout: number, aura: number, fee: number },
  current: { cash: number, clout: number, aura: number },
  description: string,
  onUnlock: () => void,
  disabled?: boolean,
  unlockLabel?: string
}) {
  const meetsCash = current.cash >= reqs.cash;
  const meetsClout = current.clout >= reqs.clout;
  const meetsAura = current.aura >= reqs.aura;
  const canUnlock = meetsCash && meetsClout && meetsAura && !disabled;

  const getProgressWidth = (curr: number, target: number) => {
    return `${Math.min(100, (curr / target) * 100)}%`;
  };

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col gap-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{description} Milestone</div>
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase font-bold">
          Verification Pending
        </div>
      </div>

      <div className="space-y-5">
         <div className="space-y-2">
            <div className="flex justify-between items-end">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Available Capital</span>
               <span className={`text-[11px] font-mono font-bold ${meetsCash ? 'text-emerald-400' : 'text-slate-500'}`}>${current.cash.toLocaleString()} / ${reqs.cash.toLocaleString()}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div
                 className={`h-full transition-all duration-1000 ease-out ${meetsCash ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}
                 style={{ width: getProgressWidth(current.cash, reqs.cash) }}
               />
            </div>
         </div>

         <div className="space-y-2">
            <div className="flex justify-between items-end">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Public Clout</span>
               <span className={`text-[11px] font-mono font-bold ${meetsClout ? 'text-blue-400' : 'text-slate-500'}`}>{current.clout} / {reqs.clout}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div
                 className={`h-full transition-all duration-1000 ease-out ${meetsClout ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-600'}`}
                 style={{ width: getProgressWidth(current.clout, reqs.clout) }}
               />
            </div>
         </div>

         <div className="space-y-2">
            <div className="flex justify-between items-end">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Social Aura</span>
               <span className={`text-[11px] font-mono font-bold ${meetsAura ? 'text-purple-400' : 'text-slate-500'}`}>{current.aura} / {reqs.aura}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
               <div
                 className={`h-full transition-all duration-1000 ease-out ${meetsAura ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' : 'bg-slate-600'}`}
                 style={{ width: getProgressWidth(current.aura, reqs.aura) }}
               />
            </div>
         </div>
      </div>

      <button
        onClick={onUnlock}
        disabled={!canUnlock}
        className={`w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all
          ${canUnlock
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-pulse'
            : 'bg-slate-800 text-slate-600 border border-slate-700 opacity-50 cursor-not-allowed'
          }`}
      >
        {canUnlock
          ? (unlockLabel || `⚡ File Incorporation Documents & Unlock Tier (-$${reqs.fee.toLocaleString()})`)
          : "Insufficient Verification Metrics"
        }
      </button>
    </div>
  );
}

function AlertPill({ children, color }: { children: React.ReactNode, color: string }) {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      className={`${color} px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase text-center shadow-lg border border-white/20`}
    >
      {children}
    </motion.div>
  );
}

interface HustleCardProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  icon: string;
  className?: string;
}

function HustleCard({ title, onClick, disabled, icon, className }: HustleCardProps) {
  const baseClass = "relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 text-center transition-all active:scale-[0.95] group";
  const colorClass = "hover:border-emerald-500/50";
  const disabledClass = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${colorClass} ${disabledClass} ${disabled ? 'opacity-40 grayscale' : ''} ${className || ''}`}
    >
      <div className={`relative z-10 flex flex-col items-center justify-center gap-3`}>
        <div className="text-4xl mb-1">{icon}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors leading-tight">{title}</div>
      </div>
    </button>
  );
}

function SubGamePanel({ hustleId, onBack, state, onExecute }: { hustleId: string, onBack: () => void, state: GameState, onExecute: (id: string, forceSuccess?: boolean) => Promise<void> }) {
  const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === hustleId);
  const currentLvl = state.pl.hustleLevels[hustleId] || 1;

  // INTERACTIVE MATCH LAYERS
  if (hustleId === 'drop') {
    return <SneakerDropMatch onResult={(s) => { onExecute('drop', s).then(() => onBack()); }} />;
  }
  if (hustleId === 'techFlip' || hustleId === 'tech_flip') {
    return <PalletFlippingMatch onResult={(s) => { onExecute(hustleId, s).then(() => onBack()); }} />;
  }
  if (hustleId === 'meme') {
    return <MemeCoinMatch onResult={(s) => { onExecute('meme', s).then(() => onBack()); }} />;
  }
  if (hustleId === 'cc') {
    return <ViralStreamMatch onResult={(s) => { onExecute('cc', s).then(() => onBack()); }} />;
  }
  if (hustleId === 'real_estate_empire') {
    return <RealEstateMatch onResult={(s) => { onExecute('real_estate_empire', s).then(() => onBack()); }} />;
  }

  if (hustleId === 'r_labor') {
    const { activeTab, weeks, propertyType, budget, action } = state.pl.laborPanel;
    const currentRankIdx = PROGRESSION_TIERS.indexOf(state.pl.currentTier);
    const canAfford = (tab: number) => {
      if (tab === 1) return true;
      if (tab === 2) {
        const baseCosts = { STUDIO: 50000, DUPLEX: 75000, LOFT: 100000 };
        const budgetMults = { ECONOMY: 1, PREMIUM: 1.2, LUXURY: 1.5 };
        return state.pl.bag >= baseCosts[propertyType] * budgetMults[budget];
      }
      if (tab === 3) return state.pl.bag >= 1500000;
      return false;
    };

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            LABOR LINEAGE
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-2 scrollbar-none touch-pan-x border-b border-slate-800 pb-2">
          {(['LVL 1: DAY LABOR', 'LVL 2: PROPERTY FLIPS', 'LVL 3: COMMERCIAL SYNDICATE'] as const).map((label, idx) => {
            const tabNum = (idx + 1) as 1 | 2 | 3;
            const isLocked = (tabNum === 2 && currentRankIdx < 1) || (tabNum === 3 && currentRankIdx < 3);
            const reqLabel = tabNum === 2 ? '[REQUIRES STREET]' : tabNum === 3 ? '[REQUIRES CORPORATE]' : '';

            return (
              <button
                key={label}
                disabled={isLocked}
                onClick={() => state.setLaborInput('activeTab', tabNum)}
                className={`px-3 py-2 rounded text-[10px] font-black whitespace-nowrap transition-all border ${activeTab === tabNum ? 'bg-emerald-600 border-emerald-400 text-white' : isLocked ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {label} {isLocked && <span className="ml-1 text-[8px] text-rose-500">{reqLabel}</span>}
              </button>
            );
          })}
        </div>

        {activeTab === 1 && (
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Contract Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(w => (
                <button
                  key={w}
                  onClick={() => state.setLaborInput('weeks', w)}
                  className={`py-3 rounded text-[10px] font-black transition-all border ${weeks === w ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {w} WEEK{w > 1 ? 'S' : ''}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-500 italic">Trade immediate physical health for basic legal capital.</p>
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Property Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['STUDIO', 'DUPLEX', 'LOFT'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => state.setLaborInput('propertyType', p)}
                    className={`py-2 rounded text-[10px] font-black transition-all border ${propertyType === p ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Renovation Budget</label>
              <select
                value={budget}
                onChange={(e) => state.setLaborInput('budget', e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-xs font-black text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase"
              >
                <option value="ECONOMY">Economy</option>
                <option value="PREMIUM">Premium (+20% Cost)</option>
                <option value="LUXURY">Luxury (+50% Cost)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Exit Strategy</label>
              <div className="grid grid-cols-2 gap-2">
                {(['FLIP', 'RENT'] as const).map(a => (
                  <button
                    key={a}
                    onClick={() => state.setLaborInput('action', a)}
                    className={`py-3 rounded text-[10px] font-black transition-all border ${action === a ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  >
                    {a === 'FLIP' ? '⚡ IMMEDIATE CAPITAL' : '🏦 PASSIVE FLOW'}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-slate-500 mt-2 italic">
                {action === 'FLIP' ? 'Roll for high-margin volatility and immediate payout.' : 'Secure +$2,500/month permanent passive yield.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-2xl text-center space-y-4">
             <div className="text-4xl">🏢</div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Commercial Syndicate</h3>
                <p className="text-[10px] text-slate-500 mt-2">Scale into institutional development projects. Massive upfront capital requirement for exponential returns and clout.</p>
             </div>
             <div className="text-[10px] font-black text-emerald-400">Project Cost: $1,500,000</div>
          </div>
        )}

        <button
          onClick={() => onExecute('r_labor')}
          disabled={!canAfford(activeTab)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {canAfford(activeTab) ? "AUTHORIZE LABOR CYCLE" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'r_delivery') {
    const { activeTab, weeks, fleetType, wageLevel } = state.pl.deliveryPanel;
    const currentRankIdx = PROGRESSION_TIERS.indexOf(state.pl.currentTier);
    const canAfford = (tab: number) => {
      if (tab === 1) return true;
      if (tab === 2) {
        const fleetCosts = { 'E-BIKE': 15000, SPRINTER: 40000, FREIGHT: 85000 };
        return state.pl.bag >= fleetCosts[fleetType] && state.pl.clout >= 40;
      }
      if (tab === 3) return state.pl.bag >= 2000000 && state.pl.clout >= 150;
      return false;
    };

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            DELIVERY LINEAGE
          </div>
        </div>

        <div className="flex flex-nowrap overflow-x-auto gap-2 scrollbar-none touch-pan-x border-b border-slate-800 pb-2">
          {(['LVL 1: COURIER SPRINT', 'LVL 2: FLEET DISPATCH', 'LVL 3: 3PL AUTOMATED HUB'] as const).map((label, idx) => {
            const tabNum = (idx + 1) as 1 | 2 | 3;
            const isLocked = (tabNum === 2 && currentRankIdx < 1) || (tabNum === 3 && currentRankIdx < 3);
            const reqLabel = tabNum === 2 ? '[REQUIRES STREET]' : tabNum === 3 ? '[REQUIRES CORPORATE]' : '';

            return (
              <button
                key={label}
                disabled={isLocked}
                onClick={() => state.setDeliveryInput('activeTab', tabNum)}
                className={`px-3 py-2 rounded text-[10px] font-black whitespace-nowrap transition-all border ${activeTab === tabNum ? 'bg-emerald-600 border-emerald-400 text-white' : isLocked ? 'bg-slate-900 border-slate-800 text-slate-700 opacity-50 cursor-not-allowed' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
              >
                {label} {isLocked && <span className="ml-1 text-[8px] text-rose-500">{reqLabel}</span>}
              </button>
            );
          })}
        </div>

        {activeTab === 1 && (
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Algorithmic Route Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(w => (
                <button
                  key={w}
                  onClick={() => state.setDeliveryInput('weeks', w)}
                  className={`py-3 rounded text-[10px] font-black transition-all border ${weeks === w ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {w} WEEK{w > 1 ? 'S' : ''}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Fleet Configuration</label>
              <div className="grid grid-cols-3 gap-2">
                {(['E-BIKE', 'SPRINTER', 'FREIGHT'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => state.setDeliveryInput('fleetType', f)}
                    className={`py-2 rounded text-[10px] font-black transition-all border ${fleetType === f ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Driver Wage Split: {wageLevel}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="1"
                value={wageLevel === 'LOW' ? 0 : wageLevel === 'BALANCED' ? 1 : 2}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  const levels: PlayerStats['deliveryPanel']['wageLevel'][] = ['LOW', 'BALANCED', 'PREMIUM'];
                  state.setDeliveryInput('wageLevel', levels[val]);
                }}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
                <span>Low (Risk)</span>
                <span>Balanced</span>
                <span>Premium (Safe)</span>
              </div>
              <p className="text-[9px] text-slate-500 mt-2 italic">
                {wageLevel === 'LOW' ? 'Maximize short-term margins, but risk a total Driver Strike walkout.' : wageLevel === 'PREMIUM' ? 'Sacrifice profits for absolute worker stability and clout.' : 'Market standard stability.'}
              </p>
            </div>
          </div>
        )}

        {activeTab === 3 && (
          <div className="p-8 bg-slate-950/50 border border-slate-800 rounded-2xl text-center space-y-4">
             <div className="text-4xl">🤖</div>
             <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">3PL Automated Hub</h3>
                <p className="text-[10px] text-slate-500 mt-2">Deploy AI-driven robotic sorting and autonomous freight dispatch. Total dominance of regional supply chains.</p>
             </div>
             <div className="text-[10px] font-black text-emerald-400">Deployment Cost: $2,000,000</div>
          </div>
        )}

        <button
          onClick={() => onExecute('r_delivery')}
          disabled={!canAfford(activeTab)}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {canAfford(activeTab) ? "AUTHORIZE LOGISTICS CYCLE" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'global_franchise') {
    const { sector, footprint, supplyChain } = state.pl.franchisePanel;
    const baseSetupCosts = { FAST_FOOD: 10000, WELLNESS: 25000, LOGISTICS: 65000 };
    const totalSetupCost = baseSetupCosts[sector] * footprint;
    const canAfford = state.pl.bag >= totalSetupCost;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
            BOARDROOM
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-indigo-400">FRANCHISE SYNDICATE CONTROL</h2>

        {state.pl.crises.laborStrikeTurns > 0 && (
          <div className="p-3 bg-red-900/30 border border-red-500 rounded text-xs font-bold text-red-500 uppercase tracking-tighter">
            ⚠️ LABOR STRIKE ACTIVE: Corporate operations frozen for {state.pl.crises.laborStrikeTurns} months.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Industry Sector</label>
            <div className="grid grid-cols-3 gap-2">
              {(['FAST_FOOD', 'WELLNESS', 'LOGISTICS'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => state.setFranchiseInput('sector', s)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${sector === s ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Footprint Saturation: {footprint}x</label>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={footprint}
              onChange={(e) => state.setFranchiseInput('footprint', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
              <span>National</span>
              <span>Regional</span>
              <span>Global</span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Supply Chain Architecture</label>
            <div className="grid grid-cols-2 gap-2">
              {(['OUTSOURCED', 'INTEGRATED'] as const).map(sc => (
                <button
                  key={sc}
                  onClick={() => state.setFranchiseInput('supplyChain', sc)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${supplyChain === sc ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {sc}
                </button>
              ))}
            </div>
            <p className="text-[9px] text-slate-500 mt-2 italic">
              {supplyChain === 'OUTSOURCED' ? '40% Logistics Tax applied to all revenue.' : 'Vertical integration maximizes profit but risks total Labor Strike.'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Total Setup Capital</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalSetupCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Est. Success Chance</span>
            <span className="font-mono font-bold text-indigo-400">85%</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('global_franchise')}
          disabled={!canAfford}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
        >
          {canAfford ? "AUTHORIZE GLOBAL EXPANSION" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  const getRankInfo = (id: string, lvl: number) => {
    if (id === 'drop') {
      if (lvl === 1) return { title: "Trunk Phase: Viral Ad Tester", nextCost: 4000 };
      if (lvl === 2) return { title: "Store Phase: Private Wholesaler", nextCost: 12000 };
      return { title: "Chain Phase: Global E-Com Empire", nextCost: null };
    }
    if (id === 'techFlip' || id === 'tech_flip') {
      if (lvl === 1) return { title: "Trunk Phase: Bedroom Repair Bench", nextCost: 2500 };
      if (lvl === 2) return { title: "Store Phase: Strip-Mall Kiosk", nextCost: 8500 };
      return { title: "Chain Phase: Automated Refurb Plant", nextCost: null };
    }
    if (id === 'vintage') {
      if (lvl === 1) return { title: "Trunk Phase: Thrift Rack Hunter", nextCost: 2000 };
      if (lvl === 2) return { title: "Store Phase: Consignment Boutique", nextCost: 7000 };
      return { title: "Chain Phase: The Luxury Grail Archive", nextCost: null };
    }
    return null;
  };

  const getHustleMetrics = (id: string) => {
    const { streetStats, startupStats } = state.pl;
    switch (id) {
      case 'cc': return `Subscribers: ${streetStats.ccSubs.toLocaleString()}`;
      case 'pod': return `Episodes: ${streetStats.podEpisodes}`;
      case 'audio': return `Active Tracks: ${state.pl.assetsOwned.masterTracks}`;
      case 'drip': return `Inventory: ${streetStats.dripStock}`;
      case 'meme': return `Active Tokens: ${streetStats.activeMemeTokens}`;
      case 'saas_mvp': return `Active Users: ${startupStats.saasUsers.toLocaleString()}`;
      case 'agency_scale': return `Agency Staff: ${startupStats.agencyStaff}`;
      case 'ecom_brand': return `Monthly Orders: ${startupStats.ecomOrders.toLocaleString()}`;
      default: return null;
    }
  };

  const executeHustleInternal = () => {
    onExecute(hustleId);
  };

  if (!config) return <div className="text-red-500">Hustle Config Not Found</div>;

  const metrics = getHustleMetrics(hustleId);
  const rankInfo = getRankInfo(hustleId, currentLvl);
  const isStartupHustle = config.tier === 'STARTUP';

  if (hustleId === 'saas_mvp') {
    const { infra, focus, subscriptionPrice } = state.pl.saasPanel;
    const infraCosts = { AWS: 500, DEVOPS: 2000, ENTERPRISE: 6000 };
    const canAfford = state.pl.bag >= infraCosts[infra];
    let outageRisk = 0;
    if (focus === 'GROWTH') {
      if (infra === 'AWS') outageRisk = 50;
      else if (infra === 'DEVOPS') outageRisk = 20;
    }

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            ENGINEERING BAY
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-emerald-400">SAAS MVP DASHBOARD</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Infrastructure Stack</label>
            <div className="grid grid-cols-3 gap-2">
              {(['AWS', 'DEVOPS', 'ENTERPRISE'] as const).map(i => (
                <button
                  key={i}
                  onClick={() => state.setSaaSInput('infra', i)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${infra === i ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Operational Focus</label>
            <div className="grid grid-cols-2 gap-2">
              {(['GROWTH', 'PATCH'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => state.setSaaSInput('focus', f)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${focus === f ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Subscription Price ($)</label>
            <input
              type="number"
              value={subscriptionPrice}
              onChange={(e) => state.setSaaSInput('subscriptionPrice', parseInt(e.target.value) || 0)}
              className="w-full bg-black border border-slate-800 rounded p-3 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${outageRisk > 30 ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-800/50 border-slate-700'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Monthly Infra Cost</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${infraCosts[infra].toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Server Crash Risk</span>
            <span className={`font-mono font-bold ${outageRisk > 0 ? 'text-red-500' : 'text-emerald-400'}`}>{outageRisk}%</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('saas_mvp')}
          disabled={!canAfford}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {canAfford ? "DEPLOY & SCALE PLATFORM" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'festival') {
    const { venue, insured, ticketPrice } = state.pl.festivalPanel;
    const venueCosts = { TOUR: 50000, CIRCUIT: 150000, SATURATION: 500000 };
    const insuranceCost = 25000;
    const totalCost = venueCosts[venue] + (insured ? insuranceCost : 0);
    const canAfford = state.pl.bag >= totalCost;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            CIRCUIT PROMOTER
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-purple-400">GLOBAL FESTIVAL CIRCUIT</h2>

        {state.pl.crises.laborStrikeTurns > 0 && (
          <div className="p-3 bg-red-900/30 border border-red-500 rounded text-xs font-bold text-red-500 uppercase tracking-tighter">
            ⚠️ LABOR STRIKE ACTIVE: Corporate operations frozen for {state.pl.crises.laborStrikeTurns} months.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Circuit Reach Selection</label>
            <div className="grid grid-cols-1 gap-2">
              {([['TOUR', 'North American Tour'], ['CIRCUIT', 'European Circuit'], ['SATURATION', 'Global Saturation']] as const).map(([v, label]) => (
                <button
                  key={v}
                  onClick={() => state.setFestivalInput('venue', v)}
                  className={`py-3 px-4 rounded-xl text-left text-[10px] font-black transition-all border flex justify-between items-center ${venue === v ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  <span>{label}</span>
                  <span className="font-mono opacity-60">${venueCosts[v].toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <div>
              <div className="text-[10px] font-black text-white uppercase">Corporate Event Insurance</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Recover 80% on headliner breach ($25,000)</div>
            </div>
            <button
              onClick={() => state.setFestivalInput('insured', !insured)}
              className={`w-12 h-6 rounded-full transition-all relative ${insured ? 'bg-emerald-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${insured ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Average Ticket Price ($)</label>
            <input
              type="number"
              value={ticketPrice}
              onChange={(e) => state.setFestivalInput('ticketPrice', parseInt(e.target.value) || 0)}
              className="w-full bg-black border border-slate-800 rounded p-3 text-purple-400 font-mono font-bold focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Upfront Production Capital</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Risk Factor: Headliner Breach of Contract / Municipal Cancellation.</span>
            <span className="font-mono font-bold text-orange-400">25%</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('festival')}
          disabled={!canAfford}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
        >
          {canAfford ? "AUTHORIZE CIRCUIT LAUNCH" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'ecom_brand') {
    const { runSize, adSpend } = state.pl.ecomBrandPanel;
    const baseCost = runSize === 5000 ? 50000 : 200000;
    const totalCost = baseCost + adSpend;
    const canAfford = state.pl.bag >= totalCost;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
            CONGLOMERATE HQ
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-orange-400">DTC BRAND CONGLOMERATE</h2>

        {state.pl.crises.laborStrikeTurns > 0 && (
          <div className="p-3 bg-red-900/30 border border-red-500 rounded text-xs font-bold text-red-500 uppercase tracking-tighter">
            ⚠️ LABOR STRIKE ACTIVE: Corporate operations frozen for {state.pl.crises.laborStrikeTurns} months.
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Warehouse Automation Tiers</label>
            <div className="grid grid-cols-2 gap-2">
              {([5000, 25000] as const).map(s => (
                <button
                  key={s}
                  onClick={() => state.setEcomBrandInput('runSize', s)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${runSize === s ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {s.toLocaleString()} UNIT DEPOT
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Cross-Border Tariff Strategy ($)</label>
            <input
              type="range"
              min="10000"
              max="200000"
              step="10000"
              value={adSpend}
              onChange={(e) => state.setEcomBrandInput('adSpend', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
              <span>$10,000</span>
              <span>${adSpend.toLocaleString()}</span>
              <span>$200,000</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Automation + Logistics Capital</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Risk Factor: Global Trade Embargo / Supply Chain Warfare.</span>
            <span className="font-mono font-bold text-orange-400">15% Risk</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('ecom_brand')}
          disabled={!canAfford}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 active:scale-[0.98]"
        >
          {canAfford ? "AUTHORIZE PRODUCTION CYCLE" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'agency_scale') {
    const { client, staff } = state.pl.agencyPanel;
    const yields = { SMB: 3000, MID: 9000, ENTERPRISE: 25000 };
    const canAfford = staff === 'FREELANCERS' ? (state.pl.bag >= yields[client] * 0.5) : true;
    const successChance = staff === 'INTERNS' ? 60 : 95;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            AGENCY HQ
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-400">AGENCY RETAINER LAB</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Target Client Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['SMB', 'MID', 'ENTERPRISE'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => state.setAgencyInput('client', c)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${client === c ? 'bg-blue-600 border-blue-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Staffing Strategy</label>
            <div className="grid grid-cols-2 gap-2">
              {(['INTERNS', 'FREELANCERS'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => state.setAgencyInput('staff', s)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${staff === s ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Payroll / Execution Cost</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${(staff === 'FREELANCERS' ? yields[client] * 0.5 : 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Project Success Rate</span>
            <span className={`font-mono font-bold ${successChance < 70 ? 'text-orange-500' : 'text-emerald-400'}`}>{successChance}%</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('agency_scale')}
          disabled={!canAfford}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          {canAfford ? "PITCH & CLOSE RETAINER" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'techFlip' || hustleId === 'tech_flip') {
    const { selectedLot, toolQuality, listingPrice } = state.pl.techFlipPanel;
    const lotCosts = { PHONES: 150, LAPTOPS: 400, RIGS: 1200 };
    const toolCosts = { BUDGET: 50, PRECISION: 200 };
    const totalCost = lotCosts[selectedLot] + toolCosts[toolQuality];
    const canAfford = state.pl.bag >= totalCost;
    const baseChances = { PHONES: 85, LAPTOPS: 70, RIGS: 55 };
    const successChance = baseChances[selectedLot] + (toolQuality === 'PRECISION' ? 15 : 0);

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-right">
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Rank</div>
            <div className="text-[11px] font-bold text-white italic">Level {currentLvl}</div>
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-emerald-400">TECH REFURBISHING LAB</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Hardware Lot Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PHONES', 'LAPTOPS', 'RIGS'] as const).map(lot => (
                <button
                  key={lot}
                  onClick={() => state.setTechFlipInput('selectedLot', lot)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${selectedLot === lot ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-900/40' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                >
                  {lot}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Refurbishing Tools</label>
            <div className="grid grid-cols-2 gap-2">
              {(['BUDGET', 'PRECISION'] as const).map(tool => (
                <button
                  key={tool}
                  onClick={() => state.setTechFlipInput('toolQuality', tool)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${toolQuality === tool ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                >
                  {tool} {tool === 'PRECISION' ? '(+15% SUCCESS)' : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Custom Listing Price ($)</label>
          <input
            type="number"
            value={listingPrice}
            onChange={(e) => state.setTechFlipInput('listingPrice', parseInt(e.target.value) || 0)}
            className="w-full bg-black border border-slate-800 rounded p-3 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <p className="text-[9px] text-slate-600 mt-1 uppercase font-bold tracking-tighter">MAX MARKUP: 2X LOT COST ($${(lotCosts[selectedLot] * 2).toLocaleString()})</p>
        </div>

        <div className={`p-4 rounded-xl border ${canAfford ? 'bg-slate-800/50 border-slate-700' : 'bg-red-900/20 border-red-900/50'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Sourcing & Tool Cost</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Success Probability</span>
            <span className="font-mono font-bold text-blue-400">{successChance}%</span>
          </div>
        </div>

        <button
          onClick={() => onExecute(hustleId)}
          disabled={!canAfford}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {canAfford ? "EXECUTE HARDWARE FLIP" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'pod') {
    const { selectedGuest, unhingedSlider } = state.pl.podcastPanel;
    const guestCosts = { LOCAL: 100, MICRO: 500, ICON: 2500 };
    const canAfford = state.pl.bag >= guestCosts[selectedGuest];
    const riskPercent = unhingedSlider * 20;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            STUDIO MODE
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-blue-400">PODCAST SYNDICATE</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Book Guest Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOCAL', 'MICRO', 'ICON'] as const).map(guest => (
                <button
                  key={guest}
                  onClick={() => state.setPodcastInput('selectedGuest', guest)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${selectedGuest === guest ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-900/40' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'}`}
                >
                  {guest} (${guestCosts[guest].toLocaleString()})
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unhinged Level</label>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded ${unhingedSlider === 3 ? 'bg-red-600 text-white' : unhingedSlider === 2 ? 'bg-orange-500 text-white' : 'bg-emerald-600 text-white'}`}>
                {unhingedSlider === 1 ? 'FILTERED' : unhingedSlider === 2 ? 'EDGY' : 'CANCELABLE'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="1"
              value={unhingedSlider}
              onChange={(e) => state.setPodcastInput('unhingedSlider', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
              <span>Safe</span>
              <span>Risky</span>
              <span>Nuclear</span>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${riskPercent >= 60 ? 'bg-red-900/20 border-red-900/50' : 'bg-slate-800/50 border-slate-700'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Controversy Risk</span>
            <span className={`font-mono font-bold ${riskPercent >= 60 ? 'text-red-500' : 'text-orange-400'}`}>{riskPercent}% Explosion Chance</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Potential Yield</span>
            <span className="font-mono font-bold text-emerald-400">{unhingedSlider}x Clout Multiplier</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('pod')}
          disabled={!canAfford || state.pl.crises.shadowbanTurns > 0}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          {state.pl.crises.shadowbanTurns > 0
            ? `SHADOWBANNED: ${state.pl.crises.shadowbanTurns} MO REMAINING`
            : canAfford ? "RECORD & SYNDICATE EPISODE" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'vintage') {
    const { brandTier } = state.pl.streetwearPanel;
    const tierData = {
      'UNDERGROUND_IP': { cost: 500, clReq: 0, auReq: 0, label: 'Underground IP Collection' },
      'SOHO_STORE': { cost: 8000, clReq: 40, auReq: 30, label: 'Soho Retail Flagship' },
      'PARIS_RUNWAY': { cost: 35000, clReq: 80, auReq: 60, label: 'Paris Fashion Week' }
    };
    const currentTier = tierData[brandTier];
    const canAfford = state.pl.bag >= currentTier.cost;
    const meetsReqs = state.pl.clout >= currentTier.clReq && state.pl.aura >= currentTier.auReq;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-purple-400 bg-purple-400/10 px-2 py-0.5 rounded border border-purple-400/20 uppercase">
            DESIGN ATELIER
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-purple-400">STREETWEAR DRIP LAB</h2>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Collection Tier Selection</label>
          <div className="grid grid-cols-1 gap-2">
            {(['UNDERGROUND_IP', 'SOHO_STORE', 'PARIS_RUNWAY'] as const).map(t => {
              const data = tierData[t];
              const locked = state.pl.clout < data.clReq || state.pl.aura < data.auReq;
              return (
                <button
                  key={t}
                  onClick={() => state.setStreetwearInput('brandTier', t)}
                  className={`p-4 rounded-xl text-left transition-all border flex justify-between items-center ${brandTier === t ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750'} ${locked ? 'opacity-50' : ''}`}
                >
                  <div>
                    <div className="text-[11px] font-black uppercase tracking-widest">{data.label}</div>
                    <div className="text-[9px] font-bold opacity-60 uppercase">Cost: ${data.cost.toLocaleString()}</div>
                  </div>
                  {locked && (
                    <div className="text-[8px] font-black text-red-400 uppercase">Req: {data.clReq} Clout / {data.auReq} Aura</div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Operational Cost</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${currentTier.cost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Success Chance</span>
            <span className="font-mono font-bold text-emerald-400">100% (IP RESTORED)</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('vintage')}
          disabled={!canAfford || !meetsReqs || state.pl.swCooldownTurns > 0}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
        >
          {state.pl.swCooldownTurns > 0
            ? `COOLDOWN: ${state.pl.swCooldownTurns} MO`
            : meetsReqs ? (canAfford ? "EXECUTE DESIGN RUN" : "INSUFFICIENT FUNDS") : "REQUIREMENTS NOT MET"}
        </button>
      </div>
    );
  }

  if (hustleId === 'drop') {
    const { selectedBatchSize, selectedQuality, retailPrice } = state.pl.swPanelState;
    const qualityCosts = { BUDGET: 10, PREMIUM: 30, LUXURY: 70 };
    const totalCost = selectedBatchSize * qualityCosts[selectedQuality];
    const canAfford = state.pl.bag >= totalCost;

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            DISTRIBUTION CENTER
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-emerald-400">VIRAL DROPSHIPPING</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Batch Size Selection</label>
            <div className="grid grid-cols-3 gap-2">
              {[50, 200, 500].map(size => (
                <button
                  key={size}
                  onClick={() => state.setSwInput('selectedBatchSize', size)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${selectedBatchSize === size ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {size} units
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Item Quality Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['BUDGET', 'PREMIUM', 'LUXURY'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => state.setSwInput('selectedQuality', q)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${selectedQuality === q ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Retail Price ($)</label>
          <input
            type="number"
            value={retailPrice}
            onChange={(e) => state.setSwInput('retailPrice', parseInt(e.target.value) || 0)}
            className="w-full bg-black border border-slate-800 rounded p-3 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        <div className={`p-4 rounded-xl border ${canAfford ? 'bg-slate-800/50 border-slate-700' : 'bg-red-900/20 border-red-900/50'}`}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Sourcing Cost</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Risk Level</span>
            <span className="font-mono font-bold text-orange-400">MARKET VOLATILITY</span>
          </div>
        </div>

        <button
          onClick={() => onExecute('drop')}
          disabled={!canAfford || state.pl.swCooldownTurns > 0}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {state.pl.swCooldownTurns > 0
            ? `COOLDOWN: ${state.pl.swCooldownTurns} MO`
            : canAfford ? "LAUNCH VIRAL CAMPAIGN" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          {isStartupHustle ? 'Back to Startup Operations' : 'Back to Operations Panel'}
        </button>
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          OPERATIONAL MODE
        </div>
      </div>

      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">{config.name}</h2>
            <p className="text-xs text-slate-500 mt-1">{config.description}</p>
          </div>
          {rankInfo && (
            <div className="text-right">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Operation Rank</div>
              <div className="text-xs font-bold text-white italic">Level {currentLvl}: {rankInfo.title}</div>
            </div>
          )}
        </div>
      </div>

      {metrics && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
           <div className="text-[10px] font-black text-emerald-500 uppercase mb-1 tracking-widest">Status Metrics</div>
           <div className="text-lg font-black text-white">{metrics}</div>
        </div>
      )}

      <div className="bg-black/50 border border-slate-800 rounded-xl p-4">
        <div className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-[0.2em]">Operating Controls</div>
        <div className="grid grid-cols-1 gap-4">
           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400">Operational Level</span>
              <span className="text-xs font-mono text-blue-400">LVL {currentLvl}</span>
           </div>
           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400">Yield Optimization</span>
              <span className="text-xs font-mono text-emerald-400">
                {hustleId === 'drop' && currentLvl === 1 && '1.0x (BASE)'}
                {hustleId === 'drop' && currentLvl === 2 && '1.8x (PRO)'}
                {hustleId === 'drop' && currentLvl === 3 && '3.5x (ELITE)'}
                {hustleId === 'techFlip' && currentLvl === 1 && '1.0x (BASE)'}
                {hustleId === 'techFlip' && currentLvl === 2 && '2.0x (PRO)'}
                {hustleId === 'techFlip' && currentLvl === 3 && '4.0x (ELITE)'}
                {hustleId === 'vintage' && currentLvl === 1 && '1.0x (BASE)'}
                {hustleId === 'vintage' && currentLvl === 2 && '2.2x (PRO)'}
                {hustleId === 'vintage' && currentLvl === 3 && 'AURA FOCUS'}
                {!['drop', 'techFlip', 'vintage'].includes(hustleId) && '1.0x (BASE)'}
              </span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">Risk Mitigation</span>
              <span className="text-xs font-mono text-emerald-400 italic">
                {hustleId.startsWith('r_') ? 'SAFE HAVEN: 100% SUCCESS' : '0% (AUTO)'}
              </span>
           </div>
        </div>
        {/* GRANULAR MECHANICS INJECTION POINT */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rankInfo && (
          <button
            onClick={() => state.upgradeHustle(hustleId)}
            disabled={rankInfo.nextCost === null || state.pl.bag < rankInfo.nextCost}
            className="py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] border border-blue-400/30"
          >
            {rankInfo.nextCost === null
              ? "MAX RANK REACHED"
              : `UPGRADE OPERATION BUSINESS RANK ($${rankInfo.nextCost.toLocaleString()})`}
          </button>
        )}
        <button
          onClick={executeHustleInternal}
          className={`${rankInfo ? '' : 'md:col-span-2'} py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]`}
        >
          {hustleId === 'audio'
            ? (state.pl.streetStats.studioOwned ? 'Produce Master Track (-$500)' : `Establish ${config.name} (-$${config.upfrontCost.toLocaleString()})`)
            : `Execute ${config.name} for the Month`}
        </button>
      </div>
    </div>
  );
}


export default App;
