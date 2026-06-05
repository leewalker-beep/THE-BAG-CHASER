import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShallow } from 'zustand/react/shallow';
import { useGameStore } from './store/gameStore';
import { VFXManager } from './components/juice/VFXManager';
import { HeatDrizzle } from './components/juice/HeatDrizzle';
import { getInitialGameState } from './store/initialState';
import type { GameState, GameTab, PlayerStats } from './store/types';
import { MASTER_HUSTLE_REGISTRY } from './engine/hustleRegistry';
import { HUSTLE_PROGRESSIONS } from './config/hustleProgression';
import { HUSTLE_TONES, type HustleTone } from './config/hustleTone';
import { DEATH_MESSAGES } from './config/deathMessages';
import { NARRATIVE_BEATS } from './config/narrativeConfig';
import { PANEL_REGISTRY } from './components/hustles/panelRegistry';
import { StatsDashboard } from './components/StatsDashboard';
import { FlexMarket } from './components/FlexMarket';
import { MiniGameEngine } from './components/minigames/MiniGameEngine';
import { ProgressionPanel } from './components/hustles/ProgressionPanel';
import { DefaultPanel } from './components/hustles/panels/DefaultPanel';
import { TIER_REQUIREMENTS, UNFREEZE_COST, HUSTLE_BALANCE, RESOLVE_BLACKLIST_COST, RESOLVE_SHADOWBAN_COST, RESOLVE_STRIKE_COST } from './config/balanceConfig';
import { MARKET_CONFIGS } from './config/marketConfig';

import { PROGRESSION_TIERS, type MarketType } from './store/types';
const NAV_TABS: GameTab[] = ['MUD', 'STREET', 'STARTUP', 'CORPORATE', 'ELITE', 'FLEX', 'MOGUL', 'PRESIDENT', 'OPEN'];

