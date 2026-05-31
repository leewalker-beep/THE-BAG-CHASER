import { useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore';
import { getInitialGameState } from './store/initialState';
import { TAB_TIER_MAPPING } from './store/types';
import type { GameState, GameTab } from './store/types';
import { MASTER_HUSTLE_REGISTRY } from './engine/hustleRegistry';

function App() {
  const state = useGameStore();

  const {
    pl, ph, alias, marketType, fatalCause, news,
    activeTab, setActiveTab, activeHustleView, setActiveHustleView
  } = state;
  const {
    bag, aura, clout, mentalHealth, heat, mo, plasmaUsedThisMonth,
    tier
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
          {(Object.keys(TAB_TIER_MAPPING) as GameTab[]).map((t) => {
            const isActive = activeTab === t;
            return (
              <button
                key={t}
                disabled={pl.crises.accountsFrozen}
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded flex-none text-[9px] font-black uppercase tracking-tighter transition-all
                  ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'} ${pl.crises.accountsFrozen ? 'opacity-20 cursor-not-allowed' : ''}`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </header>

      {/* STEP 1.5: CRISIS BANNERS */}
      <div className="fixed top-24 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-2">
           {pl.crises.shadowbanTurns > 0 && (
             <div className="bg-red-900/80 backdrop-blur border border-red-500 p-2 rounded text-[10px] font-black text-white uppercase text-center animate-pulse">
               ⚠️ SHADOWBANNED ({pl.crises.shadowbanTurns} mo)
             </div>
           )}
           {pl.crises.deadstockOverhead > 0 && (
             <div className="bg-orange-900/80 backdrop-blur border border-orange-500 p-2 rounded text-[10px] font-black text-white uppercase text-center">
               📦 DEADSTOCK BURN (+${pl.crises.deadstockOverhead}/mo)
             </div>
           )}
           {pl.crises.accountsFrozen && (
             <div className="bg-red-600 border-2 border-white p-2 rounded text-[10px] font-black text-white uppercase text-center">
               🚫 ACCOUNTS FROZEN
             </div>
           )}
           {pl.crises.blacklistTurns > 0 && (
             <div className="bg-slate-900 border border-slate-500 p-2 rounded text-[10px] font-black text-white uppercase text-center">
               ❌ ELITE BLACKLIST ({pl.crises.blacklistTurns} mo)
             </div>
           )}
           {pl.crises.laborStrikeTurns > 0 && (
             <div className="bg-red-800/90 border border-white p-2 rounded text-[10px] font-black text-white uppercase text-center animate-pulse">
               ⚠️ LABOR STRIKE ({pl.crises.laborStrikeTurns} mo)
             </div>
           )}
        </div>
      </div>

      {/* STEP 3: THE CENTER CORES (UNIFORM 2-COLUMN GRID) */}
      <main className="pt-32 pb-32 px-4 max-w-2xl mx-auto">
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
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Hustles: {activeTab}</h2>
              <div className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                {marketType} MARKET
              </div>
            </div>

            <div className="mb-2">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Business & Active Operations</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-8 w-full">
              {(() => {
                const currentTabHustles = MASTER_HUSTLE_REGISTRY.filter(h => h.tier === activeTab);
                const operations = currentTabHustles.filter(h => !h.id.startsWith('r_') || h.isPassive);
                return operations.map(h => {
                  const isFranchise = h.id === 'global_franchise';
                  return (
                    <HustleCard
                      key={h.id}
                      title={h.name}
                      locked={tier < TAB_TIER_MAPPING[h.tier]}
                      lockText={`LOCKED: ${activeTab} TIER`}
                      onClick={() => setActiveHustleView(h.id)}
                      icon={h.icon}
                      className={isFranchise ? "border-indigo-500/30 shadow-lg shadow-indigo-900/10" : ""}
                    />
                  );
                });
              })()}
            </div>

            <hr className="border-slate-800 my-6" />

            <div className="mb-2">
              <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Lifestyle & Empire Logistics</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full">
              {(() => {
                const currentTabHustles = MASTER_HUSTLE_REGISTRY.filter(h => h.tier === activeTab);
                const logistics = currentTabHustles.filter(h => h.id.startsWith('r_') && !h.isPassive);
                return logistics.map(h => {
                  return (
                    <HustleCard
                      key={h.id}
                      title={h.name}
                      locked={tier < TAB_TIER_MAPPING[h.tier]}
                      lockText={`LOCKED: ${activeTab} TIER`}
                      disabled={h.id === 'r_plasma' && plasmaUsedThisMonth}
                      onClick={() => setActiveHustleView(h.id)}
                      icon={h.icon}
                    />
                  );
                });
              })()}
            </div>
          </>
        ) : (
          <SubGamePanel
            hustleId={activeHustleView}
            onBack={() => setActiveHustleView(null)}
            state={state}
          />
        )}

        {tier === 0 && activeTab === 'MUD' && (
           <div className="mt-8 p-6 bg-gradient-to-br from-yellow-900/10 to-transparent border border-yellow-900/30 rounded-2xl flex flex-col items-center gap-4">
              <div className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">HQ Graduation</div>
              <div className="flex gap-4 text-[10px] font-mono">
                 <span className={bag >= 5000 ? 'text-emerald-400' : 'text-slate-600'}>${bag.toLocaleString()}/5K</span>
                 <span className={clout >= 20 ? 'text-emerald-400' : 'text-slate-600'}>{clout}/20 CLT</span>
                 <span className={aura >= 20 ? 'text-emerald-400' : 'text-slate-600'}>{aura}/20 AUR</span>
              </div>
              <button
                onClick={state.escapeTheMud}
                disabled={bag < 5000 || clout < 20 || aura < 20 || pl.crises.accountsFrozen}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 disabled:opacity-20 text-white text-xs font-black rounded uppercase tracking-widest transition-all shadow-lg shadow-yellow-900/20"
              >
                Sign HQ Lease ($3,000)
              </button>
           </div>
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
  onClick: () => void;
  disabled?: boolean;
  locked?: boolean;
  lockText?: string;
  icon: string;
  className?: string;
}

function HustleCard({ title, onClick, disabled, locked, lockText, icon, className }: HustleCardProps) {
  const baseClass = "relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-6 text-center transition-all active:scale-[0.95] group";
  const colorClass = "hover:border-emerald-500/50";
  const disabledClass = (disabled || locked) ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      onClick={locked ? undefined : onClick}
      disabled={disabled}
      className={`${baseClass} ${colorClass} ${disabledClass} ${disabled ? 'opacity-40 grayscale' : ''} ${locked ? 'pointer-events-none' : ''} ${className || ''}`}
    >
      <div className={`relative z-10 flex flex-col items-center justify-center gap-3 ${locked ? 'opacity-20 blur-[2px]' : ''}`}>
        <div className="text-4xl mb-1">{icon}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors leading-tight">{title}</div>
      </div>
      {locked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40">
          <div className="bg-slate-950/90 border border-slate-700 px-3 py-1 rounded text-[8px] font-black text-slate-200 uppercase tracking-widest flex items-center gap-1 shadow-2xl">
            {lockText || 'LOCKED'}
          </div>
        </div>
      )}
    </button>
  );
}

function SubGamePanel({ hustleId, onBack, state }: { hustleId: string, onBack: () => void, state: GameState }) {
  const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === hustleId);
  const currentLvl = state.pl.hustleLevels[hustleId] || 1;

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
          onClick={() => state.executeFranchiseTurn()}
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

  const executeHustle = () => {
    state.executeHustle(hustleId);
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
          onClick={() => state.executeSaaSProject()}
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
    const venueCosts = { FAIR: 3000, ARENA: 10000, STADIUM: 25000 };
    const insuranceCost = 2000;
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
            EVENT PROMOTER
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-purple-400">CONCERT FESTIVAL LAB</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Venue Selection</label>
            <div className="grid grid-cols-3 gap-2">
              {(['FAIR', 'ARENA', 'STADIUM'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => state.setFestivalInput('venue', v)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${venue === v ? 'bg-purple-600 border-purple-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700">
            <div>
              <div className="text-[10px] font-black text-white uppercase">Event Insurance</div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Recover 80% on failure ($2,000)</div>
            </div>
            <button
              onClick={() => state.setFestivalInput('insured', !insured)}
              className={`w-12 h-6 rounded-full transition-all relative ${insured ? 'bg-emerald-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${insured ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Ticket Price ($)</label>
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
            <span className="text-[10px] font-black text-slate-500 uppercase">Upfront Production</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Est. Success Chance</span>
            <span className="font-mono font-bold text-emerald-400">75%</span>
          </div>
        </div>

        <button
          onClick={() => state.executeConcertFestival()}
          disabled={!canAfford}
          className="w-full py-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98]"
        >
          {canAfford ? "LAUNCH FESTIVAL WEEKEND" : "INSUFFICIENT FUNDS"}
        </button>
      </div>
    );
  }

  if (hustleId === 'ecom_brand') {
    const { runSize, adSpend } = state.pl.ecomBrandPanel;
    const baseCost = runSize === 500 ? 2500 : 7500;
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
            D2C WAREHOUSE
          </div>
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none text-orange-400">ECOM BRAND BUILDER</h2>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Production Run Size</label>
            <div className="grid grid-cols-2 gap-2">
              {([500, 2000] as const).map(s => (
                <button
                  key={s}
                  onClick={() => state.setEcomBrandInput('runSize', s)}
                  className={`py-2 rounded text-[10px] font-black transition-all border ${runSize === s ? 'bg-orange-600 border-orange-400 text-white shadow-lg' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {s} UNITS
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Ad Spend Slider ($)</label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="1000"
              value={adSpend}
              onChange={(e) => state.setEcomBrandInput('adSpend', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
            <div className="flex justify-between text-[8px] font-black text-slate-600 mt-1 uppercase tracking-tighter">
              <span>$1,000</span>
              <span>${adSpend.toLocaleString()}</span>
              <span>$20,000</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl border bg-slate-800/50 border-slate-700">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-black text-slate-500 uppercase">Inventory + Marketing</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Customs Risk</span>
            <span className="font-mono font-bold text-orange-400">15% Seizure Rate</span>
          </div>
        </div>

        <button
          onClick={() => state.executeEcomBrand()}
          disabled={!canAfford}
          className="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 active:scale-[0.98]"
        >
          {canAfford ? "EXECUTE PRODUCTION RUN" : "INSUFFICIENT FUNDS"}
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
          onClick={() => state.executeAgencyRetainer()}
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
          onClick={() => state.executeTechFlipDrop()}
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
          onClick={() => state.executePodcastEpisode()}
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

  if (hustleId === 'drop' || hustleId === 'vintage') {
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
          {rankInfo && (
            <div className="text-right">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest leading-none">Rank</div>
              <div className="text-[11px] font-bold text-white italic">{rankInfo.title}</div>
            </div>
          )}
        </div>

        <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">STREETWEAR DRIP LAB</h2>

        {/* Section 1: Sourcing Options */}
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Batch Size Selection</label>
            <div className="grid grid-cols-3 gap-2">
              {[50, 200, 500].map(size => (
                <button
                  key={size}
                  onClick={() => state.setSwInput('selectedBatchSize', size)}
                  className={`py-2 rounded text-xs font-bold transition-all border ${selectedBatchSize === size ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {size} units
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Garment Quality Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {(['BUDGET', 'PREMIUM', 'LUXURY'] as const).map(q => (
                <button
                  key={q}
                  onClick={() => state.setSwInput('selectedQuality', q)}
                  className={`py-2 rounded text-xs font-bold transition-all border ${selectedQuality === q ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2: Pricing Logic */}
        <div>
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">Retail Price ($)</label>
          <input
            type="number"
            value={retailPrice}
            onChange={(e) => state.setSwInput('retailPrice', parseInt(e.target.value) || 0)}
            className="w-full bg-black border border-slate-800 rounded p-3 text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Section 3: Live Projections Card */}
        <div className={`p-4 rounded-xl border ${canAfford ? 'bg-slate-800/50 border-slate-700' : 'bg-red-900/20 border-red-900/50'}`}>
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase">Est. Manufacturing Cost</span>
            <span className={`font-mono font-bold ${canAfford ? 'text-white' : 'text-red-500'}`}>${totalCost.toLocaleString()}</span>
          </div>
          {!canAfford && (
            <div className="mt-2 text-[10px] font-bold text-red-500 uppercase tracking-tighter">
              ⚠️ Insufficient Bankroll to fund production
            </div>
          )}
        </div>

        {/* Section 4: Launch Drop */}
        <button
          onClick={() => state.executeStreetwearDrop()}
          disabled={!canAfford || state.pl.swCooldownTurns > 0}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
        >
          {state.pl.swCooldownTurns > 0
            ? `Cooldown: ${state.pl.swCooldownTurns} Months Remaining`
            : "LAUNCH MONTHLY FLASH DROP"}
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
              <span className="text-xs font-mono text-slate-500 italic">0% (AUTO)</span>
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
          onClick={executeHustle}
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
