import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from './store/gameStore';
import { VFXManager } from './components/juice/VFXManager';
import { HeatDrizzle } from './components/juice/HeatDrizzle';
import { getInitialGameState } from './store/initialState';
import type { GameState, GameTab, PlayerStats } from './store/types';
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

  const setSelectedLineageHustleId = setActiveHustleView;
  const executeHustle = (id: string) => {
    const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === id);
    if (!config) return;
    const isInstant = id.startsWith('r_') && !config.isPassive;
    if (isInstant) handleExecuteHustle(id);
    else setActiveHustleView(id);
  };

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

  const handleExecuteHustle = async (id: string, forceSuccess?: boolean) => {
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
        upfrontCost = baseCosts[propertyType] * (budgetMults[budget as keyof typeof budgetMults] || 1);
      } else if (activeTab === 3) {
        upfrontCost = 1500000;
      }
    }

    if (id === 'r_delivery') {
      const { activeTab, fleetType } = pl.deliveryPanel;
      if (activeTab === 2) {
        const fleetCosts = { 'E-BIKE': 15000, SPRINTER: 40000, FREIGHT: 85000 };
        upfrontCost = fleetCosts[fleetType as keyof typeof fleetCosts] || 0;
      } else if (activeTab === 3) {
        upfrontCost = 2000000;
      }
    }

    if (id === 'saas_mvp') {
      const infraCosts = { AWS: 500, DEVOPS: 2000, ENTERPRISE: 6000 };
      upfrontCost = infraCosts[pl.saasPanel.infra as keyof typeof infraCosts] || 0;
    }

    if (id === 'festival') {
      const venueCosts = { TOUR: 50000, CIRCUIT: 150000, SATURATION: 500000 };
      upfrontCost = (venueCosts[pl.festivalPanel.venue as keyof typeof venueCosts] || 0) + (pl.festivalPanel.insured ? 25000 : 0);
    }

    if (id === 'ecom_brand') {
      upfrontCost = (pl.ecomBrandPanel.runSize === 5000 ? 50000 : 200000) + pl.ecomBrandPanel.adSpend;
    }

    if (id === 'agency_scale') {
      const yields = { SMB: 3000, MID: 9000, ENTERPRISE: 25000 };
      const baseYield = yields[pl.agencyPanel.client as keyof typeof yields] || 0;
      upfrontCost = pl.agencyPanel.staff === 'FREELANCERS' ? baseYield * 0.5 : 0;
    }

    if (id === 'global_franchise') {
      const baseSetupCosts = { FAST_FOOD: 10000, WELLNESS: 25000, LOGISTICS: 65000 };
      upfrontCost = (baseSetupCosts[pl.franchisePanel.sector as keyof typeof baseSetupCosts] || 0) * pl.franchisePanel.footprint;
    }

    if (id === 'pod') {
      const guestCosts = { LOCAL: 100, MICRO: 500, ICON: 2500 };
      upfrontCost = guestCosts[pl.podcastPanel.selectedGuest as keyof typeof guestCosts] || 0;
    }

    if (id === 'techFlip' || id === 'tech_flip') {
      const lotCosts = { PHONES: 150, LAPTOPS: 400, RIGS: 1200 };
      const toolCosts = { BUDGET: 50, PRECISION: 200 };
      upfrontCost = (lotCosts[pl.techFlipPanel.selectedLot as keyof typeof lotCosts] || 0) + toolCosts[pl.techFlipPanel.toolQuality as keyof typeof toolCosts];
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

      <div className="w-full flex flex-col shrink-0 bg-slate-950 border-b border-slate-900 relative z-[110]">
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
                <span className={mentalHealth <= 20 ? "text-base font-black tracking-tight text-rose-500 scale-105 animate-pulse" : "text-sm font-black text-emerald-400"}>
                  {mentalHealth}%
                </span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,5 L4,5 L6,2 L8,8 L10,5 L24,5" fill="none" stroke={mentalHealth <= 20 ? '#f43f5e' : 'currentColor'} strokeWidth={mentalHealth <= 20 ? 2.5 : 1.5} />
                </svg>
              </div>
            </div>

            {/* AURA */}
            <div className={`flex flex-col items-center justify-center transition-all ${aura <= 10 ? 'animate-heartbeat text-rose-500' : ''}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">AUR</div>
              <div className="flex items-center">
                <span className={aura <= 10 ? "text-base font-black tracking-tight text-rose-500 scale-105" : "text-sm font-black text-purple-400"}>
                  {aura}
                </span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,7 C4,7 6,3 12,5 S20,3 24,7" fill="none" stroke={aura <= 10 ? "#f43f5e" : "#a855f7"} strokeWidth={aura <= 10 ? 2.5 : 1.5} />
                </svg>
              </div>
            </div>

            {/* HEAT */}
            <div className={`flex flex-col items-center justify-center transition-all ${heat >= 80 ? 'animate-heartbeat text-red-500 font-bold' : ''}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">HT</div>
              <div className="flex items-center">
                <span className={heat >= 80 ? "text-base font-black tracking-tight text-red-500 animate-pulse" : "text-sm font-black text-orange-400"}>
                  {heat}%
                </span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,9 L8,9 L8,6 L16,6 L16,3 L24,3" fill="none" stroke={heat >= 80 ? '#f43f5e' : 'currentColor'} strokeWidth={heat >= 80 ? 2.5 : 1.5} />
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

        {(activeHustleView === null || ['r_labor', 'r_delivery'].includes(activeHustleView)) ? (
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

            const currentTabHustles = MASTER_HUSTLE_REGISTRY.filter(h => h.tier === activeTab);
            return (
              <div className="grid grid-cols-2 gap-3 w-full">
                {currentTabHustles.map(hustle => {
                  return (
                    <HustleCard
                      key={hustle.id}
                      title={hustle.name}
                      icon={hustle.icon}
                      disabled={hustle.id === 'r_plasma' && plasmaUsedThisMonth}
                      onClick={() => {
                        if (hustle.id === 'r_labor' || hustle.id === 'r_delivery') {
                          setSelectedLineageHustleId(hustle.id); // Toggle the SubGamePanel open
                        } else {
                          executeHustle(hustle.id);
                        }
                      }}
                    />
                  );
                })}
              </div>
            );
          })()
        ) : (
          !['r_labor', 'r_delivery'].includes(activeHustleView) && (
            <SubGamePanel
              hustleId={activeHustleView}
              onBack={() => setActiveHustleView(null)}
              state={state}
              onExecute={handleExecuteHustle}
            />
          )
        )}

        <div className="mt-8 flex justify-center gap-6">
           <button onClick={() => state.setPh('PROLOGUE_INTRO')} className="text-[9px] text-slate-700 hover:text-slate-400 uppercase font-bold tracking-tighter transition-colors">Terminate Run</button>
        </div>
      </main>

      {/* LINEAGE MODAL OVERLAY */}
      <AnimatePresence>
        {activeHustleView && ['r_labor', 'r_delivery'].includes(activeHustleView) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <SubGamePanel
                hustleId={activeHustleView}
                onBack={() => setActiveHustleView(null)}
                state={state}
                onExecute={handleExecuteHustle}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
  if (!config) return null;

  const currentLvl = state.pl.hustleLevels[hustleId] || 1;

  const rankInfo = config.ranks ? {
    title: config.ranks[currentLvl - 1],
    nextCost: currentLvl < 3 ? (config.rankUpCosts ? config.rankUpCosts[currentLvl - 1] : null) : null
  } : null;

  const isStartupHustle = config.tier === 'STARTUP';
  const executeHustleInternal = () => onExecute(hustleId).then(() => onBack());

  let metrics = null;
  if (hustleId === 'saas_mvp') metrics = `Users: ${state.pl.startupStats.saasUsers.toLocaleString()}`;
  if (hustleId === 'agency_scale') metrics = `Staff: ${state.pl.startupStats.agencyStaff}`;

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

  if (hustleId === 'saas_mvp') {
    const { infra, focus, subscriptionPrice } = state.pl.saasPanel;
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            STARTUP ENGINE
          </div>
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{config.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Infrastructure Stack</label>
            <div className="grid grid-cols-3 gap-2">
              {(['AWS', 'DEVOPS', 'ENTERPRISE'] as const).map(i => (
                <button
                  key={i}
                  onClick={() => state.setSaaSInput('infra', i)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${infra === i ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Strategic Focus</label>
            <div className="grid grid-cols-2 gap-2">
              {(['PATCH', 'GROWTH'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => state.setSaaSInput('focus', f)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${focus === f ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {f === 'PATCH' ? 'STABILITY' : 'GROWTH'}
                </button>
              ))}
            </div>
          </div>
          <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Subscription Price: ${subscriptionPrice}/mo</label>
             <input
               type="range"
               min="5"
               max="100"
               step="5"
               value={subscriptionPrice}
               onChange={(e) => state.setSaaSInput('subscriptionPrice', parseInt(e.target.value))}
               className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
             />
          </div>
        </div>
        <button
          onClick={() => onExecute('saas_mvp').then(() => onBack())}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          EXECUTE SPRINT CYCLE
        </button>
      </div>
    );
  }

  if (hustleId === 'festival') {
    const { venue, insured, ticketPrice } = state.pl.festivalPanel;
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-purple-500 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            CORPORATE CIRCUIT
          </div>
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{config.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Venue Scale</label>
            <div className="grid grid-cols-3 gap-2">
              {(['TOUR', 'CIRCUIT', 'SATURATION'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => state.setFestivalInput('venue', v)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${venue === v ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700">
             <div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">Event Insurance</div>
                <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">Protects 80% capital on failure</div>
             </div>
             <button
               onClick={() => state.setFestivalInput('insured', !insured)}
               className={`w-12 h-6 rounded-full transition-all relative ${insured ? 'bg-emerald-500' : 'bg-slate-700'}`}
             >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${insured ? 'left-7' : 'left-1'}`} />
             </button>
          </div>
          <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Ticket Price: ${ticketPrice}</label>
             <input
               type="range"
               min="50"
               max="1000"
               step="50"
               value={ticketPrice}
               onChange={(e) => state.setFestivalInput('ticketPrice', parseInt(e.target.value))}
               className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
             />
          </div>
        </div>
        <button
          onClick={() => onExecute('festival').then(() => onBack())}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
        >
          LAUNCH GLOBAL CIRCUIT
        </button>
      </div>
    );
  }

  if (hustleId === 'ecom_brand') {
    const { runSize, adSpend } = state.pl.ecomBrandPanel;
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
            CONGLOMERATE MODE
          </div>
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{config.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Manufacturing Run Size</label>
            <div className="grid grid-cols-2 gap-2">
              {[5000, 25000].map(s => (
                <button
                  key={s}
                  onClick={() => state.setEcomBrandInput('runSize', s)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${runSize === s ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {s.toLocaleString()} UNITS
                </button>
              ))}
            </div>
          </div>
          <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Global Ad Spend: ${adSpend.toLocaleString()}</label>
             <input
               type="range"
               min="10000"
               max="200000"
               step="10000"
               value={adSpend}
               onChange={(e) => state.setEcomBrandInput('adSpend', parseInt(e.target.value))}
               className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
             />
          </div>
        </div>
        <button
          onClick={() => onExecute('ecom_brand').then(() => onBack())}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
        >
          AUTHORIZE GLOBAL LOGISTICS
        </button>
      </div>
    );
  }

  if (hustleId === 'agency_scale') {
    const { client, staff } = state.pl.agencyPanel;
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </button>
          <div className="text-[10px] font-mono text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/20">
            AGENCY SCALE
          </div>
        </div>
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{config.name}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Target Client Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['SMB', 'MID', 'ENTERPRISE'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => state.setAgencyInput('client', c)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${client === c ? 'bg-orange-600 border-orange-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
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
                  className={`py-2 rounded text-[10px] font-black transition-all border ${staff === s ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={() => onExecute('agency_scale').then(() => onBack())}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 active:scale-[0.98]"
        >
          NEGOTIATE RETAINER
        </button>
      </div>
    );
  }

  if (hustleId === 'pod') {
    const { selectedGuest, unhingedSlider } = state.pl.podcastPanel;
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

        <div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">{config.name}</h2>
          <p className="text-xs text-slate-500 mt-1">{config.description}</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Guest Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['LOCAL', 'MICRO', 'ICON'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => state.setPodcastInput('selectedGuest', g)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${selectedGuest === g ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
             <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Unhinged Factor: {unhingedSlider}x</label>
             <input
               type="range"
               min="1"
               max="5"
               step="1"
               value={unhingedSlider}
               onChange={(e) => state.setPodcastInput('unhingedSlider', parseInt(e.target.value))}
               className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
             />
             <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
                <span>Safe</span>
                <span>Viral</span>
                <span>Canceled</span>
             </div>
          </div>
        </div>

        <button
          onClick={() => onExecute('pod').then(() => onBack())}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          RECORD EPISODE
        </button>
      </div>
    );
  }

  if (hustleId === 'r_labor') {
    const { activeTab, weeks, propertyType, budget, action } = state.pl.laborPanel;
    const currentRankIdx = PROGRESSION_TIERS.indexOf(state.pl.currentTier);
    const canAfford = (tab: number) => {
      if (tab === 1) return true;
      if (tab === 2) {
        const baseCosts = { STUDIO: 50000, DUPLEX: 75000, LOFT: 100000 };
        const budgetMults = { ECONOMY: 1, PREMIUM: 1.2, LUXURY: 1.5 };
        return state.pl.bag >= baseCosts[propertyType as keyof typeof baseCosts] * (budgetMults[budget as keyof typeof budgetMults] || 1);
      }
      if (tab === 3) return state.pl.bag >= 1500000;
      return false;
    };

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200 relative">
        <button
          onClick={onBack}
          className="absolute -top-3 -right-3 px-3 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 z-10 transition-all active:scale-90 text-[10px] font-black uppercase tracking-widest gap-1"
        >
          <span>✖</span> <span>Close</span>
        </button>

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
          onClick={() => onExecute('r_labor').then(() => onBack())}
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
        return state.pl.bag >= (fleetCosts[fleetType as keyof typeof fleetCosts] || 0) && state.pl.clout >= 40;
      }
      if (tab === 3) return state.pl.bag >= 2000000 && state.pl.clout >= 150;
      return false;
    };

    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200 relative">
        <button
          onClick={onBack}
          className="absolute -top-3 -right-3 px-3 h-8 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-slate-900 z-10 transition-all active:scale-90 text-[10px] font-black uppercase tracking-widest gap-1"
        >
          <span>✖</span> <span>Close</span>
        </button>

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
          onClick={() => onExecute('r_delivery').then(() => onBack())}
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
    const totalSetupCost = baseSetupCosts[sector as keyof typeof baseSetupCosts] * footprint;
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
          onClick={() => onExecute('global_franchise').then(() => onBack())}
          disabled={!canAfford}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 active:scale-[0.98]"
        >
          {canAfford ? "AUTHORIZE GLOBAL EXPANSION" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          Back to Dashboard
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
