import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { VFXManager } from './components/juice/VFXManager';
import { HeatDrizzle } from './components/juice/HeatDrizzle';
import { getInitialGameState } from './store/initialState';
import type { GameState, GameTab } from './store/types';
import { MASTER_HUSTLE_REGISTRY } from './engine/hustleRegistry';
import { PANEL_REGISTRY } from './components/hustles/panelRegistry';
import { DefaultPanel } from './components/hustles/panels/DefaultPanel';

import { PROGRESSION_TIERS } from './store/types';
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
        const baseCosts: Record<string, number> = { STUDIO: 50000, DUPLEX: 75000, LOFT: 100000 };
        const budgetMults: Record<string, number> = { ECONOMY: 1, PREMIUM: 1.2, LUXURY: 1.5 };
        upfrontCost = baseCosts[propertyType] * budgetMults[budget];
      } else if (activeTab === 3) {
        upfrontCost = 1500000;
      }
    }

    if (id === 'r_delivery') {
      const { activeTab, fleetType } = pl.deliveryPanel;
      if (activeTab === 2) {
        const fleetCosts: Record<string, number> = { 'E-BIKE': 15000, SPRINTER: 40000, FREIGHT: 85000 };
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
    const { finalCash, netPayout } = state.deductCostAndRollOutcome(id, forceSuccess);

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
                      if (!PANEL_REGISTRY) {
                        console.error("PANEL_REGISTRY is not properly initialized.");
                        executeHustle(hustle.id);
                        return;
                      }

                      if (hustle.id in PANEL_REGISTRY) {
                        setActiveHustleView(hustle.id);
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
          {news.slice(0, 2).map((msg: string, i: number) => (
            <div key={i} className="flex gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
              <span className="text-slate-700 shrink-0">[{i+1}]</span>
              <span className={msg.startsWith('SYSTEM') ? 'text-blue-400 font-bold' : 'text-emerald-400'}>{msg}</span>
            </div>
          ))}
          {news.length === 0 && <div className="text-slate-800 italic">SYSTEM READY... STANDBY FOR INPUT...</div>}
        </div>
      </footer>

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
  const Panel = PANEL_REGISTRY[hustleId] || DefaultPanel;
  return <Panel hustleId={hustleId} onBack={onBack} state={state} onExecute={onExecute} />;
}


export default App;
