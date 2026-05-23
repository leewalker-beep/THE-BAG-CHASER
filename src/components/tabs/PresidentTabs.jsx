import React from "react";
import { useGame } from "../../GameEngine.jsx";
import { fMny } from "../../config.js";
import { LabShell, FlashBtn, LockedTierScreen } from "../ui/Shared.jsx";

export const SuperPacTab = () => <PresidentialCampaign />;
export const BlitzTab = () => <PresidentialCampaign />;
export const SmearTab = () => <PresidentialCampaign />;
export const ElectionTab = () => <PresidentialCampaign />;

export const PresidentialCampaign = () => {
  const {
    pl, setPl,
    superPacFunds, setSuperPacFunds,
    approvalRating, setApprovalRating,
    lobbyists, setLobbyists,
    lobbyistCost, setLobbyistCost,
    mediaBlitzCost,
    isPresident, setIsPresident,
    setTab, adv
  } = useGame();

  const rFundSuperPac = async () => {
    const cost = 10000000;
    if (pl.bag < cost) return;
    setPl(prev => ({ ...prev, bag: prev.bag - cost }));
    setSuperPacFunds(prev => prev + cost);
    return -cost;
  };

  const rHireLobbyist = async () => {
    if (superPacFunds < lobbyistCost) return;
    setSuperPacFunds(prev => prev - lobbyistCost);
    setLobbyists(prev => prev + 1);
    setLobbyistCost(prev => prev + 2500000);
    return 0; // It's from Super PAC funds, not player cash impact
  };

  const rLaunchMediaBlitz = async () => {
    if (superPacFunds < mediaBlitzCost) return;
    setSuperPacFunds(prev => prev - mediaBlitzCost);
    const gain = 5.0 + Math.random() * 7.0;
    setApprovalRating(prev => Math.min(100, prev + gain));
    return 0; // From Super PAC funds
  };

  const rBuyElection = async () => {
    if (approvalRating < 51.0) return;
    setIsPresident(true);
    return 0;
  };

  return (
    <LabShell t="POLITICAL WAR ROOM" c="red" fontCls="font-gov" onHub={() => setTab('HUB')} tier={5}>
      <div className="flex flex-col gap-4">
        {/* Victory Screen */}
        {isPresident && (
          <div className="bg-blue-900/40 border-2 border-yellow-500 p-6 rounded-2xl text-center animate-pulse shadow-[0_0_30px_rgba(234,179,8,0.5)]">
            <div className="text-5xl mb-2">🇺🇸</div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest font-gov">Mister President</h2>
            <p className="text-xs text-yellow-400 font-bold mt-1">LEGISLATIVE IMMUNITY ACTIVE: HEAT GENERATION -50%</p>
          </div>
        )}

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/80 p-4 rounded-xl border border-red-800 text-center flex flex-col gap-1">
            <div className="text-2xl font-black text-white font-gov">${fMny(superPacFunds)}</div>
            <div className="text-[9px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">Super PAC Funds</div>
          </div>
          <div className="bg-slate-900/80 p-4 rounded-xl border border-blue-800 text-center flex flex-col gap-1">
            <div className="text-2xl font-black text-blue-400 font-gov">{lobbyists}</div>
            <div className="text-[9px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">Active Lobbyists</div>
          </div>
        </div>

        {/* Approval Rating */}
        <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-700 flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase tracking-widest">National Approval Rating</div>
            <div className="text-2xl font-black text-green-400 font-gov">{approvalRating.toFixed(1)}%</div>
          </div>
          <div className="bg-black/50 h-4 rounded-full border border-slate-800 overflow-hidden">
            <div
              className="bg-gradient-to-r from-red-600 via-white to-blue-600 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
              style={{ width: `${approvalRating}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase">
            <span>UNPOPULAR</span>
            <span>ELECTION THRESHOLD (51%)</span>
            <span>LANDSLIDE</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 gap-2">
          <FlashBtn
            onClick={rFundSuperPac}
            dis={pl.bag < 10000000 || isPresident}
            label="Fund Super PAC (+$10M Cash)"
            color="red-600"
            txt="white"
          />
          <FlashBtn
            onClick={rHireLobbyist}
            dis={superPacFunds < lobbyistCost || isPresident}
            label={`Hire K-Street Lobbyist (-$${fMny(lobbyistCost)} PAC)`}
            color="slate-700"
            txt="white"
          />
          <FlashBtn
            onClick={rLaunchMediaBlitz}
            dis={superPacFunds < mediaBlitzCost || isPresident}
            label={`Launch Media Blitz (-$${fMny(mediaBlitzCost)} PAC)`}
            color="blue-600"
            txt="white"
          />
          <button
            onClick={rBuyElection}
            disabled={approvalRating < 51.0 || isPresident}
            className={`w-full py-4 rounded-xl font-black text-lg tracking-widest transition-all active:scale-95 duration-100 ${
              approvalRating >= 51.0 && !isPresident
                ? 'bg-green-600 text-white shadow-[0_0_25px_#16a34a] hover:bg-green-500'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            {isPresident ? 'TERM IN PROGRESS' : approvalRating >= 51.0 ? 'BUY OUT ELECTION' : 'BALLOT LOCKED (<51%)'}
          </button>
        </div>

        <p className="text-[9px] text-slate-400 text-center italic mt-2">
          "Politics is just the art of managing the machine you built."
        </p>
      </div>
    </LabShell>
  );
};
