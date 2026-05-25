import { GameProvider, useGame } from './GameEngine.jsx';
import { MARKETS } from './config.js';
import { styles } from './styles.js';

import {
  LockedTierScreen
} from './components/ui/Shared.jsx';

import { Hud } from './components/layout/Hud.jsx';
import { NewsTicker } from './components/layout/NewsTicker.jsx';
import { NotificationOverlay } from './components/ui/NotificationOverlay.jsx';

import {
  SwTab,
  DropTab,
  TechFlipTab,
  GigTab,
  DeliveryTab,
  PlasmaTab,
  SurveyTab,
  LaborTab
} from './components/tabs/MudTabs.jsx';
import { VintageTab } from './components/tabs/VintageTab.jsx';
import { SmmTab } from './components/tabs/SmmTab.jsx';
import {
  CcTab,
  PodTab,
  BoxTab,
  AudioTab
} from './components/tabs/StreetTabs.jsx';
import {
  TechTab,
  AiAgencyTab,
  CreTab,
  FranchiseTab
} from './components/tabs/CorpTabs.jsx';
import {
  TourTab,
  PeTab,
  ArtTab,
  CrpTab
} from './components/tabs/EliteTabs.jsx';
import { MovieMogulTab } from './components/tabs/MovieMogulTab.jsx';
import {
  HfTab,
  AiTab,
  ConglomerateTab,
  PmcTab,
  SovereignTab,
  BillTab
} from './components/tabs/MogulTabs.jsx';
import {
  SuperPacTab,
  BlitzTab,
  SmearTab,
  ElectionTab
} from './components/tabs/PresidentTabs.jsx';
import { PoliticalSyndicateTab } from './components/tabs/PoliticalSyndicateTab.jsx';
import { CorporateFlexesTab } from './components/tabs/CorporateFlexesTab.jsx';
import { SovereignFlexesTab } from './components/tabs/SovereignFlexesTab.jsx';
import ElectionWarRoomTab from './components/tabs/ElectionWarRoomTab.jsx';
import VictorySpeechTab from './components/tabs/VictorySpeechTab.jsx';

import { TierHub } from './components/views/TierHub.jsx';
import { AutopsyReport } from './components/views/AutopsyReport.jsx';
import { Prologue } from './components/views/Prologue.jsx';
import { GameIntro } from './components/views/GameIntro.jsx';
import { ExpView } from './components/views/ExpView.jsx';


const TAB_MAP = {
  'HUB':          { component: TierHub },
  'SW':           { component: SwTab,           tier: 0 },
  'DROP':         { component: DropTab,         tier: 0 },
  'VINTAGE':      { component: VintageTab,      tier: 0 },
  'SMM':          { component: SmmTab,          tier: 0 },
  'TECH_FLIP':    { component: TechFlipTab,     tier: 0 },
  'GIG':          { component: GigTab,          tier: 0 },
  'DELIVERY':     { component: DeliveryTab,     tier: 0 },
  'PLASMA':       { component: PlasmaTab,       tier: 0 },
  'SURVEY':       { component: SurveyTab,       tier: 0 },
  'LABOR':        { component: LaborTab,        tier: 0 },
  'CC':           { component: CcTab,           tier: 1 },
  'POD':          { component: PodTab,          tier: 1 },
  'BOX':          { component: BoxTab,          tier: 1 },
  'AUDIO':        { component: AudioTab,        tier: 1 },
  'TECH':         { component: TechTab,         tier: 2 },
  'AI_AGENCY':    { component: AiAgencyTab,     tier: 2 },
  'CRE_FLIP':     { component: CreTab,          tier: 2 },
  'FRANCHISE':    { component: FranchiseTab,    tier: 2 },
  'CRYP':         { component: CrpTab,          tier: 3 },
  'TOUR':         { component: TourTab,         tier: 3 },
  'PE_ROLLUP':    { component: PeTab,           tier: 3 },
  'ART_SPEC':     { component: ArtTab,          tier: 3 },
  'MOV':          { component: MovieMogulTab,   tier: 4 },
  'HF':           { component: HfTab,           tier: 4 },
  'AI':           { component: AiTab,           tier: 4 },
  'CONGLOMERATE': { component: ConglomerateTab, tier: 4 },
  'PMC':          { component: PmcTab,          tier: 4 },
  'SOVEREIGN':    { component: SovereignTab,    tier: 4 },
  'BILL':         { component: BillTab,         tier: 4 },
  'SYNDICATE':    { component: PoliticalSyndicateTab, tier: 4 },
  'CORP_FLEXES':  { component: CorporateFlexesTab,    tier: 2 },
  'SOV_FLEXES':   { component: SovereignFlexesTab,    tier: 3 },
  'WAR_ROOM':     { component: ElectionWarRoomTab,    tier: 5 },
  'PAC':          { component: SuperPacTab,     tier: 5 },
  'BLITZ':        { component: BlitzTab,        tier: 5 },
  'SMEAR':        { component: SmearTab,        tier: 5 },
  'ELECTION':     { component: ElectionTab,     tier: 5 },
  'VICTORY_SPEECH': { component: VictorySpeechTab, tier: 5 },
  'EXP':          { component: ExpView },
};