function canAffordHustle(id: string, pl: PlayerStats | null, marketType: MarketType = 'NORMAL'): { can: boolean; reason?: string; cost: number } {
  if (!pl) return { can: false, reason: "INITIALIZING", cost: 0 };
  const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === id);
  if (!config) return { can: false, reason: "INVALID HUSTLE", cost: 0 };

  let cost = config.upfrontCost;
  let cloutReq = config.cloutReq;
  let auraReq = 0;

  // Crises & Cooldowns
  if (pl.crises.blacklistTurns > 0 && (config.tier === 'ELITE' || config.tier === 'MOGUL')) {
    return { can: false, reason: "BLACKLISTED", cost: 0 };
  }
  if (id === 'r_plasma' && pl.plasmaUsedThisMonth) {
    return { can: false, reason: "RECOVERY NEEDED", cost: 0 };
  }
  if ((id === 'sw' || id === 'drop' || id === 'vintage') && pl.swCooldownTurns > 0) {
    return { can: false, reason: "COOLDOWN ACTIVE", cost: 0 };
  }

  // Cost & Req Overrides (aligned with gameStore.ts and Panels)
  if (id === 'audio' && pl.streetStats.studioOwned) {
    cost = HUSTLE_BALANCE.audio.studioOwnedProductionCost;
  }

  const tree = HUSTLE_PROGRESSIONS[id];
  if (tree) {
    const currentNodeId = pl.hustleNodeIds[id] || 'l1';
    const node = tree[currentNodeId];
    if (node) {
      cost = node.cost;
      cloutReq = 0; // Requirements are checked during upgrade, not execution
    }
  } else {
    if (id === 'r_labor') {
      const { activeTab, propertyType, budget } = pl.laborPanel;
      if (activeTab === 2) {
        cloutReq = HUSTLE_BALANCE.r_labor.level2.cloutReq;
        const { baseCosts, budgetMults } = HUSTLE_BALANCE.r_labor.level2;
        cost = baseCosts[propertyType] * budgetMults[budget];
      } else if (activeTab === 3) {
        cloutReq = HUSTLE_BALANCE.r_labor.level3.cloutReq;
        auraReq = HUSTLE_BALANCE.r_labor.level3.auraReq;
        cost = HUSTLE_BALANCE.r_labor.level3.cost;
      }
    }

    if (id === 'r_delivery') {
      const { activeTab, fleetType } = pl.deliveryPanel;
      if (activeTab === 2) {
        cloutReq = HUSTLE_BALANCE.r_delivery.level2.cloutReq;
        cost = HUSTLE_BALANCE.r_delivery.level2.fleetCosts[fleetType];
      } else if (activeTab === 3) {
        cloutReq = HUSTLE_BALANCE.r_delivery.level3.cloutReq;
        auraReq = HUSTLE_BALANCE.r_delivery.level3.auraReq;
        cost = HUSTLE_BALANCE.r_delivery.level3.cost;
      }
    }

    if (id === 'vintage') {
      const { brandTier } = pl.streetwearPanel;
      const tierData = HUSTLE_BALANCE.vintage.tiers[brandTier];
      cost = tierData.cost;
      cloutReq = tierData.clReq;
      auraReq = tierData.auReq;
    }

    if (id === 'saas_mvp') {
      const { infra } = pl.saasPanel;
      cost = HUSTLE_BALANCE.saas_mvp.infraCosts[infra];
    }

    if (id === 'festival') {
      const { venue, insured } = pl.festivalPanel;
      cost = HUSTLE_BALANCE.festival.venueCosts[venue] + (insured ? HUSTLE_BALANCE.festival.insuranceFee : 0);
    }

    if (id === 'ecom_brand') {
      const { runSize, adSpend } = pl.ecomBrandPanel;
      cost = (HUSTLE_BALANCE.ecom_brand.runSizeCosts[runSize] || HUSTLE_BALANCE.ecom_brand.DEFAULT_RUN_SIZE_COST) + adSpend;
    }

    if (id === 'agency_scale') {
      const { client, staff } = pl.agencyPanel;
      const { clientYields, freelancerCostMult } = HUSTLE_BALANCE.agency_scale;
      cost = staff === 'FREELANCERS' ? clientYields[client] * freelancerCostMult : 0;
    }

    if (id === 'global_franchise') {
      const { sector, footprint } = pl.franchisePanel;
      cost = HUSTLE_BALANCE.global_franchise.baseSetupCosts[sector] * footprint;
    }
  }

  cost *= MARKET_CONFIGS[marketType].expenseMultiplier;

  if (pl.bag < cost) return { can: false, reason: "INSUFFICIENT FUNDS", cost };
  if (pl.clout < cloutReq) return { can: false, reason: "LACK OF CLOUT", cost };
  if (pl.aura < auraReq) return { can: false, reason: "LACK OF AURA", cost };

  return { can: true, cost };
}

