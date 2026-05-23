import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn, UpgBtn, Toggles, Stepper } from '../ui/Shared.jsx';

export const SwTab = () => {
  const { pl, setPl, up, sw, setSw, dUp, rSw, adv, karmaFlags, setKarmaFlags } = useGame();

  const dropCost = React.useMemo(() => {
    return (sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a);
  }, [sw.u, sw.i, up.swFlg, sw.a]);

  const handleGlobalSupply = async () => {
    await new Promise(r => setTimeout(r, 2000));
    const roll = Math.random(); let rev = 0; let msg = '';
    if (roll < 0.12) { rev = Math.floor(1000000 * (0.1 + Math.random() * 0.3)); msg = 'PR nightmare. Recalls overseas. Net +$' + fMny(rev - 1000000); }
    else if (roll < 0.35) { rev = Math.floor(1000000 * (1.2 + Math.random() * 0.8)); msg = 'Slow month. Global retail net +$' + fMny(rev - 1000000); }
    else if (roll < 0.80) { rev = Math.floor(1000000 * (2.5 + Math.random() * 1.5)); msg = 'Units moved worldwide. Net +$' + fMny(rev - 1000000); }
    else { rev = Math.floor(1000000 * (5 + Math.random() * 3)); msg = 'VIRAL SELLOUT GLOBALLY! Net +$' + fMny(rev - 1000000); }
    console.log(msg);
    setPl(p => ({ ...p, bag: p.bag - 1000000 + rev }));
    adv(); return rev - 1000000;
  };

  return (
    <LabShell hustleKey="streetwear" t="STREETWEAR LAB" c="purple" fontCls="font-hype" tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">USE CHEAP BLANKS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, usedCheapBlanks: !f.usedCheapBlanks }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.usedCheapBlanks ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.usedCheapBlanks ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hustle Cost</div>
        <div className="text-xs font-black text-purple-400">15 MENTAL HEALTH</div>
      </div>
      {!up.swIp
        ? <UpgBtn onClk={() => dUp('swIp', 250000, 'IP Secured. 📜')} cost={250000} title="BUY IP" pB={pl.bag} />
        : !up.swFlg
        ? <UpgBtn onClk={() => dUp('swFlg', 5000000, 'Flagship Opened! 🏬')} cost={5000000} title="SOHO FLAGSHIP" reqA={150} pB={pl.bag} pA={pl.aura} />
        : !up.swPar
        ? <UpgBtn onClk={() => dUp('swPar', 25000000, 'Paris Debut. 🗼')} cost={25000000} title="PARIS FASHION WEEK" reqA={300} reqC={100} pB={pl.bag} pA={pl.aura} pC={pl.clout} />
        : <UpgBtn onClk={() => dUp('swGlb', 150000000, 'Global. Aura bleeding. 🌍')} cost={150000000} title="GLOBAL DISTRIBUTION" unl={up.swGlb} pB={pl.bag} />
      }
      {up.swGlb ? (
        <FlashBtn onClick={handleGlobalSupply} label="SUPPLY GLOBAL - COST: M" />
      ) : <>
        <Toggles opts={['Tees', 'Hoodies', 'Puffers']} active={sw.i} setVal={v => setSw(s => ({ ...s, i: v }))} color="purple" />
        <Stepper val={sw.u} setVal={v => setSw(s => ({ ...s, u: v }))} min={10} max={up.swPar ? 50000 : up.swFlg ? 10000 : 2500} step={50} label="Units" isCurr={false} />
        <Stepper val={sw.p} setVal={v => setSw(s => ({ ...s, p: v }))} min={15} max={up.swPar ? 2500 : up.swFlg ? 1000 : 500} step={5} label="Price" />
        {!up.swFlg && <Stepper val={sw.a} setVal={v => setSw(s => ({ ...s, a: v }))} min={0} max={250000} step={5000} label="Ad Spend" />}
        <FlashBtn onClick={rSw} costStm={15} dis={pl.bag < dropCost} label={`DROP - ${fMny(dropCost)}`} />
      </>}
    </LabShell>
  );
};

