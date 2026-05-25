import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn } from '../ui/Shared.jsx';

export const PoliticalSyndicateTab = () => {
  const {
    pl, politicalSyndicate, presidencyEligible,
    rAcquirePoliticalAsset, rDeployNarrativeOp, rHostPolicySummit,
    setTab
  } = useGame();

  const { politicalCapital, assetLeasing, status } = politicalSyndicate;

  const syndicateStyles = {
    background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
    border: '2px solid #94a3b880',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(148, 163, 184, 0.2)'
  };

  const holoLineStyles = {
    height: '1px',
    width: '100%',
    background: 'linear-gradient(90deg, transparent, #38bdf8, #818cf8, #38bdf8, transparent)',
    opacity: 0.5,
    margin: '10px 0'
  };

  return (
    <LabShell t="KINGMAKER SYNDICATE" c="slate" fontCls="font-gov" onHub={() => setTab('HUB')} tier={4}>
      <div style={syndicateStyles} className="p-6 rounded-2xl flex flex-col gap-6 relative overflow-hidden">
        {/* Holographic Accents */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-slate-400/30"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-slate-400/30"></div>
        </div>

        {/* Header Stats */}
        <div className="bg-black/60 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-black text-slate-400 tracking-tighter uppercase">Influence Quotient</span>
            <span className={`text-xl font-black ${politicalCapital >= 100 ? 'text-blue-400 animate-pulse' : 'text-slate-200'}`}>
              {Math.floor(politicalCapital)}%
            </span>
          </div>
          <div className="bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-slate-600 via-blue-500 to-blue-400 transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              style={{ width: `${politicalCapital}%` }}
            ></div>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">
              {status === 'CAMPAIGN_READY' ? 'SYSTEM STATUS: PRIMED FOR ASCENSION' : 'SYSTEM STATUS: ACCUMULATING POWER'}
            </span>
          </div>
        </div>

        <div style={holoLineStyles}></div>

        {/* Step 1: Asset Acquisition */}
        <div className="z-10">
          <h4 className="text-xs font-black text-slate-300 mb-3 uppercase tracking-widest border-l-2 border-blue-500 pl-2">Step 1: Institutional Leverage</h4>
          <div className="grid grid-cols-1 gap-2">
            <AssetButton
              label="Fund State Governor Retainers"
              cost={15000000}
              count={assetLeasing.governors}
              limit={5}
              onAcquire={() => rAcquirePoliticalAsset('governors', 15000000, 5)}
              pB={pl.bag}
              yieldText="+0.5% Capital/Tick"
            />
            <AssetButton
              label="Acquire Federal Senators"
              cost={75000000}
              count={assetLeasing.senators}
              limit={3}
              onAcquire={() => rAcquirePoliticalAsset('senators', 75000000, 3)}
              pB={pl.bag}
              yieldText="+1.5% Capital/Tick"
            />
            <AssetButton
              label="Buy Prime-Time News Anchors"
              cost={250000000}
              count={assetLeasing.networkAnchors}
              limit={2}
              onAcquire={() => rAcquirePoliticalAsset('networkAnchors', 250000000, 2)}
              pB={pl.bag}
              yieldText="+3.0% Capital/Tick"
            />
          </div>
        </div>

        <div style={holoLineStyles}></div>

        {/* Step 2: Narrative Warfare */}
        <div className="z-10">
          <h4 className="text-xs font-black text-slate-300 mb-3 uppercase tracking-widest border-l-2 border-red-500 pl-2">Step 2: Narrative Operations</h4>
          <div className="grid grid-cols-1 gap-3">
            <OpButton
              title="Draft Custom Tax Loophole Bill"
              desc="Requires 2 Senators. Generates corporate kickbacks."
              req="2 Senators | 100 Clout"
              reward="+$40,000,000 Bag | -100 Clout"
              disabled={assetLeasing.senators < 2 || pl.clout < 100}
              onDeploy={() => rDeployNarrativeOp('TAX_LOOPHOLE')}
              color="slate-800"
            />
            <OpButton
              title="Manufacture Culture War Outrage"
              desc="Requires 1 Network Anchor. High visibility play."
              req="1 Anchor | 40 Aura"
              reward="+500 Clout | +15% Capital | -40 Aura"
              disabled={assetLeasing.networkAnchors < 1 || pl.aura < 40}
              onDeploy={() => rDeployNarrativeOp('CULTURE_WAR')}
              color="slate-800"
            />
            <OpButton
              title="Deploy Lobbyist Strike Teams"
              desc="Intensive short-term capital manipulation."
              req="$10,000,000 Bag"
              reward="+10% Political Capital"
              disabled={pl.bag < 10000000}
              onDeploy={() => rDeployNarrativeOp('LOBBYIST_STRIKE')}
              color="slate-800"
            />
          </div>
        </div>

        <div style={holoLineStyles}></div>

        {/* Step 3: Endgame Gate */}
        <div className="z-10 mt-2">
          <h4 className="text-xs font-black text-slate-300 mb-4 uppercase tracking-widest text-center">Step 3: The Kingmaker State Dinner</h4>
          {presidencyEligible ? (
            <div className="bg-blue-900/30 border border-blue-400 p-4 rounded-xl text-center shadow-[0_0_20px_rgba(56,189,248,0.3)]">
              <div className="text-2xl mb-2">🥂</div>
              <p className="text-sm font-black text-blue-300 uppercase">Eligibility Confirmed</p>
              <p className="text-[10px] text-slate-300 mt-1">You are primed for the Presidential Campaign.</p>
            </div>
          ) : (
            <button
              onClick={rHostPolicySummit}
              disabled={politicalCapital < 100}
              className={`w-full py-6 rounded-2xl font-black text-lg tracking-widest transition-all duration-500 flex flex-col items-center gap-1
                ${politicalCapital >= 100
                  ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.6)] hover:scale-[1.02] active:scale-95'
                  : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed grayscale'}`}
            >
              <span className="text-[10px] opacity-70">GLOBAL POLICY SUMMIT</span>
              <span>HOST KEYNOTE ADDRESS</span>
              {politicalCapital < 100 && (
                <span className="text-[8px] mt-1 text-slate-500">REQUIRED: 100% POLITICAL CAPITAL</span>
              )}
            </button>
          )}
        </div>
      </div>
    </LabShell>
  );
};

const AssetButton = ({ label, cost, count, limit, onAcquire, pB, yieldText }) => {
  const canAfford = pB >= cost;
  const isMaxed = count >= limit;

  return (
    <button
      onClick={onAcquire}
      disabled={!canAfford || isMaxed}
      className={`p-3 rounded-xl border flex items-center justify-between transition-all active:scale-95
        ${isMaxed
          ? 'bg-green-900/20 border-green-700 text-green-500'
          : canAfford
            ? 'bg-slate-800/80 border-slate-600 text-slate-200 hover:bg-slate-700'
            : 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'}`}
    >
      <div className="flex flex-col items-start">
        <span className="text-[10px] font-black uppercase tracking-tight">{label}</span>
        <span className="text-[8px] font-bold opacity-60">{yieldText}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] font-bold">{isMaxed ? 'MAXED' : `$${fMny(cost)}`}</span>
        <span className="text-[8px] font-black">[{count}/{limit}]</span>
      </div>
    </button>
  );
};

const OpButton = ({ title, desc, req, reward, disabled, onDeploy, color }) => {
  return (
    <div className={`p-4 rounded-xl border border-slate-700/50 bg-black/40 flex flex-col gap-2`}>
      <div>
        <div className="text-[10px] font-black text-slate-200 uppercase">{title}</div>
        <div className="text-[8px] text-slate-400 italic">{desc}</div>
      </div>
      <div className="flex justify-between items-end gap-4">
        <div className="flex flex-col">
          <div className="text-[7px] font-bold text-slate-500 uppercase">Requirements: <span className="text-slate-300">{req}</span></div>
          <div className="text-[7px] font-bold text-slate-500 uppercase">Impact: <span className="text-blue-400">{reward}</span></div>
        </div>
        <button
          onClick={onDeploy}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg font-black text-[10px] tracking-widest transition-all active:scale-95
            ${!disabled
              ? 'bg-slate-200 text-black hover:bg-white shadow-[0_0_10px_rgba(255,255,255,0.2)]'
              : 'bg-slate-900 text-slate-600 border border-slate-800 cursor-not-allowed'}`}
        >
          DEPLOY
        </button>
      </div>
    </div>
  );
};

export default PoliticalSyndicateTab;
