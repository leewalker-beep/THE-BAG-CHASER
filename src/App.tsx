import { useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore';
import { getInitialGameState } from './store/initialState';
import { TAB_TIER_MAPPING } from './store/types';
import type { GameState, GameTab } from './store/types';
import { PROGRESSION_MATRIX, type TierMilestone } from './engine/progressionMatrix';
import { FLEX_ITEMS_REGISTRY, type FlexItemConfig } from './engine/flexRegistry';

function App() {
  const state = useGameStore();
  const {
    pl, ph, alias, unlockedHustles, marketType, fatalCause, news,
    activeTab, setActiveTab, activeHustleView, setActiveHustleView
  } = state;
  const {
    bag, aura, clout, mentalHealth, heat, mo, plasmaUsedThisMonth,
    swCooldownTurns, tier
  } = pl;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [news]);

  const resetGame = (d: 1 | 2 | 3) => {
    const initialState = getInitialGameState(d);
    useGameStore.setState({ ...(initialState as GameState), ph: 'PLAYING' });
  };

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
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30">
      {/* STEP 1: THE STICKY TOP ZONE (STATS HUD) */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur border-b border-slate-800 p-3 pb-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto no-scrollbar mb-2">
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-emerald-600 h-8 w-8 rounded-full flex items-center justify-center font-black text-xs shadow-lg shadow-emerald-900/20">
              {alias.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-tight">{alias}</div>
              <div className="text-[10px] text-slate-500 font-bold">Age: {ageYears}y {ageMonths}m</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
              <div className="text-[9px] uppercase text-slate-500 font-black leading-none mb-1">Bankroll</div>
              <div data-testid="bankroll-value" className="text-sm font-black text-emerald-400 leading-none">${bag.toLocaleString()}</div>
            </div>

            <div className="h-8 w-[1px] bg-slate-800 mx-1"></div>

            <div className="flex gap-3">
              <StatBadge label="CLT" value={clout} color="text-blue-400" />
              <StatBadge label="AUR" value={aura} color="text-purple-400" />
              <StatBadge label="MNT" value={`${mentalHealth}%`} color={mentalHealth < 30 ? "text-red-500" : "text-slate-300"} />
              <StatBadge label="HT" value={`${heat}%`} color={heat > 50 ? "text-orange-500" : "text-slate-500"} />
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {(['MUD', 'STREET', 'STARTUP', 'CORPORATE', 'FLEX1', 'ELITE', 'MOGUL', 'FLEX2', 'PRESIDENT', 'OPEN', 'EXP'] as GameTab[]).map((t) => {
            const requiredTier = TAB_TIER_MAPPING[t];
            // Allow viewing the next tier's tab if it's the immediate next one
            const isClickable = tier >= requiredTier || requiredTier === tier + 1;
            const isLocked = tier < requiredTier;
            const isActive = activeTab === t;

            return (
              <button
                key={t}
                onClick={() => isClickable && setActiveTab(t)}
                className={`px-3 py-1 rounded flex-none text-[9px] font-black uppercase tracking-tighter transition-all
                  ${isActive ? 'bg-emerald-600 text-white' :
                    !isClickable ? 'bg-slate-800/50 text-slate-700 cursor-not-allowed' :
                    isLocked ? 'bg-slate-800/50 text-slate-400 cursor-pointer' :
                    'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </header>

      {/* STEP 3: THE CENTER CORES (2-COLUMN HUSTLE GRID) */}
      <main className="pt-28 pb-32 px-4 max-w-2xl mx-auto">
        {activeHustleView === null ? (
          <>
            {TAB_TIER_MAPPING[activeTab] === tier + 1 && (
               <MilestoneCard
                 milestone={PROGRESSION_MATRIX[tier]}
                 currentStats={{ bag, clout, aura }}
                 onUpgrade={state.performUpgrade}
               />
            )}

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                {activeTab.startsWith('FLEX') ? 'Luxury Assets' : `Active Hustles: ${activeTab}`}
              </h2>
              <div className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                {marketType} MARKET
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {(activeTab === 'FLEX1' || activeTab === 'FLEX2') && (
                FLEX_ITEMS_REGISTRY
                  .filter(item => item.tab === activeTab)
                  .map(item => (
                    <FlexItemCard
                      key={item.id}
                      item={item}
                      owned={pl.ownedFlexIds.includes(item.id)}
                      canAfford={bag >= item.cost}
                      onBuy={() => state.buyFlexItem(item.id)}
                    />
                  ))
              )}

              {activeTab === 'MUD' && (
                <>
                  {unlockedHustles.labor && (
                    <HustleCard
                      title="Manual Labor"
                      yield="+$250"
                      cost="40 FATG"
                      onClick={() => setActiveHustleView('labor')}
                      icon={<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03c2.09-.13 3.75-1.85 3.75-3.97V22h2.5v-9.03c2.09-.13 3.75-1.85 3.75-3.97V2h-2v7z"/>}
                    />
                  )}

                  {unlockedHustles.delivery && (
                    <HustleCard
                      title="Delivery Gig"
                      yield="+$150"
                      cost="25 FATG"
                      onClick={() => setActiveHustleView('delivery')}
                    />
                  )}

                  {unlockedHustles.survey && (
                    <HustleCard
                      title="Surveys"
                      yield="+$20"
                      cost="0 FATG"
                      onClick={() => setActiveHustleView('survey')}
                    />
                  )}

                  {unlockedHustles.plasma && (
                    <HustleCard
                      title="Sell Plasma"
                      yield="+$400"
                      cost="-25 SAN"
                      disabled={plasmaUsedThisMonth}
                      onClick={() => setActiveHustleView('plasma')}
                      variant="danger"
                    />
                  )}
                </>
              )}

              {activeTab === 'STREET' && (
                <>
                  {unlockedHustles.techFlip && (
                    <HustleCard
                      title="Tech Flip"
                      yield="REPAIR"
                      cost="FATIGUE"
                      onClick={() => setActiveHustleView('techFlip')}
                    />
                  )}

                  {unlockedHustles.vintage && (
                    <HustleCard
                      title="Vintage Stock"
                      yield="LIQUID"
                      cost="CASH"
                      onClick={() => setActiveHustleView('vintage')}
                    />
                  )}

                  {unlockedHustles.gig && (
                    <HustleCard
                      title="Gig Fleet"
                      yield="PASSIVE"
                      cost="RISK"
                      onClick={() => setActiveHustleView('gig')}
                    />
                  )}

                  {unlockedHustles.smm && (
                    <HustleCard
                      title="SMM Agency"
                      yield="RETAINER"
                      cost="CLOUT"
                      onClick={() => setActiveHustleView('smm')}
                    />
                  )}

                  {unlockedHustles.sw && (
                    <HustleCard
                      title="SW Drop"
                      yield="HYPER"
                      cost="COOLDOWN"
                      disabled={swCooldownTurns > 0}
                      onClick={() => setActiveHustleView('sw')}
                      variant="special"
                    />
                  )}

                  {unlockedHustles.drop && (
                    <HustleCard
                      title="Flash Drop"
                      yield="HYPER"
                      cost="COOLDOWN"
                      disabled={swCooldownTurns > 0}
                      onClick={() => setActiveHustleView('drop')}
                      variant="special"
                    />
                  )}
                </>
              )}
            </div>
          </>
        ) : (
          <SubGamePanel
            hustleId={activeHustleView}
            onBack={() => setActiveHustleView(null)}
            state={state}
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
    </div>
  );
}

function MilestoneCard({ milestone, currentStats, onUpgrade }: {
  milestone: TierMilestone,
  currentStats: { bag: number, clout: number, aura: number },
  onUpgrade: () => void
}) {
  if (!milestone) return null;

  const canUpgrade = currentStats.bag >= milestone.cashCost &&
                     currentStats.clout >= milestone.cloutReq &&
                     currentStats.aura >= milestone.auraReq;

  return (
    <div className="mb-8 p-6 bg-gradient-to-br from-yellow-900/20 to-slate-900 border border-yellow-600/30 rounded-2xl flex flex-col items-center gap-4 animate-in slide-in-from-top-4 duration-500">
      <div className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">{milestone.toTier} MILESTONE</div>
      <h3 className="text-xl font-black italic uppercase tracking-tighter text-white">{milestone.actionLabel}</h3>

      <div className="grid grid-cols-3 gap-6 w-full max-w-sm">
        <Requirement item={`$${milestone.cashCost.toLocaleString()}`} met={currentStats.bag >= milestone.cashCost} />
        <Requirement item={`${milestone.cloutReq} CLT`} met={currentStats.clout >= milestone.cloutReq} />
        <Requirement item={`${milestone.auraReq} AUR`} met={currentStats.aura >= milestone.auraReq} />
      </div>

      <button
        onClick={onUpgrade}
        disabled={!canUpgrade}
        className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-10 text-white text-xs font-black rounded-xl uppercase tracking-[0.2em] transition-all shadow-xl shadow-yellow-900/40 active:scale-[0.98]"
      >
        Execute Upgrade (${milestone.cashCost.toLocaleString()})
      </button>
      <p className="text-[10px] text-slate-500 font-bold uppercase italic">Increases monthly expenses to ${milestone.newExpenses.toLocaleString()}/mo</p>
    </div>
  );
}

function Requirement({ item, met }: { item: string, met: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`text-xs font-black ${met ? 'text-emerald-400' : 'text-slate-600'}`}>{item}</div>
      <div className={`h-1 w-full mt-1 rounded-full ${met ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
    </div>
  );
}

function FlexItemCard({ item, owned, canAfford, onBuy }: { item: FlexItemConfig, owned: boolean, canAfford: boolean, onBuy: () => void }) {
  return (
    <div className={`relative overflow-hidden bg-slate-900 border ${owned ? 'border-emerald-500/30' : 'border-slate-800'} rounded-xl p-4 flex flex-col gap-3 transition-all`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-[10px] font-black uppercase tracking-tight text-slate-500 mb-1">{item.name}</div>
          <div className="text-lg font-black text-white italic tracking-tighter uppercase">${item.cost.toLocaleString()}</div>
        </div>
        {owned && <div className="bg-emerald-500 text-black text-[8px] font-black px-2 py-0.5 rounded uppercase">Owned</div>}
      </div>

      <p className="text-[10px] text-slate-400 leading-relaxed h-8 overflow-hidden">{item.description}</p>

      <div className="flex justify-between items-center mt-2">
        <div className="text-[9px] font-bold text-slate-600 uppercase">Upkeep: ${item.monthlyUpkeep}/mo</div>
        {!owned && (
          <button
            onClick={onBuy}
            disabled={!canAfford}
            className="px-4 py-1.5 bg-white text-black text-[9px] font-black rounded uppercase hover:bg-emerald-400 disabled:opacity-20 transition-colors"
          >
            Buy
          </button>
        )}
      </div>
    </div>
  );
}

function StatBadge({ label, value, color }: { label: string, value: string | number, color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="text-[8px] font-black text-slate-600 leading-none mb-1">{label}</div>
      <div className={`text-xs font-bold leading-none ${color}`}>{value}</div>
    </div>
  );
}

interface HustleCardProps {
  title: string;
  yield: string;
  cost: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'danger' | 'special' | 'default';
  icon?: React.ReactNode;
}

function HustleCard({ title, yield: y, cost, onClick, disabled, variant, icon }: HustleCardProps) {
  const baseClass = "relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-3 text-left transition-all active:scale-[0.98] group";
  const colorClass = variant === 'danger' ? 'hover:border-red-500/50' : variant === 'special' ? 'hover:border-purple-500/50' : 'hover:border-slate-600';
  const disabledClass = disabled ? 'opacity-40 grayscale cursor-not-allowed' : 'cursor-pointer';

  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClass} ${colorClass} ${disabledClass}`}>
      <div className="relative z-10">
        <div className="text-[10px] font-black uppercase tracking-tight text-slate-400 mb-1 group-hover:text-white transition-colors">{title}</div>
        <div className="flex justify-between items-end">
          <div className="text-sm font-black text-emerald-400">{y}</div>
          <div className="text-[9px] font-bold text-slate-600 uppercase">{cost}</div>
        </div>
      </div>
      {icon && (
        <div className="absolute top-1 right-1 opacity-5 group-hover:opacity-10 transition-opacity">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">{icon}</svg>
        </div>
      )}
    </button>
  );
}

function SubGamePanel({ hustleId, onBack, state }: { hustleId: string, onBack: () => void, state: GameState }) {
  const getHustleTitle = (id: string) => {
    const titles: Record<string, string> = {
      labor: 'Manual Labor',
      delivery: 'Delivery Gig',
      survey: 'Surveys',
      plasma: 'Sell Plasma',
      techFlip: 'Tech Flip',
      vintage: 'Vintage Stock',
      gig: 'Gig Fleet',
      smm: 'SMM Agency',
      sw: 'Streetwear Drop',
      drop: 'Flash Drop'
    };
    return titles[id] || id.toUpperCase();
  };

  const runHustle = () => {
    const actions: Record<string, () => void> = {
      labor: state.rLabor,
      delivery: state.rDelivery,
      survey: state.rSurvey,
      plasma: state.rPlasma,
      techFlip: state.rTechFlip,
      vintage: state.rVintage,
      gig: state.rGig,
      smm: state.rSmm,
      sw: state.rSw,
      drop: state.rDrop,
    };
    if (actions[hustleId]) {
      actions[hustleId]();
      // Placeholder actions don't advance time internally, so we do it here.
      // Mud-tier manual actions and drops already call applyAdvancement(1).
      if (['techFlip', 'vintage', 'gig', 'smm'].includes(hustleId)) {
        state.adv(1);
      }
    }
  };

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
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{getHustleTitle(hustleId)}</h2>
        <p className="text-xs text-slate-500 mt-1">Management and execution of {getHustleTitle(hustleId)} operations.</p>
      </div>

      <div className="bg-black/50 border border-slate-800 rounded-xl p-4">
        <div className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-[0.2em]">Operating Controls</div>
        <div className="grid grid-cols-1 gap-4 opacity-50 cursor-not-allowed">
           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400">Unit Size / Capacity</span>
              <span className="text-xs font-mono">DEFAULT_V1</span>
           </div>
           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400">Yield Optimization</span>
              <span className="text-xs font-mono">1.0x (BASE)</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">Risk Mitigation</span>
              <span className="text-xs font-mono">0% (AUTO)</span>
           </div>
        </div>
      </div>

      <button
        onClick={runHustle}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        Execute Operation (+1 Month)
      </button>
    </div>
  );
}


export default App;
