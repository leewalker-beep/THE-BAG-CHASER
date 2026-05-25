import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn, LockedTierScreen } from '../ui/Shared.jsx';

const CampaignResumeBtn = () => {
  const { campaign, rResumeCampaign } = useGame();
  if (campaign?.phase !== 'CORPORATE_HQ') return null;

  return (
    <div className="mt-4 p-4 bg-red-900/20 border-2 border-red-600 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
      <button
        onClick={rResumeCampaign}
        className="w-full py-3 bg-red-600 text-white font-black tracking-widest text-sm rounded-xl hover:bg-red-500 transition-all active:scale-95"
      >
        RESUME CAMPAIGN TRAIL (MONTH {(campaign?.currentMonth || 0) + 1})
      </button>
    </div>
  );
};

export const TechTab = () => {
  const { pl, saasUsers, saasPrice, saasChurn, saasPenaltyActive, techFlipsComplete, rSaasClick, setTab } = useGame();
  const locked = (pl?.bag || 0) < 1000000 || (pl?.clout || 0) < 150 || (pl?.aura || 0) < 50;

  if (locked) return <LockedTierScreen section={2} />;

  const speedBoost = techFlipsComplete >= 10;
  const mrr = saasUsers * saasPrice * (saasPenaltyActive ? 0.5 : 1);

  return (
    <LabShell t="SAAS AUTOMATION" c="cyan" fontCls="font-tech" onHub={() => setTab('HUB')} tier={2}>
      <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center mb-4">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Monthly Recurring Revenue</div>
        <div className="text-2xl font-black text-cyan-400">${fMny(mrr)}/mo</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          {saasUsers.toLocaleString()} Users @ ${saasPrice}/mo | {(saasChurn * 100).toFixed(0)}% Churn
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Server Costs</div>
          <div className="text-lg font-black text-red-400">-${fMny(saasUsers * 2)}/mo</div>
        </div>

        <FlashBtn
          onClick={rSaasClick}
          costStm={20}
          dis={pl.bag < 5000}
          label="MARKETING PUSH ($5,000)"
          color="cyan-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">
          {speedBoost ? "Hardware Mastery boosting acquisition by 20%." : "Master 10 Tech Flips to boost user acquisition."}
        </p>
        <CampaignResumeBtn />
      </div>
    </LabShell>
  );
};

