import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn, UpgBtn, Toggles, Stepper } from '../ui/Shared.jsx';

export const SwTab = () => {
  const { pl, setPl, up, sw, setSw, dUp, rSw, rSwSpin, pfwActive, setPfwActive, adv, karmaFlags, setKarmaFlags } = useGame();

  const [bet, setBet] = React.useState(100);
  const [spinning, setSpinning] = React.useState(false);
  const [reels, setReels] = React.useState(['?', '?', '?', '?']);

  const handleSpin = async () => {
    if (spinning || pl.bag < bet || pl.mentalHealth < 10) return;
    setSpinning(true);
    setReels(['🌀', '🌀', '🌀', '🌀']);

    const res = await rSwSpin(bet);
    if (res) {
      setTimeout(() => {
        setReels(res.reels);
        setSpinning(false);
      }, 800);
    } else {
      setSpinning(false);
    }
  };

  const dropCost = React.useMemo(() => {
    const sU = Number(sw?.u) || 0;
    const sI = Number(sw?.i) || 1;
    const sA = Number(sw?.a) || 0;
    return (sU * (sI === 1 ? 15 : sI === 2 ? 40 : 90)) + (up.swFlg ? 0 : sA);
  }, [sw?.u, sw?.i, up.swFlg, sw?.a]);

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
        <div className="text-xs font-black text-purple-400">15 MH (DROP) / 10 MH (SPIN)</div>
      </div>
      {up.swPar && up.swFlg && (
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="text-[10px] font-black text-pink-400 drop-shadow-sm uppercase tracking-widest italic">PARIS FASHION WEEK (PFW)</div>
          <button
            onClick={() => setPfwActive(!pfwActive)}
            className={`w-12 h-6 rounded-full transition-all relative ${pfwActive ? 'bg-pink-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pfwActive ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>
      )}
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

        {up.swFlg && (
          <div className="mt-6 p-4 bg-black/60 border-2 border-purple-500/50 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.2)]">
            <h4 className="text-center text-xs font-black text-purple-300 mb-4 uppercase tracking-tighter italic">🎰 STREETWEAR RISK TERMINAL 🎰</h4>

            <div className="grid grid-cols-4 gap-2 mb-6">
              {reels.map((s, i) => (
                <div key={i} className={`h-16 flex items-center justify-center bg-slate-900 border-2 border-slate-700 rounded-xl text-3xl shadow-inner ${spinning ? 'animate-pulse scale-95 opacity-50' : 'animate-bounce-short'}`}>
                  {s}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Stepper val={bet} setVal={setBet} min={100} max={10000} step={100} label="Risk Amount" />
              <button
                onClick={handleSpin}
                disabled={spinning || pl.bag < bet || pl.mentalHealth < 10}
                className={`w-full py-4 rounded-xl font-black tracking-widest text-lg transition-all active:scale-95 shadow-lg
                  ${spinning ? 'bg-slate-700 text-slate-500 cursor-wait' : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-500 hover:to-indigo-500'}`}
              >
                {spinning ? 'PROCESSING...' : 'EXECUTE SPIN'}
              </button>

              <div className="bg-black/40 p-2 rounded-lg border border-slate-800 text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center">
                Payout: 4=200% | 3=100% | 2=50% | 1=BUST
              </div>
            </div>
          </div>
        )}
      </>}
    </LabShell>
  );
};

export const DropTab = () => {
  const { pl, up, drp, setDrp, dUp, rDrp, setTab, karmaFlags, setKarmaFlags } = useGame();
  const adCost = React.useMemo(() => (Number(drp?.u || 0) * 10) + Number(drp?.a || 0), [drp?.u, drp?.a]);
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
      <Stepper val={drp?.u} setVal={v => setDrp(s => ({ ...s, u: v }))} min={50} max={2000} step={250} label="Units" isCurr={false} />
      <Stepper val={drp?.p} setVal={v => setDrp(s => ({ ...s, p: v }))} min={15} max={up.drpFac ? 250 : 150} step={5} label="Price" />
      <Stepper val={drp?.a} setVal={v => setDrp(s => ({ ...s, a: v }))} min={0} max={500000} step={5000} label="Ad Budget" />
      <FlashBtn onClick={rDrp} costStm={10} dis={pl.bag < adCost} label={`LAUNCH AD - ${fMny(adCost)}`} />
    </LabShell>
  );
};


