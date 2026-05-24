import React from 'react';
import { useGame, TIERS } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';

const hustleMap = {
  'SW': { label: 'Streetwear', icon: '👕' },
  'DROP': { label: 'Dropship', icon: '📦' },
  'TECH_FLIP': { label: 'Tech Flipping', icon: '💻' },
  'VINTAGE': { label: 'Vintage Reselling', icon: '👕' },
  'SMM': { label: 'SMM Micro-Agency', icon: '📱' },
  'GIG': { label: 'Gig Runner Network', icon: '🏃' },
  'DELIVERY': { label: 'Delivery', icon: '🚲' },
  'PLASMA': { label: 'Plasma', icon: '💉' },
  'SURVEY': { label: 'Surveys', icon: '📝' },
  'LABOR': { label: 'Day Labor', icon: '🔨' },
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
  'MOV': { label: 'Hollywood Studio', icon: '🎬' },
  'PAC': { label: 'Super PAC', icon: '🇺🇸' },
  'BLITZ': { label: 'Media Blitz', icon: '📣' },
  'SMEAR': { label: 'Smear Campaigns', icon: '🔥' },
  'ELECTION': { label: 'ELECTION DAY', icon: '🗳️' }
};

const tierStyles = [
  "border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.1)]", // T0: Mud
  "border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.1)]", // T1: Street
  "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]", // T2: Corporate
  "border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]", // T3: Elite
  "border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]", // T4: Mogul
  "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]", // T5: President
];

export const TierHub = () => {
  const { pl, setTab, selTier, rRest, rRetire, setMod } = useGame();

  const tierIdx = parseInt(selTier);
  const tier = TIERS[tierIdx];
  const isLocked = pl.tier < tierIdx;

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