export const AiAgencyTab = () => {
  const { pl, corpClients, apiLockoutMonths, rAiAgencyClick, setTab } = useGame();
  const locked = pl.bag < 1000000 || pl.clout < 150 || pl.aura < 100;

  if (locked) return <LockedTierScreen section={2} />;

  const growthPerTick = corpClients * (10 + Math.floor(pl.clout / 20));

  return (
    <LabShell t="AI MARKETING AGENCY" c="indigo" fontCls="font-tech" onHub={() => setTab('HUB')} tier={2}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${apiLockoutMonths > 0 ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Corporate Clients</div>
        <div className={`text-2xl font-black ${apiLockoutMonths > 0 ? 'text-red-500' : 'text-indigo-400'}`}>{corpClients} RETAINERS</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          {apiLockoutMonths > 0 ? `API LOCKOUT: ${apiLockoutMonths} MO REMAINING` : `Passive: +${fMny(corpClients * 8000)}/mo`}
        </div>
        {corpClients > 0 && !apiLockoutMonths && (
          <div className="mt-2 pt-2 border-t border-slate-800">
            <div className="text-[9px] text-cyan-400 font-bold uppercase">SaaS Multiplier Active</div>
            <div className="text-[9px] text-slate-300">+ {growthPerTick} Passive Users / month</div>
            <div className="text-[9px] text-red-400">Ad Spend: -$10K/mo</div>
          </div>
        )}
      </div>

      <FlashBtn
        onClick={rAiAgencyClick}
        costStm={15}
        dis={pl.bag < 2500 || apiLockoutMonths > 0}
        label={apiLockoutMonths > 0 ? "LOCKOUT ACTIVE" : "DEPLOY AI SCRAPING LEAD BOTS ($2,500)"}
        color="indigo-600"
        txt="white"
      />
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"40% success rate per deployment. Watch for API Poisoning."</p>
      <CampaignResumeBtn />
    </LabShell>
  );
};

export const CreTab = () => {
  const { pl, creOfficeCount, creRetailCount, mkt, rCreBuyOffice, rCreBuyRetail, setTab } = useGame();
  const locked = pl.bag < 15000000 || pl.clout < 200 || pl.aura < 250;
  const isVulnerable = mkt === 2 || mkt === 3;

  if (locked) return <LockedTierScreen section={2} />;

  const grossYield = (creOfficeCount * 45000) + (creRetailCount * 15000);
  const totalMortgage = (creOfficeCount * 20000) + (creRetailCount * 5000);

  return (
    <LabShell t="COMMERCIAL REAL ESTATE" c="slate" fontCls="font-hype" onHub={() => setTab('HUB')} tier={2}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${isVulnerable ? 'border-red-500' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Portfolio Yield</div>
        <div className={`text-2xl font-black ${isVulnerable ? 'text-red-500' : 'text-white'}`}>
          ${fMny(isVulnerable ? 0 : grossYield)}/mo
        </div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          Mortgage: -${fMny(totalMortgage)}/mo | Net: ${fMny((isVulnerable ? 0 : grossYield) - totalMortgage)}/mo
        </div>
        {isVulnerable && (
          <div className="text-[9px] text-red-500 font-bold uppercase mt-1 animate-pulse">
            ⚠️ MARKET CRISIS: VACANCY RISK 100%
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Office Towers</div>
          <div className="text-xl font-black text-white">{creOfficeCount}</div>
        </div>
        <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Retail Strips</div>
          <div className="text-xl font-black text-white">{creRetailCount}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FlashBtn
          onClick={rCreBuyOffice}
          costStm={30}
          dis={pl.bag < 15000000}
          label="BUY OFFICE TOWER ($15M)"
          color="slate-100"
          txt="black"
        />
        <FlashBtn
          onClick={rCreBuyRetail}
          costStm={30}
          dis={pl.bag < 5000000}
          label="BUY RETAIL STRIP ($5M)"
          color="slate-600"
          txt="white"
        />
      </div>
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">
        "Assets subject to background vacancy risk and market volatility."
      </p>
      <CampaignResumeBtn />
    </LabShell>
  );
};

export const FranchiseTab = () => {
  const { pl, franchiseCount, unionStrikeActive, supplyChainDisruption, rFranchiseClick, rResolveUnionStrike, rResolveSupplyChain, setTab } = useGame();
  const locked = pl.bag < 5000000 || pl.clout < 300 || pl.aura < 200;

  if (locked) return <LockedTierScreen section={2} />;

  const isHalted = unionStrikeActive || supplyChainDisruption;

  return (
    <LabShell t="NATIONAL FRANCHISE" c="yellow" fontCls="font-hype" onHub={() => setTab('HUB')} tier={2}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${isHalted ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Territories</div>
        <div className={`text-2xl font-black ${isHalted ? 'text-red-500' : 'text-yellow-400'}`}>{franchiseCount} UNITS</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          {unionStrikeActive ? "UNION STRIKE: INCOME HALTED" : supplyChainDisruption ? "SUPPLY CHAIN SHOCK: INCOME HALTED" : `Passive: +${fMny(franchiseCount * 25000)}/mo`}
        </div>
      </div>

      {unionStrikeActive ? (
        <div className="flex flex-col gap-2">
          <button onClick={() => rResolveUnionStrike('settle')} className="w-full py-3 bg-green-600 text-white font-black text-xs rounded-xl hover:bg-green-500 active:scale-95 transition-all duration-100">PAY $100,000 WAGE SETTLEMENT</button>
          <button onClick={() => rResolveUnionStrike('ignore')} className="w-full py-3 bg-red-600 text-white font-black text-xs rounded-xl hover:bg-red-500 active:scale-95 transition-all duration-100">IGNORE (AURA PENALTY)</button>
        </div>
      ) : supplyChainDisruption ? (
        <div className="flex flex-col gap-2">
          <FlashBtn
            onClick={rResolveSupplyChain}
            dis={pl.bag < 2000000}
            label="STABILIZE LOGISTICS ($2M)"
            color="red-600"
            txt="white"
          />
        </div>
      ) : (
        <FlashBtn
          onClick={rFranchiseClick}
          costStm={25}
          dis={pl.bag < 500000}
          label="ACQUIRE FAST FOOD TERRITORY ($500,000)"
          color="yellow-500"
          txt="black"
        />
      )}
      <CampaignResumeBtn />
    </LabShell>
  );
};