export const DropTab = () => {
  const { pl, up, drp, setDrp, dUp, rDrp, setTab, karmaFlags, setKarmaFlags } = useGame();
  const adCost = React.useMemo(() => (drp.u * 10) + drp.a, [drp.u, drp.a]);
  return (
    <LabShell hustleKey="dropship" t="DROPSHIPPING" c="blue" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">IGNORE REFUNDS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, ignoredRefunds: !f.ignoredRefunds }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.ignoredRefunds ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.ignoredRefunds ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Setup Cost</div>
        <div className="text-xs font-black text-purple-400">10 MENTAL HEALTH</div>
      </div>
      <UpgBtn onClk={() => dUp('drpFac', 250000, 'Factory Secured. 🏭')} cost={250000} title="PRIVATE LABEL FACTORY" unl={up.drpFac} pB={pl.bag} />
      <Toggles opts={['LEDs', 'Fake Pods', 'Supps']} active={drp.i} setVal={v => setDrp(s => ({ ...s, i: v }))} color="blue-600" />
      <Stepper val={drp.u} setVal={v => setDrp(s => ({ ...s, u: v }))} min={50} max={10000} step={250} label="Units" isCurr={false} />
      <Stepper val={drp.p} setVal={v => setDrp(s => ({ ...s, p: v }))} min={15} max={up.drpFac ? 250 : 150} step={5} label="Price" />
      <Stepper val={drp.a} setVal={v => setDrp(s => ({ ...s, a: v }))} min={0} max={500000} step={5000} label="Ad Budget" />
      <FlashBtn onClick={rDrp} costStm={10} dis={pl.bag < adCost} label={`LAUNCH AD - ${fMny(adCost)}`} />
    </LabShell>
  );
};