const GameInterface = () => {
  const game = useGame();
  const {
    pl, prs, ass, mkt, tab, setTab, mod, cancelIntro, isTierUnlocked, selTier, isBreakdownActive, shakeActive, rDischarge, performHardReset,
    activeEvent, isEventModalOpen, setIsEventModalOpen, isPresident, flex
  } = game || {};


  if (!game) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;

  const cancelIntroStyles = { userSelect: 'none' };

  if (cancelIntro) {
    return (
      <div className="min-h-screen bg-black text-white font-hack flex flex-col items-center justify-center p-4 text-center animate-shake-hard select-none" style={cancelIntroStyles}>
        <div className="text-8xl mb-6 animate-pulse">🚫</div>
        <h1 className="text-6xl font-black text-red-500 mb-4 tracking-widest drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] font-hype">CANCELLED</h1>
        <p className="text-slate-300 drop-shadow-sm text-xl max-w-sm leading-relaxed mb-6">{cancelIntro?.r}</p>
        <p className="text-pink-400 font-bold text-lg italic mb-8">"{cancelIntro?.i}"</p>
        <button
          onClick={performHardReset}
          className="px-8 py-4 bg-red-600 text-white font-black tracking-widest text-xl rounded-xl hover:bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all active:scale-95"
        >
          TRY AGAIN
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${game.isPresident ? 'bg-washington' : prs?.r ? 'bg-oval' : flex?.island?.owned ? 'bg-mansion' : flex?.penthouse?.owned ? 'bg-penthouse' : 'bg-basement'} ${shakeActive ? 'animate-shake-hard' : ''} ${(pl?.aura || 0) < 20 ? 'aura-panic' : ''}`}>


      {isBreakdownActive && (
        <div className="fixed inset-0 bg-purple-900/90 z-[200] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn">
          <div className="bg-black border-4 border-purple-500 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_100px_rgba(168,85,247,0.5)] animate-pulse">
            <div className="text-6xl mb-4">🧠💥</div>
            <h2 className="text-3xl font-black text-purple-400 mb-4 tracking-tighter">TOTAL NERVOUS BREAKDOWN</h2>
            <p className="text-slate-300 drop-shadow-sm mb-8 text-sm leading-relaxed">
              Your mind has buckled under the pressure of the hustle. You've been admitted to a luxury wellness retreat for mandatory recovery.
            </p>
            <div className="bg-purple-900/30 border border-purple-700 p-4 rounded-xl mb-8 text-left text-xs space-y-2">
              <div className="flex justify-between"><span>Time Lost:</span><span className="text-purple-300">1 Month</span></div>
              <div className="flex justify-between"><span>Retreat Fee:</span><span className="text-red-400">-$300</span></div>
              <div className="flex justify-between"><span>Mental Recovery:</span><span className="text-green-400">50%</span></div>
            </div>
            <button
              onClick={rDischarge}
              className="w-full py-4 bg-purple-600 text-white font-black tracking-widest rounded-xl hover:bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all active:scale-95 duration-100"
            >
              DISCHARGE FROM WELLNESS CARE
            </button>
          </div>
        </div>
      )}

      {mod?.s && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4 animate-fadeIn">
          <div className={`p-8 w-full max-w-sm ${mod?.ui} text-center shadow-[0_0_50px_rgba(0,0,0,1)]`}>
            <h2 className="text-3xl font-black mb-4 text-white tracking-widest">{mod?.t}</h2>
            <p className="mb-8 text-slate-300 drop-shadow-sm text-lg">{mod?.m}</p>
            <div className="flex flex-col gap-3">{mod?.o?.map((o, i) => <button key={i} onClick={o.action} className="p-4 bg-slate-800 border border-slate-600 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">{o.label}</button>)}</div>
          </div>
        </div>
      )}

      {isEventModalOpen && activeEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[250] flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border-2 border-amber-500/50 p-6 rounded-2xl max-w-sm w-full shadow-[0_0_40px_rgba(245,158,11,0.2)]">
            <h3 className="text-amber-500 font-black tracking-widest text-lg mb-2 uppercase font-hype italic">⚠️ {activeEvent.title}</h3>
            <p className="text-slate-200 text-sm leading-relaxed mb-6 font-medium italic">"{activeEvent.text}"</p>

            <div className="bg-black/40 rounded-xl p-3 border border-slate-800 mb-6 flex flex-wrap gap-3 justify-center">
              {activeEvent.bag !== 0 && <div className={`text-[10px] font-bold ${activeEvent.bag > 0 ? 'text-green-400' : 'text-red-400'}`}>BAG: {activeEvent.bag > 0 ? '+' : ''}${activeEvent.bag}</div>}
              {activeEvent.mh !== 0 && <div className={`text-[10px] font-bold ${activeEvent.mh > 0 ? 'text-green-400' : 'text-red-400'}`}>MH: {activeEvent.mh > 0 ? '+' : ''}{activeEvent.mh}</div>}
              {activeEvent.aura !== 0 && <div className={`text-[10px] font-bold ${activeEvent.aura > 0 ? 'text-green-400' : 'text-red-400'}`}>AURA: {activeEvent.aura > 0 ? '+' : ''}{activeEvent.aura}</div>}
              {activeEvent.clout !== 0 && <div className={`text-[10px] font-bold ${activeEvent.clout > 0 ? 'text-green-400' : 'text-red-400'}`}>CLOUT: {activeEvent.clout > 0 ? '+' : ''}{activeEvent.clout}</div>}
            </div>

            <button
              onClick={() => setIsEventModalOpen(false)}
              className="w-full py-3 bg-amber-600 text-white font-black rounded-xl hover:bg-amber-500 transition-all active:scale-95 uppercase text-xs tracking-widest"
            >
              CONTINUE THE MOTION
            </button>
          </div>
        </div>
      )}

      {isPresident && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[150] w-full max-w-md animate-fadeIn px-4">
          <div className="bg-gradient-to-r from-amber-600/30 via-yellow-400/50 to-amber-600/30 backdrop-blur-xl border-2 border-yellow-400/60 rounded-3xl p-4 text-center shadow-[0_0_50px_rgba(245,158,11,0.5)] washington-theme relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
            <div className="flex flex-col items-center gap-4 relative z-10">
              <div className="golden-seal">🦅</div>
              <div className="flex flex-col gap-1">
                <h2 className="text-yellow-100 font-black text-xs tracking-[0.3em] uppercase drop-shadow-md">The President of the United States</h2>
                <div className="h-0.5 w-32 bg-yellow-400/50 mx-auto"></div>
              </div>
              <button
                onClick={() => setTab('VICTORY_SPEECH')}
                className="bg-gradient-to-b from-yellow-300 to-yellow-600 text-black font-black text-xs px-8 py-3 rounded-xl hover:scale-105 transition-all active:scale-95 tracking-[0.2em] uppercase shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-2 border-yellow-200/50 animate-pulse"
              >
                EXECUTIVE ORDER: OVAL OFFICE
              </button>
            </div>
          </div>
        </div>
      )}

      <Hud />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-3 pb-16">
        <div key={tab + selTier} className="max-w-xl mx-auto animate-fadeIn">
          {(() => {
            const cfg = TAB_MAP[tab];
            if (!cfg) return null;
            const Component = cfg.component;
            if (cfg.tier !== undefined && !isTierUnlocked?.(cfg.tier)) {
              return <LockedTierScreen section={cfg.tier} />;
            }
            return <Component />;
          })()}

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700 my-6">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold tracking-widest mb-2 text-center uppercase">📡 REAL WORLD MONITOR</div>
            <div className={`text-center font-black text-sm mb-1 ${mkt === 1 ? 'text-green-400' : mkt === 2 ? 'text-red-400' : mkt === 3 ? 'text-purple-400' : 'text-white'}`}>{MARKETS[mkt]?.n || 'NORMAL'}</div>
            <p className="text-slate-300 drop-shadow-sm text-[10px] text-center">{MARKETS[mkt]?.desc}</p>
          </div>
        </div>
      </div>

      <NewsTicker />
    </div>
  );
};

const BagChaserInner = () => {
  const game = useGame();
  const { ph, pl, death, cancelIntro, fatalTragedyMessage, activeNotification, performHardReset } = game || {};

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {pl?.isPresident && game?.campaign?.phase === 'COMPLETED' && <div className="victory-flash" />}
      {activeNotification && <NotificationOverlay />}
      {fatalTragedyMessage && (
        <div className="fixed inset-0 bg-black z-[300] flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-md w-full bg-slate-900 border-4 border-red-600 rounded-3xl p-8 text-center shadow-[0_0_100px_rgba(220,38,38,0.5)]">
            <div className="text-7xl mb-6">💥</div>
            <h2 className="text-4xl font-black text-red-500 mb-4 tracking-tighter font-hype">THE FATAL BLOW</h2>
            <div className="h-0.5 w-full bg-red-600/30 my-6"></div>
            <p className="text-white text-xl font-bold leading-relaxed mb-8">
              {fatalTragedyMessage}
            </p>
            <button
              onClick={performHardReset}
              className="w-full py-5 bg-red-600 text-white font-black tracking-widest text-xl rounded-2xl hover:bg-red-500 shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all"
            >
              REVIEW YOUR LEGACY
            </button>
          </div>
        </div>
      )}
      {death       && !cancelIntro && !fatalTragedyMessage ? <AutopsyReport /> : null}
      {!death      && ph === 'PROLOGUE' ? <Prologue /> : null}
      {!death      && ph === 'PROLOGUE_INTRO' ? <GameIntro /> : null}
      {!death      && ph === 'PLAYING'  ? <GameInterface /> : null}
    </>
  );
};

export default function BagChaserV2() {
  return (
    <GameProvider>
      <BagChaserInner />
    </GameProvider>
  );
}
