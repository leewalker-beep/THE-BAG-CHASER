import React, { useState } from 'react';
import { GameProvider, useGame, TIERS } from './GameEngine.jsx';
import { fMny, MARKETS } from './config.js';
import { styles } from './styles.js';

import {
  Toggles,
  LockedTierScreen
} from './components/ui/Shared.jsx';

import { Hud } from './components/layout/Hud.jsx';
import { NewsTicker } from './components/layout/NewsTicker.jsx';
import { NotificationOverlay } from './components/ui/NotificationOverlay.jsx';

import {
  SwTab,
  DropTab,
  VintageTab,
  SmmTab,
  TechFlipTab,
  GigTab
} from './components/tabs/MudTabs.jsx';
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
import {
  MovTab,
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

import { ExpView } from './components/views/ExpView.jsx';
import { FlexShopView } from './components/views/FlexShopView.jsx';
import { FlexesView } from './components/views/FlexesView.jsx';
import { AutopsyReport } from './components/views/AutopsyReport.jsx';
import { Prologue } from './components/views/Prologue.jsx';
import { GameIntro } from './components/views/GameIntro.jsx';

const hustleMap = {
  'SW': { label: 'Streetwear', icon: '👕' },
  'DROP': { label: 'Dropship', icon: '📦' },
  'TECH_FLIP': { label: 'Tech Flipping', icon: '💻' },
  'VINTAGE': { label: 'Vintage Reselling', icon: '👕' },
  'SMM': { label: 'SMM Micro-Agency', icon: '📱' },
  'GIG': { label: 'Gig Runner Network', icon: '🏃' },
  'CC': { label: 'Creator Lab', icon: '📱' },
  'POD': { label: 'Podcast Net', icon: '🎙️' },
  'BOX': { label: 'FIGHT Promoter', icon: '🥊' },
  'AUDIO': { label: 'Indie Audio Syndicate', icon: '🎵' },
  'TECH': { label: 'SaaS Startup', icon: '💻' },
  'AI_AGENCY': { label: 'AI Marketing Agency', icon: '🤖' },
  'CRE_FLIP': { label: 'Commercial Real Estate', icon: '🏢' },
  'FRANCHISE': { label: 'National Franchise', icon: '🍟' },
  'CRYP': { label: 'Web3 Hedge', icon: '🪙' },
  'TOUR': { label: 'Events', icon: '🎪' },
  'PE_ROLLUP': { label: 'Private Equity', icon: '📊' },
  'ART_SPEC': { label: 'Art Speculation', icon: '🎨' },
  'HF': { label: 'Hedge Fund', icon: '📈' },
  'CONGLOMERATE': { label: 'Global Conglomerate', icon: '🏢' },
  'PMC': { label: 'Private Military', icon: '🎖️' },
  'SOVEREIGN': { label: 'Sovereign Wealth Fund', icon: '🌍' },
  'PAC': { label: 'Super PAC', icon: '🇺🇸' },
  'BLITZ': { label: 'Media Blitz', icon: '📣' },
  'SMEAR': { label: 'Smear Campaigns', icon: '🔥' },
  'ELECTION': { label: 'ELECTION DAY', icon: '🗳️' }
};

// ─── HUB tab ──────────────────────────────────────────────────────────────────

const TierHub = () => {
  const { pl, mkt, news, skl, diff, cap, adv, setTab, selTier, setSelTier, displayBag, rRest, rRetire, setMod } = useGame();

  if (selTier === 'flexes') return <FlexesView />;
  if (selTier === 'flexShop') return <FlexShopView />;
  if (selTier === 'exp') return <ExpView />;

  const tierIdx = parseInt(selTier);
  const tier = TIERS[tierIdx];
  const isLocked = pl.tier < tierIdx;

  const tierStyles = [
    "border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]", // T0: Mud
    "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]", // T1: Street
    "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]", // T2: Corporate
    "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]", // T3: Elite
    "border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]", // T4: Mogul
    "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]", // T5: President
  ];

  return (
    <div className={`flex flex-col gap-5 mb-8 p-4 rounded-3xl border transition-all duration-500 ${!isNaN(tierIdx) ? tierStyles[tierIdx] : 'border-slate-800 bg-slate-900/20'}`}>
      <div className="grid grid-cols-1">
        <button
          onClick={rRest}
          className="w-full py-4 bg-purple-900/40 border-2 border-purple-500 rounded-xl font-black text-purple-400 tracking-widest hover:bg-purple-800/40 transition-all active:scale-95 duration-100 flex items-center justify-center gap-3"
        >
          <span className="text-2xl">😴</span>
          TAKE SOME MENTAL HEALTH DAYS (+50 MH, ADVANCE 1 MO)
        </button>
      </div>


      {(pl.tier >= 5 && pl.bag >= 500000000) && (
        <div className="grid grid-cols-1">
          <button
            onClick={() => setMod({
              s: true,
              t: "ASCEND & RETIRE",
              m: "Hand down your empire to your heir. You will lose your current cash, assets, and tiers, but your heir will inherit a permanent +25% multiplier to all future income. Continue the dynasty?",
              o: [
                { label: "CONFIRM ASCENSION", action: () => { rRetire(); setMod({ s: false }); } },
                { label: "CANCEL", action: () => setMod({ s: false }) }
              ],
              ui: "ui-modal"
            })}
            className="w-full py-4 bg-yellow-900/40 border-2 border-yellow-500 rounded-xl font-black text-yellow-400 tracking-widest hover:bg-yellow-800/40 transition-all active:scale-95 duration-100 flex items-center justify-center gap-3 animate-pulse"
          >
            <span className="text-2xl">👑</span>
            RETIRE & HAND DOWN EMPIRE
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">

      {tier?.hustles?.map(hKey => {
        const h = hustleMap[hKey];
        if (!h) return null;
        const isStub = h.stub;

        return (
          <div key={hKey} className="relative aspect-[4/3]">
            <button
              onClick={() => !isStub && setTab?.(hKey)}
              className={`w-full h-full p-6 rounded-xl border font-bold text-sm tracking-wide transition-all active:scale-95 duration-100 shadow-lg flex flex-col items-center justify-between
                ${isStub
                  ? 'bg-slate-900/40 border-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'
                  : 'bg-slate-900/90 border-slate-700 text-white hover:bg-slate-800'}`}
            >
              <div className="flex-1 flex items-center justify-center">
                <span className="text-3xl">{h.icon}</span>
              </div>
              <span className="text-center">{h.label.toUpperCase()}</span>
              <div className="h-4 flex items-center justify-center">
                {isStub && <span className="text-[8px] text-yellow-600 uppercase">UNDER CONSTRUCTION</span>}
              </div>
            </button>
            {isLocked && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xl flex flex-col items-center justify-center p-4 text-center border border-slate-800 pointer-events-none">
                <span className="text-xl mb-1">🔒</span>
                <div className="text-[8px] font-black text-red-500 uppercase tracking-tighter">Locked Sector</div>
                <div className="text-[7px] text-slate-300 drop-shadow-sm mt-1">
                  Req: ${fMny(tier.req.bag)} | {tier.req.clout} C | {tier.req.aura} A
                </div>
              </div>
            )}
          </div>
        );
      })}

      </div>
    </div>
  );
};

const TAB_MAP = {
  'HUB':          { component: TierHub },
  'SW':           { component: SwTab,           tier: 0 },
  'DROP':         { component: DropTab,         tier: 0 },
  'VINTAGE':      { component: VintageTab,      tier: 0 },
  'SMM':          { component: SmmTab,          tier: 0 },
  'TECH_FLIP':    { component: TechFlipTab,     tier: 0 },
  'GIG':          { component: GigTab,          tier: 0 },
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
  'MOV':          { component: MovTab,          tier: 4 },
  'HF':           { component: HfTab,           tier: 4 },
  'AI':           { component: AiTab,           tier: 4 },
  'CONGLOMERATE': { component: ConglomerateTab, tier: 4 },
  'PMC':          { component: PmcTab,          tier: 4 },
  'SOVEREIGN':    { component: SovereignTab,    tier: 4 },
  'BILL':         { component: BillTab,         tier: 4 },
  'PAC':          { component: SuperPacTab,     tier: 5 },
  'BLITZ':        { component: BlitzTab,        tier: 5 },
  'SMEAR':        { component: SmearTab,        tier: 5 },
  'ELECTION':     { component: ElectionTab,     tier: 5 },
};

const GameInterface = () => {
  const game = useGame();
  const {
    pl, prs, ass, mkt, tab, setTab, imp, mod, cancelIntro, gBusy, isTierUnlocked, selTier, isBreakdownActive, shakeActive, rDischarge, performHardReset
  } = game || {};


  if (!game) return <div className="min-h-screen bg-black flex items-center justify-center">Loading...</div>;

  const busy = gBusy || imp?.some(i => !i.w);

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
    <div className={`min-h-screen flex flex-col ${prs?.r ? 'bg-oval' : ass?.mans ? 'bg-mansion' : ass?.pent ? 'bg-penthouse' : 'bg-basement'} ${shakeActive ? 'animate-shake-hard' : ''} ${(pl?.aura || 0) < 20 ? 'aura-panic' : ''}`}>


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
  const { ph, death, cancelIntro, fatalTragedyMessage, activeNotification, performHardReset } = useGame();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
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
