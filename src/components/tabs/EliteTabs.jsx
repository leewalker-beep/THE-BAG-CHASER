import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn, UpgBtn, Toggles, Stepper, LockedTierScreen } from '../ui/Shared.jsx';

export const TourTab = () => {
  const { pl, up, tur, setTur, dUp, rTur, setTab } = useGame();
  return (
    <LabShell t="LIVE EVENTS" c="teal" onHub={() => setTab('HUB')} tier={3}>
      <UpgBtn onClk={() => dUp('trFst', 150000000, 'Mega Festival Secured. 🎪')} cost={150000000} title="OWN MEGA-FESTIVAL" unl={up.trFst} pB={pl.bag} reqC={200} pC={pl.clout} />
      <Toggles opts={['Club', 'Arena', 'Stadium']} active={tur.t} setVal={v => setTur(t => ({ ...t, t: v }))} color="teal-600" />
      <Stepper val={tur.m} setVal={v => setTur(t => ({ ...t, m: v }))} min={50000} max={10000000} step={50000} label="Marketing" />
      <Stepper val={tur.a} setVal={v => setTur(t => ({ ...t, a: v }))} min={10000} max={5000000} step={10000} label="Artist Fees" />
      <Stepper val={tur.l} setVal={v => setTur(t => ({ ...t, l: v }))} min={50000} max={5000000} step={50000} label="Logistics" />
      <FlashBtn onClick={rTur} dis={pl.bag < tur.m + tur.a + tur.l} label={`LAUNCH ${up.trFst ? 'FESTIVAL' : 'TOUR'} - ${fMny(tur.m + tur.a + tur.l)}`} />
    </LabShell>
  );
};