export const VintageTab = () => {
  const {
    pl, collectiblePhase, vintageRevenueTracker, sneakerBackdoorPlug, vaultHoldings,
    rVintage, rVinCh, rSneakerDrop, rBuyConsignment, rBuyVault, rVaultAuction, bAss, vinCh, setTab, karmaFlags, setKarmaFlags
  } = useGame();

  // ─── PHASE A: VINTAGE RESELLING (MUD) ──────────────────────────────────────
  if (collectiblePhase === 'VINTAGE') {
    return (
      <LabShell hustleKey="vintage" t="VINTAGE RESELLING" c="amber" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">SELL BOOTLEGS (RISK)</div>
          <button
            onClick={() => setKarmaFlags(f => ({ ...f, soldBootleg: !f.soldBootleg }))}
            className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.soldBootleg ? 'bg-red-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.soldBootleg ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-slate-900 border border-green-500/30 p-4 rounded-2xl text-center">
            <h3 className="text-xl font-black text-green-400 font-hype tracking-widest">THRIFT BIN DIPPING</h3>
            <p className="text-[10px] text-slate-400 mt-1 italic">"Accumulate $10,000 gross revenue to unlock the Sneaker Underworld."</p>
            <div className="mt-3 bg-black/40 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (vintageRevenueTracker / 10000) * 100)}%` }}></div>
            </div>
            <div className="text-[9px] text-slate-400 mt-1 font-mono">${fMny(vintageRevenueTracker)} / $10,000 SECURED</div>
          </div>

          {vinCh === 'bootleg' ? (
            <div className="bg-red-900/40 border-2 border-red-500 p-4 rounded-xl flex flex-col gap-3 animate-pulse">
              <h4 className="text-red-400 font-black text-center uppercase text-sm">⚠️ BOOTLEG SPOTTED!</h4>
              <p className="text-[10px] text-slate-300 drop-shadow-sm text-center italic">The "Grail" you found is a high-quality replica.</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => rVinCh('burn')} className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-[10px] font-bold uppercase transition-all">Burn It Legally (+$0, +1 Aura)</button>
                <button onClick={() => rVinCh('pass')} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg text-[10px] font-bold uppercase transition-all">Pass It Off (+$150, -10 Aura)</button>
              </div>
            </div>
          ) : (
            <FlashBtn
              onClick={rVintage}
              costStm={10}
              dis={pl.bag < 50}
              label="HIT THE GOODWILL BINS (-$50)"
              color="green-600"
              txt="white"
            />
          )}
        </div>
      </LabShell>
    );
  }

  // ─── PHASE B: SNEAKER HUNTING OG (STREET) ──────────────────────────────────
  if (collectiblePhase === 'SNEAKER') {
    return (
      <LabShell hustleKey="vintage" t="SNEAKER UNDERWORLD" c="orange" fontCls="font-hype" onHub={() => setTab('HUB')} tier={1}>
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-slate-900 border border-orange-500/30 p-4 rounded-2xl text-center">
            <h3 className="text-xl font-black text-orange-400 font-hype tracking-widest">SNEAKER HUNTING OG</h3>
            <p className="text-[10px] text-slate-400 mt-1 italic">Flip deadstock kicks or get burned by reps. Invest $1.5M to launch a platform.</p>
          </div>

          <div className="grid grid-cols-1 gap-2">
            <FlashBtn
              onClick={rSneakerDrop}
              costStm={10}
              dis={pl.bag < 300}
              label="COP HYPE DROP (-$300)"
              color="orange-600"
              txt="white"
            />

            {!sneakerBackdoorPlug && (
              <button onClick={() => bAss('sneakerBackdoorPlug', 5000, 'Backdoor Store Plug')} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center hover:border-yellow-500/40 transition-all">
                <div className="text-left">
                  <div className="font-bold text-sm text-yellow-400 uppercase tracking-widest">BRIBE BACKDOOR PLUG</div>
                  <div className="text-[10px] text-slate-400">Cost: $5,000. Removes drop failure risk.</div>
                </div>
                <span className="text-yellow-400 font-black">$5K</span>
              </button>
            )}
          </div>

          <button
            onClick={rBuyConsignment}
            disabled={pl.bag < 1500000}
            className="w-full py-3 bg-orange-600 disabled:bg-slate-800 disabled:opacity-40 text-white font-black rounded-xl hover:bg-orange-500 transition-all text-xs tracking-widest uppercase"
          >
            LAUNCH CONSIGNMENT PLATFORM (-$1.5M)
          </button>
        </div>
      </LabShell>
    );
  }

  // ─── PHASE C: CONSIGNMENT PLATFORM (CORP/ELITE) ────────────────────────────
  if (collectiblePhase === 'CONSIGNMENT') {
    return (
      <LabShell hustleKey="vintage" t="CONSIGNMENT EMPIRE" c="cyan" fontCls="font-hype" onHub={() => setTab('HUB')} tier={2}>
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 p-4 rounded-2xl text-center">
            <h3 className="text-xl font-black text-cyan-400 font-hype tracking-widest">HYPE CONSIGNMENT NETWORK</h3>
            <p className="text-[10px] text-slate-400 mt-1">Your platform collects a passive fee on all local street-culture trading volume.</p>
            <div className="mt-2 text-xs font-bold text-green-400 uppercase tracking-tighter animate-pulse">Generating passive income via clout multipliers</div>
          </div>

          <button
            onClick={rBuyVault}
            disabled={pl.bag < 5000000}
            className="w-full py-4 bg-cyan-600 disabled:bg-slate-800 disabled:opacity-40 text-white font-black rounded-xl hover:bg-cyan-500 transition-all text-xs tracking-widest uppercase"
          >
            BUILD PRIVATE BLUE-CHIP VAULT (-$5M)
          </button>
        </div>
      </LabShell>
    );
  }

  // ─── PHASE D: THE COLLECTIBLE VAULT (MOGUL/PRESIDENT) ─────────────────────
  if (collectiblePhase === 'VAULT') {
    return (
      <LabShell hustleKey="vintage" t="COLLECTIBLE VAULT" c="purple" fontCls="font-hype" onHub={() => setTab('HUB')} tier={4}>
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 p-4 rounded-2xl text-center">
            <h3 className="text-xl font-black text-purple-400 font-hype tracking-widest">BLUE-CHIP VAULT</h3>
            <p className="text-[10px] text-slate-400 mt-1">Holding legendary historical assets. Vault values appreciate by 12% annually.</p>
          </div>

          <FlashBtn
            onClick={rVaultAuction}
            costStm={15}
            dis={pl.bag < 500000}
            label="ATTEND SOTHEBY'S AUCTION (-$500K)"
            color="purple-600"
            txt="white"
          />

          <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-left text-xs">
            <div className="text-purple-400 font-black mb-2 uppercase tracking-wider flex justify-between">
              <span>📦 Vault Inventory</span>
              <span>{vaultHoldings.length} ITEMS</span>
            </div>
            {vaultHoldings.length === 0 ? (
              <span className="text-slate-500 italic">Vault empty. Source high-end relics at top auctions.</span>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {vaultHoldings.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-800/50 pb-1 last:border-0">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-purple-300 font-mono">${fMny(item.cost)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </LabShell>
    );
  }

  return null;
};

export const SmmTab = () => {
  const { pl, smmClients, clientCrisis, rSmmPitch, rSmmFix, setTab, karmaFlags, setKarmaFlags } = useGame();
  return (
    <LabShell hustleKey="smm" t="SMM MICRO-AGENCY" c="sky" fontCls="font-tech" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">IGNORE CLIENT CRISIS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, ignoredSmmCrisis: !f.ignoredSmmCrisis }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.ignoredSmmCrisis ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.ignoredSmmCrisis ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Pitch Cost</div>
        <div className="text-xs font-black text-purple-400">20 MENTAL HEALTH</div>
      </div>
      <div className="flex flex-col gap-4">
        <div className={`bg-black/40 p-4 rounded-xl border transition-all text-center ${clientCrisis ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
          <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Active Portfolio</div>
          <div className={`text-2xl font-black ${clientCrisis ? 'text-red-500' : 'text-sky-400'}`}>{smmClients} CLIENTS</div>
          <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">Yield: +${fMny(smmClients * 300)}/mo | +{smmClients * 2} Aura/mo</div>
        </div>

        {clientCrisis && (
          <div className="ui-crisis p-4 flex flex-col gap-2">
            <h4 className="text-red-500 font-black text-center text-xs uppercase">🚨 CLIENT CRISIS: ALGORITHM SHIFT!</h4>
            <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">Clients are panicking. Fix it now or lose 1 retainer next month.</p>
            <FlashBtn
              onClick={rSmmFix}
              costStm={15}
              label="FIX CONTENT STRATEGY"
              color="red-600"
              txt="white"
            />
          </div>
        )}

        <FlashBtn
          onClick={rSmmPitch}
          costStm={20}
          dis={pl.clout < 15 || clientCrisis}
          label={clientCrisis ? "🔒 CRISIS: SOLVE TO PITCH" : pl.clout >= 15 ? "PITCH LOCAL BUSINESS" : "🔒 NEED 15 CLOUT TO PITCH"}
          color="sky-600"
          txt="white"
        />
        <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">"Flat 50% success rate. Street leverage is everything."</p>
      </div>
    </LabShell>
  );
};

export const TechFlipTab = () => {
  const { pl, setPl, techItem, techFlipsComplete, rTechSource, rTechFixA, rTechFixB, setTab, karmaFlags, setKarmaFlags, techInterns, setTechInterns, bulkPalletsUnlocked, setBulkPalletsUnlocked, enterpriseContracts, setEnterpriseContracts } = useGame();

  const buyIntern = () => {
    if (pl.bag >= 2000) {
      setPl(p => ({ ...p, bag: p.bag - 2000 }));
      setTechInterns(prev => prev + 1);
    }
  };

  const buyPallets = () => {
    if (pl.bag >= 10000) {
      setPl(p => ({ ...p, bag: p.bag - 10000 }));
      setBulkPalletsUnlocked(true);
    }
  };

  const signEnterprise = () => {
    if (pl.bag >= 50000 && techFlipsComplete >= 20) {
      setPl(p => ({ ...p, bag: p.bag - 50000 }));
      setEnterpriseContracts(prev => prev + 1);
    }
  };

  return (
    <LabShell hustleKey="tech" t="TECH FLIPPING" c="cyan" fontCls="font-tech" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">USE CHEAP PARTS (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, usedCheapParts: !f.usedCheapParts }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.usedCheapParts ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.usedCheapParts ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Repair Cost</div>
        <div className="text-xs font-black text-purple-400">10-15 MENTAL HEALTH</div>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Mastery</div>
          <div className="text-lg font-black text-cyan-400">{techFlipsComplete} FLIPS</div>
        </div>
        <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Interns</div>
          <div className="text-lg font-black text-cyan-400">{techInterns}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {!bulkPalletsUnlocked && (
          <button onClick={buyPallets} disabled={pl.bag < 10000} className="w-full py-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all">
            Unlock Bulk Pallets ($10k)
          </button>
        )}
        <button onClick={buyIntern} disabled={pl.bag < 2000} className="w-full py-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all">
          Hire Tech Intern ($2k)
        </button>
        {techFlipsComplete >= 20 && (
          <button onClick={signEnterprise} disabled={pl.bag < 50000} className="w-full py-2 bg-cyan-900/40 border border-cyan-400 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-cyan-800 disabled:opacity-50 transition-all">
            Sign Enterprise Contract ($50k)
          </button>
        )}
      </div>

      {!techItem ? (
        <FlashBtn
          onClick={rTechSource}
          dis={pl.bag < 150}
          label="SOURCE BRICKED UNIT ($150)"
          color="cyan-600"
          txt="white"
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="bg-cyan-900/20 border border-cyan-700 p-3 rounded-lg text-center">
            <div className="text-xs font-bold text-cyan-400 uppercase">Item Sourced: {techItem.name}</div>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <FlashBtn
              onClick={rTechFixA}
              costStm={10}
              dis={pl.bag < 30}
              label="CHEAP PARTS ($30, 50% WIN)"
              color="slate"
              txt="white"
            />
            <FlashBtn
              onClick={rTechFixB}
              costStm={15}
              dis={pl.bag < 100}
              label="PREMIUM OEM PARTS ($100, 100% WIN)"
              color="cyan-600"
              txt="white"
            />
          </div>
        </div>
      )}
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"Cheap parts risk bricking the unit and losing Aura."</p>
    </LabShell>
  );
};

export const GigTab = () => {
  const { pl, runnerCount, runnerBurnout, rRunnerRecruit, rRunnerFix, setTab, karmaFlags, setKarmaFlags } = useGame();
  return (
    <LabShell hustleKey="runners" t="GIG RUNNER NETWORK" c="orange" fontCls="font-tech" onHub={() => setTab('HUB')} tier={0}>
      <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
        <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">IGNORE RUNNER WELFARE (RISK)</div>
        <button
          onClick={() => setKarmaFlags(f => ({ ...f, ignoredRunnerWelfare: !f.ignoredRunnerWelfare }))}
          className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.ignoredRunnerWelfare ? 'bg-red-600' : 'bg-slate-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.ignoredRunnerWelfare ? 'right-1' : 'left-1'}`}></div>
        </button>
      </div>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-2 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Recruit Cost</div>
        <div className="text-xs font-black text-purple-400">25 MENTAL HEALTH</div>
      </div>
      <div className={`bg-black/40 p-4 rounded-xl border transition-all text-center mb-4 ${runnerBurnout ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Active Fleet</div>
        <div className={`text-2xl font-black ${runnerBurnout ? 'text-red-500' : 'text-orange-400'}`}>{runnerCount} COURIERS</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">Yield: +${fMny(runnerCount * 150)}/mo | +{runnerCount * 3} Aura/mo</div>
      </div>

      {runnerBurnout && (
        <div className="ui-crisis p-4 flex flex-col gap-2 mb-4">
          <h4 className="text-red-500 font-black text-center text-xs uppercase">🚨 FLEET BURNOUT!</h4>
          <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">Runners are exhausted. Pay a bonus or lose 1 courier next month.</p>
          <FlashBtn
            onClick={rRunnerFix}
            dis={pl.bag < 200}
            label="PAY $200 BONUS"
            color="red-600"
            txt="white"
          />
        </div>
      )}

      <FlashBtn
        onClick={rRunnerRecruit}
        costStm={25}
        dis={pl.clout < 20 || pl.bag < 300 || runnerBurnout}
        label={runnerBurnout ? "🔒 RESOLVE BURNOUT" : pl.clout >= 20 ? "RECRUIT COURIER ($300)" : "🔒 NEED 20 CLOUT"}
        color="orange-600"
        txt="white"
      />
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"High mentalHealth cost to vet and onboard new runners."</p>
    </LabShell>
  );
};
