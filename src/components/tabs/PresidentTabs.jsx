import React, { useState } from "react";
import { useGame } from "../../GameEngine.jsx";
import { fMny } from "../../config.js";
import { LabShell, FlashBtn, Stepper, LockedTierScreen } from "../ui/Shared.jsx";

export const SuperPacTab = () => {
  const { pl, prs, setPl, setPrs, adv, setTab } = useGame();
  const [deposit, setDeposit] = useState(10000000);

  return (
    <LabShell t="SUPER PAC FUNDRAISING" c="red" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-red-800 text-center flex flex-col gap-4">
        <div className="text-4xl font-black text-white font-gov">${fMny(prs?.chest || 0)}</div>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">Campaign War Chest</div>

        <Stepper val={deposit} setVal={setDeposit} min={1000000} max={pl?.bag || 0} step={1000000} label="Deposit Amt" />

        <FlashBtn
          onClick={async () => {
            if ((pl?.bag || 0) < deposit) return;
            setPl(p => ({ ...p, bag: p.bag - deposit }));
            setPrs(p => ({ ...p, chest: (p.chest || 0) + deposit }));
            return -deposit;
          }}
          dis={(pl?.bag || 0) < deposit}
          label={`DEPOSIT INTO PAC - ${fMny(deposit)}`}
          color="red-600"
          txt="white"
        />
      </div>
    </LabShell>
  );
};

export const BlitzTab = () => {
  const { pl, prs, setPl, setPrs, adv, setTab } = useGame();

  const runBlitz = async () => {
    const cost = 50000000;
    const cloutCost = 100;
    if ((pl?.bag || 0) < cost || (pl?.clout || 0) < cloutCost) return;

    setPl(p => ({ ...p, bag: p.bag - cost, clout: p.clout - cloutCost }));
    const gain = 2 + Math.random() * 3;
    setPrs(p => ({ ...p, polls: Math.min(100, (p.polls || 0) + gain) }));
    adv();
    return -cost;
  };

  return (
    <LabShell t="MEDIA BLITZ & PROPAGANDA" c="blue" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-blue-800 text-center flex flex-col gap-4">
        <div className="text-5xl font-black text-blue-400 font-gov">{(prs?.polls || 0).toFixed(1)}%</div>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">Current Polls</div>

        <div className="bg-black/50 h-4 rounded-full border border-slate-800 overflow-hidden">
          <div className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_15px_#3b82f6]" style={{ width: `${prs?.polls || 0}%` }}></div>
        </div>

        <FlashBtn
          onClick={runBlitz}
          dis={(pl?.bag || 0) < 50000000 || (pl?.clout || 0) < 100}
          label="RUN NATIONAL BLITZ ($50M + 100 CLOUT)"
          color="blue-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm italic">"Flood the airwaves with tailored narratives."</p>
      </div>
    </LabShell>
  );
};

export const SmearTab = () => {
  const { pl, prs, setPl, setPrs, adv, setTab } = useGame();

  const runSmear = async () => {
    const cost = 25000000;
    const auraCost = 50;
    if ((pl?.bag || 0) < cost || (pl?.aura || 0) < auraCost) return;

    setPl(p => ({ ...p, bag: p.bag - cost, aura: p.aura - auraCost }));
    // In this simplified version, smear increases your lead
    const gain = 1 + Math.random() * 2;
    setPrs(p => ({ ...p, polls: Math.min(100, (p.polls || 0) + gain) }));
    adv();
    return -cost;
  };

  return (
    <LabShell t="SMEAR CAMPAIGNS" c="orange" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-6 rounded-2xl border border-orange-800 text-center flex flex-col gap-4">
        <div className="text-3xl font-black text-orange-500 uppercase tracking-tighter">Mudslinging Active</div>
        <FlashBtn
          onClick={runSmear}
          dis={(pl?.bag || 0) < 25000000 || (pl?.aura || 0) < 50}
          label="SMEAR RIVAL ($25M + 50 AURA)"
          color="orange-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm">Target rival's character to swing undecided voters.</p>
      </div>
    </LabShell>
  );
};

export const ElectionTab = () => {
  const { prs, pl, setTab, setMod } = useGame();
  const ready = (prs?.polls || 0) >= 51;
  const tier6Achieved = (pl?.tier || 0) >= 5;

  return (
    <LabShell t="ELECTION DAY" c="green" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="bg-slate-900/80 p-8 rounded-2xl border border-green-800 text-center flex flex-col gap-6">
        <div className="text-6xl mb-2">{ready ? '🗳️' : '🔒'}</div>
        <h3 className="text-2xl font-black text-white uppercase tracking-widest">The Ballot</h3>

        <div className="bg-black/40 p-4 rounded-xl border border-slate-800">
          <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase mb-2">Threshold Required</div>
          <div className="text-xl font-black text-green-400">51.0% POLLS</div>
          <div className="text-sm text-slate-300 drop-shadow-sm mt-1">Current: {(prs?.polls || 0).toFixed(1)}%</div>
        </div>

        <button
          onClick={() => {
            if (!ready) return;
            setMod({
              s: true,
              t: "PRESIDENTIAL VICTORY",
              m: "The people have spoken. You are the Commander in Chief.",
              o: [{ label: "ASCEND TO OVAL OFFICE", action: () => window.location.reload() }],
              ui: "ui-modal"
            });
          }}
          disabled={!ready}
          className={`w-full py-6 rounded-2xl font-black text-xl tracking-widest transition-all active:scale-95 duration-100 ${ready ? 'bg-green-600 text-white shadow-[0_0_30px_#16a34a] hover:bg-green-500' : 'bg-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}
        >
          {ready ? 'SUBMIT BALLOT' : 'BALLOT LOCKED'}
        </button>

        <div className="mt-4 pt-6 border-t border-slate-800 text-left">
          <h4 className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase mb-3 tracking-widest">Special Sub-Section</h4>
          <div className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${tier6Achieved ? 'bg-indigo-900/20 border-indigo-700' : 'bg-slate-800/40 border-slate-700 opacity-50 grayscale'}`}>
            <span className="text-3xl">🤖</span>
            <div>
              <div className="font-black text-xs text-white uppercase tracking-wide">Mud Tier AI Overseer Bot</div>
              <div className="text-[9px] text-slate-300 drop-shadow-sm font-bold">
                {tier6Achieved ? 'SYSTEM ONLINE - AUTOMATING LOW-TIER OPERATIONS' : 'LOCKED - REQUIRES TIER 6 ASCENSION'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </LabShell>
  );
};