export const PeTab = () => {
  const { pl, peProgress, guttedFirms, supplyChainDisruption, peCompoundingYield, rPeClick, rResolveSupplyChain, setTab } = useGame();
  const locked = pl.bag < 25000000;

  if (locked) return <LockedTierScreen section={3} />;

  const basePassive = guttedFirms * 100000;
  const currentPassive = supplyChainDisruption ? -500000 : Math.floor(basePassive * peCompoundingYield);

  return (
    <LabShell t="PRIVATE EQUITY" c="slate" fontCls="font-tech" onHub={() => setTab('HUB')} tier={3}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${supplyChainDisruption ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Portfolio</div>
        <div className="text-2xl font-black text-slate-100">{guttedFirms} FIRMS GUTTED</div>
        <div className={`text-[10px] font-bold mt-1 ${currentPassive >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          Yield: ${fMny(currentPassive)}/mo
        </div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm">
          Dividend Multiplier: {peCompoundingYield.toFixed(2)}x
        </div>
      </div>

      {supplyChainDisruption && (
        <div className="ui-crisis p-4 flex flex-col gap-2 mb-4">
          <h4 className="text-red-500 font-black text-center text-xs uppercase">🚨 SUPPLY CHAIN DISRUPTION!</h4>
          <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">National franchise operations are frozen. Overhead is spiking.</p>
          <FlashBtn
            onClick={rResolveSupplyChain}
            dis={pl.bag < 2000000}
            label="STABILIZE LOGISTICS ($2M)"
            color="red-600"
            txt="white"
          />
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase px-1">
          <span>Buyout Progress</span>
          <span>{peProgress}%</span>
        </div>
        <div className="bg-black/50 h-3 rounded-full border border-slate-800 overflow-hidden">
          <div className="bg-slate-100 h-full transition-all duration-300" style={{ width: `${peProgress}%` }}></div>
        </div>

        <FlashBtn
          onClick={rPeClick}
          costStm={40}
          dis={pl.bag < 25000000 || supplyChainDisruption}
          label={supplyChainDisruption ? "🔒 RESOLVE DISRUPTION" : "EXECUTE LEVERAGED BUYOUT ($25M)"}
          color="slate-100"
          txt="black"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"Buyouts orchestrated via leveraged debt on national franchises."</p>
      </div>
    </LabShell>
  );
};

export const ArtTab = () => {
  const { pl, artCollection, artMarketSentiment, rArtBuy, venueState, rArtAuction, rArtSpeculate, rArtHostExhibit, flex, setTab } = useGame();
  const locked = pl.bag < 10000000;

  if (locked) return <LockedTierScreen section={3} />;

  const ART_PRICE = 12400000;
  const artCount = artCollection?.length || 0;
  const sentimentLabel = artMarketSentiment > 0 ? "📈 TRENDING UP (+10%)" : artMarketSentiment < 0 ? "📉 TRENDING DOWN (-10%)" : "⚖️ STAGNANT";
  const sentimentColor = artMarketSentiment > 0 ? "text-green-400" : artMarketSentiment < 0 ? "text-red-400" : "text-slate-300";

  // Progression States
  const isState4 = artCount >= 75 && flex?.archive?.owned;
  const isState2 = artCount >= 20;

  let stateMsg = "Own 20 elite pieces to host your first Private Exhibition.";
  if (venueState === "THE GALLERY / MUSEUM") {
    stateMsg = isState4 ? "Maximum passive revenue multiplier active. Legendary status achieved." : "Permanent passive daily revenue active. Elite patrons are watching.";
  } else if (venueState === "THE CURATED EXHIBIT") {
    stateMsg = "Host private exhibits for high-yield Clout and gate revenue.";
  }

  const displayedPieces = artCollection?.filter(p => p.isDisplayed) || [];
  const totalDisplayValue = displayedPieces.reduce((acc, curr) => acc + curr.baseValue, 0);

  return (
    <LabShell t="ART HUSTLE" c="pink" fontCls="font-hype" onHub={() => setTab('HUB')} tier={3}>
      <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-center mb-4">
        <div className="text-[10px] text-pink-400 drop-shadow-sm font-black uppercase tracking-widest mb-1">State: {venueState}</div>
        <div className={`text-xl font-black ${sentimentColor}`}>{sentimentLabel}</div>
        <p className="text-[9px] text-slate-400 mt-1 italic">"{stateMsg}"</p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
          <div className="text-[8px] text-slate-500 font-bold uppercase">Collection</div>
          <div className="text-lg font-black text-white">{artCount}</div>
          <div className="text-[8px] text-slate-500 uppercase">Pieces</div>
        </div>
        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 flex flex-col items-center">
          <div className="text-[8px] text-slate-500 font-bold uppercase">Est. Yield</div>
          <div className="text-lg font-black text-green-400">${fMny(venueState === "THE GALLERY / MUSEUM" ? Math.floor(totalDisplayValue * (isState4 ? 0.003 : 0.001)) : 0)}</div>
          <div className="text-[8px] text-slate-500 uppercase">Per Pulse</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FlashBtn
          onClick={rArtSpeculate}
          costStm={20}
          dis={pl.mentalHealth < 20}
          label="SPECULATE ON TRENDS (-20 MH)"
          color="slate-800"
          txt="pink-400"
        />
        <FlashBtn
          onClick={rArtBuy}
          costStm={35}
          dis={pl.bag < ART_PRICE}
          label={`PURCHASE ART Piece (${fMny(ART_PRICE)})`}
          color="pink-600"
          txt="white"
        />

        {isState2 && (
          <FlashBtn
            onClick={rArtHostExhibit}
            costStm={40}
            dis={pl.mentalHealth < 40}
            label="HOST PRIVATE EXHIBIT (-40 MH)"
            color="white"
            txt="black"
          />
        )}

        <button
          onClick={rArtAuction}
          disabled={artCount <= 0}
          className={`w-full py-3 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 duration-100 ${artCount > 0 ? 'bg-slate-700 text-white border border-slate-600' : 'bg-slate-800 text-slate-300 drop-shadow-sm opacity-40 cursor-not-allowed'}`}
        >
          {artCount > 0 ? "SOTHEBY'S AUCTION" : "VAULT EMPTY"}
        </button>
      </div>
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"High-volatility luxury assets. Collection size dictates operational venue."</p>
    </LabShell>
  );
};

export const CrpTab = () => {
  const { pl, crp, setCrp, rCrp, setTab } = useGame();
  return (
    <LabShell t="WEB3 LAB" c="green" fontCls="font-hack" onHub={() => setTab('HUB')} tier={3}>
      {!crp.l ? <>
        <input type="text" value={crp.t} placeholder="$TICKER" onChange={e => setCrp(c => ({ ...c, t: e.target.value }))} className="w-full p-4 bg-black border border-slate-700 rounded font-hack text-green-400 font-bold uppercase text-center" />
        <Stepper val={crp.i} setVal={v => setCrp(c => ({ ...c, i: v }))} min={5000} max={1000000} step={25000} label="Liquidity" />
        <FlashBtn onClick={() => rCrp('dep')} dis={pl.bag < crp.i || !crp.t} label={`DEPLOY - ${fMny(crp.i)}`} />
      </> : <>
        <div className="p-6 bg-green-900/20 border border-green-500 rounded text-center">
          <h4 className="text-3xl font-black text-green-400 mb-2 font-hack">{crp.t}</h4>
          <p className="font-hack text-slate-300 drop-shadow-sm">LP Pool: ${fMny(crp.l)}</p>
        </div>
        <Stepper val={crp.m} setVal={v => setCrp(c => ({ ...c, m: v }))} min={5000} max={250000} step={5000} label="Shill Budget" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <FlashBtn onClick={() => rCrp('shil')} dis={pl.bag < crp.m} label={`SHILL (${(crp.m / 1000).toFixed(0)}K)`} color="green-600" txt="white" />
          <FlashBtn onClick={() => rCrp('rug')} label="RUG PULL" />
        </div>
      </>}
    </LabShell>
  );
};