export const TechFlipTab = () => {
  const { pl, setPl, techItem, techFlipsComplete, rTechSource, rTechFixA, rTechFixB, rProcessBulkPallet, rTechMicroSolder, setTab, karmaFlags, setKarmaFlags, techInterns, setTechInterns, bulkPalletsUnlocked, setBulkPalletsUnlocked, enterpriseContracts, setEnterpriseContracts, executeChaosRoll } = useGame();

  const [repairProgress, setRepairProgress] = React.useState(0);
  const [lastX, setLastX] = React.useState(null);

  // Level 2 State
  const [bulkTriageActive, setBulkTriageActive] = React.useState(false);
  const [triageTimer, setTriageTimer] = React.useState(0);
  const [currentCard, setCurrentCard] = React.useState(null);
  const [triageCorrect, setTriageCorrect] = React.useState(0);
  const [triageIncorrect, setTriageIncorrect] = React.useState(0);
  const [flickAnim, setFlickAnim] = React.useState('');

  // Level 3 State
  const [labActive, setLabActive] = React.useState(false);
  const [sliderVal, setSliderVal] = React.useState(50);
  const [targetY, setTargetY] = React.useState(40); // 0-80
  const [holdTime, setHoldTime] = React.useState(0);
  const [labStatus, setLabStatus] = React.useState('IDLE');

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

  const handleSwipe = (e) => {
    if (repairProgress >= 100) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    if (lastX !== null) {
      const delta = Math.abs(clientX - lastX);
      if (delta > 5) {
        setRepairProgress(prev => Math.min(100, prev + 2));
      }
    }
    setLastX(clientX);
  };

  const resetSwipe = () => setLastX(null);

  // Level 2 Logic
  const startBulkPallet = () => {
    if (pl.bag < 5000 || pl.mentalHealth < 40) return;
    setBulkTriageActive(true);
    setTriageTimer(5);
    setTriageCorrect(0);
    setTriageIncorrect(0);
    spawnCard();
  };

  const spawnCard = () => {
    const types = ['SCRAP', 'REPAIRABLE', 'PRISTINE'];
    setCurrentCard(types[Math.floor(Math.random() * types.length)]);
    setFlickAnim('');
  };

  const handleFlick = (dir) => {
    if (!bulkTriageActive || !currentCard) return;

    let isCorrect = false;
    if (dir === 'left' && currentCard === 'SCRAP') isCorrect = true;
    if (dir === 'right' && currentCard === 'REPAIRABLE') isCorrect = true;
    if (dir === 'up' && currentCard === 'PRISTINE') isCorrect = true;

    if (isCorrect) setTriageCorrect(prev => prev + 1);
    else setTriageIncorrect(prev => prev + 1);

    setFlickAnim(dir);
    setTimeout(spawnCard, 200);
  };

  React.useEffect(() => {
    let interval;
    if (bulkTriageActive && triageTimer > 0) {
      interval = setInterval(() => setTriageTimer(t => t - 1), 1000);
    } else if (bulkTriageActive && triageTimer === 0) {
      setBulkTriageActive(false);
      rProcessBulkPallet(triageCorrect, triageIncorrect);
    }
    return () => clearInterval(interval);
  }, [bulkTriageActive, triageTimer, triageCorrect, triageIncorrect, rProcessBulkPallet]);

  // Level 3 Logic
  const startLab = () => {
    if (pl.bag < 1000) return; // Entry cost for high-end gear
    setLabActive(true);
    setLabStatus('CALIBRATING');
    setHoldTime(0);
  };

  React.useEffect(() => {
    let interval;
    if (labActive && labStatus === 'CALIBRATING') {
      interval = setInterval(() => {
        // Simple oscillation logic simulated here or via CSS
        // For logic check, we need to know where the oscillating target is.
        // We'll use a ref or state updated by a timer for better precision if needed,
        // but let's stick to a 100ms tick for the "sweet spot" check.

        // Let's simulate targetY oscillation 0-80
        setTargetY(y => {
          const time = Date.now() / 1000;
          return 40 + Math.sin(time * 2) * 40;
        });

        const diff = Math.abs(sliderVal - targetY);
        if (diff < 10) {
          setHoldTime(h => {
            if (h >= 20) { // 2 seconds
              setLabStatus('SUCCESS');
              return h;
            }
            return h + 1;
          });
        } else {
          setHoldTime(0);
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [labActive, labStatus, sliderVal, targetY]);

  React.useEffect(() => {
    if (labStatus === 'SUCCESS') {
      setLabActive(false);
      rTechMicroSolder(true);
      setLabStatus('IDLE');
    }
  }, [labStatus, rTechMicroSolder]);

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

      {/* LEVEL 3: MICRO-SOLDERING LAB */}
      {labActive && (
        <div className="tech-lab p-6 rounded-xl mb-4 flex gap-4 items-center h-64 overflow-hidden relative">
            <div className="flex-1 flex flex-col justify-between h-full">
               <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Calibration Wave</div>
               <div className="relative flex-1 bg-black/40 rounded border border-purple-500/30 my-2 overflow-hidden">
                  {/* Sweet Spot Boundary */}
                  <div
                    className="absolute w-full bg-green-500/20 border-y border-green-500/50 transition-all duration-100"
                    style={{ height: '20%', top: `${targetY}%` }}
                  ></div>
                  {/* Pointer */}
                  <div
                    className="absolute w-full h-1 bg-white shadow-[0_0_8px_white] transition-all duration-75"
                    style={{ top: `${sliderVal}%` }}
                  ></div>
               </div>
               <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 transition-all duration-100" style={{ width: `${(holdTime/20)*100}%` }}></div>
               </div>
            </div>

            <div className="w-12 h-full flex flex-col items-center gap-2">
               <div className="text-[8px] font-bold text-purple-300 uppercase">Fader</div>
               <input
                type="range"
                min="0" max="100"
                value={sliderVal}
                onChange={(e) => setSliderVal(parseInt(e.target.value))}
                className="w-full h-full accent-purple-500 cursor-pointer appearance-none bg-slate-800 rounded-lg"
                style={{ writingMode: 'bt-lr', WebkitAppearance: 'slider-vertical' }}
               />
            </div>

            <button
              onClick={() => { setLabActive(false); rTechMicroSolder(false); }}
              className="absolute top-2 right-2 text-white/30 hover:text-white"
            >✕</button>
        </div>
      )}

      {/* LEVEL 2: BULK PALLET TRIAGE */}
      {bulkTriageActive && !labActive && (
        <div className="tech-bulk p-4 rounded-xl mb-4 relative overflow-hidden flex flex-col items-center">
           <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-0.5 rounded font-black text-xs">0:0{triageTimer}</div>
           <div className="text-[10px] font-bold text-yellow-500 mb-4 uppercase tracking-tighter text-center">Flick: Left (Scrap) | Right (Repair) | Up (Pristine)</div>

           <div className="relative w-48 h-64 flex items-center justify-center">
              {currentCard && (
                <div
                  className={`flick-card w-40 h-56 bg-slate-700 border-2 border-slate-500 rounded-lg shadow-xl flex items-center justify-center text-xl font-black
                    ${flickAnim === 'left' ? '-translate-x-64 -rotate-12 opacity-0' :
                      flickAnim === 'right' ? 'translate-x-64 rotate-12 opacity-0' :
                      flickAnim === 'up' ? '-translate-y-64 opacity-0' : ''}`}
                >
                  [{currentCard}]
                </div>
              )}
           </div>

           <div className="grid grid-cols-3 gap-2 w-full mt-4">
              <button onClick={() => handleFlick('left')} className="py-2 bg-red-900/40 border border-red-500 text-red-500 text-[10px] font-bold rounded-lg uppercase">Scrap</button>
              <button onClick={() => handleFlick('up')} className="py-2 bg-cyan-900/40 border border-cyan-500 text-cyan-500 text-[10px] font-bold rounded-lg uppercase">Pristine</button>
              <button onClick={() => handleFlick('right')} className="py-2 bg-green-900/40 border border-green-500 text-green-500 text-[10px] font-bold rounded-lg uppercase">Repair</button>
           </div>
        </div>
      )}

      {/* LEVEL 1: THE WORKBENCH */}
      {!bulkTriageActive && !labActive && (
      <div className="tech-workbench p-4 rounded-xl mb-4 relative overflow-hidden">
        {!techItem ? (
           <div className="flex flex-col gap-2">
             <FlashBtn
                onClick={() => executeChaosRoll('TECH', rTechSource)}
                dis={pl.bag < 150}
                label="SOURCE BRICKED UNIT ($150)"
                color="cyan-600"
                txt="white"
              />
              {!bulkPalletsUnlocked ? (
                <button onClick={buyPallets} disabled={pl.bag < 10000} className="w-full py-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase rounded-lg">
                  Unlock Bulk Pallets ($10k)
                </button>
              ) : (
                <button onClick={startBulkPallet} disabled={pl.bag < 5000 || pl.mentalHealth < 40} className="w-full py-2 bg-yellow-600 text-black text-[10px] font-black uppercase rounded-lg">
                  📦 PROCESS BULK PALLET (-$5K)
                </button>
              )}
           </div>
        ) : (
          <div className="flex flex-col items-center">
             <div
              onMouseMove={handleSwipe}
              onTouchMove={handleSwipe}
              onMouseUp={resetSwipe}
              onMouseLeave={resetSwipe}
              onTouchEnd={resetSwipe}
              className="w-full h-32 bg-black/40 border-2 border-dashed border-cyan-500/50 rounded-lg flex items-center justify-center relative cursor-crosshair mb-4"
             >
                {repairProgress < 100 ? (
                  <>
                    <div className="absolute inset-0 opacity-10 animate-pulse bg-[url('https://www.transparenttextures.com/patterns/blueprint.png')]"></div>
                    <div className="text-cyan-500/50 font-black text-4xl uppercase opacity-20">Damaged</div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[8px] text-cyan-400 animate-bounce">↔ SWIPE TO REPAIR ↔</div>
                  </>
                ) : (
                  <div className="bg-cyan-500 text-black px-4 py-1 rounded font-black text-sm rotate-12 shadow-lg animate-bounce">REFURBISHED</div>
                )}
             </div>

             <div className="w-full h-2 bg-slate-800 rounded-full mb-4 overflow-hidden border border-slate-700">
                <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${repairProgress}%` }}></div>
             </div>

             {repairProgress >= 100 ? (
               <FlashBtn
                onClick={async () => {
                  const res = await rTechFixB();
                  setRepairProgress(0);
                  return res;
                }}
                label="FLIP FOR PROFIT"
                color="green-500"
                txt="white"
               />
             ) : (
               <div className="text-[10px] text-slate-400 italic">"Gently polish and align components..."</div>
             )}
          </div>
        )}
      </div>
      )}

      <div className="flex flex-col gap-2">
        <button onClick={buyIntern} disabled={pl.bag < 2000} className="w-full py-2 bg-slate-800 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all">
          Hire Tech Intern ($2k)
        </button>
        {techFlipsComplete >= 20 && (
          <button onClick={signEnterprise} disabled={pl.bag < 50000} className="w-full py-2 bg-cyan-900/40 border border-cyan-400 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-cyan-800 disabled:opacity-50 transition-all">
            Sign Enterprise Contract ($50k)
          </button>
        )}
        {techInterns > 0 && (
          <button onClick={startLab} disabled={pl.bag < 1000 || labActive} className="w-full py-2 bg-purple-900/40 border border-purple-400 text-white text-[10px] font-bold uppercase rounded-lg">
            🔬 OPEN MICRO-SOLDERING LAB ($1K)
          </button>
        )}
      </div>

      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"High-precision repairs require steady hands."</p>
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
