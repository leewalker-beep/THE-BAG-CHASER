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
    if (roll < 0.12) { rev = Math.floor(200000 * (0.1 + Math.random() * 0.3)); msg = 'PR nightmare. Recalls overseas. Net +$' + fMny(rev - 200000); }
    else if (roll < 0.35) { rev = Math.floor(200000 * (1.2 + Math.random() * 0.8)); msg = 'Slow month. Global retail net +$' + fMny(rev - 200000); }
    else if (roll < 0.80) { rev = Math.floor(200000 * (2.5 + Math.random() * 1.5)); msg = 'Units moved worldwide. Net +$' + fMny(rev - 200000); }
    else { rev = Math.floor(200000 * (5 + Math.random() * 3)); msg = 'VIRAL SELLOUT GLOBALLY! Net +$' + fMny(rev - 200000); }
    setPl(p => ({ ...p, bag: p.bag - 200000 + rev }));
    adv(); return rev - 200000;
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
        <Stepper val={sw.u} setVal={v => setSw(s => ({ ...s, u: v }))} min={10} max={up.swPar ? 50000 : up.swFlg ? 2000 : 2500} step={50} label="Units" isCurr={false} />
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
      <Stepper val={drp.u} setVal={v => setDrp(s => ({ ...s, u: v }))} min={50} max={2000} step={250} label="Units" isCurr={false} />
      <Stepper val={drp.p} setVal={v => setDrp(s => ({ ...s, p: v }))} min={15} max={up.drpFac ? 250 : 150} step={5} label="Price" />
      <Stepper val={drp.a} setVal={v => setDrp(s => ({ ...s, a: v }))} min={0} max={500000} step={5000} label="Ad Budget" />
      <FlashBtn onClick={rDrp} costStm={10} dis={pl.bag < adCost} label={`LAUNCH AD - ${fMny(adCost)}`} />
    </LabShell>
  );
};


export const TechFlipTab = () => {
  const { pl, setPl, techItem, techFlipsComplete, rTechSource, rTechFixA, rTechFixB, setTab, karmaFlags, setKarmaFlags, techInterns, setTechInterns, bulkPalletsUnlocked, setBulkPalletsUnlocked, enterpriseContracts, setEnterpriseContracts, executeChaosRoll } = useGame();

  const buyIntern = () => {
    if (pl.bag >= 2000) {
      setPl(p => ({ ...p, bag: p.bag - 2000 }));
      setTechInterns(prev => prev + 1);
    }
  };

  const buyPallets = () => {
    if (pl.bag >= 2000) {
      setPl(p => ({ ...p, bag: p.bag - 2000 }));
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
        {!bulkPalletsUnlocked ? (
          <button onClick={buyPallets} disabled={pl.bag < 10000} className="w-full py-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all">
            Unlock Bulk Pallets ($10k)
          </button>
        ) : (
          <button
            onClick={rProcessBulkPallet}
            disabled={pl.bag < 5000 || pl.mentalHealth < 40}
            className="w-full py-2 bg-cyan-600 text-white text-[10px] font-black uppercase rounded-lg hover:bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            📦 PROCESS BULK PALLET (-$5K, -40 MH)
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
          onClick={() => executeChaosRoll('TECH', rTechSource)}
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

export const DeliveryTab = () => {
  const { pl, rDelivery, setTab, executeChaosRoll } = useGame();
  return (
    <LabShell hustleKey="delivery" t="GIG DELIVERY" c="emerald" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-4 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hustle Cost</div>
        <div className="text-xs font-black text-purple-400">15 MENTAL HEALTH</div>
      </div>
      <FlashBtn
        onClick={() => executeChaosRoll('DELIVERY', rDelivery)}
        costStm={15}
        dis={pl.mentalHealth < 15}
        label="DELIVER HOT FOOD (+$25)"
        color="emerald-600"
        txt="white"
      />
    </LabShell>
  );
};

export const PlasmaTab = () => {
  const { pl, rPlasma, setTab, executeChaosRoll } = useGame();
  return (
    <LabShell hustleKey="plasma" t="PLASMA DONATION" c="red" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-4 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hustle Cost</div>
        <div className="text-xs font-black text-purple-400">40 MENTAL HEALTH</div>
      </div>
      <FlashBtn
        onClick={() => executeChaosRoll('PLASMA', rPlasma)}
        costStm={40}
        dis={pl.mentalHealth < 40}
        label="SELL PLASMA (+$60)"
        color="red-600"
        txt="white"
      />
    </LabShell>
  );
};

export const SurveyTab = () => {
  const { pl, rSurvey, setTab, executeChaosRoll } = useGame();
  return (
    <LabShell hustleKey="survey" t="SURVEY GRIND" c="indigo" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-4 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hustle Cost</div>
        <div className="text-xs font-black text-purple-400">10 MENTAL HEALTH</div>
      </div>
      <FlashBtn
        onClick={() => executeChaosRoll('SURVEY', rSurvey)}
        costStm={10}
        dis={pl.mentalHealth < 10}
        label="TAKE MARKET SURVEY (+$10)"
        color="indigo-600"
        txt="white"
      />
    </LabShell>
  );
};

export const LaborTab = () => {
  const { pl, rLabor, setTab, executeChaosRoll } = useGame();
  return (
    <LabShell hustleKey="labor" t="STREET LABOR" c="amber" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
      <div className="bg-black/30 p-2 rounded-lg border border-slate-800 mb-4 text-center">
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Hustle Cost</div>
        <div className="text-xs font-black text-purple-400">25 MENTAL HEALTH</div>
      </div>
      <FlashBtn
        onClick={() => executeChaosRoll('LABOR', rLabor)}
        costStm={25}
        dis={pl.mentalHealth < 25}
        label="FLYER DISTRIBUTION (+$45)"
        color="amber-600"
        txt="white"
      />
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
