import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { useGameStore } from '../../gameStore.js';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn, UpgBtn, Toggles, Stepper, LockedTierScreen } from '../ui/Shared.jsx';

export const CcTab = () => {
  const { pl, up, cc, setCc, dUp, rCc, setTab } = useGame();
  return (
    <LabShell t="CREATOR LAB" c="emerald" fontCls="font-tech" onHub={() => setTab('HUB')} tier={1}>
      {!up.ccAge
        ? <UpgBtn onClk={() => dUp('ccAge', 1000000, 'Agency launched. 🤝')} cost={1000000} title="TALENT AGENCY" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('ccNet', 20000000, 'Network Launched! 📺')} cost={20000000} title="STREAMING NETWORK" unl={up.ccNet} reqC={150} pB={pl.bag} pC={pl.clout} />
      }
      <div className="flex bg-slate-800 p-1 rounded-xl mb-2">
        <button onClick={() => setCc(c => ({ ...c, m: 'solo' }))} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'solo' ? 'bg-emerald-600 text-white' : 'text-slate-300 drop-shadow-sm'}`}>SOLO</button>
        <button onClick={() => { if (pl.bag >= 100000 && pl.clout >= 50) setCc(c => ({ ...c, m: 'house' })); }} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'house' ? 'bg-emerald-600 text-white' : pl.bag >= 100000 && pl.clout >= 50 ? 'text-slate-300 drop-shadow-sm' : 'text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.bag >= 100000 && pl.clout >= 50 ? 'HOUSE' : '🔒 ($100K/50C)'}</button>
      </div>
      {cc.m === 'house' ? <>
        <Toggles opts={['Drama', 'Gaming', 'Lifestyle']} active={cc.v} setVal={v => setCc(s => ({ ...s, v }))} color="emerald-600" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <FlashBtn onClick={() => rCc('feu')} dis={pl.bag < 25000} label="FEUD ($25K)" color="emerald-600" txt="white" />
          <FlashBtn onClick={() => rCc('mch')} dis={pl.bag < 25000} label="COLLAB ($25K)" />
        </div>
        {up.ccAge && !up.ccNet && <FlashBtn onClick={() => rCc('meg')} label="MEGA-DEAL ($0)" color="purple" txt="white" />}
        {up.ccNet && <FlashBtn onClick={() => rCc('net')} label="COLLECT SUBS ($0)" color="yellow-600" txt="white" />}
      </> : <>
        <Toggles opts={['Brainrot', 'Finance', 'IRL']} active={cc.n} setVal={v => setCc(s => ({ ...s, n: v }))} color="emerald-600" />
        <FlashBtn onClick={() => rCc('sol')} dis={pl.bag < 500} label="STREAM - $500" />
      </>}
    </LabShell>
  );
};

export const PodTab = () => {
  const { pl, up, pod, setPod, dUp, rPod, setTab } = useGame();
  const recCost = React.useMemo(() => (up.podCmp ? 0 : pod.q) + (pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000), [up.podCmp, pod.q, pod.g]);
  return (
    <LabShell t="PODCAST NET" c="pink" onHub={() => setTab('HUB')} tier={1}>
      <UpgBtn onClk={() => dUp('podCmp', 500000, 'Compound Built. 🎙️')} cost={500000} title="BUILD COMPOUND" unl={up.podCmp} pB={pl.bag} />
      <div className="flex gap-1 w-full">
        <button onClick={() => setPod(s => ({ ...s, g: 1 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 1 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Z-List</button>
        <button onClick={() => { if (pl.clout >= 50) setPod(s => ({ ...s, g: 2 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 2 ? 'bg-pink-600 text-white' : pl.clout >= 50 ? 'bg-slate-800 text-slate-300 drop-shadow-sm' : 'bg-slate-900 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.clout >= 50 ? 'Drama' : '🔒(50C)'}</button>
        <button onClick={() => { if (pl.clout >= 100) setPod(s => ({ ...s, g: 3 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 3 ? 'bg-pink-600 text-white' : pl.clout >= 100 ? 'bg-slate-800 text-slate-300 drop-shadow-sm' : 'bg-slate-900 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.clout >= 100 ? 'A-List' : '🔒(100C)'}</button>
        {up.podCmp && <button onClick={() => setPod(s => ({ ...s, g: 4 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 4 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Billionaire</button>}
      </div>
      {!up.podCmp && <Stepper val={pod.q} setVal={v => setPod(s => ({ ...s, q: v }))} min={10000} max={100000} step={10000} label="Studio Rental" />}
      <FlashBtn onClick={rPod} dis={pl.bag < recCost} label={`RECORD - $${fMny(recCost)}`} />
    </LabShell>
  );
};

export const BoxTab = () => {
  const { pl, up, box, setBox, dUp, rBox, setTab } = useGame();
  const fightActive = useGameStore(state => state.fightActive);
  const fightCost = React.useMemo(() => (up.boxBrd ? 0 : box.b) + (up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000)), [up.boxBrd, box.b, up.boxLg, box.v]);
  return (
    <LabShell t="FIGHT PROMOTER" c="orange" onHub={() => setTab('HUB')} tier={1}>
      <div
        className={`fixed inset-0 z-[10002] bg-red-600/30 backdrop-blur-sm flex items-center justify-center pointer-events-none overflow-hidden transition-opacity duration-300 ${fightActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          className="absolute left-0 top-1/2 text-8xl md:text-9xl transition-all duration-300 ease-out"
          style={{
            transform: fightActive ? 'translate(20vw, -50%)' : 'translate(-100%, -50%)',
            opacity: fightActive ? 1 : 0
          }}
        >🥊</div>
        <div
          className="absolute right-0 top-1/2 text-8xl md:text-9xl transition-all duration-300 ease-out"
          style={{
            transform: fightActive ? 'translate(-20vw, -50%) scaleX(-1)' : 'translate(100%, -50%) scaleX(-1)',
            opacity: fightActive ? 1 : 0
          }}
        >🥊</div>
      </div>
      {!up.boxLg
        ? <UpgBtn onClk={() => dUp('boxLg', 2000000, 'League Founded. 🥊')} cost={2000000} title="FOUND LEAGUE" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('boxBrd', 15000000, 'Network Deal! 📺')} cost={15000000} title="BROADCAST DEAL" unl={up.boxBrd} reqC={125} pB={pl.bag} pC={pl.clout} />
      }
      {!up.boxLg && <Toggles opts={['Basement', 'Arena', 'Stadium']} active={box.v} setVal={v => setBox(s => ({ ...s, v }))} color="orange-600" />}
      <Toggles opts={up.boxLg ? ['Scrap', 'MMAvYT', 'Pro', 'Super'] : ['Scrap', 'MMAvYT', 'Pro']} active={box.t} setVal={v => setBox(s => ({ ...s, t: v }))} color="orange-600" />
      {!up.boxBrd && <Stepper val={box.b} setVal={v => setBox(s => ({ ...s, b: v }))} min={box.t === 4 ? 10000000 : 50004} max={box.t === 4 ? 50000000 : 5000000} step={50000} label="Promo Budget" />}
      <Toggles opts={['Respectful', 'Script Brawl']} active={box.p} setVal={v => setBox(s => ({ ...s, p: v }))} color="orange-600" />
      <FlashBtn onClick={rBox} dis={pl.bag < fightCost} label={up.boxBrd ? 'HOST NETWORK FIGHT ($0)' : `HOST - $${fMny(fightCost)}`} />
    </LabShell>
  );
};