function App() {
  useEffect(() => {
    (window as any).useGameStore = useGameStore;
  }, []);
  const state = useGameStore(
    useShallow((s: GameState) => ({
      pl: s.pl,
      ph: s.ph,
      fatalCause: s.fatalCause,
      deathBadge: s.deathBadge,
      news: s.news,
      activeTab: s.activeTab,
      setActiveTab: s.setActiveTab,
      activeHustleView: s.activeHustleView,
      setActiveHustleView: s.setActiveHustleView,
      currentMarket: s.currentMarket,
      deductCostAndRollOutcome: s.deductCostAndRollOutcome,
      setPlayerName: s.setPlayerName,
      setPh: s.setPh,
      unfreezeAccounts: s.unfreezeAccounts,
      resolveBlacklist: s.resolveBlacklist,
      resolveShadowban: s.resolveShadowban,
      resolveLaborStrike: s.resolveLaborStrike,
      setCurrentTier: s.setCurrentTier,
      activeNarrative: s.activeNarrative,
      dismissNarrative: s.dismissNarrative,
      setLaborInput: s.setLaborInput,
      setDeliveryInput: s.setDeliveryInput,
      setPodcastInput: s.setPodcastInput,
      upgradeHustle: s.upgradeHustle,
      setStreetwearInput: s.setStreetwearInput,
      setFranchiseInput: s.setFranchiseInput,
      setSaaSInput: s.setSaaSInput,
      setFestivalInput: s.setFestivalInput,
      setEcomBrandInput: s.setEcomBrandInput,
      setAgencyInput: s.setAgencyInput,
      upgradeHustleNode: s.upgradeHustleNode,
      upgradeHustleLevel: s.upgradeHustleLevel,
      purchaseHustleUpgrade: s.purchaseHustleUpgrade,
      purchaseFlexAsset: s.purchaseFlexAsset,
    }) as GameState)
  );

  const {
    pl, ph, fatalCause, deathBadge, news,
    activeTab, setActiveTab, activeHustleView, setActiveHustleView,
    currentMarket
  } = state;

  const [displayedCash, setDisplayedCash] = useState(pl?.bag || 0);
  const [cashSplash, setCashSplash] = useState<{ text: string; isWin: boolean } | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [activeMiniGame, setActiveMiniGame] = useState<{ type: 'chart_match' | 'tap_mine' | 'tic_tac_toe' | 'scene_cut' | 'hype_meter' | 'rocket_launch' | 'grant_sort' | 'pattern_match' | 'rate_balance' | 'heirloom_catch' | 'campaign_trail' | 'shadow_game' | 'foundation_builder' | 'influence_engine', hustleId: string } | null>(null);
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

  const executeHustle = async (id: string, forceSuccess?: boolean, yieldMultiplier?: number) => {
    if (!pl) return;

    const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === id);

    // Mini-Game Interception
    if (config?.miniGame && yieldMultiplier === undefined) {
      setActiveMiniGame({ type: config.miniGame, hustleId: id });
      return;
    }

    // Cooldown Guards
    if ((id === 'drop' || id === 'vintage' || id === 'sw') && pl?.swCooldownTurns > 0) {
      setCashSplash({ text: `COOLDOWN: ${pl.swCooldownTurns} MO`, isWin: false });
      setTimeout(() => setCashSplash(null), 1000);
      return;
    }

    if (isAnimating.current) return;
    isAnimating.current = true;

    const { can, reason, cost: upfrontCost } = canAffordHustle(id, pl, currentMarket);
    if (!can) {
      setCashSplash({ text: reason || "LOCKED", isWin: false });
      setTimeout(() => setCashSplash(null), 1000);
      isAnimating.current = false;
      return;
    }

    // Phase 1: Cost Tick Down
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
    state.deductCostAndRollOutcome(id, forceSuccess, yieldMultiplier);
    const bagAfter = useGameStore.getState().pl.bag;
    const netPayout = bagAfter - floorCash;

    if (netPayout > 0) {
      setCashSplash({ text: `+$${netPayout.toLocaleString()}`, isWin: true });
    } else {
      setCashSplash({ text: `-$${Math.abs(netPayout).toLocaleString()}`, isWin: false });
    }

    setTimeout(() => setCashSplash(null), 600);

    // Phase 3: Outcome Roll
    const steps = 30;
    const currentDisplayed = floorCash;
    const totalDelta = bagAfter - currentDisplayed;
    const stepVal = totalDelta / steps;

    for (let i = 1; i <= steps; i++) {
      setDisplayedCash(Math.floor(currentDisplayed + (stepVal * i)));
      await new Promise(r => setTimeout(r, 15));
    }

    setDisplayedCash(bagAfter);
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

  if (!pl) return null;

  if (!pl.name || pl.name.trim() === "") {
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

  const { activeNarrative, dismissNarrative } = state;

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
    const lastHustleId = pl.lastExecutedHustleId || 'DEFAULT';
    const deathInfo = DEATH_MESSAGES[lastHustleId] || DEATH_MESSAGES['DEFAULT'];

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[20000] bg-black flex flex-col items-center justify-center p-6 text-center overflow-y-auto"
      >
        <div className="max-w-2xl w-full space-y-8 py-12">
          <motion.h1
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="text-7xl md:text-9xl font-black text-red-600 tracking-tighter italic mb-4"
          >
            GAME OVER
          </motion.h1>

          <div className="space-y-2">
            <p className="text-red-500 font-mono text-lg uppercase tracking-widest">{fatalCause}</p>
            <div className="h-px w-24 bg-red-900 mx-auto my-4" />
            <p className="text-slate-400 font-mono italic text-sm md:text-base leading-relaxed px-4">
              "{deathInfo.message}"
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-900/50 border-2 border-red-900/30 p-8 rounded-3xl inline-block"
          >
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3">Earned Death Badge</div>
            <div className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              💀 {deathBadge || deathInfo.badge}
            </div>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
            <button
              onClick={() => {
                useGameStore.setState({ deathBadge: null });
                state.setPh('PROLOGUE_INTRO');
              }}
              className="px-12 py-5 bg-red-600 hover:bg-red-500 text-black font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-red-900/20"
            >
              RUN IT BACK
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="px-12 py-5 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest transition-all active:scale-95 border border-slate-700"
            >
              VIEW AUTOPSY
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showStats && (
            <StatsDashboard
              stats={pl.stats}
              flexAssets={pl.flexAssets}
              onClose={() => setShowStats(false)}
              monthsPlayed={pl.mo}
              deathBadge={deathBadge || deathInfo.badge}
            />
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-[#020817] text-white font-mono overflow-hidden select-none selection:bg-emerald-500">
      <VFXManager />

      <AnimatePresence>
        {mentalHealth <= 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] bg-red-950/90 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="text-red-500 text-8xl font-black mb-4 animate-pulse">CRITICAL</div>
            <div className="text-white text-xl font-mono uppercase tracking-[0.3em] mb-8">SYSTEM COLLAPSE IMMINENT</div>
            <p className="text-red-200 max-w-md font-bold uppercase text-sm leading-relaxed">
              Your mental health has reached terminal levels. The pressure is crushing your reality. Find a way to recover or face total psychological blackout.
            </p>
          </motion.div>
        )}
        {heat >= 100 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] bg-slate-950/95 flex flex-col items-center justify-center p-6 text-center"
          >
             <div className="relative w-32 h-32 mb-8">
               <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-25"></div>
               <div className="absolute inset-4 bg-red-600 rounded-full flex items-center justify-center text-5xl">🚨</div>
             </div>
            <div className="text-red-600 text-5xl font-black mb-4 tracking-tighter uppercase">FEDS ARE WATCHING</div>
            <div className="text-white text-lg font-mono uppercase tracking-widest mb-8">MAXIMUM HEAT DETECTED</div>
            <p className="text-slate-400 max-w-md font-bold uppercase text-xs leading-relaxed">
              You are currently under full surveillance. Every move is logged. Every dollar is traced. The next slip-up is your last.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeNarrative && NARRATIVE_BEATS[activeNarrative] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-md w-full bg-slate-900 border-2 border-emerald-500/30 p-8 rounded-3xl shadow-2xl shadow-emerald-500/20 text-center space-y-6"
            >
              <div className="text-emerald-400 font-mono text-[10px] tracking-[0.3em] uppercase">Narrative Synchronization...</div>
              <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">
                {NARRATIVE_BEATS[activeNarrative]!.title}
              </h2>
              <div className="h-px w-12 bg-emerald-500/50 mx-auto" />
              <p className="text-slate-300 font-mono text-sm leading-relaxed">
                {NARRATIVE_BEATS[activeNarrative]!.message}
              </p>
              <button
                onClick={() => dismissNarrative()}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg shadow-emerald-900/40"
              >
                CONTINUE HUSTLE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
            <div className="flex items-center gap-2">
              <span className="text-slate-400">👤 OP: {pl.name || "LEE"}</span>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-800 rounded text-slate-300 font-bold border border-slate-700" title={MARKET_CONFIGS[currentMarket].description}>
                📈 {MARKET_CONFIGS[currentMarket].name}
              </span>
            </div>
            <span className="text-slate-500 text-[10px]">⏳ AGE: {ageYears}y {ageMonths}m</span>
          </div>

          {/* RIGHT COLUMN: THE WEALTH TERMINAL */}
          <div className="flex flex-col text-right font-mono select-none">
            <div className="flex items-center justify-end">
               <button
                onClick={() => setShowStats(true)}
                className="text-lg hover:scale-110 transition-transform active:scale-95 px-2"
                title="View Stats Dashboard"
               >
                 📊
               </button>
            </div>
            <span className="text-2xl font-black text-emerald-400 tracking-tight font-mono -mt-0.5">
              ${displayedCash.toLocaleString()}
            </span>
          </div>
        </div>

        {/* ROW 3: SUB-STATS GRID (COMPACT) */}
        <div className="w-full px-4 pb-2">
          <div className="grid grid-cols-4 gap-1.5 bg-[#020817]/80 p-2 rounded-lg border border-slate-900 text-center">
            {/* CLOUT */}
            <div className={`flex flex-col items-center justify-center rounded border transition-all ${clout <= 10 ? 'animate-pulse border-blue-500 bg-blue-500/10' : 'border-transparent'}`}>
              <div className="text-[9px] text-slate-500 font-bold">CLT</div>
              <div className="flex items-center">
                <span className="text-sm font-black text-blue-400">{clout}</span>
                <svg className="w-6 h-3 inline-block ml-1" viewBox="0 0 24 10">
                  <path d="M0,8 Q6,4 12,7 T24,2" fill="none" stroke="#60a5fa" strokeWidth="1.5"/>
                </svg>
              </div>
            </div>

            {/* MENTAL HEALTH */}
            <div className={`flex flex-col items-center justify-center rounded border transition-all ${mentalHealth <= 25 ? 'animate-pulse border-red-500 bg-red-500/10' : 'border-transparent'} ${mentalHealth <= 20 ? 'animate-heartbeat' : ''}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">MNT</div>
              <div className="flex items-center">
                <span className={`${mentalHealth <= 25 ? 'text-base font-black tracking-tight text-rose-500 scale-105' : 'text-sm font-black text-emerald-400'}`}>{mentalHealth}%</span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,5 L4,5 L6,2 L8,8 L10,5 L24,5" fill="none" stroke="currentColor" strokeWidth={mentalHealth <= 25 ? "2.5" : "1.5"} />
                </svg>
              </div>
            </div>

            {/* AURA */}
            <div className={`flex flex-col items-center justify-center rounded border transition-all ${aura <= 10 ? 'animate-pulse border-purple-500 bg-purple-500/10' : 'border-transparent'}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">AUR</div>
              <div className="flex items-center">
                <span className={`${aura <= 10 ? 'text-base font-black tracking-tight text-purple-400 scale-105' : 'text-sm font-black text-purple-400'}`}>{aura}</span>
                <svg className="w-6 h-3 ml-1" viewBox="0 0 24 10">
                  <path d="M0,7 C4,7 6,3 12,5 S20,3 24,7" fill="none" stroke={aura <= 10 ? "currentColor" : "#a855f7"} strokeWidth="1.5" />
                </svg>
              </div>
            </div>

            {/* HEAT */}
            <div className={`flex flex-col items-center justify-center rounded border transition-all ${heat >= 80 ? 'animate-pulse border-orange-500 bg-orange-500/10' : 'border-transparent'}`}>
              <div className="text-[9px] text-slate-500 font-bold uppercase">HT</div>
              <div className="flex items-center">
                <span className={`${heat >= 80 ? 'text-base font-black tracking-tight text-red-500' : 'text-sm font-black text-orange-400'}`}>{heat}%</span>
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

            // FLEX is a non-blocking sandbox, unlocked if CORPORATE (index 3) is reached
            const isFlex = tier === 'FLEX';
            const isLocked = isFlex
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

      {/* MINI-GAME OVERLAY */}
      <AnimatePresence>
        {activeMiniGame && (
          <MiniGameEngine
            type={activeMiniGame.type}
            onResult={(multiplier) => {
              const id = activeMiniGame.hustleId;
              setActiveMiniGame(null);
              // Win (1.0) or Draw (0.75) results in forced success.
              // Loss (0.5) lets the natural success chance decide, but yields half.
              const forceSuccess = multiplier >= 0.75 ? true : undefined;
              executeHustle(id, forceSuccess, multiplier);
            }}
          />
        )}
      </AnimatePresence>

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
      <div className="w-full flex flex-col gap-1 px-4 py-2 z-40">
        <AnimatePresence>
          {pl.crises.shadowbanTurns > 0 && (
            <div className="flex flex-col gap-1">
              <AlertPill color="bg-red-600">⚠️ SHADOWBANNED ({pl.crises.shadowbanTurns}mo)</AlertPill>
              <button
                onClick={() => state.resolveShadowban()}
                className="mx-auto px-4 py-1 bg-white/10 hover:bg-white/20 text-[9px] font-black uppercase rounded border border-white/20 transition-all"
              >
                Clear Shadowban (${RESOLVE_SHADOWBAN_COST.toLocaleString()})
              </button>
            </div>
          )}
          {pl.crises.accountsFrozen && (
            <AlertPill color="bg-red-900 border-2 border-white">🚫 ACCOUNTS FROZEN</AlertPill>
          )}
          {pl.crises.laborStrikeTurns > 0 && (
            <div className="flex flex-col gap-1">
              <AlertPill color="bg-orange-600 animate-pulse">⚠️ LABOR STRIKE ({pl.crises.laborStrikeTurns}mo)</AlertPill>
              <button
                onClick={() => state.resolveLaborStrike()}
                className="mx-auto px-4 py-1 bg-white/10 hover:bg-white/20 text-[9px] font-black uppercase rounded border border-white/20 transition-all"
              >
                Settle Strike (${RESOLVE_STRIKE_COST.toLocaleString()})
              </button>
            </div>
          )}
          {pl.crises.blacklistTurns > 0 && (
            <div className="flex flex-col gap-1">
              <AlertPill color="bg-slate-800 border border-red-500">🚫 BLACKLISTED ({pl.crises.blacklistTurns}mo)</AlertPill>
              <button
                onClick={() => state.resolveBlacklist()}
                className="mx-auto px-4 py-1 bg-white/10 hover:bg-white/20 text-[9px] font-black uppercase rounded border border-white/20 transition-all"
              >
                Launder Reputation (${RESOLVE_BLACKLIST_COST.toLocaleString()})
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showStats && (
          <StatsDashboard
            stats={pl.stats}
            flexAssets={pl.flexAssets}
            onClose={() => setShowStats(false)}
            monthsPlayed={pl.mo}
          deathBadge={deathBadge}
          />
        )}
      </AnimatePresence>

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
                Pay ${UNFREEZE_COST.toLocaleString()} Corporate Legal Retainer to Unfreeze Accounts
              </button>
           </div>
        )}

        {activeHustleView === null ? (
          (() => {
            if (activeTab === 'FLEX' as any || activeTab === 'FLEX1' as any) {
              return (
                <FlexMarket />
              );
            }

            const currentRankIdx = PROGRESSION_TIERS.indexOf(state.pl?.currentTier);
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
                    tone={HUSTLE_TONES[hustle.id]}
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
      {(() => {
        let tickerColor = 'text-emerald-400';
        if (mentalHealth <= 25) tickerColor = 'text-red-500';
        else if (heat >= 80) tickerColor = 'text-orange-500';
        else if (aura <= 10) tickerColor = 'text-purple-500';
        else if (clout <= 10) tickerColor = 'text-blue-500';

        return (
          <footer className={`fixed bottom-0 left-0 right-0 h-12 bg-slate-950 border-t border-slate-800 p-2 overflow-hidden z-50 text-[11px] font-mono ${tickerColor}`}>
            <div className="max-w-2xl mx-auto h-full flex flex-col justify-center">
              {news.slice(0, 2).map((msg: string, i: number) => (
                <div key={i} className="flex gap-2 whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-slate-700 shrink-0">[{i+1}]</span>
                  <span className={msg.startsWith('SYSTEM') ? 'text-blue-400 font-bold' : tickerColor}>{msg}</span>
                </div>
              ))}
              {news.length === 0 && <div className="text-slate-800 italic">SYSTEM READY... STANDBY FOR INPUT...</div>}
            </div>
          </footer>
        );
      })()}

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
  tone?: HustleTone;
}

function HustleCard({ title, onClick, disabled, icon, className, tone }: HustleCardProps) {
  const baseClass = "relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 text-center transition-all active:scale-[0.95] group";
  const disabledClass = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  const style = tone ? {
    borderColor: tone.colors.secondary,
    '--hover-border': tone.colors.primary,
  } as React.CSSProperties : {};

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${disabledClass} ${disabled ? 'opacity-40 grayscale' : ''} ${tone?.font || ''} ${className || ''}`}
      style={style}
      onMouseEnter={(e) => {
        if (!disabled && tone) {
          e.currentTarget.style.borderColor = tone.colors.primary;
          e.currentTarget.style.boxShadow = `0 0 15px ${tone.colors.primary}40`;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && tone) {
          e.currentTarget.style.borderColor = tone.colors.secondary;
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      <div className={`relative z-10 flex flex-col items-center justify-center gap-3`}>
        <div className="text-4xl mb-1">{icon}</div>
        <div
          className={`text-[10px] font-black uppercase tracking-widest transition-colors leading-tight`}
          style={{ color: tone ? tone.colors.accent : undefined }}
        >
          {title}
        </div>
      </div>
    </button>
  );
}

function SubGamePanel({ hustleId, onBack, state, onExecute }: { hustleId: string, onBack: () => void, state: GameState, onExecute: (id: string, forceSuccess?: boolean) => Promise<void> }) {
  const [subTab, setSubTab] = useState<'OPS' | 'PROG'>('OPS');
  const hasProgression = hustleId in HUSTLE_PROGRESSIONS;
  const Panel = PANEL_REGISTRY[hustleId] || DefaultPanel;

  if (!hasProgression) {
    return <Panel hustleId={hustleId} onBack={onBack} state={state} onExecute={onExecute} isEmbedded={false} />;
  }

  // Determine custom back label if possible
  const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === hustleId);
  const backLabel = config?.tier === 'STARTUP' ? 'Back to Startup Operations' : 'Back to Operations Panel';

  return (
    <div className="flex flex-col gap-4">
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <button
          onClick={() => setSubTab('OPS')}
          className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'OPS' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
        >
          Operations
        </button>
        <button
          onClick={() => setSubTab('PROG')}
          className={`px-4 py-2 rounded text-[10px] font-black uppercase tracking-widest transition-all ${subTab === 'PROG' ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20' : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'}`}
        >
          Progression
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
            </svg>
            {backLabel}
          </button>
          <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase">
            {subTab === 'OPS' ? 'Operational Mode' : 'Lineage Upgrade Tree'}
          </div>
        </div>

        {subTab === 'OPS' ? (
          <Panel hustleId={hustleId} onBack={onBack} state={state} onExecute={onExecute} isEmbedded={true} />
        ) : (
          <ProgressionPanel hustleId={hustleId} onBack={onBack} state={state} onExecute={onExecute} isEmbedded={true} />
        )}
      </div>
    </div>
  );
}



export default App;
