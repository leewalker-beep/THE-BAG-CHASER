import { useEffect, useRef } from 'react';
import { useGameStore } from './store/gameStore';
import { getInitialGameState } from './store/initialState';
import { TAB_TIER_MAPPING } from './store/types';
import type { GameState, GameTab } from './store/types';

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
                onClick={() => setActiveTab(t)}
                className={`px-3 py-1 rounded flex-none text-[9px] font-black uppercase tracking-tighter transition-all
                  ${isActive ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Active Hustles: {activeTab}</h2>
              <div className="text-[10px] font-mono text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20 uppercase">
                {marketType} MARKET
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {activeTab === 'MUD' && (
                <>
                  <HustleCard
                    title="Manual Labor"
                    yield="+$750"
                    cost="40 FATG"
                    locked={tier < 0}
                    lockText="Requires Mud Tier"
                    onClick={() => setActiveHustleView('labor')}
                    icon={<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03c2.09-.13 3.75-1.85 3.75-3.97V22h2.5v-9.03c2.09-.13 3.75-1.85 3.75-3.97V2h-2v7z"/>}
                  />

                  <HustleCard
                    title="Delivery Gig"
                    yield="+$600-700"
                    cost="25 FATG"
                    locked={tier < 0}
                    lockText="Requires Mud Tier"
                    onClick={() => setActiveHustleView('delivery')}
                  />

                  <HustleCard
                    title="Surveys"
                    yield="+$520"
                    cost="0 FATG"
                    locked={tier < 0}
                    lockText="Requires Mud Tier"
                    onClick={() => setActiveHustleView('survey')}
                  />

                  <HustleCard
                    title="Sell Plasma"
                    yield="+$900"
                    cost="-25 SAN"
                    locked={tier < 0}
                    lockText="Requires Mud Tier"
                    disabled={plasmaUsedThisMonth}
                    onClick={() => setActiveHustleView('plasma')}
                    variant="danger"
                  />
                </>
              )}

              {activeTab === 'STREET' && (
                <>
                  <HustleCard
                    title="Creator Content"
                    yield="+1K SUBS"
                    cost="$400"
                    locked={tier < 1}
                    lockText="Requires Street Tier"
                    onClick={() => setActiveHustleView('cc')}
                  />
                  <HustleCard
                    title="Podcast Syndicate"
                    yield="+$1.5K"
                    cost="$200"
                    locked={tier < 1}
                    lockText="Requires Street Tier"
                    onClick={() => setActiveHustleView('pod')}
                  />
                  <HustleCard
                    title="Music Syndicate"
                    yield="ROYALTY"
                    cost="$1K"
                    locked={tier < 1}
                    lockText="Requires Street Tier"
                    onClick={() => setActiveHustleView('music')}
                  />
                  <HustleCard
                    title="Drip Label"
                    yield="+$4K"
                    cost="$1.5K"
                    locked={tier < 1}
                    lockText="Requires Street Tier"
                    onClick={() => setActiveHustleView('drip')}
                  />
                  <HustleCard
                    title="Night Promo"
                    yield="CASH BURST"
                    cost="HIGH RISK"
                    locked={tier < 1}
                    lockText="Requires Street Tier"
                    onClick={() => setActiveHustleView('promo')}
                    variant="danger"
                  />
                  <HustleCard
                    title="Meme Dev"
                    yield="MULTIPLIER"
                    cost="$2K"
                    locked={tier < 1}
                    lockText="Requires Street Tier"
                    onClick={() => setActiveHustleView('meme')}
                    variant="special"
                  />
                </>
              )}

              {activeTab === 'STARTUP' && (
                <>
                  <HustleCard
                    title="SaaS MVP"
                    yield="+500 USERS"
                    cost="$5K"
                    locked={tier < 2}
                    lockText="Requires Startup Tier"
                    onClick={() => setActiveHustleView('saas_mvp')}
                  />
                  <HustleCard
                    title="Agency Scale"
                    yield="+$6.5K"
                    cost="40 CLT"
                    locked={tier < 2}
                    lockText="Requires Startup Tier"
                    onClick={() => setActiveHustleView('agency_scale')}
                  />
                  <HustleCard
                    title="Ecom Brand"
                    yield="+$9K"
                    cost="$2.5K"
                    locked={tier < 2}
                    lockText="Requires Startup Tier"
                    onClick={() => setActiveHustleView('ecom_brand')}
                  />
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
                disabled={bag < 5000 || clout < 20 || aura < 20}
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
  yield: string;
  cost: string;
  onClick: () => void;
  disabled?: boolean;
  locked?: boolean;
  lockText?: string;
  variant?: 'danger' | 'special' | 'default';
  icon?: React.ReactNode;
}

function HustleCard({ title, yield: y, cost, onClick, disabled, locked, lockText, variant, icon }: HustleCardProps) {
  const baseClass = "relative overflow-hidden bg-slate-900 border border-slate-800 rounded-xl p-3 text-left transition-all active:scale-[0.98] group";
  const colorClass = variant === 'danger' ? 'hover:border-red-500/50' : variant === 'special' ? 'hover:border-purple-500/50' : 'hover:border-slate-600';
  const disabledClass = (disabled || locked) ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button onClick={locked ? undefined : onClick} disabled={disabled} className={`${baseClass} ${colorClass} ${disabledClass} ${disabled ? 'opacity-40 grayscale' : ''}`}>
      <div className={`relative z-10 ${locked ? 'blur-[2px] opacity-30' : ''}`}>
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
      {locked && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
          <div className="bg-slate-950/80 border border-slate-700 px-2 py-1 rounded text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zM7 7a3 3 0 116 0v2H7V7z"></path></svg>
            {lockText || 'Locked'}
          </div>
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
      drop: 'Flash Drop',
      cc: 'Creator Content',
      pod: 'Podcast Syndicate',
      music: 'Music Syndicate',
      drip: 'Drip Label',
      promo: 'Night Promo',
      meme: 'Meme Dev',
      saas_mvp: 'SaaS MVP',
      agency_scale: 'Agency Scale',
      ecom_brand: 'Ecom Brand'
    };
    return titles[id] || id.toUpperCase();
  };

  const getHustleMetrics = (id: string) => {
    const { streetStats, startupStats } = state.pl;
    switch (id) {
      case 'cc': return `Subscribers: ${streetStats.ccSubs.toLocaleString()}`;
      case 'pod': return `Episodes: ${streetStats.podEpisodes}`;
      case 'music': return `Active Tracks: ${streetStats.audioTracks}`;
      case 'drip': return `Inventory: ${streetStats.dripStock}`;
      case 'meme': return `Active Tokens: ${streetStats.activeMemeTokens}`;
      case 'saas_mvp': return `Active Users: ${startupStats.saasUsers.toLocaleString()}`;
      case 'agency_scale': return `Agency Staff: ${startupStats.agencyStaff}`;
      case 'ecom_brand': return `Monthly Orders: ${startupStats.ecomOrders.toLocaleString()}`;
      default: return null;
    }
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
      cc: state.runCreatorContent,
      pod: state.runPodcastSyndicate,
      music: state.runMusicSyndicate,
      drip: state.runDripLabel,
      promo: state.runNightPromo,
      meme: state.runMemeDev,
      saas_mvp: state.runSaasMvp,
      agency_scale: state.runAgencyScale,
      ecom_brand: state.runEcomBrand,
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

  const metrics = getHustleMetrics(hustleId);
  const isStartupHustle = ['saas_mvp', 'agency_scale', 'ecom_brand'].includes(hustleId);

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
        <h2 className="text-2xl font-black italic tracking-tighter uppercase">{getHustleTitle(hustleId)}</h2>
        <p className="text-xs text-slate-500 mt-1">Management and execution of {getHustleTitle(hustleId)} operations.</p>
      </div>

      {metrics && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
           <div className="text-[10px] font-black text-emerald-500 uppercase mb-1 tracking-widest">Status Metrics</div>
           <div className="text-lg font-black text-white">{metrics}</div>
        </div>
      )}

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
        {/* GRANULAR MECHANICS INJECTION POINT */}
      </div>

      <button
        onClick={runHustle}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
      >
        Execute {getHustleTitle(hustleId)} for the Month
      </button>
    </div>
  );
}


export default App;
