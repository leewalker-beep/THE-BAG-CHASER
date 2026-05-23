import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { Toggles } from '../ui/Shared.jsx';
import { styles } from '../../styles.js';

export const Prologue = () => {
  const { proSt, setProSt, alias, setAlias, diff, setDiff, setPh, exStart } = useGame();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <h1 className="text-5xl font-black mb-2 text-green-400 tracking-tighter drop-shadow-[0_0_15px_#22c55e] font-hype">THE BAG CHASER</h1>
      <p className="text-slate-300 drop-shadow-sm mb-8 text-sm font-tech">Build your empire from nothing. Or die broke.</p>
      <div className="w-full max-w-md bg-black/60 border border-slate-700 p-8 rounded-2xl flex flex-col items-center shadow-2xl">
        {proSt === 0 && <>
          <h3 className="font-black text-2xl text-green-400 mb-3 tracking-widest font-hype">THE BAG</h3>
          <p className="text-slate-300 drop-shadow-sm mb-2 leading-relaxed">Your cash. Every hustle costs money upfront.</p>
          <p className="text-slate-300 drop-shadow-sm mb-6 text-sm leading-relaxed">Hit $0 → BANKRUPT. Game over. Survive Market Shifts, Mortgages, and Fines. Never go dry.</p>
          <button onClick={() => setProSt(1)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">GOT IT →</button>
        </>}
        {proSt === 1 && <>
          <h3 className="font-black text-2xl text-yellow-400 mb-3 tracking-widest font-hype">AURA = REPUTATION</h3>
          <p className="text-slate-300 drop-shadow-sm mb-2 leading-relaxed">Street cred that unlocks bigger moves and boosts your revenue.</p>
          <p className="text-red-400 mb-6 text-sm font-bold leading-relaxed">⚠ Hit 0 Aura = CANCELLED. Permanent game over. Scandals and bad decisions drain it fast.</p>
          <button onClick={() => setProSt(2)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">GOT IT →</button>
        </>}
        {proSt === 2 && <>
          <h3 className="font-black text-2xl text-red-400 mb-3 tracking-widest font-hype">CLOUT = FAME</h3>
          <p className="text-slate-300 drop-shadow-sm mb-2 leading-relaxed">Unlocks arenas, political power, and God Tier moves.</p>
          <p className="text-slate-300 drop-shadow-sm mb-6 text-sm leading-relaxed">Low Clout = no one shows up. High Clout = world stage. Grind content, podcasts, and drops to build it.</p>
          <button onClick={() => setProSt(3)} className="w-full p-4 bg-slate-800 text-white font-black tracking-widest rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-100">GOT IT →</button>
        </>}
        {proSt === 3 && <>
          <h3 className="font-black text-xl text-blue-400 mb-3 tracking-widest font-tech">HOW TO PLAY</h3>
          <ul className="text-slate-300 drop-shadow-sm text-xs text-left mb-5 space-y-1.5 leading-relaxed">
            <li>→ Pick any hustle from the <span className="text-white font-bold">HUB</span> and start grinding</li>
            <li>→ <span className="text-yellow-400 font-bold">Market Cycles</span> shift every 12 months — costs and risks change</li>
            <li>→ <span className="text-orange-400 font-bold">Fatigue</span>: flood the same event tier and fans check out</li>
            <li>→ <span className="text-pink-400 font-bold">Lifestyle Creep</span>: assets auto-offer at bag milestones — mortgages burn monthly</li>
            <li>→ <span className="text-purple-400 font-bold">Whale Tax</span>: the IRS clips 20-30% off any payout over $100M</li>
            <li>→ Compound to God Tier: Movies → Hedge Fund → AI Lab</li>
            <li>→ <span className="text-red-500 font-bold">POTUS Run</span>: fund a shadow campaign, win 2 of 3 regions → President</li>
          </ul>
          <button onClick={() => setProSt(4)} className="w-full p-4 bg-green-600 text-black font-black tracking-widest rounded-xl hover:bg-green-500 active:scale-95 transition-all duration-100 shadow-[0_0_15px_#22c55e]">LET'S RUN IT →</button>
        </>}
        {proSt === 4 && <>
          <input type="text" value={alias} onChange={e => setAlias(e.target.value.substring(0, 5).toUpperCase())} placeholder="ALIAS (3-5 CHARS)" className="w-full p-4 mb-4 bg-slate-900 border border-slate-600 rounded-lg text-center font-black tracking-widest text-xl text-white outline-none focus:border-green-400 transition-colors" />
          <div className="w-full mb-2">
            <div className="text-xs text-slate-300 font-bold tracking-widest mb-2">DIFFICULTY</div>
            <Toggles opts={['TRUST FUND', 'HUSTLER', 'GRINDER']} active={diff} setVal={setDiff} color="green-600" />
          </div>
          <div className="w-full mb-4 px-1">
            {diff === 3 && <p className="text-[10px] text-red-400 font-bold text-center leading-relaxed">⚠ Protect Your Aura (0 = Cancellation) | Cash Flow is King | Read the Fine Print</p>}
            {diff === 2 && <p className="text-[10px] text-yellow-400 font-bold text-center leading-relaxed">⚠ Respect the Market Cycle | Beware Lifestyle Creep (Mortgages kill) | Rotate Your Roster</p>}
            {diff === 1 && <p className="text-[10px] text-slate-300 drop-shadow-sm font-bold text-center leading-relaxed">⚠ Fame is a Target | The Feds are Watching (Whale Tax) | Leverage is a Double-Edged Sword</p>}
          </div>
          <button onClick={() => { exStart(); }} disabled={alias.length < 3} className={`w-full p-6 font-black tracking-widest text-xl rounded-xl transition-all active:scale-95 duration-100 ${alias.length >= 3 ? 'bg-green-500 text-black shadow-[0_0_20px_#22c55e] hover:bg-green-400' : 'bg-slate-800 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>ENTER THE MATRIX</button>
        </>}
      </div>
    </div>
  );
};
