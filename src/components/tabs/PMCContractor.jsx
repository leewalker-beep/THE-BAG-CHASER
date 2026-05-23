import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn, LockedTierScreen } from '../ui/Shared.jsx';

const PMCContractor = () => {
  const {
    pl,
    pmcMercenaries,
    pmcActiveContracts,
    pmcHeatLevel,
    pmcMercCost,
    pmcBribeCost,
    rPmcHire,
    rPmcDeployContract,
    rPmcBribe,
    setTab
  } = useGame();

  const locked = pl.bag < 250000000 || pl.clout < 1500 || pl.aura < 500;
  if (locked) return <LockedTierScreen section={4} />;

  const isHighHeat = pmcHeatLevel > 80;

  return (
    <LabShell t="PMC TACTICAL OPS" c="purple" fontCls="font-tech" onHub={() => setTab('HUB')} tier={4}>
      {/* Tactical Dashboard */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-300 font-bold uppercase mb-1">Available Mercs</div>
          <div className="text-2xl font-black text-purple-400">{pmcMercenaries}</div>
        </div>
        <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center">
          <div className="text-[10px] text-slate-300 font-bold uppercase mb-1">Active Contracts</div>
          <div className="text-2xl font-black text-blue-400">{pmcActiveContracts}</div>
        </div>
      </div>

      {/* Heat Level Bar */}
      <div className="bg-black/40 p-4 rounded-xl border border-slate-800 mb-6">
        <div className="flex justify-between text-[10px] font-bold uppercase mb-2">
          <span className="text-slate-300">Detection Heat</span>
          <span className={isHighHeat ? "text-red-500 animate-pulse" : "text-slate-400"}>
            {pmcHeatLevel.toFixed(1)}%
          </span>
        </div>
        <div className="bg-black/50 h-4 rounded-full border border-slate-700 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${isHighHeat ? "bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-purple-600"}`}
            style={{ width: `${Math.min(100, pmcHeatLevel)}%` }}
          ></div>
        </div>
        <div className="text-[9px] text-slate-400 italic mt-2 text-center">
          Revenue: +${fMny(pmcActiveContracts * 100000)}/mo | Heat: +{(pmcActiveContracts * 10).toFixed(1)}%/mo
        </div>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-3">
        <FlashBtn
          onClick={rPmcHire}
          dis={pl.bag < pmcMercCost}
          label={`HIRE MERCENARY Asset ($${fMny(pmcMercCost)})`}
          color="purple-600"
          txt="white"
        />
        <FlashBtn
          onClick={rPmcDeployContract}
          dis={pmcMercenaries < 1}
          label={pmcMercenaries < 1 ? "REQUIRES AVAILABLE MERCS" : `DEPLOY COMBAT CONTRACT`}
          color="blue-600"
          txt="white"
        />
        <FlashBtn
          onClick={rPmcBribe}
          dis={pl.bag < pmcBribeCost}
          label={`BRIBE AUTHORITIES ($${fMny(pmcBribeCost)})`}
          color="slate-800"
          txt="slate-300"
        />
      </div>

      <p className="text-[9px] text-slate-400 text-center italic mt-4">
        "High-yield tactical operations. High heat levels risk Interpol intervention."
      </p>
    </LabShell>
  );
};

export default PMCContractor;