export const AudioTab = () => {
  const { pl, setPl, audioTracks, setAudioTracks, sampleStrike, rAudioRelease, rAudioSettle, setTab, audioUpgrades, setAudioUpgrades, talentScouters, setTalentScouters, holwoodSyncActive, setHollywoodSyncActive } = useGame();
  const locked = pl.bag < 100000 || pl.clout < 30;

  const buyUpgrade = (key, cost) => {
    if (pl.bag >= cost && !audioUpgrades[key]) {
      setPl(p => ({ ...p, bag: p.bag - cost }));
      setAudioUpgrades(prev => ({ ...prev, [key]: true }));
    }
  };

  const hireScouter = () => {
    if (pl.bag >= 50000) {
      setPl(p => ({ ...p, bag: p.bag - 50000 }));
      setTalentScouters(prev => prev + 1);
    }
  };

  const toggleHollywood = () => {
    if (pl.bag >= 250000 && !holwoodSyncActive) {
      setPl(p => ({ ...p, bag: p.bag - 250000 }));
      setHollywoodSyncActive(true);
    }
  };

  if (locked) return <LockedTierScreen section={1} />;

  return (
    <LabShell t="INDIE AUDIO SYNDICATE" c="orange" fontCls="font-hype" onHub={() => setTab('HUB')} tier={1}>
      <div className={`bg-black/40 p-4 rounded-xl border text-center mb-4 ${sampleStrike ? 'border-red-500 animate-pulse' : 'border-slate-800'}`}>
        <div className="text-[10px] text-slate-300 drop-shadow-sm font-bold uppercase">Streaming Catalog</div>
        <div className={`text-2xl font-black ${sampleStrike ? 'text-red-500' : 'text-orange-400'}`}>{audioTracks} TRACKS</div>
        <div className="text-[9px] text-slate-300 drop-shadow-sm mt-1">
          {sampleStrike ? "SAMPLE STRIKE: ROYALTIES FROZEN" : `Passive: +$${fMny(audioTracks * 400 * (holwoodSyncActive ? 2 : 1))}/mo | +${audioTracks * 2} Clout/mo`}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Scouters</div>
          <div className="text-lg font-black text-orange-400">{talentScouters}</div>
        </div>
        <div className="bg-black/40 p-3 rounded-xl border border-slate-800 text-center">
          <div className="text-[8px] text-slate-300 drop-shadow-sm font-bold uppercase">Hollywood</div>
          <div className={`text-lg font-black ${holwoodSyncActive ? 'text-green-400' : 'text-slate-500'}`}>{holwoodSyncActive ? 'ACTIVE' : 'OFF'}</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {!audioUpgrades.mixingSuite && (
          <button onClick={() => buyUpgrade('mixingSuite', 15000)} disabled={pl.bag < 15000} className="w-full py-2 bg-slate-800 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all">
            Buy AI Mixing Suite ($15k)
          </button>
        )}
        {!audioUpgrades.analogConsole && audioUpgrades.mixingSuite && (
          <button onClick={() => buyUpgrade('analogConsole', 25000)} disabled={pl.bag < 25000} className="w-full py-2 bg-slate-800 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all">
            Analog Tube Console ($25k)
          </button>
        )}
        <button onClick={hireScouter} disabled={pl.bag < 50000} className="w-full py-2 bg-slate-800 border border-orange-500/30 text-orange-400 text-[10px] font-bold uppercase rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-all">
          Hire Talent Scouter ($50k)
        </button>
        {!holwoodSyncActive && audioTracks >= 50 && (
          <button onClick={toggleHollywood} disabled={pl.bag < 250000} className="w-full py-2 bg-orange-900/40 border border-orange-400 text-white text-[10px] font-bold uppercase rounded-lg hover:bg-orange-800 disabled:opacity-50 transition-all">
            Secure Hollywood Sync Deal ($250k)
          </button>
        )}
      </div>

      {sampleStrike && (
        <div className="ui-crisis p-4 flex flex-col gap-2 mb-4">
          <h4 className="text-red-500 font-black text-center text-xs uppercase">🚨 COPYRIGHT STRIKE!</h4>
          <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic">Royalties are escrowed. Pay legal to settle.</p>
          <FlashBtn
            onClick={rAudioSettle}
            dis={pl.bag < 5000}
            label="SETTLE STRIKE ($5,000)"
            color="red-600"
            txt="white"
          />
        </div>
      )}

      <FlashBtn
        onClick={rAudioRelease}
        costStm={15}
        dis={pl.bag < 1000}
        label="RELEASE SINGLE ($1,000)"
        color="orange-600"
        txt="white"
      />
      <p className="text-[9px] text-slate-300 drop-shadow-sm text-center italic mt-2">"60% release success rate. High risk of sample clearance issues."</p>
    </LabShell>
  );
};
